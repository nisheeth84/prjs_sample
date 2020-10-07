import inspect
import jmespath
import re

from premembers.const.const import CommonConst
from premembers.repository.const import CheckResult
from premembers.check.logic.cis import cis_item_common_logic
from premembers.common import common_utils, aws_common
from premembers.exception.pm_exceptions import PmError, PmNotificationError
from premembers.common import LogsUtils, CloudWatchlUtils, SNSUtils
from premembers.common import FileUtils, date_utils, CloudTrailUtils

REGION_IGNORE = CommonConst.REGION_IGNORE

FILTER_PATTERN = {
    "CHECK_CIS12_ITEM_3_01": "{ ($.errorCode = \"*UnauthorizedOperation\") || ($.errorCode = \"AccessDenied*\") }",
    "CHECK_CIS12_ITEM_3_02": "^(?=.*\$\.eventName\s*=\s*\"ConsoleLogin\")(?=.*\$\.additionalEventData\.MFAUsed\s*!=\s*\"Yes\")",
    "CHECK_CIS12_ITEM_3_03": "{ $.userIdentity.type = \"Root\" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != \"AwsServiceEvent\" }",
    "CHECK_CIS12_ITEM_3_04": "{($.eventName=DeleteGroupPolicy)||($.eventName=DeleteRolePolicy)||($.eventName=DeleteUserPolicy)||($.eventName=PutGroupPolicy)||($.eventName=PutRolePolicy)||($.eventName=PutUserPolicy)||($.eventName=CreatePolicy)||($.eventName=DeletePolicy)||($.eventName=CreatePolicyVersion)||($.eventName=DeletePolicyVersion)||($.eventName=AttachRolePolicy)||($.eventName=DetachRolePolicy)||($.eventName=AttachUserPolicy)||($.eventName=DetachUserPolicy)||($.eventName=AttachGroupPolicy)||($.eventName=DetachGroupPolicy)}",
    "CHECK_CIS12_ITEM_3_05": "{ ($.eventName = CreateTrail) || ($.eventName = UpdateTrail) ||($.eventName = DeleteTrail) || ($.eventName = StartLogging) || ($.eventName = StopLogging) }",
    "CHECK_CIS12_ITEM_3_06": "{ ($.eventName = ConsoleLogin) && ($.errorMessage = \"Failed authentication\") }",
    "CHECK_CIS12_ITEM_3_07": "{($.eventSource = kms.amazonaws.com) && (($.eventName=DisableKey)||($.eventName=ScheduleKeyDeletion))}",
    "CHECK_CIS12_ITEM_3_08": "{ ($.eventSource = s3.amazonaws.com) && (($.eventName = PutBucketAcl) || ($.eventName = PutBucketPolicy) || ($.eventName = PutBucketCors) || ($.eventName = PutBucketLifecycle) || ($.eventName = PutBucketReplication) || ($.eventName = DeleteBucketPolicy) || ($.eventName = DeleteBucketCors) || ($.eventName = DeleteBucketLifecycle) || ($.eventName = DeleteBucketReplication)) }",
    "CHECK_CIS12_ITEM_3_09": "{($.eventSource = config.amazonaws.com) && (($.eventName=StopConfigurationRecorder)||($.eventName=DeleteDeliveryChannel)||($.eventName=PutDeliveryChannel)||($.eventName=PutConfigurationRecorder))}",
    "CHECK_CIS12_ITEM_3_10": "{ ($.eventName = AuthorizeSecurityGroupIngress) || ($.eventName = AuthorizeSecurityGroupEgress) || ($.eventName = RevokeSecurityGroupIngress) || ($.eventName = RevokeSecurityGroupEgress) || ($.eventName = CreateSecurityGroup) || ($.eventName = DeleteSecurityGroup)}",
    "CHECK_CIS12_ITEM_3_11": "{ ($.eventName = CreateNetworkAcl) || ($.eventName = CreateNetworkAclEntry) || ($.eventName = DeleteNetworkAcl) || ($.eventName = DeleteNetworkAclEntry) || ($.eventName = ReplaceNetworkAclEntry) || ($.eventName = ReplaceNetworkAclAssociation) }",
    "CHECK_CIS12_ITEM_3_12": "{ ($.eventName = CreateCustomerGateway) || ($.eventName = DeleteCustomerGateway) || ($.eventName = AttachInternetGateway) || ($.eventName = CreateInternetGateway) || ($.eventName = DeleteInternetGateway) || ($.eventName = DetachInternetGateway) }",
    "CHECK_CIS12_ITEM_3_13": "{ ($.eventName = CreateRoute) || ($.eventName = CreateRouteTable) || ($.eventName = ReplaceRoute) || ($.eventName = ReplaceRouteTableAssociation) || ($.eventName = DeleteRouteTable) || ($.eventName = DeleteRoute) || ($.eventName = DisassociateRouteTable) }",
    "CHECK_CIS12_ITEM_3_14": "{ ($.eventName = CreateVpc) || ($.eventName = DeleteVpc) || ($.eventName = ModifyVpcAttribute) || ($.eventName = AcceptVpcPeeringConnection) || ($.eventName = CreateVpcPeeringConnection) || ($.eventName = DeleteVpcPeeringConnection) || ($.eventName = RejectVpcPeeringConnection) || ($.eventName = AttachClassicLinkVpc) || ($.eventName = DetachClassicLinkVpc) || ($.eventName = DisableVpcClassicLink) || ($.eventName = EnableVpcClassicLink) }"
}


