import os
import uuid
import json
import inspect
import copy
import ast
import string
import jmespath

from secrets import choice
from datetime import timedelta
from decimal import Decimal
from pytz import timezone
from datetime import datetime
from premembers.common import pm_log_adapter, date_utils, cw_log_adapter
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from premembers.const.const import CommonConst

LIST_INVITE_STATUS = ["-1", "0", "1"]
LIST_AUTHORITY = ["3", "2", "1"]
LIST_AUTHORITY_NUM = [3, 2, 1]


def get_response_by_response_body(status_code,
                                  response_body,
                                  is_response_json=True, content_type=None):
    if is_response_json:
        response_body = json.dumps(response_body, default=json_serial)

    response = {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin":
            get_environ(CommonConst.ALLOW_ORIGIN)
        },
        "body": response_body
    }

    if content_type:
        response['headers']['content-type'] = content_type
    return response


def get_response_error(error_code, status_code, error_id=None):
    response_body = {
        "code": error_code['code'],
        "message": error_code['message'],
        "description": error_code['description']
    }
    if (error_id):
        response_body['errorId'] = error_id
    return get_response_by_response_body(status_code.value, response_body)


def get_error_validate(error_code, name, value, params=None):
    message_error = error_code['message']
    if (params):
        message_error = message_error.format(*params)
    message = {
        "code": error_code['code'],
        "field": name,
        "value": value,
        "message": message_error
    }
    return message


