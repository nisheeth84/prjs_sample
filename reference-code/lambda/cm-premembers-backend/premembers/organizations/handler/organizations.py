import inspect

from premembers.common import checkauthority, common_utils, eventhelper
from premembers.repository.const import Authority
from premembers.organizations.logic import organizations_logic


def get_organization_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # return data response
    response = organizations_logic.get_organization(trace_id, organization_id)
    return common_utils.response(response, pm_logger)


def create_organization_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    email = eventhelper.get_email(event)
    body = event['body']

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # Create data
    response = organizations_logic.create_organization(trace_id, email, body)
    return common_utils.response(response, pm_logger)


def update_organization_handler(event, context):
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

    # update data
    response = organizations_logic.update_organization(
        trace_id, organization_id, event['body'])
    return common_utils.response(response, pm_logger)


def delete_organization_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    email = eventhelper.get_email(event)
    organization_id = eventhelper.get_organization_id(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # delete data
    response = organizations_logic.delete_organization(
        trace_id, email, organization_id)
    return common_utils.response(response, pm_logger)


def list_users_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    invite_status = eventhelper.get_invite_status(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = organizations_logic.get_list_users(trace_id, organization_id,
                                                  invite_status)
    return common_utils.response(response, pm_logger)


def delete_user_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id_sign_in = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_user_id(event)
    organization_id = eventhelper.get_organization_id(event)
    email = eventhelper.get_email(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id_sign_in, organization_id, Authority.Owner)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = organizations_logic.delete_user(trace_id, organization_id,
                                               user_id, email)
    return common_utils.response(response, pm_logger)


def update_authority_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id_sign_in = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_user_id(event)
    organization_id = eventhelper.get_organization_id(event)
    body = event['body']

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id_sign_in, organization_id, Authority.Owner)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = organizations_logic.update_authority(trace_id, organization_id,
                                                    user_id, body)
    return common_utils.response(response, pm_logger)


def create_invite_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    body = event['body']

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = organizations_logic.create_invite(
        trace_id, organization_id, body)
    return common_utils.response(response, pm_logger)


def accept_invite_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id_sign_in = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_user_id(event)
    organization_id = eventhelper.get_organization_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # return response data
    response = organizations_logic.accept_invite(trace_id, organization_id,
                                                 user_id, user_id_sign_in)
    return common_utils.response(response, pm_logger)


def reject_invite_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id_sign_in = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_user_id(event)
    organization_id = eventhelper.get_organization_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # return response data
    response = organizations_logic.reject_invite(trace_id, organization_id,
                                                 user_id, user_id_sign_in)
    return common_utils.response(response, pm_logger)


def execute_force_invites_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    organization_id = eventhelper.get_organization_id(event)
    body = event['body']

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = organizations_logic.execute_force_invites(
        trace_id, body, organization_id)
    return common_utils.response(response, pm_logger)
