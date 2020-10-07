import json
import copy

from tests.testcasebase import TestCaseBase
from http import HTTPStatus
from tests import event_create
from moto import mock_dynamodb2
from tests.mock.aws.dynamodb import db_utils
from premembers.repository.table_list import Tables
from premembers.check.handler import checkitemsettings
from tests.mock.aws.dynamodb import pm_affiliation as mock_pm_affiliation
from tests.mock.aws.dynamodb import pm_awsAccountCoops as mock_pm_awsAccountCoops
from tests.mock.aws.dynamodb import pm_exclusionResources as mock_pm_exclusionResources
from tests.mock.data.aws.dynamodb.data_pm_affiliation import DataPmAffiliation
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from premembers.const.msg_const import MsgConst
from tests.mock.data.aws.dynamodb.data_pm_aws_account_coops import DataPmAwsAccountCoops
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources

data_pm_affiliation = copy.deepcopy(DataPmAffiliation.AFFILIATION_TEMPLATE)
data_pm_aws_account_coops = copy.deepcopy(DataPmAwsAccountCoops.DATA_SIMPLE)
data_pm_exclusion_resources = copy.deepcopy(
    DataPmExclusionResources.DATA_SIMPLE)

exclusion_comment_update = copy.deepcopy(
    DataPmExclusionResources.EXCLUSION_COMMENT_UPDATE)

path_parameters = {
    "organization_id": data_pm_exclusion_resources['OrganizationID'],
    "project_id": data_pm_exclusion_resources['ProjectID'],
    "coop_id": data_pm_aws_account_coops['CoopID'],
    "check_item_code": data_pm_exclusion_resources['CheckItemCode']
}

body = {
    "regionName": data_pm_exclusion_resources['RegionName'],
    "resourceName": data_pm_exclusion_resources['ResourceName'],
    "resourceType": data_pm_exclusion_resources['ResourceType'],
    "exclusionComment": data_pm_exclusion_resources['ExclusionComment']
}

event_mock = event_create.get_event_object(
    trace_id=copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3))),
    path_parameters=path_parameters,
    body=json.dumps(body)
)


@mock_dynamodb2
class TestCreateExclusionResourceHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate data old table
        if db_utils.check_table_exist(Tables.PM_AFFILIATION):
            db_utils.delete_table(Tables.PM_AFFILIATION)
        if db_utils.check_table_exist(Tables.PM_EXCLUSION_RESOURCES):
            db_utils.delete_table(Tables.PM_EXCLUSION_RESOURCES)
        if db_utils.check_table_exist(Tables.PM_AWSACCOUNTCOOPS):
            db_utils.delete_table(Tables.PM_AWSACCOUNTCOOPS)

        # create table
        mock_pm_affiliation.create_table()
        mock_pm_awsAccountCoops.create_table()
        mock_pm_exclusionResources.create_table()

    def test_create_excluded_resources_handler_success_case_not_exists_data_create(self):
        # perpare data test
        mock_pm_affiliation.create(data_pm_affiliation)
        mock_pm_awsAccountCoops.create(data_pm_aws_account_coops)

        # Call function test
        actual_response = checkitemsettings.create_excluded_resources_handler(
                event_mock, {})

        # Get data response
        actual_status_code = actual_response['statusCode']
        actual_response_body = json.loads(actual_response['body'])

        # Check data
        self.assertEqual(HTTPStatus.CREATED, actual_status_code)

        self.assertEqual(data_pm_exclusion_resources["OrganizationID"],
                         actual_response_body["organizationId"])
        self.assertEqual(data_pm_exclusion_resources["ProjectID"],
                         actual_response_body["projectId"])
        self.assertEqual(data_pm_aws_account_coops["AWSAccount"],
                         actual_response_body["awsAccount"])
        self.assertEqual(data_pm_exclusion_resources["CheckItemCode"],
                         actual_response_body["checkItemCode"])
        self.assertEqual(data_pm_exclusion_resources["RegionName"],
                         actual_response_body["regionName"])
        self.assertEqual(data_pm_exclusion_resources["ResourceName"],
                         actual_response_body["resourceName"])
        self.assertEqual(data_pm_exclusion_resources["ResourceType"],
                         actual_response_body["resourceType"])
        self.assertEqual(data_pm_exclusion_resources["ExclusionComment"],
                         actual_response_body["exclusionComment"])

    def test_create_excluded_resources_handler_success_case_exists_data_create(self):
        # perpare data test
        body_update = {
            "regionName": data_pm_exclusion_resources['RegionName'],
            "resourceType": data_pm_exclusion_resources['ResourceType'],
            "resourceName": data_pm_exclusion_resources['ResourceName'],
            "exclusionComment": exclusion_comment_update
        }

        event_mock_update = event_create.get_event_object(
            trace_id=copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3))),
            path_parameters=path_parameters,
            body=json.dumps(body_update)
        )
        mock_pm_affiliation.create(data_pm_affiliation)
        mock_pm_awsAccountCoops.create(data_pm_aws_account_coops)
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # Call function test
        actual_response = checkitemsettings.create_excluded_resources_handler(
            event_mock_update, {})

        # Get data response
        actual_status_code = actual_response['statusCode']
        actual_response_body = json.loads(actual_response['body'])

        # Check data
        self.assertEqual(HTTPStatus.CREATED, actual_status_code)

        self.assertEqual(data_pm_exclusion_resources["ExclusionResourceID"],
                         actual_response_body["id"])
        self.assertEqual(data_pm_exclusion_resources["OrganizationID"],
                         actual_response_body["organizationId"])
        self.assertEqual(data_pm_exclusion_resources["ProjectID"],
                         actual_response_body["projectId"])
        self.assertEqual(data_pm_exclusion_resources["AWSAccount"],
                         actual_response_body["awsAccount"])
        self.assertEqual(data_pm_exclusion_resources["CheckItemCode"],
                         actual_response_body["checkItemCode"])
        self.assertEqual(data_pm_exclusion_resources["RegionName"],
                         actual_response_body["regionName"])
        self.assertEqual(data_pm_exclusion_resources["ResourceName"],
                         actual_response_body["resourceName"])
        self.assertEqual(data_pm_exclusion_resources["ResourceType"],
                         actual_response_body["resourceType"])
        self.assertEqual(exclusion_comment_update,
                         actual_response_body["exclusionComment"])

    def test_create_excluded_resources_handler_error_authority(self):
        # perpare data test
        mock_pm_affiliation.create(copy.deepcopy(
            DataPmAffiliation.AFFILIATION_AUTHORITY_VIEWER))

        event_mock = event_create.get_event_object(
            trace_id=copy.deepcopy(
                DataPmAffiliation.AFFILIATION_AUTHORITY_VIEWER['UserID']),
            path_parameters=path_parameters,
            body=json.dumps(body))

        # Call function test
        actual_response = checkitemsettings.create_excluded_resources_handler(
            event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(actual_response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(actual_response['statusCode'], HTTPStatus.FORBIDDEN)
