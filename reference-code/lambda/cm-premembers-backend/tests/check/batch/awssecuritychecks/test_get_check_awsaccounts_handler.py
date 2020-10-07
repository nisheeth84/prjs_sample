import copy

from moto import mock_dynamodb2
from tests.testcasebase import TestCaseBase
from premembers.check.batch import awssecuritychecks
from tests.mock.aws.dynamodb import db_utils
from tests.mock.aws.dynamodb import pm_checkHistory as mock_pm_checkHistory
from tests.mock.aws.dynamodb import pm_projects as mock_pm_projects
from tests.mock.aws.dynamodb import pm_awsAccountCoops as mock_pm_awsAccountCoops
from tests.mock.aws.dynamodb import pm_organizations as mock_pm_organizations
from tests.mock.aws.dynamodb import pm_checkResults as mock_pm_checkResults
from tests.mock.data.aws.dynamodb.data_pm_check_history import DataPmCheckHistory
from tests.mock.data.aws.dynamodb.data_pm_organizations import DataPmOrganizations
from tests.mock.data.aws.dynamodb.data_pm_aws_account_coops import DataPmAwsAccountCoops
from tests.mock.data.aws.dynamodb.data_pm_project import DataPmProjects
from premembers.repository.table_list import Tables
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from unittest.mock import patch

data_pm_project = copy.deepcopy(DataPmProjects.DATA_SIMPLE)
data_pm_check_history = copy.deepcopy(DataPmCheckHistory.DATA_SIMPLE)
data_pm_organizations = copy.deepcopy(DataPmOrganizations.DATA_SIMPLE)
list_data_aws_account_coops = copy.deepcopy(
    DataPmAwsAccountCoops.LIST_AWS_ACCOUNT_COOPS)
check_history_id = copy.deepcopy(DataPmCheckHistory.CHECK_HISTORY_ID)
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
project_id = copy.deepcopy(DataPmProjects.PROJECT_ID)
check_result_id = 0


def side_effect_get_uuid4():
    global check_result_id
    check_result_id += 1
    return str(check_result_id)


@mock_dynamodb2
class TestGetCheckAwsaccountsHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_CHECK_HISTORY):
            db_utils.delete_table(Tables.PM_CHECK_HISTORY)
        if db_utils.check_table_exist(Tables.PM_PROJECTS):
            db_utils.delete_table(Tables.PM_PROJECTS)
        if db_utils.check_table_exist(Tables.PM_AWSACCOUNTCOOPS):
            db_utils.delete_table(Tables.PM_AWSACCOUNTCOOPS)
        if db_utils.check_table_exist(Tables.PM_ORGANIZATIONS):
            db_utils.delete_table(Tables.PM_ORGANIZATIONS)
        if db_utils.check_table_exist(Tables.PM_CHECK_RESULTS):
            db_utils.delete_table(Tables.PM_CHECK_RESULTS)

        # create table
        mock_pm_checkHistory.create_table()
        mock_pm_projects.create_table()
        mock_pm_awsAccountCoops.create_table()
        mock_pm_organizations.create_table()
        mock_pm_checkResults.create_table()

    def test_get_check_awsaccounts_handler_success(self):
        # patch mock
        patch_get_uuid4 = patch("premembers.common.common_utils.get_uuid4")

        # start mock object
        mock_get_uuid4 = patch_get_uuid4.start()

        # mock data
        mock_get_uuid4.side_effect = side_effect_get_uuid4

        # addCleanup stop mock object
        self.addCleanup(patch_get_uuid4.stop)

        # create data table
        list_data_aws_accounts = []
        mock_pm_checkHistory.create(data_pm_check_history)
        mock_pm_projects.create(data_pm_project)
        mock_pm_organizations.create(data_pm_organizations)
        for index, data_aws_account_coops in enumerate(list_data_aws_account_coops):
            mock_pm_awsAccountCoops.create(data_aws_account_coops)
            data_aws_accounts = {
                'AWSAccount': data_aws_account_coops['AWSAccount'],
                'CoopID': data_aws_account_coops['CoopID'],
                'AWSAccountName': data_aws_account_coops['AWSAccountName'],
                'RoleName': data_aws_account_coops['RoleName'],
                'ExternalID': data_aws_account_coops['ExternalID'],
                'OrganizationID': data_aws_account_coops['OrganizationID'],
                'OrganizationName': data_pm_organizations['OrganizationName'],
                'ProjectID': data_aws_account_coops['ProjectID'],
                'ProjectName': data_pm_project['ProjectName'],
                'CheckHistoryId': check_history_id,
                'CheckResultID': str(index + 1)
            }
            list_data_aws_accounts.append(data_aws_accounts)

        # prepare data
        expected_response = {
            'CheckHistoryId': check_history_id,
            'AWSAccounts': list_data_aws_accounts
        }

        # create event mock
        event_mock = {
            "CheckHistoryId": check_history_id
        }

        # Call function test
        actual_response = awssecuritychecks.get_check_awsaccounts_handler(
            event_mock, {})

        # check response
        self.assertEquals(expected_response, actual_response)

        # check CheckStatus
        check_history = mock_pm_checkHistory.query_key(check_history_id)
        self.assertEquals(1, check_history['CheckStatus'])

        # check create resord table PM_CheckResults
        check_results = mock_pm_checkResults.query_all()
        self.assertEquals(len(list_data_aws_account_coops), len(check_results['Items']))
