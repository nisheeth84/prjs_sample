import os
import uuid
import json
import boto3
import inspect

from retry import retry
from boto3.session import Session
from premembers.common import common_utils
from botocore.exceptions import ClientError
from premembers.exception.pm_exceptions import PmError
from premembers.const.const import CommonConst


# Begin function SNS
def sns_organization_topic(trace_id,
                           task_id,
                           code,
                           organization_id=None,
                           user_id=None):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    topic_arn = os.environ.get("SNS_ORGANIZATION_TOPIC")
    message = {"TaskId": str(task_id), "Code": str(code)}

    if organization_id is not None:
        message["OrganizationID"] = str(organization_id)
    if user_id is not None:
        message["UserID"] = str(user_id)

    subject = "TASK : " + task_id

    # Send sns
    aws_sns(trace_id, subject, json.dumps(message), topic_arn)


def submit_job(trace_id,
               job_name,
               job_queue,
               depends_on,
               job_definition,
               parameters,
               container_overrides,
               max_retry,
               is_cw_logger=False):
    frame = inspect.currentframe()
    params = common_utils.get_params_function(frame)
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__, frame)
    else:
        logger = common_utils.begin_logger(trace_id, __name__, frame)
    job_id = []
    aws_batch_job_submit = os.getenv('AWS_BATCH_JOB_SUBMIT', 'ON')
    if aws_batch_job_submit == 'OFF':
        job_id = [
            {
                'jobId': str(uuid.uuid4())
            }
        ]
        return common_utils.response(job_id, logger), params
    try:
        client = boto3.client('batch')
    except ClientError as e:
        raise common_utils.write_log_exception(e, logger)

    try:
        response = client.submit_job(
            jobName=job_name,
            jobQueue=job_queue,
            dependsOn=depends_on,
            jobDefinition=job_definition,
            parameters=parameters,
            containerOverrides=container_overrides,
            retryStrategy={
                'attempts': int(max_retry)
            }
        )
        job_id = [
            {
                'jobId': response['jobId']
            },
        ]
        logger.info("End : submit job success")
    except ClientError as e:
        raise common_utils.write_log_exception(e, logger)
    return common_utils.response(job_id, logger), params


def aws_sns(trace_id, subject, message, topic_arn, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    # connect sns
    try:
        client = boto3.client("sns")
    except ClientError as e:
        raise common_utils.write_log_exception(e, logger)

    try:
        # Publish a message.
        client.publish(
            Subject=subject, Message=message, TopicArn=topic_arn)
        logger.info("End : send message to sns success")
    except ClientError as e:
        common_utils.write_log_exception(e, logger, True)
# End function SNS


# Begin function S3
def generate_presigned_url(trace_id, bucket, key, expire_time=3600):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    url = None
    try:
        client = boto3.client('s3')
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)

    try:
        url = client.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': bucket,
                    'Key': key},
            ExpiresIn=expire_time)
        pm_logger.info("End : Get url success")
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)
    return url


