import boto3
import copy

from premembers.common import aws_common
from tests.mock.data.aws.data_common import DataCommon
from tests.mock.data.aws.ec2.data_test_ec2 import DataTestEC2
from premembers.exception.pm_exceptions import PmError
from botocore.exceptions import ClientError
from tests.testcasebase import TestCaseBase
from unittest.mock import patch
from moto import mock_ec2, mock_sts
from tests.mock.aws.ec2 import ec2_utils as ec2_utils_mock
from tests.mock.aws.sts import sts_utils as sts_utils_mock

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
region_name = copy.deepcopy(DataTestEC2.REGION_NAME)
filter_describe_regions = copy.deepcopy(DataTestEC2.FILTER_DESCRIBE_REGIONS)
session = None

@mock_ec2
@mock_sts
class TestGetRegions(TestCaseBase):
    def setUp(self):
        super().setUp()

        # create session
        global session
        if not session:
            session = sts_utils_mock.create_session()

    def test_get_regions_error(self):
        # create data mock
        expected_error_response = copy.deepcopy(DataCommon.ERROR_RESPONSE)
        expected_operation_name = copy.deepcopy(DataCommon.OPERATION_NAME)
        ec2_client_connect = ec2_utils_mock.client_connect()

        with patch.object(ec2_client_connect, 'describe_regions') as mock_method:
            mock_method.side_effect = ClientError(
                error_response=expected_error_response,
                operation_name=expected_operation_name)
            with self.assertRaises(PmError) as exception:
                # Call function test
                aws_common.get_regions(trace_id)

        # check error
        actual_cause_error = exception.exception.cause_error
        self.assertEqual(expected_error_response['Error'],
                         actual_cause_error.response['Error'])
        self.assertEqual(expected_operation_name,
                         actual_cause_error.operation_name)

    def test_get_all_regions_succces_case_session_is_none_filter_describe_regions_and_all_regions_is_none(self):
        # create data mock
        ec2_client_connect = boto3.client('ec2', region_name)
        response = ec2_client_connect.describe_regions()
        expected_regions = response['Regions']

        # Call function test
        actual_regions = aws_common.get_regions(
            trace_id, filter_describe_regions=None, all_regions=None)

        self.assertListEqual(expected_regions, actual_regions)

    def test_get_regions_enable_succces_case_session_is_none_filter_describe_regions_is_not_none(self):
        # create data mock
        ec2_client_connect = boto3.client('ec2', region_name)
        response = ec2_client_connect.describe_regions(
            Filters=filter_describe_regions)
        expected_regions = response['Regions']

        # Call function test
        actual_regions = aws_common.get_regions(trace_id, all_regions=None)

        self.assertListEqual(expected_regions, actual_regions)

    def test_get_regions_enable_succces_case_session_is_none_all_regions_is_not_none(self):
        # create data mock
        ec2_client_connect = boto3.client('ec2', region_name)
        response = ec2_client_connect.describe_regions(
            AllRegions=True)
        expected_regions = response['Regions']

        # Call function test
        actual_regions = aws_common.get_regions(
            trace_id, filter_describe_regions=None)

        self.assertListEqual(expected_regions, actual_regions)

    def test_get_all_regions_succces_case_session_is_none_filter_describe_regions_and_all_regions_is_not_none(self):
        # create data mock
        ec2_client_connect = boto3.client('ec2', region_name)
        response = ec2_client_connect.describe_regions(
            Filters=filter_describe_regions, AllRegions=True)
        expected_regions = response['Regions']

        # Call function test
        actual_regions = aws_common.get_regions(trace_id)

        self.assertListEqual(expected_regions, actual_regions)

    def test_get_all_regions_succces_case_session_is_not_none_filter_describe_regions_and_all_regions_is_none(self):
        # create data mock
        ec2_client_connect = session.client('ec2')
        response = ec2_client_connect.describe_regions()
        expected_regions = response['Regions']

        # Call function test
        actual_regions = aws_common.get_regions(
            trace_id,
            session=session,
            filter_describe_regions=None,
            all_regions=None)

        self.assertListEqual(expected_regions, actual_regions)

    def test_get_regions_enable_succces_case_session_is_not_none_filter_describe_regions_is_not_none(self):
        # create data mock
        ec2_client_connect = session.client('ec2')
        response = ec2_client_connect.describe_regions(
            Filters=filter_describe_regions)
        expected_regions = response['Regions']

        # Call function test
        actual_regions = aws_common.get_regions(
            trace_id, session=session, all_regions=None)

        self.assertListEqual(expected_regions, actual_regions)

    def test_get_regions_enable_succces_case_session_is_not_none_all_regions_is_not_none(self):
        # create data mock
        ec2_client_connect = session.client('ec2')
        response = ec2_client_connect.describe_regions(
            AllRegions=True)
        expected_regions = response['Regions']

        # Call function test
        actual_regions = aws_common.get_regions(
            trace_id, session=session, filter_describe_regions=None)

        self.assertListEqual(expected_regions, actual_regions)

    def test_get_all_regions_succces_case_session_is_not_none_filter_describe_regions_and_all_regions_is_not_none(self):
        # create data mock
        ec2_client_connect = session.client('ec2')
        response = ec2_client_connect.describe_regions(
            Filters=filter_describe_regions, AllRegions=True)
        expected_regions = response['Regions']

        # Call function test
        actual_regions = aws_common.get_regions(trace_id, session=session)

        self.assertListEqual(expected_regions, actual_regions)
