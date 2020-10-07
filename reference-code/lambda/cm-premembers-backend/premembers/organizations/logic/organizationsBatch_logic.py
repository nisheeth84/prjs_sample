import ast
import json
import inspect

from premembers.common import common_utils, aws_common
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_projects
from premembers.organizations.logic import projectsBatch_logic
from premembers.organizations.logic import organizationTask_logic
from premembers.const.const import CommonConst

LAMBDA_FUNCTION = {
    'DELETE_ORG': "execute_delete_organization",
    'DELETE_PRJ': "execute_delete_project",
    'DELETE_REPORT': "execute_delete_report",
    'CHECK_AWS_COOP': 'execute_confirm_awscoop',
    'DELETE_ORG_USER': 'execute_delete_organization_user'
}


def execute_delete_organization(task_id):
    pm_logger = common_utils.begin_logger(task_id, __name__,
                                          inspect.currentframe())

    # check status organization task info
    organization_id = organizationTask_logic.check_process_status(task_id)
    if organization_id is None:
        pm_logger.error("組織タスク情報取得に失敗しました。: TaskID=%s", task_id)
        return False

    return delete_organization(task_id, organization_id)


def delete_organization(task_id, organization_id):
    pm_logger = common_utils.begin_logger(task_id, __name__,
                                          inspect.currentframe())
    # get list project with key organization_id
    try:
        list_projects = pm_projects.query_organization_index(
            task_id, organization_id)
    except PmError as e:
        pm_logger.error(
            "プロジェクト情報取得に失敗しました。: OrganizationID=%s", organization_id)
        pm_logger.error(e)
        return False

    for project_item in list_projects:
        project_id = project_item["ProjectID"]

        status_delete_project = projectsBatch_logic.delete_project(
            task_id, project_id)
        if status_delete_project is False:
            return False
        # delete project
        try:
            pm_projects.delete_projects(task_id, project_id)
        except PmError as e:
            pm_logger.error("プロジェクト情報削除に失敗しました。: ProjectID=%s", project_id)
            pm_logger.error(e)
            return False

    return True


def execute_organization_task_controller(trace_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # Get task message
    messages = aws_common.sqs_receive_message(trace_id)
    if messages is None:
        pm_logger.warning("SQSからメッセージが受信できない")
        return False
    for message in messages:
        message_body = json.loads(message['Body'])
        body_message = ast.literal_eval(message_body['Message'])
        code = body_message['Code']
        # call Lambda
        payload = {
            'TaskId': body_message['TaskId'],
            'Message': {
                'MessageId': message['MessageId'],
                'ReceiptHandle': message['ReceiptHandle']
            }
        }
        call_lambda_batch(trace_id, code, json.dumps(payload))


def call_lambda_batch(trace_id, code, payload):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    function_name = get_function_name(trace_id, LAMBDA_FUNCTION[code])
    aws_common.lambda_invoke(trace_id, function_name, payload)


def get_function_name(trace_id, function):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    service_name = common_utils.get_service_name(CommonConst.HYPHEN)
    stage = common_utils.get_stage(CommonConst.HYPHEN)

    # Function name
    result = service_name + stage + function
    return common_utils.response(result, pm_logger)
