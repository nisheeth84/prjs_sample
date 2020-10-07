import json

from http import HTTPStatus
from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from premembers.const.msg_const import MsgConst
from premembers.organizations.logic import organizations_logic
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock import mock_common_utils

user_id_authority_owner = DataCommon.USER_ID_TEST.format(str(3))
organization_id_test = DataCommon.ORGANIZATION_ID_TEST.format(str(3))


class TestCreateInvite(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_test_create_invite_case_error_validate_cognito_not_user_email_verified_is_false(
            self):
        # mock object
        patch_get_cognito_user_pools = patch(
            "premembers.common.aws_common.get_cognito_user_pools")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        list_data_user_email_verified_is_false = [{
            'userName':
            'test_user_1',
            'Attributes': [{
                'Name': 'email_verified',
                'Value': 'false'
            }]
        }, {
            'userName':
            'test_user_2',
            'Attributes': [{
                'Name': 'email_verified',
                'Value': 'false'
            }]
        }]

        # mock data
        mock_get_cognito_user_pools.return_value = list_data_user_email_verified_is_false

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)

        trace_id = user_id_authority_owner
        body_object = {
            "mailAddress": "test_inviteuser@luvina.net",
            "authority": 3
        }
        param_body = json.dumps(body_object)

        # call Function test
        response = organizations_logic.create_invite(
            trace_id, organization_id_test, param_body)

        # assert output function
        # check call function common write log error
        mock_error_validate.assert_called_once()

        # check response
        response_body = json.loads(response["body"])
        message_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(response_body["code"], message_201["code"])
        self.assertEqual(response_body["message"], message_201["message"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body["errors"]
        err_val_999 = MsgConst.ERR_VAL_999
        self.assertEqual(response_error[0]["code"], err_val_999["code"])
        self.assertEqual(response_error[0]["field"], "mail_address")
        self.assertEqual(response_error[0]["value"],
                         body_object['mailAddress'])
        self.assertEqual(response_error[0]["message"], err_val_999["message"])

    def test_test_create_invite_case_error_validate_cognito_not_exist_user(
            self):
        # mock object
        patch_get_cognito_user_pools = patch(
            "premembers.common.aws_common.get_cognito_user_pools")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        # mock data
        mock_get_cognito_user_pools.return_value = []

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)

        trace_id = user_id_authority_owner
        body_object = {
            "mailAddress": "test_inviteuser@luvina.net",
            "authority": 3
        }
        param_body = json.dumps(body_object)

        # call Function test
        response = organizations_logic.create_invite(
            trace_id, organization_id_test, param_body)

        # assert output function
        # check call function common write log error
        mock_error_validate.assert_called_once()

        # check response
        response_body = json.loads(response["body"])
        message_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(response_body["code"], message_201["code"])
        self.assertEqual(response_body["message"], message_201["message"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body["errors"]
        err_val_999 = MsgConst.ERR_VAL_999
        self.assertEqual(response_error[0]["code"], err_val_999["code"])
        self.assertEqual(response_error[0]["field"], "mail_address")
        self.assertEqual(response_error[0]["value"],
                         body_object['mailAddress'])
        self.assertEqual(response_error[0]["message"], err_val_999["message"])
