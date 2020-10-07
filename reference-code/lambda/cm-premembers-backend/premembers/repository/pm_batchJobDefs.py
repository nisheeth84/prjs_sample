import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from boto3.dynamodb.conditions import Attr

RESPONSE_REPORT_JOB_DEF = {
    'Code': 'id',
    'JobDefinition': 'jobDefinition',
    'JobQueue': 'jobQueue',
    'MaxRetry': 'maxRetry',
    'Environment': 'environment'
}


def query_report_job_def_key(trace_id,
                             code,
                             convert_response=None,
                             is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    key = {"Code": code}
    result = DB_utils.query_key(trace_id,
                                Tables.PM_BATCH_JOB_DEFS,
                                key,
                                is_cw_logger=is_cw_logger)

    if convert_response:
        result = common_utils.convert_response(trace_id,
                                               result,
                                               RESPONSE_REPORT_JOB_DEF,
                                               is_cw_logger=is_cw_logger)
    return common_utils.response(result, logger)


def create_report_job_def(trace_id, code, job_definition, job_queue, max_retry,
                          environment):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())

    # 不要なクラムを作成することを避けるため
    date_now = common_utils.get_current_date()
    create_report_job_def = {
        'Code': code,
        'JobDefinition': job_definition,
        'JobQueue': job_queue,
        'MaxRetry': max_retry,
        'Environment': environment,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    condition_expression = Attr("Code").not_exists()
    DB_utils.create(trace_id, Tables.PM_BATCH_JOB_DEFS, create_report_job_def,
                    condition_expression)


def delete_report_job_def(trace_id, code):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"Code": code}
    DB_utils.delete(trace_id, Tables.PM_BATCH_JOB_DEFS, key)
