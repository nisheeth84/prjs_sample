import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils


RESPONSE_ORG_NOTIFY_MAIL_DESTINATIONS = {
    'OrganizationID': 'organizationId',
    'NotifyCode': 'notifyCode',
    'Destinations': 'destinations',
    'CreatedAt': 'createdAt',
    'UpdatedAt': 'updatedAt'
}

RESPONSE_DESTINATIONS = {
    'UserID': 'userId',
    'MailAddress': 'mailAddress'
}


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
                                Tables.PM_ORG_NOTIFY_MAIL_DESTINATIONS,
                                key,
                                is_cw_logger=is_cw_logger)
    if result and convert_response:
        result = common_utils.convert_response(
            trace_id,
            result,
            RESPONSE_ORG_NOTIFY_MAIL_DESTINATIONS,
            is_cw_logger=is_cw_logger)
        result['destinations'] = common_utils.convert_list_response(
            trace_id,
            result['destinations'],
            RESPONSE_DESTINATIONS,
            is_cw_logger=is_cw_logger)
    return common_utils.response(result, logger)


def delete(trace_id, organization_id, notify_code):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"NotifyCode": notify_code, "OrganizationID": organization_id}
    DB_utils.delete(trace_id, Tables.PM_ORG_NOTIFY_MAIL_DESTINATIONS, key)


def create(trace_id, organization_id, notify_code, destinations):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    date_now = common_utils.get_current_date()
    create_notify = {
        'OrganizationID': organization_id,
        'NotifyCode': notify_code,
        'Destinations': destinations,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    DB_utils.create(trace_id, Tables.PM_ORG_NOTIFY_MAIL_DESTINATIONS,
                    create_notify)


def update(trace_id, organization_id, notify_code, update_attribute):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"NotifyCode": notify_code, "OrganizationID": organization_id}
    DB_utils.update(trace_id, Tables.PM_ORG_NOTIFY_MAIL_DESTINATIONS, key,
                    update_attribute)
