import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from boto3.dynamodb.conditions import Attr


CHECK_HISTORY_INDEX = 'CheckHistoryIndex'

RESPONSE_CHECK_RESULTS = {
    "CheckResultID": "checkResultId",
    "OrganizationID": "organizationId",
    "OrganizationName": "organizationName",
    "ProjectID": "projectId",
    "ProjectName": "projectName",
    "AWSAccountCoopID": "awsAccountCoopId",
    "AWSAccount": "awsAccount",
    "OKCount": "okCount",
    "NGCount": "ngCount",
    "ManagedCount": "managedCount",
    "ErrorCount": "errorCount",
    "CriticalCount": "criticalCount",
    "ExecutedDateTime": "executedDateTime",
    "CreatedAt": "createdAt",
    "UpdatedAt": "updatedAt",
    "AWSAccountName": "awsAccountName"
}


RESPONSE_REQUIRED = {"managedCount": 0, "errorCount": 0}


def create(trace_id,
           check_result_id,
           check_history_id,
           check_rule_code,
           organization_id,
           organization_name,
           project_id,
           project_name,
           aws_account_coop_id,
           aws_account,
           sort_code,
           ok_count,
           critical_count,
           ng_count,
           executed_date_time,
           time_to_live,
           aws_account_name,
           is_cw_logger=False):
    if (is_cw_logger):
        common_utils.begin_cw_logger(trace_id, __name__,
                                     inspect.currentframe())
    else:
        common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    # 不要なクラムを作成することを避けるため
    date_now = common_utils.get_current_date()
    data_create = {
        'CheckResultID': check_result_id,
        'CheckHistoryID': check_history_id,
        'CheckRuleCode': check_rule_code,
        'OrganizationID': organization_id,
        'OrganizationName': organization_name,
        'ProjectID': project_id,
        'ProjectName': project_name,
        'AWSAccountCoopID': aws_account_coop_id,
        'AWSAccount': aws_account,
        'SortCode': sort_code,
        'OKCount': ok_count,
        'CriticalCount': critical_count,
        'NGCount': ng_count,
        'ExecutedDateTime': executed_date_time,
        'TimeToLive': time_to_live,
        'CreatedAt': date_now,
        'UpdatedAt': date_now,
        'AWSAccountName': aws_account_name
    }
    condition_expression = Attr("CheckResultID").not_exists()
    DB_utils.create(trace_id,
                    Tables.PM_CHECK_RESULTS,
                    data_create,
                    condition_expression,
                    is_cw_logger=is_cw_logger)


def query_key(trace_id, check_result_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key = {"CheckResultID": check_result_id}
    result = DB_utils.query_key(trace_id, Tables.PM_CHECK_RESULTS, key)
    return common_utils.response(result, pm_logger)


def update(trace_id, check_result_id, update_attribute, is_cw_logger=False):
    if (is_cw_logger):
        common_utils.begin_cw_logger(trace_id, __name__,
                                     inspect.currentframe())
    else:
        common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"CheckResultID": check_result_id}
    DB_utils.update(trace_id,
                    Tables.PM_CHECK_RESULTS,
                    key,
                    update_attribute,
                    is_cw_logger=is_cw_logger)


def query_history_index(trace_id,
                        check_history_id,
                        filter_expression=None,
                        convert_response=None,
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
    result = DB_utils.query_index(trace_id,
                                  Tables.PM_CHECK_RESULTS,
                                  CHECK_HISTORY_INDEX,
                                  key_conditions,
                                  filter_expression,
                                  is_cw_logger=is_cw_logger)
    if result and convert_response:
        result = common_utils.convert_list_response(trace_id,
                                                    result,
                                                    RESPONSE_CHECK_RESULTS,
                                                    RESPONSE_REQUIRED,
                                                    is_cw_logger=is_cw_logger)
    return common_utils.response(result, logger)


def delete(trace_id, check_result_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"CheckResultID": check_result_id}
    DB_utils.delete(trace_id, Tables.PM_CHECK_RESULTS, key)


def query_history_index_by_awsaccount(trace_id,
                                      aws_account,
                                      check_history_id,
                                      convert_response=None):
    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    filter = None
    if aws_account is not None:
        filter = Attr('AWSAccount').eq(aws_account)
    reponse = query_history_index(
        trace_id, check_history_id, filter, convert_response)
    return common_utils.response(reponse, pm_logger)
