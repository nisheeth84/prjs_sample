import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from boto3.dynamodb.conditions import Attr

WEBHOOK_PATH_INDEX = 'WebhookPathIndex'
PROJECT_INDEX = 'ProjectIndex'

RESPONSE_SECURITY_CHECK_WEBHOOK = {
    'SecurityCheckWebhookID': 'id',
    'WebhookPath': 'webhookPath',
    'UserID': 'userId',
    'Enabled': 'enabled',
    'CreatedAt': 'createdAt',
    'UpdatedAt': 'updatedAt'
}

RESPONSE_REQUIRED = {'maxDailyExecutedCount': 0}


def create(trace_id, security_check_webhook_id, webhook_path, user_id,
           mail_address, organization_id, project_id,
           max_daily_executed_count):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    date_now = common_utils.get_current_date()
    data_create = {
        'SecurityCheckWebhookID': security_check_webhook_id,
        'WebhookPath': webhook_path,
        'UserID': user_id,
        'MailAddress': mail_address,
        'OrganizationID': organization_id,
        'ProjectID': project_id,
        'MaxDailyExecutedCount': max_daily_executed_count,
        'Enabled': True,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }

    condition_expression = Attr('SecurityCheckWebhookID').not_exists().__and__(
        Attr('WebhookPath').not_exists())
    DB_utils.create(trace_id, Tables.PM_SECURITY_CHECK_WEBHOOK, data_create,
                    condition_expression)


def query_key(trace_id,
              security_check_webhook_id,
              filter_expression=None,
              convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key = {'SecurityCheckWebhookID': security_check_webhook_id}
    result = DB_utils.query_key(trace_id, Tables.PM_SECURITY_CHECK_WEBHOOK,
                                key)
    if result and convert_response:
        result = common_utils.convert_response(
            trace_id, result, RESPONSE_SECURITY_CHECK_WEBHOOK)

    return common_utils.response(result, pm_logger)


def query_webhook_index(trace_id,
                        webhook_path,
                        filter_expression=None,
                        convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'WebhookPath': {
            'AttributeValueList': [webhook_path],
            'ComparisonOperator': 'EQ'
        }
    }

    result = DB_utils.query_index(trace_id, Tables.PM_SECURITY_CHECK_WEBHOOK,
                                  WEBHOOK_PATH_INDEX, key_conditions,
                                  filter_expression)
    if result and convert_response:
        result = common_utils.convert_list_response(
            trace_id, result, RESPONSE_SECURITY_CHECK_WEBHOOK)

    return common_utils.response(result, pm_logger)


def query_project_index(trace_id,
                        project_id,
                        user_id=None,
                        filter_expression=None,
                        convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'ProjectID': {
            'AttributeValueList': [project_id],
            'ComparisonOperator': 'EQ'
        }
    }
    if common_utils.is_null(user_id) is False:
        key_conditions['UserID'] = {
            'AttributeValueList': [user_id],
            'ComparisonOperator': 'EQ'
        }

    result = DB_utils.query_index(trace_id, Tables.PM_SECURITY_CHECK_WEBHOOK,
                                  PROJECT_INDEX, key_conditions,
                                  filter_expression)
    if result and convert_response:
        result = common_utils.convert_list_response(
            trace_id, result, RESPONSE_SECURITY_CHECK_WEBHOOK)
    return common_utils.response(result, pm_logger)


def update(trace_id, security_check_webhook_id, update_attribute,
           target_update_date):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {'SecurityCheckWebhookID': security_check_webhook_id}
    DB_utils.update(trace_id, Tables.PM_SECURITY_CHECK_WEBHOOK, key,
                    update_attribute, target_update_date)


def delete(trace_id, security_check_webhook_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"SecurityCheckWebhookID": security_check_webhook_id}
    DB_utils.delete(trace_id, Tables.PM_SECURITY_CHECK_WEBHOOK, key)
