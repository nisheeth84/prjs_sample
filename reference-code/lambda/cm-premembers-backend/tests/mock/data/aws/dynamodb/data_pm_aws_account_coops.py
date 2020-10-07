import copy
from tests.mock.data.aws.dynamodb.data_common import DataCommon


class DataPmAwsAccountCoops:
    ORGANIZATION_ID = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
    PROJECT_ID = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
    COOP_ID = copy.deepcopy(DataCommon.COOP_ID.format(str(3)))
    AWS_ACCOUNT = copy.deepcopy(DataCommon.AWS_ACCOUNT)

    DATA_SIMPLE = {
        "RoleName": "Test-121-IAMRole-1QUQ4J2TMC93I",
        "Description": "description",
        "AWSAccount": copy.deepcopy(DataCommon.AWS_ACCOUNT),
        "CreatedAt": "2019-07-11 01:31:04.051",
        "ExternalID": "a5a01193-40a6-47b9-93ef-b43cf2fca096",
        "ProjectID": PROJECT_ID,
        "OrganizationID": ORGANIZATION_ID,
        "AWSAccountName": "AWSAccountName",
        "CoopID": COOP_ID,
        "UpdatedAt": "2019-07-11 02:01:28.771",
        "Effective": 1
    }

    LIST_AWS_ACCOUNT_COOPS = [
        {
            "RoleName": "Test-121-IAMRole-1QUQ4J2TMC93I",
            "Description": "description",
            "AWSAccount": AWS_ACCOUNT,
            "CreatedAt": "2019-07-11 01:31:04.051",
            "ExternalID": "a5a01193-40a6-47b9-93ef-b43cf2fca096",
            "ProjectID": PROJECT_ID,
            "OrganizationID": ORGANIZATION_ID,
            "AWSAccountName": "AWSAccountName",
            "CoopID": COOP_ID,
            "UpdatedAt": "2019-07-11 02:01:28.771",
            "Effective": 1
        },
        {
            "RoleName": "Test-121-IAMRole-1QUQ4J2TMC93I",
            "Description": "description",
            "AWSAccount": AWS_ACCOUNT,
            "CreatedAt": "2019-07-11 01:31:04.051",
            "ExternalID": "a5a01193-40a6-47b9-93ef-b43cf2fca096",
            "ProjectID": PROJECT_ID,
            "OrganizationID": ORGANIZATION_ID,
            "AWSAccountName": "AWSAccountName",
            "CoopID": copy.deepcopy(DataCommon.COOP_ID.format(str(2))),
            "UpdatedAt": "2019-07-11 02:01:28.771",
            "Effective": 1
        }
    ]
