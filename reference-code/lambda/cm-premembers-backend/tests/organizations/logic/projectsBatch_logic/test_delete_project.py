import copy

from unittest.mock import patch
from moto import mock_dynamodb2
from tests.testcasebase import TestCaseBase
from premembers.exception.pm_exceptions import PmError
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from tests.mock.data.aws.dynamodb.data_pm_aws_account_coops import DataPmAwsAccountCoops
from tests.mock.data.aws.dynamodb.data_pm_organizationTasks import DataPmOrganizationTasks
from tests.mock.data.aws.dynamodb.data_pm_security_check_webhook import DataPmSecurityCheckWebhook
from tests.mock.data.aws.dynamodb.data_pm_security_check_webhook_call_history import DataPmSecurityCheckWebhookCallHistory
from tests.mock.aws.dynamodb import pm_awsAccountCoops as mock_pm_awsAccountCoops
from tests.mock.aws.dynamodb import pm_reports as mock_pm_reports
from tests.mock.aws.dynamodb import pm_securityCheckWebhook as mock_pm_securityCheckWebhook
from tests.mock.aws.dynamodb import pm_securityCheckWebhookCallHistory as mock_pm_securityCheckWebhookCallHistory
from tests.mock.data.aws.dynamodb.data_pm_reports import DataPmReports
from premembers.organizations.logic import projectsBatch_logic

list_data_pm_aws_account_coops = copy.deepcopy(
    DataPmAwsAccountCoops.LIST_AWS_ACCOUNT_COOPS)

task_id = copy.deepcopy(DataPmOrganizationTasks.TASK_ID)
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
security_check_web_hook_id = copy.deepcopy(
    DataCommon.SECURITY_CHECK_WEBHOOK_ID.format(str(3)))
list_data_pm_security_check_webhooks = copy.deepcopy(
    DataPmSecurityCheckWebhook.LIST_DATA_SECURITY_CHECK_WEBHOOK)
list_data_pm_security_check_webhook_call_historys = copy.deepcopy(
    DataPmSecurityCheckWebhookCallHistory.
    LIST_DATA_SECURITY_CHECK_WEBHOOK_CALL_HISTORY)
list_data_pm_reports = copy.deepcopy(DataPmReports.LIST_DATA_REPORT)


