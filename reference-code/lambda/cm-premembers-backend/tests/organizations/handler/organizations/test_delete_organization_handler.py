import os
import json
import boto3

from http import HTTPStatus
from tests import event_create
from unittest.mock import patch
from moto import mock_sns
from tests.testcasebase import TestCaseBase
from tests.mock.data.aws.sns.data_test_sns import DataTestSns
from premembers.organizations.handler import organizations
from tests.mock.data.aws.data_common import DataCommon
from tests.mock.aws.sns import sns_utils
from botocore.exceptions import ClientError

user_id = DataCommon.USER_ID_TEST.format(str(3))
organization_id = DataCommon.ORGANIZATION_ID_TEST.format(str(3))
event_mock = event_create.get_event_object(
    trace_id=user_id,
    path_parameters={"organization_id": organization_id},
    email="test_delete_organization@luvina.net")


class TestDeleteOrganizationHandler(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_delete_organization_handler_success(self):
        subject = DataTestSns.SUBJECT
        message = DataTestSns.MESSAGE
        topic_arn_test = os.environ.get("SNS_ORGANIZATION_TOPIC")

        # mock object
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_delete_organization = patch("premembers.repository.pm_organizations.delete_organization")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.query_organization_index")
        patch_get_uuid4 = patch("premembers.common.common_utils.get_uuid4")
        patch_create_organizationTask = patch("premembers.repository.pm_organizationTasks.create_organizationTask")
        patch_aws_sns = patch("premembers.common.aws_common.aws_sns")

        # start mock object
        mock_get_organization = patch_get_organization.start()
        mock_delete_organization = patch_delete_organization.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_get_uuid4 = patch_get_uuid4.start()
        mock_create_organizationTask = patch_create_organizationTask.start()
        mock_aws_sns = patch_aws_sns.start()

        # mock data
        mock_get_organization.return_value = {
            "Contract": 0,
            "ContractStatus": 1,
            "CreatedAt": "2019-05-17 06:32:31.728",
            "OrganizationID": organization_id,
            "OrganizationName": "OrganizationName",
            "UpdatedAt": "2019-05-17 06:32:31.728"
        }
        mock_delete_organization.side_effect = None
        mock_get_affiliation.return_value = []
        mock_get_uuid4.return_value = DataTestSns.TASK_ID
        mock_create_organizationTask.side_effect = None
        mock_aws_sns.side_effect = None

        # addCleanup stop mock object
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_delete_organization.stop)
        self.addCleanup(patch_get_affiliation.stop)
        self.addCleanup(patch_get_uuid4.stop)
        self.addCleanup(patch_create_organizationTask.stop)
        self.addCleanup(patch_aws_sns.stop)

        # call Function test
        actual_response = organizations.delete_organization_handler(
            event_mock, {})

        # check param call fuction aws_sns
        mock_aws_sns.assert_called_once_with(user_id, subject,
                                             json.dumps(message),
                                             topic_arn_test)

        # check data respone
        self.assertEqual(HTTPStatus.NO_CONTENT, actual_response['statusCode'])

    @mock_sns
    def test_delete_organization_handler_error_publish_message(self):
        # mock object
        patch_get_organization = patch("premembers.repository.pm_organizations.get_organization")
        patch_delete_organization = patch("premembers.repository.pm_organizations.delete_organization")
        patch_get_affiliation = patch("premembers.repository.pm_affiliation.query_organization_index")
        patch_get_uuid4 = patch("premembers.common.common_utils.get_uuid4")
        patch_create_organizationTask = patch("premembers.repository.pm_organizationTasks.create_organizationTask")

        client = sns_utils.client_connect()
        patch_boto3_client = patch.object(boto3, 'client')
        patch_client_publish = patch.object(client, 'publish')

        # start mock object
        mock_get_organization = patch_get_organization.start()
        mock_delete_organization = patch_delete_organization.start()
        mock_get_affiliation = patch_get_affiliation.start()
        mock_get_uuid4 = patch_get_uuid4.start()
        mock_create_organizationTask = patch_create_organizationTask.start()
        mock_boto3_client = patch_boto3_client.start()
        mock_client_publish = patch_client_publish.start()

        # mock data
        mock_get_organization.return_value = {
            "Contract": 0,
            "ContractStatus": 1,
            "CreatedAt": "2019-05-17 06:32:31.728",
            "OrganizationID": organization_id,
            "OrganizationName": "OrganizationName",
            "UpdatedAt": "2019-05-17 06:32:31.728"
        }
        mock_delete_organization.side_effect = None
        mock_get_affiliation.return_value = []
        mock_get_uuid4.return_value = DataTestSns.TASK_ID
        mock_create_organizationTask.side_effect = None
        mock_boto3_client.return_value = client
        mock_client_publish.side_effect = ClientError(
                error_response=DataCommon.ERROR_RESPONSE,
                operation_name=DataCommon.OPERATION_NAME)

        # addCleanup stop mock object
        self.addCleanup(patch_get_organization.stop)
        self.addCleanup(patch_delete_organization.stop)
        self.addCleanup(patch_get_affiliation.stop)
        self.addCleanup(patch_get_uuid4.stop)
        self.addCleanup(patch_create_organizationTask.stop)
        self.addCleanup(patch_client_publish.stop)
        self.addCleanup(patch_boto3_client.stop)

        # call Function test
        actual_response = organizations.delete_organization_handler(
            event_mock, {})

        # check data respone
        self.assertEqual(HTTPStatus.NO_CONTENT, actual_response['statusCode'])
