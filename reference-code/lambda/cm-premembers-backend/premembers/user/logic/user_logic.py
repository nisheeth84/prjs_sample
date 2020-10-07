import json
import inspect
import jmespath

from jinja2 import Template
from http import HTTPStatus
from premembers.common import common_utils, aws_common, FileUtils
from premembers.const.msg_const import MsgConst
from premembers.const.const import CommonConst
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_userAttribute, pm_emailChangeApply
from premembers.repository import pm_affiliation, pm_orgNotifyMailDestinations
from premembers.repository.const import MailStatus

LIST_SERVICE_NAME = CommonConst.LIST_SERVICE_NAME


def get_user_attributes(user_id):
    pm_logger = common_utils.begin_logger(user_id, __name__,
                                          inspect.currentframe())
    try:
        user = pm_userAttribute.query_key(user_id, True)
        if user is None:
            user = {}
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    # data response
    response = common_utils.get_response_by_response_body(HTTPStatus.OK, user)
    return common_utils.response(response, pm_logger)


def update_user_attributes(user_id, data_body):
    pm_logger = common_utils.begin_logger(user_id, __name__,
                                          inspect.currentframe())
    try:
        body_object = json.loads(data_body)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)
    try:
        user = pm_userAttribute.query_key(user_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    user_name = get_data_json_by_key("userName", body_object)
    company_name = get_data_json_by_key("companyName", body_object)
    department_name = get_data_json_by_key("departmentName", body_object)
    company_flg = common_utils.get_value("companyFlg", body_object, None)
    country_code = get_data_json_by_key("countryCode", body_object)
    caller_service_name = common_utils.get_value("callerServiceName",
                                                 body_object, None)

    # validate param info user attribute
    list_error = validate_info_user_attribute(caller_service_name)
    if list_error:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_error, pm_logger)

    if user is None:
        # Create User
        try:
            pm_userAttribute.create(user_id, user_name, company_name,
                                    department_name, MailStatus.Normal,
                                    company_flg, country_code,
                                    caller_service_name)
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_DB_403, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)
    else:
        # Update User
        attribute = {
            'UserName': {
                "Value": user_name
            },
            'CompanyName': {
                "Value": company_name
            },
            'DepartmentName': {
                "Value": department_name
            }
        }
        if company_flg is not None:
            attribute['CompanyFlg'] = {
                "Value": company_flg
            }
        if country_code is not None:
            attribute['CountryCode'] = {
                "Value": country_code
            }
        try:
            pm_userAttribute.update(user_id, attribute)
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_DB_404, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)
    # Get data response
    try:
        user = pm_userAttribute.query_key(user_id, True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    # return data response
    response = common_utils.get_response_by_response_body(HTTPStatus.OK, user)
    return common_utils.response(response, pm_logger)


def validate_info_user_attribute(caller_service_name):
    list_error = []

    # validate callerServiceName
    if caller_service_name is not None and caller_service_name not in LIST_SERVICE_NAME:
        params = []
        params.append(', '.join(LIST_SERVICE_NAME))
        list_error.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_302,
                                            "callerServiceName",
                                            caller_service_name, params))

    return list_error


def get_data_json_by_key(key, json):
    result = None
    if common_utils.check_key(key, json) and common_utils.is_null(
            json[key]) is False:
        if (common_utils.is_number(json[key])):
            result = str(json[key])
        else:
            result = json[key]
    return result


