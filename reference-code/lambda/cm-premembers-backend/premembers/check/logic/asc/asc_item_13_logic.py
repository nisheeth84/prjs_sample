import inspect

from premembers.common import common_utils, S3Utils, date_utils
from premembers.common import FileUtils
from premembers.exception.pm_exceptions import PmError
from premembers.repository.const import CheckResult
from premembers.const.const import CommonConst
from premembers.check.logic.asc import asc_item_common_logic

REGION_IGNORE = CommonConst.REGION_IGNORE


def check_asc_item_13_01(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    is_authorized = True
    s3_client = S3Utils.get_s3_client(trace_id, session, aws_account)
    try:
        list_buckets = asc_item_common_logic.get_list_buckets(
            trace_id, check_history_id, organization_id, project_id, s3_client,
            aws_account)
    except PmError as e:
        return CheckResult.Error

    # 取得したS3バケットのアクセスコントロールリスト情報をS3に保存する（リソース情報ファイル）。
    for bucket in list_buckets['Buckets']:
        bucket_name = bucket['Name']
        region_name = None
        try:
            region_name = S3Utils.get_bucket_location(
                trace_id, s3_client, bucket_name, aws_account)
            if region_name is None:
                region_name = CommonConst.US_EAST_REGION
            bucket_encryption_rules = S3Utils.get_bucket_encryption(
                trace_id, s3_client, bucket_name, aws_account,
                region_name)
        except PmError as e:
            if e.cause_error.response['Error'][
                    'Code'] in CommonConst.SERVER_SIDE_ENCRYPTION_CONFIGURATION_NOT_FOUND_ERROR:
                check_results.append(get_check_asc_item_13_01_result(
                    region_name, bucket_name))
                continue
            elif e.cause_error.response['Error'][
                    'Code'] in CommonConst.S3_SKIP_EXCEPTION:
                error_operation = e.cause_error.operation_name,
                error_code = e.cause_error.response['Error']['Code'],
                error_message = e.cause_error.response['Error']['Message']
                if region_name is None:
                    region_name = CommonConst.ERROR
                check_results.append(
                    asc_item_common_logic.get_error_authorized_result(
                        region_name, bucket_name, error_operation,
                        error_code, error_message))
                is_authorized = False
                continue
            else:
                return CheckResult.Error

        if len(bucket_encryption_rules) == 0:
            continue

        try:
            s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                check_history_id, organization_id, project_id, aws_account,
                "ASC/S3_Encryption_" + region_name + "_" + bucket_name +
                ".json")
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                  bucket_encryption_rules, s3_file_name)
        except PmError as e:
            pm_logger.error("[%s] S3バケット暗号化情報のS3保存に失敗しました。（%s/%s）",
                            aws_account, region_name, bucket_name)
            return CheckResult.Error

        # チェック処理
        try:
            for bucket_encryption_rule in bucket_encryption_rules:
                if (common_utils.check_key(
                        "SSEAlgorithm",
                        bucket_encryption_rule['ApplyServerSideEncryptionByDefault']
                ) is False):
                    check_results.append(get_check_asc_item_13_01_result(
                        region_name, bucket_name))
                    break
        except Exception as e:
            pm_logger.error("[%s] チェック処理中にエラーが発生しました。（%s/%s）", aws_account,
                            region_name, bucket_name)
            return CheckResult.Error

    # Export File json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_asc_item_13_01 = {
            'AWSAccount': aws_account,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_asc_item_13_01, result_json_path, True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        return CheckResult.Error

    # チェック結果
    if is_authorized is False:
        return CheckResult.Error
    if len(check_results) > 0:
        return CheckResult.CriticalDefect
    return CheckResult.Normal


def get_check_asc_item_13_01_result(region_name, s3_bucket_name):
    result = {
        'Region': region_name,
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'BucketName': s3_bucket_name
        }
    }
    return result
