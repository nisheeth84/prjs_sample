import copy

from tests.mock.data.aws.iam.data_test_iam import DataTestIAM
from tests.mock.aws.sts import sts_utils

iam_client_connect = None


def client_connect():
    global iam_client_connect
    if not iam_client_connect:
        session = sts_utils.create_session()
        iam_client_connect = session.client(
            'iam',
            region_name='us-east-1',
            aws_access_key_id='fake_aws_access_key_id',
            aws_secret_access_key='fake_aws_secret_access_key')
    return iam_client_connect


def side_effect_list_users(Marker=None):
    if Marker is None:
        return copy.deepcopy(DataTestIAM.DATA_LIST_USER_IS_TRUNCATED_TRUE1)
    elif Marker == 1:
        return copy.deepcopy(DataTestIAM.DATA_LIST_USER_IS_TRUNCATED_TRUE2)
    else:
        return copy.deepcopy(DataTestIAM.DATA_LIST_USER_IS_TRUNCATED_FALSE)


def side_effect_list_attached_user_policies(UserName=None, Marker=None):
    if Marker is None:
        return copy.deepcopy(
            DataTestIAM.DATA_ATTACHED_USER_POLICIES_IS_TRUNCATED_TRUE1)
    elif Marker == 1:
        return copy.deepcopy(
            DataTestIAM.DATA_ATTACHED_USER_POLICIES_IS_TRUNCATED_TRUE2)
    else:
        return copy.deepcopy(
            DataTestIAM.DATA_ATTACHED_USER_POLICIES_IS_TRUNCATED_FALSE)


def side_effect_list_user_policies(UserName=None, Marker=None):
    if Marker is None:
        return copy.deepcopy(
            DataTestIAM.DATA_LIST_USER_POLICY_IS_TRUNCATED_TRUE1)
    elif Marker == 1:
        return copy.deepcopy(
            DataTestIAM.DATA_LIST_USER_POLICY_IS_TRUNCATED_TRUE2)
    else:
        return copy.deepcopy(
            DataTestIAM.DATA_LIST_USER_POLICY_IS_TRUNCATED_FALSE)


def side_effect_list_policies(UserName=None, Marker=None):
    if Marker is None:
        return copy.deepcopy(DataTestIAM.DATA_LIST_POLICIES_IS_TRUNCATED_TRUE1)
    elif Marker == 1:
        return copy.deepcopy(DataTestIAM.DATA_LIST_POLICIES_IS_TRUNCATED_TRUE2)
    else:
        return copy.deepcopy(DataTestIAM.DATA_LIST_POLICIES_IS_TRUNCATED_FALSE)


def side_effect_list_entities_for_policy(PolicyArn=None, Marker=None):
    if Marker is None:
        return copy.deepcopy(
            DataTestIAM.DATA_LIST_ENTITIES_FOR_POLICY_IS_TRUNCATED_TRUE1)
    elif Marker == 1:
        return copy.deepcopy(
            DataTestIAM.DATA_LIST_ENTITIES_FOR_POLICY_IS_TRUNCATED_TRUE2)
    else:
        return copy.deepcopy(
            DataTestIAM.DATA_LIST_ENTITIES_FOR_POLICY_IS_TRUNCATED_FALSE)


def side_effect_list_virtual_mfa_devices(Marker=None):
    if Marker is None:
        return copy.deepcopy(
            DataTestIAM.DATA_LIST_VIRTUAL_MFA_DEVICES_IS_TRUNCATED_TRUE1)
    elif Marker == 1:
        return copy.deepcopy(
            DataTestIAM.DATA_LIST_VIRTUAL_MFA_DEVICES_IS_TRUNCATED_TRUE2)
    else:
        return copy.deepcopy(
            DataTestIAM.DATA_LIST_VIRTUAL_MFA_DEVICES_IS_TRUNCATED_FALSE)
