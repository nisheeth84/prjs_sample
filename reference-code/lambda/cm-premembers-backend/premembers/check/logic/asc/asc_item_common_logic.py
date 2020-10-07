import inspect

from premembers.common import FileUtils, aws_common, S3Utils
from premembers.common import common_utils
from premembers.repository.const import CheckResult
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_checkResultItems
from premembers.const.const import CommonConst
from premembers.check.logic import security_item_common_logic

LIST_ERROR_CIS = {
    "CHECK_CIS12_ITEM_1_12": "CIS1.12",
    "CHECK_CIS12_ITEM_1_19": "CIS1.19",
    "CHECK_CIS12_ITEM_1_22": "CIS1.22",
    "CHECK_CIS12_ITEM_2_01": "CIS2.1",
    "CHECK_CIS12_ITEM_2_03": "CIS2.3",
    "CHECK_CIS12_ITEM_2_09": "CIS2.9"
}


def check_asc_item_copy_cis_check(trace_id, check_history_id, organization_id,
                                  project_id, aws_account, session,
                                  result_json_path, check_cis_item):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    error_cis = LIST_ERROR_CIS[check_cis_item]
    try:
        try:
            check_result_items = pm_checkResultItems.query_by_check_history_id_and_check_item_code_and_aws_account(
                trace_id, check_history_id, check_cis_item, aws_account)
        except Exception as e:
            pm_logger.error("[%s] %sのチェック結果を取得できませんでした。", aws_account,
                            error_cis)
            return CheckResult.Error

        # チェック結果が「マネージド-1」だった場合は、チェック結果ファイルは作られていないのでファイル取得はスキップします。
        check_result = check_result_items[0]["CheckResult"]
        if check_result == CheckResult.MembersManagement:
            return check_result

        s3_file_name = CommonConst.PATH_CHECK_RESULT.format(
            check_history_id, organization_id, project_id, aws_account,
            check_cis_item + ".json")
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


def execute_check_asc_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path, level):
    return security_item_common_logic.execute_check_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path, level)


def get_list_buckets(trace_id, check_history_id, organization_id, project_id,
                     s3_client, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, aws_account,
        "ASC/S3_ListBuckets.json")
    # リソース情報取得
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            list_buckets = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                               s3_file_name)
        except PmError as e:
            raise common_utils.write_log_exception(e, pm_logger)
    else:
        # S3バケット一覧を取得します。
        try:
            list_buckets = S3Utils.list_buckets(trace_id, s3_client,
                                                aws_account)
        except PmError as e:
            raise common_utils.write_log_exception(e, pm_logger)

        # S3バケット一覧情報をS3に保存します。
        try:
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", list_buckets,
                                  s3_file_name)
        except PmError as e:
            pm_logger.error("[%s] S3バケット一覧情報のS3保存に失敗しました。", aws_account)
            raise common_utils.write_log_exception(e, pm_logger)
    return list_buckets


def get_error_authorized_result(region_name, s3_bucket_name, error_operation,
                                error_code, error_message):
    result = {
        'Region': region_name,
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'BucketName': s3_bucket_name,
            'ErrorOperation': CommonConst.BLANK.join(error_operation),
            'ErrorCode': CommonConst.BLANK.join(error_code),
            'ErrorMessage': CommonConst.BLANK.join(error_message)
        }
    }
    return result
