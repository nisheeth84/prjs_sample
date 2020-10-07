import copy

from tests.testcasebase import TestCaseBase
from http import HTTPStatus
from premembers.user.handler import user
from tests import event_create
from moto import mock_dynamodb2
from unittest.mock import patch
from tests.mock.aws.dynamodb import db_utils
from premembers.repository.table_list import Tables
from tests.mock.aws.dynamodb import pm_affiliation as mock_pm_affiliation
from tests.mock.aws.dynamodb import pm_emailchangeapply as mock_pm_emailChangeApply
from tests.mock.aws.dynamodb import pm_orgNotifyMailDestinations as mock_pm_orgNotifyMailDestinations
from tests.mock.data.aws.dynamodb.data_pm_affiliation import DataPmAffiliation
from tests.mock.data.aws.dynamodb.data_pm_email_change_apply import DataPmEmailChangeApply
from tests.mock.data.aws.dynamodb.data_pm_org_notify_mail_destinations import DataPmOrgNotifyMailDestinations
from tests.mock.data.aws.cognito_idp.data_test_cognito_idp import DataTestCognitoIdp
from tests.mock.data.aws.s3.data_test_s3 import DataTestS3
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.data_common import DataCommon as data_common_aws

list_affiliations = copy.deepcopy(DataPmAffiliation.LIST_AFFILIATIONS)
data_insert_caller_service_name_insightwatch = copy.deepcopy(
    DataPmEmailChangeApply.DATA_CALLER_SERVICE_NAME_INSIGHTWATCH)
data_insert_caller_service_name_opswitch = copy.deepcopy(
    DataPmEmailChangeApply.DATA_CALLER_SERVICE_NAME_OPSWITCH)
data_insert_not_exists_caller_service_name = copy.deepcopy(
    DataPmEmailChangeApply.DATA_INSERT_NOT_EXISTS_CALLER_SERVICE_NAME)
list_org_notify_mail_destinations = copy.deepcopy(
    DataPmOrgNotifyMailDestinations.LIST_ORG_NOTIFY_MAIL_DESTINATIONS)
content_type_text_html = "text/html"
notify_code = copy.deepcopy(DataPmOrgNotifyMailDestinations.NOTIFY_CODE)
after_mail_address = copy.deepcopy(DataPmEmailChangeApply.AFTER_MAIL_ADDRESS)
user_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
user_attributes = [
    {
        'Name': 'email',
        'Value': after_mail_address
    },
    {
        'Name': 'email_verified',
        'Value': 'true'
    }
]
user_info = copy.deepcopy(
    DataTestCognitoIdp.USER_INFOR_GET_COGNITO_USER_INFO_BY_USER_NAME)


apply_id = copy.deepcopy(DataPmEmailChangeApply.APPLY_ID.format(str(3)))
pathParameters = {
    'apply_id': apply_id
}
event_mock = event_create.get_event_object(path_parameters=pathParameters)
response_execute_change_email_caller_service_insightwatch = copy.deepcopy(
    data_common_aws.RESPONSE_EXECUTE_CHANGE_EMAIL_CALLER_SERVICE_INSIGHTWATCH)
response_execute_change_email_caller_service_opswitch = copy.deepcopy(
    data_common_aws.RESPONSE_EXECUTE_CHANGE_EMAIL_CALLER_SERVICE_OPSWITCH)
data_config = copy.deepcopy(DataTestS3.DATA_CONFIG)


