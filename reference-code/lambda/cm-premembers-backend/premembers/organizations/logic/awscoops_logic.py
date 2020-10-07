import json
import uuid
import inspect

from http import HTTPStatus
from premembers.common import common_utils, checkaccess, aws_common
from premembers.const.msg_const import MsgConst
from premembers.const.const import CommonConst
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_projects, pm_awsAccountCoops
from premembers.repository.const import Effective
from premembers.common import IAMUtils


def get_list_awscoops(trace_id, organization_id, project_id, effective):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    try:
        awscoops = pm_awsAccountCoops.query_awscoops_filter_organization(
            trace_id, project_id, organization_id,
            effective, convert_response=True)
    except PmError as err:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    # response when do success
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, awscoops)
    return common_utils.response(response, pm_logger)


def get_awscoop(trace_id, coop_id, project_id, organization_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        awscoop = pm_awsAccountCoops.query_awscoop_filter_organization_project(
            trace_id, coop_id, organization_id, project_id,
            convert_response=True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 組織情報を取得します。
    if (not awscoop):
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # data response
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, awscoop[0])
    return common_utils.response(response, pm_logger)


def create_awscoops(trace_id, project_id, organization_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        project = pm_projects.get_projects_by_organization_id(
            trace_id, project_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 組織情報を取得します。
    if (not project):
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # Create AWSアカウント連携
    coop_id = str(uuid.uuid4())
    aws_account = CommonConst.UNKNOWN
    aws_account_name = None
    role_name = None
    external_id = str(uuid.uuid4())
    description = None
    effective = Effective.UnConfirmed.value

    try:
        pm_awsAccountCoops.create_awscoops(
            trace_id, coop_id, aws_account, aws_account_name, role_name,
            external_id, description, effective, organization_id, project_id)
    except PmError as e:
        return common_utils.error_exception(
            MsgConst.ERR_DB_403, HTTPStatus.INTERNAL_SERVER_ERROR,
            e, pm_logger, True)

    # Get data response
    try:
        awscoops_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id, convert_response=True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # return data response
    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, awscoops_item)
    return common_utils.response(response, pm_logger)


def delete_awscoop(trace_id, coop_id, organization_id, project_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        awscoops = pm_awsAccountCoops.get_awscoops_update(
            trace_id, coop_id, project_id, organization_id)
    except PmError as err:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    if awscoops is None:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    try:
        pm_awsAccountCoops.delete_awscoops(trace_id, coop_id)
    except PmError as err:
        return common_utils.error_exception(MsgConst.ERR_DB_405,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    # response if delete success
    response = common_utils.get_response_by_response_body(
        HTTPStatus.NO_CONTENT, None)
    return common_utils.response(response, pm_logger)


def update_awscoop(trace_id, project_id, organization_id, coop_id,
                   data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # Parse JSON
    try:
        body_object = json.loads(data_body)
        aws_account = body_object["awsAccount"]
        role_name = body_object["roleName"]
        description = body_object["description"]
        aws_account_name = body_object['awsAccountName']
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    # Validate
    list_error = validate_update_awscoop(aws_account, role_name)
    if list_error:
        return common_utils.error_validate(
            MsgConst.ERR_REQUEST_201, HTTPStatus.UNPROCESSABLE_ENTITY,
            list_error, pm_logger)

    # Get data AWSアカウント連携
    try:
        awscoops_item = pm_awsAccountCoops.get_awscoops_update(
            trace_id, coop_id, project_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 組織情報を取得します。
    if awscoops_item is None:
        return common_utils.error_common(
            MsgConst.ERR_301, HTTPStatus.NOT_FOUND, pm_logger)

    # ロールのアクセス確認
    if common_utils.is_null(description):
        description = None
    if common_utils.is_null(aws_account_name):
        aws_account_name = None
    external_id = awscoops_item['ExternalID']
    effective = Effective.Disable.value
    members = None
    if (checkaccess.check_access_to_aws(trace_id, aws_account, role_name,
                                        external_id)):
        effective = Effective.Enable.value

        # IAMクライアントを用いて、IAMロールcm-membersportalを取得します。
        try:
            session = aws_common.create_session_client(trace_id, aws_account,
                                                       role_name, external_id)
            members = IAMUtils.get_membership_aws_account(
                trace_id, session, aws_account)
        except PmError as e:
            common_utils.write_log_pm_error(e, pm_logger, exc_info=True)

    # update project
    attribute = {
        'AWSAccount': {
            "Value": aws_account
        },
        'RoleName': {
            "Value": role_name
        },
        'Description': {
            "Value": description
        },
        'Effective': {
            "Value": effective
        },
        'AWSAccountName': {
            "Value": aws_account_name
        }
    }
    if (members is not None):
        attribute['Members'] = {
            "Value": members
        }
    updated_at = awscoops_item['UpdatedAt']

    try:
        pm_awsAccountCoops.update_awscoops(trace_id, coop_id, attribute,
                                           updated_at)
    except PmError as e:
        return common_utils.error_exception(
            MsgConst.ERR_DB_403, HTTPStatus.INTERNAL_SERVER_ERROR,
            e, pm_logger, True)

    # Get data response
    try:
        awscoops_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id, convert_response=True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # return data response
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, awscoops_item)
    return common_utils.response(response, pm_logger)


def validate_update_awscoop(aws_account, role_name):
    list_error = []

    # AWSアカウントID
    if common_utils.is_null(aws_account):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "awsAccount", aws_account))
    elif not common_utils.is_str(aws_account):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_202, "awsAccount", aws_account))

    # ロール名
    if common_utils.is_null(role_name):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "roleName", role_name))
    elif not common_utils.is_str(role_name):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_202, "roleName", role_name))

    return list_error
