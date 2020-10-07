import copy

from unittest.mock import patch
from moto import mock_dynamodb2, mock_sts, mock_s3
from tests.testcasebase import TestCaseBase
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.data_common import DataCommon as DataCommonAws
from tests.mock.data.aws.ec2.data_test_ec2 import DataTestEC2
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources
from tests.mock.aws.dynamodb import pm_exclusionResources as mock_pm_exclusionResources
from premembers.const.const import CommonConst
from tests.mock.aws.dynamodb import db_utils
from premembers.repository.table_list import Tables
from tests.mock.aws.sts import sts_utils
from premembers.check.logic.cis import cis_item_4_logic

data_pm_exclusion_resources = copy.deepcopy(
    DataPmExclusionResources.DATA_SIMPLE)

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
check_item_code = "CHECK_CIS12_ITEM_4_03"
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
security_groups = copy.deepcopy(DataTestEC2.SECURITY_GROUPS)
regions = copy.deepcopy(DataTestEC2.LIST_REGIONS)
region_name = copy.deepcopy(DataCommonAws.REGION_EU_NORTH_1)
resource_type = copy.deepcopy(DataPmExclusionResources.RESOURCE_TYPE_GROUP_ID)
id_group_excluded_resources_resource_ng = copy.deepcopy(DataTestEC2.ID_GROUP_EXCLUDED_RESOURCES_RESOURCE_NG)
id_group_not_excluded_resources = copy.deepcopy(DataTestEC2.ID_GROUP_NOT_EXCLUDED_RESOURCES)
resource_name_test = id_group_excluded_resources_resource_ng
account_refine_code = "{0}_{1}_{2}".format(organization_id, project_id,
                                           aws_account)
check_item_refine_code = "{0}_{1}_{2}_{3}".format(organization_id, project_id,
                                                  aws_account, check_item_code)

result_json_path = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")

session = None
excluded_resources = None


