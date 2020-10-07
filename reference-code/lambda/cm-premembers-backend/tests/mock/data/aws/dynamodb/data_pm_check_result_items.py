import copy
from tests.mock.data.aws.dynamodb.data_common import DataCommon

ORGANIZATION_ID = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
PROJECT_ID = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
CHECK_HISTORY_ID = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
CHECK_ITEM_CODE_TEST = copy.deepcopy(DataCommon.CHECK_ITEM_CODE_TEST.format(str(3)))
AWS_ACCOUNT = copy.deepcopy(DataCommon.AWS_ACCOUNT)
COOP_ID = copy.deepcopy(DataCommon.COOP_ID.format(str(3)))
SORT_CODE_TEMPLATE = "{0}_{1}_{2}_{3}"
SORT_CODE = SORT_CODE_TEMPLATE.format(CHECK_ITEM_CODE_TEST, ORGANIZATION_ID,
                                      PROJECT_ID, AWS_ACCOUNT)


class DataPmCheckResultItems:
    DATA_SIMPLE = {
        "AssessmentFlag": -1,
        "AWSAccount": AWS_ACCOUNT,
        "AWSAccountCoopID": COOP_ID,
        "AWSAccountName": "AWSAccountName",
        "CheckHistoryID": CHECK_HISTORY_ID,
        "CheckItemCode": CHECK_ITEM_CODE_TEST,
        "CheckResult": 2,
        "CheckResultID": "15b08c6d-4819-4d4b-9716-7adb26b1ff89",
        "CheckResultItemID": "009b6127-e96b-406c-a7ff-88fe8846511b",
        "CreatedAt": "2019-08-01 22:46:50.791",
        "ExclusionFlag": 0,
        "ExecutedDateTime": "2019-08-01 22:33:59.191",
        "OrganizationID": ORGANIZATION_ID,
        "OrganizationName": "AWS事業部 みはる支社",
        "ProjectID": PROJECT_ID,
        "ProjectName": "滝桜 倍増計画",
        "ResultCsvPath": True,
        "ResultJsonPath": "6d52ab60-41dd-48b0-b799-bb19cee7eb8d/9b97c361-f6cc-4486-a71e-4a246e0f1e18/0a4a1a36-541e-4b4f-ad9c-c67d92dd145f/964503621683/check_result/IBP/CHECK_IBP_ITEM_01_01.json",
        "SortCode": SORT_CODE,
        "TimeToLive": "1567290839.191741943359375",
        "UpdatedAt": "2019-08-01 22:46:50.791"
    }
