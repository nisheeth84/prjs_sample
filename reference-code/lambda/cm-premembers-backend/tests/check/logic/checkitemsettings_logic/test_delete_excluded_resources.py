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

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
coop_id = copy.deepcopy(DataCommon.COOP_ID.format(str(3)))
check_item_code = copy.deepcopy(DataCommon.CHECK_ITEM_CODE_TEST)
region_name = data_pm_exclusion_resources['RegionName']
resource_name = data_pm_exclusion_resources['ResourceName']
resource_type = data_pm_exclusion_resources['ResourceType']


@mock_dynamodb2
class TestDeleteExcludedResources(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_delete_excluded_resources_case_error_validate_not_param_query_string_region_name(self):
        region_name = None

        # mock function error_validate
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        # call Function test
        actual_response = checkitemsettings_logic.delete_excluded_resources(
            trace_id, organization_id, project_id, check_item_code, coop_id,
            region_name, resource_type, resource_name)

        # assert output function
        # check call function common write log error
        mock_error_validate.assert_called_once()

        # check response
        actual_actual_response_body = json.loads(actual_response["body"])
        message_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(message_201["code"],
                         actual_actual_response_body["code"])
        self.assertEqual(message_201["message"],
                         actual_actual_response_body["message"])
        self.assertEqual(HTTPStatus.UNPROCESSABLE_ENTITY.value,
                         actual_response["statusCode"])

        actual_response_error = actual_actual_response_body["errors"]
        err_val_101 = MsgConst.ERR_VAL_101
        self.assertEqual(err_val_101["code"], actual_response_error[0]["code"])
        self.assertEqual("region_name", actual_response_error[0]["field"])
        self.assertEqual(None, actual_response_error[0]["value"])
        self.assertEqual(err_val_101["message"],
                         actual_response_error[0]["message"])

    def test_delete_excluded_resources_case_error_validate_not_param_query_string_resource_type(self):
        resource_type = None

        # mock function error_validate
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        # call Function test
        actual_response = checkitemsettings_logic.delete_excluded_resources(
            trace_id, organization_id, project_id, check_item_code, coop_id,
            region_name, resource_type, resource_name)

        # assert output function
        # check call function common write log error
        mock_error_validate.assert_called_once()

        # check response
        actual_actual_response_body = json.loads(actual_response["body"])
        message_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(message_201["code"],
                         actual_actual_response_body["code"])
        self.assertEqual(message_201["message"],
                         actual_actual_response_body["message"])
        self.assertEqual(HTTPStatus.UNPROCESSABLE_ENTITY.value,
                         actual_response["statusCode"])

        actual_response_error = actual_actual_response_body["errors"]
        err_val_101 = MsgConst.ERR_VAL_101
        self.assertEqual(err_val_101["code"], actual_response_error[0]["code"])
        self.assertEqual("resource_type", actual_response_error[0]["field"])
        self.assertEqual(None, actual_response_error[0]["value"])
        self.assertEqual(err_val_101["message"],
                         actual_response_error[0]["message"])

    def test_delete_excluded_resources_case_error_validate_not_param_query_string_resource_name(self):
        resource_name = None

        # mock function error_validate
        mock_error_validate = mock_common_utils.mock_error_validate(self)

        # call Function test
        actual_response = checkitemsettings_logic.delete_excluded_resources(
            trace_id, organization_id, project_id, check_item_code, coop_id,
            region_name, resource_type, resource_name)

        # assert output function
        # check call function common write log error
        mock_error_validate.assert_called_once()

        # check response
        actual_actual_response_body = json.loads(actual_response["body"])
        message_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(message_201["code"],
                         actual_actual_response_body["code"])
        self.assertEqual(message_201["message"],
                         actual_actual_response_body["message"])
        self.assertEqual(HTTPStatus.UNPROCESSABLE_ENTITY.value,
                         actual_response["statusCode"])

        actual_response_error = actual_actual_response_body["errors"]
        err_val_101 = MsgConst.ERR_VAL_101
        self.assertEqual(err_val_101["code"], actual_response_error[0]["code"])
        self.assertEqual("resource_name", actual_response_error[0]["field"])
        self.assertEqual(None, actual_response_error[0]["value"])
        self.assertEqual(err_val_101["message"],
                         actual_response_error[0]["message"])

    def test_delete_excluded_resources_case_error_get_record_pm_aws_account_coops(self):
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
        actual_response = checkitemsettings_logic.delete_excluded_resources(
            trace_id, organization_id, project_id, check_item_code, coop_id,
            region_name, resource_type, resource_name)

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

    def test_delete_excluded_resources_case_get_record_pm_aws_account_coops_is_zero(self):
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

        # call Function test
        actual_response = checkitemsettings_logic.delete_excluded_resources(
            trace_id, organization_id, project_id, check_item_code, coop_id,
            region_name, resource_type, resource_name)

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

    def test_delete_excluded_resources_case_error_get_record_pm_exclusion_resources(self):
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

        # call Function test
        actual_response = checkitemsettings_logic.delete_excluded_resources(
            trace_id, organization_id, project_id, check_item_code, coop_id,
            region_name, resource_type, resource_name)

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

    def test_delete_excluded_resources_case_get_record_pm_exclusion_resources_is_zero(self):
        # mock object
        patch_query_awscoop_coop_key = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_query_check_item_refine_code = patch("premembers.repository.pm_exclusionResources.query_check_item_refine_code")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_check_item_refine_code = patch_query_check_item_refine_code.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_check_item_refine_code.return_value = {}

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_query_check_item_refine_code.stop)

        # call Function test
        actual_response = checkitemsettings_logic.delete_excluded_resources(
            trace_id, organization_id, project_id, check_item_code, coop_id,
            region_name, resource_type, resource_name)

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_301 = MsgConst.ERR_301
        self.assertEqual(err_301["code"], actual_response_body["code"])
        self.assertEqual(err_301["message"], actual_response_body["message"])
        self.assertEqual(err_301["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.NOT_FOUND.value,
                         actual_response["statusCode"])

    def test_delete_excluded_resources_case_record_matching_resource_type_and_not_matching_region_name_and_not_matching_resource_name(self):
        # mock object
        patch_query_awscoop_coop_key = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_query_check_item_refine_code = patch("premembers.repository.pm_exclusionResources.query_check_item_refine_code")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_check_item_refine_code = patch_query_check_item_refine_code.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_check_item_refine_code.return_value = [data_pm_exclusion_resources]

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_query_check_item_refine_code.stop)

        region_name = "region_name_not_matching"
        resource_name = "resource_name_not_matching"

        # call Function test
        actual_response = checkitemsettings_logic.delete_excluded_resources(
            trace_id, organization_id, project_id, check_item_code, coop_id,
            region_name, resource_type, resource_name)

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_301 = MsgConst.ERR_301
        self.assertEqual(err_301["code"], actual_response_body["code"])
        self.assertEqual(err_301["message"], actual_response_body["message"])
        self.assertEqual(err_301["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.NOT_FOUND.value,
                         actual_response["statusCode"])

    def test_delete_excluded_resources_case_record_matching_region_name_and_not_matching_resource_name_and_not_matching_resource_type(self):
        # mock object
        patch_query_awscoop_coop_key = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_query_check_item_refine_code = patch("premembers.repository.pm_exclusionResources.query_check_item_refine_code")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_check_item_refine_code = patch_query_check_item_refine_code.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_check_item_refine_code.return_value = [data_pm_exclusion_resources]

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_query_check_item_refine_code.stop)

        resource_name = "resource_name_not_matching"
        resource_type = "resource_type_not_matching"

        # call Function test
        actual_response = checkitemsettings_logic.delete_excluded_resources(
            trace_id, organization_id, project_id, check_item_code, coop_id,
            region_name, resource_type, resource_name)

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_301 = MsgConst.ERR_301
        self.assertEqual(err_301["code"], actual_response_body["code"])
        self.assertEqual(err_301["message"], actual_response_body["message"])
        self.assertEqual(err_301["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.NOT_FOUND.value,
                         actual_response["statusCode"])

    def test_delete_excluded_resources_case_record_matching_resource_name_and_not_matching_region_name_and_not_matching_resource_type(self):
        # mock object
        patch_query_awscoop_coop_key = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_query_check_item_refine_code = patch("premembers.repository.pm_exclusionResources.query_check_item_refine_code")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_check_item_refine_code = patch_query_check_item_refine_code.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_check_item_refine_code.return_value = [data_pm_exclusion_resources]

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_query_check_item_refine_code.stop)

        region_name = "region_name_not_matching"
        resource_type = "resource_type_not_matching"

        # call Function test
        actual_response = checkitemsettings_logic.delete_excluded_resources(
            trace_id, organization_id, project_id, check_item_code, coop_id,
            region_name, resource_type, resource_name)

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_301 = MsgConst.ERR_301
        self.assertEqual(err_301["code"], actual_response_body["code"])
        self.assertEqual(err_301["message"], actual_response_body["message"])
        self.assertEqual(err_301["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.NOT_FOUND.value,
                         actual_response["statusCode"])

    def test_delete_excluded_resources_case_record_not_matching_region_name_and_not_matching_resource_name_and_not_matching_resource_type(self):
        # mock object
        patch_query_awscoop_coop_key = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_query_check_item_refine_code = patch("premembers.repository.pm_exclusionResources.query_check_item_refine_code")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_check_item_refine_code = patch_query_check_item_refine_code.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_check_item_refine_code.return_value = [data_pm_exclusion_resources]

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_query_check_item_refine_code.stop)

        region_name = "region_name_not_matching"
        resource_name = "resource_name_not_matching"
        resource_type = "resource_type_not_matching"

        # call Function test
        actual_response = checkitemsettings_logic.delete_excluded_resources(
            trace_id, organization_id, project_id, check_item_code, coop_id,
            region_name, resource_type, resource_name)

        # assert output function
        # check call function common write log error
        mock_error_common.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_301 = MsgConst.ERR_301
        self.assertEqual(err_301["code"], actual_response_body["code"])
        self.assertEqual(err_301["message"], actual_response_body["message"])
        self.assertEqual(err_301["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.NOT_FOUND.value,
                         actual_response["statusCode"])

    def test_delete_excluded_resources_case_error_delete_record_pm_exclusion_resources(self):
        # mock object
        patch_query_awscoop_coop_key = patch("premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_query_check_item_refine_code = patch("premembers.repository.pm_exclusionResources.query_check_item_refine_code")
        patch_delete_excluded_resourcess = patch("premembers.repository.pm_exclusionResources.delete")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_check_item_refine_code = patch_query_check_item_refine_code.start()
        mock_delete_excluded_resourcess = patch_delete_excluded_resourcess.start()
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_check_item_refine_code.return_value = [data_pm_exclusion_resources]
        mock_delete_excluded_resourcess.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_query_check_item_refine_code.stop)
        self.addCleanup(patch_delete_excluded_resourcess.stop)

        # call Function test
        actual_response = checkitemsettings_logic.delete_excluded_resources(
            trace_id, organization_id, project_id, check_item_code, coop_id,
            region_name, resource_type, resource_name)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_405 = MsgConst.ERR_DB_405
        self.assertEqual(err_405["code"], actual_response_body["code"])
        self.assertEqual(err_405["message"], actual_response_body["message"])
        self.assertEqual(err_405["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.INTERNAL_SERVER_ERROR.value,
                         actual_response["statusCode"])
