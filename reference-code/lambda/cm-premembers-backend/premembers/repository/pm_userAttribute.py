import inspect

from premembers.repository.table_list import Tables
from premembers.common import common_utils
from premembers.repository import DB_utils
from boto3.dynamodb.conditions import Attr

RESPONSE_USER_ATTRIBUTE = {
    'UserID': 'id',
    'UserName': 'userName',
    'CompanyName': 'companyName',
    'DepartmentName': 'depertmentName',
    'MailStatus': 'mailStatus',
    'CompanyFlg': 'companyFlg',
    'CountryCode': 'countryCode',
    'CallerServiceName': 'callerServiceName',
    'CreatedAt': 'createdAt',
    'UpdatedAt': 'updatedAt'
}


def query_key(user_id, convert_response=None):
    pm_logger = common_utils.begin_logger(user_id, __name__,
                                          inspect.currentframe())
    key = {"UserID": user_id}
    result = DB_utils.query_key(user_id, Tables.PM_USER_ATTRIBUTE, key)

    if result and convert_response:
        result = common_utils.convert_response(user_id, result,
                                               RESPONSE_USER_ATTRIBUTE)
    # return user
    return common_utils.response(result, pm_logger)


def create(user_id, user_name, company_name, department_name, mail_status,
           company_flg, country_code, caller_service_name):
    common_utils.begin_logger(user_id, __name__, inspect.currentframe())
    date_now = common_utils.get_current_date()
    create_user = {
        'UserID': user_id,
        'UserName': user_name,
        'CompanyName': company_name,
        'DepartmentName': department_name,
        'MailStatus': mail_status,
        'CreatedAt': date_now,
        'UpdatedAt': date_now
    }
    if company_flg is not None:
        create_user['CompanyFlg'] = company_flg
    if country_code is not None:
        create_user['CountryCode'] = country_code
    if caller_service_name is not None:
        create_user['CallerServiceName'] = caller_service_name
    condition_expression = Attr("UserID").not_exists()
    DB_utils.create(user_id, Tables.PM_USER_ATTRIBUTE, create_user,
                    condition_expression)


def delete(user_id):
    common_utils.begin_logger(user_id, __name__, inspect.currentframe())
    key = {"UserID": user_id}
    DB_utils.delete(user_id, Tables.PM_USER_ATTRIBUTE, key)


def update(user_id, update_attribute):
    common_utils.begin_logger(user_id, __name__, inspect.currentframe())
    key = {"UserID": user_id}
    DB_utils.update(user_id, Tables.PM_USER_ATTRIBUTE, key, update_attribute)
