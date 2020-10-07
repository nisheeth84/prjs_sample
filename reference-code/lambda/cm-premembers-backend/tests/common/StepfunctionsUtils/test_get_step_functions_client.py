import copy
import boto3

from tests.testcasebase import TestCaseBase
from tests.mock.aws.stepfunctions import step_functions_utils
from premembers.exception.pm_exceptions import PmError
from premembers.common import StepfunctionsUtils
from tests.mock.data.aws.data_common import DataCommon
from botocore.exceptions import ClientError
from unittest.mock import patch
from premembers.common.cw_log_adapter import CwLogAdapter

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(1))
step_functions_client_connect = None


class TestGetStepFunctionsClient(TestCaseBase):
    def setUp(self):
        super().setUp()

        # create session
        global step_functions_client_connect
        if not step_functions_client_connect:
            step_functions_client_connect = step_functions_utils.client_connect()

    def test_get_step_functions_client_success(self):
        # connect client
        expected_client_connect_step_functions = step_functions_client_connect

        # mock client
        patch_method_client = patch.object(boto3, 'client')

        # start mock object
        mock_method_client = patch_method_client.start()

        # mock object
        mock_method_client.return_value = expected_client_connect_step_functions

        # addCleanup stop mock object
        self.addCleanup(patch_method_client.stop)

        # call function test
        actual_client_connect_step_functions = StepfunctionsUtils.get_step_functions_client(
            trace_id)

        # check response
        self.assertEqual(expected_client_connect_step_functions,
                         actual_client_connect_step_functions)

        # check connect client
        mock_method_client.assert_any_call('stepfunctions')

    def test_get_step_functions_client_error(self):
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        # mock client
        patch_method_client = patch.object(boto3, 'client')
        patch_logger_error = patch.object(CwLogAdapter, 'error')

        # start mock object
        mock_method_client = patch_method_client.start()
        mock_logger_error = patch_logger_error.start()

        # mock object
        mock_method_client.side_effect = ClientError(
            error_response=expected_error_response,
            operation_name=expected_operation_name)

        # addCleanup stop mock object
        self.addCleanup(patch_method_client.stop)
        self.addCleanup(patch_logger_error.stop)

        with self.assertRaises(PmError):
            # call function test
            StepfunctionsUtils.get_step_functions_client(trace_id)

        # check message log error
        mock_logger_error.assert_any_call("Step Functionsクライアント作成に失敗しました。")
