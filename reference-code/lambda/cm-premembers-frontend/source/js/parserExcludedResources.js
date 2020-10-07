import CommonUtils from './commonUtils.js'

const resourceTypes = {
    "Group": "group",
    "User": "user",
    "Role": "role",
    "InstanceId": "InstanceId",
    "CloudTrailName": "CloudTrailName",
    "S3BucketName": "S3BucketName",
    "KeyId": "KeyId",
    "VpcId": "VpcId",
    "GroupId": "GroupId"
}

const conditionSortResourceCIS122 = [
    {
        "key" : "isExclusion",
        "type" : "DESC"
    },
    {
        "key" : "policy",
        "type" : "ASC"
    },
    {
        "key" : "resourceType",
        "type" : "ASC"
    },
    {
        "key" : "resource",
        "type" : "ASC"
    }
]

const conditionSortResourceUserIam = [
    {
        "key" : "isExclusion",
        "type" : "DESC"
    },
    {
        "key" : "resourceName",
        "type" : "ASC"
    }
]

const conditionSortResourceOther = [
    {
        "key" : "isExclusion",
        "type" : "DESC"
    },
    {
        "key" : "regionName",
        "type" : "ASC"
    },
    {
        "key" : "resourceName",
        "type" : "ASC"
    }
]

function compareResourceCIS122(firstItem, secondItem) {
    firstItem['policy'] = CommonUtils.getPolicyName(firstItem.resourceName)
    firstItem['resource'] = CommonUtils.getResourceName(firstItem.resourceName)
    secondItem['policy'] = CommonUtils.getPolicyName(secondItem.resourceName)
    secondItem['resource'] = CommonUtils.getResourceName(secondItem.resourceName)

    return CommonUtils.sortByListSortConditions(firstItem, secondItem, conditionSortResourceCIS122)
}

function compareResourceUserIam(firstItem, secondItem) {
    return CommonUtils.sortByListSortConditions(firstItem, secondItem, conditionSortResourceUserIam)
}

function compareResourceOther(firstItem, secondItem) {
    return CommonUtils.sortByListSortConditions(firstItem, secondItem, conditionSortResourceOther)
}

function getDataExcludedResourceBy(regionName, resourceType, resourceName, excludedResources) {
    let response = null
    excludedResources.forEach(excludedResource => {
        if (excludedResource.regionName == regionName && excludedResource.resourceType == resourceType && excludedResource.resourceName == resourceName) {
            response = excludedResource
            excludedResource.isExists = true
            return false
        }
    })

    return response
}

function getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, callBackGetResourceName) {
    let resourcesReturn = []
    resources.forEach(resource => {
        let resourceNames = callBackGetResourceName(resource)
        if (Array.isArray(resourceNames)) {
            resourceNames.forEach(resourceName => {
                resourcesReturn.push(createItemResource(resource.Region, resourceType, resourceName, excludedResources))
            })
        } else {
            resourcesReturn.push(createItemResource(resource.Region, resourceType, resourceNames, excludedResources))
        }
    })

    excludedResources.forEach(excludedResource => {
        if (!excludedResource.isExists) {
            resourcesReturn.push(createItemResource(excludedResource.regionName, excludedResource.resourceType, excludedResource.resourceName, excludedResources))
        }
    })

    return resourcesReturn
}

function createItemResource(regionName, resourceType, resourceName, excludedResources) {
    let resource = {
        'regionName': '',
        'resourceName': '',
        'resourceType': '',
        'isExclusion': false,
        'exclusionDate': '',
        'mailAddress': '',
        'exclusionComment': ''
    }

    resource.regionName = regionName
    resource.resourceName = resourceName
    resource.resourceType = resourceType

    let excludedResource = getDataExcludedResourceBy(regionName, resourceType, resourceName, excludedResources)

    if (excludedResource) {
        resource.isExclusion = true
        resource.exclusionDate = excludedResource.createdAt
        resource.mailAddress = excludedResource.mailAddress
        resource.exclusionComment = excludedResource.exclusionComment
    }
    return resource
}

function getResourcesCheckCisItem102(resources, excludedResources) {
    let resourceType = resourceTypes.User
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.AbnormalityUsers
    }).sort(compareResourceUserIam)
}

function getResourcesCheckCisItem103(resources, excludedResources) {
    let resourceType = resourceTypes.User
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.User
    }).sort(compareResourceUserIam)
}

function getResourcesCheckCisItem104(resources, excludedResources) {
    let resourceType = resourceTypes.User
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.User
    }).sort(compareResourceUserIam)
}

function getResourcesCheckCisItem116(resources, excludedResources) {
    let resourceType = resourceTypes.User
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.UserName
    }).sort(compareResourceUserIam)
}

function getResourcesCheckCisItem119(resources, excludedResources) {
    let resourceType = resourceTypes.InstanceId
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.InstanceId
    }).sort(compareResourceOther)
}

function getResourcesCheckCisItem121(resources, excludedResources) {
    let resourceType = resourceTypes.User
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.AbnormalityUsers
    }).sort(compareResourceUserIam)
}

