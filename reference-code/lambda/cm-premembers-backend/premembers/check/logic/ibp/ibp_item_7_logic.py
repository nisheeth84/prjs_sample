import inspect

from premembers.check.logic.ibp import ibp_item_common_logic
from premembers.const.const import CommonConst
from premembers.common import common_utils, date_utils, FileUtils
from premembers.repository.const import CheckResult
from premembers.exception.pm_exceptions import PmError


def check_ibp_item_07_01(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path,
                         check_item_code):
    s3_file_name = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
    return ibp_item_common_logic.check_ibp_item_copy_item_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, check_item_code, s3_file_name)


def check_ibp_item_07_02(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path,
                         check_item_code):
    s3_file_name = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
    return ibp_item_common_logic.check_ibp_item_copy_item_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, check_item_code, s3_file_name)


def check_ibp_item_07_05(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path,
                         check_item_code):
    s3_file_name = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
    return ibp_item_common_logic.check_ibp_item_copy_item_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, check_item_code, s3_file_name)


def check_ibp_item_07_03(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path,
                         check_item_code):
    s3_file_name = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
    return ibp_item_common_logic.check_ibp_item_copy_item_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, check_item_code, s3_file_name)


def check_ibp_item_07_04(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path,
                         check_item_code):
    s3_file_name = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
    return ibp_item_common_logic.check_ibp_item_copy_item_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, check_item_code, s3_file_name)


def check_ibp_item_07_06(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path,
                         check_item_code):
    s3_file_name = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
    return ibp_item_common_logic.check_ibp_item_copy_item_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, check_item_code, s3_file_name)


def check_ibp_item_07_07(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path,
                         check_item_code):
    s3_file_name = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
    return ibp_item_common_logic.check_ibp_item_copy_item_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, check_item_code, s3_file_name)


def check_ibp_item_07_08(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []

    # チェック結果
    try:
        account_password_policy = ibp_item_common_logic.get_account_password_policy(
            trace_id, check_history_id, organization_id, project_id,
            aws_account, session, result_json_path)
        if (common_utils.check_key(
                "AllowUsersToChangePassword", account_password_policy
        ) is False or account_password_policy['AllowUsersToChangePassword'] is False):
            check_results.append(get_check_ibp_item_07_08_result())
    except PmError as e:
        if e.cause_error.response['Error']['Code'] == CommonConst.NO_SUCH_ENTITY:
            check_results.append(get_check_ibp_item_07_08_result())
        else:
            pm_logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
            return CheckResult.Error

    # Export File CHECK_IBP_ITEM_07_08.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_password_policy = {
            'AWSAccount': aws_account,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_password_policy, result_json_path,
                            True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        return CheckResult.Error

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def get_check_ibp_item_07_08_result():
    result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'AllowUsersToChangePasswordAbnormity': True
        }
    }
    return result