def check_cis_item_3_01(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_21,
        CheckResult.CriticalDefect)


def check_cis_item_3_02(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_21,
        CheckResult.CriticalDefect)


def check_cis_item_3_03(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_21,
        CheckResult.CriticalDefect)


def check_cis_item_3_04(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_21,
        CheckResult.CriticalDefect)


def check_cis_item_3_05(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_21,
        CheckResult.CriticalDefect)


def check_cis_item_3_06(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_11,
        CheckResult.MinorInadequacies)


def check_cis_item_3_07(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_11,
        CheckResult.MinorInadequacies)


def check_cis_item_3_08(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_21,
        CheckResult.CriticalDefect)


def check_cis_item_3_09(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_11,
        CheckResult.MinorInadequacies)


def check_cis_item_3_10(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_11,
        CheckResult.MinorInadequacies)


def check_cis_item_3_11(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_11,
        CheckResult.MinorInadequacies)


def check_cis_item_3_12(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_21,
        CheckResult.CriticalDefect)


def check_cis_item_3_13(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_21,
        CheckResult.CriticalDefect)


def check_cis_item_3_14(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code):
    return check_cis_metric(
        trace_id, check_history_id, organization_id, project_id, awsaccount,
        session, result_json_path, check_item_code, CommonConst.LEVEL_CODE_21,
        CheckResult.CriticalDefect)


