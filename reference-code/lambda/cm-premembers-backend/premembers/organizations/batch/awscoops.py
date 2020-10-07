import inspect

from premembers.common import common_utils, eventhelper
from premembers.organizations.logic import awscoopsBatch_logic
from premembers.organizations.logic import organizationTask_logic
from premembers.exception.pm_exceptions import PmError


def execute_confirm_awscoop_handler(event, context):
    task_id = eventhelper.get_task_id(event)
    message_id = eventhelper.get_message_id(event)
    receipt_handle = eventhelper.get_receipt_handle(event)

    common_utils.begin_logger(task_id, __name__, inspect.currentframe())

    # batch confirm awscoop
    try:
        awscoopsBatch_logic.execute_confirm_awscoop(task_id)
        organizationTask_logic.processing_finish(task_id, message_id,
                                                 receipt_handle)
    except PmError as e:
        organizationTask_logic.processing_error(task_id, message_id)
