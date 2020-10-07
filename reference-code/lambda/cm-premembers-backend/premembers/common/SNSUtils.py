import inspect

from premembers.common import common_utils
from botocore.exceptions import ClientError


def get_sns_client(trace_id, session, region_name, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        sns_client = session.client(
            service_name="sns", region_name=region_name)
    except ClientError as e:
        pm_logger.error("[%s/%s] SNSクライアント作成に失敗しました。", aws_account,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return sns_client


def list_subscriptions_by_topic(trace_id, sns_client, aws_account, region_name,
                                topic_arn):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    subscriptions = []

    try:
        response = sns_client.list_subscriptions_by_topic(
            TopicArn=topic_arn)
        if common_utils.check_key("Subscriptions", response):
            subscriptions = response["Subscriptions"]

        next_token = None
        if 'NextToken' in response:
            next_token = response['NextToken']
        while(next_token is not None):
            response = sns_client.list_subscriptions_by_topic(
                TopicArn=topic_arn, NextToken=next_token)
            subscriptions.extend(response['Subscriptions'])
            if 'NextToken' in response:
                next_token = response['NextToken']
            else:
                next_token = None
    except ClientError as e:
        pm_logger.error("[%s/%s] SNS Topicサブスクリプション情報の取得に失敗しました。: TopicArn=%s",
                        aws_account, region_name, topic_arn)
        raise common_utils.write_log_warning(e, pm_logger)

    return subscriptions
