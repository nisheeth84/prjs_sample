from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_USER_ATTRIBUTE.value)
    db_utils.create_table(script)


def create(data_user):
    condition_expression = Attr("UserID").not_exists()
    db_utils.create(Tables.PM_USER_ATTRIBUTE, data_user,
                    condition_expression)


def query_key(user_id):
    key = {"UserID": user_id}
    result = db_utils.query_key(Tables.PM_USER_ATTRIBUTE, key)
    return result


def delete(user_id):
    key = {"UserID": user_id}
    db_utils.delete(Tables.PM_USER_ATTRIBUTE, key)
