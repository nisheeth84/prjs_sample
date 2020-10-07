import unittest
import os
import json
import copy

from http import HTTPStatus
from dotenv import load_dotenv
from pathlib import Path
from premembers.organizations.handler import awscoops
from premembers.repository import pm_affiliation, pm_organizations, pm_projects
from premembers.repository import pm_awsAccountCoops
from tests import event_create
from premembers.const.msg_const import MsgConst
from premembers.common import common_utils

trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
mail_address = "test-user{}@example.com"
user_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada{}"
organization_id = "awscoops-78ee-11e7-89e6-OrganizationID"
project_id = "awscoops-77f1-11e7-adfe-ProjectID"
coop_id = "awscoops-77f1-11e7-adfe-CoopID{}"
coop_id_members_enable = common_utils.get_uuid4()

affiliation_template = {
    "MailAddress": mail_address.format(str(0)),
    "UserID": user_id,
    "Authority": 0,
    "OrganizationID": organization_id,
    "InvitationStatus": 1,
}

organization_template = {
    "OrganizationID": organization_id,
    "OrganizationName": "OrganizationName",
    "Contract": 1,
    "ContractStatus": 1
}

projects_template = {
    "ProjectID": project_id,
    "ProjectName": "ProjectName",
    "Description": "DescriptionID11",
    "OrganizationID": organization_id
}

awscoops_template = {
    "CoopID": coop_id.format(str(1)),
    "AWSAccount": "awsAccount",
    "AWSAccountName": "aws_account_name",
    "RoleName": "roleName",
    "ExternalID": "4defd5cf-e3d7-49de-932f-b9bdd9276b5f",
    "Description": "description",
    "Effective": 1,
    "OrganizationID": organization_id,
    "ProjectID": project_id
}

awscoops_body = {
    "awsAccount": "216054658829",
    "roleName": "insightwatch-dev-IAMRole-18TL7SRKGI6PL",
    "description": "update_description",
    'awsAccountName': "update_awsAccountName"
}


