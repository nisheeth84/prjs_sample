import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from premembers.const.const import CommonConst

ACCOUNT_REFINE_INDEX = "AccountRefineIndex"

RESPONSE_EXCLUSION = {
    'ExclusionItemID': "id",
    'OrganizationID': "organizationId",
    'ProjectID': "projectId",
    'AWSAccount': "awsAccount",
    'CheckItemCode': "checkItemCode",
    'ExclusionComment': "exclusionComment",
    'UserID': "userId",
    'MailAddress': "mailAddress",
    'AccountRefineCode': "accountRefineCode",
    'TimeToLive': "timeToLive",
    'CreatedAt': "createdAt",
    'UpdatedAt': "updatedAt"
}


def create(trace_id, exclusion_item_id, organization_id, project_id,
           aws_account, check_item_code, time_to_live, exclusion_comment,
           user_id, email, account_refine_code):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    date_now = common_utils.get_current_date()
    if len(exclusion_comment) == 0:
        exclusion_comment = None
    create_exclusion_item = {
        'ExclusionItemID': exclusion_item_id,
        'OrganizationID': organization_id,
        'ProjectID': project_id,
        'AWSAccount': aws_account,
        'CheckItemCode': check_item_code,
        'ExclusionComment': exclusion_comment,
        'UserID': user_id,
        'MailAddress': email,
        'AccountRefineCode': account_refine_code,
        'TimeToLive': time_to_live,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    DB_utils.create(trace_id, Tables.PM_EXCLUSION_ITEMS, create_exclusion_item)


def query_key(trace_id, exclusion_item_id, convert_response=None,
              is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    key = {"ExclusionItemID": exclusion_item_id}
    result = DB_utils.query_key(trace_id, Tables.PM_EXCLUSION_ITEMS, key)
    if result is not None and convert_response:
        result = common_utils.convert_response(
            trace_id, result, RESPONSE_EXCLUSION)
    return common_utils.response(result, logger)


def delete(trace_id, exclusion_item_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"ExclusionItemID": exclusion_item_id}
    DB_utils.delete(trace_id, Tables.PM_EXCLUSION_ITEMS, key)


def update(trace_id,
           exclusion_item_id,
           update_attribute,
           target_update_date=None):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"ExclusionItemID": exclusion_item_id}
    DB_utils.update(trace_id, Tables.PM_EXCLUSION_ITEMS, key, update_attribute,
                    target_update_date)


def query_filter_account_refine_code(trace_id,
                                     account_refine_code,
                                     group_filter=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'AccountRefineCode': {
            'AttributeValueList': [account_refine_code],
            'ComparisonOperator': 'EQ'
        }
    }
    if common_utils.is_null(group_filter) is False:
        key_conditions['CheckItemCode'] = {
            'AttributeValueList': [CommonConst.GROUP_FILTER_TEMPLATE.format(group_filter)],
            'ComparisonOperator': 'BEGINS_WITH'
        }

    result = DB_utils.query_index(trace_id, Tables.PM_EXCLUSION_ITEMS,
                                  ACCOUNT_REFINE_INDEX, key_conditions, None)
    return common_utils.response(result, pm_logger)
