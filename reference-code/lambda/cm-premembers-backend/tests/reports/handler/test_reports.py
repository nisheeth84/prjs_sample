import unittest
import os
import json
import copy

from http import HTTPStatus
from dotenv import load_dotenv
from pathlib import Path
from premembers.reports.handler import reports
from premembers.repository import pm_affiliation, pm_organizations, pm_projects
from premembers.repository import pm_reports, pm_batchJobDefs
from tests import event_create
from premembers.const.msg_const import MsgConst

trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
mail_address = "test-user{}@example.com"
user_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada{}"
organization_id = "reports-78ee-11e7-89e6-OrganizationID"
project_id = "reports-77f1-11e7-adfe-ProjectID"
report_id = "reports-77f1-11e7-adfe-ReportID{}"

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

reports_template = {
    "ReportID": report_id,
    "ReportName": "reportName",
    "GenerateUser": mail_address.format(str(0)),
    "AWSAccounts": ["awsAccounts1", "awsAccounts2", "awsAccounts3"],
    "ReportStatus": 0,
    "ResourceInfoPath": "resourceInfoPathid",
    "JsonOutputPath": "jsonOutputPath",
    "JsonOutputTime": "jsonOutputTimeid",
    "HTMLOutputStatus": 0,
    "HTMLPath": "htmlPath",
    "HTMLOutputTime": "htmlOutputTime",
    "ExcelOutputStatus": 0,
    "ExcelPath": "7659CD67-03C1-423D-BDDA-6B7C5AF8B247/report/ja-JP/TESTREPORT.xlsx",
    "ExcelOutputTime": "excelOutputTime",
    "SchemaVersion": 1,
    "OrganizationID": organization_id,
    "ProjectID": project_id
}

code_aws = "COLLECT_AWS_RESOURCE_INFO"
job_definition_aws = "arn:aws:batch:ap-northeast-1:216054658829:job-definition/premembers-report-batch-collect-aws-resource-info:2"
code_json = "OUTPUT_REPORT_JSON"
job_definition_json = "arn:aws:batch:ap-northeast-1:216054658829:job-definition/premembers-report-batch-output-report-json:1"
code_excel = "OUTPUT_REPORT_EXCEL"
job_definition_excel = "arn:aws:batch:ap-northeast-1:216054658829:job-definition/premembers-report-batch-output-report-excel:1"

report_job_def_aws = {
    "Code": "Code",
    "JobDefinition": "JobDefinition",
    "JobQueue": "arn:aws:batch:ap-northeast-1:216054658829:job-queue/premembers-batch-job-queue",
    "Environment": {},
    "MaxRetry": 3
}

report_create = {
    "name": "report_name_test001",
    "awsAccounts": [
        "awsAccounts_test"
    ],
    "outputFileType": "EXCEL"
}

report_create_empty = {
    "name": "",
    "awsAccounts": [],
    "outputFileType": ""
}

report_create_error_data = {
    "name": 123,
    "awsAccounts": 456,
    "outputFileType": "PDF"
}