class TestAwscoops(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)

        # Create Organization
        pm_organizations.create_organization(
            trace_id, organization_template['OrganizationID'],
            organization_template['OrganizationName'],
            organization_template['Contract'],
            organization_template['ContractStatus'])

        # Create Projects
        pm_projects.create_projects(trace_id, projects_template['ProjectID'],
                                    projects_template['ProjectName'],
                                    projects_template['Description'],
                                    projects_template['OrganizationID'])

        # Create awscoop
        pm_awsAccountCoops.create_awscoops(
            trace_id, awscoops_template["CoopID"],
            awscoops_template["AWSAccount"],
            awscoops_template['AWSAccountName'], awscoops_template["RoleName"],
            awscoops_template["ExternalID"], awscoops_template["Description"],
            awscoops_template["Effective"],
            awscoops_template["OrganizationID"],
            awscoops_template["ProjectID"])

        # Create awscoop members enable
        pm_awsAccountCoops.create_awscoops(
            trace_id, coop_id_members_enable,
            awscoops_template["AWSAccount"],
            awscoops_template['AWSAccountName'], awscoops_template["RoleName"],
            awscoops_template["ExternalID"], awscoops_template["Description"],
            awscoops_template["Effective"],
            awscoops_template["OrganizationID"],
            awscoops_template["ProjectID"])
        attribute = {'Members': {"Value": 1}}
        pm_awsAccountCoops.update_awscoops(trace_id, coop_id_members_enable,
                                           attribute)

        # Create awscoop delete
        tmp_awscoops = copy.copy(awscoops_template)
        tmp_awscoops["CoopID"] = coop_id.format(str(999))
        pm_awsAccountCoops.create_awscoops(
            trace_id, tmp_awscoops["CoopID"],
            tmp_awscoops["AWSAccount"],
            awscoops_template['AWSAccountName'], tmp_awscoops["RoleName"],
            tmp_awscoops["ExternalID"], tmp_awscoops["Description"],
            tmp_awscoops["Effective"],
            tmp_awscoops["OrganizationID"],
            tmp_awscoops["ProjectID"])

        num = 1
        while num < 4:
            # Create Affiliation
            tmp_affiliation = copy.copy(affiliation_template)
            tmp_affiliation['MailAddress'] = mail_address.format(str(num))
            tmp_affiliation['UserID'] = user_id.format(str(num))
            tmp_affiliation['Authority'] = num
            pm_affiliation.create_affiliation(
                trace_id, tmp_affiliation['MailAddress'],
                tmp_affiliation['UserID'], tmp_affiliation['OrganizationID'],
                tmp_affiliation['Authority'],
                tmp_affiliation['InvitationStatus'])
            num += 1

    def tearDown(self):
        num = 1
        while num < 4:
            pm_affiliation.delete_affiliation(
                user_id.format(str(num)), organization_id)
            num += 1
        pm_projects.delete_projects(trace_id, project_id)
        pm_organizations.delete_organization(trace_id, organization_id)
        pm_awsAccountCoops.delete_awscoops(trace_id,
                                           awscoops_template["CoopID"])
        pm_awsAccountCoops.delete_awscoops(trace_id,
                                           coop_id.format(str(999)))
        pm_awsAccountCoops.delete_awscoops(trace_id, coop_id_members_enable)

    def test_create_awscoops_success(self):
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = awscoops.create_awscoop_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        id = response_body["id"]
        awsAccount = response_body['awsAccount']
        roleName = response_body['roleName']
        externalId = response_body['externalId']
        projectId = response_body['projectId']
        organizationId = response_body['organizationId']
        description = response_body['description']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']
        aws_account_name = response_body['awsAccountName']
        members = response_body['members']
        # Get data in database
        awscoops_database = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, id, convert_response=True)

        # Check data
        self.assertEqual(id, awscoops_database['id'])
        self.assertEqual(awsAccount, awscoops_database['awsAccount'])
        self.assertEqual(aws_account_name, awscoops_database['awsAccountName'])
        self.assertEqual(roleName, awscoops_database['roleName'])
        self.assertEqual(externalId, awscoops_database['externalId'])
        self.assertEqual(projectId, awscoops_database['projectId'])
        self.assertEqual(organizationId, awscoops_database['organizationId'])
        self.assertEqual(description, awscoops_database['description'])
        self.assertEqual(createdAt, awscoops_database['createdAt'])
        self.assertEqual(updatedAt, awscoops_database['updatedAt'])
        self.assertEqual(members, awscoops_database['members'])
        self.assertEqual(status_code, HTTPStatus.CREATED.value)
        pm_awsAccountCoops.delete_awscoops(trace_id, id)

    def test_create_awscoops_error_access_authority(self):
        # Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = awscoops.create_awscoop_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_create_awscoops_project_error_record_zero(self):
        test_user_id = user_id.format(str(3))
        test_project_id = "not_exist"
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": test_project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = awscoops.create_awscoop_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_AWS_401['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_AWS_401['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

    def test_delete_awscoop_success(self):
        test_user_id = user_id.format(str(3))
        coop_id_delete = coop_id.format(str(999))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id_delete
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)

        response = awscoops.delete_awscoop_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NO_CONTENT)

        # Get data response
        status_code = response['statusCode']
        response_body = json.loads(response['body'])

        # Check data
        self.assertEqual(response_body, None)
        self.assertEqual(status_code, HTTPStatus.NO_CONTENT)

    def test_delete_awscoop_no_record(self):
        test_user_id = user_id.format(str(3))
        test_project_id = "not_exist"

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": test_project_id,
            "coop_id": coop_id.format(str(1))
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)

        response = awscoops.delete_awscoop_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_301['code'])
        self.assertEqual(response_body['message'], MsgConst.ERR_301['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND.value)

    def test_delete_awscoop_auth_error(self):
        test_user_id = user_id.format(str(0))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id.format(str(1))
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)

        response = awscoops.delete_awscoop_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_101['code'])
        self.assertEqual(response_body['message'], MsgConst.ERR_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_delete_awscoop_no_coop_record(self):
        test_user_id = user_id.format(str(3))
        test_coop_id = "not_exist"

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": test_coop_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)

        response = awscoops.delete_awscoop_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_301['code'])
        self.assertEqual(response_body['message'], MsgConst.ERR_301['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND.value)

    def test_get_awscoop_susscess_members_enable(self):
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id_members_enable
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = awscoops.get_awscoop_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        id = response_body["id"]
        awsAccount = response_body['awsAccount']
        roleName = response_body['roleName']
        externalId = response_body['externalId']
        projectId = response_body['projectId']
        organizationId = response_body['organizationId']
        description = response_body['description']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']
        members = response_body['members']

        # Get data in database
        awscoops_database = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, id, convert_response=True)

        # Check data
        self.assertEqual(id, awscoops_database['id'])
        self.assertEqual(awsAccount, awscoops_database['awsAccount'])
        self.assertEqual(roleName, awscoops_database['roleName'])
        self.assertEqual(externalId, awscoops_database['externalId'])
        self.assertEqual(projectId, awscoops_database['projectId'])
        self.assertEqual(organizationId, awscoops_database['organizationId'])
        self.assertEqual(description, awscoops_database['description'])
        self.assertEqual(createdAt, awscoops_database['createdAt'])
        self.assertEqual(updatedAt, awscoops_database['updatedAt'])
        self.assertEqual(members, awscoops_database['members'])
        self.assertEqual(status_code, HTTPStatus.OK.value)
        pm_awsAccountCoops.delete_awscoops(trace_id, id)

    def test_get_awscoop_susscess_members_disable(self):
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id.format(str(1))
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = awscoops.get_awscoop_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        id = response_body["id"]
        awsAccount = response_body['awsAccount']
        roleName = response_body['roleName']
        externalId = response_body['externalId']
        projectId = response_body['projectId']
        organizationId = response_body['organizationId']
        description = response_body['description']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']
        members = response_body['members']

        # Get data in database
        awscoops_database = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, id, convert_response=True)

        # Check data
        self.assertEqual(id, awscoops_database['id'])
        self.assertEqual(awsAccount, awscoops_database['awsAccount'])
        self.assertEqual(roleName, awscoops_database['roleName'])
        self.assertEqual(externalId, awscoops_database['externalId'])
        self.assertEqual(projectId, awscoops_database['projectId'])
        self.assertEqual(organizationId, awscoops_database['organizationId'])
        self.assertEqual(description, awscoops_database['description'])
        self.assertEqual(createdAt, awscoops_database['createdAt'])
        self.assertEqual(updatedAt, awscoops_database['updatedAt'])
        self.assertEqual(members, awscoops_database['members'])
        self.assertEqual(status_code, HTTPStatus.OK.value)
        pm_awsAccountCoops.delete_awscoops(trace_id, id)

    def test_get_awscoop_no_recored(self):
        test_user_id = user_id.format(str(3))
        test_project_id = "not_exist"

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": test_project_id,
            "coop_id": coop_id.format(str(1))
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = awscoops.get_awscoop_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_301['code'])
        self.assertEqual(response_body['message'], MsgConst.ERR_301['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND.value)

    def test_get_awscoop_auth_false(self):
        test_user_id = user_id.format(str(0))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id.format(str(1))
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = awscoops.get_awscoop_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_list_awscoops_susscess(self):
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"effective": "1"})
        response = awscoops.list_awscoops_handler(event_mock, {})
        response_body = json.loads(response['body'])
        self.assertEqual(response['statusCode'], HTTPStatus.OK)
        for item in response_body:
            id = item["id"]
            awsAccount = item['awsAccount']
            roleName = item['roleName']
            externalId = item['externalId']
            projectId = item['projectId']
            organizationId = item['organizationId']
            effective = item['effective']
            awsAccountName = item['awsAccountName']
            createdAt = item['createdAt']
            updatedAt = item['updatedAt']
            members = item['members']

            awscoops_database = pm_awsAccountCoops.query_awscoop_coop_key(
                trace_id, id, convert_response=True)

            # Check data
            self.assertEqual(id, awscoops_database['id'])
            self.assertEqual(awsAccount, awscoops_database['awsAccount'])
            self.assertEqual(roleName, awscoops_database['roleName'])
            self.assertEqual(externalId, awscoops_database['externalId'])
            self.assertEqual(projectId, awscoops_database['projectId'])
            self.assertEqual(organizationId, awscoops_database['organizationId'])
            self.assertEqual(effective, awscoops_database['effective'])
            self.assertEqual(awsAccountName, awscoops_database['awsAccountName'])
            self.assertEqual(createdAt, awscoops_database['createdAt'])
            self.assertEqual(updatedAt, awscoops_database['updatedAt'])
            self.assertEqual(members, awscoops_database['members'])

    def test_list_awscoops_susscess_no_effective_1(self):
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"effective": None})
        response = awscoops.list_awscoops_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.OK)

    def test_list_awscoops_susscess_no_effective_2(self):
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = awscoops.list_awscoops_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.OK)

    def test_list_awscoops_susscess_effective_is_連携未確認(self):
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"effective": "0"})
        response = awscoops.list_awscoops_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.OK)

    def test_list_awscoops_susscess_effective_is_連携失敗(self):
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"effective": "-1"})
        response = awscoops.list_awscoops_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.OK)

    def test_list_awscoops_get_list_no_recored(self):
        test_user_id = user_id.format(str(1))
        test_project_id = "not_exist"

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": test_project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"effective": "1"})
        response = awscoops.list_awscoops_handler(event_mock, {})

        # Check data
        self.assertEqual(response['body'], '[]')
        self.assertEqual(response['statusCode'], HTTPStatus.OK.value)

    def test_list_awscoops_susscess_error_authority(self):
        test_user_id = user_id.format(str(0))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"effective": "1"})
        response = awscoops.list_awscoops_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_update_awscoops_success_members_enable(self):
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id_members_enable
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(awscoops_body))
        response = awscoops.update_awscoop_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        id = response_body["id"]
        awsAccount = response_body['awsAccount']
        roleName = response_body['roleName']
        externalId = response_body['externalId']
        projectId = response_body['projectId']
        organizationId = response_body['organizationId']
        description = response_body['description']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']
        members = response_body['members']

        # Get data in database
        awscoops_database = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, id, convert_response=True)

        # Check data
        self.assertEqual(id, awscoops_database['id'])
        self.assertEqual(awsAccount, awscoops_database['awsAccount'])
        self.assertEqual(roleName, awscoops_database['roleName'])
        self.assertEqual(externalId, awscoops_database['externalId'])
        self.assertEqual(projectId, awscoops_database['projectId'])
        self.assertEqual(organizationId, awscoops_database['organizationId'])
        self.assertEqual(description, awscoops_database['description'])
        self.assertEqual(createdAt, awscoops_database['createdAt'])
        self.assertEqual(updatedAt, awscoops_database['updatedAt'])
        self.assertEqual(members, awscoops_database['members'])
        self.assertEqual(members, 1)
        self.assertEqual(status_code, HTTPStatus.OK.value)
        pm_awsAccountCoops.delete_awscoops(trace_id, id)

    def test_update_awscoops_success_members_disable(self):
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id.format(str(1))
        }
        tmp_awscoops_body = copy.copy(awscoops_body)
        tmp_awscoops_body['awsAccount'] = 'ERROR'
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_awscoops_body))
        response = awscoops.update_awscoop_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        id = response_body["id"]
        awsAccount = response_body['awsAccount']
        roleName = response_body['roleName']
        externalId = response_body['externalId']
        projectId = response_body['projectId']
        organizationId = response_body['organizationId']
        description = response_body['description']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']
        members = response_body['members']

        # Get data in database
        awscoops_database = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, id, convert_response=True)

        # Check data
        self.assertEqual(id, awscoops_database['id'])
        self.assertEqual(awsAccount, awscoops_database['awsAccount'])
        self.assertEqual(roleName, awscoops_database['roleName'])
        self.assertEqual(externalId, awscoops_database['externalId'])
        self.assertEqual(projectId, awscoops_database['projectId'])
        self.assertEqual(organizationId, awscoops_database['organizationId'])
        self.assertEqual(description, awscoops_database['description'])
        self.assertEqual(createdAt, awscoops_database['createdAt'])
        self.assertEqual(updatedAt, awscoops_database['updatedAt'])
        self.assertEqual(members, awscoops_database['members'])
        self.assertEqual(members, 0)
        self.assertEqual(status_code, HTTPStatus.OK.value)
        pm_awsAccountCoops.delete_awscoops(trace_id, id)

    def test_update_awscoops_error_access_authority(self):
        # Authority = 2
        test_user_id = user_id.format(str(2))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id.format(str(1))
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(awscoops_body))
        response = awscoops.update_awscoop_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_update_awscoops_error_record_zero(self):
        test_user_id = user_id.format(str(3))
        test_project_id = "not_exist"
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": test_project_id,
            "coop_id": coop_id.format(str(1))
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(awscoops_body))
        response = awscoops.update_awscoop_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_301['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_301['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.NOT_FOUND.value)

    def test_update_awscoops_error_parse_json(self):
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id.format(str(1))
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=awscoops_body)
        response = awscoops.update_awscoop_handler(event_mock, {})
        # Check data
        response_body = json.loads(response['body'])
        err_202 = MsgConst.ERR_REQUEST_202
        self.assertEqual(response_body['code'], err_202['code'])
        self.assertEqual(response_body['message'], err_202['message'])
        self.assertEqual(response_body['description'], err_202['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.BAD_REQUEST.value)

    def test_update_awscoops_error_validate_required(self):
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id.format(str(1))
        }
        tmp_awscoops_body = copy.copy(awscoops_body)
        tmp_awscoops_body['awsAccount'] = ''
        tmp_awscoops_body['roleName'] = ''
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_awscoops_body))
        response = awscoops.update_awscoop_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']

        # AWSアカウントID
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "awsAccount")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

        # ロール名
        self.assertEqual(response_error[1]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[1]['field'], "roleName")
        self.assertEqual(response_error[1]['value'], "")
        self.assertEqual(response_error[1]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_update_awscoops_error_validate_string_number(self):
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "coop_id": coop_id.format(str(1))
        }
        tmp_awscoops_body = copy.copy(awscoops_body)
        tmp_awscoops_body['awsAccount'] = 123
        tmp_awscoops_body['roleName'] = 456
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(tmp_awscoops_body))
        response = awscoops.update_awscoop_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']

        # AWSアカウントID
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_202['code'])
        self.assertEqual(response_error[0]['field'], "awsAccount")
        self.assertEqual(response_error[0]['value'], 123)
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_202['message'])

        # ロール名
        self.assertEqual(response_error[1]['code'],
                         MsgConst.ERR_VAL_202['code'])
        self.assertEqual(response_error[1]['field'], "roleName")
        self.assertEqual(response_error[1]['value'], 456)
        self.assertEqual(response_error[1]['message'],
                         MsgConst.ERR_VAL_202['message'])
