import copy

from premembers.common import common_utils
from tests.mock.data.aws.dynamodb.data_common import DataCommon


class DataPmUserAttribute():
    DATA_SIMPLE = {
        "UserID": copy.deepcopy(DataCommon.USER_ID_TEST.format(str(0))),
        "UserName": "test-user@example.com",
        "CompanyName": "company_name",
        "DepartmentName": "department_name",
        "CompanyFlg": 1,
        "CountryCode": "jp",
        "MailStatus": 0,
        "CallerServiceName": "insightwatch",
        "CreatedAt": common_utils.get_current_date(),
        "UpdatedAt": common_utils.get_current_date()
    }

    DATA_NOT_CONTAIN_USER_NAME = {
        "UserID": copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3))),
        "CompanyName": "company_name",
        "DepartmentName": "department_name",
        "CompanyFlg": 1,
        "CountryCode": "jp",
        "MailStatus": 0,
        "CallerServiceName": "insightwatch",
        "CreatedAt": common_utils.get_current_date(),
        "UpdatedAt": common_utils.get_current_date()
    }

    DATA_NOT_COMPANYFLG_AND_COUNTRYCODE = {
        "UserID": DataCommon.USER_ID_TEST.format(str(0)),
        "UserName": "test-user@example.com",
        "CompanyName": "company_name",
        "DepartmentName": "department_name",
        "MailStatus": 0,
        "CreatedAt": common_utils.get_current_date(),
        "UpdatedAt": common_utils.get_current_date()
    }

    DATA_UPDATE_SIMPLE = {
        "UserID": DataCommon.USER_ID_TEST.format(str(0)),
        "UserName": "test-user@example.com",
        "CompanyName": "company_name_update",
        "DepartmentName": "department_name_update",
        "CompanyFlg": 2,
        "CountryCode": "JA",
        "MailStatus": 2
    }

    DATA_NOT_CALLERSERVICENAME = {
        "UserID": DataCommon.USER_ID_TEST.format(str(0)),
        "UserName": "test-user@example.com",
        "CompanyName": "company_name",
        "DepartmentName": "department_name",
        "CompanyFlg": 1,
        "CountryCode": "jp",
        "MailStatus": 0,
        "CreatedAt": common_utils.get_current_date(),
        "UpdatedAt": common_utils.get_current_date()
    }
