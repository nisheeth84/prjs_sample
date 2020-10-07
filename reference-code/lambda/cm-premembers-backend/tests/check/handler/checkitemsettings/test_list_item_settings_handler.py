import json
import copy

from tests.testcasebase import TestCaseBase
from http import HTTPStatus
from tests import event_create
from moto import mock_dynamodb2
from tests.mock.aws.dynamodb import db_utils
from premembers.repository.table_list import Tables
from premembers.check.handler import checkitemsettings
from premembers.common import common_utils
from tests.mock.aws.dynamodb import pm_affiliation as mock_pm_affiliation
from tests.mock.aws.dynamodb import pm_projects as mock_pm_projects
from tests.mock.aws.dynamodb import pm_awsAccountCoops as mock_pm_awsAccountCoops
from tests.mock.aws.dynamodb import pm_assessmentItems as mock_pm_assessmentItems
from tests.mock.aws.dynamodb import pm_exclusionItems as mock_pm_exclusionItems
from tests.mock.aws.dynamodb import pm_exclusionResources as mock_pm_exclusionResources
from tests.mock.data.aws.dynamodb.data_pm_affiliation import DataPmAffiliation
from premembers.repository.const import ExcludedResourceFlag
from tests.mock.data.aws.dynamodb.data_pm_aws_account_coops import DataPmAwsAccountCoops
from tests.mock.data.aws.dynamodb.data_pm_project import DataPmProjects
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_organizations import DataPmOrganizations
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources

data_pm_affiliation = copy.deepcopy(DataPmAffiliation.AFFILIATION_TEMPLATE)
data_pm_projects = copy.deepcopy(DataPmProjects.DATA_SIMPLE)
data_pm_aws_account_coops = copy.deepcopy(DataPmAwsAccountCoops.DATA_SIMPLE)
data_pm_exclusion_resources = copy.deepcopy(
    DataPmExclusionResources.DATA_SIMPLE)

organization_id = copy.deepcopy(DataPmOrganizations.ORGANIZATION_ID)
project_id = copy.deepcopy(DataPmProjects.PROJECT_ID)
coop_id = copy.deepcopy(DataPmAwsAccountCoops.COOP_ID)

path_parameters = {
    "organization_id": organization_id,
    "project_id": project_id,
    "coop_id": coop_id,
    "check_item_code": data_pm_exclusion_resources['CheckItemCode']
}

event_mock = event_create.get_event_object(
    trace_id=copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3))),
    path_parameters=path_parameters
)

LIST_CHECK_ITEM_CODE_EXCLUDED_RESOURCE = copy.deepcopy(
    DataPmExclusionResources.LIST_CHECK_ITEM_CODE_EXCLUDED_RESOURCE)


@mock_dynamodb2
class TestlistItemSettingsHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_AFFILIATION):
            db_utils.delete_table(Tables.PM_AFFILIATION)
        if db_utils.check_table_exist(Tables.PM_PROJECTS):
            db_utils.delete_table(Tables.PM_PROJECTS)
        if db_utils.check_table_exist(Tables.PM_ASSESSMENT_ITEMS):
            db_utils.delete_table(Tables.PM_ASSESSMENT_ITEMS)
        if db_utils.check_table_exist(Tables.PM_EXCLUSION_ITEMS):
            db_utils.delete_table(Tables.PM_EXCLUSION_ITEMS)
        if db_utils.check_table_exist(Tables.PM_EXCLUSION_RESOURCES):
            db_utils.delete_table(Tables.PM_EXCLUSION_RESOURCES)
        if db_utils.check_table_exist(Tables.PM_AWSACCOUNTCOOPS):
            db_utils.delete_table(Tables.PM_AWSACCOUNTCOOPS)

        # create table
        mock_pm_affiliation.create_table()
        mock_pm_projects.create_table()
        mock_pm_awsAccountCoops.create_table()
        mock_pm_assessmentItems.create_table()
        mock_pm_exclusionItems.create_table()
        mock_pm_exclusionResources.create_table()

    def test_list_item_settings_handler_success_case_not_exists_data_exclusion_resource(self):
        # perpare data test
        mock_pm_affiliation.create(data_pm_affiliation)
        mock_pm_projects.create(data_pm_projects)
        mock_pm_awsAccountCoops.create(data_pm_aws_account_coops)

        # Call function test
        actual_response = checkitemsettings.list_item_settings_handler(
            event_mock, {})

        # Get data response
        actual_status_code = actual_response['statusCode']
        actual_response_bodys = json.loads(actual_response['body'])

        # Check data
        self.assertEqual(HTTPStatus.OK, actual_status_code)
        for actual_response_body in actual_response_bodys:
            if actual_response_body["checkItemCode"] in LIST_CHECK_ITEM_CODE_EXCLUDED_RESOURCE:
                self.assertEqual(ExcludedResourceFlag.Disable,
                                 actual_response_body["excludedResourceFlag"])
            else:
                self.assertEqual(ExcludedResourceFlag.Other,
                                 actual_response_body["excludedResourceFlag"])

    def test_list_item_settings_handler_success_case_exists_data_exclusion_resource(self):
        # perpare data test
        aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
        mock_pm_affiliation.create(data_pm_affiliation)
        mock_pm_projects.create(data_pm_projects)
        mock_pm_awsAccountCoops.create(data_pm_aws_account_coops)

        for check_item_code in LIST_CHECK_ITEM_CODE_EXCLUDED_RESOURCE:
            data_pm_exclusion_resources['ExclusionResourceID'] = common_utils.get_uuid4()
            data_pm_exclusion_resources['CheckItemCode'] = check_item_code
            data_pm_exclusion_resources['CheckItemRefineCode'] = copy.deepcopy(
                DataPmExclusionResources.CHECK_ITEM_REFINE_CODE_TEMPLATE.format(
                    organization_id, project_id, aws_account, check_item_code))
            data_pm_exclusion_resources['AccountRefineCode'] = copy.deepcopy(
                DataPmExclusionResources.ACCOUNT_REFINE_CODE_TEMPLATE.format(
                    organization_id, project_id, aws_account))
            mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # Call function test
        actual_response = checkitemsettings.list_item_settings_handler(
            event_mock, {})

        # Get data response
        actual_status_code = actual_response['statusCode']
        actual_response_bodys = json.loads(actual_response['body'])

        # Check data
        self.assertEqual(HTTPStatus.OK, actual_status_code)
        for actual_response_body in actual_response_bodys:
            if actual_response_body["checkItemCode"] in LIST_CHECK_ITEM_CODE_EXCLUDED_RESOURCE:
                self.assertEqual(ExcludedResourceFlag.Enable,
                                 actual_response_body["excludedResourceFlag"])
            else:
                self.assertEqual(ExcludedResourceFlag.Other,
                                 actual_response_body["excludedResourceFlag"])
