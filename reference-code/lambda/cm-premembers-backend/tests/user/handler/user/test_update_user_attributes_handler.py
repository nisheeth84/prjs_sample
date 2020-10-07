import json

from tests.testcasebase import TestCaseBase
from http import HTTPStatus
from premembers.user.handler import user
from tests import event_create
from moto import mock_dynamodb2
from tests.mock.aws.dynamodb import db_utils
from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import pm_userAttribute as mock_pm_userAttribute
from tests.mock.data.aws.dynamodb.data_pm_userAttribute import DataPmUserAttribute
from tests.mock.data.aws.dynamodb.data_common import DataCommon

data_insert = DataPmUserAttribute.DATA_SIMPLE


@mock_dynamodb2
class TestUpdateUserAttributesHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate data old table
        if db_utils.check_table_exist(Tables.PM_USER_ATTRIBUTE):
            db_utils.delete_table(Tables.PM_USER_ATTRIBUTE)

        # create pm_userAttribute table
        mock_pm_userAttribute.create_table()

    def test_update_user_success_case_create_record_data_body_not_contain_callerservicename(
            self):
        data_body_not_callerservicename = {
            'userName': data_insert['UserName'],
            'companyName': data_insert['CompanyName'],
            'departmentName': data_insert['DepartmentName'],
            'companyFlg': data_insert['CompanyFlg'],
            'countryCode': data_insert['CountryCode']
        }

        event_mock = event_create.get_event_object(
            trace_id=DataCommon.USER_ID_TEST.format(str(0)),
            body=json.dumps(data_body_not_callerservicename))
        # Call function test
        response = user.update_user_attributes_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['id'], data_insert['UserID'])
        self.assertEqual(response_body['userName'],
                         data_body_not_callerservicename['userName'])
        self.assertEqual(response_body['mailStatus'],
                         data_insert['MailStatus'])
        self.assertEqual(response_body['companyName'],
                         data_body_not_callerservicename['companyName'])
        self.assertEqual(response_body['depertmentName'],
                         data_body_not_callerservicename['departmentName'])
        self.assertEqual(response_body['companyFlg'],
                         data_body_not_callerservicename['companyFlg'])
        self.assertEqual(response_body['countryCode'],
                         data_body_not_callerservicename['countryCode'])
        self.assertFalse("callerServiceName" in response_body.keys())

    def test_update_user_success_case_create_record_data_body_contain_callerservicename(
            self):
        data_body_contain_callerservicename = {
            'userName': data_insert['UserName'],
            'companyName': data_insert['CompanyName'],
            'departmentName': data_insert['DepartmentName'],
            'companyFlg': data_insert['CompanyFlg'],
            'countryCode': data_insert['CountryCode'],
            'callerServiceName': "opswitch"
        }
        event_mock = event_create.get_event_object(
            trace_id=DataCommon.USER_ID_TEST.format(str(0)),
            body=json.dumps(data_body_contain_callerservicename))

        # Call function test
        response = user.update_user_attributes_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['id'], data_insert['UserID'])
        self.assertEqual(response_body['userName'],
                         data_body_contain_callerservicename['userName'])
        self.assertEqual(response_body['mailStatus'],
                         data_insert['MailStatus'])
        self.assertEqual(response_body['companyName'],
                         data_body_contain_callerservicename['companyName'])
        self.assertEqual(response_body['depertmentName'],
                         data_body_contain_callerservicename['departmentName'])
        self.assertEqual(response_body['companyFlg'],
                         data_body_contain_callerservicename['companyFlg'])
        self.assertEqual(response_body['countryCode'],
                         data_body_contain_callerservicename['countryCode'])
        self.assertEqual(
            response_body['callerServiceName'],
            data_body_contain_callerservicename['callerServiceName'])

    def test_update_user_attribute_success_case_exists_record_contain_callerservicename_and_data_body_contain_callerservicename(
            self):
        # perpare data test
        data_update = DataPmUserAttribute.DATA_UPDATE_SIMPLE
        data_body = {
            "userName": data_update['UserName'],
            "companyName": data_update['CompanyName'],
            "departmentName": data_update['DepartmentName'],
            "countryCode": data_update['CountryCode'],
            "companyFlg": data_update['CompanyFlg'],
            "callerServiceName": "opswitch"
        }
        mock_pm_userAttribute.create(data_insert)
        event_mock = event_create.get_event_object(
            trace_id=data_insert['UserID'], body=json.dumps(data_body))

        # Call function test
        response = user.update_user_attributes_handler(event_mock, {})

        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])

        self.assertEqual(status_code, HTTPStatus.OK.value)
        self.assertEqual(response_body['id'], data_insert['UserID'])
        self.assertEqual(response_body['userName'], data_body['userName'])
        self.assertEqual(response_body['companyName'],
                         data_body['companyName'])
        self.assertEqual(response_body['depertmentName'],
                         data_body['departmentName'])
        self.assertEqual(response_body['countryCode'],
                         data_body['countryCode'])
        self.assertEqual(response_body['companyFlg'], data_body['companyFlg'])
        self.assertEqual(response_body['callerServiceName'],
                         data_insert['CallerServiceName'])

    def test_update_user_attribute_success_case_exists_record_not_contain_callerservicename_and_data_body_contain_callerservicename(
            self):
        data_not_callerservicename = DataPmUserAttribute.DATA_NOT_CALLERSERVICENAME
        # perpare data test
        data_update = DataPmUserAttribute.DATA_UPDATE_SIMPLE
        data_body_contain_callerservicename = {
            "userName": data_update['UserName'],
            "companyName": data_update['CompanyName'],
            "departmentName": data_update['DepartmentName'],
            "countryCode": data_update['CountryCode'],
            "companyFlg": data_update['CompanyFlg'],
            "callerServiceName": "opswitch"
        }
        mock_pm_userAttribute.create(data_not_callerservicename)
        event_mock = event_create.get_event_object(
            trace_id=data_not_callerservicename['UserID'],
            body=json.dumps(data_body_contain_callerservicename))

        # Call function test
        response = user.update_user_attributes_handler(event_mock, {})

        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])

        self.assertEqual(status_code, HTTPStatus.OK.value)
        self.assertEqual(response_body['id'],
                         data_not_callerservicename['UserID'])
        self.assertEqual(response_body['userName'],
                         data_body_contain_callerservicename['userName'])
        self.assertEqual(response_body['companyName'],
                         data_body_contain_callerservicename['companyName'])
        self.assertEqual(response_body['depertmentName'],
                         data_body_contain_callerservicename['departmentName'])
        self.assertEqual(response_body['countryCode'],
                         data_body_contain_callerservicename['countryCode'])
        self.assertEqual(response_body['companyFlg'],
                         data_body_contain_callerservicename['companyFlg'])
        self.assertFalse("callerServiceName" in response_body.keys())

    def test_update_user_attribute_success_case_exists_record(self):
        # perpare data test
        data_update = DataPmUserAttribute.DATA_UPDATE_SIMPLE
        data_body = {
            "userName": data_update['UserName'],
            "companyName": data_update['CompanyName'],
            "departmentName": data_update['DepartmentName'],
            "countryCode": data_update['CountryCode'],
            "companyFlg": data_update['CompanyFlg']
        }
        mock_pm_userAttribute.create(data_insert)
        event_mock = event_create.get_event_object(
            trace_id=data_insert['UserID'], body=json.dumps(data_body))

        # Call function test
        response = user.update_user_attributes_handler(event_mock, {})

        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])

        self.assertEqual(status_code, HTTPStatus.OK.value)
        self.assertEqual(response_body['id'], data_insert['UserID'])
        self.assertEqual(response_body['userName'], data_body['userName'])
        self.assertEqual(response_body['companyName'],
                         data_body['companyName'])
        self.assertEqual(response_body['depertmentName'],
                         data_body['departmentName'])
        self.assertEqual(response_body['countryCode'],
                         data_body['countryCode'])
        self.assertEqual(response_body['companyFlg'], data_body['companyFlg'])
        self.assertEqual(response_body['callerServiceName'],
                         data_insert['CallerServiceName'])

    def test_update_user_success_case_not_company_flg_and_country_code(self):
        # perpare data test
        data_body = {
            'userName': data_insert['UserName'],
            'companyName': data_insert['CompanyName'],
            'departmentName': data_insert['DepartmentName']
        }

        event_mock = event_create.get_event_object(
            trace_id=DataCommon.USER_ID_TEST.format(str(0)),
            body=json.dumps(data_body))

        # Call function test
        response = user.update_user_attributes_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['id'], data_insert['UserID'])
        self.assertEqual(response_body['userName'], data_body['userName'])
        self.assertEqual(response_body['mailStatus'],
                         data_insert['MailStatus'])
        self.assertEqual(response_body['companyName'],
                         data_body['companyName'])
        self.assertEqual(response_body['depertmentName'],
                         data_body['departmentName'])

        self.assertFalse("companyFlg" in response_body.keys())
        self.assertFalse("countryCode" in response_body.keys())
