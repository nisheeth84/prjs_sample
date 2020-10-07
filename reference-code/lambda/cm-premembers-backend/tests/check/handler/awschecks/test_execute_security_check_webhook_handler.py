import json
import copy

from http import HTTPStatus
from premembers.check.handler import awschecks
from premembers.repository.table_list import Tables
from moto import mock_dynamodb2
from unittest.mock import patch
from tests import event_create
from tests.testcasebase import TestCaseBase
from tests.mock.aws.dynamodb import db_utils
from tests.mock.aws.dynamodb import pm_checkHistory as mock_pm_checkHistory
from tests.mock.aws.dynamodb import pm_projects as mock_pm_projects
from tests.mock.data.aws.dynamodb.data_pm_project import DataPmProjects
from tests.mock.data.aws.dynamodb.data_pm_check_history import DataPmCheckHistory
from tests.mock.aws.dynamodb import pm_securityCheckWebhook as mock_pm_securityCheckWebhook
from tests.mock.data.aws.dynamodb.data_pm_security_check_webhook import DataPmSecurityCheckWebhook
from tests.mock.aws.dynamodb import pm_securityCheckWebhookCallHistory as mock_pm_securityCheckWebhookCallHistory
from tests.mock.data.aws.dynamodb.data_pm_security_check_webhook_call_history import DataPmSecurityCheckWebhookCallHistory

data_pm_project = copy.deepcopy(DataPmProjects.DATA_SIMPLE)
check_history_id = copy.deepcopy(DataPmCheckHistory.DATA_SIMPLE)['CheckHistoryID']
path_parameters = {
    "webhook_path": copy.deepcopy(DataPmSecurityCheckWebhook.WEBHOOK_PATH)
}
list_data_pm_security_check_webhook_call_historys = copy.deepcopy(
    DataPmSecurityCheckWebhookCallHistory.
    LIST_DATA_SECURITY_CHECK_WEBHOOK_CALL_HISTORY)
list_data_pm_security_check_webhooks = copy.deepcopy(
    DataPmSecurityCheckWebhook.LIST_DATA_SECURITY_CHECK_WEBHOOK)


@mock_dynamodb2
class TestExecuteSecurityCheckWebhookHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_SECURITY_CHECK_WEBHOOK):
            db_utils.delete_table(Tables.PM_SECURITY_CHECK_WEBHOOK)
        if db_utils.check_table_exist(
                Tables.PM_SECURITY_CHECK_WEBHOOK_CALL_HISTORY):
            db_utils.delete_table(
                Tables.PM_SECURITY_CHECK_WEBHOOK_CALL_HISTORY)
        if db_utils.check_table_exist(Tables.PM_PROJECTS):
            db_utils.delete_table(Tables.PM_PROJECTS)
        if db_utils.check_table_exist(Tables.PM_CHECK_HISTORY):
            db_utils.delete_table(Tables.PM_CHECK_HISTORY)

        # create table
        mock_pm_projects.create_table()
        mock_pm_checkHistory.create_table()
        mock_pm_securityCheckWebhook.create_table()
        mock_pm_securityCheckWebhookCallHistory.create_table()

        # create data table pm_project
        mock_pm_projects.create(data_pm_project)

        # create data pm_security_check_webhooks
        for data_pm_security_check_webhooks in list_data_pm_security_check_webhooks:
            mock_pm_securityCheckWebhook.create(
                data_pm_security_check_webhooks)

        # create data pm_securityCheckWebhookCallHistory
        for data_pm_security_check_webhook_call_history in list_data_pm_security_check_webhook_call_historys:
            mock_pm_securityCheckWebhookCallHistory.create(
                data_pm_security_check_webhook_call_history)

    def test_execute_security_check_webhook_handler_success(self):
        # mock object
        patch_aws_sns = patch("premembers.common.aws_common.aws_sns")
        patch_get_uuid4 = patch("premembers.common.common_utils.get_uuid4")

        # start mock object
        mock_aws_sns = patch_aws_sns.start()
        mock_get_uuid4 = patch_get_uuid4.start()

        # mock data
        mock_aws_sns.side_effect = None
        mock_get_uuid4.return_value = check_history_id

        # addCleanup stop mock object
        self.addCleanup(patch_aws_sns.stop)
        self.addCleanup(patch_get_uuid4.stop)

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters)

        # Call function test
        actual_response = awschecks.execute_security_check_webhook_handler(
            event_mock, {})

        # Get data response
        actual_status_code = actual_response['statusCode']
        actual_response_bodys = json.loads(actual_response['body'])

        expect_response_pm_checkHistory = mock_pm_checkHistory.query_key(
            check_history_id)

        # Check data
        self.assertEqual(HTTPStatus.CREATED, actual_status_code)

        self.assertEqual(expect_response_pm_checkHistory['CheckCode'],
                         actual_response_bodys['checkCode'])
        self.assertEqual(expect_response_pm_checkHistory['CheckStatus'],
                         actual_response_bodys['checkStatus'])
        self.assertEqual('', actual_response_bodys['errorCode'])
        self.assertEqual(expect_response_pm_checkHistory['ExecutedDateTime'],
                         actual_response_bodys['executedDateTime'])
        self.assertEqual(expect_response_pm_checkHistory['ExecutedType'],
                         actual_response_bodys['executedType'])
        self.assertEqual(expect_response_pm_checkHistory['CheckHistoryID'],
                         actual_response_bodys['id'])
        self.assertEqual(expect_response_pm_checkHistory['OrganizationID'],
                         actual_response_bodys['organizationId'])
        self.assertEqual(expect_response_pm_checkHistory['ProjectID'],
                         actual_response_bodys['projectId'])
        self.assertEqual('', actual_response_bodys['reportFilePath'])
