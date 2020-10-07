import inspect

from premembers.repository.const import CheckResult
from premembers.common import common_utils, S3Utils
from premembers.const.const import CommonConst
from premembers.exception.pm_exceptions import PmError
from premembers.common import FileUtils, date_utils, aws_common
from premembers.check.logic.asc import asc_item_common_logic

LOG_DELIVERY_URI = "http://acs.amazonaws.com/groups/s3/LogDelivery"


def check_asc_item_16_01(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    is_authorized = True

    # 取得したクレデンシャル情報を使用して、S3クライアントを作成します。
    try:
        s3_client = S3Utils.get_s3_client(trace_id, session, aws_account)
    except PmError as e:
        raise common_utils.write_log_pm_error(e, pm_logger)

    # S3バケット一覧を取得します。
    try:
        list_buckets = asc_item_common_logic.get_list_buckets(
            trace_id, check_history_id, organization_id, project_id, s3_client,
            aws_account)
    except PmError as e:
        return CheckResult.Error

    for bucket in list_buckets["Buckets"]:
        bucket_name = bucket['Name']
        region_name = None
        try:
            # 取得したS3バケット一覧情報ファイルをもとに、各バケットのリージョンを取得する。
            region_name = S3Utils.get_bucket_location(trace_id, s3_client,
                                                      bucket_name, aws_account)
            if region_name is None:
                region_name = CommonConst.US_EAST_REGION

            # 取得したS3バケット情報ファイルをもとに、該当のS3バケットのアクセスコントロールリストを取得する。
            bucket_acl = get_bucket_acl(
                trace_id, check_history_id, organization_id, project_id,
                aws_account, region_name, bucket_name, s3_client)

            # 取得したS3バケット情報をもとに、S3のロギング情報を取得する。
            bucket_logging = S3Utils.get_bucket_logging(
                trace_id, aws_account, s3_client, bucket_name, region_name)
        except PmError as e:
            if e.cause_error.response['Error'][
                    'Code'] in CommonConst.S3_SKIP_EXCEPTION:
                error_operation = e.cause_error.operation_name,
                error_code = e.cause_error.response['Error']['Code'],
                error_message = e.cause_error.response['Error']['Message']
                if region_name is None:
                    region_name = CommonConst.ERROR
                check_results.append(
                    asc_item_common_logic.get_error_authorized_result(
                        region_name, bucket_name, error_operation, error_code,
                        error_message))
                is_authorized = False
                continue
            else:
                return CheckResult.Error

        # 取得したS3ロギング情報をS3に保存する（リソース情報ファイル）。
        try:
            s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                check_history_id, organization_id, project_id, aws_account,
                "ASC/S3_ClientLogging_" + region_name + "_" + bucket_name +
                ".json")
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", bucket_logging,
                                  s3_file_name)
        except PmError as e:
            pm_logger.error("[%s] S3バケットロギング情報の取得に失敗しました。（%s/%s）", aws_account,
                            region_name, bucket_name)
            return CheckResult.Error

        # チェック処理
        bucket_abnormity = True
        try:

            # Check-1. ACLによりLogDeliveryに操作権限が与えられたS3バケットが存在するか
            for grant in bucket_acl["Grants"]:
                if (common_utils.check_key("URI", grant['Grantee']) and
                        grant['Grantee']["URI"] == LOG_DELIVERY_URI):
                    bucket_abnormity = False
                    break

            # Check-2. S3バケットでログ記録が有効になっていないものは存在するか
            if bucket_abnormity is True and len(bucket_logging) == 0:
                result = {
                    'Region': region_name,
                    'Level': CommonConst.LEVEL_CODE_21,
                    'DetectionItem': {
                        'BucketName': bucket_name
                    }
                }
                check_results.append(result)
        except Exception as e:
            pm_logger.error("[%s] チェック処理中にエラーが発生しました。（%s/%s）", aws_account,
                            region_name, bucket_name)
            return CheckResult.Error

    # Export File CHECK_ASC_ITEM_16_01.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_asc_item_16_01 = {
            'AWSAccount': aws_account,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_asc_item_16_01, result_json_path,
                            True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        return CheckResult.Error

    # チェック結果
    if is_authorized is False:
        return CheckResult.Error
    if len(check_results) > 0:
        return CheckResult.CriticalDefect
    return CheckResult.Normal


def get_bucket_acl(trace_id, check_history_id, organization_id, project_id,
                   aws_account, region_name, bucket_name, s3_client):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, aws_account,
        "ASC/S3_ACL_" + region_name + "_" + bucket_name + ".json")

    # リソース情報取得
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            bucket_acl = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                             s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        try:
            bucket_acl = S3Utils.get_bucket_acl(
                trace_id, s3_client, bucket_name, aws_account, region_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)

        # 取得したS3バケットのアクセスコントロールリスト情報をS3に保存する。（アクセスコントロールリスト情報）
        try:
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", bucket_acl,
                                  s3_file_name)
        except PmError as e:
            pm_logger.error("[%s] S3バケットACL情報のS3保存に失敗しました。（%s）/（%s）",
                            aws_account, region_name, bucket_name)
    return bucket_acl
