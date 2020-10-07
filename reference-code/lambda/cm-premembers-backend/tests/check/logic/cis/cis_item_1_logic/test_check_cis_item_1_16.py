import copy

from unittest.mock import patch
from moto import mock_dynamodb2, mock_sts
from tests.testcasebase import TestCaseBase
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.data_common import DataCommon as AwsDataCommon
from tests.mock.aws.dynamodb import pm_exclusionResources as mock_pm_exclusionResources
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources
from premembers.const.const import CommonConst
from tests.mock.aws.dynamodb import db_utils
from premembers.repository.table_list import Tables
from tests.mock.aws.sts import sts_utils
from premembers.check.logic.cis import cis_item_1_logic
from premembers.common.pm_log_adapter import PmLogAdapter

data_pm_exclusion_resources = copy.deepcopy(
    DataPmExclusionResources.DATA_SIMPLE)

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
aws_account = copy.deepcopy(AwsDataCommon.AWS_ACCOUNT)
session = None
excluded_resources = None
check_item_code = "CHECK_CIS12_ITEM_1_16"
result_json_path = CommonConst.PATH_CHECK_RESULT.format(
    check_history_id, organization_id, project_id, aws_account,
    check_item_code + ".json")
region_global = "Global"
resource_type = copy.deepcopy(DataPmExclusionResources.RESOURCE_TYPE_USER)

resource_name_test = "<root_account>"
account_refine_code = "{0}_{1}_{2}".format(organization_id, project_id,
                                           aws_account)
check_item_refine_code = "{0}_{1}_{2}_{3}".format(organization_id, project_id,
                                                  aws_account, check_item_code)

listIAMUser = [
    {
        "Path": "",
        "UserName": resource_name_test,
        "UserId": "AIDAIW5NCTUGZSPSIIT2C",
        "Arn": "arn:aws:iam: : 216054658829:user/<root_account>",
        "CreateDate": ""
    },
    {
        "Path": "/",
        "UserName": "github_app_deploy",
        "UserId": "AIDAINBVUI37OSWN75DKE",
        "Arn": "arn:aws:iam: : 216054658829:user/github_app_deploy",
        "CreateDate": ""
    },
    {
        "Path": "",
        "UserName": "iam_create_test_mfa",
        "UserId": "AIDAIBDTV2QBSGPERB662",
        "Arn": "arn:aws:iam: : 216054658829:user/iam_create_test_mfa",
        "CreateDate": ""
    },
    {
        "Path": "/",
        "UserName": "luvina-group-test",
        "UserId": "AIDAIQXCANE6PZ6DC7TQY",
        "Arn": "arn:aws:iam: : 216054658829:user/luvina-group-test",
        "CreateDate": ""
    },
    {
        "Path": "/",
        "UserName": "luvina-test",
        "UserId": "AIDAJJZAHI5BHBV2S2W54",
        "Arn": "arn:aws:iam: : 216054658829:user/luvina-test",
        "CreateDate": ""
    },
    {
        "Path": "/",
        "UserName": "user_test_2@luvina.net",
        "UserId": "AIDAJKYPXDBZQNJXAQUXG",
        "Arn": "arn:aws:iam: : 216054658829:user/user_test_2@luvina.net",
        "CreateDate": ""
    },
    {
        "Path": "/",
        "UserName": "user_test_1@luvina.net",
        "UserId": "AIDAJSSAYHSZEQL7P3MGK",
        "Arn": "arn:aws:iam: : 216054658829:user/user_test_1@luvina.net",
        "CreateDate": ""
    }
]

list_iam_policy = [{
    'PolicyName': 'string',
    'PolicyArn': 'string'
}, {
    'PolicyName': 'string',
    'PolicyArn': 'string'
}, {
    'PolicyName': 'string',
    'PolicyArn': 'string'
}]