def s3_delete_report(trace_id, report_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    S3_REPORT_BUCKET = os.environ.get("S3_REPORT_BUCKET")
    prefix = report_id + CommonConst.SLASH + "report"
    try:
        s3 = boto3.resource('s3')
        mybucket = s3.Bucket(name=S3_REPORT_BUCKET)

        for obj in mybucket.objects.filter(Prefix=prefix):
            if obj.size > 0:
                try:
                    obj.delete()
                    pm_logger.info("Delete report success path=: %s", obj.key)
                except ClientError as e:
                    pm_logger.error("S3のファイル削除に失敗しました。: path=: %s", obj.key)
                    common_utils.write_log_exception(e, pm_logger, True)

    except ClientError as e:
        pm_logger.error("S3のファイル削除に失敗しました。: path=: %s", prefix)
        common_utils.write_log_exception(e, pm_logger, True)


@retry(PmError, tries=3, delay=2, backoff=1)
def check_exists_file_s3(trace_id, bucket, prefix, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    result = False
    try:
        s3 = boto3.resource('s3')
        mybucket = s3.Bucket(name=common_utils.get_environ(bucket))
        for object in mybucket.objects.filter(Prefix=prefix):
            result = True
            break
    except Exception as e:
        raise common_utils.write_log_exception(e, logger)
    return result
# End function S3


# Begin function SQS
def sqs_receive_message(trace_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    queue_url = os.environ.get("SQS_ORGANIZATION_QUEUE")
    try:
        client = boto3.client("sqs")
        response = client.receive_message(
            QueueUrl=queue_url,
            MaxNumberOfMessages=10
        )
        messages = None
        if (common_utils.check_key('Messages', response)):
            messages = common_utils.response(response['Messages'], pm_logger)
        return common_utils.response(messages, pm_logger)
    except ClientError as e:
        common_utils.write_log_exception(e, pm_logger, True)


def sqs_delete_message(trace_id, queue_url, receipt_handle):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        client = boto3.client("sqs")
        client.delete_message(
            QueueUrl=queue_url,
            ReceiptHandle=receipt_handle
        )
        pm_logger.info("End : delete message queue success")
    except ClientError as e:
        common_utils.write_log_exception(e, pm_logger, True)
# End function SQS


# Begin function Lambda
def lambda_invoke(trace_id, function_name, query, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        client = boto3.client('lambda')
        client.invoke(
            FunctionName=function_name,
            InvocationType='Event',
            Payload=query
        )
        logger.info("End : call function lambda success")
    except ClientError as e:
        common_utils.write_log_exception(e, logger, True)
# End function Lambda


# Begin function Cognito User Pool
def get_cognito_user_pools(trace_id,
                           filter,
                           attributesToGet=None,
                           attribute_filter=CommonConst.ATTRIBUTE_FILTER_EMAIL):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # get client cognito
    try:
        client = boto3.client("cognito-idp")
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)

    userPoolId = os.environ.get("COGNITO_USER_POOL_ID")
    filter = attribute_filter + '= "' + filter + '\"'
    list_user_in_pools = []
    try:
        if attributesToGet:
            users_in_pool = client.list_users(
                AttributesToGet=[attributesToGet],
                UserPoolId=userPoolId,
                Filter=filter)
        else:
            users_in_pool = client.list_users(
                UserPoolId=userPoolId,
                Filter=filter)
        if users_in_pool and users_in_pool["Users"]:
            list_user_in_pools.append(users_in_pool["Users"])
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)
    list_users = []
    if list_user_in_pools:
        try:
            for item in list_user_in_pools:
                if item:
                    for item_user in item:
                        list_users.append(item_user)
        except ClientError as e:
            raise common_utils.write_log_exception(e, pm_logger)
    pm_logger.info("End : get list cognito users success")
    return list_users


def delete_cognito_user_by_user_name(trace_id, user_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # get client cognito
    try:
        client = boto3.client("cognito-idp")
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)

    # delete cognito user
    user_pool_id = os.environ.get("COGNITO_USER_POOL_ID")
    try:
        client.admin_delete_user(
            UserPoolId=user_pool_id,
            Username=user_name)
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)
    pm_logger.info("End : delete cognito user success")


def get_cognito_user_info_by_user_name(trace_id, user_name,
                                       is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    # get user_pool
    try:
        client = boto3.client("cognito-idp")
    except ClientError as e:
        raise common_utils.write_log_exception(e, logger)

    user_pool_id = os.environ.get("COGNITO_USER_POOL_ID")
    try:
        user_info = client.admin_get_user(
            UserPoolId=user_pool_id,
            Username=user_name)
    except ClientError as e:
        if e.response['Error']['Code'] == CommonConst.COGNITO_USER_NOT_FOUND_EXCEPTION:
            return None

        raise common_utils.write_log_exception(e, logger)
    logger.info("End : get cognito users info success")
    return user_info


def update_cognito_user_attributes(trace_id, user_name, attributes_update):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        client = boto3.client("cognito-idp")
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)

    user_pool_id = os.environ.get("COGNITO_USER_POOL_ID")
    try:
        response = client.admin_update_user_attributes(
            UserPoolId=user_pool_id,
            Username=user_name,
            UserAttributes=attributes_update)
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)
    pm_logger.info("End : Update cognito users success")
    return response


