import copy

from tests.testcasebase import TestCaseBase
from unittest.mock import patch
from tests.mock.data.file_utils.data_text import DataText
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from premembers.common import FileUtils
from premembers.const.const import CommonConst


class TestReadDecode(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_read_decode_success(self):
        trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
        data_read_decode = copy.deepcopy(DataText.CHECK_RESULT_SLACK_TEMPLATE.encode('utf-8'))
        with patch(
                'premembers.common.FileUtils.read_object',
                return_value=data_read_decode):
            response = FileUtils.read_decode(
                trace_id, CommonConst.S3_SETTING_BUCKET,
                CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
        self.assertEqual(DataText.CHECK_RESULT_SLACK_TEMPLATE, response)
