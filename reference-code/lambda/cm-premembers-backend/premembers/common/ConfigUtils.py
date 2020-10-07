import inspect

from retry import retry
from premembers.common import common_utils
from botocore.exceptions import ClientError
from premembers.exception.pm_exceptions import PmError


def get_config_client(trace_id, session, region_name, awsaccount):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        config_client = session.client(
            service_name='config', region_name=region_name)
    except ClientError as e:
        pm_logger.error("[%s/%s] Configクライアント作成に失敗しました。", awsaccount,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return config_client


@retry(PmError, tries=3, delay=2, backoff=1)
def describe_configuration_recorder_status(trace_id, awsaccount, config_client,
                                           region_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    configuration_recorders_status = []

    try:
        response = config_client.describe_configuration_recorder_status()
        if common_utils.check_key("ConfigurationRecordersStatus", response):
            configuration_recorders_status = response["ConfigurationRecordersStatus"]
    except ClientError as e:
        pm_logger.error("[%s/%s] Configレコーダーステータス情報の取得に失敗しました。", awsaccount,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return configuration_recorders_status


@retry(PmError, tries=3, delay=2, backoff=1)
def describe_configuration_recorders(trace_id, awsaccount, config_client,
                                     region_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    configuration_recorders = []

    try:
        response = config_client.describe_configuration_recorders()
        if common_utils.check_key("ConfigurationRecorders", response):
            configuration_recorders = response["ConfigurationRecorders"]
    except ClientError as e:
        pm_logger.error("[%s/%s] Configレコーダー情報の取得に失敗しました。", awsaccount,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return configuration_recorders


@retry(PmError, tries=3, delay=2, backoff=1)
def describe_delivery_channels(trace_id, awsaccount, config_client, region_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    delivery_channels = []

    try:
        response = config_client.describe_delivery_channels()
        if common_utils.check_key("DeliveryChannels", response):
            delivery_channels = response["DeliveryChannels"]
    except ClientError as e:
        pm_logger.error("[%s/%s] Configデリバリーチャネル情報の取得に失敗しました。", awsaccount,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return delivery_channels
