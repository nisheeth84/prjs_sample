import copy
from unittest.mock import patch

from moto import mock_dynamodb2
from tests.testcasebase import TestCaseBase
from premembers.check.batch import awssecuritychecks
from tests.mock.aws.dynamodb import db_utils
from tests.mock.data.aws.dynamodb.data_pm_check_history import DataPmCheckHistory
from tests.mock.data.aws.dynamodb.data_pm_aws_account_coops import DataPmAwsAccountCoops
from tests.mock.aws.dynamodb import pm_awsAccountCoops as mock_pm_awsAccountCoops
from tests.mock.data.aws.iam.data_test_iam import DataTestIAM
from tests.mock.data.aws.data_common import DataCommon
from premembers.repository.table_list import Tables

data_pm_check_history = copy.deepcopy(DataPmCheckHistory.DATA_SIMPLE)
data_pm_aws_account_coops = copy.deepcopy(DataPmAwsAccountCoops.DATA_SIMPLE)
check_history_id = copy.deepcopy(DataPmCheckHistory.CHECK_HISTORY_ID)
trace_id = check_history_id
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(3))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(3))
external_id = copy.deepcopy(DataTestIAM.EXTERNAL_ID)
role_name = copy.deepcopy(DataTestIAM.ROLE_NAME)
coop_id = data_pm_aws_account_coops['CoopID']
aws_account = copy.deepcopy(DataPmAwsAccountCoops.AWS_ACCOUNT)

event_mock = {
    "AWSAccount": aws_account,
    "CoopID": coop_id,
    "RoleName": role_name,
    "ExternalID": external_id,
    "OrganizationID": organization_id,
    "ProjectID": project_id,
    "CheckHistoryId": check_history_id
}


@mock_dynamodb2
class TestCheckEffectiveAwsaccountHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_AWSACCOUNTCOOPS):
            db_utils.delete_table(Tables.PM_AWSACCOUNTCOOPS)

        # create table
        mock_pm_awsAccountCoops.create_table()

    def test_check_effective_awsaccount_handler_success_case_check_account_aws_is_member(self):
        # create data table
        mock_pm_awsAccountCoops.create(data_pm_aws_account_coops)

        # patch mock
        patch_create_session_client = patch("premembers.common.aws_common.create_session_client")
        patch_get_iam_client = patch("premembers.common.IAMUtils.get_iam_client")
        patch_get_membership_aws_account = patch("premembers.check.logic.awssecuritychecks_logic.get_membership_aws_account")

        # start mock object
        mock_create_session_client = patch_create_session_client.start()
        mock_get_iam_client = patch_get_iam_client.start()
        mock_get_membership_aws_account = patch_get_membership_aws_account.start()

        # mock object
        mock_create_session_client.return_value = None
        mock_get_iam_client.return_value = None
        mock_get_membership_aws_account.return_value = 1

        # mock object
        self.addCleanup(patch_create_session_client.stop)
        self.addCleanup(patch_get_iam_client.stop)
        self.addCleanup(patch_get_membership_aws_account.stop)

        # Call function test
        actual_response = awssecuritychecks.check_effective_awsaccount_handler(
            event_mock, {})

        expect_response = {
            "TaskResult": "Success",
            "Members": str(1),
            "AccountCoop": "1"
        }
        # check response
        self.assertDictEqual(expect_response, actual_response)

    def test_check_effective_awsaccount_handler_success_case_check_account_aws_is_not_member(self):
        # create data table
        mock_pm_awsAccountCoops.create(data_pm_aws_account_coops)

        # patch mock
        patch_create_session_client = patch("premembers.common.aws_common.create_session_client")
        patch_get_iam_client = patch("premembers.common.IAMUtils.get_iam_client")
        patch_get_membership_aws_account = patch("premembers.check.logic.awssecuritychecks_logic.get_membership_aws_account")

        # start mock object
        mock_create_session_client = patch_create_session_client.start()
        mock_get_iam_client = patch_get_iam_client.start()
        mock_get_membership_aws_account = patch_get_membership_aws_account.start()

        # mock object
        mock_create_session_client.return_value = None
        mock_get_iam_client.return_value = None
        mock_get_membership_aws_account.return_value = 0

        # mock object
        self.addCleanup(patch_create_session_client.stop)
        self.addCleanup(patch_get_iam_client.stop)
        self.addCleanup(patch_get_membership_aws_account.stop)

        # Call function test
        actual_response = awssecuritychecks.check_effective_awsaccount_handler(
            event_mock, {})

        expect_response = {
            "TaskResult": "Success",
            "Members": str(0),
            "AccountCoop": "1"
        }
        # check response
        self.assertDictEqual(expect_response, actual_response)
