import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from premembers.exception.pm_exceptions import PmError
from premembers.repository.const import InvitationStatus
from boto3.dynamodb.conditions import Attr

ORGANIZATION_INDEX = 'OrganizationIndex'
MAILADDRESS_INDEX = 'MailAddressIndex'

RESPONSE_AFFILIATION = {
    'UserID': 'id',
    'MailAddress': 'mailAddress',
    'OrganizationID': 'organizationId',
    'Authority': 'authority',
    'InvitationStatus': 'invitationStatus',
    'CreatedAt': 'createdAt',
    'UpdatedAt': 'updatedAt'
}


def get_affiliation(user_id, organization_id, convert_response=None):
    pm_logger = common_utils.begin_logger(user_id, __name__,
                                          inspect.currentframe())
    key = {"UserID": user_id, "OrganizationID": organization_id}
    result = DB_utils.query_key(user_id, Tables.PM_AFFILIATION, key)

    if result and convert_response:
        result = common_utils.convert_response(
            user_id, result, RESPONSE_AFFILIATION)
    return common_utils.response(result, pm_logger)


def create_affiliation(trace_id, email, user_id, organization_id, authority,
                       invitation_status):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    # 不要なクラムを作成することを避けるため
    date_now = common_utils.get_current_date()
    create_affiliation = {
        "MailAddress": email,
        "UserID": user_id,
        "OrganizationID": organization_id,
        "Authority": authority,
        "InvitationStatus": invitation_status,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    condition_expression = Attr("UserID").not_exists().__and__(
        Attr("OrganizationID").not_exists())
    DB_utils.create(trace_id, Tables.PM_AFFILIATION, create_affiliation,
                    condition_expression)


def query(user_id,
          organization_id,
          filter_expression=None,
          convert_response=None):
    pm_logger = common_utils.begin_logger(user_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'UserID': {
            'AttributeValueList': [user_id],
            'ComparisonOperator': 'EQ'
        },
        'OrganizationID': {
            'AttributeValueList': [organization_id],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query(user_id, Tables.PM_AFFILIATION,
                            key_conditions, filter_expression)
    if result and convert_response:
        result = common_utils.convert_list_response(
            user_id, result, RESPONSE_AFFILIATION)
    return common_utils.response(result, pm_logger)


def query_organization_index(trace_id,
                             organization_id,
                             filter_expression=None,
                             convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'OrganizationID': {
            'AttributeValueList': [organization_id],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query_index(trace_id, Tables.PM_AFFILIATION,
                                  ORGANIZATION_INDEX, key_conditions,
                                  filter_expression)
    if result and convert_response:
        result = common_utils.convert_list_response(
            trace_id, result, RESPONSE_AFFILIATION)
    return common_utils.response(result, pm_logger)


def query_userid_key(trace_id,
                     user_id,
                     organization_id=None,
                     filter_expression=None,
                     convert_response=None,
                     is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    key_conditions = {
        'UserID': {
            'AttributeValueList': [user_id],
            'ComparisonOperator': 'EQ'
        }
    }
    if (organization_id):
        key_conditions['OrganizationID'] = {
            'AttributeValueList': [organization_id],
            'ComparisonOperator': 'EQ'
        }
    result = DB_utils.query(trace_id,
                            Tables.PM_AFFILIATION,
                            key_conditions,
                            filter_expression,
                            is_cw_logger=is_cw_logger)
    if result and convert_response:
        result = common_utils.convert_list_response(trace_id,
                                                    result,
                                                    RESPONSE_AFFILIATION,
                                                    is_cw_logger=is_cw_logger)
    return common_utils.response(result, logger)


def query_userid_key_count(trace_id,
                           user_id,
                           organization_id=None,
                           filter_expression=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    result = query_userid_key(trace_id, user_id, organization_id,
                              filter_expression)
    return common_utils.response(len(result), pm_logger)


def delete_affiliation(user_id, organization_id):
    common_utils.begin_logger(user_id, __name__, inspect.currentframe())
    key = {"UserID": user_id, "OrganizationID": organization_id}
    DB_utils.delete(user_id, Tables.PM_AFFILIATION, key)


def query_organization_by_email(trace_id, mail_address):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'MailAddress': {
            'AttributeValueList': [mail_address],
            'ComparisonOperator': 'EQ'
        }
    }
    filter_expression = Attr('InvitationStatus').eq(1)
    result = DB_utils.query_index(trace_id, Tables.PM_AFFILIATION,
                                  MAILADDRESS_INDEX, key_conditions,
                                  filter_expression)
    return common_utils.response(result, pm_logger)


def query_user_id_check_authority_count(trace_id, user_id, organization_id,
                                        authority):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    check_authority_filter = create_check_authority_filter(
        trace_id, authority)
    try:
        count = query_userid_key_count(trace_id, user_id, organization_id,
                                       check_authority_filter)
    except PmError as e:
        pm_logger.error(e)
        raise e
    return common_utils.response(count, pm_logger)


def query_userid_key_invite(trace_id,
                            user_id,
                            invite_status,
                            convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    invite_filter = create_check_invitation_filter(trace_id, invite_status)

    try:
        results = query_userid_key(trace_id, user_id, None, invite_filter,
                                   convert_response)
    except PmError as e:
        pm_logger.error(e)
        raise e
    return common_utils.response(results, pm_logger)


def query_userid_key_invite_count(trace_id, user_id, invite_status):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    invite_filter = create_check_invitation_filter(trace_id, invite_status)

    try:
        count = query_userid_key_count(trace_id, user_id, None, invite_filter)
    except PmError as e:
        pm_logger.error(e)
        raise e
    return common_utils.response(count, pm_logger)


def create_check_authority_filter(trace_id, authority):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    filter = Attr('InvitationStatus').eq(
        InvitationStatus.Belong.value).__and__(
            Attr("Authority").gte(authority.value))
    return common_utils.response(filter, pm_logger)


def create_check_invitation_filter(trace_id, invitation_status):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    filter = Attr('InvitationStatus').eq(invitation_status)
    return common_utils.response(filter, pm_logger)


def query_users_organization_index(trace_id,
                                   organization_id,
                                   invite_status=None,
                                   convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    if common_utils.is_null(invite_status):
        users = query_organization_index(
            trace_id, organization_id, convert_response=convert_response)
    else:
        filter = Attr('InvitationStatus').eq(int(invite_status))
        users = query_organization_index(trace_id, organization_id, filter,
                                         convert_response)
    return common_utils.response(users, pm_logger)


def create_check_authority_user_filter(trace_id, authority, user_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    filter = Attr('InvitationStatus').eq(
        InvitationStatus.Belong.value).__and__(
            Attr("Authority").gte(authority.value)).__and__(
                Attr("UserID").ne(user_id))
    return common_utils.response(filter, pm_logger)


def query_users_check_authority_count(trace_id, user_id, organization_id,
                                      authority):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    check_authority_filter = create_check_authority_user_filter(
        trace_id, authority, user_id)
    try:
        result = query_organization_index(
            trace_id,
            organization_id,
            check_authority_filter,
            convert_response=None)
    except PmError as e:
        pm_logger.error(e)
        raise e
    return common_utils.response(len(result), pm_logger)


def update_affiliation(trace_id, user_id, organization_id, update_attribute,
                       target_update_date):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())

    key = {"UserID": user_id, "OrganizationID": organization_id}
    DB_utils.update(trace_id, Tables.PM_AFFILIATION, key, update_attribute,
                    target_update_date)


def query_affiliation_filter_invite(trace_id,
                                    user_id,
                                    organization_id,
                                    invite_status,
                                    convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    invite_filter = create_check_invitation_filter(trace_id, invite_status)

    try:
        results = query_userid_key(trace_id, user_id, organization_id,
                                   invite_filter, convert_response)
    except PmError as e:
        pm_logger.error(e)
        raise e
    return common_utils.response(results, pm_logger)
