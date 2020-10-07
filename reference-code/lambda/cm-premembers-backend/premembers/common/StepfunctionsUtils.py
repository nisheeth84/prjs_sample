import inspect
import boto3

from premembers.common import common_utils
from botocore.exceptions import ClientError


def get_step_functions_client(trace_id):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    try:
        step_functions_client = boto3.client('stepfunctions')
    except ClientError as e:
        cw_logger.error("Step Functionsクライアント作成に失敗しました。")
        raise common_utils.write_log_exception(e, cw_logger)
    return step_functions_client


def start_execution_step_functions(trace_id, check_history_id,
                                   step_functions_client, state_machine_arn,
                                   data_input):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    try:
        response = step_functions_client.start_execution(
            stateMachineArn=state_machine_arn, input=data_input)
    except ClientError as e:
        cw_logger.error("ステートマシンの起動に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_exception(e, cw_logger)
    return response
