from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_ORG_NOTIFY_MAIL_DESTINATIONS.value)
    db_utils.create_table(script)


def create(data_org_notify_mail_destinations):
    condition_expression = Attr("UserID").not_exists()
    db_utils.create(Tables.PM_ORG_NOTIFY_MAIL_DESTINATIONS,
                    data_org_notify_mail_destinations, condition_expression)


def query_key(organization_id, notify_code):
    key = {"OrganizationID": organization_id, "NotifyCode": notify_code}
    result = db_utils.query_key(Tables.PM_ORG_NOTIFY_MAIL_DESTINATIONS, key)
    return result
