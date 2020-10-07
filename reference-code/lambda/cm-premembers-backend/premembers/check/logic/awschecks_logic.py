import inspect
import json
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from premembers.common import common_utils, FileUtils, aws_common
from premembers.common import checkauthority
from premembers.repository import pm_checkResultItems, pm_projects
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_checkResults, pm_latestCheckResult
from premembers.repository import pm_affiliation, pm_checkHistory
from premembers.repository import pm_securityCheckWebhook
from premembers.repository import pm_securityCheckWebhookCallHistory
from premembers.repository import pm_awsAccountCoops
from premembers.repository.const import ExclusionFlag
from premembers.const.const import CommonConst
from premembers.repository.const import InvitationStatus
from premembers.repository.const import CheckStatus, ExecutedType, Authority

CHECK_SECURITY = "CHECK_SECURITY"


def get_security_check_summary(user_id):
    trace_id = user_id
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 所属組織リストを取得します。
    try:
        affiliations = pm_affiliation.query_userid_key_invite(
            trace_id, user_id, InvitationStatus.Belong)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if (not affiliations):
        response = common_utils.get_response_by_response_body(
            HTTPStatus.OK, [])
        return common_utils.response(response, pm_logger)

    ok_count = 0
    ng_count = 0
    critical_count = 0
    managed_count = 0
    error_count = 0
    for affiliation in affiliations:
        try:
            # 最新チェック結果テーブルから組織ID をキーとして、クエリを行います。
            list_latest_check_result = pm_latestCheckResult.query_organization_id(
                trace_id, affiliation['OrganizationID'])
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)
        if (not list_latest_check_result):
            continue

        # 取得した所属組織に対して、所属組織ごとに最新チェック結果のチェック履歴IDを取得します。
        for latest_check_result in list_latest_check_result:
            try:
                list_check_result = pm_checkResults.query_history_index(
                    trace_id, latest_check_result['CheckHistoryID'])
            except PmError as e:
                return common_utils.error_exception(
                    MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                    pm_logger, True)
            if (not list_check_result):
                continue

            # チェック結果を合計します。
            for check_result in list_check_result:
                if common_utils.check_key('OKCount', check_result):
                    ok_count += check_result['OKCount']
                if common_utils.check_key('NGCount', check_result):
                    ng_count += check_result['NGCount']
                if common_utils.check_key('CriticalCount', check_result):
                    critical_count += check_result['CriticalCount']
                if common_utils.check_key('ManagedCount', check_result):
                    managed_count += check_result['ManagedCount']
                if common_utils.check_key('ErrorCount', check_result):
                    error_count += check_result['ErrorCount']

    # return data response
    response_body = {
        "okCount": int(ok_count),
        "ngCount": int(ng_count),
        "criticalCount": int(critical_count),
        "managedCount": int(managed_count),
        "errorCount": int(error_count)
    }
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, response_body)
    return common_utils.response(response, pm_logger)


def get_security_check_detail(trace_id,
                              organization_id,
                              project_id,
                              check_history_id=None,
                              group_filter=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # リソース関連性のバリデーションチェックを行います。
    try:
        project = pm_projects.get_projects_by_organization_id(
            trace_id, project_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if (not project):
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # 最新チェック結果のチェック履歴ID CheckHistoryIDを取得します。
    if check_history_id is None:
        try:
            lastest_check_result = pm_latestCheckResult.query_key(
                trace_id, project_id, organization_id)
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)
        if (not lastest_check_result):
            response = common_utils.get_response_by_response_body(
                HTTPStatus.OK, [])
            return common_utils.response(response, pm_logger)
        check_history_id = lastest_check_result["CheckHistoryID"]
    else:
        try:
            lastest_check_result = pm_latestCheckResult.query_key_by_check_history_id(
                trace_id, project_id, organization_id, check_history_id)
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)
        if (not lastest_check_result):
            return common_utils.error_common(MsgConst.ERR_301,
                                             HTTPStatus.NOT_FOUND, pm_logger)
    # チェック結果詳細情報を取得します。
    try:
        if common_utils.is_null(group_filter) is True:
            check_result_items = pm_checkResultItems.get_security_check_detail(
                trace_id, check_history_id)
        else:
            check_result_items = pm_checkResultItems.get_security_check_detail(
                trace_id, check_history_id,
                CommonConst.GROUP_FILTER_TEMPLATE.format(group_filter))
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if (not check_result_items):
        response = common_utils.get_response_by_response_body(
            HTTPStatus.OK, [])
        return common_utils.response(response, pm_logger)

    # 個別チェック結果レコードに対して、各チェック結果に作成されたチェック結果ファイルを取得する。
    response_body = []
    for check_result_item in check_result_items:
        try:
            data = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                       check_result_item["ResultJsonPath"])
        except PmError as e:
            if e.cause_error.response['Error'][
                    'Code'] == CommonConst.NO_SUCH_KEY:
                return common_utils.error_exception(
                    MsgConst.ERR_S3_702, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                    pm_logger, True)
            else:
                return common_utils.error_exception(
                    MsgConst.ERR_S3_709, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                    pm_logger, True)
        response_body.append(get_response_body(check_result_item, data))

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, response_body)
    return common_utils.response(response, pm_logger)


