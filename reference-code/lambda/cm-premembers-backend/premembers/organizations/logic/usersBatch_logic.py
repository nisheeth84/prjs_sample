import inspect
import jmespath

from premembers.common import common_utils
from premembers.exception.pm_exceptions import PmError
from premembers.repository import pm_orgNotifyMailDestinations
from premembers.organizations.logic import organizationTask_logic
from premembers.const.const import CommonConst


def execute_delete_organization_user(task_id):
    pm_logger = common_utils.begin_logger(task_id, __name__,
                                          inspect.currentframe())
    # タスク情報を取得します。
    # タスク情報のステータスチェックを行います。
    target = organizationTask_logic.check_process_status(task_id)
    if target is None:
        pm_logger.error("組織タスク情報取得に失敗しました。: TaskID=%s", task_id)
        raise PmError()

    # タスク情報から処理対象（ユーザーID,組織ID）を取得します。
    target = target.split(CommonConst.COMMA)
    user_id = target[0]
    organization_id = target[1]

    # 削除処理
    # 組織別通知メール宛先テーブル(PM_OrgNotifyMailDestinations)に組織ID{organization_id}をキーとしてクエリを実行し、対象情報を取得する。
    try:
        org_notify_mail_destinations = pm_orgNotifyMailDestinations.query_key(
            task_id, organization_id, CommonConst.NOTIFY_CODE)
    except PmError as e:
        pm_logger.error("組織別通知メール宛先情報取得に失敗しました。: OrganizationID=%s",
                        organization_id)
        raise common_utils.write_log_pm_error(e, pm_logger)

    # キーに合致するレコードが存在しなかった場合
    if (not org_notify_mail_destinations):
        # 処理を正常終了する。
        return

    # 取得したレコードのDestinationsのListデータを編集する。
    destinations = jmespath.search(
        "[?UserID != '{0}']".format(user_id),
        org_notify_mail_destinations['Destinations'])

    # 編集後のDestinationsは、組織別通知メール宛先テーブル(PM_OrgNotifyMailDestinations)へ組織ID{organization_id}をキーとしてupdate_itemで更新する。（UpdatedAtも現在日時で更新する）
    try:
        if (len(destinations) == 0):
            # 編集後のDestinationsのListデータが０件になる場合、組織別通知メール宛先テーブル(PM_OrgNotifyMailDestinations)の該当レコードを削除する。
            pm_orgNotifyMailDestinations.delete(task_id, organization_id,
                                                CommonConst.NOTIFY_CODE)
        else:
            attribute = {'Destinations': {"Value": destinations}}
            pm_orgNotifyMailDestinations.update(
                task_id, organization_id, CommonConst.NOTIFY_CODE, attribute)
    except PmError as e:
        pm_logger.error("組織別通知メール宛先情報の更新に失敗しました。: OrganizationID=%s",
                        organization_id)
        raise common_utils.write_log_pm_error(e, pm_logger)
