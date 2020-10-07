import json
from premembers.common import common_utils
from premembers.const.const import CommonConst


def get_trace_id(event):
    return event['requestContext']['authorizer']['claims']['cognito:username']


def get_email(event):
    return event['requestContext']['authorizer']['claims']['email']


def get_organization_id(event):
    return event['pathParameters']['organization_id']


def get_project_id(event):
    return event['pathParameters']['project_id']


def get_coop_id(event):
    return event['pathParameters']['coop_id']


def get_check_item_code(event):
    return event['pathParameters']['check_item_code']


def get_history_id(event):
    return event['pathParameters']['history_id']


def get_invite_status(event):
    return get_query_string(event, 'inviteStatus', CommonConst.BLANK)


def get_report_id(event):
    return event['pathParameters']['report_id']


def get_file_type(event):
    return event['queryStringParameters']['fileType']


def get_task_id(event):
    return event['TaskId']


def get_message_id(event):
    return event['Message']['MessageId']


def get_receipt_handle(event):
    return event['Message']['ReceiptHandle']


def get_effective(event):
    return int(event['queryStringParameters']['effective'])


def get_user_id(event):
    return event['pathParameters']['user_id']


def get_awsaccount(event):
    return get_param_event_batch(event, 'AWSAccount')


def get_awsaccount_name_batch(event):
    return event['AWSAccountName']


def get_role_name(event):
    return event['RoleName']


def get_coop_id_batch(event):
    return event['CoopID']


def get_external_id(event):
    return event['ExternalID']


def get_check_history_id_batch(event):
    return event['CheckHistoryId']


def get_language_batch(event):
    return event['Language']


def get_organization_id_batch(event):
    return event['OrganizationID']


def get_organization_name_batch(event):
    return event['OrganizationName']


def get_project_id_batch(event):
    return event['ProjectID']


def get_project_name_batch(event):
    return event['ProjectName']


def get_check_result_id_batch(event):
    return event['CheckResultID']


def get_effective_awsaccount(event):
    return event['effective_awsaccount']


def get_error_code_batch(event):
    return event['ErrorCode']


def get_execute_user_id_batch(event):
    return event['ExecuteUserID']


def get_region_name_batch(event):
    return get_param_event_batch(event, 'RegionName')


def get_check_code_item_batch(event):
    return get_param_event_batch(event, 'CheckCodeItem')


def get_data_body_batch(event):
    return get_param_event_batch(event, 'DataBody')


def get_message_from_sns(event):
    return event['Records'][0]['Sns']['Message']


def get_check_history_id(event):
    return get_query_string(event, 'checkHistoryId', None)


def get_query_awsaccount(event):
    return get_query_string(event, 'awsAccount', None)


def get_notify_code(event):
    return get_query_string(event, 'notifyCode', None)


def get_group_filter(event):
    return get_query_string(event, 'groupFilter', None)


def parse_body(event):
    return json.loads(event['body'])


def get_webhook_path(event):
    return event['pathParameters']['webhook_path']


def get_query_organization_id(event):
    return get_query_string(event, 'organizationId', None)


def get_query_project_id(event):
    return get_query_string(event, 'projectId', None)


def get_query_string(event, key, default=None):
    if (common_utils.check_key('queryStringParameters', event)
            and common_utils.check_key(key, event['queryStringParameters'])):
        return event['queryStringParameters'][key]
    return default


def get_param_event_batch(event, key, default=None):
    if common_utils.check_key(key, event):
        return event[key]
    return default


def get_apply_id(event):
    return event['pathParameters']['apply_id']


def get_region_name(event):
    return get_query_string(event, 'region_name', None)


def get_resource_type(event):
    return get_query_string(event, 'resource_type', None)


def get_resource_name(event):
    return get_query_string(event, 'resource_name', None)
