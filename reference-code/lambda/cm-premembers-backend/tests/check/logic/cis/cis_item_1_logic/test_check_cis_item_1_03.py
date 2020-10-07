import copy

from unittest.mock import patch
from moto import mock_dynamodb2, mock_sts
from tests.testcasebase import TestCaseBase
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.data_common import DataCommon as AwsDataCommon
from tests.mock.aws.dynamodb import pm_exclusionResources as mock_pm_exclusionResources
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources
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
excluded_resources = None
check_item_code = "CHECK_CIS12_ITEM_1_03"
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


@mock_dynamodb2
@mock_sts
class TestCheckCisItem103(TestCaseBase):
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
        # create resource for check code item 1.03
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

    def test_check_cis_item_1_03_exclusion_resource_success(self):
        # mock object
        patch_get_credential_report = patch("premembers.check.logic.cis.cis_item_1_logic.get_credential_report")
        patch_upload_json = patch("premembers.common.FileUtils.upload_json")

        # start mock object
        mock_get_credential_report = patch_get_credential_report.start()
        mock_upload_json = patch_upload_json.start()

        # mock data
        mock_get_credential_report.return_value = "user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated\n<root_account>,arn:aws:iam::964503621683:root,2018-06-01T06:55:24+00:00,not_supported,2018-07-09T00:48:51+00:00,not_supported,not_supported,true,true,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,true,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,false,2018-09-13T02:49:13+00:00,false,2018-09-13T02:49:13+00:00\nCISv12-1_03,arn:aws:iam::964503621683:user/CISv12-1_03,2019-03-06T09:35:15+00:00,true,2019-03-07T06:39:12+00:00,2019-03-07T06:38:57+00:00,2019-06-05T06:38:57+00:00,true,true,2019-03-06T09:49:42+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,true,2019-03-06T10:10:38+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,false,2018-09-13T02:49:13+00:00,false,2018-09-13T02:49:13+00:00\nCISv12-ManualAssessment,arn:aws:iam::964503621683:user/CISv12-ManualAssessment,2019-03-18T02:40:41+00:00,true,2019-03-18T05:37:50+00:00,2019-03-18T02:40:42+00:00,2019-06-16T02:40:42+00:00,false,true,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,true,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,false,2018-09-13T02:49:13+00:00,false,2018-09-13T02:49:13+00:00\nserverless-user,arn:aws:iam::964503621683:user/serverless-user,2018-09-13T02:49:13+00:00,false,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,false,true,2018-09-13T02:49:33+00:00,2018-09-13T02:49:13+00:00,ap-northeast-1,s3,true,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,2018-09-13T02:49:13+00:00,false,2018-09-13T02:49:13+00:00,false,2018-09-13T02:49:13+00:00"
        mock_upload_json.return_value = None

        # addClear mock object
        self.addCleanup(patch_get_credential_report.stop)
        self.addCleanup(patch_upload_json.stop)

        expect_result_check = [{
            'DetectionItem': {
                'AcceseKeyAbnormity': True,
                'PasswordLastUsedAbnormity': True,
                'User': 'CISv12-1_03'
            },
            'Level': '21',
            'Region': 'Global'
        }, {
            'DetectionItem': {
                'AcceseKeyAbnormity': True,
                'PasswordLastUsedAbnormity': True,
                'User': 'CISv12-ManualAssessment'
            },
            'Level': '21',
            'Region': 'Global'
        }, {
            'DetectionItem': {
                'AcceseKeyAbnormity': True,
                'User': 'serverless-user'
            },
            'Level': '21',
            'Region': 'Global'
        }]

        # call Function test
        actual_response = cis_item_1_logic.check_cis_item_1_03(
            trace_id, check_history_id, organization_id, project_id,
            aws_account, session, result_json_path, check_item_code,
            excluded_resources)

        actual_params_call_upload_json = mock_upload_json.call_args[0]
        actual_abnormality_users_result_check = actual_params_call_upload_json[2]
        actual_aws_account = actual_abnormality_users_result_check['AWSAccount']
        actual_result_check = actual_abnormality_users_result_check['CheckResults']

        # assert output function
        self.assertEqual(trace_id, actual_params_call_upload_json[0])
        self.assertEqual("S3_CHECK_BUCKET", actual_params_call_upload_json[1])
        self.assertEqual(actual_aws_account, aws_account)
        self.assertEqual(actual_result_check, expect_result_check)
        self.assertEqual(result_json_path, actual_params_call_upload_json[3])
        self.assertEqual(2, actual_response)

    def test_check_cis_item_1_03_exclusion_resource_error_check_resource(self):
        # mock object
        patch_get_credential_report = patch("premembers.check.logic.cis.cis_item_1_logic.get_credential_report")
        patch_upload_json = patch("premembers.common.FileUtils.upload_json")

        # start mock object
        mock_get_credential_report = patch_get_credential_report.start()
        mock_upload_json = patch_upload_json.start()

        # mock data resource user iam not exists
        mock_get_credential_report.return_value = "arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_1_last_used_date,access_key_1_last_used_region,access_key_1_last_used_service,access_key_2_active,access_key_2_last_rotated,access_key_2_last_used_date,access_key_2_last_used_region,access_key_2_last_used_service,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated\n2018-06-01T06:55:24+00:00,not_supported,2018-07-09T00:48:51+00:00,not_supported,not_supported,true,true,N/A,N/A,N/A,N/A,true,N/A,N/A,N/A,N/A,false,N/A,false,N/A\narn:aws:iam::964503621683:user/CISv12-1_02,2019-03-06T09:35:15+00:00,true,2019-03-07T06:39:12+00:00,2019-03-07T06:38:57+00:00,2019-06-05T06:38:57+00:00,true,true,2019-03-06T09:49:42+00:00,N/A,N/A,N/A,true,2019-03-06T10:10:38+00:00,N/A,N/A,N/A,false,N/A,false,N/A\narn:aws:iam::964503621683:user/CISv12-ManualAssessment,2019-03-18T02:40:41+00:00,true,2019-03-18T05:37:50+00:00,2019-03-18T02:40:42+00:00,2019-06-16T02:40:42+00:00,false,true,N/A,N/A,N/A,N/A,true,N/A,N/A,N/A,N/A,false,N/A,false,N/A\narn:aws:iam::964503621683:user/serverless-user,2018-09-13T02:49:13+00:00,false,N/A,N/A,N/A,false,true,2018-09-13T02:49:33+00:00,N/A,ap-northeast-1,s3,true,N/A,N/A,N/A,N/A,false,N/A,false,N/A"
        mock_upload_json.side_effect = None

        # addClear mock object
        self.addCleanup(patch_get_credential_report.stop)
        self.addCleanup(patch_upload_json.stop)

        # call Function test
        with patch.object(
                PmLogAdapter, 'error', return_value=None) as error_method:
            with self.assertRaises(Exception):
                cis_item_1_logic.check_cis_item_1_03(
                    trace_id, check_history_id, organization_id, project_id,
                    aws_account, session, result_json_path, check_item_code,
                    excluded_resources)

        # assert output function
        error_method.assert_any_call("[%s] チェック処理中にエラーが発生しました。", aws_account)
