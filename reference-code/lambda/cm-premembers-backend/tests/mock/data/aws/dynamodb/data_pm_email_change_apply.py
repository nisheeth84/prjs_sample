import copy

from premembers.common import common_utils
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from decimal import Decimal
from datetime import timedelta
from premembers.common import date_utils

user_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
time_to_live_date = date_utils.get_current_date() + timedelta(days=180)
time_to_live = Decimal(time_to_live_date.timestamp())


class DataPmEmailChangeApply():
    APPLY_ID = "eb3b5f76-8945-11e7-b15a-8f7e5433dada-{}"
    BEFORE_MAIL_ADDRESS = "luvina_test1@luvina.net"
    AFTER_MAIL_ADDRESS = "luvina_test2@luvina.net"
    DATA_CALLER_SERVICE_NAME_INSIGHTWATCH = {
        "ApplyID": APPLY_ID.format(str(3)),
        "UserID": user_id,
        "BeforeMailAddress": BEFORE_MAIL_ADDRESS,
        "AfterMailAddress": AFTER_MAIL_ADDRESS,
        "TimeToLive": time_to_live,
        "CreatedAt": common_utils.get_current_date(),
        "UpdatedAt": common_utils.get_current_date(),
        "CallerServiceName": "insightwatch"
    }

    DATA_CALLER_SERVICE_NAME_OPSWITCH = {
        "ApplyID": APPLY_ID.format(str(3)),
        "UserID": user_id,
        "BeforeMailAddress": BEFORE_MAIL_ADDRESS,
        "AfterMailAddress": AFTER_MAIL_ADDRESS,
        "TimeToLive": time_to_live,
        "CreatedAt": common_utils.get_current_date(),
        "UpdatedAt": common_utils.get_current_date(),
        "CallerServiceName": "opswitch"
    }

    DATA_INSERT_NOT_EXISTS_CALLER_SERVICE_NAME = {
        "ApplyID": APPLY_ID.format(str(3)),
        "UserID": user_id,
        "BeforeMailAddress": BEFORE_MAIL_ADDRESS,
        "AfterMailAddress": AFTER_MAIL_ADDRESS,
        "TimeToLive": time_to_live,
        "CreatedAt": common_utils.get_current_date(),
        "UpdatedAt": common_utils.get_current_date()
    }
