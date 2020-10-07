import inspect

from premembers.common import common_utils, Ec2Utils, date_utils
from premembers.common import FileUtils, aws_common
from premembers.exception.pm_exceptions import PmError
from premembers.repository.const import CheckResult
from premembers.const.const import CommonConst

REGION_IGNORE = CommonConst.REGION_IGNORE


def check_asc_item_07_01(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path):
    cw_logger = common_utils.begin_cw_logger(trace_id, __name__,
                                             inspect.currentframe())
    check_results = []
    try:
        regions = aws_common.get_regions(trace_id, session, is_cw_logger=True)
    except PmError as e:
        cw_logger.error("Regionの情報の取得に失敗しました。")
        raise common_utils.write_log_pm_error(e, cw_logger)

    for region in regions:
        region_name = region["RegionName"]
        if region_name in REGION_IGNORE:
            continue
        ec2_client = Ec2Utils.get_ec2_client(trace_id, session, region_name,
                                             aws_account, is_cw_logger=True)
        try:
            # EBS情報を取得する。
            ebs_volumes = Ec2Utils.describe_volumes(trace_id, aws_account,
                                                    ec2_client, region_name,
                                                    is_cw_logger=True)
        except PmError as e:
            return CheckResult.Error

        # 取得件数が0件の場合、ログを出力し、次のリージョンの処理に進みます。
        if (len(ebs_volumes) == 0):
            cw_logger.info("[%s/%s] EBSボリューム情報の取得件数が0でした。", aws_account,
                           region_name)
            continue
        try:
            # 取得したEBS情報をS3に保存する（EBS情報ファイル）。
            s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                check_history_id, organization_id, project_id, aws_account,
                "ASC/EBS_Volumes_" + region_name + ".json")
            FileUtils.upload_s3(trace_id, ebs_volumes, s3_file_name, True,
                                is_cw_logger=True)
        except PmError as e:
            cw_logger.error("[%s/%s] EBSボリューム情報情報のS3保存に失敗しました。", aws_account,
                            region_name)
            return CheckResult.Error

        # チェックルール
        try:
            for ebs_volume in ebs_volumes:
                if (ebs_volume['Encrypted'] is False):
                    check_result = get_check_asc_item_07_01_result(
                        ebs_volume, region_name)
                    check_results.append(check_result)
        except PmError as e:
            cw_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", aws_account,
                            region_name)
            return CheckResult.Error

    # Export File ASC/CHECK_ ASC_ITEM_07_01.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_acs_item_7_01 = {
            'AWSAccount': aws_account,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_acs_item_7_01, result_json_path,
                            format_json=True, is_cw_logger=True)
    except Exception as e:
        cw_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        return CheckResult.Error

    # チェック結果
    if len(check_results) > 0:
        return CheckResult.CriticalDefect
    return CheckResult.Normal


def get_check_asc_item_07_01_result(ebs_volume, region_name):
    result = {
        'Region': region_name,
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'VolumeId': ebs_volume['VolumeId']
        }
    }
    return result
