from premembers.check.logic.ibp import ibp_item_common_logic
from premembers.const.const import CommonConst


def check_ibp_item_03_01(trace_id, check_history_id, organization_id,
                         project_id, aws_account, session, result_json_path,
                         check_item_code):
    s3_file_name = CommonConst.PATH_CHECK_RESULT.format(
        check_history_id, organization_id, project_id, aws_account,
        check_item_code + ".json")
    return ibp_item_common_logic.check_ibp_item_copy_item_check(
        trace_id, check_history_id, organization_id, project_id, aws_account,
        session, result_json_path, check_item_code, s3_file_name)
