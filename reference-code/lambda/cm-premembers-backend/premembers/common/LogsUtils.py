import inspect

from premembers.common import common_utils
from botocore.exceptions import ClientError


def get_logs_client(trace_id, session, region_name, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        logs_client = session.client(service_name="logs", region_name=region_name)
    except ClientError as e:
        pm_logger.error("[%s/%s] CloudWatch Logsクライアント作成に失敗しました。", aws_account,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return logs_client


def describe_metric_filters(trace_id, logs_client, aws_account, region_name,
                            cloud_trail_log_group_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    metric_filters = []

    try:
        response = logs_client.describe_metric_filters(
            logGroupName=cloud_trail_log_group_name)

        if common_utils.check_key("metricFilters", response):
            metric_filters = response["metricFilters"]

        next_token = None
        if 'NextToken' in response:
            next_token = response['NextToken']
        while(next_token is not None):
            response = logs_client.describe_metric_filters(
                logGroupName=cloud_trail_log_group_name, NextToken=next_token)
            metric_filters.extend(response['metricFilters'])
            if 'NextToken' in response:
                next_token = response['NextToken']
            else:
                next_token = None
    except ClientError as e:
        pm_logger.error("[%s/%s] メトリクスフィルタ情報の取得に失敗しました。:LogGroupName=%s",
                        aws_account, region_name, cloud_trail_log_group_name)
        raise common_utils.write_log_warning(e, pm_logger)
    return metric_filters
