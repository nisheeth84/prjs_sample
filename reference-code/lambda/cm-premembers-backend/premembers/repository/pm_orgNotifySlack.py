import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils

RESPONSE_ORG_NOTIFY_SLACK = {
    'OrganizationID': 'organizationId',
    'NotifyCode': 'notifyCode',
    'WebhookURL': 'webhookUrl',
    'Mentions': 'mentions',
    'CreatedAt': 'createdAt',
    'UpdatedAt': 'updatedAt'
}


def create(trace_id,
           organization_id,
           notify_code,
           webhook_url,
           mentions,
           is_cw_logger=False):
    if (is_cw_logger):
        common_utils.begin_cw_logger(trace_id, __name__,
                                     inspect.currentframe())
    else:
        common_utils.begin_logger(trace_id, __name__, inspect.currentframe())

    if common_utils.is_null(mentions):
        mentions = None

    date_now = common_utils.get_current_date()
    org_notify_slack = {
        "OrganizationID": organization_id,
        "NotifyCode": notify_code,
        "WebhookURL": webhook_url,
        "Mentions": mentions,
        "CreatedAt": date_now,
        "UpdatedAt": date_now
    }
    DB_utils.create(trace_id,
                    Tables.PM_ORG_NOTIFY_SLACK,
                    org_notify_slack,
                    is_cw_logger=is_cw_logger)


def query_key(trace_id,
              organization_id,
              notify_code,
              convert_response=None,
              is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    key = {"OrganizationID": organization_id, "NotifyCode": notify_code}
    result = DB_utils.query_key(trace_id,
                                Tables.PM_ORG_NOTIFY_SLACK,
                                key,
                                is_cw_logger=is_cw_logger)
    if result and convert_response:
        result = common_utils.convert_response(trace_id,
                                               result,
                                               RESPONSE_ORG_NOTIFY_SLACK,
                                               is_cw_logger=is_cw_logger)
    return common_utils.response(result, logger)


def delete(trace_id, organization_id, notify_code):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"NotifyCode": notify_code, "OrganizationID": organization_id}
    DB_utils.delete(trace_id, Tables.PM_ORG_NOTIFY_SLACK, key)
