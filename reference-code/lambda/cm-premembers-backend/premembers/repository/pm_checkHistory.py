import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from boto3.dynamodb.conditions import Attr

PROJECT_INDEX = 'ProjectIndex'

RESPONSE_HISTORY = {
    'CheckHistoryID': 'id',
    'OrganizationID': 'organizationId',
    'ProjectID': 'projectId',
    'CheckCode': 'checkCode',
    'CheckStatus': 'checkStatus',
    'ErrorCode': 'errorCode',
    'ExecutedType': 'executedType',
    'ReportFilePath': 'reportFilePath',
    'ExecutedDateTime': 'executedDateTime',
    'TimeToLive': 'timeToLive',
    'CreatedAt': 'createdAt',
    'UpdatedAt': 'updatedAt'
}


def query_key(trace_id,
              check_history_id,
              convert_response=None,
              is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    key = {"CheckHistoryID": check_history_id}
    result = DB_utils.query_key(trace_id,
                                Tables.PM_CHECK_HISTORY,
                                key,
                                is_cw_logger=is_cw_logger)
    if convert_response:
        result = common_utils.convert_response(trace_id,
                                               result,
                                               RESPONSE_HISTORY,
                                               is_cw_logger=is_cw_logger)
    return common_utils.response(result, logger)


def create(trace_id, check_history_id, organization_id, project_id, check_code,
           check_status, error_code, executed_type, report_file_path,
           executed_date_time, time_to_live, execute_user_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    date_now = common_utils.get_current_date()
    create_check_history = {
        'CheckHistoryID': check_history_id,
        'OrganizationID': organization_id,
        'ProjectID': project_id,
        'CheckCode': check_code,
        'CheckStatus': check_status,
        'ErrorCode': error_code,
        'ExecutedType': executed_type,
        'ReportFilePath': report_file_path,
        'ExecutedDateTime': executed_date_time,
        'ExecuteUserID': execute_user_id,
        'TimeToLive': time_to_live,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    condition_expression = Attr("CheckHistoryID").not_exists()
    DB_utils.create(trace_id, Tables.PM_CHECK_HISTORY, create_check_history,
                    condition_expression)


def delete(trace_id, check_history_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"CheckHistoryID": check_history_id}
    DB_utils.delete(trace_id, Tables.PM_CHECK_HISTORY, key)


def update(trace_id,
           check_history_id,
           update_attribute,
           target_update_date,
           is_cw_logger=False):
    if (is_cw_logger):
        common_utils.begin_cw_logger(trace_id, __name__,
                                     inspect.currentframe())
    else:
        common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"CheckHistoryID": check_history_id}
    DB_utils.update(trace_id,
                    Tables.PM_CHECK_HISTORY,
                    key,
                    update_attribute,
                    target_update_date,
                    is_cw_logger=is_cw_logger)


def get_check_history_by_status(trace_id,
                                check_history_id,
                                check_status,
                                convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'CheckHistoryID': {
            'AttributeValueList': [check_history_id],
            'ComparisonOperator': 'EQ'
        }
    }
    filter = Attr('CheckStatus').eq(check_status)
    result = DB_utils.query(trace_id, Tables.PM_CHECK_HISTORY,
                            key_conditions, filter)
    if convert_response:
        result = common_utils.convert_response(
            trace_id, result, RESPONSE_HISTORY)
    return common_utils.response(result, pm_logger)


def query_project_index_by_organization_id(trace_id,
                                           organization_id,
                                           project_id,
                                           convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'ProjectID': {
            'AttributeValueList': [project_id],
            'ComparisonOperator': 'EQ'
        }
    }
    filter = Attr('OrganizationID').eq(organization_id)
    result = DB_utils.query_index(trace_id, Tables.PM_CHECK_HISTORY,
                                  PROJECT_INDEX, key_conditions, filter, False)
    if convert_response:
        result = common_utils.convert_list_response(
            trace_id, result, RESPONSE_HISTORY)
    return common_utils.response(result, pm_logger)
