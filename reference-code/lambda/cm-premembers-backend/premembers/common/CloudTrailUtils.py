import inspect

from premembers.common import common_utils
from botocore.exceptions import ClientError
from premembers.const.const import CommonConst
from premembers.exception.pm_exceptions import PmNotificationError


def describe_cloud_trails(trace_id, awsaccount, trail_client, region_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    trail_lists = []
    try:
        result = trail_client.describe_trails(includeShadowTrails=False)
    except ClientError as e:
        pm_logger.error("[%s/%s] CloudTrail情報の取得に失敗しました。", awsaccount,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    if common_utils.check_key("trailList", result):
        trail_lists = result["trailList"]
    return trail_lists


def get_trail_client(trace_id, session, region_name, awsaccount):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        trail_client = session.client(
            service_name="cloudtrail", region_name=region_name)
    except ClientError as e:
        pm_logger.error("[%s] CloudTrailクライアント作成に失敗しました。 ", awsaccount)
        raise common_utils.write_log_exception(e, pm_logger)
    return trail_client


def get_trails_status(trace_id, awsaccount, trail_client, region_name,
                      trail_arn):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        status = trail_client.get_trail_status(Name=trail_arn)
    except ClientError as e:
        pm_logger.error("[%s/%s] CloudTrailのステータス情報の取得に失敗しました。", awsaccount,
                        region_name)
        data_body = {'TrailARN': trail_arn}
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            code_error=CommonConst.KEY_CODE_ERROR_GET_TRAIL_STATUS,
            data_body=data_body)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)
    return status


def get_event_selectors(trace_id, awsaccount, trail_client, region_name,
                        trail_arn):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    event_selectors = []
    try:
        result = trail_client.get_event_selectors(TrailName=trail_arn)
    except ClientError as e:
        pm_logger.error("[%s/%s] CloudTrailのイベントセレクタ情報の取得に失敗しました。", awsaccount,
                        region_name)
        data_body = {'TrailARN': trail_arn}
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            code_error=CommonConst.KEY_CODE_ERROR_GET_EVENT_SELECTORS,
            data_body=data_body)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)
    if common_utils.check_key("EventSelectors", result):
        event_selectors = result["EventSelectors"]
    return event_selectors
