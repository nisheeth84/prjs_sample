import inspect

from premembers.common import common_utils, aws_common
from premembers.common import FileUtils, date_utils
from premembers.common import CloudTrailUtils
from premembers.exception.pm_exceptions import PmError, PmNotificationError
from premembers.repository import pm_assessmentItems
from premembers.const.const import CommonConst
from premembers.repository.const import CheckResult

REGION_IGNORE = CommonConst.REGION_IGNORE


def execute_check_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path, level):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id,
        aws_account, "Assessment_Result.json")

    try:
        # リソース情報取得
        if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                            s3_file_name)) is True:
            try:
                assessment_items = FileUtils.read_json(
                    trace_id, "S3_CHECK_BUCKET", s3_file_name)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)
        else:
            try:
                assessment_items = pm_assessmentItems.query_organization_index_filter_awsaccount(
                    trace_id, organization_id, project_id, aws_account)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)

            # 取得したクエリ結果をS3に保存します。(リソース情報ファイル)
            try:
                FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                      assessment_items, s3_file_name)
            except PmError as e:
                pm_logger.error("[%s] リソース情報ファイのS3保存に失敗しました。",
                                aws_account)

        # チェック処理
        try:
            check_results = []
            assessment_result = None
            for assessment_item in assessment_items:
                if (assessment_item['CheckItemCode'] == check_item_code):
                    assessment_result = {
                        'AssessmentComment': common_utils.get_value('AssessmentComment', assessment_item),
                        'UserID': common_utils.get_value('UserID', assessment_item),
                        'MailAddress': common_utils.get_value('MailAddress', assessment_item),
                        'CreatedAt': assessment_item['CreatedAt']
                    }
                    break

            if (assessment_result is None):
                LEVEL_DIVISION = {
                    "1": CommonConst.LEVEL_CODE_21,  # 重大な不備
                    "2": CommonConst.LEVEL_CODE_11   # 軽微な不備
                }
                result = {
                    'Region': 'Global',
                    'Level': LEVEL_DIVISION[level],
                    'DetectionItem': {
                        'NoEvaluation': True
                    }
                }
                check_results.append(result)
        except Exception as e:
            pm_logger.error("[%s] チェック処理中にエラーが発生しました。", aws_account)
            raise common_utils.write_log_exception(e, pm_logger)

        # チェック結果JSONファイル
        try:
            current_date = date_utils.get_current_date_by_format(
                date_utils.PATTERN_YYYYMMDDHHMMSS)
            check_result_json = {
                'AWSAccount': aws_account,
                'CheckResults': check_results,
                'DateTime': current_date
            }
            if assessment_result is not None:
                check_result_json['AssessmentResult'] = assessment_result
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                  check_result_json, result_json_path)
        except Exception as e:
            pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
            raise common_utils.write_log_exception(e, pm_logger)
    except Exception as e:
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) == 0:
        return CheckResult.Normal
    elif (level == CommonConst.LEVEL_CODE_1):
        return CheckResult.CriticalDefect
    return CheckResult.MinorInadequacies


def get_cloud_trails(trace_id, check_history_id, organization_id, project_id,
                     awsaccount, region_name, session):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, awsaccount,
        "CloudTrail_" + region_name + ".json")
    cloud_trails = []
    # Check Exist File S3 CloudTrail_{region_name}.json
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            cloud_trails = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                               s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        # 対象のAWSアカウントのリージョンごと（GovCloud、北京を除く）にCloudTrail情報を取得する。
        trail_client = CloudTrailUtils.get_trail_client(
            trace_id, session, region_name, awsaccount)
        try:
            cloud_trails = CloudTrailUtils.describe_cloud_trails(
                trace_id, awsaccount, trail_client, region_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
        if (len(cloud_trails) == 0):
            pm_logger.warning("[%s/%s] CloudTrail情報の取得件数が０でした。", awsaccount,
                              region_name)

        # 取得したCloudTrail情報をS3に保存する（リソース情報ファイル）
        try:
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                  cloud_trails, s3_file_name)
        except PmError as e:
            pm_logger.error("[%s/%s] CloudTrailの情報のS3保存に失敗しました。",
                            awsaccount, region_name)
            raise common_utils.write_log_pm_error(e, pm_logger)
    return cloud_trails


def get_trails_status(trace_id, check_history_id, organization_id, project_id,
                      awsaccount, region_name, trail_client, cloud_trail):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, awsaccount,
        "CloudTrail_Status_" + region_name + "_" + cloud_trail["Name"] +
        ".json")

    trail_status = []
    # Check Exist File リソース情報ファイル
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            trail_status = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                               s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        trail_status = CloudTrailUtils.get_trails_status(
            trace_id, awsaccount, trail_client, region_name,
            cloud_trail["TrailARN"])
        if (len(trail_status) == 0):
            pm_logger.info("[%s/%s] CloudTrailのステータス情報の取得件数が０でした。", awsaccount,
                           region_name)

        # Upload File リソース情報ファイル
        try:
            FileUtils.upload_s3(trace_id, trail_status, s3_file_name, True)
        except PmError as e:
            pm_logger.error("[%s/%s] CloudTrailのステータス情報のS3保存に失敗しました。",
                            awsaccount, region_name)
            raise common_utils.write_log_pm_error(e, pm_logger)
    return trail_status


def get_trail_event_selectors(trace_id, check_history_id, organization_id,
                              project_id, awsaccount, region_name,
                              trail_client, cloud_trail):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, awsaccount,
        "CloudTrail_EventSelectors_" + region_name + "_" + cloud_trail["Name"]
        + ".json")

    event_selectors = []
    # Check Exist File リソース情報ファイル
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            event_selectors = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                                  s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        event_selectors = CloudTrailUtils.get_event_selectors(
            trace_id, awsaccount, trail_client, region_name,
            cloud_trail["TrailARN"])

        # Upload File リソース情報ファイル
        try:
            FileUtils.upload_s3(trace_id, event_selectors, s3_file_name, True)
        except PmError as e:
            pm_logger.error("[%s/%s] CloudTrailのイベントセレクタ情報のS3保存に失敗しました。",
                            awsaccount, region_name)
            raise common_utils.write_log_pm_error(e, pm_logger)
    return event_selectors
