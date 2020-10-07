from premembers.check.logic.asc import asc_item_common_logic
from premembers.const.const import CommonConst


def check_asc_item_05_01(trace_id, check_item_code, check_history_id,
                         organization_id, project_id, aws_account,
                         result_json_path):
    return asc_item_common_logic.execute_check_asc_results_assessment(
        trace_id, check_item_code, check_history_id, organization_id,
        project_id, aws_account, result_json_path, CommonConst.LEVEL_CODE_1)
