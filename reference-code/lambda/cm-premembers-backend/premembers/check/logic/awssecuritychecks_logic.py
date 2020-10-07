import inspect
import json
import jmespath
from decimal import Decimal
from datetime import timedelta

from premembers.common import common_utils, aws_common, FileUtils, date_utils
from operator import itemgetter
from premembers.const.const import CommonConst
from premembers.exception.pm_exceptions import PmError
from premembers.common import StepfunctionsUtils
from premembers.repository.const import CheckStatus, CheckResult, AssessmentFlag
from premembers.repository import pm_projects, pm_organizations
from premembers.repository import pm_checkResults, pm_latestCheckResult
from premembers.repository import pm_organizationTasks, pm_checkResultItems
from premembers.repository import pm_exclusionitems
from premembers.repository import pm_orgNotifyMailDestinations
from premembers.repository import pm_awsAccountCoops, pm_orgNotifySlack
from premembers.repository import pm_checkHistory
from premembers.repository import pm_affiliation, pm_batchJobDefs
from premembers.repository.const import ExclusionFlag
from premembers.common import IAMUtils
from premembers.repository.const import Members
from premembers.check.logic.check_asc import asc_item_1_logic, asc_item_2_logic
from premembers.check.logic.check_asc import asc_item_3_logic, asc_item_4_logic
from premembers.check.logic.check_asc import asc_item_5_logic, asc_item_6_logic
from premembers.check.logic.check_asc import asc_item_7_logic, asc_item_8_logic
from premembers.check.logic.check_asc import asc_item_9_logic
from premembers.check.logic.check_asc import asc_item_10_logic
from premembers.check.logic.check_asc import asc_item_11_logic
from premembers.check.logic.check_asc import asc_item_12_logic
from premembers.check.logic.check_asc import asc_item_13_logic
from premembers.check.logic.check_asc import asc_item_14_logic
from premembers.check.logic.check_asc import asc_item_15_logic
from premembers.check.logic.check_asc import asc_item_16_logic

LIST_ASC_CHECK_ITEM_CODE = [
    'CHECK_ASC_ITEM_01_01', 'CHECK_ASC_ITEM_02_01', 'CHECK_ASC_ITEM_02_02',
    'CHECK_ASC_ITEM_03_01', 'CHECK_ASC_ITEM_04_01', 'CHECK_ASC_ITEM_05_01',
    'CHECK_ASC_ITEM_06_01', 'CHECK_ASC_ITEM_07_01', 'CHECK_ASC_ITEM_08_01',
    'CHECK_ASC_ITEM_09_01', 'CHECK_ASC_ITEM_10_01', 'CHECK_ASC_ITEM_11_01',
    'CHECK_ASC_ITEM_12_01', 'CHECK_ASC_ITEM_13_01', 'CHECK_ASC_ITEM_14_01',
]

LIST_CHECK_ITEM_CODE_ASSESSMENT = [
    "CHECK_CIS12_ITEM_1_15", "CHECK_CIS12_ITEM_1_17", "CHECK_CIS12_ITEM_1_18",
    "CHECK_CIS12_ITEM_4_04", "CHECK_ASC_ITEM_02_02", "CHECK_ASC_ITEM_05_01",
    "CHECK_ASC_ITEM_06_01", "CHECK_ASC_ITEM_09_01", "CHECK_ASC_ITEM_11_01",
    "CHECK_ASC_ITEM_14_01", "CHECK_ASC_ITEM_15_01", "CHECK_IBP_ITEM_04_01",
    "CHECK_IBP_ITEM_06_01", "CHECK_IBP_ITEM_10_01", "CHECK_IBP_ITEM_13_01",
    "CHECK_IBP_ITEM_14_03"
]


def execute_securitycheck_statemachine(trace_id, check_history_id):
    # ここでは、環境変数からStepFunctionsのステートマシンARNを取得し
    # StepFunctionsを起動します。
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())

    # バリデーションチェック
    if common_utils.is_null(check_history_id):
        cw_logger.error("チェック履歴IDが指定されていません。")
        raise PmError(message="CKEX_SECURITY-001")

    try:
        param = {'check_history_id': check_history_id}

        # セキュリティチェック・ステートマシンの起動
        try:
            # Get step functions client
            step_functions_client = StepfunctionsUtils.get_step_functions_client(
                trace_id)

            # Start state machine
            security_check_state_machine_arn = common_utils.get_environ(
                    CommonConst.SECURITYCHECK_STATE_MACHINE_ARN)
            StepfunctionsUtils.start_execution_step_functions(
                trace_id,
                check_history_id,
                step_functions_client,
                security_check_state_machine_arn,
                json.dumps(param))
        except PmError as e:
            raise common_utils.write_log_pm_error(e, cw_logger,
                                                  "CKEX_SECURITY-002")

        check_status = CheckStatus.CheckCompleted
        message_error_code = None
    except PmError as e:
        check_status = CheckStatus.Waiting
        message_error_code = e.message
        raise common_utils.write_log_pm_error(e, cw_logger)
    finally:
        try:
            update_status_checkhistory(check_history_id, message_error_code,
                                       check_status)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, cw_logger, exc_info=True)


