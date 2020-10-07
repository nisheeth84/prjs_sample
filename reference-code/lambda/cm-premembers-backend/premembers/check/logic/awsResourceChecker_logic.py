import inspect
import json

from premembers.common import common_utils, aws_common, date_utils, FileUtils
from premembers.common import IAMUtils
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_awsAccountCoops, pm_checkHistory
from premembers.repository import pm_checkResults, pm_checkResultItems
from premembers.repository import pm_organizations, pm_projects
from premembers.repository import pm_organizationTasks, pm_exclusionitems
from premembers.repository import pm_exclusionResources
from premembers.const.const import CommonConst
from datetime import timedelta
from decimal import Decimal
from premembers.repository.const import Members, AssessmentFlag, CheckResult
from premembers.repository.const import ExclusionFlag
from premembers.check.logic.cis import cis_item_1_logic, cis_item_2_logic
from premembers.check.logic.cis import cis_item_3_logic, cis_item_4_logic
from premembers.check.logic.asc import asc_item_1_logic, asc_item_2_logic
from premembers.check.logic.asc import asc_item_3_logic, asc_item_4_logic
from premembers.check.logic.asc import asc_item_5_logic, asc_item_6_logic
from premembers.check.logic.asc import asc_item_7_logic, asc_item_8_logic
from premembers.check.logic.asc import asc_item_9_logic, asc_item_10_logic
from premembers.check.logic.asc import asc_item_11_logic, asc_item_12_logic
from premembers.check.logic.asc import asc_item_13_logic, asc_item_14_logic
from premembers.check.logic.asc import asc_item_15_logic, asc_item_16_logic
from premembers.check.logic.ibp import ibp_item_1_logic, ibp_item_2_logic
from premembers.check.logic.ibp import ibp_item_3_logic, ibp_item_5_logic
from premembers.check.logic.ibp import ibp_item_6_logic, ibp_item_4_logic
from premembers.check.logic.ibp import ibp_item_7_logic, ibp_item_8_logic
from premembers.check.logic.ibp import ibp_item_9_logic, ibp_item_10_logic
from premembers.check.logic.ibp import ibp_item_12_logic, ibp_item_13_logic
from premembers.check.logic.ibp import ibp_item_11_logic, ibp_item_14_logic


LIST_CIS_CHECK_ITEM_CODE = [
    'CHECK_CIS12_ITEM_1_01', 'CHECK_CIS12_ITEM_1_02', 'CHECK_CIS12_ITEM_1_03',
    'CHECK_CIS12_ITEM_1_04', 'CHECK_CIS12_ITEM_1_05', 'CHECK_CIS12_ITEM_1_06',
    'CHECK_CIS12_ITEM_1_07', 'CHECK_CIS12_ITEM_1_08', 'CHECK_CIS12_ITEM_1_09',
    'CHECK_CIS12_ITEM_1_10', 'CHECK_CIS12_ITEM_1_11', 'CHECK_CIS12_ITEM_1_12',
    'CHECK_CIS12_ITEM_1_13', 'CHECK_CIS12_ITEM_1_14', 'CHECK_CIS12_ITEM_1_15',
    'CHECK_CIS12_ITEM_1_16', 'CHECK_CIS12_ITEM_1_17', 'CHECK_CIS12_ITEM_1_18',
    'CHECK_CIS12_ITEM_1_19', 'CHECK_CIS12_ITEM_1_20', 'CHECK_CIS12_ITEM_1_21',
    'CHECK_CIS12_ITEM_1_22', 'CHECK_CIS12_ITEM_2_01', 'CHECK_CIS12_ITEM_2_02',
    'CHECK_CIS12_ITEM_2_03', 'CHECK_CIS12_ITEM_2_04', 'CHECK_CIS12_ITEM_2_05',
    'CHECK_CIS12_ITEM_2_06', 'CHECK_CIS12_ITEM_2_07', 'CHECK_CIS12_ITEM_2_08',
    'CHECK_CIS12_ITEM_2_09', 'CHECK_CIS12_ITEM_3_01', 'CHECK_CIS12_ITEM_3_02',
    'CHECK_CIS12_ITEM_3_03', 'CHECK_CIS12_ITEM_3_04', 'CHECK_CIS12_ITEM_3_05',
    'CHECK_CIS12_ITEM_3_06', 'CHECK_CIS12_ITEM_3_07', 'CHECK_CIS12_ITEM_3_08',
    'CHECK_CIS12_ITEM_3_09', 'CHECK_CIS12_ITEM_3_10', 'CHECK_CIS12_ITEM_3_11',
    'CHECK_CIS12_ITEM_3_12', 'CHECK_CIS12_ITEM_3_13', 'CHECK_CIS12_ITEM_3_14',
    'CHECK_CIS12_ITEM_4_01', 'CHECK_CIS12_ITEM_4_02', 'CHECK_CIS12_ITEM_4_03',
    'CHECK_CIS12_ITEM_4_04'
]


