import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from boto3.dynamodb.conditions import Attr


def query_organization_id(trace_id, organization_id, filter_expression=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'OrganizationID': {
            'AttributeValueList': [organization_id],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query(trace_id, Tables.PM_LATEST_CHECK_RESULT,
                            key_conditions, filter_expression)
    return common_utils.response(result, pm_logger)


def create(trace_id,
           organization_id,
           project_id,
           check_history_id,
           is_cw_logger=False):
    if (is_cw_logger):
        common_utils.begin_cw_logger(trace_id, __name__,
                                     inspect.currentframe())
    else:
        common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    # 不要なクラムを作成することを避けるため
    date_now = common_utils.get_current_date()
    data_create = {
        'OrganizationID': organization_id,
        'ProjectID': project_id,
        'CheckHistoryID': check_history_id,
        'CreatedAt': date_now,
    }
    DB_utils.create(trace_id,
                    Tables.PM_LATEST_CHECK_RESULT,
                    data_create,
                    is_cw_logger=is_cw_logger)


def delete(trace_id, organization_id, project_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"OrganizationID": organization_id, "ProjectID": project_id}
    DB_utils.delete(trace_id, Tables.PM_LATEST_CHECK_RESULT, key)


def query_key(trace_id, project_id, organization_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key = {"OrganizationID": organization_id, "ProjectID": project_id}
    result = DB_utils.query_key(trace_id, Tables.PM_LATEST_CHECK_RESULT, key)
    return common_utils.response(result, pm_logger)


def query_key_by_check_history_id(trace_id, project_id, organization_id,
                                  check_history_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    filter = Attr('CheckHistoryID').eq(check_history_id)
    key_conditions = {
        'OrganizationID': {
            'AttributeValueList': [organization_id],
            'ComparisonOperator': 'EQ'
        },
        'ProjectID': {
            'AttributeValueList': [project_id],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query(trace_id, Tables.PM_LATEST_CHECK_RESULT,
                            key_conditions, filter)
    return common_utils.response(result, pm_logger)