@mock_dynamodb2
class TestDeleteProject(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_AWSACCOUNTCOOPS):
            db_utils.delete_table(Tables.PM_AWSACCOUNTCOOPS)

        if db_utils.check_table_exist(Tables.PM_SECURITY_CHECK_WEBHOOK):
            db_utils.delete_table(Tables.PM_SECURITY_CHECK_WEBHOOK)

        if db_utils.check_table_exist(
                Tables.PM_SECURITY_CHECK_WEBHOOK_CALL_HISTORY):
            db_utils.delete_table(
                Tables.PM_SECURITY_CHECK_WEBHOOK_CALL_HISTORY)

        if db_utils.check_table_exist(Tables.PM_REPORTS):
            db_utils.delete_table(Tables.PM_REPORTS)

        # create pm_awsAccountCoops table
        mock_pm_awsAccountCoops.create_table()
        # create data table pm_awsAccountCoops
        for data_pm_aws_account_coops in list_data_pm_aws_account_coops:
            mock_pm_awsAccountCoops.create(data_pm_aws_account_coops)

    def test_delete_project_success(self):
        # create pm_securityCheckWebhook table
        mock_pm_securityCheckWebhook.create_table()
        # create pm_securityCheckWebhookCallHistory table
        mock_pm_securityCheckWebhookCallHistory.create_table()
        # create pm_reports table
        mock_pm_reports.create_table()

        # create data pm_security_check_webhooks
        for data_pm_security_check_webhooks in list_data_pm_security_check_webhooks:
            mock_pm_securityCheckWebhook.create(
                data_pm_security_check_webhooks)

        # create data pm_securityCheckWebhookCallHistory
        for data_pm_security_check_webhook_call_history in list_data_pm_security_check_webhook_call_historys:
            mock_pm_securityCheckWebhookCallHistory.create(
                data_pm_security_check_webhook_call_history)

        # create data pm_reports
        for data_pm_reports in list_data_pm_reports:
            mock_pm_reports.create(data_pm_reports)

        # mock object
        patch_delete_report = patch(
            "premembers.reports.logic.reportsBatch_logic.delete_report")

        # start mock object
        mock_delete_report = patch_delete_report.start()

        # mock data
        mock_delete_report.return_value = True

        # addCleanup stop mock object
        self.addCleanup(patch_delete_report.stop)

        actual_response = projectsBatch_logic.delete_project(
            task_id, project_id)

        actual_record_pm_security_check_webhook = mock_pm_securityCheckWebhook.query_all()

        actual_record_pm_security_check_webhook_call_history = mock_pm_securityCheckWebhookCallHistory.query_all()

        # check response
        self.assertEqual(True, actual_response)
        self.assertEqual([], actual_record_pm_security_check_webhook['Items'])
        self.assertEqual([],
                         actual_record_pm_security_check_webhook_call_history['Items'])

    def test_delete_project_case_get_record_security_check_webhook_is_zero(self):
        # mock object
        patch_query_project_index = patch(
            "premembers.repository.pm_securityCheckWebhook.query_project_index")
        patch_error_method = patch.object(PmLogAdapter, 'error')

        # start mock object
        mock_query_project_index = patch_query_project_index.start()
        mock_error_method = patch_error_method.start()

        # mock data
        mock_query_project_index.return_value = []
        mock_error_method.return_value = None

        # addCleanup stop mock object
        self.addCleanup(patch_query_project_index.stop)
        self.addCleanup(patch_error_method.stop)

        # call Function test
        actual_response = projectsBatch_logic.delete_project(
            task_id, project_id)

        # assert output function
        self.assertEqual(True, actual_response)

    def test_delete_project_case_error_delete_security_check_webhook_call_history(self):
        # create pm_securityCheckWebhook table
        mock_pm_securityCheckWebhook.create_table()
        # create pm_securityCheckWebhookCallHistory table
        mock_pm_securityCheckWebhookCallHistory.create_table()
        # create pm_reports table
        mock_pm_reports.create_table()

        # create data pm_security_check_webhooks
        for data_pm_security_check_webhooks in list_data_pm_security_check_webhooks:
            mock_pm_securityCheckWebhook.create(
                data_pm_security_check_webhooks)

        # create data pm_security_check_webhooks
        for data_pm_security_check_webhook_call_history in list_data_pm_security_check_webhook_call_historys:
            mock_pm_securityCheckWebhookCallHistory.create(
                data_pm_security_check_webhook_call_history)

        # create data pm_reports
        for data_pm_reports in list_data_pm_reports:
            mock_pm_reports.create(data_pm_reports)

        # mock object
        pm_error = PmError()
        patch_delete_security_check_webhook_call_history = patch(
            "premembers.repository.pm_securityCheckWebhookCallHistory.delete")
        patch_error_method = patch.object(PmLogAdapter, 'error')

        # mock function error
        mock_delete_security_check_webhook_call_history = patch_delete_security_check_webhook_call_history.start()
        mock_error_method = patch_error_method.start()

        # mock data
        mock_delete_security_check_webhook_call_history.side_effect = pm_error
        mock_error_method.return_value = None

        # addCleanup stop mock object
        self.addCleanup(patch_delete_security_check_webhook_call_history.stop)
        self.addCleanup(patch_error_method.stop)

        # call Function test
        actual_response = projectsBatch_logic.delete_project(
            task_id, project_id)

        # check call function error
        mock_error_method.assert_any_call(
            "チェック実行Webhook実行履歴情報削除に失敗しました。: WebhookID=%s",
            security_check_web_hook_id)
        mock_error_method.assert_any_call(pm_error)

        # assert output function
        self.assertEqual(False, actual_response)

    def test_delete_project_case_error_delete_security_check_webhook(self):
        # create pm_securityCheckWebhook table
        mock_pm_securityCheckWebhook.create_table()
        # create pm_securityCheckWebhookCallHistory table
        mock_pm_securityCheckWebhookCallHistory.create_table()
        # create pm_reports table
        mock_pm_reports.create_table()

        # create data pm_security_check_webhooks
        for data_pm_security_check_webhooks in list_data_pm_security_check_webhooks:
            mock_pm_securityCheckWebhook.create(
                data_pm_security_check_webhooks)

        # create data pm_security_check_webhooks
        for data_pm_security_check_webhook_call_history in list_data_pm_security_check_webhook_call_historys:
            mock_pm_securityCheckWebhookCallHistory.create(
                data_pm_security_check_webhook_call_history)

        # create data pm_reports
        for data_pm_reports in list_data_pm_reports:
            mock_pm_reports.create(data_pm_reports)

        # mock object
        pm_error = PmError()
        patch_delete_security_check_webhook = patch(
            "premembers.repository.pm_securityCheckWebhook.delete")
        patch_error_method = patch.object(PmLogAdapter, 'error')

        # mock function error
        mock_delete_security_check_webhook = patch_delete_security_check_webhook.start()
        mock_error_method = patch_error_method.start()

        # mock data
        mock_delete_security_check_webhook.side_effect = pm_error
        mock_error_method.return_value = None

        # addCleanup stop mock object
        self.addCleanup(patch_delete_security_check_webhook.stop)
        self.addCleanup(patch_error_method.stop)

        # call Function test
        actual_response = projectsBatch_logic.delete_project(
            task_id, project_id)

        actual_record_pm_security_check_webhook_call_history = mock_pm_securityCheckWebhookCallHistory.query_all()

        # check call function error
        mock_error_method.assert_any_call(
            "チェック実行Webhook情報削除に失敗しました。: WebhookID=%s",
            security_check_web_hook_id)
        mock_error_method.assert_any_call(pm_error)

        # assert output function
        self.assertEqual(False, actual_response)
        self.assertEqual(1,
                         len(actual_record_pm_security_check_webhook_call_history['Items']))