LIST_ASC_CHECK_ITEM_CODE = [
    'CHECK_ASC_ITEM_01_01', 'CHECK_ASC_ITEM_02_01', 'CHECK_ASC_ITEM_02_02',
    'CHECK_ASC_ITEM_03_01', 'CHECK_ASC_ITEM_04_01', 'CHECK_ASC_ITEM_05_01',
    'CHECK_ASC_ITEM_06_01', 'CHECK_ASC_ITEM_07_01', 'CHECK_ASC_ITEM_08_01',
    'CHECK_ASC_ITEM_09_01', 'CHECK_ASC_ITEM_10_01', 'CHECK_ASC_ITEM_11_01',
    'CHECK_ASC_ITEM_12_01', 'CHECK_ASC_ITEM_13_01', 'CHECK_ASC_ITEM_14_01',
    'CHECK_ASC_ITEM_15_01', 'CHECK_ASC_ITEM_16_01'
]


LIST_IBP_CHECK_ITEM_CODE = [
    'CHECK_IBP_ITEM_01_01', 'CHECK_IBP_ITEM_02_01', 'CHECK_IBP_ITEM_03_01',
    'CHECK_IBP_ITEM_04_01', 'CHECK_IBP_ITEM_05_01', 'CHECK_IBP_ITEM_06_01',
    'CHECK_IBP_ITEM_07_01', 'CHECK_IBP_ITEM_07_02', 'CHECK_IBP_ITEM_07_03',
    'CHECK_IBP_ITEM_07_04', 'CHECK_IBP_ITEM_07_05', 'CHECK_IBP_ITEM_07_06',
    'CHECK_IBP_ITEM_07_07', 'CHECK_IBP_ITEM_07_08', 'CHECK_IBP_ITEM_08_01',
    'CHECK_IBP_ITEM_09_01', 'CHECK_IBP_ITEM_10_01', 'CHECK_IBP_ITEM_11_01',
    'CHECK_IBP_ITEM_12_01', 'CHECK_IBP_ITEM_13_01', 'CHECK_IBP_ITEM_14_01',
    'CHECK_IBP_ITEM_14_02', 'CHECK_IBP_ITEM_14_03', 'CHECK_IBP_ITEM_14_04',
    'CHECK_IBP_ITEM_14_05'
]

LIST_CHECK_ITEM_CODE_ASSESSMENT = [
    "CHECK_CIS12_ITEM_1_15", "CHECK_CIS12_ITEM_1_17", "CHECK_CIS12_ITEM_1_18",
    "CHECK_CIS12_ITEM_4_04", "CHECK_ASC_ITEM_02_02", "CHECK_ASC_ITEM_05_01",
    "CHECK_ASC_ITEM_06_01", "CHECK_ASC_ITEM_09_01", "CHECK_ASC_ITEM_11_01",
    "CHECK_ASC_ITEM_14_01", "CHECK_ASC_ITEM_15_01", "CHECK_IBP_ITEM_04_01",
    "CHECK_IBP_ITEM_06_01", "CHECK_IBP_ITEM_10_01", "CHECK_IBP_ITEM_13_01",
    "CHECK_IBP_ITEM_14_03"
]