@mock_dynamodb2
@mock_sts
@mock_s3
class TestCheckCisItem403(TestCaseBase):
    def setUp(self):
        super().setUp()

        global session
        global excluded_resources
        if not session:
            session = sts_utils.create_session()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_EXCLUSION_RESOURCES):
            db_utils.delete_table(Tables.PM_EXCLUSION_RESOURCES)

        # create pm_userAttribute table
        mock_pm_exclusionResources.create_table()

        # create record query
        # create resource for check code item 4.03
        data_pm_exclusion_resources['ExclusionResourceID'] = "aa4fee9c-790f-478d-9f5d-7aeef688d541"
        data_pm_exclusion_resources['CheckItemCode'] = check_item_code
        data_pm_exclusion_resources['RegionName'] = region_name
        data_pm_exclusion_resources['ResourceType'] = resource_type
        data_pm_exclusion_resources['ResourceName'] = resource_name_test
        data_pm_exclusion_resources['OrganizationID'] = organization_id
        data_pm_exclusion_resources['ProjectID'] = project_id
        data_pm_exclusion_resources['AWSAccount'] = aws_account
        data_pm_exclusion_resources['AccountRefineCode'] = account_refine_code
        data_pm_exclusion_resources['CheckItemRefineCode'] = check_item_refine_code
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # create resource for check code item other
        data_pm_exclusion_resources['ExclusionResourceID'] = "aa4fee9c-790f-478d-9f5d-7aeef688d542"
        data_pm_exclusion_resources['CheckItemCode'] = "CHECK_CIS12_ITEM_OTHER"
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # get data excluded resource
        excluded_resources = mock_pm_exclusionResources.query_account_refine_index(
            trace_id, account_refine_code)

    def test_check_cis_item_4_03_exclusion_resource_success(self):
        expected_check_results = [
            {
                'DetectionItem': {
                    'AbnormalitySecurityGroups': [id_group_not_excluded_resources]
                },
                'Level': '11',
                'Region': 'eu-north-1'
            }
        ]

        # mock object
        patch_get_regions = patch("premembers.common.aws_common.get_regions")
        patch_check_exists_file_s3 = patch("premembers.common.aws_common.check_exists_file_s3")
        patch_describe_security_groups = patch("premembers.common.Ec2Utils.describe_security_groups")
        patch_upload_s3 = patch("premembers.common.FileUtils.upload_s3")
        patch_describe_instances = patch("premembers.common.Ec2Utils.describe_instances")

        # start mock object
        mock_get_regions = patch_get_regions.start()
        mock_check_exists_file_s3 = patch_check_exists_file_s3.start()
        mock_describe_security_groups = patch_describe_security_groups.start()
        mock_upload_s3 = patch_upload_s3.start()
        mock_describe_instances = patch_describe_instances.start()

        # mock data
        mock_get_regions.return_value = regions
        mock_check_exists_file_s3.return_value = False
        mock_describe_security_groups.return_value = security_groups
        mock_describe_instances.return_value = []
        mock_upload_s3.return_value = None

        # addCleanup stop mock object
        self.addCleanup(patch_get_regions.stop)
        self.addCleanup(patch_check_exists_file_s3.stop)
        self.addCleanup(patch_describe_security_groups.stop)
        self.addCleanup(patch_upload_s3.stop)
        self.addCleanup(patch_describe_instances.stop)

        # call Function test
        actual_response = cis_item_4_logic.check_cis_item_4_03(
            trace_id, check_history_id, organization_id, project_id,
            aws_account, session, result_json_path, check_item_code,
            excluded_resources)

        actual_param_call_upload_s3 = mock_upload_s3.call_args[0][1]

        actual_aws_account = actual_param_call_upload_s3['AWSAccount']
        actual_check_results = actual_param_call_upload_s3['CheckResults']

        # assert output function
        self.assertEqual(aws_account, actual_aws_account)
        self.assertEqual(expected_check_results, actual_check_results)
        self.assertEqual(1, actual_response)

    def test_check_cis_item_4_03_exclusion_resource_error_check_resource(self):
        # mock object
        patch_get_regions = patch("premembers.common.aws_common.get_regions")
        patch_check_exists_file_s3 = patch("premembers.common.aws_common.check_exists_file_s3")
        patch_describe_security_groups = patch("premembers.common.Ec2Utils.describe_security_groups")
        patch_upload_s3 = patch("premembers.common.FileUtils.upload_s3")
        patch_describe_instances = patch("premembers.common.Ec2Utils.describe_instances")

        # start mock object
        mock_get_regions = patch_get_regions.start()
        mock_check_exists_file_s3 = patch_check_exists_file_s3.start()
        mock_describe_security_groups = patch_describe_security_groups.start()
        mock_upload_s3 = patch_upload_s3.start()
        mock_describe_instances = patch_describe_instances.start()

        # mock data
        mock_get_regions.return_value = regions
        mock_check_exists_file_s3.return_value = False
        mock_describe_instances.return_value = []
        mock_upload_s3.return_value = None

        # mock data security_groups with resource name (GroupId) not esxist
        data_security_groups_mock = copy.deepcopy(DataTestEC2.SECURITY_GROUPS)
        del data_security_groups_mock[0]['GroupId']
        mock_describe_security_groups.return_value = data_security_groups_mock

        # addCleanup stop mock object
        self.addCleanup(patch_get_regions.stop)
        self.addCleanup(patch_check_exists_file_s3.stop)
        self.addCleanup(patch_describe_security_groups.stop)
        self.addCleanup(patch_upload_s3.stop)
        self.addCleanup(patch_describe_instances.stop)

        with patch.object(
                PmLogAdapter, 'error', return_value=None) as error_method:
            with self.assertRaises(Exception):
                # call Function test
                cis_item_4_logic.check_cis_item_4_03(
                    trace_id, check_history_id, organization_id, project_id,
                    aws_account, session, result_json_path, check_item_code,
                    excluded_resources)

        # check param method error
        error_method.assert_any_call("[%s/%s] チェック処理中にエラーが発生しました。",
                                     aws_account,
                                     copy.deepcopy(DataTestEC2.REGION_NAME))
