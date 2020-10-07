import json
import copy

from http import HTTPStatus
from premembers.check.handler import awschecks
from premembers.repository.table_list import Tables
from moto import mock_dynamodb2
from tests.testcasebase import TestCaseBase
from unittest.mock import patch
from tests import event_create
from tests.mock.aws.dynamodb import db_utils
from premembers.common import common_utils
from premembers.const.const import CommonConst
from tests.mock.aws.dynamodb import pm_checkHistory as mock_pm_checkHistory
from tests.mock.aws.dynamodb import pm_projects as mock_pm_projects
from tests.mock.aws.dynamodb import pm_affiliation as mock_pm_affiliation
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_project import DataPmProjects
from tests.mock.data.aws.dynamodb.data_pm_affiliation import DataPmAffiliation
from tests.mock.data.aws.dynamodb.data_pm_check_history import DataPmCheckHistory

data_pm_project = copy.deepcopy(DataPmProjects.DATA_SIMPLE)
project_id = data_pm_project['ProjectID']
organization_id = data_pm_project['OrganizationID']
data_pm_affiliation = copy.deepcopy(DataPmAffiliation.AFFILIATION_TEMPLATE)
data_pm_check_history = copy.deepcopy(DataPmCheckHistory.DATA_SIMPLE)
check_history_id = data_pm_check_history['CheckHistoryID']
user_id_test = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
execute_user_id = user_id_test
email = "luvinatest@luvina.net"
path_parameters = {
    "organization_id": organization_id,
    "project_id": project_id
}


@mock_dynamodb2
class TestExecuteSecurityCheckHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_AFFILIATION):
            db_utils.delete_table(Tables.PM_AFFILIATION)
        if db_utils.check_table_exist(Tables.PM_PROJECTS):
            db_utils.delete_table(Tables.PM_PROJECTS)
        if db_utils.check_table_exist(Tables.PM_CHECK_HISTORY):
            db_utils.delete_table(Tables.PM_CHECK_HISTORY)

        # create table
        mock_pm_affiliation.create_table()
        mock_pm_projects.create_table()
        mock_pm_checkHistory.create_table()

        # create data table
        mock_pm_projects.create(data_pm_project)
        mock_pm_affiliation.create(data_pm_affiliation)

    def test_execute_security_check_handler_success(self):
        # mock object
        patch_aws_sns = patch("premembers.common.aws_common.aws_sns")
        patch_get_uuid4 = patch("premembers.common.common_utils.get_uuid4")

        # start mock object
        mock_aws_sns = patch_aws_sns.start()
        mock_get_uuid4 = patch_get_uuid4.start()

        # mock data
        mock_aws_sns.side_effect = None
        mock_get_uuid4.return_value = check_history_id

        # addCleanup stop mock object
        self.addCleanup(patch_aws_sns.stop)
        self.addCleanup(patch_get_uuid4.stop)

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=user_id_test,
            email=email)

        # Call function test
        actual_response = awschecks.execute_security_check_handler(
            event_mock, {})

        # assert call aws_sns
        topic_arn = common_utils.get_environ(
            CommonConst.SECURITYCHECK_EXECUTE_TOPIC)
        subject = "USER : {0}".format(execute_user_id)
        message = {'CheckHistoryId': check_history_id}
        mock_aws_sns.assert_called_once_with(user_id_test, subject,
                                             json.dumps(message), topic_arn)

        # Get data response
        actual_status_code = actual_response['statusCode']
        actual_response_bodys = json.loads(actual_response['body'])

        expect_response_pm_checkHistory = mock_pm_checkHistory.query_key(
            check_history_id)

        # Check data
        self.assertEqual(HTTPStatus.CREATED, actual_status_code)

        self.assertEqual(expect_response_pm_checkHistory['CheckCode'],
                         actual_response_bodys['checkCode'])
        self.assertEqual(expect_response_pm_checkHistory['CheckStatus'],
                         actual_response_bodys['checkStatus'])
        self.assertEqual('', actual_response_bodys['errorCode'])
        self.assertEqual(expect_response_pm_checkHistory['ExecutedDateTime'],
                         actual_response_bodys['executedDateTime'])
        self.assertEqual(expect_response_pm_checkHistory['ExecutedType'],
                         actual_response_bodys['executedType'])
        self.assertEqual(expect_response_pm_checkHistory['CheckHistoryID'],
                         actual_response_bodys['id'])
        self.assertEqual(expect_response_pm_checkHistory['OrganizationID'],
                         actual_response_bodys['organizationId'])
        self.assertEqual(expect_response_pm_checkHistory['ProjectID'],
                         actual_response_bodys['projectId'])
        self.assertEqual('', actual_response_bodys['reportFilePath'])
