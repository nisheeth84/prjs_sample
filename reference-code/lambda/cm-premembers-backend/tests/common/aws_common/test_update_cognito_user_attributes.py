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


@mock_cognitoidp
class TestUpdateCognitoUserAttributes(TestCaseBase):
    def setUp(self):
        super().setUp()

        # build environment cognito user
        global user_pool_id
        user_pool_id = cognito_idp_utils.create_user_pool()["UserPool"]["Id"]
        cognito_idp_utils.create_group(user_pool_id=user_pool_id)
        user_attributes = [{'Name': 'email', 'Value': 'test_user@example.net'}]
        cognito_idp_utils.create_user(
            user_name='test_user',
            user_pool_id=user_pool_id,
            user_attribute=user_attributes)

    def test_update_cognito_user_attributes_success(self):
        user_name = 'test_user'
        os.environ["COGNITO_USER_POOL_ID"] = user_pool_id
        user_attributes = copy.deepcopy(DataTestCognitoIdp.USER_ATTRIBUTES_UPDATE)
        response = {}
        trace_id = copy.deepcopy(DataTestCognitoIdp.TRACE_ID)

        # create mock response when called function admin_update_user_attributes
        with patch.object(boto3.client("cognito-idp"),
                          'admin_update_user_attributes') as mock_method:
            mock_method.return_value = response

            # call function test
            result = aws_common.update_cognito_user_attributes(
                trace_id, user_name, user_attributes)

        # check result
        self.assertEqual(result, {})

    def test_update_cognito_user_attributes_error_call_admin_update_user_attributes(self):
        trace_id = copy.deepcopy(DataTestCognitoIdp.TRACE_ID)
        user_name = "test_user"
        os.environ["COGNITO_USER_POOL_ID"] = user_pool_id
        user_attributes = copy.deepcopy(DataTestCognitoIdp.USER_ATTRIBUTES_UPDATE)
        error_code = mock_common_utils.get_error_code()
        error_message = mock_common_utils.get_error_message()

        # create mock throw error when called function admin_update_user_attributes
        with patch.object(boto3.client("cognito-idp"),
                          'admin_update_user_attributes') as mock_method:
            mock_method.side_effect = ClientError({
                'Error': {
                    'Code': error_code,
                    'Message': error_message
                }
            }, 'description error')

            # call function test
            with self.assertRaises(PmError) as exception:
                aws_common.update_cognito_user_attributes(
                    trace_id, user_name, user_attributes)

        # check result
        cause_error = exception.exception.cause_error.response['Error']
        self.assertEqual(cause_error['Code'], error_code)
        self.assertEqual(cause_error['Message'], error_message)

    def test_update_cognito_user_attributes_error_connect_cognito(self):
        trace_id = copy.deepcopy(DataTestCognitoIdp.TRACE_ID)
        user_name = "test_user"
        user_attributes = copy.deepcopy(DataTestCognitoIdp.USER_ATTRIBUTES_UPDATE)

        # create boto3 client error
        mock_common_utils.set_error_response("500", "ERROR")
        self.create_mock_boto3_client_error()

        # call function test
        with self.assertRaises(PmError) as exception:
            aws_common.update_cognito_user_attributes(trace_id, user_name,
                                                      user_attributes)

        # check error
        cause_error = exception.exception.cause_error.response['Error']
        self.assertEqual(cause_error['Code'],
                         mock_common_utils.get_error_code())
        self.assertEqual(cause_error['Message'],
                         mock_common_utils.get_error_message())