def update_status_checkhistory(check_history_id, error_code, check_status):
    trace_id = check_history_id
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    try:
        check_history = pm_checkHistory.query_key(trace_id,
                                                  check_history_id,
                                                  is_cw_logger=True)
    except PmError as e:
        cw_logger.error("チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, cw_logger)

    if (not check_history):
        cw_logger.error("チェック履歴情報がありません。: CheckHistoryID=%s", check_history_id)
        raise PmError()

    # チェック履歴情報のステータスを更新します。
    attribute = {
        'CheckStatus': {
            "Value": check_status
        },
        'ErrorCode': {
            "Value": error_code
        }
    }
    try:
        updated_at = check_history['UpdatedAt']
        pm_checkHistory.update(trace_id,
                               check_history_id,
                               attribute,
                               updated_at,
                               is_cw_logger=True)
    except PmError as e:
        cw_logger.error("チェック履歴情報のステータス更新に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, cw_logger)


def get_check_awsaccounts(trace_id, check_history_id):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())

    # Check validate
    if common_utils.is_null(check_history_id):
        cw_logger.error("チェック履歴IDが指定されていません。")
        pm_error = PmError(message="GCA_SECURITY-001")
        raise pm_error

    # チェック履歴情報の取得
    try:
        check_history = pm_checkHistory.query_key(trace_id,
                                                  check_history_id,
                                                  is_cw_logger=True)
    except PmError as e:
        cw_logger.error("チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, cw_logger,
                                              "GCA_SECURITY-002")

    if (not check_history):
        cw_logger.error("チェック履歴情報がありません。: CheckHistoryID=%s",
                        check_history_id)
        pm_error = PmError(message="GCA_SECURITY-002")
        raise pm_error

    # チェック対象の組織情報を取得します。
    organization_id = check_history["OrganizationID"]
    try:
        organization = pm_organizations.get_organization(trace_id,
                                                         organization_id,
                                                         is_cw_logger=True)
    except PmError as e:
        cw_logger.error("組織情報の取得に失敗しました。: OrganizationID=%s",
                        organization_id)
        raise common_utils.write_log_pm_error(e, cw_logger,
                                              "GCA_SECURITY-003")

    if (not organization):
        cw_logger.error("組織情報がありません。: OrganizationID=%s",
                        organization_id)
        pm_error = PmError(message="GCA_SECURITY-003")
        raise pm_error
    organization_name = organization["OrganizationName"]

    # プロジェクト情報の取得
    project_id = check_history['ProjectID']
    try:
        project = pm_projects.query_key(trace_id,
                                        project_id,
                                        is_cw_logger=True)
    except PmError as e:
        cw_logger.error("プロジェクト情報の取得に失敗しました。: ProjectID=%s",
                        project_id)
        raise common_utils.write_log_pm_error(e, cw_logger,
                                              "GCA_SECURITY-004")

    if (not project):
        cw_logger.error("プロジェクト情報がありません。: ProjectID=%s",
                        project_id)
        pm_error = PmError(message="GCA_SECURITY-004")
        raise pm_error
    project_name = project['ProjectName']

    # AWSアカウント情報の取得
    try:
        list_awscoops = pm_awsAccountCoops.query_awscoop_effective_enable(
            trace_id, project_id, is_cw_logger=True)
    except PmError as e:
        cw_logger.error("AWSアカウント連携情報の取得に失敗しました。: ProjectID=%s", project_id)
        raise common_utils.write_log_pm_error(e, cw_logger, "GCA_SECURITY-005")

    if (not list_awscoops):
        cw_logger.error("AWSアカウント連携情報がありません。: ProjectID=%s", project_id)
        pm_error = PmError(message="GCA_SECURITY-005")
        raise pm_error

    # 取得したチェック履歴情報のステータスをチェックします。
    check_status = check_history['CheckStatus']
    if check_status != 0:
        cw_logger.error(
            "チェック実行ステータスが一致しません。: CheckHistoryID=%s, CheckStatus=%s",
            check_history_id, check_status)
        pm_error = PmError(message="GCA_SECURITY-006")
        raise pm_error

    # チェック履歴情報のステータスを更新します。
    executed_date_time = common_utils.get_current_date()
    time_to_live = common_utils.get_time_to_live(days=30)
    attribute = {
        'CheckStatus': {
            "Value": 1
        },
        'ExecutedDateTime': {
            "Value": executed_date_time
        },
        'TimeToLive': {
            "Value": time_to_live
        }
    }
    try:
        updated_at = check_history['UpdatedAt']
        pm_checkHistory.update(trace_id,
                               check_history_id,
                               attribute,
                               updated_at,
                               is_cw_logger=True)
    except PmError as e:
        cw_logger.error("チェック履歴情報のステータス更新に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, cw_logger,
                                              "GCA_SECURITY-007")

    # チェック結果レコードを作成します。
    for awscoops in list_awscoops:
        coop_id = awscoops['CoopID']
        aws_account = awscoops['AWSAccount']
        aws_account_name = common_utils.get_value("AWSAccountName", awscoops,
                                                  None)
        try:
            check_result_id = common_utils.get_uuid4()
            sort_code = "{0}_{1}_{2}".format(organization_name, project_name,
                                             aws_account)
            pm_checkResults.create(
                trace_id, check_result_id, check_history_id, "CHECK_SECURITY",
                organization_id, organization_name, project_id, project_name,
                coop_id, aws_account, sort_code, 0, 0, 0, executed_date_time,
                time_to_live, aws_account_name, is_cw_logger=True)

        except PmError as e:
            cw_logger.error(
                "チェック結果レコードの作成に失敗しました。: CheckHistoryID=%s, AWSAccount=%s",
                check_history_id, aws_account)
            raise common_utils.write_log_pm_error(e, cw_logger,
                                                  "GCA_SECURITY-008")
        awscoops['CheckResultID'] = check_result_id

    pattern_get_list_awscoops = "[*].{AWSAccount: AWSAccount, CoopID: CoopID, AWSAccountName: AWSAccountName, RoleName: RoleName, ExternalID: ExternalID, OrganizationID: OrganizationID, OrganizationName: `" + organization_name + "`, ProjectID: ProjectID, ProjectName: `" + project_name + "`, CheckHistoryId: `" + check_history_id + "`, CheckResultID: CheckResultID}"
    list_awscoops_response = jmespath.search(pattern_get_list_awscoops,
                                             list_awscoops)

    response = {
        'CheckHistoryId': check_history_id,
        'AWSAccounts': list_awscoops_response
    }
    return common_utils.response(response, cw_logger)


def check_effective_awsaccount(trace_id, aws_account, coop_id, role_name,
                               external_id, organization_id, project_id,
                               check_history_id):
    # セキュリティチェック結果集計
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())

    try:
        # バリデーションチェック
        validate_input_check_effective_awsaccount(trace_id, aws_account,
                                                  coop_id, role_name,
                                                  external_id, organization_id,
                                                  project_id, check_history_id)

        # AWSアカウントのメンバーズ加入判定
        try:
            awscoop = pm_awsAccountCoops.query_awscoop_coop_key(
                trace_id, coop_id, is_cw_logger=True)
        except PmError as e:
            cw_logger.error("AWSアカウント連携情報取得に失敗しました。: CoopID=%s", coop_id)
            raise common_utils.write_log_pm_error(e, cw_logger)

        try:
            session = aws_common.create_session_client(trace_id,
                                                       aws_account,
                                                       role_name,
                                                       external_id,
                                                       is_cw_logger=True)
        except PmError as e:
            cw_logger.warning("[%s] Credentialsを取得できませんでした。", aws_account)
            try:
                do_disable_awscoop(trace_id, coop_id, aws_account)
            except PmError as e:
                raise common_utils.write_log_pm_error(e,
                                                      cw_logger)
            raise common_utils.write_log_pm_error(e, cw_logger)

        try:
            iam_client = IAMUtils.get_iam_client(trace_id,
                                                 session,
                                                 aws_account,
                                                 is_cw_logger=True)
        except PmError as e:
            raise common_utils.write_log_pm_error(
                e, cw_logger, "CEA_SECURITY-002-" + aws_account)

        members = get_membership_aws_account(trace_id, awscoop, aws_account,
                                             iam_client)

        response = {
            "TaskResult": "Success",
            "Members": str(members),
            "AccountCoop": "1"
        }
    except PmError as e:
        response = {"TaskResult": "Fail"}
        common_utils.write_log_pm_error(e, cw_logger, exc_info=True)
    except Exception as e:
        response = {"TaskResult": "Fail"}
        common_utils.write_log_exception(e, cw_logger, True)
    finally:
        return common_utils.response(response, cw_logger)


