import copy

from premembers.common import Ec2Utils as ec2_utils
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.ec2.data_test_ec2 import DataTestEC2
from tests.mock.data.aws.data_common import DataCommon
from premembers.exception.pm_exceptions import PmError
from botocore.exceptions import ClientError
from tests.testcasebase import TestCaseBase
from unittest.mock import patch
from moto import mock_ec2
from tests.mock.aws.ec2 import ec2_utils as ec2_utils_mock

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
aws_account = trace_id
data_client_error = copy.deepcopy(DataCommon.DATA_CLIENT_ERROR)
region_name = copy.deepcopy(DataTestEC2.REGION_NAME)


@mock_ec2
class TestDescribeVpcsError(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_describe_vpcs_error(self):
        # create data mock
        ec2_client = ec2_utils_mock.client_connect()

        with patch.object(
                PmLogAdapter, 'error', return_value=None) as mock_error:
            with patch.object(ec2_client, 'describe_vpcs') as mock_method:
                mock_method.side_effect = ClientError({
                    'Error': {
                        'Code': data_client_error['service_error_code'],
                        'Message': data_client_error['service_message']
                    }
                }, 'EXCEPTION')
                with self.assertRaises(PmError) as exception:
                    # Call function test
                    ec2_utils.describe_vpcs(trace_id, aws_account, ec2_client,
                                            region_name)
                cause_error = exception.exception.cause_error.response['Error']
                # Check result
                self.assertEqual(data_client_error['service_error_code'],
                                 cause_error['Code'])
                self.assertEqual(data_client_error['service_message'],
                                 cause_error['Message'])
        mock_error.assert_any_call("[%s/%s] VPC情報の取得に失敗しました。", aws_account,
                                   region_name)

    def test_describe_vpcs_suscess(self):
        # create data mock
        ec2_client = ec2_utils_mock.client_connect()
        # Call function test
        expect_list_vpc = ec2_client.describe_vpcs()['Vpcs']

        actual_describe_vpcs = ec2_utils.describe_vpcs(trace_id, aws_account,
                                                       ec2_client, region_name)
        # Check result
        self.assertListEqual(expect_list_vpc, actual_describe_vpcs)

    def test_describe_vpcs_empty(self):
        # create data mock
        ec2_client = ec2_utils_mock.client_connect()

        with patch.object(ec2_client, 'describe_vpcs') as mock_method:
            mock_method.return_value = {}
            actual_describe_vpcs = ec2_utils.describe_vpcs(
                trace_id, aws_account, ec2_client, region_name)
            self.assertListEqual([], actual_describe_vpcs)
