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
trace_id = user_id_authority_owner
user_id = trace_id
organization_id = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
project_id = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
coop_id = copy.deepcopy(DataCommon.COOP_ID.format(str(3)))
check_item_code = copy.deepcopy(DataCommon.CHECK_ITEM_CODE_TEST)
check_item_code_not_object_resource = copy.deepcopy(
    DataPmExclusionResources.CHECK_ITEM_CODE_NOT_OBJECT_RESOURCE)
mail_address = data_pm_exclusion_resources['MailAddress']
region_name = data_pm_exclusion_resources['RegionName']
resource_type = data_pm_exclusion_resources['ResourceType']
resource_name = data_pm_exclusion_resources['ResourceName']
exclusion_comment = data_pm_exclusion_resources['ExclusionComment']

param_body = {
    "regionName": region_name,
    "resourceType": resource_type,
    "resourceName": resource_name
}


@mock_dynamodb2
class TestCreateExclusionResource(TestCaseBase):
    def setUp(self):
        super().setUp

    def test_create_excluded_resources_case_error_get_record_aws_account_coops(self):
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

        body_object = json.dumps(param_body)

        # call Function test
        actual_response = checkitemsettings_logic.create_excluded_resources(
            trace_id, user_id, organization_id, project_id, coop_id,
            check_item_code, mail_address, body_object)

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

    def test_create_excluded_resources_case_get_record_aws_account_coops_is_zero(self):
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

        body_object = json.dumps(param_body)

        # call Function test
        actual_response = checkitemsettings_logic.create_excluded_resources(
            trace_id, user_id, organization_id, project_id, coop_id,
            check_item_code, mail_address, body_object)

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

    def test_create_excluded_resources_case_check_item_code_not_object_resource(self):
        # mock object
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_error_common = mock_common_utils.mock_error_common(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)

        body_object = json.dumps(param_body)

        # call Function test
        actual_response = checkitemsettings_logic.create_excluded_resources(
            trace_id, user_id, organization_id, project_id, coop_id,
            check_item_code_not_object_resource, mail_address, body_object)

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

    def test_create_excluded_resources_case_parse_json_error(self):
        body_object = '{"json_invalid"}'
        # mock object
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")

        # start mock object
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        # mock function error_exception
        mock_error_exception = mock_common_utils.mock_error_exception(self)

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)

        # call Function test
        response = checkitemsettings_logic.create_excluded_resources(
            trace_id, user_id, organization_id, project_id, coop_id,
            check_item_code, mail_address, body_object)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # check response
        message_202 = MsgConst.ERR_REQUEST_202
        actual_response_body = json.loads(response["body"])
        self.assertEqual(actual_response_body["code"], message_202["code"])
        self.assertEqual(actual_response_body["message"],
                         message_202["message"])
        self.assertEqual(actual_response_body["description"],
                         message_202["description"])
        self.assertEqual(response["statusCode"], HTTPStatus.BAD_REQUEST.value)

    def test_create_excluded_resources_case_error_validate_param_region_name_is_empty(self):
        trace_id = user_id_authority_owner
        param_body = {
            "regionName": "",
            "resourceName": resource_name,
            "exclusionComment": exclusion_comment
        }
        body_object = json.dumps(param_body)

        # mock object
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")

        # mock function error_exception
        mock_error_validate = mock_common_utils.mock_error_validate(self)
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)

        # call Function test
        actual_response = checkitemsettings_logic.create_excluded_resources(
            trace_id, user_id_authority_owner, organization_id, project_id,
            coop_id, check_item_code, mail_address, body_object)

        # assert output function
        # check call function common write log error
        mock_error_validate.assert_called_once()

        # check response
        response_body = json.loads(actual_response["body"])
        message_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(response_body["code"], message_201["code"])
        self.assertEqual(response_body["message"], message_201["message"])
        self.assertEqual(actual_response["statusCode"],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        actual_response_error = response_body["errors"]
        err_val_101 = MsgConst.ERR_VAL_101
        self.assertEqual(err_val_101["code"], actual_response_error[0]["code"])
        self.assertEqual("regionName", actual_response_error[0]["field"])
        self.assertEqual(param_body["regionName"],
                         actual_response_error[0]["value"])
        self.assertEqual(err_val_101["message"],
                         actual_response_error[0]["message"])

    def test_create_excluded_resources_case_error_validate_param_resource_name_is_empty(self):
        trace_id = user_id_authority_owner
        param_body = {
            "regionName": region_name,
            "resourceType": resource_type,
            "resourceName": "",
            "exclusionComment": exclusion_comment
        }
        body_object = json.dumps(param_body)

        # mock object
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")

        # mock function error_exception
        mock_error_validate = mock_common_utils.mock_error_validate(self)
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)

        # call Function test
        actual_response = checkitemsettings_logic.create_excluded_resources(
            trace_id, user_id_authority_owner, organization_id, project_id,
            coop_id, check_item_code, mail_address, body_object)

        # assert output function
        # check call function common write log error
        mock_error_validate.assert_called_once()

        # check response
        response_body = json.loads(actual_response["body"])
        message_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(response_body["code"], message_201["code"])
        self.assertEqual(response_body["message"], message_201["message"])
        self.assertEqual(actual_response["statusCode"],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        actual_response_error = response_body["errors"]
        err_val_101 = MsgConst.ERR_VAL_101
        self.assertEqual(err_val_101["code"], actual_response_error[0]["code"])
        self.assertEqual("resourceName", actual_response_error[0]["field"])
        self.assertEqual(param_body["resourceName"],
                         actual_response_error[0]["value"])
        self.assertEqual(err_val_101["message"],
                         actual_response_error[0]["message"])

    def test_create_excluded_resources_case_error_validate_param_resource_type_is_empty(self):
        trace_id = user_id_authority_owner
        param_body = {
            "regionName": region_name,
            "resourceType": "",
            "resourceName": resource_name,
            "exclusionComment": exclusion_comment
        }
        body_object = json.dumps(param_body)

        # mock object
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")

        # mock function error_exception
        mock_error_validate = mock_common_utils.mock_error_validate(self)
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)

        # call Function test
        actual_response = checkitemsettings_logic.create_excluded_resources(
            trace_id, user_id_authority_owner, organization_id, project_id,
            coop_id, check_item_code, mail_address, body_object)

        # assert output function
        # check call function common write log error
        mock_error_validate.assert_called_once()

        # check response
        response_body = json.loads(actual_response["body"])
        message_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(response_body["code"], message_201["code"])
        self.assertEqual(response_body["message"], message_201["message"])
        self.assertEqual(actual_response["statusCode"],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        actual_response_error = response_body["errors"]
        err_val_101 = MsgConst.ERR_VAL_101
        self.assertEqual(err_val_101["code"], actual_response_error[0]["code"])
        self.assertEqual("resourceType", actual_response_error[0]["field"])
        self.assertEqual(param_body["resourceType"],
                         actual_response_error[0]["value"])
        self.assertEqual(err_val_101["message"],
                         actual_response_error[0]["message"])

    def test_create_excluded_resources_case_error_validate_param_lenght_exclusion_comment_is_301(self):
        trace_id = user_id_authority_owner
        param_body = {
            "regionName": region_name,
            "resourceType": resource_type,
            "resourceName": resource_name,
            "exclusionComment": "チェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントメントトチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントメントトチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントチェック項目除外コメントメントトト"
        }
        body_object = json.dumps(param_body)

        # mock object
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")

        # mock function error_exception
        mock_error_validate = mock_common_utils.mock_error_validate(self)
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)

        # call Function test
        actual_response = checkitemsettings_logic.create_excluded_resources(
            trace_id, user_id_authority_owner, organization_id, project_id,
            coop_id, check_item_code, mail_address, body_object)

        # assert output function
        # check call function common write log error
        mock_error_validate.assert_called_once()

        # check response
        response_body = json.loads(actual_response["body"])
        message_201 = MsgConst.ERR_REQUEST_201
        self.assertEqual(response_body["code"], message_201["code"])
        self.assertEqual(response_body["message"], message_201["message"])
        self.assertEqual(actual_response["statusCode"],
                         HTTPStatus.UNPROCESSABLE_ENTITY.value)

        actual_response_error = response_body["errors"]
        err_val_303 = MsgConst.ERR_VAL_303
        self.assertEqual(err_val_303["code"], actual_response_error[0]["code"])
        self.assertEqual("exclusionComment", actual_response_error[0]["field"])
        self.assertEqual(param_body["exclusionComment"],
                         actual_response_error[0]["value"])
        self.assertEqual(err_val_303["message"].format(300),
                         actual_response_error[0]["message"])

    def test_create_excluded_resources_case_error_create_excluded_resourcess(self):
        trace_id = user_id_authority_owner
        param_body = {
            "regionName": region_name,
            "resourceName": resource_name,
            "resourceType": resource_type,
            "exclusionComment": exclusion_comment
        }
        body_object = json.dumps(param_body)

        # mock object
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_query_filter_region_name_and_resource_name = patch(
            "premembers.repository.pm_exclusionResources.query_filter_region_name_and_resource_name")
        patch_create_pm_exclusionResources = patch(
            "premembers.repository.pm_exclusionResources.create")

        # mock function error_exception
        mock_error_exception = mock_common_utils.mock_error_exception(self)
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_filter_region_name_and_resource_name = patch_query_filter_region_name_and_resource_name.start()
        mock_create_pm_exclusionResources = patch_create_pm_exclusionResources.start()

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_filter_region_name_and_resource_name.return_value = None
        mock_create_pm_exclusionResources.side_effect = Exception()

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_query_filter_region_name_and_resource_name.stop)
        self.addCleanup(patch_create_pm_exclusionResources.stop)

        # call Function test
        actual_response = checkitemsettings_logic.create_excluded_resources(
            trace_id, user_id_authority_owner, organization_id, project_id,
            coop_id, check_item_code, mail_address, body_object)

        # assert output function
        # check call function common write log error
        mock_error_exception.assert_called_once()

        # assert output function
        actual_response_body = json.loads(actual_response["body"])
        err_db_403 = MsgConst.ERR_DB_403
        self.assertEqual(err_db_403["code"], actual_response_body["code"])
        self.assertEqual(err_db_403["message"],
                         actual_response_body["message"])
        self.assertEqual(err_db_403["description"],
                         actual_response_body["description"])
        self.assertEqual(HTTPStatus.INTERNAL_SERVER_ERROR.value,
                         actual_response["statusCode"])

    def test_create_excluded_resources_case_error_get_exclusion_resources(self):
        trace_id = user_id_authority_owner
        param_body = {
            "regionName": region_name,
            "resourceType": resource_type,
            "resourceName": resource_name,
            "exclusionComment": exclusion_comment
        }
        body_object = json.dumps(param_body)

        # mock object
        patch_query_awscoop_coop_key = patch(
            "premembers.repository.pm_awsAccountCoops.query_awscoop_coop_key")
        patch_query_filter_region_name_and_resource_name = patch(
            "premembers.repository.pm_exclusionResources.query_filter_region_name_and_resource_name")

        # mock function error_exception
        mock_error_exception = mock_common_utils.mock_error_exception(self)
        mock_query_awscoop_coop_key = patch_query_awscoop_coop_key.start()
        mock_query_filter_region_name_and_resource_name = patch_query_filter_region_name_and_resource_name.start()

        # mock data
        mock_query_awscoop_coop_key.return_value = data_pm_aws_account_coops
        mock_query_filter_region_name_and_resource_name.side_effect = Exception()

        # addCleanup stop mock object
        self.addCleanup(patch_query_awscoop_coop_key.stop)
        self.addCleanup(patch_query_filter_region_name_and_resource_name.stop)

        # call Function test
        actual_response = checkitemsettings_logic.create_excluded_resources(
            trace_id, user_id_authority_owner, organization_id, project_id,
            coop_id, check_item_code, mail_address, body_object)

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
