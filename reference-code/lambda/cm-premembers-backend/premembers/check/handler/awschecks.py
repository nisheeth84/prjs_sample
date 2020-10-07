import inspect

from premembers.common import common_utils, eventhelper, checkauthority
from premembers.repository.const import Authority
from premembers.check.logic import awschecks_logic


def get_security_check_summary_handler(event, context):
    # Get data request
    user_id = eventhelper.get_trace_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(user_id, __name__,
                                          inspect.currentframe())

    # Get response summary check security
    response = awschecks_logic.get_security_check_summary(user_id)
    return common_utils.response(response, pm_logger)


def get_security_check_detail_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    check_history_id = eventhelper.get_check_history_id(event)
    group_filter = eventhelper.get_group_filter(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = awschecks_logic.get_security_check_detail(
        trace_id, organization_id, project_id, check_history_id, group_filter)
    return common_utils.response(response, pm_logger)


def get_securitycheck_awsacntsummary_handler(event, context):
    # Get data request
    user_id = eventhelper.get_trace_id(event)
    aws_account = eventhelper.get_query_awsaccount(event)

    # Get logging
    pm_logger = common_utils.begin_logger(user_id, __name__,
                                          inspect.currentframe())

    # return response data
    response = awschecks_logic.get_securitycheck_awsacntsummary(
        user_id, aws_account)
    return common_utils.response(response, pm_logger)


def execute_security_check_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    email = eventhelper.get_email(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = awschecks_logic.execute_security_check(trace_id,
                                                      organization_id,
                                                      project_id, user_id,
                                                      email)
    return common_utils.response(response, pm_logger)


def get_security_check_report_url_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    history_id = eventhelper.get_history_id(event)
    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # return response data
    response = awschecks_logic.get_security_check_report_url(
        trace_id, user_id, history_id)
    return common_utils.response(response, pm_logger)


def list_security_check_reports_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = awschecks_logic.list_security_check_reports(
        trace_id, organization_id, project_id)
    return common_utils.response(response, pm_logger)


def get_security_check_webhook_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_query_organization_id(event)
    project_id = eventhelper.get_query_project_id(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    response = awschecks_logic.get_security_check_webhook_by_ids(
        trace_id, user_id, organization_id, project_id)

    return common_utils.response(response, pm_logger)


def generate_security_check_webhook_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    email = eventhelper.get_email(event)

    body = eventhelper.parse_body(event)
    organization_id = body['organizationId']
    project_id = body['projectId']

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    response = awschecks_logic.generate_security_check_webhook(
        trace_id, organization_id, project_id, user_id, email)
    return common_utils.response(response, pm_logger)


def update_security_check_webhook_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    webhook_path = eventhelper.get_webhook_path(event)

    body = eventhelper.parse_body(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    response = awschecks_logic.update_security_check_webhook(
        trace_id, webhook_path, user_id, body)
    return common_utils.response(response, pm_logger)


def execute_security_check_webhook_handler(event, context):
    webhook_path = eventhelper.get_webhook_path(event)
    trace_id = webhook_path

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    response = awschecks_logic.execute_security_check_from_external(
        trace_id, webhook_path)
    return common_utils.response(response, pm_logger)


def get_security_check_resource_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    organization_id = eventhelper.get_organization_id(event)
    coop_id = eventhelper.get_coop_id(event)
    project_id = eventhelper.get_project_id(event)
    check_item_code = eventhelper.get_check_item_code(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = awschecks_logic.get_security_check_resource(
        trace_id, coop_id, project_id, organization_id, check_item_code)

    return common_utils.response(response, pm_logger)
