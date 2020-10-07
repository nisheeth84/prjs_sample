import json
import copy

from http import HTTPStatus
from unittest.mock import patch
from moto import mock_dynamodb2
from tests.testcasebase import TestCaseBase
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_project import DataPmProjects
from tests.mock.data.aws.dynamodb.data_pm_organizations import DataPmOrganizations
from tests.mock.data.aws.dynamodb.data_pm_aws_account_coops import DataPmAwsAccountCoops
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources
from tests.mock import mock_common_utils
from premembers.check.logic import checkitemsettings_logic

data_pm_aws_account_coops = copy.deepcopy(DataPmAwsAccountCoops.DATA_SIMPLE)
data_pm_project = copy.deepcopy(DataPmProjects.DATA_SIMPLE)

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
organization_id = copy.deepcopy(DataPmOrganizations.ORGANIZATION_ID)
project_id = copy.deepcopy(DataPmProjects.PROJECT_ID)
coop_id = copy.deepcopy(DataPmAwsAccountCoops.COOP_ID)
group_filter = copy.deepcopy(DataPmExclusionResources.GROUP_FILTER)


@mock_dynamodb2
class TestListItemSettings(TestCaseBase):
    def setUp(self):
        super().setUp

    def test_list_item_settings_case_error_get_record_exclusion_resource(self):
        # mock object
        patch_get_projects_by_organization_id = patch(
            "premembers.repository.pm_projects.get_projects_by_organization_id")
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_assessment_items_query_filter_account_refine_code = patch(
            "premembers.repository.pm_assessmentItems.query_filter_account_refine_code")
        patch_exclusion_items_query_filter_account_refine_code = patch(
            "premembers.repository.pm_exclusionitems.query_filter_account_refine_code")
        patch_exclusion_resource_query_filter_account_refine_code = patch(
            "premembers.repository.pm_exclusionResources.query_filter_account_refine_code")

        # start mock object
        mock_get_projects_by_organization_id = patch_get_projects_by_organization_id.start()
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_exclusion_items_query_filter_account_refine_code = patch_exclusion_items_query_filter_account_refine_code.start()
        mock_assessment_items_query_filter_account_refine_code = patch_assessment_items_query_filter_account_refine_code.start()
        mock_exclusion_resource_query_filter_account_refine_code = patch_exclusion_resource_query_filter_account_refine_code.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_get_projects_by_organization_id.return_value = data_pm_project
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_exclusion_items_query_filter_account_refine_code.return_value = []
        mock_assessment_items_query_filter_account_refine_code.return_value = []
        mock_exclusion_resource_query_filter_account_refine_code.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_projects_by_organization_id.stop)
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(
            patch_exclusion_items_query_filter_account_refine_code.stop)
        self.addCleanup(
            patch_assessment_items_query_filter_account_refine_code.stop)
        self.addCleanup(
            patch_exclusion_resource_query_filter_account_refine_code.stop)

        # call Function test
        actual_response = checkitemsettings_logic.list_item_settings(
            trace_id, organization_id, project_id, coop_id, group_filter)

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
