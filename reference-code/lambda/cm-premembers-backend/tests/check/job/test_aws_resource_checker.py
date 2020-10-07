import os
import unittest

from unittest.mock import patch
from unittest.mock import MagicMock
from dotenv import load_dotenv
from pathlib import Path
from premembers.exception.pm_exceptions import PmError
from premembers.check.job import aws_resource_checker


param_batch = [
    "aws_resource_checker.py",
    "check_history_id",
    "log_id"
]

CheckStatus = {
    "Waiting": 0,
    "CheckCompleted": 2
}


class TestAwsResourceChecker(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)

    def test_aws_resource_checker_success(self):
        # mock object
        write_log_pm_error_patch = patch('premembers.common.common_utils.write_log_pm_error')
        processing_finish_patch = patch('premembers.check.logic.awsResourceChecker_logic.processing_finish')
        aws_resource_checker_patch = patch('premembers.check.logic.awsResourceChecker_logic.aws_resource_checker')
        sys_exit_patch = patch('sys.exit')

        # start mock object
        mock_write_log_pm_error = write_log_pm_error_patch.start()
        mock_processing_finish = processing_finish_patch.start()
        mock_aws_resource_checker = aws_resource_checker_patch.start()
        mock_sys_exit = sys_exit_patch.start()

        # mock data
        mock_aws_resource_checker.side_effect = MagicMock(side_effect=None)
        mock_sys_exit.side_effect = MagicMock(side_effect=None)

        # addCleanup stop mock object
        self.addCleanup(write_log_pm_error_patch.stop)
        self.addCleanup(processing_finish_patch.stop)
        self.addCleanup(aws_resource_checker_patch.stop)
        self.addCleanup(sys_exit_patch.stop)

        # call batch
        aws_resource_checker.main(param_batch)

        # assert function
        mock_write_log_pm_error.assert_not_called()
        mock_processing_finish.assert_called_once_with(
            "check_history_id", None, CheckStatus['CheckCompleted'])

    def test_aws_resource_checker_error_linked_aws_account(self):
        # mock object
        write_log_pm_error_patch = patch('premembers.common.common_utils.write_log_pm_error')
        processing_finish_patch = patch('premembers.check.logic.awsResourceChecker_logic.processing_finish')
        aws_resource_checker_patch = patch('premembers.check.logic.awsResourceChecker_logic.aws_resource_checker')
        sys_exit_patch = patch('sys.exit')

        # start mock object
        mock_write_log_pm_error = write_log_pm_error_patch.start()
        mock_processing_finish = processing_finish_patch.start()
        mock_aws_resource_checker = aws_resource_checker_patch.start()
        mock_sys_exit = sys_exit_patch.start()

        # mock data
        mock_aws_resource_checker.side_effect = MagicMock(
            side_effect=PmError(message='CKEX_SECURITY-900'))
        mock_sys_exit.side_effect = MagicMock(side_effect=None)

        # addCleanup stop mock object
        self.addCleanup(write_log_pm_error_patch.stop)
        self.addCleanup(processing_finish_patch.stop)
        self.addCleanup(aws_resource_checker_patch.stop)
        self.addCleanup(sys_exit_patch.stop)

        # call batch
        aws_resource_checker.main(param_batch)

        # assert function
        mock_write_log_pm_error.assert_not_called()
        mock_processing_finish.assert_called_once_with(
            "check_history_id", "CKEX_SECURITY-900", CheckStatus['Waiting'])

    def test_aws_resource_checker_error_other_error_linked_aws_account(self):
        # mock object
        write_log_pm_error_patch = patch('premembers.common.common_utils.write_log_pm_error')
        processing_finish_patch = patch('premembers.check.logic.awsResourceChecker_logic.processing_finish')
        aws_resource_checker_patch = patch('premembers.check.logic.awsResourceChecker_logic.aws_resource_checker')
        sys_exit_patch = patch('sys.exit')

        # start mock object
        mock_write_log_pm_error = write_log_pm_error_patch.start()
        mock_processing_finish = processing_finish_patch.start()
        mock_aws_resource_checker = aws_resource_checker_patch.start()
        mock_sys_exit = sys_exit_patch.start()

        # mock data
        mock_aws_resource_checker.side_effect = MagicMock(
            side_effect=PmError(message='CKEX_SECURITY-002'))
        mock_sys_exit.side_effect = MagicMock(side_effect=None)

        # addCleanup stop mock object
        self.addCleanup(write_log_pm_error_patch.stop)
        self.addCleanup(processing_finish_patch.stop)
        self.addCleanup(aws_resource_checker_patch.stop)
        self.addCleanup(sys_exit_patch.stop)

        # call batch
        aws_resource_checker.main(param_batch)

        # assert function
        mock_write_log_pm_error.assert_called_once()
        mock_processing_finish.assert_called_once_with(
            "check_history_id", "CKEX_SECURITY-002", CheckStatus['Waiting'])
