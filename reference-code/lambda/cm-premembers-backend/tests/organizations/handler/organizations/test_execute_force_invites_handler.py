import json
import copy

from jinja2 import Template
from http import HTTPStatus
from tests import event_create
from unittest.mock import patch
from moto import mock_dynamodb2
from tests.testcasebase import TestCaseBase
from premembers.const.msg_const import MsgConst
from premembers.organizations.handler import organizations
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_userAttribute import DataPmUserAttribute
from premembers.common import date_utils
from datetime import timedelta

user_id_authority_owner = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
user_id_authority_editor = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(2)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
user_invite = "user_invite"
path_parameters = {"organization_id": organization_id}
regist_user_pool_body = {
    "callerServiceName": "insightwatch",
    "mailLang": "ja",
    "mailAddress": "test_inviteuser@luvina.net",
    "authority": 3
}
event_mock = event_create.get_event_object(
    trace_id=user_id_authority_owner,
    path_parameters=path_parameters,
    body=json.dumps(regist_user_pool_body))

record_affiliation = {
    "Authority": regist_user_pool_body['authority'],
    "CreatedAt": "2019-03-04 09:40:01.310",
    "InvitationStatus": 1,
    "MailAddress": regist_user_pool_body['mailAddress'],
    "OrganizationID": organization_id,
    "UpdatedAt": "2019-03-04 09:40:01.310",
    "UserID": user_id_authority_owner
}


def mock_side_effect_get_affiliation(user_id,
                                     organization_id,
                                     convert_response=None):
    if user_id == user_invite and convert_response is None:
        return []
    else:
        return record_affiliation


