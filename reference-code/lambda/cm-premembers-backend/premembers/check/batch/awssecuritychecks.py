import inspect
import json

from premembers.common import common_utils, eventhelper
from premembers.check.logic import awssecuritychecks_logic


def execute_securitycheck_statemachine_handler(event, context):
    # Amazon SNSメッセージを取得
    message = eventhelper.get_message_from_sns(event)
    message = json.loads(message)

    # 必要な情報を取得
    check_history_id = eventhelper.get_check_history_id_batch(message)
    trace_id = check_history_id
    common_utils.begin_cw_logger(trace_id, __name__, inspect.currentframe())

    # セキュリティチェックStepFunctions起動
    awssecuritychecks_logic.execute_securitycheck_statemachine(
        trace_id, check_history_id)


def get_check_awsaccounts_handler(event, context):
    # 必要な情報を取得
    check_history_id = eventhelper.get_check_history_id_batch(event)
    trace_id = check_history_id
    common_utils.begin_cw_logger(trace_id, __name__, inspect.currentframe())

    # セキュリティチェック対象AWSアカウント取得
    return awssecuritychecks_logic.get_check_awsaccounts(
                                trace_id, check_history_id)


def check_effective_awsaccount_handler(event, context):
    # 必要な情報を取得
    check_history_id = eventhelper.get_check_history_id_batch(event)
    trace_id = check_history_id
    coop_id = eventhelper.get_coop_id_batch(event)
    role_name = eventhelper.get_role_name(event)
    external_id = eventhelper.get_external_id(event)
    organization_id = eventhelper.get_organization_id_batch(event)
    project_id = eventhelper.get_project_id_batch(event)

    common_utils.begin_cw_logger(trace_id, __name__, inspect.currentframe())

    # 対象となるAWSアカウント
    target_aws_account = eventhelper.get_awsaccount(event)

    # AWSアカウントチェック
    return awssecuritychecks_logic.check_effective_awsaccount(
        trace_id, target_aws_account, coop_id, role_name, external_id,
        organization_id, project_id, check_history_id)


def execute_cis_check_handler(event, context):
    check_history_id = eventhelper.get_check_history_id_batch(event)
    trace_id = check_history_id
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    # セキュリティチェックCIS実行
    return {"cis-result": "true"}


def execute_asc_check_handler(event, context):
    check_history_id = eventhelper.get_check_history_id_batch(event)
    trace_id = check_history_id
    aws_account = eventhelper.get_awsaccount(event)
    coop_id = eventhelper.get_coop_id_batch(event)
    aws_account_name = eventhelper.get_awsaccount_name_batch(event)
    role_name = eventhelper.get_role_name(event)
    external_id = eventhelper.get_external_id(event)
    organization_id = eventhelper.get_organization_id_batch(event)
    organization_name = eventhelper.get_organization_name_batch(event)
    project_id = eventhelper.get_project_id_batch(event)
    project_name = eventhelper.get_project_name_batch(event)
    check_result_id = eventhelper.get_check_result_id_batch(event)
    effective_awsaccount = eventhelper.get_effective_awsaccount(event)
    common_utils.begin_cw_logger(trace_id, __name__, inspect.currentframe())

    # セキュリティチェックASC実行
    return awssecuritychecks_logic.execute_asc_check(
        trace_id, aws_account, coop_id, aws_account_name, role_name,
        external_id, organization_id, organization_name, project_id,
        project_name, check_history_id, check_result_id, effective_awsaccount)


def execute_ibp_check_handler(event, context):
    check_history_id = eventhelper.get_check_history_id_batch(event)
    trace_id = check_history_id
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    # セキュリティチェックIBP実行
    return {"ibp-result": "true"}


def execute_securitycheck_aggregate_handler(event, context):
    check_history_id = eventhelper.get_check_history_id_batch(event)
    trace_id = check_history_id
    common_utils.begin_cw_logger(trace_id, __name__, inspect.currentframe())
    # セキュリティチェック結果集計
    return awssecuritychecks_logic.execute_securitycheck_aggregate(
                                trace_id, check_history_id)


def create_report_batch_job_handler(event, context):
    check_history_id = eventhelper.get_check_history_id_batch(event)
    trace_id = check_history_id
    common_utils.begin_cw_logger(trace_id, __name__, inspect.currentframe())
    # セキュリティチェックレポート作成ジョブ登録
    return awssecuritychecks_logic.create_report_batch_job(
                                trace_id, check_history_id)
