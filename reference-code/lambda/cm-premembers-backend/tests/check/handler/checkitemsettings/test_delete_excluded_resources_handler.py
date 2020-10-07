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
data_exclusion_resources_not_delete = copy.deepcopy(
    DataPmExclusionResources.EXCLUSION_RESOURCES_NOT_DELETE)


path_parameters = {
    "organization_id": data_pm_exclusion_resources['OrganizationID'],
    "project_id": data_pm_exclusion_resources['ProjectID'],
    "coop_id": data_pm_aws_account_coops['CoopID'],
    "check_item_code": data_pm_exclusion_resources['CheckItemCode']
}

query_string_parameters = {
    "region_name": data_pm_exclusion_resources['RegionName'],
    "resource_type": data_pm_exclusion_resources['ResourceType'],
    "resource_name": data_pm_exclusion_resources['ResourceName'],
}


@mock_dynamodb2
class TestDeleteExcludedResourcesHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
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

    def test_delete_excluded_resources_handler_success(self):
        # perpare data test
        mock_pm_affiliation.create(data_pm_affiliation)
        mock_pm_awsAccountCoops.create(data_pm_aws_account_coops)

        event_mock = event_create.get_event_object(
            trace_id=copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3))),
            path_parameters=path_parameters,
            query_string_parameters=query_string_parameters)

        # create record pm_exclusionResources delete
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # create record pm_exclusionResources not delete
        mock_pm_exclusionResources.create(data_exclusion_resources_not_delete)

        # Call function test
        actual_response = checkitemsettings.delete_excluded_resources_handler(
            event_mock, {})

        # get record pm_exclusionResources delete
        actual_exclusion_resources_delete = mock_pm_exclusionResources.query_key(
            data_pm_exclusion_resources['ExclusionResourceID'])

        # get record pm_exclusionResources not delete
        actual_exclusion_resources_not_delete = mock_pm_exclusionResources.query_key(
            data_exclusion_resources_not_delete['ExclusionResourceID'])

        # Get data response
        actual_status_code = actual_response['statusCode']
        actual_response_body = json.loads(actual_response['body'])

        # Check data
        self.assertEqual(None, actual_exclusion_resources_delete)
        self.assertEqual(None, actual_response_body)
        self.assertEqual(HTTPStatus.NO_CONTENT, actual_status_code)

        self.assertDictEqual(data_exclusion_resources_not_delete,
                             actual_exclusion_resources_not_delete)

    def test_delete_excluded_resources_handler_error_authority(self):
        # perpare data test
        mock_pm_affiliation.create(copy.deepcopy(DataPmAffiliation.AFFILIATION_AUTHORITY_VIEWER))

        event_mock = event_create.get_event_object(
            trace_id=copy.deepcopy(
                DataPmAffiliation.AFFILIATION_AUTHORITY_VIEWER['UserID']),
            path_parameters=path_parameters,
            query_string_parameters=query_string_parameters)

        # Call function test
        actual_response = checkitemsettings.delete_excluded_resources_handler(
            event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(actual_response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(actual_response['statusCode'], HTTPStatus.FORBIDDEN)
