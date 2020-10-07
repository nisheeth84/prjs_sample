import json
import copy
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
from premembers.common.pm_log_adapter import PmLogAdapter
from premembers.common import common_utils

data_file = copy.deepcopy(DataTestS3.DATA_TEST_UPLOAD_JSON)
s3_file_name = copy.deepcopy(DataTestS3.S3_FILE_NAME_JSON)
trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(3))

client_s3 = None


@mock_s3
class TestUploadJson(TestCaseBase):
    def setUp(self):
        super().setUp()

        # connect s3
        global client_s3
        if not client_s3:
            client_s3 = s3_utils.client_connect()

    def test_upload_json_success(self):
        # connect s3
        resource_s3 = s3_utils.resource_connect()

        check_bucket = common_utils.get_environ("S3_CHECK_BUCKET")

        # prepare data
        resource_s3.create_bucket(Bucket=check_bucket)
        more_binary_data = json.dumps(data_file,
                                      indent=4,
                                      default=FileUtils.convert_handler,
                                      ensure_ascii=False)
        with patch.object(PmLogAdapter, 'info',
                          return_value=None) as mock_method_info:
            with patch.object(boto3, 'client') as mock_method_client:
                mock_method_client.return_value = client_s3
                with patch.object(client_s3, 'put_object') as mock_method:
                    # call function test
                    FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET",
                                          data_file, s3_file_name)

        # check write log info
        mock_method_info.assert_any_call(
            "Upload file json [%s] success on bucket [%s]", s3_file_name,
            check_bucket)

        # check connect client
        mock_method_client.assert_called_with('s3')

        # check param call function put_object
        mock_method.assert_any_call(Body=more_binary_data,
                                    Bucket=check_bucket,
                                    Key=s3_file_name)

    def test_upload_json_error_client(self):
        # create mock error client s3
        self.create_mock_boto3_client_error()

        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        FileUtils.global_s3_client = None
        with self.assertRaises(PmError) as exception:
            # call function test
            FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", data_file,
                                  s3_file_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

    def test_upload_json_error_call_json_dumps(self):
        # create mock throw error when called function json_dumps
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        with patch.object(json, 'dumps') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with self.assertRaises(PmError) as exception:
                # call function test
                FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", data_file,
                                      s3_file_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

    def test_upload_json_error_call_put_object(self):
        # create mock throw error when called function put_object
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        with patch.object(client_s3, 'put_object') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with self.assertRaises(PmError) as exception:
                # call function test
                FileUtils.upload_json(trace_id, "S3_CHECK_BUCKET", data_file,
                                      s3_file_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)
