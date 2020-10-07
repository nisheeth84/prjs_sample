import unittest
import os
import copy
import json

from http import HTTPStatus
from dotenv import load_dotenv
from premembers.organizations.handler import myorganizations
from premembers.repository import pm_affiliation, pm_organizations
from pathlib import Path
from tests import event_create
from premembers.const.msg_const import MsgConst

trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
affiliation_template_address = "test-user{}@sample.com"
affiliation_template_user_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada{}"
affiliation_org_id_template = "eeb367aa-78ee-11e7-89e6-8ffd9d626c2{}"
affiliation_template_authority = 3
affiliation_template_authority = 0
affiliation_template_invitation_status = 1
affiliation_template = {
    "MailAddress": affiliation_template_address,
    "UserID": affiliation_template_user_id,
    "Authority": affiliation_template_authority,
    "OrganizationID": affiliation_org_id_template,
    "InvitationStatus": affiliation_template_invitation_status,
}

test_organization_id_template = "b55e82e4-77f1-11e7-adfe-df33b64daf62{}"
organization_template = {
    'OrganizationID': test_organization_id_template,
    'OrganizationName': "insert organization Div.",
    'Contract': "0",
    'ContractStatus': "0"
}

organization_create = {
    'name': "test_name_create",
    'contract': "1",
    'contractStatus': "2"
}

affiliation_mail_address = "test-user1@sample.com"
organization_create_empty = {'name': "", 'contract': "", 'contractStatus': ""}

organization_create_error_number = {
    'name': "test_name_create",
    'contract': "error",
    'contractStatus': "error"
}


class TestMyOrganization(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)
        num = 0
        while num < 4:
            tmp_affiliation = copy.copy(affiliation_template)
            tmp_affiliation['MailAddress'] = affiliation_template[
                'MailAddress'].format(str(num))
            tmp_affiliation['UserID'] = affiliation_template['UserID'].format(
                str(num))
            tmp_affiliation['OrganizationID'] = affiliation_template[
                'OrganizationID'].format(str(num))
            tmp_affiliation['InvitationStatus'] = num % 3 - 1
            if (num < 3):
                tmp_affiliation['Authority'] = num + 1
            else:
                tmp_affiliation['Authority'] = 3

            pm_affiliation.create_affiliation(
                trace_id, tmp_affiliation['MailAddress'],
                tmp_affiliation['UserID'], tmp_affiliation['OrganizationID'],
                tmp_affiliation['Authority'],
                tmp_affiliation['InvitationStatus'])

            # Create data table Organization
            tmp_organization = copy.copy(organization_template)
            tmp_organization[
                'OrganizationID'] = affiliation_org_id_template.format(
                    str(num))
            pm_organizations.create_organization(
                trace_id, tmp_organization['OrganizationID'],
                tmp_organization['OrganizationName'],
                tmp_organization['Contract'],
                tmp_organization['ContractStatus'])

            num += 1

    def tearDown(self):
        num = 0
        while num < 4:
            delete_user_id = affiliation_template['UserID'].format(str(num))
            pm_affiliation.delete_affiliation(
                user_id=delete_user_id,
                organization_id=affiliation_org_id_template.format(str(num)))
            num += 1

        num = 0
        while num < 4:
            delete_user_id = affiliation_template['UserID'].format(str(num))
            pm_organizations.delete_organization(
                trace_id,
                organization_id=affiliation_org_id_template.format(str(num)))
            num += 1

    def test_get_myorganizations_susscess(self):
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(2)),
            query_string_parameters={"inviteStatus": "1"}
        )
        response = myorganizations.get_myorganizations_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.OK)

    def test_get_myorganizations_error_validate_invite_status_empty(self):
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(2)),
            query_string_parameters={"inviteStatus": ""}
        )
        response = myorganizations.get_myorganizations_handler(event_mock, {})
        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        # validate バリデーションエラー
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "inviteStatus")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_get_myorganizations_invite_status_invalid_value_number(self):
        # validate 値は{0}のいずれかである必要があります。
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(2)),
            query_string_parameters={"inviteStatus": "4"}
        )
        response = myorganizations.get_myorganizations_handler(event_mock, {})
        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_302['code'])
        self.assertEqual(response_error[0]['field'], "inviteStatus")
        self.assertEqual(response_error[0]['value'], "4")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_302['message'].format("-1, 0, 1"))

    def test_get_myorganizations_invite_status_invalid_value_string(self):
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(2)),
            query_string_parameters={"inviteStatus": "a"}
        )
        response = myorganizations.get_myorganizations_handler(event_mock, {})
        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_302['code'])
        self.assertEqual(response_error[0]['field'], "inviteStatus")
        self.assertEqual(response_error[0]['value'], "a")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_302['message'].format("-1, 0, 1"))

    def test_get_myorganizations_invite_status_not_exists_empty(self):
        # validate invite_statusが付与されていない
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(2)),
            query_string_parameters={}
        )
        response = myorganizations.get_myorganizations_handler(event_mock, {})
        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "inviteStatus")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_get_myorganizations_invite_status_not_exists_number(self):
        # validate invite_statusが付与されていない
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(2)),
            query_string_parameters={"inviteStatusError": "1"}
        )
        response = myorganizations.get_myorganizations_handler(event_mock, {})
        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "inviteStatus")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_count_myorganizations_ok(self):
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(5)),
            query_string_parameters={"inviteStatus": "1"}
        )
        response = myorganizations.count_myorganizations_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.OK.value)

    def test_count_myorganizations_error_validate_invite_status_empty(self):
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(5)),
            query_string_parameters={"inviteStatus": ""}
        )
        response = myorganizations.count_myorganizations_handler(event_mock, {})
        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        # validate バリデーションエラー
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "inviteStatus")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_count_myorganizations_invite_status_invalid_value_number(self):
        # validate 値は{0}のいずれかである必要があります。
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(5)),
            query_string_parameters={"inviteStatus": "4"}
        )
        response = myorganizations.count_myorganizations_handler(event_mock, {})
        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_302['code'])
        self.assertEqual(response_error[0]['field'], "inviteStatus")
        self.assertEqual(response_error[0]['value'], "4")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_302['message'].format("-1, 0, 1"))

    def test_count_myorganizations_invite_status_invalid_value_string(self):
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(5)),
            query_string_parameters={"inviteStatus": "a"}
        )
        response = myorganizations.count_myorganizations_handler(event_mock, {})
        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_302['code'])
        self.assertEqual(response_error[0]['field'], "inviteStatus")
        self.assertEqual(response_error[0]['value'], "a")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_302['message'].format("-1, 0, 1"))

    def test_count_myorganizations_invite_status_not_exists_empty(self):
        # validate invite_statusが付与されていない
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(5)),
            query_string_parameters={}
        )
        response = myorganizations.count_myorganizations_handler(event_mock, {})
        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "inviteStatus")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_count_myorganizations_invite_status_not_exists_number(self):
        # validate invite_statusが付与されていない
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(5)),
            query_string_parameters={"inviteStatusError": "1"}
        )
        response = myorganizations.count_myorganizations_handler(event_mock, {})
        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "inviteStatus")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])
