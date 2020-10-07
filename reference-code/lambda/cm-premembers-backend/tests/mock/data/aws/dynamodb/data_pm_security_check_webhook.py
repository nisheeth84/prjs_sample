import copy
from tests.mock.data.aws.dynamodb.data_common import DataCommon


class DataPmSecurityCheckWebhook:
    ORGANIZATION_ID = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
    PROJECT_ID = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
    WEBHOOK_PATH = "webhook_path"
    LIST_DATA_SECURITY_CHECK_WEBHOOK = [
        {
            "CreatedAt": "2019-08-20 06:08:33.404",
            "Enabled": True,
            "MailAddress": "test-user1@example.com",
            "MaxDailyExecutedCount": 3,
            "OrganizationID": ORGANIZATION_ID,
            "ProjectID": PROJECT_ID,
            "SecurityCheckWebhookID": copy.deepcopy(DataCommon.SECURITY_CHECK_WEBHOOK_ID.format(str(3))),
            "UpdatedAt": "2019-08-20 06:08:33.404",
            "UserID": "e2a6be77-32e7-4eec-a84f-3e764802a61d",
            "WebhookPath": WEBHOOK_PATH
        },
        {
            "CreatedAt": "2019-08-20 06:08:33.404",
            "Enabled": True,
            "MailAddress": "test-user2@example.com",
            "MaxDailyExecutedCount": 3,
            "OrganizationID": ORGANIZATION_ID,
            "ProjectID": PROJECT_ID,
            "SecurityCheckWebhookID": copy.deepcopy(DataCommon.SECURITY_CHECK_WEBHOOK_ID.format(str(2))),
            "UpdatedAt": "2019-08-20 06:08:33.404",
            "UserID": "e2a6be77-32e7-4eec-a84f-3e764802a61d",
            "WebhookPath": WEBHOOK_PATH
        }
    ]

    LIST_DATA_SECURITY_CHECK_WEBHOOK_CONVERT_RESPONSE = [
        {
            "createdAt": "2019-08-20 06:08:33.404",
            "enabled": True,
            "MailAddress": "test-user1@example.com",
            "MaxDailyExecutedCount": 3,
            "OrganizationID": ORGANIZATION_ID,
            "ProjectID": PROJECT_ID,
            "id": copy.deepcopy(DataCommon.SECURITY_CHECK_WEBHOOK_ID.format(str(3))),
            "updatedAt": "2019-08-20 06:08:33.404",
            "userId": "e2a6be77-32e7-4eec-a84f-3e764802a61d",
            "webhookPath": "c8061ff1-ad3f-4f14-995d-d12a9253edf6"
        },
        {
            "createdAt": "2019-08-20 06:08:33.404",
            "enabled": True,
            "MailAddress": "test-user2@example.com",
            "MaxDailyExecutedCount": 3,
            "OrganizationID": ORGANIZATION_ID,
            "ProjectID": PROJECT_ID,
            "id": copy.deepcopy(DataCommon.SECURITY_CHECK_WEBHOOK_ID.format(str(2))),
            "updatedAt": "2019-08-20 06:08:33.404",
            "userId": "e2a6be77-32e7-4eec-a84f-3e764802a61d",
            "webhookPath": "c8061ff1-ad3f-4f14-995d-d12a9253edf6"
        }
    ]

    DATA_SECURITY_CHECK_WEBHOOK_ENABLED_FALSE = {
        "CreatedAt": "2019-08-20 06:08:33.404",
        "Enabled": False,
        "MailAddress": "test-user2@example.com",
        "MaxDailyExecutedCount": 3,
        "OrganizationID": ORGANIZATION_ID,
        "ProjectID": PROJECT_ID,
        "SecurityCheckWebhookID": copy.deepcopy(DataCommon.SECURITY_CHECK_WEBHOOK_ID.format(str(2))),
        "UpdatedAt": "2019-08-20 06:08:33.404",
        "UserID": "e2a6be77-32e7-4eec-a84f-3e764802a61d",
        "WebhookPath": "c8061ff1-ad3f-4f14-995d-d12a9253edf6"
    }
