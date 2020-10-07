import copy

from unittest.mock import patch
from moto import mock_dynamodb2, mock_sts, mock_kms
from tests.testcasebase import TestCaseBase
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.data_common import DataCommon as DataCommonAws
from tests.mock.data.aws.ec2.data_test_ec2 import DataTestEC2
from tests.mock.data.aws.kms.data_test_kms import DataTestKMS
from tests.mock.data.aws.cloudtrail.data_test_cloud_trail import DataTestCloudTrail
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources
from tests.mock.aws.dynamodb import pm_exclusionResources as mock_pm_exclusionResources
from premembers.const.const import CommonConst
from tests.mock.aws.dynamodb import db_utils
from premembers.repository.table_list import Tables
from tests.mock.aws.sts import sts_utils
from tests.mock.aws.kms import kms_utils
from premembers.check.logic.cis import cis_item_2_logic

data_pm_exclusion_resources = copy.deepcopy(
    DataPmExclusionResources.DATA_SIMPLE)

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
list_key_kms = copy.deepcopy(DataTestKMS.LIST_KEY_KMS)
list_aliases = copy.deepcopy(DataTestKMS.LIST_ALIASES)
key_rotation_status = copy.deepcopy(DataTestKMS.KEY_ROTATION_STATUS)
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
check_item_code = "CHECK_CIS12_ITEM_2_08"
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
regions = copy.deepcopy(DataTestEC2.LIST_REGIONS)
cloud_trails = copy.deepcopy(DataTestCloudTrail.LIST_CLOUD_TRAILS)
region_name = copy.deepcopy(DataCommonAws.REGION_EU_NORTH_1)
resource_type = copy.deepcopy(DataPmExclusionResources.RESOURCE_TYPE_KEY_ID)
resource_name_test = copy.deepcopy(DataPmExclusionResources.KEY_ID)
account_refine_code = "{0}_{1}_{2}".format(organization_id, project_id,
                                           aws_account)
check_item_refine_code = "{0}_{1}_{2}_{3}".format(organization_id, project_id,
                                                  aws_account, check_item_code)

result_json_path = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")

session = None
excluded_resources = None
kms_client_connect = None


@mock_kms
@mock_dynamodb2
@mock_sts
class TestCheckCisItem208(TestCaseBase):
    def setUp(self):
        super().setUp()

        global session
        global excluded_resources
        global kms_client_connect
        if not session:
            session = sts_utils.create_session()

        if not kms_client_connect:
            kms_client_connect = kms_utils.client_connect()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_EXCLUSION_RESOURCES):
            db_utils.delete_table(Tables.PM_EXCLUSION_RESOURCES)

        # create pm_exclusionResources table
        mock_pm_exclusionResources.create_table()

        # create record query
        # create resource for check code item 2.08
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

    def test_check_cis_item_2_08_case_success(self):
        expected_check_results = [
            {
                'DetectionItem': {
                    'AbnormalityKeys': {
                        'KeyId': 'a0957320-ce1a-4cdf-bf6c-78e5e22f5327'
                    }
                },
                'Level': '11',
                'Region': 'eu-north-1'
            }
        ]

        # mock object
        patch_get_regions = patch("premembers.common.aws_common.get_regions")
        patch_get_cloud_trails = patch(
            "premembers.check.logic.cis.cis_item_common_logic.get_cloud_trails")
        patch_get_kms_client = patch("premembers.common.KMSUtils.get_kms_client")
        patch_get_list_key_kms = patch("premembers.common.KMSUtils.get_list_key_kms")
        patch_list_aliases = patch("premembers.common.KMSUtils.list_aliases")
        patch_get_key_rotation_status = patch("premembers.common.KMSUtils.get_key_rotation_status")
        patch_upload_json = patch("premembers.common.FileUtils.upload_json")
        patch_check_key = patch("premembers.common.common_utils.check_key")
        patch_upload_s3 = patch("premembers.common.FileUtils.upload_s3")

        # start mock object
        mock_get_regions = patch_get_regions.start()
        mock_get_cloud_trails = patch_get_cloud_trails.start()
        mock_get_kms_client = patch_get_kms_client.start()
        mock_get_list_key_kms = patch_get_list_key_kms.start()
        mock_list_aliases = patch_list_aliases.start()
        mock_get_key_rotation_status = patch_get_key_rotation_status.start()
        mock_upload_json = patch_upload_json.start()
        mock_check_key = patch_check_key.start()
        mock_upload_s3 = patch_upload_s3.start()

        # mock data
        mock_get_regions.return_value = regions
        mock_get_cloud_trails.return_value = cloud_trails
        mock_get_kms_client.return_value = kms_client_connect
        mock_get_list_key_kms.return_value = list_key_kms
        mock_list_aliases.return_value = list_aliases
        mock_get_key_rotation_status.return_value = key_rotation_status
        mock_upload_json.return_value = None
        mock_check_key.return_value = False
        mock_upload_s3.return_value = None

        # addCleanup stop mock object
        self.addCleanup(patch_get_regions.stop)
        self.addCleanup(mock_get_cloud_trails.stop)
        self.addCleanup(patch_get_kms_client.stop)
        self.addCleanup(patch_get_list_key_kms.stop)
        self.addCleanup(patch_list_aliases.stop)
        self.addCleanup(patch_get_key_rotation_status.stop)
        self.addCleanup(patch_upload_json.stop)
        self.addCleanup(patch_check_key.stop)
        self.addCleanup(patch_upload_s3.stop)

        # call Function test
        actual_result_check = cis_item_2_logic.check_cis_item_2_08(
            trace_id, check_history_id, organization_id, project_id,
            aws_account, session, result_json_path, check_item_code,
            excluded_resources)

        actual_param_call_upload_s3 = mock_upload_s3.call_args[0][1]

        actual_aws_account = actual_param_call_upload_s3['AWSAccount']
        actual_check_results = actual_param_call_upload_s3['CheckResults']

        # assert output function
        self.assertEqual(aws_account, actual_aws_account)
        self.assertEqual(expected_check_results, actual_check_results)
        self.assertEqual(1, actual_result_check)
