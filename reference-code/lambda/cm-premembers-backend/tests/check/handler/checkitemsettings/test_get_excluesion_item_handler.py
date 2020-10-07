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
from tests.mock.aws.dynamodb import pm_exclusionItems as mock_pm_exclusionItems
from tests.mock.data.aws.dynamodb.data_pm_affiliation import DataPmAffiliation
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_aws_account_coops import DataPmAwsAccountCoops
from tests.mock.data.aws.dynamodb.data_pm_exclusion_items import DataPmExclusionItems

data_pm_affiliation = copy.deepcopy(DataPmAffiliation.AFFILIATION_TEMPLATE)
data_pm_aws_account_coops = copy.deepcopy(DataPmAwsAccountCoops.DATA_SIMPLE)
data_pm_exclusion_items = copy.deepcopy(DataPmExclusionItems.DATA_SIMPLE)

path_parameters = {
    "organization_id": data_pm_exclusion_items['OrganizationID'],
    "project_id": data_pm_exclusion_items['ProjectID'],
    "coop_id": data_pm_aws_account_coops['CoopID'],
    "check_item_code": data_pm_exclusion_items['CheckItemCode']
}

event_mock = event_create.get_event_object(
    trace_id=copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3))),
    path_parameters=path_parameters)


@mock_dynamodb2
class TestGetExcluesionItemHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_AFFILIATION):
            db_utils.delete_table(Tables.PM_AFFILIATION)
        if db_utils.check_table_exist(Tables.PM_AWSACCOUNTCOOPS):
            db_utils.delete_table(Tables.PM_AWSACCOUNTCOOPS)
        if db_utils.check_table_exist(Tables.PM_EXCLUSION_ITEMS):
            db_utils.delete_table(Tables.PM_EXCLUSION_ITEMS)

        # create table
        mock_pm_affiliation.create_table()
        mock_pm_awsAccountCoops.create_table()
        mock_pm_exclusionItems.create_table()

    def test_get_excluesion_item_handler_case_excluesion_items_zero_record(self):
        # perpare data test
        mock_pm_affiliation.create(data_pm_affiliation)
        mock_pm_awsAccountCoops.create(data_pm_aws_account_coops)

        # Call function test
        actual_response = checkitemsettings.get_excluesion_item_handler(
            event_mock, {})

        # Get data response
        actual_status_code = actual_response['statusCode']
        actual_response_body = json.loads(actual_response['body'])

        # Check data
        self.assertEqual(HTTPStatus.OK, actual_status_code)
        self.assertEqual([], actual_response_body)
