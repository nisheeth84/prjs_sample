import inspect

from premembers.common import common_utils, eventhelper, checkauthority
from premembers.repository.const import Authority
from premembers.organizations.logic import notifymail_logic


def delete_notifymail_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    notify_code = eventhelper.get_notify_code(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = notifymail_logic.delete_notifymail(
        trace_id, organization_id, notify_code)
    return common_utils.response(response, pm_logger)


def get_notifymail_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    notify_code = eventhelper.get_notify_code(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = notifymail_logic.get_notifymail(
        trace_id, organization_id, notify_code)

    return common_utils.response(response, pm_logger)


def create_notifymail_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # return data response
    response = notifymail_logic.create_notifymail(trace_id, organization_id,
                                                  event["body"])
    return common_utils.response(response, pm_logger)


def create_notifyslack_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return data response
    response = notifymail_logic.create_notifyslack(trace_id, organization_id,
                                                   event["body"])
    return common_utils.response(response, pm_logger)


def get_notifyslack_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    notify_code = eventhelper.get_notify_code(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return data response
    response = notifymail_logic.get_notifyslack(trace_id, organization_id,
                                                notify_code)
    return common_utils.response(response, pm_logger)


def delete_notifyslack_handler(event, context):
    user_id = eventhelper.get_trace_id(event)
    trace_id = user_id
    organization_id = eventhelper.get_organization_id(event)
    notify_code = eventhelper.get_notify_code(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = notifymail_logic.delete_notifyslack(
        trace_id, organization_id, notify_code)
    return common_utils.response(response, pm_logger)
