import json
import boto3
import inspect
import datetime
import yaml

from premembers.common import common_utils
from decimal import Decimal
from botocore.exceptions import ClientError

global_s3_client = None


def convert_handler(x):
    if isinstance(x, datetime.datetime):
        return x.isoformat()
    elif isinstance(x, Decimal):
        return int(x)
    raise TypeError("Unknown type")


def upload_s3(trace_id, data, s3_file_name, format_json=False,
              is_cw_logger=False):
    if (is_cw_logger):
        common_utils.begin_cw_logger(trace_id, __name__,
                                     inspect.currentframe())
    else:
        common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    if (format_json):
        upload_json(trace_id, "S3_CHECK_BUCKET", data, s3_file_name,
                    is_cw_logger=is_cw_logger)
    else:
        upload_csv(trace_id, "S3_CHECK_BUCKET", data, s3_file_name,
                   is_cw_logger=is_cw_logger)


def upload_json(trace_id, bucket, data, s3_file_name, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    bucket_name = common_utils.get_environ(bucket)
    try:
        global global_s3_client
        if not global_s3_client:
            global_s3_client = boto3.client('s3')
        more_binary_data = json.dumps(
            data, indent=4, default=convert_handler, ensure_ascii=False)
        # Upload the file to S3
        global_s3_client.put_object(
            Body=more_binary_data,
            Bucket=bucket_name,
            Key=s3_file_name)
        logger.info("Upload file json [%s] success on bucket [%s]",
                    s3_file_name, bucket_name)
    except ClientError as e:
        raise common_utils.write_log_exception(e, logger)


def upload_csv(trace_id, bucket, data, s3_file_name, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    bucket_name = common_utils.get_environ(bucket)
    try:
        global global_s3_client
        if not global_s3_client:
            global_s3_client = boto3.client('s3')
        # Upload the file to S3
        global_s3_client.put_object(
            Body=data, Bucket=bucket_name, Key=s3_file_name)
        logger.info("Upload file csv [%s] success on bucket [%s]",
                    s3_file_name, bucket_name)
    except ClientError as e:
        raise common_utils.write_log_exception(e, logger)


def read_json(trace_id, bucket, s3_file_name, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        global global_s3_client
        if not global_s3_client:
            global_s3_client = boto3.client('s3')
        response = global_s3_client.get_object(
            Bucket=common_utils.get_environ(bucket), Key=s3_file_name)
        result = json.loads(response['Body'].read())
        logger.info("read json success")
        return result
    except ClientError as e:
        raise common_utils.write_log_exception(e, logger)


def read_csv(trace_id, bucket, s3_file_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        global global_s3_client
        if not global_s3_client:
            global_s3_client = boto3.client('s3')
        response = global_s3_client.get_object(
            Bucket=common_utils.get_environ(bucket), Key=s3_file_name)
        result = str(response['Body'].read().decode())
        pm_logger.info("read csv success")
        return result
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)


def read_yaml(trace_id, bucket, s3_file_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    result = yaml.load(read_object(trace_id, bucket, s3_file_name))
    pm_logger.info("read yaml success")
    return common_utils.response(result, pm_logger)


def read_decode(trace_id, bucket, s3_file_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    result = read_object(trace_id, bucket, s3_file_name).decode()
    pm_logger.info("read decode success")
    return common_utils.response(result, pm_logger)


def read_object(trace_id, bucket, s3_file_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        global global_s3_client
        if not global_s3_client:
            global_s3_client = boto3.client('s3')
        response = global_s3_client.get_object(
            Bucket=common_utils.get_environ(bucket), Key=s3_file_name)
        return response['Body'].read()
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)
