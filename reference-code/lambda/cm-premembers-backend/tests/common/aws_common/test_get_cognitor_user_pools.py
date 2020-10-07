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
filter = copy.deepcopy(DataTestCognitoIdp.FILTER)
trace_id = copy.deepcopy(DataTestCognitoIdp.TRACE_ID)


@mock_cognitoidp
class TestGetCognitorUserPool(TestCaseBase):
    def setUp(self):
        super().setUp()

        # build environment cognito user
        global user_pool_id
        user_pool_id = cognito_idp_utils.create_user_pool()["UserPool"]["Id"]
        cognito_idp_utils.create_group(user_pool_id=user_pool_id)

    def test_get_cognitor_user_pool_success_full_param(self):
        attributesToGet = "email"
        attributes_filter = "cognito:user_status"
        os.environ["COGNITO_USER_POOL_ID"] = user_pool_id
        cognito_client = cognito_idp_utils.client_connect()
        with patch.object(cognito_client, 'list_users',
                          return_value=None) as mock_method:
            # call function test
            list_users = aws_common.get_cognito_user_pools(
                trace_id, filter, attributesToGet, attributes_filter)
            mock_method.assert_called_once_with(
                AttributesToGet=[attributesToGet],
                UserPoolId=user_pool_id,
                Filter=attributes_filter + '= "' + filter + '\"')
        self.assertEqual([], list_users)

    def test_get_cognitor_user_pool_success_with_param_require(self):
        os.environ["COGNITO_USER_POOL_ID"] = user_pool_id
        cognito_client = cognito_idp_utils.client_connect()
        with patch.object(cognito_client, 'list_users',
                          return_value=None) as mock_method:
            # call function test
            list_users = aws_common.get_cognito_user_pools(trace_id, filter)
            mock_method.assert_called_once_with(UserPoolId=user_pool_id,
                                                Filter='email= "' + filter +
                                                '\"')
        self.assertEqual([], list_users)

    def test_get_cognitor_user_pool_success_by_exist_user(self):
        cognito_idp_utils.create_data_test_to_cognito_user(user_pool_id)
        list_user = []
        attributesToGet = "email"
        os.environ["COGNITO_USER_POOL_ID"] = user_pool_id

        # call function test
        list_users = aws_common.get_cognito_user_pools(trace_id, filter,
                                                       attributesToGet)

        # check result
        for user in list_users:
            for user_attr in user["Attributes"]:
                list_user.append(user_attr)
        self.assertEqual(DataTestCognitoIdp.data_response_success, list_user)

    def test_get_cognitor_user_pool_success_by_not_exist_user(self):
        attributesToGet = "email"
        os.environ["COGNITO_USER_POOL_ID"] = user_pool_id

        # call function test
        list_users = aws_common.get_cognito_user_pools(trace_id, filter,
                                                       attributesToGet)

        # check result
        self.assertEqual(list_users, [])

    def test_get_cognitor_user_pool_error_connect_cognito(self):
        attributesToGet = "email"

        # create boto3 client error
        mock_common_utils.set_error_response("500", "ERROR")
        self.create_mock_boto3_client_error()

        # call function test
        with self.assertRaises(PmError) as exception:
            aws_common.get_cognito_user_pools(
                trace_id, filter, attributesToGet)

        # check error
        cause_error = exception.exception.cause_error.response['Error']
        self.assertEqual(cause_error['Code'],
                         mock_common_utils.get_error_code())
        self.assertEqual(cause_error['Message'],
                         mock_common_utils.get_error_message())

    def test_get_cognitor_user_pool_error_call_list_users(self):
        attributesToGet = "email"
        error_code = mock_common_utils.get_error_code()
        error_message = mock_common_utils.get_error_message()

        # create mock throw error when called function list_users
        with patch.object(boto3.client("cognito-idp"),
                          'list_users') as mock_method:
            mock_method.side_effect = ClientError({
                'Error': {
                    'Code': error_code,
                    'Message': error_message
                }
            }, 'description error')

            # call function test
            with self.assertRaises(PmError) as exception:
                aws_common.get_cognito_user_pools(trace_id, filter,
                                                  attributesToGet)

        # check result
        cause_error = exception.exception.cause_error.response['Error']
        self.assertEqual(cause_error['Code'], error_code)
        self.assertEqual(cause_error['Message'], error_message)
