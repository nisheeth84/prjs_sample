import inspect
import ast
import datetime

from premembers.common import FileUtils, date_utils, Ec2Utils
from premembers.common import common_utils, aws_common, S3Utils
from premembers.repository.const import CheckResult, ResourceType
from premembers.const.const import CommonConst
from premembers.exception.pm_exceptions import PmError, PmNotificationError
from premembers.common import CloudTrailUtils, KMSUtils, ConfigUtils
from premembers.check.logic.cis import cis_item_common_logic

REGION_IGNORE = CommonConst.REGION_IGNORE

ACL_URI = [
    "http://acs.amazonaws.com/groups/global/AllUsers",
    "http://acs.amazonaws.com/groups/global/AuthenticatedUsers"
]
S3_SETTING_ACCESS_ALLOW_ALL_USER_IN_PRICIPAL = ["*", {"AWS": "*"}]


def check_cis_item_2_01(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    is_all_region_enable = False
    try:
        regions = aws_common.get_regions(trace_id, session)
    except PmError as e:
        pm_logger.error("Regionの情報の取得に失敗しました。")
        e.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_01",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)
    for region in regions:
        try:
            region_name = region["RegionName"]
            if region_name in REGION_IGNORE:
                continue
            trail_client = CloudTrailUtils.get_trail_client(
                trace_id, session, region_name, awsaccount)
            cloud_trails = CloudTrailUtils.describe_cloud_trails(
                trace_id, awsaccount, trail_client, region_name)
            if (len(cloud_trails) == 0):
                pm_logger.info("[%s/%s] CloudTrail情報の取得件数が０でした。", awsaccount,
                               region_name)
                check_results.append(get_check_trail_result(region_name))
                continue
            try:
                s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                    check_history_id, organization_id, project_id, awsaccount,
                    "CloudTrail_" + region_name + ".json")
                FileUtils.upload_s3(trace_id, cloud_trails, s3_file_name, True)
            except PmError as e:
                pm_logger.error("[%s/%s] CloudTrailの情報のS3保存に失敗しました。",
                                awsaccount, region_name)
                raise common_utils.write_log_pm_error(e, pm_logger)

            for cloud_trail in cloud_trails:
                trail_status = CloudTrailUtils.get_trails_status(
                    trace_id, awsaccount, trail_client, region_name,
                    cloud_trail["TrailARN"])
                if (len(trail_status) == 0):
                    pm_logger.info("[%s/%s] CloudTrailのステータス情報の取得件数が０でした。",
                                   awsaccount, region_name)
                    continue
                try:
                    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                        check_history_id, organization_id, project_id,
                        awsaccount, "CloudTrail_Status_" + region_name + "_" +
                        cloud_trail["Name"] + ".json")
                    FileUtils.upload_s3(trace_id, trail_status, s3_file_name,
                                        True)
                except PmError as e:
                    pm_logger.error("[%s/%s] CloudTrailのステータス情報のS3保存に失敗しました。",
                                    awsaccount, region_name)
                    raise common_utils.write_log_pm_error(e, pm_logger)

                # CloudTrailのイベントセレクタ情報を取得する
                event_selectors = CloudTrailUtils.get_event_selectors(
                    trace_id, awsaccount, trail_client, region_name,
                    cloud_trail["TrailARN"])

                # S3にCloudTrailのイベントセレクタ情報を保存する
                try:
                    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                        check_history_id, organization_id, project_id,
                        awsaccount, "CloudTrail_EventSelectors_" + region_name
                        + "_" + cloud_trail["Name"] + ".json")
                    FileUtils.upload_s3(trace_id, event_selectors,
                                        s3_file_name, True)
                except PmError as e:
                    pm_logger.error(
                        "[%s/%s] CloudTrailのイベントセレクタ情報のS3保存に失敗しました。",
                        awsaccount, region_name)
                    raise common_utils.write_log_pm_error(e, pm_logger)

                # リージョンに対し有効なCloudTrailが存在するか
                try:
                    if (is_all_region_enable is True):
                        continue

                    # 全リージョンに対し有効なCloudTrailが存在するか
                    # ロギングが有効か
                    if (cloud_trail['IsMultiRegionTrail'] is True
                            and trail_status['IsLogging'] is True):

                        # すべての管理操作の書き込みが有効か
                        for event_selector in event_selectors:
                            if (event_selector['IncludeManagementEvents'] is True
                                    and event_selector['ReadWriteType'] == CommonConst.EVENT_SELECTOR_READ_WRITE_TYPE_ALL):
                                is_all_region_enable = True
                                break
                except Exception as e:
                    pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                    region_name)
                    raise common_utils.write_log_exception(e, pm_logger)
            if (is_all_region_enable is False):
                check_result = get_check_trail_result(region_name)
                check_results.append(check_result)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            if not pm_error.pm_notification_error:
                pm_error.pm_notification_error = PmNotificationError(
                    check_item_code='CHECK_CIS12_ITEM_2_01',
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            else:
                pm_error.pm_notification_error.check_item_code = 'CHECK_CIS12_ITEM_2_01'
                pm_error.pm_notification_error.aws_account = awsaccount
                pm_error.pm_notification_error.region = region_name
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    result_cloud_trails = CheckResult.CriticalDefect
    if is_all_region_enable is True or len(check_results) == 0:
        check_results = []
        result_cloud_trails = CheckResult.Normal

    # Export File CHECK_CIS12_ITEM_2_01.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_trail = {
            'AWSAccount': awsaccount,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_trail, result_json_path, True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_01",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)
    return result_cloud_trails


def get_check_trail_result(region_name):
    result = {'Region': region_name, 'Level': CommonConst.LEVEL_CODE_21}
    return result


def check_cis_item_2_02(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    try:
        regions = aws_common.get_regions(trace_id, session)
    except PmError as e:
        pm_logger.error("Regionの情報の取得に失敗しました。")
        e.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_02",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)
    for region in regions:
        try:
            region_name = region["RegionName"]
            if region_name in REGION_IGNORE:
                continue
            try:
                cloud_trails = cis_item_common_logic.get_cloud_trails(
                    trace_id, check_history_id, organization_id, project_id,
                    awsaccount, region_name, session)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)

            # CloudTrail情報の取得件数が０でした。
            if (len(cloud_trails) == 0):
                continue

            for cloud_trail in cloud_trails:
                try:
                    # check excluded resources
                    if common_utils.check_excluded_resources(
                            check_item_code, region_name,
                            ResourceType.CloudTrailName, cloud_trail['Name'],
                            excluded_resources):
                        continue

                    # CloudTrail情報を参照し、検証が有効化されていないCloudTrailログファイルが存在するか確認する。
                    if cloud_trail['LogFileValidationEnabled'] is False:
                        check_results.append(
                            get_check_cis_item_2_02_result(
                                region_name, cloud_trail["Name"]))
                except Exception as e:
                    pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                    region_name)
                    raise common_utils.write_log_exception(e, pm_logger)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            if not pm_error.pm_notification_error:
                pm_error.pm_notification_error = PmNotificationError(
                    check_item_code='CHECK_CIS12_ITEM_2_02',
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            else:
                pm_error.pm_notification_error.check_item_code = 'CHECK_CIS12_ITEM_2_02'
                pm_error.pm_notification_error.aws_account = awsaccount
                pm_error.pm_notification_error.region = region_name
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # Export File CHECK_CIS12_ITEM_2_02.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_cis_item_2_02 = {
            'AWSAccount': awsaccount,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_cis_item_2_02, result_json_path,
                            True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_02",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.MinorInadequacies


def get_check_cis_item_2_02_result(region_name, cloud_trail_name):
    result = {
        'Region': region_name,
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'CloudTrailName': cloud_trail_name
        }
    }
    return result