def check_cis_metric(trace_id, check_history_id, organization_id, project_id,
                     awsaccount, session, result_json_path, check_item_code,
                     level_code, check_result):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    is_all_region_enable = False
    is_check5_successful = False
    # Get all region
    try:
        regions = aws_common.get_regions(trace_id, session)
    except PmError as e:
        pm_logger.error("Regionの情報の取得に失敗しました。")
        e.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)

    for region in regions:
        try:
            region_name = region["RegionName"]
            if region_name in REGION_IGNORE:
                continue

            # Default value check
            is_region_error = True

            try:
                cloud_trails = cis_item_common_logic.get_cloud_trails(
                    trace_id, check_history_id, organization_id, project_id,
                    awsaccount, region_name, session)
            except PmError as e:
                raise common_utils.write_log_pm_error(e, pm_logger)
            logs_client = LogsUtils.get_logs_client(trace_id, session,
                                                    region_name, awsaccount)
            cloudwatch_client = CloudWatchlUtils.get_cloudwatch_client(
                trace_id, session, region_name, awsaccount)
            sns_client = SNSUtils.get_sns_client(trace_id, session,
                                                 region_name, awsaccount)
            trail_client = CloudTrailUtils.get_trail_client(
                trace_id, session, region_name, awsaccount)
            for cloud_trail in cloud_trails:
                try:
                    # Check-0. マルチリージョン設定されたCloudTrailが存在するか。
                    trail_status = cis_item_common_logic.get_trails_status(
                        trace_id, check_history_id, organization_id,
                        project_id, awsaccount, region_name, trail_client,
                        cloud_trail)
                    if (len(trail_status) == 0):
                        continue

                    event_selectors = cis_item_common_logic.get_trail_event_selectors(
                        trace_id, check_history_id, organization_id,
                        project_id, awsaccount, region_name, trail_client,
                        cloud_trail)

                    # 全リージョンに対し有効なCloudTrailが存在するか
                    # ロギングが有効か
                    if (is_all_region_enable is False
                            and cloud_trail['IsMultiRegionTrail'] is True
                            and trail_status['IsLogging'] is True):

                        # すべての管理操作の書き込みが有効か
                        for event_selector in event_selectors:
                            if (event_selector['IncludeManagementEvents'] is True
                                    and event_selector['ReadWriteType'] == CommonConst.EVENT_SELECTOR_READ_WRITE_TYPE_ALL):
                                is_all_region_enable = True
                                break
                    if (is_all_region_enable is False):
                        continue

                    # Check-1. CloudTrailのロググループに対してメトリクスは設定されているか。
                    if common_utils.check_key(
                            'CloudWatchLogsLogGroupArn', cloud_trail
                    ) is False or not cloud_trail['CloudWatchLogsLogGroupArn']:
                        continue

                    # Check-2. 許可されていないAPIコールに対するメトリクスは設定されているか。
                    metric_filters = describe_metric_filters(
                        trace_id, check_history_id, organization_id,
                        project_id, awsaccount, region_name, logs_client,
                        cloud_trail['CloudWatchLogsLogGroupArn'].split(":")[6])

                    list_filter_pattern_result = get_list_filter_pattern_match_result(
                        trace_id, check_item_code, metric_filters)
                    if (not list_filter_pattern_result):
                        continue

                    # Check-3. メトリクスに対しアラームは設定されているか。
                    metric_alarms = describe_alarms(
                        trace_id, check_history_id, organization_id,
                        project_id, awsaccount, region_name, cloudwatch_client)

                    metric_names = []
                    for filter_pattern_result in list_filter_pattern_result:
                        metric_names.extend(
                            jmespath.search(
                                'metricTransformations[*].metricName',
                                filter_pattern_result))

                    metric_alarms_matching = []
                    for metric_alarm in metric_alarms:
                        pm_logger.info(
                            "アラーム名=%s",
                            common_utils.get_value("AlarmName", metric_alarm))

                        if (common_utils.check_key('MetricName',
                                                   metric_alarm) is True and
                                metric_alarm['MetricName'] in metric_names):
                            metric_alarms_matching.append(metric_alarm)

                    if not metric_alarms_matching:
                        continue

                    # Check-4. アラームからキックされたSNSに対し通知先は設定されているか。
                    for metric_alarm in metric_alarms_matching:
                        for alarm_action in metric_alarm['AlarmActions']:
                            if alarm_action.startswith(CommonConst.ARN_SNS):
                                subscriptions = list_subscriptions_by_topic(
                                    trace_id, check_history_id,
                                    organization_id, project_id, awsaccount,
                                    region_name, sns_client, alarm_action)
                                if len(subscriptions) > 0:
                                    is_region_error = False
                                    break

                    # Check-5. 設定されたCloudTrailは全Region有効なTrailか。
                    if (is_region_error is False
                            and is_all_region_enable is True):
                        is_check5_successful = True
                        break
                except Exception as e:
                    pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                    region_name)
                    raise common_utils.write_log_exception(e, pm_logger)

            if is_check5_successful is True:
                check_results = []
                break
            if (is_region_error is True):
                result = {'Region': region_name, 'Level': level_code}
                check_results.append(result)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            if not pm_error.pm_notification_error:
                pm_error.pm_notification_error = PmNotificationError(
                    check_item_code=check_item_code,
                    region=region_name,
                    code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            else:
                pm_error.pm_notification_error.check_item_code = check_item_code
                pm_error.pm_notification_error.aws_account = awsaccount
                pm_error.pm_notification_error.region = region_name
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # 検出結果を1つのチェック結果JSONファイルに保存する。
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_cis_item_3 = {
            'AWSAccount': awsaccount,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_cis_item_3, result_json_path,
                            True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    if len(check_results) > 0:
        return check_result
    return CheckResult.Normal


def get_list_filter_pattern_match_result(trace_id, check_item_code, metric_filters):
    metric_filter = []
    if (check_item_code == "CHECK_CIS12_ITEM_3_02"):
        metric_filter = [metric_filter for metric_filter in metric_filters if re.compile(FILTER_PATTERN[check_item_code]).search(metric_filter['filterPattern'])]
    else:
        metric_filter = [metric_filter for metric_filter in metric_filters if remove_space(metric_filter['filterPattern']) == remove_space(FILTER_PATTERN[check_item_code])]
    return metric_filter


def remove_space(filter):
    return re.sub(CommonConst.REGEX_SPACE, CommonConst.BLANK, filter)


def describe_metric_filters(trace_id, check_history_id, organization_id,
                            project_id, awsaccount, region_name, logs_client,
                            cloud_trail_log_group_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, awsaccount,
        "CloudWatch_Logs_Metric_Filters_Info_" +
        region_name + "_" + cloud_trail_log_group_name.replace(
            CommonConst.SLASH, "-SLASH-") + ".json")
    metric_filters = []

    # リソース情報取得
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            metric_filters = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                                 s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        try:
            metric_filters = LogsUtils.describe_metric_filters(
                trace_id, logs_client, awsaccount, region_name,
                cloud_trail_log_group_name)
        except PmError as e:
            data_body = {'CloudTrailLogGroupName': cloud_trail_log_group_name}
            e.pm_notification_error = PmNotificationError(
                code_error=CommonConst.KEY_CODE_ERROR_GET_METRIC_FILTERS,
                data_body=data_body)
            raise common_utils.write_log_pm_error(e, pm_logger)

        try:
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", metric_filters,
                                  s3_file_name)
        except PmError as e:
            pm_logger.error("[%s/%s] メトリクスフィルタ情報のS3保存に失敗しました。", awsaccount,
                            region_name)
            raise common_utils.write_log_pm_error(e, pm_logger)

    # 情報の取得件数が０でした。
    if (len(metric_filters) == 0):
        pm_logger.warning("[%s/%s] メトリクスフィルタ情報の取得件数が０でした。", awsaccount,
                          region_name)
    return metric_filters


def describe_alarms(trace_id, check_history_id, organization_id, project_id,
                    awsaccount, region_name, cloudwatch_client):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, awsaccount,
        "CloudWatch_Alarm_Info_" + region_name + ".json")
    metric_alarms = []

    # リソース情報取得
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            metric_alarms = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                                s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        try:
            metric_alarms = CloudWatchlUtils.describe_alarms(
                trace_id, awsaccount, cloudwatch_client, region_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)

        # 取得したCloudWatchAlarm情報をS3に保存する（リソース情報ファイル）
        try:
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", metric_alarms,
                                  s3_file_name)
        except PmError as e:
            pm_logger.error("[%s/%s] CloudWatchAlarmの情報のS3保存に失敗しました。",
                            awsaccount, region_name)
            raise common_utils.write_log_pm_error(e, pm_logger)

    # 情報の取得件数が０でした。
    if (len(metric_alarms) == 0):
        pm_logger.warning("[%s/%s] CloudWatchAlarm情報の取得件数が０でした。", awsaccount,
                          region_name)
    return metric_alarms


