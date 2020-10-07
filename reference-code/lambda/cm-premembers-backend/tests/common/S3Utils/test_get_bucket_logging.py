import copy

from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from tests.mock.aws.s3 import s3_utils
from moto import mock_s3
from premembers.common import S3Utils
from tests.mock.data.aws.s3.data_test_s3 import DataTestS3
from tests.mock.data.aws.data_common import DataCommon
from botocore.exceptions import ClientError
from premembers.exception.pm_exceptions import PmError
from premembers.common.pm_log_adapter import PmLogAdapter

info_bucket = copy.deepcopy(DataTestS3.INFO_BUCKET)
bucket_name = info_bucket['Bucket']
trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(3))
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
region_name = copy.deepcopy(DataCommon.REGION_NAME)

client_s3 = None


@mock_s3
class TestGetBucketLogging(TestCaseBase):
    def setUp(self):
        super().setUp()

        # connect s3
        global client_s3
        if not client_s3:
            client_s3 = s3_utils.client_connect()

    def test_get_bucket_logging_success_response_exists_logging_enabled(self):
        expected_bucket_logging = copy.deepcopy(DataTestS3.BUCKET_LOGGING)

        # prepare data
        client_s3.create_bucket(**info_bucket)
        client_s3.put_bucket_logging(**expected_bucket_logging)

        # call function test
        actual_bucket_logging = S3Utils.get_bucket_logging(
            trace_id, aws_account, client_s3, bucket_name, region_name)

        # check result
        self.assertEqual(bucket_name, actual_bucket_logging['TargetBucket'])
        self.assertEqual(
            expected_bucket_logging['BucketLoggingStatus']['LoggingEnabled'],
            actual_bucket_logging)

    def test_get_bucket_logging_success_response_not_exists_logging_enabled(
            self):
        expected_bucket_logging = copy.deepcopy(DataTestS3.BUCKET_LOGGING)

        # prepare data
        client_s3.create_bucket(**info_bucket)
        client_s3.put_bucket_logging(**expected_bucket_logging)

        with patch.object(client_s3, 'get_bucket_logging') as mock_method:
            mock_method.return_value = {}
            # call function test
            actual_bucket_logging = S3Utils.get_bucket_logging(
                trace_id, aws_account, client_s3, bucket_name, region_name)

        # check result
        expected_bucket_logging = []
        self.assertEqual(expected_bucket_logging, actual_bucket_logging)

    def test_get_bucket_logging_error_access_denied(self):
        # create mock throw error when called function get_bucket_logging
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        expected_error_response['Error']['Code'] = 'AccessDenied'
        with patch.object(client_s3, 'get_bucket_logging') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with patch.object(PmLogAdapter, 'warning',
                              return_value=None) as mock_method_warning:
                with self.assertRaises(PmError) as exception:
                    # call function test
                    S3Utils.get_bucket_logging(trace_id, aws_account,
                                               client_s3, bucket_name,
                                               region_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check write log warning
        mock_method_warning.assert_any_call(
            '[%s/%s] 権限エラーによりS3バケットロギング情報の取得に失敗しました。（%s）', aws_account,
            region_name, bucket_name)

    def test_get_bucket_logging_error_method_not_allowed(self):
        # create mock throw error when called function get_bucket_logging
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        expected_error_response['Error']['Code'] = 'MethodNotAllowed'
        with patch.object(client_s3, 'get_bucket_logging') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with patch.object(PmLogAdapter, 'warning',
                              return_value=None) as mock_method_warning:
                with self.assertRaises(PmError) as exception:
                    # call function test
                    S3Utils.get_bucket_logging(trace_id, aws_account,
                                               client_s3, bucket_name,
                                               region_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check write log warning
        mock_method_warning.assert_any_call(
            '[%s/%s] 権限エラーによりS3バケットロギング情報の取得に失敗しました。（%s）', aws_account,
            region_name, bucket_name)

    def test_get_bucket_logging_error_other(self):
        # create mock throw error when called function get_bucket_logging
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        with patch.object(client_s3, 'get_bucket_logging') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with patch.object(PmLogAdapter, 'error',
                              return_value=None) as mock_method_error:
                with self.assertRaises(PmError) as exception:
                    # call function test
                    S3Utils.get_bucket_logging(trace_id, aws_account,
                                               client_s3, bucket_name,
                                               region_name)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check write log error
        mock_method_error.assert_any_call('[%s/%s] S3バケットロギング情報の取得に失敗しました。%s',
                                          aws_account, region_name,
                                          bucket_name)
