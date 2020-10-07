import inspect

from premembers.common import common_utils, eventhelper, checkauthority
from premembers.repository.const import Authority
from premembers.organizations.logic import projects_logic


def get_project_handler(event, context):
    # Get data request
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    project_id = eventhelper.get_project_id(event)
    organization_id = eventhelper.get_organization_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # get data project
    response = projects_logic.get_project(
        trace_id, project_id, organization_id)
    return common_utils.response(response, pm_logger)


def list_projects_handler(event, context):
    # Get data request
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = projects_logic.get_list_project(trace_id, organization_id)
    return common_utils.response(response, pm_logger)


def create_project_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # create project
    response = projects_logic.create_project(
        trace_id, organization_id, event['body'])
    return common_utils.response(response, pm_logger)


def update_project_handler(event, context):
    # Get data request
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    project_id = eventhelper.get_project_id(event)
    organization_id = eventhelper.get_organization_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # update data
    response = projects_logic.update_project(
        trace_id, project_id, organization_id, event["body"])
    return common_utils.response(response, pm_logger)


def delete_project_handler(event, context):
    # Get data request
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    email = eventhelper.get_email(event)
    project_id = eventhelper.get_project_id(event)
    organization_id = eventhelper.get_organization_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Owner)
    if (response_authority):
        return common_utils.response(response_authority, pm_logger)

    # delete data
    response = projects_logic.delete_project(
        trace_id, email, project_id, organization_id)
    return common_utils.response(response, pm_logger)
