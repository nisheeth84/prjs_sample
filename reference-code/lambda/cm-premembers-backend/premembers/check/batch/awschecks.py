import inspect
import json

from premembers.common import common_utils, eventhelper
from premembers.check.logic import awschecksBatch_logic


def execute_send_result_email_handler(event, context):
    check_history_id = eventhelper.get_check_history_id_batch(event)
    language = eventhelper.get_language_batch(event)
    trace_id = check_history_id
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())

    # 通知メール送信処理
    awschecksBatch_logic.execute_send_result_email(
        trace_id, check_history_id, context.aws_request_id, language)


def execute_send_result_slack_handler(event, context):
    check_history_id = eventhelper.get_check_history_id_batch(event)
    language = eventhelper.get_language_batch(event)
    trace_id = check_history_id
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())

    # Slack通知送信処理
    awschecksBatch_logic.execute_send_result_slack(
        trace_id, check_history_id, language)


def execute_send_checkerror_email_handler(event, context):
    message = eventhelper.get_message_from_sns(event)
    message = json.loads(message)

    aws_account = eventhelper.get_awsaccount(message)
    check_history_id = eventhelper.get_check_history_id_batch(message)
    organization_id = eventhelper.get_organization_id_batch(message)
    project_id = eventhelper.get_project_id_batch(message)
    error_code = eventhelper.get_error_code_batch(message)
    execute_user_id = eventhelper.get_execute_user_id_batch(message)
    region_name = eventhelper.get_region_name_batch(message)
    check_code_item = eventhelper.get_check_code_item_batch(message)
    data_body = eventhelper.get_data_body_batch(message)
    trace_id = execute_user_id
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())

    # 通知メール送信処理
    awschecksBatch_logic.execute_send_checkerror_email(
        trace_id, context.aws_request_id, aws_account, check_history_id,
        organization_id, project_id, error_code, execute_user_id, region_name,
        check_code_item, data_body)
