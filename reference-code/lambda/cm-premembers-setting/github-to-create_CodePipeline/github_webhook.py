import json
import boto3
import os
import distutils.util
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# GITHUB_WEBHOOK_SECRET = os.environ['GITHUB_WEBHOOK_SECRET']

lambda_client = boto3.client('lambda')

def invoke_create_pipeline(ref, repository_full_name):
    payload = {
            'ref': ref,
            'repository_full_name': repository_full_name,
        }

    lambda_client.invoke(
        FunctionName = 'github-to-create-CodePipeline-dev-pipeline_create',
        InvocationType = 'Event',
        Payload = json.dumps(payload)
    )


def invoke_delete_pipeline(ref, repository_full_name, repository_url = ''):
    payload = {
            'ref': ref,
            'repository_full_name': repository_full_name,
            'repository_url': repository_url,
        }

    lambda_client.invoke(
        FunctionName = 'github-to-create-CodePipeline-dev-pipeline_delete',
        InvocationType = 'Event',
        Payload = json.dumps(payload)
    )


def lambda_handler(event, context):
    logger.info(event)

    # TODO verify 'X-Hub-Signature'

    event_type = event['headers']['X-GitHub-Event']
    body = json.loads(event['body'])
    if event_type == 'create': # Created a branch
        invoke_create_pipeline(body['ref'], body['repository']['full_name'])
    # elif event_type == 'delete': # Deleted a branch
    #     invoke_delete_pipeline(body['ref'], body['repository']['full_name'], body['repository']['html_url'])
    elif event_type == 'pull_request' and body['action'] == 'closed': # Closed a PullRequest
        pull_request = body['pull_request']
        invoke_delete_pipeline(pull_request['head']['ref'], pull_request['head']['repo']['full_name'], pull_request['html_url'])

    return {
        'statusCode': '200',
        'headers': {
            'Content-Type': 'application/json',
        },
    }