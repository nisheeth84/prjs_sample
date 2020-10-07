import json
import copy

from http import HTTPStatus
from jinja2 import Template
from mock import patch
from moto import mock_dynamodb2
from tests.testcasebase import TestCaseBase
from tests import event_create
from tests.mock.aws.dynamodb import db_utils
from tests.mock.aws.dynamodb import pm_emailchangeapply as mock_pm_emailchangeapply
from tests.mock.data.aws.dynamodb.data_pm_userAttribute import DataPmUserAttribute
from tests.mock.data.aws.s3.data_test_s3 import DataTestS3
from tests.mock.data.aws.data_common import DataCommon
from premembers.const.msg_const import MsgConst
from premembers.const.const import CommonConst
from premembers.user.handler import user
from premembers.exception.pm_exceptions import PmError
from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.common.pm_log_adapter import PmLogAdapter

data_insert = copy.deepcopy(DataPmUserAttribute.DATA_SIMPLE)
trace_id = copy.deepcopy(DataCommon.USER_ID_TEST).format(str(3))
notify_config_cis_result_mail = copy.deepcopy(DataTestS3.NOTIFY_CONFIG_CIS_RESULT_MAIL)
s3_setting_bucket = copy.deepcopy(DataTestS3.S3_SETTING_BUCKET)
mail_after = "test_user_after@exmaple.com"
mail_before = "test_user_before@exmaple.com"
ses_region = "us-west-2"
template_body_mail = "insightwatch をご利用のお客様\nメールアドレスの変更がリクエストされました。変更を完了するには、下記のURLにアクセスしてください。\nhttps://dev.insightwatch.io/myself/changeemail/{{ApplyID}}\n※このURLリンクの有効期限は24時間です。有効期限を過ぎた場合はお手数ですが、もう一度、メールアドレス変更をリクエストしてください。\n--\n※本メールは送信専用メールアドレスから送信されています。返信はできませんのでご了承ください。\nお問い合わせは下記フォームからお送りください。\nhttps://insightwatch.zendesk.com/hc/ja/requests/new\nClassmethod, Inc."
mock_apply_id = "mock_apply_id"
language_mail_test = "ja"
response_data_config = copy.deepcopy(DataTestS3.DATA_CONFIG)


