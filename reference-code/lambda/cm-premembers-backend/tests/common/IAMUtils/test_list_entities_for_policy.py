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
client_connect_iam = None
policy_arn = copy.deepcopy(DataTestIAM.POLICY_ARN)


@mock_sts
@mock_iam
class TestListEntitiesForPolicy(TestCaseBase):
    def setUp(self):
        super().setUp()

        # create session
        global session
        if not session:
            session = sts_utils.create_session()

        # connect client iam
        global client_connect_iam
        if not client_connect_iam:
            client_connect_iam = iam_utils.client_connect()

    def test_list_entities_for_policy_success_response_is_empty(self):
        expected_list_entities_for_policy = []

        # mock client
        with patch.object(session, 'client') as mock_method_client:
            mock_method_client.return_value = client_connect_iam
            # mock API list_entities_for_policy
            with patch.object(client_connect_iam,
                              'list_entities_for_policy') as mock_method:
                mock_method.return_value = {}
                actual_list_entities_for_policy = IAMUtils.list_entities_for_policy(
                    trace_id, session, aws_account, policy_arn)

        # check response
        self.assertEqual(expected_list_entities_for_policy,
                         actual_list_entities_for_policy)

        # check connect client
        mock_method_client.assert_any_call(service_name="iam")

    def test_list_entities_for_policy_success_response_is_truncated_false(self):
        expected_list_entities_for_policy = copy.deepcopy(
            DataTestIAM.DATA_LIST_ENTITIES_FOR_POLICY_IS_TRUNCATED_FALSE)

        # mock client
        with patch.object(session, 'client') as mock_method_client:
            mock_method_client.return_value = client_connect_iam

            # mock response API list_entities_for_policy
            with patch.object(client_connect_iam,
                              'list_entities_for_policy') as mock_method:
                mock_method.return_value = expected_list_entities_for_policy
                actual_list_entities_for_policy = IAMUtils.list_entities_for_policy(
                    trace_id, session, aws_account, policy_arn)

        # check response
        self.assertEqual(expected_list_entities_for_policy['PolicyGroups'],
                         actual_list_entities_for_policy['PolicyGroups'])
        self.assertEqual(expected_list_entities_for_policy['PolicyUsers'],
                         actual_list_entities_for_policy['PolicyUsers'])
        self.assertEqual(expected_list_entities_for_policy['PolicyRoles'],
                         actual_list_entities_for_policy['PolicyRoles'])

        # check connect client
        mock_method_client.assert_any_call(service_name="iam")

        # check call API list_entities_for_policy
        mock_method.assert_any_call(PolicyArn=policy_arn)

    def test_list_entities_for_policy_success_response_is_truncated_true(self):
        expected_list_entities_for_policy = copy.deepcopy(
            DataTestIAM.LIST_ENTITIES_FOR_POLICY_DATA)

        # mock client
        with patch.object(session, 'client') as mock_method_client:
            mock_method_client.return_value = client_connect_iam

            # mock response API list_entities_for_policy
            with patch.object(client_connect_iam,
                              'list_entities_for_policy') as mock_method:
                mock_method.side_effect = iam_utils.side_effect_list_entities_for_policy
                actual_list_entities_for_policy = IAMUtils.list_entities_for_policy(
                    trace_id, session, aws_account, policy_arn)

        # check response
        self.assertEqual(expected_list_entities_for_policy['PolicyGroups'],
                         actual_list_entities_for_policy['PolicyGroups'])
        self.assertEqual(expected_list_entities_for_policy['PolicyUsers'],
                         actual_list_entities_for_policy['PolicyUsers'])
        self.assertEqual(expected_list_entities_for_policy['PolicyRoles'],
                         actual_list_entities_for_policy['PolicyRoles'])

        # check connect client
        mock_method_client.assert_any_call(service_name="iam")

        # check call API list_entities_for_policy
        mock_method.assert_any_call(PolicyArn=policy_arn)

    def test_list_entities_for_policy_error_connect_iam(self):
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
                    IAMUtils.list_entities_for_policy(trace_id, session,
                                                      aws_account, policy_arn)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check message log error
        mock_method_error.assert_any_call("[%s] IAMクライアント作成に失敗しました。",
                                          aws_account)

    def test_list_entities_for_policy_error_call_list_entities_for_policy(self):
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        # mock client
        with patch.object(session, 'client') as mock_client:
            mock_client.return_value = client_connect_iam
            # mock error call API list_entities_for_policy
            with patch.object(client_connect_iam,
                              'list_entities_for_policy') as mock_method:
                mock_method.side_effect = ClientError(
                    error_response=expected_error_response,
                    operation_name=expected_operation_name)
                with patch.object(
                        PmLogAdapter, 'error',
                        return_value=None) as mock_method_error:
                    with self.assertRaises(PmError) as exception:
                        IAMUtils.list_entities_for_policy(
                            trace_id, session, aws_account, policy_arn)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check message log error
        mock_method_error.assert_any_call("[%s]ポリシーエンティティ情報の取得に失敗しました。（%s）",
                                          aws_account, policy_arn)
