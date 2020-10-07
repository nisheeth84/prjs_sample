import os
import json
import uuid
import copy

from decimal import Decimal
from premembers.exception.pm_exceptions import PmError
from premembers.const.const import CommonConst
from tests.mock.aws.dynamodb import db_utils
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.data_common import DataCommon as data_common
from tests.mock.data.aws.s3.data_test_s3 import DataTestS3
from tests.mock.aws.cognito_idp import cognito_idp_utils
from tests.mock.aws.ses import ses_utils
from tests.mock.aws.sns import sns_utils
from tests.mock.aws.sts import sts_utils
from tests.mock.aws.iam import iam_utils
from tests.mock.aws.s3 import s3_utils
from tests.mock.aws.stepfunctions import step_functions_utils
from tests.mock.aws.sts import sts_utils
from tests.mock.aws.ec2 import ec2_utils
from tests.mock.data.aws.data_common import DataCommon
from unittest.mock import patch
from botocore.exceptions import ClientError

error_response = copy.deepcopy(data_common.ERROR_RESPONSE)
operation_name = copy.deepcopy(data_common.OPERATION_NAME)


def mock_authority():
    return patch('premembers.common.checkauthority.check_authority',
                 side_effect_check_authority)


def connect_aws_mock():
    db_utils.resource_connect()
    db_utils.client_connect()
    cognito_idp_utils.client_connect()
    ses_utils.client_connect()
    sns_utils.client_connect()
    sts_utils.client_connect()
    iam_utils.client_connect()
    s3_utils.client_connect()
    ec2_utils.resource_connect()
    ec2_utils.client_connect()
    s3_utils.client_connect()
    s3_utils.resource_connect()
    step_functions_utils.client_connect()


def mock_boto3_resource():
    return patch('boto3.resource', side_effect_resource)


def mock_boto3_client():
    return patch('boto3.client', side_effect_client)


def side_effect_check_authority(trace_id, user_id, organization_id, authority):
    auth_list = [1, 2, 3]
    for auth in auth_list:
        user_id_check = DataCommon.USER_ID_TEST.format(str(auth))
        if user_id == user_id_check and auth >= authority:
            return True
    return False


def side_effect_resource(service_name, endpoint_url=None):
    if service_name == "dynamodb":
        return db_utils.resource_connect()
    if service_name == "ec2":
        return ec2_utils.resource_connect()
    if service_name == "s3":
        return s3_utils.resource_connect()


def side_effect_client(service_name,
                       region_name=None,
                       endpoint_url=None,
                       aws_access_key_id=None,
                       aws_secret_access_key=None):
    if service_name == "cognito-idp":
        return cognito_idp_utils.client_connect()
    if service_name == "dynamodb":
        return db_utils.resource_connect()
    if service_name == "ses":
        return ses_utils.client_connect()
    if service_name == "sts":
        return sts_utils.client_connect()
    if service_name == "iam":
        return iam_utils.client_connect()
    if service_name == "s3":
        return s3_utils.client_connect()
    if service_name == "ec2":
        return ec2_utils.client_connect()
    if service_name == "s3":
        return s3_utils.client_connect()
    if service_name == "stepfunctions":
        return step_functions_utils.client_connect()


def side_effect_client_error(service_name, region_name=None):
    raise ClientError(error_response, operation_name)


def mock_boto3_resource_error():
    return patch('boto3.resource', side_effect_client_error)


def mock_boto3_client_error():
    return patch('boto3.client', side_effect_client_error)


def set_error_response(code, message):
    error_response['Error']['Code'] = code
    error_response['Error']['Message'] = message


def get_error_code():
    return error_response['Error']['Code']


def get_error_message():
    return error_response['Error']['Message']


def set_error_code(error_code):
    error_response['Error']['Code'] = error_code


def set_error_message(error_message):
    error_response['Error']['Message'] = error_message


