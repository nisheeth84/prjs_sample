import copy

from unittest.mock import patch
from moto import mock_dynamodb2, mock_sts, mock_iam, mock_s3
from tests.testcasebase import TestCaseBase
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.data_common import DataCommon as AwsDataCommon
from tests.mock.aws.dynamodb import pm_exclusionResources as mock_pm_exclusionResources
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources
from tests.mock.data.aws.iam.data_test_iam import DataTestIAM
from premembers.const.const import CommonConst
from tests.mock.aws.dynamodb import db_utils
from premembers.repository.table_list import Tables
from tests.mock.aws.sts import sts_utils
from premembers.check.logic.cis import cis_item_1_logic

data_pm_exclusion_resources = copy.deepcopy(
    DataPmExclusionResources.DATA_SIMPLE)

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
aws_account = copy.deepcopy(AwsDataCommon.AWS_ACCOUNT)
session = None
check_item_code = "CHECK_CIS12_ITEM_1_22"
excluded_resources = None
result_json_path = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
region_global = "Global"
resource_type_users = copy.deepcopy(
    DataPmExclusionResources.RESOURCE_TYPE_USER)
resource_type_groups = copy.deepcopy(
    DataPmExclusionResources.RESOURCE_TYPE_GROUP)
resource_type_roles = copy.deepcopy(
    DataPmExclusionResources.RESOURCE_TYPE_ROLE)

account_refine_code = "{0}_{1}_{2}".format(organization_id, project_id, aws_account)
check_item_refine_code = "{0}_{1}_{2}_{3}".format(organization_id, project_id, aws_account, check_item_code)


