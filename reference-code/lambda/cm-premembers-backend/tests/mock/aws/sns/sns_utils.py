import boto3

sns_client_connect = None


def client_connect():
    global sns_client_connect
    if not sns_client_connect:
        sns_client_connect = boto3.client('sns')
    return sns_client_connect
