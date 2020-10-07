from premembers.check.logic.asc import asc_item_common_logic


def check_asc_item_01_01(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path):
    return asc_item_common_logic.check_asc_item_copy_cis_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, "CHECK_CIS12_ITEM_1_12")
