import copy

from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from premembers.exception.pm_exceptions import PmError
from premembers.check.logic import awschecksBatch_logic
from tests.mock.data.aws.aws_request import AwsRequest
from premembers.common import common_utils
from premembers.const.const import CommonConst
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.dynamodb.data_common import DataCommon

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
context_aws = copy.deepcopy(AwsRequest)
message = "message"

stage = common_utils.get_environ(CommonConst.STAGE)
body_mail = "RequestID: {0}\nCheckHistoryID: {1}\nOrganizationID: {2}\nProjectID: {3}\nMessage: {3}".format(
    context_aws.aws_request_id, check_history_id, organization_id, project_id,
    message)
subject = "チェックバッチエラー通知メール送信失敗（{0}）".format(
            common_utils.get_environ(CommonConst.STAGE))


class TestPublishErrorMessageSendMailExecuteCheckError(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_publish_error_message_send_checkerror_email_case_success(self):
        # mock object
        patch_aws_sns = patch("premembers.common.aws_common.aws_sns")

        # start mock object
        mock_aws_sns = patch_aws_sns.start()

        # mock data
        mock_aws_sns.side_effect = None

        # addCleanup stop mock object
        self.addCleanup(patch_aws_sns.stop)

        # call function test
        awschecksBatch_logic.publish_error_message_send_checkerror_email(
            trace_id, check_history_id, organization_id, project_id,
            context_aws.aws_request_id, message)

        # check param call function aws_sns
        mock_aws_sns.assert_any_call(
            trace_id, subject, body_mail,
            common_utils.get_environ(CommonConst.SENDMAIL_ERROR_NOTIFY_TOPIC))

    def test_publish_error_message_send_checkerror_email_case_error(self):
        # mock object
        patch_aws_sns = patch("premembers.common.aws_common.aws_sns")

        # start mock object
        mock_aws_sns = patch_aws_sns.start()

        # mock data
        mock_aws_sns.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_aws_sns.stop)

        # call function test
        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            awschecksBatch_logic.publish_error_message_send_checkerror_email(
                trace_id, check_history_id, organization_id, project_id,
                context_aws.aws_request_id, message)

        # check write log error
        mock_method_error.assert_any_call("通知メール送信エラーメッセージのパブリッシュに失敗しました。")
