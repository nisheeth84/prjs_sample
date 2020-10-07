import unittest
import os
import json
import copy

from http import HTTPStatus
from dotenv import load_dotenv
from pathlib import Path
from premembers.organizations.handler import projects
from premembers.repository import pm_affiliation, pm_organizations, pm_projects
from tests import event_create
from premembers.const.msg_const import MsgConst
from boto3.dynamodb.conditions import Attr
from premembers.common import common_utils

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

project_create_empty = {'name': "", 'description': ""}

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


class TestProjects(unittest.TestCase):
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

    def tearDown(self):
        num = 0
        while num < 2:
            # Get data user_id delete and organization_id delete
            user_id = affiliation_template['UserID'].format(str(num))
            organization_id = template_organization_id.format(
                str(num))

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

    def test_get_list_project_success(self):
        test_organization_id = template_organization_id.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(1))

        # handler
        path_parameters = {"organization_id": test_organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = projects.list_projects_handler(event_mock, {})

        # Get data response
        response_body = json.loads(response['body'])
        status_code = response['statusCode']

        # Get data in database
        projects_result = pm_projects.query_organization_index(
            trace_id, test_organization_id, convert_response=True)

        # Check data
        for i in range(len(response_body)):
            for j in range(len(projects_result)):
                if response_body[i]['id'] == projects_result[j]['id']:
                    self.assertEqual(response_body[i]['id'],
                                     projects_result[j]['id'])
                    self.assertEqual(response_body[i]['name'],
                                     projects_result[j]['name'])
                    self.assertEqual(response_body[i]['organizationId'],
                                     projects_result[j]['organizationId'])
                    self.assertEqual(response_body[i]['createdAt'],
                                     projects_result[j]['createdAt'])
                    self.assertEqual(response_body[i]['updatedAt'],
                                     projects_result[j]['updatedAt'])

        self.assertEqual(len(response_body), 2)
        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_get_list_project_success_record_zero(self):
        test_organization_id = template_organization_id.format(str(2))
        test_user_id = affiliation_template_user_id.format(str(2))

        # handler
        path_parameters = {"organization_id": test_organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(organization_update_empty))
        response = projects.list_projects_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body, [])

    def test_get_list_project_error_access_authority(self):
        test_organization_id = template_organization_id.format(str(0))
        test_user_id = affiliation_template_user_id.format(str(0))

        # handler
        path_parameters = {"organization_id": test_organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(organization_update_empty))
        response = projects.list_projects_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_get_project_success(self):
        test_organization_id = template_organization_id.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(1))
        project_id = projects_id_template.format(1)

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = projects.get_project_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        id = response_body['id']
        name = response_body['name']
        description = response_body['description']
        organizationId = response_body['organizationId']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']
        status_code = response['statusCode']

        # Get data in database
        filter = Attr('OrganizationID').eq(test_organization_id)
        project = pm_projects.get_projects(
            trace_id, project_id, filter, convert_response=True)[0]

        # Check data
        self.assertEqual(id, project['id'])
        self.assertEqual(name, project['name'])
        self.assertEqual(description, project['description'])
        self.assertEqual(organizationId, project['organizationId'])
        self.assertEqual(createdAt, project['createdAt'])
        self.assertEqual(updatedAt, project['updatedAt'])

        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_get_project_error_record_zero(self):
        test_organization_id = template_organization_id.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(1))
        project_id = projects_id_template.format(999)

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = projects.get_project_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_301['code'])
        self.assertEqual(response_body['message'], MsgConst.ERR_301['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND.value)

    def test_get_project_error_access_authority(self):
        test_organization_id = template_organization_id.format(str(0))
        test_user_id = affiliation_template_user_id.format(str(0))
        project_id = projects_id_template.format(999)

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = projects.get_project_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_101['code'])
        self.assertEqual(response_body['message'], MsgConst.ERR_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_delete_project_success(self):
        test_organization_id = template_organization_id.format(str(1))
        test_mail_address = affiliation_template_address.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(1))
        project_id = projects_id_template.format(998)

        # Create data delete
        tmp_projects = copy.copy(projects_template)
        tmp_projects['ProjectID'] = project_id
        pm_projects.create_projects(trace_id, tmp_projects['ProjectID'],
                                    tmp_projects['ProjectName'],
                                    tmp_projects['Description'],
                                    tmp_projects['OrganizationID'])

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = projects.delete_project_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_body = json.loads(response['body'])

        # Get data in database
        filter = Attr('OrganizationID').eq(test_organization_id)
        project = pm_projects.get_projects(
            trace_id, project_id, filter, convert_response=True)

        # Check data
        self.assertEqual(len(project), 0)
        self.assertEqual(response_body, None)
        self.assertEqual(status_code, HTTPStatus.NO_CONTENT)

    def test_delete_project_error_record_zero(self):
        test_organization_id = template_organization_id.format(str(1))
        test_mail_address = affiliation_template_address.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(1))
        project_id = projects_id_template.format(999)

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = projects.delete_project_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_301['code'])
        self.assertEqual(response_body['message'], MsgConst.ERR_301['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND.value)

    def test_delete_project_error_access_authority(self):
        test_organization_id = template_organization_id.format(str(0))
        test_mail_address = affiliation_template_address.format(str(0))
        test_user_id = affiliation_template_user_id.format(str(0))
        project_id = projects_id_template.format(999)

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = projects.delete_project_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_101['code'])
        self.assertEqual(response_body['message'], MsgConst.ERR_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_create_project_success(self):
        test_user_id = affiliation_template_user_id.format(str(1))
        test_organization_id = project_organization_id_template.format(str(1))
        date_now = common_utils.get_current_date()

        # handler
        path_parameters = {"organization_id": test_organization_id}
        project_create[
            "organization_id"] = project_organization_id_template.format(
                str(1))
        event = event_create.get_event_object(
            trace_id=test_user_id,
            path_parameters=path_parameters,
            body=json.dumps(project_create))
        response = projects.create_project_handler(event, {})

        # Get data response
        response_body = json.loads(response['body'])
        id = response_body['id']
        name = response_body['name']
        description = response_body['description']
        organization_id = response_body['organizationId']
        created_at = response_body['createdAt']
        updated_at = response_body['updatedAt']
        status_code = response['statusCode']

        # Check data response
        self.assertEqual(name, project_create['name'])
        self.assertEqual(description, project_create['description'])
        self.assertEqual(organization_id, project_create['organization_id'])
        self.assertGreaterEqual(created_at, date_now)
        self.assertGreaterEqual(updated_at, date_now)
        self.assertEqual(status_code, HTTPStatus.CREATED.value)

        # Check data organization in database
        project_database = pm_projects.get_projects(
            test_user_id, id, convert_response=True)[0]
        self.assertEqual(name, project_database['name'])
        self.assertEqual(description, project_database['description'])
        self.assertEqual(organization_id, project_database['organizationId'])
        self.assertGreaterEqual(project_database['createdAt'], date_now)
        self.assertGreaterEqual(project_database['updatedAt'], date_now)
        pm_projects.delete_projects(test_user_id, id)

    def test_create_project_error_parse_json(self):
        test_user_id = affiliation_template_user_id.format(str(1))
        test_organization_id = project_organization_id_template.format(
            str(1))

        # handler
        path_parameters = {"organization_id": test_organization_id}
        project_create[
            "organization_id"] = project_organization_id_template.format(
                str(1))
        event = event_create.get_event_object(
            trace_id=test_user_id,
            path_parameters=path_parameters,
            body=project_create)
        response = projects.create_project_handler(event, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_202['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_202['message'])
        self.assertEqual(response_body['description'],
                         MsgConst.ERR_REQUEST_202['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.BAD_REQUEST.value)

    def test_create_project_error_validate_required(self):
        test_user_id = affiliation_template_user_id.format(str(1))
        test_organization_id = project_organization_id_template.format(str(1))

        # handler
        path_parameters = {"organization_id": test_organization_id}
        project_create[
            "organization_id"] = project_organization_id_template.format(
                str(1))
        event = event_create.get_event_object(
            trace_id=test_user_id,
            path_parameters=path_parameters,
            body=json.dumps(project_create_empty))
        response = projects.create_project_handler(event, {})

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

    def test_create_project_error_validate_string_number(self):
        test_user_id = affiliation_template_user_id.format(str(1))
        test_organization_id = project_organization_id_template.format(str(1))

        project_create_tmp = copy.copy(project_create)
        project_create_tmp['name'] = 123

        # handler
        path_parameters = {"organization_id": test_organization_id}
        project_create[
            "organization_id"] = project_organization_id_template.format(
                str(1))
        event = event_create.get_event_object(
            trace_id=test_user_id,
            path_parameters=path_parameters,
            body=json.dumps(project_create_tmp))
        response = projects.create_project_handler(event, {})

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

    def test_update_project_success(self):
        test_organization_id = template_organization_id.format(str(1))
        test_project_id = template_project_id.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(1))
        date_now = common_utils.get_current_date()

        # handler
        path_parameters = {
            "project_id": test_project_id,
            "organization_id": test_organization_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(project_update))
        response = projects.update_project_handler(event_mock, {})

        # Get data response
        response_body = json.loads(response['body'])
        id = response_body['id']
        name = response_body['name']
        description = response_body['description']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']
        status_code = response['statusCode']

        # Get data in database
        projects_database = pm_projects.get_projects(
            trace_id, test_project_id)

        # Check data
        self.assertEqual(id, test_project_id)
        self.assertEqual(name, projects_database[0]["ProjectName"])
        self.assertEqual(description,
                         projects_database[0]['Description'])
        self.assertEqual(createdAt,
                         projects_database[0]['CreatedAt'])
        self.assertEqual(updatedAt,
                         projects_database[0]['UpdatedAt'])
        self.assertGreaterEqual(projects_database[0]['UpdatedAt'],
                                date_now)
        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_update_project_error_record_zero(self):
        test_organization_id = template_organization_id.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(1))
        test_project_id = "not_exists"

        # handler
        path_parameters = {
            "project_id": test_project_id,
            "organization_id": test_organization_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(project_update))
        response = projects.update_project_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_301['code'])
        self.assertEqual(response_body['message'], MsgConst.ERR_301['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND.value)

    def test_update_project_error_access_authority(self):
        test_project_id = template_project_id.format(str(1))
        test_organization_id = template_organization_id.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(0))

        # handler
        path_parameters = {
            "project_id": test_project_id,
            "organization_id": test_organization_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(project_update))
        response = projects.update_project_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_update_project_error_parse_json(self):
        test_project_id = template_project_id.format(str(1))
        test_organization_id = template_organization_id.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(1))

        # handler
        path_parameters = {
            "project_id": test_project_id,
            "organization_id": test_organization_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=project_update)
        response = projects.update_project_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_202['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_202['message'])
        self.assertEqual(response_body['description'],
                         MsgConst.ERR_REQUEST_202['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.BAD_REQUEST.value)

    def test_update_project_error_validate_required(self):
        test_project_id = template_project_id.format(str(1))
        test_organization_id = template_organization_id.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(1))

        # handler
        path_parameters = {
            "project_id": test_project_id,
            "organization_id": test_organization_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(project_update_empty))
        response = projects.update_project_handler(event_mock, {})

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

    def test_update_project_error_validate_string_number(self):
        test_project_id = template_project_id.format(str(1))
        test_organization_id = template_organization_id.format(str(1))
        test_user_id = affiliation_template_user_id.format(str(1))

        project_update_tmp = copy.copy(project_update)
        project_update_tmp['name'] = 123

        # handler
        path_parameters = {
            "project_id": test_project_id,
            "organization_id": test_organization_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(project_update_tmp))
        response = projects.update_project_handler(event_mock, {})

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
