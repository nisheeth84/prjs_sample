/**
 * Enum manipulation type group
 */
export const MANIPULATION_TYPE = {
  MY_GROUP: 'my-group',
  SHARE_GROUP: 'share-group',
};

/**
 * Enum status manipulation group
 */
export const MANIPULATION_STATUS = {
  EDIT: 'edit',
  COPY: 'copy',
  CREATE: 'create',
  CHANGE_TO_SHARE_GROUP: 'change_to_share_group',
  CREATE_FROM_LEFT_MENU: 'creat_from_left_menu'
};

/**
 * Enum status display
 */
export const DISPLAY_STATUS = {
  ALL_EMPLOYEE: 'ALL_EMPLOYEE',
  FILTER_DEPARTMENT: 'FILTER_DEPARTMENT',
  RETIRE_EMPLOYEE: 'RETIRE_EMPLOYEE',
  FILTER_MY_GROUP: 'FILTER_MY_GROUP',
  FILTER_SHARE_GROUP: 'FILTER_SHARE_GROUP',
};

/**
 * Type member
 */
export const TYPE_MEMBER = {
  MEMBER: 1,
  OWNER: 2,
};

/**
 * query for get field information of personal
 */
export const QUERY_FIELD_INFO_PERSONALS = (
  fieldBelong: number,
  extentionBelong: number
) => ({
  query: `{
    fieldInfoPersonals(fieldBelong:${fieldBelong}, extentionBelong:${extentionBelong}) {
      fieldId
      fieldName
      fieldLabel
      fieldType
      fieldOrder
      isDoubleColumn
      doubleColumnOption
      searchType
      searchOption
      columnWidth
      isColumnFixed
      required
      isDefault
      isAvailable
      isModify
      isMobileModify
      ownPermissionLevel
      othersPermissionLevel
      urlTarget
      urlEncode
      urlText
      iframeHeight
      isLineNameDisplay
      configValue
      decimalPlace
      fieldItems{
        itemId
        itemLabel
        itemOrder
        isDefault
      }
    }
  }`,
});

/**
 * query get initialize local menu
 */
export const QUERY_INITIALIZE_LOCAL_MENU = {
  query: `query {
    initializeLocalMenu {
      departments {
        ...DepartmentFields
        ...DepartmentsRecursive
      }
      myGroups {
        groupId
        groupName
        isAutoGroup
      }
      sharedGroups {
        groupId
        groupName
        isAutoGroup
        participantType
      }
    }
  }
  fragment DepartmentsRecursive on Department {
    departmentChild {
      ...DepartmentFields
      departmentChild {
        ...DepartmentFields
        departmentChild {
          ...DepartmentFields
          departmentChild {
            ...DepartmentFields
            departmentChild {
              ...DepartmentFields
              departmentChild {
                ...DepartmentFields
                departmentChild {
                  ...DepartmentFields
                  departmentChild {
                    ...DepartmentFields
                    departmentChild {
                      ...DepartmentFields
                      departmentChild {
                        ...DepartmentFields
                        departmentChild {
                          ...DepartmentFields
                          departmentChild {
                            ...DepartmentFields
                            departmentChild {
                              ...DepartmentFields
                              departmentChild {
                                ...DepartmentFields
                                departmentChild {
                                  ...DepartmentFields
                                  departmentChild {
                                    ...DepartmentFields
                                    departmentChild {
                                      ...DepartmentFields
                                      departmentChild {
                                        ...DepartmentFields
                                        departmentChild {
                                          ...DepartmentFields
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  fragment DepartmentFields on Department {
    departmentId
    departmentName
    parentId
    departmentOrder
    updatedDate
  }`,
};

/**
 * query update auto group
 */
export const QUERY_UPDATE_AUTO_GROUP = (groupId: number) => {
  const query = {
    query: `mutation {
      updateAutoGroup(groupId: ${groupId})
    }`,
  };
  return query;
};

/**
 * query delete group
 */
export const QUERY_DELETE_GROUP = (groupId: number) => {
  const query = {
    query: `mutation {
      deleteGroup(groupId: ${groupId})
    }`,
  };
  return query;
};

/**
 * query edit group
 */
export const PARAM_UPDATE_GROUP = (
  groupId: number,
  groupName: string,
  groupType: number,
  isAutoGroup: boolean,
  isOverWrite: boolean,
  updatedDate: any,
  searchConditions: any
) => {
  const query = {
    query: `mutation {
      updateGroup(
        groupParams: {
          groupId: ${groupId},
          groupName: "${groupName}", 
          groupType: ${groupType},
          isAutoGroup: ${isAutoGroup},
          isOverWrite: ${isOverWrite},
          updatedDate: "${updatedDate}",
          searchConditions: ${JSON.stringify(searchConditions).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )}
        }
      )
    }`,
  };
  return query;
};

