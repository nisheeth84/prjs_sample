import boto3
import copy
from tests.mock.data.aws.ec2.data_test_ec2 import DataTestEC2

ec2_client_connect = None
ec2_resource_connect = None


def client_connect():
    global ec2_client_connect
    if not ec2_client_connect:
        ec2_client_connect = boto3.client('ec2', 'us-east-1')
    return ec2_client_connect


def resource_connect():
    global ec2_resource_connect
    if not ec2_resource_connect:
        ec2_resource_connect = boto3.resource('ec2', 'us-east-1')
    return ec2_resource_connect


def side_effect_describe_instances(NextToken=None):
    if NextToken is None:
        return copy.deepcopy(DataTestEC2.DATA_TEST_DESCRIBE_INSTANCES_EXIST_NEXT_TOKEN)
    if NextToken == "NextToken_1":
        return copy.deepcopy(DataTestEC2.DATA_TEST_DESCRIBE_INSTANCES_EXIST_NEXT_TOKEN_1)
    if NextToken == "NextToken_2":
        return copy.deepcopy(DataTestEC2.DATA_TEST_DESCRIBE_INSTANCES_EXIST_NEXT_TOKEN_2)
    elif NextToken == "NextToken_3":
        return copy.deepcopy(DataTestEC2.DATA_TEST_DESCRIBE_INSTANCES_NOT_EXIST_NEXT_TOKEN)


def side_effect_describe_flow_log(NextToken=None):
    if NextToken is None:
        return copy.deepcopy(DataTestEC2.DATA_DESCRIBE_FLOW_LOGS_EXIST_TOKEN)
    if NextToken == "NextToken_1":
        return copy.deepcopy(DataTestEC2.DATA_DESCRIBE_FLOW_LOGS_EXIST_TOKEN_1)
    if NextToken == "NextToken_2":
        return copy.deepcopy(DataTestEC2.DATA_DESCRIBE_FLOW_LOGS_EXIST_TOKEN_2)
    elif NextToken == "NextToken_3":
        return copy.deepcopy(DataTestEC2.DATA_DESCRIBE_FLOW_LOGS_NOT_EXIST_TOKEN)


def side_effect_describe_volumes(NextToken=None):
    if NextToken is None:
        return copy.deepcopy(DataTestEC2.DATA_DESCRIBE_VOLUMES_EXIST_TOKEN)
    if NextToken == "NextToken_1":
        return copy.deepcopy(DataTestEC2.DATA_DESCRIBE_VOLUMES_EXIST_TOKEN_1)
    if NextToken == "NextToken_2":
        return copy.deepcopy(DataTestEC2.DATA_DESCRIBE_VOLUMES_EXIST_TOKEN_2)
    elif NextToken == "NextToken_3":
        return copy.deepcopy(DataTestEC2.DATA_DESCRIBE_VOLUMES_NOT_EXIST_TOKEN)


def side_effect_describe_security_groups(NextToken=None):
    if NextToken is None:
        return copy.deepcopy(DataTestEC2.DATA_DESCRIBE_SECURITY_GROUPS_EXIST_TOKEN)
    if NextToken == "NextToken_1":
        return copy.deepcopy(DataTestEC2.DATA_DESCRIBE_SECURITY_GROUPS_EXIST_TOKEN_1)
    if NextToken == "NextToken_2":
        return copy.deepcopy(DataTestEC2.DATA_DESCRIBE_SECURITY_GROUPS_EXIST_TOKEN_2)
    elif NextToken == "NextToken_3":
        return copy.deepcopy(DataTestEC2.DATA_DESCRIBE_SECURITY_GROUPS_NOT_EXIST_TOKEN)