class TestReports(unittest.TestCase):
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

        # Create ReportJobDefs
        num = 1
        while num < 4:
            if num == 1:
                report_job_def_aws['Code'] = code_aws
                report_job_def_aws['JobDefinition'] = job_definition_aws
            elif num == 2:
                report_job_def_aws['Code'] = code_json
                report_job_def_aws['JobDefinition'] = job_definition_json
            else:
                report_job_def_aws['Code'] = code_excel
                report_job_def_aws['JobDefinition'] = job_definition_excel
            pm_batchJobDefs.create_report_job_def(
                trace_id, report_job_def_aws['Code'],
                report_job_def_aws['JobDefinition'],
                report_job_def_aws['JobQueue'], report_job_def_aws['MaxRetry'],
                report_job_def_aws['Environment'])
            num += 1

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
            # Create list reports
            tmp_report = copy.copy(reports_template)
            tmp_report['ReportStatus'] = num + 1
            pm_reports.create_report(
                trace_id, tmp_report['ReportID'].format(str(num)),
                tmp_report['ReportName'], tmp_report['GenerateUser'],
                tmp_report['AWSAccounts'], tmp_report['ReportStatus'],
                tmp_report['ResourceInfoPath'], tmp_report['JsonOutputPath'],
                tmp_report['JsonOutputTime'], tmp_report['HTMLOutputStatus'],
                tmp_report['HTMLPath'], tmp_report['HTMLOutputTime'],
                tmp_report['ExcelOutputStatus'], tmp_report['ExcelPath'],
                tmp_report['ExcelOutputTime'], tmp_report['SchemaVersion'],
                tmp_report['OrganizationID'], tmp_report['ProjectID'])
            num += 1

        pm_reports.create_report(
            trace_id, tmp_report['ReportID'].format(str(4)),
            tmp_report['ReportName'], tmp_report['GenerateUser'],
            tmp_report['AWSAccounts'], 4, tmp_report['ResourceInfoPath'],
            tmp_report['JsonOutputPath'], tmp_report['JsonOutputTime'],
            tmp_report['HTMLOutputStatus'], tmp_report['HTMLPath'],
            tmp_report['HTMLOutputTime'], 2, tmp_report['ExcelPath'],
            tmp_report['ExcelOutputTime'], tmp_report['SchemaVersion'],
            tmp_report['OrganizationID'], tmp_report['ProjectID'])
        pm_reports.create_report(
            trace_id, tmp_report['ReportID'].format(str(5)),
            tmp_report['ReportName'], tmp_report['GenerateUser'],
            tmp_report['AWSAccounts'], 4, tmp_report['ResourceInfoPath'],
            tmp_report['JsonOutputPath'], tmp_report['JsonOutputTime'],
            tmp_report['HTMLOutputStatus'], tmp_report['HTMLPath'],
            tmp_report['HTMLOutputTime'], 1, tmp_report['ExcelPath'],
            tmp_report['ExcelOutputTime'], tmp_report['SchemaVersion'],
            tmp_report['OrganizationID'], tmp_report['ProjectID'])
        pm_reports.create_report(
            trace_id, tmp_report['ReportID'].format(str(6)),
            tmp_report['ReportName'], tmp_report['GenerateUser'],
            tmp_report['AWSAccounts'], 2, tmp_report['ResourceInfoPath'],
            tmp_report['JsonOutputPath'], tmp_report['JsonOutputTime'],
            tmp_report['HTMLOutputStatus'], tmp_report['HTMLPath'],
            tmp_report['HTMLOutputTime'], 2, tmp_report['ExcelPath'],
            tmp_report['ExcelOutputTime'], tmp_report['SchemaVersion'],
            tmp_report['OrganizationID'], tmp_report['ProjectID'])

    def tearDown(self):
        num = 1
        while num < 4:
            pm_affiliation.delete_affiliation(
                user_id.format(str(num)), organization_id)
            pm_reports.delete_reports(trace_id, report_id.format(str(num)))
            num += 1
        pm_projects.delete_projects(trace_id, project_id)
        pm_organizations.delete_organization(trace_id, organization_id)
        # Delete ReportJobDefs
        pm_batchJobDefs.delete_report_job_def(trace_id, code_aws)
        pm_batchJobDefs.delete_report_job_def(trace_id, code_json)
        pm_batchJobDefs.delete_report_job_def(trace_id, code_excel)
        pm_reports.delete_reports(trace_id, report_id.format(str(4)))
        pm_reports.delete_reports(trace_id, report_id.format(str(5)))
        pm_reports.delete_reports(trace_id, report_id.format(str(6)))

    def test_list_reports_susscess(self):
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = reports.list_reports_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.OK)
        response_body = json.loads(response['body'])
        response_body = json.loads(response['body'])
        for item in response_body:
            id = item["id"]
            reportName = item['name']
            generateUser = item['generateUser']
            awsAccounts = item['awsAccounts']
            status = item['status']
            jsonOutputTime = item['jsonOutputTime']
            htmlOutputStatus = item['htmlOutputStatus']
            htmlOutputTime = item['htmlOutputTime']
            excelOutputStatus = item['excelOutputStatus']
            excelOutputTime = item['excelOutputTime']
            schemaVersion = item['schemaVersion']
            organizationID = item['organizationId']
            projectID = item['projectId']
            createdAt = item['createdAt']
            updatedAt = item['updatedAt']

            report_database = pm_reports.query_report(
                trace_id, id, convert_response=True)

            # Check data
            self.assertEqual(id, report_database['id'])
            self.assertEqual(reportName, report_database['name'])
            self.assertEqual(generateUser, report_database['generateUser'])
            self.assertEqual(awsAccounts, report_database['awsAccounts'])
            self.assertEqual(status, report_database['status'])
            self.assertEqual(jsonOutputTime, report_database['jsonOutputTime'])
            self.assertEqual(htmlOutputStatus,
                             report_database['htmlOutputStatus'])
            self.assertEqual(htmlOutputTime, report_database['htmlOutputTime'])
            self.assertEqual(excelOutputStatus,
                             report_database['excelOutputStatus'])
            self.assertEqual(excelOutputTime,
                             report_database['excelOutputTime'])
            self.assertEqual(schemaVersion, report_database['schemaVersion'])
            self.assertEqual(organizationID, report_database['organizationId'])
            self.assertEqual(projectID, report_database['projectId'])
            self.assertEqual(createdAt, report_database['createdAt'])
            self.assertEqual(updatedAt, report_database['updatedAt'])

    def test_list_reports_get_list_no_recored(self):
        test_user_id = user_id.format(str(1))
        test_project_id = "not_exist"

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": test_project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = reports.list_reports_handler(event_mock, {})

        # Check data
        self.assertEqual(response['body'], '[]')
        self.assertEqual(response['statusCode'], HTTPStatus.OK.value)

    def test_list_reports_susscess_error_authority(self):
        test_user_id = user_id.format(str(0))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = reports.list_reports_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_get_report_success(self):
        test_user_id = user_id.format(str(1))
        test_report_id = report_id.format(str(1))
        test_organization_id = organization_id
        test_project_id = project_id

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = reports.get_report_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        id = response_body["id"]
        reportName = response_body['name']
        generateUser = response_body['generateUser']
        awsAccounts = response_body['awsAccounts']
        status = response_body['status']
        resourceInfoPath = response_body['resourceInfoPath']
        jsonOutputPath = response_body['jsonOutputPath']
        jsonOutputTime = response_body['jsonOutputTime']
        htmlOutputStatus = response_body['htmlOutputStatus']
        htmlPath = response_body['htmlPath']
        htmlOutputTime = response_body['htmlOutputTime']
        excelOutputStatus = response_body['excelOutputStatus']
        excelPath = response_body['excelPath']
        excelOutputTime = response_body['excelOutputTime']
        schemaVersion = response_body['schemaVersion']
        organizationID = response_body['organizationId']
        projectID = response_body['projectId']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']

        # Get data in database
        report_database = pm_reports.query_report(
            trace_id, id, convert_response=True)

        # Check data
        self.assertEqual(id, report_database['id'])
        self.assertEqual(reportName, report_database['name'])
        self.assertEqual(generateUser, report_database['generateUser'])
        self.assertEqual(awsAccounts, report_database['awsAccounts'])
        self.assertEqual(status, report_database['status'])
        self.assertEqual(resourceInfoPath, report_database['resourceInfoPath'])
        self.assertEqual(jsonOutputPath, report_database['jsonOutputPath'])
        self.assertEqual(jsonOutputTime, report_database['jsonOutputTime'])
        self.assertEqual(htmlOutputStatus, report_database['htmlOutputStatus'])
        self.assertEqual(htmlPath, report_database['htmlPath'])
        self.assertEqual(htmlOutputTime, report_database['htmlOutputTime'])
        self.assertEqual(excelOutputStatus,
                         report_database['excelOutputStatus'])
        self.assertEqual(excelPath, report_database['excelPath'])
        self.assertEqual(excelOutputTime, report_database['excelOutputTime'])
        self.assertEqual(schemaVersion, report_database['schemaVersion'])
        self.assertEqual(organizationID, report_database['organizationId'])
        self.assertEqual(projectID, report_database['projectId'])
        self.assertEqual(createdAt, report_database['createdAt'])
        self.assertEqual(updatedAt, report_database['updatedAt'])
        self.assertEqual(status_code, HTTPStatus.OK.value)

    def test_get_report_no_project_record(self):
        test_user_id = user_id.format(str(1))
        test_project_id = "not_exist"

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": test_project_id,
            "report_id": report_id.format(str(1))
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = reports.get_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_301['code'])
        self.assertEqual(response_body['message'], MsgConst.ERR_301['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND.value)

    def test_get_report_auth_false(self):
        test_user_id = user_id.format(str(0))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "report_id": report_id.format(str(1))
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = reports.get_report_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_delete_report_success(self):
        test_mail_address = mail_address.format(str(2))
        test_user_id = user_id.format(str(2))
        test_report_id = report_id.format(str(1))
        test_organization_id = organization_id
        test_project_id = project_id

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = reports.delete_report_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NO_CONTENT)

    def test_delete_report_no_project_record(self):
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))
        test_report_id = report_id.format(str(1))
        test_organization_id = organization_id
        test_project_id = "no record"

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = reports.delete_report_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_delete_report_no_report_record(self):
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))
        test_report_id = report_id.format(str(0))
        test_organization_id = organization_id
        test_project_id = test_report_id

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = reports.delete_report_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_delete_report_authorization_false(self):
        test_mail_address = mail_address.format(str(1))
        test_user_id = user_id.format(str(1))
        test_report_id = report_id.format(str(1))
        test_organization_id = organization_id
        test_project_id = project_id

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id)
        response = reports.delete_report_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_create_report_success(self):
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(report_create))
        response = reports.create_report_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        id = response_body["id"]
        name = response_body['name']
        generateUser = response_body['generateUser']
        awsAccounts = response_body['awsAccounts']
        status = response_body['status']
        jsonOutputTime = response_body['jsonOutputTime']
        excelOutputStatus = response_body['excelOutputStatus']
        excelOutputTime = response_body['excelOutputTime']
        schemaVersion = response_body['schemaVersion']
        projectId = response_body['projectId']
        organizationId = response_body['organizationId']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']

        # Get data in database
        report_database = pm_reports.query_report(
            trace_id, id, convert_response=True)

        # Check data
        self.assertEqual(id, report_database['id'])
        self.assertEqual(name, report_database['name'])
        self.assertEqual(generateUser, report_database['generateUser'])
        self.assertEqual(awsAccounts, report_database['awsAccounts'])
        self.assertEqual(status, report_database['status'])
        self.assertEqual(jsonOutputTime, report_database['jsonOutputTime'])
        self.assertEqual(excelOutputStatus, report_database['excelOutputStatus'])
        self.assertEqual(excelOutputTime, report_database['excelOutputTime'])
        self.assertEqual(schemaVersion, report_database['schemaVersion'])
        self.assertEqual(projectId, report_database['projectId'])
        self.assertEqual(organizationId, report_database['organizationId'])
        self.assertEqual(createdAt, report_database['createdAt'])
        self.assertEqual(updatedAt, report_database['updatedAt'])
        self.assertEqual(status_code, HTTPStatus.CREATED.value)
        pm_reports.delete_reports(trace_id, id)

    def test_create_report_error_access_authority(self):
        # Authority = 1
        tmp_mail_address = mail_address.format(str(1))
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            email=tmp_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(report_create))
        response = reports.create_report_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_create_report_project_error_record_zero(self):
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))
        test_project_id = "not_exist"
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": test_project_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(report_create))
        response = reports.create_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_AWS_401['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_AWS_401['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

    def test_create_report_error_parse_json(self):
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=report_create)
        response = reports.create_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_202['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_202['message'])
        self.assertEqual(response_body['description'],
                         MsgConst.ERR_REQUEST_202['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.BAD_REQUEST.value)

    def test_create_report_error_validate_required(self):
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(report_create_empty))
        response = reports.create_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        # レポート名
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "name")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

        # AWSアカウントID
        self.assertEqual(response_error[1]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[1]['field'], "awsAccounts")
        self.assertEqual(response_error[1]['value'], [])
        self.assertEqual(response_error[1]['message'],
                         MsgConst.ERR_VAL_101['message'])

        # レポート出力するファイル形式
        self.assertEqual(response_error[2]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[2]['field'], "outputFileType")
        self.assertEqual(response_error[2]['value'], "")
        self.assertEqual(response_error[2]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_create_report_error_validate_data(self):
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(report_create_error_data))
        response = reports.create_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        # レポート名
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_202['code'])
        self.assertEqual(response_error[0]['field'], "name")
        self.assertEqual(response_error[0]['value'],
                         report_create_error_data['name'])
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_202['message'])

        # AWSアカウントID
        self.assertEqual(response_error[1]['code'],
                         MsgConst.ERR_VAL_204['code'])
        self.assertEqual(response_error[1]['field'], "awsAccounts")
        self.assertEqual(response_error[1]['value'],
                         report_create_error_data['awsAccounts'])
        self.assertEqual(response_error[1]['message'],
                         MsgConst.ERR_VAL_204['message'])

        # レポート出力するファイル形式
        self.assertEqual(response_error[2]['code'],
                         MsgConst.ERR_VAL_302['code'])
        self.assertEqual(response_error[2]['field'], "outputFileType")
        self.assertEqual(response_error[2]['value'],
                         report_create_error_data['outputFileType'])
        self.assertEqual(response_error[2]['message'],
                         MsgConst.ERR_VAL_302['message'].format("EXCEL"))

    def test_create_report_error_record_zero_report_job_defs_aws(self):
        pm_batchJobDefs.delete_report_job_def(trace_id, code_aws)
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(report_create))
        response = reports.create_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_402['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_402['message'])
        self.assertEqual(response_body['description'],
                         MsgConst.ERR_402['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

        # Create ReportJobDefs
        report_job_def_aws['Code'] = code_aws
        report_job_def_aws['JobDefinition'] = job_definition_aws
        pm_batchJobDefs.create_report_job_def(
            trace_id, report_job_def_aws['Code'],
            report_job_def_aws['JobDefinition'],
            report_job_def_aws['JobQueue'], report_job_def_aws['MaxRetry'],
            report_job_def_aws['Environment'])

    def test_create_report_error_record_zero_report_job_defs_json(self):
        pm_batchJobDefs.delete_report_job_def(trace_id, code_json)
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(report_create))
        response = reports.create_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_402['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_402['message'])
        self.assertEqual(response_body['description'],
                         MsgConst.ERR_402['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

        # Create ReportJobDefs
        report_job_def_aws['Code'] = code_json
        report_job_def_aws['JobDefinition'] = job_definition_json
        pm_batchJobDefs.create_report_job_def(
            trace_id, report_job_def_aws['Code'],
            report_job_def_aws['JobDefinition'],
            report_job_def_aws['JobQueue'], report_job_def_aws['MaxRetry'],
            report_job_def_aws['Environment'])

    def test_create_report_error_record_zero_report_job_defs_excel(self):
        pm_batchJobDefs.delete_report_job_def(trace_id, code_excel)
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(report_create))
        response = reports.create_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_402['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_402['message'])
        self.assertEqual(response_body['description'],
                         MsgConst.ERR_402['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

        # Create ReportJobDefs
        report_job_def_aws['Code'] = code_excel
        report_job_def_aws['JobDefinition'] = job_definition_excel
        pm_batchJobDefs.create_report_job_def(
            trace_id, report_job_def_aws['Code'],
            report_job_def_aws['JobDefinition'],
            report_job_def_aws['JobQueue'], report_job_def_aws['MaxRetry'],
            report_job_def_aws['Environment'])

    def test_get_report_url_success(self):
        test_user_id = user_id.format(str(2))
        test_report_id = report_id.format(str(4))
        test_organization_id = organization_id
        test_project_id = project_id

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            query_string_parameters={"fileType": "EXCEL"},
            trace_id=test_user_id)
        response = reports.get_report_url_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.OK)

    def test_get_report_url_authorization_false(self):
        test_user_id = user_id.format(str(0))
        test_report_id = report_id.format(str(4))
        test_organization_id = organization_id
        test_project_id = project_id

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            query_string_parameters={"fileType": "EXCEL"},
            trace_id=test_user_id)
        response = reports.get_report_url_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_get_report_url_file_type_false(self):
        test_user_id = user_id.format(str(2))
        test_report_id = report_id.format(str(4))
        test_organization_id = organization_id
        test_project_id = project_id

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            query_string_parameters={"fileType": "HTML"},
            trace_id=test_user_id)
        response = reports.get_report_url_handler(event_mock, {})
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)

    def test_get_report_url_no_project(self):
        test_user_id = user_id.format(str(2))
        test_report_id = report_id.format(str(4))
        test_organization_id = organization_id
        test_project_id = "no project"

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            query_string_parameters={"fileType": "EXCEL"},
            trace_id=test_user_id)
        response = reports.get_report_url_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_get_report_url_no_report(self):
        test_user_id = user_id.format(str(2))
        test_report_id = report_id.format(str(999))
        test_organization_id = organization_id
        test_project_id = project_id

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            query_string_parameters={"fileType": "EXCEL"},
            trace_id=test_user_id)
        response = reports.get_report_url_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_get_report_url_report_excel_status_export_not_finish(self):
        test_user_id = user_id.format(str(2))
        test_report_id = report_id.format(str(5))
        test_organization_id = organization_id
        test_project_id = project_id

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            query_string_parameters={"fileType": "EXCEL"},
            trace_id=test_user_id)
        response = reports.get_report_url_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_get_report_url_report_status_convert_not_finish(self):
        test_user_id = user_id.format(str(2))
        test_report_id = report_id.format(str(6))
        test_organization_id = organization_id
        test_project_id = project_id

        # handler
        path_parameters = {
            "organization_id": test_organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            query_string_parameters={"fileType": "EXCEL"},
            trace_id=test_user_id)
        response = reports.get_report_url_handler(event_mock, {})
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_export_report_success(self):
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))
        test_report_id = report_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"fileType": "EXCEL"})
        response = reports.request_output_report_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        self.assertEqual(status_code, HTTPStatus.CREATED.value)

    def test_export_report_error_access_authority(self):
        # Authority = 2
        tmp_mail_address = mail_address.format(str(1))
        test_user_id = user_id.format(str(1))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "report_id": report_id.format(str(1)),
        }
        event_mock = event_create.get_event_object(
            email=tmp_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"fileType": "EXCEL"},
            body=json.dumps(report_create))
        response = reports.request_output_report_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_export_report_error_validate_required(self):
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))
        test_report_id = report_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"fileType": ""})
        response = reports.request_output_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        # レポート出力するファイル形式
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "fileType")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_export_report_error_validate_data(self):
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))
        test_report_id = report_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"fileType": "JSON"},
            body=json.dumps(report_create))
        response = reports.request_output_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        # レポート出力するファイル形式
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_302['code'])
        self.assertEqual(response_error[0]['field'], "fileType")
        self.assertEqual(response_error[0]['value'], "JSON")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_302['message'].format("EXCEL"))

    def test_export_report_project_error_record_zero(self):
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))
        test_report_id = report_id.format(str(3))

        # Not exist project
        test_project_id = "not_exist"
        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": test_project_id,
            "report_id": test_report_id,
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"fileType": "EXCEL"})
        response = reports.request_output_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_301['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_301['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.NOT_FOUND.value)

        # Not exist report
        # handler
        report_id_not_exits = "not_exist"
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "report_id": report_id_not_exits,
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"fileType": "EXCEL"})
        response = reports.request_output_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_301['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_301['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.NOT_FOUND.value)

        # Status != 4
        # handler
        test_report_id = report_id.format(str(2))
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "report_id": test_report_id
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"fileType": "EXCEL"})
        response = reports.request_output_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], MsgConst.ERR_301['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_301['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.NOT_FOUND.value)

    def test_export_report_error_record_zero_report_job_defs_excel(self):
        pm_batchJobDefs.delete_report_job_def(trace_id, code_excel)
        test_mail_address = mail_address.format(str(3))
        test_user_id = user_id.format(str(3))

        # handler
        path_parameters = {
            "organization_id": organization_id,
            "project_id": project_id,
            "report_id": report_id.format(str(3)),
        }
        event_mock = event_create.get_event_object(
            email=test_mail_address,
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={"fileType": "EXCEL"})
        response = reports.request_output_report_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_402['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_402['message'])
        self.assertEqual(response_body['description'],
                         MsgConst.ERR_402['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

        # Create ReportJobDefs
        report_job_def_aws['Code'] = code_excel
        report_job_def_aws['JobDefinition'] = job_definition_excel
        pm_batchJobDefs.create_report_job_def(
            trace_id, report_job_def_aws['Code'],
            report_job_def_aws['JobDefinition'],
            report_job_def_aws['JobQueue'], report_job_def_aws['MaxRetry'],
            report_job_def_aws['Environment'])
