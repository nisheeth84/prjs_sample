from tests.testcasebase import TestCaseBase
import boto3
from moto import mock_ses

from tests.mock.data.aws.ses.data_test_ses import DataTestSes
from premembers.exception.pm_exceptions import PmError
from premembers.common import aws_common
from premembers.common.pm_log_adapter import PmLogAdapter
from tests.mock import mock_common_utils
from botocore.exceptions import ClientError
from unittest.mock import patch


@mock_ses
class TestSendEmail(TestCaseBase):
    def setUp(self):
        super().setUp()

    def test_send_email_success_with_status_code_200(self):
        trace_id = DataTestSes.TRACE_ID
        region_name = DataTestSes.REGIONS
        sender = DataTestSes.SENDER
        subject = DataTestSes.SUBJECT
        bcc = DataTestSes.BCC
        body = DataTestSes.BODY
        Destination = DataTestSes.DESTINATION
        Message = DataTestSes.MESSAGE
        client = boto3.client(service_name='ses', region_name=region_name)
        response = {'ResponseMetadata': {'HTTPStatusCode': 200}}
        with patch.object(boto3, 'client', return_value=client):

            # call function test
            with patch.object(
                    client, 'send_email',
                    return_value=response) as mock_send_email:
                aws_common.send_email(trace_id, region_name, sender, bcc,
                                      subject, body)
        mock_send_email.assert_called_once_with(
            Source=sender, Destination=Destination, Message=Message)

    def test_send_email_error_with_status_code_other_200(self):
        trace_id = DataTestSes.TRACE_ID
        region_name = DataTestSes.REGIONS
        sender = DataTestSes.SENDER
        subject = DataTestSes.SUBJECT
        bcc = DataTestSes.BCC
        body = DataTestSes.BODY
        Destination = DataTestSes.DESTINATION
        Message = DataTestSes.MESSAGE
        client = boto3.client(service_name='ses', region_name=region_name)
        response = {'ResponseMetadata': {'HTTPStatusCode': 400}}
        with patch.object(boto3, 'client', return_value=client):
            with patch.object(
                    client, 'send_email',
                    return_value=response) as mock_send_email:

                # call function test
                with self.assertRaises(PmError):
                    aws_common.send_email(trace_id, region_name, sender, bcc,
                                          subject, body)
        mock_send_email.assert_called_once_with(
            Source=sender, Destination=Destination, Message=Message)

    def test_send_email_error_client_connect_ses(self):
        trace_id = DataTestSes.TRACE_ID
        region_name = DataTestSes.REGIONS
        sender = DataTestSes.SENDER
        subject = DataTestSes.SUBJECT
        bcc = DataTestSes.BCC
        body = DataTestSes.BODY
        self.create_mock_boto3_client_error()
        mock_common_utils.set_error_response("500", "ERROR")
        with patch.object(
                PmLogAdapter, 'error', return_value=None) as error_method:

            # call function test
            with self.assertRaises(PmError) as exception:
                aws_common.send_email(trace_id, region_name, sender, bcc,
                                      subject, body)

        # check result
        cause_error = exception.exception.cause_error.response['Error']
        self.assertEqual(cause_error['Code'],
                         mock_common_utils.get_error_code())
        self.assertEqual(cause_error['Message'],
                         mock_common_utils.get_error_message())
        error_method.assert_any_call("[%s] SESクライアント作成に失敗しました。", region_name)

    def test_send_email_error_call_send_email(self):
        trace_id = DataTestSes.TRACE_ID
        region_name = DataTestSes.REGIONS
        sender = DataTestSes.SENDER
        subject = DataTestSes.SUBJECT
        bcc = DataTestSes.BCC
        body = DataTestSes.BODY
        error_code = mock_common_utils.get_error_code()
        error_message = mock_common_utils.get_error_message()
        client = boto3.client(service_name='ses', region_name=region_name)
        response = {'ResponseMetadata': {'HTTPStatusCode': 200}}
        with patch.object(boto3, 'client', return_value=client):
            with patch.object(
                    client, 'send_email',
                    return_value=response) as mock_send_email:
                mock_send_email.side_effect = ClientError({
                    'Error': {
                        'Code': error_code,
                        'Message': error_message
                    }
                }, 'description error')

                # call function test
                with self.assertRaises(PmError) as exception:
                    aws_common.send_email(trace_id, region_name, sender, bcc,
                                          subject, body)

        # check result
        cause_error = exception.exception.cause_error.response['Error']
        self.assertEqual(cause_error['Code'], error_code)
        self.assertEqual(cause_error['Message'], error_message)
