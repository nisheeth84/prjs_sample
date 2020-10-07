import unittest
import os
import copy

from dotenv import load_dotenv
from pathlib import Path
from premembers.organizations.batch import projects
from premembers.repository import pm_reports
from premembers.repository import pm_organizationTasks
from premembers.repository import pm_organizations, pm_projects
from premembers.repository import pm_awsAccountCoops
from premembers.common import common_utils
from premembers.repository.const import Status

trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
user_id = common_utils.get_uuid4()
mail_address = "test-user{}@example.com"
organization_id = "reports-78ee-11e7-89e6-OrganizationID"
organization_id_error = "reports-78ee-11e7-89e6-OrganizationID-error{}"
project_id = "reports-77f1-11e7-adfe-ProjectID"
project_id_error = "reports-77f1-11e7-adfe-ProjectID-error{}"
report_id = "reports-77f1-11e7-adfe-ReportID{}"
coop_id = "awscoops-77f1-11e7-adfe-CoopID{}"
log_id = "reports-77f1-11e7-adfe-LogID{}"
task_id = "reports-77f1-11e7-adfe-TaskID{}"

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
    "Status": 0,
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

awscoops_template = {
    "CoopID": coop_id.format(str(1)),
    "AWSAccount": "awsAccount",
    "AWSAccountName": "awsAccountName",
    "RoleName": "roleName",
    "ExternalID": "externalId",
    "Description": "description",
    "Effective": "effective",
    "OrganizationID": organization_id,
    "ProjectID": project_id
}

task_code = "DELETE_PRJ"
organization_task_template = {
    "TaskID": task_id,
    "Code": task_code,
    "Target": project_id,
    "UserID": user_id,
    "MailAddress": mail_address.format(str(0)),
    "TaskStatus": 0,
    "RetryCount": 1,
    "MaxRetry": 10,
}

report_log_template = {
    'ReportID': report_id,
    'LogID': log_id,
    'Code': "Code",
    'UserID': user_id,
    'MailAddress': mail_address.format(str(0)),
    'JobID': common_utils.get_uuid4(),
    'Parameter': None,
    'LogStreamName': None
}


