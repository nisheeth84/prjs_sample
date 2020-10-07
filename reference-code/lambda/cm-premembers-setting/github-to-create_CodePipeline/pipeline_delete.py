import json
import boto3
import os
import distutils.util
import re
import logging
from datetime import datetime
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

backend_repository_name = os.getenv("backend_repository_name",
                                    'cm-premembers-backend')

backend_delete_project = 'serverless_delete'
backend_env_stack = os.getenv('BACKEND_ENV_STACK',
                              "premembers-backend-environment")

dry_run = bool(distutils.util.strtobool(os.getenv("dry_run", "False")))

cloudwatch_url_template = "https://ap-northeast-1.console.aws.amazon.com/cloudwatch/home?region=ap-northeast-1#logEventViewer:group={log_group};stream={log_stream}"

s3 = None
cfn = None
cloudwatch_logs = None
codebuild = None
dynamodb = None
lambda_client = None


def support_datetime_default(o):
    if isinstance(o, datetime):
        return o.isoformat()
    raise TypeError(repr(o) + " is not JSON serializable")


def check_stack(stack_name):
    global cfn
    if not cfn:
        cfn = boto3.client('cloudformation')
    stack_status_filter_big = [
        'CREATE_IN_PROGRESS', 'CREATE_FAILED', 'CREATE_COMPLETE',
        'ROLLBACK_IN_PROGRESS', 'ROLLBACK_FAILED', 'ROLLBACK_COMPLETE',
        'DELETE_IN_PROGRESS', 'DELETE_FAILED', 'UPDATE_IN_PROGRESS',
        'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS', 'UPDATE_COMPLETE',
        'UPDATE_ROLLBACK_IN_PROGRESS', 'UPDATE_ROLLBACK_FAILED',
        'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS',
        'UPDATE_ROLLBACK_COMPLETE'
    ]
    stack_summaries = cfn.list_stacks(
        StackStatusFilter=stack_status_filter_big)
    target_stack = None
    for stack_summary in stack_summaries['StackSummaries']:
        if (stack_summary['StackName'] == stack_name):
            target_stack = stack_summary
    return target_stack


def delete_codePipeline_stack(stack_name):
    global cfn
    if not cfn:
        cfn = boto3.client('cloudformation')
    if not dry_run:
        try:
            cfn.delete_stack(StackName=stack_name)
        except:
            logger.exception()
    else:
        logger.warn("delete codepipeline stack is dryrun")


def get_only_ticket_name(ref):
    return ref.replace("feature-", "")


def is_backend_codepipeline(stack_name):
    global cfn
    if not cfn:
        cfn = boto3.client('cloudformation')
    try:
        result = cfn.describe_stacks(StackName=stack_name)
        tags = result['Stacks'][0]['Tags']
        for tag in tags:
            if tag['Key'] == 'isBackend':
                return bool(distutils.util.strtobool(tag['Value']))
    except:
        return False
    else:
        return False


def delete_serverless_framework_stack(ticket_name):
    global codebuild
    if not codebuild:
        codebuild = boto3.client('codebuild')
    if not dry_run:
        codebuild.start_build(
            projectName=backend_delete_project,
            environmentVariablesOverride=[{
                'name': 'BRANCH',
                'value': ticket_name
            }, {
                'name': 'BACKEND_ENV_STACK',
                'value': backend_env_stack
            }])
    else:
        logger.warning("delete serverless framework stack is dryrun")


def delete_codebuild_cloudwatch_logs(ticket_name):
    global cloudwatch_logs
    if not cloudwatch_logs:
        cloudwatch_logs = boto3.client('logs')
    p = re.compile('\/aws\/codebuild\/.*-{ticket_name}.*build'.format(
        ticket_name=ticket_name))
    log_groups = cloudwatch_logs.describe_log_groups()['logGroups']
    log_group_names = [log_group['logGroupName'] for log_group in log_groups]
    deleteLogGroupNames = []
    for log_group_name in log_group_names:
        if p.match(log_group_name) is not None:
            if not dry_run:
                try:
                    cloudwatch_logs.delete_log_group(logGroupName=log_group_name)
                except:
                    logger.warning("CloudWatch Logsの削除に失敗しました。対象={}".format(log_group_name))
            else:
                logger.warning("delete codebuild cloudwatch logs is dryrun")
            deleteLogGroupNames.append(log_group_name)
    return deleteLogGroupNames


def delete_dynamodb_table(ticket_name):
    global dynamodb
    if not dynamodb:
        dynamodb = boto3.client('dynamodb')
    p = re.compile('{ticket_name}.*'.format(ticket_name=ticket_name))
    tables = dynamodb.list_tables(
        ExclusiveStartTableName='PM_Reports')['TableNames']
    return_tables = []
    if not dry_run:
        for table in tables:
            try:
                if p.match(table) is not None:
                    dynamodb.delete_table(TableName=table)
                    return_tables.append(table)
            except:
                logger.exception()
    else:
        logger.warning("dynamodb table delete is dryrun.")
    return return_tables


