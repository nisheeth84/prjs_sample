import copy
from tests.mock.data.aws.dynamodb.data_common import DataCommon


class DataPmReports:
    ORGANIZATION_ID = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
    PROJECT_ID = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
    LIST_DATA_REPORT = [
        {
            "AWSAccounts": [
                "109054975408"
            ],
            "CreatedAt": "2018-01-15 07:35:26.467",
            "ExcelOutputStatus": 2,
            "ExcelOutputTime": "2018-01-15 07:44:49.497",
            "ExcelPath": "07cc02e4-7b9f-4408-8dd5-1216c9a27a81/report/ja-JP/セキュリティチェック（0.6.1）確認.xlsx",
            "GenerateUser": "test-user1@example.com",
            "HTMLOutputStatus": 0,
            "JsonOutputPath": "JsonOutputPath1",
            "JsonOutputTime": "2018-01-15 07:44:17.803",
            "OrganizationID": ORGANIZATION_ID,
            "ProjectID": PROJECT_ID,
            "ReportID": "07cc02e4-7b9f-4408-8dd5-1216c9a27a81",
            "ReportName": "セキュリティチェック（0.6.1）確認",
            "ReportStatus": 4,
            "ResourceInfoPath": "ResourceInfoPath1",
            "SchemaVersion": 1,
            "UpdatedAt": "2018-01-15 07:44:49.497"
        },
        {
            "AWSAccounts": [
                "216054658829",
                "267458812797"
            ],
            "CreatedAt": "2017-12-21 03:41:44.839",
            "ExcelOutputStatus": 2,
            "ExcelOutputTime": "2017-12-21 03:56:50.483",
            "ExcelPath": "0b620f6f-e4ab-4281-b298-1c6bd02b0105/report/ja-JP/216054658829.xlsx",
            "GenerateUser": "test-user2@example.com",
            "HTMLOutputStatus": 0,
            "JsonOutputPath": "JsonOutputPath2",
            "JsonOutputTime": "2017-12-21 03:56:06.112",
            "OrganizationID": ORGANIZATION_ID,
            "ProjectID": PROJECT_ID,
            "ReportID": "0b620f6f-e4ab-4281-b298-1c6bd02b0105",
            "ReportName": "216054658829",
            "ReportStatus": 4,
            "ResourceInfoPath": "ResourceInfoPath2",
            "SchemaVersion": 1,
            "UpdatedAt": "2017-12-21 03:56:50.483"
        }
    ]
