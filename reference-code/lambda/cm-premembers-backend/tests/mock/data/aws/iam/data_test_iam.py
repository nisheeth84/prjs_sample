class DataTestIAM:
    FILTER = 'test_user_01@example.net'
    ROLE_NAME = 'insightwatch-cis3-dev-check-role-IAMRole-13OH7LAS2WPJW'
    EXTERNAL_ID = '62e87961-9f4c-4b8d-986a-693340f4b4aa'
    USER_NAME = 'my-user'
    POLICY_ARN = 'arn:aws:s3:::EXAMPLE-BUCKET/*'
    VERSION_ID = 'v1'
    RESPONSE_NOT_EXISTS_CONTENT = {
        'test_response': 'test_response_not_content'
    }

    DATA_GET_CREDENTIAL_REPORT = {
        'Content':
        b'user,arn,user_creation_time,password_enabled,password_last_used,password_last_changed,password_next_rotation,mfa_active,access_key_1_active,access_key_1_last_rotated,access_key_2_active,access_key_2_last_rotated,cert_1_active,cert_1_last_rotated,cert_2_active,cert_2_last_rotated\n',
        'ReportFormat': 'text/csv',
        'GeneratedTime': '2014-08-28T21:42:50Z'
    }
    POLICY_NAME = 'UserAttachedPolicy'
    LIST_PASSWORD_POLICY = {
        'PasswordPolicy': {
            'AllowUsersToChangePassword': False,
            'ExpirePasswords': False,
            'HardExpiry': False,
            'MaxPasswordAge': 90,
            'MinimumPasswordLength': 8,
            'PasswordReusePrevention': 12,
            'RequireLowercaseCharacters': False,
            'RequireNumbers': True,
            'RequireSymbols': True,
            'RequireUppercaseCharacters': False,
        },
        'ResponseMetadata': {
            'RequestId': '7a62c49f-347e-4fc4-9331-6e8eEXAMPLE'
        }
    }
    DATA_LIST_USER_IS_TRUNCATED_FALSE = {
        'Users': [
            {
                "Path": "/",
                "UserName": "test_user@example.net",
                "UserId": "AIDAI2XBHJCIYNLDQDOVO",
                "Arn": "arn:aws:iam::216054658829:user/test_user@example.net",
                "CreateDate": "2019-03-08T06:24:22+00:00",
                "PasswordLastUsed": "2019-05-20T02:16:57+00:00"
            },
            {
                "Path": "/",
                "UserName": "test_user_01@example.net",
                "UserId": "AIDAJSSAYHSZEQL7P3MGK",
                "Arn": "arn:aws:iam::216054658829:user/test_user_01@example.net",
                "CreateDate": "2018-10-23T07:33:21+00:00",
                "PasswordLastUsed": "2019-05-20T01:48:44+00:00"
            }
        ],
        'IsTruncated': False
    }

    DATA_LIST_USER_IS_TRUNCATED_TRUE1 = {
        'Users': [
            {
                "Path": "/",
                "UserName": "test_user_02@example.net",
                "UserId": "AIDAIW5NCTUGZSPSIIT2C",
                "Arn": "arn:aws:iam::216054658829:user/test_user_02@example.net",
                "CreateDate": "2018-09-03T04:34:50+00:00",
                "PasswordLastUsed": "2019-05-20T04:16:40+00:00"
            },
            {
                "Path": "/",
                "UserName": "luvina-test",
                "UserId": "AIDAJJZAHI5BHBV2S2W54",
                "Arn": "arn:aws:iam::216054658829:user/luvina-test",
                "CreateDate": "2017-09-22T08:19:35+00:00",
                "PasswordLastUsed": "2018-03-07T10:12:53+00:00"
            }
        ],
        'IsTruncated': True,
        'Marker': 1
    }

    DATA_LIST_USER_IS_TRUNCATED_TRUE2 = {
        'Users': [
            {
                "Path": "/",
                "UserName": "test_user_03@example.net",
                "UserId": "AIDAJKYPXDBZQNJXAQUXG",
                "Arn": "arn:aws:iam::216054658829:user/test_user_03@example.net",
                "CreateDate": "2017-11-20T07:28:32+00:00",
                "PasswordLastUsed": "2019-05-20T04:41:00+00:00"
            }
        ],
        'IsTruncated': True,
        'Marker': 3
    }

    LIST_USER_DATA = [
        {
            "Path": "/",
            "UserName": "test_user_02@example.net",
            "UserId": "AIDAIW5NCTUGZSPSIIT2C",
            "Arn": "arn:aws:iam::216054658829:user/test_user_02@example.net",
            "CreateDate": "2018-09-03T04:34:50+00:00",
            "PasswordLastUsed": "2019-05-20T04:16:40+00:00"
        },
        {
            "Path": "/",
            "UserName": "luvina-test",
            "UserId": "AIDAJJZAHI5BHBV2S2W54",
            "Arn": "arn:aws:iam::216054658829:user/luvina-test",
            "CreateDate": "2017-09-22T08:19:35+00:00",
            "PasswordLastUsed": "2018-03-07T10:12:53+00:00"
        },
        {
            "Path": "/",
            "UserName": "test_user_03@example.net",
            "UserId": "AIDAJKYPXDBZQNJXAQUXG",
            "Arn": "arn:aws:iam::216054658829:user/test_user_03@example.net",
            "CreateDate": "2017-11-20T07:28:32+00:00",
            "PasswordLastUsed": "2019-05-20T04:41:00+00:00"
        },
        {
            "Path": "/",
            "UserName": "test_user@example.net",
            "UserId": "AIDAI2XBHJCIYNLDQDOVO",
            "Arn": "arn:aws:iam::216054658829:user/test_user@example.net",
            "CreateDate": "2019-03-08T06:24:22+00:00",
            "PasswordLastUsed": "2019-05-20T02:16:57+00:00"
        },
        {
            "Path": "/",
            "UserName": "test_user_01@example.net",
            "UserId": "AIDAJSSAYHSZEQL7P3MGK",
            "Arn": "arn:aws:iam::216054658829:user/test_user_01@example.net",
            "CreateDate": "2018-10-23T07:33:21+00:00",
            "PasswordLastUsed": "2019-05-20T01:48:44+00:00"
        }
    ]

    DATA_LIST_ENTITIES_FOR_POLICY_IS_TRUNCATED_FALSE = {
        'PolicyGroups': [
            {
                'GroupName': 'PolicyGroups1',
                'GroupId': '62e87961-9f4c-4b8d-986a-693340f4b4ac1'
            }
        ],
        'PolicyUsers': [
            {
                'UserName': 'PolicyUsers1',
                'UserId': '62e87961-9f4c-4b8d-986a-693340f4b4ab1'
            }
        ],
        'PolicyRoles': [
            {
                'RoleName': 'PolicyRoles1',
                'RoleId': '62e87961-9f4c-4b8d-986a-693340f4b4aa1'
            }
        ],
        'IsTruncated': False
    }

    DATA_LIST_ENTITIES_FOR_POLICY_IS_TRUNCATED_TRUE1 = {
        'PolicyGroups': [
            {
                'GroupName': 'PolicyGroups2',
                'GroupId': '62e87961-9f4c-4b8d-986a-693340f4b4ac2'
            }
        ],
        'PolicyUsers': [
            {
                'UserName': 'PolicyUsers2',
                'UserId': '62e87961-9f4c-4b8d-986a-693340f4b4ab2'
            }
        ],
        'PolicyRoles': [
            {
                'RoleName': 'PolicyRoles2',
                'RoleId': '62e87961-9f4c-4b8d-986a-693340f4b4aa2'
            }
        ],
        'IsTruncated': True,
        'Marker': 1
    }

    DATA_LIST_ENTITIES_FOR_POLICY_IS_TRUNCATED_TRUE2 = {
        'PolicyGroups': [
            {
                'GroupName': 'PolicyGroups3',
                'GroupId': '62e87961-9f4c-4b8d-986a-693340f4b4ac3'
            }
        ],
        'PolicyUsers': [
            {
                'UserName': 'PolicyUsers3',
                'UserId': '62e87961-9f4c-4b8d-986a-693340f4b4ab3'
            }
        ],
        'PolicyRoles': [
            {
                'RoleName': 'PolicyRoles3',
                'RoleId': '62e87961-9f4c-4b8d-986a-693340f4b4aa3'
            }
        ],
        'IsTruncated': True,
        'Marker': 3
    }

    LIST_ENTITIES_FOR_POLICY_DATA = {
        'PolicyRoles': [
            {
                'RoleName': 'PolicyRoles2',
                'RoleId': '62e87961-9f4c-4b8d-986a-693340f4b4aa2'
            },
            {
                'RoleName': 'PolicyRoles3',
                'RoleId': '62e87961-9f4c-4b8d-986a-693340f4b4aa3'
            },
            {
                'RoleName': 'PolicyRoles1',
                'RoleId': '62e87961-9f4c-4b8d-986a-693340f4b4aa1'
            }
        ],
        'PolicyUsers': [
            {
                'UserName': 'PolicyUsers2',
                'UserId': '62e87961-9f4c-4b8d-986a-693340f4b4ab2'
            },
            {
                'UserName': 'PolicyUsers3',
                'UserId': '62e87961-9f4c-4b8d-986a-693340f4b4ab3'
            },
            {
                'UserName': 'PolicyUsers1',
                'UserId': '62e87961-9f4c-4b8d-986a-693340f4b4ab1'
            }
        ],
        'PolicyGroups': [
            {
                'GroupName': 'PolicyGroups2',
                'GroupId': '62e87961-9f4c-4b8d-986a-693340f4b4ac2'
            },
            {
                'GroupName': 'PolicyGroups3',
                'GroupId': '62e87961-9f4c-4b8d-986a-693340f4b4ac3'
            },
            {
                'GroupName': 'PolicyGroups1',
                'GroupId': '62e87961-9f4c-4b8d-986a-693340f4b4ac1'
            }
        ]
    }

    DATA_ATTACHED_USER_POLICIES_IS_TRUNCATED_TRUE1 = {
        'AttachedPolicies': [
            {
                'PolicyName': 'PolicyName1',
                'PolicyArn': 'PolicyArn1'
            },
            {
                'PolicyName': 'PolicyName2',
                'PolicyArn': 'PolicyArn2'
            }
        ],
        'IsTruncated': True,
        'Marker': 1
    }

    DATA_ATTACHED_USER_POLICIES_IS_TRUNCATED_TRUE2 = {
        'AttachedPolicies': [
            {
                'PolicyName': 'PolicyName3',
                'PolicyArn': 'PolicyArn3'
            },
            {
                'PolicyName': 'PolicyName4',
                'PolicyArn': 'PolicyArn4'
            }
        ],
        'IsTruncated': True,
        'Marker': 3
    }

    DATA_ATTACHED_USER_POLICIES_IS_TRUNCATED_FALSE = {
        'AttachedPolicies': [
            {
                'PolicyName': 'PolicyName5',
                'PolicyArn': 'PolicyArn5'
            }
        ],
        'IsTruncated': False
    }

    LIST_ATTACHED_USER_POLICIES_DATA = [
        {
            'PolicyName': 'PolicyName1',
            'PolicyArn': 'PolicyArn1'
        },
        {
            'PolicyName': 'PolicyName2',
            'PolicyArn': 'PolicyArn2'
        },
        {
            'PolicyName': 'PolicyName3',
            'PolicyArn': 'PolicyArn3'
        },
        {
            'PolicyName': 'PolicyName4',
            'PolicyArn': 'PolicyArn4'
        },
        {
            'PolicyName': 'PolicyName5',
            'PolicyArn': 'PolicyArn5'
        }
    ]

    DATA_LIST_USER_POLICY_IS_TRUNCATED_FALSE = {
        'PolicyNames': ['PolicyNames5', 'PolicyNames6'],
        'IsTruncated': False
    }

    DATA_LIST_USER_POLICY_IS_TRUNCATED_TRUE1 = {
        'PolicyNames': ['PolicyNames1', 'PolicyNames2'],
        'IsTruncated': True,
        'Marker': 1
    }

    DATA_LIST_USER_POLICY_IS_TRUNCATED_TRUE2 = {
        'PolicyNames': ['PolicyNames3', 'PolicyNames4'],
        'IsTruncated': True,
        'Marker': 3
    }

    LIST_USER_POLICY_DATA = [
        'PolicyNames1', 'PolicyNames2', 'PolicyNames3', 'PolicyNames4',
        'PolicyNames5', 'PolicyNames6'
    ]

    DATA_LIST_POLICIES_IS_TRUNCATED_TRUE1 = {
        'Policies': [
            {
                "PolicyName": "insightwatch-190611-ContentProtectedReadOnlyPolicy-YDBNQDSP9W1M",
                "PolicyId": "ANPAS3RAAJPP6FJRR2AHV",
                "Arn": "arn:aws:iam::196561882079:policy/insightwatch-190611-ContentProtectedReadOnlyPolicy-YDBNQDSP9W1M",
                "Path": "/",
                "DefaultVersionId": "v1",
                "AttachmentCount": 1,
                "PermissionsBoundaryUsageCount": 0,
                "IsAttachable": True,
                "CreateDate": "2019-06-11T08:18:29+00:00",
                "UpdateDate": "2019-06-11T08:18:29+00:00"
            },
            {
                "PolicyName": "insightwatch-190611-ExplicitDenyActionPolicy-KY9W19YI8DKU",
                "PolicyId": "ANPAS3RAAJPP6XBPRYO54",
                "Arn": "arn:aws:iam::196561882079:policy/insightwatch-190611-ExplicitDenyActionPolicy-KY9W19YI8DKU",
                "Path": "/",
                "DefaultVersionId": "v1",
                "AttachmentCount": 1,
                "PermissionsBoundaryUsageCount": 0,
                "IsAttachable": True,
                "CreateDate": "2019-06-11T08:18:30+00:00",
                "UpdateDate": "2019-06-11T08:18:30+00:00"
            }
        ],
        'IsTruncated': True,
        'Marker': 1
    }

    DATA_LIST_POLICIES_IS_TRUNCATED_TRUE2 = {
        'Policies': [
            {
                "PolicyName": "insightwatch-ContentProtectedReadOnlyPolicy-8Q5H7JFJ3DJ2",
                "PolicyId": "ANPAS3RAAJPP573DO3X2U",
                "Arn": "arn:aws:iam::196561882079:policy/insightwatch-ContentProtectedReadOnlyPolicy-8Q5H7JFJ3DJ2",
                "Path": "/",
                "DefaultVersionId": "v1",
                "AttachmentCount": 1,
                "PermissionsBoundaryUsageCount": 0,
                "IsAttachable": True,
                "CreateDate": "2019-06-06T09:10:35+00:00",
                "UpdateDate": "2019-06-06T09:10:35+00:00"
            },
            {
                "PolicyName": "insightwatch-dev-190612-ContentProtectedReadOnlyPolicy-VFU70BF87DB4",
                "PolicyId": "ANPAS3RAAJPP5ICEV7QTT",
                "Arn": "arn:aws:iam::196561882079:policy/insightwatch-dev-190612-ContentProtectedReadOnlyPolicy-VFU70BF87DB4",
                "Path": "/",
                "DefaultVersionId": "v1",
                "AttachmentCount": 1,
                "PermissionsBoundaryUsageCount": 0,
                "IsAttachable": True,
                "CreateDate": "2019-06-12T03:01:20+00:00",
                "UpdateDate": "2019-06-12T03:01:20+00:00"
            }
        ],
        'IsTruncated': True,
        'Marker': 3
    }

    DATA_LIST_POLICIES_IS_TRUNCATED_FALSE = {
        'Policies': [
            {
                "PolicyName": "insightwatch-dev-190612-ExplicitDenyActionPolicy-S6CD3J9OV30M",
                "PolicyId": "ANPAS3RAAJPP4KL5OZLDI",
                "Arn": "arn:aws:iam::196561882079:policy/insightwatch-dev-190612-ExplicitDenyActionPolicy-S6CD3J9OV30M",
                "Path": "/",
                "DefaultVersionId": "v1",
                "AttachmentCount": 1,
                "PermissionsBoundaryUsageCount": 0,
                "IsAttachable": True,
                "CreateDate": "2019-06-12T03:01:20+00:00",
                "UpdateDate": "2019-06-12T03:01:20+00:00"
            }
        ],
        'IsTruncated': False
    }

    LIST_POLICIES_DATA = [
        {
            "PolicyName": "insightwatch-190611-ContentProtectedReadOnlyPolicy-YDBNQDSP9W1M",
            "PolicyId": "ANPAS3RAAJPP6FJRR2AHV",
            "Arn": "arn:aws:iam::196561882079:policy/insightwatch-190611-ContentProtectedReadOnlyPolicy-YDBNQDSP9W1M",
            "Path": "/",
            "DefaultVersionId": "v1",
            "AttachmentCount": 1,
            "PermissionsBoundaryUsageCount": 0,
            "IsAttachable": True,
            "CreateDate": "2019-06-11T08:18:29+00:00",
            "UpdateDate": "2019-06-11T08:18:29+00:00"
        },
        {
            "PolicyName": "insightwatch-190611-ExplicitDenyActionPolicy-KY9W19YI8DKU",
            "PolicyId": "ANPAS3RAAJPP6XBPRYO54",
            "Arn": "arn:aws:iam::196561882079:policy/insightwatch-190611-ExplicitDenyActionPolicy-KY9W19YI8DKU",
            "Path": "/",
            "DefaultVersionId": "v1",
            "AttachmentCount": 1,
            "PermissionsBoundaryUsageCount": 0,
            "IsAttachable": True,
            "CreateDate": "2019-06-11T08:18:30+00:00",
            "UpdateDate": "2019-06-11T08:18:30+00:00"
        },
        {
            "PolicyName": "insightwatch-ContentProtectedReadOnlyPolicy-8Q5H7JFJ3DJ2",
            "PolicyId": "ANPAS3RAAJPP573DO3X2U",
            "Arn": "arn:aws:iam::196561882079:policy/insightwatch-ContentProtectedReadOnlyPolicy-8Q5H7JFJ3DJ2",
            "Path": "/",
            "DefaultVersionId": "v1",
            "AttachmentCount": 1,
            "PermissionsBoundaryUsageCount": 0,
            "IsAttachable": True,
            "CreateDate": "2019-06-06T09:10:35+00:00",
            "UpdateDate": "2019-06-06T09:10:35+00:00"
        },
        {
            "PolicyName": "insightwatch-dev-190612-ContentProtectedReadOnlyPolicy-VFU70BF87DB4",
            "PolicyId": "ANPAS3RAAJPP5ICEV7QTT",
            "Arn": "arn:aws:iam::196561882079:policy/insightwatch-dev-190612-ContentProtectedReadOnlyPolicy-VFU70BF87DB4",
            "Path": "/",
            "DefaultVersionId": "v1",
            "AttachmentCount": 1,
            "PermissionsBoundaryUsageCount": 0,
            "IsAttachable": True,
            "CreateDate": "2019-06-12T03:01:20+00:00",
            "UpdateDate": "2019-06-12T03:01:20+00:00"
        },
        {
            "PolicyName": "insightwatch-dev-190612-ExplicitDenyActionPolicy-S6CD3J9OV30M",
            "PolicyId": "ANPAS3RAAJPP4KL5OZLDI",
            "Arn": "arn:aws:iam::196561882079:policy/insightwatch-dev-190612-ExplicitDenyActionPolicy-S6CD3J9OV30M",
            "Path": "/",
            "DefaultVersionId": "v1",
            "AttachmentCount": 1,
            "PermissionsBoundaryUsageCount": 0,
            "IsAttachable": True,
            "CreateDate": "2019-06-12T03:01:20+00:00",
            "UpdateDate": "2019-06-12T03:01:20+00:00"
        }
    ]

    DATA_POLICIES_VERSION = {
        'PolicyVersion': {
            'Document': {
                "Version":
                "2012-10-17",
                "Statement": [{
                    "Effect": "Allow",
                    "Action": "*",
                    "Resource": "*"
                }]
            },
            'IsDefaultVersion': True,
            'VersionId': 'v1',
            'CreateDate': '2014-09-15T20:31:47Z'
        }
    }

    DATA_LIST_ENTITIES_FOR_POLICY_IS_TRUNCATED_FALSE = {
        'PolicyGroups': [
            {
                'GroupName': 'PolicyGroups1',
                'GroupId': '62e87961-9f4c-4b8d-986a-693340f4b4ac1'
            }
        ],
        'PolicyUsers': [
            {
                'UserName': 'PolicyUsers1',
                'UserId': '62e87961-9f4c-4b8d-986a-693340f4b4ab1'
            }
        ],
        'PolicyRoles': [
            {
                'RoleName': 'PolicyRoles1',
                'RoleId': '62e87961-9f4c-4b8d-986a-693340f4b4aa1'
            }
        ],
        'IsTruncated': False
    }

    DATA_LIST_ENTITIES_FOR_POLICY_IS_TRUNCATED_TRUE1 = {
        'PolicyGroups': [
            {
                'GroupName': 'PolicyGroups2',
                'GroupId': '62e87961-9f4c-4b8d-986a-693340f4b4ac2'
            }
        ],
        'PolicyUsers': [
            {
                'UserName': 'PolicyUsers2',
                'UserId': '62e87961-9f4c-4b8d-986a-693340f4b4ab2'
            }
        ],
        'PolicyRoles': [
            {
                'RoleName': 'PolicyRoles2',
                'RoleId': '62e87961-9f4c-4b8d-986a-693340f4b4aa2'
            }
        ],
        'IsTruncated': True,
        'Marker': 1
    }

    DATA_LIST_ENTITIES_FOR_POLICY_IS_TRUNCATED_TRUE2 = {
        'PolicyGroups': [
            {
                'GroupName': 'PolicyGroups3',
                'GroupId': '62e87961-9f4c-4b8d-986a-693340f4b4ac3'
            }
        ],
        'PolicyUsers': [
            {
                'UserName': 'PolicyUsers3',
                'UserId': '62e87961-9f4c-4b8d-986a-693340f4b4ab3'
            }
        ],
        'PolicyRoles': [
            {
                'RoleName': 'PolicyRoles3',
                'RoleId': '62e87961-9f4c-4b8d-986a-693340f4b4aa3'
            }
        ],
        'IsTruncated': True,
        'Marker': 3
    }

    DATA_ACCOUNT_SUMMARY_EXISTS_ATTRIBUTE = {
        'SummaryMap': {
            'AccessKeysPerUserQuota': 2,
            'AccountAccessKeysPresent': 1,
            'AccountMFAEnabled': 0,
            'AccountSigningCertificatesPresent': 0,
            'AttachedPoliciesPerGroupQuota': 10,
            'AttachedPoliciesPerRoleQuota': 10,
            'AttachedPoliciesPerUserQuota': 10,
            'GroupPolicySizeQuota': 5120,
            'Groups': 15,
            'GroupsPerUserQuota': 10,
            'GroupsQuota': 100,
            'MFADevices': 6,
            'MFADevicesInUse': 3,
            'Policies': 8,
            'PoliciesQuota': 1000,
            'PolicySizeQuota': 5120,
            'PolicyVersionsInUse': 22,
            'PolicyVersionsInUseQuota': 10000,
            'ServerCertificates': 1,
            'ServerCertificatesQuota': 20,
            'SigningCertificatesPerUserQuota': 2,
            'UserPolicySizeQuota': 2048,
            'Users': 27,
            'UsersQuota': 5000,
            'VersionsPerPolicyQuota': 5,
        },
        'ResponseMetadata': {
            'RequestId': '85cb9b90-ac28-11e4-a88d-97964EXAMPLE'
        }
    }

    DATA_LIST_VIRTUAL_MFA_DEVICES_IS_TRUNCATED_TRUE1 = {
        'VirtualMFADevices': [
            {
                'SerialNumber': 'arn:aws:iam::123456789012:mfa/MFAdeviceName1'
            }
        ],
        'IsTruncated': True,
        'Marker': 1
    }

    DATA_LIST_VIRTUAL_MFA_DEVICES_IS_TRUNCATED_TRUE2 = {
        'VirtualMFADevices': [
            {
                'SerialNumber': 'arn:aws:iam::123456789012:mfa/RootMFAdeviceName'
            }
        ],
        'IsTruncated': True,
        'Marker': 3
    }

    DATA_LIST_VIRTUAL_MFA_DEVICES_IS_TRUNCATED_FALSE = {
        'VirtualMFADevices': [
            {
                'SerialNumber': 'arn:aws:iam::123456789012:mfa/MFAdeviceName2'
            }
        ],
        'IsTruncated': False
    }

    LIST_VIRTUAL_MFA_DEVICES_DATA = [
        {
            'SerialNumber': 'arn:aws:iam::123456789012:mfa/MFAdeviceName1'
        },
        {
            'SerialNumber': 'arn:aws:iam::123456789012:mfa/RootMFAdeviceName'
        },
        {
            'SerialNumber': 'arn:aws:iam::123456789012:mfa/MFAdeviceName2'
        },
    ]

    DATA_ROLE = {
        'GetRoleResult': [{
            'Path': '/application_abc/component_xyz/',
            'Arn': 'arn:aws:iam::123456789012:role/application_abc/component_xyz/S3Access',
            'RoleName': 'S3Access',
            'AssumeRolePolicyDocument': {
                "Version":
                "2012-10-17",
                "Statement": [{
                    "Effect": "Allow",
                    "Principal": {
                        "Service": ["ec2.amazonaws.com"]
                    },
                    "Action": ["sts:AssumeRole"]
                }]
            },
            'CreateDate': '2012-05-08T23:34:01Z',
            'RoleId': 'AROADBQP57FF2AEXAMPLE'
        }]
    }
