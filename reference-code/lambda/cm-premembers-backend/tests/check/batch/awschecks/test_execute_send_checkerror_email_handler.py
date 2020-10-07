import copy
import jmespath
import json

from jinja2 import Template
from moto import mock_dynamodb2
from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from premembers.check.batch import awschecks
from tests.mock import mock_common_utils
from tests.mock.aws.dynamodb import db_utils
from tests.mock.aws.dynamodb import pm_projects as mock_pm_projects
from tests.mock.aws.dynamodb import pm_organizations as mock_pm_organizations
from tests.mock.data.aws.dynamodb.data_pm_organizations import DataPmOrganizations
from tests.mock.data.aws.cognito_idp.data_test_cognito_idp import DataTestCognitoIdp
from tests.mock.data.aws.dynamodb.data_pm_project import DataPmProjects
from premembers.repository.table_list import Tables
from tests.mock.data.aws.s3.data_test_s3 import DataTestS3
from tests.mock.data.aws.aws_request import AwsRequest
from tests.mock.data.aws.dynamodb.data_common import DataCommon

data_pm_project = copy.deepcopy(DataPmProjects.DATA_SIMPLE)
data_pm_organization = copy.deepcopy(DataPmOrganizations.DATA_SIMPLE)
user_info_cognito = copy.deepcopy(DataTestCognitoIdp.USER_INFO_COGNITO)
context_aws = copy.deepcopy(AwsRequest)
check_history_id = copy.deepcopy(DataCommon.CHECK_HISTORY_ID.format(str(3)))
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
organization_id = data_pm_organization['OrganizationID']
project_id = data_pm_project['ProjectID']
even_mock = {
    "Records": [{
        "EventSource":
        "aws:sns",
        "EventVersion":
        "1.0",
        "EventSubscriptionArn":
        "arn:aws:sns:ap-northeast-1:216054658829:Premembers-Securitycheck-batch-error-notify:7ac53550-daac-4188-ac3f-01760588b6e1",
        "Sns": {
            "Type":
            "Notification",
            "MessageId":
            "020bed20-7771-5272-910f-bb37d1e90ec7",
            "TopicArn":
            "arn:aws:sns:ap-northeast-1:216054658829:Premembers-Securitycheck-batch-error-notify",
            "Subject":
            "チェックバッチ実行失敗",
            "Message": None,
            "Timestamp":
            "2019-10-09T09:11:52.874Z",
            "SignatureVersion":
            "1",
            "Signature":
            "rDTAmAjuF/2n1Se5ERhwO1bBk4m9cr4MLM8lStfLzU8ZmDBTHGXuQMhhR9zVQBVoNHBM/L/WfBJuxUSLb5P8UvB9Hu8INDHjmaCNLmfvxp4xdRKgNAXWffduvsB7ujULw2bvCtHwtY3VytKzC75uD7rL3YQVgfJwMinuqIyxMLMHPpKOIXzXEtK154iNJ3mJ7s28HrbymldjCwEGsdk19JNDH4khm6Z7UscTqGjtZq1GWJyRc/UtX9uysTRDEAyNaBBxTI5tbwGYydk8MjAuJxflS/LH95gv2/Gjvwk3qNAYJuJU86AAiS4YWSfX+TkY/q8wwwW+B8T4rYX0PxMoUA==",
            "SigningCertUrl":
            "https://sns.ap-northeast-1.amazonaws.com/SimpleNotificationService-6aad65c2f9911b05cd53efda11f913f9.pem",
            "UnsubscribeUrl":
            "https://sns.ap-northeast-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:ap-northeast-1:216054658829:Premembers-Securitycheck-batch-error-notify:7ac53550-daac-4188-ac3f-01760588b6e1",
            "MessageAttributes": {}
        }
    }]
}


