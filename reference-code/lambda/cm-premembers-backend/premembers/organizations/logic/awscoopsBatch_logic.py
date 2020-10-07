import inspect

from premembers.common import common_utils, aws_common
from premembers.organizations.logic import organizationTask_logic
from premembers.repository import pm_awsAccountCoops
from premembers.exception.pm_exceptions import PmError
from premembers.repository.const import Effective


def execute_confirm_awscoop(task_id):
    pm_logger = common_utils.begin_logger(task_id, __name__,
                                          inspect.currentframe())

    coop_id = organizationTask_logic.check_process_status(task_id)
    if coop_id is None:
        pm_logger.error("組織タスク情報取得に失敗しました。: TaskID=%s", task_id)
        raise PmError()

    try:
        awscoop = pm_awsAccountCoops.query_awscoop_coop_key(task_id, coop_id)
    except PmError as e:
        pm_logger.error("AWSアカウント連携情報取得に失敗しました。: CoopID=%s", coop_id)
        raise common_utils.write_log_pm_error(e, pm_logger, exc_info=True)

    if (not awscoop):
        pm_logger.warning("AWSアカウント連携情報がありません。: CoopID=%s", coop_id)
        raise PmError()

    try:
        aws_common.create_session_client(task_id, awscoop['AWSAccount'],
                                         awscoop['RoleName'],
                                         awscoop['ExternalID'])
        pm_logger.info("クレデンシャルが正常に取得されました。: CoopID=%s", coop_id)
    except PmError as err:
        pm_logger.error("クレデンシャル取得に失敗しました。: CoopID=%s", coop_id)
        try:
            attribute = {'Effective': {"Value": Effective.Disable.value}}
            pm_awsAccountCoops.update_awscoops(task_id, coop_id, attribute)
        except PmError as e:
            pm_logger.error("AWSアカウント連携情報の更新に失敗しました。: CoopID=%s", coop_id)
            raise common_utils.write_log_pm_error(
                err, pm_logger, exc_info=True)
