import json
import copy

from http import HTTPStatus
from unittest.mock import patch
from moto import mock_dynamodb2
from premembers.common import common_utils
from tests.testcasebase import TestCaseBase
from premembers.const.const import CommonConst
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from premembers.organizations.logic import organizations_logic
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_userAttribute import DataPmUserAttribute
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock import mock_common_utils

user_id_authority_owner = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
regist_user_pool_body = {
    "callerServiceName": "insightwatch",
    "mailLang": "ja",
    "mailAddress": "test_inviteuser@luvina.net",
    "authority": 3
}
user_invite = "user_invite"


def mock_side_effect_get_affiliation(user_id,
                                     organization_id,
                                     convert_response=None):
    if user_id == user_invite:
        return []
    else:
        raise PmError()


@mock_dynamodb2
class TestExecuteForceInvites(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_execute_force_invites_case_parse_json_error(self):
        trace_id = user_id_authority_owner
        body_object = '{"json_invalid"}'

        # mock function error_exception
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # check response
        message_202 = MsgConst.ERR_REQUEST_202
        response_body = json.loads(response["body"])
        self.assertEqual(response_body["code"], message_202["code"])
        self.assertEqual(response_body["message"], message_202["message"])
        self.assertEqual(response_body["description"],
                         message_202["description"])
        self.assertEqual(response["statusCode"], HTTPStatus.BAD_REQUEST.value)

    def test_execute_force_invites_case_error_validate_not_param_maillang_in_body(self):
        trace_id = user_id_authority_owner
        body_object = {
            "callerServiceName": "opswitch",
            "mailAddress": "test_inviteuser@luvina.net",
            "authority": 3
        }
        body_object = json.dumps(body_object)

        # mock function error_validate
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

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
        err_val_101 = MsgConst.ERR_VAL_101
        self.assertEqual(response_error[0]["code"], err_val_101["code"])
        self.assertEqual(response_error[0]["field"], "mailLang")
        self.assertEqual(response_error[0]["value"], None)
        self.assertEqual(response_error[0]["message"], err_val_101["message"])

    def test_execute_force_invites_case_error_validate_value_param_maillang_invalid(self):
        trace_id = user_id_authority_owner
        body_object = {
            "callerServiceName": "opswitch",
            "mailAddress": "test_inviteuser@luvina.net",
            "mailLang": "value_invald",
            "authority": 3
        }
        body_object = json.dumps(body_object)

        # mock function error_validate
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

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
        err_val_302 = MsgConst.ERR_VAL_302
        self.assertEqual(response_error[0]["code"], err_val_302["code"])
        self.assertEqual(response_error[0]["field"], "mailLang")
        self.assertEqual(response_error[0]["value"], "value_invald")
        self.assertEqual(response_error[0]["message"],
                         err_val_302["message"].format("ja, en"))

    def test_execute_force_invites_case_error_validate_not_param_callerservicename_in_body(self):
        trace_id = user_id_authority_owner
        body_object = {
            "mailAddress": "test_inviteuser@luvina.net",
            "authority": 3,
            "mailLang": "ja"
        }
        body_object = json.dumps(body_object)

        # mock function error_validate
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

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
        err_val_101 = MsgConst.ERR_VAL_101
        self.assertEqual(response_error[0]["code"], err_val_101["code"])
        self.assertEqual(response_error[0]["field"], "callerServiceName")
        self.assertEqual(response_error[0]["value"], None)
        self.assertEqual(response_error[0]["message"], err_val_101["message"])

    def test_execute_force_invites_case_error_validate_value_param_callerServiceName_invalid(self):
        trace_id = user_id_authority_owner
        body_object = {
            "callerServiceName": "value_invald",
            "mailAddress": "test_inviteuser@luvina.net",
            "mailLang": "ja",
            "authority": 3
        }
        body_object = json.dumps(body_object)

        # mock function error_validate
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

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
        err_val_302 = MsgConst.ERR_VAL_302
        self.assertEqual(response_error[0]["code"], err_val_302["code"])
        self.assertEqual(response_error[0]["field"], "callerServiceName")
        self.assertEqual(response_error[0]["value"], "value_invald")
        self.assertEqual(
            response_error[0]["message"],
            err_val_302["message"].format("insightwatch, opswitch"))

    def test_execute_force_invites_case_error_validate_not_param_mailaddress_in_body(self):
        trace_id = user_id_authority_owner
        body_object = {
            "callerServiceName": "opswitch",
            "mailLang": "ja",
            "authority": 3
        }
        body_object = json.dumps(body_object)

        # mock function error_validate
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

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
        err_val_101 = MsgConst.ERR_VAL_101
        self.assertEqual(response_error[0]["code"], err_val_101["code"])
        self.assertEqual(response_error[0]["field"], "mailAddress")
        self.assertEqual(response_error[0]["value"], None)
        self.assertEqual(response_error[0]["message"], err_val_101["message"])

    def test_execute_force_invites_case_error_validate_not_param_authority_in_body(self):
        trace_id = user_id_authority_owner
        body_object = {
            "callerServiceName": "opswitch",
            "mailLang": "ja",
            "mailAddress": "test_inviteuser@luvina.net"
        }
        body_object = json.dumps(body_object)

        # mock function error_validate
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

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
        err_val_101 = MsgConst.ERR_VAL_101
        self.assertEqual(response_error[0]["code"], err_val_101["code"])
        self.assertEqual(response_error[0]["field"], "authority")
        self.assertEqual(response_error[0]["value"], None)
        self.assertEqual(response_error[0]["message"], err_val_101["message"])

    def test_execute_force_invites_case_error_validate_value_param_authority_invalid(self):
        trace_id = user_id_authority_owner
        body_object = {
            "callerServiceName": "insightwatch",
            "mailAddress": "test_inviteuser@luvina.net",
            "mailLang": "ja",
            "authority": 4
        }
        body_object = json.dumps(body_object)

        # mock function error_validate
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

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
        err_val_302 = MsgConst.ERR_VAL_302
        self.assertEqual(response_error[0]["code"], err_val_302["code"])
        self.assertEqual(response_error[0]["field"], "authority")
        self.assertEqual(response_error[0]["value"], 4)
        self.assertEqual(
            response_error[0]["message"],
            err_val_302["message"].format("3, 2, 1"))

    def test_execute_force_invites_case_exist_mailAddress_in_cognito(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()

        # mock data
        mock_error_common = mock_common_utils.mock_error_common(self)
        mock_get_cognito_user_pools.return_value = {
            "Path": "string",
            "UserName": "string",
            "UserId": "string",
            "Arn": "string",
            "CreateDate": "CreateDate",
            "PasswordLastUsed": "PasswordLastUsed",
            "PermissionsBoundary": {
                "PermissionsBoundaryType": "PermissionsBoundaryPolicy",
                "PermissionsBoundaryArn": "string"
            },
            "Tags": [
                {
                    "Key": "string",
                    "Value": "string"
                },
            ]
        }

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # check response
        response_body = json.loads(response["body"])
        err_302 = MsgConst.ERR_302
        self.assertEqual(response_body["code"], err_302["code"])
        self.assertEqual(response_body["message"], err_302["message"])
        self.assertEqual(response_body["description"], err_302["description"])
        self.assertEqual(response["statusCode"], HTTPStatus.CONFLICT.value)

    def test_execute_force_invites_case_error_get_cognito_user_pools(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_get_cognito_user_pools.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # check response
        response_body = json.loads(response["body"])
        err_501 = MsgConst.ERR_COGNITO_501
        self.assertEqual(response_body["code"], err_501["code"])
        self.assertEqual(response_body["message"], err_501["message"])
        self.assertEqual(response_body["description"], err_501["description"])
        self.assertEqual(response["statusCode"], HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_execute_force_invites_case_error_process_admin_create_user_pools(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.side_effect = PmError({
            "Error": {
                "Code": "error",
                "Message": "Message error"
            }
        }, "description error")

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        response_body = json.loads(response["body"])
        err_501 = MsgConst.ERR_COGNITO_501
        self.assertEqual(response_body["code"], err_501["code"])
        self.assertEqual(response_body["message"], err_501["message"])
        self.assertEqual(response_body["description"], err_501["description"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_execute_force_invites_case_error_update_cognito_user_attributes(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = PmError({
            "Error": {
                "Code": "error",
                "Message": "Message error"
            }
        }, "description error")

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        response_body = json.loads(response["body"])
        err_501 = MsgConst.ERR_COGNITO_501
        self.assertEqual(response_body["code"], err_501["code"])
        self.assertEqual(response_body["message"], err_501["message"])
        self.assertEqual(response_body["description"], err_501["description"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_execute_force_invites_case_exist_record_affiliation_and_invitationstatus_other_negative_1(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.get_affiliation")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = None
        mock_get_affiliation.return_value = {
            "Authority": 3,
            "CreatedAt": "2019-03-04 09:40:01.310",
            "InvitationStatus": 1,
            "MailAddress": "test_inviteuser@luvina.net",
            "OrganizationID": "11cb86d2-fe67-4923-bcc0-5cc6bf0fa76e",
            "UpdatedAt": "2019-03-04 09:40:01.310",
            "UserID": "220fb1c9-1a8b-4e02-bfb2-6993b3b2994f"
        }

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)
        self.addCleanup(patch_get_affiliation.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # assert output function
        response_body = json.loads(response["body"])
        err_302 = MsgConst.ERR_302
        self.assertEqual(response_body["code"], err_302["code"])
        self.assertEqual(response_body["message"], err_302["message"])
        self.assertEqual(response_body["description"], err_302["description"])
        self.assertEqual(response["statusCode"], HTTPStatus.CONFLICT.value)

    def test_execute_force_invites_case_error_get_record_affiliation(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.get_affiliation")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = None
        mock_get_affiliation.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)
        self.addCleanup(patch_get_affiliation.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        response_body = json.loads(response["body"])
        err_402 = MsgConst.ERR_402
        self.assertEqual(response_body["code"], err_402["code"])
        self.assertEqual(response_body["message"], err_402["message"])
        self.assertEqual(response_body["description"], err_402["description"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_execute_force_invites_case_get_record_organizations_is_zero(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.get_affiliation")
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_get_organization = patch_get_organization.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = None
        mock_get_affiliation.return_value = []
        mock_get_organization.return_value = []

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)
        self.addCleanup(patch_get_affiliation.stop)
        self.addCleanup(patch_get_organization.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # assert output function
        response_body = json.loads(response["body"])
        err_301 = MsgConst.ERR_301
        self.assertEqual(response_body["code"], err_301["code"])
        self.assertEqual(response_body["message"], err_301["message"])
        self.assertEqual(response_body["description"], err_301["description"])
        self.assertEqual(response["statusCode"], HTTPStatus.NOT_FOUND.value)

    def test_execute_force_invites_case_error_get_record_organizations(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.get_affiliation")
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_get_organization = patch_get_organization.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = None
        mock_get_affiliation.return_value = []
        mock_get_organization.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)
        self.addCleanup(patch_get_affiliation.stop)
        self.addCleanup(patch_get_organization.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        response_body = json.loads(response["body"])
        err_402 = MsgConst.ERR_402
        self.assertEqual(response_body["code"], err_402["code"])
        self.assertEqual(response_body["message"], err_402["message"])
        self.assertEqual(response_body["description"], err_402["description"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_execute_force_invites_case_error_create_record_affiliation(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.get_affiliation")
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_create_affiliation = patch("premembers.repository.pm_affiliation.create_affiliation")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_get_organization = patch_get_organization.start()
        mock_create_affiliation = patch_create_affiliation.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = None
        mock_get_affiliation.return_value = []
        mock_get_organization.return_value = {
            "Contract": 0,
            "ContractStatus": 1,
            "CreatedAt": "2019-05-17 06:32:31.728",
            "OrganizationID": "OrganizationID",
            "OrganizationName": "OrganizationName",
            "UpdatedAt": "2019-05-17 06:32:31.728"
        }
        mock_create_affiliation.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)
        self.addCleanup(patch_get_affiliation.stop)
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_create_affiliation.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        response_body = json.loads(response["body"])
        err_403 = MsgConst.ERR_DB_403
        self.assertEqual(response_body["code"], err_403["code"])
        self.assertEqual(response_body["message"], err_403["message"])
        self.assertEqual(response_body["description"], err_403["description"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_execute_force_invites_case_error_get_file_setting_s3(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.get_affiliation")
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_create_affiliation = patch("premembers.repository.pm_affiliation.create_affiliation")
        patch_query_key_pm_user_attribute = patch('premembers.repository.pm_userAttribute.query_key')
        patch_read_yaml = patch("premembers.common.FileUtils.read_yaml")
        patch_method_error = patch.object(PmLogAdapter, "error")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_get_organization = patch_get_organization.start()
        mock_create_affiliation = patch_create_affiliation.start()
        mock_query_key_pm_user_attribute = patch_query_key_pm_user_attribute.start()
        mock_read_yaml = patch_read_yaml.start()
        mock_method_error = patch_method_error.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = None
        mock_get_affiliation.return_value = []
        mock_get_organization.return_value = {
            "Contract": 0,
            "ContractStatus": 1,
            "CreatedAt": "2019-05-17 06:32:31.728",
            "OrganizationID": "OrganizationID",
            "OrganizationName": "OrganizationName",
            "UpdatedAt": "2019-05-17 06:32:31.728"
        }
        mock_create_affiliation.side_effect = None
        mock_query_key_pm_user_attribute.return_value = copy.deepcopy(DataPmUserAttribute.DATA_SIMPLE)
        mock_read_yaml.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)
        self.addCleanup(patch_get_affiliation.stop)
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_create_affiliation.stop)
        self.addCleanup(patch_query_key_pm_user_attribute.stop)
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(patch_method_error.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # check write log error get file s3
        mock_method_error.assert_any_call("メール送信設定ファイルの取得に失敗しました。:s3://{0}/{1}".format(
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL))

        # assert output function
        response_body = json.loads(response["body"])
        err_s3_702 = MsgConst.ERR_S3_702
        self.assertEqual(response_body["code"], err_s3_702["code"])
        self.assertEqual(response_body["message"], err_s3_702["message"])
        self.assertEqual(response_body["description"], err_s3_702["description"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_execute_force_invites_case_error_get_file_template_template_body_mail(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.get_affiliation")
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_create_affiliation = patch("premembers.repository.pm_affiliation.create_affiliation")
        patch_query_key_pm_user_attribute = patch('premembers.repository.pm_userAttribute.query_key')
        patch_read_yaml = patch("premembers.common.FileUtils.read_yaml")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")
        patch_method_error = patch.object(PmLogAdapter, "error")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_get_organization = patch_get_organization.start()
        mock_create_affiliation = patch_create_affiliation.start()
        mock_query_key_pm_user_attribute = patch_query_key_pm_user_attribute.start()
        mock_read_yaml = patch_read_yaml.start()
        mock_read_decode = patch_read_decode.start()
        mock_method_error = patch_method_error.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = None
        mock_get_affiliation.return_value = []
        mock_get_organization.return_value = {
            "Contract": 0,
            "ContractStatus": 1,
            "CreatedAt": "2019-05-17 06:32:31.728",
            "OrganizationID": "OrganizationID",
            "OrganizationName": "OrganizationName",
            "UpdatedAt": "2019-05-17 06:32:31.728"
        }
        mock_create_affiliation.side_effect = None
        mock_query_key_pm_user_attribute.return_value = copy.deepcopy(DataPmUserAttribute.DATA_SIMPLE)
        mock_read_yaml.return_value = {
            "ja.invite_mail.insightwatch.subject": "[insightwatch(DEV)]へ招待されました",
            "ja.invite_mail.insightwatch.body.text.filepath": "check/notify/mail/insightwatch_user_invite_template_ja.tpl",
            "en.invite_mail.insightwatch.subject": "Youre Invited: insightwatch(DEV)",
            "en.invite_mail.insightwatch.body.text.filepath": "check/notify/mail/insightwatch_user_invite_template_en.tpl",
            "invite_mail.insightwatch.from": "sys@dev.insightwatch.io"
        }
        mock_read_decode.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)
        self.addCleanup(patch_get_affiliation.stop)
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_create_affiliation.stop)
        self.addCleanup(patch_query_key_pm_user_attribute.stop)
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(patch_read_decode.stop)
        self.addCleanup(patch_method_error.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # check write log error get file s3
        mock_method_error.assert_any_call(
            "招待メール本文テンプレートファイルの取得に失敗しました。:s3://{0}/{1}".format(
                common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
                "check/notify/mail/insightwatch_user_invite_template_ja.tpl"))

        # assert output function
        response_body = json.loads(response["body"])
        err_s3_702 = MsgConst.ERR_S3_702
        self.assertEqual(response_body["code"], err_s3_702["code"])
        self.assertEqual(response_body["message"], err_s3_702["message"])
        self.assertEqual(response_body["description"], err_s3_702["description"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_execute_force_invites_case_error_send_mail(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.get_affiliation")
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_create_affiliation = patch("premembers.repository.pm_affiliation.create_affiliation")
        patch_query_key_pm_user_attribute = patch('premembers.repository.pm_userAttribute.query_key')
        patch_read_yaml = patch("premembers.common.FileUtils.read_yaml")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")
        patch_method_error = patch.object(PmLogAdapter, "error")
        patch_send_email = patch("premembers.common.aws_common.send_email")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_get_organization = patch_get_organization.start()
        mock_create_affiliation = patch_create_affiliation.start()
        mock_query_key_pm_user_attribute = patch_query_key_pm_user_attribute.start()
        mock_read_yaml = patch_read_yaml.start()
        mock_read_decode = patch_read_decode.start()
        mock_method_error = patch_method_error.start()
        mock_send_email = patch_send_email.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = None
        mock_get_affiliation.return_value = []
        mock_get_organization.return_value = {
            "Contract": 0,
            "ContractStatus": 1,
            "CreatedAt": "2019-05-17 06:32:31.728",
            "OrganizationID": "OrganizationID",
            "OrganizationName": "OrganizationName",
            "UpdatedAt": "2019-05-17 06:32:31.728"
        }
        mock_create_affiliation.side_effect = None
        mock_query_key_pm_user_attribute.return_value = copy.deepcopy(DataPmUserAttribute.DATA_SIMPLE)
        mock_read_yaml.return_value = {
            "ses.region": "us-west-2",
            "ja.invite_mail.insightwatch.subject": "[insightwatch(DEV)]へ招待されました",
            "ja.invite_mail.insightwatch.body.text.filepath": "check/notify/mail/insightwatch_user_invite_template_ja.tpl",
            "en.invite_mail.insightwatch.subject": "You're Invited: insightwatch(DEV)",
            "en.invite_mail.insightwatch.body.text.filepath": "check/notify/mail/insightwatch_user_invite_template_en.tpl",
            "invite_mail.insightwatch.from": "sys@dev.insightwatch.io"
        }
        mock_read_decode.return_value = "{{mailAddress}} 様\n\nopswitch に招待されました\n\n下記のURLをクリックしてopswitchにアクセスいただき、パスワードの設定、ユーザー情報登録をお願いいたします。\n\nhttps://insightwatch.io/app/\n\nログインID(email): {{mailAddress}}\n初期パスワード: {{temporaryPassword}}\n\nこの招待は１週間有効です。有効期限を過ぎてしまった場合、ログインできなくなります。\n\n--\n※本メールは送信専用メールアドレスから送信されています。返信はできませんのでご了承ください。\nお問い合わせは下記フォームからお送りください。\nhttps://insightwatch.zendesk.com/hc/ja/requests/new\nClassmethod, Inc.\n"
        mock_send_email.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)
        self.addCleanup(patch_get_affiliation.stop)
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_create_affiliation.stop)
        self.addCleanup(patch_query_key_pm_user_attribute.stop)
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(patch_read_decode.stop)
        self.addCleanup(patch_method_error.stop)
        self.addCleanup(patch_send_email.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # check logic write log error send mail
        mock_method_error.assert_any_call("通知メール送信に失敗しました。")

        # assert output function
        response_body = json.loads(response["body"])
        err_ses_801 = MsgConst.ERR_SES_801
        self.assertEqual(response_body["code"], err_ses_801["code"])
        self.assertEqual(response_body["message"], err_ses_801["message"])
        self.assertEqual(response_body["description"], err_ses_801["description"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_execute_force_invites_case_error_get_record_affiliation_user_sign_in(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")
        patch_get_uuid4 = patch("premembers.common.common_utils.get_uuid4")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.get_affiliation")
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_create_affiliation = patch("premembers.repository.pm_affiliation.create_affiliation")
        patch_query_key_pm_user_attribute = patch('premembers.repository.pm_userAttribute.query_key')
        patch_read_yaml = patch("premembers.common.FileUtils.read_yaml")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_get_uuid4 = patch_get_uuid4.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_get_organization = patch_get_organization.start()
        mock_create_affiliation = patch_create_affiliation.start()
        mock_query_key_pm_user_attribute = patch_query_key_pm_user_attribute.start()
        mock_read_yaml = patch_read_yaml.start()
        mock_read_decode = patch_read_decode.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = None
        mock_get_uuid4.return_value = user_invite
        mock_get_affiliation.side_effect = mock_side_effect_get_affiliation
        mock_get_organization.return_value = {
            "Contract": 0,
            "ContractStatus": 1,
            "CreatedAt": "2019-05-17 06:32:31.728",
            "OrganizationID": "OrganizationID",
            "OrganizationName": "OrganizationName",
            "UpdatedAt": "2019-05-17 06:32:31.728"
        }
        mock_create_affiliation.side_effect = None
        mock_query_key_pm_user_attribute.return_value = copy.deepcopy(DataPmUserAttribute.DATA_NOT_CONTAIN_USER_NAME)
        mock_read_yaml.return_value = {
            "ses.region": "us-west-2",
            "ja.invite_mail.insightwatch.subject": "[insightwatch(DEV)]へ招待されました",
            "ja.invite_mail.insightwatch.body.text.filepath": "check/notify/mail/insightwatch_user_invite_template_ja.tpl",
            "en.invite_mail.insightwatch.subject": "You're Invited: insightwatch(DEV)",
            "en.invite_mail.insightwatch.body.text.filepath": "check/notify/mail/insightwatch_user_invite_template_en.tpl",
            "invite_mail.insightwatch.from": "sys@dev.insightwatch.io"
        }
        mock_read_decode.return_value = "{{mailAddress}} 様\n\nopswitch に招待されました\n\n下記のURLをクリックしてopswitchにアクセスいただき、パスワードの設定、ユーザー情報登録をお願いいたします。\n\nhttps://insightwatch.io/app/\n\nログインID(email): {{mailAddress}}\n初期パスワード: {{temporaryPassword}}\n\nこの招待は１週間有効です。有効期限を過ぎてしまった場合、ログインできなくなります。\n\n--\n※本メールは送信専用メールアドレスから送信されています。返信はできませんのでご了承ください。\nお問い合わせは下記フォームからお送りください。\nhttps://insightwatch.zendesk.com/hc/ja/requests/new\nClassmethod, Inc.\n"

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)
        self.addCleanup(patch_get_affiliation.stop)
        self.addCleanup(patch_get_uuid4.stop)
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_create_affiliation.stop)
        self.addCleanup(patch_query_key_pm_user_attribute.stop)
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(patch_read_decode.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        response_body = json.loads(response["body"])
        err_402 = MsgConst.ERR_402
        self.assertEqual(response_body["code"], err_402["code"])
        self.assertEqual(response_body["message"], err_402["message"])
        self.assertEqual(response_body["description"], err_402["description"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_execute_force_invites_case_error_get_record_pm_user_attribute(self):
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")
        patch_get_uuid4 = patch("premembers.common.common_utils.get_uuid4")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.get_affiliation")
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_create_affiliation = patch("premembers.repository.pm_affiliation.create_affiliation")
        patch_method_error = patch.object(PmLogAdapter, "error")
        patch_query_key_pm_user_attribute = patch('premembers.repository.pm_userAttribute.query_key')

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_get_uuid4 = patch_get_uuid4.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_get_organization = patch_get_organization.start()
        mock_create_affiliation = patch_create_affiliation.start()
        mock_method_error = patch_method_error.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)
        mock_query_key_pm_user_attribute = patch_query_key_pm_user_attribute.start()

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = None
        mock_get_uuid4.return_value = user_invite
        mock_get_affiliation.side_effect = mock_side_effect_get_affiliation
        mock_get_organization.return_value = {
            "Contract": 0,
            "ContractStatus": 1,
            "CreatedAt": "2019-05-17 06:32:31.728",
            "OrganizationID": "OrganizationID",
            "OrganizationName": "OrganizationName",
            "UpdatedAt": "2019-05-17 06:32:31.728"
        }
        mock_create_affiliation.side_effect = None
        mock_query_key_pm_user_attribute.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)
        self.addCleanup(patch_get_affiliation.stop)
        self.addCleanup(patch_get_uuid4.stop)
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_create_affiliation.stop)
        self.addCleanup(patch_method_error.stop)
        self.addCleanup(patch_query_key_pm_user_attribute.stop)

        trace_id = user_id_authority_owner
        body_object = json.dumps(regist_user_pool_body)

        # call Function test
        response = organizations_logic.execute_force_invites(
            trace_id, body_object, organization_id)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        response_body = json.loads(response["body"])
        err_402 = MsgConst.ERR_402
        self.assertEqual(response_body["code"], err_402["code"])
        self.assertEqual(response_body["message"], err_402["message"])
        self.assertEqual(response_body["description"], err_402["description"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)
