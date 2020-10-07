import json
import inspect

from http import HTTPStatus
from premembers.common import common_utils
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_orgNotifyMailDestinations, pm_affiliation
from premembers.repository import pm_orgNotifySlack

LIST_NOTIFY_CODE = ["CHECK_CIS"]


def delete_notifymail(trace_id, organization_id, notify_code):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 全てのチェックを行い、エラーがあった場合はログを出力してエラーレスポンスを返します。
    list_error = validate_notifymail(notify_code)
    if list_error:
        return common_utils.error_validate(
            MsgConst.ERR_REQUEST_201, HTTPStatus.UNPROCESSABLE_ENTITY,
            list_error, pm_logger)
    try:
        result = pm_orgNotifyMailDestinations.query_key(
            trace_id, organization_id, notify_code)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if (not result):
        return common_utils.error_common(
            MsgConst.ERR_301, HTTPStatus.NOT_FOUND, pm_logger)
    try:
        pm_orgNotifyMailDestinations.delete(trace_id, organization_id,
                                            notify_code)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_404,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.NO_CONTENT, None)
    return common_utils.response(response, pm_logger)


def validate_notifymail(notify_code, users=None):
    list_error = []

    # 通知コード
    if common_utils.is_null(notify_code):
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_101, "notifyCode", notify_code))
    elif notify_code not in LIST_NOTIFY_CODE:
        params = []
        params.append(', '.join(LIST_NOTIFY_CODE))
        list_error.append(common_utils.get_error_validate(
            MsgConst.ERR_VAL_302, "notifyCode", notify_code, params))

    # 宛先ユーザ
    if users is not None:
        if not common_utils.is_list(users):
            list_error.append(common_utils.get_error_validate(
                MsgConst.ERR_VAL_204, "users", users))
        elif len(users) == 0:
            list_error.append(common_utils.get_error_validate(
                MsgConst.ERR_VAL_101, "users", users))

    return list_error


def get_notifymail(trace_id, organization_id, notify_code):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 全てのチェックを行い、エラーがあった場合はログを出力してエラーレスポンスを返します。
    list_error = validate_notifymail(notify_code)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)
    try:
        result = pm_orgNotifyMailDestinations.query_key(
            trace_id, organization_id, notify_code, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if (not result):
        return common_utils.get_response_by_response_body(HTTPStatus.OK, [])

    # return data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, result)
    return common_utils.response(response, pm_logger)


def create_notifymail(trace_id, organization_id, data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # リクエストボディのJSONでパースエラーが発生した場合は、ログを出力してエラーレスポンスを返します。
    try:
        body_object = json.loads(data_body)
        notify_code = body_object["notifyCode"]
        users = body_object["users"]
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    # 全てのチェックを行い、エラーがあった場合はログを出力してエラーレスポンスを返します。
    list_error = validate_notifymail(notify_code, users)
    if list_error:
        return common_utils.error_validate(
            MsgConst.ERR_REQUEST_201, HTTPStatus.UNPROCESSABLE_ENTITY,
            list_error, pm_logger)

    # 宛先ユーザーのメールアドレスを取得します。
    destinations = []
    for user_id in users:
        try:
            affiliation = pm_affiliation.get_affiliation(
                user_id, organization_id)
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)

        # レコードが取得できなかった場合、そのユーザーは宛先ユーザーから除外します。
        if (not affiliation):
            continue

        # 宛先ユーザー配列は、ユーザーIDとメールアドレスを属性として持つオブジェクトの配列として表現します。
        destination = {
            "UserID": user_id,
            "MailAddress": affiliation['MailAddress']
        }
        destinations.append(destination)

    if len(destinations) == 0:
        list_error = []
        list_error.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_999,
                                            "users", users))
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    # 宛先情報を作成します。
    try:
        pm_orgNotifyMailDestinations.create(trace_id, organization_id,
                                            notify_code, destinations)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 宛先情報を取得します。
    try:
        result = pm_orgNotifyMailDestinations.query_key(
            trace_id, organization_id, notify_code, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, result)

    # return data response
    return common_utils.response(response, pm_logger)


def create_notifyslack(trace_id, organization_id, data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # リクエストボディのJSONでパースエラーが発生した場合は、ログを出力してエラーレスポンスを返します。
    try:
        body_object = json.loads(data_body)
        notify_code = body_object['notifyCode']
        webhook_url = body_object['webhookUrl']
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    mentions = None
    if common_utils.check_key('mentions', body_object):
        mentions = body_object['mentions']

    # バリデーションチェックを行います。
    list_error = validate_notifyslack(notify_code, webhook_url)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    # Slack通知設定情報を作成します。
    try:
        pm_orgNotifySlack.create(trace_id, organization_id, notify_code,
                                 webhook_url, mentions)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # get record created
    try:
        org_notify_slack_created = pm_orgNotifySlack.query_key(
            trace_id, organization_id, notify_code, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # return data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, org_notify_slack_created)
    return common_utils.response(response, pm_logger)


def get_notifyslack(trace_id, organization_id, notify_code):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 全てのチェックを行い、エラーがあった場合はログを出力してエラーレスポンスを返します。
    list_error = validate_notifyslack(notify_code)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    # Slack通知設定情報を取得します。
    try:
        result = pm_orgNotifySlack.query_key(trace_id, organization_id,
                                             notify_code, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not result:
        return common_utils.get_response_by_response_body(HTTPStatus.OK, [])

    # return data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, result)
    return common_utils.response(response, pm_logger)


def validate_notifyslack(notify_code, webhook_url=None):
    list_error = []

    # 通知コード
    if common_utils.is_null(notify_code):
        list_error.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_101, "notifyCode",
                                            notify_code))
    elif notify_code not in LIST_NOTIFY_CODE:
        params = []
        params.append(', '.join(LIST_NOTIFY_CODE))
        list_error.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_302, "notifyCode",
                                            notify_code, params))

    # webhookUrl
    if webhook_url is not None:
        if len(webhook_url) == 0:
            list_error.append(
                common_utils.get_error_validate(MsgConst.ERR_VAL_101,
                                                "webhookUrl", webhook_url))

    return list_error


def delete_notifyslack(trace_id, organization_id, notify_code):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 全てのチェックを行い、エラーがあった場合はログを出力してエラーレスポンスを返します。
    list_error = validate_notifyslack(notify_code)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    # Slack通知設定情報を取得します。
    try:
        result = pm_orgNotifySlack.query_key(trace_id, organization_id,
                                             notify_code)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 削除対象がなかった場合
    if (not result):
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # Slack通知設定情報を削除します。
    try:
        pm_orgNotifySlack.delete(trace_id, organization_id, notify_code)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_404,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.NO_CONTENT, None)
    return common_utils.response(response, pm_logger)
