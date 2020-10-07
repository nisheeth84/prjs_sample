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
from premembers.const.const import CommonConst

user_pool_id = None
trace_id = copy.deepcopy(DataTestCognitoIdp.TRACE_ID)
user_name = "test_user"


@mock_cognitoidp
class TestGetCognitorUserPool(TestCaseBase):
    def setUp(self):
        super().setUp()

        # build environment cognito user
        global user_pool_id
        user_pool_id = cognito_idp_utils.create_user_pool()["UserPool"]["Id"]
        cognito_idp_utils.create_group(user_pool_id=user_pool_id)
        cognito_idp_utils.create_data_test_to_cognito_user(user_pool_id)

    def test_get_cognito_user_info_by_user_name_success_case_exists_user(self):
        os.environ["COGNITO_USER_POOL_ID"] = user_pool_id

        # call function test
        list_users = aws_common.get_cognito_user_info_by_user_name(
            trace_id, user_name)

        # check result
        user_attributes = list_users['UserAttributes']
        self.assertEqual(user_attributes,
                         copy.deepcopy(DataTestCognitoIdp.user_attributes_data))

    def test_get_cognito_user_info_by_user_name_success_case_not_exists_user(self):
        user_name = "test_user_not_found"
        os.environ["COGNITO_USER_POOL_ID"] = user_pool_id

        # call function test
        list_users = aws_common.get_cognito_user_info_by_user_name(
            trace_id, user_name)

        # check result
        self.assertEqual(list_users, None)

    def test_get_cognito_user_info_by_user_name_error_connect_cognito(self):
        # create boto3 client error
        mock_common_utils.set_error_response("500", "ERROR")
        self.create_mock_boto3_client_error()

        # call function test
        with self.assertRaises(PmError) as exception:
            aws_common.get_cognito_user_info_by_user_name(trace_id, user_name)

        # check error
        cause_error = exception.exception.cause_error.response['Error']
        self.assertEqual(cause_error['Code'],
                         mock_common_utils.get_error_code())
        self.assertEqual(cause_error['Message'],
                         mock_common_utils.get_error_message())

    def test_get_cognito_user_info_by_user_name_error_call_admin_get_user_by_user_not_found_exception(self):
        # create mock throw error when called function admin_get_user
        with patch.object(boto3.client("cognito-idp"),
                          'admin_get_user') as mock_method:
            mock_method.side_effect = ClientError({
                'Error': {
                    'Code': CommonConst.COGNITO_USER_NOT_FOUND_EXCEPTION,
                    'Message': mock_common_utils.get_error_message()
                }
            }, 'description error')

            # call function test
            response = aws_common.get_cognito_user_info_by_user_name(
                trace_id, user_name)

        # check result
        self.assertEqual(response, None)

    def test_get_cognitor_user_pool_error_call_admin_get_user(self):
        error_code = mock_common_utils.get_error_code()
        error_message = mock_common_utils.get_error_message()

        # create mock throw error when called function admin_get_user
        with patch.object(boto3.client("cognito-idp"),
                          'admin_get_user') as mock_method:
            mock_method.side_effect = ClientError({
                'Error': {
                    'Code': error_code,
                    'Message': error_message
                }
            }, 'description error')

            with self.assertRaises(PmError) as exception:
                # call function test
                aws_common.get_cognito_user_info_by_user_name(
                    trace_id, user_name)

        # check result
        cause_error = exception.exception.cause_error.response['Error']
        self.assertEqual(cause_error['Code'], error_code)
        self.assertEqual(cause_error['Message'], error_message)
