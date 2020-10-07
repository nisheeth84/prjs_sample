import copy

from tests.testcasebase import TestCaseBase
from unittest.mock import patch
from tests.mock.data.file_utils.data_yaml import DataYaml
from tests.mock.data.file_utils.data_json import DataJson
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from premembers.common import FileUtils
from premembers.const.const import CommonConst


class TestReadYaml(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_read_yaml_success(self):
        trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
        with patch(
                'premembers.common.FileUtils.read_object',
                return_value=DataYaml.DATA_FILE_YAML):
            response = FileUtils.read_yaml(
                trace_id, CommonConst.S3_SETTING_BUCKET,
                CommonConst.NOTIFY_CONFIG_CIS_RESULT_MAIL)
        self.assertEqual(DataJson.DATA_AFTER_YAML_LOAD, response)
