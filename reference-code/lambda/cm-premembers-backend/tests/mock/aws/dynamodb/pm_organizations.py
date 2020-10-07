from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_ORGANIZATIONS.value)
    db_utils.create_table(script)


def create(data_organization):
    condition_expression = Attr("OrganizationID").not_exists()
    db_utils.create(Tables.PM_ORGANIZATIONS, data_organization,
                    condition_expression)
