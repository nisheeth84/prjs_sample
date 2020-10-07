import inspect

from premembers.common import common_utils
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_awsAccountCoops
from premembers.repository import pm_reports, pm_securityCheckWebhook
from premembers.repository import pm_securityCheckWebhookCallHistory
from premembers.organizations.logic import organizationTask_logic
from premembers.reports.logic import reportsBatch_logic


def execute_delete_project(task_id):
    pm_logger = common_utils.begin_logger(task_id, __name__,
                                          inspect.currentframe())

    # check status organization task info
    project_id = organizationTask_logic.check_process_status(task_id)
    if project_id is None:
        pm_logger.error("Error タスク情報を取得します。")
        return False

    return delete_project(task_id, project_id)


def delete_project(task_id, project_id):
    pm_logger = common_utils.begin_logger(task_id, __name__,
                                          inspect.currentframe())
    # get list awscoops with key project_id
    try:
        list_awscoops = pm_awsAccountCoops.query_awscoop_project_index(
            task_id, project_id)
    except PmError as e:
        pm_logger.error("AWSアカウント連携情報取得に失敗しました。: ProjectID=%s", project_id)
        pm_logger.error(e)
        return False

    for awscoop_item in list_awscoops:
        coop_id = awscoop_item["CoopID"]
        try:
            pm_awsAccountCoops.delete_awscoops(task_id, coop_id)
        except PmError as e:
            pm_logger.error("AWSアカウント連携情報削除に失敗しました。: CoopID=%s", coop_id)
            pm_logger.error(e)
            return False

    # get list security check webhook with key project_id
    try:
        list_security_check_webhooks = pm_securityCheckWebhook.query_project_index(
            task_id, project_id)
    except PmError as e:
        pm_logger.error("チェック実行Webhook情報の取得に失敗しました。: ProjectID=%s", project_id)
        pm_logger.error(e)
        return False

    for security_check_webhook in list_security_check_webhooks:
        security_check_webhook_id = security_check_webhook["SecurityCheckWebhookID"]

        # get list security check webhook call history with key security_check_webhook_id
        security_check_webhook_call_historys = pm_securityCheckWebhookCallHistory.query(
            task_id, security_check_webhook_id)

        # delete record pm_securityCheckWebhookCallHistory with security_check_webhook_id, create_at
        for security_check_webhook_call_history in security_check_webhook_call_historys:
            create_at = security_check_webhook_call_history["CreatedAt"]
            try:
                pm_securityCheckWebhookCallHistory.delete(
                    task_id, security_check_webhook_id, create_at)
            except PmError as e:
                pm_logger.error("チェック実行Webhook実行履歴情報削除に失敗しました。: WebhookID=%s",
                                security_check_webhook_id)
                pm_logger.error(e)
                return False

        # delete record pm_securityCheckWebhook with security_check_webhook_id
        try:
            pm_securityCheckWebhook.delete(task_id, security_check_webhook_id)
        except PmError as e:
            pm_logger.error("チェック実行Webhook情報削除に失敗しました。: WebhookID=%s",
                            security_check_webhook_id)
            pm_logger.error(e)
            return False

    # get list reports with key project_id
    try:
        list_reports = pm_reports.query_list_reports_project_index(
            task_id, project_id)
    except PmError as e:
        pm_logger.error("レポート情報取得に失敗しました。: ProjectID=%s", project_id)
        pm_logger.error(e)
        return False

    for report_item in list_reports:
        report_id = report_item["ReportID"]
        try:
            pm_reports.delete_reports(task_id, report_id)
        except PmError as e:
            pm_logger.error("レポート情報削除に失敗しました。: ProjectID=%s", project_id)
            pm_logger.error(e)
            return False
        status_delete_report = reportsBatch_logic.delete_report(
            task_id, report_id)
        if status_delete_report is False:
            return False

    return True