def process_admin_create_user_pools(
        trace_id,
        user_name,
        user_attributes,
        temporary_password,
        message_action):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # get client cognito
    try:
        client = boto3.client("cognito-idp")
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)

    user_pool_id = os.environ.get("COGNITO_USER_POOL_ID")
    try:
        user_info = client.admin_create_user(
            UserPoolId=user_pool_id,
            Username=user_name,
            TemporaryPassword=temporary_password,
            UserAttributes=user_attributes,
            MessageAction=message_action)
    except Exception as e:
        raise common_utils.write_log_exception(e, pm_logger)
    pm_logger.info("End : create cognito users success")
    return user_info
# End function Cognito User Pool


# Begin function STS
def create_session_client(trace_id,
                          awsaccount,
                          role_name,
                          external_id,
                          is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())

    role_arn = 'arn:aws:iam::{0}:role/{1}'.format(awsaccount, role_name)
    ssession_name = common_utils.get_uuid4()
    try:
        client = boto3.client('sts')
    except ClientError as e:
        raise common_utils.write_log_exception(e, logger)

    try:
        credentials = client.assume_role(
            RoleArn=role_arn,
            RoleSessionName=ssession_name,
            ExternalId=external_id)
    except ClientError as e:
        raise common_utils.write_log_exception(e, logger)

    accesskey = credentials['Credentials']['AccessKeyId']
    secretkey = credentials['Credentials']['SecretAccessKey']
    session_token = credentials['Credentials']['SessionToken']

    try:
        session = Session(
            aws_access_key_id=accesskey,
            aws_secret_access_key=secretkey,
            aws_session_token=session_token)
    except ClientError as e:
        raise common_utils.write_log_exception(e, logger)

    return session
# End function STS


# Start other functions
def get_regions(trace_id, session=None,
                filter_describe_regions=CommonConst.FILTER_DESCRIBE_REGIONS,
                all_regions=True, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        if session:
            ec2_client = session.client('ec2')
        else:
            ec2_client = boto3.client('ec2')
        if filter_describe_regions is not None and all_regions is not None:
            response = ec2_client.describe_regions(
                Filters=filter_describe_regions, AllRegions=all_regions)
        elif filter_describe_regions is not None:
            response = ec2_client.describe_regions(
                Filters=filter_describe_regions)
        elif all_regions is not None:
            response = ec2_client.describe_regions(
                AllRegions=all_regions)
        else:
            response = ec2_client.describe_regions()
    except ClientError as e:
        raise common_utils.write_log_exception(e, logger)

    return response['Regions']
# End other functions


# Begin function batch
def get_log_stream_name(trace_id, jobId):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        batch = boto3.client(
            service_name='batch',
            region_name='ap-northeast-1',
            endpoint_url='https://batch.ap-northeast-1.amazonaws.com')

        result = batch.describe_jobs(jobs=[jobId])
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)

    try:
        log_stream_name = result['jobs'][0]['container']['logStreamName']
    except KeyError as e:
        raise common_utils.write_log_exception(e, pm_logger)
    return log_stream_name
# End function batch


# Begin function SES
def send_email(trace_id, region_name, sender, bcc, subject, body):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        client = boto3.client(
            service_name='ses', region_name=region_name)
    except ClientError as e:
        pm_logger.error("[%s] SESクライアント作成に失敗しました。", region_name)
        raise common_utils.write_log_exception(e, pm_logger)

    try:
        response = client.send_email(
            Source=sender,
            Destination={
                'BccAddresses': bcc
            },
            Message={
                'Subject': {
                    'Data': subject,
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Text': {
                        'Data': body,
                        'Charset': 'UTF-8'
                    }
                }
            }
        )
        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            raise PmError()
    except ClientError as e:
        raise common_utils.write_log_exception(e, pm_logger)
# End function SES
