import copy
from tests.mock.data.aws.dynamodb.data_common import DataCommon


class DataPmOrganizations:
    ORGANIZATION_ID = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
    DATA_SIMPLE = {
        "Contract": 0,
        "ContractStatus": 1,
        "CreatedAt": "2019-05-27 00:17:07.167",
        "OrganizationID": ORGANIZATION_ID,
        "OrganizationName": "test_organization_name",
        "UpdatedAt": "2019-05-27 00:17:07.167"
    }
