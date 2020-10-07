import copy
from tests.mock.data.aws.data_common import DataCommon


class DataTestEC2():
    REGION_NAME = copy.deepcopy(DataCommon.REGION_EU_NORTH_1)
    FILTER_DESCRIBE_REGIONS = [{
        "Name": "opt-in-status",
        "Values": ["opt-in-not-required", "opted-in"]
    }]
    LIST_REGIONS = [
        {
            'Endpoint': 'ec2.eu-north-1.amazonaws.com',
            'RegionName': REGION_NAME,
        }
    ]

    DESCRIBE_VPCS = [
        {
            'CidrBlock': 'string',
            'DhcpOptionsId': 'string',
            'State': 'pending',
            'VpcId': 'is_excluded_resources',
            'OwnerId': 'string',
            'InstanceTenancy': 'default',
            'Ipv6CidrBlockAssociationSet': [
                {
                    'AssociationId': 'string',
                    'Ipv6CidrBlock': 'string',
                    'Ipv6CidrBlockState': {
                        'State': 'associating',
                        'StatusMessage': 'string'
                    }
                },
            ],
            'CidrBlockAssociationSet': [
                {
                    'AssociationId': 'string',
                    'CidrBlock': 'string',
                    'CidrBlockState': {
                        'State': 'associating',
                        'StatusMessage': 'string'
                    }
                },
            ],
            'IsDefault': False,
            'Tags': [
                {
                    'Key': 'string',
                    'Value': 'string'
                },
            ]
        },
        {
            'CidrBlock': 'string',
            'DhcpOptionsId': 'string',
            'State': 'pending',
            'VpcId': 'not_excluded_resources',
            'OwnerId': 'string',
            'InstanceTenancy': 'default',
            'Ipv6CidrBlockAssociationSet': [
                {
                    'AssociationId': 'string',
                    'Ipv6CidrBlock': 'string',
                    'Ipv6CidrBlockState': {
                        'State': 'associating',
                        'StatusMessage': 'string'
                    }
                },
            ],
            'CidrBlockAssociationSet': [
                {
                    'AssociationId': 'string',
                    'CidrBlock': 'string',
                    'CidrBlockState': {
                        'State': 'associating',
                        'StatusMessage': 'string'
                    }
                },
            ],
            'IsDefault': False,
            'Tags': [
                {
                    'Key': 'string',
                    'Value': 'string'
                },
            ]
        }
    ]

    DESCRIBE_FLOW_LOGS = [
        {
            'CreationTime': '2019-06-06',
            'DeliverLogsErrorMessage': 'string',
            'DeliverLogsPermissionArn': 'string',
            'DeliverLogsStatus': 'string',
            'FlowLogId': 'string',
            'FlowLogStatus': 'string',
            'LogGroupName': 'string',
            'ResourceId': 'string',
            'TrafficType': 'ACCEPT',
            'LogDestinationType': 'cloud-watch-logs',
            'LogDestination': 'string'
        },
        {
            'CreationTime': '2019-06-06',
            'DeliverLogsErrorMessage': 'string',
            'DeliverLogsPermissionArn': 'string',
            'DeliverLogsStatus': 'string',
            'FlowLogId': 'string',
            'FlowLogStatus': 'string',
            'LogGroupName': 'string',
            'ResourceId': 'string',
            'TrafficType': 'ACCEPT',
            'LogDestinationType': 'cloud-watch-logs',
            'LogDestination': 'string'
        }
    ]

    ID_GROUP_EXCLUDED_RESOURCES_RESOURCE_NG = 'id_group_excluded_resources_resource_ng'
    ID_GROUP_NOT_EXCLUDED_RESOURCES = 'not_excluded_resources'

    SECURITY_GROUPS = [
        {
            'Description': 'string',
            'GroupName': 'default',
            'IpPermissions': [
                {
                    'FromPort': 0,
                    'IpProtocol': 'tcp',
                    'IpRanges': [
                        {
                            'CidrIp': '0.0.0.0/0',
                            'Description': 'string'
                        },
                    ],
                    'Ipv6Ranges': [
                        {
                            'CidrIpv6': 'string',
                            'Description': 'string'
                        },
                    ],
                    'PrefixListIds': [
                        {
                            'Description': 'string',
                            'PrefixListId': 'string'
                        },
                    ],
                    'ToPort': 65535,
                    'UserIdGroupPairs': [
                        {
                            'Description': 'string',
                            'GroupId': ID_GROUP_EXCLUDED_RESOURCES_RESOURCE_NG,
                            'GroupName': 'default',
                            'PeeringStatus': 'string',
                            'UserId': 'string',
                            'VpcId': 'string',
                            'VpcPeeringConnectionId': 'string'
                        },
                    ]
                },
            ],
            'OwnerId': 'string',
            'GroupId': ID_GROUP_EXCLUDED_RESOURCES_RESOURCE_NG,
            'IpPermissionsEgress': [
                {
                    'FromPort': 0,
                    'IpProtocol': 'tcp',
                    'IpRanges': [
                        {
                            'CidrIp': '0.0.0.0/0',
                            'Description': 'string'
                        },
                    ],
                    'Ipv6Ranges': [
                        {
                            'CidrIpv6': 'string',
                            'Description': 'string'
                        },
                    ],
                    'PrefixListIds': [
                        {
                            'Description': 'string',
                            'PrefixListId': 'string'
                        },
                    ],
                    'ToPort': 65535,
                    'UserIdGroupPairs': [
                        {
                            'Description': 'string',
                            'GroupId': ID_GROUP_EXCLUDED_RESOURCES_RESOURCE_NG,
                            'GroupName': 'default',
                            'PeeringStatus': 'string',
                            'UserId': 'string',
                            'VpcId': 'string',
                            'VpcPeeringConnectionId': 'string'
                        },
                    ]
                },
            ],
            'Tags': [
                {
                    'Key': 'string',
                    'Value': 'string'
                },
            ],
            'VpcId': 'string'
        },
        {
            'Description': 'string',
            'GroupName': 'default',
            'IpPermissions': [
                {
                    'FromPort': 0,
                    'IpProtocol': 'tcp',
                    'IpRanges': [
                        {
                            'CidrIp': '0.0.0.0/0',
                            'Description': 'string'
                        },
                    ],
                    'Ipv6Ranges': [
                        {
                            'CidrIpv6': 'string',
                            'Description': 'string'
                        },
                    ],
                    'PrefixListIds': [
                        {
                            'Description': 'string',
                            'PrefixListId': 'string'
                        },
                    ],
                    'ToPort': 65535,
                    'UserIdGroupPairs': [
                        {
                            'Description': 'string',
                            'GroupId': ID_GROUP_NOT_EXCLUDED_RESOURCES,
                            'GroupName': 'default',
                            'PeeringStatus': 'string',
                            'UserId': 'string',
                            'VpcId': 'string',
                            'VpcPeeringConnectionId': 'string'
                        },
                    ]
                },
            ],
            'OwnerId': 'string',
            'GroupId': ID_GROUP_NOT_EXCLUDED_RESOURCES,
            'IpPermissionsEgress': [
                {
                    'FromPort': 0,
                    'IpProtocol': 'tcp',
                    'IpRanges': [
                        {
                            'CidrIp': '0.0.0.0/0',
                            'Description': 'string'
                        },
                    ],
                    'Ipv6Ranges': [
                        {
                            'CidrIpv6': 'string',
                            'Description': 'string'
                        },
                    ],
                    'PrefixListIds': [
                        {
                            'Description': 'string',
                            'PrefixListId': 'string'
                        },
                    ],
                    'ToPort': 65535,
                    'UserIdGroupPairs': [
                        {
                            'Description': 'string',
                            'GroupId': ID_GROUP_NOT_EXCLUDED_RESOURCES,
                            'GroupName': 'default',
                            'PeeringStatus': 'string',
                            'UserId': 'string',
                            'VpcId': 'string',
                            'VpcPeeringConnectionId': 'string'
                        },
                    ]
                },
            ],
            'Tags': [
                {
                    'Key': 'string',
                    'Value': 'string'
                },
            ],
            'VpcId': 'string'
        }
    ]

    DATA_TEST_DESCRIBE_INSTANCE = [
        {
            'Groups': [
                {
                    'GroupName': 'string',
                    'GroupId': 'string'
                },
            ],
            'Instances': [
                {
                    'AmiLaunchIndex': 123,
                    'ImageId': 'string',
                    'InstanceId': '<root_account>',
                    'InstanceType': 't1.micro',
                    'KernelId': 'string',
                    'KeyName': 'string',
                    'LaunchTime': '2019-06-06',
                    'Monitoring': {
                        'State': 'disabled'
                    },
                    'Placement': {
                        'AvailabilityZone': 'string',
                        'Affinity': 'string',
                        'GroupName': 'string',
                        'PartitionNumber': 123,
                        'HostId': 'string',
                        'Tenancy': 'default',
                        'SpreadDomain': 'string'
                    },
                    'Platform': 'Windows',
                    'PrivateDnsName': 'string',
                    'PrivateIpAddress': 'string',
                    'ProductCodes': [
                        {
                            'ProductCodeId': 'string',
                            'ProductCodeType': 'devpay'
                        },
                    ],
                    'PublicDnsName': 'string',
                    'PublicIpAddress': 'string',
                    'RamdiskId': 'string',
                    'State': {
                        'Code': 123,
                        'Name': 'pending'
                    },
                    'StateTransitionReason': 'string',
                    'SubnetId': 'string',
                    'VpcId': 'string',
                    'Architecture': 'i386',
                    'BlockDeviceMappings': [
                        {
                            'DeviceName': 'string',
                            'Ebs': {
                                'AttachTime': '',
                                'DeleteOnTermination': True,
                                'Status': 'attaching',
                                'VolumeId': 'string'
                            }
                        },
                    ],
                    'ClientToken': 'string',
                    'EbsOptimized': True,
                    'EnaSupport': True,
                    'Hypervisor': 'ovm',
                    'InstanceLifecycle': 'spot',
                    'ElasticGpuAssociations': [
                        {
                            'ElasticGpuId': 'string',
                            'ElasticGpuAssociationId': 'string',
                            'ElasticGpuAssociationState': 'string',
                            'ElasticGpuAssociationTime': 'string'
                        },
                    ],
                    'ElasticInferenceAcceleratorAssociations': [
                        {
                            'ElasticInferenceAcceleratorArn': 'string',
                            'ElasticInferenceAcceleratorAssociationId': 'string',
                            'ElasticInferenceAcceleratorAssociationState': 'string',
                            'ElasticInferenceAcceleratorAssociationTime': 'datetime(2015, 1, 1)'
                        },
                    ],
                    'NetworkInterfaces': [
                        {
                            'Association': {
                                'IpOwnerId': 'string',
                                'PublicDnsName': 'string',
                                'PublicIp': 'string'
                            },
                            'Attachment': {
                                'AttachTime': '',
                                'AttachmentId': 'string',
                                'DeleteOnTermination': True,
                                'DeviceIndex': 123,
                                'Status': 'attaching'
                            },
                            'Description': 'string',
                            'Groups': [
                                {
                                    'GroupName': 'string',
                                    'GroupId': 'string'
                                },
                            ],
                            'Ipv6Addresses': [
                                {
                                    'Ipv6Address': 'string'
                                },
                            ],
                            'MacAddress': 'string',
                            'NetworkInterfaceId': 'string',
                            'OwnerId': 'string',
                            'PrivateDnsName': 'string',
                            'PrivateIpAddress': 'string',
                            'PrivateIpAddresses': [
                                {
                                    'Association': {
                                        'IpOwnerId': 'string',
                                        'PublicDnsName': 'string',
                                        'PublicIp': 'string'
                                    },
                                    'Primary': True,
                                    'PrivateDnsName': 'string',
                                    'PrivateIpAddress': 'string'
                                },
                            ],
                            'SourceDestCheck': True,
                            'Status': 'available',
                            'SubnetId': 'string',
                            'VpcId': 'string',
                            'InterfaceType': 'string'
                        },
                    ],
                    'RootDeviceName': 'string',
                    'RootDeviceType': 'ebs',
                    'SecurityGroups': [
                        {
                            'GroupName': 'string',
                            'GroupId': 'string'
                        },
                    ],
                    'SourceDestCheck': True,
                    'SpotInstanceRequestId': 'string',
                    'SriovNetSupport': 'string',
                    'StateReason': {
                        'Code': 'string',
                        'Message': 'string'
                    },
                    'Tags': [
                        {
                            'Key': 'string',
                            'Value': 'string'
                        },
                    ],
                    'VirtualizationType': 'hvm',
                    'CpuOptions': {
                        'CoreCount': 123,
                        'ThreadsPerCore': 123
                    },
                    'CapacityReservationId': 'string',
                    'CapacityReservationSpecification': {
                        'CapacityReservationPreference': 'open',
                        'CapacityReservationTarget': {
                            'CapacityReservationId': 'string'
                        }
                    },
                    'HibernationOptions': {
                        'Configured': True
                    },
                    'Licenses': [
                        {
                            'LicenseConfigurationArn': 'string'
                        },
                    ]
                },
            ],
            'OwnerId': 'string',
            'RequesterId': 'string',
            'ReservationId': 'string'
        },
        {
            'Groups': [
                {
                    'GroupName': 'string',
                    'GroupId': 'string'
                },
            ],
            'Instances': [
                {
                    'AmiLaunchIndex': 123,
                    'ImageId': 'string',
                    'InstanceId': 'string',
                    'InstanceType': 't1.micro',
                    'KernelId': 'string',
                    'KeyName': 'string',
                    'LaunchTime': '2019-06-06',
                    'Monitoring': {
                        'State': 'disabled'
                    },
                    'Placement': {
                        'AvailabilityZone': 'string',
                        'Affinity': 'string',
                        'GroupName': 'string',
                        'PartitionNumber': 123,
                        'HostId': 'string',
                        'Tenancy': 'default',
                        'SpreadDomain': 'string'
                    },
                    'Platform': 'Windows',
                    'PrivateDnsName': 'string',
                    'PrivateIpAddress': 'string',
                    'ProductCodes': [
                        {
                            'ProductCodeId': 'string',
                            'ProductCodeType': 'devpay'
                        },
                    ],
                    'PublicDnsName': 'string',
                    'PublicIpAddress': 'string',
                    'RamdiskId': 'string',
                    'State': {
                        'Code': 123,
                        'Name': 'pending'
                    },
                    'StateTransitionReason': 'string',
                    'SubnetId': 'string',
                    'VpcId': 'string',
                    'Architecture': 'i386',
                    'BlockDeviceMappings': [
                        {
                            'DeviceName': 'string',
                            'Ebs': {
                                'AttachTime': '',
                                'DeleteOnTermination': True,
                                'Status': 'attaching',
                                'VolumeId': 'string'
                            }
                        },
                    ],
                    'ClientToken': 'string',
                    'EbsOptimized': True,
                    'EnaSupport': True,
                    'Hypervisor': 'ovm',
                    'InstanceLifecycle': 'spot',
                    'ElasticGpuAssociations': [
                        {
                            'ElasticGpuId': 'string',
                            'ElasticGpuAssociationId': 'string',
                            'ElasticGpuAssociationState': 'string',
                            'ElasticGpuAssociationTime': 'string'
                        },
                    ],
                    'ElasticInferenceAcceleratorAssociations': [
                        {
                            'ElasticInferenceAcceleratorArn': 'string',
                            'ElasticInferenceAcceleratorAssociationId': 'string',
                            'ElasticInferenceAcceleratorAssociationState': 'string',
                            'ElasticInferenceAcceleratorAssociationTime': 'datetime(2015, 1, 1)'
                        },
                    ],
                    'NetworkInterfaces': [
                        {
                            'Association': {
                                'IpOwnerId': 'string',
                                'PublicDnsName': 'string',
                                'PublicIp': 'string'
                            },
                            'Attachment': {
                                'AttachTime': '',
                                'AttachmentId': 'string',
                                'DeleteOnTermination': True,
                                'DeviceIndex': 123,
                                'Status': 'attaching'
                            },
                            'Description': 'string',
                            'Groups': [
                                {
                                    'GroupName': 'string',
                                    'GroupId': 'string'
                                },
                            ],
                            'Ipv6Addresses': [
                                {
                                    'Ipv6Address': 'string'
                                },
                            ],
                            'MacAddress': 'string',
                            'NetworkInterfaceId': 'string',
                            'OwnerId': 'string',
                            'PrivateDnsName': 'string',
                            'PrivateIpAddress': 'string',
                            'PrivateIpAddresses': [
                                {
                                    'Association': {
                                        'IpOwnerId': 'string',
                                        'PublicDnsName': 'string',
                                        'PublicIp': 'string'
                                    },
                                    'Primary': True,
                                    'PrivateDnsName': 'string',
                                    'PrivateIpAddress': 'string'
                                },
                            ],
                            'SourceDestCheck': True,
                            'Status': 'available',
                            'SubnetId': 'string',
                            'VpcId': 'string',
                            'InterfaceType': 'string'
                        },
                    ],
                    'RootDeviceName': 'string',
                    'RootDeviceType': 'ebs',
                    'SecurityGroups': [
                        {
                            'GroupName': 'string',
                            'GroupId': 'string'
                        },
                    ],
                    'SourceDestCheck': True,
                    'SpotInstanceRequestId': 'string',
                    'SriovNetSupport': 'string',
                    'StateReason': {
                        'Code': 'string',
                        'Message': 'string'
                    },
                    'Tags': [
                        {
                            'Key': 'string',
                            'Value': 'string'
                        },
                    ],
                    'VirtualizationType': 'hvm',
                    'CpuOptions': {
                        'CoreCount': 123,
                        'ThreadsPerCore': 123
                    },
                    'CapacityReservationId': 'string',
                    'CapacityReservationSpecification': {
                        'CapacityReservationPreference': 'open',
                        'CapacityReservationTarget': {
                            'CapacityReservationId': 'string'
                        }
                    },
                    'HibernationOptions': {
                        'Configured': True
                    },
                    'Licenses': [
                        {
                            'LicenseConfigurationArn': 'string'
                        },
                    ]
                },
            ],
            'OwnerId': 'string',
            'RequesterId': 'string',
            'ReservationId': 'string'
        }
    ]

    VOLUMS_TEST = {
            "AvailabilityZone": REGION_NAME,
            "Encrypted": False,
            "Size": 40,
            "TagSpecifications": [{
                'ResourceType': 'volume',
                'Tags': [{
                    'Key': 'TEST_TAG',
                    'Value': 'TEST_VALUE'
                }],
            }]
        }

    DATA_TEST_DESCRIBE_INSTANCES_NOT_EXIST_NEXT_TOKEN = {
        'Reservations': [
            {
                'Groups': [
                    {
                        'GroupName': 'string',
                        'GroupId': 'string'
                    },
                ],
                'Instances': [
                    {
                        'AmiLaunchIndex': 123,
                        'ImageId': 'ImageId_not_exist_token',
                        'InstanceId': 'string',
                        'InstanceType': 't1.micro',
                        'KernelId': 'string',
                        'KeyName': 'string',
                        'LaunchTime': '2019-06-06',
                        'Monitoring': {
                            'State': 'disabled'
                        },
                        'Placement': {
                            'AvailabilityZone': 'string',
                            'Affinity': 'string',
                            'GroupName': 'string',
                            'PartitionNumber': 123,
                            'HostId': 'string',
                            'Tenancy': 'default',
                            'SpreadDomain': 'string'
                        },
                        'Platform': 'Windows',
                        'PrivateDnsName': 'string',
                        'PrivateIpAddress': 'string',
                        'ProductCodes': [
                            {
                                'ProductCodeId': 'string',
                                'ProductCodeType': 'devpay'
                            },
                        ],
                        'PublicDnsName': 'string',
                        'PublicIpAddress': 'string',
                        'RamdiskId': 'string',
                        'State': {
                            'Code': 123,
                            'Name': 'pending'
                        },
                        'StateTransitionReason': 'string',
                        'SubnetId': 'string',
                        'VpcId': 'string',
                        'Architecture': 'i386',
                        'BlockDeviceMappings': [
                            {
                                'DeviceName': 'string',
                                'Ebs': {
                                    'AttachTime': '2019-06-06',
                                    'DeleteOnTermination': True,
                                    'Status': 'attaching',
                                    'VolumeId': 'string'
                                }
                            },
                        ],
                        'ClientToken': 'string',
                        'EbsOptimized': True,
                        'EnaSupport': True,
                        'Hypervisor': 'ovm',
                        'IamInstanceProfile': {
                            'Arn': 'string',
                            'Id': 'string'
                        },
                        'InstanceLifecycle': 'spot',
                        'ElasticGpuAssociations': [
                            {
                                'ElasticGpuId': 'string',
                                'ElasticGpuAssociationId': 'string',
                                'ElasticGpuAssociationState': 'string',
                                'ElasticGpuAssociationTime': 'string'
                            },
                        ],
                        'ElasticInferenceAcceleratorAssociations': [
                            {
                                'ElasticInferenceAcceleratorArn': 'string',
                                'ElasticInferenceAcceleratorAssociationId': 'string',
                                'ElasticInferenceAcceleratorAssociationState': 'string',
                                'ElasticInferenceAcceleratorAssociationTime': '2019-06-06'
                            },
                        ],
                        'NetworkInterfaces': [
                            {
                                'Association': {
                                    'IpOwnerId': 'string',
                                    'PublicDnsName': 'string',
                                    'PublicIp': 'string'
                                },
                                'Attachment': {
                                    'AttachTime': '2019-06-06',
                                    'AttachmentId': 'string',
                                    'DeleteOnTermination': True,
                                    'DeviceIndex': 123,
                                    'Status': 'attaching'
                                },
                                'Description': 'string',
                                'Groups': [
                                    {
                                        'GroupName': 'string',
                                        'GroupId': 'string'
                                    },
                                ],
                                'Ipv6Addresses': [
                                    {
                                        'Ipv6Address': 'string'
                                    },
                                ],
                                'MacAddress': 'string',
                                'NetworkInterfaceId': 'string',
                                'OwnerId': 'string',
                                'PrivateDnsName': 'string',
                                'PrivateIpAddress': 'string',
                                'PrivateIpAddresses': [
                                    {
                                        'Association': {
                                            'IpOwnerId': 'string',
                                            'PublicDnsName': 'string',
                                            'PublicIp': 'string'
                                        },
                                        'Primary': True,
                                        'PrivateDnsName': 'string',
                                        'PrivateIpAddress': 'string'
                                    },
                                ],
                                'SourceDestCheck':
                                True,
                                'Status': 'available',
                                'SubnetId': 'string',
                                'VpcId': 'string',
                                'InterfaceType': 'string'
                            },
                        ],
                        'RootDeviceName': 'string',
                        'RootDeviceType': 'ebs',
                        'SecurityGroups': [
                            {
                                'GroupName': 'string',
                                'GroupId': 'string'
                            },
                        ],
                        'SourceDestCheck': True,
                        'SpotInstanceRequestId': 'string',
                        'SriovNetSupport': 'string',
                        'StateReason': {
                            'Code': 'string',
                            'Message': 'string'
                        },
                        'Tags': [
                            {
                                'Key': 'string',
                                'Value': 'string'
                            },
                        ],
                        'VirtualizationType': 'hvm',
                        'CpuOptions': {
                            'CoreCount': 123,
                            'ThreadsPerCore': 123
                        },
                        'CapacityReservationId': 'string',
                        'CapacityReservationSpecification': {
                            'CapacityReservationPreference': 'open',
                            'CapacityReservationTarget': {
                                'CapacityReservationId': 'string'
                            }
                        },
                        'HibernationOptions': {
                            'Configured': True
                        },
                        'Licenses': [
                            {
                                'LicenseConfigurationArn': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'RequesterId': 'string',
                'ReservationId': 'string'
            },
        ]
    }

    DATA_CHECK_ALL_DESCRIBE_INSTANCES = {
        'Reservations': [
            {
                'Groups': [
                    {
                        'GroupName': 'string',
                        'GroupId': 'string'
                    },
                ],
                'Instances': [
                    {
                        'AmiLaunchIndex': 123,
                        'ImageId': 'ImageId_exist_next_token',
                        'InstanceId': 'string',
                        'InstanceType': 't1.micro',
                        'KernelId': 'string',
                        'KeyName': 'string',
                        'LaunchTime': '2019-06-06',
                        'Monitoring': {
                            'State': 'disabled'
                        },
                        'Placement': {
                            'AvailabilityZone': 'string',
                            'Affinity': 'string',
                            'GroupName': 'string',
                            'PartitionNumber': 123,
                            'HostId': 'string',
                            'Tenancy': 'default',
                            'SpreadDomain': 'string'
                        },
                        'Platform': 'Windows',
                        'PrivateDnsName': 'string',
                        'PrivateIpAddress': 'string',
                        'ProductCodes': [
                            {
                                'ProductCodeId': 'string',
                                'ProductCodeType': 'devpay'
                            },
                        ],
                        'PublicDnsName': 'string',
                        'PublicIpAddress': 'string',
                        'RamdiskId': 'string',
                        'State': {
                            'Code': 123,
                            'Name': 'pending'
                        },
                        'StateTransitionReason': 'string',
                        'SubnetId': 'string',
                        'VpcId': 'string',
                        'Architecture': 'i386',
                        'BlockDeviceMappings': [
                            {
                                'DeviceName': 'string',
                                'Ebs': {
                                    'AttachTime': '2019-06-06',
                                    'DeleteOnTermination': True,
                                    'Status': 'attaching',
                                    'VolumeId': 'string'
                                }
                            },
                        ],
                        'ClientToken': 'string',
                        'EbsOptimized': True,
                        'EnaSupport': True,
                        'Hypervisor': 'ovm',
                        'IamInstanceProfile': {
                            'Arn': 'string',
                            'Id': 'string'
                        },
                        'InstanceLifecycle': 'spot',
                        'ElasticGpuAssociations': [
                            {
                                'ElasticGpuId': 'string',
                                'ElasticGpuAssociationId': 'string',
                                'ElasticGpuAssociationState': 'string',
                                'ElasticGpuAssociationTime': 'string'
                            },
                        ],
                        'ElasticInferenceAcceleratorAssociations': [
                            {
                                'ElasticInferenceAcceleratorArn': 'string',
                                'ElasticInferenceAcceleratorAssociationId': 'string',
                                'ElasticInferenceAcceleratorAssociationState': 'string',
                                'ElasticInferenceAcceleratorAssociationTime': '2019-06-06'
                            },
                        ],
                        'NetworkInterfaces': [
                            {
                                'Association': {
                                    'IpOwnerId': 'string',
                                    'PublicDnsName': 'string',
                                    'PublicIp': 'string'
                                },
                                'Attachment': {
                                    'AttachTime': '2019-06-06',
                                    'AttachmentId': 'string',
                                    'DeleteOnTermination': True,
                                    'DeviceIndex': 123,
                                    'Status': 'attaching'
                                },
                                'Description': 'string',
                                'Groups': [
                                    {
                                        'GroupName': 'string',
                                        'GroupId': 'string'
                                    },
                                ],
                                'Ipv6Addresses': [
                                    {
                                        'Ipv6Address': 'string'
                                    },
                                ],
                                'MacAddress': 'string',
                                'NetworkInterfaceId': 'string',
                                'OwnerId': 'string',
                                'PrivateDnsName': 'string',
                                'PrivateIpAddress': 'string',
                                'PrivateIpAddresses': [
                                    {
                                        'Association': {
                                            'IpOwnerId': 'string',
                                            'PublicDnsName': 'string',
                                            'PublicIp': 'string'
                                        },
                                        'Primary': True,
                                        'PrivateDnsName': 'string',
                                        'PrivateIpAddress': 'string'
                                    },
                                ],
                                'SourceDestCheck':
                                True,
                                'Status': 'available',
                                'SubnetId': 'string',
                                'VpcId': 'string',
                                'InterfaceType': 'string'
                            },
                        ],
                        'RootDeviceName': 'string',
                        'RootDeviceType': 'ebs',
                        'SecurityGroups': [
                            {
                                'GroupName': 'string',
                                'GroupId': 'string'
                            },
                        ],
                        'SourceDestCheck': True,
                        'SpotInstanceRequestId': 'string',
                        'SriovNetSupport': 'string',
                        'StateReason': {
                            'Code': 'string',
                            'Message': 'string'
                        },
                        'Tags': [
                            {
                                'Key': 'string',
                                'Value': 'string'
                            },
                        ],
                        'VirtualizationType': 'hvm',
                        'CpuOptions': {
                            'CoreCount': 123,
                            'ThreadsPerCore': 123
                        },
                        'CapacityReservationId': 'string',
                        'CapacityReservationSpecification': {
                            'CapacityReservationPreference': 'open',
                            'CapacityReservationTarget': {
                                'CapacityReservationId': 'string'
                            }
                        },
                        'HibernationOptions': {
                            'Configured': True
                        },
                        'Licenses': [
                            {
                                'LicenseConfigurationArn': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'RequesterId': 'string',
                'ReservationId': 'string'
            }, {
                'Groups': [
                    {
                        'GroupName': 'string',
                        'GroupId': 'string'
                    },
                ],
                'Instances': [
                    {
                        'AmiLaunchIndex': 123,
                        'ImageId': 'ImageId_next_token_1',
                        'InstanceId': 'string',
                        'InstanceType': 't1.micro',
                        'KernelId': 'string',
                        'KeyName': 'string',
                        'LaunchTime': '2019-06-06',
                        'Monitoring': {
                            'State': 'disabled'
                        },
                        'Placement': {
                            'AvailabilityZone': 'string',
                            'Affinity': 'string',
                            'GroupName': 'string',
                            'PartitionNumber': 123,
                            'HostId': 'string',
                            'Tenancy': 'default',
                            'SpreadDomain': 'string'
                        },
                        'Platform': 'Windows',
                        'PrivateDnsName': 'string',
                        'PrivateIpAddress': 'string',
                        'ProductCodes': [
                            {
                                'ProductCodeId': 'string',
                                'ProductCodeType': 'devpay'
                            },
                        ],
                        'PublicDnsName': 'string',
                        'PublicIpAddress': 'string',
                        'RamdiskId': 'string',
                        'State': {
                            'Code': 123,
                            'Name': 'pending'
                        },
                        'StateTransitionReason': 'string',
                        'SubnetId': 'string',
                        'VpcId': 'string',
                        'Architecture': 'i386',
                        'BlockDeviceMappings': [
                            {
                                'DeviceName': 'string',
                                'Ebs': {
                                    'AttachTime': '2019-06-06',
                                    'DeleteOnTermination': True,
                                    'Status': 'attaching',
                                    'VolumeId': 'string'
                                }
                            },
                        ],
                        'ClientToken': 'string',
                        'EbsOptimized': True,
                        'EnaSupport': True,
                        'Hypervisor': 'ovm',
                        'IamInstanceProfile': {
                            'Arn': 'string',
                            'Id': 'string'
                        },
                        'InstanceLifecycle': 'spot',
                        'ElasticGpuAssociations': [
                            {
                                'ElasticGpuId': 'string',
                                'ElasticGpuAssociationId': 'string',
                                'ElasticGpuAssociationState': 'string',
                                'ElasticGpuAssociationTime': 'string'
                            },
                        ],
                        'ElasticInferenceAcceleratorAssociations': [
                            {
                                'ElasticInferenceAcceleratorArn': 'string',
                                'ElasticInferenceAcceleratorAssociationId': 'string',
                                'ElasticInferenceAcceleratorAssociationState': 'string',
                                'ElasticInferenceAcceleratorAssociationTime': '2019-06-06'
                            },
                        ],
                        'NetworkInterfaces': [
                            {
                                'Association': {
                                    'IpOwnerId': 'string',
                                    'PublicDnsName': 'string',
                                    'PublicIp': 'string'
                                },
                                'Attachment': {
                                    'AttachTime': '2019-06-06',
                                    'AttachmentId': 'string',
                                    'DeleteOnTermination': True,
                                    'DeviceIndex': 123,
                                    'Status': 'attaching'
                                },
                                'Description': 'string',
                                'Groups': [
                                    {
                                        'GroupName': 'string',
                                        'GroupId': 'string'
                                    },
                                ],
                                'Ipv6Addresses': [
                                    {
                                        'Ipv6Address': 'string'
                                    },
                                ],
                                'MacAddress': 'string',
                                'NetworkInterfaceId': 'string',
                                'OwnerId': 'string',
                                'PrivateDnsName': 'string',
                                'PrivateIpAddress': 'string',
                                'PrivateIpAddresses': [
                                    {
                                        'Association': {
                                            'IpOwnerId': 'string',
                                            'PublicDnsName': 'string',
                                            'PublicIp': 'string'
                                        },
                                        'Primary': True,
                                        'PrivateDnsName': 'string',
                                        'PrivateIpAddress': 'string'
                                    },
                                ],
                                'SourceDestCheck': True,
                                'Status': 'available',
                                'SubnetId': 'string',
                                'VpcId': 'string',
                                'InterfaceType': 'string'
                            },
                        ],
                        'RootDeviceName': 'string',
                        'RootDeviceType': 'ebs',
                        'SecurityGroups': [
                            {
                                'GroupName': 'string',
                                'GroupId': 'string'
                            },
                        ],
                        'SourceDestCheck': True,
                        'SpotInstanceRequestId': 'string',
                        'SriovNetSupport': 'string',
                        'StateReason': {
                            'Code': 'string',
                            'Message': 'string'
                        },
                        'Tags': [
                            {
                                'Key': 'string',
                                'Value': 'string'
                            },
                        ],
                        'VirtualizationType': 'hvm',
                        'CpuOptions': {
                            'CoreCount': 123,
                            'ThreadsPerCore': 123
                        },
                        'CapacityReservationId': 'string',
                        'CapacityReservationSpecification': {
                            'CapacityReservationPreference': 'open',
                            'CapacityReservationTarget': {
                                'CapacityReservationId': 'string'
                            }
                        },
                        'HibernationOptions': {
                            'Configured': True
                        },
                        'Licenses': [
                            {
                                'LicenseConfigurationArn': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'RequesterId': 'string',
                'ReservationId': 'string'
            }, {
                'Groups': [
                    {
                        'GroupName': 'string',
                        'GroupId': 'string'
                    },
                ],
                'Instances': [
                    {
                        'AmiLaunchIndex': 123,
                        'ImageId': 'ImageId_next_token_2',
                        'InstanceId': 'string',
                        'InstanceType': 't1.micro',
                        'KernelId': 'string',
                        'KeyName': 'string',
                        'LaunchTime': '2019-06-06',
                        'Monitoring': {
                            'State': 'disabled'
                        },
                        'Placement': {
                            'AvailabilityZone': 'string',
                            'Affinity': 'string',
                            'GroupName': 'string',
                            'PartitionNumber': 123,
                            'HostId': 'string',
                            'Tenancy': 'default',
                            'SpreadDomain': 'string'
                        },
                        'Platform': 'Windows',
                        'PrivateDnsName': 'string',
                        'PrivateIpAddress': 'string',
                        'ProductCodes': [
                            {
                                'ProductCodeId': 'string',
                                'ProductCodeType': 'devpay'
                            },
                        ],
                        'PublicDnsName': 'string',
                        'PublicIpAddress': 'string',
                        'RamdiskId': 'string',
                        'State': {
                            'Code': 123,
                            'Name': 'pending'
                        },
                        'StateTransitionReason': 'string',
                        'SubnetId': 'string',
                        'VpcId': 'string',
                        'Architecture': 'i386',
                        'BlockDeviceMappings': [
                            {
                                'DeviceName': 'string',
                                'Ebs': {
                                    'AttachTime': '2019-06-06',
                                    'DeleteOnTermination': True,
                                    'Status': 'attaching',
                                    'VolumeId': 'string'
                                }
                            },
                        ],
                        'ClientToken': 'string',
                        'EbsOptimized': True,
                        'EnaSupport': True,
                        'Hypervisor': 'ovm',
                        'IamInstanceProfile': {
                            'Arn': 'string',
                            'Id': 'string'
                        },
                        'InstanceLifecycle': 'spot',
                        'ElasticGpuAssociations': [
                            {
                                'ElasticGpuId': 'string',
                                'ElasticGpuAssociationId': 'string',
                                'ElasticGpuAssociationState': 'string',
                                'ElasticGpuAssociationTime': 'string'
                            },
                        ],
                        'ElasticInferenceAcceleratorAssociations': [
                            {
                                'ElasticInferenceAcceleratorArn': 'string',
                                'ElasticInferenceAcceleratorAssociationId': 'string',
                                'ElasticInferenceAcceleratorAssociationState': 'string',
                                'ElasticInferenceAcceleratorAssociationTime': '2019-06-06'
                            },
                        ],
                        'NetworkInterfaces': [
                            {
                                'Association': {
                                    'IpOwnerId': 'string',
                                    'PublicDnsName': 'string',
                                    'PublicIp': 'string'
                                },
                                'Attachment': {
                                    'AttachTime': '2019-06-06',
                                    'AttachmentId': 'string',
                                    'DeleteOnTermination': True,
                                    'DeviceIndex': 123,
                                    'Status': 'attaching'
                                },
                                'Description': 'string',
                                'Groups': [
                                    {
                                        'GroupName': 'string',
                                        'GroupId': 'string'
                                    },
                                ],
                                'Ipv6Addresses': [
                                    {
                                        'Ipv6Address': 'string'
                                    },
                                ],
                                'MacAddress': 'string',
                                'NetworkInterfaceId': 'string',
                                'OwnerId': 'string',
                                'PrivateDnsName': 'string',
                                'PrivateIpAddress': 'string',
                                'PrivateIpAddresses': [
                                    {
                                        'Association': {
                                            'IpOwnerId': 'string',
                                            'PublicDnsName': 'string',
                                            'PublicIp': 'string'
                                        },
                                        'Primary': True,
                                        'PrivateDnsName': 'string',
                                        'PrivateIpAddress': 'string'
                                    },
                                ],
                                'SourceDestCheck': True,
                                'Status': 'available',
                                'SubnetId': 'string',
                                'VpcId': 'string',
                                'InterfaceType': 'string'
                            },
                        ],
                        'RootDeviceName': 'string',
                        'RootDeviceType': 'ebs',
                        'SecurityGroups': [
                            {
                                'GroupName': 'string',
                                'GroupId': 'string'
                            },
                        ],
                        'SourceDestCheck': True,
                        'SpotInstanceRequestId': 'string',
                        'SriovNetSupport': 'string',
                        'StateReason': {
                            'Code': 'string',
                            'Message': 'string'
                        },
                        'Tags': [
                            {
                                'Key': 'string',
                                'Value': 'string'
                            },
                        ],
                        'VirtualizationType': 'hvm',
                        'CpuOptions': {
                            'CoreCount': 123,
                            'ThreadsPerCore': 123
                        },
                        'CapacityReservationId': 'string',
                        'CapacityReservationSpecification': {
                            'CapacityReservationPreference': 'open',
                            'CapacityReservationTarget': {
                                'CapacityReservationId': 'string'
                            }
                        },
                        'HibernationOptions': {
                            'Configured': True
                        },
                        'Licenses': [
                            {
                                'LicenseConfigurationArn': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'RequesterId': 'string',
                'ReservationId': 'string'
            }, {
                'Groups': [
                    {
                        'GroupName': 'string',
                        'GroupId': 'string'
                    },
                ],
                'Instances': [
                    {
                        'AmiLaunchIndex': 123,
                        'ImageId': 'ImageId_not_exist_token',
                        'InstanceId': 'string',
                        'InstanceType': 't1.micro',
                        'KernelId': 'string',
                        'KeyName': 'string',
                        'LaunchTime': '2019-06-06',
                        'Monitoring': {
                            'State': 'disabled'
                        },
                        'Placement': {
                            'AvailabilityZone': 'string',
                            'Affinity': 'string',
                            'GroupName': 'string',
                            'PartitionNumber': 123,
                            'HostId': 'string',
                            'Tenancy': 'default',
                            'SpreadDomain': 'string'
                        },
                        'Platform': 'Windows',
                        'PrivateDnsName': 'string',
                        'PrivateIpAddress': 'string',
                        'ProductCodes': [
                            {
                                'ProductCodeId': 'string',
                                'ProductCodeType': 'devpay'
                            },
                        ],
                        'PublicDnsName': 'string',
                        'PublicIpAddress': 'string',
                        'RamdiskId': 'string',
                        'State': {
                            'Code': 123,
                            'Name': 'pending'
                        },
                        'StateTransitionReason': 'string',
                        'SubnetId': 'string',
                        'VpcId': 'string',
                        'Architecture': 'i386',
                        'BlockDeviceMappings': [
                            {
                                'DeviceName': 'string',
                                'Ebs': {
                                    'AttachTime': '2019-06-06',
                                    'DeleteOnTermination': True,
                                    'Status': 'attaching',
                                    'VolumeId': 'string'
                                }
                            },
                        ],
                        'ClientToken': 'string',
                        'EbsOptimized': True,
                        'EnaSupport': True,
                        'Hypervisor': 'ovm',
                        'IamInstanceProfile': {
                            'Arn': 'string',
                            'Id': 'string'
                        },
                        'InstanceLifecycle': 'spot',
                        'ElasticGpuAssociations': [
                            {
                                'ElasticGpuId': 'string',
                                'ElasticGpuAssociationId': 'string',
                                'ElasticGpuAssociationState': 'string',
                                'ElasticGpuAssociationTime': 'string'
                            },
                        ],
                        'ElasticInferenceAcceleratorAssociations': [
                            {
                                'ElasticInferenceAcceleratorArn': 'string',
                                'ElasticInferenceAcceleratorAssociationId': 'string',
                                'ElasticInferenceAcceleratorAssociationState': 'string',
                                'ElasticInferenceAcceleratorAssociationTime': '2019-06-06'
                            },
                        ],
                        'NetworkInterfaces': [
                            {
                                'Association': {
                                    'IpOwnerId': 'string',
                                    'PublicDnsName': 'string',
                                    'PublicIp': 'string'
                                },
                                'Attachment': {
                                    'AttachTime': '2019-06-06',
                                    'AttachmentId': 'string',
                                    'DeleteOnTermination': True,
                                    'DeviceIndex': 123,
                                    'Status': 'attaching'
                                },
                                'Description': 'string',
                                'Groups': [
                                    {
                                        'GroupName': 'string',
                                        'GroupId': 'string'
                                    },
                                ],
                                'Ipv6Addresses': [
                                    {
                                        'Ipv6Address': 'string'
                                    },
                                ],
                                'MacAddress': 'string',
                                'NetworkInterfaceId': 'string',
                                'OwnerId': 'string',
                                'PrivateDnsName': 'string',
                                'PrivateIpAddress': 'string',
                                'PrivateIpAddresses': [
                                    {
                                        'Association': {
                                            'IpOwnerId': 'string',
                                            'PublicDnsName': 'string',
                                            'PublicIp': 'string'
                                        },
                                        'Primary': True,
                                        'PrivateDnsName': 'string',
                                        'PrivateIpAddress': 'string'
                                    },
                                ],
                                'SourceDestCheck': True,
                                'Status': 'available',
                                'SubnetId': 'string',
                                'VpcId': 'string',
                                'InterfaceType': 'string'
                            },
                        ],
                        'RootDeviceName': 'string',
                        'RootDeviceType': 'ebs',
                        'SecurityGroups': [
                            {
                                'GroupName': 'string',
                                'GroupId': 'string'
                            },
                        ],
                        'SourceDestCheck':
                        True,
                        'SpotInstanceRequestId': 'string',
                        'SriovNetSupport': 'string',
                        'StateReason': {
                            'Code': 'string',
                            'Message': 'string'
                        },
                        'Tags': [
                            {
                                'Key': 'string',
                                'Value': 'string'
                            },
                        ],
                        'VirtualizationType': 'hvm',
                        'CpuOptions': {
                            'CoreCount': 123,
                            'ThreadsPerCore': 123
                        },
                        'CapacityReservationId': 'string',
                        'CapacityReservationSpecification': {
                            'CapacityReservationPreference': 'open',
                            'CapacityReservationTarget': {
                                'CapacityReservationId': 'string'
                            }
                        },
                        'HibernationOptions': {
                            'Configured': True
                        },
                        'Licenses': [
                            {
                                'LicenseConfigurationArn': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'RequesterId': 'string',
                'ReservationId': 'string'
            },
        ]
    }

    DATA_TEST_DESCRIBE_INSTANCES_EXIST_NEXT_TOKEN = {
        'Reservations': [
            {
                'Groups': [
                    {
                        'GroupName': 'string',
                        'GroupId': 'string'
                    },
                ],
                'Instances': [
                    {
                        'AmiLaunchIndex': 123,
                        'ImageId': 'ImageId_exist_next_token',
                        'InstanceId': 'string',
                        'InstanceType': 't1.micro',
                        'KernelId': 'string',
                        'KeyName': 'string',
                        'LaunchTime': '2019-06-06',
                        'Monitoring': {
                            'State': 'disabled'
                        },
                        'Placement': {
                            'AvailabilityZone': 'string',
                            'Affinity': 'string',
                            'GroupName': 'string',
                            'PartitionNumber': 123,
                            'HostId': 'string',
                            'Tenancy': 'default',
                            'SpreadDomain': 'string'
                        },
                        'Platform': 'Windows',
                        'PrivateDnsName': 'string',
                        'PrivateIpAddress': 'string',
                        'ProductCodes': [
                            {
                                'ProductCodeId': 'string',
                                'ProductCodeType': 'devpay'
                            },
                        ],
                        'PublicDnsName': 'string',
                        'PublicIpAddress': 'string',
                        'RamdiskId': 'string',
                        'State': {
                            'Code': 123,
                            'Name': 'pending'
                        },
                        'StateTransitionReason': 'string',
                        'SubnetId': 'string',
                        'VpcId': 'string',
                        'Architecture': 'i386',
                        'BlockDeviceMappings': [
                            {
                                'DeviceName': 'string',
                                'Ebs': {
                                    'AttachTime': '2019-06-06',
                                    'DeleteOnTermination': True,
                                    'Status': 'attaching',
                                    'VolumeId': 'string'
                                }
                            },
                        ],
                        'ClientToken': 'string',
                        'EbsOptimized': True,
                        'EnaSupport': True,
                        'Hypervisor': 'ovm',
                        'IamInstanceProfile': {
                            'Arn': 'string',
                            'Id': 'string'
                        },
                        'InstanceLifecycle': 'spot',
                        'ElasticGpuAssociations': [
                            {
                                'ElasticGpuId': 'string',
                                'ElasticGpuAssociationId': 'string',
                                'ElasticGpuAssociationState': 'string',
                                'ElasticGpuAssociationTime': 'string'
                            },
                        ],
                        'ElasticInferenceAcceleratorAssociations': [
                            {
                                'ElasticInferenceAcceleratorArn': 'string',
                                'ElasticInferenceAcceleratorAssociationId': 'string',
                                'ElasticInferenceAcceleratorAssociationState': 'string',
                                'ElasticInferenceAcceleratorAssociationTime': '2019-06-06'
                            },
                        ],
                        'NetworkInterfaces': [
                            {
                                'Association': {
                                    'IpOwnerId': 'string',
                                    'PublicDnsName': 'string',
                                    'PublicIp': 'string'
                                },
                                'Attachment': {
                                    'AttachTime': '2019-06-06',
                                    'AttachmentId': 'string',
                                    'DeleteOnTermination': True,
                                    'DeviceIndex': 123,
                                    'Status': 'attaching'
                                },
                                'Description': 'string',
                                'Groups': [
                                    {
                                        'GroupName': 'string',
                                        'GroupId': 'string'
                                    },
                                ],
                                'Ipv6Addresses': [
                                    {
                                        'Ipv6Address': 'string'
                                    },
                                ],
                                'MacAddress': 'string',
                                'NetworkInterfaceId': 'string',
                                'OwnerId': 'string',
                                'PrivateDnsName': 'string',
                                'PrivateIpAddress': 'string',
                                'PrivateIpAddresses': [
                                    {
                                        'Association': {
                                            'IpOwnerId': 'string',
                                            'PublicDnsName': 'string',
                                            'PublicIp': 'string'
                                        },
                                        'Primary': True,
                                        'PrivateDnsName': 'string',
                                        'PrivateIpAddress': 'string'
                                    },
                                ],
                                'SourceDestCheck':
                                True,
                                'Status': 'available',
                                'SubnetId': 'string',
                                'VpcId': 'string',
                                'InterfaceType': 'string'
                            },
                        ],
                        'RootDeviceName': 'string',
                        'RootDeviceType': 'ebs',
                        'SecurityGroups': [
                            {
                                'GroupName': 'string',
                                'GroupId': 'string'
                            },
                        ],
                        'SourceDestCheck':
                        True,
                        'SpotInstanceRequestId': 'string',
                        'SriovNetSupport': 'string',
                        'StateReason': {
                            'Code': 'string',
                            'Message': 'string'
                        },
                        'Tags': [
                            {
                                'Key': 'string',
                                'Value': 'string'
                            },
                        ],
                        'VirtualizationType': 'hvm',
                        'CpuOptions': {
                            'CoreCount': 123,
                            'ThreadsPerCore': 123
                        },
                        'CapacityReservationId': 'string',
                        'CapacityReservationSpecification': {
                            'CapacityReservationPreference': 'open',
                            'CapacityReservationTarget': {
                                'CapacityReservationId': 'string'
                            }
                        },
                        'HibernationOptions': {
                            'Configured': True
                        },
                        'Licenses': [
                            {
                                'LicenseConfigurationArn': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'RequesterId': 'string',
                'ReservationId': 'string'
            },
        ],
        'NextToken': 'NextToken_1'
    }

    DATA_TEST_DESCRIBE_INSTANCES_EXIST_NEXT_TOKEN_1 = {
        'Reservations': [
            {
                'Groups': [
                    {
                        'GroupName': 'string',
                        'GroupId': 'string'
                    },
                ],
                'Instances': [
                    {
                        'AmiLaunchIndex':
                        123,
                        'ImageId': 'ImageId_next_token_1',
                        'InstanceId': 'string',
                        'InstanceType': 't1.micro',
                        'KernelId': 'string',
                        'KeyName': 'string',
                        'LaunchTime': '2019-06-06',
                        'Monitoring': {
                            'State': 'disabled'
                        },
                        'Placement': {
                            'AvailabilityZone': 'string',
                            'Affinity': 'string',
                            'GroupName': 'string',
                            'PartitionNumber': 123,
                            'HostId': 'string',
                            'Tenancy': 'default',
                            'SpreadDomain': 'string'
                        },
                        'Platform': 'Windows',
                        'PrivateDnsName': 'string',
                        'PrivateIpAddress': 'string',
                        'ProductCodes': [
                            {
                                'ProductCodeId': 'string',
                                'ProductCodeType': 'devpay'
                            },
                        ],
                        'PublicDnsName': 'string',
                        'PublicIpAddress': 'string',
                        'RamdiskId': 'string',
                        'State': {
                            'Code': 123,
                            'Name': 'pending'
                        },
                        'StateTransitionReason': 'string',
                        'SubnetId': 'string',
                        'VpcId': 'string',
                        'Architecture': 'i386',
                        'BlockDeviceMappings': [
                            {
                                'DeviceName': 'string',
                                'Ebs': {
                                    'AttachTime': '2019-06-06',
                                    'DeleteOnTermination': True,
                                    'Status': 'attaching',
                                    'VolumeId': 'string'
                                }
                            },
                        ],
                        'ClientToken': 'string',
                        'EbsOptimized': True,
                        'EnaSupport': True,
                        'Hypervisor': 'ovm',
                        'IamInstanceProfile': {
                            'Arn': 'string',
                            'Id': 'string'
                        },
                        'InstanceLifecycle': 'spot',
                        'ElasticGpuAssociations': [
                            {
                                'ElasticGpuId': 'string',
                                'ElasticGpuAssociationId': 'string',
                                'ElasticGpuAssociationState': 'string',
                                'ElasticGpuAssociationTime': 'string'
                            },
                        ],
                        'ElasticInferenceAcceleratorAssociations': [
                            {
                                'ElasticInferenceAcceleratorArn': 'string',
                                'ElasticInferenceAcceleratorAssociationId': 'string',
                                'ElasticInferenceAcceleratorAssociationState': 'string',
                                'ElasticInferenceAcceleratorAssociationTime': '2019-06-06'
                            },
                        ],
                        'NetworkInterfaces': [
                            {
                                'Association': {
                                    'IpOwnerId': 'string',
                                    'PublicDnsName': 'string',
                                    'PublicIp': 'string'
                                },
                                'Attachment': {
                                    'AttachTime': '2019-06-06',
                                    'AttachmentId': 'string',
                                    'DeleteOnTermination': True,
                                    'DeviceIndex': 123,
                                    'Status': 'attaching'
                                },
                                'Description': 'string',
                                'Groups': [
                                    {
                                        'GroupName': 'string',
                                        'GroupId': 'string'
                                    },
                                ],
                                'Ipv6Addresses': [
                                    {
                                        'Ipv6Address': 'string'
                                    },
                                ],
                                'MacAddress': 'string',
                                'NetworkInterfaceId': 'string',
                                'OwnerId': 'string',
                                'PrivateDnsName': 'string',
                                'PrivateIpAddress': 'string',
                                'PrivateIpAddresses': [
                                    {
                                        'Association': {
                                            'IpOwnerId': 'string',
                                            'PublicDnsName': 'string',
                                            'PublicIp': 'string'
                                        },
                                        'Primary': True,
                                        'PrivateDnsName': 'string',
                                        'PrivateIpAddress': 'string'
                                    },
                                ],
                                'SourceDestCheck':
                                True,
                                'Status': 'available',
                                'SubnetId': 'string',
                                'VpcId': 'string',
                                'InterfaceType': 'string'
                            },
                        ],
                        'RootDeviceName': 'string',
                        'RootDeviceType': 'ebs',
                        'SecurityGroups': [
                            {
                                'GroupName': 'string',
                                'GroupId': 'string'
                            },
                        ],
                        'SourceDestCheck':
                        True,
                        'SpotInstanceRequestId': 'string',
                        'SriovNetSupport': 'string',
                        'StateReason': {
                            'Code': 'string',
                            'Message': 'string'
                        },
                        'Tags': [
                            {
                                'Key': 'string',
                                'Value': 'string'
                            },
                        ],
                        'VirtualizationType': 'hvm',
                        'CpuOptions': {
                            'CoreCount': 123,
                            'ThreadsPerCore': 123
                        },
                        'CapacityReservationId': 'string',
                        'CapacityReservationSpecification': {
                            'CapacityReservationPreference': 'open',
                            'CapacityReservationTarget': {
                                'CapacityReservationId': 'string'
                            }
                        },
                        'HibernationOptions': {
                            'Configured': True
                        },
                        'Licenses': [
                            {
                                'LicenseConfigurationArn': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'RequesterId': 'string',
                'ReservationId': 'string'
            },
        ],
        'NextToken': 'NextToken_2'
    }

    DATA_TEST_DESCRIBE_INSTANCES_EXIST_NEXT_TOKEN_2 = {
        'Reservations': [
            {
                'Groups': [
                    {
                        'GroupName': 'string',
                        'GroupId': 'string'
                    },
                ],
                'Instances': [
                    {
                        'AmiLaunchIndex':
                        123,
                        'ImageId': 'ImageId_next_token_2',
                        'InstanceId': 'string',
                        'InstanceType': 't1.micro',
                        'KernelId': 'string',
                        'KeyName': 'string',
                        'LaunchTime': '2019-06-06',
                        'Monitoring': {
                            'State': 'disabled'
                        },
                        'Placement': {
                            'AvailabilityZone': 'string',
                            'Affinity': 'string',
                            'GroupName': 'string',
                            'PartitionNumber': 123,
                            'HostId': 'string',
                            'Tenancy': 'default',
                            'SpreadDomain': 'string'
                        },
                        'Platform': 'Windows',
                        'PrivateDnsName': 'string',
                        'PrivateIpAddress': 'string',
                        'ProductCodes': [
                            {
                                'ProductCodeId': 'string',
                                'ProductCodeType': 'devpay'
                            },
                        ],
                        'PublicDnsName': 'string',
                        'PublicIpAddress': 'string',
                        'RamdiskId': 'string',
                        'State': {
                            'Code': 123,
                            'Name': 'pending'
                        },
                        'StateTransitionReason': 'string',
                        'SubnetId': 'string',
                        'VpcId': 'string',
                        'Architecture': 'i386',
                        'BlockDeviceMappings': [
                            {
                                'DeviceName': 'string',
                                'Ebs': {
                                    'AttachTime': '2019-06-06',
                                    'DeleteOnTermination': True,
                                    'Status': 'attaching',
                                    'VolumeId': 'string'
                                }
                            },
                        ],
                        'ClientToken': 'string',
                        'EbsOptimized': True,
                        'EnaSupport': True,
                        'Hypervisor': 'ovm',
                        'IamInstanceProfile': {
                            'Arn': 'string',
                            'Id': 'string'
                        },
                        'InstanceLifecycle': 'spot',
                        'ElasticGpuAssociations': [
                            {
                                'ElasticGpuId': 'string',
                                'ElasticGpuAssociationId': 'string',
                                'ElasticGpuAssociationState': 'string',
                                'ElasticGpuAssociationTime': 'string'
                            },
                        ],
                        'ElasticInferenceAcceleratorAssociations': [
                            {
                                'ElasticInferenceAcceleratorArn': 'string',
                                'ElasticInferenceAcceleratorAssociationId': 'string',
                                'ElasticInferenceAcceleratorAssociationState': 'string',
                                'ElasticInferenceAcceleratorAssociationTime': '2019-06-06'
                            },
                        ],
                        'NetworkInterfaces': [
                            {
                                'Association': {
                                    'IpOwnerId': 'string',
                                    'PublicDnsName': 'string',
                                    'PublicIp': 'string'
                                },
                                'Attachment': {
                                    'AttachTime': '2019-06-06',
                                    'AttachmentId': 'string',
                                    'DeleteOnTermination': True,
                                    'DeviceIndex': 123,
                                    'Status': 'attaching'
                                },
                                'Description': 'string',
                                'Groups': [
                                    {
                                        'GroupName': 'string',
                                        'GroupId': 'string'
                                    },
                                ],
                                'Ipv6Addresses': [
                                    {
                                        'Ipv6Address': 'string'
                                    },
                                ],
                                'MacAddress': 'string',
                                'NetworkInterfaceId': 'string',
                                'OwnerId': 'string',
                                'PrivateDnsName': 'string',
                                'PrivateIpAddress': 'string',
                                'PrivateIpAddresses': [
                                    {
                                        'Association': {
                                            'IpOwnerId': 'string',
                                            'PublicDnsName': 'string',
                                            'PublicIp': 'string'
                                        },
                                        'Primary': True,
                                        'PrivateDnsName': 'string',
                                        'PrivateIpAddress': 'string'
                                    },
                                ],
                                'SourceDestCheck':
                                True,
                                'Status': 'available',
                                'SubnetId': 'string',
                                'VpcId': 'string',
                                'InterfaceType': 'string'
                            },
                        ],
                        'RootDeviceName': 'string',
                        'RootDeviceType': 'ebs',
                        'SecurityGroups': [
                            {
                                'GroupName': 'string',
                                'GroupId': 'string'
                            },
                        ],
                        'SourceDestCheck':
                        True,
                        'SpotInstanceRequestId': 'string',
                        'SriovNetSupport': 'string',
                        'StateReason': {
                            'Code': 'string',
                            'Message': 'string'
                        },
                        'Tags': [
                            {
                                'Key': 'string',
                                'Value': 'string'
                            },
                        ],
                        'VirtualizationType': 'hvm',
                        'CpuOptions': {
                            'CoreCount': 123,
                            'ThreadsPerCore': 123
                        },
                        'CapacityReservationId': 'string',
                        'CapacityReservationSpecification': {
                            'CapacityReservationPreference': 'open',
                            'CapacityReservationTarget': {
                                'CapacityReservationId': 'string'
                            }
                        },
                        'HibernationOptions': {
                            'Configured': True
                        },
                        'Licenses': [
                            {
                                'LicenseConfigurationArn': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'RequesterId': 'string',
                'ReservationId': 'string'
            },
        ],
        'NextToken': 'NextToken_3'
    }

    DATA_DESCRIBE_FLOW_LOGS_EXIST_TOKEN = {
        'FlowLogs': [
            {
                'CreationTime': '2019-06-06',
                'DeliverLogsErrorMessage': 'Deliver_exist_token',
                'DeliverLogsPermissionArn': 'string',
                'DeliverLogsStatus': 'string',
                'FlowLogId': 'string',
                'FlowLogStatus': 'string',
                'LogGroupName': 'string',
                'ResourceId': 'string',
                'TrafficType':  'ALL',
                'LogDestinationType': 'cloud-watch-logs',
                'LogDestination': 'string'
            },
        ],
        'NextToken': 'NextToken_1'
    }

    DATA_DESCRIBE_FLOW_LOGS_EXIST_TOKEN_1 = {
        'FlowLogs': [
            {
                'CreationTime': '2019-06-06',
                'DeliverLogsErrorMessage': 'LogsErrorMessage_token1',
                'DeliverLogsPermissionArn': 'string',
                'DeliverLogsStatus': 'string',
                'FlowLogId': 'string',
                'FlowLogStatus': 'string',
                'LogGroupName': 'string',
                'ResourceId': 'string',
                'TrafficType':  'ALL',
                'LogDestinationType': 'cloud-watch-logs',
                'LogDestination': 'string'
            },
        ],
        'NextToken': 'NextToken_2'
    }

    DATA_DESCRIBE_FLOW_LOGS_EXIST_TOKEN_2 = {
        'FlowLogs': [
            {
                'CreationTime': '2019-06-06',
                'DeliverLogsErrorMessage': 'LogsErrorMessage_token2',
                'DeliverLogsPermissionArn': 'string',
                'DeliverLogsStatus': 'string',
                'FlowLogId': 'string',
                'FlowLogStatus': 'string',
                'LogGroupName': 'string',
                'ResourceId': 'string',
                'TrafficType':  'ALL',
                'LogDestinationType': 'cloud-watch-logs',
                'LogDestination': 'string'
            },
        ],
        'NextToken': 'NextToken_3'
    }

    DATA_DESCRIBE_FLOW_LOGS_NOT_EXIST_TOKEN = {
        'FlowLogs': [
            {
                'CreationTime': '2019-06-06',
                'DeliverLogsErrorMessage': 'LogsErrorMessage_token3',
                'DeliverLogsPermissionArn': 'string',
                'DeliverLogsStatus': 'string',
                'FlowLogId': 'string',
                'FlowLogStatus': 'string',
                'LogGroupName': 'string',
                'ResourceId': 'string',
                'TrafficType':  'ALL',
                'LogDestinationType': 'cloud-watch-logs',
                'LogDestination': 'string'
            },
            {
                'CreationTime': '2019-06-06',
                'DeliverLogsErrorMessage': 'LogsErrorMessage_token4',
                'DeliverLogsPermissionArn': 'string',
                'DeliverLogsStatus': 'string',
                'FlowLogId': 'string',
                'FlowLogStatus': 'string',
                'LogGroupName': 'string',
                'ResourceId': 'string',
                'TrafficType':  'ALL',
                'LogDestinationType': 'cloud-watch-logs',
                'LogDestination': 'string'
            }
        ]
    }

    DATA_CHECK_ALL_DESCRIBE_FLOW_LOGS = {
        'FlowLogs': [
            {
                'CreationTime': '2019-06-06',
                'DeliverLogsErrorMessage': 'Deliver_exist_token',
                'DeliverLogsPermissionArn': 'string',
                'DeliverLogsStatus': 'string',
                'FlowLogId': 'string',
                'FlowLogStatus': 'string',
                'LogGroupName': 'string',
                'ResourceId': 'string',
                'TrafficType':  'ALL',
                'LogDestinationType': 'cloud-watch-logs',
                'LogDestination': 'string'
            },
            {
                'CreationTime': '2019-06-06',
                'DeliverLogsErrorMessage': 'LogsErrorMessage_token1',
                'DeliverLogsPermissionArn': 'string',
                'DeliverLogsStatus': 'string',
                'FlowLogId': 'string',
                'FlowLogStatus': 'string',
                'LogGroupName': 'string',
                'ResourceId': 'string',
                'TrafficType':  'ALL',
                'LogDestinationType': 'cloud-watch-logs',
                'LogDestination': 'string'
            },
            {
                'CreationTime': '2019-06-06',
                'DeliverLogsErrorMessage': 'LogsErrorMessage_token2',
                'DeliverLogsPermissionArn': 'string',
                'DeliverLogsStatus': 'string',
                'FlowLogId': 'string',
                'FlowLogStatus': 'string',
                'LogGroupName': 'string',
                'ResourceId': 'string',
                'TrafficType':  'ALL',
                'LogDestinationType': 'cloud-watch-logs',
                'LogDestination': 'string'
            },
            {
                'CreationTime': '2019-06-06',
                'DeliverLogsErrorMessage': 'LogsErrorMessage_token3',
                'DeliverLogsPermissionArn': 'string',
                'DeliverLogsStatus': 'string',
                'FlowLogId': 'string',
                'FlowLogStatus': 'string',
                'LogGroupName': 'string',
                'ResourceId': 'string',
                'TrafficType':  'ALL',
                'LogDestinationType': 'cloud-watch-logs',
                'LogDestination': 'string'
            },
            {
                'CreationTime': '2019-06-06',
                'DeliverLogsErrorMessage': 'LogsErrorMessage_token4',
                'DeliverLogsPermissionArn': 'string',
                'DeliverLogsStatus': 'string',
                'FlowLogId': 'string',
                'FlowLogStatus': 'string',
                'LogGroupName': 'string',
                'ResourceId': 'string',
                'TrafficType':  'ALL',
                'LogDestinationType': 'cloud-watch-logs',
                'LogDestination': 'string'
            }
        ]
    }

    DATA_DESCRIBE_VOLUMES_EXIST_TOKEN = {
        'Volumes': [
            {
                'Attachments': [
                    {
                        'AttachTime': '2019-06-06',
                        'Device': 'string',
                        'InstanceId': 'InstanceId',
                        'State': 'attaching',
                        'VolumeId': 'string',
                        'DeleteOnTermination': True
                    },
                ],
                'AvailabilityZone': 'string',
                'CreateTime': '2019-06-06',
                'Encrypted': True,
                'KmsKeyId': 'string',
                'Size': 123,
                'SnapshotId': 'string',
                'State': 'creating',
                'VolumeId': 'string',
                'Iops': 123,
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VolumeType': 'standard'
            },
        ],
        'NextToken': 'NextToken_1'
    }

    DATA_DESCRIBE_VOLUMES_EXIST_TOKEN_1 = {
        'Volumes': [
            {
                'Attachments': [
                    {
                        'AttachTime': '2019-06-06',
                        'Device': 'string',
                        'InstanceId': 'InstanceId1',
                        'State': 'attaching',
                        'VolumeId': 'string',
                        'DeleteOnTermination': True
                    },
                ],
                'AvailabilityZone': 'string',
                'CreateTime': '2019-06-06',
                'Encrypted': True,
                'KmsKeyId': 'string',
                'Size': 123,
                'SnapshotId': 'string',
                'State': 'creating',
                'VolumeId': 'string',
                'Iops': 123,
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VolumeType': 'standard'
            },
        ],
        'NextToken': 'NextToken_2'
    }

    DATA_DESCRIBE_VOLUMES_EXIST_TOKEN_2 = {
        'Volumes': [
            {
                'Attachments': [
                    {
                        'AttachTime': '2019-06-06',
                        'Device': 'string',
                        'InstanceId': 'InstanceId2',
                        'State': 'attaching',
                        'VolumeId': 'string',
                        'DeleteOnTermination': True
                    },
                ],
                'AvailabilityZone': 'string',
                'CreateTime': '2019-06-06',
                'Encrypted': True,
                'KmsKeyId': 'string',
                'Size': 123,
                'SnapshotId': 'string',
                'State': 'creating',
                'VolumeId': 'string',
                'Iops': 123,
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VolumeType': 'standard'
            },
        ],
        'NextToken': 'NextToken_3'
    }

    DATA_DESCRIBE_VOLUMES_NOT_EXIST_TOKEN = {
        'Volumes': [
            {
                'Attachments': [
                    {
                        'AttachTime': '2019-06-06',
                        'Device': 'string',
                        'InstanceId': 'InstanceId3',
                        'State': 'attaching',
                        'VolumeId': 'string',
                        'DeleteOnTermination': True
                    },
                ],
                'AvailabilityZone': 'string',
                'CreateTime': '2019-06-06',
                'Encrypted': True,
                'KmsKeyId': 'string',
                'Size': 123,
                'SnapshotId': 'string',
                'State': 'creating',
                'VolumeId': 'string',
                'Iops': 123,
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VolumeType': 'standard'
            },
        ],
    }

    DATA_CHECK_ALL_DESCRIBE_VOLUMES = {
        'Volumes': [
            {
                'Attachments': [
                    {
                        'AttachTime': '2019-06-06',
                        'Device': 'string',
                        'InstanceId': 'InstanceId',
                        'State': 'attaching',
                        'VolumeId': 'string',
                        'DeleteOnTermination': True
                    },
                ],
                'AvailabilityZone': 'string',
                'CreateTime': '2019-06-06',
                'Encrypted': True,
                'KmsKeyId': 'string',
                'Size': 123,
                'SnapshotId': 'string',
                'State': 'creating',
                'VolumeId': 'string',
                'Iops': 123,
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VolumeType': 'standard'
            },
            {
                'Attachments': [
                    {
                        'AttachTime': '2019-06-06',
                        'Device': 'string',
                        'InstanceId': 'InstanceId1',
                        'State': 'attaching',
                        'VolumeId': 'string',
                        'DeleteOnTermination': True
                    },
                ],
                'AvailabilityZone': 'string',
                'CreateTime': '2019-06-06',
                'Encrypted': True,
                'KmsKeyId': 'string',
                'Size': 123,
                'SnapshotId': 'string',
                'State': 'creating',
                'VolumeId': 'string',
                'Iops': 123,
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VolumeType': 'standard'
            },
            {
                'Attachments': [
                    {
                        'AttachTime': '2019-06-06',
                        'Device': 'string',
                        'InstanceId': 'InstanceId2',
                        'State': 'attaching',
                        'VolumeId': 'string',
                        'DeleteOnTermination': True
                    },
                ],
                'AvailabilityZone': 'string',
                'CreateTime': '2019-06-06',
                'Encrypted': True,
                'KmsKeyId': 'string',
                'Size': 123,
                'SnapshotId': 'string',
                'State': 'creating',
                'VolumeId': 'string',
                'Iops': 123,
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VolumeType': 'standard'
            },
            {
                'Attachments': [
                    {
                        'AttachTime': '2019-06-06',
                        'Device': 'string',
                        'InstanceId': 'InstanceId3',
                        'State': 'attaching',
                        'VolumeId': 'string',
                        'DeleteOnTermination': True
                    },
                ],
                'AvailabilityZone': 'string',
                'CreateTime': '2019-06-06',
                'Encrypted': True,
                'KmsKeyId': 'string',
                'Size': 123,
                'SnapshotId': 'string',
                'State': 'creating',
                'VolumeId': 'string',
                'Iops': 123,
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VolumeType': 'standard'
            }
        ]
    }

    DATA_DESCRIBE_SECURITY_GROUPS_EXIST_TOKEN = {
        'SecurityGroups': [
            {
                'Description': 'Description1',
                'GroupName': 'string',
                'IpPermissions': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'GroupId': 'string',
                'IpPermissionsEgress': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VpcId': 'string'
            },
        ],
        'NextToken': 'NextToken_1'
    }

    DATA_DESCRIBE_SECURITY_GROUPS_EXIST_TOKEN_1 = {
        'SecurityGroups': [
            {
                'Description': 'Description2',
                'GroupName': 'string',
                'IpPermissions': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'GroupId': 'string',
                'IpPermissionsEgress': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VpcId': 'string'
            },
        ],
        'NextToken': 'NextToken_2'
    }

    DATA_DESCRIBE_SECURITY_GROUPS_EXIST_TOKEN_2 = {
        'SecurityGroups': [
            {
                'Description': 'Description3',
                'GroupName': 'string',
                'IpPermissions': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'GroupId': 'string',
                'IpPermissionsEgress': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VpcId': 'string'
            },
        ],
        'NextToken': 'NextToken_3'
    }

    DATA_DESCRIBE_SECURITY_GROUPS_NOT_EXIST_TOKEN = {
        'SecurityGroups': [
            {
                'Description': 'Description4',
                'GroupName': 'string',
                'IpPermissions': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'GroupId': 'string',
                'IpPermissionsEgress': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VpcId': 'string'
            },
        ],
    }

    DATA_CHECK_ALL_DESCRIBE_SECURITY_GROUPS = {
        'SecurityGroups': [
            {
                'Description': 'Description1',
                'GroupName': 'string',
                'IpPermissions': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'GroupId': 'string',
                'IpPermissionsEgress': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VpcId': 'string'
            },
            {
                'Description': 'Description2',
                'GroupName': 'string',
                'IpPermissions': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'GroupId': 'string',
                'IpPermissionsEgress': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VpcId': 'string'
            },
            {
                'Description': 'Description3',
                'GroupName': 'string',
                'IpPermissions': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'GroupId': 'string',
                'IpPermissionsEgress': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VpcId': 'string'
            },
            {
                'Description': 'Description4',
                'GroupName': 'string',
                'IpPermissions': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'OwnerId': 'string',
                'GroupId': 'string',
                'IpPermissionsEgress': [
                    {
                        'FromPort': 123,
                        'IpProtocol': 'string',
                        'IpRanges': [
                            {
                                'CidrIp': 'string',
                                'Description': 'string'
                            },
                        ],
                        'Ipv6Ranges': [
                            {
                                'CidrIpv6': 'string',
                                'Description': 'string'
                            },
                        ],
                        'PrefixListIds': [
                            {
                                'Description': 'string',
                                'PrefixListId': 'string'
                            },
                        ],
                        'ToPort': 123,
                        'UserIdGroupPairs': [
                            {
                                'Description': 'string',
                                'GroupId': 'string',
                                'GroupName': 'string',
                                'PeeringStatus': 'string',
                                'UserId': 'string',
                                'VpcId': 'string',
                                'VpcPeeringConnectionId': 'string'
                            },
                        ]
                    },
                ],
                'Tags': [
                    {
                        'Key': 'string',
                        'Value': 'string'
                    },
                ],
                'VpcId': 'string'
            }
        ],
    }

    DATA_DESCRIBE_FLOW_LOGS_EMPTY = {}
