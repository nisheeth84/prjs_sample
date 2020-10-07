import copy

from tests.testcasebase import TestCaseBase
from tests.mock.aws.dynamodb import db_utils
from moto import mock_dynamodb2
from tests.mock.aws.dynamodb import pm_checkResultItems as mock_pm_checkResultItems
from tests.mock.data.aws.dynamodb.data_pm_check_result_items import DataPmCheckResultItems
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from premembers.repository import pm_checkResultItems
from premembers.repository.table_list import Tables
from boto3.dynamodb.conditions import Attr

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
data_pm_checkResultItems = copy.deepcopy(DataPmCheckResultItems.DATA_SIMPLE)
check_history_id = data_pm_checkResultItems['CheckHistoryID']
sort_code = data_pm_checkResultItems['SortCode']
check_item_code = data_pm_checkResultItems['CheckItemCode']
aws_account = data_pm_checkResultItems['AWSAccount']


@mock_dynamodb2
class TestPmCheckResultItems(TestCaseBase):
    def setUp(self):
        # parent setUp()
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_CHECK_RESULT_ITEMS):
            db_utils.delete_table(Tables.PM_CHECK_RESULT_ITEMS)

        # create pm_checkResultItems table
        mock_pm_checkResultItems.create_table()

    def test_query_check_history_index_case_not_param_sort_code(self):
        # prepare data
        mock_pm_checkResultItems.create(data_pm_checkResultItems)

        # call function test
        filter = Attr('CheckResult').gte(1)
        actual_result = pm_checkResultItems.query_check_history_index(
            trace_id, check_history_id, filter_expression=filter)

        self.assertDictEqual(data_pm_checkResultItems, actual_result[0])

    def test_query_check_history_index_case_contain_param_sort_code(self):
        # prepare data
        mock_pm_checkResultItems.create(data_pm_checkResultItems)

        # call function test
        filter = Attr('CheckResult').gte(1)
        actual_result = pm_checkResultItems.query_check_history_index(
            trace_id, check_history_id, sort_code, filter_expression=filter)

        self.assertDictEqual(data_pm_checkResultItems, actual_result[0])

    def test_get_security_check_detail_by_check_result_and_check_item_code(self):
        # prepare data
        mock_pm_checkResultItems.create(data_pm_checkResultItems)

        # call function test
        actual_result = pm_checkResultItems.get_security_check_detail_by_check_result_and_check_item_code(
            trace_id, check_history_id, check_item_code, aws_account)

        self.assertDictEqual(data_pm_checkResultItems, actual_result[0])
