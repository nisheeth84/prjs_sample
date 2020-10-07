import json
import copy

from http import HTTPStatus
from unittest.mock import patch
from moto import mock_dynamodb2, mock_s3
from tests.testcasebase import TestCaseBase
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_aws_account_coops import DataPmAwsAccountCoops
from tests.mock.data.aws.dynamodb.data_pm_latest_check_result import DataPmLatestCheckResult
from tests.mock.data.aws.dynamodb.data_pm_check_result_items import DataPmCheckResultItems
from tests.mock import mock_common_utils
from tests.mock.aws.s3 import s3_utils
from premembers.check.logic import awschecks_logic

data_pm_aws_account_coops = copy.deepcopy(DataPmAwsAccountCoops.DATA_SIMPLE)
data_pm_latest_check_result = copy.deepcopy(DataPmLatestCheckResult.DATA_SIMPLE)
data_pm_check_result_items = copy.deepcopy(DataPmCheckResultItems.DATA_SIMPLE)

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
coop_id = copy.deepcopy(DataCommon.COOP_ID.format(str(3)))
check_item_code = copy.deepcopy(DataCommon.CHECK_ITEM_CODE_TEST)


@mock_dynamodb2
@mock_s3
class TestGetSecurityCheckResources(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_get_security_check_resources_error_get_record_pm_aws_account_coops(self):
        # mock object
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_query_awscoop_coop_key.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)

        # call Function test
        actual_response = awschecks_logic.get_security_check_resource(
            trace_id, coop_id, project_id, organization_id, check_item_code)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_402 = MsgConst.ERR_402
        self.assertEqual(err_402["code"], actual_response_body["code"])
        self.assertEqual(err_402["message"], actual_response_body["message"])
        self.assertEqual(err_402["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.INTERNAL_SERVER_ERROR.value,
                         actual_response["statusCode"])

    def test_get_security_check_resources_get_record_pm_aws_account_coops_is_zero(self):
        # mock object
        patch_query_awscoop_coop_key = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = []

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)

        # call Function test
        actual_response = awschecks_logic.get_security_check_resource(
            trace_id, coop_id, project_id, organization_id, check_item_code)

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_aws_401 = MsgConst.ERR_AWS_401
        self.assertEqual(err_aws_401["code"], actual_response_body["code"])
        self.assertEqual(err_aws_401["message"],
                         actual_response_body["message"])
        self.assertEqual(err_aws_401["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.UNPROCESSABLE_ENTITY.value,
                         actual_response["statusCode"])

    def test_get_security_check_resources_error_get_record_pm_latest_check_result(self):
        # mock object
        patch_query_awscoop_coop_key = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_query_key = patch("premembers.repository.pm_latestCheckResult.query_key")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_key = patch_query_key.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_key.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_query_key.stop)
        self.addCleanup(patch_query_awscoop_coop_key.stop)

        # call Function test
        actual_response = awschecks_logic.get_security_check_resource(
            trace_id, coop_id, project_id, organization_id, check_item_code)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_402 = MsgConst.ERR_402
        self.assertEqual(err_402["code"], actual_response_body["code"])
        self.assertEqual(err_402["message"], actual_response_body["message"])
        self.assertEqual(err_402["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.INTERNAL_SERVER_ERROR.value,
                         actual_response["statusCode"])

    def test_get_security_check_resources_error_get_record_pm_check_result_items(self):
        # mock object
        patch_query_awscoop_coop_key = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_query_key = patch("premembers.repository.pm_latestCheckResult.query_key")
        patch_get_security_check_detail_by_check_result_and_check_item_code = patch("premembers.repository.pm_checkResultItems.get_security_check_detail_by_check_result_and_check_item_code")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_key = patch_query_key.start()
        mock_get_security_check_detail_by_check_result_and_check_item_code = patch_get_security_check_detail_by_check_result_and_check_item_code.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_key.return_value = data_pm_latest_check_result
        mock_get_security_check_detail_by_check_result_and_check_item_code.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_query_key.stop)
        self.addCleanup(patch_get_security_check_detail_by_check_result_and_check_item_code.stop)

        # call Function test
        actual_response = awschecks_logic.get_security_check_resource(
            trace_id, coop_id, project_id, organization_id, check_item_code)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_402 = MsgConst.ERR_402
        self.assertEqual(err_402["code"], actual_response_body["code"])
        self.assertEqual(err_402["message"], actual_response_body["message"])
        self.assertEqual(err_402["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.INTERNAL_SERVER_ERROR.value,
                         actual_response["statusCode"])

    def test_get_security_check_resources_call_read_json_error_no_such_key(self):
        # mock object
        patch_query_awscoop_coop_key = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_get_security_check_detail_by_check_result_and_check_item_code = patch("premembers.repository.pm_checkResultItems.get_security_check_detail_by_check_result_and_check_item_code")
        patch_query_key = patch("premembers.repository.pm_latestCheckResult.query_key")

        # start mock object
        mock_get_security_check_detail_by_check_result_and_check_item_code = patch_get_security_check_detail_by_check_result_and_check_item_code.start()
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_key = patch_query_key.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_get_security_check_detail_by_check_result_and_check_item_code.return_value = [data_pm_check_result_items]
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_key.return_value = data_pm_latest_check_result

        # create a bucket
        s3_utils.create_bucket('premembers-dev-check-bucket')

        # addCleanup stop mock object
        self.addCleanup(patch_get_security_check_detail_by_check_result_and_check_item_code.stop)
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_query_key.stop)

        # call Function test
        actual_response = awschecks_logic.get_security_check_resource(
            trace_id, coop_id, project_id, organization_id, check_item_code)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_s3_702 = MsgConst.ERR_S3_702
        self.assertEqual(err_s3_702["code"], actual_response_body["code"])
        self.assertEqual(err_s3_702["message"], actual_response_body["message"])
        self.assertEqual(err_s3_702["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.INTERNAL_SERVER_ERROR.value,
                         actual_response["statusCode"])

    def test_get_security_check_resources_call_read_json_error_other_no_such_key(self):
        # mock object
        patch_query_awscoop_coop_key = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_get_security_check_detail_by_check_result_and_check_item_code = patch("premembers.repository.pm_checkResultItems.get_security_check_detail_by_check_result_and_check_item_code")
        patch_query_key = patch("premembers.repository.pm_latestCheckResult.query_key")

        # start mock object
        mock_get_security_check_detail_by_check_result_and_check_item_code = patch_get_security_check_detail_by_check_result_and_check_item_code.start()
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_key = patch_query_key.start()

        # mock data
        mock_get_security_check_detail_by_check_result_and_check_item_code.return_value = [data_pm_check_result_items]
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_key.return_value = data_pm_latest_check_result

        # addCleanup stop mock object
        self.addCleanup(patch_get_security_check_detail_by_check_result_and_check_item_code.stop)
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_query_key.stop)
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # call Function test
        actual_response = awschecks_logic.get_security_check_resource(
            trace_id, coop_id, project_id, organization_id, check_item_code)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_s3_709 = MsgConst.ERR_S3_709
        self.assertEqual(err_s3_709["code"], actual_response_body["code"])
        self.assertEqual(err_s3_709["message"],
                         actual_response_body["message"])
        self.assertEqual(err_s3_709["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.INTERNAL_SERVER_ERROR.value,
                         actual_response["statusCode"])
