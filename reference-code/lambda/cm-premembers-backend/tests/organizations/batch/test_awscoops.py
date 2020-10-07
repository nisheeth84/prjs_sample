import unittest
import os
import copy

from dotenv import load_dotenv
from pathlib import Path
from premembers.organizations.batch import awscoops
from premembers.repository import pm_organizationTasks
from premembers.repository import pm_awsAccountCoops
from premembers.common import common_utils
from premembers.repository.const import Status


trace_id = common_utils.get_uuid4()
user_id = common_utils.get_uuid4()
mail_address = "test-user{}@example.com"
organization_id = "reports-78ee-11e7-89e6-OrganizationID"
project_id = "reports-77f1-11e7-adfe-ProjectID"
coop_id = "awscoops-77f1-11e7-adfe-CoopID{}"
task_id = "reports-77f1-11e7-adfe-TaskID{}"

awscoops_template = {
    "CoopID": coop_id.format(str(0)),
    "AWSAccount": "310725358451",
    "AWSAccountName": "awsAccountName",
    "RoleName": "premembers-dev-role",
    "ExternalID": "0ee776d2-51b1-4f73-83e7-648fc2535816",
    "Description": "description",
    "Effective": 1,
    "OrganizationID": organization_id,
    "ProjectID": project_id
}

task_code = "CHECK_AWS_COOP"

organization_task_template = {
    "TaskID": task_id,
    "Code": task_code,
    "Target": coop_id,
    "UserID": user_id,
    "MailAddress": mail_address.format(str(0)),
    "TaskStatus": 0,
    "RetryCount": 1,
    "MaxRetry": 10,
}


class TestAwscoops(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)

        # Create awscoop no data credential
        pm_awsAccountCoops.create_awscoops(
            trace_id, awscoops_template["CoopID"],
            awscoops_template["AWSAccountName"],
            awscoops_template["AWSAccount"], awscoops_template["RoleName"],
            awscoops_template["ExternalID"], awscoops_template["Description"],
            awscoops_template["Effective"],
            awscoops_template["OrganizationID"],
            awscoops_template["ProjectID"])

        num = 0
        while num < 7:
            # Create organization task
            tmp_organization_task = copy.copy(organization_task_template)
            tmp_organization_task['TaskStatus'] = num
            if (num == 4):
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

        # Create awscoop
        pm_awsAccountCoops.create_awscoops(
            trace_id, coop_id.format(str(3)),
            awscoops_template["AWSAccount"],
            awscoops_template["AWSAccountName"],
            awscoops_template["RoleName"],
            awscoops_template["ExternalID"], awscoops_template["Description"],
            awscoops_template["Effective"],
            organization_id.format(str(1)),
            project_id.format(str(1)))

    def tearDown(self):
        num = 0
        while num < 7:
            pm_organizationTasks.delete(trace_id, task_id.format(str(num)))
            num += 1
        pm_awsAccountCoops.delete_awscoops(trace_id, coop_id.format(str(0)))
        pm_awsAccountCoops.delete_awscoops(trace_id, coop_id.format(str(3)))

    def test_batch_confirm_awscoop_susscess(self):
        # handler
        event_mock = {
            'TaskId': task_id.format(str(3)),
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        awscoops.execute_confirm_awscoop_handler(event_mock, {})

        # Get data in database
        awscoop_task = pm_organizationTasks.query_key(
            task_id.format(str(3)))

        # Check data
        self.assertEqual(
            int(awscoop_task['TaskStatus']), Status.Done.value)

    def test_batch_confirm_awscoop_get_credential_error(self):
        # handler
        event_mock = {
            'TaskId': task_id.format(str(0)),
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        awscoops.execute_confirm_awscoop_handler(event_mock, {})

        # Get data in database
        awscoop_task = pm_organizationTasks.query_key(
            task_id.format(str(0)))

        # Check data
        self.assertEqual(
            int(awscoop_task['TaskStatus']), Status.Done.value)

    def test_batch_confirm_awscoop_error_status_task(self):
        # Status = 1 Running
        event_mock = {
            'TaskId': task_id.format(str(1)),
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        awscoops.execute_confirm_awscoop_handler(event_mock, {})
        # Get data in database
        organization_task = pm_organizationTasks.query_key(
            task_id.format(str(1)))
        # Check data
        self.assertEqual(organization_task['TaskStatus'], Status.Error.value)

        # Status = 2 Done
        event_mock['TaskId'] = task_id.format(str(2))
        awscoops.execute_confirm_awscoop_handler(event_mock, {})
        # Get data in database
        organization_task = pm_organizationTasks.query_key(
            task_id.format(str(2)))
        # Check data
        self.assertEqual(organization_task['TaskStatus'], Status.Error.value)

        # Status = -1 ERROR and RetryCount > MaxRetry
        event_mock['TaskId'] = task_id.format(str(5))
        awscoops.execute_confirm_awscoop_handler(event_mock, {})
        # Get data in database
        organization_task = pm_organizationTasks.query_key(
            task_id.format(str(5)))
        # Check data
        self.assertEqual(organization_task['TaskStatus'], Status.Error.value)
