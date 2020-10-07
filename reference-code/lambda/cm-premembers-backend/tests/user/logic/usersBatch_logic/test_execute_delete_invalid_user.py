import copy

from unittest.mock import patch
from moto import mock_cognitoidp
from tests.testcasebase import TestCaseBase
from premembers.exception.pm_exceptions import PmError
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.data_common import DataCommon
from premembers.user.logic import usersBatch_logic
from tests.mock.data.aws.cognito_idp.data_test_cognito_idp import DataTestCognitoIdp
from tests.mock.data.aws.dynamodb.data_pm_affiliation import DataPmAffiliation

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(3))
user_name_unconfirmed = copy.deepcopy(DataTestCognitoIdp.LIST_DATA_USER_UNCONFIRMED[0]['Username'])
user_name_force_change_password = copy.deepcopy(DataTestCognitoIdp.LIST_DATA_USER_FORCE_CHANGE_PASSWORD[0]['Username'])
list_data_user_unconfirmed = copy.deepcopy(DataTestCognitoIdp.LIST_DATA_USER_UNCONFIRMED)
list_data_user_force_change_password = copy.deepcopy(DataTestCognitoIdp.LIST_DATA_USER_FORCE_CHANGE_PASSWORD)


def mock_get_cognito_user_pools_user_when_filter_unconfirmed_error(
        trace_id, filter, attribute_filter):
    if filter == "UNCONFIRMED" and attribute_filter == "cognito:user_status":
        raise PmError()


def mock_get_cognito_user_pools_user_when_filter_force_change_password_error(
        trace_id, filter, attribute_filter):
    if filter == "FORCE_CHANGE_PASSWORD" and attribute_filter == "cognito:user_status":
        raise PmError()
    else:
        return []


def mock_delete_cognito_user_when_delete_user_unconfirmed_error(
        trace_id, user_name):
    if user_name == user_name_unconfirmed:
        raise PmError()
    else:
        return []


def mock_delete_cognito_user_when_delete_user_force_change_password_error(
        trace_id, user_name):
    if user_name == user_name_force_change_password:
        raise PmError()
    else:
        return []


def mock_get_cognito_user_pools_success(trace_id, filter, attribute_filter):
    if filter == "UNCONFIRMED" and attribute_filter == "cognito:user_status":
        return list_data_user_unconfirmed
    elif filter == "FORCE_CHANGE_PASSWORD" and attribute_filter == "cognito:user_status":
        return list_data_user_force_change_password


