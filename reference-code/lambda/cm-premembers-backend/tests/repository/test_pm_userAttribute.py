from moto import mock_dynamodb2
from tests.testcasebase import TestCaseBase
from tests.mock.aws.dynamodb import db_utils
from tests.mock.aws.dynamodb import pm_userAttribute as mock_pm_userAttribute
from tests.mock.data.aws.dynamodb.data_pm_userAttribute import DataPmUserAttribute
from premembers.repository import pm_userAttribute
from premembers.repository.table_list import Tables


@mock_dynamodb2
class TestPmUserAttribute(TestCaseBase):
    def setUp(self):
        # parent setUp()
        super().setUp()

        # truncate data old table
        if db_utils.check_table_exist(Tables.PM_USER_ATTRIBUTE):
            db_utils.delete_table(Tables.PM_USER_ATTRIBUTE)

        # create pm_userAttribute table
        mock_pm_userAttribute.create_table()

    def test_query_key(self):
        # prepare data
        data_insert = DataPmUserAttribute.DATA_SIMPLE
        mock_pm_userAttribute.create(data_insert)

        # call function test
        result = pm_userAttribute.query_key(data_insert['UserID'])

        # check data
        self.assertEqual(result['UserID'], data_insert['UserID'])
        self.assertEqual(result['UserName'], data_insert['UserName'])
        self.assertEqual(result['MailStatus'], data_insert['MailStatus'])
        self.assertEqual(result['CompanyName'], data_insert['CompanyName'])
        self.assertEqual(result['DepartmentName'],
                         data_insert['DepartmentName'])
        self.assertEqual(result['CompanyFlg'], data_insert['CompanyFlg'])
        self.assertEqual(result['CountryCode'], data_insert['CountryCode'])
        self.assertEqual(result['CallerServiceName'],
                         data_insert['CallerServiceName'])
        self.assertEqual(result['CreatedAt'], data_insert['CreatedAt'])
        self.assertEqual(result['UpdatedAt'], data_insert['UpdatedAt'])

    def test_query_key_convert_response(self):
        # prepare data
        data_insert = DataPmUserAttribute.DATA_SIMPLE
        mock_pm_userAttribute.create(data_insert)

        # call function test
        result = pm_userAttribute.query_key(
            data_insert['UserID'], convert_response=True)

        # check data
        self.assertEqual(result['id'], data_insert['UserID'])
        self.assertEqual(result['userName'], data_insert['UserName'])
        self.assertEqual(result['mailStatus'], data_insert['MailStatus'])
        self.assertEqual(result['companyName'], data_insert['CompanyName'])
        self.assertEqual(result['depertmentName'],
                         data_insert['DepartmentName'])
        self.assertEqual(result['companyFlg'], data_insert['CompanyFlg'])
        self.assertEqual(result['countryCode'], data_insert['CountryCode'])
        self.assertEqual(result['callerServiceName'],
                         data_insert['CallerServiceName'])
        self.assertEqual(result['createdAt'], data_insert['CreatedAt'])
        self.assertEqual(result['updatedAt'], data_insert['UpdatedAt'])

    def test_create(self):
        # prepare data
        data_insert = DataPmUserAttribute.DATA_SIMPLE
        pm_userAttribute.create(
            data_insert['UserID'], data_insert['UserName'],
            data_insert['CompanyName'], data_insert['DepartmentName'],
            data_insert['MailStatus'], data_insert['CompanyFlg'],
            data_insert['CountryCode'], data_insert['CallerServiceName'])

        # call function test
        result = mock_pm_userAttribute.query_key(data_insert['UserID'])

        # check data
        self.assertEqual(result['UserID'], data_insert['UserID'])
        self.assertEqual(result['UserName'], data_insert['UserName'])
        self.assertEqual(result['MailStatus'], data_insert['MailStatus'])
        self.assertEqual(result['CompanyName'], data_insert['CompanyName'])
        self.assertEqual(result['DepartmentName'],
                         data_insert['DepartmentName'])
        self.assertEqual(result['CompanyFlg'], data_insert['CompanyFlg'])
        self.assertEqual(result['CountryCode'], data_insert['CountryCode'])
        self.assertEqual(result['CallerServiceName'],
                         data_insert['CallerServiceName'])

    def test_update(self):
        # prepare data
        data_insert = DataPmUserAttribute.DATA_SIMPLE
        mock_pm_userAttribute.create(data_insert)

        data_update_simple = DataPmUserAttribute.DATA_UPDATE_SIMPLE
        data_update = {
            "UserName": {
                "Value": data_update_simple['UserName']
            },
            "CompanyName": {
                "Value": data_update_simple['CompanyName']
            },
            "DepartmentName": {
                "Value": data_update_simple['DepartmentName']
            },
            "CompanyFlg": {
                "Value": data_update_simple['CompanyFlg']
            },
            "CountryCode": {
                "Value": data_update_simple['CountryCode']
            },
            "MailStatus": {
                "Value": data_update_simple['MailStatus']
            }
        }

        # call function test
        pm_userAttribute.update(data_insert['UserID'], data_update)

        # check data
        result = mock_pm_userAttribute.query_key(data_insert['UserID'])
        self.assertEqual(result['UserName'], data_update_simple['UserName'])
        self.assertEqual(result['CompanyName'],
                         data_update_simple['CompanyName'])
        self.assertEqual(result['DepartmentName'],
                         data_update_simple['DepartmentName'])
        self.assertEqual(result['CompanyFlg'],
                         data_update_simple['CompanyFlg'])
        self.assertEqual(result['CountryCode'],
                         data_update_simple['CountryCode'])
