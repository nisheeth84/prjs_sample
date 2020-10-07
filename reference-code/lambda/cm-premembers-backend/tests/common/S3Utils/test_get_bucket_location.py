import copy

from unittest.mock import patch
from tests.testcasebase import TestCaseBase
from tests.mock.aws.s3 import s3_utils
from moto import mock_s3
from premembers.common import S3Utils
from tests.mock.data.aws.s3.data_test_s3 import DataTestS3
from tests.mock.data.aws.data_common import DataCommon
from premembers.exception.pm_exceptions import PmError
from premembers.common.pm_log_adapter import PmLogAdapter
from botocore.exceptions import ClientError

bucket_name = copy.deepcopy(DataTestS3.INFO_BUCKET['Bucket'])
trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(3))
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
region_name = copy.deepcopy(DataCommon.REGION_NAME)

client_s3 = None


@mock_s3
class TestGetBucketLocation(TestCaseBase):
    def setUp(self):
        super().setUp()

        # connect s3
        global client_s3
        if not client_s3:
            client_s3 = s3_utils.client_connect()

    def test_get_bucket_location_success_response_exists_location_constraint(
            self):
        expected_location_bucket = copy.deepcopy(DataTestS3.LOCATION_BUCKET)

        # prepare data
        client_s3.create_bucket(Bucket=bucket_name,
                                CreateBucketConfiguration={
                                    'LocationConstraint':
                                    expected_location_bucket
                                })

        # call function test
        actual_bucket_location = S3Utils.get_bucket_location(
            trace_id, client_s3, bucket_name, aws_account)

        # check result
        self.assertEqual(expected_location_bucket, actual_bucket_location)

    def test_get_bucket_location_success_response_not_exists_location_constraint(self):
        expected_location_bucket = copy.deepcopy(DataTestS3.LOCATION_BUCKET)
        # check exist bucket
        list_buckets = client_s3.list_buckets()
        if len(list_buckets['Buckets']) > 0:
            for bucket in list_buckets['Buckets']:
                client_s3.delete_bucket(Bucket=bucket['Name'])

        # prepare data
        client_s3.create_bucket(Bucket=bucket_name,
                                CreateBucketConfiguration={
                                    'LocationConstraint':
                                    expected_location_bucket
                                })

        # call function test
        with patch.object(client_s3, 'get_bucket_location') as mock_method:
            mock_method.return_value = {}
            actual_bucket_location = S3Utils.get_bucket_location(
                trace_id, client_s3, bucket_name, aws_account)

        # check result
        expected_location_bucket = None
        self.assertEqual(expected_location_bucket, actual_bucket_location)

    def test_get_bucket_location_error_method_not_allowed(self):
        # create mock throw error when called function get_bucket_location
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        expected_error_response['Error']['Code'] = 'MethodNotAllowed'
        with patch.object(client_s3, 'get_bucket_location') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with patch.object(PmLogAdapter, 'warning',
                              return_value=None) as mock_method_warning:
                with self.assertRaises(PmError) as exception:
                    # call function test
                    S3Utils.get_bucket_location(trace_id, client_s3,
                                                bucket_name, aws_account)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check write log warning
        mock_method_warning.assert_any_call(
            '[%s] 権限エラーによりS3バケットリージョン情報の取得に失敗しました。（%s）', aws_account,
            bucket_name)

    def test_get_bucket_location_error_access_denied(self):
        # create mock throw error when called function get_bucket_location
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        expected_error_response['Error']['Code'] = 'AccessDenied'
        with patch.object(client_s3, 'get_bucket_location') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with patch.object(PmLogAdapter, 'warning',
                              return_value=None) as mock_method_warning:
                with self.assertRaises(PmError) as exception:
                    # call function test
                    S3Utils.get_bucket_location(trace_id, client_s3,
                                                bucket_name, aws_account)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check write log warning
        mock_method_warning.assert_any_call(
            '[%s] 権限エラーによりS3バケットリージョン情報の取得に失敗しました。（%s）', aws_account,
            bucket_name)

    def test_get_bucket_location_error_other(self):
        # create mock throw error when called function get_bucket_location
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        with patch.object(client_s3, 'get_bucket_location') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with patch.object(PmLogAdapter, 'error',
                              return_value=None) as mock_method_error:
                with self.assertRaises(PmError) as exception:
                    # call function test
                    S3Utils.get_bucket_location(trace_id, client_s3,
                                                bucket_name, aws_account)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check write log error
        mock_method_error.assert_any_call('[%s]S3バケットリージョン情報の取得に失敗しました。（%s）',
                                          aws_account, bucket_name)
