import copy

from tests.testcasebase import TestCaseBase
from moto import mock_iam, mock_sts

from tests.mock.aws.iam import iam_utils
from tests.mock.aws.sts import sts_utils
from premembers.exception.pm_exceptions import PmError
from premembers.common import IAMUtils
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.iam.data_test_iam import DataTestIAM
from tests.mock.data.aws.data_common import DataCommon
from botocore.exceptions import ClientError
from unittest.mock import patch

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(1))
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
session = None
user_name = copy.deepcopy(DataTestIAM.USER_NAME)


@mock_sts
@mock_iam
class TestGetListUserPolices(TestCaseBase):
    def setUp(self):
        super().setUp()

        # create session
        global session
        if not session:
            session = sts_utils.create_session()

    def test_get_list_user_policies_success_response_is_truncate_false(self):
        # connect client
        client_connect_iam = iam_utils.client_connect()

        expected_list_user_policies = copy.deepcopy(
            DataTestIAM.DATA_LIST_USER_POLICY_IS_TRUNCATED_FALSE)

        # mock client
        with patch.object(session, 'client') as mock_method_client:
            mock_method_client.return_value = client_connect_iam
            # mock response API list_user_policies
            with patch.object(client_connect_iam,
                              'list_user_policies') as mock_method:
                mock_method.return_value = expected_list_user_policies
                actual_list_user_policies = IAMUtils.get_list_user_policies(
                    trace_id, session, aws_account, user_name)

        # check response
        self.assertEqual(expected_list_user_policies['PolicyNames'],
                         actual_list_user_policies)

        # check connect client
        mock_method_client.assert_any_call(service_name="iam")

        # check call API list_user_policies
        mock_method.assert_any_call(UserName=user_name)

    def test_get_list_user_policies_success_response_is_truncate_true(self):
        # connect client
        client_connect_iam = iam_utils.client_connect()

        expected_list_user_policies = copy.deepcopy(
            DataTestIAM.LIST_USER_POLICY_DATA)

        # mock client
        with patch.object(session, 'client') as mock_method_client:
            mock_method_client.return_value = client_connect_iam
            # mock response API list_user_policies
            with patch.object(client_connect_iam,
                              'list_user_policies') as mock_method:
                mock_method.side_effect = iam_utils.side_effect_list_user_policies
                actual_list_user_policies = IAMUtils.get_list_user_policies(
                    trace_id, session, aws_account, user_name)

        # check response
        self.assertEqual(expected_list_user_policies,
                         actual_list_user_policies)

        # check connect client
        mock_method_client.assert_any_call(service_name="iam")

        # check call API list_user_policies
        mock_method.assert_any_call(UserName=user_name)

    def test_get_list_user_policies_error_connect_iam(self):
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        # mock error client
        with patch.object(session, 'client') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with patch.object(
                    PmLogAdapter, 'error',
                    return_value=None) as mock_method_error:
                with self.assertRaises(PmError) as exception:
                    IAMUtils.get_list_user_policies(trace_id, session,
                                                    aws_account, user_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check message log error
        mock_method_error.assert_any_call("[%s] IAMクライアント作成に失敗しました。",
                                          aws_account)

    def test_get_list_user_policies_error_call_list_users_policies(self):
        # connect client
        client_connect_iam = iam_utils.client_connect()

        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        # mock client
        with patch.object(session, 'client') as mock_client:
            mock_client.return_value = client_connect_iam
            # mock error call API list_user_policies
            with patch.object(client_connect_iam,
                              'list_user_policies') as mock_method:
                mock_method.side_effect = ClientError(
                    error_response=expected_error_response,
                    operation_name=expected_operation_name)
                with patch.object(
                        PmLogAdapter, 'error',
                        return_value=None) as mock_method_error:
                    with self.assertRaises(PmError) as exception:
                        IAMUtils.get_list_user_policies(
                            trace_id, session, aws_account, user_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check message log error
        mock_method_error.assert_any_call(
            "[%s] IAMユーザー（%s）に付与されたインラインポリシー一覧情報の取得に失敗しました。", aws_account,
            user_name)
