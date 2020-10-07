import unittest
import os
import copy

from premembers.repository import pm_organizationTasks
from premembers.exception.pm_exceptions import NoRetryException
from dotenv import load_dotenv
from pathlib import Path

trace_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada"
task_id = "reports-77f1-11e7-adfe-TaskID{}"
organization_task_template = {
    "TaskID": task_id,
    "Code": "DELETE_REPORT",
    "Target": "reports-77f1-11e7-adfe-ReportID1",
    "UserID": "user_id",
    "MailAddress": "test-user@example.com",
    "TaskStatus": 0,
    "RetryCount": 1,
    "MaxRetry": 10,
}

update_organization_task = {
    "TaskID": task_id.format(str(1)),
    "Code": "update_delete_report",
    "Target": "update_reports-77f1-11e7-adfe-ReportID1",
    "UserID": "update_user_id",
    "MailAddress": "update_test-user@example.com",
    "TaskStatus": 1,
    "RetryCount": 2,
    "MaxRetry": 11,
}


class TestOraganizationTasks(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)

        num = 1
        while num < 3:
            # Create organization task
            tmp_organization_task = copy.copy(organization_task_template)
            pm_organizationTasks.create_organizationTask(
                trace_id, tmp_organization_task['TaskID'].format(str(num)),
                tmp_organization_task['Code'],
                tmp_organization_task['Target'],
                tmp_organization_task['UserID'],
                tmp_organization_task['MailAddress'],
                tmp_organization_task['TaskStatus'],
                tmp_organization_task['RetryCount'],
                tmp_organization_task['MaxRetry'])
            num += 1

    def tearDown(self):
        num = 1
        while num < 3:
            # delete organization task
            pm_organizationTasks.delete(trace_id, task_id.format(str(num)))
            num += 1

    def organizationTask_result_check(self, actual_organization,
                                      expected_organization):
        self.assertEqual(actual_organization['TaskID'],
                         expected_organization['TaskID'])
        self.assertEqual(actual_organization['Code'],
                         expected_organization['Code'])
        self.assertEqual(actual_organization['Target'],
                         expected_organization['Target'])
        self.assertEqual(actual_organization['UserID'],
                         expected_organization['UserID'])
        self.assertEqual(actual_organization['MailAddress'],
                         expected_organization['MailAddress'])
        self.assertEqual(actual_organization['TaskStatus'],
                         expected_organization['TaskStatus'])
        self.assertEqual(actual_organization['RetryCount'],
                         expected_organization['RetryCount'])
        self.assertEqual(actual_organization['MaxRetry'],
                         expected_organization['MaxRetry'])

    def test_create_success(self):
        tmp_organization_task = copy.copy(organization_task_template)
        tmp_organization_task['TaskID'] = task_id.format(str(3))
        pm_organizationTasks.create_organizationTask(
            trace_id, tmp_organization_task['TaskID'],
            tmp_organization_task['Code'],
            tmp_organization_task['Target'],
            tmp_organization_task['UserID'],
            tmp_organization_task['MailAddress'],
            tmp_organization_task['TaskStatus'],
            tmp_organization_task['RetryCount'],
            tmp_organization_task['MaxRetry'])
        insert_result = pm_organizationTasks.query_key(task_id.format(str(3)))
        self.organizationTask_result_check(
            actual_organization=insert_result,
            expected_organization=tmp_organization_task)
        pm_organizationTasks.delete(trace_id, task_id.format(str(3)))

    def test_create_exception(self):
        with self.assertRaises(NoRetryException):
            # Duplicate Task ID
            tmp_organization_task = copy.copy(organization_task_template)
            pm_organizationTasks.create_organizationTask(
                trace_id, tmp_organization_task['TaskID'].format(str(1)),
                tmp_organization_task['Code'],
                tmp_organization_task['Target'],
                tmp_organization_task['UserID'],
                tmp_organization_task['MailAddress'],
                tmp_organization_task['TaskStatus'],
                tmp_organization_task['RetryCount'],
                tmp_organization_task['MaxRetry'])

    def test_query_key_success(self):
        tmp_organization_task = copy.copy(organization_task_template)
        tmp_organization_task['TaskID'] = task_id.format(str(1))
        insert_result = pm_organizationTasks.query_key(task_id.format(str(1)))
        self.organizationTask_result_check(
            actual_organization=insert_result,
            expected_organization=tmp_organization_task)

    def test_update_success(self):
        tasks_result = pm_organizationTasks.query_key(task_id.format(str(1)))
        updated_at = tasks_result['UpdatedAt']
        attribute = {
            'Code': {
                "Value": update_organization_task['Code']
            },
            'Target': {
                "Value": update_organization_task['Target']
            },
            'UserID': {
                "Value": update_organization_task['UserID']
            },
            'MailAddress': {
                "Value": update_organization_task['MailAddress']
            },
            'TaskStatus': {
                "Value": update_organization_task['TaskStatus']
            },
            'RetryCount': {
                "Value": update_organization_task['RetryCount']
            },
            'MaxRetry': {
                "Value": update_organization_task['MaxRetry']
            }
        }
        pm_organizationTasks.update(
            task_id.format(str(1)), attribute, updated_at)
        update_result = pm_organizationTasks.query_key(task_id.format(str(1)))
        attribute['TaskID'] = task_id.format(str(1))
        self.organizationTask_result_check(
            actual_organization=update_result,
            expected_organization=update_organization_task)

    def test_delete_success(self):
        pm_organizationTasks.delete(trace_id, task_id.format(str(2)))
        delete_result = pm_organizationTasks.query_key(task_id.format(str(2)))
        self.assertIsNone(delete_result)
