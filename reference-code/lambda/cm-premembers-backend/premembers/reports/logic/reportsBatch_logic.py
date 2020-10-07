import inspect

from premembers.common import common_utils, aws_common
from premembers.organizations.logic import organizationTask_logic


def execute_delete_report(task_id):
    pm_logger = common_utils.begin_logger(task_id, __name__,
                                          inspect.currentframe())
    # タスク情報を取得します。
    report_id = organizationTask_logic.check_process_status(task_id)
    if report_id is None:
        pm_logger.error("Error タスク情報を取得します。")
        return False

    # delete report
    return delete_report(task_id, report_id)


def delete_report(task_id, report_id):
    common_utils.begin_logger(task_id, __name__, inspect.currentframe())
    # レポートファイルをS3から削除します
    aws_common.s3_delete_report(task_id, report_id)
    return True
