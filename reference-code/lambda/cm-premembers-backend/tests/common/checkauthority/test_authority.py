import json

from tests.testcasebase import TestCaseBase
from premembers.exception.pm_exceptions import PmError
from moto import mock_dynamodb2
from tests.mock.data.aws.dynamodb.data_pm_affiliation import DataPmAffiliation
from unittest.mock import patch
from premembers.const.msg_const import MsgConst
from http import HTTPStatus
from premembers.common import checkauthority

trace_id = DataPmAffiliation.TRACE_ID
user_id = DataPmAffiliation.AFFILIATION_TEMPLATE_USER_ID
organization_id = DataPmAffiliation.AFFILIATION_TEMPLATE_ORGANIZATION_ID

Authority = {"Owner": 3}


@mock_dynamodb2
class TestAuthority(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_authority_true(self):
        with patch(
                'premembers.common.checkauthority.check_authority',
                return_value=True):
            response = checkauthority.authority(
                trace_id, user_id, organization_id, Authority["Owner"])
        self.assertEqual(response, None)

    def test_authority_false(self):
        with patch(
                'premembers.common.checkauthority.check_authority',
                return_value=False):
            response = checkauthority.authority(
                trace_id, user_id, organization_id, Authority["Owner"])
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        err_101 = MsgConst.ERR_101

        self.assertEqual(status_code, HTTPStatus.FORBIDDEN.value)
        self.assertEqual(response_body['code'], err_101['code'])
        self.assertEqual(response_body['message'], err_101['message'])
        self.assertEqual(response_body['description'], err_101['description'])

    def test_authority_error(self):
        with patch('premembers.common.checkauthority.check_authority'
                   ) as mock_check_authority:
            mock_check_authority.side_effect = PmError()
            response = checkauthority.authority(
                trace_id, user_id, organization_id, Authority["Owner"])
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        err_402 = MsgConst.ERR_402

        self.assertEqual(status_code, HTTPStatus.INTERNAL_SERVER_ERROR.value)
        self.assertEqual(response_body['code'], err_402['code'])
        self.assertEqual(response_body['message'], err_402['message'])
        self.assertEqual(response_body['description'], err_402['description'])
