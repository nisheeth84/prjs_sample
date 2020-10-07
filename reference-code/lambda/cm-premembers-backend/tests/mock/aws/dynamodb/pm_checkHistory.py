from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_CHECK_HISTORY.value)
    db_utils.create_table(script)


def create(data_check_history):
    condition_expression = Attr("CheckHistoryID").not_exists()
    db_utils.create(Tables.PM_CHECK_HISTORY, data_check_history,
                    condition_expression)


def query_key(check_history_id):
    key = {"CheckHistoryID": check_history_id}
    result = db_utils.query_key(Tables.PM_CHECK_HISTORY, key)
    return result
