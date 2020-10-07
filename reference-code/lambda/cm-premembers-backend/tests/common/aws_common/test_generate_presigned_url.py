import json
import copy

import boto3
from moto import mock_s3
from unittest.mock import patch
from tests.mock.aws.s3 import s3_utils
from premembers.common import aws_common
from tests.testcasebase import TestCaseBase
from botocore.exceptions import ClientError
from premembers.exception.pm_exceptions import PmError
from tests.mock.data.aws.s3.data_test_s3 import DataTestS3
from tests.mock.data.aws.data_common import DataCommon

bucket_name = copy.deepcopy(DataTestS3.INFO_BUCKET['Bucket'])
trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(3))


@mock_s3
class TestGeneratePresignedUrl(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_generate_presigned_url_success(self):
        # connect s3
        resource_s3 = s3_utils.resource_connect()
        client_s3 = s3_utils.client_connect()

        # prepare data
        resource_s3.create_bucket(Bucket=bucket_name)
        key = resource_s3.Object(
            bucket_name,
            'template-key').put(Body=json.dumps(copy.deepcopy(DataTestS3.INFO_BUCKET)))

        with patch.object(boto3, 'client') as mock_method_client:
            mock_method_client.return_value = client_s3
            # call function test
            response_url = aws_common.generate_presigned_url(
                trace_id, bucket_name, json.dumps(key))

        # check result
        self.assertIn(bucket_name, response_url)

        # check connect client
        mock_method_client.assert_called_with('s3')

    def test_generate_presigned_url_error_client(self):
        # create mock error client s3
        self.create_mock_boto3_client_error()

        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        with self.assertRaises(PmError) as exception:
            # call function test
            aws_common.generate_presigned_url(trace_id, bucket_name, 'key')

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

    def test_generate_presigned_url_error_call_generate_presigned_url(self):
        # connect s3
        client_connect_s3 = s3_utils.client_connect()

        # create mock throw error when called function generate_presigned_url
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        with patch.object(client_connect_s3,
                          'generate_presigned_url') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with self.assertRaises(PmError) as exception:
                # call function test
                aws_common.generate_presigned_url(trace_id, bucket_name, 'key')

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         expected_error_response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)
