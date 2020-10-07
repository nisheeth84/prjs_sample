import json
import inspect

from operator import itemgetter
from premembers.common import common_utils, aws_common
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_checkHistory, pm_latestCheckResult
from premembers.repository import pm_checkResults, pm_checkResultItems
from premembers.repository import pm_orgNotifyMailDestinations
from premembers.repository import pm_orgNotifySlack
from premembers.repository.const import CheckStatus, CheckResult
from premembers.check.logic import awsResourceChecker_logic
from premembers.const.const import CommonConst
from premembers.repository.const import ExclusionFlag


def aws_resource_aggregate(check_history_id, log_id):
    trace_id = check_history_id
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # バリデーションチェック
    if common_utils.is_null(check_history_id):
        pm_logger.error("チェック履歴IDが指定されていません。")
        raise PmError(message="AGG_SECURITY-001")

    # ログストリーム名取得
    if common_utils.is_null(log_id) is False:
        try:
            awsResourceChecker_logic.update_log_stream_name_to_s3(
                trace_id, check_history_id, log_id)
        except PmError as e:
            common_utils.write_log_pm_error(e, pm_logger, exc_info=True)

    # チェック履歴情報の取得とステータス更新
    pm_logger.info("-- チェック履歴情報取得処理開始 ----")
    try:
        check_history = pm_checkHistory.query_key(trace_id, check_history_id)
    except PmError as e:
        pm_logger.error("チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, pm_logger, "AGG_SECURITY-002")
    if (not check_history):
        pm_logger.error("チェック履歴情報がありません。: CheckHistoryID=%s", check_history_id)
        pm_error = PmError(message="AGG_SECURITY-002")
        raise pm_error
    pm_logger.info("-- チェック履歴情報取得処理終了 ----")

    # 取得したチェック履歴情報のステータスをチェックします。
    pm_logger.info("-- チェック履歴情報ステータスチェック開始  ----")
    if (check_history['CheckStatus'] != CheckStatus.CheckCompleted):
        pm_logger.error(
            "チェック実行ステータスが一致しません。: CheckHistoryID=%s, CheckStatus=%s",
            check_history_id, check_history['CheckStatus'])
        pm_error = PmError(message="AGG_SECURITY-003")
        raise pm_error

    # チェック履歴情報のステータスを更新します。
    attribute = {'CheckStatus': {"Value": CheckStatus.SummaryProgress}}
    try:
        pm_checkHistory.update(trace_id, check_history_id, attribute,
                               check_history['UpdatedAt'])
        pm_logger.info("-- チェック履歴情報ステータスチェック終了 ----")
    except PmError as e:
        pm_logger.error("チェック履歴情報のステータス更新に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, pm_logger, "AGG_SECURITY-004")

    # 個別チェック結果取得
    pm_logger.info("-- 個別チェック結果取得開始 ----")
    try:
        list_check_result_items = pm_checkResultItems.query_check_history_index_fiter_ne_exclusion_flag(
            trace_id, check_history_id, ExclusionFlag.Enable)
    except PmError as e:
        pm_logger.error("個別チェック結果取得に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, pm_logger, "AGG_SECURITY-005")
    if (not list_check_result_items):
        pm_logger.error("個別チェック結果がありません。: CheckHistoryID=%s", check_history_id)
        raise PmError(message="AGG_SECURITY-005")
    pm_logger.info("-- 個別チェック結果取得終了 ----")

    # 個別チェック結果集計 / チェック結果更新
    pm_logger.info("-- 個別チェック結果集計開始 ----")
    list_check_result_items = sorted(
        list_check_result_items, key=itemgetter('CheckResultID'))

    check_result_id = list_check_result_items[0]['CheckResultID']
    ok_count = critical_count = ng_count = managed_count = error_count = 0
    count = 0
    for check_result_item in list_check_result_items:
        count += 1
        check_result = check_result_item['CheckResult']
        if (check_result_item['CheckResultID'] == check_result_id):
            if check_result == CheckResult.Normal:
                ok_count += 1
            elif check_result == CheckResult.MinorInadequacies:
                ng_count += 1
            elif check_result == CheckResult.CriticalDefect:
                critical_count += 1
            elif check_result == CheckResult.MembersManagement:
                managed_count += 1
            elif check_result == CheckResult.Error:
                error_count += 1
        else:
            update_check_results(trace_id, check_history_id, check_result_id,
                                 ok_count, critical_count, ng_count,
                                 managed_count, error_count)
            check_result_id = check_result_item['CheckResultID']
            ok_count = critical_count = ng_count = managed_count = error_count = 0
            if check_result == CheckResult.Normal:
                ok_count += 1
            elif check_result == CheckResult.MinorInadequacies:
                ng_count += 1
            elif check_result == CheckResult.CriticalDefect:
                critical_count += 1
            elif check_result == CheckResult.MembersManagement:
                managed_count += 1
            elif check_result == CheckResult.Error:
                error_count += 1

        # update data PM_CheckResults
        if (count == len(list_check_result_items)):
            update_check_results(trace_id, check_history_id, check_result_id,
                                 ok_count, critical_count, ng_count,
                                 managed_count, error_count)
    pm_logger.info("-- 個別チェック結果集計終了 ----")

    # 最新チェック結果作成
    pm_logger.info("-- 最新チェック結果作成開始 ----")
    organization_id = check_history['OrganizationID']
    project_id = check_history['ProjectID']
    try:
        pm_latestCheckResult.create(trace_id, organization_id, project_id,
                                    check_history_id)
    except PmError as e:
        pm_logger.error("最新チェック結果テーブルのレコード作成に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, pm_logger, "AGG_SECURITY-007")


def update_check_results(trace_id, check_history_id, check_result_id, ok_count,
                         critical_count, ng_count, managed_count, error_count):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    attribute = {
        'OKCount': {
            "Value": ok_count
        },
        'CriticalCount': {
            "Value": critical_count
        },
        'NGCount': {
            "Value": ng_count
        },
        'ManagedCount': {
            "Value": managed_count
        },
        'ErrorCount': {
            "Value": error_count
        }
    }
    try:
        pm_checkResults.update(trace_id, check_result_id, attribute)
    except PmError as e:
        pm_logger.error(
            "チェック結果の集計値の更新に失敗しました。: CheckHistoryID=%s, CheckResultID=%s",
            check_history_id, check_result_id)
        raise common_utils.write_log_pm_error(e, pm_logger, "AGG_SECURITY-006")


def check_result_notification(check_history_id, language):
    trace_id = check_history_id
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        list_check_result = pm_checkResults.query_history_index(
            trace_id, check_history_id)
    except PmError as e:
        pm_logger.error("チェック結果取得に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        return

    if (not list_check_result):
        pm_logger.error("チェック結果がありません。: CheckHistoryID=%s", check_history_id)
        return

    is_all_record_ok = True
    for check_result in list_check_result:
        if (check_result['NGCount'] > 0 or check_result['CriticalCount'] > 0 or
                check_result['ErrorCount'] > 0):
            is_all_record_ok = False
            break

    # 全てOKだった場合は、ログを出力してこの処理をスキップします。
    if (is_all_record_ok is True):
        pm_logger.info("チェック結果が全て正常なため、結果通知処理をスキップします。")
        return

    organization_id = list_check_result[0]['OrganizationID']
    org_notify_mail_destinations = []

    # Lambda関数呼び出し時のPayloadには、チェック履歴IDをJSONとして渡します。
    payload = {'CheckHistoryId': check_history_id, 'Language': language}
    service_name = common_utils.get_service_name()
    stage = common_utils.get_stage()

    try:
        org_notify_mail_destinations = pm_orgNotifyMailDestinations.query_key(
            trace_id, organization_id, CommonConst.NOTIFY_CODE)
    except PmError as e:
        pm_logger.error("宛先の取得に失敗しました。結果通知処理をスキップします。")

    if (not org_notify_mail_destinations):
        pm_logger.info("宛先が未設定のため、結果通知処理をスキップします。")
    else:
        # セキュリティチェック結果通知メール送信処理のLambdaを非同期で呼び出します。
        function_name = CommonConst.EXECUTE_SEND_RESULT_EMAIL.format(
            service_name, stage)
        aws_common.lambda_invoke(trace_id, function_name, json.dumps(payload))

    # 組織別Slack通知設定テーブルから、組織ID、通知コードCHECK_CISをキーとして設定情報を取得します。
    try:
        org_notify_slack = pm_orgNotifySlack.query_key(
            trace_id, organization_id, CommonConst.NOTIFY_CODE)
    except PmError as e:
        pm_logger.error("Slack通知設定の取得に失敗しました。結果Slack通知処理をスキップします。")
        return

    if (not org_notify_slack):
        pm_logger.info("Slack通知が未設定のため、結果Slack通知処理をスキップします。")
        return

    # セキュリティチェック結果通知Slack送信のLambdaを非同期で呼び出します。
    function_name_send_slack = CommonConst.EXECUTE_SEND_RESULT_SLACK.format(
        service_name, stage)
    aws_common.lambda_invoke(trace_id, function_name_send_slack,
                             json.dumps(payload))
