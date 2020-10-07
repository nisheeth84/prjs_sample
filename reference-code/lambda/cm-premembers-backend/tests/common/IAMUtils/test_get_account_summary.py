import copy

from tests.testcasebase import TestCaseBase
from moto import mock_iam, mock_sts

from tests.mock.aws.iam import iam_utils
from tests.mock.aws.sts import sts_utils
from premembers.exception.pm_exceptions import PmError
from premembers.common import IAMUtils
from tests.mock.data.aws.data_common import DataCommon
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.iam.data_test_iam import DataTestIAM
from botocore.exceptions import ClientError
from unittest.mock import patch

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(1))
aws_account = copy.deepcopy(DataCommon.AWS_ACCOUNT)
session = None


@mock_sts
@mock_iam
class TestGetAccountSummary(TestCaseBase):
    def setUp(self):
        super().setUp()

        # create session
        global session
        if not session:
            session = sts_utils.create_session()

    def test_get_account_summary_success_by_response_exists_attribute_summary_map(self):
        # connect client
        client_connect_iam = iam_utils.client_connect()

        expected_data_account_summary = copy.deepcopy(
            DataTestIAM.DATA_ACCOUNT_SUMMARY_EXISTS_ATTRIBUTE)

        # mock client
        with patch.object(session, 'client') as mock_method_client:
            mock_method_client.return_value = client_connect_iam
            # mock response API get_account_summary
            with patch.object(client_connect_iam,
                              'get_account_summary') as mock_method:
                mock_method.return_value = expected_data_account_summary
                actual_data_account_summary = IAMUtils.get_account_summary(
                    trace_id, session, aws_account)

        # check response
        self.assertEqual(expected_data_account_summary['SummaryMap'],
                         actual_data_account_summary)

        # check connect client
        mock_method_client.assert_any_call(service_name="iam")

    def test_get_account_summary_success_by_response_not_exists_attribute_summary_map(self):
        # connect client
        client_connect_iam = iam_utils.client_connect()

        expected_data_account_summary = []

        # mock client
        with patch.object(session, 'client') as mock_method_client:
            mock_method_client.return_value = client_connect_iam
            # mock response API get_account_summary
            with patch.object(client_connect_iam,
                              'get_account_summary') as mock_method:
                mock_method.return_value = {}
                actual_data_account_summary = IAMUtils.get_account_summary(
                    trace_id, session, aws_account)

        # check response
        self.assertEqual(expected_data_account_summary,
                         actual_data_account_summary)

        # check connect client
        mock_method_client.assert_any_call(service_name="iam")

    def test_get_account_summary_error_connect_iam(self):
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        # mock error client
        with patch.object(session, 'client') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with patch.object(
                    PmLogAdapter, 'error',
                    return_value=None) as mock_method_error:
                with self.assertRaises(PmError) as exception:
                    IAMUtils.get_account_summary(trace_id, session,
                                                 aws_account)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check message log error
        mock_method_error.assert_any_call("[%s] IAMクライアント作成に失敗しました。",
                                          aws_account)

    def test_get_account_summary_error_call_get_account_summary(self):
        # connect client
        client_connect_iam = iam_utils.client_connect()

        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)

        # mock client
        with patch.object(session, 'client') as mock_client:
            mock_client.return_value = client_connect_iam
            # mock error call API get_account_summary
            with patch.object(client_connect_iam,
                              'get_account_summary') as mock_method:
                mock_method.side_effect = ClientError(
                    error_response=expected_error_response,
                    operation_name=expected_operation_name)
                with patch.object(
                        PmLogAdapter, 'error',
                        return_value=None) as mock_method_error:
                    with self.assertRaises(PmError) as exception:
                        IAMUtils.get_account_summary(trace_id, session,
                                                     aws_account)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

        # check message log error
        mock_method_error.assert_any_call("[%s] アカウントサマリーの取得に失敗しました。",
                                          aws_account)
