import unittest
import os
import json
import copy

from http import HTTPStatus
from dotenv import load_dotenv
from operator import itemgetter
from pathlib import Path
from premembers.organizations.handler import organizations
from premembers.repository import pm_affiliation, pm_organizations, pm_projects
from premembers.repository import pm_organizationTasks
from tests import event_create
from premembers.const.msg_const import MsgConst
from premembers.repository.const import Authority, InvitationStatus, Status
from premembers.common import common_utils
from premembers.const.const import CommonConst


trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
affiliation_template_address = "test-user{}@sample.com"
affiliation_template_user_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada{}"
template_organization_id = "eeb367aa-78ee-11e7-89e6-8ffd9d626c2{}"
template_project_id = "77b367aa-78ee-11e7-89e6-8ffd9d626c2{}"
affiliation_template_authority = 3
affiliation_template_authority = 0
affiliation_template_invitation_status = 1
affiliation_template = {
    "MailAddress": affiliation_template_address,
    "UserID": affiliation_template_user_id,
    "Authority": affiliation_template_authority,
    "OrganizationID": template_organization_id,
    "InvitationStatus": affiliation_template_invitation_status,
}

test_organization_id_template = "b55e82e4-77f1-11e7-adfe-df33b64daf62{}"
organization_template = {
    'OrganizationID': test_organization_id_template,
    'OrganizationName': "insert organization Div.",
    'Contract': 0,
    'ContractStatus': 0
}

organization_create = {
    'name': "test_name_create",
    'contract': 1,
    'contractStatus': 2
}

affiliation_mail_address = "test-user1@sample.com"
organization_create_empty = {'name': "", 'contract': "", 'contractStatus': ""}
organization_error_json = {
    'name': "test_organization",
    'contract': "1",
    'contractStatus': "2"
}

organization_create_error_number = {
    'name': "test_name_create",
    'contract': "error",
    'contractStatus': "error"
}

organization_update = {'name': "test_name_update"}

organization_update_empty = {'name': ""}

projects_id_template = template_project_id
projects_template = {
    'ProjectID': projects_id_template,
    'ProjectName': 'ProjectName',
    'Description': 'DescriptionID11',
    'OrganizationID': template_organization_id.format(str(1))
}

project_organization_id_template = template_organization_id

project_create = {
    'id': template_project_id,
    'name': "test_name_project_create",
    'description': "description create",
    'organization_id': project_organization_id_template
}

project_create_empty = {'name': "", 'description': "", 'organization_id': ""}

project_template = {
    'ProjectID': template_project_id,
    'ProjectName': "insert project name",
    'Description': "descript project",
    'OrganizationID': template_organization_id
}

project_update = {
    'name': "test_project_name_update",
    'description': "description update"
}

project_update_empty = {'name': "", 'description': ""}

user_authority_update = {'authority': 3}

create_invite_body = {'mailAddress': "test-user@example.com", 'authority': 3}
create_invite_body_error = {
    'mailAddress': "test-user@example.com",
    'authority': "3"
}
create_invite_email_no_exsit = {
    'mailAddress': "no_email@example.com",
    'authority': 3
}


