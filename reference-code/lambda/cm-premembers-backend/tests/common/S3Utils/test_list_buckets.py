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

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(3))
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
region_name = copy.deepcopy(DataCommon.REGION_NAME)

client_s3 = None


@mock_s3
class TestListBuckets(TestCaseBase):
    def setUp(self):
        super().setUp()

        # connect s3
        global client_s3
        if not client_s3:
            client_s3 = s3_utils.client_connect()

    def test_list_buckets_success(self):
        expected_bucket_name = copy.deepcopy(DataTestS3.INFO_BUCKET['Bucket'])

        # check exist bucket
        list_buckets = client_s3.list_buckets()
        if len(list_buckets['Buckets']) > 0:
            for bucket in list_buckets['Buckets']:
                client_s3.delete_bucket(Bucket=bucket['Name'])

        # create s3 bucket
        s3_utils.create_bucket(expected_bucket_name)

        # call function test
        result_list_buckets = S3Utils.list_buckets(trace_id, client_s3,
                                                   aws_account)

        # check result
        actual_bucket_name = result_list_buckets['Buckets'][0]['Name']
        self.assertEqual(expected_bucket_name, actual_bucket_name)

    def test_list_buckets_case_error(self):
        # create mock throw error when called function list_buckets
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        expected_error_response['Error']['Code'] = 'AccessDenied'
        with patch.object(client_s3, 'list_buckets') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with patch.object(PmLogAdapter, 'error',
                              return_value=None) as mock_method_error:
                with self.assertRaises(PmError) as exception:
                    # call function test
                    S3Utils.list_buckets(trace_id, client_s3, aws_account)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check write log error
        mock_method_error.assert_any_call('[%s] S3バケット一覧情報の取得に失敗しました。',
                                          aws_account)
