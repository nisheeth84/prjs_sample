import json
import copy

from http import HTTPStatus
from unittest.mock import patch
from moto import mock_dynamodb2
from tests.testcasebase import TestCaseBase
from premembers.const.msg_const import MsgConst
from premembers.exception.pm_exceptions import PmError
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_aws_account_coops import DataPmAwsAccountCoops
from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources
from tests.mock import mock_common_utils
from premembers.check.logic import checkitemsettings_logic

data_pm_aws_account_coops = copy.deepcopy(DataPmAwsAccountCoops.DATA_SIMPLE)
data_pm_exclusion_resources = copy.deepcopy(
    DataPmExclusionResources.DATA_SIMPLE)

user_id_authority_owner = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
coop_id = copy.deepcopy(DataCommon.COOP_ID.format(str(3)))
check_item_code = copy.deepcopy(DataCommon.CHECK_ITEM_CODE_TEST)


@mock_dynamodb2
class TestGetExcludedResources(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_get_excluded_resources_query_awscoop_error(self):
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

        trace_id = user_id_authority_owner

        # call Function test
        actual_response = checkitemsettings_logic.get_excluded_resources(
            trace_id, project_id, organization_id, coop_id, check_item_code)

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

    def test_get_excluded_resources_query_awscoop_is_zero(self):
        # mock object
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = []

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)

        trace_id = user_id_authority_owner

        # call Function test
        actual_response = checkitemsettings_logic.get_excluded_resources(
            trace_id, project_id, organization_id, coop_id, check_item_code)

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

    def test_get_excluded_resources_query_exclusion_resources_error(self):
        # mock object
        patch_query_awscoop_coop_key = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_query_check_item_refine_code = patch("premembers.repository.pm_exclusionResources.query_check_item_refine_code")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_check_item_refine_code = patch_query_check_item_refine_code.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_check_item_refine_code.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_query_check_item_refine_code.stop)

        trace_id = user_id_authority_owner

        # call Function test
        actual_response = checkitemsettings_logic.get_excluded_resources(
            trace_id, project_id, organization_id, coop_id, check_item_code)

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