@mock_dynamodb2
@mock_sts
@mock_iam
@mock_s3
class TestCheckCisItem122(TestCaseBase):
    def setUp(self):
        super().setUp()
        global session
        global excluded_resources

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_EXCLUSION_RESOURCES):
            db_utils.delete_table(Tables.PM_EXCLUSION_RESOURCES)

        # create pm_userAttribute table
        mock_pm_exclusionResources.create_table()

        # create record query
        # create resource for check code item 1.22 resource type = "user"
        data_pm_exclusion_resources['ExclusionResourceID'] = "aa4fee9c-790f-478d-9f5d-7aeef688d541"
        data_pm_exclusion_resources['CheckItemCode'] = check_item_code
        data_pm_exclusion_resources['RegionName'] = region_global
        data_pm_exclusion_resources['ResourceType'] = resource_type_users
        data_pm_exclusion_resources['ResourceName'] = "insightwatch-190611-ContentProtectedReadOnlyPolicy-YDBNQDSP9W1M,PolicyUsers1"
        data_pm_exclusion_resources['OrganizationID'] = organization_id
        data_pm_exclusion_resources['ProjectID'] = project_id
        data_pm_exclusion_resources['AWSAccount'] = aws_account
        data_pm_exclusion_resources['AccountRefineCode'] = account_refine_code
        data_pm_exclusion_resources['CheckItemRefineCode'] = check_item_refine_code
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # create resource for check code item 1.22 resource type = "group"
        data_pm_exclusion_resources['ExclusionResourceID'] = "aa4fee9c-790f-478d-9f5d-7aeef688d542"
        data_pm_exclusion_resources['ResourceName'] = "insightwatch-190611-ContentProtectedReadOnlyPolicy-YDBNQDSP9W1M,PolicyGroups2"
        data_pm_exclusion_resources['ResourceType'] = resource_type_groups
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # create resource for check code item 1.22 resource type = "role"
        data_pm_exclusion_resources['ExclusionResourceID'] = "aa4fee9c-790f-478d-9f5d-7aeef688d543"
        data_pm_exclusion_resources['ResourceName'] = "insightwatch-190611-ContentProtectedReadOnlyPolicy-YDBNQDSP9W1M,PolicyRoles3"
        data_pm_exclusion_resources['ResourceType'] = resource_type_roles
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # create resource for check code item other
        data_pm_exclusion_resources['ExclusionResourceID'] = "aa4fee9c-790f-478d-9f5d-7aeef688d544"
        data_pm_exclusion_resources['CheckItemCode'] = "CHECK_CIS12_ITEM_OTHER"
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # get data excluded resource
        excluded_resources = mock_pm_exclusionResources.query_account_refine_index(
            trace_id, account_refine_code)

        if session is None:
            session = sts_utils.create_session()

    def test_check_cis_item_1_22_exclusion_resource_success(self):
        # mock object
        patch_get_list_policies = patch(
            "premembers.check.logic.cis.cis_item_1_logic.get_list_policies"
        )
        patch_get_policy_version = patch(
            "premembers.common.IAMUtils.get_policy_version"
        )
        patch_list_entities_for_policy = patch(
            "premembers.common.IAMUtils.list_entities_for_policy"
        )
        patch_upload_json = patch(
            "premembers.common.FileUtils.upload_json"
        )

        # start mock object
        mock_get_list_policies = patch_get_list_policies.start()
        mock_get_policy_version = patch_get_policy_version.start()
        mock_list_entities_for_policy = patch_list_entities_for_policy.start()
        mock_upload_json = patch_upload_json.start()

        # mock data
        mock_get_list_policies.return_value = DataTestIAM.LIST_POLICIES_DATA
        mock_get_policy_version.return_value = DataTestIAM.DATA_POLICIES_VERSION['PolicyVersion']
        mock_list_entities_for_policy.return_value = DataTestIAM.LIST_ENTITIES_FOR_POLICY_DATA
        mock_upload_json.return_value = None

        expected_abnormality_users_result_check = ['PolicyUsers2', 'PolicyUsers3']
        expected_abnormality_groups_result_check = ['PolicyGroups3', 'PolicyGroups1']
        expected_abnormality_roles_result_check = ['PolicyRoles2', 'PolicyRoles1']

        # call Function test
        actual_response = cis_item_1_logic.check_cis_item_1_22(
            trace_id, check_history_id, organization_id, project_id,
            aws_account, session, result_json_path, check_item_code,
            excluded_resources)

        actual_params_call_upload_json = mock_upload_json.call_args[0]
        actual_abnormality_users_result_check = actual_params_call_upload_json[2]['CheckResults'][0]['DetectionItem']['AbnormalityUsers']
        actual_abnormality_groups_result_check = actual_params_call_upload_json[2]['CheckResults'][0]['DetectionItem']['AbnormalityGroups']
        actual_abnormality_roles_result_check = actual_params_call_upload_json[2]['CheckResults'][0]['DetectionItem']['AbnormalityRoles']

        self.assertEqual(trace_id, actual_params_call_upload_json[0])
        self.assertEqual("S3_CHECK_BUCKET", actual_params_call_upload_json[1])
        self.assertEqual(expected_abnormality_users_result_check,
                         actual_abnormality_users_result_check)
        self.assertEqual(expected_abnormality_groups_result_check,
                         actual_abnormality_groups_result_check)
        self.assertEqual(expected_abnormality_roles_result_check,
                         actual_abnormality_roles_result_check)
        self.assertEqual(result_json_path, actual_params_call_upload_json[3])
        self.assertEqual(2, actual_response)

    def test_check_cis_item_1_22_exclusion_resource_error_check_resource(self):
        # mock object
        patch_get_list_policies = patch(
            "premembers.check.logic.cis.cis_item_1_logic.get_list_policies"
        )
        patch_get_policy_version = patch(
            "premembers.common.IAMUtils.get_policy_version"
        )
        patch_list_entities_for_policy = patch(
            "premembers.common.IAMUtils.list_entities_for_policy"
        )
        patch_upload_json = patch(
            "premembers.common.FileUtils.upload_json"
        )

        # start mock object
        mock_get_list_policies = patch_get_list_policies.start()
        mock_get_policy_version = patch_get_policy_version.start()
        mock_list_entities_for_policy = patch_list_entities_for_policy.start()
        mock_upload_json = patch_upload_json.start()

        # mock data
        list_policies_data = copy.deepcopy(DataTestIAM.LIST_POLICIES_DATA)
        del list_policies_data[0]['PolicyName']
        mock_get_list_policies.return_value = list_policies_data
        mock_get_policy_version.return_value = DataTestIAM.DATA_POLICIES_VERSION['PolicyVersion']
        mock_list_entities_for_policy.return_value = DataTestIAM.LIST_ENTITIES_FOR_POLICY_DATA
        mock_upload_json.return_value = None

        # call Function test
        with patch.object(
                PmLogAdapter, 'error', return_value=None) as error_method:
            with self.assertRaises(Exception):
                cis_item_1_logic.check_cis_item_1_22(
                    trace_id, check_history_id, organization_id, project_id,
                    aws_account, session, result_json_path, check_item_code,
                    excluded_resources)

        error_method.assert_any_call("[%s] チェック処理中にエラーが発生しました。", aws_account)
