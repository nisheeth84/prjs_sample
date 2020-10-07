import logging
import inspect
import os
from watchtower import CloudWatchLogHandler
from premembers.const.const import CommonConst
from distutils.util import strtobool


class CwLogAdapter(logging.LoggerAdapter):
    def process(self, msg, kwargs):
        message_obj = {
            'request_id': self.extra['request_id'],
            'function_name': self.extra['function_name'],
            'msg': msg
        }

        return 'request_id:{request_id} function_name:{function_name} {msg}'.format(
            **message_obj), kwargs


def create_cw_logger(
        name,
        trace_id,
        current_frame=None,
        log_group_name=CommonConst.LOG_GROUP_NAME_STEP_FUNCTIONS,
        format_stream_name=CommonConst.FORMAT_STREAM_NAME_STEP_FUNCTIONS):
    log_stream_name = format_stream_name.format(request_id=trace_id)
    cw_logger = logging.getLogger(log_stream_name)

    env_is_running_step_functions = os.getenv('RUNNING_STEP_FUNCTION', 'False')
    is_running_step_functions = bool(strtobool(env_is_running_step_functions))
    if is_running_step_functions:
        # format message cw logger
        format = "[%(levelname)s] %(asctime)s %(message)s"
        date_format = '%Y-%m-%dT%H:%M:%S'
        msec_format = '%s.%03dZ'
        formatter = logging.Formatter(format)
        formatter.default_time_format = date_format
        formatter.default_msec_format = msec_format

        # create handler cloud watch log
        handler = CloudWatchLogHandler(stream_name=log_stream_name,
                                       log_group=log_group_name,
                                       create_log_group=False,
                                       use_queues=False)
        handler.setFormatter(formatter)
        if (len(cw_logger.handlers) == 0):
            cw_logger.addHandler(handler)
    # setting cw logger
    log_level = os.getenv('LOG_LEVEL', default='INFO')
    cw_logger.setLevel(log_level)
    function_name = inspect.getframeinfo(current_frame)[2]
    extra = {
        'request_id': trace_id,
        'function_name': function_name
    }
    cw_logger_obj = CwLogAdapter(cw_logger, extra)
    return cw_logger_obj
