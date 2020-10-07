import os
import unittest

from pathlib import Path
from dotenv import load_dotenv
from tests.mock import mock_common_utils
from moto import mock_dynamodb2, mock_cognitoidp, mock_ses, mock_sts, mock_iam
from moto import mock_s3, mock_kms


class TestCaseBase(unittest.TestCase):
    @mock_dynamodb2
    @mock_cognitoidp
    @mock_iam
    @mock_ses
    @mock_sts
    @mock_s3
    @mock_kms
    def setUp(self):
        dotenv_path = Path(os.getcwd()).joinpath('.env')
        if os.path.exists(dotenv_path):
            load_dotenv(dotenv_path)

        # connect all aws
        mock_common_utils.connect_aws_mock()

        # mock up authority
        self.create_authority_mock()

        # create dynamodb mock
        self.create_boto3_mock()

    def create_authority_mock(self):
        patcher_authority = mock_common_utils.mock_authority()
        patcher_authority.start()
        self.addCleanup(patcher_authority.stop)

    def create_boto3_mock(self):
        # boto3 client mock
        patch_boto3_client = mock_common_utils.mock_boto3_client()
        patch_boto3_client.start()
        self.addCleanup(patch_boto3_client.stop)

        # boto3 resource mock
        patch_boto3_resource = mock_common_utils.mock_boto3_resource()
        patch_boto3_resource.start()
        self.addCleanup(patch_boto3_resource.stop)

    def create_mock_boto3_client_error(self):
        patcher_boto3_client_error = mock_common_utils.mock_boto3_client_error()
        mock_boto3_client = patcher_boto3_client_error.start()
        mock_boto3_client.return_value = 1
        self.addCleanup(patcher_boto3_client_error.stop)

    def create_mock_boto3_resource_error(self):
        patcher_mock_boto3_resource_error = mock_common_utils.mock_boto3_resource_error()
        mock_boto3_resource = patcher_mock_boto3_resource_error.start()
        mock_boto3_resource.return_value = 1
        self.addCleanup(patcher_mock_boto3_resource_error.stop)

    def create_mock_session_client_error(self):
        patcher_boto3_client_error = mock_common_utils.mock_session_client_error()
        mock_boto3_client = patcher_boto3_client_error.start()
        mock_boto3_client.return_value = 1
        self.addCleanup(patcher_boto3_client_error.stop)
