import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from boto3.dynamodb.conditions import Attr

RESPONSE_SECURITY_CHECK_WEBHOOK_CALL_HISTORY = {
    'SecurityCheckWebhookID': 'id',
    'CreatedAt': 'createdAt',
    'ExecutedStatus': 'executedStatus'
}


def create(trace_id, security_check_webhook_id, executed_status):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    date_now = common_utils.get_current_date()
    data_create = {
        'SecurityCheckWebhookID': security_check_webhook_id,
        'CreatedAt': date_now,
        'ExecutedStatus': executed_status
    }

    condition_expression = Attr('SecurityCheckWebhookID').not_exists().__and__(
        Attr('CreatedAt').not_exists())
    DB_utils.create(trace_id, Tables.PM_SECURITY_CHECK_WEBHOOK_CALL_HISTORY,
                    data_create, condition_expression)


def query(trace_id, security_check_webhook_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'SecurityCheckWebhookID': {
            'AttributeValueList': [security_check_webhook_id],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query(trace_id,
                            Tables.PM_SECURITY_CHECK_WEBHOOK_CALL_HISTORY,
                            key_conditions, None)
    return common_utils.response(result, pm_logger)


def delete(trace_id, security_check_webhook_id, create_at):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {
        "SecurityCheckWebhookID": security_check_webhook_id,
        "CreatedAt": create_at
    }
    DB_utils.delete(trace_id, Tables.PM_SECURITY_CHECK_WEBHOOK_CALL_HISTORY,
                    key)
