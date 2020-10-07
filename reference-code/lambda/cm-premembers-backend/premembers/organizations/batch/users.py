import inspect

from premembers.common import common_utils, eventhelper
from premembers.organizations.logic import usersBatch_logic
from premembers.organizations.logic import organizationTask_logic
from premembers.exception.pm_exceptions import PmError


def execute_delete_organization_user_handler(event, context):
    task_id = eventhelper.get_task_id(event)
    message_id = eventhelper.get_message_id(event)
    receipt_handle = eventhelper.get_receipt_handle(event)

    common_utils.begin_logger(task_id, __name__, inspect.currentframe())

    # ユーザー組織遅延削除バッチ
    try:
        usersBatch_logic.execute_delete_organization_user(task_id)
        # 正常終了処理
        organizationTask_logic.processing_finish(task_id, message_id,
                                                 receipt_handle)
    except PmError:
        # エラー終了処理
        organizationTask_logic.processing_error(task_id, message_id)