def list_subscriptions_by_topic(trace_id, check_history_id, organization_id,
                                project_id, awsaccount, region_name,
                                sns_client, topic_arn):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    topic_name = topic_arn.split(":")[5]
    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
        check_history_id, organization_id, project_id, awsaccount,
        "SNS_Topic_Subscriptions_Info_" + region_name + "_" + topic_name +
        ".json")
    subscriptions = []

    # リソース情報取得
    if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                        s3_file_name)) is True:
        try:
            subscriptions = FileUtils.read_json(trace_id, "S3_CHECK_BUCKET",
                                                s3_file_name)
        except PmError as e:
            raise common_utils.write_log_pm_error(e, pm_logger)
    else:
        # 対象のAWSアカウントのリージョンごと（GovCloud、北京を除く）にCloudTrail情報を取得する。
        try:
            subscriptions = SNSUtils.list_subscriptions_by_topic(
                trace_id, sns_client, awsaccount, region_name, topic_arn)
        except PmError as e:
            data_body = {'TopicArn': topic_arn}
            e.pm_notification_error = PmNotificationError(
                code_error=CommonConst.KEY_CODE_ERROR_GET_SUBSCRIPTIONS,
                data_body=data_body)
            raise common_utils.write_log_pm_error(e, pm_logger)

        # 取得したSNS Topicサブスクリプション情報情報をS3に保存する（リソース情報ファイル）
        try:
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", subscriptions,
                                  s3_file_name)
        except PmError as e:
            pm_logger.error("[%s/%s] SNS Topicサブスクリプション情報の情報のS3保存に失敗しました。",
                            awsaccount, region_name)
            raise common_utils.write_log_pm_error(e, pm_logger)

    # 情報の取得件数が０でした。
    if (len(subscriptions) == 0):
        pm_logger.warning("[%s/%s] SNS Topicサブスクリプション情報情報の取得件数が０でした。",
                          awsaccount, region_name)
    return subscriptions