def do_disable_awscoop(trace_id, coop_id, aws_account):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())

    task_id = common_utils.get_uuid4()
    code = CommonConst.CHECK_AWS_COOP
    try:
        pm_organizationTasks.create_organizationTask(trace_id, task_id, code,
                                                     coop_id, "0",
                                                     CommonConst.SYSTEM, 0, 0,
                                                     3, is_cw_logger=True)
    except PmError as e:
        cw_logger.warning("[%s] 無効なAWSアカウント連携の処理タスクレコード作成に失敗しました。",
                          aws_account)
        raise common_utils.write_log_pm_error(
            e, cw_logger, "CEA_SECURITY-003-" + aws_account)

    # Public message
    try:
        topic_arn = common_utils.get_environ(
            CommonConst.INVALID_AWS_COOP_TASK_TOPIC)
        message = {"TaskId": str(task_id), "Code": code}
        subject = "TASK : " + task_id

        # Send sns
        aws_common.aws_sns(trace_id,
                           subject,
                           json.dumps(message),
                           topic_arn,
                           is_cw_logger=True)
    except PmError as e:
        cw_logger.warning("[%s] 無効なAWSアカウント連携の処理メッセージ送信に失敗しました。（%s）",
                          aws_account, topic_arn)
        raise common_utils.write_log_pm_error(
            e, cw_logger, "CEA_SECURITY-004-" + aws_account)


def get_membership_aws_account(trace_id, awscoops, aws_account, iam_client):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    # デフォルト値はメンバーズに加入していないAWSアカウントです。
    members = Members.Disable

    # IAMクライアントを用いて、IAMロールcm-membersportalを取得します。
    cm_members_role_name = common_utils.get_environ(
        CommonConst.CM_MEMBERS_ROLE_NAME, CommonConst.CM_MEMBERS_PORTAL)
    try:
        IAMUtils.get_role(trace_id,
                          iam_client,
                          cm_members_role_name,
                          is_cw_logger=True)
        members = Members.Enable
        cw_logger.info("[%s] IAMロール「%s」が存在します。", aws_account,
                       cm_members_role_name)
    except PmError as e:
        if e.cause_error.response['Error'][
                'Code'] == CommonConst.NO_SUCH_ENTITY:
            cw_logger.info("[%s] IAMロール「%s」が存在しません。", aws_account,
                           cm_members_role_name)
        else:
            cw_logger.warning("[%s] IAMロール「%s」の取得に失敗しました。", aws_account,
                              cm_members_role_name)
            return members

    if (common_utils.check_key('Members', awscoops) is False
            or awscoops['Members'] != members):
        attribute = {'Members': {"Value": members}}
        try:
            pm_awsAccountCoops.update_awscoops(trace_id,
                                               awscoops['CoopID'],
                                               attribute,
                                               is_cw_logger=True)
        except PmError:
            cw_logger.warning("[%s] AWSアカウント連携の更新に失敗しました。:CoopID=%s",
                              aws_account, awscoops['CoopID'])
    return members


