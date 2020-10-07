import inspect

from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr
from premembers.common import common_utils

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


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_EXCLUSION_RESOURCES.value)
    db_utils.create_table(script)


def create(data_exclusion_resources):
    condition_expression = Attr("ExclusionResourceID").not_exists()
    db_utils.create(Tables.PM_EXCLUSION_RESOURCES, data_exclusion_resources,
                    condition_expression)


def query_key(exclusion_resource_id):
    key = {"ExclusionResourceID": exclusion_resource_id}
    result = db_utils.query_key(Tables.PM_EXCLUSION_RESOURCES, key)
    return result


def delete(exclusion_resource_id):
    key = {"ExclusionResourceID": exclusion_resource_id}
    db_utils.delete(Tables.PM_EXCLUSION_RESOURCES, key)


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
    result = db_utils.query_index(Tables.PM_EXCLUSION_RESOURCES,
                                  ACCOUNT_REFINE_INDEX, key_conditions,
                                  filter_expression)
    if result and convert_response:
        result = common_utils.convert_list_response(
            trace_id,
            result,
            RESPONSE_EXCLUSION_RESOURCES
        )

    return common_utils.response(result, pm_logger)
