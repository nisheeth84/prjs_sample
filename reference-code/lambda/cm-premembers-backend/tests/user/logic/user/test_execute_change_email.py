import copy

from tests.testcasebase import TestCaseBase
from http import HTTPStatus
from premembers.user.logic import user_logic
from moto import mock_dynamodb2
from unittest.mock import patch
from tests.mock.aws.dynamodb import db_utils
from premembers.repository.table_list import Tables
from premembers.exception.pm_exceptions import PmError
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.aws.dynamodb import pm_emailchangeapply as mock_pm_emailChangeApply
from tests.mock.data.aws.dynamodb.data_pm_email_change_apply import DataPmEmailChangeApply
from tests.mock.data.aws.cognito_idp.data_test_cognito_idp import DataTestCognitoIdp
from tests.mock.data.aws.s3.data_test_s3 import DataTestS3
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.data_common import DataCommon as data_common_aws
from premembers.common import common_utils
from tests.mock import mock_common_utils

data_insert_caller_service_name_insightwatch = copy.deepcopy(
    DataPmEmailChangeApply.DATA_CALLER_SERVICE_NAME_INSIGHTWATCH)
data_insert_caller_service_name_opswitch = copy.deepcopy(
    DataPmEmailChangeApply.DATA_CALLER_SERVICE_NAME_OPSWITCH)
content_type_text_html = "text/html"
user_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
apply_id = copy.deepcopy(DataPmEmailChangeApply.APPLY_ID.format(str(3)))
response_error_page_caller_service_insightwatch = copy.deepcopy(
    data_common_aws.RESPONSE_ERROR_PAGE_CALLER_SERVICE_INSIGHTWATCH)
response_error_page_caller_service_opswitch = copy.deepcopy(
    data_common_aws.RESPONSE_ERROR_PAGE_CALLER_SERVICE_OPSWITCH)
user_info = copy.deepcopy(
    DataTestCognitoIdp.USER_INFOR_GET_COGNITO_USER_INFO_BY_USER_NAME)
after_mail_address = copy.deepcopy(DataPmEmailChangeApply.AFTER_MAIL_ADDRESS)
user_attributes = [
    {
        'Name': 'email',
        'Value': after_mail_address
    },
    {
        'Name': 'email_verified',
        'Value': 'true'
    }
]
data_config = copy.deepcopy(DataTestS3.DATA_CONFIG)
notify_config_cis_result_mail = copy.deepcopy(DataTestS3.NOTIFY_CONFIG_CIS_RESULT_MAIL)
s3_setting_bucket = copy.deepcopy(DataTestS3.S3_SETTING_BUCKET)


