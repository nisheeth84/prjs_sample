import json
import inspect
import jmespath

from jinja2 import Template
from premembers.common import common_utils, date_utils, FileUtils, aws_common
from premembers.common import slack_common
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_checkResults, pm_orgNotifyMailDestinations
from premembers.repository import pm_affiliation, pm_orgNotifySlack
from premembers.repository import pm_organizations, pm_projects
from premembers.const.const import CommonConst
from premembers.repository.const import InvitationStatus


def execute_send_result_email(trace_id, check_history_id, aws_request_id,
                              language):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        send_result_email(trace_id, check_history_id, language)
    except PmError as e:
        common_utils.write_log_pm_error(e, pm_logger, exc_info=True)
        publish_error_message(trace_id, check_history_id, aws_request_id,
                              e.message)


def send_result_email(trace_id, check_history_id, language):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # チェック結果テーブルのCheckHistoryIndexから、チェック履歴ID{CheckHistoryId}をキーとしてチェック結果一覧を取得します。
    try:
        list_check_result = pm_checkResults.query_history_index(
            trace_id, check_history_id)
    except PmError as e:
        msg_err = "チェック結果の取得に失敗しました。"
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)

    if (not list_check_result):
        msg_err = "チェック結果の取得に失敗しました。"
        pm_logger.error(msg_err)
        raise PmError(message=msg_err)

    # チェック結果一覧のうちの一つから、組織IDを取得します。
    organization_id = list_check_result[0]['OrganizationID']
    organization_name = list_check_result[0]['OrganizationName']
    project_name = list_check_result[0]['ProjectName']

    # 宛先ユーザーの確認をします。ユーザー所属テーブルのOrganizationIndexから、組織IDをキー
    try:
        users = pm_affiliation.query_users_organization_index(
            trace_id, organization_id, InvitationStatus.Belong)
    except PmError as e:
        msg_err = "ユーザー所属情報の取得に失敗しました。:OrganizationID={0}".format(
            organization_id)
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)

    # 組織別通知メール宛先テーブルから、組織ID、通知コードCHECK_CISをキーとして宛先情報を取得します。
    try:
        org_notify_mail_destinations = pm_orgNotifyMailDestinations.query_key(
            trace_id, organization_id, CommonConst.NOTIFY_CODE)
    except PmError as e:
        msg_err = "宛先情報の取得に失敗しました。:OrganizationID={0}, CheckCode={1}".format(
            organization_id, CommonConst.NOTIFY_CODE)
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)

    if (not org_notify_mail_destinations):
        msg_err = "宛先情報の取得に失敗しました。:OrganizationID={0}, CheckCode={1}".format(
            organization_id, CommonConst.NOTIFY_CODE)
        pm_logger.error(msg_err)
        raise PmError(message=msg_err)

    destinations = []
    for destination in org_notify_mail_destinations['Destinations']:
        for user in users:
            if destination['UserID'] == user['UserID']:
                destinations.append(destination)
                break
    try:
        if (len(destinations) == 0):
            pm_orgNotifyMailDestinations.delete(trace_id, organization_id,
                                                CommonConst.NOTIFY_CODE)
        else:
            attribute = {'Destinations': {"Value": destinations}}
            pm_orgNotifyMailDestinations.update(
                trace_id, organization_id, CommonConst.NOTIFY_CODE, attribute)
    except PmError as e:
        msg_err = "通知メール宛先ユーザーの更新に失敗しました。:OrganizationID={0}, CheckCode={1}".format(
            organization_id, CommonConst.NOTIFY_CODE)
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)

    # S3から通知メール送信設定ファイルを取得します。
    try:
        config = FileUtils.read_yaml(trace_id, CommonConst.S3_SETTING_BUCKET,
                                     CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
    except PmError as e:
        msg_err = "通知メール送信設定ファイルの取得に失敗しました。:s3://{0}/{1}".format(
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)

    language_mail = CommonConst.LANGUAGE_DEFAULT
    if language in CommonConst.LANGUAGE_SUPPORT:
        language_mail = language

    path_file_template = config[CommonConst.KEY_GET_PATH_FILE_TEMPLATE_MAIL.format(language=language_mail)]
    mail_subject_config = config[CommonConst.KEY_MAIL_SUBJECT.format(language=language_mail)]

    # 通知メール本文を作成
    try:
        template_body = FileUtils.read_decode(
            trace_id, CommonConst.S3_SETTING_BUCKET, path_file_template)
    except PmError as e:
        msg_err = "知メール本文テンプレートファイルの取得に失敗しました。:s3://{0}/{1}".format(
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            path_file_template)
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)

    # 通知メール件名を作成
    subject_template = Template(mail_subject_config)
    mail_subject = subject_template.render(project_name=project_name)

    # メール本文
    executed_date_time = date_utils.toString(
        date_utils.toDate(list_check_result[0]['ExecutedDateTime'],
                          date_utils.UTC), date_utils.PATTERN_YYYYMMDDHHMM,
        date_utils.ASIA_TOKYO)

    executed_date_time_utc = date_utils.toString(
        date_utils.toDate(list_check_result[0]['ExecutedDateTime'],
                          date_utils.UTC), date_utils.PATTERN_YYYYMMDDHHMM,
        date_utils.UTC)

    check_results = []
    for check_result in list_check_result:
        account_aws = CommonConst.AWS_ACCOUNT_MAIL.format(
            check_result['AWSAccount'][:4], check_result['AWSAccount'][4:8])
        check_result = {
            "accountAWS": account_aws,
            "okCount": check_result['OKCount'],
            "ngCount": check_result['NGCount'],
            "criticalCount": check_result['CriticalCount'],
            "managedCount": check_result['ManagedCount'],
            "errorCount": check_result['ErrorCount']
        }
        check_results.append(check_result)

    template = Template(template_body)
    context = {
        'organizationName': organization_name,
        'projectName': project_name,
        'executedDateTime': executed_date_time,
        'executedDateTimeUTC': executed_date_time_utc,
        'checkResults': check_results
    }
    body = template.render(context)

    # SESで通知メールを送信します。
    list_bcc_addresses = []
    bcc_addresses = []
    for index, destination in enumerate(destinations):
        bcc_addresses.append(destination['MailAddress'])
        if (len(bcc_addresses) >= 50 or len(destinations) == index + 1):
            list_bcc_addresses.append(bcc_addresses)
            bcc_addresses = []

    for index, bcc_addresses in enumerate(list_bcc_addresses):
        try:
            aws_common.send_email(trace_id, config['ses.region'],
                                  config['mail.from'], bcc_addresses,
                                  mail_subject, body)
        except PmError as e:
            msg_err = "通知メール送信に失敗しました。（{0}/{1}）".format(
                index + 1, len(list_bcc_addresses))
            pm_logger.error(msg_err)
            raise common_utils.write_log_pm_error(e, pm_logger, msg_err)


