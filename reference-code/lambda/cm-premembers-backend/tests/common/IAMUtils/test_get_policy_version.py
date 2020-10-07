import copy

from tests.testcasebase import TestCaseBase
from moto import mock_iam, mock_sts

from tests.mock.aws.iam import iam_utils
from premembers.exception.pm_exceptions import PmError
from botocore.exceptions import ClientError
from premembers.common import IAMUtils
from tests.mock.data.aws.data_common import DataCommon
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.iam.data_test_iam import DataTestIAM
from unittest.mock import patch

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(1))
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
policy_arn = copy.deepcopy(DataTestIAM.POLICY_ARN)
version_id = copy.deepcopy(DataTestIAM.VERSION_ID)
client_connect_iam = None


@mock_sts
@mock_iam
class TestGetPolicyVersion(TestCaseBase):
    def setUp(self):
        super().setUp()

        # connect client
        global client_connect_iam
        if not client_connect_iam:
            client_connect_iam = iam_utils.client_connect()

    def test_get_policy_version_success_exists_attribute_policy_version(self):
        expected_data_policies_version = copy.deepcopy(
            DataTestIAM.DATA_POLICIES_VERSION)

        # mock response API get_policy_version
        with patch.object(client_connect_iam,
                          'get_policy_version') as mock_method:
            mock_method.return_value = expected_data_policies_version
            actual_data_policies_version = IAMUtils.get_policy_version(
                trace_id, client_connect_iam, aws_account, policy_arn,
                version_id)

        # check response
        self.assertEqual(expected_data_policies_version['PolicyVersion'],
                         actual_data_policies_version)

        # check call API get_policy_version
        mock_method.assert_any_call(PolicyArn=policy_arn, VersionId=version_id)

    def test_get_policy_version_success_not_exists_attribute_policy_version(self):
        expected_data_policies_version = []

        # mock response API get_policy_version
        with patch.object(client_connect_iam,
                          'get_policy_version') as mock_method:
            mock_method.return_value = {}
            actual_data_policies_version = IAMUtils.get_policy_version(
                trace_id, client_connect_iam, aws_account, policy_arn,
                version_id)

        # check response
        self.assertEqual(expected_data_policies_version,
                         actual_data_policies_version)

        # check call API get_policy_version
        mock_method.assert_any_call(PolicyArn=policy_arn, VersionId=version_id)

    def test_get_policy_version_error_call_get_policy_version(self):
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        # mock error call API get_policy_version
        with patch.object(client_connect_iam,
                          'get_policy_version') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with patch.object(
                    PmLogAdapter, 'error',
                    return_value=None) as mock_method_error:
                with self.assertRaises(PmError) as exception:
                    IAMUtils.get_policy_version(trace_id, client_connect_iam,
                                                aws_account, policy_arn,
                                                version_id)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check message log error
        mock_method_error.assert_any_call("[%s]ポリシー情報の取得に失敗しました。（%s）",
                                          aws_account, policy_arn)
