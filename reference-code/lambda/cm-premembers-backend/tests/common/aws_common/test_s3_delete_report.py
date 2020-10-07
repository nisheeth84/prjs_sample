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
from premembers.common.pm_log_adapter import PmLogAdapter
from premembers.common import common_utils

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(3))
report_id = "report_id"
prefix = report_id + "/report"


@mock_s3
class TestS3DeleteReport(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_s3_delete_report_success(self):
        # connect s3
        resource_s3 = s3_utils.resource_connect()
        client_s3 = s3_utils.client_connect()

        report_bucket = common_utils.get_environ("S3_REPORT_BUCKET")

        # prepare data
        resource_s3.create_bucket(Bucket=report_bucket)
        client_s3.put_object(Body=json.dumps(
            copy.deepcopy(DataTestS3.INFO_BUCKET)),
                             Bucket=report_bucket,
                             Key=prefix)
        mybucket = resource_s3.Bucket(name=report_bucket)

        with patch.object(boto3, 'resource') as mock_method_resource:
            mock_method_resource.return_value = resource_s3
            with patch.object(resource_s3, 'Bucket') as mock_method_bucket:
                mock_method_bucket.return_value = mybucket

            # call function test
            aws_common.s3_delete_report(trace_id, report_id)

        report_delete = True

        # check report delete
        for obj in mybucket.objects.filter(Prefix=prefix):
            report_delete = False

        # check result
        self.assertTrue(report_delete)

        # check connect resource
        mock_method_resource.assert_called_with('s3')

    def test_s3_delete_report_error_client(self):
        # create mock error resource s3
        self.create_mock_boto3_resource_error()

        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            # call function test
            aws_common.s3_delete_report(trace_id, report_id)

        # check write log error
        mock_method_error.assert_any_call("S3のファイル削除に失敗しました。: path=: %s",
                                          prefix)

    def test_s3_delete_report_error_call_s3_bucket(self):
        # connect s3
        resource_s3 = s3_utils.resource_connect()

        # create mock throw error when called function Bucket
        with patch.object(resource_s3, 'Bucket') as mock_method_bucket:
            mock_method_bucket.side_effect = ClientError(
                error_response=copy.deepcopy(DataCommon.ERROR_RESPONSE),
                operation_name=copy.deepcopy(DataCommon.OPERATION_NAME))
            with patch.object(PmLogAdapter, 'error',
                              return_value=None) as mock_method_error:
                # call function test
                aws_common.s3_delete_report(trace_id, report_id)

        # check write log error
        mock_method_error.assert_any_call("S3のファイル削除に失敗しました。: path=: %s",
                                          prefix)

    def test_s3_delete_report_error_call_obj_delete(self):
        # connect s3
        resource_s3 = s3_utils.resource_connect()
        client_s3 = s3_utils.client_connect()

        report_bucket = common_utils.get_environ("S3_REPORT_BUCKET")

        # prepare data
        resource_s3.create_bucket(Bucket=report_bucket)
        client_s3.put_object(Body=json.dumps(
            copy.deepcopy(DataTestS3.INFO_BUCKET)),
            Bucket=report_bucket,
            Key=prefix)
        my_bucket = resource_s3.Bucket(name=report_bucket)

        data_bucket_filter = []
        for obj in my_bucket.objects.filter(Prefix=prefix):
            patch_delete = patch.object(obj, "delete")

            # start mock object
            mock_delete = patch_delete.start()

            # mock data
            mock_delete.side_effect = ClientError(
                error_response=copy.deepcopy(DataCommon.ERROR_RESPONSE),
                operation_name=copy.deepcopy(DataCommon.OPERATION_NAME))

            # addClean mock
            self.addCleanup(patch_delete.stop)

            data_bucket_filter.append(obj)

        objects = my_bucket.objects
        type(my_bucket).objects = objects

        # mock patch object
        patch_boto3_resource_s3 = patch.object(boto3, "resource")
        patch_boto3_bucket_s3 = patch.object(resource_s3, "Bucket")
        patch_boto3_bucket_filter_s3 = patch.object(objects, "filter")

        # start mock object
        mock_boto3_resource_s3 = patch_boto3_resource_s3.start()
        mock_boto3_bucket_s3 = patch_boto3_bucket_s3.start()
        mock_boto3_bucket_filter_s3 = patch_boto3_bucket_filter_s3.start()

        # mock data
        mock_boto3_resource_s3.return_value = resource_s3
        mock_boto3_bucket_s3.return_value = my_bucket
        mock_boto3_bucket_filter_s3.return_value = data_bucket_filter

        # addClean mock
        self.addCleanup(patch_boto3_resource_s3.stop)
        self.addCleanup(patch_boto3_bucket_s3.stop)
        self.addCleanup(patch_boto3_bucket_filter_s3.stop)

        # call function test
        with patch.object(PmLogAdapter, 'error',
                          return_value=None) as mock_method_error:
            aws_common.s3_delete_report(trace_id, report_id)

        # check write log error
        mock_method_error.assert_any_call("S3のファイル削除に失敗しました。: path=: %s",
                                          prefix)