def aws_resource_checker(check_history_id, log_id):
    trace_id = check_history_id
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    # バリデーションチェック
    if common_utils.is_null(check_history_id):
        pm_logger.error("チェック履歴IDが指定されていません。")
        pm_error = PmError(message="CKEX_SECURITY-001")
        raise pm_error

    # ログストリーム名取得
    if common_utils.is_null(log_id) is False:
        try:
            update_log_stream_name_to_s3(trace_id, check_history_id, log_id)
        except PmError as e:
            common_utils.write_log_pm_error(e, pm_logger, exc_info=True)

    # チェック履歴情報の取得とステータス更新
    pm_logger.info("-- チェック履歴情報取得処理開始 ----")
    try:
        check_history = pm_checkHistory.query_key(trace_id, check_history_id)
    except PmError as e:
        pm_logger.error("チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, pm_logger,
                                              "CKEX_SECURITY-002")
    if (not check_history):
        pm_logger.error("チェック履歴情報がありません。: CheckHistoryID=%s", check_history_id)
        pm_error = PmError(message="CKEX_SECURITY-002")
        raise pm_error
    pm_logger.info("-- チェック履歴情報取得処理終了 ----")

    # 取得したチェック履歴情報のステータスをチェックします。
    pm_logger.info("-- チェック履歴情報ステータスチェック開始  ----")
    if (check_history['CheckStatus'] != 0):
        pm_logger.error(
            "チェック実行ステータスが一致しません。: CheckHistoryID=%s, CheckStatus=%s",
            check_history_id, check_history['CheckStatus'])
        pm_error = PmError(message="CKEX_SECURITY-003")
        raise pm_error

    # チェック履歴情報のステータスを更新します。
    executed_date_time = common_utils.get_current_date()
    time_to_live_date = date_utils.get_current_date() + timedelta(days=30)
    time_to_live = Decimal(time_to_live_date.timestamp())
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
        pm_checkHistory.update(trace_id, check_history_id, attribute,
                               updated_at)
        pm_logger.info("-- チェック履歴情報ステータスチェック終了 ----")
    except PmError as e:
        pm_logger.error("チェック履歴情報のステータス更新に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, pm_logger,
                                              "CKEX_SECURITY-004")

    # チェック対象の組織名を取得します。
    organization_id = check_history['OrganizationID']
    try:
        organization = pm_organizations.get_organization(
            trace_id, organization_id)
    except PmError as e:
        pm_logger.error("組織名の取得に失敗しました。: OrganizationID=%s", organization_id)
        raise common_utils.write_log_pm_error(e, pm_logger,
                                              "CKEX_SECURITY-005")

    if (not organization):
        pm_logger.error("組織情報がありません。: OrganizationID=%s", organization_id)
        pm_error = PmError(message="CKEX_SECURITY-005")
        raise pm_error
    organization_name = organization['OrganizationName']

    # チェック対象のプロジェクト名を取得します。
    project_id = check_history['ProjectID']
    try:
        project = pm_projects.query_key(trace_id, project_id)
    except PmError as e:
        pm_logger.error("プロジェクト名の取得に失敗しました。: ProjectID=%s", project_id)
        raise common_utils.write_log_pm_error(e, pm_logger,
                                              "CKEX_SECURITY-005")
    if (not project):
        pm_logger.error("プロジェクト情報がありません。: ProjectID=%s", project_id)
        pm_error = PmError(message="CKEX_SECURITY-005")
        raise pm_error
    project_name = project['ProjectName']

    # AWSアカウント連携情報取得
    pm_logger.info("-- AWSアカウント連携情報取得処理開始 ----")
    try:
        list_awscoops = pm_awsAccountCoops.query_awscoop_effective_enable(
            trace_id, project_id)
        pm_logger.info("-- AWSアカウント連携情報取得処理終了 ----")
    except PmError as e:
        pm_logger.error("AWSアカウント情報の取得に失敗しました。: ProjectID=%s", project_id)
        raise common_utils.write_log_pm_error(e, pm_logger,
                                              "CKEX_SECURITY-005")
    if (not list_awscoops):
        pm_logger.warning("AWSアカウント連携がないプロジェクトです。: ProjectID=%s", project_id)
        pm_error = PmError(message="CKEX_SECURITY-005")
        raise pm_error

    is_all_awscoop_disable = True

    # チェック処理
    for awscoops in list_awscoops:
        coop_id = awscoops['CoopID']
        aws_account = awscoops['AWSAccount']
        role_name = awscoops['RoleName']
        external_id = awscoops['ExternalID']
        if common_utils.check_key("AWSAccountName", awscoops) is True:
            aws_account_name = awscoops['AWSAccountName']
        else:
            aws_account_name = None

        try:
            session = aws_common.create_session_client(trace_id, aws_account,
                                                       role_name, external_id)
        except PmError as e:
            pm_logger.warning("[%s] Credentialsを取得できませんでした。", aws_account)
            try:
                do_disable_awscoop(trace_id, coop_id, aws_account)
            except PmError as e:
                common_utils.write_log_pm_error(e, pm_logger, exc_info=True)
            continue

        if (is_all_awscoop_disable is True):
            is_all_awscoop_disable = False

        # AWSアカウントのメンバーズ加入判定
        pm_logger.info("-- メンバーズ加入判定処理開始 ----")
        try:
            iam_client = IAMUtils.get_iam_client(trace_id, session,
                                                 aws_account)
        except PmError as e:
            raise common_utils.write_log_pm_error(
                e, pm_logger, "CKEX_SECURITY-006-" + aws_account)
        members = get_membership_aws_account(trace_id, awscoops, aws_account,
                                             iam_client)
        pm_logger.info("-- メンバーズ加入判定処理終了 ----")

        # チェック結果レコードの作成
        try:
            check_result_id = common_utils.get_uuid4()
            sort_code = "{0}_{1}_{2}".format(organization_name, project_name,
                                             aws_account)
            pm_checkResults.create(
                trace_id, check_result_id, check_history_id, "CHECK_SECURITY",
                organization_id, organization_name, project_id, project_name,
                coop_id, aws_account, sort_code, 0, 0, 0, executed_date_time,
                time_to_live, aws_account_name)
        except PmError as e:
            pm_logger.error(
                "チェック結果レコードの作成に失敗しました。: CheckHistoryID=%s, AWSAccount=%s",
                check_history_id, aws_account)
            raise common_utils.write_log_pm_error(
                e, pm_logger, "CKEX_SECURITY-006-" + aws_account)

        try:
            do_execute_check(trace_id, organization_id, organization_name,
                             project_id, project_name, coop_id,
                             check_history_id, check_result_id, aws_account,
                             executed_date_time, time_to_live, session,
                             aws_account_name, members)
        except PmError as e:
            # セキュリティチェック実行のエラーをメールで通知するために、メッセージをJSONとしてAmazon SNSへパブリッシュします。
            try:
                topic_arn = common_utils.get_environ(
                    CommonConst.SECURITYCHECK_BATCH_ERROR_NOTIFY_TOPIC)
                subject = "チェックバッチ実行失敗"
                message = {
                    'CheckHistoryId': check_history_id,
                    'OrganizationID': organization_id,
                    'ProjectID': project_id,
                    'AWSAccount': aws_account,
                    'ExecuteUserID': check_history["ExecuteUserID"],
                    'ErrorCode': CommonConst.DEFAULT
                }
                if e.pm_notification_error:
                    message['CheckCodeItem'] = e.pm_notification_error.check_item_code
                    message['RegionName'] = e.pm_notification_error.region
                    message['ErrorCode'] = e.pm_notification_error.code_error
                    message['DataBody'] = e.pm_notification_error.data_body

                # Send sns
                aws_common.aws_sns(trace_id, subject, json.dumps(message),
                                   topic_arn)
            except PmError as e:
                raise common_utils.write_log_exception(e, pm_logger)

            raise common_utils.write_log_pm_error(e, pm_logger)

    # チェック処理終了
    if (is_all_awscoop_disable is True):
        pm_logger.warning("チェック処理を実行できるAWSアカウントがありませんでした。")
        # チェック対象AWSアカウントが０件だった場合のエラーをメールで通知するために、メッセージをJSONとしてAmazon SNSへパブリッシュします。
        try:
            topic_arn = common_utils.get_environ(
                CommonConst.SECURITYCHECK_BATCH_ERROR_NOTIFY_TOPIC)
            subject = "チェックバッチ実行失敗"
            message = {
                'CheckHistoryId': check_history_id,
                'OrganizationID': organization_id,
                'ProjectID': project_id,
                'ExecuteUserID': check_history["ExecuteUserID"],
                'ErrorCode': CommonConst.KEY_CODE_ERROR_ALL_AWSCOOP_DISABLE,
            }

            # Send sns
            aws_common.aws_sns(trace_id, subject, json.dumps(message),
                               topic_arn)
        except PmError as e:
            e.message = "CKEX_SECURITY-900"
            raise common_utils.write_log_exception(e, pm_logger)
        raise PmError(message="CKEX_SECURITY-900")