def apply_change_email(user_id, mail_before_change, data_body):
    pm_logger = common_utils.begin_logger(user_id, __name__,
                                          inspect.currentframe())
    # Parse JSON
    try:
        body_object = json.loads(data_body)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_REQUEST_202,
                                            HTTPStatus.BAD_REQUEST, e,
                                            pm_logger, True)

    mail_after_change = common_utils.get_value("mailAddress", body_object,
                                               None)
    caller_service_name = common_utils.get_value("callerServiceName",
                                                 body_object, None)

    mail_lang = common_utils.get_value("mailLang", body_object, None)

    # validate
    list_errors = validate_param_apply_change_email(
        user_id, mail_lang, caller_service_name, mail_before_change)
    if list_errors:
        return common_utils.error_validate(MsgConst.ERR_REQUEST_201,
                                           HTTPStatus.UNPROCESSABLE_ENTITY,
                                           list_errors, pm_logger)

    # Cognito UserPoolsから変更するメールアドレス{mailaddress}に該当するユーザー情報情報を取得します。
    try:
        list_users = aws_common.get_cognito_user_pools(
            user_id, mail_after_change, "email")
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_COGNITO_501,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if list_users:
        return common_utils.error_common(MsgConst.ERR_302, HTTPStatus.CONFLICT,
                                         pm_logger)

    # メールアドレス変更申請テーブルから申請レコードを取得します。
    try:
        list_email_change_apply = pm_emailChangeApply.query_user_index(user_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if list_email_change_apply:
        return common_utils.error_common(MsgConst.ERR_302, HTTPStatus.CONFLICT,
                                         pm_logger)

    # メールアドレス変更申請テーブルに申請レコードを作成します。
    apply_id = common_utils.get_uuid4()
    time_to_live = common_utils.get_time_to_live(
        CommonConst.EMAIL_CHANGE_APPLY_EXPIRATION_DATE)
    try:
        pm_emailChangeApply.create(user_id, apply_id, mail_before_change,
                                   mail_after_change, time_to_live,
                                   caller_service_name)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # get record PM_EmailChangeApply
    try:
        result = pm_emailChangeApply.query_key(
            user_id, apply_id, convert_response=True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # S3から通知メール送信設定ファイルを取得します。
    try:
        config = FileUtils.read_yaml(
            user_id, CommonConst.S3_SETTING_BUCKET,
            CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
    except PmError as e:
        pm_logger.error(
            "メールアドレス変更通知メール送信設定ファイルの取得に失敗しました。:s3://%s/%s",
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
        return common_utils.error_exception(MsgConst.ERR_S3_702,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    path_file_template = config[
        CommonConst.KEY_GET_PATH_FILE_TEMPLATE_MAIL_SERVICE.format(
            language=mail_lang, serviceName=caller_service_name
        )
    ]
    # 通知メール本文を作成
    try:
        template_body_mail = FileUtils.read_decode(
            user_id, CommonConst.S3_SETTING_BUCKET, path_file_template)
    except PmError as e:
        pm_logger.error(
            "メールアドレス変更通知メール本文テンプレートファイルの取得に失敗しました。:s3://%s/%s",
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            path_file_template)
        return common_utils.error_exception(MsgConst.ERR_S3_702,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # SESで通知メールを送信します。
    bcc_addresses = [
        mail_after_change
    ]
    template_body_mail = Template(template_body_mail)
    body_mail = template_body_mail.render(ApplyID=apply_id)
    mail_subject = config[
        CommonConst.KEY_MAIL_SUBJECT_SERVICE.format(
            language=mail_lang, serviceName=caller_service_name
        )
    ]
    mail_form = config[CommonConst.KEY_MAIL_FROM_SERVICE.format(
        serviceName=caller_service_name
    )]

    try:
        aws_common.send_email(user_id, config['ses.region'],
                              mail_form, bcc_addresses, mail_subject,
                              body_mail)
    except PmError as e:
        pm_logger.error("通知メール送信に失敗しました。")
        return common_utils.error_exception(MsgConst.ERR_SES_801,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # return data response
    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, result)
    return common_utils.response(response, pm_logger)


def validate_param_apply_change_email(
        trace_id, mail_lang, caller_service_name, mail_address):
    list_errors = []

    # validate language
    list_error_language = common_utils.validate_language(
        mail_lang, param_name="mailLang")
    if list_error_language:
        list_errors.extend(list_error_language)

    # validate callerServiceName
    if common_utils.is_null(caller_service_name):
        list_errors.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_101,
                                            "callerServiceName",
                                            caller_service_name))
    elif caller_service_name not in LIST_SERVICE_NAME:
        params = []
        params.append(', '.join(LIST_SERVICE_NAME))
        list_errors.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_302,
                                            "callerServiceName",
                                            caller_service_name, params))

    # validate mailAddress
    if common_utils.is_null(mail_address):
        list_errors.append(
            common_utils.get_error_validate(MsgConst.ERR_VAL_101,
                                            "mailAddress", mail_address))
    return list_errors


def execute_change_email(apply_id):
    pm_logger = common_utils.begin_logger(apply_id, __name__,
                                          inspect.currentframe())

    # バリデーションチェックを行います
    if common_utils.is_null(apply_id):
        return common_utils.error_common(MsgConst.ERR_201,
                                         HTTPStatus.UNPROCESSABLE_ENTITY,
                                         pm_logger)

    # set default value
    caller_service_name = 'insightwatch'

    # S3から通知メール送信設定ファイルを取得します。
    try:
        config = FileUtils.read_yaml(
            apply_id, CommonConst.S3_SETTING_BUCKET,
            CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
    except PmError as e:
        pm_logger.error(
            "メールアドレス変更通知メール送信設定ファイルの取得に失敗しました。:s3://%s/%s",
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
        common_utils.error_exception(MsgConst.ERR_S3_702,
                                     HTTPStatus.INTERNAL_SERVER_ERROR, e,
                                     pm_logger, True)
        return common_utils.get_response_by_response_body(
            HTTPStatus.OK,
            CommonConst.DEFAULT_RESPONSE_ERROR_PAGE[caller_service_name],
            is_response_json=False,
            content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)

    # set data response error page default
    response_error_page = config[
        CommonConst.KEY_RESPONSE_ERROR_PAGE.format(
            serviceName=caller_service_name)]

    # メールアドレス変更申請テーブルから申請レコードを取得します。
    try:
        email_change_apply_info = pm_emailChangeApply.query_key(
            apply_id, apply_id, None)
    except PmError:
        pm_logger.error("メールアドレス変更申請テーブルでレコード取得に失敗しました。変更申請ID: %s", apply_id)
        return common_utils.get_response_by_response_body(
            HTTPStatus.OK,
            response_error_page,
            is_response_json=False,
            content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)

    if not email_change_apply_info:
        pm_logger.warning("メールアドレス変更申請テーブルでレコードが存在しませんでした。変更申請ID: %s",
                          apply_id)
        return common_utils.get_response_by_response_body(
            HTTPStatus.OK,
            response_error_page,
            is_response_json=False,
            content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)

    user_name = email_change_apply_info['UserID']
    if common_utils.check_key('CallerServiceName', email_change_apply_info):
        caller_service_name = email_change_apply_info['CallerServiceName']

    # data response page
    response_error_page = config[
        CommonConst.KEY_RESPONSE_ERROR_PAGE.format(
            serviceName=caller_service_name)]
    response_execute_change_email = config[
        CommonConst.KEY_RESPONSE_EXECUTE_CHANGE_EMAIL.format(
            serviceName=caller_service_name)]

    # メールアドレス変更申請テーブルから取得した UserID でCognito に合致する該当するユーザー情報を取得します。
    try:
        user_info = aws_common.get_cognito_user_info_by_user_name(
            apply_id, user_name)
    except PmError:
        pm_logger.error("Cognitoから情報取得に失敗しました。")
        return common_utils.get_response_by_response_body(
            HTTPStatus.OK,
            response_error_page,
            is_response_json=False,
            content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)

    if not user_info:
        pm_logger.warning("Cognitoにユーザーが存在しませんでした。ユーザーID： %s", user_name)
        return common_utils.get_response_by_response_body(
            HTTPStatus.OK,
            response_error_page,
            is_response_json=False,
            content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)

    before_mail_address = email_change_apply_info['BeforeMailAddress']
    after_mail_address = email_change_apply_info['AfterMailAddress']

    # get cognito email
    cognito_email = jmespath.search("[?Name=='email'].Value | [0]",
                                    user_info['UserAttributes'])

    if before_mail_address != cognito_email:
        pm_logger.warning("変更前メールアドレスがCognitoのメールアドレスと合致しませんでした。")
        return common_utils.get_response_by_response_body(
            HTTPStatus.OK,
            response_error_page,
            is_response_json=False,
            content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)

    # Cognitoのメールアドレスを変更する
    try:
        user_attributes = [
            {
                'Name': 'email',
                'Value': after_mail_address
            },
            {
                'Name': 'email_verified',
                'Value': 'true'
            }
        ]
        aws_common.update_cognito_user_attributes(apply_id, user_name,
                                                  user_attributes)
    except PmError:
        pm_logger.error("Cognitoの項目変更に失敗しました。")
        return common_utils.get_response_by_response_body(
            HTTPStatus.OK,
            response_error_page,
            is_response_json=False,
            content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)

    # get list affiliations
    try:
        affiliations = pm_affiliation.query_userid_key(apply_id, user_name)
    except PmError:
        pm_logger.error("ユーザー所属テーブルでレコード取得に失敗しました。")
        return common_utils.get_response_by_response_body(
            HTTPStatus.OK,
            response_error_page,
            is_response_json=False,
            content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)

    for affiliation in affiliations:
        try:
            org_notify_mail_destinations = pm_orgNotifyMailDestinations.query_key(
                apply_id, affiliation['OrganizationID'],
                CommonConst.NOTIFY_CODE, None)
        except PmError:
            pm_logger.error("組織別通知メール宛先テーブルでレコード取得に失敗しました。")
            return common_utils.get_response_by_response_body(
                HTTPStatus.OK,
                response_error_page,
                is_response_json=False,
                content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)

        if org_notify_mail_destinations:
            destinations_update = []
            for destination in org_notify_mail_destinations['Destinations']:
                if destination['MailAddress'] == before_mail_address:
                    destination['MailAddress'] = after_mail_address
                    destinations_update.append(destination)

            # update pm_orgNotifyMailDestinations
            try:
                attribute = {'Destinations': {"Value": destinations_update}}
                pm_orgNotifyMailDestinations.update(
                    apply_id, org_notify_mail_destinations['OrganizationID'],
                    org_notify_mail_destinations['NotifyCode'], attribute)
            except PmError:
                pm_logger.error("組織別通知メール宛先テーブルでレコード更新に失敗しました。")
                return common_utils.get_response_by_response_body(
                    HTTPStatus.OK,
                    response_error_page,
                    is_response_json=False,
                    content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)

        # update pm_affiliation
        try:
            attribute = {'MailAddress': {"Value": after_mail_address}}
            pm_affiliation.update_affiliation(apply_id, affiliation['UserID'],
                                              affiliation['OrganizationID'],
                                              attribute,
                                              affiliation['UpdatedAt'])
        except PmError:
            pm_logger.error("ユーザー所属テーブルでレコード更新に失敗しました。")
            return common_utils.get_response_by_response_body(
                HTTPStatus.OK,
                response_error_page,
                is_response_json=False,
                content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)

    # メールアドレス変更申請テーブルで変更申請ID{applyid}をキーにして申請レコードを削除する。
    try:
        pm_emailChangeApply.delete(apply_id, apply_id)
    except PmError:
        pm_logger.error("メールアドレス変更申請テーブルでレコード削除に失敗しました。変更申請ID： %s", apply_id)
        return common_utils.get_response_by_response_body(
            HTTPStatus.OK,
            response_error_page,
            is_response_json=False,
            content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)

    # data response
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK,
        response_execute_change_email,
        is_response_json=False,
        content_type=CommonConst.CONTENT_TYPE_TEXT_HTML)
    return common_utils.response(response, pm_logger)
