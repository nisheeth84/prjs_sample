import copy

from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from tests.mock import mock_common_utils
from premembers.exception.pm_exceptions import PmError
from premembers.common.pm_log_adapter import PmLogAdapter
from premembers.check.logic import awschecksBatch_logic
from tests.mock.data.aws.s3.data_test_s3 import DataTestS3
from tests.mock.data.aws.aws_request import AwsRequest
from tests.mock.data.aws.cognito_idp.data_test_cognito_idp import DataTestCognitoIdp
from tests.mock.data.aws.dynamodb.data_common import DataCommon

aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
error_code = "default"
execute_user_id = "ExecuteUserID"
trace_id = execute_user_id
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
language = "ja"
region_name = "global"
check_code_item = "CHECK_CIS12_ITEM_2_03"
data_body = {"S3BucketName": "test s3 bucket name"}
context_aws = copy.deepcopy(AwsRequest)
user_info_cognito = copy.deepcopy(DataTestCognitoIdp.USER_INFO_COGNITO)


class TestSendMailErrorCheck(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_send_checkerror_email_case_error_get_organization(self):
        # patch mock
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")

        # start mock object
        mock_get_organization = patch_get_organization.start()

        # mock data
        mock_get_organization.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_organization.stop)

        # call function test
        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            with self.assertRaises(PmError):
                awschecksBatch_logic.send_checkerror_email(
                    trace_id, aws_account, check_history_id, organization_id,
                    project_id, error_code, execute_user_id, region_name,
                    check_code_item, data_body)

        # check write log error
        mock_method_error.assert_any_call(
            "組織情報の取得に失敗しました。OrganizationID={0}".format(organization_id))

    def test_send_checkerror_email_case_error_get_project(self):
        # patch mock
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_get_project = patch("premembers.repository.pm_projects.query_key")

        # start mock object
        mock_get_organization = patch_get_organization.start()
        mock_get_project = patch_get_project.start()

        # mock data
        mock_get_organization.side_effect = None
        mock_get_project.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_get_project.stop)

        # call function test
        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            with self.assertRaises(PmError):
                awschecksBatch_logic.send_checkerror_email(
                    trace_id, aws_account, check_history_id, organization_id,
                    project_id, error_code, execute_user_id, region_name,
                    check_code_item, data_body)

        # check write log error
        mock_method_error.assert_any_call(
            "プロジェクト情報の取得に失敗しました。ProjectID={0}".format(project_id))

    def test_send_checkerror_email_case_error_get_cognito_user_info_by_user_name(self):
        # patch mock
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_get_project = patch("premembers.repository.pm_projects.query_key")
        patch_get_cognito_user_info_by_user_name = patch("premembers.common.aws_common.get_cognito_user_info_by_user_name")

        # start mock object
        mock_get_organization = patch_get_organization.start()
        mock_get_project = patch_get_project.start()
        mock_get_cognito_user_info_by_user_name = patch_get_cognito_user_info_by_user_name.start()

        # mock data
        mock_get_organization.side_effect = None
        mock_get_project.side_effect = None
        mock_get_cognito_user_info_by_user_name.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_get_project.stop)
        self.addCleanup(patch_get_cognito_user_info_by_user_name.stop)

        # call function test
        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            with self.assertRaises(PmError):
                awschecksBatch_logic.send_checkerror_email(
                    trace_id, aws_account, check_history_id, organization_id,
                    project_id, error_code, execute_user_id, region_name,
                    check_code_item, data_body)

        # check write log error
        mock_method_error.assert_any_call("Cognitoから情報取得に失敗しました。")

    def test_send_checkerror_email_case_error_read_yaml_get_config_setting_mail(self):
        # patch mock
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_get_project = patch("premembers.repository.pm_projects.query_key")
        patch_get_cognito_user_info_by_user_name = patch("premembers.common.aws_common.get_cognito_user_info_by_user_name")
        patch_read_yaml_get_config_setting_mail = patch("premembers.common.FileUtils.read_yaml")

        # start mock object
        mock_get_organization = patch_get_organization.start()
        mock_get_project = patch_get_project.start()
        mock_get_cognito_user_info_by_user_name = patch_get_cognito_user_info_by_user_name.start()
        mock_read_yaml_get_config_setting_mail = patch_read_yaml_get_config_setting_mail.start()

        # mock data
        mock_get_organization.side_effect = None
        mock_get_project.side_effect = None
        mock_get_cognito_user_info_by_user_name.side_effect = None
        mock_read_yaml_get_config_setting_mail.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_get_project.stop)
        self.addCleanup(patch_get_cognito_user_info_by_user_name.stop)
        self.addCleanup(patch_read_yaml_get_config_setting_mail.stop)

        # call function test
        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            with self.assertRaises(PmError):
                awschecksBatch_logic.send_checkerror_email(
                    trace_id, aws_account, check_history_id, organization_id,
                    project_id, error_code, execute_user_id, region_name,
                    check_code_item, data_body)

        # check write log error
        mock_method_error.assert_any_call('通知メール送信設定ファイルの取得に失敗しました。:s3://premembers-dev-setting/check/notify/mail/config.yaml')
        mock_read_yaml_get_config_setting_mail.assert_any_call(trace_id, 'S3_SETTING_BUCKET', copy.deepcopy(DataTestS3.PATH_FILE_CONFIG))

    def test_send_checkerror_email_case_error_read_yaml_get_file_message_notice_error_execute_check_security(self):
        # patch mock
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_get_project = patch("premembers.repository.pm_projects.query_key")
        patch_get_cognito_user_info_by_user_name = patch("premembers.common.aws_common.get_cognito_user_info_by_user_name")

        # start mock object
        mock_get_organization = patch_get_organization.start()
        mock_get_project = patch_get_project.start()
        mock_get_cognito_user_info_by_user_name = patch_get_cognito_user_info_by_user_name.start()

        # mock data
        mock_get_organization.side_effect = None
        mock_get_project.side_effect = None
        mock_get_cognito_user_info_by_user_name.return_value = user_info_cognito
        result_mock_read_yaml = mock_common_utils.mock_read_yaml(self)

        # addCleanup stop mock object
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_get_project.stop)
        self.addCleanup(patch_get_cognito_user_info_by_user_name.stop)
        self.addCleanup(result_mock_read_yaml[1].stop)

        # call function test
        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            with self.assertRaises(PmError):
                awschecksBatch_logic.send_checkerror_email(
                    trace_id, aws_account, check_history_id, organization_id,
                    project_id, error_code, execute_user_id, region_name,
                    check_code_item, data_body)

        # check write log error
        mock_method_error.assert_any_call('エラー通知内容設定ファイルの取得に失敗しました。:s3://premembers-dev-setting/check/notify/mail/message_notice_error_execute_check_security_ja.yaml')

        # check param call function
        result_mock_read_yaml[0].assert_any_call(
            trace_id, 'S3_SETTING_BUCKET',
            copy.deepcopy(DataTestS3.PATH_FILE_MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY_JA)
        )
        result_mock_read_yaml[0].assert_any_call(
            trace_id, 'S3_SETTING_BUCKET',
            copy.deepcopy(DataTestS3.PATH_FILE_CONFIG))

    def test_send_checkerror_email_case_error_read_decode_get_template_body_mail(self):
        # patch mock
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_get_project = patch("premembers.repository.pm_projects.query_key")
        patch_get_cognito_user_info_by_user_name = patch("premembers.common.aws_common.get_cognito_user_info_by_user_name")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")

        # start mock object
        mock_get_organization = patch_get_organization.start()
        mock_get_project = patch_get_project.start()
        mock_get_cognito_user_info_by_user_name = patch_get_cognito_user_info_by_user_name.start()
        mock_read_decode = patch_read_decode.start()

        # mock data
        mock_get_organization.side_effect = None
        mock_get_project.side_effect = None
        result_mock_read_yaml = mock_common_utils.mock_read_yaml(self, True)
        mock_get_cognito_user_info_by_user_name.return_value = user_info_cognito
        mock_read_decode.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_get_project.stop)
        self.addCleanup(patch_get_cognito_user_info_by_user_name.stop)
        self.addCleanup(result_mock_read_yaml[1].stop)
        self.addCleanup(patch_read_decode.stop)

        # call function test
        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            with self.assertRaises(PmError):
                awschecksBatch_logic.send_checkerror_email(
                    trace_id, aws_account, check_history_id, organization_id,
                    project_id, error_code, execute_user_id, region_name,
                    check_code_item, data_body)

        # check write log error
        mock_method_error.assert_any_call('通知メール本文テンプレートファイルの取得に失敗しました。:s3://premembers-dev-setting/check/notify/mail/notice_error_execute_check_ja.tpl')

        # check param call function
        mock_read_decode.assert_called_once_with(trace_id, 'S3_SETTING_BUCKET', copy.deepcopy(DataTestS3.PATH_NOTICE_ERROR_EXECUTE_CHECK_JA))

    def test_send_checkerror_email_error_send_email(self):
        # patch mock
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_get_project = patch("premembers.repository.pm_projects.query_key")
        patch_get_cognito_user_info_by_user_name = patch("premembers.common.aws_common.get_cognito_user_info_by_user_name")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")
        patch_send_email = patch("premembers.common.aws_common.send_email")

        # start mock object
        mock_get_organization = patch_get_organization.start()
        mock_get_project = patch_get_project.start()
        mock_get_cognito_user_info_by_user_name = patch_get_cognito_user_info_by_user_name.start()
        mock_read_decode = patch_read_decode.start()
        mock_send_email = patch_send_email.start()

        # mock data
        mock_get_organization.side_effect = None
        mock_get_project.side_effect = None
        result_mock_read_yaml = mock_common_utils.mock_read_yaml(self, True)
        mock_get_cognito_user_info_by_user_name.return_value = user_info_cognito
        mock_read_decode.return_value = copy.deepcopy(DataTestS3.TEMPLATE_NOTICE_ERROR_EXECUTE_CHECK_JA)
        mock_send_email.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_info_by_user_name.stop)
        self.addCleanup(result_mock_read_yaml[1].stop)
        self.addCleanup(patch_read_decode.stop)
        self.addCleanup(patch_send_email.stop)

        # call function test
        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            with self.assertRaises(PmError):
                awschecksBatch_logic.send_checkerror_email(
                    trace_id, aws_account, check_history_id, organization_id,
                    project_id, error_code, execute_user_id, region_name,
                    check_code_item, data_body)

        # check write log error
        mock_method_error.assert_any_call('通知メール送信に失敗しました。')
