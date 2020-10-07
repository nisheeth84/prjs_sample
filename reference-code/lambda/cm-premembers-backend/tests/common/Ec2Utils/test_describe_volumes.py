import copy

from premembers.common import Ec2Utils as ec2_utils
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock.data.aws.ec2.data_test_ec2 import DataTestEC2
from tests.mock.data.aws.data_common import DataCommon
from tests.testcasebase import TestCaseBase
from unittest.mock import patch
from premembers.exception.pm_exceptions import PmError
from botocore.exceptions import ClientError
from moto import mock_ec2
from tests.mock.aws.ec2 import ec2_utils as ec2_utils_mock

trace_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
aws_account = trace_id
data_client_error = copy.deepcopy(DataCommon.DATA_CLIENT_ERROR)
region_name = copy.deepcopy(DataTestEC2.REGION_NAME)
volum_test = copy.deepcopy(DataTestEC2.VOLUMS_TEST)


@mock_ec2
class TestDescribeVolumes(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_describe_volumes_suscess(self):
        # create data mock
        ec2_client = ec2_utils_mock.client_connect()

        ec2_client.create_volume(
            AvailabilityZone=volum_test['AvailabilityZone'],
            Encrypted=volum_test['Encrypted'],
            Size=volum_test['Size'],
            TagSpecifications=volum_test['TagSpecifications'])

        # Call function test
        actual_volumes = ec2_utils.describe_volumes(trace_id, aws_account,
                                                    ec2_client, region_name)
        # Check result
        self.assertEqual(1, len(actual_volumes))
        self.assertEqual(volum_test['Encrypted'],
                         actual_volumes[0]['Encrypted'])

        self.assertEqual(volum_test['Size'], actual_volumes[0]['Size'])

        self.assertDictEqual(
            volum_test['TagSpecifications'][0]['Tags'][0],
            actual_volumes[0]['Tags'][0],
        )

    def test_describe_volumes_client_error(self):
        # create data mock
        ec2_client = ec2_utils_mock.client_connect()

        with patch.object(
                PmLogAdapter, 'error', return_value=None) as mock_error:
            with patch.object(ec2_client, 'describe_volumes') as mock_method:
                mock_method.side_effect = ClientError({
                    'Error': {
                        'Code': data_client_error['service_error_code'],
                        'Message': data_client_error['service_message']
                    }
                }, 'EXCEPTION')

                with self.assertRaises(PmError) as exception:
                    # Call function test
                    ec2_utils.describe_volumes(trace_id, aws_account,
                                               ec2_client, region_name)
                cause_error = exception.exception.cause_error.response['Error']
                # Check result
                self.assertEqual(data_client_error['service_error_code'],
                                 cause_error['Code'])
                self.assertEqual(data_client_error['service_message'],
                                 cause_error['Message'])
        mock_error.assert_any_call("[%s/%s] EBSボリューム情報の取得に失敗しました。",
                                   aws_account, region_name)

    def test_describe_volumes_exist_next_token(self):
        # create data mock
        ec2_client = ec2_utils_mock.client_connect()

        with patch.object(ec2_client, 'describe_volumes') as mock_obj:
            mock_obj.side_effect = ec2_utils_mock.side_effect_describe_volumes
            # Call function test
            actual_volumes = ec2_utils.describe_volumes(
                trace_id, aws_account, ec2_client, region_name)
        # Check result
        expect_volums = copy.deepcopy(DataTestEC2.DATA_CHECK_ALL_DESCRIBE_VOLUMES[
            'Volumes'])
        self.assertListEqual(expect_volums, actual_volumes)

    def test_describe_volumes_not_exist(self):
        # create data mock
        ec2_client = ec2_utils_mock.client_connect()
        # Call function test
        with patch.object(ec2_client, 'describe_volumes') as mock_obj:
            mock_obj.return_value = {}
            actual_volumes = ec2_utils.describe_volumes(
                trace_id, aws_account, ec2_client, region_name)
            # Check result
        self.assertEqual([], actual_volumes)