/**
 * query create share group
 */
export const PARAM_CREATE_GROUP = (
  groupName: string,
  groupType: number,
  isAutoGroup: boolean,
  isOverWrite: boolean,
  groupMembers: any,
  groupParticipants: any,
  searchConditions: any
) => {
  const query = {
    query: `mutation {
      createGroup (
        groupParams : {
          groupName: "${groupName}",
          groupType: ${groupType},
          isAutoGroup: ${isAutoGroup},
          isOverWrite: ${isOverWrite},
          groupMembers: ${JSON.stringify(groupMembers).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )},
          groupParticipants: ${JSON.stringify(groupParticipants).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )},
          searchConditions: ${JSON.stringify(searchConditions).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )}
        }
      )
    }`,
  };
  return query;
};

/**
 * query get info group
 */
export const QUERY_GET_INFO_GROUP = (groupId: number[]) => {
  const query = {
    query: `
  {
    getGroups(
      groupIds : ${groupId},
      getEmployeesFlg : true
    ){
      groups{
        groupId
        groupName
        groupType
        isAutoGroup
        employeeIds
        updatedDate
      }
      employees{
        employeeId 
        photoFileName 
        photoFilePath 
        employeeSurname
        employeeName 
        employeeSurnameKana 
        employeeNameKana 
        email 
        telephoneNumber 
        cellphoneNumber 
        userId 
        languageId 
        timezoneId 
        employeeStatus 
        employeeData 
        createdDate
        createdUser
        updatedDate
        updatedUser
      }
    }
  }`,
  };
  return query;
};

/**
 * query get initialize group group
 */
export const QUERY_INITIALIZE_GROUP_MODAL = {
  query: `{
    initializeGroupModal( groupId: null, isOwnerGroup: true, isAutoGroup: false) {
      group {
        groupId
        groupName
        groupType
        isAutoGroup
        isOverWrite
        updatedDate
      },
      groups {
        groupId
        groupName
        groupType
        isAutoGroup
        isOverWrite
        updatedDate
      },
      groupParticipants {
        groupId
        employeeId
        departmentId
        participantGroupId
        participantType
        updatedDate
      },
      searchConditions {
        groupId
        fieldId
        searchType
        searchOption
        searchValue
        fieldOrder
      },
      customFields {
        fieldId
        fieldName
        fieldType
        fieldOrder
        isDefault
        isDoubleColumn
        ownPermissionLevel
        othersPermissionLevel
        urlTarget
        urlText
        configValue
        decimalPlace
        updatedDate
        fieldItems {
          itemId
          isAvailable
          itemOrder
          isDefault
        }
      }
    }
  }`,
};

// query get employees suggestion group
export const QUERY_EMPLOYEES_SUGGESTION = (keyWords: string) => {
  const query = {
    query: `
      query {
        employeesSuggestion(keyWords: "${keyWords}", startTime: "", endTime: "", searchType: null) {
          departments {
            departmentId
            departmentName
            parentDepartment {
              departmentId
              departmentName
            }
            employeesDepartments {
              employeeId
              photoFileName,
              photoFilePath,
              employeeSurname
              employeeName
              employeeSurnameKana
              employeeNameKana
              departments {
                departmentId
                departmentName
                positionId
                positionName
              }
            }
          }
          employees {
            employeeId
            photoFileName,
            photoFilePath,
            employeeSurname
            employeeName
            employeeSurnameKana
            employeeNameKana
            departments {
              departmentId
              departmentName
              positionId
              positionName
            }
          }
          groups {
            groupId
            groupName
          }
        }
      }`,
  };
  return query;
};

/**
 * query get employee basic information
 */
