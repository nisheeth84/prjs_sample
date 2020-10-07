import copy

from unittest.mock import patch
from moto import mock_dynamodb2, mock_sts, mock_s3
from tests.testcasebase import TestCaseBase
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.data_common import DataCommon as AwsDataCommon
from tests.mock.aws.dynamodb import pm_exclusionResources as mock_pm_exclusionResources
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources
from tests.mock.data.aws.ec2.data_test_ec2 import DataTestEC2
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
aws_account = copy.deepcopy(AwsDataCommon.AWS_ACCOUNT)
session = None
excluded_resources = None
check_item_code = "CHECK_CIS12_ITEM_4_01"
result_json_path = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
resource_type = copy.deepcopy(DataPmExclusionResources.RESOURCE_TYPE_GROUP_ID)
regions = copy.deepcopy(DataTestEC2.LIST_REGIONS)

resource_name_test = copy.deepcopy(DataTestEC2.ID_GROUP_EXCLUDED_RESOURCES_RESOURCE_NG)
account_refine_code = "{0}_{1}_{2}".format(organization_id, project_id,
                                           aws_account)
check_item_refine_code = "{0}_{1}_{2}_{3}".format(organization_id, project_id,
                                                  aws_account, check_item_code)


@mock_dynamodb2
@mock_sts
@mock_s3
class TestCheckCisItem401(TestCaseBase):
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
        # create resource for check code item 4.01
        data_pm_exclusion_resources['ExclusionResourceID'] = "aa4fee9c-790f-478d-9f5d-7aeef688d541"
        data_pm_exclusion_resources['CheckItemCode'] = check_item_code
        data_pm_exclusion_resources['RegionName'] = copy.deepcopy(DataTestEC2.REGION_NAME)
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

        if session is None:
            session = sts_utils.create_session()

    def test_check_cis_item_4_01_exclusion_resource_success(self):
        # mock object
        patch_get_regions = patch("premembers.common.aws_common.get_regions")
        patch_describe_security_groups = patch("premembers.common.Ec2Utils.describe_security_groups")
        patch_upload_json = patch("premembers.common.FileUtils.upload_json")
        patch_check_exists_file_s3 = patch("premembers.common.aws_common.check_exists_file_s3")

        # start mock object
        mock_get_regions = patch_get_regions.start()
        mock_describe_security_groups = patch_describe_security_groups.start()
        mock_upload_json = patch_upload_json.start()
        mock_check_exists_file_s3 = patch_check_exists_file_s3.start()

        # mock data
        mock_get_regions.return_value = regions
        mock_describe_security_groups.return_value = copy.deepcopy(DataTestEC2.SECURITY_GROUPS)
        mock_upload_json.return_value = None
        mock_check_exists_file_s3.return_value = None
        except_group_id_result_check = copy.deepcopy(DataTestEC2.ID_GROUP_NOT_EXCLUDED_RESOURCES)

        # addCleanup stop mock object
        self.addCleanup(patch_get_regions.stop)
        self.addCleanup(patch_describe_security_groups.stop)
        self.addCleanup(patch_upload_json.stop)
        self.addCleanup(patch_check_exists_file_s3.stop)

        # call Function test
        actual_response = cis_item_4_logic.check_cis_item_4_01(
            trace_id, check_history_id, organization_id, project_id,
            aws_account, session, result_json_path, check_item_code,
            excluded_resources)

        actual_params_call_upload_json = mock_upload_json.call_args[0]
        group_id_result_check = actual_params_call_upload_json[2]['CheckResults'][0]['DetectionItem']['GroupId']

        self.assertEqual(trace_id, actual_params_call_upload_json[0])
        self.assertEqual("S3_CHECK_BUCKET", actual_params_call_upload_json[1])
        self.assertEqual(except_group_id_result_check, group_id_result_check)
        self.assertEqual(result_json_path, actual_params_call_upload_json[3])
        self.assertEqual(2, actual_response)

    def test_check_cis_item_4_01_exclusion_resource_error_check_resource(self):
        # mock object
        patch_get_regions = patch("premembers.common.aws_common.get_regions")
        patch_describe_security_groups = patch("premembers.common.Ec2Utils.describe_security_groups")
        patch_upload_json = patch("premembers.common.FileUtils.upload_json")
        patch_check_exists_file_s3 = patch("premembers.common.aws_common.check_exists_file_s3")

        # start mock object
        mock_get_regions = patch_get_regions.start()
        mock_describe_security_groups = patch_describe_security_groups.start()
        mock_upload_json = patch_upload_json.start()
        mock_check_exists_file_s3 = patch_check_exists_file_s3.start()

        # mock data
        mock_get_regions.return_value = regions
        mock_upload_json.return_value = None
        mock_check_exists_file_s3.return_value = None

        # mock data security_groups with resource name (GroupId) not esxist
        data_security_groups_mock = copy.deepcopy(DataTestEC2.SECURITY_GROUPS)
        del data_security_groups_mock[0]['GroupId']
        mock_describe_security_groups.return_value = data_security_groups_mock

        # addCleanup stop mock object
        self.addCleanup(patch_get_regions.stop)
        self.addCleanup(patch_describe_security_groups.stop)
        self.addCleanup(patch_upload_json.stop)
        self.addCleanup(patch_check_exists_file_s3.stop)

        with patch.object(
                PmLogAdapter, 'error', return_value=None) as error_method:
            with self.assertRaises(Exception):
                # call Function test
                cis_item_4_logic.check_cis_item_4_01(
                    trace_id, check_history_id, organization_id, project_id,
                    aws_account, session, result_json_path, check_item_code,
                    excluded_resources)

        # check param method error
        error_method.assert_any_call("[%s/%s] チェック処理中にエラーが発生しました。",
                                     aws_account,
                                     copy.deepcopy(DataTestEC2.REGION_NAME))