def execute_send_checkerror_email(trace_id, aws_request_id, aws_account,
                                  check_history_id, organization_id,
                                  project_id, error_code, execute_user_id,
                                  region_name, check_code_item, data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        send_checkerror_email(trace_id, aws_account, check_history_id,
                              organization_id, project_id, error_code,
                              execute_user_id, region_name, check_code_item,
                              data_body)
    except PmError as e:
        common_utils.write_log_pm_error(e, pm_logger, exc_info=True)
        publish_error_message_send_checkerror_email(trace_id, check_history_id,
                                                    organization_id,
                                                    project_id, aws_request_id,
                                                    e.message)


def send_checkerror_email(trace_id, aws_account, check_history_id,
                          organization_id, project_id, error_code,
                          execute_user_id, region_name, check_code_item,
                          data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # 組織情報を取得する。
    try:
        organization = pm_organizations.get_organization(
            trace_id, organization_id)
    except PmError as e:
        msg_err = "組織情報の取得に失敗しました。OrganizationID={0}".format(organization_id)
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)

    # プロジェクト情報を取得する。
    try:
        project = pm_projects.query_key(trace_id, project_id)
    except PmError as e:
        msg_err = "プロジェクト情報の取得に失敗しました。ProjectID={0}".format(project_id)
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)

    # チェック実行ユーザーのメールアドレスと言語を取得します。
    try:
        user_info = aws_common.get_cognito_user_info_by_user_name(
            trace_id, execute_user_id)
    except PmError as e:
        msg_err = "Cognitoから情報取得に失敗しました。"
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)

    language = jmespath.search("[?Name=='locale'].Value | [0]",
                               user_info['UserAttributes'])
    mail_execute_user = jmespath.search("[?Name=='email'].Value | [0]",
                                        user_info['UserAttributes'])

    # S3から通知メール送信設定ファイルを取得します。
    try:
        config = FileUtils.read_yaml(trace_id, CommonConst.S3_SETTING_BUCKET,
                                     CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
    except PmError as e:
        msg_err = "通知メール送信設定ファイルの取得に失敗しました。:s3://{0}/{1}".format(
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)

    language_mail = CommonConst.LANGUAGE_ENGLISH
    if language in CommonConst.LANGUAGE_SUPPORT:
        language_mail = language

    path_file_template_check_error_notice_mail = config[
        CommonConst.KEY_GET_PATH_FILE_TEMPLATE_CHECK_ERROR_NOTICE_MAIL.format(
            language=language_mail)]
    path_file_message_notice_error_execute_check_security = config[
        CommonConst.KEY_GET_PATH_MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY.
        format(language=language_mail)]
    mail_subject_config = config[
        CommonConst.KEY_CHECK_ERROR_NOTICE_MAIL_SUBJECT.format(
            language=language_mail)]

    # エラー通知内容設定ファイルを取得します。
    try:
        messages_notice_error_execute_check_security = FileUtils.read_yaml(
            trace_id, CommonConst.S3_SETTING_BUCKET,
            path_file_message_notice_error_execute_check_security)
    except PmError as e:
        msg_err = "エラー通知内容設定ファイルの取得に失敗しました。:s3://{0}/{1}".format(
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            path_file_message_notice_error_execute_check_security)
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)

    # S3から通知メール本文テンプレートファイルを取得します。
    try:
        template_body = FileUtils.read_decode(
            trace_id, CommonConst.S3_SETTING_BUCKET,
            path_file_template_check_error_notice_mail)
    except PmError as e:
        msg_err = "通知メール本文テンプレートファイルの取得に失敗しました。:s3://{0}/{1}".format(
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            path_file_template_check_error_notice_mail)
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)

    # に該当する通知内容を取得します。
    content_message = messages_notice_error_execute_check_security[
        CommonConst.KEY_GET_MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY.format(
            errorCode=error_code)]
    if data_body is not None:
        content_message = content_message.format_map(data_body)

    # 通知メール件名を作成
    subject_template = Template(mail_subject_config)
    project_name = project['ProjectName']
    mail_subject = subject_template.render(project_name=project_name)
    if check_code_item is not None:
        check_code_item = CommonConst.LIST_CHECK_ITEM_CODE_CONVERT[
            check_code_item]

    template = Template(template_body)
    context = {
        'organizationName': organization['OrganizationName'],
        'projectName': project_name,
        'checkCodeItem': check_code_item,
        'awsAccount': aws_account,
        'regionName': region_name,
        'contentMessage': content_message
    }
    body = template.render(context)

    # SESで通知メールを送信します
    bcc_addresses = [mail_execute_user]

    try:
        aws_common.send_email(trace_id, config['ses.region'],
                              config['mail.from'], bcc_addresses, mail_subject,
                              body)
    except PmError as e:
        msg_err = "通知メール送信に失敗しました。"
        pm_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, pm_logger, msg_err)


