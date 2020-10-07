import copy
import inspect

from premembers.common import common_utils
from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from premembers.exception.pm_exceptions import PmError
from premembers.common.cw_log_adapter import CwLogAdapter
from premembers.check.logic import awssecuritychecks_logic
from tests.mock.data.aws.dynamodb.data_pm_check_history import DataPmCheckHistory
from tests.mock.data.aws.dynamodb.data_pm_aws_account_coops import DataPmAwsAccountCoops
from tests.mock.data.aws.iam.data_test_iam import DataTestIAM
from tests.mock.data.aws.data_common import DataCommon

data_pm_check_history = copy.deepcopy(DataPmCheckHistory.DATA_SIMPLE)
check_history_id = copy.deepcopy(DataPmCheckHistory.CHECK_HISTORY_ID)
trace_id = check_history_id
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(3))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(3))
external_id = copy.deepcopy(DataTestIAM.EXTERNAL_ID)
role_name = copy.deepcopy(DataTestIAM.ROLE_NAME)
coop_id = copy.deepcopy(DataPmAwsAccountCoops.COOP_ID)
aws_account = copy.deepcopy(DataPmAwsAccountCoops.AWS_ACCOUNT)
client_connect_iam = None
session = None


class TestCheckEffectiveAwsaccount(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_check_effective_awsaccount_case_error_validate_param(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())

        # patch mock
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_logger_error = patch.object(CwLogAdapter, "error")

        # start mock object
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_logger_error = patch_logger_error.start()

        # mock object
        mock_begin_cw_logger.return_value = cw_logger

        # addCleanup stop mock object
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_logger_error.stop)

        # call function test
        actual_response = awssecuritychecks_logic.check_effective_awsaccount(
            trace_id, "", "", role_name, external_id, organization_id,
            project_id, check_history_id)

        expect_response = {
            "TaskResult": "Fail"
        }
        # check result
        self.assertDictEqual(expect_response, actual_response)

        # check log message error
        mock_logger_error.assert_any_call("%sが指定されていません。", "AWSAccount, CoopID")

    def test_check_effective_awsaccount_case_error_create_session_client(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())

        # patch mock
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_logger_warning = patch.object(CwLogAdapter, "warning")
        patch_do_disable_awscoop = patch("premembers.check.logic.awssecuritychecks_logic.do_disable_awscoop")
        patch_create_session_client = patch("premembers.common.aws_common.create_session_client")
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")

        # start mock object
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_logger_warning = patch_logger_warning.start()
        mock_do_disable_awscoop = patch_do_disable_awscoop.start()
        mock_create_session_client = patch_create_session_client.start()
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()

        # mock object
        mock_begin_cw_logger.return_value = cw_logger
        mock_do_disable_awscoop.side_effect = None
        mock_create_session_client.side_effect = PmError()
        mock_query_awscoop_coop_key.side_effect = None

        # addCleanup stop mock object
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_logger_warning.stop)
        self.addCleanup(patch_do_disable_awscoop.stop)
        self.addCleanup(patch_create_session_client.stop)
        self.addCleanup(patch_query_awscoop_coop_key.stop)

        # call function test
        actual_response = awssecuritychecks_logic.check_effective_awsaccount(
            trace_id, aws_account, coop_id, role_name, external_id,
            organization_id, project_id, check_history_id)

        expect_response = {
            "TaskResult": "Fail"
        }
        # check result
        self.assertDictEqual(expect_response, actual_response)

        # check log message warning
        mock_logger_warning.assert_any_call("[%s] Credentialsを取得できませんでした。",
                                            aws_account)

        # check call function do_disable_awscoop
        mock_do_disable_awscoop.assert_called_once_with(
            trace_id, coop_id, aws_account)

    def test_check_effective_awsaccount_case_error_get_iam_client(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())
        pm_error = PmError()

        # patch mock
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_create_session_client = patch("premembers.common.aws_common.create_session_client")
        patch_get_iam_client = patch("premembers.common.IAMUtils.get_iam_client")
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_write_log_pm_error = patch('premembers.common.common_utils.write_log_pm_error')

        # start mock object
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_create_session_client = patch_create_session_client.start()
        mock_get_iam_client = patch_get_iam_client.start()
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_write_log_pm_error = patch_write_log_pm_error.start()

        # mock object
        mock_begin_cw_logger.return_value = cw_logger
        mock_create_session_client.return_value = session
        mock_get_iam_client.side_effect = pm_error
        mock_query_awscoop_coop_key.side_effect = None
        mock_write_log_pm_error.return_value = pm_error

        # addCleanup stop mock object
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_create_session_client.stop)
        self.addCleanup(patch_get_iam_client.stop)
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_write_log_pm_error.stop)

        # call function test
        actual_response = awssecuritychecks_logic.check_effective_awsaccount(
            trace_id, aws_account, coop_id, role_name, external_id,
            organization_id, project_id, check_history_id)

        expect_response = {
            "TaskResult": "Fail"
        }
        # check result
        self.assertDictEqual(expect_response, actual_response)

        # check call function write_log_pm_error
        mock_write_log_pm_error.assert_any_call(
            pm_error, cw_logger, "CEA_SECURITY-002-" + aws_account)

    def test_check_effective_awsaccount_case_error_get_record_pm_aws_account_coops(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())

        # patch mock
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_logger_error = patch.object(CwLogAdapter, "error")
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")

        # start mock object
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_logger_error = patch_logger_error.start()
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()

        # mock object
        mock_begin_cw_logger.return_value = cw_logger
        mock_query_awscoop_coop_key.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_logger_error.stop)
        self.addCleanup(patch_query_awscoop_coop_key.stop)

        # call function test
        actual_response = awssecuritychecks_logic.check_effective_awsaccount(
            trace_id, aws_account, coop_id, role_name, external_id,
            organization_id, project_id, check_history_id)

        expect_response = {
            "TaskResult": "Fail"
        }
        # check result
        self.assertDictEqual(expect_response, actual_response)

        # check log message error
        mock_logger_error.assert_any_call("AWSアカウント連携情報取得に失敗しました。: CoopID=%s",
                                          coop_id)
