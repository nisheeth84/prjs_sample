from premembers.check.logic.check_asc import asc_item_common_logic
from premembers.repository.const import CheckResult


def check_asc_item_10_01(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path):
    check_result = asc_item_common_logic.check_asc_item_copy_cis_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, "CHECK_CIS12_ITEM_1_19")

    if check_result == CheckResult.MinorInadequacies:
        return CheckResult.CriticalDefect
    return check_result
