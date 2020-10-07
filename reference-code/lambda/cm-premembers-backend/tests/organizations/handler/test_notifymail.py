import unittest
import os
import json
import copy

from http import HTTPStatus
from dotenv import load_dotenv
from pathlib import Path
from premembers.repository import pm_affiliation
from premembers.repository import pm_orgNotifySlack
from premembers.repository import pm_orgNotifyMailDestinations
from premembers.const.msg_const import MsgConst
from tests import event_create
from premembers.common import common_utils
from premembers.organizations.handler import notifymail

trace_id = common_utils.get_uuid4()
notify_code = "CHECK_CIS"
webhook_url = "test_webhook_url"
mentions = "test_mentions"

mail_address = "test-user{}@example.com"
user_id = "eb3b5f76-8945-11e7-b15a-8f7e5433dada{}"
organization_id = common_utils.get_uuid4()

affiliation_template = {
    "MailAddress": mail_address.format(str(0)),
    "UserID": user_id,
    "Authority": 0,
    "OrganizationID": organization_id,
    "InvitationStatus": 1,
}

notify_mail_template = {
    'OrganizationID': organization_id,
    'NotifyCode': notify_code,
    'Destinations': [
        {
            "UserID": user_id.format(str(1)),
            "MailAddress": mail_address.format(str(1))
        }
    ]
}

notify_slack_template = {
    'OrganizationID': organization_id,
    'NotifyCode': notify_code,
    'WebhookURL': webhook_url,
    'Mentions': mentions
}

notifymail_create = {
    "notifyCode": "CHECK_CIS",
}