def validate_input_check_effective_awsaccount(trace_id, aws_account, coop_id,
                                              role_name, external_id,
                                              organization_id, project_id,
                                              check_history_id):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    elements_error = []
    list_element_validate = [
        "AWSAccount", "CoopID", "RoleName", "ExternalID", "OrganizationID",
        "ProjectID", "CheckHistoryId"
    ]

    dict_element_validate = {
        "AWSAccount": aws_account,
        "CoopID": coop_id,
        "RoleName": role_name,
        "ExternalID": external_id,
        "OrganizationID": organization_id,
        "ProjectID": project_id,
        "CheckHistoryId": check_history_id
    }

    for element_validate in list_element_validate:
        # バリデーションチェック
        if common_utils.is_null(dict_element_validate[element_validate]):
            elements_error.append(element_validate)
    elements_error = ', '.join(elements_error)

    if elements_error:
        cw_logger.error("%sが指定されていません。", elements_error)
        raise PmError(message="CEA_SECURITY-001")


def execute_securitycheck_aggregate(trace_id, check_history_id):
    # セキュリティチェック結果集計
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())

    # バリデーションチェック
    error_code = None
    try:
        aws_resource_aggregate(trace_id, check_history_id)
    except PmError as e:
        common_utils.write_log_pm_error(e, cw_logger, exc_info=True)
        error_code = e.message
    except Exception as e:
        common_utils.write_log_exception(e, cw_logger, True)
        error_code = 'AGG_SECURITY-999'

    # チェック処理結果を記録
    task_result = CommonConst.TASK_RESULT_SUCCESS
    try:
        check_status = CheckStatus.CheckCompleted
        if (error_code is None):
            check_status = CheckStatus.SummaryCompleted
        else:
            task_result = CommonConst.TASK_RESULT_FAIL

        update_status_checkhistory(check_history_id, error_code, check_status)

        # チェック結果通知処理
        check_result_notification(check_history_id)
    except PmError as e:
        common_utils.write_log_pm_error(e, cw_logger, exc_info=True)
        task_result = CommonConst.TASK_RESULT_FAIL
    except Exception as e:
        common_utils.write_log_exception(e, cw_logger, True)
        task_result = CommonConst.TASK_RESULT_FAIL

    cw_logger.info("-- 最新チェック結果作成終了 ----")

    response = {"TaskResult": task_result}
    return common_utils.response(response, cw_logger)


