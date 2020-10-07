import json

from unittest.mock import patch
from unittest.mock import MagicMock
from tests.testcasebase import TestCaseBase
from http import HTTPStatus
from premembers.user.handler import user
from tests import event_create
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from moto import mock_dynamodb2
from tests.mock.aws.dynamodb import db_utils
from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import pm_userAttribute as mock_pm_userAttribute
from tests.mock.data.aws.dynamodb.data_pm_userAttribute import DataPmUserAttribute
from tests.mock.data.aws.dynamodb.data_common import DataCommon


data_insert = DataPmUserAttribute.DATA_SIMPLE
user_body = {
    'userName': data_insert['UserName'],
    'companyName': data_insert['CompanyName'],
    'departmentName': data_insert['DepartmentName'],
    'companyFlg': data_insert['CompanyFlg'],
    'countryCode': data_insert['CountryCode']
}

event_mock = event_create.get_event_object(
    trace_id=DataCommon.USER_ID_TEST.format(str(0)),
    body=json.dumps(user_body))


@mock_dynamodb2
class TestUser(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate data old table
        if db_utils.check_table_exist(Tables.PM_USER_ATTRIBUTE):
            db_utils.delete_table(Tables.PM_USER_ATTRIBUTE)

        # create pm_userAttribute table
        mock_pm_userAttribute.create_table()

    def test_update_user_success_case_not_record(self):
        # Call function test
        result = user.update_user_attributes_handler(event_mock, {})

        # Check data
        response_body = json.loads(result['body'])
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

    def test_update_user_success_case_not_company_flg_and_country_code(self):
        # perpare data test
        user_body = {
            'userName': data_insert['UserName'],
            'companyName': data_insert['CompanyName'],
            'departmentName': data_insert['DepartmentName']
        }

        event_mock = event_create.get_event_object(
            trace_id=DataCommon.USER_ID_TEST.format(str(0)),
            body=json.dumps(user_body))

        # Call function test
        result = user.update_user_attributes_handler(event_mock, {})

        # Check data
        response_body = json.loads(result['body'])
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

    def test_update_user_error_parse_json(self):
        # param body not type json
        event_mock = event_create.get_event_object(
            trace_id=data_insert['UserID'],
            body=user_body)

        # Call function test
        response = user.update_user_attributes_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        err_202 = MsgConst.ERR_REQUEST_202

        self.assertEqual(response_body['code'], err_202['code'])
        self.assertEqual(response_body['message'], err_202['message'])
        self.assertEqual(response_body['description'], err_202['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.BAD_REQUEST.value)

    def test_update_user_error_query_record(self):
        # mock object
        query_key = patch('premembers.repository.pm_userAttribute.query_key')

        # start mock object
        mock_query_key = query_key.start()

        # mock data
        mock_query_key.side_effect = MagicMock(side_effect=PmError())

        # addCleanup stop mock object
        self.addCleanup(query_key.stop)

        # call API
        response = user.update_user_attributes_handler(event_mock, {})

        # assert function
        response_body = json.loads(response['body'])
        err_402 = MsgConst.ERR_402
        self.assertEqual(response_body['code'], err_402['code'])
        self.assertEqual(response_body['message'], err_402['message'])
        self.assertEqual(response_body['description'], err_402['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_update_user_error_create_record(self):
        # mock object
        query_key = patch('premembers.repository.pm_userAttribute.query_key')
        create_user = patch('premembers.repository.pm_userAttribute.create')

        # start mock object
        mock_query_key = query_key.start()
        mock_create_user = create_user.start()

        # mock data
        mock_query_key.side_effect = MagicMock(return_value=None)
        mock_create_user.side_effect = MagicMock(side_effect=PmError())

        # addCleanup stop mock object
        self.addCleanup(query_key.stop)
        self.addCleanup(create_user.stop)

        # call API
        response = user.update_user_attributes_handler(event_mock, {})

        # assert function
        response_body = json.loads(response['body'])
        err_403 = MsgConst.ERR_DB_403
        self.assertEqual(response_body['code'], err_403['code'])
        self.assertEqual(response_body['message'], err_403['message'])
        self.assertEqual(response_body['description'], err_403['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)

    def test_update_user_error_update_record(self):
        # mock object
        query_key = patch('premembers.repository.pm_userAttribute.query_key')
        update_user = patch('premembers.repository.pm_userAttribute.update')

        # start mock object
        mock_query_key = query_key.start()
        mock_update_user = update_user.start()

        # mock data
        mock_query_key.side_effect = MagicMock(return_value=True)
        mock_update_user.side_effect = MagicMock(side_effect=PmError())

        # addCleanup stop mock object
        self.addCleanup(query_key.stop)
        self.addCleanup(update_user.stop)

        # call API
        response = user.update_user_attributes_handler(event_mock, {})

        # assert function
        response_body = json.loads(response['body'])
        err_404 = MsgConst.ERR_DB_404
        self.assertEqual(response_body['code'], err_404['code'])
        self.assertEqual(response_body['message'], err_404['message'])
        self.assertEqual(response_body['description'], err_404['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)
