import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from boto3.dynamodb.conditions import Attr
from premembers.repository import DB_utils

RESPONSE_ORGANIZATION = {
    'OrganizationID': 'id',
    'OrganizationName': 'name',
    'Contract': 'contract',
    'ContractStatus': 'contractStatus',
    'CreatedAt': 'createdAt',
    'UpdatedAt': 'updatedAt'
}


def create_organization(trace_id, organization_id, organization_name, contract,
                        contract_status):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    # 不要なクラムを作成することを避けるため
    date_now = common_utils.get_current_date()
    create_organization = {
        'OrganizationID': organization_id,
        'OrganizationName': organization_name,
        'Contract': contract,
        'ContractStatus': contract_status,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    condition_expression = Attr("OrganizationID").not_exists()
    DB_utils.create(trace_id, Tables.PM_ORGANIZATIONS, create_organization,
                    condition_expression)


def get_organization(trace_id,
                     organization_id,
                     convert_response=None,
                     is_cw_logger=False):
    if (is_cw_logger):
        logger = common_utils.begin_cw_logger(trace_id, __name__,
                                              inspect.currentframe())
    else:
        logger = common_utils.begin_logger(trace_id, __name__,
                                           inspect.currentframe())
    key = {"OrganizationID": organization_id}

    result = DB_utils.query_key(trace_id,
                                Tables.PM_ORGANIZATIONS,
                                key,
                                is_cw_logger=is_cw_logger)
    if result and convert_response:
        result = common_utils.convert_response(trace_id,
                                               result,
                                               RESPONSE_ORGANIZATION,
                                               is_cw_logger=is_cw_logger)

    return common_utils.response(result, logger)


def update_organization(trace_id, organization_id, update_attribute,
                        target_update_date):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())

    key = {"OrganizationID": organization_id}
    DB_utils.update(trace_id, Tables.PM_ORGANIZATIONS, key, update_attribute,
                    target_update_date)


def delete_organization(trace_id, organization_id):
    common_utils.begin_logger(trace_id, __name__, inspect.currentframe())
    key = {"OrganizationID": organization_id}
    DB_utils.delete(trace_id, Tables.PM_ORGANIZATIONS, key)
