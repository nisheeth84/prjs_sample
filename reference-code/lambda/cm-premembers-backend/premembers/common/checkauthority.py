from premembers.exception.pm_exceptions import PmError
from premembers.common import pm_log_adapter, common_utils
from premembers.const.msg_const import MsgConst
from premembers.repository import pm_affiliation
from premembers.repository.const import Authority
import inspect
from http import HTTPStatus


def check_authority(trace_id,
                    user_id,
                    organization_id,
                    authority=Authority.Owner):
    pm_logger = pm_log_adapter.create_pm_logger(__name__, trace_id,
                                                inspect.currentframe())

    param = {
        'user_id': user_id,
        'organization_id': organization_id,
        'authority': authority,
    }
    pm_logger.info("start param %s", param)
    try:
        count = pm_affiliation.query_user_id_check_authority_count(
            trace_id, user_id, organization_id, authority)
    except PmError as e:
        pm_logger.error(e)
        raise e
    if count < 1:
        error_message = "指定の組織に所属していないか、必要とする権限を持っていません。"
        pm_logger.error(error_message)
        pm_logger.info("end")
        return False
    else:
        pm_logger.info("end")
        return True


def authority(trace_id, user_id, organization_id, authority):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    response = None
    try:
        is_access_ok = check_authority(
            trace_id, user_id, organization_id, authority)
        if (not is_access_ok):
            return common_utils.error_common(
                MsgConst.ERR_101, HTTPStatus.FORBIDDEN, pm_logger)
    except PmError as e:
        return common_utils.error_exception(
            MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR, e, pm_logger)
    return common_utils.response(response, pm_logger)