def get_response_body(check_result_item, data):
    response_body = {
        "id": check_result_item["CheckResultItemID"],
        "checkHistoryId": check_result_item["CheckHistoryID"],
        "checkResultId": check_result_item["CheckResultID"],
        "checkItemCode": check_result_item["CheckItemCode"],
        "organizationName": check_result_item["OrganizationName"],
        "projectName": check_result_item["ProjectName"],
        "awsAccount": check_result_item["AWSAccount"],
        "awsAccountName": common_utils.get_value("AWSAccountName", check_result_item, None),
        "exclusionFlag": int(common_utils.get_value("ExclusionFlag", check_result_item, ExclusionFlag.Disable)),
        "checkResult": int(check_result_item["CheckResult"]),
        "resources": data["CheckResults"],
        "executedDateTime": check_result_item["ExecutedDateTime"],
        "createdAt": check_result_item["CreatedAt"],
        "updatedAt": check_result_item["UpdatedAt"],
    }
    return response_body


def execute_security_check(trace_id, organization_id, project_id, user_id,
                           email):
    return execute_security_check_with_executed_type(trace_id, organization_id,
                                                     project_id, user_id,
                                                     email,
                                                     ExecutedType.Manual)


def execute_security_check_from_external(trace_id, webhook_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    webhook = None
    try:
        webhooks = pm_securityCheckWebhook.query_webhook_index(
            trace_id, webhook_path, convert_response=True)
        if (webhooks):
            webhook = pm_securityCheckWebhook.query_key(
                trace_id, webhooks[0]['id'])
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not webhook:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    if not webhook['Enabled']:
        return common_utils.error_common(MsgConst.ERR_REQUEST_203,
                                         HTTPStatus.FORBIDDEN, pm_logger)

    user_id = webhook['UserID']
    email = webhook['MailAddress']
    organization_id = webhook['OrganizationID']
    project_id = webhook['ProjectID']
    id = webhook['SecurityCheckWebhookID']

    try:
        histories = pm_securityCheckWebhookCallHistory.query(trace_id, id)
        if histories:
            yesterday = datetime.now(timezone.utc) - timedelta(days=1)
            recentries = list(
                filter(
                    lambda h: datetime.strptime(h['CreatedAt'], '%Y-%m-%d %H:%M:%S.%f').astimezone(timezone.utc) > yesterday and h['ExecutedStatus'] == 'Success',
                    histories))
            if len(recentries) >= webhook['MaxDailyExecutedCount']:
                return common_utils.error_common(MsgConst.ERR_REQUEST_203,
                                                 HTTPStatus.TOO_MANY_REQUESTS,
                                                 pm_logger)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    response = execute_security_check_with_executed_type(
        trace_id, organization_id, project_id, user_id, email,
        ExecutedType.External)

    executed_status = 'Success' if response[
        'statusCode'] == HTTPStatus.CREATED else 'Failure'

    try:
        pm_securityCheckWebhookCallHistory.create(trace_id, id,
                                                  executed_status)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    return response


def execute_security_check_with_executed_type(trace_id, organization_id,
                                              project_id, user_id, email,
                                              executed_type):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # リソース関連性のバリデーションチェックを行います。
    try:
        project = pm_projects.get_projects_by_organization_id(
            trace_id, project_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if not project:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    try:
        check_history_id = common_utils.get_uuid4()
        executed_date_time = common_utils.get_current_date()
        pm_checkHistory.create(trace_id, check_history_id, organization_id,
                               project_id, CHECK_SECURITY, CheckStatus.Waiting,
                               None, executed_type, None, executed_date_time,
                               None, user_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    try:
        topic_arn = common_utils.get_environ(
            CommonConst.SECURITYCHECK_EXECUTE_TOPIC)
        subject = "USER : {0}".format(user_id)
        message = {
            'CheckHistoryId': check_history_id
        }
        # Publish message
        aws_common.aws_sns(trace_id, subject, json.dumps(message), topic_arn)
    except PmError as e:
        common_utils.write_log_pm_error(e, pm_logger, exc_info=True)

    try:
        check_history = pm_checkHistory.query_key(trace_id, check_history_id,
                                                  True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    # return data response
    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, check_history)
    return common_utils.response(response, pm_logger)


def get_securitycheck_awsacntsummary(user_id, aws_account):
    trace_id = user_id
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 所属組織リストを取得します。
    try:
        affiliations = pm_affiliation.query_userid_key_invite(
            trace_id, user_id, InvitationStatus.Belong)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if (not affiliations):
        response = common_utils.get_response_by_response_body(
            HTTPStatus.OK, [])
        return common_utils.response(response, pm_logger)

    response_bodys = []
    for affiliation in affiliations:
        try:
            # 最新チェック結果テーブルから組織ID をキーとして、クエリを行います。
            list_latest_check_result = pm_latestCheckResult.query_organization_id(
                trace_id, affiliation['OrganizationID'])
        except PmError as e:
            return common_utils.error_exception(
                MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                pm_logger, True)
        if (not list_latest_check_result):
            continue
        for latest_check_result in list_latest_check_result:
            try:
                list_check_result = pm_checkResults.query_history_index_by_awsaccount(
                    trace_id, aws_account,
                    latest_check_result['CheckHistoryID'], True)
            except PmError as e:
                return common_utils.error_exception(
                    MsgConst.ERR_402, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                    pm_logger, True)
            if (not list_check_result):
                continue

            response_bodys.extend(list_check_result)
            if aws_account is not None:
                response = common_utils.get_response_by_response_body(
                    HTTPStatus.OK, response_bodys)
                return common_utils.response(response, pm_logger)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, response_bodys)
    return common_utils.response(response, pm_logger)


def get_security_check_report_url(trace_id, user_id, history_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # チェック履歴情報を取得します。
    try:
        check_history = pm_checkHistory.get_check_history_by_status(
            trace_id, history_id, CheckStatus.ReportCompleted)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # 該当するレコードが存在しない場合（取得件数が0件）
    if len(check_history) == 0:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    # 取得したチェック履歴情報より組織IDを取得する
    organization_id = check_history[0]['OrganizationID']

    # アクセス権限チェックを行います
    response_authority = checkauthority.authority(
        trace_id, user_id, organization_id, Authority.Viewer)
    if response_authority:
        return common_utils.response(response_authority, pm_logger)

    # 有効期限が作成から1時間となる署名付きURLを作成します。
    try:
        signed_url = aws_common.generate_presigned_url(
            trace_id, common_utils.get_environ('S3_CHECK_BUCKET'),
            check_history[0]['ReportFilePath'])
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_999,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    # return data response
    response_body = {"URL": signed_url}
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, response_body)
    return common_utils.response(response, pm_logger)


def list_security_check_reports(trace_id, organization_id, project_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        result = pm_checkHistory.query_project_index_by_organization_id(
            trace_id, organization_id, project_id, convert_response=True)
    except PmError as err:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            err, pm_logger, True)

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, result)
    return common_utils.response(response, pm_logger)


def get_security_check_webhook_by_ids(trace_id, user_id, organization_id,
                                      project_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    webhook = None
    # リソース関連性のバリデーションチェックを行います。
    try:
        project = pm_projects.get_projects_by_organization_id(
            trace_id, project_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if not project:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    try:
        webhooks = pm_securityCheckWebhook.query_project_index(
            trace_id, project_id, user_id)
        if webhooks:
            webhook = pm_securityCheckWebhook.query_key(
                trace_id,
                webhooks[0]['SecurityCheckWebhookID'],
                convert_response=True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not webhook:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, webhook)
    return response


def generate_security_check_webhook(trace_id, organization_id, project_id,
                                    user_id, email):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # リソース関連性のバリデーションチェックを行います。
    try:
        project = pm_projects.get_projects_by_organization_id(
            trace_id, project_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if not project:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    try:
        webhooks = pm_securityCheckWebhook.query_project_index(
            trace_id, project_id, user_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)
    if webhooks:
        return common_utils.error_common(MsgConst.ERR_302, HTTPStatus.CONFLICT,
                                         pm_logger)

    try:
        security_check_webhook_id = common_utils.get_uuid4()
        webhook_path = common_utils.get_uuid4()
        pm_securityCheckWebhook.create(trace_id, security_check_webhook_id,
                                       webhook_path, user_id, email,
                                       organization_id, project_id, 3)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_403,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.CREATED, {'webhookPath': webhook_path})
    return common_utils.response(response, pm_logger)


def update_security_check_webhook(trace_id, webhook_path, user_id, data_body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    has_webhook_path = 'webhookPath' in data_body
    has_enabled = 'enabled' in data_body

    webhook = None
    try:
        webhooks = pm_securityCheckWebhook.query_webhook_index(
            trace_id, webhook_path)
        if webhooks:
            webhook = webhooks[0]
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not webhook:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    if webhook['UserID'] != user_id:
        return common_utils.error_common(MsgConst.ERR_301,
                                         HTTPStatus.NOT_FOUND, pm_logger)

    if has_webhook_path:
        attribute = {'WebhookPath': {"Value": common_utils.get_uuid4()}}
    elif has_enabled:
        attribute = {'Enabled': {"Value": data_body['enabled']}}
    else:
        return common_utils.error_common(MsgConst.ERR_REQUEST_201,
                                         HTTPStatus.BAD_REQUEST, pm_logger)

    updated_at = webhook['UpdatedAt']
    try:
        pm_securityCheckWebhook.update(
            trace_id, webhook['SecurityCheckWebhookID'], attribute, updated_at)
        webhook = pm_securityCheckWebhook.query_key(
            trace_id, webhook['SecurityCheckWebhookID'], convert_response=True)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_DB_404,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, webhook)
    return common_utils.response(response, pm_logger)


def get_security_check_resource(trace_id, coop_id, project_id, organization_id,
                                check_item_code):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # リソース関連性のバリデーションチェックを行います。
    try:
        awscoop_item = pm_awsAccountCoops.query_awscoop_coop_key(
            trace_id, coop_id)
    except Exception as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not awscoop_item:
        return common_utils.error_common(
            MsgConst.ERR_AWS_401, HTTPStatus.UNPROCESSABLE_ENTITY, pm_logger)

    # 最新チェック結果テーブルのチェック履歴IDCheckHistoryIDを取得します。
    try:
        latest_check_result = pm_latestCheckResult.query_key(
            trace_id, project_id, organization_id)
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not latest_check_result:
        response = common_utils.get_response_by_response_body(
            HTTPStatus.OK, [])
        return common_utils.response(response, pm_logger)

    check_history_id = latest_check_result['CheckHistoryID']

    # チェック結果詳細情報を取得します。
    try:
        check_result_items = pm_checkResultItems.get_security_check_detail_by_check_result_and_check_item_code(
            trace_id, check_history_id, check_item_code,
            awscoop_item['AWSAccount'])
    except PmError as e:
        return common_utils.error_exception(MsgConst.ERR_402,
                                            HTTPStatus.INTERNAL_SERVER_ERROR,
                                            e, pm_logger, True)

    if not check_result_items:
        response = common_utils.get_response_by_response_body(
            HTTPStatus.OK, [])
        return common_utils.response(response, pm_logger)

    # 個別チェック結果レコードに対して、各チェック結果に作成されたチェック結果ファイルを取得する。
    response_body = []
    for check_result_item in check_result_items:
        try:
            result_json_check_result_item = FileUtils.read_json(
                trace_id, "S3_CHECK_BUCKET",
                check_result_item["ResultJsonPath"])
        except PmError as e:
            if e.cause_error.response['Error'][
                    'Code'] == CommonConst.NO_SUCH_KEY:
                return common_utils.error_exception(
                    MsgConst.ERR_S3_702, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                    pm_logger, True)
            else:
                return common_utils.error_exception(
                    MsgConst.ERR_S3_709, HTTPStatus.INTERNAL_SERVER_ERROR, e,
                    pm_logger, True)
        response_body.append(
            get_response_body(check_result_item,
                              result_json_check_result_item))

    # return response data
    response = common_utils.get_response_by_response_body(
        HTTPStatus.OK, response_body)
    return common_utils.response(response, pm_logger)