def check_cis_item_2_03(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    is_authorized = True
    try:
        regions = aws_common.get_regions(trace_id, session)
    except PmError as e:
        pm_logger.error("Regionの情報の取得に失敗しました。")
        e.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_03",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)
    for region in regions:
        try:
            region_name = region["RegionName"]
            if region_name in REGION_IGNORE:
                continue

            # 取得したCloudTrail情報をS3に保存する（リソース情報ファイル）。
            try:
                cloud_trails = cis_item_common_logic.get_cloud_trails(
                    trace_id, check_history_id, organization_id, project_id,
                    awsaccount, region_name, session)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)
            # CloudTrail情報の取得件数が０でした。
            if (len(cloud_trails) == 0):
                continue

            s3_client = S3Utils.get_s3_client(trace_id, session, awsaccount)

            # 取得したS3バケットのアクセスコントロールリスト情報をS3に保存する（リソース情報ファイル）。
            for cloud_trail in cloud_trails:
                # check excluded resources
                try:
                    s3_bucket_name = cloud_trail['S3BucketName']
                except Exception as e:
                    pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                    region_name)
                    raise common_utils.write_log_exception(e, pm_logger)

                if common_utils.check_excluded_resources(
                        check_item_code, region_name,
                        ResourceType.S3BucketName, s3_bucket_name,
                        excluded_resources):
                    continue

                try:
                    bucket_acl = S3Utils.get_bucket_acl(
                        trace_id, s3_client, s3_bucket_name, awsaccount,
                        region_name)
                except PmError as e:
                    if e.cause_error.response['Error'][
                            'Code'] in CommonConst.S3_SKIP_EXCEPTION:
                        error_operation = e.cause_error.operation_name,
                        error_code = e.cause_error.response['Error']['Code'],
                        error_message = e.cause_error.response['Error']['Message']
                        check_results.append(
                            get_error_authorized_result(
                                region_name, s3_bucket_name, error_operation,
                                error_code, error_message))
                        is_authorized = False
                        continue
                    else:
                        data_body = {'S3BucketName': s3_bucket_name}
                        e.pm_notification_error = PmNotificationError(
                            code_error=CommonConst.
                            KEY_CODE_ERROR_GET_BUCKET_ACL,
                            data_body=data_body)
                        raise common_utils.write_log_pm_error(e, pm_logger)
                try:
                    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                        check_history_id, organization_id, project_id,
                        awsaccount, "CloudTrail_S3Acl_" + region_name + "_" +
                        s3_bucket_name + ".json")
                    FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                          bucket_acl, s3_file_name)
                except PmError as e:
                    pm_logger.error("[%s/%s] S3バケットACL情報のS3保存に失敗しました。（%s）",
                                    awsaccount, region_name, s3_bucket_name)
                    raise common_utils.write_log_pm_error(e, pm_logger)

                # 取得したCloudTrail情報をもとに、CloudTrailログが格納されているS3バケットのバケットポリシーを取得する。
                try:
                    bucket_policy = S3Utils.get_bucket_policy(
                        trace_id, s3_client, s3_bucket_name, awsaccount,
                        region_name)
                except PmError as e:
                    if e.cause_error.response['Error'][
                            'Code'] in CommonConst.S3_SKIP_EXCEPTION:
                        error_operation = e.cause_error.operation_name,
                        error_code = e.cause_error.response['Error']['Code'],
                        error_message = e.cause_error.response['Error']['Message']
                        check_results.append(
                            get_error_authorized_result(
                                region_name, s3_bucket_name, error_operation,
                                error_code, error_message))
                        is_authorized = False
                        continue
                    else:
                        data_body = {'S3BucketName': s3_bucket_name}
                        e.pm_notification_error = PmNotificationError(
                            code_error=CommonConst.
                            KEY_CODE_ERROR_GET_BUCKET_POLICY,
                            data_body=data_body)
                        raise common_utils.write_log_pm_error(e, pm_logger)
                if bucket_policy is None:
                    continue
                try:
                    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                        check_history_id, organization_id, project_id,
                        awsaccount, "CloudTrail_S3Bucketpolicy_" + region_name
                        + "_" + s3_bucket_name + ".json")
                    FileUtils.upload_s3(trace_id, bucket_policy, s3_file_name,
                                        True)
                except PmError as e:
                    pm_logger.error("[%s/%s] S3バケットポリシー情報のS3保存に失敗しました。（%s）",
                                    awsaccount, region_name, s3_bucket_name)
                    raise common_utils.write_log_pm_error(e, pm_logger)

                # チェック処理
                try:
                    bucket_acl_abnormity = False
                    bucket_policy_abnormity = False

                    # Check-1. ACLによりAllUsersに操作権限が与えられたS3バケットが存在するか
                    # Check-2. ACLによりAuthenticatedUsersに操作権限が与えられたS3バケットが存在するか
                    for grant in bucket_acl["Grants"]:
                        if (common_utils.check_key("URI", grant['Grantee'])):
                            if grant['Grantee']["URI"] in ACL_URI:
                                bucket_acl_abnormity = True
                                break

                    # Check-3. バケットポリシーのプリンシパルにて全てのユーザに操作権限が与えられたS3バケットが存在するか
                    bucket_policy = ast.literal_eval(bucket_policy['Policy'])
                    for statement in bucket_policy["Statement"]:
                        if (statement["Effect"] == CommonConst.ALLOW
                                and statement["Principal"] in S3_SETTING_ACCESS_ALLOW_ALL_USER_IN_PRICIPAL):
                            bucket_policy_abnormity = True
                            break
                    if (bucket_acl_abnormity is True
                            or bucket_policy_abnormity is True):
                        check_results.append(
                            get_check_accessible_result(region_name,
                                                        bucket_acl_abnormity,
                                                        bucket_policy_abnormity,
                                                        s3_bucket_name))
                except Exception as e:
                    pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。（%s）", awsaccount,
                                    region_name, s3_bucket_name)
                    raise common_utils.write_log_exception(e, pm_logger)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            if not pm_error.pm_notification_error:
                pm_error.pm_notification_error = PmNotificationError(
                    check_item_code='CHECK_CIS12_ITEM_2_03',
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            else:
                pm_error.pm_notification_error.check_item_code = 'CHECK_CIS12_ITEM_2_03'
                pm_error.pm_notification_error.aws_account = awsaccount
                pm_error.pm_notification_error.region = region_name
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # Export File CHECK_CIS12_ITEM_2_03.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_bucket = {
            'AWSAccount': awsaccount,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_bucket, result_json_path, True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_03",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if is_authorized is False:
        return CheckResult.Error
    if len(check_results) > 0:
        return CheckResult.CriticalDefect
    return CheckResult.Normal


def get_error_authorized_result(region_name, s3_bucket_name, error_operation,
                                error_code, error_message):
    result = {
        'Region': region_name,
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'BucketName': s3_bucket_name,
            'ErrorOperation': CommonConst.BLANK.join(error_operation),
            'ErrorCode': CommonConst.BLANK.join(error_code),
            'ErrorMessage': CommonConst.BLANK.join(error_message)
        }
    }
    return result


