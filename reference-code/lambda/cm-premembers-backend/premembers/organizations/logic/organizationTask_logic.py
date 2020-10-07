import os
import inspect

from premembers.common import common_utils, aws_common
from premembers.repository import pm_organizationTasks
from premembers.repository.const import Status


# タスク情報を取得します。
def check_process_status(task_id):
    pm_logger = common_utils.begin_logger(task_id, __name__,
                                          inspect.currentframe())
    organization_task = pm_organizationTasks.query_key(task_id)
    if not organization_task:
        pm_logger.info("OrganizationTasksより取得した件数が０")
        return None

    status = organization_task['TaskStatus']
    retry_count = organization_task['RetryCount']
    max_retry = organization_task['MaxRetry']
    updated_at = organization_task['UpdatedAt']

    if (status == Status.Running.value):
        pm_logger.info("処理が開始されているため、タスクの重複実行防止で処理を停止します。")
        return None

    if (status == Status.Done.value):
        pm_logger.info("すでに完了したタスクのため、処理を停止します。")
        return None

    if (status == Status.Error.value and retry_count >= max_retry):
        pm_logger.info("リトライ回数の上限に達しているため、処理を停止します。")
        return None

    attribute = {'TaskStatus': {"Value": Status.Running.value}}
    if (status == Status.Error.value and retry_count < max_retry):
        retry_count += 1
        attribute['RetryCount'] = {"Value": retry_count}
    # Update Tasks
    is_update = pm_organizationTasks.update(task_id, attribute, updated_at)
    if is_update is False:
        return None
    return organization_task['Target']


def processing_finish(task_id, message_id, receipt_handle):
    # Update Tasks
    update_status(task_id, Status.Done.value, message_id)

    # delete message in queue
    queue_url = os.environ.get("SQS_ORGANIZATION_QUEUE")
    aws_common.sqs_delete_message(task_id, queue_url, receipt_handle)


def processing_error(task_id, message_id):
    # Update Tasks
    update_status(task_id, Status.Error.value, message_id)


def update_status(task_id, status, message_id):
    common_utils.begin_logger(task_id, __name__, inspect.currentframe())
    organization_task = pm_organizationTasks.query_key(task_id)
    if not organization_task:
        return False

    # Update Tasks
    attribute = {
        'TaskStatus': {
            "Value": status
        },
        'MessageID': {
            "Value": message_id
        }
    }
    updated_at = organization_task['UpdatedAt']
    return pm_organizationTasks.update(task_id, attribute, updated_at)
