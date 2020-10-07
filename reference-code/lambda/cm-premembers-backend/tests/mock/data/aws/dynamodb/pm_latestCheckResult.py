from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_LATEST_CHECK_RESULT.value)
    db_utils.create_table(script)


def create(data_last_check_result):
    condition_expression = Attr("OrganizationID").not_exists()
    db_utils.create(Tables.PM_LATEST_CHECK_RESULT, data_last_check_result,
                    condition_expression)
