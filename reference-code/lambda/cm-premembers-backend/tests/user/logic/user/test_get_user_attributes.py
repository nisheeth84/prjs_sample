import json

from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from http import HTTPStatus
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from premembers.user.logic import user_logic
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock import mock_common_utils


class TestGetUserAttributes(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_get_user_error_query_record(self):
        user_id = DataCommon.USER_ID_TEST.format(str(3))
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
        response = user_logic.get_user_attributes(user_id)

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
