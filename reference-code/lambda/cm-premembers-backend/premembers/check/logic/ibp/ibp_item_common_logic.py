import inspect

from premembers.common import FileUtils, common_utils, aws_common, IAMUtils
from premembers.repository.const import CheckResult
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_checkResultItems
from premembers.const.const import CommonConst
from premembers.check.logic import security_item_common_logic

LIST_CHECK_ITEM_NUMBER = {
    "CHECK_CIS12_ITEM_1_02": "CIS1.2",
    "CHECK_CIS12_ITEM_1_03": "CIS1.3",
    "CHECK_CIS12_ITEM_1_04": "CIS1.4",
    "CHECK_CIS12_ITEM_1_05": "CIS1.5",
    "CHECK_CIS12_ITEM_1_06": "CIS1.6",
    "CHECK_CIS12_ITEM_1_07": "CIS1.7",
    "CHECK_CIS12_ITEM_1_08": "CIS1.8",
    "CHECK_CIS12_ITEM_1_09": "CIS1.9",
    "CHECK_CIS12_ITEM_1_10": "CIS1.10",
    "CHECK_CIS12_ITEM_1_11": "CIS1.11",
    "CHECK_CIS12_ITEM_1_12": "CIS1.12",
    "CHECK_CIS12_ITEM_1_16": "CIS1.16",
    "CHECK_CIS12_ITEM_1_19": "CIS1.19",
    "CHECK_CIS12_ITEM_1_22": "CIS1.22",
    "CHECK_CIS12_ITEM_2_01": "CIS2.1",
    "CHECK_CIS12_ITEM_2_05": "CIS2.5",
    "CHECK_ASC_ITEM_16_01": "ASC16"
}


def check_ibp_item_copy_item_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, check_item_code, s3_file_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    error_cis = LIST_CHECK_ITEM_NUMBER[check_item_code]
    try:
        try:
            check_result_items = pm_checkResultItems.query_by_check_history_id_and_check_item_code_and_aws_account(
                trace_id, check_history_id, check_item_code, aws_account)
        except Exception as e:
            pm_logger.error("[%s] %sのチェック結果を取得できませんでした。", aws_account,
                            error_cis)
            return CheckResult.Error

        # チェック結果が「マネージド-1」だった場合は、チェック結果ファイルは作られていないのでファイル取得はスキップします。
        check_result = check_result_items[0]["CheckResult"]
        if check_result == CheckResult.MembersManagement:
            return check_result

        try:
            check_results_s3 = FileUtils.read_json(
                trace_id, CommonConst.S3_CHECK_BUCKET, s3_file_name)
        except PmError as e:
            pm_logger.error("[%s] %sのチェック結果ファイルを取得できませんでした。", aws_account,
                            error_cis)
            return CheckResult.Error
    except Exception as e:
        pm_logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
        return CheckResult.Error

    # Export File Json
    try:
        FileUtils.upload_s3(trace_id, check_results_s3, result_json_path,
                            True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        return CheckResult.Error

    # チェック結果
    return check_result


def execute_check_ibp_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path):
    return security_item_common_logic.execute_check_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path, CommonConst.LEVEL_CODE_1)


def get_account_password_policy(trace_id, check_history_id, organization_id,
                                project_id, awsaccount, session,
                                result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, awsaccount,
        "IBP/IAM_AccountPasswordPolicy.json")

    # リソース情報取得
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            account_password_policy = FileUtils.read_json(
                trace_id, "S3_CHECK_BUCKET", s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        try:
            account_password_policy = IAMUtils.get_account_password_policy(
                trace_id, session, awsaccount)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)

        # アカウントパスワードポリシー情報をS3に保存します。
        try:
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                  account_password_policy, s3_file_name)
        except PmError as e:
            pm_logger.error("[%s] アカウントパスワードポリシー情報のS3保存に失敗しました。", awsaccount)
            raise common_utils.write_log_pm_error(e, pm_logger)
    return account_password_policy
