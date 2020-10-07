import unittest
import os
import copy

from dotenv import load_dotenv
from pathlib import Path
from premembers.reports.batch import reports
from premembers.repository import pm_reports
from premembers.repository import pm_organizationTasks
from premembers.common import common_utils
from premembers.repository.const import Status

trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
user_id = common_utils.get_uuid4()
mail_address = "test-user{}@example.com"
organization_id = "reports-78ee-11e7-89e6-OrganizationID"
project_id = "reports-77f1-11e7-adfe-ProjectID"
report_id = "reports-77f1-11e7-adfe-ReportID{}"
log_id = "reports-77f1-11e7-adfe-LogID{}"
task_id = "reports-77f1-11e7-adfe-TaskID{}"

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

task_code = "DELETE_REPORT"
organization_task_template = {
    "TaskID": task_id,
    "Code": task_code,
    "Target": report_id,
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


class TestReports(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)

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
                tmp_organization_task['RetryCount'] = tmp_organization_task['MaxRetry'] + 1

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

    def tearDown(self):
        num = 1
        while num < 7:
            pm_organizationTasks.delete(trace_id, task_id.format(str(num)))
            pm_reports.delete_reports(trace_id, report_id.format(str(num)))
            num += 1

    def test_batch_delete_reports_susscess(self):
        # Status = 0 Waiting
        event_mock = {
            'TaskId': task_id.format(str(3)),
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        reports.execute_delete_report_handler(event_mock, {})
        # Get data in database
        organization_task = pm_organizationTasks.query_key(task_id.format(str(3)))
        # Check data
        self.assertEqual(int(organization_task['TaskStatus']), Status.Done.value)

        # Status = 4 ERROR and RetryCount < MaxRetry
        event_mock['TaskId'] = task_id.format(str(4))
        reports.execute_delete_report_handler(event_mock, {})
        # Get data in database
        organization_task = pm_organizationTasks.query_key(task_id.format(str(4)))
        # Check data
        self.assertEqual(organization_task['TaskStatus'], Status.Done.value)

    def test_batch_delete_reports_error_status_task(self):
        # Status = 1 Running
        event_mock = {
            'TaskId': task_id.format(str(1)),
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        reports.execute_delete_report_handler(event_mock, {})
        # Get data in database
        organization_task = pm_organizationTasks.query_key(task_id.format(str(1)))
        # Check data
        self.assertEqual(organization_task['TaskStatus'], Status.Error.value)

        # Status = 2 Done
        event_mock['TaskId'] = task_id.format(str(2))
        reports.execute_delete_report_handler(event_mock, {})
        # Get data in database
        organization_task = pm_organizationTasks.query_key(task_id.format(str(2)))
        # Check data
        self.assertEqual(organization_task['TaskStatus'], Status.Error.value)

        # Status = -1 ERROR and RetryCount > MaxRetry
        event_mock['TaskId'] = task_id.format(str(5))
        reports.execute_delete_report_handler(event_mock, {})
        # Get data in database
        organization_task = pm_organizationTasks.query_key(task_id.format(str(5)))
        # Check data
        self.assertEqual(organization_task['TaskStatus'], Status.Error.value)
