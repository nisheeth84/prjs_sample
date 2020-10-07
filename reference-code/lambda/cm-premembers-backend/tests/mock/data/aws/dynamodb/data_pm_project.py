import copy
from tests.mock.data.aws.dynamodb.data_common import DataCommon


class DataPmProjects:
    ORGANIZATION_ID = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
    PROJECT_ID = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
    DATA_SIMPLE = {
        "CreatedAt": "2019-04-18 22:46:13.484",
        "Description": "test_decription",
        "OrganizationID": ORGANIZATION_ID,
        "ProjectID": PROJECT_ID,
        "ProjectName": "test_project_name",
        "UpdatedAt": "2019-04-18 22:46:13.484"
    }
