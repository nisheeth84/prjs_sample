import logging
import os
import json
import boto3
import re

logger = logging.getLogger()
log_level = os.getenv('LOG_LEVEL', default='INFO')
logger.setLevel(log_level)
lambda_client = None
target_projects = os.getenv('TARGET_PROJECTS', default='')


def lambda_handler(event, context):
    global target_projects
    logger.debug("Received event: " + json.dumps(event, indent=2))
    detail = event['detail']
    state = detail['build-status']
    project_name = detail['project-name']
    is_target_project = True
    project_name_pattern = re.compile('cm-premembers-.*-Create-Container-Build')
    if project_name_pattern.match(project_name) is None:
        is_target_project = False
    if is_target_project:
        if (state == 'SUCCEEDED'):
            send_result_success_message(detail)
        if (state == 'FAILED'):
            send_result_fail_message(detail)
    else:
        logger.info("このプロジェクトは通知対象ではありません Project: " + project_name)


def send_result_success_message(detail):
    global lambda_client
    if not lambda_client:
        lambda_client = boto3.client('lambda')
    service_name = os.environ['SERVICE_NAME']
    stage = os.environ['STAGE']
    url_template = "https://ap-northeast-1.console.aws.amazon.com/codebuild/home?region=ap-northeast-1#/projects/{project-name}/view"
    message = "コンテナ作成用CodeBuildの処理が完了しました\n"
    attachments_json = [{
        "title": "AWS CodeBuild Management Console ",
        "title_link": url_template.format(**detail),
        "color": "good",
        "text": "対象プロジェクト: {project-name}".format(**detail)
    }]
    event = {'message': message, 'attachments': attachments_json}
    lambda_client.invoke(
        FunctionName='{0}-{1}-{2}'.format(service_name, stage, "push_slack"),
        InvocationType="RequestResponse",
        Payload=json.dumps(event))


def send_result_fail_message(detail):
    global lambda_client
    if not lambda_client:
        lambda_client = boto3.client('lambda')
    service_name = os.environ['SERVICE_NAME']
    stage = os.environ['STAGE']
    url_template = "https://ap-northeast-1.console.aws.amazon.com/codebuild/home?region=ap-northeast-1#/projects/{project-name}/view"
    message = "コンテナ作成用CodeBuildの処理にてエラーが発生しています\n"
    attachments_json = [{
        "title": "AWS CodeBuild Management Console ",
        "title_link": url_template.format(**detail),
        "color": "danger",
        "text": "詳細: {}".format(json.dumps(detail, indent=2))
    }]
    event = {'message': message, 'attachments': attachments_json}
    lambda_client.invoke(
        FunctionName='{0}-{1}-{2}'.format(service_name, stage, "push_slack"),
        InvocationType="RequestResponse",
        Payload=json.dumps(event))
