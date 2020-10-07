import copy
import inspect

from botocore.exceptions import ClientError
from premembers.common import common_utils
from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from premembers.exception.pm_exceptions import PmError
from premembers.common.cw_log_adapter import CwLogAdapter
from premembers.check.logic import awssecuritychecks_logic
from tests.mock.data.aws.dynamodb.data_pm_check_history import DataPmCheckHistory
from tests.mock.aws.stepfunctions import step_functions_utils
from tests.mock.data.aws.data_common import DataCommon

data_pm_check_history = copy.deepcopy(DataPmCheckHistory.DATA_SIMPLE)
check_history_id = copy.deepcopy(DataPmCheckHistory.CHECK_HISTORY_ID)
trace_id = check_history_id


class TestExecuteSecurityCheckStateMachine(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_execute_securitycheck_statemachine_case_error_validate_param(self):
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

        with self.assertRaises(PmError) as exception:
            # call function test
            awssecuritychecks_logic.execute_securitycheck_statemachine(
                trace_id, "")

        # check error
        actual_message = exception.exception.message
        self.assertEquals("CKEX_SECURITY-001", actual_message)

        # check log message error
        mock_logger_error.assert_any_call("チェック履歴IDが指定されていません。")

    def test_execute_securitycheck_statemachine_case_error_get_client_step_functions(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())
        self.create_mock_boto3_client_error()

        # patch mock
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_update_status_checkhistory = patch("premembers.check.logic.awssecuritychecks_logic.update_status_checkhistory")

        # start mock object
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_update_status_checkhistory = patch_update_status_checkhistory.start()

        # mock object
        mock_begin_cw_logger.return_value = cw_logger
        mock_update_status_checkhistory.side_effect = None

        # addCleanup stop mock object
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_update_status_checkhistory.stop)

        with self.assertRaises(PmError) as exception:
            # call function test
            awssecuritychecks_logic.execute_securitycheck_statemachine(
                trace_id, check_history_id)

        # check error
        actual_message = exception.exception.message
        self.assertEquals("CKEX_SECURITY-002", actual_message)

        # check call function update_status_checkhistory
        mock_update_status_checkhistory.assert_called_once_with(
            check_history_id, "CKEX_SECURITY-002", 0)

    def test_execute_securitycheck_statemachine_case_error_start_execution_step_functions(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        pm_error = PmError(message="CKEX_SECURITY-002")
        step_functions_client = step_functions_utils.client_connect()

        # patch mock
        patch_logger_error = patch.object(CwLogAdapter, "error")
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_start_execution_step_functions = patch.object(
            step_functions_client, "start_execution")
        patch_update_status_checkhistory = patch("premembers.check.logic.awssecuritychecks_logic.update_status_checkhistory")
        patch_write_log_pm_error = patch("premembers.common.common_utils.write_log_pm_error")

        # start mock object
        mock_logger_error = patch_logger_error.start()
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_start_execution_step_functions = patch_start_execution_step_functions.start()
        mock_update_status_checkhistory = patch_update_status_checkhistory.start()
        mock_write_log_pm_error = patch_write_log_pm_error.start()

        # mock object
        mock_begin_cw_logger.return_value = cw_logger
        mock_update_status_checkhistory.side_effect = None
        mock_start_execution_step_functions.side_effect = ClientError(
            error_response=expected_error_response,
            operation_name=expected_operation_name)
        mock_write_log_pm_error.return_value = pm_error

        # addCleanup stop mock object
        self.addCleanup(patch_logger_error.stop)
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_start_execution_step_functions.stop)
        self.addCleanup(patch_update_status_checkhistory.stop)
        self.addCleanup(patch_write_log_pm_error.stop)

        with self.assertRaises(PmError) as exception:
            # call function test
            awssecuritychecks_logic.execute_securitycheck_statemachine(
                trace_id, check_history_id)

        # check error
        actual_message = exception.exception.message
        self.assertEquals("CKEX_SECURITY-002", actual_message)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "ステートマシンの起動に失敗しました。: CheckHistoryID=%s", check_history_id)

        # check call function write_log_pm_error
        mock_write_log_pm_error.assert_any_call(pm_error, cw_logger,
                                                "CKEX_SECURITY-002")

        # check call function update_status_checkhistory
        mock_update_status_checkhistory.assert_called_once_with(
            check_history_id, "CKEX_SECURITY-002", 0)

    def test_execute_securitycheck_statemachine_case_update_status_checkhistory_error(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())
        pm_error = PmError()

        # patch mock
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_update_status_checkhistory = patch("premembers.check.logic.awssecuritychecks_logic.update_status_checkhistory")
        patch_write_log_pm_error = patch("premembers.common.common_utils.write_log_pm_error")

        # start mock object
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_update_status_checkhistory = patch_update_status_checkhistory.start()
        mock_write_log_pm_error = patch_write_log_pm_error.start()

        # mock object
        mock_begin_cw_logger.return_value = cw_logger
        mock_update_status_checkhistory.side_effect = pm_error
        mock_write_log_pm_error.side_effect = pm_error

        # addCleanup stop mock object
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_update_status_checkhistory.stop)
        self.addCleanup(patch_write_log_pm_error.stop)

        with self.assertRaises(PmError):
            # call function test
            awssecuritychecks_logic.execute_securitycheck_statemachine(
                trace_id, check_history_id)

        # check call function write_log_pm_error
        mock_write_log_pm_error.assert_any_call(pm_error,
                                                cw_logger,
                                                exc_info=True)

        # check call function update_status_checkhistory
        mock_update_status_checkhistory.assert_called_once_with(
            check_history_id, None, 2)
