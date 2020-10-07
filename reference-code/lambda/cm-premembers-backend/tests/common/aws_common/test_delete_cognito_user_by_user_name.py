import os
import boto3
import copy

from moto import mock_cognitoidp
from tests.testcasebase import TestCaseBase
from tests.mock.aws.cognito_idp import cognito_idp_utils
from premembers.exception.pm_exceptions import PmError
from unittest.mock import patch
from botocore.exceptions import ClientError
from premembers.common import aws_common
from tests.mock.data.aws.cognito_idp.data_test_cognito_idp import DataTestCognitoIdp
from tests.mock.data.aws.data_common import DataCommon
from tests.mock import mock_common_utils

user_pool_id = None
trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(1))
user_name = copy.deepcopy(DataTestCognitoIdp.USER_NAME)


@mock_cognitoidp
class TestDeleteCognitoUserByUserName(TestCaseBase):
    def setUp(self):
        super().setUp()

        # build environment cognito user
        global user_pool_id
        user_pool_id = cognito_idp_utils.create_user_pool()["UserPool"]["Id"]

    def test_delete_cognito_user_by_user_name_susscess(self):
        os.environ["COGNITO_USER_POOL_ID"] = user_pool_id

        # call function test
        with patch.object(boto3.client("cognito-idp"),
                          'admin_delete_user') as mock_method:
            aws_common.delete_cognito_user_by_user_name(trace_id, user_name)

        # check call API admin_delete_user
        mock_method.assert_called_once_with(UserPoolId=user_pool_id,
                                            Username=user_name)

    def test_delete_cognito_user_by_user_name_error_connect_cognito(self):
        # create boto3 client error
        mock_common_utils.set_error_response("500", "ERROR")
        self.create_mock_boto3_client_error()

        # call function test
        with self.assertRaises(PmError) as exception:
            aws_common.delete_cognito_user_by_user_name(trace_id, user_name)

        # check error
        cause_error = exception.exception.cause_error.response['Error']
        self.assertEqual(cause_error['Code'],
                         mock_common_utils.get_error_code())
        self.assertEqual(cause_error['Message'],
                         mock_common_utils.get_error_message())

    def test_delete_cognito_user_by_user_name_error_call_admin_delete_user(
            self):
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        # create mock throw error when called function admin_delete_user
        with patch.object(boto3.client("cognito-idp"),
                          'admin_delete_user') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)

            # call function test
            with self.assertRaises(PmError) as exception:
                aws_common.delete_cognito_user_by_user_name(
                    trace_id, user_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)
