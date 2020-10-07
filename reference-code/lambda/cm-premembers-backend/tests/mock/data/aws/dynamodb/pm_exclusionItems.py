from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_EXCLUSION_ITEMS.value)
    db_utils.create_table(script)
