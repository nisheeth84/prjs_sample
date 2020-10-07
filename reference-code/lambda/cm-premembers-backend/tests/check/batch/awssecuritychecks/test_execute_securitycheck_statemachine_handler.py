import copy
import json

from moto import mock_dynamodb2
from tests.testcasebase import TestCaseBase
from premembers.check.batch import awssecuritychecks
from tests.mock.aws.dynamodb import db_utils
from tests.mock.aws.dynamodb import pm_checkHistory as mock_pm_checkHistory
from tests.mock.data.aws.dynamodb.data_pm_check_history import DataPmCheckHistory
from premembers.repository.table_list import Tables

data_pm_check_history = copy.deepcopy(DataPmCheckHistory.DATA_SIMPLE)
check_history_id = copy.deepcopy(DataPmCheckHistory.CHECK_HISTORY_ID)
event_mock = {
    "Records": [{
        "EventSource":
        "aws:sns",
        "EventVersion":
        "1.0",
        "EventSubscriptionArn":
        "arn:aws:sns:ap-northeast-1:216054658829:Premembers-Securitycheck-batch-error-notify:7ac53550-daac-4188-ac3f-01760588b6e1",
        "Sns": {
            "Type":
            "Notification",
            "MessageId":
            "020bed20-7771-5272-910f-bb37d1e90ec7",
            "TopicArn":
            "arn:aws:sns:ap-northeast-1:216054658829:Premembers-Securitycheck-batch-error-notify",
            "Subject":
            "チェックバッチ実行失敗",
            "Message": None,
            "Timestamp":
            "2019-10-09T09:11:52.874Z",
            "SignatureVersion":
            "1",
            "Signature":
            "rDTAmAjuF/2n1Se5ERhwO1bBk4m9cr4MLM8lStfLzU8ZmDBTHGXuQMhhR9zVQBVoNHBM/L/WfBJuxUSLb5P8UvB9Hu8INDHjmaCNLmfvxp4xdRKgNAXWffduvsB7ujULw2bvCtHwtY3VytKzC75uD7rL3YQVgfJwMinuqIyxMLMHPpKOIXzXEtK154iNJ3mJ7s28HrbymldjCwEGsdk19JNDH4khm6Z7UscTqGjtZq1GWJyRc/UtX9uysTRDEAyNaBBxTI5tbwGYydk8MjAuJxflS/LH95gv2/Gjvwk3qNAYJuJU86AAiS4YWSfX+TkY/q8wwwW+B8T4rYX0PxMoUA==",
            "SigningCertUrl":
            "https://sns.ap-northeast-1.amazonaws.com/SimpleNotificationService-6aad65c2f9911b05cd53efda11f913f9.pem",
            "UnsubscribeUrl":
            "https://sns.ap-northeast-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:ap-northeast-1:216054658829:Premembers-Securitycheck-batch-error-notify:7ac53550-daac-4188-ac3f-01760588b6e1",
            "MessageAttributes": {}
        }
    }]
}


@mock_dynamodb2
class TestExecuteSecurityCheckStateMachineHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_CHECK_HISTORY):
            db_utils.delete_table(Tables.PM_CHECK_HISTORY)

        # create table
        mock_pm_checkHistory.create_table()

    def test_execute_securitycheck_statemachine_handler_success(self):
        # create data table
        mock_pm_checkHistory.create(data_pm_check_history)

        # prepare data
        message = {
            "CheckHistoryId": check_history_id,
        }
        event_mock['Records'][0]['Sns']['Message'] = json.dumps(message)

        data_pm_check_history['ErrorCode'] = None
        data_pm_check_history['CheckStatus'] = 2
        expected_response_pm_checkHistory = data_pm_check_history

        # Call function test
        awssecuritychecks.execute_securitycheck_statemachine_handler(
            event_mock, {})

        actual_response_pm_checkHistory = mock_pm_checkHistory.query_key(
            check_history_id)

        # check response
        self.assertEquals(expected_response_pm_checkHistory['ErrorCode'],
                          actual_response_pm_checkHistory['ErrorCode'])
        self.assertEquals(
            int(expected_response_pm_checkHistory['CheckStatus']),
            int(actual_response_pm_checkHistory['CheckStatus']))
