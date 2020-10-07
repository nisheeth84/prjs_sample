import copy

from decimal import Decimal
from datetime import timedelta
from premembers.common import common_utils, date_utils
from tests.mock.data.aws.dynamodb.data_common import DataCommon
from tests.mock.data.aws.data_common import DataCommon as data_common_aws

user_id_authority_owner = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
check_item_code = copy.deepcopy(DataCommon.CHECK_ITEM_CODE_TEST)


class DataPmExclusionResources():
    TIME_TO_LIVE_DATE = date_utils.get_current_date() + timedelta(days=180)
    TIME_TO_LIVE = Decimal(TIME_TO_LIVE_DATE.timestamp())
    DATE_NOW = common_utils.get_current_date()
    ORGANIZATION_ID = copy.deepcopy(DataCommon.ORGANIZATION_ID_TEST.format(str(3)))
    PROJECT_ID = copy.deepcopy(DataCommon.PROJECT_ID.format(str(3)))
    USER_ID = copy.deepcopy(DataCommon.USER_ID_TEST.format(str(3)))
    EXCLUSION_COMMENT_UPDATE = "exclusion_comment_update"
    CHECK_ITEM_CODE_NOT_OBJECT_RESOURCE = "CHECK_CIS12_ITEM_1_07"
    CHECK_ITEM_REFINE_CODE_TEMPLATE = "{0}_{1}_{2}_{3}"
    ACCOUNT_REFINE_CODE_TEMPLATE = "{0}_{1}_{2}"
    AWS_ACCOUNT = copy.deepcopy(DataCommon.AWS_ACCOUNT)
    GROUP_FILTER = "CIS12"
    CHECK_CIS12_ITEM_1_21 = "CHECK_CIS12_ITEM_1_21"
    CHECK_CIS_ITEM_2_02 = "CHECK_CIS_ITEM_2_02"
    ACCOUNT_REFINE_CODE = ACCOUNT_REFINE_CODE_TEMPLATE.format(
        ORGANIZATION_ID, PROJECT_ID, AWS_ACCOUNT)
    CHECK_ITEM_REFINE_CODE_CIS = CHECK_ITEM_REFINE_CODE_TEMPLATE.format(
        ORGANIZATION_ID, PROJECT_ID, AWS_ACCOUNT, CHECK_CIS_ITEM_2_02)
    CHECK_ITEM_REFINE_CODE_CIS12 = CHECK_ITEM_REFINE_CODE_TEMPLATE.format(
        ORGANIZATION_ID, PROJECT_ID, AWS_ACCOUNT, CHECK_CIS12_ITEM_1_21)
    RESOURCE_TYPE_SECURITY_GROUPS = "SecurityGroups"
    RESOURCE_TYPE_GROUP_ID = "GroupId"
    RESOURCE_TYPE_USER = "user"
    RESOURCE_TYPE_ROLE = "role"
    RESOURCE_TYPE_GROUP = "group"
    RESOURCE_TYPE_INSTANCE_ID = "InstanceId"
    RESOURCE_TYPE_S3_BUCKET_NAME = "S3BucketName"
    RESOURCE_TYPE_CLOUD_TRAIL_NAME = "CloudTrailName"
    RESOURCE_TYPE_KEY_ID = "KeyId"
    RESOURCE_TYPE_VCP_ID = "VpcId"
    S3_BUCKET_NAME = "s3_bucket_name_test"
    CLOUD_TRAIL_NAME = "cloud_trail_name_test"
    KEY_ID = "key_id_test"

    DATA_SIMPLE = {
        'ExclusionResourceID': "aa4fee9c-790f-478d-9f5d-7aeef688d54f",
        'OrganizationID': ORGANIZATION_ID,
        'ProjectID': PROJECT_ID,
        'AWSAccount': "693642053048",
        'CheckItemCode': CHECK_CIS12_ITEM_1_21,
        'ResourceType': "resource_type",
        'RegionName': "region_name",
        'ResourceName': "resource_name",
        'ExclusionComment': "exclusion_comment",
        'UserID': USER_ID,
        'MailAddress': "test_user_01@sample.com",
        'AccountRefineCode': ACCOUNT_REFINE_CODE,
        'CheckItemRefineCode': CHECK_ITEM_REFINE_CODE_CIS12,
        'TimeToLive': TIME_TO_LIVE,
        "CreatedAt": DATE_NOW,
        "UpdatedAt": DATE_NOW
    }

    DATA_EXCLUSION_RESOURCES = [
        {
            "ExclusionResourceID": "555e9b62-00d8-4aef-b19c-51471401ffd1",
            "MailAddress": "test_user_01@sample.com",
            "TimeToLive": 1580627834.190638,
            "AWSAccount": "216054658829",
            "ResourceName": "sg-ee5d9e87",
            "CreatedAt": "2019-08-06 07:17:18.110",
            "ProjectID": "2458d17c-8dff-4983-9a36-e9e964058fd7",
            "ResourceType": RESOURCE_TYPE_GROUP_ID,
            "OrganizationID": "3c9381d8-9267-47b8-83b9-4281250f8d96",
            "UpdatedAt": "2019-08-06 07:17:18.110",
            "AccountRefineCode":
            "3c9381d8-9267-47b8-83b9-4281250f8d96_2458d17c-8dff-4983-9a36-e9e964058fd7_216054658829",
            "RegionName": copy.deepcopy(data_common_aws.REGION_EU_NORTH_1),
            "UserID": "eb3b5f76-8945-11e7-b15a-8f7e5433dada",
            "CheckItemRefineCode":
            "d5823ac0-e7fd-4b54-8a46-981d6fe68412_2a59525e-96ee-4614-bcd3-ad0fbaf0e384_693642053048_CHECK_CIS12_ITEM_4_01",
            "CheckItemCode": "CHECK_CIS12_ITEM_4_01",
            "ExclusionComment": "test_exclusion_comment"
        },
        {
            "ExclusionResourceID": "not_is_object_clusion_resources",
            "MailAddress": "test_user_01@sample.com",
            "TimeToLive": 1580627834.190638,
            "AWSAccount": "216054658829",
            "ResourceName": "sg-ee5d9e87",
            "CreatedAt": "2019-08-06 07:17:18.110",
            "ProjectID": "2458d17c-8dff-4983-9a36-e9e964058fd7",
            "ResourceType": RESOURCE_TYPE_GROUP_ID,
            "OrganizationID": "3c9381d8-9267-47b8-83b9-4281250f8d96",
            "UpdatedAt": "2019-08-06 07:17:18.110",
            "AccountRefineCode":
            "3c9381d8-9267-47b8-83b9-4281250f8d96_2458d17c-8dff-4983-9a36-e9e964058fd7_216054658829",
            "RegionName": copy.deepcopy(data_common_aws.REGION_EU_NORTH_1),
            "UserID": "eb3b5f76-8945-11e7-b15a-8f7e5433dada",
            "CheckItemRefineCode":
            "d5823ac0-e7fd-4b54-8a46-981d6fe68412_2a59525e-96ee-4614-bcd3-ad0fbaf0e384_693642053048_CHECK_CIS12_ITEM_4_04",
            "CheckItemCode": "CHECK_CIS12_ITEM_4_04",
            "ExclusionComment": "test_exclusion_comment"
        }
    ]

    EXCLUSION_RESOURCES_NOT_DELETE = {
        "ExclusionResourceID": "exclusionresourceid_not_delete",
        "AWSAccount": AWS_ACCOUNT,
        "AccountRefineCode": ACCOUNT_REFINE_CODE,
        "CheckItemCode": check_item_code,
        "CheckItemRefineCode": CHECK_ITEM_REFINE_CODE_CIS12,
        "CreatedAt": "2019-08-06 07:20:06.355",
        "ExclusionComment": "ExclusionComment",
        "MailAddress": "test-user{}@example.com",
        "OrganizationID": ORGANIZATION_ID,
        "ProjectID": PROJECT_ID,
        "RegionName": "RegionName_not_matching",
        "ResourceName": "ResourceName_not_matching",
        "ResourceType": "ResourceType_not_matching",
        "TimeToLive": "2019-08-06 07:20:06.355",
        "UpdatedAt": "2019-08-06 07:20:09.423",
        "UserID": user_id_authority_owner
    }

    DATA_EXCLUSION_RESOURCE_CHECK_ITEM_CODE_CIS = {
        'ExclusionResourceID': "aa4fee9c-790f-478d-9f5d-7aeef688d54h",
        'OrganizationID': ORGANIZATION_ID,
        'ProjectID': PROJECT_ID,
        'AWSAccount': "693642053048",
        'CheckItemCode': CHECK_CIS_ITEM_2_02,
        'RegionName': "region_name",
        'ResourceName': "resource_name",
        'ResourceType': "resource_type",
        'ExclusionComment': "exclusion_comment",
        'UserID': USER_ID,
        'MailAddress': "test_user_01@sample.com",
        'AccountRefineCode': ACCOUNT_REFINE_CODE,
        'CheckItemRefineCode': CHECK_ITEM_REFINE_CODE_CIS,
        'TimeToLive': TIME_TO_LIVE,
        "CreatedAt": DATE_NOW,
        "UpdatedAt": DATE_NOW
    }

    LIST_CHECK_ITEM_CODE_EXCLUDED_RESOURCE = [
        "CHECK_CIS12_ITEM_1_02", "CHECK_CIS12_ITEM_1_03",
        "CHECK_CIS12_ITEM_1_04", "CHECK_CIS12_ITEM_1_16",
        "CHECK_CIS12_ITEM_1_19", "CHECK_CIS12_ITEM_1_21",
        "CHECK_CIS12_ITEM_1_22", "CHECK_CIS12_ITEM_2_02",
        "CHECK_CIS12_ITEM_2_03", "CHECK_CIS12_ITEM_2_04",
        "CHECK_CIS12_ITEM_2_06", "CHECK_CIS12_ITEM_2_07",
        "CHECK_CIS12_ITEM_2_08", "CHECK_CIS12_ITEM_2_09",
        "CHECK_CIS12_ITEM_4_01", "CHECK_CIS12_ITEM_4_02",
        "CHECK_CIS12_ITEM_4_03"
    ]
