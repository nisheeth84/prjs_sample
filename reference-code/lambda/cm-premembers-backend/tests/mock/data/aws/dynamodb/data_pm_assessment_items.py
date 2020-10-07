import copy

from decimal import Decimal
from datetime import timedelta
from premembers.common import common_utils, date_utils
from tests.mock.data.aws.dynamodb.data_common import DataCommon


class DataPmAssessmentItems():
    TIME_TO_LIVE_DATE = date_utils.get_current_date() + timedelta(days=180)
    TIME_TO_LIVE = Decimal(TIME_TO_LIVE_DATE.timestamp())
    DATE_NOW = common_utils.get_current_date()
    ORGANIZATION_ID = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
    PROJECT_ID = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
    USER_ID = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
    ACCOUNT_REFINE_CODE_TEMPLATE = "{0}_{1}_{2}"
    AWS_ACCOUNT = copy.deepcopy(DataCommon.AWS_ACCOUNT)
    CHECK_CIS12_ITEM_4_04 = "CHECK_CIS12_ITEM_4_04"
    ACCOUNT_REFINE_CODE = ACCOUNT_REFINE_CODE_TEMPLATE.format(
        ORGANIZATION_ID, PROJECT_ID, AWS_ACCOUNT)
    ASSESSMENTITEM_ID_TEMPLATE = "{0}_{1}_{2}_{3}"
    ASSESSMENT_ITEM_ID = ASSESSMENTITEM_ID_TEMPLATE.format(
        ORGANIZATION_ID, PROJECT_ID, AWS_ACCOUNT, CHECK_CIS12_ITEM_4_04)

    DATA_SIMPLE = {
        "AccountRefineCode": ACCOUNT_REFINE_CODE,
        "AssessmentComment": "20190416145500に確認しました",
        "AssessmentItemID": ASSESSMENT_ITEM_ID,
        "AWSAccount": AWS_ACCOUNT,
        "CheckItemCode": CHECK_CIS12_ITEM_4_04,
        "CreatedAt": DATE_NOW,
        "MailAddress": "test_user_01@sample.com",
        "OrganizationID": ORGANIZATION_ID,
        "ProjectID": PROJECT_ID,
        'TimeToLive': TIME_TO_LIVE,
        "UpdatedAt": DATE_NOW,
        "UserID": USER_ID
    }
