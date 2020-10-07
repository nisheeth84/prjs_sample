import copy

from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from premembers.check.logic import awschecks_logic

aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
execute_user_id = "ExecuteUserID"
trace_id = execute_user_id
email = "luvinatest@luvina.net"
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))


class TestExecuteSecurityCheck(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_execute_security_check_success(self):
        # patch mock
        patch_execute_security_check_with_executed_type = patch("premembers.check.logic.awschecks_logic.execute_security_check_with_executed_type")

        # start mock object
        mock_execute_security_check_with_executed_typ = patch_execute_security_check_with_executed_type.start()

        # addCleanup stop mock object
        self.addCleanup(patch_execute_security_check_with_executed_type.stop)

        # call function test
        awschecks_logic.execute_security_check(trace_id, organization_id,
                                               project_id, execute_user_id,
                                               email)

        # check param call function
        mock_execute_security_check_with_executed_typ.assert_any_call(
            trace_id, organization_id, project_id, execute_user_id, email,
            "MANUAL")
