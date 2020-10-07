from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_CHECK_RESULT_ITEMS.value)
    db_utils.create_table(script)


def create(data_check_result_item):
    condition_expression = Attr("CheckResultItemID").not_exists()
    db_utils.create(Tables.PM_CHECK_RESULT_ITEMS, data_check_result_item,
                    condition_expression)
