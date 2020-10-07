import inspect

from premembers.common import common_utils, eventhelper, checkauthority
from premembers.repository.const import Authority
from premembers.organizations.logic import awscoops_logic


def list_awscoops_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    if (event['queryStringParameters'] and event[
            'queryStringParameters']['effective']):
        effective = eventhelper.get_effective(event)
    else:
        effective = None

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    response = awscoops_logic.get_list_awscoops(trace_id, organization_id,
                                                project_id, effective)

    return common_utils.response(response, pm_logger)


def get_awscoop_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    coop_id = eventhelper.get_coop_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = awscoops_logic.get_awscoop(
        trace_id, coop_id, project_id, organization_id)
    return common_utils.response(response, pm_logger)


def create_awscoop_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # create data
    response = awscoops_logic.create_awscoops(trace_id, project_id,
                                              organization_id)
    return common_utils.response(response, pm_logger)


def delete_awscoop_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    coop_id = eventhelper.get_coop_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # delete awscoop
    response = awscoops_logic.delete_awscoop(trace_id, coop_id,
                                             organization_id, project_id)
    return common_utils.response(response, pm_logger)


def update_awscoop_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    coop_id = eventhelper.get_coop_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # create data
    response = awscoops_logic.update_awscoop(
        trace_id, project_id, organization_id, coop_id, event['body'])
    return common_utils.response(response, pm_logger)