@mock_cognitoidp
class TestExecuteDeleteInvalidUser(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_execute_delete_invalid_user_success(self):
        # mock object
        patch_get_cognito_user_pools = patch('premembers.common.aws_common.get_cognito_user_pools')
        patch_method_delete_cognito_user_by_user_name = patch('premembers.common.aws_common.delete_cognito_user_by_user_name')
        patch_method_delete_affiliation = patch('premembers.repository.pm_affiliation.delete_affiliation')
        patch_method_query_userid_key = patch('premembers.repository.pm_affiliation.query_userid_key')

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_method_delete_cognito_user_by_user_name = patch_method_delete_cognito_user_by_user_name.start()
        mock_method_delete_affiliation = patch_method_delete_affiliation.start()
        mock_method_query_userid_key = patch_method_query_userid_key.start()

        expected_username_force_change_password = copy.deepcopy(DataTestCognitoIdp.LIST_DATA_USER_FORCE_CHANGE_PASSWORD[1]['Username'])
        expected_username_unconfirmed = copy.deepcopy(DataTestCognitoIdp.LIST_DATA_USER_UNCONFIRMED[1]['Username'])

        data_affiliation_user_force_change_password = copy.deepcopy(DataPmAffiliation.AFFILIATION_TEMPLATE)
        data_affiliation_user_force_change_password['UserID'] = expected_username_force_change_password
        data_query_userid_key = [data_affiliation_user_force_change_password]

        # mock data
        mock_get_cognito_user_pools.side_effect = mock_get_cognito_user_pools_success
        mock_method_query_userid_key.return_value = data_query_userid_key

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_method_delete_cognito_user_by_user_name.stop)
        self.addCleanup(patch_method_delete_affiliation.stop)
        self.addCleanup(patch_method_query_userid_key.stop)

        # call Function test
        usersBatch_logic.execute_delete_invalid_user(trace_id)

        # check logic call function delete_cognito_user_by_user_name
        mock_method_delete_cognito_user_by_user_name.assert_any_call(trace_id, expected_username_force_change_password)
        mock_method_delete_cognito_user_by_user_name.assert_any_call(trace_id, expected_username_unconfirmed)

        # check call_count function delete_cognito_user_by_user_name
        expected_call = 2
        actual_call = mock_method_delete_cognito_user_by_user_name.call_count
        self.assertEqual(expected_call, actual_call)

        # check logic call function delete_affiliation_by_user_id
        expected_organization_id = data_query_userid_key[0]['OrganizationID']
        mock_method_delete_affiliation.assert_called_once_with(expected_username_force_change_password, expected_organization_id)

    def test_execute_delete_invalid_user_unconfirmed_error_call_get_cognito_user_pools(self):
        # mock object
        patch_get_cognito_user_pools = patch('premembers.common.aws_common.get_cognito_user_pools')
        patch_method_error = patch.object(PmLogAdapter, "error")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_method_error = patch_method_error.start()

        # mock data
        mock_get_cognito_user_pools.side_effect = mock_get_cognito_user_pools_user_when_filter_unconfirmed_error

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_method_error.stop)

        # call Function test
        with self.assertRaises(PmError):
            usersBatch_logic.execute_delete_invalid_user(trace_id)

        # check logic write log error
        expected_account_status = "UNCONFIRMED"
        mock_method_error.assert_any_call("[%s]Cognitoユーザー一覧情報取得に失敗しました。",
                                          expected_account_status)

    def test_execute_delete_invalid_user_unconfirmed_error_call_delete_cognito_user_by_user_name(self):
        # mock object
        patch_get_cognito_user_pools = patch('premembers.common.aws_common.get_cognito_user_pools')
        patch_method_warning = patch.object(PmLogAdapter, "warning")
        patch_method_difference_days = patch('premembers.common.date_utils.difference_days')
        patch_method_delete_cognito_user_by_user_name = patch('premembers.common.aws_common.delete_cognito_user_by_user_name')

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_method_warning = patch_method_warning.start()
        mock_method_difference_days = patch_method_difference_days.start()
        mock_method_delete_cognito_user_by_user_name = patch_method_delete_cognito_user_by_user_name.start()

        # mock data
        mock_get_cognito_user_pools.return_value = copy.deepcopy(DataTestCognitoIdp.LIST_DATA_USER_UNCONFIRMED)
        mock_method_difference_days.return_value = 3
        mock_method_delete_cognito_user_by_user_name.side_effect = mock_delete_cognito_user_when_delete_user_unconfirmed_error

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_method_warning.stop)
        self.addCleanup(patch_method_difference_days.stop)
        self.addCleanup(patch_method_delete_cognito_user_by_user_name.stop)

        # call Function test
        with self.assertRaises(PmError):
            usersBatch_logic.execute_delete_invalid_user(trace_id)

        # check logic write log warning
        expected_user_name_unconfirmed = user_name_unconfirmed
        mock_method_warning.assert_any_call(
            "CognitoでUserName = %sのユーザー削除に失敗しました。", expected_user_name_unconfirmed)

    def test_execute_delete_invalid_user_force_change_password_error_call_get_cognito_user_pools(self):
        # mock object
        patch_get_cognito_user_pools = patch('premembers.common.aws_common.get_cognito_user_pools')
        patch_method_error = patch.object(PmLogAdapter, "error")

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_method_error = patch_method_error.start()

        # mock data
        mock_get_cognito_user_pools.side_effect = mock_get_cognito_user_pools_user_when_filter_force_change_password_error

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_method_error.stop)

        # call Function test
        with self.assertRaises(PmError):
            usersBatch_logic.execute_delete_invalid_user(trace_id)

        # check logic write log error
        expected_account_status = "FORCE_CHANGE_PASSWORD"
        mock_method_error.assert_any_call("[%s]Cognitoユーザー一覧情報取得に失敗しました。",
                                          expected_account_status)

    def test_execute_delete_invalid_user_force_change_password_error_call_delete_cognito_user_by_user_name(self):
        # mock object
        patch_get_cognito_user_pools = patch('premembers.common.aws_common.get_cognito_user_pools')
        patch_method_warning = patch.object(PmLogAdapter, "warning")
        patch_method_difference_days = patch('premembers.common.date_utils.difference_days')
        patch_method_delete_cognito_user_by_user_name = patch('premembers.common.aws_common.delete_cognito_user_by_user_name')

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_method_warning = patch_method_warning.start()
        mock_method_difference_days = patch_method_difference_days.start()
        mock_method_delete_cognito_user_by_user_name = patch_method_delete_cognito_user_by_user_name.start()

        # mock data
        mock_get_cognito_user_pools.return_value = copy.deepcopy(DataTestCognitoIdp.LIST_DATA_USER_FORCE_CHANGE_PASSWORD)
        mock_method_difference_days.return_value = 7
        mock_method_delete_cognito_user_by_user_name.side_effect = mock_delete_cognito_user_when_delete_user_force_change_password_error

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_method_warning.stop)
        self.addCleanup(patch_method_difference_days.stop)
        self.addCleanup(patch_method_delete_cognito_user_by_user_name.stop)

        # call Function test
        with self.assertRaises(PmError):
            usersBatch_logic.execute_delete_invalid_user(trace_id)

        # check logic write log warning
        expected_user_name_force_change_password = user_name_force_change_password
        mock_method_warning.assert_any_call(
            "CognitoでUserName = %sのユーザー削除に失敗しました。", expected_user_name_force_change_password)

    def test_execute_delete_invalid_user_error_call_query_userid_key(self):
        # mock object
        patch_get_cognito_user_pools = patch('premembers.common.aws_common.get_cognito_user_pools')
        patch_method_warning = patch.object(PmLogAdapter, "warning")
        patch_method_delete_cognito_user_by_user_name = patch('premembers.common.aws_common.delete_cognito_user_by_user_name')
        patch_method_query_userid_key = patch('premembers.repository.pm_affiliation.query_userid_key')

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_method_warning = patch_method_warning.start()
        mock_method_delete_cognito_user_by_user_name = patch_method_delete_cognito_user_by_user_name.start()
        mock_method_query_userid_key = patch_method_query_userid_key.start()

        # mock data
        mock_get_cognito_user_pools.side_effect = mock_get_cognito_user_pools_success
        mock_method_delete_cognito_user_by_user_name.side_effect = None
        mock_method_query_userid_key.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_method_warning.stop)
        self.addCleanup(patch_method_delete_cognito_user_by_user_name.stop)
        self.addCleanup(patch_method_query_userid_key.stop)

        # call Function test
        with self.assertRaises(PmError):
            usersBatch_logic.execute_delete_invalid_user(trace_id)

        # check logic write log warning
        expected_user_name_force_change_password = copy.deepcopy(DataTestCognitoIdp.LIST_DATA_USER_FORCE_CHANGE_PASSWORD[1]['Username'])
        mock_method_warning.assert_any_call(
            "PM_Affiliationテーブルにて、UserID = %sのレコード取得に失敗しました。",
            expected_user_name_force_change_password)

    def test_execute_delete_invalid_user_error_call_delete_affiliation(self):
        # mock object
        patch_get_cognito_user_pools = patch('premembers.common.aws_common.get_cognito_user_pools')
        patch_method_warning = patch.object(PmLogAdapter, "warning")
        patch_method_delete_cognito_user_by_user_name = patch('premembers.common.aws_common.delete_cognito_user_by_user_name')
        patch_method_query_userid_key = patch('premembers.repository.pm_affiliation.query_userid_key')
        patch_method_delete_affiliation = patch('premembers.repository.pm_affiliation.delete_affiliation')

        # start mock object
        mock_get_cognito_user_pools = patch_get_cognito_user_pools.start()
        mock_method_warning = patch_method_warning.start()
        mock_method_delete_cognito_user_by_user_name = patch_method_delete_cognito_user_by_user_name.start()
        mock_method_query_userid_key = patch_method_query_userid_key.start()
        mock_method_delete_affiliation = patch_method_delete_affiliation.start()

        expected_username_force_change_password = copy.deepcopy(DataTestCognitoIdp.LIST_DATA_USER_FORCE_CHANGE_PASSWORD[1]['Username'])

        data_affiliation_user_force_change_password = copy.deepcopy(DataPmAffiliation.AFFILIATION_TEMPLATE)
        data_affiliation_user_force_change_password['UserID'] = expected_username_force_change_password
        data_query_userid_key = [data_affiliation_user_force_change_password]

        # mock data
        mock_get_cognito_user_pools.side_effect = mock_get_cognito_user_pools_success
        mock_method_delete_cognito_user_by_user_name.side_effect = None
        mock_method_query_userid_key.return_value = data_query_userid_key
        mock_method_delete_affiliation.side_effect = PmError()

        # addCleanup stop mock object
        self.addCleanup(patch_get_cognito_user_pools.stop)
        self.addCleanup(patch_method_warning.stop)
        self.addCleanup(patch_method_delete_cognito_user_by_user_name.stop)
        self.addCleanup(patch_method_query_userid_key.stop)
        self.addCleanup(mock_method_delete_affiliation.stop)

        # call Function test
        with self.assertRaises(PmError):
            usersBatch_logic.execute_delete_invalid_user(trace_id)

        # check logic write log warning
        expected_organizationid = data_affiliation_user_force_change_password['OrganizationID']
        mock_method_warning.assert_any_call(
            "PM_Affiliationテーブルのレコード削除に失敗しました。UserID : %s / OrganizationID : %s",
            expected_username_force_change_password, expected_organizationid)
