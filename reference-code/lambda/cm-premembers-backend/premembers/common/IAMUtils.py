import time
import inspect

from retry import retry
from premembers.common import common_utils
from botocore.exceptions import ClientError
from premembers.const.const import CommonConst
from premembers.repository.const import Members
from premembers.exception.pm_exceptions import PmError


@retry(PmError, tries=3, delay=2, backoff=1)
def get_credential_report(trace_id, session, awsaccount):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 対象AWSアカウントに対する接続を作成します。
    try:
        client = session.client(service_name="iam")
    except ClientError as e:
        pm_logger.error("[%s] IAMクライアント作成に失敗しました。", awsaccount)
        raise common_utils.write_log_exception(e, pm_logger)

    # IAMユーザーのCredentialReportを取得します。
    try:
        result = client.generate_credential_report()
        while (result['State'] != 'COMPLETE'):
            time.sleep(2)
            result = client.generate_credential_report()
        credential_report = client.get_credential_report()
    except ClientError as e:
        pm_logger.error("[%s] CredentialReportの取得に失敗しました。", awsaccount)
        raise common_utils.write_log_exception(e, pm_logger)

    # return data
    if common_utils.check_key("Content", credential_report):
        return str(credential_report['Content'].decode())
    return []


@retry(PmError, tries=3, delay=2, backoff=1)
def get_account_password_policy(trace_id, session, awsaccount):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 対象AWSアカウントに対する接続を作成します。
    try:
        client = session.client(service_name="iam")
    except ClientError as e:
        pm_logger.error("[%s] IAMクライアント作成に失敗しました。", awsaccount)
        raise common_utils.write_log_exception(e, pm_logger)

    # IAMのアカウントパスワードポリシー情報を取得します。
    try:
        account_password_policy = client.get_account_password_policy()
    except ClientError as e:
        if e.response['Error']['Code'] == CommonConst.NO_SUCH_ENTITY:
            pm_logger.error("[%s] アカウントパスワードポリシーが設定されていません。", awsaccount)
        else:
            pm_logger.error("[%s] アカウントパスワードポリシー情報の取得に失敗しました。", awsaccount)
        raise common_utils.write_log_exception(e, pm_logger)

    # return data
    if common_utils.check_key("PasswordPolicy", account_password_policy):
        return account_password_policy['PasswordPolicy']
    return []


