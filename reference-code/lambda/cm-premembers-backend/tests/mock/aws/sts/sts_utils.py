import boto3
import copy

from boto3.session import Session
from tests.mock.data.aws.sts.data_test_sts import DataTestSTS
from tests.mock.data.aws.data_common import DataCommon
from premembers.common import common_utils

sts_client_connect = None


def create_session():
    aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
    role_name = copy.deepcopy(DataTestSTS.ROLE_NAME)
    external_id = copy.deepcopy(DataTestSTS.EXTERNAL_ID)
    role_arn = 'arn:aws:iam::{0}:role/{1}'.format(aws_account, role_name)
    session_name = common_utils.get_uuid4()
    client = boto3.client('sts')

    credentials = client.assume_role(
        RoleArn=role_arn,
        RoleSessionName=session_name,
        ExternalId=external_id)

    access_key = credentials['Credentials']['AccessKeyId']
    secret_key = credentials['Credentials']['SecretAccessKey']
    session_token = credentials['Credentials']['SessionToken']

    session = Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        aws_session_token=session_token)

    return session


def client_connect():
    global sts_client_connect
    if not sts_client_connect:
        sts_client_connect = boto3.client(
            'sts',
            region_name='us-east-1',
            aws_access_key_id='fake_aws_access_key_id',
            aws_secret_access_key='fake_aws_secret_access_key')
    return sts_client_connect
