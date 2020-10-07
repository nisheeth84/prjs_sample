import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from boto3.dynamodb.conditions import Attr
from premembers.const.const import CommonConst

ORGANIZATION_INDEX = 'OrganizationIndex'
ACCOUNT_REFINE_INDEX = 'AccountRefineIndex'

RESPONSE_ASSESSMENT = {
    'AssessmentItemID': "assessmentItemId",
    'OrganizationID': "organizationId",
    'ProjectID': "projectId",
    'AWSAccount': "awsAccount",
    'CheckItemCode': "checkItemCode",
    'AssessmentComment': "assessmentComment",
    'UserID': "userId",
    'MailAddress': "mailAddress",
    'AccountRefineCode': "accountRefineCode",
    'TimeToLive': "timeToLive",
    'CreatedAt': "createdAt",
    'UpdatedAt': "updatedAt"
}


def query_key(trace_id, assessment_item_id, convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key = {"AssessmentItemID": assessment_item_id}
    result = DB_utils.query_key(trace_id, Tables.PM_ASSESSMENT_ITEMS, key)
    if result is not None and convert_response:
        result = common_utils.convert_response(
            trace_id, result, RESPONSE_ASSESSMENT)
    return common_utils.response(result, pm_logger)


def create(trace_id, assessment_item_id, organization_id, project_id,
           aws_account, check_item_code, time_to_live, assessment_comment,
           user_id, email, account_refine_code):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    date_now = common_utils.get_current_date()
    if len(assessment_comment) == 0:
        assessment_comment = None
    create_assessment = {
        'AssessmentItemID': assessment_item_id,
        'OrganizationID': organization_id,
        'ProjectID': project_id,
        'AWSAccount': aws_account,
        'CheckItemCode': check_item_code,
        'AssessmentComment': assessment_comment,
        'UserID': user_id,
        'MailAddress': email,
        'AccountRefineCode': account_refine_code,
        'TimeToLive': time_to_live,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    DB_utils.create(trace_id, Tables.PM_ASSESSMENT_ITEMS, create_assessment)


def delete(trace_id, assessment_item_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"AssessmentItemID": assessment_item_id}
    DB_utils.delete(trace_id, Tables.PM_ASSESSMENT_ITEMS, key)


def update(trace_id,
           assessment_item_id,
           update_attribute,
           target_update_date=None):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"AssessmentItemID": assessment_item_id}
    DB_utils.update(trace_id, Tables.PM_ASSESSMENT_ITEMS, key,
                    update_attribute, target_update_date)


def query_organization_index(trace_id,
                             organization_id,
                             project_id,
                             filter_expression=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'OrganizationID': {
            'AttributeValueList': [organization_id],
            'ComparisonOperator': 'EQ'
        },
        'ProjectID': {
            'AttributeValueList': [project_id],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query_index(trace_id, Tables.PM_ASSESSMENT_ITEMS,
                                  ORGANIZATION_INDEX, key_conditions,
                                  filter_expression)
    return common_utils.response(result, pm_logger)


def query_organization_index_filter_awsaccount(trace_id, organization_id,
                                               project_id, aws_account, email,
                                               is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    filter = Attr('AWSAccount').eq(aws_account)
    results = query_organization_index(trace_id, organization_id, project_id,
                                       filter)
    return common_utils.response(results, logger)


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

    result = DB_utils.query_index(trace_id, Tables.PM_ASSESSMENT_ITEMS,
                                  ACCOUNT_REFINE_INDEX, key_conditions,
                                  None)
    return common_utils.response(result, pm_logger)
