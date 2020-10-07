import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from boto3.dynamodb.conditions import Attr
from premembers.repository import DB_utils
from premembers.repository.const import Effective

PROJECT_INDEX = 'ProjectIndex'

RESPONSE_AWSCOOPS = {
    'CoopID': 'id',
    'AWSAccount': 'awsAccount',
    'AWSAccountName': 'awsAccountName',
    'Members': 'members',
    'RoleName': 'roleName',
    'ExternalID': 'externalId',
    'Description': 'description',
    'Effective': 'effective',
    'OrganizationID': 'organizationId',
    'ProjectID': 'projectId',
    'CreatedAt': 'createdAt',
    'UpdatedAt': 'updatedAt'
}

RESPONSE_REQUIRED = {"members": 0}


def delete_awscoops(trace_id, coop_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"CoopID": coop_id}
    DB_utils.delete(trace_id, Tables.PM_AWSACCOUNTCOOPS, key)


def create_awscoops(trace_id, coop_id, aws_account, aws_account_name,
                    role_name, external_id, description, effective,
                    organization_id, project_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())

    date_now = common_utils.get_current_date()
    # 不要なクラムを作成することを避けるため
    create_awscoops = {
        'CoopID': coop_id,
        'AWSAccount': aws_account,
        'AWSAccountName': aws_account_name,
        'RoleName': role_name,
        'ExternalID': external_id,
        'Description': description,
        'Effective': effective,
        'OrganizationID': organization_id,
        'ProjectID': project_id,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    condition_expression = Attr("CoopID").not_exists()
    DB_utils.create(trace_id, Tables.PM_AWSACCOUNTCOOPS, create_awscoops,
                    condition_expression)


def get_awscoops_update(trace_id, coop_id, project_id, organization_id):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    awscoops = query_awscoop_coop_key(trace_id, coop_id)
    if awscoops:
        exitst_organization = awscoops["OrganizationID"] == organization_id
        exitst_project = awscoops["ProjectID"] == project_id
        if exitst_organization and exitst_project:
            return common_utils.response(awscoops, pm_logger)
    return None


def query_awscoop(trace_id, coop_id, filter_expression=None,
                  convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    key_conditions = {
        'CoopID': {
            'AttributeValueList': [coop_id],
            'ComparisonOperator': 'EQ'
        }
    }
    result = DB_utils.query(trace_id, Tables.PM_AWSACCOUNTCOOPS,
                            key_conditions, filter_expression)

    if convert_response:
        result = common_utils.convert_list_response(
            trace_id, result, RESPONSE_AWSCOOPS, RESPONSE_REQUIRED)
    return common_utils.response(result, pm_logger)


def query_awscoop_coop_key(trace_id,
                           coop_id,
                           convert_response=None,
                           is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    key = {"CoopID": coop_id}
    result = DB_utils.query_key(trace_id,
                                Tables.PM_AWSACCOUNTCOOPS,
                                key,
                                is_cw_logger=is_cw_logger)

    if convert_response:
        result = common_utils.convert_response(trace_id,
                                               result,
                                               RESPONSE_AWSCOOPS,
                                               RESPONSE_REQUIRED,
                                               is_cw_logger=is_cw_logger)

    return common_utils.response(result, logger)


def query_awscoop_filter_organization_project(trace_id, coop_id,
                                              organization_id, project_id,
                                              convert_response=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    filter = Attr('OrganizationID').eq(organization_id) & Attr('ProjectID').eq(
        project_id)
    awscoops = query_awscoop(trace_id, coop_id, filter, convert_response)
    pm_logger.info("end : response %s", awscoops)
    return awscoops


def query_awscoop_project_index(trace_id,
                                project_id,
                                filter_expression=None,
                                convert_response=None,
                                aws_account=None,
                                is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    key_conditions = {
        'ProjectID': {
            'AttributeValueList': [project_id],
            'ComparisonOperator': 'EQ'
        }
    }
    if aws_account is not None:
        key_conditions['AWSAccount'] = {
            'AttributeValueList': [aws_account],
            'ComparisonOperator': 'EQ'
        }
    result = DB_utils.query_index(trace_id,
                                  Tables.PM_AWSACCOUNTCOOPS,
                                  PROJECT_INDEX,
                                  key_conditions,
                                  filter_expression,
                                  is_cw_logger=is_cw_logger)

    if convert_response:
        result = common_utils.convert_list_response(trace_id,
                                                    result,
                                                    RESPONSE_AWSCOOPS,
                                                    RESPONSE_REQUIRED,
                                                    is_cw_logger=is_cw_logger)
    return common_utils.response(result, logger)


def query_awscoops_filter_organization(trace_id,
                                       project_id,
                                       organization_id,
                                       effective=None,
                                       convert_response=None,
                                       aws_account=None):
    pm_logger = common_utils.begin_logger(trace_id, __name__,
                                          inspect.currentframe())
    if effective is None:
        filter = Attr('OrganizationID').eq(organization_id)
    else:
        filter = Attr('OrganizationID').eq(organization_id) and Attr(
            'Effective').eq(effective)
    awscoops = query_awscoop_project_index(trace_id, project_id, filter,
                                           convert_response, aws_account)
    return common_utils.response(awscoops, pm_logger)


def update_awscoops(trace_id,
                    coop_id,
                    update_attribute,
                    target_update_date=None,
                    is_cw_logger=False):
    if (is_cw_logger):
        common_utils.begin_cw_logger(trace_id, __name__,
                                     inspect.currentframe())
    else:
        common_utils.begin_logger(trace_id, __name__, inspect.currentframe())

    key = {"CoopID": coop_id}
    DB_utils.update(trace_id,
                    Tables.PM_AWSACCOUNTCOOPS,
                    key,
                    update_attribute,
                    target_update_date,
                    is_cw_logger=is_cw_logger)


def query_awscoop_effective_enable(trace_id, project_id, is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    filter = Attr('Effective').eq(Effective.Enable.value)
    awscoops = query_awscoop_project_index(trace_id,
                                           project_id,
                                           filter,
                                           is_cw_logger=is_cw_logger)
    return common_utils.response(awscoops, logger)
