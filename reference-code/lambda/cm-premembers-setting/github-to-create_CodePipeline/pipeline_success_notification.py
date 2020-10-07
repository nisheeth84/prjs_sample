import logging
import os
import json
import boto3

logger = logging.getLogger()
log_level = os.getenv('LOG_LEVEL', default='INFO')
logger.setLevel(log_level)
lambda_client = None


def lambda_handler(event, context):
    detail = event['detail']
    state = detail['state']
    logger.debug("Received event: " + json.dumps(event, indent=2))
    if(state == 'SUCCEEDED'):
        send_result_message(detail)


def send_result_message(detail):
    global lambda_client
    if not lambda_client:
        lambda_client = boto3.client('lambda')
    service_name = os.environ['SERVICE_NAME']
    stage = os.environ['STAGE']
    url_template = "https://ap-northeast-1.console.aws.amazon.com/codepipeline/home?region=ap-northeast-1#/view/{pipeline}"
    message = "CodePipelineの処理が成功しました。\n"
    attachments_json = [{
        "title": "AWS CodePipeline Management Console ",
        "title_link": url_template.format(**detail),
        "color": "good",
        "text": "対象パイプライン: {pipeline}".format(**detail)
    }]
    event = {
        'message': message,
        'attachments': attachments_json
    }
    lambda_client.invoke(
        FunctionName='{0}-{1}-{2}'.format(service_name, stage, "push_slack"),
        InvocationType="RequestResponse",
        Payload=json.dumps(event))