@mock_dynamodb2
@mock_sts
class TestCheckCisItem116(TestCaseBase):
    def setUp(self):
        super().setUp()
        global session
        global excluded_resources

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_EXCLUSION_RESOURCES):
            db_utils.delete_table(Tables.PM_EXCLUSION_RESOURCES)

        # create pm_exclusionResources table
        mock_pm_exclusionResources.create_table()

        # create record query
        # create resource for check code item 1.16
        data_pm_exclusion_resources[
            'ExclusionResourceID'] = "aa4fee9c-790f-478d-9f5d-7aeef688d541"
        data_pm_exclusion_resources['CheckItemCode'] = check_item_code
        data_pm_exclusion_resources['RegionName'] = region_global
        data_pm_exclusion_resources['ResourceType'] = resource_type
        data_pm_exclusion_resources['ResourceName'] = resource_name_test
        data_pm_exclusion_resources['OrganizationID'] = organization_id
        data_pm_exclusion_resources['ProjectID'] = project_id
        data_pm_exclusion_resources['AWSAccount'] = aws_account
        data_pm_exclusion_resources['AccountRefineCode'] = account_refine_code
        data_pm_exclusion_resources[
            'CheckItemRefineCode'] = check_item_refine_code
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # create resource for check code item other
        data_pm_exclusion_resources[
            'ExclusionResourceID'] = "aa4fee9c-790f-478d-9f5d-7aeef688d542"
        data_pm_exclusion_resources['CheckItemCode'] = "CHECK_CIS12_ITEM_OTHER"
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # get data excluded resource
        excluded_resources = mock_pm_exclusionResources.query_account_refine_index(
            trace_id, account_refine_code)

        if session is None:
            session = sts_utils.create_session()

    def test_check_cis_item_1_16_exclusion_resource_success(self):
        # mock object
        patch_get_list_users = patch("premembers.common.IAMUtils.get_list_users")
        patch_list_attached_user_policies = patch('premembers.common.IAMUtils.get_list_attached_user_policies')
        patch_get_list_user_policies = patch('premembers.common.IAMUtils.get_list_user_policies')
        patch_upload_json = patch("premembers.common.FileUtils.upload_json")

        # start mock object
        mock_get_list_users = patch_get_list_users.start()
        mock_list_attached_user_policies = patch_list_attached_user_policies.start(
        )
        mock_get_list_user_policies = patch_get_list_user_policies.start()
        mock_upload_json = patch_upload_json.start()

        # mock data
        mock_get_list_users.return_value = listIAMUser
        mock_list_attached_user_policies.return_value = list_iam_policy
        mock_upload_json.return_value = None
        mock_get_list_user_policies.return_value = ['list_user_policies']

        # addClear mock object
        self.addCleanup(patch_get_list_users.stop)
        self.addCleanup(patch_list_attached_user_policies.stop)
        self.addCleanup(patch_get_list_user_policies.stop)
        self.addCleanup(patch_upload_json.stop)

        expect_result_check = [
            {
                'Region': 'Global',
                'Level': '21',
                'DetectionItem': {
                    'UserName': 'github_app_deploy',
                    'ManagedPoliciesAttachedAbnormity': True,
                    'InlinePoliciesAttachedAbnormity': True
                }
            },
            {
                'Region': 'Global',
                'Level': '21',
                'DetectionItem': {
                    'UserName': 'iam_create_test_mfa',
                    'ManagedPoliciesAttachedAbnormity': True,
                    'InlinePoliciesAttachedAbnormity': True
                }
            },
            {
                'Region': 'Global',
                'Level': '21',
                'DetectionItem': {
                    'UserName': 'luvina-group-test',
                    'ManagedPoliciesAttachedAbnormity': True,
                    'InlinePoliciesAttachedAbnormity': True
                }
            },
            {
                'Region': 'Global',
                'Level': '21',
                'DetectionItem': {
                    'UserName': 'luvina-test',
                    'ManagedPoliciesAttachedAbnormity': True,
                    'InlinePoliciesAttachedAbnormity': True
                }
            },
            {
                'Region': 'Global',
                'Level': '21',
                'DetectionItem': {
                    'UserName': 'user_test_2@luvina.net',
                    'ManagedPoliciesAttachedAbnormity': True,
                    'InlinePoliciesAttachedAbnormity': True
                }
            },
            {
                'Region': 'Global',
                'Level': '21',
                'DetectionItem': {
                    'UserName': 'user_test_1@luvina.net',
                    'ManagedPoliciesAttachedAbnormity': True,
                    'InlinePoliciesAttachedAbnormity': True
                }
            }
        ]

        # call Function test
        actual_response = cis_item_1_logic.check_cis_item_1_16(
            trace_id, check_history_id, organization_id, project_id,
            aws_account, session, result_json_path, check_item_code,
            excluded_resources)

        actual_params_call_upload_json = mock_upload_json.call_args[0]
        actual_abnormality_users_result_check = actual_params_call_upload_json[
            2]
        actual_aws_account = actual_abnormality_users_result_check[
            'AWSAccount']
        actual_result_check = actual_abnormality_users_result_check[
            'CheckResults']

        # assert output function
        self.assertEqual(trace_id, actual_params_call_upload_json[0])
        self.assertEqual("S3_CHECK_BUCKET", actual_params_call_upload_json[1])
        self.assertEqual(actual_aws_account, aws_account)
        self.assertEqual(actual_result_check, expect_result_check)
        self.assertEqual(result_json_path, actual_params_call_upload_json[3])
        self.assertEqual(2, actual_response)

    def test_check_cis_item_1_16_exclusion_resource_error_check_resource(self):
        # mock object
        patch_get_list_users = patch("premembers.common.IAMUtils.get_list_users")
        patch_list_attached_user_policies = patch('premembers.common.IAMUtils.get_list_attached_user_policies')
        patch_get_list_user_policies = patch('premembers.common.IAMUtils.get_list_user_policies')
        patch_upload_json = patch("premembers.common.FileUtils.upload_json")

        # start mock object
        mock_get_list_users = patch_get_list_users.start()
        mock_list_attached_user_policies = patch_list_attached_user_policies.start(
        )
        mock_get_list_user_policies = patch_get_list_user_policies.start()
        mock_upload_json = patch_upload_json.start()

        # mock data
        listIAMUser_mock = copy.deepcopy(listIAMUser)
        del listIAMUser_mock[0]['UserName']
        mock_get_list_users.return_value = listIAMUser_mock
        mock_list_attached_user_policies.return_value = list_iam_policy
        mock_upload_json.return_value = None
        mock_get_list_user_policies.return_value = ['list_user_policies']

        # addClear mock object
        self.addCleanup(patch_get_list_users.stop)
        self.addCleanup(patch_list_attached_user_policies.stop)
        self.addCleanup(patch_get_list_user_policies.stop)
        self.addCleanup(patch_upload_json.stop)

        # call Function test
        with patch.object(
                PmLogAdapter, 'error', return_value=None) as error_method:
            with self.assertRaises(Exception):
                cis_item_1_logic.check_cis_item_1_16(
                    trace_id, check_history_id, organization_id, project_id,
                    aws_account, session, result_json_path, check_item_code,
                    excluded_resources)

        # assert output function
        error_method.assert_any_call("[%s] チェック処理中にエラーが発生しました。", aws_account)
