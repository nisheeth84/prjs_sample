import inspect

from premembers.common import common_utils, eventhelper, checkauthority
from premembers.repository.const import Authority
from premembers.reports.logic import reports_logic


def list_reports_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    response = reports_logic.get_list_reports(
        trace_id, organization_id, project_id)
    return common_utils.response(response, pm_logger)


def get_report_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    report_id = eventhelper.get_report_id(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)

    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    response = reports_logic.get_report(
        trace_id, report_id, organization_id, project_id)

    return common_utils.response(response, pm_logger)


def delete_report_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    email = eventhelper.get_email(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    report_id = eventhelper.get_report_id(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # delete data
    response = reports_logic.delete_report(
        trace_id, email, report_id, organization_id, project_id)
    return common_utils.response(response, pm_logger)


def create_report_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    email = eventhelper.get_email(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # Create report
    response = reports_logic.create_report(
        trace_id, email, organization_id, project_id, event["body"])
    return common_utils.response(response, pm_logger)


def get_report_url_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    report_id = eventhelper.get_report_id(event)
    file_type = eventhelper.get_file_type(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # get report url
    response = reports_logic.get_report_url(
        trace_id, report_id, organization_id, project_id, file_type)
    return common_utils.response(response, pm_logger)


def request_output_report_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    email = eventhelper.get_email(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    report_id = eventhelper.get_report_id(event)
    file_type = eventhelper.get_file_type(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # アクセス権限チェック
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # export report
    response = reports_logic.request_output_report(
        trace_id, email, organization_id, project_id, report_id, file_type)
    return common_utils.response(response, pm_logger)
