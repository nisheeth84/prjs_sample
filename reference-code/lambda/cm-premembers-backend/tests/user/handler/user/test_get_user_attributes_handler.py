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

data_insert = DataPmUserAttribute.DATA_SIMPLE
event_mock = event_create.get_event_object(trace_id=data_insert['UserID'])


@mock_dynamodb2
class TestGetUserAttributesHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate data old table
        if db_utils.check_table_exist(Tables.PM_USER_ATTRIBUTE):
            db_utils.delete_table(Tables.PM_USER_ATTRIBUTE)

        # create pm_userAttribute table
        mock_pm_userAttribute.create_table()

    def test_get_user_attributes_success(self):
        # perpare data test
        mock_pm_userAttribute.create(data_insert)

        # Call function test
        result = user.get_user_attributes_handler(event_mock, {})

        # Check data
        status_code = result['statusCode']
        response_body = json.loads(result['body'])

        self.assertEqual(status_code, HTTPStatus.OK.value)
        self.assertEqual(response_body['id'], data_insert['UserID'])
        self.assertEqual(response_body['userName'], data_insert['UserName'])
        self.assertEqual(response_body['mailStatus'],
                         data_insert['MailStatus'])
        self.assertEqual(response_body['companyName'],
                         data_insert['CompanyName'])
        self.assertEqual(response_body['depertmentName'],
                         data_insert['DepartmentName'])
        self.assertEqual(response_body['companyFlg'],
                         data_insert['CompanyFlg'])
        self.assertEqual(response_body['countryCode'],
                         data_insert['CountryCode'])
        self.assertEqual(response_body['callerServiceName'],
                         data_insert['CallerServiceName'])

    def test_get_user_success_case_not_company_flg_and_country_code(self):
        # perpare data test
        data_insert = DataPmUserAttribute.DATA_NOT_COMPANYFLG_AND_COUNTRYCODE
        mock_pm_userAttribute.create(data_insert)
        event_mock = event_create.get_event_object(
            trace_id=data_insert['UserID'])

        # Call function test
        result = user.get_user_attributes_handler(event_mock, {})

        # Check data
        status_code = result['statusCode']
        response_body = json.loads(result['body'])

        self.assertEqual(status_code, HTTPStatus.OK.value)
        self.assertEqual(response_body['id'], data_insert['UserID'])
        self.assertEqual(response_body['userName'], data_insert['UserName'])
        self.assertEqual(response_body['mailStatus'],
                         data_insert['MailStatus'])
        self.assertEqual(response_body['companyName'],
                         data_insert['CompanyName'])
        self.assertEqual(response_body['depertmentName'],
                         data_insert['DepartmentName'])

        self.assertFalse("companyFlg" in response_body.keys())
        self.assertFalse("countryCode" in response_body.keys())

    def test_get_user_attributes_record_zero(self):
        # perpare data test
        user_id = "not found"
        event_mock = event_create.get_event_object(trace_id=user_id)

        # Call function test
        result = user.get_user_attributes_handler(event_mock, {})

        # Check data
        status_code = result['statusCode']
        response_body = json.loads(result['body'])

        self.assertEqual(status_code, HTTPStatus.OK.value)
        self.assertEqual(response_body, {})

    def test_get_user_success_case_not_caller_service_name(self):
        # perpare data test
        data_insert = DataPmUserAttribute.DATA_NOT_CALLERSERVICENAME
        mock_pm_userAttribute.create(data_insert)
        event_mock = event_create.get_event_object(
            trace_id=data_insert['UserID'])

        # Call function test
        result = user.get_user_attributes_handler(event_mock, {})

        # Check data
        status_code = result['statusCode']
        response_body = json.loads(result['body'])

        self.assertEqual(status_code, HTTPStatus.OK.value)
        self.assertEqual(response_body['id'], data_insert['UserID'])
        self.assertEqual(response_body['userName'], data_insert['UserName'])
        self.assertEqual(response_body['mailStatus'],
                         data_insert['MailStatus'])
        self.assertEqual(response_body['companyName'],
                         data_insert['CompanyName'])
        self.assertEqual(response_body['depertmentName'],
                         data_insert['DepartmentName'])
        self.assertEqual(response_body['companyFlg'],
                         data_insert['CompanyFlg'])
        self.assertEqual(response_body['countryCode'],
                         data_insert['CountryCode'])

        self.assertFalse("callerServiceName" in response_body.keys())
