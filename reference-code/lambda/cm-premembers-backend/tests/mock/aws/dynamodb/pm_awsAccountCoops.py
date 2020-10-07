from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_AWSACCOUNTCOOPS.value)
    db_utils.create_table(script)


def create(data_aws_account_coops):
    condition_expression = Attr("CoopID").not_exists()
    db_utils.create(Tables.PM_AWSACCOUNTCOOPS, data_aws_account_coops,
                    condition_expression)
