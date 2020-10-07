import copy

from tests.testcasebase import TestCaseBase
from moto import mock_iam, mock_sts

from tests.mock.aws.iam import iam_utils
from premembers.exception.pm_exceptions import PmError
from premembers.common import IAMUtils
from tests.mock.data.aws.iam.data_test_iam import DataTestIAM
from tests.mock.data.aws.data_common import DataCommon
from botocore.exceptions import ClientError
from unittest.mock import patch

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(1))
role_name = copy.deepcopy(DataTestIAM.ROLE_NAME)
client_connect_iam = None


@mock_sts
@mock_iam
class TestGetRole(TestCaseBase):
    def setUp(self):
        super().setUp()

        # connect client
        global client_connect_iam
        if not client_connect_iam:
            client_connect_iam = iam_utils.client_connect()

    def test_get_role_success(self):
        expected_role_data = copy.deepcopy(DataTestIAM.DATA_ROLE)

        # mock response API get_role
        with patch.object(client_connect_iam, 'get_role') as mock_method:
            mock_method.return_value = expected_role_data
            actual_role_data = IAMUtils.get_role(trace_id, client_connect_iam,
                                                 role_name)

        # check response
        self.assertEqual(expected_role_data, actual_role_data)

        # check call API get_role
        mock_method.assert_any_call(RoleName=role_name)

    def test_get_role_error_call_get_role(self):
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        # mock error call API get_role
        with patch.object(client_connect_iam, 'get_role') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with self.assertRaises(PmError) as exception:
                IAMUtils.get_role(trace_id, client_connect_iam, role_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)
