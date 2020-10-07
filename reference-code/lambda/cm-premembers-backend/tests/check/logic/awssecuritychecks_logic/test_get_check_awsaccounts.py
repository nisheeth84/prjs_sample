import copy
import inspect

from premembers.common import common_utils
from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from premembers.exception.pm_exceptions import PmError
from premembers.common.cw_log_adapter import CwLogAdapter
from premembers.check.logic import awssecuritychecks_logic
from tests.mock.data.aws.dynamodb.data_pm_check_history import DataPmCheckHistory
from tests.mock.data.aws.dynamodb.data_pm_organizations import DataPmOrganizations
from tests.mock.data.aws.dynamodb.data_pm_project import DataPmProjects
from tests.mock.data.aws.dynamodb.data_pm_aws_account_coops import DataPmAwsAccountCoops

data_pm_project = copy.deepcopy(DataPmProjects.DATA_SIMPLE)
data_pm_check_history = copy.deepcopy(DataPmCheckHistory.DATA_SIMPLE)
data_pm_organizations = copy.deepcopy(DataPmOrganizations.DATA_SIMPLE)
data_aws_account_coops = copy.deepcopy(
    DataPmAwsAccountCoops.LIST_AWS_ACCOUNT_COOPS)
check_history_id = copy.deepcopy(DataPmCheckHistory.CHECK_HISTORY_ID)
organization_id = copy.deepcopy(DataPmOrganizations.ORGANIZATION_ID)
project_id = copy.deepcopy(DataPmProjects.PROJECT_ID)
trace_id = check_history_id
aws_account = copy.deepcopy(DataPmAwsAccountCoops.AWS_ACCOUNT)


