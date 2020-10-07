import boto3
from botocore.exceptions import ClientError
from premembers.common import pm_log_adapter
from premembers.exception.pm_exceptions import NoRetryException
import inspect

ROLE_ARN_TEMPLATE = "arn:aws:iam::{account}:role/{role_name}"
sts_client = None


def check_access_to_aws(trace_id,
                        account,
                        role_name,
                        external_id,
                        policies=['ReadOnlyAccess']):
    global ROLE_ARN_TEMPLATE
    global sts_client
    if not sts_client:
        sts_client = boto3.client('sts')
    pm_logger = pm_log_adapter.create_pm_logger(__name__, trace_id,
                                                inspect.currentframe())

    param = {
        'account': account,
        'role_name': role_name,
        'external_id': external_id,
        'policies': policies
    }
    pm_logger.info("start param %s", param)
    role_arn = ROLE_ARN_TEMPLATE.format(account=account, role_name=role_name)
    try:
        assume_role_object = sts_client.assume_role(
            RoleArn=role_arn,
            RoleSessionName='premem_session_{trace_id}'.format(
                trace_id=trace_id),
            DurationSeconds=1500,
            ExternalId=external_id)
    except ClientError as e:
        no_retry_exception = NoRetryException(
            cause_error=e, message="Credentialの取得に失敗しました。")
        pm_logger.warn(no_retry_exception)
        pm_logger.exception("error_id: %s", no_retry_exception.error_id)
        return False
    credentials = assume_role_object['Credentials']
    iam_client = boto3.client(
        'iam',
        aws_access_key_id=credentials['AccessKeyId'],
        aws_secret_access_key=credentials['SecretAccessKey'],
        aws_session_token=credentials['SessionToken'])
    try:
        attach_policies = list_attach_role_policies(trace_id, iam_client,
                                                    role_name)
    except ClientError as e:
        no_retry_exception = NoRetryException(
            cause_error=e, message="Policyの取得に失敗しました。")
        pm_logger.warn(no_retry_exception)
        pm_logger.exception("error_id: %s", no_retry_exception.error_id)
        return False
    for policy in policies:
        if not (policy in attach_policies):
            pm_logger.warn("{policy} は {role}に含まれていません".format(
                policy=policy, role=role_arn))
            return False
    pm_logger.info("end")
    return True


def list_attach_role_policies(trace_id,
                              iam_client,
                              role_name,
                              attach_policies=[]):
    pm_logger = pm_log_adapter.create_pm_logger(__name__, trace_id,
                                                inspect.currentframe())

    param = {
        'iam_client': iam_client,
        'role_name': role_name,
        'attach_policies': attach_policies
    }
    pm_logger.info("start param %s", param)
    response = iam_client.list_attached_role_policies(RoleName=role_name)
    if 'AttachedPolicies' in response:
        response_attached_policies = iam_client.list_attached_role_policies(
            RoleName=role_name)['AttachedPolicies']
        tmp_attached_policies = [
            attached_policy['PolicyName']
            for attached_policy in response_attached_policies
        ]
        attach_policies.extend(tmp_attached_policies)
        if response['IsTruncated']:
            return list_attach_role_policies(trace_id, iam_client, role_name,
                                             attach_policies)
    pm_logger.info("end")
    return attach_policies