class TestOrganization(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)
        num = 0
        while num < 2:
            # Create data table Affiliation
            tmp_affiliation = copy.copy(affiliation_template)
            tmp_affiliation['MailAddress'] = affiliation_template[
                'MailAddress'].format(str(num))
            tmp_affiliation['UserID'] = affiliation_template['UserID'].format(
                str(num))
            if num == 1:
                tmp_affiliation['Authority'] = 3
            else:
                tmp_affiliation['Authority'] = num
            tmp_affiliation[
                'OrganizationID'] = template_organization_id.format(
                    str(num))
            pm_affiliation.create_affiliation(
                trace_id, tmp_affiliation['MailAddress'],
                tmp_affiliation['UserID'], tmp_affiliation['OrganizationID'],
                tmp_affiliation['Authority'],
                tmp_affiliation['InvitationStatus'])

            # Create data table Organization
            tmp_organization = copy.copy(organization_template)
            tmp_organization[
                'OrganizationID'] = template_organization_id.format(
                    str(num))
            pm_organizations.create_organization(
                trace_id, tmp_organization['OrganizationID'],
                tmp_organization['OrganizationName'],
                tmp_organization['Contract'],
                tmp_organization['ContractStatus'])

            # Create data table Projects
            tmp_projects = copy.copy(projects_template)
            tmp_projects['ProjectID'] = projects_id_template.format(str(num))
            pm_projects.create_projects(trace_id, tmp_projects['ProjectID'],
                                        tmp_projects['ProjectName'],
                                        tmp_projects['Description'],
                                        tmp_projects['OrganizationID'])
            num += 1

        # creat data test function delete organaization
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
            if num == 3:
                # create data to delete user
                tmp_affiliation = copy.copy(affiliation_template)
                tmp_affiliation['MailAddress'] = affiliation_template[
                    'MailAddress'].format(str(num))
                tmp_affiliation['UserID'] = affiliation_template[
                    'UserID'].format(str(4))
                tmp_affiliation['OrganizationID'] = affiliation_template[
                    'OrganizationID'].format(str(1))
                tmp_affiliation['InvitationStatus'] = 1
                tmp_affiliation['Authority'] = 3

                pm_affiliation.create_affiliation(
                    trace_id, tmp_affiliation['MailAddress'],
                    tmp_affiliation['UserID'],
                    tmp_affiliation['OrganizationID'],
                    tmp_affiliation['Authority'],
                    tmp_affiliation['InvitationStatus'])

                # create data to accept invite
                tmp_affiliation = copy.copy(affiliation_template)
                tmp_affiliation['MailAddress'] = affiliation_template[
                    'MailAddress'].format(str(num))
                tmp_affiliation['UserID'] = affiliation_template[
                    'UserID'].format(str(5))
                tmp_affiliation['OrganizationID'] = affiliation_template[
                    'OrganizationID'].format(str(1))
                tmp_affiliation['InvitationStatus'] = 0
                tmp_affiliation['Authority'] = 3

                pm_affiliation.create_affiliation(
                    trace_id, tmp_affiliation['MailAddress'],
                    tmp_affiliation['UserID'],
                    tmp_affiliation['OrganizationID'],
                    tmp_affiliation['Authority'],
                    tmp_affiliation['InvitationStatus'])

            # Create data table Organization
            tmp_organization = copy.copy(organization_template)
            tmp_organization[
                'OrganizationID'] = template_organization_id.format(str(num))
            pm_organizations.create_organization(
                trace_id, tmp_organization['OrganizationID'],
                tmp_organization['OrganizationName'],
                tmp_organization['Contract'],
                tmp_organization['ContractStatus'])

            num += 1

        # create record 2 for organization eeb367aa-78ee-11e7-89e6-8ffd9d626c20
        tmp_affiliation = copy.copy(affiliation_template)
        tmp_affiliation['MailAddress'] = affiliation_template[
            'MailAddress'].format(str(1))
        tmp_affiliation['UserID'] = affiliation_template['UserID'].format(
            str(1))
        tmp_affiliation['Authority'] = 3
        tmp_affiliation['OrganizationID'] = template_organization_id.format(
            str(0))
        pm_affiliation.create_affiliation(
            trace_id, tmp_affiliation['MailAddress'],
            tmp_affiliation['UserID'], tmp_affiliation['OrganizationID'],
            tmp_affiliation['Authority'], tmp_affiliation['InvitationStatus'])

        # Create data table Organization no record Affiliation
        tmp_organization = copy.copy(organization_template)
        tmp_organization['OrganizationID'] = template_organization_id.format(
            'no_affiliation')
        pm_organizations.create_organization(
            trace_id, tmp_organization['OrganizationID'],
            tmp_organization['OrganizationName'], tmp_organization['Contract'],
            tmp_organization['ContractStatus'])

    def tearDown(self):
        num = 0
        while num < 2:
            # Get data user_id delete and organization_id delete
            user_id = affiliation_template['UserID'].format(str(num))
            organization_id = template_organization_id.format(
                str(num))

            user_id_sign_in = affiliation_template['UserID'].format(str(num))
            organizationTasks = pm_organizationTasks.get_all_organizationTask(
                user_id_sign_in)
            for organizationTask in organizationTasks:
                pm_organizationTasks.delete(user_id_sign_in,
                                            organizationTask['TaskID'])

            # Delete data table Organization and Affiliation
            pm_affiliation.delete_affiliation(user_id, organization_id)
            pm_organizations.delete_organization(trace_id, organization_id)
            pm_projects.delete_projects(
                trace_id, projects_id_template.format(str(num)))
            num += 1

        # remove data test function delete organaization
        while num < 4:
            delete_user_id = affiliation_template['UserID'].format(str(num))
            pm_affiliation.delete_affiliation(
                user_id=delete_user_id,
                organization_id=template_organization_id.format(str(num)))
            num += 1
        delete_user_id = affiliation_template['UserID'].format(str(1))
        pm_affiliation.delete_affiliation(
            user_id=delete_user_id,
            organization_id=template_organization_id.format(str(0)))
        delete_user_id = affiliation_template['UserID'].format(str(4))
        pm_affiliation.delete_affiliation(
            user_id=delete_user_id,
            organization_id=template_organization_id.format(str(1)))
        delete_user_id = affiliation_template['UserID'].format(str(5))
        pm_affiliation.delete_affiliation(
            user_id=delete_user_id,
            organization_id=template_organization_id.format(str(1)))
        organization_template['OrganizationID'] = template_organization_id.format('no_affiliation')
        pm_organizations.delete_organization(
                trace_id,
                organization_id=organization_template['OrganizationID'])
        num = 0
        while num < 4:
            delete_user_id = affiliation_template['UserID'].format(str(num))
            pm_organizations.delete_organization(
                trace_id,
                organization_id=template_organization_id.format(str(num)))
            num += 1

        num = 0
        while num < 4:
            delete_project_id = projects_template['ProjectID'].format(str(num))
            pm_projects.delete_projects(trace_id, delete_project_id)
            num += 1

    def test_success(self):
        test_organization_id = template_organization_id.format(
            str(1))
        test_user_id = affiliation_template_user_id.format(str(1))

        # handler
        path_parameters = {"organization_id": test_organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = organizations.get_organization_handler(event_mock, {})

        # Get data response
        response_body = json.loads(response['body'])
        id = response_body['id']
        name = response_body['name']
        contract = response_body['contract']
        contractStatus = response_body['contractStatus']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']
        status_code = response['statusCode']

        # Get data in database
        organizations_database = pm_organizations.get_organization(
            trace_id, test_organization_id)

        # Check data
        self.assertEqual(id, organizations_database['OrganizationID'])
        self.assertEqual(name,
                         organizations_database['OrganizationName'])
        self.assertEqual(contract, organizations_database['Contract'])
        self.assertEqual(contractStatus,
                         organizations_database['ContractStatus'])
        self.assertEqual(createdAt,
                         organizations_database['CreatedAt'])
        self.assertEqual(updatedAt,
                         organizations_database['UpdatedAt'])
        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_error_access_authority(self):
        test_organization_id = template_organization_id.format(
            str(0))
        test_user_id = affiliation_template_user_id.format(str(0))

        # handler
        path_parameters = {"organization_id": test_organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = organizations.get_organization_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_create_organization_success(self):
        trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
        test_mail_address = affiliation_template_address.format(str(1))
        date_now = common_utils.get_current_date()

        # handler
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            trace_id=trace_id,
            body=json.dumps(organization_create))
        response = organizations.create_organization_handler(event_mock, {})

        # Get data response
        response_body = json.loads(response['body'])
        id = response_body['id']
        name = response_body['name']
        contract = response_body['contract']
        contractStatus = response_body['contractStatus']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']
        status_code = response['statusCode']

        # Check data response
        self.assertEqual(name, organization_create['name'])
        self.assertEqual(contract, organization_create['contract'])
        self.assertEqual(contractStatus, organization_create['contractStatus'])
        self.assertGreaterEqual(createdAt, date_now)
        self.assertGreaterEqual(updatedAt, date_now)
        self.assertEqual(status_code, HTTPStatus.CREATED.value)

        # Check data organization in database
        organizations_database = pm_organizations.get_organization(
            trace_id, id)
        self.assertEqual(name,
                         organizations_database['OrganizationName'])
        self.assertEqual(contract, organizations_database['Contract'])
        self.assertEqual(contractStatus,
                         organizations_database['ContractStatus'])
        self.assertGreaterEqual(organizations_database['CreatedAt'],
                                date_now)
        self.assertGreaterEqual(organizations_database['UpdatedAt'],
                                date_now)

        # Check data affiliation in database
        affiliation_database = pm_affiliation.get_affiliation(trace_id, id)
        self.assertEqual(test_mail_address,
                         affiliation_database['MailAddress'])
        self.assertEqual(trace_id, affiliation_database['UserID'])
        self.assertEqual(id, affiliation_database['OrganizationID'])
        self.assertEqual(Authority.Owner.value,
                         affiliation_database['Authority'])
        self.assertEqual(InvitationStatus.Belong.value,
                         affiliation_database['InvitationStatus'])
        self.assertGreaterEqual(affiliation_database['CreatedAt'],
                                date_now)
        self.assertGreaterEqual(affiliation_database['UpdatedAt'],
                                date_now)

        # delete data
        pm_affiliation.delete_affiliation(trace_id, id)
        pm_organizations.delete_organization(trace_id, id)

    def test_create_error_parse_json(self):
        trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
        test_mail_address = affiliation_template_address.format(str(1))

        # handler
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            trace_id=trace_id,
            body=organization_create)
        response = organizations.create_organization_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_202['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_202['message'])
        self.assertEqual(response_body['description'],
                         MsgConst.ERR_REQUEST_202['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.BAD_REQUEST.value)

    def test_create_error_validate_required(self):
        trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
        test_mail_address = affiliation_template_address.format(str(1))

        # handler
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            trace_id=trace_id,
            body=json.dumps(organization_create_empty))
        response = organizations.create_organization_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        # 組織名
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "name")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

        # 契約種別
        self.assertEqual(response_error[1]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[1]['field'], "contract")
        self.assertEqual(response_error[1]['value'], "")
        self.assertEqual(response_error[1]['message'],
                         MsgConst.ERR_VAL_101['message'])

        # 契約状態
        self.assertEqual(response_error[2]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[2]['field'], "contractStatus")
        self.assertEqual(response_error[2]['value'], "")
        self.assertEqual(response_error[2]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_create_error_validate_string_number(self):
        trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
        test_mail_address = affiliation_template_address.format(str(1))

        organization_create_tmp = copy.copy(organization_create)
        organization_create_tmp['name'] = 123
        # handler
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            trace_id=trace_id,
            body=json.dumps(organization_create_tmp))
        response = organizations.create_organization_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        # 組織名
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_202['code'])
        self.assertEqual(response_error[0]['field'], "name")
        self.assertEqual(response_error[0]['value'], 123)
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_202['message'])

    def test_create_error_validate_format_json(self):
        trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
        test_mail_address = affiliation_template_address.format(str(1))

        # handler
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            trace_id=trace_id,
            body=json.dumps(organization_error_json))
        response = organizations.create_organization_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']

        # 契約種別
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_201['code'])
        self.assertEqual(response_error[0]['field'], "contract")
        self.assertEqual(response_error[0]['value'],
                         organization_error_json['contract'])
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_201['message'])

        # 契約状態
        self.assertEqual(response_error[1]['code'],
                         MsgConst.ERR_VAL_201['code'])
        self.assertEqual(response_error[1]['field'], "contractStatus")
        self.assertEqual(response_error[1]['value'],
                         organization_error_json['contractStatus'])
        self.assertEqual(response_error[1]['message'],
                         MsgConst.ERR_VAL_201['message'])

    def test_create_error_validate_error_number(self):
        trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
        test_mail_address = affiliation_template_address.format(str(1))

        # handler
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            trace_id=trace_id,
            body=json.dumps(organization_create_error_number))
        response = organizations.create_organization_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']

        # 契約種別
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_201['code'])
        self.assertEqual(response_error[0]['field'], "contract")
        self.assertEqual(response_error[0]['value'],
                         organization_create_error_number['contract'])
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_201['message'])

        # 契約状態
        self.assertEqual(response_error[1]['code'],
                         MsgConst.ERR_VAL_201['code'])
        self.assertEqual(response_error[1]['field'], "contractStatus")
        self.assertEqual(response_error[1]['value'],
                         organization_create_error_number['contractStatus'])
        self.assertEqual(response_error[1]['message'],
                         MsgConst.ERR_VAL_201['message'])

    # UUID（v4）より組織IDの値を取得する為、下記のケースのテストが実施できない。
    # 組織レコード作成に失敗した
    # ユーザー所属レコード作成に失敗した

    def test_update_success(self):
        test_organization_id = template_organization_id.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(1))
        date_now = common_utils.get_current_date()

        # handler
        path_parameters = {"organization_id": test_organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(organization_update))
        response = organizations.update_organization_handler(event_mock, {})

        # Get data response
        response_body = json.loads(response['body'])
        id = response_body['id']
        name = response_body['name']
        contract = response_body['contract']
        contractStatus = response_body['contractStatus']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']
        status_code = response['statusCode']

        # Get data in database
        organizations_database = pm_organizations.get_organization(
            trace_id, test_organization_id)

        # Check data
        self.assertEqual(id, test_organization_id)
        self.assertEqual(name, organization_update['name'])
        self.assertEqual(contract, organizations_database['Contract'])
        self.assertEqual(contractStatus,
                         organizations_database['ContractStatus'])
        self.assertEqual(createdAt,
                         organizations_database['CreatedAt'])
        self.assertEqual(updatedAt,
                         organizations_database['UpdatedAt'])
        self.assertGreaterEqual(organizations_database['UpdatedAt'],
                                date_now)
        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_update_error_access_authority(self):
        test_organization_id = template_organization_id.format(
            str(0))
        test_user_id = affiliation_template_user_id.format(str(0))

        # handler
        path_parameters = {"organization_id": test_organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(organization_update))
        response = organizations.update_organization_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_update_error_parse_json(self):
        test_organization_id = template_organization_id.format(
            str(1))
        test_user_id = affiliation_template_user_id.format(str(1))

        # handler
        path_parameters = {"organization_id": test_organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=organization_update)
        response = organizations.update_organization_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_202['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_202['message'])
        self.assertEqual(response_body['description'],
                         MsgConst.ERR_REQUEST_202['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.BAD_REQUEST.value)

    def test_update_error_validate_required(self):
        test_organization_id = template_organization_id.format(
            str(1))
        test_user_id = affiliation_template_user_id.format(str(1))

        # handler
        path_parameters = {"organization_id": test_organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(organization_update_empty))
        response = organizations.update_organization_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        # 組織名
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "name")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_update_error_validate_string_number(self):
        test_organization_id = template_organization_id.format(
            str(1))
        test_user_id = affiliation_template_user_id.format(str(1))

        organization_update_tmp = copy.copy(organization_update)
        organization_update_tmp['name'] = 123

        # handler
        path_parameters = {"organization_id": test_organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(organization_update_tmp))
        response = organizations.update_organization_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        # 組織名
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_202['code'])
        self.assertEqual(response_error[0]['field'], "name")
        self.assertEqual(response_error[0]['value'], 123)
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_202['message'])

    # 組織に該当レコードが存在しなかった場合（取得件数が0件）
    # ステータスコード:404
    # エラーコード:301
    # それ以外のエラー
    # ステータスコード:500
    # エラーコード:402
    # 上記のケースのテストが実施できない。アクセス権限チェックで実施されることを確認した。

    def test_delete_organizations_success(self):
        organization_id = affiliation_template['OrganizationID'].format(str(2))
        mail_address = affiliation_template_address.format(str(2))
        test_user_id = affiliation_template_user_id.format(str(2))
        path_parameters = {
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            email=mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = organizations.delete_organization_handler(event_mock, {})

        organizationTasks = pm_organizationTasks.get_all_organizationTask(
            test_user_id)

        # Check no record Code = 'DELETE_ORG_USER'
        for organizationTask in organizationTasks:
            if (organizationTask['Code'] ==
                    CommonConst.TASK_TYPE_CODE_DELETE_ORG_USER):
                self.assertEqual(
                    organizationTask['Target'],
                    CommonConst.TARGET_DELETE_ORG_USER.format(
                        test_user_id, organization_id))

                self.assertEqual(organizationTask['UserID'], test_user_id)
                self.assertEqual(organizationTask['MailAddress'],
                                 mail_address)
                self.assertEqual(organizationTask['TaskStatus'], 0)
                self.assertEqual(organizationTask['RetryCount'], 0)
                self.assertEqual(organizationTask['MaxRetry'], 3)

        self.assertEqual(response['statusCode'], HTTPStatus.NO_CONTENT)

    def test_delete_organizations_isset_2_record_affiliation_success(self):
        organization_id = template_organization_id.format(str(0))
        mail_address = affiliation_template_address.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(1))
        path_parameters = {
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            email=mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = organizations.delete_organization_handler(event_mock, {})

        organizationTasks = sorted(
            pm_organizationTasks.get_all_organizationTask(test_user_id),
            key=itemgetter('Target'))

        # Check no record Code = 'DELETE_ORG_USER'
        num = 0
        for organizationTask in organizationTasks:
            if (organizationTask['Code'] ==
                    CommonConst.TASK_TYPE_CODE_DELETE_ORG_USER):
                self.assertEqual(
                    organizationTask['Target'],
                    CommonConst.TARGET_DELETE_ORG_USER.format(
                        affiliation_template_user_id.format(str(num)),
                        organization_id))

                self.assertEqual(organizationTask['UserID'], test_user_id)
                self.assertEqual(organizationTask['MailAddress'],
                                 mail_address)
                self.assertEqual(organizationTask['TaskStatus'], 0)
                self.assertEqual(organizationTask['RetryCount'], 0)
                self.assertEqual(organizationTask['MaxRetry'], 3)
                num += 1

        self.assertEqual(response['statusCode'], HTTPStatus.NO_CONTENT)

    def test_delete_organizations_authorization_false(self):
        organization_id = affiliation_template['OrganizationID'].format(str(0))
        mail_address = affiliation_template_address.format(str(0))
        test_user_id = affiliation_template_user_id.format(str(0))
        path_parameters = {
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            email=mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = organizations.delete_organization_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_list_users_susscess(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        path_parameters = {
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(1)),
            path_parameters=path_parameters,
            query_string_parameters={"inviteStatus": "1"})
        response = organizations.list_users_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.OK)

    def test_list_users_susscess_no_inviteStatus(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        path_parameters = {
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(1)),
            path_parameters=path_parameters)
        response = organizations.list_users_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.OK)

    def test_list_users_authorization_false(self):
        organization_id = affiliation_template['OrganizationID'].format(str(0))
        path_parameters = {
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(0)),
            path_parameters=path_parameters,
            query_string_parameters={"inviteStatus": "1"})
        response = organizations.list_users_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_list_users_invite_no_exist(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        path_parameters = {
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(1)),
            path_parameters=path_parameters,
            query_string_parameters={"inviteStatus": 4})
        response = organizations.list_users_handler(event_mock, {})
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_list_users_invite_invalid_value_string(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        path_parameters = {
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(1)),
            path_parameters=path_parameters,
            query_string_parameters={"inviteStatus": "a"})
        response = organizations.list_users_handler(event_mock, {})
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_delete_user_susscess(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id_sign_in = affiliation_template['UserID'].format(str(1))
        user_id_delete = affiliation_template['UserID'].format(str(4))
        email = affiliation_template['MailAddress'].format(str(1))
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_delete
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(1)),
            path_parameters=path_parameters,
            email=email)
        response = organizations.delete_user_handler(event_mock, {})
        organizationTasks = pm_organizationTasks.get_all_organizationTask(
            user_id_sign_in)
        count_organizationtask_delete = 0
        target = CommonConst.TARGET_DELETE_ORG_USER.format(
            user_id_delete, organization_id)
        # Check data
        for organizationTask in organizationTasks:
            if (organizationTask['Target'] == target):
                count_organizationtask_delete += 1
                self.assertEqual(organizationTask['Target'], target)
                self.assertEqual(organizationTask['Code'],
                                 CommonConst.TASK_TYPE_CODE_DELETE_ORG_USER)
                self.assertEqual(organizationTask['UserID'], user_id_sign_in)
                self.assertEqual(organizationTask['MailAddress'], email)
                self.assertEqual(organizationTask['MaxRetry'], 3)
                self.assertEqual(organizationTask['RetryCount'], 0)
                self.assertEqual(organizationTask['TaskStatus'],
                                 Status.Waiting.value)
            pm_organizationTasks.delete(user_id_sign_in,
                                        organizationTask['TaskID'])

        self.assertEqual(count_organizationtask_delete, 1)
        self.assertEqual(response['statusCode'], HTTPStatus.NO_CONTENT)

    def test_delete_user_delete_itself_susscess(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id_sign_in = affiliation_template['UserID'].format(str(1))
        user_id_delete = affiliation_template['UserID'].format(str(1))
        email = affiliation_template['MailAddress'].format(str(1))
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_delete
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(1)),
            path_parameters=path_parameters,
            email=email)
        response = organizations.delete_user_handler(event_mock, {})
        organizationTasks = pm_organizationTasks.get_all_organizationTask(
            user_id_sign_in)
        count_organizationtask_delete = 0
        target = CommonConst.TARGET_DELETE_ORG_USER.format(
            user_id_delete, organization_id)
        # Check data
        for organizationTask in organizationTasks:
            if (organizationTask['Target'] == target):
                count_organizationtask_delete += 1
                self.assertEqual(organizationTask['Target'], target)
                self.assertEqual(organizationTask['Code'],
                                 CommonConst.TASK_TYPE_CODE_DELETE_ORG_USER)
                self.assertEqual(organizationTask['UserID'], user_id_sign_in)
                self.assertEqual(organizationTask['MailAddress'], email)
                self.assertEqual(organizationTask['MaxRetry'], 3)
                self.assertEqual(organizationTask['RetryCount'], 0)
                self.assertEqual(organizationTask['TaskStatus'],
                                 Status.Waiting.value)
            pm_organizationTasks.delete(user_id_sign_in,
                                        organizationTask['TaskID'])

        self.assertEqual(count_organizationtask_delete, 1)
        self.assertEqual(response['statusCode'], HTTPStatus.NO_CONTENT)

    def test_delete_user_authorization_false(self):
        organization_id = affiliation_template['OrganizationID'].format(str(0))
        user_id_sign_in = affiliation_template['UserID'].format(str(0))
        user_id_delete = affiliation_template['UserID'].format(str(1))
        email = affiliation_template['MailAddress'].format(str(1))
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_delete
        }
        event_mock = event_create.get_event_object(
            trace_id=user_id_sign_in,
            path_parameters=path_parameters,
            email=email)
        response = organizations.delete_user_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_delete_user_precondition_failed(self):
        organization_id = affiliation_template['OrganizationID'].format(str(2))
        user_id_sign_in = affiliation_template['UserID'].format(str(2))
        user_id_delete = affiliation_template['UserID'].format(str(2))
        email = affiliation_template['MailAddress'].format(str(1))

        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_delete
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(2)),
            path_parameters=path_parameters,
            email=email)
        response = organizations.delete_user_handler(event_mock, {})
        self.assertEqual(response['statusCode'],
                         HTTPStatus.PRECONDITION_FAILED)

    def test_delete_user_not_found(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id_sign_in = affiliation_template['UserID'].format(str(1))
        user_id_delete = affiliation_template['UserID'].format(str(6))
        email = affiliation_template['MailAddress'].format(str(1))
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_delete
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(1)),
            path_parameters=path_parameters,
            email=email)
        response = organizations.delete_user_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_update_authority_susscess(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id_sign_in = affiliation_template['UserID'].format(str(1))
        user_id_update = affiliation_template['UserID'].format(str(4))
        user_authority_update = {'authority': 2}
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_update
        }
        date_now = common_utils.get_current_date()
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(1)),
            path_parameters=path_parameters,
            body=json.dumps(user_authority_update))
        response = organizations.update_authority_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.OK)

        affiliation_database = pm_affiliation.get_affiliation(
            user_id_update, organization_id)
        self.assertEqual(Authority.Editor.value,
                         int(affiliation_database['Authority']))
        self.assertGreaterEqual(affiliation_database['UpdatedAt'],
                                date_now)

    def test_update_authority_susscess_update_authority_Owner(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id_sign_in = affiliation_template['UserID'].format(str(1))
        user_id_update = affiliation_template['UserID'].format(str(4))
        user_authority_update = {'authority': 3}
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_update
        }
        date_now = common_utils.get_current_date()
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(1)),
            path_parameters=path_parameters,
            body=json.dumps(user_authority_update))
        response = organizations.update_authority_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.OK)

        affiliation_database = pm_affiliation.get_affiliation(
            user_id_update, organization_id)
        self.assertEqual(Authority.Owner.value,
                         int(affiliation_database['Authority']))
        self.assertGreaterEqual(affiliation_database['UpdatedAt'],
                                date_now)

    def test_update_authority_susscess_authority_not_Owner(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id_sign_in = affiliation_template['UserID'].format(str(1))
        user_id_update = affiliation_template['UserID'].format(str(1))
        user_authority_update = {'authority': 2}
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_update
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(1)),
            path_parameters=path_parameters,
            body=json.dumps(user_authority_update))
        response = organizations.update_authority_handler(event_mock, {})
        self.assertEqual(response['statusCode'],
                         HTTPStatus.OK)

    def test_update_authority_error_param(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id_sign_in = affiliation_template['UserID'].format(str(1))
        user_id_update = affiliation_template['UserID'].format(str(4))
        user_authority_error_json = {'authority': '2'}
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_update
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(1)),
            path_parameters=path_parameters,
            body=json.dumps(user_authority_error_json))
        response = organizations.update_authority_handler(event_mock, {})
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_update_authority_error_PRECONDITION_FAILED(self):
        organization_id = affiliation_template['OrganizationID'].format(str(2))
        user_id_sign_in = affiliation_template['UserID'].format(str(2))
        user_id_update = affiliation_template['UserID'].format(str(2))
        user_authority_error_json = {'authority': 2}
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_update
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(2)),
            path_parameters=path_parameters,
            body=json.dumps(user_authority_error_json))
        response = organizations.update_authority_handler(event_mock, {})
        self.assertEqual(response['statusCode'],
                         HTTPStatus.PRECONDITION_FAILED)

    def test_update_authority_not_found(self):
        organization_id = affiliation_template['OrganizationID'].format(str(2))
        user_id_sign_in = affiliation_template['UserID'].format(str(2))
        user_id_update = affiliation_template['UserID'].format(str(5))
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_update
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(2)),
            path_parameters=path_parameters,
            body=json.dumps(user_authority_update))
        response = organizations.update_authority_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_create_invite_susscess(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id = affiliation_template['UserID'].format(str(1))
        date_now = common_utils.get_current_date()
        path_parameters = {
            "trace_id": user_id,
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            trace_id=affiliation_template_user_id.format(str(1)),
            path_parameters=path_parameters,
            body=json.dumps(create_invite_body))
        response = organizations.create_invite_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.CREATED)

        response_body = json.loads(response['body'])
        id = response_body['id']
        mailAddress = response_body['mailAddress']
        organizationId = response_body['organizationId']
        authority = response_body['authority']
        invitationStatus = response_body['invitationStatus']
        createdAt = response_body['createdAt']

        # Get data in database
        affiliation_database = pm_affiliation.get_affiliation(
            id, organization_id, True)
        # Check data
        self.assertEqual(id, affiliation_database["id"])
        self.assertEqual(mailAddress, affiliation_database["mailAddress"])
        self.assertEqual(organizationId,
                         affiliation_database["organizationId"])
        self.assertEqual(authority, affiliation_database["authority"])
        self.assertEqual(invitationStatus,
                         affiliation_database["invitationStatus"])
        self.assertEqual(createdAt, affiliation_database["createdAt"])
        self.assertGreaterEqual(affiliation_database["updatedAt"], date_now)
        pm_affiliation.delete_affiliation(
            json.loads(response['body'])['id'], organization_id)

    def test_create_invite_authority_false(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id = affiliation_template['UserID'].format(str("authority_false"))
        path_parameters = {
            "trace_id": user_id,
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            trace_id=user_id,
            path_parameters=path_parameters,
            body=json.dumps(create_invite_body))
        response = organizations.create_invite_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_create_invite_body_false(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id = affiliation_template['UserID'].format(str(1))
        path_parameters = {
            "trace_id": user_id,
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            trace_id=user_id,
            path_parameters=path_parameters,
            body=json.dumps(create_invite_body_error))
        response = organizations.create_invite_handler(event_mock, {})
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_create_invite_no_list_user_pool_false(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id = affiliation_template['UserID'].format(str(1))
        path_parameters = {
            "trace_id": user_id,
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            trace_id=user_id,
            path_parameters=path_parameters,
            body=json.dumps(create_invite_email_no_exsit))
        response = organizations.create_invite_handler(event_mock, {})
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_create_invite_false_has_invite(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id = affiliation_template['UserID'].format(str(1))
        path_parameters = {
            "trace_id": user_id,
            "organization_id": organization_id
        }
        event_mock = event_create.get_event_object(
            trace_id=user_id,
            path_parameters=path_parameters,
            body=json.dumps(create_invite_body))
        response_conflic = organizations.create_invite_handler(event_mock, {})
        response = organizations.create_invite_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.CONFLICT)
        pm_affiliation.delete_affiliation(
            json.loads(response_conflic['body'])['id'], organization_id)

    def test_accept_invite_susscess(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id_sign_in = affiliation_template['UserID'].format(str(5))
        user_id_param = affiliation_template['UserID'].format(str(5))
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_param
        }
        date_now = common_utils.get_current_date()
        event_mock = event_create.get_event_object(
            trace_id=user_id_sign_in,
            path_parameters=path_parameters)
        response = organizations.accept_invite_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.CREATED)

        affiliation_database = pm_affiliation.get_affiliation(
            user_id_param, organization_id, True)
        self.assertEqual(InvitationStatus.Belong,
                         int(affiliation_database['invitationStatus']))
        self.assertGreaterEqual(affiliation_database['updatedAt'], date_now)

    def test_reject_invite_susscess(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id_sign_in = affiliation_template['UserID'].format(str(5))
        user_id_param = affiliation_template['UserID'].format(str(5))
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_param
        }
        date_now = common_utils.get_current_date()
        event_mock = event_create.get_event_object(
            trace_id=user_id_sign_in,
            path_parameters=path_parameters)
        response = organizations.reject_invite_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.CREATED)

        affiliation_database = pm_affiliation.get_affiliation(
            user_id_param, organization_id, True)
        self.assertEqual(InvitationStatus.Deny,
                         int(affiliation_database['invitationStatus']))
        self.assertGreaterEqual(affiliation_database['updatedAt'], date_now)

    def test_accept_invite_error_FORBIDDEN(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id_sign_in = affiliation_template['UserID'].format(str(5))
        user_id_param = affiliation_template['UserID'].format(str(4))
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_param
        }
        event_mock = event_create.get_event_object(
            trace_id=user_id_sign_in,
            path_parameters=path_parameters)
        response = organizations.accept_invite_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_reject_invite_error_FORBIDDEN(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id_sign_in = affiliation_template['UserID'].format(str(5))
        user_id_param = affiliation_template['UserID'].format(str(4))
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_param
        }
        event_mock = event_create.get_event_object(
            trace_id=user_id_sign_in,
            path_parameters=path_parameters)
        response = organizations.reject_invite_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_accept_invite_error_NOT_FOUND(self):
        organization_id = affiliation_template['OrganizationID'].format(str(1))
        user_id_sign_in = affiliation_template['UserID'].format(str(4))
        user_id_param = affiliation_template['UserID'].format(str(4))
        path_parameters = {
            "trace_id": user_id_sign_in,
            "organization_id": organization_id,
            "user_id": user_id_param
        }
        event_mock = event_create.get_event_object(
            trace_id=user_id_sign_in,
            path_parameters=path_parameters)
        response = organizations.accept_invite_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)
