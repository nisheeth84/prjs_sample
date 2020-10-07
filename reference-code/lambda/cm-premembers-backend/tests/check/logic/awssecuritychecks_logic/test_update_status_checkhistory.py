import copy
import inspect

from premembers.common import common_utils
from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from premembers.exception.pm_exceptions import PmError
from premembers.common.cw_log_adapter import CwLogAdapter
from premembers.check.logic import awssecuritychecks_logic
from tests.mock.data.aws.dynamodb.data_pm_check_history import DataPmCheckHistory

data_pm_check_history = copy.deepcopy(DataPmCheckHistory.DATA_SIMPLE)
check_history_id = copy.deepcopy(DataPmCheckHistory.CHECK_HISTORY_ID)
trace_id = check_history_id
error_code = None
check_status = 2


class TestUpdateStatusCheckHistory(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_test_update_status_checkhistory_case_error_get_record_pm_check_history(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())
        pm_error = PmError()

        # patch mock
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_logger_error = patch.object(CwLogAdapter, "error")
        patch_write_log_pm_error = patch("premembers.common.common_utils.write_log_pm_error")

        # start mock object
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_logger_error = patch_logger_error.start()
        mock_write_log_pm_error = patch_write_log_pm_error.start()

        # mock object
        mock_query_key_pm_check_history.side_effect = pm_error
        mock_begin_cw_logger.return_value = cw_logger
        mock_write_log_pm_error.return_value = pm_error

        # addCleanup stop mock object
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_logger_error.stop)
        self.addCleanup(patch_write_log_pm_error.stop)

        with self.assertRaises(PmError):
            # call function test
            awssecuritychecks_logic.update_status_checkhistory(
                check_history_id, error_code, check_status)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s", check_history_id)

        # check call function write_log_pm_error
        mock_write_log_pm_error.assert_called_once_with(pm_error, cw_logger)

    def test_test_update_status_checkhistory_case_get_record_pm_check_history_is_zero(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())

        # patch mock
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_logger_error = patch.object(CwLogAdapter, "error")

        # start mock object
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_logger_error = patch_logger_error.start()

        # mock object
        mock_query_key_pm_check_history.return_value = {}
        mock_begin_cw_logger.return_value = cw_logger

        # addCleanup stop mock object
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_logger_error.stop)

        with self.assertRaises(PmError):
            # call function test
            awssecuritychecks_logic.update_status_checkhistory(
                check_history_id, error_code, check_status)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "チェック履歴情報がありません。: CheckHistoryID=%s", check_history_id)

    def test_test_update_status_checkhistory_case_error_update_record_pm_check_history(self):
        # create data mock
        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())
        pm_error = PmError()

        # patch mock
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_update_pm_check_history = patch("premembers.repository.pm_checkHistory.update")
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_logger_error = patch.object(CwLogAdapter, "error")
        patch_write_log_pm_error = patch("premembers.common.common_utils.write_log_pm_error")

        # start mock object
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_update_pm_check_history = patch_update_pm_check_history.start()
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_logger_error = patch_logger_error.start()
        mock_write_log_pm_error = patch_write_log_pm_error.start()

        # mock object
        mock_query_key_pm_check_history.return_value = data_pm_check_history
        mock_update_pm_check_history.side_effect = pm_error
        mock_begin_cw_logger.return_value = cw_logger
        mock_write_log_pm_error.return_value = pm_error

        # addCleanup stop mock object
        self.addCleanup(patch_query_key_pm_check_history.stop)
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_logger_error.stop)
        self.addCleanup(patch_write_log_pm_error.stop)

        with self.assertRaises(PmError):
            # call function test
            awssecuritychecks_logic.update_status_checkhistory(
                check_history_id, error_code, check_status)

        # check log message error
        mock_logger_error.assert_called_once_with(
            "チェック履歴情報のステータス更新に失敗しました。: CheckHistoryID=%s", check_history_id)

        # check call function write_log_pm_error
        mock_write_log_pm_error.assert_called_once_with(pm_error, cw_logger)
