import inspect

from premembers.common import FileUtils, date_utils
from premembers.common import common_utils, IAMUtils
from premembers.repository.const import CheckResult
from premembers.const.const import CommonConst
from premembers.exception.pm_exceptions import PmError


def check_ibp_item_02_01(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []

    # IAMユーザの一覧を取得する。
    try:
        list_users = IAMUtils.get_list_users(trace_id, session, aws_account)
    except PmError as e:
        pm_logger.error("[%s] IAMユーザー一覧情報取得に失敗しました。", aws_account)
        return CheckResult.Error
    try:
        # 取得したユーザ一覧をS3に保存する（リソース情報ファイル）。
        s3_file_name = CommonConst.PATH_CHECK_RAW.format(
            check_history_id, organization_id, project_id, aws_account,
            "IBP/IAM_ListUsers.json")
        FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", list_users,
                              s3_file_name)
    except PmError as e:
        pm_logger.error("[%s] IAMユーザー一覧情報のS3保存に失敗しました。", aws_account)
        return CheckResult.Error

    # チェックルール
    # Check-1. IAMユーザが存在するか
    try:
        if (len(list_users) == 0):
            result = {
                'Region': 'Global',
                'Level': CommonConst.LEVEL_CODE_21,
                'DetectionItem': {
                    'NoIAMUser': True
                }
            }
            check_results.append(result)
    except Exception as e:
        pm_logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
        return CheckResult.Error

    # Export File CHECK_IBP_ITEM_02_01.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_ibp_item_02_01 = {
            'AWSAccount': aws_account,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                              check_ibp_item_02_01, result_json_path)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        return CheckResult.Error

    # チェック結果
    if len(check_results) > 0:
        return CheckResult.CriticalDefect
    return CheckResult.Normal
