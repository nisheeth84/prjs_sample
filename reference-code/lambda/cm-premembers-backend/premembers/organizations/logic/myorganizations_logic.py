import inspect

from http import HTTPStatus
from premembers.const.msg_const import MsgConst
from premembers.common import common_utils
from premembers.repository import pm_affiliation, pm_organizations
from premembers.exception.pm_exceptions import PmError


def get_myorganizations(trace_id, user_id, invite_status):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # Validate
    list_error = common_utils.validate_invite_status(trace_id, invite_status)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)
    try:
        # get list affiliations by email,email get from event
        affiliations = pm_affiliation.query_userid_key_invite(
            trace_id, user_id, int(invite_status), True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    result = []
    for affiliation in affiliations:
        try:
            # get organization by organization id
            organization = pm_organizations.get_organization(
                trace_id, affiliation["organizationId"], True)
            affiliation.pop('organizationId', None)
            affiliation['organization'] = organization
            result.append(affiliation)
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)
    # return data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, affiliations)
    return common_utils.response(response, pm_logger)


def count_myorganizations(trace_id, user_id, invite_status):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # Validate
    list_error = common_utils.validate_invite_status(trace_id, invite_status)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)
    try:
        count = pm_affiliation.query_userid_key_invite_count(
            trace_id, user_id, int(invite_status))
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    response_body = {"count": count}
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, response_body)
    return common_utils.response(response, pm_logger)
