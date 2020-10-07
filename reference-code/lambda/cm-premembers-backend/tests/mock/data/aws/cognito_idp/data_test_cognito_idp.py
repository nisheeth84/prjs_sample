import copy

from datetime import datetime
from pytz import timezone
from premembers.common import common_utils
from dateutil.parser import parse
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.dynamodb.data_pm_email_change_apply import DataPmEmailChangeApply

user_id = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))


class DataTestCognitoIdp:
    FILTER = 'test_user@example.net'
    TRACE_ID = common_utils.get_uuid4()
    USER_NAME = 'test_user'
    CURRENT_DATE = datetime.now(timezone('UTC'))
    DATA_OVERDUE = parse("2009-12-31").replace(tzinfo=timezone('UTC'))

    LIST_DATA_USER = [
        {
            'userName': 'test_user',
            'user_attributes': {
                'Name': 'email',
                'Value': 'test_user@example.net'
            }
        },
        {
            'userName': 'test_user_01',
            'user_attributes': {
                'Name': 'email',
                'Value': 'test_user_01@example.net'
            }
        },
        {
            'userName': 'test_user_02',
            'user_attributes': {
                'Name': 'email',
                'Value': 'test_user_02@example.net'
            }
        }
    ]

    DATA_RESPONSE_SUCCESS = [
        {
            'Name': 'email',
            'Value': 'test_user@example.net'
        },
        {
            'Name': 'email',
            'Value': 'test_user_01@example.net'
        },
        {
            'Name': 'email',
            'Value': 'test_user_02@example.net'
        }
    ]

    USER_ATTRIBUTES_UPDATE = [{
        'Name': 'email',
        'Value': 'test_user_update@example.net'
    }]

    USER_INFO = {
            'User': {
                'Username': 'string',
                'Attributes': [
                    {
                        'Name': 'string',
                        'Value': 'string'
                    },
                ],
                'UserCreateDate': DATA_OVERDUE,
                'UserLastModifiedDate': "datetime",
                'Enabled': False,
                'UserStatus': 'CONFIRMED',
                'MFAOptions': [
                    {
                        'DeliveryMedium': 'EMAIL',
                        'AttributeName': 'string'
                    },
                ]
            }
        }

    USER_INFOR_GET_COGNITO_USER_INFO_BY_USER_NAME = {
        "Enabled": True,
        "MFAOptions": [
            {
                "AttributeName": "AttributeName",
                "DeliveryMedium": "DeliveryMedium"
            }
        ],
        "PreferredMfaSetting": "PreferredMfaSetting",
        "UserAttributes": [
            {
                "Name": "email",
                "Value": copy.deepcopy(DataPmEmailChangeApply.BEFORE_MAIL_ADDRESS)
            }
        ],
        "UserCreateDate": DATA_OVERDUE,
        "UserLastModifiedDate": 2,
        "UserMFASettingList": ["UserMFASettingList1"],
        "Username": user_id,
        "UserStatus": "UserStatus"
    }

    LIST_DATA_USER_UNCONFIRMED = [{
        'Username': 'username_unconfirmed_1',
        'Attributes': {
            'Name': 'email',
            'Value': 'test_user@example.net'
        },
        'UserCreateDate': CURRENT_DATE,
        'UserLastModifiedDate': CURRENT_DATE,
        'Enabled': False,
        'UserStatus': 'UNCONFIRMED'
    }, {
        'Username': 'username_unconfirmed_2',
        'Attributes': {
            'Name': 'email',
            'Value': 'test_user_01@example.net'
        },
        'UserCreateDate': DATA_OVERDUE,
        'UserLastModifiedDate': DATA_OVERDUE,
        'Enabled': False,
        'UserStatus': 'UNCONFIRMED'
    }]

    LIST_DATA_USER_FORCE_CHANGE_PASSWORD = [{
        'Username':
        'username_force_change_password_1',
        'Attributes': {
            'Name': 'email',
            'Value': 'test_user@example.net'
        },
        'UserCreateDate':
        CURRENT_DATE,
        'UserLastModifiedDate':
        CURRENT_DATE,
        'Enabled':
        False,
        'UserStatus':
        'FORCE_CHANGE_PASSWORD'
    }, {
        'Username':
        'username_force_change_password_2',
        'Attributes': {
            'Name': 'email',
            'Value': 'test_user_01@example.net'
        },
        'UserCreateDate':
        DATA_OVERDUE,
        'UserLastModifiedDate':
        DATA_OVERDUE,
        'Enabled':
        False,
        'UserStatus':
        'FORCE_CHANGE_PASSWORD'
    }]

    USER_INFO_COGNITO = {
        'Username':
        'b4f2e73d-149b-4c62-968d-29d217b15c6f',
        'UserAttributes': [{
            'Name': 'sub',
            'Value': 'ee9795e8-1d3a-454c-9382-7d0d4b901937'
        }, {
            'Name': 'email_verified',
            'Value': 'true'
        }, {
            'Name': 'locale',
            'Value': 'ja'
        }, {
            'Name': 'email',
            'Value': 'luvinatest@luvina.net'
        }],
        'UserCreateDate': CURRENT_DATE,
        'UserLastModifiedDate': CURRENT_DATE,
        'Enabled': True,
        'UserStatus':
        'CONFIRMED',
        'ResponseMetadata': {
            'RequestId': '72523c27-ec36-45f8-899c-ff5b51150e73',
            'HTTPStatusCode': 200,
            'HTTPHeaders': {
                'date': 'Thu, 03 Oct 2019 06:30:46 GMT',
                'content-type': 'application/x-amz-json-1.1',
                'content-length': '369',
                'connection': 'keep-alive',
                'x-amzn-requestid': '72523c27-ec36-45f8-899c-ff5b51150e73'
            },
            'RetryAttempts': 0
        }
    }

    list_data_user = [
        {
            'userName': 'test_user',
            'user_attributes': {
                'Name': 'email',
                'Value': 'test_user@example.net'
            }
        },
        {
            'userName': 'test_user_01',
            'user_attributes': {
                'Name': 'email',
                'Value': 'test_user_01@example.net'
            }
        },
        {
            'userName': 'test_user_02',
            'user_attributes': {
                'Name': 'email',
                'Value': 'test_user_02@example.net'
            }
        }
    ]

    data_response_success = [
        {
            'Name': 'email',
            'Value': 'test_user@example.net'
        },
        {
            'Name': 'email',
            'Value': 'test_user_01@example.net'
        },
        {
            'Name': 'email',
            'Value': 'test_user_02@example.net'
        }
    ]

    user_attributes_data = [{
        'Name': 'email',
        'Value': 'test_user@example.net'
    }]

    user_attributes_update = [{
        'Name': 'email',
        'Value': 'test_user_update@example.net'
    }]
