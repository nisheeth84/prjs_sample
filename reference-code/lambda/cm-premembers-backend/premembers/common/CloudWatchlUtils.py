import inspect

from premembers.common import common_utils
from botocore.exceptions import ClientError


def get_cloudwatch_client(trace_id, session, region_name, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        cloudwatch_client = session.client(
            service_name="cloudwatch", region_name=region_name)
    except ClientError as e:
        pm_logger.error("[%s/%s] CloudWatchクライアント作成に失敗しました。", aws_account,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return cloudwatch_client


def describe_alarms(trace_id, aws_account, cloudwatch_client, region_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    metric_alarms = []

    try:
        response = cloudwatch_client.describe_alarms()
        if common_utils.check_key("MetricAlarms", response):
            metric_alarms = response["MetricAlarms"]

        next_token = None
        if 'NextToken' in response:
            next_token = response['NextToken']
        while(next_token is not None):
            response = cloudwatch_client.describe_alarms(NextToken=next_token)
            metric_alarms.extend(response['MetricAlarms'])
            if 'NextToken' in response:
                next_token = response['NextToken']
            else:
                next_token = None
    except ClientError as e:
        pm_logger.error("[%s/%s] CloudWatchAlarm情報の取得に失敗しました。",
                        aws_account, region_name)
        raise common_utils.write_log_warning(e, pm_logger)

    return metric_alarms
