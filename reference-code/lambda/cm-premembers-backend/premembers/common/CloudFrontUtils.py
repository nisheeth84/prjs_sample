import inspect

from premembers.common import common_utils
from botocore.exceptions import ClientError


def get_cloud_front_client(trace_id, session, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        cloud_front_client = session.client(service_name="cloudfront")
    except ClientError as e:
        pm_logger.error("[%s] CloudFrontクライアント作成に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, pm_logger)
    return cloud_front_client


def get_list_distributions(trace_id, cloud_front_client, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    distribution_list = []
    try:
        response = cloud_front_client.list_distributions()
        if common_utils.check_key('DistributionList', response):
            if common_utils.check_key('Items', response['DistributionList']):
                distribution_list = response['DistributionList']['Items']
                is_truncated = response['DistributionList']['IsTruncated']
                while (is_truncated is True):
                    next_marker = response['DistributionList']['NextMarker']
                    response = cloud_front_client.list_distributions(
                        Marker=next_marker)
                    distribution_list.extend(response['DistributionList']['Items'])
                    is_truncated = response['DistributionList']['IsTruncated']
    except ClientError as e:
        pm_logger.error("[%s] ディストリビューション一覧情報取得に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, pm_logger)
    return distribution_list


def get_distribution(trace_id, cloud_front_client, distributions_id,
                     aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        response = cloud_front_client.get_distribution(
            Id=distributions_id)
    except ClientError as e:
        pm_logger.error("[%s] ディストリビューション情報取得に失敗しました。(%s)", aws_account,
                        distributions_id)
        raise common_utils.write_log_exception(e, pm_logger)
    return response['Distribution']