class TestGetCheckAwsaccounts(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_get_check_awsaccounts_case_error_validate_param(self):
        # patch mock
        patch_logger_error = patch.object(CwLogAdapter, "error")

        # start mock object
        mock_logger_error = patch_logger_error.start()

        # addCleanup stop mock object
        self.addCleanup(patch_logger_error.stop)

        with self.assertRaises(PmError) as exception:
            # call function test
            awssecuritychecks_logic.get_check_awsaccounts(
                trace_id, "")

        # check error
        actual_message = exception.exception.message
        self.assertEquals("GCA_SECURITY-001", actual_message)

        # check log message error
        mock_logger_error.assert_called_once_with("チェック履歴IDが指定されていません。")

    def test_get_check_awsaccounts_case_error_get_record_pm_check_history(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())
        pm_error = PmError()

        # patch mock
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_logger_error = patch.object(CwLogAdapter, "error")
        patch_write_log_pm_error = patch("premembers.common.common_utils.write_log_pm_error")

        # start mock object
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_logger_error = patch_logger_error.start()
        mock_write_log_pm_error = patch_write_log_pm_error.start()

        # mock data
        mock_begin_cw_logger.return_value = cw_logger
        mock_query_key_pm_check_history.side_effect = pm_error
        mock_write_log_pm_error.return_value = pm_error

        # addCleanup stop mock object
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_logger_error.stop)
        self.addCleanup(patch_write_log_pm_error.stop)

        with self.assertRaises(PmError):
            # call function test
            awssecuritychecks_logic.get_check_awsaccounts(
                trace_id, check_history_id)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s", check_history_id)

        # check call function write_log_pm_error
        mock_write_log_pm_error.assert_called_once_with(
            pm_error, cw_logger, "GCA_SECURITY-002")

    def test_get_check_awsaccounts_case_get_record_pm_check_history_is_zero(self):
        # patch mock
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_logger_error = patch.object(CwLogAdapter, "error")

        # start mock object
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_logger_error = patch_logger_error.start()

        # mock data
        mock_query_key_pm_check_history.return_value = {}

        # addCleanup stop mock object
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_logger_error.stop)

        with self.assertRaises(PmError) as exception:
            # call function test
            awssecuritychecks_logic.get_check_awsaccounts(
                trace_id, check_history_id)

        # check error
        actual_message = exception.exception.message
        self.assertEquals("GCA_SECURITY-002", actual_message)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "チェック履歴情報がありません。: CheckHistoryID=%s", check_history_id)

    def test_get_check_awsaccounts_case_error_get_record_pm_organizations(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())
        pm_error = PmError()

        # patch mock
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_query_key_pm_organizations = patch("premembers.repository.pm_organizations.get_organization")
        patch_logger_error = patch.object(CwLogAdapter, "error")
        patch_write_log_pm_error = patch("premembers.common.common_utils.write_log_pm_error")

        # start mock object
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_query_key_pm_organizations = patch_query_key_pm_organizations.start()
        mock_logger_error = patch_logger_error.start()
        mock_write_log_pm_error = patch_write_log_pm_error.start()

        # mock data
        mock_begin_cw_logger.return_value = cw_logger
        mock_query_key_pm_check_history.return_value = data_pm_check_history
        mock_query_key_pm_organizations.side_effect = pm_error
        mock_write_log_pm_error.return_value = pm_error

        # addCleanup stop mock object
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_query_key_pm_organizations.stop)
        self.addCleanup(patch_logger_error.stop)
        self.addCleanup(patch_write_log_pm_error.stop)

        with self.assertRaises(PmError):
            # call function test
            awssecuritychecks_logic.get_check_awsaccounts(
                trace_id, check_history_id)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "組織情報の取得に失敗しました。: OrganizationID=%s", organization_id)

        # check call function write_log_pm_error
        mock_write_log_pm_error.assert_called_once_with(
            pm_error, cw_logger, "GCA_SECURITY-003")

    def test_get_check_awsaccounts_case_get_record_pm_organizations_is_zero(self):
        # patch mock
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_query_key_pm_organizations = patch("premembers.repository.pm_organizations.get_organization")
        patch_logger_error = patch.object(CwLogAdapter, "error")

        # start mock object
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_query_key_pm_organizations = patch_query_key_pm_organizations.start()
        mock_logger_error = patch_logger_error.start()

        # mock data
        mock_query_key_pm_check_history.return_value = data_pm_check_history
        mock_query_key_pm_organizations.return_value = {}

        # addCleanup stop mock object
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_query_key_pm_organizations.stop)
        self.addCleanup(patch_logger_error.stop)

        with self.assertRaises(PmError) as exception:
            # call function test
            awssecuritychecks_logic.get_check_awsaccounts(
                trace_id, check_history_id)

        # check error
        actual_message = exception.exception.message
        self.assertEquals("GCA_SECURITY-003", actual_message)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "組織情報がありません。: OrganizationID=%s", organization_id)

    def test_get_check_awsaccounts_case_error_get_record_pm_project(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())
        pm_error = PmError()

        # patch mock
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_query_key_pm_organizations = patch("premembers.repository.pm_organizations.get_organization")
        patch_query_key_pm_project = patch("premembers.repository.pm_projects.query_key")
        patch_logger_error = patch.object(CwLogAdapter, "error")
        patch_write_log_pm_error = patch("premembers.common.common_utils.write_log_pm_error")

        # start mock object
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_query_key_pm_organizations = patch_query_key_pm_organizations.start()
        mock_query_key_pm_project = patch_query_key_pm_project.start()
        mock_logger_error = patch_logger_error.start()
        mock_write_log_pm_error = patch_write_log_pm_error.start()

        # mock data
        mock_begin_cw_logger.return_value = cw_logger
        mock_query_key_pm_check_history.return_value = data_pm_check_history
        mock_query_key_pm_organizations.return_value = data_pm_organizations
        mock_query_key_pm_project.side_effect = pm_error
        mock_write_log_pm_error.return_value = pm_error

        # addCleanup stop mock object
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_query_key_pm_organizations.stop)
        self.addCleanup(patch_query_key_pm_project.stop)
        self.addCleanup(patch_logger_error.stop)
        self.addCleanup(patch_write_log_pm_error.stop)

        with self.assertRaises(PmError):
            # call function test
            awssecuritychecks_logic.get_check_awsaccounts(
                trace_id, check_history_id)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "プロジェクト情報の取得に失敗しました。: ProjectID=%s", project_id)

        # check call function write_log_pm_error
        mock_write_log_pm_error.assert_called_once_with(
            pm_error, cw_logger, "GCA_SECURITY-004")

    def test_get_check_awsaccounts_case_get_record_pm_project_is_zero(self):
        # patch mock
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_query_key_pm_organizations = patch("premembers.repository.pm_organizations.get_organization")
        patch_query_key_pm_project = patch("premembers.repository.pm_projects.query_key")
        patch_logger_error = patch.object(CwLogAdapter, "error")

        # start mock object
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_query_key_pm_organizations = patch_query_key_pm_organizations.start()
        mock_query_key_pm_project = patch_query_key_pm_project.start()
        mock_logger_error = patch_logger_error.start()

        # mock data
        mock_query_key_pm_check_history.return_value = data_pm_check_history
        mock_query_key_pm_organizations.return_value = data_pm_organizations
        mock_query_key_pm_project.return_value = {}

        # addCleanup stop mock object
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_query_key_pm_organizations.stop)
        self.addCleanup(patch_query_key_pm_project.stop)
        self.addCleanup(patch_logger_error.stop)

        with self.assertRaises(PmError) as exception:
            # call function test
            awssecuritychecks_logic.get_check_awsaccounts(
                trace_id, check_history_id)

        # check error
        actual_message = exception.exception.message
        self.assertEquals("GCA_SECURITY-004", actual_message)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "プロジェクト情報がありません。: ProjectID=%s", project_id)

    def test_get_check_awsaccounts_case_error_get_record_pm_aws_account_coops(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())
        pm_error = PmError()

        # patch mock
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_query_key_pm_organizations = patch("premembers.repository.pm_organizations.get_organization")
        patch_query_key_pm_project = patch("premembers.repository.pm_projects.query_key")
        patch_query_key_pm_aws_account_coops = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_effective_enable")
        patch_logger_error = patch.object(CwLogAdapter, "error")
        patch_write_log_pm_error = patch("premembers.common.common_utils.write_log_pm_error")

        # start mock object
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_query_key_pm_organizations = patch_query_key_pm_organizations.start()
        mock_query_key_pm_project = patch_query_key_pm_project.start()
        mock_query_key_pm_aws_account_coops = patch_query_key_pm_aws_account_coops.start()
        mock_logger_error = patch_logger_error.start()
        mock_write_log_pm_error = patch_write_log_pm_error.start()

        # mock data
        mock_begin_cw_logger.return_value = cw_logger
        mock_query_key_pm_check_history.return_value = data_pm_check_history
        mock_query_key_pm_organizations.return_value = data_pm_organizations
        mock_query_key_pm_project.return_value = data_pm_project
        mock_query_key_pm_aws_account_coops.side_effect = pm_error
        mock_write_log_pm_error.return_value = pm_error

        # addCleanup stop mock object
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_query_key_pm_organizations.stop)
        self.addCleanup(patch_query_key_pm_project.stop)
        self.addCleanup(patch_query_key_pm_aws_account_coops.stop)
        self.addCleanup(patch_logger_error.stop)
        self.addCleanup(patch_write_log_pm_error.stop)

        with self.assertRaises(PmError):
            # call function test
            awssecuritychecks_logic.get_check_awsaccounts(
                trace_id, check_history_id)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "AWSアカウント連携情報の取得に失敗しました。: ProjectID=%s", project_id)

        # check call function write_log_pm_error
        mock_write_log_pm_error.assert_called_once_with(
            pm_error, cw_logger, "GCA_SECURITY-005")

    def test_get_check_awsaccounts_case_get_record_pm_aws_account_coops_is_zero(self):
        # patch mock
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_query_key_pm_organizations = patch("premembers.repository.pm_organizations.get_organization")
        patch_query_key_pm_project = patch("premembers.repository.pm_projects.query_key")
        patch_query_key_pm_aws_account_coops = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_effective_enable")
        patch_logger_error = patch.object(CwLogAdapter, "error")

        # start mock object
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_query_key_pm_organizations = patch_query_key_pm_organizations.start()
        mock_query_key_pm_project = patch_query_key_pm_project.start()
        mock_query_key_pm_aws_account_coops = patch_query_key_pm_aws_account_coops.start()
        mock_logger_error = patch_logger_error.start()

        # mock data
        mock_query_key_pm_check_history.return_value = data_pm_check_history
        mock_query_key_pm_organizations.return_value = data_pm_organizations
        mock_query_key_pm_project.return_value = data_pm_project
        mock_query_key_pm_aws_account_coops.return_value = {}

        # addCleanup stop mock object
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_query_key_pm_organizations.stop)
        self.addCleanup(patch_query_key_pm_project.stop)
        self.addCleanup(patch_query_key_pm_aws_account_coops.stop)
        self.addCleanup(patch_logger_error.stop)

        with self.assertRaises(PmError) as exception:
            # call function test
            awssecuritychecks_logic.get_check_awsaccounts(
                trace_id, check_history_id)

        # check error
        actual_message = exception.exception.message
        self.assertEquals("GCA_SECURITY-005", actual_message)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "AWSアカウント連携情報がありません。: ProjectID=%s", project_id)

    def test_get_check_awsaccounts_case_exists_record_pm_check_history_with_check_status_other_zero(self):
        # patch mock
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_query_key_pm_project = patch("premembers.repository.pm_projects.query_key")
        patch_query_key_pm_aws_account_coops = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_effective_enable")
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_logger_error = patch.object(CwLogAdapter, "error")

        # start mock object
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_query_key_pm_project = patch_query_key_pm_project.start()
        mock_query_key_pm_aws_account_coops = patch_query_key_pm_aws_account_coops.start()
        mock_get_organization = patch_get_organization.start()
        mock_logger_error = patch_logger_error.start()

        # mock data
        data_pm_check_history_copy = copy.deepcopy(data_pm_check_history)
        data_pm_check_history_copy['CheckStatus'] = 1
        mock_query_key_pm_check_history.return_value = data_pm_check_history_copy
        mock_query_key_pm_project.return_value = data_pm_project
        mock_query_key_pm_aws_account_coops.return_value = data_aws_account_coops
        mock_get_organization.return_value = data_pm_organizations

        # addCleanup stop mock object
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_query_key_pm_project.stop)
        self.addCleanup(patch_query_key_pm_aws_account_coops.stop)
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_logger_error.stop)

        with self.assertRaises(PmError) as exception:
            # call function test
            awssecuritychecks_logic.get_check_awsaccounts(
                trace_id, check_history_id)

        # check error
        actual_message = exception.exception.message
        self.assertEquals("GCA_SECURITY-006", actual_message)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "チェック実行ステータスが一致しません。: CheckHistoryID=%s, CheckStatus=%s",
            check_history_id, 1)

    def test_get_check_awsaccounts_case_update_check_status_in_pm_check_history_error(self):
        # patch mock
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_query_key_pm_project = patch("premembers.repository.pm_projects.query_key")
        patch_query_key_pm_aws_account_coops = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_effective_enable")
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_update_pm_check_history = patch("premembers.repository.pm_checkHistory.update")
        patch_logger_error = patch.object(CwLogAdapter, "error")

        # start mock object
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_query_key_pm_project = patch_query_key_pm_project.start()
        mock_query_key_pm_aws_account_coops = patch_query_key_pm_aws_account_coops.start()
        mock_get_organization = patch_get_organization.start()
        mock_update_pm_check_history = patch_update_pm_check_history.start()
        mock_logger_error = patch_logger_error.start()

        # mock data
        mock_query_key_pm_check_history.return_value = data_pm_check_history
        mock_query_key_pm_project.return_value = data_pm_project
        mock_query_key_pm_aws_account_coops.return_value = data_aws_account_coops
        mock_get_organization.return_value = data_pm_organizations
        mock_update_pm_check_history.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_query_key_pm_project.stop)
        self.addCleanup(patch_query_key_pm_aws_account_coops.stop)
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_update_pm_check_history.stop)
        self.addCleanup(patch_logger_error.stop)

        with self.assertRaises(PmError) as exception:
            # call function test
            awssecuritychecks_logic.get_check_awsaccounts(
                trace_id, check_history_id)

        # check error
        actual_message = exception.exception.message
        self.assertEquals("GCA_SECURITY-007", actual_message)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "チェック履歴情報のステータス更新に失敗しました。: CheckHistoryID=%s", check_history_id)

    def test_get_check_awsaccounts_case_error_create_record_pm_check_results(self):
        # patch mock
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_query_key_pm_organizations = patch("premembers.repository.pm_organizations.get_organization")
        patch_query_key_pm_project = patch("premembers.repository.pm_projects.query_key")
        patch_query_key_pm_aws_account_coops = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_effective_enable")
        patch_update_pm_check_history = patch("premembers.repository.pm_checkHistory.update")
        patch_create_pm_check_results = patch("premembers.repository.pm_checkResults.create")
        patch_logger_error = patch.object(CwLogAdapter, "error")

        # start mock object
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_query_key_pm_organizations = patch_query_key_pm_organizations.start()
        mock_query_key_pm_project = patch_query_key_pm_project.start()
        mock_query_key_pm_aws_account_coops = patch_query_key_pm_aws_account_coops.start()
        mock_update_pm_check_history = patch_update_pm_check_history.start()
        mock_create_pm_check_results = patch_create_pm_check_results.start()
        mock_logger_error = patch_logger_error.start()

        # mock data
        mock_query_key_pm_check_history.return_value = data_pm_check_history
        mock_query_key_pm_organizations.return_value = data_pm_organizations
        mock_query_key_pm_project.return_value = data_pm_project
        mock_query_key_pm_aws_account_coops.return_value = data_aws_account_coops
        mock_update_pm_check_history.return_value = None
        mock_create_pm_check_results.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_query_key_pm_organizations.stop)
        self.addCleanup(patch_query_key_pm_project.stop)
        self.addCleanup(patch_query_key_pm_aws_account_coops.stop)
        self.addCleanup(patch_update_pm_check_history.stop)
        self.addCleanup(patch_create_pm_check_results.stop)
        self.addCleanup(patch_logger_error.stop)

        with self.assertRaises(PmError) as exception:
            # call function test
            awssecuritychecks_logic.get_check_awsaccounts(
                trace_id, check_history_id)

        # check error
        actual_message = exception.exception.message
        self.assertEquals("GCA_SECURITY-008", actual_message)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "チェック結果レコードの作成に失敗しました。: CheckHistoryID=%s, AWSAccount=%s",
            check_history_id, aws_account)
