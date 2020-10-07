import copy

from premembers.common import common_utils
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_email_change_apply import DataPmEmailChangeApply

organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))


class DataPmOrgNotifyMailDestinations():

    BEFORE_MAIL_ADDRESS = copy.deepcopy(
        DataPmEmailChangeApply.BEFORE_MAIL_ADDRESS)
    NOTIFY_CODE = "CHECK_CIS"

    LIST_ORG_NOTIFY_MAIL_DESTINATIONS = [
        {
            "CreatedAt": common_utils.get_current_date(),
            "Destinations": [
                {
                    "MailAddress": BEFORE_MAIL_ADDRESS,
                    "UserID": "7c287ff3-f062-4f6f-ae11-825616ea6a9f"
                }
            ],
            "NotifyCode": NOTIFY_CODE,
            "OrganizationID": organization_id,
            "UpdatedAt": common_utils.get_current_date()
        },
        {
            "CreatedAt": common_utils.get_current_date(),
            "Destinations": [
                {
                    "MailAddress": BEFORE_MAIL_ADDRESS,
                    "UserID": "7c287ff3-f062-4f6f-ae11-825616ea6a9f"
                }
            ],
            "NotifyCode": NOTIFY_CODE,
            "OrganizationID": copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(1))),
            "UpdatedAt": common_utils.get_current_date()
        }
    ]
