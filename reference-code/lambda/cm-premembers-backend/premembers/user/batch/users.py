import inspect

from premembers.common import common_utils
from premembers.user.logic import usersBatch_logic


def execute_delete_invalid_user_handler(event, context):
    trace_id = event['id']
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    # Call Task delete user temp
    usersBatch_logic.execute_delete_invalid_user(trace_id)