def do_execute_check(trace_id, organization_id, organization_name, project_id,
                     project_name, coop_id, check_history_id, check_result_id,
                     aws_account, executed_date_time, time_to_live, session,
                     aws_account_name, members):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    account_refine_code = CommonConst.ACCOUNT_REFINE_CODE.format(
        organization_id, project_id, aws_account)

    try:
        excluded_resources = pm_exclusionResources.query_account_refine_index(
            trace_id, account_refine_code)
    except PmError as e:
        pm_logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
        raise common_utils.write_log_pm_error(e, pm_logger, aws_account)

    for check_item_code in LIST_CIS_CHECK_ITEM_CODE:
        # CISチェック処理実行
        do_execute_cis_check(
            trace_id, check_item_code, organization_id, organization_name,
            project_id, project_name, coop_id, check_history_id,
            check_result_id, aws_account, executed_date_time, time_to_live,
            session, aws_account_name, members, excluded_resources)

    for check_item_code in LIST_ASC_CHECK_ITEM_CODE:
        # ASCチェック処理実行
        do_execute_asc_check(trace_id, check_item_code, organization_id,
                             organization_name, project_id, project_name,
                             coop_id, check_history_id, check_result_id,
                             aws_account, executed_date_time, time_to_live,
                             session, aws_account_name, members)

    for check_item_code in LIST_IBP_CHECK_ITEM_CODE:
        # IBPチェック処理実行
        do_execute_ibp_check(trace_id, check_item_code, organization_id,
                             organization_name, project_id, project_name,
                             coop_id, check_history_id, check_result_id,
                             aws_account, executed_date_time, time_to_live,
                             session, aws_account_name, members)


