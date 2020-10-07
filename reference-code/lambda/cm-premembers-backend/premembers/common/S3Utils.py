import inspect

from premembers.const.const import CommonConst
from premembers.common import common_utils
from botocore.exceptions import ClientError
from premembers.exception.pm_exceptions import PmError


def get_s3_client(trace_id, session, aws_account,
                  is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        s3_client = session.client(service_name='s3')
    except ClientError as e:
        logger.error("[%s] S3クライアント作成に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, logger)
    return s3_client


def get_bucket_logging(trace_id, aws_account, s3_client, bucketName,
                       region_name, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    bucket_logging = []
    try:
        result = s3_client.get_bucket_logging(Bucket=bucketName)
    except ClientError as e:
        if e.response['Error']['Code'] in CommonConst.S3_SKIP_EXCEPTION:
            logger.warning("[%s/%s] 権限エラーによりS3バケットロギング情報の取得に失敗しました。（%s）",
                           aws_account, region_name, bucketName)
            raise common_utils.write_log_warning(e, logger)
        else:
            logger.error("[%s/%s] S3バケットロギング情報の取得に失敗しました。%s", aws_account,
                         region_name, bucketName)
            raise common_utils.write_log_exception(e, logger)
    if common_utils.check_key("LoggingEnabled", result):
        bucket_logging = result["LoggingEnabled"]
    return bucket_logging


def get_bucket_acl(trace_id, s3_client, bucket, awsaccount, region_name,
                   is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        result = s3_client.get_bucket_acl(Bucket=bucket)
    except ClientError as e:
        if e.response['Error']['Code'] in CommonConst.S3_SKIP_EXCEPTION:
            logger.warning("[%s/%s] 権限エラーによりS3バケットACL情報の取得に失敗しました。（%s）",
                           awsaccount, region_name, bucket)
            raise common_utils.write_log_warning(e, logger)
        else:
            logger.error("[%s/%s]S3バケットACL情報の取得に失敗しました。（%s）", awsaccount,
                         region_name, bucket)
            raise common_utils.write_log_exception(e, logger)
    return result


def get_bucket_policy(trace_id, s3_client, bucket, awsaccount, region_name,
                      is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        result = s3_client.get_bucket_policy(Bucket=bucket)
    except ClientError as e:
        if e.response["Error"]["Code"] == CommonConst.NO_SUCH_BUCKET_POLICY:
            logger.info("[%s/%s]S3バケットポリシーは未設定です。（%s）", awsaccount,
                        region_name, bucket)
            return None
        elif e.response['Error']['Code'] in CommonConst.S3_SKIP_EXCEPTION:
            logger.warning("[%s/%s] 権限エラーによりS3バケットポリシー情報の取得に失敗しました。（%s）",
                           awsaccount, region_name, bucket)
            raise common_utils.write_log_warning(e, logger)
        else:
            logger.error("[%s/%s]S3バケットポリシー情報の取得に失敗しました。（%s）", awsaccount,
                         region_name, bucket)
            raise common_utils.write_log_exception(e, logger)
    return result


def list_buckets(trace_id, s3_client, aws_account, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        result = s3_client.list_buckets()
    except ClientError as e:
        logger.error("[%s] S3バケット一覧情報の取得に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, logger)
    return result


def get_bucket_location(trace_id, s3_client, bucket, aws_account,
                        is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        result = s3_client.get_bucket_location(Bucket=bucket)
    except ClientError as e:
        if e.response['Error']['Code'] in CommonConst.S3_SKIP_EXCEPTION:
            logger.warning("[%s] 権限エラーによりS3バケットリージョン情報の取得に失敗しました。（%s）",
                           aws_account, bucket)
            raise common_utils.write_log_warning(e, logger)
        else:
            logger.error("[%s]S3バケットリージョン情報の取得に失敗しました。（%s）", aws_account,
                         bucket)
            raise common_utils.write_log_exception(e, logger)
    if common_utils.check_key("LocationConstraint", result):
        return result["LocationConstraint"]
    return None


def get_bucket_encryption(trace_id, s3_client, bucket, aws_account,
                          region_name, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    bucket_encryption = []
    try:
        result = s3_client.get_bucket_encryption(Bucket=bucket)
    except ClientError as e:
        if e.response["Error"]["Code"] == CommonConst.SERVER_SIDE_ENCRYPTION_CONFIGURATION_NOT_FOUND_ERROR:
            logger.info("[%s]S3バケット暗号化情報がありません。（%s/%s）", aws_account,
                        region_name, bucket)
            raise PmError(cause_error=e)
        elif e.response['Error']['Code'] in CommonConst.S3_SKIP_EXCEPTION:
            logger.warning("[%s] 権限エラーによりS3バケットリージョン情報の取得に失敗しました。（%s/%s）",
                           aws_account, region_name, bucket)
            raise common_utils.write_log_warning(e, logger)
        else:
            logger.error("[%s]S3バケット暗号化情報の取得に失敗しました。（%s/%s）", aws_account,
                         region_name, bucket)
            raise common_utils.write_log_exception(e, logger)
    if common_utils.check_key("ServerSideEncryptionConfiguration", result):
        if common_utils.check_key("Rules", result["ServerSideEncryptionConfiguration"]):
            bucket_encryption = result["ServerSideEncryptionConfiguration"]["Rules"]
    return bucket_encryption
