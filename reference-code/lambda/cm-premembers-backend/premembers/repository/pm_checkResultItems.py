import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository.const import CheckResult
from premembers.repository import DB_utils
from boto3.dynamodb.conditions import Attr

CHECK_HISTORY_INDEX = "CheckHistoryIndex"


def create(trace_id, check_result_item_id, check_history_id, check_result_id,
           check_item_code, organization_id, organization_name, project_id,
           project_name, aws_account_coop_id, aws_account, sort_code,
           check_result, result_json_path, result_csv_path, executed_date_time,
           time_to_live, aws_account_name, assessment_flag,
           exclusion_flag):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    # 不要なクラムを作成することを避けるため
    date_now = common_utils.get_current_date()
    data_create = {
        'CheckResultItemID': check_result_item_id,
        'CheckHistoryID': check_history_id,
        'CheckResultID': check_result_id,
        'CheckItemCode': check_item_code,
        'OrganizationID': organization_id,
        'OrganizationName': organization_name,
        'ProjectID': project_id,
        'ProjectName': project_name,
        'AWSAccountCoopID': aws_account_coop_id,
        'AWSAccount': aws_account,
        'SortCode': sort_code,
        'CheckResult': check_result,
        'ResultJsonPath': result_json_path,
        'ResultCsvPath': result_csv_path,
        'ExecutedDateTime': executed_date_time,
        'TimeToLive': time_to_live,
        'AssessmentFlag': assessment_flag,
        'ExclusionFlag': exclusion_flag,
        'CreatedAt': date_now,
        'UpdatedAt': date_now,
        "AWSAccountName": aws_account_name
    }
    condition_expression = Attr("CheckResultItemID").not_exists()
    DB_utils.create(trace_id, Tables.PM_CHECK_RESULT_ITEMS, data_create,
                    condition_expression)


def query_key(trace_id, check_result_item_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key = {"CheckResultItemID": check_result_item_id}
    result = DB_utils.query_key(trace_id, Tables.PM_CHECK_RESULT_ITEMS, key)
    return common_utils.response(result, pm_logger)


def update(trace_id, check_result_item_id, update_attribute):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"CheckResultItemID": check_result_item_id}
    DB_utils.update(trace_id, Tables.PM_CHECK_RESULT_ITEMS, key,
                    update_attribute)


def get_security_check_detail(trace_id, check_history_id, group_filter=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    if common_utils.is_null(group_filter) is True:
        filter = Attr('CheckResult').gte(1)
    else:
        filter = Attr('CheckResult').gte(1).__and__(
            Attr('CheckItemCode').begins_with(group_filter))
    results = query_check_history_index(trace_id,
                                        check_history_id,
                                        filter_expression=filter)
    return common_utils.response(results, pm_logger)


def query_check_history_index_fiter_ne_exclusion_flag(trace_id,
                                                      check_history_id,
                                                      exclusion_flag,
                                                      is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    filter = Attr('ExclusionFlag').ne(exclusion_flag)
    result = query_check_history_index(trace_id,
                                       check_history_id,
                                       filter_expression=filter,
                                       is_cw_logger=is_cw_logger)
    return common_utils.response(result, logger)


def query_check_history_index(trace_id,
                              check_history_id,
                              sort_code=None,
                              filter_expression=None,
                              is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    key_conditions = {
        'CheckHistoryID': {
            'AttributeValueList': [check_history_id],
            'ComparisonOperator': 'EQ'
        }
    }
    if sort_code is not None:
        key_conditions['SortCode'] = {
            'AttributeValueList': [sort_code],
            'ComparisonOperator': 'EQ'
        }
    result = DB_utils.query_index(trace_id,
                                  Tables.PM_CHECK_RESULT_ITEMS,
                                  CHECK_HISTORY_INDEX,
                                  key_conditions,
                                  filter_expression,
                                  is_cw_logger=is_cw_logger)
    return common_utils.response(result, logger)


def get_security_check_detail_by_check_result_and_check_item_code(
        trace_id, check_history_id, check_item_code, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    filter = Attr('CheckResult').gte(
        CheckResult.MinorInadequacies) & Attr('CheckItemCode').eq(
            str(check_item_code)) & Attr('CheckResult').ne(
                CheckResult.Error) & Attr('AWSAccount').eq(aws_account)

    results = query_check_history_index(
        trace_id, check_history_id, filter_expression=filter)
    return common_utils.response(results, pm_logger)


def delete(trace_id, check_result_item_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"CheckResultItemID": check_result_item_id}
    DB_utils.delete(trace_id, Tables.PM_CHECK_RESULT_ITEMS, key)


def query_by_check_history_id_and_check_item_code_and_aws_account(
        trace_id, check_history_id, check_item_code, aws_account,
        is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    filter = Attr('CheckItemCode').eq(check_item_code) & Attr('AWSAccount').eq(
        aws_account)
    results = query_check_history_index(trace_id,
                                        check_history_id,
                                        filter_expression=filter)
    return common_utils.response(results, logger)