def execute_mask(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if key in CommonConst.PERSONAL_INFO_KEYS:
                data[key] = CommonConst.PERSONAL_INFO_MASK
            elif isinstance(value, str):
                try:
                    value = ast.literal_eval(value)
                    execute_mask(value)
                    data[key] = json.dumps(value, default=json_serial)
                except Exception as e:
                    pass
            else:
                execute_mask(value)
    elif isinstance(data, list):
        for item in data:
            execute_mask(item)


def get_params_function(frame):
    args, _, _, values = inspect.getargvalues(frame)
    tmp_result1 = {}
    tmp_result2 = {}
    for i in args:
        if isinstance(values[i], (list, dict, str)):
            tmp_result1[i] = values[i]
        else:
            tmp_result2[i] = values[i]
    export_result = copy.deepcopy(tmp_result1)
    execute_mask(export_result)
    if tmp_result2:
        export_result.update(tmp_result2)
    return export_result


# Begin common write log
def begin_logger(trace_id, name, frame):
    pm_logger = pm_log_adapter.create_pm_logger(name, trace_id, frame)
    param = get_params_function(frame)
    pm_logger.info("start : parameter %s", param)
    return pm_logger


def begin_cw_logger(trace_id, name, frame):
    cw_logger = cw_log_adapter.create_cw_logger(name, trace_id, frame)
    param = get_params_function(frame)
    cw_logger.info("start : parameter %s", param)
    return cw_logger


def response(response, pm_logger):
    response_log = copy.deepcopy(response)
    execute_mask(response_log)
    pm_logger.info("end : response %s", response_log)
    return response


def error_validate(error_code, status_code, list_error, logger):
    response_body = {
        "code": error_code['code'],
        "errorId": str(uuid.uuid4()),
        "message": error_code['message'],
        "errors": list_error
    }
    response = get_response_by_response_body(status_code.value, response_body)
    logger.warning("end : response %s", response)
    return response


def error_common(error_code, status_code, pm_logger):
    error_id = str(uuid.uuid4())
    response = get_response_error(error_code, status_code, error_id)
    pm_logger.warning("end : response %s", response)
    return response


def error_exception(error_code,
                    status_code,
                    error_pm,
                    pm_logger,
                    exc_info=False):
    if type(error_pm) is not PmError:
        error_pm = PmError(cause_error=error_pm)
    response = get_response_error(error_code, status_code, error_pm.error_id)
    if exc_info is True:
        pm_logger.error(error_pm)
        pm_logger.exception("error_id: %s", error_pm.error_id)
        pm_logger.error("end : response %s", response)
    return response


def write_log_exception(error, pm_logger, exc_info=False):
    pm_error = PmError(cause_error=error)
    return write_log_pm_error(pm_error, pm_logger, exc_info=exc_info)


def write_log_warning(error, pm_logger):
    pm_error = PmError(cause_error=error)
    return write_log_pm_warning(pm_error, pm_logger)


def write_log_pm_warning(pm_error, pm_logger):
    pm_logger.warning(pm_error)
    pm_logger.warning("error_id: %s", pm_error.error_id, exc_info=True)
    return pm_error


def write_log_pm_error(pm_error, pm_logger, err_message=None, exc_info=False):
    if exc_info is True:
        pm_logger.error(pm_error)
        pm_logger.exception("error_id: %s", pm_error.error_id)
    if err_message is not None:
        pm_error.message = err_message
    return pm_error
# End common write log


def convert_list_response(trace_id,
                          list_items,
                          data_dict,
                          response_required=None,
                          is_cw_logger=False):
    if (is_cw_logger):
        logger = begin_cw_logger(trace_id, __name__, inspect.currentframe())
    else:
        logger = begin_logger(trace_id, __name__, inspect.currentframe())
    for index in range(len(list_items)):
        list_items[index] = convert_response(trace_id,
                                             list_items[index],
                                             data_dict,
                                             response_required,
                                             is_cw_logger=is_cw_logger)
    return response(list_items, logger)


def convert_response(trace_id,
                     data_items,
                     data_dict,
                     response_required=None,
                     is_cw_logger=False):
    if (is_cw_logger):
        logger = begin_cw_logger(trace_id, __name__, inspect.currentframe())
    else:
        logger = begin_logger(trace_id, __name__, inspect.currentframe())
    result = {}
    for key, value in data_items.items():
        if (isinstance(value, Decimal)):
            value = int(value)
        if value is None:
            value = ""
        if (check_key(key, data_dict)):
            result[data_dict[key]] = value
    if response_required is not None:
        for key, value in response_required.items():
            if check_key(key, result) is False:
                result[key] = value
    return response(result, logger)


def is_null(value):
    return value is None or len(str(value)) <= 0


def is_number(value):
    return value is not None and isinstance(value,
                                            int) and str(value).isdigit()


def is_str(value):
    return isinstance(value, str)


def is_list(value):
    return isinstance(value, list)


def get_current_date():
    now_utc = datetime.now(timezone('UTC'))
    return now_utc.strftime('%Y-%m-%d %H:%M:%S.') + '%03d' % (
        now_utc.microsecond // 1000)


def check_key(key, dictionary):
    if (dictionary is None):
        return False
    return key in dictionary.keys()


def get_uuid4():
    return str(uuid.uuid4())


def get_service_name(data_append=None):
    service_name = os.environ.get("SERVICE_NAME")
    if data_append:
        service_name += data_append
    return service_name


def get_stage(data_append=None):
    prefix = os.environ.get("STAGE")
    if data_append:
        prefix += data_append
    return prefix


def validate_invite_status(trace_id, invite_status):
    pm_logger = begin_logger(trace_id, __name__, inspect.currentframe())
    list_error = []
    if is_null(invite_status):
        list_error.append(get_error_validate(
            MsgConst.ERR_VAL_101, "inviteStatus", invite_status))
    elif invite_status not in LIST_INVITE_STATUS:
        params = []
        params.append(', '.join(LIST_INVITE_STATUS))
        list_error.append(get_error_validate(
            MsgConst.ERR_VAL_302, "inviteStatus", invite_status, params))
    return response(list_error, pm_logger)


def validate_authority(trace_id, authority):
    pm_logger = begin_logger(trace_id, __name__, inspect.currentframe())
    list_error = []
    if is_null(authority):
        list_error.append(get_error_validate(
            MsgConst.ERR_VAL_101, "authority", authority))
    elif authority not in LIST_AUTHORITY_NUM:
        params = []
        params.append(', '.join(LIST_AUTHORITY))
        list_error.append(get_error_validate(
            MsgConst.ERR_VAL_302, "authority", authority, params))
    return response(list_error, pm_logger)


def validate_language(language, param_name="language"):
    list_error = []
    if is_null(language):
        list_error.append(get_error_validate(
            MsgConst.ERR_VAL_101, param_name, language))
    elif language not in CommonConst.LANGUAGE_SUPPORT:
        params = []
        params.append(', '.join(CommonConst.LANGUAGE_SUPPORT))
        list_error.append(get_error_validate(
            MsgConst.ERR_VAL_302, param_name, language, params))
    return list_error


def get_environ(key, default_value=None):
    return os.environ.get(key, default_value)


def get_level(level):
    result = ""
    if level == 0:
        result = "NORMAL"
    elif level > 0 and level <= 10:
        result = "NOTICE"
    elif level > 10 and level <= 20:
        result = "CAUTION"
    elif level > 20 and level <= 30:
        result = "WARNING"
    else:
        result = "EMERGENCY"
    return result


def get_value(key, dictionary, default_value=CommonConst.BLANK):
    if check_key(key, dictionary):
        return dictionary[key]
    return default_value


def json_serial(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError("Type %s not serializable" % type(obj))


def get_password_temporary(number_character):
    alphabet = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(choice(alphabet) for i in range(number_character))
    return password


def get_time_to_live(days):
    time_to_live_date = date_utils.get_current_date() + timedelta(days=days)
    return Decimal(time_to_live_date.timestamp())


def check_excluded_resources(check_item_code, region_name, resource_type,
                             resource_name, excluded_resources):
    is_excluded_resources = False

    pattern_check_resource = "[?CheckItemCode == '{0}' && RegionName == '{1}' && ResourceType == '{2}' && ResourceName == '{3}']".format(
        check_item_code,
        region_name,
        resource_type,
        resource_name
    )

    if jmespath.search(pattern_check_resource, excluded_resources):
        is_excluded_resources = True

    return is_excluded_resources
