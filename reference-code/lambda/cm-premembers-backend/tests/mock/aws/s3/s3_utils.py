import boto3
from premembers.const.const import CommonConst
from premembers.common import common_utils

s3_client_connect = None
s3_resource_connect = None
bucket_name_default = common_utils.get_environ(CommonConst.S3_SETTING_BUCKET)


def client_connect():
    global s3_client_connect
    if not s3_client_connect:
        s3_client_connect = boto3.client(
            's3',
            region_name='us-east-1',
            aws_access_key_id='fake_aws_access_key_id',
            aws_secret_access_key='fake_aws_secret_access_key')
    return s3_client_connect


def resource_connect():
    global s3_resource_connect
    if not s3_resource_connect:
        s3_resource_connect = boto3.resource(
            's3',
            region_name='us-east-1',
            aws_access_key_id='fake_aws_access_key_id',
            aws_secret_access_key='fake_aws_secret_access_key')
    return s3_resource_connect


def create_bucket(bucket_name=None):
    if bucket_name is None:
        bucket_name = bucket_name_default
    conn = client_connect()
    conn.create_bucket(Bucket=bucket_name)