class TestProjects(unittest.TestCase):
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
            awscoops_template["AWSAccountName"],
            awscoops_template["AWSAccount"], awscoops_template["RoleName"],
            awscoops_template["ExternalID"], awscoops_template["Description"],
            awscoops_template["Effective"],
            awscoops_template["OrganizationID"],
            awscoops_template["ProjectID"])

        num = 1
        while num < 7:
            # Create Report
            tmp_report = copy.copy(reports_template)
            pm_reports.create_report(
                trace_id, tmp_report['ReportID'].format(str(num)),
                tmp_report['ReportName'], tmp_report['GenerateUser'],
                tmp_report['AWSAccounts'], 4, tmp_report['ResourceInfoPath'],
                tmp_report['JsonOutputPath'], tmp_report['JsonOutputTime'],
                tmp_report['HTMLOutputStatus'], tmp_report['HTMLPath'],
                tmp_report['HTMLOutputTime'], 2, tmp_report['ExcelPath'],
                tmp_report['ExcelOutputTime'], tmp_report['SchemaVersion'],
                tmp_report['OrganizationID'], tmp_report['ProjectID'])

            # Create organization task
            tmp_organization_task = copy.copy(organization_task_template)
            tmp_organization_task['TaskStatus'] = num
            if (num == 3 and num == 6):
                tmp_organization_task['TaskStatus'] = 0
            elif (num == 4):
                tmp_organization_task['TaskStatus'] = -1
            elif (num == 5):
                tmp_organization_task['TaskStatus'] = -1
                tmp_organization_task[
                    'RetryCount'] = tmp_organization_task['MaxRetry'] + 1

            pm_organizationTasks.create_organizationTask(
                trace_id, tmp_organization_task['TaskID'].format(str(num)),
                tmp_organization_task['Code'],
                tmp_organization_task['Target'].format(str(num)),
                tmp_organization_task['UserID'],
                tmp_organization_task['MailAddress'],
                tmp_organization_task['TaskStatus'],
                tmp_organization_task['RetryCount'],
                tmp_organization_task['MaxRetry'])
            num += 1

        # create data error no project
        # Create Organization
        pm_organizations.create_organization(
            trace_id, organization_id_error.format(str(1)),
            organization_template['OrganizationName'],
            organization_template['Contract'],
            organization_template['ContractStatus'])
        # Create organization task
        tmp_organization_task = copy.copy(organization_task_template)
        pm_organizationTasks.create_organizationTask(
            trace_id, tmp_organization_task['TaskID'].format(str(7)),
            tmp_organization_task['Code'],
            project_id_error.format(str(1)),
            tmp_organization_task['UserID'],
            tmp_organization_task['MailAddress'],
            tmp_organization_task['TaskStatus'],
            tmp_organization_task['RetryCount'],
            tmp_organization_task['MaxRetry'])

        # create data error no awscoops and no reports
        # Create organization task
        tmp_organization_task = copy.copy(organization_task_template)
        pm_organizationTasks.create_organizationTask(
            trace_id, tmp_organization_task['TaskID'].format(str(8)),
            tmp_organization_task['Code'],
            project_id_error.format(str(1)),
            tmp_organization_task['UserID'],
            tmp_organization_task['MailAddress'],
            tmp_organization_task['TaskStatus'],
            tmp_organization_task['RetryCount'],
            tmp_organization_task['MaxRetry'])

        # Create Projects
        pm_projects.create_projects(trace_id, project_id_error.format(str(1)),
                                    projects_template['ProjectName'],
                                    projects_template['Description'],
                                    organization_id_error.format(str(1)))

        # create data error no reports
        # Create organization task
        tmp_organization_task = copy.copy(organization_task_template)
        pm_organizationTasks.create_organizationTask(
            trace_id, tmp_organization_task['TaskID'].format(str(9)),
            tmp_organization_task['Code'],
            project_id_error.format(str(1)),
            tmp_organization_task['UserID'],
            tmp_organization_task['MailAddress'],
            tmp_organization_task['TaskStatus'],
            tmp_organization_task['RetryCount'],
            tmp_organization_task['MaxRetry'])

        # Create awscoop
        pm_awsAccountCoops.create_awscoops(
            trace_id, coop_id.format(str(2)),
            awscoops_template["AWSAccount"],
            awscoops_template["AWSAccountName"],
            awscoops_template["RoleName"],
            awscoops_template["ExternalID"], awscoops_template["Description"],
            awscoops_template["Effective"],
            organization_id_error.format(str(1)),
            project_id_error.format(str(1)))

    def tearDown(self):
        num = 1
        while num < 7:
            pm_organizationTasks.delete(trace_id, task_id.format(str(num)))
            pm_reports.delete_reports(trace_id, report_id.format(str(num)))
            num += 1
        pm_organizationTasks.delete(trace_id, task_id.format(str(7)))
        pm_organizationTasks.delete(trace_id, task_id.format(str(8)))
        pm_organizationTasks.delete(trace_id, task_id.format(str(9)))
        pm_awsAccountCoops.delete_awscoops(trace_id, coop_id.format(str(1)))
        pm_awsAccountCoops.delete_awscoops(trace_id, coop_id.format(str(2)))
        pm_projects.delete_projects(trace_id, project_id)
        pm_projects.delete_projects(trace_id, project_id_error.format(str(1)))
        pm_organizations.delete_organization(trace_id, organization_id)
        pm_organizations.delete_organization(
            trace_id, organization_id_error.format(str(1)))

    def test_batch_delete_project_susscess(self):
        # handler
        event_mock = {
            'TaskId': task_id.format(str(3)),
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        projects.execute_delete_project_handler(event_mock, {})

        # Get data in database
        project_task = pm_organizationTasks.query_key(
            task_id.format(str(3)))

        # Check data
        self.assertEqual(
            int(project_task['TaskStatus']), Status.Done.value)

    def test_batch_delete_project_error_status_task(self):
        # Status = 1 Running
        event_mock = {
            'TaskId': task_id.format(str(1)),
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        projects.execute_delete_project_handler(event_mock, {})
        # Get data in database
        project_task = pm_organizationTasks.query_key(
            task_id.format(str(1)))
        # Check data
        self.assertEqual(project_task['TaskStatus'], Status.Error.value)

        # Status = 2 Done
        event_mock['TaskId'] = task_id.format(str(2))
        projects.execute_delete_project_handler(event_mock, {})
        # Get data in database
        project_task = pm_organizationTasks.query_key(
            task_id.format(str(2)))
        # Check data
        self.assertEqual(project_task['TaskStatus'], Status.Error.value)

        # Status = -1 ERROR and RetryCount > MaxRetry
        event_mock['TaskId'] = task_id.format(str(5))
        projects.execute_delete_project_handler(event_mock, {})
        # Get data in database
        project_task = pm_organizationTasks.query_key(
            task_id.format(str(5)))
        # Check data
        self.assertEqual(project_task['TaskStatus'], Status.Error.value)

    def test_batch_delete_project_error_get_awscoops(self):
        event_mock = {
            'TaskId': task_id.format(str(8)),
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        projects.execute_delete_project_handler(event_mock, {})
        # Get data in database
        project_task = pm_organizationTasks.query_key(
            task_id.format(str(8)))
        # Check data
        self.assertEqual(project_task['TaskStatus'], Status.Done.value)

    def test_batch_delete_project_error_get_reports(self):
        event_mock = {
            'TaskId': task_id.format(str(9)),
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        projects.execute_delete_project_handler(event_mock, {})
        # Get data in database
        project_task = pm_organizationTasks.query_key(
            task_id.format(str(9)))
        # Check data
        self.assertEqual(project_task['TaskStatus'], Status.Done.value)