function getResourcesCheckCisItem122(resources, excludedResources) {
    let resourcesReturn = []

    resources.forEach(resource => {
        const formatResourceName = "{0},{1}"
        let resourceNameAbnormalityGroups = resource.DetectionItem.AbnormalityGroups
        let resourceNameAbnormalityUsers = resource.DetectionItem.AbnormalityUsers
        let resourceNameAbnormalityRoles = resource.DetectionItem.AbnormalityRoles
        let PolicyName = resource.DetectionItem.PolicyName

        let resourceTypeGroup = resourceTypes.Group
        resourceNameAbnormalityGroups.forEach(resourceName => {
            let itemResourceName = formatResourceName.format(PolicyName, resourceName)
            resourcesReturn.push(createItemResource(resource.Region, resourceTypeGroup, itemResourceName, excludedResources))
        })

        let resourceTypeUser = resourceTypes.User
        resourceNameAbnormalityUsers.forEach(resourceName => {
            let itemResourceName = formatResourceName.format(PolicyName, resourceName)
            resourcesReturn.push(createItemResource(resource.Region, resourceTypeUser, itemResourceName, excludedResources))
        })

        let resourceTypeRole = resourceTypes.Role
        resourceNameAbnormalityRoles.forEach(resourceName => {
            let itemResourceName = formatResourceName.format(PolicyName, resourceName)
            resourcesReturn.push(createItemResource(resource.Region, resourceTypeRole, itemResourceName, excludedResources))
        })
    })

    excludedResources.forEach(excludedResource => {
        if (!excludedResource.isExists) {
            resourcesReturn.push(createItemResource(excludedResource.regionName, excludedResource.resourceType, excludedResource.resourceName, excludedResources))
        }
    })

    resourcesReturn.sort(compareResourceCIS122)
    return resourcesReturn
}

function getResourcesCheckCisItem202(resources, excludedResources) {
    let resourceType = resourceTypes.CloudTrailName
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.CloudTrailName
    }).sort(compareResourceOther)
}

function getResourcesCheckCisItem203(resources, excludedResources) {
    let resourceType = resourceTypes.S3BucketName
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.BucketName
    }).sort(compareResourceOther)
}

function getResourcesCheckCisItem204(resources, excludedResources) {
    let resourceType = resourceTypes.CloudTrailName
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.CloudTrailName
    }).sort(compareResourceOther)
}

function getResourcesCheckCisItem206(resources, excludedResources) {
    let resourceType = resourceTypes.S3BucketName
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.BucketName
    }).sort(compareResourceOther)
}

function getResourcesCheckCisItem207(resources, excludedResources) {
    let resourceType = resourceTypes.CloudTrailName
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.CloudTrailName
    }).sort(compareResourceOther)
}

function getResourcesCheckCisItem208(resources, excludedResources) {
    let resourceType = resourceTypes.KeyId
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.AbnormalityKeys.KeyId
    }).sort(compareResourceOther)
}

function getResourcesCheckCisItem209(resources, excludedResources) {
    let resourceType = resourceTypes.VpcId
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.AbnormalityVpc
    }).sort(compareResourceOther)
}

function getResourcesCheckCisItem401(resources, excludedResources) {
    let resourceType = resourceTypes.GroupId
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.GroupId
    }).sort(compareResourceOther)
}

function getResourcesCheckCisItem402(resources, excludedResources) {
    let resourceType = resourceTypes.GroupId
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.GroupId
    }).sort(compareResourceOther)
}

function getResourcesCheckCisItem403(resources, excludedResources) {
    let resourceType = resourceTypes.GroupId
    return getResourcesCheckCisItemCommon(resources, excludedResources, resourceType, function(resource) {
        return resource.DetectionItem.AbnormalitySecurityGroups
    }).sort(compareResourceOther)
}

let functionCallBack = {
    "CHECK_CIS12_ITEM_1_02": getResourcesCheckCisItem102,
    "CHECK_CIS12_ITEM_1_03": getResourcesCheckCisItem103,
    "CHECK_CIS12_ITEM_1_04": getResourcesCheckCisItem104,
    "CHECK_CIS12_ITEM_1_16": getResourcesCheckCisItem116,
    "CHECK_CIS12_ITEM_1_19": getResourcesCheckCisItem119,
    "CHECK_CIS12_ITEM_1_21": getResourcesCheckCisItem121,
    "CHECK_CIS12_ITEM_1_22": getResourcesCheckCisItem122,
    "CHECK_CIS12_ITEM_2_02": getResourcesCheckCisItem202,
    "CHECK_CIS12_ITEM_2_03": getResourcesCheckCisItem203,
    "CHECK_CIS12_ITEM_2_04": getResourcesCheckCisItem204,
    "CHECK_CIS12_ITEM_2_06": getResourcesCheckCisItem206,
    "CHECK_CIS12_ITEM_2_07": getResourcesCheckCisItem207,
    "CHECK_CIS12_ITEM_2_08": getResourcesCheckCisItem208,
    "CHECK_CIS12_ITEM_2_09": getResourcesCheckCisItem209,
    "CHECK_CIS12_ITEM_4_01": getResourcesCheckCisItem401,
    "CHECK_CIS12_ITEM_4_02": getResourcesCheckCisItem402,
    "CHECK_CIS12_ITEM_4_03": getResourcesCheckCisItem403
}

function getExcludedResourcesByCheckCodeItem(checkCodeItem, resouces, excludedResources) {
    return functionCallBack[checkCodeItem](resouces, excludedResources)
}

export default {
    "getExcludedResourcesByCheckCodeItem": getExcludedResourcesByCheckCodeItem
}
