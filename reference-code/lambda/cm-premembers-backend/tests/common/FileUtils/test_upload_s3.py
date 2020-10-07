import copy
import unittest

from unittest.mock import patch
from tests.mock.data.aws.s3.data_test_s3 import DataTestS3
from tests.mock.data.aws.data_common import DataCommon
from premembers.common import FileUtils

data_file = copy.deepcopy(DataTestS3.DATA_TEST_UPLOAD_S3)
s3_file_name = copy.deepcopy(DataTestS3.S3_FILE_NAME_JSON)
trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(3))


class TestUploadS3(unittest.TestCase):
    def test_upload_s3_case_param_format_json_is_false(self):
        # mock method upload_json
        with patch('premembers.common.FileUtils.upload_json'
                   ) as mock_method_upload_json:
            # mock method upload_csv
            with patch('premembers.common.FileUtils.upload_csv'
                       ) as mock_method_upload_csv:
                # call function test
                FileUtils.upload_s3(trace_id,
                                    data_file,
                                    s3_file_name,
                                    format_json=False)

        # check param call function upload_json
        mock_method_upload_json.assert_not_called()

        # check param call function upload_csv
        mock_method_upload_csv.assert_called_once_with(trace_id,
                                                       "S3_CHECK_BUCKET",
                                                       data_file, s3_file_name)

    def test_upload_s3_case_param_format_json_is_true(self):
        # mock method upload_json
        with patch('premembers.common.FileUtils.upload_json'
                   ) as mock_method_upload_json:
            # mock method upload_csv
            with patch('premembers.common.FileUtils.upload_csv'
                       ) as mock_method_upload_csv:
                # call function test
                FileUtils.upload_s3(trace_id,
                                    data_file,
                                    s3_file_name,
                                    format_json=True)

        # check param call function upload_json
        mock_method_upload_json.assert_called_once_with(
            trace_id, "S3_CHECK_BUCKET", data_file, s3_file_name)

        # check param call function upload_csv
        mock_method_upload_csv.assert_not_called()

    def test_upload_s3_case_not_has_param_format_json(self):
        # mock method upload_json
        with patch('premembers.common.FileUtils.upload_json'
                   ) as mock_method_upload_json:
            # mock method upload_csv
            with patch('premembers.common.FileUtils.upload_csv'
                       ) as mock_method_upload_csv:
                # call function test
                FileUtils.upload_s3(trace_id, data_file, s3_file_name)

        # check param call function upload_json
        mock_method_upload_json.assert_not_called()

        # check param call function upload_csv
        mock_method_upload_csv.assert_called_once_with(trace_id,
                                                       "S3_CHECK_BUCKET",
                                                       data_file, s3_file_name)
