import inspect

from premembers.common import common_utils
from premembers.const.const import CommonConst
from botocore.exceptions import ClientError


def get_kms_client(trace_id, awsaccount, session, region_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        kms_client = session.client(
            service_name="kms", region_name=region_name)
    except ClientError as e:
        pm_logger.error("[%s] KMSクライアント作成に失敗しました。", awsaccount)
        raise common_utils.write_log_exception(e, pm_logger)
    return kms_client


def get_list_key_kms(trace_id, awsaccount, kms_client, region_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    list_key_kms = []
    try:
        response = kms_client.list_keys()
        list_key_kms = response['Keys']
        is_truncated = response['Truncated']
        while (is_truncated is True):
            marker = response['NextMarker']
            response = kms_client.list_keys(Marker=marker)
            list_key_kms.extend(response['Keys'])
            is_truncated = response['Truncated']
    except ClientError as e:
        pm_logger.error("[%s/%s] マスターキー一覧情報の取得に失敗しました。", awsaccount,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return list_key_kms


def list_aliases(trace_id, awsaccount, kms_client, region_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    list_aliases = []
    try:
        response = kms_client.list_aliases()
        list_aliases = response['Aliases']
        is_truncated = response['Truncated']
        while (is_truncated is True):
            marker = response['NextMarker']
            response = kms_client.list_aliases(Marker=marker)
            list_aliases.extend(response['Aliases'])
            is_truncated = response['Truncated']
    except ClientError as e:
        pm_logger.error("[%s/%s] キーエイリアス一覧情報の取得に失敗しました。", awsaccount,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return list_aliases


def get_key_rotation_status(trace_id, awsaccount, kms_client, region_name,
                            key_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_rotation_status = []
    try:
        key_rotation_status = kms_client.get_key_rotation_status(KeyId=key_id)
    except ClientError as e:
        if(e.response['Error']['Code'] in CommonConst.KMS_SKIP_EXCEPTION):
            raise common_utils.write_log_warning(e, pm_logger)
        pm_logger.error("[%s/%s] マスターキー（%s）のローテーションステータス情報取得に失敗しました。",
                        awsaccount, region_name, key_id)
        raise common_utils.write_log_exception(e, pm_logger)
    return key_rotation_status
