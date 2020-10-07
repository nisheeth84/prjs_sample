import inspect
import re

from urllib import request
from premembers.common import common_utils
from premembers.const.const import CommonConst


def send_message_slack(trace_id, webhook_url, data_json):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    headers = {
        'Content-Type': 'application/json',
        'Charset': 'utf-8'
    }
    try:
        req = request.Request(
            webhook_url,
            data=data_json.encode('utf-8'),
            headers=headers)
        request.urlopen(req)
    except Exception as e:
        raise common_utils.write_log_exception(e, pm_logger)


def convert_mentions(mentions):
    return "<!" + mentions.group(1) + ">"


def convert_command_slack(mentions):
    if common_utils.is_null(mentions):
        return CommonConst.BLANK
    mentions_command = re.sub(r'\@(channel|group|here|everyone)',
                              convert_mentions,
                              str(mentions)) + CommonConst.NEW_LINE

    return mentions_command
