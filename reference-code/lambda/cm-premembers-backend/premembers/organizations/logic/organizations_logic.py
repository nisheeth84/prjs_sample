import json
import uuid
import inspect
import re

from http import HTTPStatus
from jinja2 import Template
from datetime import timedelta
from premembers.common import common_utils, aws_common, FileUtils, date_utils
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_organizations, pm_affiliation
from premembers.repository import pm_organizationTasks, pm_userAttribute
from premembers.repository.const import Authority, InvitationStatus, Status
from premembers.const.const import CommonConst
from premembers.repository.const import MessageAction

LIST_SERVICE_NAME = CommonConst.LIST_SERVICE_NAME


def get_organization(trace_id, organization_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    try:
        organization = pm_organizations.get_organization(
            trace_id, organization_id, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 組織情報を取得します。
    if (not organization):
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # data response
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, organization)
    return common_utils.response(response, pm_logger)


def create_organization(trace_id, email, data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # Parse JSON
    try:
        body_object = json.loads(data_body)
        organization_name = body_object["name"]
        contract = body_object["contract"]
        contract_status = body_object["contractStatus"]
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    # Validate
    list_error = validate_insert(organization_name, contract, contract_status)
    if list_error:
        return common_utils.error_validate(
            MsgConst.ERR_REQUEST_201, HTTPStatus.UNPROCESSABLE_ENTITY,
            list_error, pm_logger)

    # Create Organization
    organization_id = str(uuid.uuid4())
    try:
        pm_organizations.create_organization(
            trace_id, organization_id, organization_name,
            contract, contract_status)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # Create Affiliation
    try:
        pm_affiliation.create_affiliation(
            trace_id, email, trace_id, organization_id, Authority.Owner.value,
            InvitationStatus.Belong.value)
    except PmError as e:
        # Delete Organizations
        pm_organizations.delete_organization(trace_id, organization_id)

        # 例外スタックトレースをログに出力する。
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 組織情報を取得します。
    try:
        organization_item = pm_organizations.get_organization(
            trace_id, organization_id, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, organization_item)

    # return data response
    return common_utils.response(response, pm_logger)


def update_organization(trace_id, organization_id, data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # Parse JSON
    try:
        body_object = json.loads(data_body)
        organization_name = body_object["name"]
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    # Validate
    list_error = validate_update(organization_name)
    if list_error:
        return common_utils.error_validate(
            MsgConst.ERR_REQUEST_201, HTTPStatus.UNPROCESSABLE_ENTITY,
            list_error, pm_logger)

    # Databaseから組織情報を取得する
    try:
        organization_item = pm_organizations.get_organization(
            trace_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(
            MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR,
            e, pm_logger, True)

    if (not organization_item):
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # Update Organization
    attribute = {'OrganizationName': {"Value": organization_name}}
    updated_at = organization_item['UpdatedAt']
    try:
        pm_organizations.update_organization(
            trace_id, organization_id, attribute, updated_at)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_404,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # Get data update
    try:
        organization_result = pm_organizations.get_organization(
            trace_id, organization_id, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, organization_result)

    # return data response
    return common_utils.response(response, pm_logger)


def validate_insert(organization_name, contract, contract_status):
    list_error = []

    # 組織名
    if common_utils.is_null(organization_name):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "name", organization_name))
    elif not common_utils.is_str(organization_name):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_202, "name", organization_name))

    # 契約種別
    if common_utils.is_null(contract):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "contract", contract))
    elif not common_utils.is_number(contract):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_201, "contract", contract))

    # 契約状態
    if common_utils.is_null(contract_status):
        list_error.append(
            common_utils.get_error_validate(
                MsgConst.ERR_VAL_101, "contractStatus", contract_status))
    elif not common_utils.is_number(contract_status):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_201, "contractStatus", contract_status))

    return list_error


def validate_update(organization_name):
    list_error = []

    # 組織名
    if common_utils.is_null(organization_name):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "name", organization_name))
    elif not common_utils.is_str(organization_name):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_202, "name", organization_name))

    return list_error