@mock_dynamodb2
class TestExecuteSendCheckErrorEmailHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_PROJECTS):
            db_utils.delete_table(Tables.PM_PROJECTS)
        if db_utils.check_table_exist(Tables.PM_ORGANIZATIONS):
            db_utils.delete_table(Tables.PM_ORGANIZATIONS)

        # create table
        mock_pm_projects.create_table()
        mock_pm_organizations.create_table()

        # create data table
        mock_pm_projects.create(data_pm_project)
        mock_pm_organizations.create(data_pm_organization)

    def test_execute_send_checkerror_email_handler_success_content_message_send_mail_contain_define_data_error(self):
        # prepare data
        message = {
            "AWSAccount": aws_account,
            "ErrorCode": "error_get_bucket_acl",
            "CheckHistoryId": check_history_id,
            "OrganizationID": organization_id,
            "ProjectID": project_id,
            "ExecuteUserID": "ExecuteUserID",
            "RegionName": "global",
            "CheckCodeItem": "CHECK_CIS12_ITEM_2_03",
            "DataBody": {
                "S3BucketName": "test s3 bucket name"
            }
        }
        even_mock['Records'][0]['Sns']['Message'] = json.dumps(message)

        ses_region = copy.deepcopy(DataTestS3.DATA_CONFIG['ses.region'])
        mail_from = copy.deepcopy(DataTestS3.DATA_CONFIG['mail.from'])
        mail_subject_config = copy.deepcopy(DataTestS3.DATA_CONFIG['ja.checkerror_notice_mail.subject'])
        subject_template = Template(mail_subject_config)
        mail_subject = subject_template.render(project_name=data_pm_project['ProjectName'])
        template_body_mail = copy.deepcopy(DataTestS3.TEMPLATE_NOTICE_ERROR_EXECUTE_CHECK_JA)
        mail_execute_user = jmespath.search(
            "[?Name=='email'].Value | [0]",
            user_info_cognito['UserAttributes'])

        bcc_addresses = [
            mail_execute_user
        ]
        content_message = copy.deepcopy(DataTestS3.MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY_JA['error_get_bucket_acl.text'].format_map(message['DataBody']))
        template_body_mail_object = Template(template_body_mail)
        context = {
            'organizationName': data_pm_organization['OrganizationName'],
            'projectName': data_pm_project['ProjectName'],
            'checkCodeItem': 'CIS 2.3',
            'awsAccount': message['AWSAccount'],
            'regionName': message['RegionName'],
            'contentMessage': content_message
        }
        body_mail = template_body_mail_object.render(context)

        # patch mock
        patch_get_cognito_user_info_by_user_name = patch("premembers.common.aws_common.get_cognito_user_info_by_user_name")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")
        patch_send_email = patch("premembers.common.aws_common.send_email")

        # start mock object
        mock_get_cognito_user_info_by_user_name = patch_get_cognito_user_info_by_user_name.start()
        mock_read_decode = patch_read_decode.start()
        mock_send_email = patch_send_email.start()

        # mock data
        result_mock_read_yaml = mock_common_utils.mock_read_yaml(self, True)
        mock_get_cognito_user_info_by_user_name.return_value = user_info_cognito
        mock_read_decode.return_value = copy.deepcopy(DataTestS3.TEMPLATE_NOTICE_ERROR_EXECUTE_CHECK_JA)
        mock_send_email.side_effect = None

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_info_by_user_name.stop)
        self.addCleanup(result_mock_read_yaml[1].stop)
        self.addCleanup(patch_read_decode.stop)
        self.addCleanup(patch_send_email.stop)

        # Call function test
        awschecks.execute_send_checkerror_email_handler(even_mock, context_aws)

        # check call send mail
        mock_send_email.assert_called_once_with(message['ExecuteUserID'],
                                                ses_region, mail_from,
                                                bcc_addresses, mail_subject,
                                                body_mail)

    def test_execute_send_checkerror_email_handler_success_content_message_default(self):
        # prepare data
        message = {
            "AWSAccount": aws_account,
            "ErrorCode": "default",
            "CheckHistoryId": check_history_id,
            "OrganizationID": organization_id,
            "ProjectID": project_id,
            "ExecuteUserID": "ExecuteUserID",
            "RegionName": "global",
            "CheckCodeItem": "CHECK_CIS12_ITEM_2_03",
            "DataBody": None
        }
        even_mock['Records'][0]['Sns']['Message'] = json.dumps(message)

        ses_region = copy.deepcopy(DataTestS3.DATA_CONFIG['ses.region'])
        mail_from = copy.deepcopy(DataTestS3.DATA_CONFIG['mail.from'])
        mail_subject_config = copy.deepcopy(DataTestS3.DATA_CONFIG['ja.checkerror_notice_mail.subject'])
        subject_template = Template(mail_subject_config)
        mail_subject = subject_template.render(project_name=data_pm_project['ProjectName'])
        template_body_mail = copy.deepcopy(DataTestS3.TEMPLATE_NOTICE_ERROR_EXECUTE_CHECK_JA)
        mail_execute_user = jmespath.search(
            "[?Name=='email'].Value | [0]",
            user_info_cognito['UserAttributes'])

        bcc_addresses = [
            mail_execute_user
        ]
        content_message = copy.deepcopy(DataTestS3.MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY_JA['default.text'])
        template_body_mail_object = Template(template_body_mail)
        context = {
            'organizationName': data_pm_organization['OrganizationName'],
            'projectName': data_pm_project['ProjectName'],
            'checkCodeItem': 'CIS 2.3',
            'awsAccount': message['AWSAccount'],
            'regionName': message['RegionName'],
            'contentMessage': content_message
        }
        body_mail = template_body_mail_object.render(context)

        # patch mock
        patch_get_cognito_user_info_by_user_name = patch("premembers.common.aws_common.get_cognito_user_info_by_user_name")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")
        patch_send_email = patch("premembers.common.aws_common.send_email")

        # start mock object
        mock_get_cognito_user_info_by_user_name = patch_get_cognito_user_info_by_user_name.start()
        mock_read_decode = patch_read_decode.start()
        mock_send_email = patch_send_email.start()

        # mock data
        result_mock_read_yaml = mock_common_utils.mock_read_yaml(self, True)
        mock_get_cognito_user_info_by_user_name.return_value = user_info_cognito
        mock_read_decode.return_value = copy.deepcopy(DataTestS3.TEMPLATE_NOTICE_ERROR_EXECUTE_CHECK_JA)
        mock_send_email.side_effect = None

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_info_by_user_name.stop)
        self.addCleanup(result_mock_read_yaml[1].stop)
        self.addCleanup(patch_read_decode.stop)
        self.addCleanup(patch_send_email.stop)

        # Call function test
        awschecks.execute_send_checkerror_email_handler(even_mock, context_aws)

        # check call send mail
        mock_send_email.assert_called_once_with(message['ExecuteUserID'],
                                                ses_region, mail_from,
                                                bcc_addresses, mail_subject,
                                                body_mail)

    def test_execute_send_checkerror_email_handler_success_param_region_name_is_none_and_check_code_item_is_none(self):
        # prepare data
        message = {
            "AWSAccount": aws_account,
            "ErrorCode": "default",
            "CheckHistoryId": check_history_id,
            "OrganizationID": organization_id,
            "ProjectID": project_id,
            "ExecuteUserID": "ExecuteUserID",
            "RegionName": None,
            "CheckCodeItem": None,
            "DataBody": None
        }
        even_mock['Records'][0]['Sns']['Message'] = json.dumps(message)

        ses_region = copy.deepcopy(DataTestS3.DATA_CONFIG['ses.region'])
        mail_from = copy.deepcopy(DataTestS3.DATA_CONFIG['mail.from'])
        mail_subject_config = copy.deepcopy(DataTestS3.DATA_CONFIG['ja.checkerror_notice_mail.subject'])
        subject_template = Template(mail_subject_config)
        mail_subject = subject_template.render(project_name=data_pm_project['ProjectName'])
        template_body_mail = copy.deepcopy(DataTestS3.TEMPLATE_NOTICE_ERROR_EXECUTE_CHECK_JA)
        mail_execute_user = jmespath.search(
            "[?Name=='email'].Value | [0]",
            user_info_cognito['UserAttributes'])

        bcc_addresses = [
            mail_execute_user
        ]
        content_message = copy.deepcopy(DataTestS3.MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY_JA['default.text'])
        template_body_mail_object = Template(template_body_mail)
        context = {
            'organizationName': data_pm_organization['OrganizationName'],
            'projectName': data_pm_project['ProjectName'],
            'checkCodeItem': message['CheckCodeItem'],
            'awsAccount': message['AWSAccount'],
            'regionName': message['RegionName'],
            'contentMessage': content_message
        }
        body_mail = template_body_mail_object.render(context)

        # patch mock
        patch_get_cognito_user_info_by_user_name = patch("premembers.common.aws_common.get_cognito_user_info_by_user_name")
        patch_read_decode = patch("premembers.common.FileUtils.read_decode")
        patch_send_email = patch("premembers.common.aws_common.send_email")

        # start mock object
        mock_get_cognito_user_info_by_user_name = patch_get_cognito_user_info_by_user_name.start()
        mock_read_decode = patch_read_decode.start()
        mock_send_email = patch_send_email.start()

        # mock data
        result_mock_read_yaml = mock_common_utils.mock_read_yaml(self, True)
        mock_get_cognito_user_info_by_user_name.return_value = user_info_cognito
        mock_read_decode.return_value = copy.deepcopy(DataTestS3.TEMPLATE_NOTICE_ERROR_EXECUTE_CHECK_JA)
        mock_send_email.side_effect = None

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_info_by_user_name.stop)
        self.addCleanup(result_mock_read_yaml[1].stop)
        self.addCleanup(patch_read_decode.stop)
        self.addCleanup(patch_send_email.stop)

        # Call function test
        awschecks.execute_send_checkerror_email_handler(even_mock, context_aws)

        # check call send mail
        mock_send_email.assert_called_once_with(message['ExecuteUserID'],
                                                ses_region, mail_from,
                                                bcc_addresses, mail_subject,
                                                body_mail)
