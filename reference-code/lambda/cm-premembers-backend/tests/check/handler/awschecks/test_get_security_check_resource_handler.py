import json
import copy

from http import HTTPStatus
from premembers.const.msg_const import MsgConst
from premembers.check.handler import awschecks
from premembers.repository.table_list import Tables

from moto import mock_dynamodb2
from tests.testcasebase import TestCaseBase
from unittest.mock import patch
from tests import event_create
from tests.mock.aws.dynamodb import db_utils
from tests.mock.aws.dynamodb import pm_affiliation as mock_pm_affiliation
from tests.mock.aws.dynamodb import pm_awsAccountCoops as mock_pm_awsAccountCoops
from tests.mock.aws.dynamodb import pm_checkResultItems as mock_pm_checkResultItems
from tests.mock.aws.dynamodb import pm_latestCheckResult as mock_pm_latestCheckResult
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_affiliation import DataPmAffiliation
from tests.mock.data.aws.dynamodb.data_pm_aws_account_coops import DataPmAwsAccountCoops
from tests.mock.data.aws.dynamodb.data_pm_check_result_items import DataPmCheckResultItems
from tests.mock.data.aws.dynamodb.data_pm_latest_check_result import DataPmLatestCheckResult
from tests.mock.data.file_utils.data_check_cis_json import DataCheckCisJson

data_pm_affiliation = copy.deepcopy(DataPmAffiliation.AFFILIATION_TEMPLATE)
data_pm_aws_account_coops = copy.deepcopy(DataPmAwsAccountCoops.DATA_SIMPLE)
data_pm_check_result_items = copy.deepcopy(DataPmCheckResultItems.DATA_SIMPLE)
data_pm_latest_check_result = copy.deepcopy(
    DataPmLatestCheckResult.DATA_SIMPLE)
data_check_cis12_item_1_21 = copy.deepcopy(DataCheckCisJson.CHECK_CIS12_ITEM_1_21)

path_parameters = {
    "organization_id": data_pm_latest_check_result['OrganizationID'],
    "project_id": data_pm_latest_check_result['ProjectID'],
    "coop_id": data_pm_aws_account_coops['CoopID'],
    "check_item_code": data_pm_check_result_items['CheckItemCode']
}


