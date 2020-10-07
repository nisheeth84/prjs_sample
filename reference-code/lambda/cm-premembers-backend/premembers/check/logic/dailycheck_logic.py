import inspect

from premembers.common import common_utils, aws_common, FileUtils
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_projects, pm_batchJobDefs, pm_checkHistory
from premembers.const.const import CommonConst


def execute_check_job_launcher(trace_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    # プロジェクト一覧の取得
    list_project, segment = pm_projects.get_projects_effective_enable(trace_id)

    count_submit_job = 0
    for project in list_project:
        # ログID（UUID（v４））
        project_id = project['ProjectID']
        organization_id = project['OrganizationID']

        # チェック履歴テーブルに新規のチェック履歴レコードを作成します。
        try:
            check_history_id = common_utils.get_uuid4()
            executed_date_time = common_utils.get_current_date()
            pm_checkHistory.create(trace_id, check_history_id, organization_id,
                                   project_id, "CHECK_SECURITY", 0, None,
                                   "AUTO", None, executed_date_time, None,
                                   CommonConst.SYSTEM)
        except PmError as e:
            pm_logger.error("チェック履歴レコード作成に失敗しました。: ProjectID=%s", project_id)
            pm_logger.error(e)

        # セキュリティチェック処理ジョブの設定
        # セキュリティチェック結果集計処理ジョブの設定
        # セキュリティチェック結果レポート出力処理ジョブの設定
        LIST_CODE_CHECK_SECURITY = [
            'CHECK_SECURITY_EXEC', 'CHECK_SECURITY_AGGREGATE',
            'CHECK_SECURITY_REPORT'
        ]
        job_id = []
        for code_security in LIST_CODE_CHECK_SECURITY:
            result, job_id = job_check_security(
                trace_id, project_id, check_history_id, code_security, job_id)
            if result is True:
                count_submit_job += 1

    # ジョブサブミット実績をログに出力する。
    pm_logger.info("チェック処理ジョブをサブミットしました。: 取得回数=%s、ジョブサブミット件数=%s", segment,
                   count_submit_job)
    return True


def job_check_security(trace_id, project_id, check_history_id, code, job_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    try:
        batch_job_def = pm_batchJobDefs.query_report_job_def_key(
            trace_id, code)
    except PmError as e:
        pm_logger.error("バッチジョブ定義の取得に失敗しました。: %s", code)
        pm_logger.error(e)
        return False, None
    if not batch_job_def:
        pm_logger.error("ジョブ定義情報が取得できませんでした。:%s", code)
        return False, None
    # ログID（UUID（v４））
    log_id = common_utils.get_uuid4()

    # AWS Batch
    job_name = code + "--" + check_history_id + "--" + log_id
    job_queue = batch_job_def['JobQueue']
    job_definition = batch_job_def['JobDefinition']
    check_history_id_param = check_history_id
    log_id_param = log_id
    if (code == 'CHECK_SECURITY_REPORT'):
        check_history_id_param = "--checkHistoryId=" + check_history_id
        log_id_param = "--logId=" + log_id
    parameters = {
        "CheckHistoryID": check_history_id_param,
        "LogID": log_id_param
    }
    container_overrides = {}
    if (common_utils.check_key('Environment', batch_job_def) and len(
            batch_job_def['Environment']) > 0):
        container_overrides = batch_job_def['Environment']
    max_retry = batch_job_def['MaxRetry']

    try:
        # submid job
        job_id, parameter = aws_common.submit_job(
            trace_id, job_name, job_queue, job_id, job_definition, parameters,
            container_overrides, max_retry)
    except PmError as e:
        pm_logger.error("セキュリティチェック処理ジョブ（%s）の送信に失敗しました。: ProjectID=%s", code,
                        project_id)
        return False, None
    # セキュリティチェック結果レポート出力処理ジョブ履歴ファイルを作成し、S3に保存します。
    job_id_key = job_id[0]['jobId']
    date_now = common_utils.get_current_date()
    try:
        check_log = {
            'ProjectID': project_id,
            'CheckHistoryID': check_history_id,
            'LogID': log_id,
            'Code': code,
            'UserID': 'Check-Job-Launcher',
            'MailAddress': 'Check-Job-Launcher',
            'JobID': job_id_key,
            'Parameter': parameter,
            'CreatedAt': date_now,
            'UpdatedAt': date_now
        }
        s3_file_name = CommonConst.PATH_BATCH_CHECK_LOG.format(
            check_history_id, log_id + ".json")
        FileUtils.upload_json(trace_id, "S3_BATCH_LOG_BUCKET", check_log,
                              s3_file_name)
    except PmError as e:
        pm_logger.error("セキュリティチェックジョブ履歴ファイルの作成に失敗しました。: ProjectID=%s, LogID=%s",
                        project_id, log_id)
        return False, None
    return True, job_id