def get_check_accessible_result(region_name, check_acl_abnormity,
                                check_policy_abnormity, s3_bucket_name):
    detection_item = {'BucketName': s3_bucket_name}
    if check_acl_abnormity is True:
        detection_item["BucketAclAbnormity"] = True
    if check_policy_abnormity is True:
        detection_item["BucketPolicyAbnormity"] = True
    result = {
        'Region': region_name,
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': detection_item
    }
    return result


def check_cis_item_2_04(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    current_date = date_utils.toDate(
        date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDTHHMMSSFZ))
    try:
        regions = aws_common.get_regions(trace_id, session)
    except PmError as e:
        pm_logger.error("Regionの情報の取得に失敗しました。")
        e.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_04",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)
    for region in regions:
        try:
            region_name = region["RegionName"]
            if region_name in REGION_IGNORE:
                continue
            try:
                cloud_trails = cis_item_common_logic.get_cloud_trails(
                    trace_id, check_history_id, organization_id, project_id,
                    awsaccount, region_name, session)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)
            # CloudTrail情報の取得件数が０でした。
            if (len(cloud_trails) == 0):
                continue
            trail_client = CloudTrailUtils.get_trail_client(
                trace_id, session, region_name, awsaccount)
            for cloud_trail in cloud_trails:
                try:
                    trail_name = cloud_trail["Name"]
                except Exception as e:
                    pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                    region_name)
                    raise common_utils.write_log_exception(e, pm_logger)

                # check excluded resources
                if common_utils.check_excluded_resources(
                        check_item_code, region_name,
                        ResourceType.CloudTrailName, trail_name,
                        excluded_resources):
                    continue

                s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                    check_history_id, organization_id, project_id, awsaccount,
                    "CloudTrail_Status_" + region_name + "_" + trail_name +
                    ".json")

                # Check Exist CloudTrail_Status_{region_name}_{trail_name}.json
                if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                                    s3_file_name)) is True:
                    try:
                        trail_status = FileUtils.read_json(
                            trace_id, "S3_CHECK_BUCKET", s3_file_name)
                    except PmError as e:
                        raise common_utils.write_log_pm_error(e, pm_logger)
                else:
                    # 取得したCloudTrail情報をもとに、CloudTrailステータスを取得する。
                    try:
                        trail_status = CloudTrailUtils.get_trails_status(
                            trace_id, awsaccount, trail_client, region_name,
                            cloud_trail["TrailARN"])
                    except PmError as e:
                        raise common_utils.write_log_pm_error(e, pm_logger)

                    if (len(trail_status) == 0):
                        pm_logger.info("[%s/%s] CloudTrailのステータス情報の取得件数が０でした。",
                                       awsaccount, region_name)
                        continue

                    # 取得したCloudTrailステータスをS3に保存する（リソース情報ファイル）。
                    try:
                        FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                              trail_status, s3_file_name)
                    except PmError as e:
                        pm_logger.error("[%s/%s] CloudTrailのステータス情報のS3保存に失敗しました。",
                                        awsaccount, region_name)
                        raise common_utils.write_log_pm_error(e, pm_logger)

                # チェックルール
                try:
                    # Check-1. CloudWatch Logsへの出力設定がされていないCloudTrailが存在するか
                    if common_utils.check_key(
                            'CloudWatchLogsLogGroupArn', cloud_trail
                    ) is False or not cloud_trail['CloudWatchLogsLogGroupArn']:
                        check_results.append(
                            get_check_integrated_result(
                                region_name, True, False, trail_name))
                        continue

                    # Check-2.最後にCloudWatchLogsへログが出力されてから1日以上経過しているCloudTrailが存在するか
                    if (common_utils.check_key(
                            'LatestCloudWatchLogsDeliveryTime', trail_status)
                        ) is False or difference_days_cloudwatch(
                            trail_status['LatestCloudWatchLogsDeliveryTime'],
                            current_date) > 1:
                        check_results.append(
                            get_check_integrated_result(
                                region_name, False, True, trail_name))
                except PmError as e:
                    pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                    region_name)
                    raise common_utils.write_log_pm_error(e, pm_logger)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            if not pm_error.pm_notification_error:
                pm_error.pm_notification_error = PmNotificationError(
                    check_item_code='CHECK_CIS12_ITEM_2_04',
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            else:
                pm_error.pm_notification_error.check_item_code = 'CHECK_CIS12_ITEM_2_04'
                pm_error.pm_notification_error.aws_account = awsaccount
                pm_error.pm_notification_error.region = region_name
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # Export File CHECK_CIS12_ITEM_2_04.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_trail = {
            'AWSAccount': awsaccount,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_trail, result_json_path, True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_04",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    if len(check_results) == 0:
        return CheckResult.Normal
    return CheckResult.CriticalDefect


def difference_days_cloudwatch(date_check, current_date):
    if isinstance(date_check, datetime.datetime):
        date_check = date_check.isoformat()
    return date_utils.difference_days(
        date_utils.toDate(date_check), current_date)


def get_check_integrated_result(region_name, trail_config_abnormity,
                                trail_delivery_time_abnormity, trail_name):
    detection_item = {'CloudTrailName': trail_name}
    if trail_config_abnormity is True:
        detection_item['CloudTrailConfigAbnormity'] = True
    if trail_delivery_time_abnormity is True:
        detection_item['CloudTrailDeliveryTimeAbnormity'] = True
    result = {
        'Region': region_name,
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': detection_item
    }
    return result


def check_cis_item_2_05(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    check2_2 = False

    # Get all region
    try:
        regions = aws_common.get_regions(trace_id, session)
    except PmError as e:
        pm_logger.error("Regionの情報の取得に失敗しました。")
        e.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_05",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)

    for region in regions:
        try:
            region_name = region["RegionName"]
            if region_name in REGION_IGNORE:
                continue
            config_client = ConfigUtils.get_config_client(
                trace_id, session, region_name, awsaccount)
            s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                check_history_id, organization_id, project_id, awsaccount,
                "Config_RecordersInfo_" + region_name + ".json")
            try:
                configuration_recorders = get_configuration_recorders(
                    trace_id, awsaccount, config_client, pm_logger, region_name,
                    s3_file_name)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)

            if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                                s3_file_name)) is False:
                # 取得したレコーダー情報をS3に保存する（リソース情報ファイル）。
                try:
                    FileUtils.upload_s3(trace_id, configuration_recorders,
                                        s3_file_name, True)
                except PmError as e:
                    pm_logger.error("[%s/%s] Configレコーダー情報のS3保存に失敗しました。",
                                    awsaccount, region_name)
                    raise common_utils.write_log_pm_error(e, pm_logger)

            # Check-2.2 グローバルリソースが監視対象となっているか。
            try:
                if check2_2 is False and len(configuration_recorders) > 0:
                    if common_utils.check_key("recordingGroup",
                                            configuration_recorders[0]):
                        if common_utils.check_key(
                                "includeGlobalResourceTypes",
                                configuration_recorders[0]['recordingGroup']):
                            check2_2 = configuration_recorders[0][
                                'recordingGroup']['includeGlobalResourceTypes']
            except PmError as e:
                pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                region_name)
                raise common_utils.write_log_pm_error(e, pm_logger)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            if not pm_error.pm_notification_error:
                pm_error.pm_notification_error = PmNotificationError(
                    check_item_code='CHECK_CIS12_ITEM_2_05',
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            else:
                pm_error.pm_notification_error.check_item_code = 'CHECK_CIS12_ITEM_2_05'
                pm_error.pm_notification_error.aws_account = awsaccount
                pm_error.pm_notification_error.region = region_name
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    for region in regions:
        try:
            region_name = region["RegionName"]
            if region_name in REGION_IGNORE:
                continue
            config_client = ConfigUtils.get_config_client(
                trace_id, session, region_name, awsaccount)
            # 対象のAWSアカウントのリージョンごと（GovCloud、北京を除く）にレコーダーステータスを取得する。
            try:
                configuration_recorders_status = ConfigUtils.describe_configuration_recorder_status(
                    trace_id, awsaccount, config_client, region_name)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)

            # 取得したレコーダーステータスをS3に保存する（リソース情報ファイル）。
            try:
                s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                    check_history_id, organization_id, project_id, awsaccount,
                    "Config_RecorderStatus_" + region_name + ".json")
                FileUtils.upload_s3(trace_id, configuration_recorders_status,
                                    s3_file_name, True)
            except PmError as e:
                pm_logger.error("[%s/%s] Configレコーダーステータス情報のS3保存に失敗しました。",
                                awsaccount, region_name)
                raise common_utils.write_log_pm_error(e, pm_logger)

            s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                check_history_id, organization_id, project_id, awsaccount,
                "Config_RecordersInfo_" + region_name + ".json")
            try:
                configuration_recorders = get_configuration_recorders(
                    trace_id, awsaccount, config_client, pm_logger,
                    region_name, s3_file_name)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)

            # 対象のAWSアカウントのリージョンごと（GovCloud、北京を除く）にデリバリーチャネル情報を取得する。
            try:
                delivery_channels = ConfigUtils.describe_delivery_channels(
                    trace_id, awsaccount, config_client, region_name)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)
            # 取得したデリバリーチャネル情報をS3に保存する（リソース情報ファイル）。
            try:
                s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                    check_history_id, organization_id, project_id, awsaccount,
                    "Config_DeliveryChannelsInfo_" + region_name + ".json")
                FileUtils.upload_s3(trace_id, delivery_channels, s3_file_name,
                                    True)
            except PmError as e:
                pm_logger.error("[%s/%s] Configデリバリーチャネル情報のS3保存に失敗しました。",
                                awsaccount, region_name)
                raise common_utils.write_log_pm_error(e, pm_logger)

            # チェック処理
            try:
                check1 = False
                check2_1 = False
                check3 = False
                check4 = False
                # Check-1 有効になっていないレコーダーは存在するか。
                if len(configuration_recorders_status) > 0:
                    if common_utils.check_key(
                            "recording", configuration_recorders_status[0]):
                        if configuration_recorders_status[0][
                                'recording'] is True:
                            if common_utils.check_key(
                                    "lastStatus",
                                    configuration_recorders_status[0]):
                                if (configuration_recorders_status[0]
                                    ['lastStatus'] == CommonConst.SUCCESS):
                                    check1 = True
                # Check-2.1 リージョンリソースが監視対象となっているか。
                if len(configuration_recorders) > 0:
                    if common_utils.check_key("recordingGroup",
                                              configuration_recorders[0]):
                        if common_utils.check_key(
                                "allSupported",
                                configuration_recorders[0]['recordingGroup']):
                            check2_1 = configuration_recorders[0][
                                'recordingGroup']['allSupported']

                # Check-3 AWS ConfigのS3バケットは存在するか。
                if len(delivery_channels) > 0:
                    check3 = common_utils.check_key("s3BucketName",
                                                    delivery_channels[0])

                # Check-4 AWS ConfigのSNSトピックは存在するか。
                if len(delivery_channels) > 0:
                    check4 = common_utils.check_key("snsTopicARN",
                                                    delivery_channels[0])

                if (check2_2 is False or check1 is False or check2_1 is False
                        or check3 is False or check4 is False):
                    check_results.append(
                        get_check_cis_item_2_05_result(check1, check2_1,
                                                       check2_2, check3,
                                                       check4, region_name))
            except PmError as e:
                pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                region_name)
                raise common_utils.write_log_pm_error(e, pm_logger)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            if not pm_error.pm_notification_error:
                pm_error.pm_notification_error = PmNotificationError(
                    check_item_code='CHECK_CIS12_ITEM_2_05',
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            else:
                pm_error.pm_notification_error.check_item_code = 'CHECK_CIS12_ITEM_2_05'
                pm_error.pm_notification_error.aws_account = awsaccount
                pm_error.pm_notification_error.region = region_name
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # Export File CHECK_CIS12_ITEM_2_05.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_cis_item_2_05 = {
            'AWSAccount': awsaccount,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_cis_item_2_05, result_json_path,
                            True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_05",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) > 0:
        return CheckResult.CriticalDefect
    return CheckResult.Normal


def get_check_cis_item_2_05_result(check1, check2_1, check2_2, check3, check4,
                                   region_name):
    detection_item = {}
    if check1 is False:
        detection_item['RecordersStatusAbnormity'] = True
    if check2_1 is False:
        detection_item['RegionResourceAbnormity'] = True
    if check2_2 is False:
        detection_item['GlobalResourceAbnormity'] = True
    if check3 is False:
        detection_item['S3Abnormity'] = True
    if check4 is False:
        detection_item['SnsAbnormity'] = True
    result = {
        'Region': region_name,
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': detection_item
    }
    return result


def get_configuration_recorders(trace_id, awsaccount, config_client, pm_logger,
                                region_name, s3_file_name):
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            configuration_recorders = FileUtils.read_json(
                trace_id, "S3_CHECK_BUCKET", s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        # 対象のAWSアカウントのリージョンごと（GovCloud、北京を除く）にレコーダー情報を取得する。
        try:
            configuration_recorders = ConfigUtils.describe_configuration_recorders(
                trace_id, awsaccount, config_client, region_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)

    return configuration_recorders


def check_cis_item_2_06(trace_id, check_history_id, organization_id,
                        project_id, aws_account, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    is_authorized = True
    try:
        regions = aws_common.get_regions(trace_id, session)
    except PmError as e:
        pm_logger.error("Regionの情報の取得に失敗しました。")
        e.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_06",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)
    for region in regions:
        try:
            region_name = region["RegionName"]
            if region_name in REGION_IGNORE:
                continue
            try:
                cloud_trails = cis_item_common_logic.get_cloud_trails(
                    trace_id, check_history_id, organization_id, project_id,
                    aws_account, region_name, session)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)
            # CloudTrail情報の取得件数が０でした。
            if (len(cloud_trails) == 0):
                continue
            s3_client = S3Utils.get_s3_client(trace_id, session, aws_account)
            for cloud_trail in cloud_trails:
                try:
                    resource_name = cloud_trail['S3BucketName']
                except Exception as e:
                    pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", aws_account,
                                    region_name)
                    raise common_utils.write_log_pm_error(e, pm_logger)

                if common_utils.check_excluded_resources(
                        check_item_code, region_name,
                        ResourceType.S3BucketName, resource_name,
                        excluded_resources):
                    continue

                try:
                    bucket_logging = S3Utils.get_bucket_logging(
                        trace_id, aws_account, s3_client,
                        resource_name, region_name)
                except PmError as e:
                    if e.cause_error.response['Error'][
                            'Code'] in CommonConst.S3_SKIP_EXCEPTION:
                        error_operation = e.cause_error.operation_name,
                        error_code = e.cause_error.response['Error']['Code'],
                        error_message = e.cause_error.response['Error']['Message']
                        check_results.append(
                            get_error_authorized_result(
                                region_name, cloud_trail["S3BucketName"],
                                error_operation, error_code, error_message))
                        is_authorized = False
                        continue
                    else:
                        data_body = {'S3BucketName': resource_name}
                        e.pm_notification_error = PmNotificationError(
                            code_error=CommonConst.KEY_CODE_ERROR_GET_BUCKET_LOGGING,
                            data_body=data_body)
                        raise common_utils.write_log_pm_error(e, pm_logger)

                s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                    check_history_id, organization_id, project_id, aws_account,
                    "CloudTrail_S3BucketLogging_" + region_name + "_" +
                    cloud_trail["S3BucketName"] + ".json")
                try:
                    FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                          bucket_logging, s3_file_name)
                except PmError as e:
                    pm_logger.error("[%s/%s] S3バケットロギング情報のS3保存に失敗しました。 %s",
                                    aws_account, region_name,
                                    resource_name)

                # チェック処理
                try:
                    if len(bucket_logging) == 0:
                        result = {
                            'Region': region_name,
                            'Level': CommonConst.LEVEL_CODE_21,
                            'DetectionItem': {
                                'BucketName': resource_name
                            }
                        }
                        check_results.append(result)
                except PmError as e:
                    pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。 %s",
                                    aws_account, region_name, resource_name)
                    raise common_utils.write_log_pm_error(e, pm_logger)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            if not pm_error.pm_notification_error:
                pm_error.pm_notification_error = PmNotificationError(
                    check_item_code='CHECK_CIS12_ITEM_2_06',
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            else:
                pm_error.pm_notification_error.check_item_code = 'CHECK_CIS12_ITEM_2_06'
                pm_error.pm_notification_error.aws_account = aws_account
                pm_error.pm_notification_error.region = region_name
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # Export File CHECK_CIS12_ITEM_2_06.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_trail = {
            'AWSAccount': aws_account,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_trail, result_json_path, True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_06",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if is_authorized is False:
        return CheckResult.Error
    if len(check_results) > 0:
        return CheckResult.CriticalDefect
    return CheckResult.Normal


def check_cis_item_2_07(trace_id, check_history_id, organization_id,
                        project_id, aws_account, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    try:
        regions = aws_common.get_regions(trace_id, session)
    except PmError as e:
        pm_logger.error("Regionの情報の取得に失敗しました。")
        e.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_07",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)
    for region in regions:
        try:
            region_name = region["RegionName"]
            if region_name in REGION_IGNORE:
                continue
            try:
                cloud_trails = cis_item_common_logic.get_cloud_trails(
                    trace_id, check_history_id, organization_id, project_id,
                    aws_account, region_name, session)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)

            # CloudTrail情報の取得件数が０でした。
            if (len(cloud_trails) == 0):
                continue

            # Check-1. SSE-KMSにより暗号化されていないCloudTrailログは存在するか。
            try:
                for cloud_trail in cloud_trails:
                    # check excluded resources
                    if common_utils.check_excluded_resources(
                            check_item_code, region_name,
                            ResourceType.CloudTrailName, cloud_trail['Name'],
                            excluded_resources):
                        continue

                    if common_utils.check_key('KmsKeyId', cloud_trail) is False:
                        check_result = {
                            'Region': region_name,
                            'Level': CommonConst.LEVEL_CODE_11,
                            'DetectionItem': {
                                'CloudTrailName': cloud_trail['Name']
                            }
                        }
                        check_results.append(check_result)
            except Exception as e:
                pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", aws_account,
                                region_name)
                raise common_utils.write_log_exception(e, pm_logger)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            if not pm_error.pm_notification_error:
                pm_error.pm_notification_error = PmNotificationError(
                    check_item_code='CHECK_CIS12_ITEM_2_07',
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            else:
                pm_error.pm_notification_error.check_item_code = 'CHECK_CIS12_ITEM_2_07'
                pm_error.pm_notification_error.aws_account = aws_account
                pm_error.pm_notification_error.region = region_name
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # Export File CHECK_CIS12_ITEM_2_07.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_cis_item_2_07 = {
            'AWSAccount': aws_account,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_cis_item_2_07, result_json_path,
                            True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_07",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) > 0:
        return CheckResult.MinorInadequacies
    return CheckResult.Normal


def check_cis_item_2_08(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []

    try:
        regions = aws_common.get_regions(trace_id, session)
    except PmError as e:
        pm_logger.error("Regionの情報の取得に失敗しました。")
        e.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_08",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)
    for region in regions:
        try:
            region_name = region["RegionName"]
            if region_name in REGION_IGNORE:
                continue
            try:
                kms_client = KMSUtils.get_kms_client(trace_id, awsaccount,
                                                     session, region_name)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)
            try:
                list_key_kms = KMSUtils.get_list_key_kms(
                    trace_id, awsaccount, kms_client, region_name)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)
            if (len(list_key_kms) == 0):
                pm_logger.info("[%s/%s] マスターキー一覧情報の取得件数が0でした。", awsaccount,
                               region_name)
                continue
            try:
                s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                    check_history_id, organization_id, project_id, awsaccount,
                    "KMS_ListKeys_" + region_name + ".json")
                FileUtils.upload_s3(trace_id, list_key_kms, s3_file_name, True)
            except PmError as e:
                pm_logger.error("[%s/%s] マスターキー一覧情報のS3保存に失敗しました。", awsaccount,
                                region_name)
                raise common_utils.write_log_pm_error(e, pm_logger)

            # 対象のAWSアカウントのリージョンごと（GovCloud、北京を除く）にKMSのキーエイリアス情報を取得する。
            try:
                list_aliases = KMSUtils.list_aliases(trace_id, awsaccount,
                                                     kms_client, region_name)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)

            # 取得したキーエイリアス情報をS3に保存する（リソース情報ファイル）。
            try:
                s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                    check_history_id, organization_id, project_id, awsaccount,
                    "KMS_ListAliases_" + region_name + ".json")
                FileUtils.upload_s3(trace_id, list_aliases, s3_file_name, True)
            except PmError as e:
                pm_logger.error("[%s/%s] キーエイリアス一覧情報のS3保存に失敗しました。", awsaccount,
                                region_name)
                raise common_utils.write_log_pm_error(e, pm_logger)

            list_key_id_ignore = []
            for aliases in list_aliases:
                if (aliases['AliasName'] == CommonConst.KMS_SKIP_ALIAS):
                    list_key_id_ignore.append(aliases['TargetKeyId'])

            for key_kms in list_key_kms:
                # check excluded resources
                try:
                    key_id = key_kms['KeyId']
                except Exception as e:
                    pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                    region_name)
                    raise common_utils.write_log_exception(e, pm_logger)

                if common_utils.check_excluded_resources(
                        check_item_code, region_name, ResourceType.KeyId,
                        key_id, excluded_resources):
                    continue

                # マスターキーと同じ、キーエイリアス一覧情報の[TargetKeyId]を探し、キーエイリアス一覧情報の[AliasName]を取得する。
                if (key_id in list_key_id_ignore):
                    continue

                try:
                    key_rotation_status = KMSUtils.get_key_rotation_status(
                        trace_id, awsaccount, kms_client, region_name, key_id)
                except PmError as e:
                    if (e.cause_error.response['Error']['Code'] in
                            CommonConst.KMS_SKIP_EXCEPTION):
                        continue
                    raise common_utils.write_log_pm_error(e, pm_logger)
                try:
                    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                        check_history_id, organization_id, project_id,
                        awsaccount, "KMS_RotationStatus_" + region_name + "_" +
                        key_id + ".json")
                    FileUtils.upload_s3(trace_id, key_rotation_status,
                                        s3_file_name, True)
                except PmError as e:
                    pm_logger.error(
                        "[%s/%s] マスターキー（%s）のローテーションステータス情報のS3保存に失敗しました。",
                        awsaccount, region_name, key_id)
                    raise common_utils.write_log_pm_error(e, pm_logger)

                try:
                    # ローテーション設定がされていないKMSマスタキーは存在するか
                    if (key_rotation_status['KeyRotationEnabled'] is False):
                        check_result = {
                            'Region': region_name,
                            'Level': CommonConst.LEVEL_CODE_11,
                            'DetectionItem': {
                                'AbnormalityKeys': {
                                    'KeyId': key_id
                                }
                            }
                        }
                        check_results.append(check_result)
                except Exception as e:
                    pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                    region_name)
                    raise common_utils.write_log_exception(e, pm_logger)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            if not pm_error.pm_notification_error:
                pm_error.pm_notification_error = PmNotificationError(
                    check_item_code='CHECK_CIS12_ITEM_2_08',
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            else:
                pm_error.pm_notification_error.check_item_code = 'CHECK_CIS12_ITEM_2_08'
                pm_error.pm_notification_error.aws_account = awsaccount
                pm_error.pm_notification_error.region = region_name
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # Export File CHECK_CIS12_ITEM_2_08.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_cis_item_2_08 = {
            'AWSAccount': awsaccount,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_cis_item_2_08, result_json_path,
                            True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_08",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) > 0:
        return CheckResult.MinorInadequacies
    return CheckResult.Normal


def check_cis_item_2_09(trace_id, check_history_id, organization_id,
                        project_id, aws_account, session, result_json_path,
                        check_item_code, excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    # Export File EC2_RI_{region}.json
    try:
        regions = aws_common.get_regions(trace_id, session)
    except PmError as e:
        pm_logger.error("Regionの情報の取得に失敗しました。")
        e.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_09",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)
    for item in regions:
        try:
            region_name = item["RegionName"]
            if region_name not in REGION_IGNORE:
                ec2_client = Ec2Utils.get_ec2_client(trace_id, session,
                                                     region_name, aws_account)
                try:
                    # 対象のAWSアカウントのリージョンごと（GovCloud、北京を除く）にVPC情報を取得する。
                    vpc_infos = Ec2Utils.describe_vpcs(trace_id, aws_account,
                                                       ec2_client, region_name)
                except PmError as e:
                    raise common_utils.write_log_exception(e, pm_logger)

                if (len(vpc_infos) == 0):
                    pm_logger.info("[%s/%s] VPC情報の取得件数が0でした。", aws_account,
                                   region_name)
                    continue
                try:
                    # 取得したVPC情報をS3に保存する（リソース情報ファイル）。
                    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                        check_history_id, organization_id, project_id,
                        aws_account, "VPC_VpcInfo_" + region_name + ".json")
                    FileUtils.upload_s3(trace_id, vpc_infos, s3_file_name,
                                        True)
                except PmError as e:
                    pm_logger.error("[%s/%s] VPC情報のS3保存に失敗しました。", aws_account,
                                    region_name)
                    raise common_utils.write_log_exception(e, pm_logger)

                try:
                    # 対象のAWSアカウントのリージョンごと（GovCloud、北京を除く）にFlowLog情報を取得する。
                    flow_logs = Ec2Utils.describe_flow_logs(
                        trace_id, aws_account, ec2_client, region_name)
                except PmError as e:
                    raise common_utils.write_log_exception(e, pm_logger)

                try:
                    # 取得したFlowLog情報をS3に保存する（リソース情報ファイル）。
                    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                        check_history_id, organization_id, project_id,
                        aws_account, "VPC_FlowLogs_" + region_name + ".json")
                    FileUtils.upload_s3(trace_id, flow_logs, s3_file_name,
                                        True)
                except PmError as e:
                    pm_logger.error("[%s/%s] VPCフローログ情報のS3保存に失敗しました。",
                                    aws_account, region_name)
                    raise common_utils.write_log_exception(e, pm_logger)

                try:
                    list_resource_ids = []
                    for flow_log in flow_logs:
                        list_resource_ids.append(flow_log['ResourceId'])
                    for vpc_info in vpc_infos:
                        if common_utils.check_excluded_resources(
                                check_item_code, region_name,
                                ResourceType.VpcId, vpc_info['VpcId'],
                                excluded_resources):
                            continue

                        if vpc_info['VpcId'] not in list_resource_ids:
                            check_result = {
                                'Region': region_name,
                                'Level': CommonConst.LEVEL_CODE_11,
                                'DetectionItem': {
                                    'AbnormalityVpc': vpc_info['VpcId']
                                }
                            }
                            check_results.append(check_result)
                except Exception as e:
                    pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", aws_account,
                                    region_name)
                    raise common_utils.write_log_pm_error(e, pm_logger)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            if not pm_error.pm_notification_error:
                pm_error.pm_notification_error = PmNotificationError(
                    check_item_code='CHECK_CIS12_ITEM_2_09',
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            else:
                pm_error.pm_notification_error.check_item_code = 'CHECK_CIS12_ITEM_2_09'
                pm_error.pm_notification_error.aws_account = aws_account
                pm_error.pm_notification_error.region = region_name
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # Export File CHECK_CIS12_ITEM_2_09.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_cis_item_2_09 = {
            'AWSAccount': aws_account,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_cis_item_2_09, result_json_path,
                            True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", aws_account)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code="CHECK_CIS12_ITEM_2_09",
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) > 0:
        return CheckResult.MinorInadequacies
    return CheckResult.Normal
