import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils

USER_INDEX = 'UserIndex'

RESPONSE_EMAIL_CHANGE_APPLY = {
    'ApplyID': 'applyId',
    'UserID': 'userID',
    'BeforeMailAddress': 'beforeMailAddress',
    'AfterMailAddress': 'afterMailAddress',
    'CallerServiceName': 'callerServiceName',
    'CreatedAt': 'createdAt',
    'UpdatedAt': 'updatedAt'
}


def create(trace_id, apply_id, before_mail_address, after_mail_address,
           time_to_live, caller_service_name):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    # 不要なカラムを作成することを避けるため
    date_now = common_utils.get_current_date()
    create_email_change_apply = {
        'ApplyID': apply_id,
        'UserID': trace_id,
        'BeforeMailAddress': before_mail_address,
        'AfterMailAddress': after_mail_address,
        'TimeToLive': time_to_live,
        'CallerServiceName': caller_service_name,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    DB_utils.create(trace_id, Tables.PM_EMAIL_CHANGE_APPLY,
                    create_email_change_apply)


def query_key(trace_id, apply_id, convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key = {"ApplyID": apply_id}
    result = DB_utils.query_key(trace_id, Tables.PM_EMAIL_CHANGE_APPLY, key)
    if convert_response:
        result = common_utils.convert_response(trace_id, result,
                                               RESPONSE_EMAIL_CHANGE_APPLY)
    return common_utils.response(result, pm_logger)


def query_user_index(user_id, filter_expression=None, convert_response=None):
    pm_logger = common_utils.begin_logger(user_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'UserID': {
            'AttributeValueList': [user_id],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query_index(user_id, Tables.PM_EMAIL_CHANGE_APPLY,
                                  USER_INDEX, key_conditions,
                                  filter_expression)
    if convert_response:
        result = common_utils.convert_list_response(
            user_id, result, RESPONSE_EMAIL_CHANGE_APPLY)
    return common_utils.response(result, pm_logger)


def delete(trace_id, apply_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"ApplyID": apply_id}
    DB_utils.delete(trace_id, Tables.PM_EMAIL_CHANGE_APPLY, key)
