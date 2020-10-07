import inspect
import time

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from boto3.dynamodb.conditions import Attr
from premembers.exception.pm_exceptions import PmError


def create_organizationTask(trace_id,
                            task_id,
                            code,
                            target,
                            user_id,
                            email,
                            status,
                            retry_count,
                            max_retry,
                            is_cw_logger=False):
    if (is_cw_logger):
        common_utils.begin_cw_logger(trace_id, __name__,
                                     inspect.currentframe())
    else:
        common_utils.begin_logger(trace_id, __name__, inspect.currentframe())

    # 不要なクラムを作成することを避けるため
    date_now = common_utils.get_current_date()
    create_organization_task = {
        "TaskID": task_id,
        "Code": code,
        "Target": target,
        "UserID": user_id,
        "MailAddress": email,
        "TaskStatus": status,
        "RetryCount": retry_count,
        "MaxRetry": max_retry,
        "MessageID": None,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    condition_expression = Attr("TaskID").not_exists()
    DB_utils.create(trace_id,
                    Tables.PM_ORGANIZATION_TASKS,
                    create_organization_task,
                    condition_expression,
                    is_cw_logger=is_cw_logger)


def update(task_id, update_attribute, target_update_date):
    pm_logger = common_utils.begin_logger(task_id, __name__,
                                          inspect.currentframe())
    try:
        key = {"TaskID": task_id}
        DB_utils.update(task_id, Tables.PM_ORGANIZATION_TASKS, key,
                        update_attribute, target_update_date)
        return common_utils.response(True, pm_logger)
    except PmError as e:
        pm_logger.error(e)
        return common_utils.response(False, pm_logger)


def query_key(task_id):
    pm_logger = common_utils.begin_logger(task_id, __name__,
                                          inspect.currentframe())
    try:
        key = {"TaskID": task_id}
        result = DB_utils.query_key(task_id, Tables.PM_ORGANIZATION_TASKS, key)
        return common_utils.response(result, pm_logger)
    except PmError as e:
        pm_logger.error(e)
        return common_utils.response(None, pm_logger)


def delete(trace_id, task_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"TaskID": task_id}
    DB_utils.delete(trace_id, Tables.PM_ORGANIZATION_TASKS, key)


def get_all_organizationTask(trace_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    exclusiveStartKey = None
    organizationTasks = []
    limit = 10
    while True:
        try:
            result = DB_utils.scan(trace_id, Tables.PM_ORGANIZATION_TASKS,
                                   limit, exclusiveStartKey)
            organizationTasks.extend(result['Items'])
            if (common_utils.check_key('LastEvaluatedKey', result)):
                exclusiveStartKey = result['LastEvaluatedKey']
            else:
                break
            time.sleep(1)
        except PmError as e:
            break
    return common_utils.response(organizationTasks, pm_logger)
