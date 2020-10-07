import copy

from unittest.mock import patch
from moto import mock_dynamodb2, mock_sts, mock_s3
from tests.testcasebase import TestCaseBase
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.data_common import DataCommon as AwsDataCommon
from tests.mock.data.aws.ec2.data_test_ec2 import DataTestEC2
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources
from tests.mock.aws.dynamodb import pm_exclusionResources as mock_pm_exclusionResources
from tests.mock.aws.sts import sts_utils
from premembers.const.const import CommonConst
from tests.mock.aws.ec2 import ec2_utils
from tests.mock.aws.dynamodb import db_utils
from premembers.repository.table_list import Tables
from premembers.check.logic.cis import cis_item_2_logic

data_pm_exclusion_resources = copy.deepcopy(
    DataPmExclusionResources.DATA_SIMPLE)
trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
aws_account = copy.deepcopy(AwsDataCommon.AWS_ACCOUNT)
session = None
excluded_resources = None
check_item_code = "CHECK_CIS12_ITEM_2_09"
result_json_path = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
region = DataTestEC2.REGION_NAME
resource_type = "VpcId"

resource_name_test = "is_excluded_resources"
account_refine_code = "{0}_{1}_{2}".format(organization_id, project_id, aws_account)
check_item_refine_code = "{0}_{1}_{2}_{3}".format(organization_id, project_id, aws_account, check_item_code)
regions = copy.deepcopy(DataTestEC2.LIST_REGIONS)
describe_vpcs = DataTestEC2.DESCRIBE_VPCS
describe_flow_logs = DataTestEC2.DESCRIBE_FLOW_LOGS

session = None
ec2_client_connect = None


@mock_dynamodb2
@mock_sts
@mock_s3
class TestCheckCisItem209(TestCaseBase):
    def setUp(self):
        super().setUp()
        global session
        global ec2_client_connect
        global excluded_resources

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_EXCLUSION_RESOURCES):
            db_utils.delete_table(Tables.PM_EXCLUSION_RESOURCES)

        # create pm_userAttribute table
        mock_pm_exclusionResources.create_table()

        # create record query
        # create resource for check code item 1.21
        data_pm_exclusion_resources['ExclusionResourceID'] = "aa4fee9c-790f-478d-9f5d-7aeef688d541"
        data_pm_exclusion_resources['CheckItemCode'] = check_item_code
        data_pm_exclusion_resources['RegionName'] = region
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

        if not session:
            session = sts_utils.create_session()

        if not ec2_client_connect:
            ec2_client_connect = ec2_utils.client_connect()

    def test_check_cis_item_2_09_case_success(self):
        # mock object
        patch_get_regions = patch("premembers.common.aws_common.get_regions")
        patch_get_ec2_client = patch("premembers.common.Ec2Utils.get_ec2_client")
        patch_describe_vpcs = patch("premembers.common.Ec2Utils.describe_vpcs")
        patch_upload_s3 = patch("premembers.common.FileUtils.upload_s3")
        patch_describe_flow_logs = patch("premembers.common.Ec2Utils.describe_flow_logs")

        # start mock object
        mock_get_regions = patch_get_regions.start()
        mock_get_ec2_client = patch_get_ec2_client.start()
        mock_describe_vpcs = patch_describe_vpcs.start()
        mock_upload_s3 = patch_upload_s3.start()
        mock_describe_flow_logs = patch_describe_flow_logs.start()

        # mock data
        mock_get_regions.return_value = regions
        mock_get_ec2_client.return_value = ec2_client_connect
        mock_describe_vpcs.return_value = describe_vpcs
        mock_upload_s3.side_effect = None
        mock_describe_flow_logs.return_value = describe_flow_logs

        # addCleanup stop mock object
        self.addCleanup(patch_get_regions.stop)
        self.addCleanup(patch_get_ec2_client.stop)
        self.addCleanup(patch_describe_vpcs.stop)
        self.addCleanup(patch_upload_s3.stop)
        self.addCleanup(patch_describe_flow_logs.stop)

        expected_check_results = [
            {
                'Region': DataTestEC2.REGION_NAME,
                'Level': '11',
                'DetectionItem': {
                    'AbnormalityVpc': 'not_excluded_resources'
                }
            }
        ]

        # call Function test
        actual_result_check = cis_item_2_logic.check_cis_item_2_09(
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
