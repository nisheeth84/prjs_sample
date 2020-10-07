from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_EMAIL_CHANGE_APPLY.value)
    db_utils.create_table(script)


def create(data_email_change_apply):
    condition_expression = Attr("UserID").not_exists()
    db_utils.create(Tables.PM_EMAIL_CHANGE_APPLY, data_email_change_apply,
                    condition_expression)


def query_key(apply_id):
    key = {"ApplyID": apply_id}
    result = db_utils.query_key(Tables.PM_EMAIL_CHANGE_APPLY, key)
    return result
