import copy

from premembers.common import common_utils
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from decimal import Decimal
from datetime import timedelta
from premembers.common import date_utils

time_to_live_date = date_utils.get_current_date() + timedelta(days=180)
time_to_live = Decimal(time_to_live_date.timestamp())


class DataPmCheckHistory:
    ORGANIZATION_ID = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
    PROJECT_ID = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
    CHECK_HISTORY_ID = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(3))

    DATA_SIMPLE = {
        "CheckCode": "CHECK_CIS",
        "CheckHistoryID": CHECK_HISTORY_ID,
        "CheckStatus": 0,
        "CreatedAt": common_utils.get_current_date(),
        "ErrorCode": "ErrorCode",
        "ExecutedDateTime": common_utils.get_current_date(),
        "ExecutedType": "AUTO",
        "OrganizationID": ORGANIZATION_ID,
        "ProjectID": PROJECT_ID,
        "ReportFilePath": "ReportFilePath",
        "TimeToLive": time_to_live,
        "UpdatedAt": common_utils.get_current_date()
    }
