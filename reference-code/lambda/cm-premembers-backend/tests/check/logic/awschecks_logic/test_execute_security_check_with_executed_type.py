import copy
import json

from http import HTTPStatus
from unittest.mock import patch
from moto import mock_dynamodb2
from tests.testcasebase import TestCaseBase
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_project import DataPmProjects
from tests.mock.data.aws.dynamodb.data_pm_check_history import DataPmCheckHistory
from premembers.exception.pm_exceptions import PmError
from premembers.const.msg_const import MsgConst
from premembers.check.logic import awschecks_logic
from premembers.const.const import CommonConst
from premembers.common import common_utils
from tests.mock import mock_common_utils

aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
execute_user_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
trace_id = execute_user_id
email = "luvinatest@luvina.net"
data_pm_check_history = copy.deepcopy(DataPmCheckHistory.DATA_SIMPLE)
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
data_pm_project = copy.deepcopy(DataPmProjects.DATA_SIMPLE)


@mock_dynamodb2
class TestExecuteSecurityCheckWithExecutedType(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_execute_security_check_with_executed_type_case_error_get_projects_by_organization_id(self):
        # patch mock
        patch_get_projects_by_organization_id = patch(
            "premembers.repository.pm_projects.get_projects_by_organization_id"
        )

        # start mock object
        mock_get_projects_by_organization_id = patch_get_projects_by_organization_id.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock object
        mock_get_projects_by_organization_id.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_projects_by_organization_id.stop)

        # call function test
        actual_response = awschecks_logic.execute_security_check_with_executed_type(
            trace_id, organization_id, project_id, execute_user_id, email,
            "MANUAL")

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

    def test_execute_security_check_with_executed_type_case_error_get_pm_projects_is_zero(self):
        # patch mock
        patch_get_projects_by_organization_id = patch(
            "premembers.repository.pm_projects.get_projects_by_organization_id"
        )

        # start mock object
        mock_get_projects_by_organization_id = patch_get_projects_by_organization_id.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock object
        mock_get_projects_by_organization_id.return_value = []

        # addCleanup stop mock object
        self.addCleanup(patch_get_projects_by_organization_id.stop)

        # call function test
        actual_response = awschecks_logic.execute_security_check_with_executed_type(
            trace_id, organization_id, project_id, execute_user_id, email,
            "MANUAL")

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_aws_401 = MsgConst.ERR_AWS_401
        self.assertEqual(err_aws_401["code"], actual_response_body["code"])
        self.assertEqual(err_aws_401["message"],
                         actual_response_body["message"])
        self.assertEqual(err_aws_401["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.UNPROCESSABLE_ENTITY.value,
                         actual_response["statusCode"])

    def test_execute_security_check_with_executed_type_case_error_create_pm_check_history(self):
        # patch mock
        patch_get_projects_by_organization_id = patch(
            "premembers.repository.pm_projects.get_projects_by_organization_id"
        )
        patch_create_pm_check_History = patch(
            "premembers.repository.pm_checkHistory.create")

        # start mock object
        mock_get_projects_by_organization_id = patch_get_projects_by_organization_id.start()
        mock_create_pm_check_History = patch_create_pm_check_History.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock object
        mock_get_projects_by_organization_id.return_value = data_pm_project
        mock_create_pm_check_History.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_projects_by_organization_id.stop)
        self.addCleanup(patch_create_pm_check_History.stop)

        # call function test
        actual_response = awschecks_logic.execute_security_check_with_executed_type(
            trace_id, organization_id, project_id, execute_user_id, email,
            "MANUAL")

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_db_403 = MsgConst.ERR_DB_403
        self.assertEqual(err_db_403["code"], actual_response_body["code"])
        self.assertEqual(err_db_403["message"],
                         actual_response_body["message"])
        self.assertEqual(err_db_403["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.INTERNAL_SERVER_ERROR.value,
                         actual_response["statusCode"])

    def test_execute_security_check_with_executed_type_case_error_publish_message(self):
        # patch mock
        patch_get_projects_by_organization_id = patch(
            "premembers.repository.pm_projects.get_projects_by_organization_id"
        )
        patch_create_pm_check_history = patch(
            "premembers.repository.pm_checkHistory.create")
        patch_aws_sns = patch("premembers.common.aws_common.aws_sns")
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_get_uuid4 = patch("premembers.common.common_utils.get_uuid4")

        # start mock object
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_get_projects_by_organization_id = patch_get_projects_by_organization_id.start()
        mock_create_pm_check_history = patch_create_pm_check_history.start()
        mock_aws_sns = patch_aws_sns.start()
        mock_get_uuid4 = patch_get_uuid4.start()

        # mock object
        mock_query_key_pm_check_history.return_value = data_pm_check_history
        mock_get_projects_by_organization_id.return_value = data_pm_project
        mock_create_pm_check_history.side_effect = None
        mock_aws_sns.side_effect = PmError()
        mock_get_uuid4.return_value = check_history_id

        # addCleanup stop mock object
        self.addCleanup(patch_get_projects_by_organization_id.stop)
        self.addCleanup(patch_create_pm_check_history.stop)
        self.addCleanup(patch_aws_sns.stop)
        self.addCleanup(patch_get_uuid4.stop)

        # call function test
        actual_response = awschecks_logic.execute_security_check_with_executed_type(
            trace_id, organization_id, project_id, execute_user_id, email,
            "MANUAL")

        # assert call aws_sns
        topic_arn = common_utils.get_environ(
            CommonConst.SECURITYCHECK_EXECUTE_TOPIC)
        subject = "USER : {0}".format(execute_user_id)
        message = {'CheckHistoryId': check_history_id}
        mock_aws_sns.assert_called_once_with(trace_id, subject,
                                             json.dumps(message), topic_arn)

        # Get data response
        actual_status_code = actual_response['statusCode']
        actual_response_bodys = json.loads(actual_response['body'])

        # Check data
        self.assertEqual(HTTPStatus.CREATED, actual_status_code)
        self.assertEqual(data_pm_check_history, actual_response_bodys)

    def test_execute_security_check_with_executed_type_case_error_get_pm_check_history(self):
        # patch mock
        patch_get_projects_by_organization_id = patch(
            "premembers.repository.pm_projects.get_projects_by_organization_id"
        )
        patch_create_pm_check_history = patch(
            "premembers.repository.pm_checkHistory.create")
        patch_aws_sns = patch("premembers.common.aws_common.aws_sns")
        patch_query_key_pm_check_history = patch("premembers.repository.pm_checkHistory.query_key")
        patch_get_uuid4 = patch("premembers.common.common_utils.get_uuid4")

        # start mock object
        mock_query_key_pm_check_history = patch_query_key_pm_check_history.start()
        mock_get_projects_by_organization_id = patch_get_projects_by_organization_id.start()
        mock_create_pm_check_history = patch_create_pm_check_history.start()
        mock_aws_sns = patch_aws_sns.start()
        mock_get_uuid4 = patch_get_uuid4.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock object
        mock_query_key_pm_check_history.side_effect = PmError()
        mock_get_projects_by_organization_id.return_value = data_pm_project
        mock_create_pm_check_history.side_effect = None
        mock_aws_sns.side_effect = None
        mock_get_uuid4.return_value = check_history_id

        # addCleanup stop mock object
        self.addCleanup(patch_get_projects_by_organization_id.stop)
        self.addCleanup(patch_create_pm_check_history.stop)
        self.addCleanup(patch_aws_sns.stop)
        self.addCleanup(patch_get_uuid4.stop)

        # call function test
        actual_response = awschecks_logic.execute_security_check_with_executed_type(
            trace_id, organization_id, project_id, execute_user_id, email,
            "MANUAL")

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert call aws_sns
        topic_arn = common_utils.get_environ(
            CommonConst.SECURITYCHECK_EXECUTE_TOPIC)
        subject = "USER : {0}".format(execute_user_id)
        message = {'CheckHistoryId': check_history_id}
        mock_aws_sns.assert_called_once_with(trace_id, subject,
                                             json.dumps(message), topic_arn)

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_402 = MsgConst.ERR_402
        self.assertEqual(err_402["code"], actual_response_body["code"])
        self.assertEqual(err_402["message"], actual_response_body["message"])
        self.assertEqual(err_402["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.INTERNAL_SERVER_ERROR.value,
                         actual_response["statusCode"])