@mock_dynamodb2
class TestApplyChangeEmailHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate data old table
        if db_utils.check_table_exist(Tables.PM_EMAIL_CHANGE_APPLY):
            db_utils.delete_table(Tables.PM_EMAIL_CHANGE_APPLY)

        # create pm_emailchangeapply table
        mock_pm_emailchangeapply.create_table()

    def test_apply_change_email_handler_success(self):
        # mock object
        patch_get_cognito_user_pools = patch('premembers.common.aws_common.get_cognito_user_pools')
        patch_method_error = patch.object(PmLogAdapter, "error")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")
        patch_read_yaml = patch("premembers.common.FileUtils.read_yaml")
        patch_send_email = patch("premembers.common.aws_common.send_email")
        patch_get_uuid4 = patch("premembers.common.common_utils.get_uuid4")
        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_method_error = patch_method_error.start()
        mock_read_yaml = patch_read_yaml.start()
        mock_read_decode = patch_read_decode.start()
        mock_send_email = patch_send_email.start()
        mock_get_uuid4 = patch_get_uuid4.start()

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_method_error.return_value = None
        mock_get_uuid4.return_value = mock_apply_id
        mock_read_yaml.return_value = response_data_config
        mock_send_email.return_value = None
        mock_read_decode.return_value = template_body_mail

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_method_error.stop)
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(patch_read_decode.stop)
        self.addCleanup(patch_send_email.stop)
        self.addCleanup(patch_get_uuid4.stop)

        # Call function test
        body = {
            "mailAddress": mail_after,
            "callerServiceName": "insightwatch",
            "mailLang": language_mail_test
        }
        event_mock = event_create.get_event_object(
            trace_id=trace_id, email=mail_before, body=json.dumps(body))
        result = user.apply_change_email_handler(event_mock, {})

        form_body_mail = Template(template_body_mail)
        body_mail = form_body_mail.render(ApplyID=mock_apply_id)
        excepted_response = {
            "afterMailAddress": mail_after,
            "applyId": mock_apply_id,
            "callerServiceName": "insightwatch",
            "beforeMailAddress": mail_before,
            "userID": trace_id
        }
        # Check data
        mock_send_email.assert_called_once_with(
            trace_id, ses_region, "sys@dev.insightwatch.io", [mail_after],
            "insightwatch(DEV) メールアドレス変更確認", body_mail)

        response_body = json.loads(result['body'])
        self.assertEqual(excepted_response['afterMailAddress'], response_body['afterMailAddress'])
        self.assertEqual(excepted_response['applyId'], response_body['applyId'])
        self.assertEqual(excepted_response['beforeMailAddress'], response_body['beforeMailAddress'])
        self.assertEqual(excepted_response['callerServiceName'], response_body['callerServiceName'])
        self.assertEqual(excepted_response['userID'], response_body['userID'])
        self.assertEqual(HTTPStatus.CREATED, result['statusCode'])

    def test_apply_change_email_handler_error_parse_json(self):
        # Call function test
        body = {
            "mailAddress": mail_after,
            "callerServiceName": "insightwatch",
            "mailLang": language_mail_test
        }
        event_mock = event_create.get_event_object(
            trace_id=trace_id, email=mail_before, body=body)

        result = user.apply_change_email_handler(event_mock, {})
        # Check data
        response_body = json.loads(result['body'])
        err_202 = MsgConst.ERR_REQUEST_202
        self.assertEqual(err_202['code'], response_body['code'])
        self.assertEqual(err_202['message'], response_body['message'])
        self.assertEqual(err_202['description'], response_body['description'])
        self.assertEqual(result['statusCode'], HTTPStatus.BAD_REQUEST.value)

    def test_apply_change_email_handler_error_key_caller_serviceName_invalid(self):
        # Call function test
        body = {
            "mailAddress": mail_after,
            "callerServiceName_invalid": "insightwatch",
            "mailLang": language_mail_test
        }
        event_mock = event_create.get_event_object(
            trace_id=trace_id,
            email=mail_before,
            body=json.dumps(body))
        result = user.apply_change_email_handler(event_mock, {})

        # Check data
        response_body = json.loads(result['body'])
        err_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(err_201['code'], response_body['code'])
        self.assertEqual(err_201['message'], response_body['message'])
        self.assertEqual(result['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

    def test_apply_change_email_handler_error_service_name_none(self):
        # Call function test
        body = {
            "mailAddress": mail_after,
            "callerServiceName": "",
            "mailLang": language_mail_test
        }
        event_mock = event_create.get_event_object(
            trace_id=trace_id,
            email=mail_before,
            body=json.dumps(body))
        result = user.apply_change_email_handler(event_mock, {})

        # Check data
        response_body = json.loads(result['body'])
        err_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(err_201['code'], response_body['code'])
        self.assertEqual(err_201['message'], response_body['message'])
        self.assertEqual(result['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

    def test_apply_change_email_handler_error_language_none(self):
        # Call function test
        body = {
            "mailAddress": mail_after,
            "callerServiceName": "insightwatch"
        }
        event_mock = event_create.get_event_object(
            trace_id=trace_id,
            email=mail_before,
            body=json.dumps(body))
        result = user.apply_change_email_handler(event_mock, {})

        # Check data
        response_body = json.loads(result['body'])
        err_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(err_201['code'], response_body['code'])
        self.assertEqual(err_201['message'], response_body['message'])
        self.assertEqual(result['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

    def test_apply_change_email_handler_error_language_not_support(self):
        # Call function test
        body = {
            "mailAddress": mail_after,
            "callerServiceName": "insightwatch",
            "mailLang": "vn"
        }
        event_mock = event_create.get_event_object(
            trace_id=trace_id,
            email=mail_before,
            body=json.dumps(body))
        result = user.apply_change_email_handler(event_mock, {})

        # Check data
        response_body = json.loads(result['body'])
        err_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(err_201['code'], response_body['code'])
        self.assertEqual(err_201['message'], response_body['message'])
        self.assertEqual(result['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

    def test_apply_change_email_handler_error_service_name_not_support(self):
        # Call function test
        body = {
            "mailAddress": mail_after,
            "callerServiceName": "opswitch_test",
            "mailLang": language_mail_test
        }
        event_mock = event_create.get_event_object(
            trace_id=trace_id,
            email=mail_before,
            body=json.dumps(body))
        result = user.apply_change_email_handler(event_mock, {})

        # Check data
        response_body = json.loads(result['body'])
        err_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(err_201['code'], response_body['code'])
        self.assertEqual(err_201['message'], response_body['message'])
        self.assertEqual(result['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

    def test_apply_change_email_handler_error_create_record(self):
        # mock object
        patch_create = patch('premembers.repository.pm_emailChangeApply.create')
        patch_get_cognito_user_pools = patch('premembers.common.aws_common.get_cognito_user_pools')
        # start mock object
        mock_create = patch_create.start()
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()

        # mock data
        mock_create.side_effect = PmError()
        mock_get_cognito_user_pools.return_value = []

        # addCleanup stop mock object
        self.addCleanup(patch_create.stop)
        self.addCleanup(patch_get_cognito_user_pools.stop)
        # Call function test
        body = {
            "mailAddress": mail_after,
            "callerServiceName": "opswitch",
            "mailLang": language_mail_test
        }
        event_mock = event_create.get_event_object(
            trace_id=trace_id,
            email=mail_before,
            body=json.dumps(body))
        result = user.apply_change_email_handler(event_mock, {})

        # Check data
        response_body = json.loads(result['body'])
        err_403 = MsgConst.ERR_DB_403
        self.assertEqual(err_403['code'], response_body['code'])
        self.assertEqual(err_403['message'], response_body['message'])
        self.assertEqual(err_403['description'], response_body['description'])
        self.assertEqual(result['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_apply_change_email_handler_error_read_file_s3(self):
        # mock object
        patch_get_cognito_user_pools = patch('premembers.common.aws_common.get_cognito_user_pools')
        patch_method_error = patch.object(PmLogAdapter, "error")
        patch_read_yaml = patch("premembers.common.FileUtils.read_yaml")
        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_method_error = patch_method_error.start()
        mock_read_yaml = patch_read_yaml.start()

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_method_error.return_value = None
        mock_read_yaml.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_method_error.stop)
        self.addCleanup(patch_read_yaml.stop)

        # Call function test
        body = {
            "mailAddress": mail_after,
            "callerServiceName": "opswitch",
            "mailLang": language_mail_test
        }
        event_mock = event_create.get_event_object(
            trace_id=trace_id, email=mail_before, body=json.dumps(body))
        result = user.apply_change_email_handler(event_mock, {})

        # Check data
        mock_method_error.assert_any_call(
            "メールアドレス変更通知メール送信設定ファイルの取得に失敗しました。:s3://%s/%s",
            common_utils.get_environ(s3_setting_bucket),
            notify_config_cis_result_mail)

        response_body = json.loads(result['body'])
        err_s3_702 = MsgConst.ERR_S3_702
        self.assertEqual(err_s3_702['code'], response_body['code'])
        self.assertEqual(err_s3_702['message'], response_body['message'])
        self.assertEqual(err_s3_702['description'], response_body['description'])
        self.assertEqual(result['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_apply_change_email_handler_error_read_file_template(self):
        # mock object
        patch_get_cognito_user_pools = patch('premembers.common.aws_common.get_cognito_user_pools')
        patch_method_error = patch.object(PmLogAdapter, "error")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")
        patch_read_yaml = patch("premembers.common.FileUtils.read_yaml")
        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_method_error = patch_method_error.start()
        mock_read_yaml = patch_read_yaml.start()
        mock_read_decode = patch_read_decode.start()

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_method_error.return_value = None
        mock_read_yaml.return_value = response_data_config
        mock_read_decode.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_method_error.stop)
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(patch_read_decode.stop)

        # Call function test
        body = {
            "mailAddress": mail_after,
            "callerServiceName": "insightwatch",
            "mailLang": language_mail_test
        }
        event_mock = event_create.get_event_object(
            trace_id=trace_id,
            email=mail_before,
            body=json.dumps(body))
        result = user.apply_change_email_handler(event_mock, {})

        # Check data
        mock_method_error.assert_any_call(
            "メールアドレス変更通知メール本文テンプレートファイルの取得に失敗しました。:s3://%s/%s",
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            "check/notify/mail/insightwatch_apply_change_mail_template_ja.tpl")

        response_body = json.loads(result['body'])
        err_s3_702 = MsgConst.ERR_S3_702
        self.assertEqual(err_s3_702['code'], response_body['code'])
        self.assertEqual(err_s3_702['message'], response_body['message'])
        self.assertEqual(err_s3_702['description'], response_body['description'])
        self.assertEqual(result['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_apply_change_email_handler_error_send_mail(self):
        # mock object
        patch_get_cognito_user_pools = patch('premembers.common.aws_common.get_cognito_user_pools')
        patch_method_error = patch.object(PmLogAdapter, "error")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")
        patch_read_yaml = patch("premembers.common.FileUtils.read_yaml")
        patch_send_email = patch("premembers.common.aws_common.send_email")
        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_method_error = patch_method_error.start()
        mock_read_yaml = patch_read_yaml.start()
        mock_read_decode = patch_read_decode.start()
        mock_send_email = patch_send_email.start()

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_method_error.return_value = None
        mock_read_yaml.return_value = response_data_config
        mock_send_email.side_effect = PmError()
        mock_read_decode.return_value = template_body_mail

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_method_error.stop)
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(patch_read_decode.stop)
        self.addCleanup(patch_send_email.stop)

        # Call function test
        body = {
            "mailAddress": mail_after,
            "callerServiceName": "insightwatch",
            "mailLang": language_mail_test
        }
        event_mock = event_create.get_event_object(
            trace_id=trace_id, email=mail_before, body=json.dumps(body))
        result = user.apply_change_email_handler(event_mock, {})

        # Check data
        mock_method_error.assert_any_call("通知メール送信に失敗しました。")

        response_body = json.loads(result['body'])
        err_ses_801 = MsgConst.ERR_SES_801
        self.assertEqual(err_ses_801['code'], response_body['code'])
        self.assertEqual(err_ses_801['message'], response_body['message'])
        self.assertEqual(err_ses_801['description'], response_body['description'])
        self.assertEqual(result['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)
