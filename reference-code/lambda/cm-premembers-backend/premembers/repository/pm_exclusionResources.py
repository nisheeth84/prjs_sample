import inspect

from premembers.repository.table_list import Tables
from boto3.dynamodb.conditions import Attr
from premembers.common import common_utils
from premembers.repository import DB_utils
from premembers.const.const import CommonConst

CHECK_ITEM_REFINE_INDEX = 'CheckItemRefineIndex'
ACCOUNT_REFINE_INDEX = 'AccountRefineIndex'

RESPONSE_EXCLUSION_RESOURCES = {
    'ExclusionResourceID': "id",
    'OrganizationID': "organizationId",
    'ProjectID': "projectId",
    'AWSAccount': "awsAccount",
    'CheckItemCode': "checkItemCode",
    'RegionName': "regionName",
    'ResourceType': "resourceType",
    'ResourceName': "resourceName",
    'ExclusionComment': "exclusionComment",
    'MailAddress': "mailAddress",
    'CreatedAt': "createdAt",
    'UpdatedAt': "updatedAt"
}


def query_key(trace_id, exclusion_resource_id, convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key = {"ExclusionResourceID": exclusion_resource_id}
    result = DB_utils.query_key(trace_id, Tables.PM_EXCLUSION_RESOURCES, key)
    if result is not None and convert_response:
        result = common_utils.convert_response(trace_id, result,
                                               RESPONSE_EXCLUSION_RESOURCES)
    return common_utils.response(result, pm_logger)


def create(user_id, exclusion_resource_id, organization_id, project_id,
           aws_account, check_item_code, region_name, resource_type,
           resource_name, exclusion_comment, email, account_refine_code,
           check_item_refine_code, time_to_live):
    common_utils.begin_logger(user_id, __name__, inspect.currentframe())
    date_now = common_utils.get_current_date()
    if len(exclusion_comment) == 0:
        exclusion_comment = None
    create_exclusion_resources = {
        'ExclusionResourceID': exclusion_resource_id,
        'OrganizationID': organization_id,
        'ProjectID': project_id,
        'AWSAccount': aws_account,
        'CheckItemCode': check_item_code,
        'RegionName': region_name,
        'ResourceType': resource_type,
        'ResourceName': resource_name,
        'ExclusionComment': exclusion_comment,
        'UserID': user_id,
        'MailAddress': email,
        'AccountRefineCode': account_refine_code,
        'CheckItemRefineCode': check_item_refine_code,
        'TimeToLive': time_to_live,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    DB_utils.create(user_id, Tables.PM_EXCLUSION_RESOURCES,
                    create_exclusion_resources)


def update(trace_id,
           exclusion_resource_id,
           update_attribute,
           target_update_date=None):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"ExclusionResourceID": exclusion_resource_id}
    DB_utils.update(trace_id, Tables.PM_EXCLUSION_RESOURCES, key,
                    update_attribute, target_update_date)


def query_check_item_refine_code(trace_id,
                                 check_item_refine_code,
                                 filter_expression=None,
                                 convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'CheckItemRefineCode': {
            'AttributeValueList': [check_item_refine_code],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query_index(trace_id, Tables.PM_EXCLUSION_RESOURCES,
                                  CHECK_ITEM_REFINE_INDEX, key_conditions,
                                  filter_expression)
    if result and convert_response:
        result = common_utils.convert_list_response(
            trace_id, result, RESPONSE_EXCLUSION_RESOURCES)
    return common_utils.response(result, pm_logger)


def query_filter_region_name_and_resource_name(
        trace_id, check_item_refine_code, region_name, resource_type,
        resource_name):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    filter = Attr('ResourceName').eq(str(resource_name)).__and__(
        Attr('ResourceType').eq(str(resource_type))).__and__(
            Attr('RegionName').eq(str(region_name)))
    results = query_check_item_refine_code(trace_id, check_item_refine_code,
                                           filter)
    return common_utils.response(results, pm_logger)


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

    result = DB_utils.query_index(trace_id, Tables.PM_EXCLUSION_RESOURCES,
                                  ACCOUNT_REFINE_INDEX, key_conditions,
                                  None)
    return common_utils.response(result, pm_logger)


def query_account_refine_index(trace_id,
                               account_refine_code,
                               filter_expression=None,
                               convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'AccountRefineCode': {
            'AttributeValueList': [account_refine_code],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query_index(trace_id, Tables.PM_EXCLUSION_RESOURCES,
                                  ACCOUNT_REFINE_INDEX, key_conditions,
                                  filter_expression)
    if result and convert_response:
        result = common_utils.convert_list_response(
            trace_id,
            result,
            RESPONSE_EXCLUSION_RESOURCES
        )

    return common_utils.response(result, pm_logger)


def delete(trace_id, exclusion_resource_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"ExclusionResourceID": exclusion_resource_id}
    DB_utils.delete(trace_id, Tables.PM_EXCLUSION_RESOURCES, key)
