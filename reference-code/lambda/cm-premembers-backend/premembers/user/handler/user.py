import inspect

from premembers.common import common_utils, eventhelper
from premembers.user.logic import user_logic


def get_user_attributes_handler(event, context):
    user_id = eventhelper.get_trace_id(event)
    pm_logger = common_utils.begin_logger(user_id, __name__,
                                          inspect.currentframe())
    # return data response
    response = user_logic.get_user_attributes(user_id)
    return common_utils.response(response, pm_logger)


def update_user_attributes_handler(event, context):
    user_id = eventhelper.get_trace_id(event)
    pm_logger = common_utils.begin_logger(user_id, __name__,
                                          inspect.currentframe())
    # return data response
    response = user_logic.update_user_attributes(user_id, event['body'])
    return common_utils.response(response, pm_logger)


def apply_change_email_handler(event, context):
    user_id = eventhelper.get_trace_id(event)
    email = eventhelper.get_email(event)
    pm_logger = common_utils.begin_logger(user_id, __name__,
                                          inspect.currentframe())
    # return data response
    response = user_logic.apply_change_email(user_id, email, event['body'])
    return common_utils.response(response, pm_logger)


def execute_change_email_handler(event, context):
    apply_id = eventhelper.get_apply_id(event)

    pm_logger = common_utils.begin_logger(apply_id, __name__,
                                          inspect.currentframe())
    # return data response
    response = user_logic.execute_change_email(apply_id)
    return common_utils.response(response, pm_logger)
