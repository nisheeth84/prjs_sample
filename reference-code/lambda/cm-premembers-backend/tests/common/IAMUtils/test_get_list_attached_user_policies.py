import copy

from tests.testcasebase import TestCaseBase
from moto import mock_iam, mock_sts

from tests.mock.aws.iam import iam_utils
from premembers.exception.pm_exceptions import PmError
from premembers.common import IAMUtils
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.iam.data_test_iam import DataTestIAM
from tests.mock.data.aws.data_common import DataCommon
from botocore.exceptions import ClientError
from unittest.mock import patch

user_name = copy.deepcopy(DataTestIAM.USER_NAME)
trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(1))
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
client_connect_iam = None


@mock_sts
@mock_iam
class TestGetListAttachedUserPolicies(TestCaseBase):
    def setUp(self):
        super().setUp()

        # connect client
        global client_connect_iam
        if not client_connect_iam:
            client_connect_iam = iam_utils.client_connect()

    def test_get_list_attached_user_policies_success_response_is_truncate_false(self):
        expected_list_attached_user_policies = copy.deepcopy(
            DataTestIAM.DATA_ATTACHED_USER_POLICIES_IS_TRUNCATED_FALSE)

        # mock response API list_attached_user_policies
        with patch.object(client_connect_iam,
                          'list_attached_user_policies') as mock_method:
            mock_method.return_value = expected_list_attached_user_policies
            actual_list_attached_user_policies = IAMUtils.get_list_attached_user_policies(
                trace_id, client_connect_iam, aws_account, user_name)

        # check response
        self.assertEqual(
            expected_list_attached_user_policies['AttachedPolicies'],
            actual_list_attached_user_policies)

        # check call API list_attached_user_policies
        mock_method.assert_any_call(UserName=user_name)

    def test_get_list_attached_user_policies_success_response_is_truncate_true(self):
        expected_list_attached_user_policies = copy.deepcopy(
            DataTestIAM.LIST_ATTACHED_USER_POLICIES_DATA)

        # mock response API list_attached_user_policies
        with patch.object(client_connect_iam,
                          'list_attached_user_policies') as mock_method:
            mock_method.side_effect = iam_utils.side_effect_list_attached_user_policies
            actual_list_attached_user_policies = IAMUtils.get_list_attached_user_policies(
                trace_id, client_connect_iam, aws_account, user_name)

        # check response
        self.assertEqual(expected_list_attached_user_policies,
                         actual_list_attached_user_policies)

        # check call API list_attached_user_policies
        mock_method.assert_any_call(UserName=user_name)

    def test_get_list_attached_user_policies_error_call_list_attached_user_policies(self):
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        # mock error call API list_attached_user_policies
        with patch.object(client_connect_iam,
                          'list_attached_user_policies') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with patch.object(
                    PmLogAdapter, 'error',
                    return_value=None) as mock_method_error:
                with self.assertRaises(PmError) as exception:
                    IAMUtils.get_list_attached_user_policies(
                        trace_id, client_connect_iam, aws_account, user_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check message log error
        mock_method_error.assert_any_call(
            "[%s] IAMユーザー（%s）にアタッチされた管理ポリシー一覧情報の取得に失敗しました。", aws_account,
            user_name)