class TestNotifyMail(unittest.TestCase):
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)

        # create pm_orgNotifyMailDestinaltions
        pm_orgNotifyMailDestinations.create(
            trace_id, notify_mail_template['OrganizationID'],
            notify_mail_template['NotifyCode'],
            notify_mail_template['Destinations'])

        # create pm_orgNotifySlack
        pm_orgNotifySlack.create(trace_id,
                                 notify_slack_template['OrganizationID'],
                                 notify_slack_template['NotifyCode'],
                                 notify_slack_template['WebhookURL'],
                                 notify_slack_template['Mentions'])

        num = 1
        while num < 4:
            # Create Affiliation
            tmp_affiliation = copy.copy(affiliation_template)
            tmp_affiliation['MailAddress'] = mail_address.format(str(num))
            tmp_affiliation['UserID'] = user_id.format(str(num))
            tmp_affiliation['Authority'] = num
            pm_affiliation.create_affiliation(
                trace_id, tmp_affiliation['MailAddress'],
                tmp_affiliation['UserID'], tmp_affiliation['OrganizationID'],
                tmp_affiliation['Authority'],
                tmp_affiliation['InvitationStatus'])
            num += 1

    def tearDown(self):
        pm_orgNotifyMailDestinations.delete(trace_id, organization_id,
                                            notify_code)
        num = 1
        while num < 4:
            pm_affiliation.delete_affiliation(
                user_id.format(str(num)), organization_id)
            num += 1

        pm_orgNotifySlack.delete(trace_id, organization_id, notify_code)

    def test_delete_notifymail_success(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {
            "organization_id": organization_id,
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": notify_code
            })
        response = notifymail.delete_notifymail_handler(event_mock, {})

        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.NO_CONTENT)
        self.assertEqual(response_body, None)

    def test_delete_notifymail_error_delete_record_zero(self):
        test_user_id = user_id.format(str(3))
        # handler
        pm_orgNotifyMailDestinations.delete(trace_id, organization_id,
                                            notify_code)
        path_parameters = {
            "organization_id": organization_id,
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": notify_code
            })
        response = notifymail.delete_notifymail_handler(event_mock, {})

        # Check data
        message_301 = MsgConst.ERR_301
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_301['code'])
        self.assertEqual(response_body['message'], message_301['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_delete_notifymail_error_access_authority(self):
        test_user_id = user_id.format(str(1))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": notify_code
            })
        response = notifymail.delete_notifymail_handler(event_mock, {})
        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_delete_notifymail_error_notify_code_empty(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": ""
            })
        response = notifymail.delete_notifymail_handler(event_mock, {})
        # Check data
        message_201 = MsgConst.ERR_201
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "notifyCode")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_delete_notifymail_error_notify_code_not_valid(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": "NOT_VALID"
            })
        response = notifymail.delete_notifymail_handler(event_mock, {})
        # Check data
        message_201 = MsgConst.ERR_201
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_302['code'])
        self.assertEqual(response_error[0]['field'], "notifyCode")
        self.assertEqual(response_error[0]['value'], "NOT_VALID")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_302['message'].format("CHECK_CIS"))

    def test_get_notifymail_success(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": notify_code
            })
        response = notifymail.get_notifymail_handler(event_mock, {})
        response_body = json.loads(response['body'])
        # Check data
        self.assertEqual(response_body['organizationId'], organization_id)
        self.assertEqual(response_body['notifyCode'], notify_code)
        self.assertEqual(response_body['destinations'][0]['mailAddress'],
                         mail_address.format(str(1)))
        self.assertEqual(response_body['destinations'][0]['userId'],
                         user_id.format(str(1)))

    def test_get_notifymail_record_zero(self):
        test_user_id = user_id.format(str(3))
        # handler
        pm_orgNotifyMailDestinations.delete(trace_id, organization_id,
                                            notify_code)
        path_parameters = {
            "organization_id": organization_id,
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": notify_code
            })
        response = notifymail.get_notifymail_handler(event_mock, {})
        body = response['body']

        # Check data
        self.assertEqual(body, '[]')
        self.assertEqual(response['statusCode'], HTTPStatus.OK.value)

    def test_get_notifymail_error_access_authority(self):
        test_user_id = user_id.format(str(2))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": notify_code
            })
        response = notifymail.get_notifymail_handler(event_mock, {})
        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_get_notifymail_error_notify_code_empty(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": ""
            })
        response = notifymail.get_notifymail_handler(event_mock, {})
        # Check data
        message_201 = MsgConst.ERR_201
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "notifyCode")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_get_notifymail_error_notify_code_not_valid(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": "NOT_VALID"
            })
        response = notifymail.get_notifymail_handler(event_mock, {})
        # Check data
        message_201 = MsgConst.ERR_201
        message_302 = MsgConst.ERR_VAL_302
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'], message_302['code'])
        self.assertEqual(response_error[0]['field'], "notifyCode")
        self.assertEqual(response_error[0]['value'], "NOT_VALID")
        self.assertEqual(response_error[0]['message'],
                         message_302['message'].format(notify_code))

    def test_create_notifymail_success(self):
        notifymail_create['notifyCode'] = "CHECK_CIS"
        pm_orgNotifyMailDestinations.delete(trace_id, organization_id,
                                            notifymail_create['notifyCode'])
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        notifymail_create['users'] = [user_id.format(str(3))]
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(notifymail_create))
        response = notifymail.create_notifymail_handler(event_mock, {})

        # Get data response
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        organizationId = response_body["organizationId"]
        notify_code = response_body['notifyCode']
        destinations = response_body['destinations']
        createdAt = response_body['createdAt']
        updatedAt = response_body['updatedAt']

        # Get data in database
        result_database = pm_orgNotifyMailDestinations.query_key(
            trace_id, organization_id, notifymail_create['notifyCode'], True)

        # Check data
        self.assertEqual(organizationId, result_database['organizationId'])
        self.assertEqual(notify_code, result_database['notifyCode'])
        self.assertEqual(destinations, result_database['destinations'])
        self.assertEqual(createdAt, result_database['createdAt'])
        self.assertEqual(updatedAt, result_database['updatedAt'])
        self.assertEqual(status_code, HTTPStatus.CREATED.value)

    def test_create_notifymail_error_access_authority(self):
        test_user_id = user_id.format(str(2))
        # handler
        path_parameters = {"organization_id": organization_id}
        notifymail_create['users'] = [user_id.format(str(3))]
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(notifymail_create))
        response = notifymail.create_notifymail_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_create_notifymail_error_parse_json(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        notifymail_create['users'] = [user_id.format(str(3))]
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=notifymail_create)
        response = notifymail.create_notifymail_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_202['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_202['message'])
        self.assertEqual(response_body['description'],
                         MsgConst.ERR_REQUEST_202['description'])
        self.assertEqual(response['statusCode'], HTTPStatus.BAD_REQUEST.value)

    def test_create_notifymail_error_validate_required(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        notifymail_create['notifyCode'] = ""
        notifymail_create['users'] = []
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(notifymail_create))
        response = notifymail.create_notifymail_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        # 通知コード
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "notifyCode")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

        # 宛先ユーザ
        self.assertEqual(response_error[1]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[1]['field'], "users")
        self.assertEqual(response_error[1]['value'], [])
        self.assertEqual(response_error[1]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_create_notifymail_error_validate_data_notifyCode(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        notifymail_create['notifyCode'] = "ERROR"
        notifymail_create['users'] = [user_id.format(str(3))]
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(notifymail_create))
        response = notifymail.create_notifymail_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        # 通知コード
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_302['code'])
        self.assertEqual(response_error[0]['field'], "notifyCode")
        self.assertEqual(response_error[0]['value'], "ERROR")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_302['message'].format("CHECK_CIS"))

    def test_create_notifymail_error_validate_data_users(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        notifymail_create['notifyCode'] = "CHECK_CIS"
        notifymail_create['users'] = ['NOT_EXISTS']
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            body=json.dumps(notifymail_create))
        response = notifymail.create_notifymail_handler(event_mock, {})

        # Check data
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'],
                         MsgConst.ERR_REQUEST_201['code'])
        self.assertEqual(response_body['message'],
                         MsgConst.ERR_REQUEST_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        response_error = response_body['errors']
        # 宛先ユーザ
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_999['code'])
        self.assertEqual(response_error[0]['field'], "users")
        self.assertEqual(response_error[0]['value'], ['NOT_EXISTS'])
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_999['message'])

    def test_create_notifyslack_handler_success_record_not_exist(self):
        test_user = user_id.format(str(3))
        path_parameters = {"organization_id": organization_id}
        body_request = {
            'notifyCode': notify_code,
            'webhookUrl': webhook_url,
            'mentions': mentions
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user,
            body=json.dumps(body_request))

        pm_orgNotifySlack.delete(trace_id, organization_id, notify_code)
        response = notifymail.create_notifyslack_handler(event_mock, {})
        response_body = json.loads(response['body'])
        org_notify_slack = pm_orgNotifySlack.query_key(
            trace_id, organization_id, body_request['notifyCode'], True)

        # check database
        self.assertEqual(org_notify_slack['organizationId'],
                         path_parameters['organization_id'])
        self.assertEqual(org_notify_slack['notifyCode'],
                         body_request['notifyCode'])
        self.assertEqual(org_notify_slack['webhookUrl'],
                         body_request['webhookUrl'])
        self.assertEqual(org_notify_slack['mentions'],
                         body_request['mentions'])

        # check response
        self.assertEqual(response['statusCode'],
                         HTTPStatus.CREATED)
        self.assertEqual(org_notify_slack['organizationId'],
                         response_body['organizationId'])
        self.assertEqual(org_notify_slack['notifyCode'],
                         response_body['notifyCode'])
        self.assertEqual(org_notify_slack['webhookUrl'],
                         response_body['webhookUrl'])
        self.assertEqual(org_notify_slack['mentions'],
                         response_body['mentions'])
        self.assertEqual(org_notify_slack['createdAt'],
                         response_body['createdAt'])
        self.assertEqual(org_notify_slack['updatedAt'],
                         response_body['updatedAt'])

    def test_create_notifyslack_handler_success_record_exist(self):
        test_user = user_id.format(str(3))
        path_parameters = {"organization_id": organization_id}
        body_request = {
            'notifyCode': notify_code,
            'webhookUrl': webhook_url,
            'mentions': mentions
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user,
            body=json.dumps(body_request))

        response = notifymail.create_notifyslack_handler(event_mock, {})
        response_body = json.loads(response['body'])

        org_notify_slack = pm_orgNotifySlack.query_key(
            trace_id, organization_id, body_request['notifyCode'], True)

        # check database
        self.assertEqual(org_notify_slack['organizationId'],
                         path_parameters['organization_id'])
        self.assertEqual(org_notify_slack['notifyCode'],
                         body_request['notifyCode'])
        self.assertEqual(org_notify_slack['webhookUrl'],
                         body_request['webhookUrl'])
        self.assertEqual(org_notify_slack['mentions'],
                         body_request['mentions'])

        # check response
        self.assertEqual(response['statusCode'],
                         HTTPStatus.CREATED)
        self.assertEqual(org_notify_slack['organizationId'],
                         response_body['organizationId'])
        self.assertEqual(org_notify_slack['notifyCode'],
                         response_body['notifyCode'])
        self.assertEqual(org_notify_slack['webhookUrl'],
                         response_body['webhookUrl'])
        self.assertEqual(org_notify_slack['mentions'],
                         response_body['mentions'])
        self.assertEqual(org_notify_slack['createdAt'],
                         response_body['createdAt'])
        self.assertEqual(org_notify_slack['updatedAt'],
                         response_body['updatedAt'])

    def test_create_notifyslack_handler_success_mentions_not_exist(self):
        test_user = user_id.format(str(3))
        path_parameters = {"organization_id": organization_id}
        body_request = {
            'notifyCode': notify_code,
            'webhookUrl': webhook_url
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user,
            body=json.dumps(body_request))

        response = notifymail.create_notifyslack_handler(event_mock, {})
        response_body = json.loads(response['body'])

        org_notify_slack = pm_orgNotifySlack.query_key(
            trace_id, organization_id, body_request['notifyCode'], True)

        # check database
        self.assertEqual(org_notify_slack['organizationId'],
                         path_parameters['organization_id'])
        self.assertEqual(org_notify_slack['notifyCode'],
                         body_request['notifyCode'])
        self.assertEqual(org_notify_slack['webhookUrl'],
                         body_request['webhookUrl'])
        self.assertEqual(org_notify_slack['mentions'], '')

        # check response
        self.assertEqual(response['statusCode'],
                         HTTPStatus.CREATED)
        self.assertEqual(org_notify_slack['organizationId'],
                         response_body['organizationId'])
        self.assertEqual(org_notify_slack['notifyCode'],
                         response_body['notifyCode'])
        self.assertEqual(org_notify_slack['webhookUrl'],
                         response_body['webhookUrl'])
        self.assertEqual(org_notify_slack['mentions'],
                         response_body['mentions'])
        self.assertEqual(org_notify_slack['createdAt'],
                         response_body['createdAt'])
        self.assertEqual(org_notify_slack['updatedAt'],
                         response_body['updatedAt'])

    def test_create_notifyslack_handler_success_mentions_empty(self):
        test_user = user_id.format(str(3))
        path_parameters = {"organization_id": organization_id}
        body_request = {
            'notifyCode': notify_code,
            'webhookUrl': webhook_url,
            'mentions': ''
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user,
            body=json.dumps(body_request))

        response = notifymail.create_notifyslack_handler(event_mock, {})
        response_body = json.loads(response['body'])

        org_notify_slack = pm_orgNotifySlack.query_key(
            trace_id, organization_id, body_request['notifyCode'], True)

        # check database
        self.assertEqual(org_notify_slack['organizationId'],
                         path_parameters['organization_id'])
        self.assertEqual(org_notify_slack['notifyCode'],
                         body_request['notifyCode'])
        self.assertEqual(org_notify_slack['webhookUrl'],
                         body_request['webhookUrl'])
        self.assertEqual(org_notify_slack['mentions'], '')

        # check response
        self.assertEqual(response['statusCode'],
                         HTTPStatus.CREATED)
        self.assertEqual(org_notify_slack['organizationId'],
                         response_body['organizationId'])
        self.assertEqual(org_notify_slack['notifyCode'],
                         response_body['notifyCode'])
        self.assertEqual(org_notify_slack['webhookUrl'],
                         response_body['webhookUrl'])
        self.assertEqual(org_notify_slack['mentions'],
                         response_body['mentions'])
        self.assertEqual(org_notify_slack['createdAt'],
                         response_body['createdAt'])
        self.assertEqual(org_notify_slack['updatedAt'],
                         response_body['updatedAt'])

    def test_create_notifyslack_handler_error_access_authority(self):
        test_user = user_id.format(str(4))

        path_parameters = {"organization_id": organization_id}
        body_request = {
            'notifyCode': notify_code,
            'webhookUrl': webhook_url,
            'mentions': mentions
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user,
            body=json.dumps(body_request))

        response = notifymail.create_notifyslack_handler(event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])

    def test_create_notifyslack_handler_error_json_data(self):
        test_user = user_id.format(str(3))
        path_parameters = {"organization_id": organization_id}

        # body_request is not json format
        body_request = ''
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user,
            body=json.dumps(body_request))

        response = notifymail.create_notifyslack_handler(event_mock, {})
        # Check data
        message_202 = MsgConst.ERR_REQUEST_202
        response_body = json.loads(response['body'])
        self.assertEqual(response['statusCode'], HTTPStatus.BAD_REQUEST)
        self.assertEqual(response_body['code'], message_202['code'])
        self.assertEqual(response_body['message'], message_202['message'])

        # body_request is not exist key notifyCode
        body_request = {
            'webhookUrl': webhook_url,
            'mentions': mentions
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user,
            body=json.dumps(body_request))

        response = notifymail.create_notifyslack_handler(event_mock, {})
        # Check data
        message_202 = MsgConst.ERR_REQUEST_202
        response_body = json.loads(response['body'])
        self.assertEqual(response['statusCode'], HTTPStatus.BAD_REQUEST)
        self.assertEqual(response_body['code'], message_202['code'])
        self.assertEqual(response_body['message'], message_202['message'])

        # body_request is not exist key webhookUrl
        body_request = {
            'notifyCode': notify_code,
            'mentions': mentions
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user,
            body=json.dumps(body_request))

        response = notifymail.create_notifyslack_handler(event_mock, {})
        # Check data
        message_202 = MsgConst.ERR_REQUEST_202
        response_body = json.loads(response['body'])
        self.assertEqual(response['statusCode'], HTTPStatus.BAD_REQUEST)
        self.assertEqual(response_body['code'], message_202['code'])
        self.assertEqual(response_body['message'], message_202['message'])

    def test_create_notifyslack_handler_error_notify_code_empty(self):
        test_user = user_id.format(str(3))

        path_parameters = {"organization_id": organization_id}
        body_request = {
            'notifyCode': '',
            'webhookUrl': webhook_url,
            'mentions': mentions
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user,
            body=json.dumps(body_request))

        response = notifymail.create_notifyslack_handler(event_mock, {})
        # Check data
        message_201 = MsgConst.ERR_REQUEST_201
        response_body = json.loads(response['body'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])

    def test_create_notifyslack_handler_error_notify_code_invalid(self):
        test_user = user_id.format(str(3))
        path_parameters = {"organization_id": organization_id}
        body_request = {
            'notifyCode': 'VALUE_INVALID',
            'webhookUrl': webhook_url,
            'mentions': mentions
        }
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user,
            body=json.dumps(body_request))

        response = notifymail.create_notifyslack_handler(event_mock, {})

        # Check data
        message_201 = MsgConst.ERR_REQUEST_201
        response_body = json.loads(response['body'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])

    def test_create_notifyslack_handler_error_webhook_url_empty(self):
        test_user = user_id.format(str(3))
        path_parameters = {"organization_id": organization_id}
        body_request = {
            'notifyCode': notify_code,
            'webhookUrl': '',
            'mentions': mentions
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user,
            body=json.dumps(body_request))

        response = notifymail.create_notifyslack_handler(event_mock, {})

        # Check data
        message_201 = MsgConst.ERR_REQUEST_201
        response_body = json.loads(response['body'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY)
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])

    def test_get_notifyslack_success(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            query_string_parameters={"notifyCode": notify_code},
            trace_id=test_user_id)

        response = notifymail.get_notifyslack_handler(event_mock, {})
        # check data
        self.assertEqual(response['statusCode'], HTTPStatus.OK.value)
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['organizationId'], organization_id)
        self.assertEqual(response_body['notifyCode'], notify_code)
        self.assertEqual(response_body['webhookUrl'],
                         notify_slack_template['WebhookURL'])
        self.assertEqual(response_body['mentions'],
                         notify_slack_template['Mentions'])

    def test_get_notifyslack_record_zero(self):
        test_user_id = user_id.format(str(3))
        pm_orgNotifySlack.delete(trace_id, organization_id, notify_code)
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            query_string_parameters={"notifyCode": notify_code},
            trace_id=test_user_id)

        response = notifymail.get_notifyslack_handler(event_mock, {})
        # check data
        self.assertEqual(response['statusCode'], HTTPStatus.OK.value)
        response_body = json.loads(response['body'])
        self.assertEqual(response_body, [])

    def test_get_notifyslack_error_access_authority(self):
        test_user_id = user_id.format(str(2))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            query_string_parameters={"notifyCode": notify_code},
            trace_id=test_user_id)

        response = notifymail.get_notifyslack_handler(event_mock, {})
        # check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN.value)

    def test_get_notifyslack_error_notifycode_empty(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            query_string_parameters={"notifyCode": ""},
            trace_id=test_user_id)
        response = notifymail.get_notifyslack_handler(event_mock, {})
        # check data
        message_201 = MsgConst.ERR_REQUEST_201
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

    def test_get_notifyslack_error_notifyCode_invalid(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            query_string_parameters={"notifyCode": "VALUE_INVALID"},
            trace_id=test_user_id)

        response = notifymail.get_notifyslack_handler(event_mock, {})
        # check data
        message_201 = MsgConst.ERR_REQUEST_201
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

    def test_delete_notifyslack_success(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {
            "organization_id": organization_id,
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": notify_code
            })
        response = notifymail.delete_notifyslack_handler(event_mock, {})

        # Check data
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.NO_CONTENT)
        self.assertEqual(response_body, None)

    def test_delete_notifyslack_error_delete_record_zero(self):
        test_user_id = user_id.format(str(3))
        # handler
        pm_orgNotifySlack.delete(trace_id, organization_id, notify_code)
        path_parameters = {
            "organization_id": organization_id,
        }

        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": notify_code
            })
        response = notifymail.delete_notifyslack_handler(event_mock, {})

        # Check data
        message_301 = MsgConst.ERR_301
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_301['code'])
        self.assertEqual(response_body['message'], message_301['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.NOT_FOUND)

    def test_delete_notifyslack_error_access_authority(self):
        test_user_id = user_id.format(str(1))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": notify_code
            })
        response = notifymail.delete_notifyslack_handler(event_mock, {})
        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)

    def test_delete_notifyslack_error_notify_code_empty(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": ""
            })
        response = notifymail.delete_notifyslack_handler(event_mock, {})
        # Check data
        message_201 = MsgConst.ERR_201
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_101['code'])
        self.assertEqual(response_error[0]['field'], "notifyCode")
        self.assertEqual(response_error[0]['value'], "")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_101['message'])

    def test_delete_notifyslack_error_notify_code_not_valid(self):
        test_user_id = user_id.format(str(3))
        # handler
        path_parameters = {"organization_id": organization_id}
        event_mock = event_create.get_event_object(
            path_parameters=path_parameters,
            trace_id=test_user_id,
            query_string_parameters={
                "notifyCode": "NOT_VALID"
            })
        response = notifymail.delete_notifyslack_handler(event_mock, {})
        # Check data
        message_201 = MsgConst.ERR_201
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_201['code'])
        self.assertEqual(response_body['message'], message_201['message'])
        self.assertEqual(response['statusCode'],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)
        response_error = response_body['errors']
        self.assertEqual(response_error[0]['code'],
                         MsgConst.ERR_VAL_302['code'])
        self.assertEqual(response_error[0]['field'], "notifyCode")
        self.assertEqual(response_error[0]['value'], "NOT_VALID")
        self.assertEqual(response_error[0]['message'],
                         MsgConst.ERR_VAL_302['message'].format("CHECK_CIS"))
