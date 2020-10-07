import boto3
import uuid
import copy
from tests.mock.data.aws.cognito_idp.data_test_cognito_idp import DataTestCognitoIdp

cognitor_client_connect = None
group_name_default = 'test_cognitor_idp'


def client_connect():
    global cognitor_client_connect
    if not cognitor_client_connect:
        cognitor_client_connect = boto3.client(
            'cognito-idp',
            region_name='us-east-1',
            aws_access_key_id='fake_aws_access_key_id',
            aws_secret_access_key='fake_aws_secret_access_key')
    return cognitor_client_connect


def create_user_pool(pool_name=None):
    if pool_name is None:
        pool_name = str(uuid.uuid4())
    client = client_connect()
    try:
        user_pool = client.create_user_pool(PoolName=pool_name)
    except Exception as e:
        raise e
    return user_pool


def create_group(user_pool_id, group_name=None):
    if group_name is None:
        group_name = group_name_default
    client = client_connect()
    try:
        client.create_group(GroupName=group_name, UserPoolId=user_pool_id)
    except Exception as e:
        raise e


def create_user(user_name, user_pool_id, user_attribute=None):
    client = client_connect()
    if user_attribute is None:
        client.admin_create_user(UserPoolId=user_pool_id, Username=user_name)
    else:
        client.admin_create_user(
            UserPoolId=user_pool_id,
            Username=user_name,
            UserAttributes=user_attribute)


def create_data_test_to_cognito_user(user_pool_id):
    for user_data in copy.deepcopy(DataTestCognitoIdp.LIST_DATA_USER):
        user_name = user_data['userName']
        user_attributes = []
        user_attributes.append(user_data['user_attributes'])
        create_user(
            user_name=user_name,
            user_pool_id=user_pool_id,
            user_attribute=user_attributes)