def do_execute_asc_check(trace_id, check_item_code, organization_id,
                         organization_name, project_id, project_name, coop_id,
                         check_history_id, check_result_id, aws_account,
                         executed_date_time, time_to_live, session,
                         aws_account_name, members):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # File name
    result_json_path = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        "ASC/" + check_item_code + ".json")

    # ASCチェック処理開始
    pm_logger.info(
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
        raise common_utils.write_log_pm_error(
            e, pm_logger, "CKEX_SECURITY-007-" + aws_account)

    try:
        exclusion_item = get_exclusion_item(trace_id, organization_id,
                                            project_id, aws_account,
                                            check_item_code)
    except PmError as e:
        raise common_utils.write_log_pm_error(e, pm_logger)

    try:
        exclusion_flag = ExclusionFlag.Disable
        if check_result != CheckResult.MembersManagement and exclusion_item is not None:
            exclusion_flag = ExclusionFlag.Enable
            update_check_results_json(trace_id, exclusion_item,
                                      result_json_path, check_result_id,
                                      aws_account)
    except Exception as e:
        raise common_utils.write_log_exception(e, pm_logger)

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
        pm_logger.error(
            "[%s]個別チェック結果レコードの作成に失敗しました。: CheckHistoryID=%s, AWSAccount=%s",
            check_item_code, check_history_id, aws_account)
        raise common_utils.write_log_pm_error(
            e, pm_logger, "CKEX_SECURITY-008-" + aws_account)
    # ASC個別チェック処理終了
    pm_logger.info("-- [%s]ASCチェック処理終了: %s_%s_%s ----", check_item_code,
                   check_history_id, check_result_id, aws_account)


def do_execute_ibp_check(trace_id, check_item_code, organization_id,
                         organization_name, project_id, project_name, coop_id,
                         check_history_id, check_result_id, aws_account,
                         executed_date_time, time_to_live, session,
                         aws_account_name, members):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # File name
    result_json_path = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        "IBP/" + check_item_code + ".json")

    # IBPチェック処理開始
    pm_logger.info(
        "-- [%s]IBPチェック処理開始: CheckHistoryID=%s, CheckResultID=%s, AWSAccount=%s ----",
        check_item_code, check_history_id, check_result_id, aws_account)

    # IBP個別チェック処理実行
    try:
        if (check_item_code == "CHECK_IBP_ITEM_01_01"):
            check_result = ibp_item_1_logic.check_ibp_item_01_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_12")
        elif (check_item_code == "CHECK_IBP_ITEM_02_01"):
            check_result = ibp_item_2_logic.check_ibp_item_02_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_IBP_ITEM_03_01"):
            check_result = ibp_item_3_logic.check_ibp_item_03_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_16")
        elif (check_item_code == "CHECK_IBP_ITEM_05_01"):
            check_result = ibp_item_5_logic.check_ibp_item_05_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_22")
        elif (check_item_code == "CHECK_IBP_ITEM_07_01"):
            check_result = ibp_item_7_logic.check_ibp_item_07_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_05")
        elif (check_item_code == "CHECK_IBP_ITEM_07_02"):
            check_result = ibp_item_7_logic.check_ibp_item_07_02(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_06")
        elif (check_item_code == "CHECK_IBP_ITEM_07_04"):
            check_result = ibp_item_7_logic.check_ibp_item_07_04(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_08")
        elif (check_item_code == "CHECK_IBP_ITEM_07_05"):
            check_result = ibp_item_7_logic.check_ibp_item_07_05(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_09")
        elif (check_item_code == "CHECK_IBP_ITEM_07_03"):
            check_result = ibp_item_7_logic.check_ibp_item_07_03(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_07")
        elif (check_item_code == "CHECK_IBP_ITEM_06_01"):
            check_result = ibp_item_6_logic.check_ibp_item_06_01(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == "CHECK_IBP_ITEM_04_01"):
            check_result = ibp_item_4_logic.check_ibp_item_04_01(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == "CHECK_IBP_ITEM_07_06"):
            check_result = ibp_item_7_logic.check_ibp_item_07_06(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_10")
        elif (check_item_code == "CHECK_IBP_ITEM_07_07"):
            check_result = ibp_item_7_logic.check_ibp_item_07_07(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_11")
        elif (check_item_code == "CHECK_IBP_ITEM_08_01"):
            check_result = ibp_item_8_logic.check_ibp_item_08_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_02")
        elif (check_item_code == "CHECK_IBP_ITEM_09_01"):
            check_result = ibp_item_9_logic.check_ibp_item_09_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_19")
        elif (check_item_code == "CHECK_IBP_ITEM_10_01"):
            check_result = ibp_item_10_logic.check_ibp_item_10_01(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == "CHECK_IBP_ITEM_12_01"):
            check_result = ibp_item_12_logic.check_ibp_item_12_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_03")
        elif (check_item_code == "CHECK_IBP_ITEM_13_01"):
            check_result = ibp_item_13_logic.check_ibp_item_13_01(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == "CHECK_IBP_ITEM_11_01"):
            check_result = ibp_item_11_logic.check_ibp_item_11_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_1_04")
        elif (check_item_code == "CHECK_IBP_ITEM_07_08"):
            check_result = ibp_item_7_logic.check_ibp_item_07_08(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_IBP_ITEM_14_02"):
            check_result = ibp_item_14_logic.check_ibp_item_14_02(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_2_01")
        elif (check_item_code == "CHECK_IBP_ITEM_14_03"):
            check_result = ibp_item_14_logic.check_ibp_item_14_03(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == "CHECK_IBP_ITEM_14_04"):
            check_result = ibp_item_14_logic.check_ibp_item_14_04(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path,
                "CHECK_CIS12_ITEM_2_05")
        elif (check_item_code == "CHECK_IBP_ITEM_14_01"):
            check_result = ibp_item_14_logic.check_ibp_item_14_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_IBP_ITEM_14_05"):
            check_result = ibp_item_14_logic.check_ibp_item_14_05(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, "CHECK_ASC_ITEM_16_01")
    except PmError as e:
        raise common_utils.write_log_pm_error(
            e, pm_logger, "CKEX_SECURITY-007-" + aws_account)

    try:
        exclusion_item = get_exclusion_item(trace_id, organization_id,
                                            project_id, aws_account,
                                            check_item_code)
    except PmError as e:
        raise common_utils.write_log_pm_error(e, pm_logger)

    try:
        exclusion_flag = ExclusionFlag.Disable
        if check_result != CheckResult.MembersManagement and exclusion_item is not None:
            exclusion_flag = ExclusionFlag.Enable
            update_check_results_json(trace_id, exclusion_item,
                                      result_json_path, check_result_id,
                                      aws_account)
    except Exception as e:
        raise common_utils.write_log_exception(e, pm_logger)

    # IBP個別チェック結果レコードを作成します。
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
        pm_logger.error(
            "[%s]個別チェック結果レコードの作成に失敗しました。: CheckHistoryID=%s, AWSAccount=%s",
            check_item_code, check_history_id, aws_account)
        raise common_utils.write_log_pm_error(
            e, pm_logger, "CKEX_SECURITY-008-" + aws_account)
    # IBP個別チェック処理終了
    pm_logger.info("-- [%s]IBPチェック処理終了: %s_%s_%s ----", check_item_code,
                   check_history_id, check_result_id, aws_account)


def update_log_stream_name_to_s3(trace_id, check_history_id, log_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    pm_logger.info("-- ログストリーム名取得処理開始 ----")

    # S3からチェックジョブ履歴ファイルを取得します。
    s3_file_name = CommonConst.PATH_BATCH_CHECK_LOG.format(
        check_history_id, log_id + ".json")
    try:
        result = FileUtils.read_json(trace_id, "S3_BATCH_LOG_BUCKET",
                                     s3_file_name)
    except PmError as e:
        pm_logger.error(
            "対象のチェックジョブ履歴ファイルの取得に失敗しました。: CheckHistoryID=%s, LogID=%s",
            check_history_id, log_id)
        raise common_utils.write_log_pm_error(e, pm_logger)
    list_log_stream_name = []
    if common_utils.check_key("LogStreamName", result):
        list_log_stream_name = result["LogStreamName"]

    # ジョブ情報からログストリーム名を取得します。
    try:
        log_stream_name = aws_common.get_log_stream_name(trace_id, result['JobID'])
    except PmError as e:
        raise common_utils.write_log_pm_error(e, pm_logger)

    # ログストリーム名を追記し、チェックジョブ履歴ファイルを保存します。
    try:
        if log_stream_name not in list_log_stream_name:
            list_log_stream_name.append(log_stream_name)
            result["LogStreamName"] = list_log_stream_name
            result["UpdatedAt"] = common_utils.get_current_date()
            FileUtils.upload_json(trace_id, "S3_BATCH_LOG_BUCKET", result,
                                  s3_file_name)
    except PmError as e:
        pm_logger.error(
            "チェックジョブ履歴ファイルのログストリーム名更新に失敗しました。: CheckHistoryID=%s, LogID=%s",
            check_history_id, log_id)
        raise common_utils.write_log_pm_error(e, pm_logger)
    pm_logger.info("-- ログストリーム名取得処理終了 ----")


def do_execute_cis_check(trace_id, check_item_code, organization_id,
                         organization_name, project_id, project_name, coop_id,
                         check_history_id, check_result_id, aws_account,
                         executed_date_time, time_to_live, session,
                         aws_account_name, members, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # File name
    result_json_path = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
    result_csv_path = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".csv")

    # チェック処理開始
    pm_logger.info(
        "-- [%s]チェック処理開始: CheckHistoryID=%s, CheckResultID=%s, AWSAccount=%s ----",
        check_item_code, check_history_id, check_result_id, aws_account)

    # 個別チェック処理実行
    try:
        if (check_item_code == "CHECK_CIS12_ITEM_4_01"):
            result_csv_path = None
            check_result = cis_item_4_logic.check_cis_item_4_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_4_02"):
            result_csv_path = None
            check_result = cis_item_4_logic.check_cis_item_4_02(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_2_01"):
            result_csv_path = None
            check_result = cis_item_2_logic.check_cis_item_2_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_CIS12_ITEM_2_03"):
            result_csv_path = None
            check_result = cis_item_2_logic.check_cis_item_2_03(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_2_04"):
            result_csv_path = None
            check_result = cis_item_2_logic.check_cis_item_2_04(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_2_06"):
            result_csv_path = None
            check_result = cis_item_2_logic.check_cis_item_2_06(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_02"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_02(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_03"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_03(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_04"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_04(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_05"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_05(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_06"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_06(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_07"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_07(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_08"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_08(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_16"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_16(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_20"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_20(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, members)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_09"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_09(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_21"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_21(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_22"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_22(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_01"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, members)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_12"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_12(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, members)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_13"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_13(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, members)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_14"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_14(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, members)
        elif (check_item_code == "CHECK_CIS12_ITEM_2_02"):
            result_csv_path = None
            check_result = cis_item_2_logic.check_cis_item_2_02(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_10"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_10(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_11"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_11(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_19"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_19(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_2_07"):
            result_csv_path = None
            check_result = cis_item_2_logic.check_cis_item_2_07(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_15"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_15(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path, members)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_17"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_17(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path, members)
        elif (check_item_code == "CHECK_CIS12_ITEM_1_18"):
            result_csv_path = None
            check_result = cis_item_1_logic.check_cis_item_1_18(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path, members)
        elif (check_item_code == "CHECK_CIS12_ITEM_4_04"):
            result_csv_path = None
            check_result = cis_item_4_logic.check_cis_item_4_04(
                trace_id, check_item_code, check_history_id, organization_id,
                project_id, aws_account, result_json_path)
        elif (check_item_code == 'CHECK_CIS12_ITEM_2_08'):
            result_csv_path = None
            check_result = cis_item_2_logic.check_cis_item_2_08(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == 'CHECK_CIS12_ITEM_2_05'):
            result_csv_path = None
            check_result = cis_item_2_logic.check_cis_item_2_05(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_01'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_01(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_02'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_02(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_03'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_03(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_04'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_04(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_05'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_05(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_06'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_06(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_07'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_07(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_08'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_08(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_09'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_09(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_10'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_10(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_11'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_11(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_12'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_12(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_13'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_13(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_3_14'):
            result_csv_path = None
            check_result = cis_item_3_logic.check_cis_item_3_14(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code)
        elif (check_item_code == 'CHECK_CIS12_ITEM_2_09'):
            result_csv_path = None
            check_result = cis_item_2_logic.check_cis_item_2_09(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
        elif (check_item_code == 'CHECK_CIS12_ITEM_4_03'):
            result_csv_path = None
            check_result = cis_item_4_logic.check_cis_item_4_03(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, session, result_json_path, check_item_code,
                excluded_resources)
    except PmError as e:
        raise common_utils.write_log_pm_error(
            e, pm_logger, "CKEX_SECURITY-007-" + aws_account)

    try:
        exclusion_item = get_exclusion_item(trace_id, organization_id,
                                            project_id, aws_account,
                                            check_item_code)
    except PmError as e:
        raise common_utils.write_log_pm_error(e, pm_logger)

    try:
        exclusion_flag = ExclusionFlag.Disable
        if check_result != CheckResult.MembersManagement and exclusion_item is not None:
            exclusion_flag = ExclusionFlag.Enable
            update_check_results_json(trace_id, exclusion_item,
                                      result_json_path, check_result_id,
                                      aws_account)
    except Exception as e:
        raise common_utils.write_log_exception(e, pm_logger)

    # 個別チェック結果レコードを作成します。
    try:
        check_result_item_id = common_utils.get_uuid4()
        sort_code = "{0}_{1}_{2}_{3}".format(
            check_item_code, organization_name, project_name, aws_account)
        pm_checkResultItems.create(
            trace_id, check_result_item_id, check_history_id, check_result_id,
            check_item_code, organization_id, organization_name, project_id,
            project_name, coop_id, aws_account, sort_code, check_result,
            result_json_path, result_csv_path, executed_date_time,
            time_to_live, aws_account_name,
            get_assessment_flag(check_item_code, check_result), exclusion_flag)
    except PmError as e:
        pm_logger.error(
            "[%s]個別チェック結果レコードの作成に失敗しました。: CheckHistoryID=%s, AWSAccount=%s",
            check_item_code, check_history_id, aws_account)
        raise common_utils.write_log_pm_error(
            e, pm_logger, "CKEX_SECURITY-008-" + aws_account)
    # 個別チェック処理終了
    pm_logger.info("-- [%s]チェック処理終了: %s_%s_%s ----", check_item_code,
                   check_history_id, check_result_id, aws_account)


def processing_finish(check_history_id, error_code, check_status):
    trace_id = check_history_id
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        check_history = pm_checkHistory.query_key(trace_id, check_history_id)
    except PmError as e:
        pm_logger.error("チェック履歴情報の取得に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, pm_logger)
    if (not check_history):
        pm_logger.error("チェック履歴情報がありません。: CheckHistoryID=%s", check_history_id)
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
        pm_checkHistory.update(trace_id, check_history_id, attribute,
                               updated_at)
    except PmError as e:
        pm_logger.error("チェック履歴情報のステータス更新に失敗しました。: CheckHistoryID=%s",
                        check_history_id)
        raise common_utils.write_log_pm_error(e, pm_logger)


def get_membership_aws_account(trace_id, awscoops, aws_account, iam_client):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # デフォルト値はメンバーズに加入していないAWSアカウントです。
    members = Members.Disable

    # IAMクライアントを用いて、IAMロールcm-membersportalを取得します。
    cm_members_role_name = common_utils.get_environ(
        CommonConst.CM_MEMBERS_ROLE_NAME, CommonConst.CM_MEMBERS_PORTAL)
    try:
        IAMUtils.get_role(trace_id, iam_client, cm_members_role_name)
        members = Members.Enable
        pm_logger.info("[%s] IAMロール「%s」が存在します。", aws_account,
                       cm_members_role_name)
    except PmError as e:
        if e.cause_error.response['Error'][
                'Code'] == CommonConst.NO_SUCH_ENTITY:
            pm_logger.info("[%s] IAMロール「%s」が存在しません。", aws_account,
                           cm_members_role_name)
        else:
            pm_logger.warning("[%s] IAMロール「%s」の取得に失敗しました。", aws_account,
                              cm_members_role_name)
            return members

    if (common_utils.check_key('Members', awscoops) is False or
            awscoops['Members'] != members):
        attribute = {'Members': {"Value": members}}
        try:
            pm_awsAccountCoops.update_awscoops(trace_id, awscoops['CoopID'],
                                               attribute)
        except PmError as e:
            pm_logger.warning("[%s] AWSアカウント連携の更新に失敗しました。:CoopID=%s",
                              aws_account, awscoops['CoopID'])
    return members


def do_disable_awscoop(trace_id, coop_id, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    task_id = common_utils.get_uuid4()
    code = CommonConst.CHECK_AWS_COOP
    try:
        pm_organizationTasks.create_organizationTask(
            trace_id, task_id, code, coop_id,
            "0", CommonConst.SYSTEM, 0, 0, 3)
    except PmError as e:
        pm_logger.warning("[%s] 無効なAWSアカウント連携の処理タスクレコード作成に失敗しました。",
                          aws_account)
        raise common_utils.write_log_pm_error(e, pm_logger)

    # Public message
    try:
        topic_arn = common_utils.get_environ(
            CommonConst.INVALID_AWS_COOP_TASK_TOPIC)
        message = {"TaskId": str(task_id), "Code": code}
        subject = "TASK : " + task_id

        # Send sns
        aws_common.aws_sns(trace_id, subject, json.dumps(message), topic_arn)
    except Exception as e:
        pm_logger.warning("[%s] 無効なAWSアカウント連携の処理メッセージ送信に失敗しました。（%s）",
                          aws_account, topic_arn)
        raise common_utils.write_log_exception(e, pm_logger)


def get_assessment_flag(check_item_code, check_result):
    assessment_flag = AssessmentFlag.NotManual
    if check_item_code in LIST_CHECK_ITEM_CODE_ASSESSMENT:
        if check_result == CheckResult.Normal:
            assessment_flag = AssessmentFlag.Assessment
        else:
            assessment_flag = AssessmentFlag.NotAssessment
    return assessment_flag


def update_check_results_json(trace_id, exclusion_item, result_json_path,
                              check_result_id, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        result_json_path)) is False:
        e = PmError(None, message="CKEX_SECURITY-007-" + aws_account)
        pm_logger.error(
            "個別チェック結果情報に紐づくチェック結果JSONファイルがありません。: CheckResultID=%s",
            check_result_id)
        raise common_utils.write_log_pm_error(e, pm_logger)

    try:
        check_results = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                            result_json_path)
    except PmError as e:
        raise common_utils.write_log_pm_error(e, pm_logger)

    check_results['ExclusionItem'] = {
        'ExcluesionComment': common_utils.get_value("ExclusionComment", exclusion_item),
        'UserID': common_utils.get_value("UserID", exclusion_item),
        'MailAddress': common_utils.get_value("MailAddress", exclusion_item),
        'CreatedAt': common_utils.get_value("CreatedAt", exclusion_item)
    }

    try:
        FileUtils.upload_s3(trace_id, check_results, result_json_path, True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, pm_logger)


def get_exclusion_item(trace_id, organization_id, project_id, aws_account,
                       check_item_code):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    exclusion_item_id = CommonConst.EXCLUSIONITEM_ID.format(
        organization_id, project_id, aws_account, check_item_code)

    try:
        exclusion_item = pm_exclusionitems.query_key(trace_id,
                                                     exclusion_item_id)
    except PmError as e:
        pm_logger.error(
            "[%s]チェック項目除外テーブルの取得に失敗しました。: OrganizationID=%s, ProjectID=%s, AWSAccount=%s",
            check_item_code, organization_id, project_id, aws_account)
        raise common_utils.write_log_pm_error(
            e, pm_logger, "CKEX_SECURITY-007-" + aws_account)

    return exclusion_item
