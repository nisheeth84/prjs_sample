import inspect
import time

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from boto3.dynamodb.conditions import Attr
from premembers.repository import DB_utils, pm_awsAccountCoops
from premembers.exception.pm_exceptions import PmError

ORGANIZATION_INDEX = 'OrganizationIndex'

RESPONSE_PROJECTS = {
    'ProjectID': 'id',
    'ProjectName': 'name',
    'Description': 'description',
    'OrganizationID': 'organizationId',
    'CreatedAt': 'createdAt',
    'UpdatedAt': 'updatedAt'
}


def query_organization_index(trace_id, organization_id,
                             filter_expression=None, convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'OrganizationID': {
            'AttributeValueList': [organization_id],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query_index(trace_id, Tables.PM_PROJECTS,
                                  ORGANIZATION_INDEX, key_conditions,
                                  filter_expression)

    if convert_response:
        result = common_utils.convert_list_response(
            trace_id, result, RESPONSE_PROJECTS)
    return common_utils.response(result, pm_logger)


def create_projects(trace_id, project_id, project_name, description,
                    organization_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())

    date_now = common_utils.get_current_date()
    # 不要なクラムを作成することを避けるため
    create_projects = {
        'ProjectID': project_id,
        'ProjectName': project_name,
        'Description': description,
        'OrganizationID': organization_id,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    condition_expression = Attr("ProjectID").not_exists()
    DB_utils.create(trace_id, Tables.PM_PROJECTS, create_projects,
                    condition_expression)


def delete_projects(trace_id, project_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"ProjectID": project_id}
    DB_utils.delete(trace_id, Tables.PM_PROJECTS, key)


def get_projects(trace_id, project_id, filter_expression=None,
                 convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'ProjectID': {
            'AttributeValueList': [project_id],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query(trace_id, Tables.PM_PROJECTS,
                            key_conditions, filter_expression)

    if convert_response:
        result = common_utils.convert_list_response(
            trace_id, result, RESPONSE_PROJECTS)
    return common_utils.response(result, pm_logger)


def update_project(trace_id, project_id, update_attribute, target_update_date):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())

    key = {"ProjectID": project_id}
    DB_utils.update(trace_id, Tables.PM_PROJECTS, key, update_attribute,
                    target_update_date)


def query_project_count(trace_id, project_id, filter_expression=None):
    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    key_conditions = {
        'ProjectID': {
            'AttributeValueList': [project_id],
            'ComparisonOperator': 'EQ'
        }
    }

    count = DB_utils.query_count(trace_id, Tables.PM_PROJECTS, key_conditions,
                                 filter_expression)
    return common_utils.response(count, pm_logger)


def get_projects_by_organization_id(trace_id,
                                    project_id,
                                    organization_id,
                                    convert_response=None):
    # Get logging
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())

    filter = Attr('OrganizationID').eq(organization_id)
    reponse = get_projects(trace_id, project_id, filter, convert_response)
    return common_utils.response(reponse, pm_logger)


def get_all_projects(trace_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    exclusiveStartKey = None
    projects = []
    limit = int(common_utils.get_environ("NUM_OF_PROJECT_ITEMS_PER_1TIME"))
    segment = 0
    while True:
        try:
            result = DB_utils.scan(trace_id, Tables.PM_PROJECTS, limit,
                                   exclusiveStartKey)
            projects.extend(result['Items'])
            if (common_utils.check_key('LastEvaluatedKey', result)):
                exclusiveStartKey = result['LastEvaluatedKey']
            else:
                break
            segment += 1
            time.sleep(1)
        except PmError as e:
            pm_logger.warning("プロジェクト情報取得に失敗しました。: 取得回数=%s、一度に取得する件数=%s",
                              segment, limit)
            break
    return common_utils.response(projects, pm_logger), segment


def get_projects_effective_enable(trace_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    result = []
    list_project, segment = get_all_projects(trace_id)
    for project in list_project:
        list_awscoops = pm_awsAccountCoops.query_awscoop_effective_enable(
            trace_id, project['ProjectID'])
        if len(list_awscoops) > 0:
            result.append(project)
    return common_utils.response(result, pm_logger), segment


def query_key(trace_id, project_id, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    key = {"ProjectID": project_id}
    result = DB_utils.query_key(trace_id,
                                Tables.PM_PROJECTS,
                                key,
                                is_cw_logger=is_cw_logger)
    return common_utils.response(result, logger)