def aws_resource_aggregate(trace_id, check_history_id):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    # バリデーションチェック
    if common_utils.is_null(check_history_id):
        cw_logger.error("チェック履歴IDが指定されていません。")
        raise PmError(message="AGG_SECURITY-001")

    # チェック履歴情報の取得とステータス更新
    cw_logger.info("-- チェック履歴情報取得処理開始 ----")
    try:
        check_history = pm_checkHistory.query_key(trace_id,
                                                  check_history_id,
                                                  is_cw_logger=True)
    except PmError as e:
        cw_logger.error("チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, cw_logger, "AGG_SECURITY-002")
    if (not check_history):
        cw_logger.error("チェック履歴情報がありません。: CheckHistoryID=%s", check_history_id)
        raise PmError(message="AGG_SECURITY-002")
    cw_logger.info("-- チェック履歴情報取得処理終了 ----")

    # 取得したチェック履歴情報のステータスをチェックします。
    cw_logger.info("-- チェック履歴情報ステータスチェック開始  ----")
    if (check_history['CheckStatus'] != CheckStatus.CheckCompleted):
        cw_logger.error(
            "チェック実行ステータスが一致しません。: CheckHistoryID=%s, CheckStatus=%s",
            check_history_id, check_history['CheckStatus'])
        raise PmError(message="AGG_SECURITY-003")

    # チェック履歴情報のステータスを更新します。
    attribute = {'CheckStatus': {"Value": CheckStatus.SummaryProgress}}
    try:
        pm_checkHistory.update(trace_id,
                               check_history_id,
                               attribute,
                               check_history['UpdatedAt'],
                               is_cw_logger=True)
        cw_logger.info("-- チェック履歴情報ステータスチェック終了 ----")
    except PmError as e:
        cw_logger.error("チェック履歴情報のステータス更新に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, cw_logger, "AGG_SECURITY-004")

    # 個別チェック結果取得
    cw_logger.info("-- 個別チェック結果取得開始 ----")
    try:
        list_check_result_items = pm_checkResultItems.query_check_history_index_fiter_ne_exclusion_flag(
            trace_id,
            check_history_id,
            ExclusionFlag.Enable,
            is_cw_logger=True)
    except PmError as e:
        cw_logger.error("個別チェック結果取得に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, cw_logger, "AGG_SECURITY-005")
    if (not list_check_result_items):
        cw_logger.error("個別チェック結果がありません。: CheckHistoryID=%s", check_history_id)
        raise PmError(message="AGG_SECURITY-005")
    cw_logger.info("-- 個別チェック結果取得終了 ----")

    # 個別チェック結果集計 / チェック結果更新
    cw_logger.info("-- 個別チェック結果集計開始 ----")
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
    cw_logger.info("-- 個別チェック結果集計終了 ----")

    # 最新チェック結果作成
    cw_logger.info("-- 最新チェック結果作成開始 ----")
    organization_id = check_history['OrganizationID']
    project_id = check_history['ProjectID']
    try:
        pm_latestCheckResult.create(trace_id,
                                    organization_id,
                                    project_id,
                                    check_history_id,
                                    is_cw_logger=True)
    except PmError as e:
        cw_logger.error("最新チェック結果テーブルのレコード作成に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, cw_logger, "AGG_SECURITY-007")


def check_result_notification(check_history_id):
    trace_id = check_history_id
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    try:
        list_check_result = pm_checkResults.query_history_index(
            trace_id, check_history_id, is_cw_logger=True)
    except PmError:
        cw_logger.error("チェック結果取得に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        return

    if (not list_check_result):
        cw_logger.error("チェック結果がありません。: CheckHistoryID=%s", check_history_id)
        return

    is_all_record_ok = True
    for check_result in list_check_result:
        if (check_result['NGCount'] > 0 or check_result['CriticalCount'] > 0 or
                check_result['ErrorCount'] > 0):
            is_all_record_ok = False
            break

    # 全てOKだった場合は、ログを出力してこの処理をスキップします。
    if (is_all_record_ok is True):
        cw_logger.info("チェック結果が全て正常なため、結果通知処理をスキップします。")
        return

    organization_id = list_check_result[0]['OrganizationID']
    # get language
    language = get_language(check_history_id)
    payload = {'CheckHistoryId': check_history_id, 'Language': language}
    service_name = common_utils.get_service_name()
    stage = common_utils.get_stage()
    # Lambda関数呼び出し時のPayloadには、チェック履歴IDをJSONとして渡します。
    org_notify_mail_destinations = []

    try:
        org_notify_mail_destinations = pm_orgNotifyMailDestinations.query_key(
            trace_id,
            organization_id,
            CommonConst.NOTIFY_CODE,
            is_cw_logger=True)
    except PmError:
        cw_logger.error("宛先の取得に失敗しました。結果通知処理をスキップします。")

    if (not org_notify_mail_destinations):
        cw_logger.info("宛先が未設定のため、結果通知処理をスキップします。")
    else:
        # セキュリティチェック結果通知メール送信処理のLambdaを非同期で呼び出します。
        function_name = CommonConst.EXECUTE_SEND_RESULT_EMAIL.format(
            service_name, stage)
        aws_common.lambda_invoke(trace_id,
                                 function_name,
                                 json.dumps(payload),
                                 is_cw_logger=True)

    # 組織別Slack通知設定テーブルから、組織IDチェック対象組織のOrganizationIdと通知コードCHECK_CISをキーとして、設定情報を取得します。
    try:
        org_notify_slack = pm_orgNotifySlack.query_key(trace_id,
                                                       organization_id,
                                                       CommonConst.NOTIFY_CODE,
                                                       is_cw_logger=True)
    except PmError:
        cw_logger.error("Slack通知設定の取得に失敗しました。結果Slack通知処理をスキップします。")

    if (not org_notify_slack):
        cw_logger.info("Slack通知が未設定のため、結果Slack通知処理をスキップします。")
    else:
        # セキュリティチェック結果通知Slack送信のLambdaを非同期で呼び出します。
        function_name_send_slack = CommonConst.EXECUTE_SEND_RESULT_SLACK.format(
            service_name, stage)
        aws_common.lambda_invoke(trace_id, function_name_send_slack,
                                 json.dumps(payload), is_cw_logger=True)


def update_check_results(trace_id, check_history_id, check_result_id, ok_count,
                         critical_count, ng_count, managed_count, error_count):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
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
        pm_checkResults.update(trace_id,
                               check_result_id,
                               attribute,
                               is_cw_logger=True)
    except PmError as e:
        cw_logger.error(
            "チェック結果の集計値の更新に失敗しました。: CheckHistoryID=%s, CheckResultID=%s",
            check_history_id, check_result_id)
        raise common_utils.write_log_pm_error(e, cw_logger, "AGG_SECURITY-006")


def get_language(check_history_id):
    trace_id = check_history_id
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())

    # get language user execute
    try:
        check_history = pm_checkHistory.query_key(trace_id,
                                                  check_history_id,
                                                  is_cw_logger=True)
    except PmError as e:
        cw_logger.error("チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, cw_logger)

    if (not check_history):
        cw_logger.error("チェック履歴情報がありません。: CheckHistoryID=%s", check_history_id)
        raise PmError()

    execute_user_id = check_history['ExecuteUserID']
    try:
        user_info = aws_common.get_cognito_user_info_by_user_name(
            trace_id, execute_user_id, is_cw_logger=True)
    except PmError as e:
        msg_err = "Cognitoから情報取得に失敗しました。"
        cw_logger.error(msg_err)
        raise common_utils.write_log_pm_error(e, cw_logger, msg_err)

    language = jmespath.search("[?Name=='locale'].Value | [0]",
                               user_info['UserAttributes'])

    if language in CommonConst.LANGUAGE_SUPPORT:
        return language

    return CommonConst.LANGUAGE_ENGLISH


def create_report_batch_job(trace_id, check_history_id):
    # セキュリティチェックレポート作成ジョブ登録
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    response = {"TaskResult": "Success"}
    try:
        excute_create_report_batch_job(trace_id, check_history_id)
    except PmError:
        response = {"TaskResult": "Fail"}
    return common_utils.response(response, cw_logger)


def excute_create_report_batch_job(trace_id, check_history_id):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    # Check validate
    if common_utils.is_null(check_history_id):
        cw_logger.error("チェック履歴IDが指定されていません。")
        pm_error = PmError(message="CRPT_SECURITY-001")
        raise pm_error

    # チェック履歴情報を取得します。
    try:
        check_history = pm_checkHistory.query_key(trace_id,
                                                  check_history_id,
                                                  is_cw_logger=True)
    except PmError as e:
        cw_logger.error("チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, cw_logger,
                                              "CRPT_SECURITY-002", True)

    if (not check_history):
        cw_logger.error("チェック履歴情報がありません。: CheckHistoryID=%s",
                        check_history_id)
        pm_error = PmError(message="CRPT_SECURITY-002")
        raise pm_error

    # 取得したチェック履歴情報のステータスをチェックします。
    check_status = check_history['CheckStatus']
    if check_status != CheckStatus.SummaryCompleted:
        cw_logger.error("チェック実行ステータスが一致しません。: CheckHistoryID=%s, CheckStatus=%s",
                        check_history_id, check_status)
        pm_error = PmError(message="CRPT_SECURITY-003")
        # チェック履歴情報のステータスを更新します。
        attribute = {
            'CheckStatus': {
                "Value": CheckStatus.SummaryCompleted
            }
        }
        try:
            updated_at = check_history['UpdatedAt']
            pm_checkHistory.update(trace_id,
                                   check_history_id,
                                   attribute,
                                   updated_at,
                                   is_cw_logger=True)
        except PmError as e:
            cw_logger.error("チェック履歴情報のステータス更新に失敗しました。: CheckHistoryID=%s",
                            check_history_id)
            raise common_utils.write_log_pm_error(e, cw_logger, exc_info=True)
        raise pm_error

    excute_user_id = check_history['ExecuteUserID']
    project_id = check_history['ProjectID']

    # セキュリティチェック結果レポート出力処理ジョブの設定
    job_id = []
    try:
        job_check_security_report(trace_id, project_id, check_history_id,
                                  job_id, excute_user_id)
    except PmError as e:
        raise common_utils.write_log_pm_error(e, cw_logger, exc_info=True)


def job_check_security_report(trace_id, project_id, check_history_id, job_id,
                              user_id):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    code = "CHECK_SECURITY_REPORT"
    try:
        batch_job_def = pm_batchJobDefs.query_report_job_def_key(
            trace_id, code, is_cw_logger=True)
    except PmError as e:
        cw_logger.error("バッチジョブ定義テーブルからジョブ種別コード=\"%s\"の取得に失敗しました。", code)
        raise common_utils.write_log_pm_error(e, cw_logger,
                                              "CRPT_SECURITY-004", True)

    if not batch_job_def:
        cw_logger.error("バッチジョブ定義テーブルからジョブ種別コード=\"%s\"が取得できませんでした。", code)
        pm_error = PmError(message="CRPT_SECURITY-004")
        raise pm_error
    # ログID（UUID（v４））
    log_id = common_utils.get_uuid4()

    # AWS Batch
    job_name = code + "--" + check_history_id + "--" + log_id
    job_queue = batch_job_def['JobQueue']
    job_definition = batch_job_def['JobDefinition']
    check_history_id_param = check_history_id
    log_id_param = log_id
    check_history_id_param = "--checkHistoryId=" + check_history_id
    log_id_param = "--logId=" + log_id
    parameters = {
        "CheckHistoryID": check_history_id_param,
        "LogID": log_id_param
    }
    container_overrides = {}
    if (common_utils.check_key('Environment', batch_job_def) and len(
            batch_job_def['Environment']) > 0):
        container_overrides = batch_job_def['Environment']
    max_retry = batch_job_def['MaxRetry']

    try:
        # submid job
        job_id, parameter = aws_common.submit_job(trace_id,
                                                  job_name,
                                                  job_queue,
                                                  job_id,
                                                  job_definition,
                                                  parameters,
                                                  container_overrides,
                                                  max_retry,
                                                  is_cw_logger=True)
    except PmError as e:
        cw_logger.error("バッチジョブのサブミットに失敗しました。")
        raise common_utils.write_log_pm_error(e, cw_logger,
                                              "CRPT_SECURITY-005", True)

    # セキュリティチェック結果レポート出力処理ジョブ履歴ファイルを作成し、S3に保存します。
    # Get data pm_affiliation
    try:
        affiliations = pm_affiliation.query_userid_key(trace_id,
                                                       user_id,
                                                       is_cw_logger=True)
    except PmError as e:
        cw_logger.error("所属ユーザーの取得に失敗しました。")
        raise common_utils.write_log_pm_error(e, cw_logger,
                                              "CRPT_SECURITY-006", True)

    if not affiliations:
        cw_logger.error("所属ユーザー情報が取得できませんでした。")
        pm_error = PmError(message="CRPT_SECURITY-006")
        raise pm_error
    mail_address = affiliations[0]['MailAddress']
    job_id_key = job_id[0]['jobId']
    date_now = common_utils.get_current_date()
    try:
        check_log = {
            'ProjectID': project_id,
            'CheckHistoryID': check_history_id,
            'LogID': log_id,
            'Code': code,
            'UserID': user_id,
            'MailAddress': mail_address,
            'JobID': job_id_key,
            'Parameter': parameter,
            'CreatedAt': date_now,
            'UpdatedAt': date_now
        }
        s3_file_name = CommonConst.PATH_BATCH_CHECK_LOG.format(
            check_history_id, log_id + ".json")
        FileUtils.upload_json(trace_id,
                              "S3_BATCH_LOG_BUCKET",
                              check_log,
                              s3_file_name,
                              is_cw_logger=True)
    except PmError as e:
        cw_logger.error("セキュリティチェックジョブ履歴ファイル作成に失敗しました。")
        raise common_utils.write_log_pm_error(e, cw_logger,
                                              "CRPT_SECURITY-006", True)


def execute_asc_check(trace_id, aws_account, coop_id, aws_account_name,
                      role_name, external_id, organization_id,
                      organization_name, project_id, project_name,
                      check_history_id, check_result_id, effective_awsaccount):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())

    try:
        # バリデーションチェック
        validate_input_execute_check(trace_id, aws_account, coop_id, role_name,
                                     external_id, organization_id, project_id,
                                     check_history_id, check_result_id)

        try:
            session = aws_common.create_session_client(trace_id,
                                                       aws_account,
                                                       role_name,
                                                       external_id,
                                                       is_cw_logger=True)
        except PmError as e:
            cw_logger.error("[%s] Credentialsを取得できませんでした。", aws_account)
            raise common_utils.write_log_pm_error(e, cw_logger)

        try:
            check_history = pm_checkHistory.query_key(trace_id,
                                                      check_history_id,
                                                      is_cw_logger=True)
        except PmError as e:
            cw_logger.error("チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s",
                            check_history_id)
            raise common_utils.write_log_pm_error(e, cw_logger)

        if not check_history:
            cw_logger.error("チェック履歴情報がありません。: CheckHistoryID=%s",
                            check_history_id)
            raise PmError()

        executed_date_time = check_history['ExecutedDateTime']
        time_to_live = check_history['TimeToLive']

        for check_item_code in LIST_ASC_CHECK_ITEM_CODE:
            # ASCチェック処理実行
            do_execute_asc_check(trace_id, check_item_code, organization_id,
                                 organization_name, project_id, project_name,
                                 coop_id, check_history_id, check_result_id,
                                 aws_account, executed_date_time, time_to_live,
                                 session, aws_account_name,
                                 effective_awsaccount['Members'])

        response = {"TaskResult": "Success"}
    except PmError as e:
        response = {"TaskResult": "Fail"}
        common_utils.write_log_pm_error(e, cw_logger, exc_info=True)
    except Exception as e:
        response = {"TaskResult": "Fail"}
        common_utils.write_log_exception(e, cw_logger, True)
    finally:
        return common_utils.response(response, cw_logger)


def validate_input_execute_check(trace_id, aws_account, coop_id, role_name,
                                 external_id, organization_id, project_id,
                                 check_history_id, check_result_id,
                                 check_item):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    elements_error = []
    list_element_validate = [
        "AWSAccount", "CoopID", "RoleName", "ExternalID", "OrganizationID",
        "ProjectID", "CheckHistoryId", "CheckResultID"
    ]

    dict_element_validate = {
        "AWSAccount": aws_account,
        "CoopID": coop_id,
        "RoleName": role_name,
        "ExternalID": external_id,
        "OrganizationID": organization_id,
        "ProjectID": project_id,
        "CheckHistoryId": check_history_id,
        "CheckResultID": check_result_id
    }

    for element_validate in list_element_validate:
        # バリデーションチェック
        if common_utils.is_null(dict_element_validate[element_validate]):
            elements_error.append(element_validate)
    elements_error = ', '.join(elements_error)

    if elements_error:
        cw_logger.error("%sが指定されていません。", elements_error)
        raise PmError(message=check_item + "_SECURITY-001-" + aws_account)


def do_execute_asc_check(trace_id, check_item_code, organization_id,
                         organization_name, project_id, project_name, coop_id,
                         check_history_id, check_result_id, aws_account,
                         executed_date_time, time_to_live, session,
                         aws_account_name, members):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    # File name
    result_json_path = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        "ASC/" + check_item_code + ".json")

    # ASCチェック処理開始
    cw_logger.info(
        "-- [%s]ASCチェック処理開始: CheckHistoryID=%s, CheckResultID=%s, AWSAccount=%s ----",
        check_item_code, check_history_id, check_result_id, aws_account)

    # ASC個別チェック処理実行
    try:
        if (check_item_code == "CHECK_ASC_ITEM_01_01"):
            check_result = asc_item_1_logic.check_asc_item_01_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_02_01"):
            check_result = asc_item_2_logic.check_asc_item_02_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_02_02"):
            check_result = asc_item_2_logic.check_asc_item_02_02(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_03_01"):
            check_result = asc_item_3_logic.check_asc_item_03_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_04_01"):
            check_result = asc_item_4_logic.check_asc_item_04_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_05_01"):
            check_result = asc_item_5_logic.check_asc_item_05_01(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_06_01"):
            check_result = asc_item_6_logic.check_asc_item_06_01(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_07_01"):
            check_result = asc_item_7_logic.check_asc_item_07_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_08_01"):
            check_result = asc_item_8_logic.check_asc_item_08_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_09_01"):
            check_result = asc_item_9_logic.check_asc_item_09_01(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_10_01"):
            check_result = asc_item_10_logic.check_asc_item_10_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_11_01"):
            check_result = asc_item_11_logic.check_asc_item_11_01(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_12_01"):
            check_result = asc_item_12_logic.check_asc_item_12_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_14_01"):
            check_result = asc_item_14_logic.check_asc_item_14_01(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_15_01"):
            check_result = asc_item_15_logic.check_asc_item_15_01(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_13_01"):
            check_result = asc_item_13_logic.check_asc_item_13_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_ASC_ITEM_16_01"):
            check_result = asc_item_16_logic.check_asc_item_16_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
    except PmError as e:
        check_result = CheckResult.Error
        common_utils.write_log_pm_error(e, cw_logger,
                                        "ASC_SECURITY-003-" + aws_account)

    try:
        exclusion_item = get_exclusion_item(trace_id, organization_id,
                                            project_id, aws_account,
                                            check_item_code, CommonConst.ASC)
    except PmError as e:
        check_result = CheckResult.Error
        common_utils.write_log_pm_error(e, cw_logger)

    try:
        exclusion_flag = ExclusionFlag.Disable
        if check_result != CheckResult.MembersManagement and check_result != CheckResult.Error and exclusion_item is not None:
            exclusion_flag = ExclusionFlag.Enable
            update_check_results_json(trace_id, exclusion_item,
                                      result_json_path, check_result_id,
                                      aws_account, CommonConst.ASC)
    except Exception as e:
        check_result = CheckResult.Error
        common_utils.write_log_exception(e, cw_logger)

    # ASC個別チェック結果レコードを作成します。
    try:
        check_result_item_id = common_utils.get_uuid4()
        sort_code = "{0}_{1}_{2}_{3}".format(
            check_item_code, organization_name, project_name, aws_account)
        pm_checkResultItems.create(
            trace_id, check_result_item_id, check_history_id, check_result_id,
            check_item_code, organization_id, organization_name, project_id,
            project_name, coop_id, aws_account, sort_code, check_result,
            result_json_path, None, executed_date_time,
            time_to_live, aws_account_name,
            get_assessment_flag(check_item_code, check_result), exclusion_flag)
    except PmError as e:
        cw_logger.error(
            "[%s]個別チェック結果レコードの作成に失敗しました。: CheckHistoryID=%s, CheckResultID=%s, AWSAccount=%s",
            check_item_code, check_history_id, check_result_id, aws_account)
        raise common_utils.write_log_pm_error(
            e, cw_logger, "ASC_SECURITY-005-" + aws_account)
    # ASC個別チェック処理終了
    cw_logger.info("-- [%s]ASCチェック処理終了: %s_%s_%s ----", check_item_code,
                   check_history_id, check_result_id, aws_account)


def update_check_results_json(trace_id, exclusion_item, result_json_path,
                              check_result_id, aws_account, check_item):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())

    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        result_json_path,
                                        is_cw_logger=True)) is False:
        e = PmError(None, message=check_item + "_SECURITY-004-" + aws_account)
        cw_logger.error(
            "個別チェック結果情報に紐づくチェック結果JSONファイルがありません。: CheckResultID=%s",
            check_result_id)
        raise common_utils.write_log_pm_error(e, cw_logger)

    try:
        check_results = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                            result_json_path, is_cw_logger=True)
    except PmError as e:
        raise common_utils.write_log_pm_error(e, cw_logger)

    check_results['ExclusionItem'] = {
        'ExcluesionComment': common_utils.get_value("ExclusionComment", exclusion_item),
        'UserID': common_utils.get_value("UserID", exclusion_item),
        'MailAddress': common_utils.get_value("MailAddress", exclusion_item),
        'CreatedAt': common_utils.get_value("CreatedAt", exclusion_item)
    }

    try:
        FileUtils.upload_s3(trace_id, check_results, result_json_path,
                            format_json=True, is_cw_logger=True)
    except Exception as e:
        cw_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, cw_logger)


def get_assessment_flag(check_item_code, check_result):
    assessment_flag = AssessmentFlag.NotManual
    if check_item_code in LIST_CHECK_ITEM_CODE_ASSESSMENT:
        if check_result == CheckResult.Normal:
            assessment_flag = AssessmentFlag.Assessment
        else:
            assessment_flag = AssessmentFlag.NotAssessment
    return assessment_flag


def get_exclusion_item(trace_id, organization_id, project_id, aws_account,
                       check_item_code, check_item):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
        organization_id, project_id, aws_account, check_item_code)

    try:
        exclusion_item = pm_exclusionitems.query_key(trace_id,
                                                     exclusion_item_id,
                                                     is_cw_logger=True)
    except PmError as e:
        cw_logger.error(
            "[%s]チェック項目除外テーブルの取得に失敗しました。: OrganizationID=%s, ProjectID=%s, AWSAccount=%s",
            check_item_code, organization_id, project_id, aws_account)
        raise common_utils.write_log_pm_error(
            e, cw_logger, check_item + "_SECURITY-004-" + aws_account)

    return exclusion_item
