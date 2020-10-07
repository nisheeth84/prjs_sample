import copy

from tests.mock.data.aws.dynamodb.data_pm_exclusion_resources import DataPmExclusionResources
from datetime import datetime
from pytz import timezone


class DataTestCloudTrail():
    s3_bucket_name = copy.deepcopy(DataPmExclusionResources.S3_BUCKET_NAME)
    CLOUD_TRAIL_NAME = copy.deepcopy(DataPmExclusionResources.CLOUD_TRAIL_NAME)
    CLOUD_TRAIL_NAME = copy.deepcopy(DataPmExclusionResources.CLOUD_TRAIL_NAME)
    CURRENT_DATE = datetime.now(timezone('UTC'))

    LIST_CLOUD_TRAILS = [
        {
            "CloudWatchLogsLogGroupArn": "CloudWatchLogsLogGroupArn1",
            "CloudWatchLogsRoleArn": "CloudWatchLogsRoleArn1",
            "HasCustomEventSelectors": True,
            "HomeRegion": "HomeRegion1",
            "IncludeGlobalServiceEvents": False,
            "IsMultiRegionTrail": False,
            "IsOrganizationTrail": True,
            "KmsKeyId": "KmsKeyId",
            "LogFileValidationEnabled": False,
            "Name": CLOUD_TRAIL_NAME,
            "S3BucketName": s3_bucket_name,
            "S3KeyPrefix": "S3KeyPrefix",
            "SnsTopicARN": "SnsTopicARN",
            "SnsTopicName": "SnsTopicName",
            "TrailARN": "TrailARN"
        },
        {
            "CloudWatchLogsLogGroupArn": "CloudWatchLogsLogGroupArn2",
            "CloudWatchLogsRoleArn": "CloudWatchLogsRoleArn2",
            "HasCustomEventSelectors": True,
            "HomeRegion": "HomeRegion2",
            "IncludeGlobalServiceEvents": False,
            "IsMultiRegionTrail": False,
            "IsOrganizationTrail": True,
            "KmsKeyId": "KmsKeyId",
            "LogFileValidationEnabled": False,
            "Name": "CloudTrailName",
            "S3BucketName": "S3BucketName",
            "S3KeyPrefix": "S3KeyPrefix",
            "SnsTopicARN": "SnsTopicARN",
            "SnsTopicName": "SnsTopicName",
            "TrailARN": "TrailARN"
        },
    ]

    TRAILS_STATUS = {
        'IsLogging': True,
        'LatestDeliveryError': 'string',
        'LatestNotificationError': 'string',
        'LatestDeliveryTime': CURRENT_DATE,
        'LatestNotificationTime': CURRENT_DATE,
        'StartLoggingTime': CURRENT_DATE,
        'StopLoggingTime': CURRENT_DATE,
        'LatestCloudWatchLogsDeliveryError': 'string',
        'LatestCloudWatchLogsDeliveryTime': CURRENT_DATE,
        'LatestDigestDeliveryTime': CURRENT_DATE,
        'LatestDigestDeliveryError': 'string',
        'LatestDeliveryAttemptTime': 'string',
        'LatestNotificationAttemptTime': 'string',
        'LatestNotificationAttemptSucceeded': 'string',
        'LatestDeliveryAttemptSucceeded': 'string',
        'TimeLoggingStarted': 'string',
        'TimeLoggingStopped': 'string'
    }
