import copy

from moto import mock_dynamodb2
from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from tests.mock.aws.dynamodb import db_utils
from decimal import Decimal
from datetime import timedelta
from premembers.common import date_utils, common_utils
from premembers.repository.table_list import Tables
from premembers.exception.pm_exceptions import PmError
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from premembers.check.logic import awsResourceChecker_logic
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources
from tests.mock.aws.dynamodb import pm_exclusionResources as mock_pm_exclusionResources

data_pm_exclusion_resources = copy.deepcopy(DataPmExclusionResources.DATA_SIMPLE)
time_to_live_date = date_utils.get_current_date() + timedelta(days=180)

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(3))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(3))
organization_name = 'organization_name'
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(3))
project_name = 'project_name'
coop_id = copy.deepcopy(DataCommon.COOP_ID.format(3))
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(3))
check_result_id = copy.deepcopy(DataCommon.CHECK_RESULT_ID.format(3))
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
executed_date_time = common_utils.get_current_date()
time_to_live = Decimal(time_to_live_date.timestamp())
session = 'mock_session'
aws_account_name = 'aws_account_name'
members = 'members'

LIST_CIS_CHECK_ITEM_CODE = [
    'CHECK_CIS12_ITEM_1_02', 'CHECK_CIS12_ITEM_1_03', 'CHECK_CIS12_ITEM_1_04',
    'CHECK_CIS12_ITEM_1_16', 'CHECK_CIS12_ITEM_1_19', 'CHECK_CIS12_ITEM_1_21',
    'CHECK_CIS12_ITEM_1_22', 'CHECK_CIS12_ITEM_2_02', 'CHECK_CIS12_ITEM_2_03',
    'CHECK_CIS12_ITEM_2_04', 'CHECK_CIS12_ITEM_2_06', 'CHECK_CIS12_ITEM_2_07',
    'CHECK_CIS12_ITEM_2_08', 'CHECK_CIS12_ITEM_2_09', 'CHECK_CIS12_ITEM_4_01',
    'CHECK_CIS12_ITEM_4_02', 'CHECK_CIS12_ITEM_4_03'
]
LIST_ASC_CHECK_ITEM_CODE = []
LIST_IBP_CHECK_ITEM_CODE = []

LIST_PATCH_MATCHING = [
    {
        'check_code_item': 'CHECK_CIS12_ITEM_1_02',
        'patch': 'premembers.check.logic.cis.cis_item_1_logic.check_cis_item_1_02'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_1_03',
        'patch': 'premembers.check.logic.cis.cis_item_1_logic.check_cis_item_1_03'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_1_04',
        'patch': 'premembers.check.logic.cis.cis_item_1_logic.check_cis_item_1_04'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_1_16',
        'patch': 'premembers.check.logic.cis.cis_item_1_logic.check_cis_item_1_16'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_1_19',
        'patch': 'premembers.check.logic.cis.cis_item_1_logic.check_cis_item_1_19'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_1_21',
        'patch': 'premembers.check.logic.cis.cis_item_1_logic.check_cis_item_1_21'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_1_22',
        'patch': 'premembers.check.logic.cis.cis_item_1_logic.check_cis_item_1_22'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_2_02',
        'patch': 'premembers.check.logic.cis.cis_item_2_logic.check_cis_item_2_02'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_2_03',
        'patch': 'premembers.check.logic.cis.cis_item_2_logic.check_cis_item_2_03'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_2_04',
        'patch': 'premembers.check.logic.cis.cis_item_2_logic.check_cis_item_2_04'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_2_06',
        'patch': 'premembers.check.logic.cis.cis_item_2_logic.check_cis_item_2_06'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_2_07',
        'patch': 'premembers.check.logic.cis.cis_item_2_logic.check_cis_item_2_07'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_2_08',
        'patch': 'premembers.check.logic.cis.cis_item_2_logic.check_cis_item_2_08'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_2_09',
        'patch': 'premembers.check.logic.cis.cis_item_2_logic.check_cis_item_2_09'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_4_01',
        'patch': 'premembers.check.logic.cis.cis_item_4_logic.check_cis_item_4_01'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_4_02',
        'patch': 'premembers.check.logic.cis.cis_item_4_logic.check_cis_item_4_02'
    },
    {
        'check_code_item': 'CHECK_CIS12_ITEM_4_03',
        'patch': 'premembers.check.logic.cis.cis_item_4_logic.check_cis_item_4_03'
    }
]


