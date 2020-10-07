import copy
import json
import inspect

from premembers.common import common_utils
from tests.testcasebase import TestCaseBase
from tests.mock.aws.stepfunctions import step_functions_utils
from premembers.common import StepfunctionsUtils
from tests.mock.data.aws.data_common import DataCommon
from botocore.exceptions import ClientError
from unittest.mock import patch
from premembers.common.cw_log_adapter import CwLogAdapter
from tests.mock.data.aws.dynamodb.data_pm_check_history import DataPmCheckHistory
from premembers.exception.pm_exceptions import PmError

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(1))
check_history_id = copy.deepcopy(DataPmCheckHistory.CHECK_HISTORY_ID)
step_functions_client_connect = None
state_machine_arn = "state_machine_arn"
param = {'check_history_id': check_history_id}
data_input = json.dumps(param)


class TestStartExecutionStepFunctions(TestCaseBase):
    def setUp(self):
        super().setUp()

        # create session
        global step_functions_client_connect
        if not step_functions_client_connect:
            step_functions_client_connect = step_functions_utils.client_connect()

    def test_start_execution_step_functions_success(self):
        global step_functions_client_connect

        # patch mock
        patch_start_execution_step_functions = patch.object(
            step_functions_client_connect, "start_execution")

        # start mock object
        mock_start_execution_step_functions = patch_start_execution_step_functions.start()

        # mock object
        mock_start_execution_step_functions.return_value = None

        # addCleanup stop mock object
        self.addCleanup(patch_start_execution_step_functions.stop)

        StepfunctionsUtils.start_execution_step_functions(
            trace_id, check_history_id, step_functions_client_connect,
            state_machine_arn, data_input)

        mock_start_execution_step_functions.assert_called_once_with(
            stateMachineArn=state_machine_arn, input=data_input)

    def test_start_execution_step_functions_error(self):
        global step_functions_client_connect
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                                 inspect.currentframe())

        # patch mock
        patch_start_execution_step_functions = patch.object(
            step_functions_client_connect, "start_execution")
        patch_begin_cw_logger = patch("premembers.common.common_utils.begin_cw_logger")
        patch_logger_error = patch.object(CwLogAdapter, "error")

        # start mock object
        mock_start_execution_step_functions = patch_start_execution_step_functions.start()
        mock_begin_cw_logger = patch_begin_cw_logger.start()
        mock_logger_error = patch_logger_error.start()

        # mock object
        mock_start_execution_step_functions.side_effect = ClientError(
            error_response=expected_error_response,
            operation_name=expected_operation_name)
        mock_begin_cw_logger.return_value = cw_logger

        # addCleanup stop mock object
        self.addCleanup(patch_start_execution_step_functions.stop)
        self.addCleanup(patch_begin_cw_logger.stop)
        self.addCleanup(patch_logger_error.stop)

        with self.assertRaises(PmError):
            StepfunctionsUtils.start_execution_step_functions(
                trace_id, check_history_id, step_functions_client_connect,
                state_machine_arn, data_input)

        mock_logger_error.assert_any_call(
            "ステートマシンの起動に失敗しました。: CheckHistoryID=%s", check_history_id)
