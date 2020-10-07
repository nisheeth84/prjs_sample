from premembers.check.logic.check_asc import asc_item_common_logic


def check_asc_item_03_01(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path):
    return asc_item_common_logic.check_asc_item_copy_cis_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, "CHECK_CIS12_ITEM_2_01")
