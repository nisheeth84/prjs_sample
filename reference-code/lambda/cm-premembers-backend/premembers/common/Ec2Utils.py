import inspect

from premembers.common import common_utils
from botocore.exceptions import ClientError


def describe_security_groups(trace_id, awsaccount, ec2_client, region_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    security_groups = []
    try:
        response = ec2_client.describe_security_groups()
        if common_utils.check_key("SecurityGroups", response):
            security_groups = response["SecurityGroups"]

        next_token = None
        if 'NextToken' in response:
            next_token = response['NextToken']
        while(next_token is not None):
            response = ec2_client.describe_security_groups(
                NextToken=next_token)
            security_groups.extend(response['SecurityGroups'])
            if 'NextToken' in response:
                next_token = response['NextToken']
            else:
                next_token = None
    except ClientError as e:
        pm_logger.error("[%s/%s] セキュリティグループ情報の取得に失敗しました。", awsaccount,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return security_groups


def describe_instances(trace_id, awsaccount, ec2_client, region_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    reservation_instances = []
    try:
        response = ec2_client.describe_instances()
        if common_utils.check_key("Reservations", response):
            reservation_instances = response["Reservations"]
        next_token = None
        if 'NextToken' in response:
            next_token = response['NextToken']
        while(next_token is not None):
            response = ec2_client.describe_instances(
                NextToken=next_token)
            reservation_instances.extend(response['Reservations'])
            if 'NextToken' in response:
                next_token = response['NextToken']
            else:
                next_token = None
    except ClientError as e:
        pm_logger.error("[%s/%s] EC2インスタンス情報の取得に失敗しました。", awsaccount,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return reservation_instances


def describe_vpcs(trace_id, aws_account, ec2_client, region_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        vpc_info = ec2_client.describe_vpcs()
    except ClientError as e:
        pm_logger.error("[%s/%s] VPC情報の取得に失敗しました。", aws_account, region_name)
        raise common_utils.write_log_exception(e, pm_logger)

    if common_utils.check_key("Vpcs", vpc_info):
        return vpc_info['Vpcs']
    return []


def describe_flow_logs(trace_id, aws_account, ec2_client, region_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    flow_logs = []
    try:
        response = ec2_client.describe_flow_logs()
        if common_utils.check_key("FlowLogs", response):
            flow_logs = response["FlowLogs"]
        next_token = None
        if 'NextToken' in response:
            next_token = response['NextToken']
        while(next_token is not None):
            response = ec2_client.describe_flow_logs(
                NextToken=next_token)
            flow_logs.extend(response['FlowLogs'])
            if 'NextToken' in response:
                next_token = response['NextToken']
            else:
                next_token = None
    except ClientError as e:
        pm_logger.error("[%s/%s] VPCフローログ情報の取得に失敗しました。", aws_account,
                        region_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return flow_logs


def get_ec2_client(trace_id, session, region_name, aws_account,
                   is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        ec2_client = session.client(
            service_name='ec2', region_name=region_name)
    except ClientError as e:
        logger.error("[%s/%s] EC2クライアント作成に失敗しました。", aws_account, region_name)
        raise common_utils.write_log_exception(e, logger)
    return ec2_client


def describe_volumes(trace_id, awsaccount, ec2_client, region_name, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    ebs_volumes = []
    try:
        response = ec2_client.describe_volumes()
        if common_utils.check_key("Volumes", response):
            ebs_volumes = response["Volumes"]

        next_token = None
        if 'NextToken' in response:
            next_token = response['NextToken']
        while (next_token is not None):
            response = ec2_client.describe_volumes(NextToken=next_token)
            ebs_volumes.extend(response['Volumes'])
            if 'NextToken' in response:
                next_token = response['NextToken']
            else:
                next_token = None
    except ClientError as e:
        logger.error("[%s/%s] EBSボリューム情報の取得に失敗しました。", awsaccount, region_name)
        raise common_utils.write_log_exception(e, logger)
    return ebs_volumes