@mock_dynamodb2
class TestDoExecuteCheck(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_EXCLUSION_RESOURCES):
            db_utils.delete_table(Tables.PM_EXCLUSION_RESOURCES)

        # create pm_exclusionResources table
        mock_pm_exclusionResources.create_table()

    @patch('premembers.check.logic.awsResourceChecker_logic.LIST_CIS_CHECK_ITEM_CODE', LIST_CIS_CHECK_ITEM_CODE)
    @patch('premembers.check.logic.awsResourceChecker_logic.LIST_ASC_CHECK_ITEM_CODE', LIST_ASC_CHECK_ITEM_CODE)
    @patch('premembers.check.logic.awsResourceChecker_logic.LIST_IBP_CHECK_ITEM_CODE', LIST_IBP_CHECK_ITEM_CODE)
    def test_do_execute_check_case_get_record_pm_exclusion_resources_success(self):
        # create record query
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)

        # patch mock
        do_execute_cis_check_patch = patch('premembers.check.logic.awsResourceChecker_logic.do_execute_cis_check')

        # start mock object
        mock_do_execute_cis_check = do_execute_cis_check_patch.start()

        # mock data
        mock_do_execute_cis_check.side_effect = None

        # addCleanup stop mock object
        self.addCleanup(do_execute_cis_check_patch.stop)

        # call function test
        awsResourceChecker_logic.do_execute_check(
            trace_id, organization_id, organization_name, project_id,
            project_name, coop_id, check_history_id, check_result_id,
            aws_account, executed_date_time, time_to_live, session,
            aws_account_name, members)

        # check param call function do_execute_cis_check
        for cis_check_item_code in LIST_CIS_CHECK_ITEM_CODE:
            mock_do_execute_cis_check.assert_any_call(
                trace_id, cis_check_item_code, organization_id,
                organization_name, project_id, project_name, coop_id,
                check_history_id, check_result_id, aws_account, executed_date_time,
                time_to_live, session, aws_account_name, members,
                [data_pm_exclusion_resources])

        # check call count function do_execute_cis_check
        actual_call = mock_do_execute_cis_check.call_count
        self.assertEqual(len(LIST_CIS_CHECK_ITEM_CODE), actual_call)

    @patch('premembers.check.logic.awsResourceChecker_logic.LIST_CIS_CHECK_ITEM_CODE', LIST_CIS_CHECK_ITEM_CODE)
    @patch('premembers.check.logic.awsResourceChecker_logic.LIST_ASC_CHECK_ITEM_CODE', LIST_ASC_CHECK_ITEM_CODE)
    @patch('premembers.check.logic.awsResourceChecker_logic.LIST_IBP_CHECK_ITEM_CODE', LIST_IBP_CHECK_ITEM_CODE)
    def test_do_execute_check_case_check_call_check_cis(self):
        # create record query
        mock_pm_exclusionResources.create(data_pm_exclusion_resources)
        list_mock_logic_check = []

        # create mock for logic check item
        for config in LIST_PATCH_MATCHING:
            # patch mock
            patch_check = patch(config['patch'])

            # start mock object
            mock_check = patch_check.start()

            # mock data
            mock_check.side_effect = None

            # addCleanup stop mock object
            self.addCleanup(patch_check.stop)

            config_mock_logic_check = {
                "check_code_item": config['check_code_item'],
                "mock": mock_check
            }

            list_mock_logic_check.append(config_mock_logic_check)

        # patch mock
        get_exclusion_item_patch = patch('premembers.check.logic.awsResourceChecker_logic.get_exclusion_item')
        update_check_results_json_patch = patch('premembers.check.logic.awsResourceChecker_logic.update_check_results_json')
        create_pm_check_result_items_patch = patch('premembers.repository.pm_checkResultItems.create')

        # start mock object
        mock_get_exclusion_item = get_exclusion_item_patch.start()
        mock_update_check_results_json = update_check_results_json_patch.start()
        mock_create_pm_check_result_items = create_pm_check_result_items_patch.start()

        # mock data
        mock_get_exclusion_item.side_effect = None
        mock_update_check_results_json.side_effect = None
        mock_create_pm_check_result_items.side_effect = None

        # addCleanup stop mock object
        self.addCleanup(get_exclusion_item_patch.stop)
        self.addCleanup(update_check_results_json_patch.stop)
        self.addCleanup(create_pm_check_result_items_patch.stop)

        # call function test
        awsResourceChecker_logic.do_execute_check(
            trace_id, organization_id, organization_name, project_id,
            project_name, coop_id, check_history_id, check_result_id,
            aws_account, executed_date_time, time_to_live, session,
            aws_account_name, members)

        PATH_CHECK_RESULT = "{0}/{1}/{2}/{3}/check_result/{4}"

        for mock_logic_check in list_mock_logic_check:
            check_code_item_name = mock_logic_check['check_code_item']
            mock = mock_logic_check['mock']
            # check param call function logic check item
            result_json_path = PATH_CHECK_RESULT.format(
                check_history_id, organization_id, project_id, aws_account,
                check_code_item_name + ".json")
            mock.assert_any_call(trace_id, check_history_id, organization_id,
                                 project_id, aws_account, session,
                                 result_json_path, check_code_item_name,
                                 [data_pm_exclusion_resources])

    def test_do_execute_check_case_get_record_pm_exclusion_resources_error(self):
        # patch mock
        query_account_refine_index_patch = patch('premembers.repository.pm_exclusionResources.query_account_refine_index')

        # start mock object
        mock_query_account_refine_index = query_account_refine_index_patch.start()

        # mock data
        mock_query_account_refine_index.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(query_account_refine_index_patch.stop)

        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            with self.assertRaises(PmError):
                # call function test
                awsResourceChecker_logic.do_execute_check(
                    trace_id, organization_id, organization_name, project_id,
                    project_name, coop_id, check_history_id, check_result_id,
                    aws_account, executed_date_time, time_to_live, session,
                    aws_account_name, members)

        # check write log error
        mock_method_error.assert_any_call("[%s] チェック処理中にエラーが発生しました。",
                                          aws_account)