def delete_organization(trace_id, email, organization_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        organization_item = pm_organizations.get_organization(
            trace_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if (not organization_item):
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    try:
        # delete organization
        pm_organizations.delete_organization(trace_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_405,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    try:
        # get affiliations get by organization id
        affiliation_items = pm_affiliation.query_organization_index(
            trace_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    for affiliation in affiliation_items:
        try:
            # delete affiliations get by organization id
            pm_affiliation.delete_affiliation(affiliation["UserID"],
                                              organization_id)
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_DB_405, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)

        # set task informaiton request delete in Organization Tasks
        task_id = common_utils.get_uuid4()
        target = CommonConst.TARGET_DELETE_ORG_USER.format(
            affiliation["UserID"], organization_id)

        try:
            # create task informaiton request delete in Organization Tasks
            pm_organizationTasks.create_organizationTask(
                trace_id, task_id, CommonConst.TASK_TYPE_CODE_DELETE_ORG_USER,
                target, trace_id, email, Status.Waiting.value, 0, 3)
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_DB_403, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)

        try:
            # Send message to organization topic task
            aws_common.sns_organization_topic(
                trace_id, task_id, CommonConst.TASK_TYPE_CODE_DELETE_ORG_USER)
        except PmError as e:
            common_utils.write_log_pm_error(e, pm_logger, exc_info=True)

    # set task informaiton request delete in Organization Tasks
    task_id = common_utils.get_uuid4()
    try:
        # create task informaiton request delete in Organization Tasks
        pm_organizationTasks.create_organizationTask(
            trace_id, task_id, CommonConst.TASK_TYPE_CODE_DELETE_ORG,
            organization_id, trace_id, email, 0, 0, 3)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # Send message to organization topic task
    aws_common.sns_organization_topic(trace_id, task_id,
                                      CommonConst.TASK_TYPE_CODE_DELETE_ORG,
                                      organization_id, trace_id)
    # response if delete success
    response = common_utils.get_response_by_response_body(
        HTTPStatus.NO_CONTENT, None)
    return common_utils.response(response, pm_logger)


def get_list_users(trace_id, organization_id, invite_status):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # Validate
    if not common_utils.is_null(invite_status):
        list_error = common_utils.validate_invite_status(
            trace_id, invite_status)
        if list_error:
            return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                               HTTPStatus.UNPROCESSABLE_ENTITY,
                                               list_error, pm_logger)
    try:
        users = pm_affiliation.query_users_organization_index(
            trace_id, organization_id, invite_status, convert_response=True)
    except PmError as err:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    # response when do success
    response = common_utils.get_response_by_response_body(HTTPStatus.OK, users)
    return common_utils.response(response, pm_logger)


def delete_user(trace_id, organization_id, user_id, email):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # check the deletion condition
    if user_id == trace_id:
        try:
            count = pm_affiliation.query_users_check_authority_count(
                trace_id, user_id, organization_id, Authority.Owner)
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)
        if count == 0:
            return common_utils.error_common(MsgConst.ERR_REQUEST_203,
                                             HTTPStatus.PRECONDITION_FAILED,
                                             pm_logger)
    # get user to delete
    try:
        user = pm_affiliation.query(user_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if not user:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # delete user
    try:
        pm_affiliation.delete_affiliation(user_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_405,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # set task informaiton request delete in Organization Tasks
    task_id = str(uuid.uuid4())
    target = CommonConst.TARGET_DELETE_ORG_USER.format(
        user_id, organization_id)

    try:
        # create task informaiton request delete in Organization Tasks
        pm_organizationTasks.create_organizationTask(
            trace_id, task_id, CommonConst.TASK_TYPE_CODE_DELETE_ORG_USER,
            target, trace_id, email, Status.Waiting.value, 0, 3)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    try:
        # Send message to organization topic task
        aws_common.sns_organization_topic(
            trace_id, task_id, CommonConst.TASK_TYPE_CODE_DELETE_ORG_USER)
    except PmError as e:
        common_utils.write_log_pm_error(e, pm_logger, exc_info=True)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.NO_CONTENT, None)
    return common_utils.response(response, pm_logger)


def update_authority(trace_id, organization_id, user_id, data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # Parse JSON
    try:
        body_object = json.loads(data_body)
        authority = body_object["authority"]
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    # Validate
    list_error = common_utils.validate_authority(trace_id, authority)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    # check the update condition
    if user_id == trace_id and authority != Authority.Owner.value:
        try:
            count = pm_affiliation.query_users_check_authority_count(
                trace_id, user_id, organization_id, Authority.Owner)
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)
        if count == 0:
            return common_utils.error_common(MsgConst.ERR_REQUEST_203,
                                             HTTPStatus.PRECONDITION_FAILED,
                                             pm_logger)
    # get user to update
    try:
        user = pm_affiliation.query(user_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if not user:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # update user authority
    attribute = {
        'Authority': {
            "Value": authority
        }
    }
    updated_at = user[0]['UpdatedAt']
    try:
        pm_affiliation.update_affiliation(trace_id, user_id, organization_id,
                                          attribute, updated_at)
    except PmError as err:
        return common_utils.error_exception(MsgConst.ERR_DB_404,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    # Get data update
    try:
        user_result = pm_affiliation.get_affiliation(
            user_id, organization_id, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, user_result)

    # return data response
    return common_utils.response(response, pm_logger)


def validate_params_invite(trace_id, mail_address, authority):
    list_error = []

    if common_utils.is_null(mail_address):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "mail_address", mail_address))

    if common_utils.validate_authority(trace_id, authority):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "authority", authority))

    return list_error