@retry(PmError, tries=3, delay=2, backoff=1)
def get_list_users(trace_id, session, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 対象AWSアカウントに対する接続を作成します。
    try:
        client = session.client(service_name="iam")
    except ClientError as e:
        pm_logger.error("[%s] IAMクライアント作成に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, pm_logger)
    try:
        response = client.list_users()
        users = response['Users']
        is_truncated = response['IsTruncated']
        while (is_truncated is True):
            marker = response['Marker']
            response = client.list_users(Marker=marker)
            users.extend(response['Users'])
            is_truncated = response['IsTruncated']
    except ClientError as e:
        pm_logger.error("[%s] IAMユーザー一覧情報の取得に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, pm_logger)
    return users


@retry(PmError, tries=3, delay=2, backoff=1)
def get_list_attached_user_policies(trace_id, iam_client, aws_account,
                                    iam_user_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 対象AWSアカウントに対する接続を作成します。
    try:
        response = iam_client.list_attached_user_policies(
            UserName=iam_user_name)
        list_attached_user_policies = response['AttachedPolicies']
        is_truncated = response['IsTruncated']
        while (is_truncated is True):
            marker = response['Marker']
            response = iam_client.list_attached_user_policies(
                UserName=iam_user_name, Marker=marker)
            list_attached_user_policies.extend(response['AttachedPolicies'])
            is_truncated = response['IsTruncated']
    except ClientError as e:
        pm_logger.error("[%s] IAMユーザー（%s）にアタッチされた管理ポリシー一覧情報の取得に失敗しました。",
                        aws_account, iam_user_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return list_attached_user_policies


@retry(PmError, tries=3, delay=2, backoff=1)
def get_list_user_policies(trace_id, session, aws_account, iam_user_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 対象AWSアカウントに対する接続を作成します。
    try:
        client = session.client(service_name="iam")
    except ClientError as e:
        pm_logger.error("[%s] IAMクライアント作成に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, pm_logger)
    try:
        response = client.list_user_policies(UserName=iam_user_name)
        list_user_policies = response['PolicyNames']
        is_truncated = response['IsTruncated']
        while (is_truncated is True):
            marker = response['Marker']
            response = client.list_user_policies(
                UserName=iam_user_name, Marker=marker)
            list_user_policies.extend(response['PolicyNames'])
            is_truncated = response['IsTruncated']
    except ClientError as e:
        pm_logger.error("[%s] IAMユーザー（%s）に付与されたインラインポリシー一覧情報の取得に失敗しました。",
                        aws_account, iam_user_name)
        raise common_utils.write_log_exception(e, pm_logger)
    return list_user_policies


@retry(PmError, tries=3, delay=2, backoff=1)
def get_list_policies(trace_id, session, awsaccount):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 対象AWSアカウントに対する接続を作成します。
    try:
        client = session.client(service_name="iam")
    except ClientError as e:
        pm_logger.error("[%s] IAMクライアント作成に失敗しました。", awsaccount)
        raise common_utils.write_log_exception(e, pm_logger)

    # IAMのアカウントパスワードポリシー情報を取得します。
    policies = []
    try:
        response = client.list_policies()
        if common_utils.check_key("Policies", response):
            policies = response["Policies"]

        # AWS SDKを用いて複数件のリソース情報取得を行う際の注意事項
        is_truncated = response['IsTruncated']
        while (is_truncated is True):
            marker = response['Marker']
            response = client.list_policies(Marker=marker)
            policies.extend(response['Policies'])
            is_truncated = response['IsTruncated']
    except ClientError as e:
        pm_logger.error("[%s] ポリシー一覧情報の取得に失敗しました。", awsaccount)
        raise common_utils.write_log_exception(e, pm_logger)

    # return data
    return policies


@retry(PmError, tries=3, delay=2, backoff=1)
def get_policy_version(trace_id, client, aws_account, policy_arn, version_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        response = client.get_policy_version(
            PolicyArn=policy_arn, VersionId=version_id)
    except ClientError as e:
        pm_logger.error("[%s]ポリシー情報の取得に失敗しました。（%s）",
                        aws_account, policy_arn)
        raise common_utils.write_log_exception(e, pm_logger)
    if common_utils.check_key("PolicyVersion", response):
        return response['PolicyVersion']
    return []


@retry(PmError, tries=3, delay=2, backoff=1)
def list_entities_for_policy(trace_id, session, aws_account, policy_arn):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 対象AWSアカウントに対する接続を作成します。
    try:
        client = session.client(service_name="iam")
    except ClientError as e:
        pm_logger.error("[%s] IAMクライアント作成に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, pm_logger)
    try:
        response = client.list_entities_for_policy(PolicyArn=policy_arn)
        if (len(response) == 0):
            return []
        policy_groups = response['PolicyGroups']
        policy_users = response['PolicyUsers']
        policy_roles = response['PolicyRoles']
        is_truncated = response['IsTruncated']
        while (is_truncated is True):
            marker = response['Marker']
            response = client.list_entities_for_policy(
                PolicyArn=policy_arn, Marker=marker)
            policy_groups.extend(response['PolicyGroups'])
            policy_users.extend(response['PolicyUsers'])
            policy_roles.extend(response['PolicyRoles'])
            is_truncated = response['IsTruncated']
    except ClientError as e:
        pm_logger.error("[%s]ポリシーエンティティ情報の取得に失敗しました。（%s）", aws_account,
                        policy_arn)
        raise common_utils.write_log_exception(e, pm_logger)
    list_entities_for_policy = {}
    list_entities_for_policy['PolicyGroups'] = policy_groups
    list_entities_for_policy['PolicyUsers'] = policy_users
    list_entities_for_policy['PolicyRoles'] = policy_roles
    return list_entities_for_policy


@retry(PmError, tries=3, delay=2, backoff=1)
def get_account_summary(trace_id, session, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 対象AWSアカウントに対する接続を作成します。
    try:
        client = session.client(service_name="iam")
    except ClientError as e:
        pm_logger.error("[%s] IAMクライアント作成に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, pm_logger)
    try:
        response = client.get_account_summary()
    except ClientError as e:
        pm_logger.error("[%s] アカウントサマリーの取得に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, pm_logger)

    if common_utils.check_key("SummaryMap", response):
        return response['SummaryMap']
    return []


@retry(PmError, tries=3, delay=2, backoff=1)
def list_virtual_mfa_devices(trace_id, session, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # 対象AWSアカウントに対する接続を作成します。
    try:
        client = session.client(service_name="iam")
    except ClientError as e:
        pm_logger.error("[%s] IAMクライアント作成に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, pm_logger)
    try:
        response = client.list_virtual_mfa_devices()
        virtual_mfa_devices = response['VirtualMFADevices']
        is_truncated = response['IsTruncated']
        while (is_truncated is True):
            marker = response['Marker']
            response = client.list_virtual_mfa_devices(Marker=marker)
            virtual_mfa_devices.extend(response['VirtualMFADevices'])
            is_truncated = response['IsTruncated']
    except ClientError as e:
        pm_logger.error("[%s]仮想MFAデバイスリストの取得に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, pm_logger)
    return virtual_mfa_devices


@retry(PmError, tries=3, delay=2, backoff=1)
def get_iam_client(trace_id, session, aws_account, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        iam_client = session.client(service_name="iam")
    except ClientError as e:
        logger.error("[%s] IAMクライアント作成に失敗しました。", aws_account)
        raise common_utils.write_log_exception(e, logger)
    return iam_client


@retry(PmError, tries=3, delay=2, backoff=1)
def get_role(trace_id, iam_client, role_name, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    try:
        response = iam_client.get_role(RoleName=role_name)
    except ClientError as e:
        raise common_utils.write_log_warning(e, logger)
    return response


@retry(PmError, tries=3, delay=2, backoff=1)
def get_membership_aws_account(trace_id, session, aws_account):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # デフォルト値はメンバーズに加入していないAWSアカウントです。
    members = Members.Disable

    # 対象AWSアカウントに対する接続を作成します。
    try:
        client = session.client(service_name="iam")
    except ClientError as e:
        pm_logger.error("[%s] IAMクライアント作成に失敗しました。", aws_account)
        return members

    # IAMクライアントを用いて、IAMロールcm-membersportalを取得します。
    cm_members_role_name = common_utils.get_environ(
        CommonConst.CM_MEMBERS_ROLE_NAME, CommonConst.CM_MEMBERS_PORTAL)
    try:
        get_role(trace_id, client, cm_members_role_name)
        members = Members.Enable
        pm_logger.info("[%s] IAMロール「%s」が存在します。", aws_account,
                       cm_members_role_name)
    except PmError as e:
        if e.cause_error.response['Error'][
                'Code'] == CommonConst.NO_SUCH_ENTITY:
            pm_logger.info("[%s] IAMロール「%s」が存在しません。", aws_account,
                           cm_members_role_name)
        else:
            pm_logger.warning("[%s] IAMロール「%s」の取得に失敗しました。", aws_account,
                              cm_members_role_name)
    return members
