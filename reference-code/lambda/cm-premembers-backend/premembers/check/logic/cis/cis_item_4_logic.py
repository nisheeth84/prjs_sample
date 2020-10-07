import inspect

from premembers.repository.const import ResourceType
from premembers.common import common_utils, aws_common, Ec2Utils
from premembers.common import FileUtils, date_utils
from premembers.exception.pm_exceptions import PmError, PmNotificationError
from premembers.const.const import CommonConst
from premembers.repository.const import CheckResult
from premembers.check.logic.cis import cis_item_common_logic

REGION_IGNORE = CommonConst.REGION_IGNORE


def check_cis_item_4_01(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code, excluded_resources):
    return execute_security_group_port(trace_id, check_history_id,
                                       organization_id, project_id, awsaccount,
                                       session, result_json_path,
                                       CommonConst.PORT_22, check_item_code,
                                       excluded_resources)


def check_cis_item_4_02(trace_id, check_history_id, organization_id,
                        project_id, awsaccount, session, result_json_path,
                        check_item_code, excluded_resources):
    return execute_security_group_port(trace_id, check_history_id,
                                       organization_id, project_id, awsaccount,
                                       session, result_json_path,
                                       CommonConst.PORT_3389, check_item_code,
                                       excluded_resources)


def execute_security_group_port(trace_id, check_history_id, organization_id,
                                project_id, awsaccount, session,
                                result_json_path, port, check_item_code,
                                excluded_resources):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    check_results = []
    # Export File VPC_SecurityGroups_{region}.json
    try:
        regions = aws_common.get_regions(trace_id, session)
    except PmError as e:
        pm_logger.error("Regionの情報の取得に失敗しました。")
        e.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)
    for region in regions:
        region_name = region["RegionName"]
        try:
            if region_name in REGION_IGNORE:
                continue
            ec2_client = Ec2Utils.get_ec2_client(trace_id, session,
                                                 region_name, awsaccount)
            s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                check_history_id, organization_id, project_id, awsaccount,
                "VPC_SecurityGroups_" + region_name + ".json")
            if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                                s3_file_name)) is True:
                try:
                    security_groups = FileUtils.read_json(
                        trace_id, "S3_CHECK_BUCKET", s3_file_name)
                except PmError as e:
                    raise common_utils.write_log_pm_error(e, pm_logger)
            else:
                try:
                    security_groups = Ec2Utils.describe_security_groups(
                        trace_id, awsaccount, ec2_client, region_name)
                except PmError as e:
                    raise common_utils.write_log_pm_error(e, pm_logger)
                if (len(security_groups) == 0):
                    pm_logger.info("[%s/%s] セキュリティグループ情報の取得件数が0でした。",
                                   awsaccount, region_name)
                    continue
                try:
                    FileUtils.upload_s3(trace_id, security_groups,
                                        s3_file_name, True)
                except PmError as e:
                    pm_logger.error("[%s/%s] セキュリティグループ情報のS3保存に失敗しました。",
                                    awsaccount, region_name)
                    raise common_utils.write_log_pm_error(e, pm_logger)
            try:
                for security_group in security_groups:
                    # check excluded resources
                    resource_name = security_group['GroupId']
                    if common_utils.check_excluded_resources(
                            check_item_code, region_name,
                            ResourceType.GroupId, resource_name,
                            excluded_resources):
                        continue

                    for ip_permission in security_group['IpPermissions']:
                        if ip_permission['IpProtocol'] != '-1':
                            if ip_permission['IpProtocol'] != CommonConst.TCP:
                                continue
                            if common_utils.check_key(
                                    'FromPort', ip_permission
                            ) is False or ip_permission['FromPort'] > port:
                                continue
                            if common_utils.check_key(
                                    'ToPort', ip_permission
                            ) is False or ip_permission['ToPort'] < port:
                                continue
                        for ip_range in ip_permission['IpRanges']:
                            if common_utils.check_key('CidrIp', ip_range):
                                if (CommonConst.CIDR_IP_NOT_SECURITY ==
                                        ip_range['CidrIp']):
                                    check_result = get_check_result(
                                        security_group, ip_permission,
                                        ip_range, region_name)
                                    check_results.append(check_result)
                                    break
            except Exception as e:
                pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                region_name)
                raise common_utils.write_log_pm_error(e, pm_logger)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            pm_error.pm_notification_error = PmNotificationError(
                check_item_code=check_item_code,
                region=region_name,
                code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    result_security_group = CheckResult.Normal
    if (len(check_results) > 0):
        result_security_group = CheckResult.CriticalDefect

    # 検出結果を1つのチェック結果JSONファイルに保存する。
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_rule_security_group = {
            'AWSAccount': awsaccount,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_rule_security_group,
                            result_json_path, True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    return result_security_group


def get_check_result(security_group, ip_permission, ip_range, region_name):
    result = {
        'Region': region_name,
        'Level': CommonConst.LEVEL_CODE_21,
        'DetectionItem': {
            'GroupId': security_group['GroupId'],
            'FromPort': common_utils.get_value('FromPort', ip_permission),
            'IpProtocol': common_utils.get_value('IpProtocol', ip_permission),
            'IpRanges': [{
                'CidrIp': ip_range['CidrIp']
            }],
            'Ipv6Ranges': ip_permission['Ipv6Ranges'],
            'PrefixListIds': ip_permission['PrefixListIds'],
            'ToPort': common_utils.get_value('ToPort', ip_permission),
            'UserIdGroupPairs': ip_permission['UserIdGroupPairs']
        }
    }
    return result


def check_cis_item_4_03(trace_id, check_history_id, organization_id,
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
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(e, pm_logger)
    for region in regions:
        region_name = region["RegionName"]
        try:
            if region_name in REGION_IGNORE:
                continue
            ec2_client = Ec2Utils.get_ec2_client(trace_id, session,
                                                 region_name, awsaccount)
            # 対象のAWSアカウントのリージョンごと（GovCloud、北京を除く）にセキュリティグループ情報を取得する。
            s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                check_history_id, organization_id, project_id, awsaccount,
                "VPC_SecurityGroups_" + region_name + ".json")
            if (aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                                s3_file_name)) is True:
                try:
                    security_groups = FileUtils.read_json(
                        trace_id, "S3_CHECK_BUCKET", s3_file_name)
                except PmError as e:
                    raise common_utils.write_log_pm_error(e, pm_logger)
            else:
                try:
                    security_groups = Ec2Utils.describe_security_groups(
                        trace_id, awsaccount, ec2_client, region_name)
                except PmError as e:
                    raise common_utils.write_log_pm_error(e, pm_logger)
                if (len(security_groups) == 0):
                    pm_logger.info("[%s/%s] セキュリティグループ情報の取得件数が0でした。",
                                   awsaccount, region_name)
                try:
                    if (len(security_groups) > 0):
                        FileUtils.upload_s3(trace_id, security_groups,
                                            s3_file_name, True)
                except PmError as e:
                    pm_logger.error("[%s/%s] セキュリティグループ情報のS3保存に失敗しました。",
                                    awsaccount, region_name)
                    raise common_utils.write_log_pm_error(e, pm_logger)

            # 対象のAWSアカウントのリージョンごと（GovCloud、北京を除く）にEC2インスタンス情報を取得する。
            s3_file_name_iam_instances = CommonConst.PATH_CHECK_RAW.format(
                check_history_id, organization_id, project_id, awsaccount,
                "IAM_Instances_" + region_name + ".json")
            if (aws_common.check_exists_file_s3(
                    trace_id, "S3_CHECK_BUCKET",
                    s3_file_name_iam_instances)) is True:
                try:
                    reservation_instances = FileUtils.read_json(
                        trace_id, "S3_CHECK_BUCKET",
                        s3_file_name_iam_instances)
                except PmError as e:
                    raise common_utils.write_log_pm_error(e, pm_logger)
            else:
                try:
                    reservation_instances = Ec2Utils.describe_instances(
                        trace_id, awsaccount, ec2_client, region_name)
                except PmError as e:
                    raise common_utils.write_log_pm_error(e, pm_logger)
                if (len(reservation_instances) == 0):
                    pm_logger.info("[%s/%s] EC2インスタンス情報の取得件数が0でした。",
                                   awsaccount, region_name)
            try:
                if (len(reservation_instances) > 0):
                    s3_file_name = CommonConst.PATH_CHECK_RAW.format(
                        check_history_id, organization_id, project_id, awsaccount,
                        "VPC_SG_Instances_" + region_name + ".json")
                    FileUtils.upload_s3(trace_id, reservation_instances,
                                        s3_file_name, True)
            except PmError as e:
                pm_logger.error("[%s/%s] EC2インスタンス情報のS3保存に失敗しました。", awsaccount,
                                region_name)
                raise common_utils.write_log_pm_error(e, pm_logger)

            check1 = []
            check2 = []
            try:
                # リソース情報ファイルのセキュリティグループ情報から、インバウンドルール、アウトバウンドルールを設定しているdefaultセキュリティグループを検出する。
                for security_group in security_groups:
                    # check excluded resources
                    resource_name = security_group['GroupId']
                    if common_utils.check_excluded_resources(
                            check_item_code, region_name,
                            ResourceType.GroupId, resource_name,
                            excluded_resources):
                        continue

                    if (security_group['GroupName'] == CommonConst.DEFAULT
                            and len(security_group['IpPermissions']) > 0 and
                            len(security_group['IpPermissionsEgress']) > 0):
                        check1.append(security_group['GroupId'])

                # リソース情報ファイルのEC2インスタンス情報から、defaultセキュリティグループをアタッチしたEC2インスタンスを検出する、。
                for reservation_instance in reservation_instances:
                    for instance in reservation_instance['Instances']:
                        for security_group in instance['SecurityGroups']:
                            if security_group['GroupName'] == CommonConst.DEFAULT:
                                if common_utils.check_key('Tags',
                                                          instance) is True:
                                    name_tag = next(
                                        filter(
                                            lambda tag: tag['Key'] == 'Name',
                                            instance['Tags']), None)
                                    instance['InstanceName'] = None if name_tag is None else name_tag['Value']
                                check2.append(instance)

                if (len(check1) > 0 or len(check2) > 0):
                    check_results.append(
                        get_check_cis_item_4_03_result(check1, check2,
                                                       region_name))
            except Exception as e:
                pm_logger.error("[%s/%s] チェック処理中にエラーが発生しました。", awsaccount,
                                region_name)
                raise common_utils.write_log_pm_error(e, pm_logger)
        except Exception as e:
            pm_error = common_utils.write_log_exception(e, pm_logger)
            pm_error.pm_notification_error = PmNotificationError(
                check_item_code=check_item_code,
                region=region_name,
                code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
            raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # Export File CHECK_CIS12_ITEM_4_03.json
    try:
        current_date = date_utils.get_current_date_by_format(
            date_utils.PATTERN_YYYYMMDDHHMMSS)
        check_cis_item_4_03 = {
            'AWSAccount': awsaccount,
            'CheckResults': check_results,
            'DateTime': current_date
        }
        FileUtils.upload_s3(trace_id, check_cis_item_4_03, result_json_path,
                            True)
    except Exception as e:
        pm_logger.error("[%s] チェック結果JSONファイルの保存に失敗しました。", awsaccount)
        pm_error = common_utils.write_log_exception(e, pm_logger)
        pm_error.pm_notification_error = PmNotificationError(
            check_item_code=check_item_code,
            code_error=CommonConst.KEY_CODE_ERROR_DEFAULT)
        raise common_utils.write_log_pm_error(pm_error, pm_logger)

    # チェック結果
    if len(check_results) > 0:
        return CheckResult.MinorInadequacies
    return CheckResult.Normal


def get_check_cis_item_4_03_result(check1, check2, region_name):
    result = {
        'Region': region_name,
        'Level': CommonConst.LEVEL_CODE_11,
        'DetectionItem': {}
    }
    if len(check1) > 0:
        result['DetectionItem']['AbnormalitySecurityGroups'] = check1
    if len(check2) > 0:
        result_check2 = []
        for item in check2:
            sub_result_check2 = {}
            if common_utils.check_key('InstanceId', item) is True:
                sub_result_check2['InstanceId'] = item['InstanceId']
            if common_utils.check_key('InstanceName', item) is True:
                sub_result_check2['InstanceName'] = item['InstanceName']
            result_check2.append(sub_result_check2)
        result['DetectionItem']['AbnormalityEc2Instances'] = result_check2
    return result


def check_cis_item_4_04(trace_id, check_item_code, check_history_id,
                        organization_id, project_id, aws_account,
                        result_json_path):
    return cis_item_common_logic.execute_check_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path, CommonConst.LEVEL_CODE_2)
