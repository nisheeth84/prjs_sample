import json
import boto3
import os
import distutils.util
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Github
github_token = os.environ['GITHUB_TOKEN']
branch_prefix = os.getenv('BRANCH_PREFIX', "feature-")
# Repository Name
backend_repository_name = os.getenv("backend_repository_name",
                                    'cm-premembers-backend')
# Cloudformation Environment stack
frontend_env_stack = os.getenv('FRONTEND_ENV_STACK',
                               "premembers-frontend-environment")
backend_env_stack = os.getenv('BACKEND_ENV_STACK',
                              "premembers-backend-environment")
# CodePipeline
codepipeline_role_arn = os.environ['CODEPIPELINE_ROLE_ARN']
codepipeline_s3 = os.environ['CODEPIPELINE_S3']
# CodeBuild
codebuild_role_arn = os.environ['CODEBUILD_ROLE_ARN']
codebuild_premembers_build_image = os.environ['CODEBUILD_BACKEND_BUILD_IMAGE']

dry_run = bool(distutils.util.strtobool(os.getenv("dry_run", "False")))

single_repository_template_url = 'https://s3-ap-northeast-1.amazonaws.com/premem-dev-cfn-template/createPipeline/createCodePipelineFeatureSingleRepository.yml'
# dev_both_repository_template_url = 'https://s3-ap-northeast-1.amazonaws.com/premem-dev-cfn-template/createPipeline/createCodePipelineFeatureBothRepository.yml'
both_repository_template_url = os.getenv('TEMPLATE_URL',
                                         single_repository_template_url)

cfn = None


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


def create_codePipeline_stack(github_owner, github_repository, stack_name,
                              branch, full_branch):
    global cfn
    if not cfn:
        cfn = boto3.client('cloudformation')
    is_backend_repository = github_repository == backend_repository_name
    # (変数) = (条件がTrueのときの値) if (条件) else (条件がFalseのときの値)
    template_url = both_repository_template_url if is_backend_repository else single_repository_template_url
    if not dry_run:
        cfn_param = [{
            'ParameterKey': 'GitHubToken',
            'ParameterValue': github_token,
            'UsePreviousValue': True
        }, {
            'ParameterKey': 'GitHubOwner',
            'ParameterValue': github_owner,
            'UsePreviousValue': True
        }, {
            'ParameterKey': 'Repository',
            'ParameterValue': github_repository,
            'UsePreviousValue': True
        }, {
            'ParameterKey': 'Branch',
            'ParameterValue': branch,
            'UsePreviousValue': True
        }, {
            'ParameterKey': 'FullBranch',
            'ParameterValue': full_branch,
            'UsePreviousValue': True
        }, {
            'ParameterKey': 'CodePipelineRoleArn',
            'ParameterValue': codepipeline_role_arn,
            'UsePreviousValue': True
        }, {
            'ParameterKey': 'CodePipelineS3',
            'ParameterValue': codepipeline_s3,
            'UsePreviousValue': True
        }, {
            'ParameterKey': 'CodeBuildRoleArn',
            'ParameterValue': codebuild_role_arn,
            'UsePreviousValue': True
        }, {
            'ParameterKey': 'FrontendEnvStack',
            'ParameterValue': frontend_env_stack,
            'UsePreviousValue': True
        }, {
            'ParameterKey': 'BackendEnvStack',
            'ParameterValue': backend_env_stack,
            'UsePreviousValue': True
        }, {
            'ParameterKey': 'PremembersBuildImage',
            'ParameterValue': codebuild_premembers_build_image,
            'UsePreviousValue': True
        }]
        if (is_backend_repository):
            cfn_param.append({
                'ParameterKey': 'BackendStack',
                'ParameterValue': 'premembers-backend-{}'.format(branch),
                'UsePreviousValue': True
            })
        cfn.create_stack(
            StackName=stack_name,
            TemplateURL=template_url,
            Parameters=cfn_param,
            Tags=[{
                'Key': 'isBackend',
                'Value': str(is_backend_repository)
            }])
    else:
        logger.info("create codepipeline stask is dryrun")


def is_backend_codepipeline(stack_name):
    global cfn
    if not cfn:
        cfn = boto3.client('cloudformation')
    result = cfn.describe_stacks(StackName=stack_name)
    tags = result['Stacks'][0]['Tags']
    for tag in tags:
        if tag['Key'] == 'isBackend':
            return bool(distutils.util.strtobool(tag['Value']))
    return False


def lambda_handler(event, context):
    logger.info(event)
    ref = event['ref']
    full_name = event['repository_full_name']
    split_full_name = full_name.split('/')
    # GithubOwner
    github_owner = split_full_name[0]
    # Repository
    github_repository = split_full_name[1]
    # Branch
    full_branch = ref
    logger.info("ref: " + full_branch)
    if (branch_prefix in full_branch):
        branch = full_branch.replace(branch_prefix, "")
        stack_name = github_repository + '-' + branch
        logger.info("stack_name: " + stack_name)
        if (check_stack(stack_name) is None):
            create_codePipeline_stack(github_owner, github_repository,
                                        stack_name, branch, full_branch)
        else:
            logger.info(stack_name + " is exists.")
    else:
        logger.info("{} is not contain {}".format(full_branch, branch_prefix))