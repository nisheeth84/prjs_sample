import json
import copy
import boto3

from moto import mock_s3
from unittest.mock import patch
from tests.mock.aws.s3 import s3_utils
from premembers.common import aws_common
from tests.testcasebase import TestCaseBase
from botocore.exceptions import ClientError
from tests.mock.data.aws.s3.data_test_s3 import DataTestS3
from tests.mock.data.aws.data_common import DataCommon
from premembers.exception.pm_exceptions import PmError
from premembers.common import common_utils

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(3))
s3_file_name = copy.deepcopy(DataTestS3.S3_FILE_NAME_JSON)


@mock_s3
class TestCheckExistsFileS3(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_check_exists_file_s3_success_case_not_exists_file_s3(self):
        # connect s3
        resource_s3 = s3_utils.resource_connect()

        check_bucket = common_utils.get_environ("S3_CHECK_BUCKET")
        s3_file_name_not_exists = "check_history_id/organization_id/project_id/awsaccount/raw/filenamenotexists.json"

        # prepare data
        resource_s3.create_bucket(Bucket=check_bucket)
        mybucket = resource_s3.Bucket(name=check_bucket)

        with patch.object(boto3, 'resource') as mock_method_resource:
            mock_method_resource.return_value = resource_s3
            with patch.object(resource_s3, 'Bucket') as mock_method_bucket:
                mock_method_bucket.return_value = mybucket

            # call function test
            actual_response = aws_common.check_exists_file_s3(
                trace_id, "S3_CHECK_BUCKET", s3_file_name_not_exists)

        # check result
        expected_response = False
        self.assertEqual(expected_response, actual_response)

        # check connect resource
        mock_method_resource.assert_called_with('s3')

    def test_check_exists_file_s3_success_case_exists_file_s3(self):
        # connect s3
        resource_s3 = s3_utils.resource_connect()
        client_s3 = s3_utils.client_connect()

        check_bucket = common_utils.get_environ("S3_CHECK_BUCKET")

        # prepare data
        resource_s3.create_bucket(Bucket=check_bucket)
        client_s3.put_object(Body=json.dumps(
            copy.deepcopy(DataTestS3.INFO_BUCKET)),
                             Bucket=check_bucket,
                             Key=s3_file_name)
        mybucket = resource_s3.Bucket(name=check_bucket)

        with patch.object(boto3, 'resource') as mock_method_resource:
            mock_method_resource.return_value = resource_s3
            with patch.object(resource_s3, 'Bucket') as mock_method_bucket:
                mock_method_bucket.return_value = mybucket

            # call function test
            actual_response = aws_common.check_exists_file_s3(
                trace_id, "S3_CHECK_BUCKET", s3_file_name)

        # check result
        expected_response = True
        self.assertEqual(expected_response, actual_response)

        # check connect resource
        mock_method_resource.assert_called_with('s3')

    def test_check_exists_file_s3_error_resource(self):
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        # create mock error resource s3
        self.create_mock_boto3_resource_error()

        with self.assertRaises(PmError) as exception:
            # call function test
            aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                            s3_file_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

    def test_check_exists_file_s3_error_call_bucket(self):
        # connect s3
        resource_connect_s3 = s3_utils.resource_connect()

        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        # create mock throw error when called function Bucket
        with patch.object(resource_connect_s3, 'Bucket') as mock_method_bucket:
            mock_method_bucket.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with self.assertRaises(PmError) as exception:
                # call function test
                aws_common.check_exists_file_s3(trace_id, "S3_CHECK_BUCKET",
                                                s3_file_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)
