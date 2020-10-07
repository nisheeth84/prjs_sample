import copy

from tests.testcasebase import TestCaseBase
from moto import mock_iam, mock_sts

from tests.mock.aws.sts import sts_utils
from premembers.common.pm_log_adapter import PmLogAdapter
from premembers.exception.pm_exceptions import PmError
from premembers.common import IAMUtils
from tests.mock.data.aws.data_common import DataCommon
from tests.mock.data.aws.iam.data_test_iam import DataTestIAM
from premembers.common import common_utils
from premembers.const.const import CommonConst
from botocore.exceptions import ClientError
from unittest.mock import patch

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(1))
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
session = None
status_member = {"Enable": 1, "Disable": 0}
cm_members_role_name = common_utils.get_environ(
    CommonConst.CM_MEMBERS_ROLE_NAME, CommonConst.CM_MEMBERS_PORTAL)


@mock_sts
@mock_iam
class TestGetMembershipAwsAccount(TestCaseBase):
    def setUp(self):
        super().setUp()

        # create session
        global session
        if not session:
            session = sts_utils.create_session()

    def test_get_membership_aws_account_success(self):
        role_data = copy.deepcopy(DataTestIAM.DATA_ROLE)
        expected_status_member = status_member['Enable']

        # mock client
        with patch.object(session, 'client') as mock_method_client:
            # mock response function get_role
            with patch('premembers.common.IAMUtils.get_role') as mock_method:
                mock_method.return_value = role_data
                with patch.object(
                        PmLogAdapter, 'info',
                        return_value=None) as mock_method_info:
                    actual_response = IAMUtils.get_membership_aws_account(
                        trace_id, session, aws_account)

        # check response
        self.assertEqual(expected_status_member, actual_response)

        # check message log info
        mock_method_info.assert_any_call("[%s] IAMロール「%s」が存在します。", aws_account,
                                         cm_members_role_name)

        # check connect client
        mock_method_client.assert_any_call(service_name="iam")

    def test_get_membership_aws_account_error_connect_iam(self):
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        expected_status_member = status_member['Disable']

        # mock error client
        with patch.object(session, 'client') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with patch.object(
                    PmLogAdapter, 'error',
                    return_value=None) as mock_method_error:
                actual_response = IAMUtils.get_membership_aws_account(
                    trace_id, session, aws_account)

        # check response
        self.assertEqual(expected_status_member, actual_response)

        # check message log error
        mock_method_error.assert_any_call("[%s] IAMクライアント作成に失敗しました。",
                                          aws_account)

    def test_get_membership_aws_account_error_no_such_entity(self):
        cause_error = PmError
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        expected_error_response['Error']['Code'] = "NoSuchEntity"
        cause_error.response = expected_error_response
        expected_status_member = status_member['Disable']
        # mock error no such entity call function get_role
        with patch('premembers.common.IAMUtils.get_role') as mock_method:
            mock_method.side_effect = PmError(
                cause_error=cause_error, message=expected_operation_name)
            with patch.object(
                    PmLogAdapter, 'info',
                    return_value=None) as mock_method_info:
                actual_response = IAMUtils.get_membership_aws_account(
                    trace_id, session, aws_account)

        # check response
        self.assertEqual(expected_status_member, actual_response)

        # check message log info
        mock_method_info.assert_any_call("[%s] IAMロール「%s」が存在しません。",
                                         aws_account, cm_members_role_name)

    def test_get_membership_aws_account_error_call_get_role(self):
        cause_error = PmError
        cause_error.response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_status_member = status_member['Disable']
        # mock error call function get_role
        with patch('premembers.common.IAMUtils.get_role') as mock_method:
            mock_method.side_effect = PmError(
                cause_error=cause_error,
                message=copy.deepcopy(DataCommon.OPERATION_NAME))
            with patch.object(
                    PmLogAdapter, 'warning',
                    return_value=None) as mock_method_warning:
                actual_response = IAMUtils.get_membership_aws_account(
                    trace_id, session, aws_account)

        # check response
        self.assertEqual(expected_status_member, actual_response)

        # check message log warning
        mock_method_warning.assert_any_call("[%s] IAMロール「%s」の取得に失敗しました。",
                                            aws_account, cm_members_role_name)
