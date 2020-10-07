import json

from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from http import HTTPStatus
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from moto import mock_dynamodb2
from tests.mock.aws.dynamodb import db_utils
from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import pm_userAttribute as mock_pm_userAttribute
from tests.mock.data.aws.dynamodb.data_pm_userAttribute import DataPmUserAttribute
from tests.mock import mock_common_utils
from premembers.user.logic import user_logic

data_insert = DataPmUserAttribute.DATA_SIMPLE
user_id = data_insert['UserID']
data_body = {
    'userName': data_insert['UserName'],
    'companyName': data_insert['CompanyName'],
    'departmentName': data_insert['DepartmentName'],
    'companyFlg': data_insert['CompanyFlg'],
    'countryCode': data_insert['CountryCode'],
    'callerServiceName': data_insert['CallerServiceName']
}


@mock_dynamodb2
class TestUpdateUserAttributes(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate data old table
        if db_utils.check_table_exist(Tables.PM_USER_ATTRIBUTE):
            db_utils.delete_table(Tables.PM_USER_ATTRIBUTE)

        # create pm_userAttribute table
        mock_pm_userAttribute.create_table()

    def test_update_user_attribute_case_error_validate_value_param_callerServiceName_invalid(
            self):
        data_body = {
            "userName": data_insert['UserName'],
            "companyName": data_insert['CompanyName'],
            "departmentName": data_insert['DepartmentName'],
            "countryCode": data_insert['CountryCode'],
            "companyFlg": data_insert['CompanyFlg'],
            "callerServiceName": "value_invald",
        }
        param_body = json.dumps(data_body)

        # mock function error_validate
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        # call Function test
        response = user_logic.update_user_attributes(user_id, param_body)

        # assert output function
        # check call function common write log error
        mock_error_validate.assert_called_once()

        # check response
        response_body = json.loads(response["body"])
        message_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(response_body["code"], message_201["code"])
        self.assertEqual(response_body["message"], message_201["message"])
        self.assertEqual(response["statusCode"],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body["errors"]
        err_val_302 = MsgConst.ERR_VAL_302
        self.assertEqual(response_error[0]["code"], err_val_302["code"])
        self.assertEqual(response_error[0]["field"], "callerServiceName")
        self.assertEqual(response_error[0]["value"], "value_invald")
        self.assertEqual(
            response_error[0]["message"],
            err_val_302["message"].format("insightwatch, opswitch"))

    def test_update_user_error_parse_json(self):
        param_body = '{"json_invalid"}'

        # mock function error_exception
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # call Function test
        response = user_logic.update_user_attributes(user_id, param_body)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

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
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_query_key.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(query_key.stop)

        # call Function test
        param_body = json.dumps(data_body)
        response = user_logic.update_user_attributes(user_id, param_body)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

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
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_query_key.return_value = None
        mock_create_user.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(query_key.stop)
        self.addCleanup(create_user.stop)

        # call Function test
        param_body = json.dumps(data_body)
        response = user_logic.update_user_attributes(user_id, param_body)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

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
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # start mock object
        mock_query_key = query_key.start()
        mock_update_user = update_user.start()

        # mock data
        mock_query_key.return_value = True
        mock_update_user.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(query_key.stop)
        self.addCleanup(update_user.stop)

        # call Function test
        param_body = json.dumps(data_body)
        response = user_logic.update_user_attributes(user_id, param_body)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert function
        response_body = json.loads(response['body'])
        err_404 = MsgConst.ERR_DB_404
        self.assertEqual(response_body['code'], err_404['code'])
        self.assertEqual(response_body['message'], err_404['message'])
        self.assertEqual(response_body['description'], err_404['description'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.INTERNAL_SERVER_ERROR.value)
