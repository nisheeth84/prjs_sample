import inspect

from premembers.common import common_utils, eventhelper
from premembers.organizations.logic import myorganizations_logic


# get list organization
def get_myorganizations_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    invite_status = eventhelper.get_invite_status(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # response when do success
    response = myorganizations_logic.get_myorganizations(
        trace_id, user_id, invite_status)
    return common_utils.response(response, pm_logger)


# count oraganization
def count_myorganizations_handler(event, context):
    trace_id = eventhelper.get_trace_id(event)
    user_id = eventhelper.get_trace_id(event)
    invite_status = eventhelper.get_invite_status(event)

    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    response = myorganizations_logic.count_myorganizations(
        trace_id, user_id, invite_status)
    return common_utils.response(response, pm_logger)
