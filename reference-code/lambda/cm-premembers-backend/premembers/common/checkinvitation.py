import inspect
from premembers.exception.pm_exceptions import PmError
from premembers.common import pm_log_adapter
from premembers.repository import pm_affiliation
from premembers.repository.const import InvitationStatus


def check_invitation(trace_id,
                     user_id,
                     organization_id,
                     invitation=InvitationStatus.Belong):
    pm_logger = pm_log_adapter.create_pm_logger(__name__, trace_id,
                                                inspect.currentframe())

    param = {
        'user_id': user_id,
        'organization_id': organization_id,
        'invitation': invitation,
    }
    pm_logger.info("start param %s", param)
    try:
        count = pm_affiliation.query_userid_key_invite_count(
            trace_id, user_id, invitation)
    except PmError as err:
        pm_logger.error(err)
        raise err
    if count < 1:
        error_message = "You do not have the necessary invitation."
        pm_logger.error(error_message)
        pm_logger.info("end")
        return False
    else:
        pm_logger.info("end")
        return True
