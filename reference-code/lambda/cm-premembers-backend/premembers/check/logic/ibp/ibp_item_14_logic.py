import inspect

from premembers.check.logic.ibp import ibp_item_common_logic
from premembers.const.const import CommonConst
from premembers.common import common_utils, CloudFrontUtils
from premembers.repository.const import CheckResult
from premembers.exception.pm_exceptions import PmError
from premembers.common import FileUtils, date_utils


def check_ibp_item_14_02(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path,
                         check_item_code):
    s3_file_name = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
    return ibp_item_common_logic.check_ibp_item_copy_item_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, check_item_code, s3_file_name)


def check_ibp_item_14_03(trace_id, check_item_code, check_history_id,
                         organization_id, project_id, aws_account,
                         result_json_path):
    return ibp_item_common_logic.execute_check_ibp_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path)


def check_ibp_item_14_04(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path,
                         check_item_code):
    s3_file_name = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
    return ibp_item_common_logic.check_ibp_item_copy_item_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, check_item_code, s3_file_name)


def check_ibp_item_14_01(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []

    cloud_front_client = CloudFrontUtils.get_cloud_front_client(
        trace_id, session, aws_account)

    # CloudFrontディストリビューションの一覧を取得する
    try:
        distribution_list = CloudFrontUtils.get_list_distributions(
            trace_id, cloud_front_client, aws_account)
    except PmError as e:
        return CheckResult.Error

    # 取得したディストリビューション一覧情報をS3に保存する（ディストリビューション一覧ファイル）。
    try:
        s3_file_name = CommonConst.PATH_CHECK_RAW.format(
            check_history_id, organization_id, project_id, aws_account,
            "IBP/CloudFront_list_distributions.json")
        FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", distribution_list,
                              s3_file_name)
    except PmError as e:
        pm_logger.error("[%s] ディストリビューション一覧情報のS3保存に失敗しました。", aws_account)
        return CheckResult.Error

    # Check-1. CloudFrontディストリビューションが存在するか
    is_exist_distribution_cloudFront = False
    try:
        if len(distribution_list) > 0:
            is_exist_distribution_cloudFront = True
    except Exception as e:
        pm_logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
        return CheckResult.Error

    if is_exist_distribution_cloudFront is True:
        for distribution in distribution_list:
            distribution_id = distribution['Id']

            # ディストリビューション一覧をもとに、各ディストリビューションの情報を取得します。
            try:
                info_distribution = CloudFrontUtils.get_distribution(
                    trace_id, cloud_front_client, distribution_id, aws_account)
            except PmError as e:
                return CheckResult.Error

            # ディストリビューション情報をS3に保管します。
            try:
                s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                    check_history_id, organization_id, project_id, aws_account,
                    "IBP/CloudFront_" + distribution_id + ".json")
                FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                      info_distribution, s3_file_name)
            except PmError as e:
                pm_logger.error("[%s] ディストリビューション情報のS3保存に失敗しました。(%s)",
                                aws_account, distribution_id)
                return CheckResult.Error

            # Check-2. CloudFrontのログ設定が無効なディストリビューションが存在するか
            try:
                if info_distribution['DistributionConfig']['Logging']['Enabled'] is False:
                    check_results.append(
                        get_check_ibp_item_14_01_result(distribution_id))
            except Exception as e:
                pm_logger.error("[%s] チェック処理中にエラーが発生しました。(%s)", aws_account,
                                distribution_id)
                return CheckResult.Error

    # Export File CHECK_IBP_ITEM_14_01.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_ibp_item_14_01 = {
            'AWSAccount': aws_account,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                              check_ibp_item_14_01, result_json_path)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        return CheckResult.Error

    # チェック結果
    if len(check_results) > 0:
        return CheckResult.CriticalDefect
    return CheckResult.Normal


def get_check_ibp_item_14_01_result(distribution_id):
    result = {
        'Region': 'Global',
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'DistributionId': distribution_id
        }
    }
    return result


def check_ibp_item_14_05(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path,
                         check_item_code):
    s3_file_name = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        "ASC/" + check_item_code + ".json")
    return ibp_item_common_logic.check_ibp_item_copy_item_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, check_item_code, s3_file_name)