def mock_error_exception(self):
    # mock object
    patch_error_exception = patch("premembers.common.common_utils.error_exception")

    # start mock object
    mock_error_exception = patch_error_exception.start()

    # mock data
    mock_error_exception.side_effect = side_effect_error_exception

    # addCleanup stop mock object
    self.addCleanup(patch_error_exception.stop)

    return mock_error_exception


def mock_error_common(self):
    # mock object
    patch_error_common = patch("premembers.common.common_utils.error_common")

    # start mock object
    mock_error_common = patch_error_common.start()

    # mock data
    mock_error_common.side_effect = side_effect_error_common

    # addCleanup stop mock object
    self.addCleanup(patch_error_common.stop)

    return mock_error_common


def mock_error_validate(self):
    # mock object
    patch_error_validate = patch("premembers.common.common_utils.error_validate")

    # start mock object
    mock_error_validate = patch_error_validate.start()

    # mock data
    mock_error_validate.side_effect = side_effect_error_validate

    # addCleanup stop mock object
    self.addCleanup(patch_error_validate.stop)

    return mock_error_validate


def side_effect_error_exception(error_code, status_code, error_pm, pm_logger,
                                exc_info):
    if type(error_pm) is not PmError:
        error_pm = PmError(cause_error=error_pm)
    response = get_response_error(error_code, status_code, error_pm.error_id)
    return response


def side_effect_error_validate(error_code, status_code, list_error, logger):
    response_body = {
        "code": error_code['code'],
        "errorId": str(uuid.uuid4()),
        "message": error_code['message'],
        "errors": list_error
    }
    response = get_response_by_response_body(status_code.value, response_body)
    return response


def side_effect_error_common(error_code, status_code, pm_logger):
    error_id = str(uuid.uuid4())
    response = get_response_error(error_code, status_code, error_id)
    return response


def get_response_error(error_code, status_code, error_id=None):
    response_body = {
        "code": error_code['code'],
        "message": error_code['message'],
        "description": error_code['description']
    }
    if (error_id):
        response_body['errorId'] = error_id
    return get_response_by_response_body(status_code.value, response_body)


def get_response_by_response_body(status_code,
                                  response_body,
                                  is_response_json=True,
                                  content_type=None):
    if is_response_json:
        response_body = json.dumps(response_body, default=json_serial)

    response = {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin":
            get_environ(CommonConst.ALLOW_ORIGIN)
        },
        "body": response_body
    }

    if content_type:
        response['headers']['content-type'] = content_type
    return response


def get_environ(key, default_value=None):
    return os.environ.get(key, default_value)


def json_serial(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError("Type %s not serializable" % type(obj))


def side_effect_read_yaml_error_get_message_notice_error_execute_check_security(trace_id, bucket, s3_file_name):
    if s3_file_name == copy.deepcopy(DataTestS3.PATH_FILE_CONFIG):
        return copy.deepcopy(DataTestS3.DATA_CONFIG)
    elif s3_file_name == copy.deepcopy(DataTestS3.PATH_FILE_MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY_JA):
        raise PmError()


def side_effect_read_yaml(trace_id, bucket, s3_file_name):
    if s3_file_name == copy.deepcopy(DataTestS3.PATH_FILE_CONFIG):
        return copy.deepcopy(DataTestS3.DATA_CONFIG)
    elif s3_file_name == copy.deepcopy(DataTestS3.PATH_FILE_MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY_JA):
        return copy.deepcopy(DataTestS3.MESSAGE_NOTICE_ERROR_EXECUTE_CHECK_SECURITY_JA)


def mock_read_yaml(self, is_mock_get_file_template_body=False):
    # mock object
    patch_read_yaml = patch("premembers.common.FileUtils.read_yaml")

    # start mock object
    mock_read_yaml = patch_read_yaml.start()

    # mock data
    if is_mock_get_file_template_body is False:
        mock_read_yaml.side_effect = side_effect_read_yaml_error_get_message_notice_error_execute_check_security
    else:
        mock_read_yaml.side_effect = side_effect_read_yaml

    return [mock_read_yaml, patch_read_yaml]
