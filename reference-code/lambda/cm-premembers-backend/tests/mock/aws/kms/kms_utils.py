from tests.mock.aws.sts import sts_utils

kms_client_connect = None


def client_connect():
    global kms_client_connect
    if not kms_client_connect:
        session = sts_utils.create_session()
        kms_client_connect = session.client(
            'kms',
            region_name='us-east-1',
            aws_access_key_id='fake_aws_access_key_id',
            aws_secret_access_key='fake_aws_secret_access_key')
    return kms_client_connect