@mock_dynamodb2
class TestGetSecurityCheckResourceHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_AFFILIATION):
            db_utils.delete_table(Tables.PM_AFFILIATION)
        if db_utils.check_table_exist(Tables.PM_AWSACCOUNTCOOPS):
            db_utils.delete_table(Tables.PM_AWSACCOUNTCOOPS)
        if db_utils.check_table_exist(Tables.PM_CHECK_RESULT_ITEMS):
            db_utils.delete_table(Tables.PM_CHECK_RESULT_ITEMS)
        if db_utils.check_table_exist(Tables.PM_LATEST_CHECK_RESULT):
            db_utils.delete_table(Tables.PM_LATEST_CHECK_RESULT)

        # create table
        mock_pm_affiliation.create_table()
        mock_pm_awsAccountCoops.create_table()
        mock_pm_checkResultItems.create_table()
        mock_pm_latestCheckResult.create_table()

    def test_get_security_check_resource_handler_success_case_exist_record_pm_check_result_items_and_pm_latest_check_result(self):
        # perpare data test
        mock_pm_affiliation.create(data_pm_affiliation)
        mock_pm_awsAccountCoops.create(data_pm_aws_account_coops)
        mock_pm_latestCheckResult.create(data_pm_latest_check_result)
        mock_pm_checkResultItems.create(data_pm_check_result_items)

        # mock object
        patch_read_json = patch('premembers.common.FileUtils.read_json')

        # start mock object
        mock_read_json = patch_read_json.start()

        # mock data
        mock_read_json.return_value = data_check_cis12_item_1_21

        # addCleanup stop mock object
        self.addCleanup(mock_read_json.stop)

        event_mock = event_create.get_event_object(
            trace_id=copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3))),
            path_parameters=path_parameters)

        # Call function test
        actual_response = awschecks.get_security_check_resource_handler(
            event_mock, {})

        # Get data response
        actual_status_code = actual_response['statusCode']
        actual_response_body = json.loads(actual_response['body'])

        # Check data
        self.assertEqual(HTTPStatus.OK, actual_status_code)
        self.assertEqual(1, len(actual_response_body))

        actual_response_data = actual_response_body[0]

        self.assertEqual(data_pm_check_result_items['CheckResultItemID'],
                         actual_response_data['id'])
        self.assertEqual(data_pm_check_result_items['CheckHistoryID'],
                         actual_response_data['checkHistoryId'])
        self.assertEqual(data_pm_check_result_items['CheckResultID'],
                         actual_response_data['checkResultId'])
        self.assertEqual(data_pm_check_result_items['CheckItemCode'],
                         actual_response_data['checkItemCode'])
        self.assertEqual(data_pm_check_result_items['OrganizationName'],
                         actual_response_data['organizationName'])
        self.assertEqual(data_pm_check_result_items['ProjectName'],
                         actual_response_data['projectName'])
        self.assertEqual(data_pm_check_result_items['AWSAccount'],
                         actual_response_data['awsAccount'])
        self.assertEqual(data_pm_check_result_items['AWSAccountName'],
                         actual_response_data['awsAccountName'])
        self.assertEqual(data_pm_check_result_items['ExclusionFlag'],
                         actual_response_data['exclusionFlag'])
        self.assertEqual(data_pm_check_result_items['CheckResult'],
                         actual_response_data['checkResult'])
        self.assertListEqual(data_check_cis12_item_1_21['CheckResults'],
                             actual_response_data['resources'])
        self.assertEqual(data_pm_check_result_items['CreatedAt'],
                         actual_response_data['createdAt'])
        self.assertEqual(data_pm_check_result_items['UpdatedAt'],
                         actual_response_data['updatedAt'])

    def test_get_security_check_resource_handler_success_case_not_exist_record_pm_latest_check_result(self):
        # perpare data test
        mock_pm_affiliation.create(data_pm_affiliation)
        mock_pm_awsAccountCoops.create(data_pm_aws_account_coops)

        event_mock = event_create.get_event_object(
            trace_id=copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3))),
            path_parameters=path_parameters)

        # Call function test
        actual_response = awschecks.get_security_check_resource_handler(
            event_mock, {})

        # Get data response
        actual_status_code = actual_response['statusCode']
        actual_response_body = json.loads(actual_response['body'])

        # Check data
        self.assertEqual(HTTPStatus.OK, actual_status_code)
        self.assertEqual([], actual_response_body)

    def test_get_security_check_resource_handler_success_case_exist_record_pm_latest_check_result_and_not_exist_record_pm_check_result_items(self):
        # perpare data test
        mock_pm_affiliation.create(data_pm_affiliation)
        mock_pm_awsAccountCoops.create(data_pm_aws_account_coops)
        mock_pm_latestCheckResult.create(data_pm_latest_check_result)

        event_mock = event_create.get_event_object(
            trace_id=copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3))),
            path_parameters=path_parameters)

        # Call function test
        actual_response = awschecks.get_security_check_resource_handler(
            event_mock, {})

        # Get data response
        actual_status_code = actual_response['statusCode']
        actual_response_body = json.loads(actual_response['body'])

        # Check data
        self.assertEqual(HTTPStatus.OK, actual_status_code)
        self.assertEqual([], actual_response_body)

    def test_get_security_check_resource_handler_error_authority(self):
        # perpare data test
        mock_pm_affiliation.create(
            copy.deepcopy(DataPmAffiliation.AFFILIATION_AUTHORITY_VIEWER))

        event_mock = event_create.get_event_object(
            trace_id="user_not_authority",
            path_parameters=path_parameters)

        # Call function test
        actual_response = awschecks.get_security_check_resource_handler(
            event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(actual_response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(actual_response['statusCode'], HTTPStatus.FORBIDDEN)
