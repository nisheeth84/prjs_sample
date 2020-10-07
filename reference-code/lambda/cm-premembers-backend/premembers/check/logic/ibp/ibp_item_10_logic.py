from premembers.check.logic.ibp import ibp_item_common_logic


def check_ibp_item_10_01(trace_id, check_item_code, check_history_id,
                         organization_id, project_id, aws_account,
                         result_json_path):
    return ibp_item_common_logic.execute_check_ibp_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path)
