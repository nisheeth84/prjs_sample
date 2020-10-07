from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr

PROJECT_INDEX = 'ProjectIndex'


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_SECURITY_CHECK_WEBHOOK.value)
    db_utils.create_table(script)


def create(data_security_check_webhook):
    condition_expression = Attr("SecurityCheckWebhookID").not_exists()
    db_utils.create(Tables.PM_SECURITY_CHECK_WEBHOOK,
                    data_security_check_webhook, condition_expression)


def query_all():
    result = db_utils.scan(Tables.PM_SECURITY_CHECK_WEBHOOK, 100)
    return result
