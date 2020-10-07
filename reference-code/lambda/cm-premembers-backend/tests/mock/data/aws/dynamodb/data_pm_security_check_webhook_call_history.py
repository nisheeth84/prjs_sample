import copy
from tests.mock.data.aws.dynamodb.data_common import DataCommon


class DataPmSecurityCheckWebhookCallHistory:
    LIST_DATA_SECURITY_CHECK_WEBHOOK_CALL_HISTORY = [
        {
            "CreatedAt": "2019-08-20 06:08:41.908",
            "ExecutedStatus": "Success",
            "SecurityCheckWebhookID": copy.deepcopy(DataCommon.SECURITY_CHECK_WEBHOOK_ID.format(str(3)))
        },
        {
            "CreatedAt": "2019-08-23 06:08:41.908",
            "ExecutedStatus": "Success",
            "SecurityCheckWebhookID": copy.deepcopy(DataCommon.SECURITY_CHECK_WEBHOOK_ID.format(str(3)))
        },
        {
            "CreatedAt": "2019-08-21 06:08:41.908",
            "ExecutedStatus": "Success",
            "SecurityCheckWebhookID": copy.deepcopy(DataCommon.SECURITY_CHECK_WEBHOOK_ID.format(str(2)))
        }
    ]

    LIST_DATA_SECURITY_CHECK_WEBHOOK_CALL_HISTORY_OVER_LIMIT_CHECK = [
        {
            "CreatedAt": "2029-08-20 06:08:41.908",
            "ExecutedStatus": "Success",
            "SecurityCheckWebhookID": copy.deepcopy(DataCommon.SECURITY_CHECK_WEBHOOK_ID.format(str(3)))
        },
        {
            "CreatedAt": "2029-08-23 06:08:41.908",
            "ExecutedStatus": "Success",
            "SecurityCheckWebhookID": copy.deepcopy(DataCommon.SECURITY_CHECK_WEBHOOK_ID.format(str(3)))
        },
        {
            "CreatedAt": "2029-08-21 06:08:41.908",
            "ExecutedStatus": "Success",
            "SecurityCheckWebhookID": copy.deepcopy(DataCommon.SECURITY_CHECK_WEBHOOK_ID.format(str(2)))
        }
    ]