def execute_send_result_slack(trace_id, check_history_id, language):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # チェック結果テーブルのCheckHistoryIndexから、チェック履歴ID{CheckHistoryId}をキーとしてチェック結果一覧を取得します。
    try:
        list_check_result = pm_checkResults.query_history_index(
            trace_id, check_history_id)
    except PmError as e:
        msg_err = "チェック結果の取得に失敗しました。"
        pm_logger.error(msg_err)
        common_utils.write_log_pm_error(e, pm_logger, msg_err)
        return

    if (not list_check_result):
        msg_err = "チェック結果の取得に失敗しました。"
        pm_logger.error(msg_err)
        return

    # チェック結果一覧のうちの一つから、組織IDを取得します。
    organization_id = list_check_result[0]['OrganizationID']
    organization_name = list_check_result[0]['OrganizationName']
    project_name = list_check_result[0]['ProjectName']

    # 組織別Slack通知設定テーブルから、組織ID、通知コードCHECK_CISをキーとして設定情報を取得します。
    try:
        org_notify_slack = pm_orgNotifySlack.query_key(
            trace_id, organization_id, CommonConst.NOTIFY_CODE)
    except PmError as e:
        msg_err = "Slack設定情報の取得に失敗しました。:OrganizationID={0}, CheckCode={1}".format(
            organization_id, CommonConst.NOTIFY_CODE)
        pm_logger.error(msg_err)
        common_utils.write_log_pm_error(e, pm_logger, msg_err)
        return

    if (not org_notify_slack):
        msg_err = "Slack設定情報の取得に失敗しました。:OrganizationID={0}, CheckCode={1}".format(
            organization_id, CommonConst.NOTIFY_CODE)
        pm_logger.error(msg_err)
        return

    # S3から通知Slack設定ファイルを取得します。
    try:
        config = FileUtils.read_yaml(trace_id, CommonConst.S3_SETTING_BUCKET,
                                     CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
    except PmError as e:
        msg_err = "通知Slack設定ファイルの取得に失敗しました。:s3://{0}/{1}".format(
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
        pm_logger.error(msg_err)
        common_utils.write_log_pm_error(e, pm_logger, msg_err)
        return

    if language not in CommonConst.LANGUAGE_SUPPORT:
        language = CommonConst.LANGUAGE_DEFAULT

    path_file_template = config[CommonConst.KEY_GET_PATH_FILE_TEMPLATE_SLACK.
                                format(language=language)]

    # メッセージ本文を作成します。
    try:
        template_message = FileUtils.read_decode(
            trace_id, CommonConst.S3_SETTING_BUCKET, path_file_template)
    except PmError as e:
        msg_err = "Slack通知本文テンプレートファイルの取得に失敗しました。:s3://{0}/{1}".format(
            common_utils.get_environ(CommonConst.S3_SETTING_BUCKET),
            path_file_template)
        pm_logger.error(msg_err)
        common_utils.write_log_pm_error(e, pm_logger, msg_err)
        return

    executed_date_time = date_utils.toString(
        date_utils.toDate(list_check_result[0]['ExecutedDateTime'],
                          date_utils.UTC), date_utils.PATTERN_YYYYMMDDHHMM,
        date_utils.get_time_zone_by_language(language))

    check_results = []
    for check_result in list_check_result:
        account_aws = CommonConst.AWS_ACCOUNT_MAIL.format(
            check_result['AWSAccount'][:4], check_result['AWSAccount'][4:8])
        check_result = {
            "accountAWS": account_aws,
            "okCount": check_result['OKCount'],
            "ngCount": check_result['NGCount'],
            "criticalCount": check_result['CriticalCount'],
            "managedCount": check_result['ManagedCount'],
            "errorCount": check_result['ErrorCount']
        }
        check_results.append(check_result)

    template = Template(template_message)
    context = {
        'organizationName': organization_name,
        'projectName': project_name,
        'executedDateTime': executed_date_time,
        'checkResults': check_results
    }
    body = template.render(context)
    mentions = slack_common.convert_command_slack(org_notify_slack['Mentions'])
    body = CommonConst.KEY_BODY_MESSAGE_SLACK.format(
        mentions=mentions, body=body)

    notify_slack = {
        "username": config[CommonConst.KEY_USER_NAME_SLACK.format(language=language)],
        "icon_url": config['slack.iconurl'],
        "text": body
    }
    notify_slack = json.dumps(notify_slack)
    try:
        slack_common.send_message_slack(
            trace_id, org_notify_slack['WebhookURL'], notify_slack)
    except PmError as e:
        msg_err = "Slack通知のリクエスト送信に失敗しました。:OrganizationID={0}, CheckCode={1}".format(
            organization_id, CommonConst.NOTIFY_CODE)
        pm_logger.warning(msg_err)
        common_utils.write_log_pm_error(e, pm_logger, msg_err)


def publish_error_message(trace_id, check_history_id, aws_request_id, message):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        subject = "セキュリティチェック結果メール通知失敗（{0}）".format(
            common_utils.get_environ(CommonConst.STAGE))
        message = "RequestID: {0}\nCheckHistoryID: {1}\nMessage: {2}".format(
            aws_request_id, check_history_id, message)
        aws_common.aws_sns(trace_id, subject, message,
                           common_utils.get_environ(
                               CommonConst.SENDMAIL_ERROR_NOTIFY_TOPIC))
    except PmError as e:
        pm_logger.error("通知メール送信エラーメッセージのパブリッシュに失敗しました")


def publish_error_message_send_checkerror_email(trace_id, check_history_id,
                                                organization_id, project_id,
                                                aws_request_id, message):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        subject = "チェックバッチエラー通知メール送信失敗（{0}）".format(
            common_utils.get_environ(CommonConst.STAGE))
        message = "RequestID: {0}\nCheckHistoryID: {1}\nOrganizationID: {2}\nProjectID: {3}\nMessage: {3}".format(
            aws_request_id, check_history_id, organization_id, project_id,
            message)
        aws_common.aws_sns(
            trace_id, subject, message,
            common_utils.get_environ(CommonConst.SENDMAIL_ERROR_NOTIFY_TOPIC))
    except PmError:
        pm_logger.error("通知メール送信エラーメッセージのパブリッシュに失敗しました。")