@mock_dynamodb2
class TestExecuteForceInvitesHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_execute_force_invites_handler_success_case_exists_username_in_record_pm_user_attribute(self):
        ses_region = "us-west-2"
        mail_from = "sys@dev.insightwatch.io"
        mail_subject = "[insightwatch(DEV)]へ招待されました"
        temporary_password = "IwtYn2Gl9K1y2JdC"

        record_organization = {
            "Contract": 0,
            "ContractStatus": 1,
            "CreatedAt": "2019-05-17 06:32:31.728",
            "OrganizationID": "OrganizationID",
            "OrganizationName": "OrganizationName",
            "UpdatedAt": "2019-05-17 06:32:31.728"
        }

        template_body_mail = "{{mailAddress}} 様\n\n{{userName}} 様から insightwatch （https://insightwatch.io/） への招待がありました。\n\n下記のURLをクリックしてinsightwatchにアクセスいただき、記載されたログインIDおよび初期パスワードを入力してユーザー登録をお願いします。\nユーザー登録後に招待された組織 [{{organizationName}}] へ参加することができます。\n\nhttps://insightwatch.io/app/\n\nログインID:\n{{mailAddress}}\n\n初期パスワード:\n{{temporaryPassword}}\n\nこの招待は、 {{timeToLive}} まで有効です。\n有効期限を過ぎてしまった場合、ログインできません。\n招待者へ再度、招待を依頼してください。\n\n--\n本メールは送信専用メールアドレスから送信されています。返信はできませんのでご了承ください。\nお問い合わせは下記フォームからお送りください。\nhttps://insightwatch.zendesk.com/hc/ja/requests/new\n\nClassmethod, Inc.\nhttps://classmethod.jp/\n"
        bcc_addresses = [
            regist_user_pool_body["mailAddress"]
        ]
        template_body_mail_object = Template(template_body_mail)
        user_name_sign_in = copy.deepcopy(DataPmUserAttribute.DATA_SIMPLE['UserName'])
        organization_name = record_organization['OrganizationName']

        # get time to live
        time_zone = date_utils.get_time_zone_by_language(
            regist_user_pool_body['mailLang'])
        time_to_live_date = date_utils.get_current_date() + timedelta(days=6)
        time_to_live = date_utils.toString(time_to_live_date,
                                           date_utils.PATTERN_YYYYMMDD_SLASH,
                                           time_zone)

        context = {
            'mailAddress': regist_user_pool_body["mailAddress"],
            'userName': user_name_sign_in,
            'organizationName': organization_name,
            'temporaryPassword': temporary_password,
            'timeToLive': time_to_live
        }
        body_mail = template_body_mail_object.render(context)
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.get_affiliation")
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_create_affiliation = patch("premembers.repository.pm_affiliation.create_affiliation")
        patch_query_key_pm_user_attribute = patch('premembers.repository.pm_userAttribute.query_key')
        patch_read_yaml = patch("premembers.common.FileUtils.read_yaml")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")
        patch_send_email = patch("premembers.common.aws_common.send_email")
        patch_get_uuid4 = patch("premembers.common.common_utils.get_uuid4")
        patch_get_password_temporary = patch("premembers.common.common_utils.get_password_temporary")
        patch_date_utils_to_string = patch("premembers.common.date_utils.toString")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_get_organization = patch_get_organization.start()
        mock_create_affiliation = patch_create_affiliation.start()
        mock_query_key_pm_user_attribute = patch_query_key_pm_user_attribute.start()
        mock_read_yaml = patch_read_yaml.start()
        mock_read_decode = patch_read_decode.start()
        mock_send_email = patch_send_email.start()
        mock_get_uuid4 = patch_get_uuid4.start()
        mock_get_password_temporary = patch_get_password_temporary.start()
        mock_date_utils_to_string = patch_date_utils_to_string.start()

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = None
        mock_get_affiliation.side_effect = mock_side_effect_get_affiliation
        mock_get_uuid4.return_value = user_invite
        mock_get_organization.return_value = record_organization
        mock_create_affiliation.side_effect = None
        mock_query_key_pm_user_attribute.return_value = copy.deepcopy(
            DataPmUserAttribute.DATA_SIMPLE)
        mock_read_yaml.return_value = {
            "ses.region": ses_region,
            "ja.invite_mail.insightwatch.subject": mail_subject,
            "ja.invite_mail.insightwatch.body.text.filepath": "check/notify/mail/insightwatch_user_invite_template_ja.tpl",
            "en.invite_mail.insightwatch.subject": "You're Invited: insightwatch(DEV)",
            "en.invite_mail.insightwatch.body.text.filepath": "check/notify/mail/insightwatch_user_invite_template_en.tpl",
            "invite_mail.insightwatch.from": mail_from
        }
        mock_read_decode.return_value = template_body_mail
        mock_get_password_temporary.return_value = temporary_password
        mock_date_utils_to_string.return_value = time_to_live

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)
        self.addCleanup(patch_get_affiliation.stop)
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_create_affiliation.stop)
        self.addCleanup(patch_query_key_pm_user_attribute.stop)
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(patch_read_decode.stop)
        self.addCleanup(patch_send_email.stop)
        self.addCleanup(patch_get_password_temporary.stop)

        # call Function test
        response = organizations.execute_force_invites_handler(
            event_mock, {})

        # assert output function
        # check call function send mail
        mock_send_email.assert_called_once_with(
            user_invite, ses_region, mail_from, bcc_addresses,
            mail_subject, body_mail)

        # check data respone
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.CREATED)
        self.assertEqual(regist_user_pool_body['authority'], response_body['Authority'])
        self.assertEqual(regist_user_pool_body['mailAddress'], response_body['MailAddress'])
        self.assertEqual(organization_id, response_body['OrganizationID'])
        self.assertEqual(user_id_authority_owner, response_body['UserID'])

    def test_execute_force_invites_handler_success_case_not_exists_username_in_record_pm_user_attribute(self):
        ses_region = "us-west-2"
        mail_from = "sys@dev.insightwatch.io"
        mail_subject = "[insightwatch(DEV)]へ招待されました"
        temporary_password = "IwtYn2Gl9K1y2JdC"

        record_organization = {
            "Contract": 0,
            "ContractStatus": 1,
            "CreatedAt": "2019-05-17 06:32:31.728",
            "OrganizationID": "OrganizationID",
            "OrganizationName": "OrganizationName",
            "UpdatedAt": "2019-05-17 06:32:31.728"
        }

        template_body_mail = "{{mailAddress}} 様\n\n{{userName}} 様から insightwatch （https://insightwatch.io/） への招待がありました。\n\n下記のURLをクリックしてinsightwatchにアクセスいただき、記載されたログインIDおよび初期パスワードを入力してユーザー登録をお願いします。\nユーザー登録後に招待された組織 [{{organizationName}}] へ参加することができます。\n\nhttps://insightwatch.io/app/\n\nログインID:\n{{mailAddress}}\n\n初期パスワード:\n{{temporaryPassword}}\n\nこの招待は、 {{timeToLive}} まで有効です。\n有効期限を過ぎてしまった場合、ログインできません。\n招待者へ再度、招待を依頼してください。\n\n--\n本メールは送信専用メールアドレスから送信されています。返信はできませんのでご了承ください。\nお問い合わせは下記フォームからお送りください。\nhttps://insightwatch.zendesk.com/hc/ja/requests/new\n\nClassmethod, Inc.\nhttps://classmethod.jp/\n"
        bcc_addresses = [
            regist_user_pool_body["mailAddress"]
        ]
        template_body_mail_object = Template(template_body_mail)
        user_name_sign_in = record_affiliation['MailAddress']
        organization_name = record_organization['OrganizationName']

        # get time to live
        time_zone = date_utils.get_time_zone_by_language(
            regist_user_pool_body['mailLang'])
        time_to_live_date = date_utils.get_current_date() + timedelta(days=6)
        time_to_live = date_utils.toString(time_to_live_date,
                                           date_utils.PATTERN_YYYYMMDD_SLASH,
                                           time_zone)

        context = {
            'mailAddress': regist_user_pool_body["mailAddress"],
            'userName': user_name_sign_in,
            'organizationName': organization_name,
            'temporaryPassword': temporary_password,
            'timeToLive': time_to_live
        }
        body_mail = template_body_mail_object.render(context)
        # mock object
        patch_get_cognito_user_pools = patch("premembers.common.aws_common.get_cognito_user_pools")
        patch_process_admin_create_user_pools = patch("premembers.common.aws_common.process_admin_create_user_pools")
        patch_update_cognito_user_pools = patch("premembers.common.aws_common.update_cognito_user_attributes")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.get_affiliation")
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_create_affiliation = patch("premembers.repository.pm_affiliation.create_affiliation")
        patch_query_key_pm_user_attribute = patch('premembers.repository.pm_userAttribute.query_key')
        patch_read_yaml = patch("premembers.common.FileUtils.read_yaml")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")
        patch_send_email = patch("premembers.common.aws_common.send_email")
        patch_get_uuid4 = patch("premembers.common.common_utils.get_uuid4")
        patch_get_password_temporary = patch("premembers.common.common_utils.get_password_temporary")
        patch_date_utils_to_string = patch("premembers.common.date_utils.toString")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_process_admin_create_user_pools = patch_process_admin_create_user_pools.start()
        mock_update_cognito_user_pools = patch_update_cognito_user_pools.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_get_organization = patch_get_organization.start()
        mock_create_affiliation = patch_create_affiliation.start()
        mock_query_key_pm_user_attribute = patch_query_key_pm_user_attribute.start()
        mock_read_yaml = patch_read_yaml.start()
        mock_read_decode = patch_read_decode.start()
        mock_send_email = patch_send_email.start()
        mock_get_uuid4 = patch_get_uuid4.start()
        mock_get_password_temporary = patch_get_password_temporary.start()
        mock_date_utils_to_string = patch_date_utils_to_string.start()

        # mock data
        mock_get_cognito_user_pools.return_value = []
        mock_process_admin_create_user_pools.return_value = True
        mock_update_cognito_user_pools.side_effect = None
        mock_get_affiliation.side_effect = mock_side_effect_get_affiliation
        mock_get_uuid4.return_value = user_invite
        mock_get_organization.return_value = record_organization
        mock_create_affiliation.side_effect = None
        mock_query_key_pm_user_attribute.return_value = copy.deepcopy(DataPmUserAttribute.DATA_NOT_CONTAIN_USER_NAME)
        mock_read_yaml.return_value = {
            "ses.region": ses_region,
            "ja.invite_mail.insightwatch.subject": mail_subject,
            "ja.invite_mail.insightwatch.body.text.filepath": "check/notify/mail/insightwatch_user_invite_template_ja.tpl",
            "en.invite_mail.insightwatch.subject": "You're Invited: insightwatch(DEV)",
            "en.invite_mail.insightwatch.body.text.filepath": "check/notify/mail/insightwatch_user_invite_template_en.tpl",
            "invite_mail.insightwatch.from": mail_from
        }
        mock_read_decode.return_value = template_body_mail
        mock_get_password_temporary.return_value = temporary_password
        mock_date_utils_to_string.return_value = time_to_live

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_process_admin_create_user_pools.stop)
        self.addCleanup(patch_update_cognito_user_pools.stop)
        self.addCleanup(patch_get_affiliation.stop)
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_create_affiliation.stop)
        self.addCleanup(patch_query_key_pm_user_attribute.stop)
        self.addCleanup(patch_read_yaml.stop)
        self.addCleanup(patch_read_decode.stop)
        self.addCleanup(patch_send_email.stop)
        self.addCleanup(patch_get_password_temporary.stop)

        # call Function test
        response = organizations.execute_force_invites_handler(
            event_mock, {})

        # assert output function
        # check call function send mail
        mock_send_email.assert_called_once_with(
            user_invite, ses_region, mail_from, bcc_addresses,
            mail_subject, body_mail)

        # check data respone
        status_code = response['statusCode']
        response_body = json.loads(response['body'])
        self.assertEqual(status_code, HTTPStatus.CREATED)
        self.assertEqual(regist_user_pool_body['authority'], response_body['Authority'])
        self.assertEqual(regist_user_pool_body['mailAddress'], response_body['MailAddress'])
        self.assertEqual(organization_id, response_body['OrganizationID'])
        self.assertEqual(user_id_authority_owner, response_body['UserID'])

    def test_execute_force_invites_handler_error_access_authority(self):
        # data event error access authority
        event_mock = event_create.get_event_object(
            trace_id=user_id_authority_editor,
            path_parameters=path_parameters,
            body=json.dumps(regist_user_pool_body))

        # call Function test
        response = organizations.execute_force_invites_handler(
            event_mock, {})

        # Check data
        message_101 = MsgConst.ERR_101
        response_body = json.loads(response['body'])
        self.assertEqual(response_body['code'], message_101['code'])
        self.assertEqual(response_body['message'], message_101['message'])
        self.assertEqual(response['statusCode'], HTTPStatus.FORBIDDEN)
