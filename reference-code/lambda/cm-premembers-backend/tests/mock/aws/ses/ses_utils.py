import boto3

ses_client_connect = None


def client_connect():
    global ses_client_connect
    if not ses_client_connect:
        ses_client_connect = boto3.client(
            'ses',
            region_name='us-east-1',
            aws_access_key_id='fake_aws_access_key_id',
            aws_secret_access_key='fake_aws_secret_access_key')
    return ses_client_connect
