from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_SECURITY_CHECK_WEBHOOK_CALL_HISTORY.value)
    db_utils.create_table(script)


def create(data_security_check_webhook_call_history):
    condition_expression = Attr("SecurityCheckWebhookID").not_exists().__and__(
        Attr("CreatedAt").not_exists())
    db_utils.create(Tables.PM_SECURITY_CHECK_WEBHOOK_CALL_HISTORY,
                    data_security_check_webhook_call_history,
                    condition_expression)


def query_all():
    result = db_utils.scan(Tables.PM_SECURITY_CHECK_WEBHOOK_CALL_HISTORY, 100)
    return result
