import logging
import inspect
import os
import re
from distutils.util import strtobool


class PmLogAdapter(logging.LoggerAdapter):
    def process(self, msg, kwargs):
        message_obj = {
            'trace_id': self.extra['trace_id'],
            'file_name': self.extra['file_name'],
            'operation_name': self.extra['operation_name'],
            'msg': msg
        }

        return 'trace_id:{trace_id} file_name:{file_name} function_name:{operation_name} {msg}'.format(
            **message_obj), kwargs


def create_pm_logger(name, trace_id, current_frame=None):
    pm_logger = logging.getLogger(name)
    env_is_running_aws_batch = os.getenv('RUNNING_AWS_BATCH', 'False')
    is_running_aws_batch = bool(strtobool(env_is_running_aws_batch))
    if (is_running_aws_batch):
        format = "[%(levelname)s] %(asctime)s %(message)s"
        date_format = '%Y-%m-%dT%H:%M:%S'
        msec_format = '%s.%03dZ'
        formatter = logging.Formatter(format)
        formatter.default_time_format = date_format
        formatter.default_msec_format = msec_format
        ch = logging.StreamHandler()
        ch.setFormatter(formatter)
        if (len(pm_logger.handlers) == 0):
            pm_logger.addHandler(ch)
    log_level = os.getenv('LOG_LEVEL', default='INFO')
    pm_logger.setLevel(log_level)
    full_file_name = inspect.getframeinfo(current_frame)[0]
    file_name = trim_file_name(full_file_name)
    operation_name = inspect.getframeinfo(current_frame)[2]
    extra = {
        'trace_id': trace_id,
        'file_name': file_name,
        'operation_name': operation_name
    }
    pm_logger_obj = PmLogAdapter(pm_logger, extra)
    return pm_logger_obj


def trim_file_name(file_name):
    p = re.compile('/.*/premembers(/.*)')
    trim_result = p.search(file_name).group(1)
    return trim_result
