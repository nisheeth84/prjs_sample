import inspect

from premembers.common import FileUtils, aws_common
from premembers.common import common_utils, date_utils
from premembers.repository.const import CheckResult
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_assessmentItems
from premembers.const.const import CommonConst


def execute_check_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path, level, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, aws_account,
        "Assessment_Result.json")

    # リソース情報取得
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name,
                                        is_cw_logger=is_cw_logger)) is True:
        try:
            assessment_items = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                                   s3_file_name,
                                                   is_cw_logger=is_cw_logger)
        except PmError as e:
            logger.error("[%s] リソース情報取得に失敗しました。", s3_file_name)
            return CheckResult.Error
    else:
        try:
            assessment_items = pm_assessmentItems.query_organization_index_filter_awsaccount(
                trace_id, organization_id, project_id, aws_account,
                is_cw_logger=is_cw_logger)
        except PmError as e:
            logger.error("[%s] 手動評価結果の取得に失敗しました。", aws_account)
            return CheckResult.Error

        # 取得したクエリ結果をS3に保存します。(リソース情報ファイル)
        try:
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                  assessment_items, s3_file_name,
                                  is_cw_logger=is_cw_logger)
        except PmError as e:
            logger.error("[%s] 手動評価結果のS3保存に失敗しました。", aws_account)
            return CheckResult.Error

    # チェック処理
    try:
        check_results = []
        assessment_result = None
        for assessment_item in assessment_items:
            if (assessment_item['CheckItemCode'] == check_item_code):
                assessment_result = {
                    'AssessmentComment': common_utils.get_value('AssessmentComment', assessment_item),
                    'UserID': common_utils.get_value('UserID', assessment_item),
                    'MailAddress': common_utils.get_value('MailAddress', assessment_item),
                    'CreatedAt': assessment_item['CreatedAt']
                }
                break

        if (assessment_result is None):
            LEVEL_DIVISION = {
                "1": CommonConst.LEVEL_CODE_21,  # 重大な不備
                "2": CommonConst.LEVEL_CODE_11  # 軽微な不備
            }
            result = {
                'Region': 'Global',
                'Level': LEVEL_DIVISION[level],
                'DetectionItem': {
                    'NoEvaluation': True
                }
            }
            check_results.append(result)
    except Exception as e:
        logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
        return CheckResult.Error

    # チェック結果JSONファイル
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_result_json = {
            'AWSAccount': aws_account,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        if (assessment_result is not None):
            check_result_json['AssessmentResult'] = assessment_result
        FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", check_result_json,
                              result_json_path, is_cw_logger=is_cw_logger)
    except Exception as e:
        logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        return CheckResult.Error

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    elif (level == CommonConst.LEVEL_CODE_1):
        return CheckResult.CriticalDefect
    return CheckResult.MinorInadequacies
