from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_CHECK_RESULTS.value)
    db_utils.create_table(script)


def query_all():
    result = db_utils.scan(Tables.PM_CHECK_RESULTS, 100)
    return result
