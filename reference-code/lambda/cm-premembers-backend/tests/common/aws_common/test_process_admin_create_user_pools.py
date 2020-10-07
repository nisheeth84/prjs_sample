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
from tests.mock import mock_common_utils

user_pool_id = None

trace_id = copy.deepcopy(DataTestCognitoIdp.TRACE_ID)
user_name = "user_name"
user_attributes = "user_attributes"
temporary_password = "temporary_password"
message_action = "message_action"


@mock_cognitoidp
class TestProcessAdminCreateUserPools(TestCaseBase):
    def setUp(self):
        super().setUp()

        # build environment cognito user
        global user_pool_id
        user_pool_id = cognito_idp_utils.create_user_pool()["UserPool"]["Id"]

    def test_process_admin_create_user_pools_success(self):
        user_info = copy.deepcopy(DataTestCognitoIdp.USER_INFO)

        # create mock throw error when called function list_users
        with patch.object(boto3.client("cognito-idp"),
                          'admin_create_user') as mock_method:
            mock_method.return_value = user_info

            response = aws_common.process_admin_create_user_pools(
                trace_id, user_name, user_attributes, temporary_password,
                message_action)

        mock_method.assert_called_once_with(
            UserPoolId=os.environ.get("COGNITO_USER_POOL_ID"),
            Username=user_name,
            TemporaryPassword=temporary_password,
            UserAttributes=user_attributes,
            MessageAction=message_action)
        self.assertEqual(response, user_info)

    def test_process_admin_create_user_pools_error_connect_cognito(self):
        error_code = mock_common_utils.get_error_code()
        error_message = mock_common_utils.get_error_message()
        # create boto3 client error
        mock_common_utils.set_error_response(error_code, error_message)
        self.create_mock_boto3_client_error()

        # call function test
        with self.assertRaises(PmError) as exception:
            aws_common.process_admin_create_user_pools(
                trace_id, user_name, user_attributes, temporary_password,
                message_action)

        # check error
        cause_error = exception.exception.cause_error.response['Error']
        self.assertEqual(cause_error['Code'], error_code)
        self.assertEqual(cause_error['Message'], error_message)

    def test_process_admin_create_user_pools_error_call_admin_create_user(self):
        error_code = mock_common_utils.get_error_code()
        error_message = mock_common_utils.get_error_message()

        # create mock throw error when called function list_users
        with patch.object(boto3.client("cognito-idp"),
                          'admin_create_user') as mock_method:
            mock_method.side_effect = ClientError({
                'Error': {
                    'Code': error_code,
                    'Message': error_message
                }
            }, 'description error')

            # call function test
            with self.assertRaises(PmError) as exception:
                aws_common.process_admin_create_user_pools(
                    trace_id, user_name, user_attributes, temporary_password,
                    message_action)

        # check result
        cause_error = exception.exception.cause_error.response['Error']
        self.assertEqual(cause_error['Code'], error_code)
        self.assertEqual(cause_error['Message'], error_message)
