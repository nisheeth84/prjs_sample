import copy

from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from premembers.exception.pm_exceptions import PmError
from premembers.check.logic import awschecksBatch_logic
from tests.mock.data.aws.aws_request import AwsRequest
from tests.mock.data.aws.dynamodb.data_common import DataCommon

aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
error_code = "default"
execute_user_id = "ExecuteUserID"
trace_id = execute_user_id
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
language = "ja"
region_name = "global"
check_code_item = "CHECK_CIS12_ITEM_2_03"
data_body = {"S3BucketName": "test s3 bucket name"}
context_aws = copy.deepcopy(AwsRequest)


class TestExecuteSendCheckerrorEmail(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_execute_send_checkerror_email_case_error_send_checkerror_email(self):
        # patch mock
        patch_publish_error_message_send_checkerror_email = patch("premembers.check.logic.awschecksBatch_logic.publish_error_message_send_checkerror_email")
        patch_send_checkerror_email = patch("premembers.check.logic.awschecksBatch_logic.send_checkerror_email")

        # start mock object
        mock_publish_error_message_send_checkerror_email = patch_publish_error_message_send_checkerror_email.start()
        mock_send_checkerror_email = patch_send_checkerror_email.start()

        # mock data
        mock_publish_error_message_send_checkerror_email.side_effect = None
        mock_send_checkerror_email.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_publish_error_message_send_checkerror_email.stop)
        self.addCleanup(patch_send_checkerror_email.stop)

        # call function test
        awschecksBatch_logic.execute_send_checkerror_email(
            trace_id, context_aws.aws_request_id, aws_account,
            check_history_id, organization_id, project_id, error_code,
            execute_user_id, region_name, check_code_item, data_body)

        # check param call function
        mock_publish_error_message_send_checkerror_email.assert_any_call(
            trace_id, check_history_id, organization_id, project_id,
            context_aws.aws_request_id, 'None')