export const QUERY_GET_INFO_BASIC_INFORMATION = (id: number) => {
  const query = {
    query: `query {
    employee(employeeId : ${id}, mode: "detail")
    {
      fields {
        fieldId
        fieldName
        fieldType
        fieldOrder
        required
        isDefault
        isDoubleColumn
        doubleColumnOption
        isAvailable
        isModify
        isMobileModify
        searchType
        searchOption
        ownPermissionLevel
        othersPermissionLevel
        urlTarget
        urlEncode
        urlText
        iframeHeight
        isLineNameDisplay
        configValue
        decimalPlace
        labelJaJp
        labelEnUs
        labelZhCn
        fieldItems {
          itemId
          isAvailable
          itemOrder
          isDefault
          labelJaJp
          labelEnUs
          labelZhCn
          itemLabel
          itemParentId
        }
      }
      data {
        employeeIcon {
          fileName
          filePath
        }
        employeeDepartments {
          departmentId
          departmentName
          departmentOrder
          positionId
          positionName
          positionOrder
        }
        employeeSurname
        employeeName
        employeeSurnameKana
        employeeNameKana
        email
        telephoneNumber
        cellphoneNumber
        employeeManagers {
          employeeId
          employeeIcon
          employeeName
          managerId
          departmentName
        }
        employeeSubordinates {
          employeeIcon
          employeeId
          employeeName
        }
        employeesSubscriptions  {
          subscriptionsId
          subscriptionsName
        }
        userId
        languageId
        timezoneId
        employeeStatus
        employeeData{
          fieldType
          key
          value
        }
        updatedDate
      }
      tabsInfo {
        tabId
        tabOrder
        isDisplay
        isDisplaySummary
        maxRecord
        updatedDate
        labelName
        }
    }
  }`,
  };
  return query;
};

/**
 * query add group
 */
export const QUERY_ADD_GROUP = (groupId: number, listEmployeeId: number[]) => {
  const query = {
    query: `mutation {
      addGroup(groupId : ${groupId}, employeeIds : ${JSON.stringify(
      listEmployeeId
    ).replace(/"(\w+)"\s*:/g, '$1:')})
    }`,
  };
  return query;
};

/**
 * query move group
 */
export const QUERY_MOVE_GROUP = (
  sourceGroupId: number,
  destGroupId: number,
  employeeIds: any
) => {
  const query = {
    query: `mutation {
      moveGroup(sourceGroupId : ${sourceGroupId}, destGroupId : ${destGroupId}, employeeIds : ${JSON.stringify(
      employeeIds
    ).replace(/"(\w+)"\s*:/g, '$1:')})
    }`,
  };
  return query;
};

/**
 * query leave group
 */
export const QUERY_LEAVE_GROUP = (
  groupId: number,
  listEmployeeId: number[]
) => {
  const query = {
    query: `mutation {
      leaveGroup(groupId : ${groupId}, employeeIds : ${listEmployeeId})
    }`,
  };
  return query;
};

/**
 * query add favorite timeline group
 */
export const QUERY_ADD_FAVORITE_TIMELINE_GROUP = (
  timelineGroupId: number,
  userLoginId: number
) => {
  const query = {
    query: `
      query{
        addFavoriteTimelineGroup(timelineGroupId: ${timelineGroupId}, userLoginId: ${userLoginId})
      }
    `,
  };
  return query;
};

/**
 * query delete favorite timeline group
 */
export const QUERY_DELETE_FAVORITE_TIMELINE_GROUP = (
  timelineGroupId: number,
  userLoginId: number
) => {
  const query = {
    query: `
      query{
        deleteFavoriteTimelineGroup(timelineGroupId: ${timelineGroupId}, userLoginId: ${userLoginId})
      }
    `,
  };
  return query;
};

export interface TimelineGroupInvite {
  timelineGroupId: number;
  inviteType: number;
  inviteId: number;
  status: number;
  authority: number;
}

/**
 * query register group
 */
export const QUERY_REGISTER_GROUP = (
  employeeId: number,
  timelineGroupInvites?: TimelineGroupInvite[]
) => {
  const query = {
    query: `
      query{
        addMemberToTimelineGroup
        (employeeId: ${employeeId}, 
        timelineGroupInvites: ${timelineGroupInvites})
      }
    `,
  };
  return query;
};

/**
 * query for register follow employee
 */
export const QUERY_REGISTER_FOLLOW = (
  employeeId: number,
  watchTargetType: number,
  watchTargetId: number
) => {
  const query = {
    query: `
      query{
        createWatch
        (employeeId: ${employeeId}, 
          watchTargetType: ${watchTargetType},
          watchTargetId: ${watchTargetId})
      }
    `,
  };
  return query;
};

/**
 * query for remove register follow employee
 */
export const QUERY_REMOVE_REGISTER_FOLLOW = (
  employeeId: number,
  watchId: number
) => {
  const query = {
    query: `
      query{
        deleteWatch
        (employeeId: ${employeeId}, 
          watchId: ${watchId})
      }
    `,
  };
  return query;
};

