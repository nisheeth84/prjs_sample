import copy
import json

from http import HTTPStatus
from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_project import DataPmProjects
from tests.mock.data.aws.dynamodb.data_pm_security_check_webhook import DataPmSecurityCheckWebhook
from tests.mock.data.aws.dynamodb.data_pm_security_check_webhook_call_history import DataPmSecurityCheckWebhookCallHistory
from premembers.exception.pm_exceptions import PmError
from premembers.const.msg_const import MsgConst
from premembers.check.logic import awschecks_logic
from tests.mock import mock_common_utils

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
list_data_pm_security_check_webhooks = copy.deepcopy(
    DataPmSecurityCheckWebhook.LIST_DATA_SECURITY_CHECK_WEBHOOK)
list_data_pm_security_check_webhooks_convert_response = copy.deepcopy(
    DataPmSecurityCheckWebhook.
    LIST_DATA_SECURITY_CHECK_WEBHOOK_CONVERT_RESPONSE)
list_data_pm_security_check_webhook_call_historys = copy.deepcopy(
    DataPmSecurityCheckWebhookCallHistory.
    LIST_DATA_SECURITY_CHECK_WEBHOOK_CALL_HISTORY)
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
data_pm_project = copy.deepcopy(DataPmProjects.DATA_SIMPLE)
webhook_path = copy.deepcopy(DataPmSecurityCheckWebhook.WEBHOOK_PATH)


