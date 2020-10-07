import copy
import json
import boto3

from moto import mock_s3
from unittest.mock import patch
from tests.mock.aws.s3 import s3_utils
from tests.testcasebase import TestCaseBase
from botocore.exceptions import ClientError
from premembers.exception.pm_exceptions import PmError
from tests.mock.data.aws.s3.data_test_s3 import DataTestS3
from tests.mock.data.aws.data_common import DataCommon
from premembers.common import FileUtils
from premembers.common import common_utils
from premembers.common.pm_log_adapter import PmLogAdapter

s3_file_name = copy.deepcopy(DataTestS3.S3_FILE_NAME_JSON)
trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(3))
data_test_upload_s3 = copy.deepcopy(DataTestS3.DATA_TEST_UPLOAD_S3)

client_s3 = None


@mock_s3
class TestReadJson(TestCaseBase):
    def setUp(self):
        super().setUp()

        # connect s3
        global client_s3
        if not client_s3:
            client_s3 = s3_utils.client_connect()

    def test_read_json_success(self):
        # prepare data
        bucket_name = common_utils.get_environ("S3_CHECK_BUCKET")
        client_s3.create_bucket(Bucket=bucket_name)
        body = json.dumps(data_test_upload_s3)
        client_s3.put_object(Bucket=bucket_name, Key=s3_file_name, Body=body)

        with patch.object(PmLogAdapter, 'info',
                          return_value=None) as mock_method_info:
            with patch.object(boto3, "client", return_value=client_s3):
                # call function test
                actual_result = FileUtils.read_json(trace_id,
                                                    "S3_CHECK_BUCKET",
                                                    s3_file_name)

        # check result
        self.assertEqual(data_test_upload_s3, actual_result)

        # check write log info
        mock_method_info.assert_any_call('read json success')

    def test_read_json_error_client(self):
        # create mock error client s3
        self.create_mock_boto3_client_error()

        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        FileUtils.global_s3_client = None
        with self.assertRaises(PmError) as exception:
            # call function test
            FileUtils.read_json(trace_id, 'S3_CHECK_BUCKET', s3_file_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

    def test_read_json_error_call_get_object(self):
        # create mock throw error when called function get_object
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        with patch.object(client_s3, 'get_object') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with self.assertRaises(PmError) as exception:
                # call function test
                FileUtils.read_json(trace_id, 'S3_CHECK_BUCKET', s3_file_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

    def test_read_json_error_call_json_loads(self):
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        with patch.object(client_s3, 'get_object') as mock_method:
            mock_method.side_effect = None
            # create mock throw error when called function json loads
            with patch.object(json, 'loads') as mock_method_json_loads:
                mock_method_json_loads.side_effect = ClientError(
                    error_response=expected_error_response,
                    operation_name=expected_operation_name)
                with self.assertRaises(PmError) as exception:
                    # call function test
                    FileUtils.read_json(trace_id, 'S3_CHECK_BUCKET',
                                        s3_file_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)
