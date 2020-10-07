import inspect

from premembers.common import common_utils, eventhelper, checkauthority
from premembers.repository.const import Authority
from premembers.check.logic import checkitemsettings_logic


def create_excluesion_item_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    email = eventhelper.get_email(event)
    check_item_code = eventhelper.get_check_item_code(event)
    coop_id = eventhelper.get_coop_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = checkitemsettings_logic.create_excluesion_item(
        trace_id, user_id, organization_id, project_id, email, check_item_code,
        coop_id, event['body'])
    return common_utils.response(response, pm_logger)


def get_excluesion_item_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    check_item_code = eventhelper.get_check_item_code(event)
    coop_id = eventhelper.get_coop_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = checkitemsettings_logic.get_excluesion_item(
        trace_id, organization_id, project_id, check_item_code, coop_id)
    return common_utils.response(response, pm_logger)


def delete_excluesion_item_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    check_item_code = eventhelper.get_check_item_code(event)
    coop_id = eventhelper.get_coop_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # チェック項目除外設定情報を削除します。
    response = checkitemsettings_logic.delete_excluesion_item(
        trace_id, organization_id, project_id, check_item_code, coop_id)
    return common_utils.response(response, pm_logger)


def get_assessment_item_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    check_item_code = eventhelper.get_check_item_code(event)
    coop_id = eventhelper.get_coop_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = checkitemsettings_logic.get_assessment_item(
        trace_id, organization_id, project_id, coop_id, check_item_code)
    return common_utils.response(response, pm_logger)


def create_assessment_item_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    email = eventhelper.get_email(event)
    coop_id = eventhelper.get_coop_id(event)
    check_item_code = eventhelper.get_check_item_code(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = checkitemsettings_logic.create_assessment_item(
        trace_id, user_id, organization_id, project_id, coop_id,
        check_item_code, email, event['body'])
    return common_utils.response(response, pm_logger)


def delete_assessment_item_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    check_item_code = eventhelper.get_check_item_code(event)
    coop_id = eventhelper.get_coop_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # マニュアル評価情報を削除します。
    response = checkitemsettings_logic.delete_assessment_item(
        trace_id, organization_id, project_id, check_item_code, coop_id)

    return common_utils.response(response, pm_logger)


def list_item_settings_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    coop_id = eventhelper.get_coop_id(event)
    group_filter = eventhelper.get_group_filter(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = checkitemsettings_logic.list_item_settings(
        trace_id, organization_id, project_id, coop_id, group_filter)
    return common_utils.response(response, pm_logger)


def execute_copy_item_setting_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    email = eventhelper.get_email(event)
    organization_id_destination = eventhelper.get_organization_id(event)
    project_id_destination = eventhelper.get_project_id(event)
    coop_id_destination = eventhelper.get_coop_id(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # return response data
    response = checkitemsettings_logic.execute_copy_item_setting(
        trace_id, organization_id_destination, project_id_destination,
        coop_id_destination, event['body'], email, user_id)
    return common_utils.response(response, pm_logger)


def create_excluded_resources_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    email = eventhelper.get_email(event)
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    coop_id = eventhelper.get_coop_id(event)
    check_item_code = eventhelper.get_check_item_code(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = checkitemsettings_logic.create_excluded_resources(
        trace_id, user_id, organization_id, project_id, coop_id,
        check_item_code, email, event['body'])
    return common_utils.response(response, pm_logger)


def delete_excluded_resources_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    check_item_code = eventhelper.get_check_item_code(event)
    coop_id = eventhelper.get_coop_id(event)
    region_name = eventhelper.get_region_name(event)
    resource_type = eventhelper.get_resource_type(event)
    resource_name = eventhelper.get_resource_name(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェックを行います。
    response_authority = checkauthority.authority(trace_id, user_id,
                                                  organization_id,
                                                  Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # リソース除外設定情報を削除します。
    response = checkitemsettings_logic.delete_excluded_resources(
        trace_id, organization_id, project_id, check_item_code, coop_id,
        region_name, resource_type, resource_name)
    return common_utils.response(response, pm_logger)


def get_excluded_resources_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = trace_id
    organization_id = eventhelper.get_organization_id(event)
    project_id = eventhelper.get_project_id(event)
    coop_id = eventhelper.get_coop_id(event)
    check_item_code = eventhelper.get_check_item_code(event)

    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # アクセス権限チェック を行います。
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Editor)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # return response data
    response = checkitemsettings_logic.get_excluded_resources(
        trace_id, project_id, organization_id, coop_id, check_item_code)
    return common_utils.response(response, pm_logger)