def create_invite(trace_id, organization_id, data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    attributesToGet = "email_verified"
    key = "Name"
    value = "Value"

    # Parse JSON
    try:
        body_object = json.loads(data_body)
        mail_address = body_object["mailAddress"]
        authority = body_object["authority"]
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    # validate authority
    list_error = validate_params_invite(trace_id, mail_address, authority)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    # get list cognito users
    try:
        list_users = aws_common.get_cognito_user_pools(
            trace_id, mail_address, attributesToGet)
        if len(list_users) == 0:
            list_error = []
            list_error.append(
                common_utils.get_error_validate(MsgConst.ERR_VAL_999,
                                                "mail_address", mail_address))
            return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                               HTTPStatus.UNPROCESSABLE_ENTITY,
                                               list_error, pm_logger)

        list_user_verified = []
        for user in list_users:
            # get value of key email_verified in attribute
            for user_attr in user["Attributes"]:
                if common_utils.check_key(
                        key, user_attr) and user_attr[key] == attributesToGet:
                    email_verified = user_attr[value]

            # check email_verified is true
            if email_verified == "true":
                list_user_verified.append(user["Username"])
        if len(list_user_verified) == 0:
            list_error = []
            list_error.append(
                common_utils.get_error_validate(MsgConst.ERR_VAL_999,
                                                "mail_address", mail_address))
            return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                               HTTPStatus.UNPROCESSABLE_ENTITY,
                                               list_error, pm_logger)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_COGNITO_501,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # get affiliation
    try:
        user_id = list_user_verified[0]
        affiliation = pm_affiliation.get_affiliation(user_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if affiliation and affiliation["InvitationStatus"] != InvitationStatus.Deny:
        return common_utils.error_common(MsgConst.ERR_302, HTTPStatus.CONFLICT,
                                         pm_logger)

    # get organization
    try:
        organization = pm_organizations.get_organization(
            trace_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not organization:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # create affiliation
    try:
        pm_affiliation.create_affiliation(trace_id, mail_address, user_id,
                                          organization_id, authority,
                                          InvitationStatus.Invited)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    # get affiliation just create new to response
    try:
        affiliation_created = pm_affiliation.get_affiliation(
            user_id, organization_id, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, affiliation_created)

    # return data response
    return common_utils.response(response, pm_logger)


def accept_invite(trace_id, organization_id, user_id, user_id_sign_in):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # check user sign in and parameter user id
    if user_id_sign_in != user_id:
        return common_utils.error_common(MsgConst.ERR_101,
                                         HTTPStatus.FORBIDDEN, pm_logger)
    response = change_invite(trace_id, organization_id, user_id,
                             InvitationStatus.Belong)

    # return data response
    return common_utils.response(response, pm_logger)


def reject_invite(trace_id, organization_id, user_id, user_id_sign_in):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # check user sign in and parameter user id
    if user_id_sign_in != user_id:
        return common_utils.error_common(MsgConst.ERR_101,
                                         HTTPStatus.FORBIDDEN, pm_logger)
    response = change_invite(trace_id, organization_id, user_id,
                             InvitationStatus.Deny)

    # return data response
    return common_utils.response(response, pm_logger)


def change_invite(trace_id, organization_id, user_id, invite):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # get affiliation
    try:
        affiliation = pm_affiliation.query_affiliation_filter_invite(
            trace_id, user_id, organization_id, InvitationStatus.Invited)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not affiliation:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # update invite
    attribute = {
        'InvitationStatus': {
            "Value": invite
        }
    }
    updated_at = affiliation[0]['UpdatedAt']
    try:
        pm_affiliation.update_affiliation(trace_id, user_id, organization_id,
                                          attribute, updated_at)
    except PmError as err:
        return common_utils.error_exception(MsgConst.ERR_DB_404,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    # Get data update
    try:
        affiliation_result = pm_affiliation.get_affiliation(
            user_id, organization_id, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, affiliation_result)

    # return data response
    return common_utils.response(response, pm_logger)


def execute_force_invites(trace_id, body_object, organization_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # parse json
    try:
        body_object_json = json.loads(body_object)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    caller_service_name = common_utils.get_value("callerServiceName",
                                                 body_object_json, None)
    mail_lang = common_utils.get_value("mailLang", body_object_json, None)
    mail_address = common_utils.get_value("mailAddress", body_object_json,
                                          None)
    authority = common_utils.get_value("authority", body_object_json, None)

    # validate param execute invite unregistered
    list_error = validate_param_invite_unregistered_user(
        trace_id, mail_lang, caller_service_name, mail_address, authority)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    # get list cognito users
    try:
        list_users = aws_common.get_cognito_user_pools(trace_id, mail_address)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_COGNITO_501,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if list_users:
        return common_utils.error_common(MsgConst.ERR_302, HTTPStatus.CONFLICT,
                                         pm_logger)

    # regist Cognito UserPools
    temporary_password = ''
    pattern = re.compile(CommonConst.FORMAT_PASSWORD_TEMPORARY)
    while pattern.match(temporary_password) is None:
        temporary_password = common_utils.get_password_temporary(
            CommonConst.NUMBER_CHARACTERS_PASSWORD_TEMPORARY)

    user_attributes = [
        {
            "Name": "email",
            "Value": mail_address
        }
    ]
    user_name = common_utils.get_uuid4()
    message_action = MessageAction.Suppress
    try:
        aws_common.process_admin_create_user_pools(
            trace_id, user_name, user_attributes, temporary_password,
            message_action)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_COGNITO_501,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # enable confirm email
    try:
        user_attributes = [
            {
                'Name': 'email_verified',
                'Value': 'true'
            }
        ]
        aws_common.update_cognito_user_attributes(trace_id, user_name,
                                                  user_attributes)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_COGNITO_501,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # get affiliation
    try:
        affiliation = pm_affiliation.get_affiliation(user_name,
                                                     organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if affiliation and affiliation["InvitationStatus"] != InvitationStatus.Deny:
        return common_utils.error_common(MsgConst.ERR_302, HTTPStatus.CONFLICT,
                                         pm_logger)

    # get organization
    try:
        organization = pm_organizations.get_organization(
            trace_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if len(organization) == 0:
        return common_utils.error_common(
            MsgConst.ERR_301, HTTPStatus.NOT_FOUND, pm_logger)

    # create affiliation
    try:
        pm_affiliation.create_affiliation(trace_id, mail_address, user_name,
                                          organization_id, authority,
                                          InvitationStatus.Invited)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # Get data affiliation
    try:
        affiliation_result = pm_affiliation.get_affiliation(
            user_name, organization_id, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # Get data user_attribute
    try:
        user_attribute = pm_userAttribute.query_key(trace_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # S3から通知メール送信設定ファイルを取得します。
    try:
        config = FileUtils.read_yaml(trace_id, CommonConst.S3_SETTING_BUCKET,
                                     CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
    except PmError as e:
        pm_logger.error("メール送信設定ファイルの取得に失敗しました。:s3://{0}/{1}".format(
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL))
        return common_utils.error_exception(MsgConst.ERR_S3_702,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # メッセージ本文を作成します。
    path_file_template = config[
        CommonConst.KEY_GET_PATH_FILE_TEMPLATE_USER_INVITE_MAIL.format(
            language=mail_lang, serviceName=caller_service_name)]
    try:
        template_body_mail = FileUtils.read_decode(
            trace_id, CommonConst.S3_SETTING_BUCKET, path_file_template)
    except PmError as e:
        pm_logger.error("招待メール本文テンプレートファイルの取得に失敗しました。:s3://{0}/{1}".format(
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            path_file_template))
        return common_utils.error_exception(MsgConst.ERR_S3_702,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # SESで通知メールを送信します。
    bcc_addresses = [
        mail_address
    ]
    user_name_sign_in = common_utils.get_value("UserName", user_attribute,
                                               None)
    if not user_name_sign_in:
        try:
            affiliation_sign_in = pm_affiliation.get_affiliation(
                trace_id, organization_id)
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)
        user_name_sign_in = common_utils.get_value("MailAddress",
                                                   affiliation_sign_in, None)

    organization_name = common_utils.get_value("OrganizationName",
                                               organization, None)
    time_zone = date_utils.get_time_zone_by_language(mail_lang)
    time_to_live_date = date_utils.get_current_date() + timedelta(days=6)
    time_to_live = date_utils.toString(
        time_to_live_date, date_utils.PATTERN_YYYYMMDD_SLASH, time_zone)
    template_body_mail = Template(template_body_mail)
    context = {
        'mailAddress': mail_address,
        'userName': user_name_sign_in,
        'organizationName': organization_name,
        'temporaryPassword': temporary_password,
        'timeToLive': time_to_live
    }
    body_mail = template_body_mail.render(context)
    mail_subject = config[CommonConst.KEY_MAIL_SUBJECT_USER_INVITE.format(
        language=mail_lang, serviceName=caller_service_name)]
    mail_from = config[CommonConst.KEY_INVITE_MAIL_FROM_SERVICE.format(
        serviceName=caller_service_name)]
    ses_region = config['ses.region']
    try:
        aws_common.send_email(user_name, ses_region, mail_from, bcc_addresses,
                              mail_subject, body_mail)
    except PmError as e:
        pm_logger.error("通知メール送信に失敗しました。")
        return common_utils.error_exception(MsgConst.ERR_SES_801,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, affiliation_result)

    # return data response
    return common_utils.response(response, pm_logger)


def validate_param_invite_unregistered_user(
        trace_id, mail_lang, caller_service_name, mail_address, authority):
    list_error = []

    # validate mailLang
    list_error_language = common_utils.validate_language(
        mail_lang, param_name="mailLang")
    if list_error_language:
        list_error.extend(list_error_language)

    # validate callerServiceName
    if common_utils.is_null(caller_service_name):
        list_error.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_101,
                                            "callerServiceName",
                                            caller_service_name))
    elif caller_service_name not in LIST_SERVICE_NAME:
        params = []
        params.append(', '.join(LIST_SERVICE_NAME))
        list_error.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_302,
                                            "callerServiceName",
                                            caller_service_name, params))

    # validate mailAddress
    if common_utils.is_null(mail_address):
        list_error.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_101,
                                            "mailAddress", mail_address))

    # validate authority
    list_error_authority = common_utils.validate_authority(trace_id, authority)
    if list_error_authority:
        list_error.extend(list_error_authority)

    return list_error