class TestExecuteSecurityCheckFromExternal(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_execute_security_check_from_external_case_error_get_pm_securityCheckWebhook(self):
        # patch mock
        patch_query_webhook_index = patch(
            "premembers.repository.pm_securityCheckWebhook.query_webhook_index"
        )

        # start mock object
        mock_query_webhook_index = patch_query_webhook_index.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock object
        mock_query_webhook_index.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_query_webhook_index.stop)

        # call function test
        actual_response = awschecks_logic.execute_security_check_from_external(
            trace_id, webhook_path)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_402 = MsgConst.ERR_402
        self.assertEqual(err_402["code"], actual_response_body["code"])
        self.assertEqual(err_402["message"], actual_response_body["message"])
        self.assertEqual(err_402["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.INTERNAL_SERVER_ERROR.value,
                         actual_response["statusCode"])

    def test_execute_security_check_from_external_case_error_record_webhook_query_key_is_zero(self):
        # patch mock
        patch_query_webhook_index = patch(
            "premembers.repository.pm_securityCheckWebhook.query_webhook_index"
        )
        patch_query_key = patch(
            "premembers.repository.pm_securityCheckWebhook.query_key")

        # start mock object
        mock_query_webhook_index = patch_query_webhook_index.start()
        mock_query_key = patch_query_key.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock object
        mock_query_webhook_index.return_value = list_data_pm_security_check_webhooks_convert_response
        mock_query_key.return_value = []

        # addCleanup stop mock object
        self.addCleanup(patch_query_webhook_index.stop)
        self.addCleanup(patch_query_key.stop)

        # call function test
        actual_response = awschecks_logic.execute_security_check_from_external(
            trace_id, webhook_path)

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        message_301 = MsgConst.ERR_301
        self.assertEqual(message_301["code"], actual_response_body["code"])
        self.assertEqual(message_301["message"],
                         actual_response_body["message"])
        self.assertEqual(message_301["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.NOT_FOUND, actual_response["statusCode"])

    def test_execute_security_check_from_external_case_error_record_webhook_not_enabled(self):
        # patch mock
        patch_query_webhook_index = patch(
            "premembers.repository.pm_securityCheckWebhook.query_webhook_index"
        )
        patch_query_key = patch(
            "premembers.repository.pm_securityCheckWebhook.query_key")

        # start mock object
        mock_query_webhook_index = patch_query_webhook_index.start()
        mock_query_key = patch_query_key.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock object
        mock_query_webhook_index.return_value = list_data_pm_security_check_webhooks_convert_response

        mock_query_key.return_value = copy.deepcopy(
            DataPmSecurityCheckWebhook.
            DATA_SECURITY_CHECK_WEBHOOK_ENABLED_FALSE)

        # addCleanup stop mock object
        self.addCleanup(patch_query_webhook_index.stop)
        self.addCleanup(patch_query_key.stop)

        # call function test
        actual_response = awschecks_logic.execute_security_check_from_external(
            trace_id, webhook_path)

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        message_203 = MsgConst.ERR_REQUEST_203
        self.assertEqual(message_203["code"], actual_response_body["code"])
        self.assertEqual(message_203["message"],
                         actual_response_body["message"])
        self.assertEqual(message_203["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.FORBIDDEN, actual_response["statusCode"])

    def test_execute_security_check_from_external_case_error_get_record_pm_security_check_webhook_call_history(self):
        # patch mock
        patch_query_webhook_index = patch(
            "premembers.repository.pm_securityCheckWebhook.query_webhook_index"
        )
        patch_query_key = patch(
            "premembers.repository.pm_securityCheckWebhook.query_key")
        patch_query_pm_security_check_webhook_call_history = patch(
            "premembers.repository.pm_securityCheckWebhookCallHistory.query")

        # start mock object
        mock_query_webhook_index = patch_query_webhook_index.start()
        mock_query_key = patch_query_key.start()
        mock_query_pm_security_check_webhook_call_history = patch_query_pm_security_check_webhook_call_history.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock object
        mock_query_webhook_index.return_value = list_data_pm_security_check_webhooks_convert_response
        mock_query_key.return_value = list_data_pm_security_check_webhooks[0]
        mock_query_pm_security_check_webhook_call_history.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_query_webhook_index.stop)
        self.addCleanup(patch_query_key.stop)

        # call function test
        actual_response = awschecks_logic.execute_security_check_from_external(
            trace_id, webhook_path)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        message_402 = MsgConst.ERR_402
        self.assertEqual(message_402["code"], actual_response_body["code"])
        self.assertEqual(message_402["message"],
                         actual_response_body["message"])
        self.assertEqual(message_402["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.INTERNAL_SERVER_ERROR,
                         actual_response["statusCode"])

    def test_execute_security_check_from_external_case_over_limit_check(self):
        # patch mock
        patch_query_webhook_index = patch(
            "premembers.repository.pm_securityCheckWebhook.query_webhook_index"
        )
        patch_query_key = patch(
            "premembers.repository.pm_securityCheckWebhook.query_key")
        patch_query_pm_security_check_webhook_call_history = patch(
            "premembers.repository.pm_securityCheckWebhookCallHistory.query")

        # start mock object
        mock_query_webhook_index = patch_query_webhook_index.start()
        mock_query_key = patch_query_key.start()
        mock_query_pm_security_check_webhook_call_history = patch_query_pm_security_check_webhook_call_history.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock object
        mock_query_webhook_index.return_value = list_data_pm_security_check_webhooks_convert_response
        mock_query_key.return_value = list_data_pm_security_check_webhooks[0]
        mock_query_pm_security_check_webhook_call_history.return_value = copy.deepcopy(
            DataPmSecurityCheckWebhookCallHistory.
            LIST_DATA_SECURITY_CHECK_WEBHOOK_CALL_HISTORY_OVER_LIMIT_CHECK)

        # addCleanup stop mock object
        self.addCleanup(patch_query_webhook_index.stop)
        self.addCleanup(patch_query_key.stop)
        self.addCleanup(
            patch_query_pm_security_check_webhook_call_history.stop)

        # call function test
        actual_response = awschecks_logic.execute_security_check_from_external(
            trace_id, webhook_path)

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        message_203 = MsgConst.ERR_REQUEST_203
        self.assertEqual(message_203["code"], actual_response_body["code"])
        self.assertEqual(message_203["message"],
                         actual_response_body["message"])
        self.assertEqual(message_203["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.TOO_MANY_REQUESTS,
                         actual_response["statusCode"])

    def test_execute_security_check_from_external_case_error_create_pm_security_check_webhook_call_history(self):
        # patch mock
        patch_query_webhook_index = patch(
            "premembers.repository.pm_securityCheckWebhook.query_webhook_index"
        )
        patch_query_key = patch(
            "premembers.repository.pm_securityCheckWebhook.query_key")
        patch_query_pm_security_check_webhook_call_history = patch(
            "premembers.repository.pm_securityCheckWebhookCallHistory.query")
        patch_execute_security_check_with_executed_type = patch(
            "premembers.check.logic.awschecks_logic.execute_security_check_with_executed_type"
        )
        patch_create_pm_security_check_webhook_call_history = patch(
            "premembers.repository.pm_securityCheckWebhookCallHistory.create")

        # start mock object
        mock_query_webhook_index = patch_query_webhook_index.start()
        mock_query_key = patch_query_key.start()
        mock_query_pm_security_check_webhook_call_history = patch_query_pm_security_check_webhook_call_history.start()
        mock_execute_security_check_with_executed_type = patch_execute_security_check_with_executed_type.start()
        mock_create_pm_security_check_webhook_call_history = patch_create_pm_security_check_webhook_call_history.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock object
        mock_query_webhook_index.return_value = list_data_pm_security_check_webhooks_convert_response
        mock_query_key.return_value = list_data_pm_security_check_webhooks[0]
        mock_query_pm_security_check_webhook_call_history.return_value = list_data_pm_security_check_webhook_call_historys
        mock_execute_security_check_with_executed_type.return_value = {
            'statusCode':
            HTTPStatus.CREATED,
            'headers': {
                'Access-Control-Allow-Origin': None
            },
            'body':
            '{"CheckCode": "CHECK_CIS", "CheckHistoryID": "278826f1-5837-406c-b9a0-8d56d0746d00-3", "CheckStatus": 0, "CreatedAt": "2019-12-12 03:18:49.949", "ErrorCode": "ErrorCode", "ExecutedDateTime": "2019-12-12 03:18:49.949", "ExecutedType": "AUTO", "OrganizationID": "0e6462f8-5e99-4243-9efa-89556574f9e4-3", "ProjectID": "fdc40fe8-240a-49c0-97da-0bc055e5ade0-3", "ReportFilePath": "ReportFilePath", "TimeToLive": 1591672729.949272, "UpdatedAt": "2019-12-12 03:18:49.949"}'
        }
        mock_create_pm_security_check_webhook_call_history.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_query_webhook_index.stop)
        self.addCleanup(patch_query_key.stop)
        self.addCleanup(patch_create_pm_security_check_webhook_call_history.stop)
        self.addCleanup(patch_execute_security_check_with_executed_type.stop)
        self.addCleanup(
            patch_query_pm_security_check_webhook_call_history.stop)

        # call function test
        actual_response = awschecks_logic.execute_security_check_from_external(
            trace_id, webhook_path)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        message_403 = MsgConst.ERR_DB_403
        self.assertEqual(message_403["code"], actual_response_body["code"])
        self.assertEqual(message_403["message"],
                         actual_response_body["message"])
        self.assertEqual(message_403["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.INTERNAL_SERVER_ERROR,
                         actual_response["statusCode"])
