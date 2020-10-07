import os
import copy
import unittest

from pathlib import Path
from dotenv import load_dotenv
from premembers.organizations.batch import users
from premembers.repository import pm_organizationTasks
from premembers.repository import pm_orgNotifyMailDestinations
from premembers.common import common_utils
from premembers.repository.const import Status


trace_id = common_utils.get_uuid4()
user_id = common_utils.get_uuid4()
mail_address = "test-user{}@example.com"
organization_id = "organization-eb3b5f76-8945-11e7-b15a-8f7e5433dada{}"
project_id = "reports-77f1-11e7-adfe-ProjectID"
task_id = "reports-77f1-11e7-adfe-TaskID{}"
target = "{0},{1}".format(user_id, organization_id)
notify_code = "CHECK_CIS"
task_code = "DELETE_ORG_USER"


destinations_delete = [{
    "UserID": user_id,
    "MailAddress": mail_address.format(str(1))
}, {
    "UserID": user_id,
    "MailAddress": mail_address.format(str(1))
}]

destinations_update = [{
    "UserID": user_id,
    "MailAddress": mail_address.format(str(1))
}, {
    "UserID": user_id + "Update",
    "MailAddress": mail_address.format(str(2))
}]

notify_mail_template = {
    'OrganizationID': organization_id.format(3),
    'NotifyCode': notify_code,
    'Destinations': [
        {
            "UserID": user_id,
            "MailAddress": mail_address.format(str(1))
        }
    ]
}

organization_task_template = {
    "TaskID": task_id,
    "Code": task_code,
    "Target": target,
    "UserID": user_id,
    "MailAddress": mail_address.format(str(0)),
    "TaskStatus": 0,
    "RetryCount": 1,
    "MaxRetry": 10,
}


class TestUsers(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)

        # create pm_orgNotifyMailDestinaltions
        pm_orgNotifyMailDestinations.create(
            trace_id, notify_mail_template['OrganizationID'],
            notify_mail_template['NotifyCode'],
            notify_mail_template['Destinations'])

        num = 0
        while num < 6:
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

    def tearDown(self):
        num = 0
        while num < 6:
            pm_organizationTasks.delete(trace_id, task_id.format(str(num)))
            num += 1
        pm_orgNotifyMailDestinations.delete(trace_id, organization_id,
                                            notify_code)

    def test_batch_delete_organization_user_success_with_record_zero(self):
        # handler
        task_id_0 = task_id.format(str(0))
        event_mock = {
            'TaskId': task_id_0,
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        users.execute_delete_organization_user_handler(event_mock, {})

        # Get data in database
        awscoop_task = pm_organizationTasks.query_key(task_id_0)

        # Check data
        self.assertEqual(int(awscoop_task['TaskStatus']), Status.Done.value)

    def test_batch_delete_organization_user_success_with_delete(self):
        # update pm_orgNotifyMailDestinaltions
        attribute = {'Destinations': {"Value": destinations_delete}}
        pm_orgNotifyMailDestinations.update(
            trace_id, organization_id.format(3), notify_code, attribute)

        # handler
        task_id_3 = task_id.format(str(3))
        event_mock = {
            'TaskId': task_id_3,
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        users.execute_delete_organization_user_handler(event_mock, {})

        # Get data in database
        awscoop_task = pm_organizationTasks.query_key(task_id_3)

        # Check data
        self.assertEqual(int(awscoop_task['TaskStatus']), Status.Done.value)

    def test_batch_delete_organization_user_success_with_update(self):
        # update pm_orgNotifyMailDestinaltions
        attribute = {'Destinations': {"Value": destinations_update}}
        pm_orgNotifyMailDestinations.update(
            trace_id, organization_id.format(3), notify_code, attribute)

        # handler
        task_id_3 = task_id.format(str(3))
        event_mock = {
            'TaskId': task_id_3,
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        users.execute_delete_organization_user_handler(event_mock, {})

        # Get data in database
        awscoop_task = pm_organizationTasks.query_key(task_id_3)

        # Check data
        self.assertEqual(int(awscoop_task['TaskStatus']), Status.Done.value)

    def test_batch_delete_organization_user_error_status_task(self):
        # Status = 1 Running
        event_mock = {
            'TaskId': task_id.format(str(1)),
            'Message': {
                'MessageId': 'MessageId',
                'ReceiptHandle': 'ReceiptHandle'
            }
        }
        users.execute_delete_organization_user_handler(event_mock, {})
        # Get data in database
        organization_task = pm_organizationTasks.query_key(
            task_id.format(str(1)))
        # Check data
        self.assertEqual(organization_task['TaskStatus'], Status.Error.value)

        # Status = 2 Done
        event_mock['TaskId'] = task_id.format(str(2))
        users.execute_delete_organization_user_handler(event_mock, {})
        # Get data in database
        organization_task = pm_organizationTasks.query_key(
            task_id.format(str(2)))
        # Check data
        self.assertEqual(organization_task['TaskStatus'], Status.Error.value)

        # Status = -1 ERROR and RetryCount > MaxRetry
        event_mock['TaskId'] = task_id.format(str(5))
        users.execute_delete_organization_user_handler(event_mock, {})
        # Get data in database
        organization_task = pm_organizationTasks.query_key(
            task_id.format(str(5)))
        # Check data
        self.assertEqual(organization_task['TaskStatus'], Status.Error.value)
