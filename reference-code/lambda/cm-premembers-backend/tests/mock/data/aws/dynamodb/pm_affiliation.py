from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import db_utils
from boto3.dynamodb.conditions import Attr


def create_table():
    script = db_utils.get_script_json_create_table(
        Tables.PM_AFFILIATION.value)
    db_utils.create_table(script)


def create(data_affiliation):
    condition_expression = Attr("UserID").not_exists()
    db_utils.create(Tables.PM_AFFILIATION, data_affiliation,
                    condition_expression)


def query_userid_key(user_id,
                     organization_id=None,
                     filter_expression=None):
    key_conditions = {
        'UserID': {
            'AttributeValueList': [user_id],
            'ComparisonOperator': 'EQ'
        }
    }
    if (organization_id):
        key_conditions['OrganizationID'] = {
            'AttributeValueList': [organization_id],
            'ComparisonOperator': 'EQ'
        }
    result = db_utils.query(Tables.PM_AFFILIATION, key_conditions,
                            filter_expression)
    return result