def send_result_message(return_object):
    global lambda_client
    if not lambda_client:
        lambda_client = boto3.client('lambda')
    message = "Pull Request Closeに伴い以下の削除を行いました。\n"
    message += "```\n"
    message += "RepositoryURL : {repository_url}\n"
    message += "Branch : {branch}\n"
    message += "Stack : {stack_name}\n"
    message += "isBackEnd: {stack_is_backend}\n"
    message += "cloudwatch logs : {deleteCodeBuildLogs}\n"
    message += "DynamoDB Table : {deleteDynamoTable}\n"
    message += "```\n"
    attachments_json = [{
        "title": "Cloudwatch Logs",
        "text": "Stack の削除ログはこちらを参照",
        "color": "good",
        "title_link": return_object['lambda_log_url']
    }]
    event = {
        'message': message.format(**return_object),
        'attachments': attachments_json
    }
    service_name = os.environ['SERVICE_NAME']
    stage = os.environ['STAGE']
    lambda_client.invoke(
        FunctionName='{0}-{1}-{2}'.format(service_name, stage, "push_slack"),
        InvocationType="RequestResponse",
        Payload=json.dumps(event))
    return message


def delete_s3_object(ticket_name):
    global s3
    if not s3:
        s3 = boto3.resource('s3')
    prefix = ticket_name + "/"
    frontend_s3_bucket = os.environ['FRONTEND_BUCKET']
    mybucket = s3.Bucket(name=frontend_s3_bucket)

    for obj in mybucket.objects.filter(Prefix=prefix):
        if obj.size > 0:
            try:
                if not dry_run:
                    obj.delete()
                logger.info("Delete object success path=: %s", obj.key)
            except ClientError as e:
                logger.error("S3のファイル削除に失敗しました。: path=: %s", obj.key)


def lambda_handler(event, context):
    logger.info(event)

    global cloudwatch_url_template
    if (dry_run):
        logger.info("dry run実行のため削除は行いません。")

    logger.info("プルリクエストがクローズされました。リソースの削除を行います。")
    return_object = {}
    # Repository名の取得
    repository_full_name = event['repository_full_name']
    return_object['repository'] = repository_full_name
    logger.info("リポジトリ名: {}".format(repository_full_name))
    # クローズされたブランチ名の取得
    branch = event['ref']
    return_object['branch'] = branch
    logger.info("ブランチ名: {}".format(branch))
    # Repository
    split_full_name_result = repository_full_name.split('/')
    github_repository = split_full_name_result[1]
    # チケット番号の取得
    ticket_name = get_only_ticket_name(branch)
    # 削除対象のStackの取得
    stack_name = github_repository + '-' + ticket_name
    logger.info("削除対象stack: {}".format(stack_name))
    return_object['stack_name'] = stack_name
    target_stack = check_stack(stack_name)
    # Build用CodePipelieを構築したCloudFormationの削除を実施
    if (target_stack):
        return_object['cfn_target_stack'] = target_stack
        logger.debug(target_stack)
        delete_codePipeline_stack(stack_name)
        logger.info("Stackの削除リクエストを送付しました")

    # DynamoDB Tableの削除を実施
    delete_result_tables = delete_dynamodb_table(ticket_name)
    return_object["deleteDynamoTable"] = delete_result_tables
    logger.info("DynamoDB の Tablesを削除しました。")

    # CodeBuildのCloudwatch Logsの削除を実施
    delete_result_logs = delete_codebuild_cloudwatch_logs(ticket_name)
    return_object["deleteCodeBuildLogs"] = delete_result_logs
    logger.info("CodeBuild の CloudWatch Logsを削除しました。")

    # マージされたRepositoryがAPIの場合、serverless frameworkのRemoveコマンドをCode Buildを介して実施
    return_object['stack_is_backend'] = False
    if (is_backend_codepipeline(stack_name)):
        logger.info("{} はAPIのStackです。".format(stack_name))
        return_object['stack_is_backend'] = True
        delete_serverless_framework_stack(ticket_name)
        logger.info(
            "デプロイされたAPIを削除しました。削除対象チケット番号: {}".format(ticket_name))
    else:
        logger.info("{} はフロントエンドのStackです。".format(stack_name))
        delete_s3_object(ticket_name)

    return_object['repository_url'] = event['repository_url']
    return_object['lambda_log_url'] = cloudwatch_url_template.format(
        log_group=context.log_group_name,
        log_stream=context.log_stream_name)
    logger.info(return_object)
    send_result_message(return_object)

    return json.dumps(return_object, default=support_datetime_default)
