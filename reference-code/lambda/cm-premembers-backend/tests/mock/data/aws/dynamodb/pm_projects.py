from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_PROJECTS.value)
    db_utils.create_table(script)


def create(data_project):
    condition_expression = Attr("ProjectID").not_exists()
    db_utils.create(Tables.PM_PROJECTS, data_project,
                    condition_expression)
