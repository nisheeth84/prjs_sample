import inspect

from premembers.common import common_utils
from premembers.check.logic import dailycheck_logic


def execute_check_job_launcher_handler(event, context):
    trace_id = event['id']
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    dailycheck_logic.execute_check_job_launcher(trace_id)