@mock_dynamodb2
class TestExecuteChangeEmailHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

        # truncate old data in the table
        if db_utils.check_table_exist(Tables.PM_EMAIL_CHANGE_APPLY):
            db_utils.delete_table(Tables.PM_EMAIL_CHANGE_APPLY)

        if db_utils.check_table_exist(Tables.PM_AFFILIATION):
            db_utils.delete_table(Tables.PM_AFFILIATION)

        if db_utils.check_table_exist(Tables.PM_ORG_NOTIFY_MAIL_DESTINATIONS):
            db_utils.delete_table(Tables.PM_ORG_NOTIFY_MAIL_DESTINATIONS)

        # create PM_Affiliation table
        mock_pm_affiliation.create_table()
        # create PM_EmailChangeApply table
        mock_pm_emailChangeApply.create_table()
        # create PM_OrgNotifyMailDestinations table
        mock_pm_orgNotifyMailDestinations.create_table()

    def test_execute_change_email_handler_success_case_caller_service_name_is_insightwatch(self):
        # perpare data test
        for affiliation in list_affiliations:
            mock_pm_affiliation.create(affiliation)

        for org_notify_mail_destination in list_org_notify_mail_destinations:
            mock_pm_orgNotifyMailDestinations.create(
                org_notify_mail_destination)

        mock_pm_emailChangeApply.create(
            data_insert_caller_service_name_insightwatch)

        # patch mock
        get_cognito_user_info_by_user_name_patch = patch(
            'premembers.common.aws_common.get_cognito_user_info_by_user_name')
        update_cognito_user_attributes_patch = patch(
            'premembers.common.aws_common.update_cognito_user_attributes')
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')

        # start mock object
        mock_get_cognito_user_info_by_user_name = get_cognito_user_info_by_user_name_patch.start()
        mock_update_cognito_user_attributes = update_cognito_user_attributes_patch.start()
        mock_read_yaml = patch_read_yaml.start()

        # mock data
        mock_get_cognito_user_info_by_user_name.return_value = user_info
        mock_update_cognito_user_attributes.return_value = None
        mock_read_yaml.return_value = data_config

        # addCleanup stop mock object
        self.addCleanup(get_cognito_user_info_by_user_name_patch.stop)
        self.addCleanup(update_cognito_user_attributes_patch.stop)
        self.addCleanup(patch_read_yaml.stop)

        # Call function test
        result = user.execute_change_email_handler(event_mock, {})

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(
            response_execute_change_email_caller_service_insightwatch,
            response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check update data table PM_OrgNotifyMailDestinations
        for affiliation in list_affiliations:
            org_notify_mail_destinations = mock_pm_orgNotifyMailDestinations.query_key(
                affiliation['OrganizationID'], notify_code)
            for destination in org_notify_mail_destinations['Destinations']:
                self.assertEqual(after_mail_address,
                                 destination['MailAddress'])

        # check update data table PM_Affiliation
        list_affiliations_update = mock_pm_affiliation.query_userid_key(
            user_id)
        for affiliation_update in list_affiliations_update:
            self.assertEqual(after_mail_address,
                             affiliation_update['MailAddress'])

        # check delete data table PM_EmailChangeApply
        email_change_apply = mock_pm_emailChangeApply.query_key(apply_id)
        self.assertEqual(None, email_change_apply)

        # check param call function get_cognito_user_info_by_user_name
        mock_get_cognito_user_info_by_user_name.assert_called_once_with(
            apply_id, user_id)

        # check param call function update_cognito_user_attributes
        mock_update_cognito_user_attributes.update_cognito_user_attributes(
            apply_id, user_id, user_attributes)

    def test_execute_change_email_handler_success_case_caller_service_name_is_opswitch(self):
        # perpare data test
        for affiliation in list_affiliations:
            mock_pm_affiliation.create(affiliation)

        for org_notify_mail_destination in list_org_notify_mail_destinations:
            mock_pm_orgNotifyMailDestinations.create(
                org_notify_mail_destination)

        mock_pm_emailChangeApply.create(
            data_insert_caller_service_name_opswitch)

        # patch mock
        get_cognito_user_info_by_user_name_patch = patch(
            'premembers.common.aws_common.get_cognito_user_info_by_user_name')
        update_cognito_user_attributes_patch = patch(
            'premembers.common.aws_common.update_cognito_user_attributes')
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')

        # start mock object
        mock_get_cognito_user_info_by_user_name = get_cognito_user_info_by_user_name_patch.start()
        mock_update_cognito_user_attributes = update_cognito_user_attributes_patch.start()
        mock_read_yaml = patch_read_yaml.start()

        # mock data
        mock_get_cognito_user_info_by_user_name.return_value = user_info
        mock_update_cognito_user_attributes.return_value = None
        mock_read_yaml.return_value = data_config

        # addCleanup stop mock object
        self.addCleanup(get_cognito_user_info_by_user_name_patch.stop)
        self.addCleanup(update_cognito_user_attributes_patch.stop)
        self.addCleanup(patch_read_yaml.stop)

        # Call function test
        result = user.execute_change_email_handler(event_mock, {})

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(response_execute_change_email_caller_service_opswitch,
                         response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check update data table PM_OrgNotifyMailDestinations
        for affiliation in list_affiliations:
            org_notify_mail_destinations = mock_pm_orgNotifyMailDestinations.query_key(
                affiliation['OrganizationID'], notify_code)
            for destination in org_notify_mail_destinations['Destinations']:
                self.assertEqual(after_mail_address,
                                 destination['MailAddress'])

        # check update data table PM_Affiliation
        list_affiliations_update = mock_pm_affiliation.query_userid_key(
            user_id)
        for affiliation_update in list_affiliations_update:
            self.assertEqual(after_mail_address,
                             affiliation_update['MailAddress'])

        # check delete data table PM_EmailChangeApply
        email_change_apply = mock_pm_emailChangeApply.query_key(apply_id)
        self.assertEqual(None, email_change_apply)

        # check param call function get_cognito_user_info_by_user_name
        mock_get_cognito_user_info_by_user_name.assert_called_once_with(
            apply_id, user_id)

        # check param call function update_cognito_user_attributes
        mock_update_cognito_user_attributes.update_cognito_user_attributes(
            apply_id, user_id, user_attributes)

    def test_execute_change_email_handler_success_case_not_exists_caller_service_name(self):
        # perpare data test
        for affiliation in list_affiliations:
            mock_pm_affiliation.create(affiliation)

        for org_notify_mail_destination in list_org_notify_mail_destinations:
            mock_pm_orgNotifyMailDestinations.create(
                org_notify_mail_destination)

        mock_pm_emailChangeApply.create(
            data_insert_not_exists_caller_service_name)

        # patch mock
        get_cognito_user_info_by_user_name_patch = patch(
            'premembers.common.aws_common.get_cognito_user_info_by_user_name')
        update_cognito_user_attributes_patch = patch(
            'premembers.common.aws_common.update_cognito_user_attributes')
        patch_read_yaml = patch('premembers.common.FileUtils.read_yaml')

        # start mock object
        mock_get_cognito_user_info_by_user_name = get_cognito_user_info_by_user_name_patch.start()
        mock_update_cognito_user_attributes = update_cognito_user_attributes_patch.start()
        mock_read_yaml = patch_read_yaml.start()

        # mock data
        mock_get_cognito_user_info_by_user_name.return_value = user_info
        mock_update_cognito_user_attributes.return_value = None
        mock_read_yaml.return_value = data_config

        # addCleanup stop mock object
        self.addCleanup(get_cognito_user_info_by_user_name_patch.stop)
        self.addCleanup(update_cognito_user_attributes_patch.stop)
        self.addCleanup(patch_read_yaml.stop)

        # Call function test
        result = user.execute_change_email_handler(event_mock, {})

        # Check data
        status_code = result['statusCode']
        response_body = result['body']
        response_headers = result['headers']

        self.assertEqual(HTTPStatus.OK.value, status_code)
        self.assertEqual(
            response_execute_change_email_caller_service_insightwatch,
            response_body)
        self.assertEqual(content_type_text_html,
                         response_headers['content-type'])

        # check update data table PM_OrgNotifyMailDestinations
        for affiliation in list_affiliations:
            org_notify_mail_destinations = mock_pm_orgNotifyMailDestinations.query_key(
                affiliation['OrganizationID'], notify_code)
            for destination in org_notify_mail_destinations['Destinations']:
                self.assertEqual(after_mail_address,
                                 destination['MailAddress'])

        # check update data table PM_Affiliation
        list_affiliations_update = mock_pm_affiliation.query_userid_key(
            user_id)
        for affiliation_update in list_affiliations_update:
            self.assertEqual(after_mail_address,
                             affiliation_update['MailAddress'])

        # check delete data table PM_EmailChangeApply
        email_change_apply = mock_pm_emailChangeApply.query_key(apply_id)
        self.assertEqual(None, email_change_apply)

        # check param call function get_cognito_user_info_by_user_name
        mock_get_cognito_user_info_by_user_name.assert_called_once_with(
            apply_id, user_id)

        # check param call function update_cognito_user_attributes
        mock_update_cognito_user_attributes.update_cognito_user_attributes(
            apply_id, user_id, user_attributes)
