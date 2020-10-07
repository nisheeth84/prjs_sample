import copy

from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources


class DataTestKMS():
    KEY_ID = copy.deepcopy(DataPmExclusionResources.KEY_ID)

    LIST_KEY_KMS = [
        {
            'KeyId': KEY_ID,
            'KeyArn': 'arn:aws:kms:ap-northeast-1:216054658829:key/a0957320-ce1a-4cdf-bf6c-78e5e22f5327'
        },
        {
            'KeyId': 'a0957320-ce1a-4cdf-bf6c-78e5e22f5327',
            'KeyArn': 'arn:aws:kms:ap-northeast-1:216054658829:key/a0957320-ce1a-4cdf-bf6c-78e5e22f5327'
        }
    ]

    LIST_ALIASES = [
        {
            'AliasName': 'alias/cm-kajiwara-cis-2-7-key',
            'AliasArn':
            'arn:aws:kms:ap-northeast-1:216054658829:alias/cm-kajiwara-cis-2-7-key',
            'TargetKeyId': 'cfdce319-8801-474d-b32d-c42bd65a7aa7'
        }
    ]

    KEY_ROTATION_STATUS = {
        'KeyRotationEnabled': False,
        'ResponseMetadata': {
            'RequestId': '97743ca0-1f31-457f-99fe-fdb74ff1f378',
            'HTTPStatusCode': 200,
            'HTTPHeaders': {
                'x-amzn-requestid': '97743ca0-1f31-457f-99fe-fdb74ff1f378',
                'cache-control':
                'no-cache, no-store, must-revalidate, private',
                'expires': '0',
                'pragma': 'no-cache',
                'date': 'Tue, 27 Aug 2019 06:12:13 GMT',
                'content-type': 'application/x-amz-json-1.1',
                'content-length': '28'
            },
            'RetryAttempts': 0
        }
    }
