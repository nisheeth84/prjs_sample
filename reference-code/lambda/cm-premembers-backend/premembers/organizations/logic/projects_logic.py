import json
import uuid
import inspect

from http import HTTPStatus
from premembers.common import common_utils, aws_common
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_projects, pm_organizationTasks
from premembers.repository.const import Status


# Begin public function
def get_project(trace_id, project_id, organization_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        project = pm_projects.get_projects_by_organization_id(
            trace_id, project_id, organization_id,
            convert_response=True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 組織情報を取得します。
    if (not project):
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # data response
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, project[0])
    return common_utils.response(response, pm_logger)


def get_list_project(trace_id, organization_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        list_projects_result = pm_projects.query_organization_index(
            trace_id, organization_id, convert_response=True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # data response
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, list_projects_result)
    return common_utils.response(response, pm_logger)


def create_project(trace_id, organization_id, data_body):
    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # Parse JSON
    try:
        body_object = json.loads(data_body)
        project_name = body_object["name"]
        description = body_object["description"]
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    # Validate
    list_error = validate_project(trace_id, project_name)
    if list_error:
        return common_utils.error_validate(
            MsgConst.ERR_REQUEST_201, HTTPStatus.UNPROCESSABLE_ENTITY,
            list_error, pm_logger)

    # Create Project
    project_id = str(uuid.uuid4())
    if common_utils.is_null(description):
        description = None
    try:
        pm_projects.create_projects(trace_id, project_id, project_name,
                                    description, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    try:
        project_item = pm_projects.get_projects(
            trace_id, project_id, convert_response=True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # return data response
    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, project_item[0])
    return common_utils.response(response, pm_logger)


def update_project(trace_id, project_id, organization_id, data_body):
    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # Parse JSON
    try:
        body_object = json.loads(data_body)
        project_name = body_object["name"]
        description = body_object["description"]
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    # Validate
    list_error = validate_project(trace_id, project_name)
    if list_error:
        return common_utils.error_validate(
            MsgConst.ERR_REQUEST_201, HTTPStatus.UNPROCESSABLE_ENTITY,
            list_error, pm_logger)
    # Get project
    try:
        project_item = pm_projects.get_projects_by_organization_id(
            trace_id, project_id, organization_id)
    except PmError as err:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)
    if not project_item:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # update project
    if common_utils.is_null(description):
        description = None
    attribute = {
        'ProjectName': {
            "Value": project_name
        },
        'Description': {
            "Value": description
        }
    }
    updated_at = project_item[0]['UpdatedAt']
    try:
        pm_projects.update_project(trace_id, project_id, attribute, updated_at)
    except PmError as err:
        return common_utils.error_exception(MsgConst.ERR_DB_404,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    # Get data update
    try:
        project_result = pm_projects.get_projects(
            trace_id, project_id, convert_response=True)
    except PmError as err:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, project_result[0])

    # return data response
    return common_utils.response(response, pm_logger)


def delete_project(trace_id, email, project_id, organization_id):
    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        project = pm_projects.get_projects_by_organization_id(
            trace_id, project_id, organization_id,
            convert_response=True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 組織情報を取得します。
    if (not project):
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # プロジェクト削除の条件を満たしているかチェックを行います。現時点ではチェックすべき項目はありません。
    # 現時点ではチェックすべき項目はありません。

    # Delete project
    try:
        pm_projects.delete_projects(trace_id, project_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_405,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # Create task
    task_id = str(uuid.uuid4())
    user_id = trace_id
    try:
        pm_organizationTasks.create_organizationTask(
            trace_id, task_id, "DELETE_PRJ", project_id, user_id, email,
            Status.Waiting.value, 0, 3)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    aws_common.sns_organization_topic(trace_id, task_id, "DELETE_PRJ")

    # data response
    response = common_utils.get_response_by_response_body(
        HTTPStatus.NO_CONTENT, None)
    return common_utils.response(response, pm_logger)
# End public function


# Begin private function
def validate_project(trace_id, project_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    list_error = []
    if common_utils.is_null(project_name):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "name", project_name))
    elif not common_utils.is_str(project_name):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_202, "name", project_name))

    return common_utils.response(list_error, pm_logger)
# End private function