@mock_dynamodb2
class TestExecuteChangeEmail(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_EMAIL_CHANGE_APPLY):
            db_utils.delete_table(Tables.PM_EMAIL_CHANGE_APPLY)

        # create PM_EmailChangeApply table
        mock_pm_emailChangeApply.create_table()

    def test_execute_change_email_case_read_yaml_error(self):
        # patch mock
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # start mock object
        mock_read_yaml = patch_read_yaml.start()

        # mock data
        mock_read_yaml.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_read_yaml.stop)

        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            # call function test
            result = user_logic.execute_change_email(apply_id)

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(response_error_page_caller_service_insightwatch,
                         response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check param call function read_yaml
        mock_read_yaml.assert_called_once_with(
            apply_id, s3_setting_bucket, notify_config_cis_result_mail)

        mock_error_exception.assert_called_once()

        # check write log error
        mock_method_error.assert_called_once_with(
            "メールアドレス変更通知メール送信設定ファイルの取得に失敗しました。:s3://%s/%s",
            common_utils.get_environ(s3_setting_bucket),
            notify_config_cis_result_mail)

    def test_execute_change_email_case_get_cognito_user_info_by_user_name_error_caller_service_name_is_insightwatch(self):
        # perpare data test
        mock_pm_emailChangeApply.create(
            data_insert_caller_service_name_insightwatch)

        # patch mock
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')
        get_cognito_user_info_by_user_name_patch = patch(
            'premembers.common.aws_common.get_cognito_user_info_by_user_name')

        # start mock object
        mock_read_yaml = patch_read_yaml.start()
        mock_get_cognito_user_info_by_user_name = get_cognito_user_info_by_user_name_patch.start()

        # mock data
        mock_read_yaml.return_value = data_config
        mock_get_cognito_user_info_by_user_name.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(get_cognito_user_info_by_user_name_patch.stop)

        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            # call function test
            result = user_logic.execute_change_email(apply_id)

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(
            response_error_page_caller_service_insightwatch,
            response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check param call function get_cognito_user_info_by_user_name
        mock_get_cognito_user_info_by_user_name.assert_called_once_with(
            apply_id, user_id)

        # check write log error
        mock_method_error.assert_called_once_with("Cognitoから情報取得に失敗しました。")

    def test_execute_change_email_case_get_cognito_user_info_by_user_name_error_caller_service_name_is_opswitch(self):
        # perpare data test
        mock_pm_emailChangeApply.create(
            data_insert_caller_service_name_opswitch)

        # patch mock
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')
        get_cognito_user_info_by_user_name_patch = patch(
            'premembers.common.aws_common.get_cognito_user_info_by_user_name')

        # start mock object
        mock_read_yaml = patch_read_yaml.start()
        mock_get_cognito_user_info_by_user_name = get_cognito_user_info_by_user_name_patch.start()

        # mock data
        mock_read_yaml.return_value = data_config
        mock_get_cognito_user_info_by_user_name.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(get_cognito_user_info_by_user_name_patch.stop)

        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            # call function test
            result = user_logic.execute_change_email(apply_id)

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(
            response_error_page_caller_service_opswitch,
            response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check param call function get_cognito_user_info_by_user_name
        mock_get_cognito_user_info_by_user_name.assert_called_once_with(
            apply_id, user_id)

        # check write log error
        mock_method_error.assert_called_once_with("Cognitoから情報取得に失敗しました。")

    def test_execute_change_email_case_error_get_record_pm_email_change_apply(self):
        # patch mock
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')
        query_key_patch = patch(
            'premembers.repository.pm_emailChangeApply.query_key')

        # start mock object
        mock_read_yaml = patch_read_yaml.start()
        mock_query_key = query_key_patch.start()

        # mock data
        mock_read_yaml.return_value = data_config
        mock_query_key.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(query_key_patch.stop)

        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            # call function test
            result = user_logic.execute_change_email(apply_id)

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(
            response_error_page_caller_service_insightwatch,
            response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check param call function query_key
        mock_query_key.assert_called_once_with(
            apply_id, apply_id, None)

        # check write log error
        mock_method_error.assert_called_once_with(
            "メールアドレス変更申請テーブルでレコード取得に失敗しました。変更申請ID: %s", apply_id)

    def test_execute_change_email_case_record_email_change_apply_is_zero(self):
        # patch mock
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')

        # start mock object
        mock_read_yaml = patch_read_yaml.start()

        # mock data
        mock_read_yaml.return_value = data_config

        # addCleanup stop mock object
        self.addCleanup(patch_read_yaml.stop)

        with patch.object(PmLogAdapter, 'warning',
                          return_value=None) as mock_method_warning:
            # call function test
            result = user_logic.execute_change_email(apply_id)

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(
            response_error_page_caller_service_insightwatch,
            response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check write log warning
        mock_method_warning.assert_called_once_with(
            "メールアドレス変更申請テーブルでレコードが存在しませんでした。変更申請ID: %s", apply_id)

    def test_execute_change_email_case_get_cognito_user_info_by_user_name_is_none_caller_service_name_is_insightwatch(self):
        # perpare data test
        mock_pm_emailChangeApply.create(
            data_insert_caller_service_name_insightwatch)

        # patch mock
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')
        get_cognito_user_info_by_user_name_patch = patch(
            'premembers.common.aws_common.get_cognito_user_info_by_user_name')

        # start mock object
        mock_read_yaml = patch_read_yaml.start()
        mock_get_cognito_user_info_by_user_name = get_cognito_user_info_by_user_name_patch.start()

        # mock data
        mock_read_yaml.return_value = data_config
        mock_get_cognito_user_info_by_user_name.return_value = None

        # addCleanup stop mock object
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(get_cognito_user_info_by_user_name_patch.stop)

        with patch.object(PmLogAdapter, 'warning',
                          return_value=None) as mock_method_warning:
            # call function test
            result = user_logic.execute_change_email(apply_id)

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(
            response_error_page_caller_service_insightwatch,
            response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check param call function get_cognito_user_info_by_user_name
        mock_get_cognito_user_info_by_user_name.assert_called_once_with(
            apply_id, user_id)

        # check write log warning
        mock_method_warning.assert_called_once_with(
            "Cognitoにユーザーが存在しませんでした。ユーザーID： %s", user_id)

    def test_execute_change_email_case_get_cognito_user_info_by_user_name_is_none_caller_service_name_is_opswitch(self):
        # perpare data test
        mock_pm_emailChangeApply.create(
            data_insert_caller_service_name_opswitch)

        # patch mock
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')
        get_cognito_user_info_by_user_name_patch = patch(
            'premembers.common.aws_common.get_cognito_user_info_by_user_name')

        # start mock object
        mock_read_yaml = patch_read_yaml.start()
        mock_get_cognito_user_info_by_user_name = get_cognito_user_info_by_user_name_patch.start()

        # mock data
        mock_read_yaml.return_value = data_config
        mock_get_cognito_user_info_by_user_name.return_value = None

        # addCleanup stop mock object
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(get_cognito_user_info_by_user_name_patch.stop)

        with patch.object(PmLogAdapter, 'warning',
                          return_value=None) as mock_method_warning:
            # call function test
            result = user_logic.execute_change_email(apply_id)

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(
            response_error_page_caller_service_opswitch,
            response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check param call function get_cognito_user_info_by_user_name
        mock_get_cognito_user_info_by_user_name.assert_called_once_with(
            apply_id, user_id)

        # check write log warning
        mock_method_warning.assert_called_once_with(
            "Cognitoにユーザーが存在しませんでした。ユーザーID： %s", user_id)

    def test_execute_change_email_case_before_mail_address_other_cognito_mail_caller_service_name_is_insightwatch(self):
        # perpare data test
        mock_pm_emailChangeApply.create(
            data_insert_caller_service_name_insightwatch)

        # patch mock
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')
        get_cognito_user_info_by_user_name_patch = patch(
            'premembers.common.aws_common.get_cognito_user_info_by_user_name')
        search_patch = patch('jmespath.search')

        # start mock object
        mock_read_yaml = patch_read_yaml.start()
        mock_get_cognito_user_info_by_user_name = get_cognito_user_info_by_user_name_patch.start()
        mock_search = search_patch.start()

        # mock data
        mock_read_yaml.return_value = data_config
        mock_get_cognito_user_info_by_user_name.return_value = user_info
        mock_search.return_value = "luvina_test_other@luvina.net"

        # addCleanup stop mock object
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(get_cognito_user_info_by_user_name_patch.stop)
        self.addCleanup(search_patch.stop)

        with patch.object(PmLogAdapter, 'warning',
                          return_value=None) as mock_method_warning:
            # call function test
            result = user_logic.execute_change_email(apply_id)

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(
            response_error_page_caller_service_insightwatch,
            response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check param call function get_cognito_user_info_by_user_name
        mock_get_cognito_user_info_by_user_name.assert_called_once_with(
            apply_id, user_id)

        # check param call function search
        mock_search.assert_called_once_with("[?Name=='email'].Value | [0]",
                                            user_info['UserAttributes'])

        # check write log warning
        mock_method_warning.assert_called_once_with(
            "変更前メールアドレスがCognitoのメールアドレスと合致しませんでした。")

    def test_execute_change_email_case_before_mail_address_other_cognito_mail_caller_service_name_is_opswitch(self):
        # perpare data test
        mock_pm_emailChangeApply.create(
            data_insert_caller_service_name_opswitch)

        # patch mock
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')
        get_cognito_user_info_by_user_name_patch = patch(
            'premembers.common.aws_common.get_cognito_user_info_by_user_name')
        search_patch = patch('jmespath.search')

        # start mock object
        mock_read_yaml = patch_read_yaml.start()
        mock_get_cognito_user_info_by_user_name = get_cognito_user_info_by_user_name_patch.start()
        mock_search = search_patch.start()

        # mock data
        mock_read_yaml.return_value = data_config
        mock_get_cognito_user_info_by_user_name.return_value = user_info
        mock_search.return_value = "luvina_test_other@luvina.net"

        # addCleanup stop mock object
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(get_cognito_user_info_by_user_name_patch.stop)
        self.addCleanup(search_patch.stop)

        with patch.object(PmLogAdapter, 'warning',
                          return_value=None) as mock_method_warning:
            # call function test
            result = user_logic.execute_change_email(apply_id)

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(
            response_error_page_caller_service_opswitch,
            response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check param call function get_cognito_user_info_by_user_name
        mock_get_cognito_user_info_by_user_name.assert_called_once_with(
            apply_id, user_id)

        # check param call function search
        mock_search.assert_called_once_with("[?Name=='email'].Value | [0]",
                                            user_info['UserAttributes'])

        # check write log warning
        mock_method_warning.assert_called_once_with(
            "変更前メールアドレスがCognitoのメールアドレスと合致しませんでした。")

    def test_execute_change_email_case_update_cognito_user_attributes_error_caller_service_name_is_insightwatch(self):
        # perpare data test
        mock_pm_emailChangeApply.create(
            data_insert_caller_service_name_insightwatch)

        # patch mock
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')
        get_cognito_user_info_by_user_name_patch = patch(
            'premembers.common.aws_common.get_cognito_user_info_by_user_name')
        update_cognito_user_attributes_patch = patch(
            'premembers.common.aws_common.update_cognito_user_attributes')

        # start mock object
        mock_read_yaml = patch_read_yaml.start()
        mock_get_cognito_user_info_by_user_name = get_cognito_user_info_by_user_name_patch.start()
        mock_update_cognito_user_attributes = update_cognito_user_attributes_patch.start()

        # mock data
        mock_read_yaml.return_value = data_config
        mock_get_cognito_user_info_by_user_name.return_value = user_info
        mock_update_cognito_user_attributes.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(get_cognito_user_info_by_user_name_patch.stop)
        self.addCleanup(update_cognito_user_attributes_patch.stop)

        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            # call function test
            result = user_logic.execute_change_email(apply_id)

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(
            response_error_page_caller_service_insightwatch,
            response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check param call function get_cognito_user_info_by_user_name
        mock_get_cognito_user_info_by_user_name.assert_called_once_with(
            apply_id, user_id)

        # check param call function update_cognito_user_attributes
        mock_update_cognito_user_attributes.assert_called_once_with(
            apply_id, user_id, user_attributes)

        # check write log error
        mock_method_error.assert_called_once_with("Cognitoの項目変更に失敗しました。")

    def test_execute_change_email_case_update_cognito_user_attributes_error_caller_service_name_is_opswitch(self):
        # perpare data test
        mock_pm_emailChangeApply.create(
            data_insert_caller_service_name_opswitch)

        # patch mock
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')
        get_cognito_user_info_by_user_name_patch = patch(
            'premembers.common.aws_common.get_cognito_user_info_by_user_name')
        update_cognito_user_attributes_patch = patch(
            'premembers.common.aws_common.update_cognito_user_attributes')

        # start mock object
        mock_read_yaml = patch_read_yaml.start()
        mock_get_cognito_user_info_by_user_name = get_cognito_user_info_by_user_name_patch.start()
        mock_update_cognito_user_attributes = update_cognito_user_attributes_patch.start()

        # mock data
        mock_read_yaml.return_value = data_config
        mock_get_cognito_user_info_by_user_name.return_value = user_info
        mock_update_cognito_user_attributes.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(get_cognito_user_info_by_user_name_patch.stop)
        self.addCleanup(update_cognito_user_attributes_patch.stop)

        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            # call function test
            result = user_logic.execute_change_email(apply_id)

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(
            response_error_page_caller_service_opswitch,
            response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check param call function get_cognito_user_info_by_user_name
        mock_get_cognito_user_info_by_user_name.assert_called_once_with(
            apply_id, user_id)

        # check param call function update_cognito_user_attributes
        mock_update_cognito_user_attributes.assert_called_once_with(
            apply_id, user_id, user_attributes)

        # check write log error
        mock_method_error.assert_called_once_with("Cognitoの項目変更に失敗しました。")
