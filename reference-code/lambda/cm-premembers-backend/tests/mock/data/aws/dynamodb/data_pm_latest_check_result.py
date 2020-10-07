import copy
from tests.mock.data.aws.dynamodb.data_common import DataCommon


class DataPmLatestCheckResult:
    DATA_SIMPLE = {
        "CheckHistoryID": copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3))),
        "CreatedAt": "2019-06-05 00:22:32.141",
        "OrganizationID": copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3))),
        "ProjectID": copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
    }
