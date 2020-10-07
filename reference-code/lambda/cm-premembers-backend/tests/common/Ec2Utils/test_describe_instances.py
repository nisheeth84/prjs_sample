import copy

from moto import mock_ec2
from premembers.common import Ec2Utils as ec2_utils
from premembers.common.pm_log_adapter import PmLogAdapter
from premembers.exception.pm_exceptions import PmError
from unittest.mock import patch
from botocore.exceptions import ClientError
from tests.mock.data.aws.ec2.data_test_ec2 import DataTestEC2
from tests.mock.data.aws.data_common import DataCommon
from tests.testcasebase import TestCaseBase
from tests.mock.aws.ec2 import ec2_utils as ec2_utils_mock

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
aws_account = trace_id
data_client_error = copy.deepcopy(DataCommon.DATA_CLIENT_ERROR)
region_name = copy.deepcopy(DataTestEC2.REGION_NAME)
image_id = 'ami-1234abcd'


@mock_ec2
class TestDescribeInstances(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_describe_instance_error(self):
        # create data mock
        ec2_client = ec2_utils_mock.client_connect()

        with patch.object(
                PmLogAdapter, 'error', return_value=None) as mock_error:

            with patch.object(ec2_client, 'describe_instances') as mock_method:
                mock_method.side_effect = ClientError({
                    'Error': {
                        'Code': data_client_error['service_error_code'],
                        'Message': data_client_error['service_message']
                    }
                }, 'EXCEPTION')

                with self.assertRaises(PmError) as exception:
                    # Call function test
                    ec2_utils.describe_instances(trace_id, aws_account,
                                                 ec2_client, region_name)

                cause_error = exception.exception.cause_error.response['Error']
                # Check result
                self.assertEqual(data_client_error['service_error_code'],
                                 cause_error['Code'])
                self.assertEqual(data_client_error['service_message'],
                                 cause_error['Message'])

        mock_error.assert_any_call("[%s/%s] EC2インスタンス情報の取得に失敗しました。",
                                   aws_account, region_name)

    def test_describe_instances_exist_next_token(self):
        # create data mock
        ec2_client = ec2_utils_mock.client_connect()
        with patch.object(ec2_client, 'describe_instances') as mock_obj:
            mock_obj.side_effect = ec2_utils_mock.side_effect_describe_instances
            # Call function test
            actual_instances = ec2_utils.describe_instances(
                trace_id, aws_account, ec2_client, region_name)
        # Check result
        expect_resual = copy.deepcopy(
            DataTestEC2.DATA_CHECK_ALL_DESCRIBE_INSTANCES['Reservations'])
        self.assertListEqual(expect_resual, actual_instances)

    def test_describe_instances_not_exist(self):
        # create data mock
        ec2_client = ec2_utils_mock.client_connect()
        # Call function test
        actual_instances = ec2_utils.describe_instances(
            trace_id, aws_account, ec2_client, region_name)
        # Check result
        self.assertListEqual([], actual_instances)

    def test_describe_instances_success(self):
        # create data mock
        ec2_resource_connect = ec2_utils_mock.resource_connect()
        ec2_client = ec2_utils_mock.client_connect()

        ec2_resource_connect.create_instances(
            ImageId='', MinCount=1, MaxCount=1)
        expect_response = ec2_client.describe_instances()
        # Call function test
        actual_instances = ec2_utils.describe_instances(
            trace_id, aws_account, ec2_client, region_name)
        # Check result
        self.assertListEqual(expect_response['Reservations'], actual_instances)
