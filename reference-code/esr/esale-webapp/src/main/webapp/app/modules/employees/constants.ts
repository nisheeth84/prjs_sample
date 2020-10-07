export const EMPLOYEE_LIST_ID = 'EMPLOYEE_LIST_ID';
export const GET_LOG_ACCESS = 'GET_LOG_ACCESS';

export const DEPARTMENT_REGIST_EDIT_SCREEN = 'department-regist-edit';

export const EMPLOYEE_DEF = {
  EXTENSION_BELONG_LIST: 1,
  EXTENSION_BELONG_SEARCH: 2
};

export const SELECT_TARGET_TYPE = {
  ALL_EMPLOYEE: 0,
  EMPLOYEE_QUIT_JOB: 1,
  DEPARTMENT: 2,
  GROUP: 3,
  SHARE_GROUP: 4
};

export const SHOW_MESSAGE_SUCCESS = {
  NONE: 0,
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3,
  UPDATE_LICENSE: 4
};
/**
 * Please don't add new item on here, just use for add/edit screen (double column)
 */
export const EMPLOYEE_SPECIAL_FIELD_NAMES = {
  employeeDepartments: 'employee_departments',
  employeePositions: 'employee_positions',
  employeeSurname: 'employee_surname',
  employeeSurnameKana: 'employee_surname_kana',
  employeeName: 'employee_name',
  employeeNameKana: 'employee_name_kana'
};

export const PRODUCT_TRADINGS_SPECIAL_FIELD_NAMES = {
  price: 'price'
};

/**
 * Special item emloyee
 */
export const EMPLOYEE_SPECIAL_LIST_FIELD = {
  employeeDepartments: 'employee_departments',
  employeePositions: 'employee_positions',
  employeeSurname: 'employee_surname',
  employeeSurnameKana: 'employee_surname_kana',
  employeeName: 'employee_name',
  employeeNameKana: 'employee_name_kana',
  employeeManager: 'employee_managers',
  employeeIcon: 'employee_icon',
  employeeLanguage: 'language_id',
  employeeSubordinates: 'employee_subordinates',
  employeeTimeZone: 'timezone_id',
  employeeTelephoneNumber: 'telephone_number',
  employeeEmail: 'email',
  employeeCellphoneNumber: 'cellphone_number',
  employeeUserId: 'user_id',
  employeePackages: 'employee_packages',
  employeeAdmin: 'is_admin'
};

export const PRODUCT_SPECIAL_LIST_FIELD = {
  productName: 'product_name'
};
export const TASK_SPECIAL_LIST_FIELD = {
  milestoneName: 'milestone_name',
  operatorId: 'operator_id'
};

export const EDIT_SPECIAL_ITEM = {
  NAME: 'name',
  KANA: 'kana',
  DEPARTMENT: 'deparment',
  LANGUAGE: 'language',
  SUBORDINATES: 'subordinates'
};

export const SEARCH_MODE = {
  NONE: 0,
  TEXT_DEFAULT: 1,
  CONDITION: 2
};
export const PARAM_GET_EMPLOYEES_LAYOUT = () =>
  `
  query {
    employeeLayout {
      fieldId
      defaultValue
      currencyUnit
      fieldName
      fieldType
      fieldOrder
      isDefault
      isDoubleColumn
      availableFlag
      modifyFlag
      urlTarget
      urlText
      urlType
      configValue
      decimalPlace
      maxLength
      fieldLabel
      tabData
      typeUnit
      lookupData {
        fieldBelong
        searchKey
        itemReflect {
          fieldId
          fieldLabel
          itemReflect
        }
      }
      relationData {
        fieldBelong
        fieldId
        format
        displayFieldId
        displayTab
        displayFields {
          fieldId
          fieldName
          relationId
          fieldBelong
        }
        asSelf
      }
      selectOrganizationData {
        format
        target
      }
      lookupFieldId
      fieldItems {
        itemId
        isAvailable
        itemOrder
        isDefault
        itemLabel
        itemParentId
      }
    }
  }
  `;

export const MENU_TYPE = {
  ALL_EMPLOYEES: 0,
  DEPARTMENT: 1,
  QUIT_JOB: 2,
  MY_GROUP: 3,
  SHARED_GROUP: 4
};

export const PARTICIPANT_TYPE = {
  MEMBER: 1,
  OWNER: 2
};

export const GROUP_TYPE = {
  CARD: 'Group Card',
  SALE_LIST_CARD: 'Sale list card'
};

export const DND_DEPARTMENT_TYPE = {
  CARD: 'DepartmentCard'
};

export const DELETE_EMPLOYEES_MESSAGE_CODE = {
  countDepartments: 'ERR_EMP_0039',
  countEmployees: 'ERR_EMP_0038',
  countGroups: 'ERR_EMP_0040',
  countSchedules: 'ERR_EMP_0008',
  countCustomers: 'ERR_EMP_0015',
  countTodos: 'ERR_EMP_0009',
  countActivities: 'ERR_EMP_0010',
  countSaleProducts: 'ERR_EMP_0011',
  countNameCards: 'ERR_EMP_0012',
  countAnalysisReports: 'ERR_EMP_0013',
  countOcrNameCards: 'ERR_EMP_0014'
};

export const PARAM_GET_EMPLOYEE = prarams =>
  `
  query {
    employee(employeeId: ${prarams.employeeId}, mode : "edit")
    {
        fields {
                fieldId
                defaultValue
                currencyUnit
                fieldName
                fieldType
                fieldOrder
                isDefault
                isDoubleColumn
                availableFlag
                modifyFlag
                urlType
                urlTarget
                urlText
                urlType
                configValue
                decimalPlace
                maxLength
                fieldLabel
                tabData
                typeUnit
                linkTarget
                iframeHeight
                fieldGroup
                lookupData {
                  fieldBelong
                  searchKey
                  itemReflect {
                    fieldId
                    fieldLabel
                    itemReflect
                  }
                }
                relationData {
                  fieldBelong
                  fieldId
                  format
                  displayFieldId
                  displayTab
                  displayFields {
                    fieldId
                    fieldName
                    relationId
                    fieldBelong
                  }
                  asSelf
                }
                selectOrganizationData {
                  format
                  target
                }
                lookupFieldId
                fieldItems {
                        itemId
                        isAvailable
                        itemOrder
                        isDefault
                        itemLabel
                        itemParentId
                }
        }
        data {
            userId
            employeeIcon {
                fileName
                filePath
                fileUrl
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
              employeeIcon {
                fileName
                filePath
                fileUrl
              }
              employeeName
              managerId
              departmentName
            }
            employeeSubordinates  {
                employeeIcon {
                  fileName
                  filePath
                  fileUrl
                }
                employeeId
                employeeName
            }
            employeePackages  {
              packagesId
              packagesName
            }
            isAdmin
            isAccessContractSite
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
    }
  }
  `;

// employeeManagers {
//   employeeId
//   employeeIcon
//   employeeName
//   managerId
//   departmentName
// }

export const MOVE_TYPE = {
  TRANSFER: 1,
  CONCURRENT: 2
};

export const PARAM_CREATE_UPDATE_EMPLOYEE = (params, isUpdate) => {
  const query = {};
  // const functionCall = isUpdate ? 'updateEmployee' : 'createEmployee';
  // query['query'] = `
  //     mutation(
  //       ${isUpdate ? '$employeeId: Long,' : ''}
  //       $data : CreateUpdateEmployeeIn,
  //       $files : [Upload]
  //     ){
  //       ${functionCall}(
  //         ${isUpdate ? 'employeeId: $employeeId,' : ''}
  //         data: $data,
  //         fileInfos : $files
  //       )
  //     }`
  //   .replace(/"(\w+)"\s*:/g, '$1:')
  //   .replace(/\n/g, '')
  //   .replace('  ', ' ');
  query['variables'] = params;
  return query;
};

// export const PARAM_CREATE_EMPLOYEE = (params, files) =>
//   `mutation{
//     createEmployee("data": ${JSON.stringify(params)}, "fileInfos": ${JSON.stringify(files)})
//     }`;

export const PARAM_UPDATE_CUSTOM_FIELD_INFO = (
  fieldBelong,
  deletedFields,
  fields,
  tabs,
  deletedFieldsTab,
  fieldsTab
) => ({
  fieldBelong,
  deletedFields,
  fields,
  tabs,
  deletedFieldsTab,
  fieldsTab
});

export const PARAM_GET_FIELD_INFO_PERSONAL = (fieldBelong, extensionBelong) => ({
  fieldBelong,
  extensionBelong
});

export const SHARE_GROUP_MODES = {
  // setting mode add condition search employee
  ADD_CONDITION_SEARCH_MANUAL: 1,
  ADD_CONDITION_SEARCH_AUTO: 2,
  // actions with group
  MODE_CREATE_GROUP: 1,
  MODE_EDIT_GROUP: 2,
  MODE_COPY_GROUP: 3,
  MODE_CREATE_GROUP_LOCAL: 4,
  MODE_SWICH_GROUP_TYPE: 5
};

export const GROUP_TYPES = {
  MY_GROUP: 1,
  SHARED_GROUP: 2
};

export const MY_GROUP_MODES = {
  MODE_CREATE_GROUP: 1,
  MODE_EDIT_GROUP: 2,
  MODE_COPY_GROUP: 3,
  MODE_SWICH_GROUP_TYPE: 4
};

export const PARAM_GET_CUSTOM_FIELD_INFO = fieldBelong => ({ fieldBelong });

export const PARAM_GET_EMPLOYEE_LAYOUT_PERSIONAL = extensionBelong =>
  `query {
    employeeLayoutPersonal(extensionBelong: ${extensionBelong})
    {
      fieldId
      fieldBelong
      fieldName
      fieldLabel
      fieldType
      fieldOrder
      isDefault
      maxLength
      modifyFlag
      availableFlag
      isDoubleColumn
      defaultValue
      currencyUnit
      typeUnit
      decimalPlace
      urlType
      urlTarget
      urlText
      linkTarget
      configValue
      isLinkedGoogleMap
      fieldGroup
      lookupData {
        fieldBelong
        searchKey
          itemReflect {
              fieldId
              fieldLabel
              itemReflect
          }
      }
      relationData {
        fieldBelong
        fieldId
        format
        displayFieldId
        displayTab
        displayFields {
          fieldId
          fieldName
          relationId
          fieldBelong
        }
        asSelf
      }
      tabData
      createdDate
      createdUser
      updatedDate
      updatedUser
      fieldItems {
          itemId
          isAvailable
          itemOrder
          isDefault
          itemLabel
          updatedDate
      }
    }
  }
`;
export const PARAM_GET_EMPLOYEE_LIST = (
  searchConditions,
  filterConditions,
  localSearchKeyword,
  selectedTargetType,
  selectedTargetId,
  isUpdateListView,
  orderBy,
  offset,
  limit
) =>
  `query {
    employees(
      searchConditions: ${JSON.stringify(searchConditions).replace(/"(\w+)"\s*:/g, '$1:')},
    filterConditions: ${JSON.stringify(filterConditions).replace(/"(\w+)"\s*:/g, '$1:')},
    localSearchKeyword: ${localSearchKeyword},
    selectedTargetType: ${selectedTargetType},
    selectedTargetId: ${selectedTargetId},
    isUpdateListView: ${isUpdateListView},
    orderBy: ${JSON.stringify(orderBy).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )}, offset: ${offset}, limit: ${limit}) {
      permittedModify
      totalRecords
      employees {
        employeeIcon {
          fileUrl
          filePath
          fileName
        }
        employeeId
        employeeDepartments {
          departmentId
          departmentName
          positionId
          positionName
          employeeId
          employeeFullName
          pathTreeName
        }
        employeeGroups {
          groupId
          groupName
        }
        employeeSurname
        employeeName
        employeeSurnameKana
        employeeNameKana
        email
        telephoneNumber
        cellphoneNumber
        employeeSubordinates {
          employeeId
          employeeFullName
          employeeSurname
          employeeName
          employeeSurnameKana
          employeeNameKana
        }
        userId
        language {
          languageId
          languageName
        }
        timezone{
          timezoneId
          timezoneShortName
          timezoneName
        }
        employeeStatus
        employeeData {
          fieldType
          key
          value
        }
        createdDate
        createdUser
        updatedDate
        updatedUser
      }
      department {
        departmentId
        departmentName
        managerId
        managerName
      }
    }
  }`;

// export const PARAM_UPDATE_EMPLOYEE = (employees, employeeId, files) =>
//   `mutation {
//     updateEmployee(employeeId: ${employeeId}, data: ${JSON.stringify(employees).replace(
//     /"(\w+)"\s*:/g,
//     '$1:'
//   )}, fileInfos: ${JSON.stringify(files)})
//   }`;

export const PARAM_UPDATE_CUSTOM_FIELD_INFO_PERSONAL = () => {};

export const INITIALIZE_INVITE_MODAL = () =>
  `{
  initializeInviteModal{
    departments {
      departmentId
      departmentName
    },
    packages{
      packageId
      packageName
      remainPackages
    }
  }
}`;

export const INVITE_EMPLOYEES = inviteEmployee =>
  `mutation {
  inviteEmployees(
    employees: ${JSON.stringify(inviteEmployee).replace(/"(\w+)"\s*:/g, '$1:')}){
      employees {
        memberName
        emailAddress
        isSentEmailError
    }
  }
}`;

export const PARAM_GET_EMPLOYEE_SUGGEST = (keyWords, startTime, endTime, searchType) =>
  `query {
    employeesSuggestion(keyWords: ${JSON.stringify(keyWords)}, startTime: ${JSON.stringify(
    startTime
  )}, endTime: ${JSON.stringify(endTime)}, searchType: ${searchType}) {
      departments {
        departmentId
        departmentName
        parentDepartment {
          departmentId
          departmentName
        }
        employeesDepartments {
          employeeId
          photoFileName
          photoFilePath
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
        employeeIcon {
          fileName
          filePath
        }
        employeeDepartments {
          departmentId
          departmentName
          positionId
          positionName
        }
        employeeSurname
        employeeName
        employeeSurnameKana
        employeeNameKana
      }
      groups {
        groupId
        groupName
      }
    }
  }`;

export const PARAM_GET_SELECTED_ORGANIZATIONINFO = (departmentIds, groupIds, employeeIds) =>
  `query{
    selectedOrganizationInfo(employeeId: ${JSON.stringify(
      employeeIds
    )}, departmentId: ${JSON.stringify(departmentIds)}, groupId: ${JSON.stringify(groupIds)}){
        employee{
            employeeId
            photoFilePath
            photoFileName
            photoFileUrl
            employeeSurname
            employeeName
            departments {
                departmentId
                departmentName
                positionId
                positionName
            }
        }
        departments{
            departmentId
            departmentName
            parentDepartment{
                departmentId
                departmentName
            }
            employeeIds
        }
        groupId{
            groupId
            groupName
            employeeIds
        }
        employees{
            employeeId
            employeeSurname
            employeeName
        }
    }
  }
  `;

export const DUMMY_GET_LOG_ACCESS = {
  data: {
    getAccessLogs: {
      accessLogs: [
        {
          accessLogId: 2,
          content: {
            dateTime: '2019-03-13',
            employeeId: null,
            accountName: 'datdv',
            ipAddress: '192.168.1.171',
            event: 'hh',
            result: null,
            errorInformation: 'Validate_errror',
            entityId: 1002,
            additionalInformation: 'VALIDATE_ERROR'
          },
          updatedDate: '2020-06-09T07:07:45Z'
        },
        {
          accessLogId: 1,
          content: {
            dateTime: '2019-03-13',
            employeeId: null,
            accountName: 'datdv',
            ipAddress: '192.168.1.171',
            event: 'hh',
            result: null,
            errorInformation: 'Validate_errror',
            entityId: 1002,
            additionalInformation: 'VALIDATE_ERROR'
          },
          updatedDate: '2020-06-09T06:42:45Z'
        }
      ],
      totalCount: 2,
      initializeInfo: {
        initializeInfo: null,
        fields: null
      }
    }
  }
};

export const DUMMY_LICENSES = {
  subscriptions: [
    {
      subscriptionId: '1',
      subscriptionName: 'ABC',
      remainLicenses: '2'
    },
    {
      subscriptionId: '2',
      subscriptionName: 'DEF',
      remainLicenses: '3'
    },
    {
      subscriptionId: '3',
      subscriptionName: 'GHI',
      remainLicenses: '4'
    },
    {
      subscriptionId: '4',
      subscriptionName: 'KLM',
      remainLicenses: '5'
    }
  ]
};

export const DUMMY_OPTIONS = {
  options: [
    {
      optionId: '1',
      optionName: '123',
      remainLicenses: '1'
    },
    {
      optionId: '2',
      optionName: '456',
      remainLicenses: '2'
    },
    {
      optionId: '3',
      optionName: '789',
      remainLicenses: '3'
    },
    {
      optionId: '4',
      optionName: '000',
      remainLicenses: '4'
    }
  ]
};

export const PARAM_CREATE_SHARE_GROUP = (
  groupName,
  groupType,
  isAutoGroup,
  isOverWrite,
  groupMembersParam,
  groupParticipantsParam,
  searchConditionsParam
) =>
  `mutation {
    createGroup (
      groupParams : {
        groupName : "${groupName}",
        groupType : ${groupType},
        isAutoGroup : ${isAutoGroup},
        isOverWrite : ${isOverWrite},
        groupMembers : ${JSON.stringify(groupMembersParam).replace(/"(\w+)"\s*:/g, '$1:')},
        groupParticipants : ${JSON.stringify(groupParticipantsParam).replace(
          /"(\w+)"\s*:/g,
          '$1:'
        )},
        searchConditions : ${JSON.stringify(searchConditionsParam).replace(/"(\w+)"\s*:/g, '$1:')}
      }
    )
  }`;

export const PARAM_UPDATE_SHARE_GROUP = (
  groupId,
  groupName,
  groupType,
  isAutoGroup,
  isOverWrite,
  groupParticipantsParam,
  searchConditionsParam,
  updatedDate
) =>
  `mutation {
  updateGroup (
    groupParams : {
      groupId : ${groupId}
      groupName : "${groupName}",
      groupType : ${groupType},
      isAutoGroup : ${isAutoGroup},
      isOverWrite : ${isOverWrite},
      updatedDate : "${updatedDate}",
      groupParticipants : ${JSON.stringify(groupParticipantsParam).replace(/"(\w+)"\s*:/g, '$1:')},
      searchConditions : ${JSON.stringify(searchConditionsParam).replace(/"(\w+)"\s*:/g, '$1:')}
    }
  )
}`;

// export const PARAM_UPDATE_EMPLOYEES = employees => {
//   const query = {};
//   query['query'] = `
//       mutation(
//         $employees : [UpdateEmployeesIn],
//         $files : [Upload]
//       ){
//         updateEmployees(
//           employees: $employees,
//           fileInfos : $files
//         )
//       }`
//     .replace(/"(\w+)"\s*:/g, '$1:')
//     .replace(/\n/g, '')
//     .replace('  ', ' ');
//   query['variables'] = employees;
//   return query;
// };

// export const PARAM_UPDATE_EMPLOYEES = employees =>
//   `mutation {
//     updateEmployees(employees: ${JSON.stringify(employees).replace(/"(\w+)"\s*:/g, '$1:')})
//   }`;

export const PARAM_LEAVE_GROUP = (groupId, employeeIds) =>
  `mutation {
    leaveGroup(groupId: ${groupId}, employeeIds: ${JSON.stringify(employeeIds).replace(
    /"(\w+)"\s*:/g,
    '$1:'
  )})
  }`;

export const PARAM_DELETE_DEPARTMENT = departmentId =>
  `mutation {
    deleteDepartment(departmentId: ${departmentId})
  }`;

export const PARAM_CHANGE_DEPARTMENT_ORDER = departmentParams =>
  `mutation {
    changeDepartmentOrder(departmentParams: ${JSON.stringify(departmentParams).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )})
  }`;

export const PARAM_MOVE_TO_DEPARTMENT = (departmentId, employeeIds, moveType) =>
  `mutation {
    moveToDepartment (
      departmentId: ${departmentId},
      employeeIds: ${JSON.stringify(employeeIds).replace(/"(\w+)"\s*:/g, '$1:')},
      moveType: ${moveType}
    )
  }`;

export const PARAM_DOWNLOAD_EMPLOYEES = (employeeIds, orderBy) =>
  `query {
    downloadEmployees (
      employeeIds: ${JSON.stringify(employeeIds).replace(/"(\w+)"\s*:/g, '$1:')},
      orderBy: ${JSON.stringify(orderBy).replace(/"(\w+)"\s*:/g, '$1:')}
    )
  }`;

export const PARAM_CREATE_GROUP = (
  groupName: string,
  groupType: number,
  isAutoGroup: boolean,
  isOverWrite: boolean,
  groupMembers: any,
  groupParticipants: any,
  searchConditions: any
) =>
  `mutation {
    createGroup(
      groupParams: {
        groupName: ${JSON.stringify(groupName).replace(/"(\w+)"\s*:/g, '$1:')},
        groupType: ${groupType},
        isAutoGroup: ${isAutoGroup},
        isOverWrite: ${isOverWrite},
        groupMembers: ${JSON.stringify(groupMembers).replace(/"(\w+)"\s*:/g, '$1:')},
        groupParticipants: ${JSON.stringify(groupParticipants).replace(/"(\w+)"\s*:/g, '$1:')},
        searchConditions: ${JSON.stringify(searchConditions).replace(/"(\w+)"\s*:/g, '$1:')}
      }
    )
}`;

export const PARAM_UPDATE_GROUP = (
  groupId: number,
  groupName: string,
  groupType: number,
  isAutoGroup: boolean,
  isOverWrite: boolean,
  updatedDate: any,
  searchConditions: any
) =>
  `mutation {
    updateGroup(
      groupParams: {
        groupId: ${groupId},
        groupName: ${JSON.stringify(groupName).replace(/"(\w+)"\s*:/g, '$1:')},
        groupType: ${groupType},
        isAutoGroup: ${isAutoGroup},
        isOverWrite: ${isOverWrite},
        updatedDate: "${updatedDate}",
        searchConditions: ${JSON.stringify(searchConditions).replace(/"(\w+)"\s*:/g, '$1:')}
      }
    )
}`;

export const PARAM_ADD_TO_GROUP = (groupId: number, employeeIds: any) =>
  `mutation {
    addGroup(groupId : ${groupId}, employeeIds : ${JSON.stringify(employeeIds).replace(
    /"(\w+)"\s*:/g,
    '$1:'
  )})
  }`;

export const PARAM_CREATE_DEPARTMENT = (departmentName, managerId, parentId) =>
  `mutation {
    createDepartment(departmentName: ${departmentName}, managerId: ${managerId}, parentId: ${parentId})
  }`;

export const PARAM_UPDATE_DEPARTMENT = (
  departmentId,
  departmentName,
  managerId,
  parentId,
  updatedDate
) =>
  `mutation {
    updateDepartment(departmentId: ${departmentId}, departmentName: ${departmentName}, managerId: ${managerId}, parentId: ${parentId}, updatedDate: "${updatedDate}")
  }`;

export const PARAM_INITIALIZE_MANAGER_MODAL = employeeIds =>
  `query {
    initializeManagerModal(employeeIds: ${JSON.stringify(employeeIds).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )}) {
      employees {
          employeeId
          employeeName
          employeeSurname
          departments {
              departmentId
              departmentName
              managerId
              managerName
          }
      }
      departments {
          departmentId
          departmentName
          departmentUpdates {
              employeeId
              updatedDate
          }
          managerId
          managerName
      }
      managers {
          employeeId
          employeeSurname
          employeeName
      }
    }
  }`;

export const DUMMY_FIELD_INFO_PERSONALS_LIST = {
  fieldInfoPersonals: [
    {
      fieldId: '1',
      fieldName: 'employeeName',
      fieldLabel: '社員氏名',
      fieldType: '10',
      defaultValue: 'test',
      fieldOrder: '1',
      searchType: '1',
      searchOption: '1',
      fieldItems: []
    },
    {
      fieldId: '2',
      fieldName: 'departmentName',
      fieldLabel: '電話番号',
      fieldType: '10',
      fieldOrder: '2',
      searchType: '1',
      searchOption: '1',
      fieldItems: []
    },
    {
      fieldId: '3',
      fieldName: 'checkbox1',
      fieldLabel: '勝因',
      fieldType: '4',
      fieldOrder: '3',
      searchType: '1',
      searchOption: '1',
      fieldItems: [
        {
          itemId: '1',
          itemLabel: '趣味1',
          itemOrder: '1',
          isDefault: false
        },
        {
          itemId: '2',
          itemLabel: '趣味2',
          itemOrder: '2',
          isDefault: true
        },
        {
          itemId: '3',
          itemLabel: 'サービス',
          itemOrder: '3',
          isDefault: false
        }
      ]
    }
  ]
};

export const DUMMY_FIELD_INFO_PERSONALS_SEARCH = {
  fields: [
    {
      fieldId: '1',
      fieldName: 'employeeName',
      fieldLabel: '社員氏名',
      fieldType: '15',
      fieldOrder: '1',
      searchType: '1',
      searchOption: '1',
      fieldItems: []
    },
    {
      fieldId: '2',
      fieldName: 'departmentName',
      fieldLabel: '電話番号',
      fieldType: '10',
      fieldOrder: '2',
      searchType: '1',
      searchOption: '1',
      fieldItems: []
    },
    {
      fieldId: '3',
      fieldName: 'checkbox1',
      fieldLabel: '勝因',
      fieldType: '3',
      fieldOrder: '3',
      searchType: '1',
      searchOption: '1',
      fieldItems: [
        {
          itemId: '1',
          itemLabel: '趣味1',
          itemOrder: '1',
          isDefault: false
        },
        {
          itemId: '2',
          itemLabel: '趣味2',
          itemOrder: '2',
          isDefault: true
        },
        {
          itemId: '3',
          itemLabel: 'サービス',
          itemOrder: '3',
          isDefault: false
        }
      ]
    },
    {
      fieldId: '4',
      fieldName: 'checkbox1',
      fieldLabel: '勝因',
      fieldType: '4',
      fieldOrder: '4',
      searchType: '1',
      searchOption: '1',
      fieldItems: [
        {
          itemId: '1',
          itemLabel: '趣味1',
          itemOrder: '1',
          isDefault: false
        },
        {
          itemId: '2',
          itemLabel: '趣味2',
          itemOrder: '2',
          isDefault: true
        },
        {
          itemId: '3',
          itemLabel: 'サービス',
          itemOrder: '3',
          isDefault: false
        }
      ]
    }
  ]
};

export const DUMMY_CUSTOM_FIELD_INFO = {
  fields: [
    {
      fieldId: 1,
      fieldName: 'employeeName',
      fieldType: 2,
      fieldOrder: 1,
      required: true,
      isDefault: true,
      labelJaJp: '社員氏名',
      labelEnUs: '社員氏名',
      labelZhCn: '社員氏名'
    },
    {
      fieldId: 2,
      fieldName: 'departmentName',
      fieldType: 2,
      fieldOrder: 2,
      required: true,
      isDefault: true,
      labelJaJp: '電話番号',
      labelEnUs: '電話番号',
      labelZhCn: '電話番号'
    },
    {
      fieldId: 3,
      fieldName: 'checkbox1',
      fieldType: 2,
      fieldOrder: 4,
      required: true,
      isDefault: true,
      labelJaJp: '勝因',
      labelEnUs: '勝因',
      labelZhCn: '勝因'
    },
    {
      fieldId: 4,
      fieldName: 'employeeSurname',
      fieldType: 2,
      fieldOrder: 4,
      required: true,
      isDefault: true,
      labelJaJp: 'employee surname',
      labelEnUs: 'employee surname',
      labelZhCn: 'employee surname'
    },
    {
      fieldId: 5,
      fieldName: 'employeeSurnameKana',
      fieldType: 2,
      fieldOrder: 5,
      required: true,
      isDefault: true,
      labelJaJp: 'employee surname kana',
      labelEnUs: 'employee surname kana',
      labelZhCn: 'employee surname kana'
    },
    {
      fieldId: 6,
      fieldName: 'employeeNameKana',
      fieldType: 2,
      fieldOrder: 6,
      required: true,
      isDefault: true,
      labelJaJp: 'employee name kana',
      labelEnUs: 'employee name kana',
      labelZhCn: 'employee name kana'
    },
    {
      fieldId: 7,
      fieldName: 'positionName',
      fieldType: 2,
      fieldOrder: 7,
      required: true,
      isDefault: true,
      labelJaJp: 'positionName',
      labelEnUs: 'position name',
      labelZhCn: 'position name'
    },
    {
      fieldId: 8,
      fieldName: 'managerName',
      fieldType: 2,
      fieldOrder: 8,
      required: true,
      isDefault: true,
      labelJaJp: 'manager name',
      labelEnUs: 'manager name',
      labelZhCn: 'manager name'
    },
    {
      fieldId: 9,
      fieldName: 'staffName',
      fieldType: 2,
      fieldOrder: 9,
      required: true,
      isDefault: true,
      labelJaJp: 'staff name',
      labelEnUs: 'staff name',
      labelZhCn: 'staff name'
    },
    {
      fieldId: 10,
      fieldName: 'email',
      fieldType: 2,
      fieldOrder: 10,
      required: true,
      isDefault: true,
      labelJaJp: 'email',
      labelEnUs: 'email',
      labelZhCn: 'email'
    },
    {
      fieldId: 11,
      fieldName: 'telephoneNumber',
      fieldType: 2,
      fieldOrder: 11,
      required: true,
      isDefault: true,
      labelJaJp: 'telephone number',
      labelEnUs: 'telephone number',
      labelZhCn: 'telephone number'
    },
    {
      fieldId: 12,
      fieldName: 'cellphoneNumber',
      fieldType: 2,
      fieldOrder: 12,
      required: true,
      isDefault: true,
      labelJaJp: 'cellphone number',
      labelEnUs: 'cellphone number',
      labelZhCn: 'cellphone number'
    },
    {
      fieldId: 13,
      fieldName: 'userId',
      fieldType: 2,
      fieldOrder: 13,
      required: true,
      isDefault: true,
      labelJaJp: 'user id',
      labelEnUs: 'user id',
      labelZhCn: 'user id'
    },
    {
      fieldId: 14,
      fieldName: 'photoFileName',
      fieldType: 2,
      fieldOrder: 14,
      required: true,
      isDefault: true,
      labelJaJp: 'photo file name',
      labelEnUs: 'photo file namee',
      labelZhCn: 'photo file name'
    },
    {
      fieldId: 15,
      fieldName: 'photoFilePath',
      fieldType: 2,
      fieldOrder: 15,
      required: true,
      isDefault: true,
      labelJaJp: 'photo file path',
      labelEnUs: 'photo file path',
      labelZhCn: 'photo file path'
    },
    {
      fieldId: 16,
      fieldName: 'language',
      fieldType: 2,
      fieldOrder: 16,
      required: true,
      isDefault: true,
      labelJaJp: 'language',
      labelEnUs: 'language',
      labelZhCn: 'language'
    },
    {
      fieldId: 17,
      fieldName: 'timezoneName',
      fieldType: 2,
      fieldOrder: 17,
      required: true,
      isDefault: true,
      labelJaJp: 'timezone name',
      labelEnUs: 'timezone name',
      labelZhCn: 'timezone name'
    },
    {
      fieldId: 18,
      fieldName: 'checkbox1',
      fieldType: 2,
      fieldOrder: 18,
      required: true,
      isDefault: true,
      labelJaJp: 'checkbox_1',
      labelEnUs: 'checkbox_1',
      labelZhCn: 'checkbox_1'
    },
    {
      fieldId: 19,
      fieldName: 'date1',
      fieldType: 2,
      fieldOrder: 19,
      required: true,
      isDefault: true,
      labelJaJp: 'date_1',
      labelEnUs: 'date_1',
      labelZhCn: 'date_1'
    },
    {
      fieldId: 20,
      fieldName: 'number1',
      fieldType: 2,
      fieldOrder: 20,
      required: true,
      isDefault: true,
      labelJaJp: 'number_1',
      labelEnUs: 'number_1',
      labelZhCn: 'number_1'
    }
  ]
};

export const DUMMY_EMPLOYEE = {
  permittedModify: 'true',
  totalRecords: 123,
  employees: [
    {
      employeeId: '1',
      employeeSurname: 'Tran',
      employeeName: 'Hung',
      employeeSurnameKana: 'トフン',
      employeeNameKana: 'トフン',
      positionName: '社長',
      departmentName: '部署A、部署B',
      managerName: '社員１',
      staffName: '社員3、社員4、社員5',
      email: 'shain1@softbrain.co.jp',
      telephoneNumber: '0123-123-123',
      cellphoneNumber: '0123-123-123',
      userId: 'hungtv',
      photoFileName: '',
      photoFilePath: '',
      language: 'ja_jp',
      timezoneName: '',
      checkbox1: '趣味1',
      date1: '2019-12-25',
      number1: '60'
    },
    {
      employeeId: '2',
      employeeSurname: 'Nguyen',
      employeeName: 'Vu',
      employeeSurnameKana: 'nguyen',
      employeeNameKana: 'vu',
      positionName: '社長',
      departmentName: '部署C',
      managerName: '社員2',
      staffName: '社員6、社員7',
      email: 'shain2@softbrain.co.jp',
      telephoneNumber: '0123-222-111',
      cellphoneNumber: '0123-333-444',
      userId: 'vunv',
      photoFileName: '',
      photoFilePath: '',
      language: 'ja_jp',
      timezoneName: '',
      checkbox1: '趣味2',
      date1: '2019-12-22',
      number1: '10'
    }
  ]
};

export const PARAM_GET_EMPLOYEE_DETAIL = (employeeId, mode) => ({ employeeId, mode });
export const DUMMY_EMPLOYEE_DETAIL = {
  // fields: [
  //   {
  //     fieldId: 1,
  //     fieldName: 'employeeName',
  //     fieldType: 10,
  //     fieldOrder: 1,
  //     required: true,
  //     isDefault: false,
  //     isDoubleColumn: true,
  //     doubleColumnOption: 4,
  //     isAvailable: true,
  //     isModify: true,
  //     isMobileModify: false,
  //     imeType: 5,
  //     searchType: 6,
  //     searchOption: 7,
  //     ownPermissionLevel: 8,
  //     othersPermissionLevel: 9,
  //     urlTarget: 'urlTarget',
  //     urlEncode: 10,
  //     urlText: 'UrlText',
  //     iframeHeight: 'iframeHeight',
  //     isLineNameDisplay: true,
  //     configValue: 'configValue',
  //     decimalPlace: 11,
  //     labelJaJp: 'jaJp1',
  //     labelEnUs: 'enUs',
  //     labelZhCn: 'ZhCn',
  //     fieldItems: [
  //       {
  //         itemId: 1,
  //         isAvailable: true,
  //         itemOrder: 1,
  //         isDefault: false,
  //         labelJaJp: 'jaJp',
  //         labelEnUs: 'enUs',
  //         labelZhCn: 'zhCn',
  //         departmentId: null,
  //         departmentName: null,
  //         departmentOrder: null,
  //         parentId: null,
  //         managerId: null,
  //         positionId: null,
  //         positionName: null,
  //         positionOrder: null
  //       }
  //     ]
  //   },
  //   {
  //     fieldId: 2,
  //     fieldName: 'employeeSurname',
  //     fieldType: 10,
  //     fieldOrder: 2,
  //     required: true,
  //     isDefault: false,
  //     isDoubleColumn: true,
  //     doubleColumnOption: 4,
  //     isAvailable: true,
  //     isModify: true,
  //     isMobileModify: false,
  //     imeType: 5,
  //     searchType: 6,
  //     searchOption: 7,
  //     ownPermissionLevel: 8,
  //     othersPermissionLevel: 9,
  //     urlTarget: 'urlTarget',
  //     urlEncode: 10,
  //     urlText: 'UrlText',
  //     iframeHeight: 'iframeHeight',
  //     isLineNameDisplay: true,
  //     configValue: 'configValue',
  //     decimalPlace: 11,
  //     labelJaJp: 'jaJp2',
  //     labelEnUs: 'enUs',
  //     labelZhCn: 'ZhCn',
  //     fieldItems: [
  //       {
  //         itemId: 1,
  //         isAvailable: true,
  //         itemOrder: 1,
  //         isDefault: false,
  //         labelJaJp: 'jaJp',
  //         labelEnUs: 'enUs',
  //         labelZhCn: 'zhCn',
  //         departmentId: null,
  //         departmentName: null,
  //         departmentOrder: null,
  //         parentId: null,
  //         managerId: null,
  //         positionId: null,
  //         positionName: null,
  //         positionOrder: null
  //       }
  //     ]
  //   },
  //   {
  //     fieldId: 11,
  //     fieldName: 'employeeNameKana',
  //     fieldType: 10,
  //     fieldOrder: 11,
  //     required: true,
  //     isDefault: false,
  //     isDoubleColumn: true,
  //     doubleColumnOption: 4,
  //     isAvailable: true,
  //     isModify: true,
  //     isMobileModify: false,
  //     imeType: 5,
  //     searchType: 6,
  //     searchOption: 7,
  //     ownPermissionLevel: 8,
  //     othersPermissionLevel: 9,
  //     urlTarget: 'urlTarget',
  //     urlEncode: 10,
  //     urlText: 'UrlText',
  //     iframeHeight: 'iframeHeight',
  //     isLineNameDisplay: true,
  //     configValue: 'configValue',
  //     decimalPlace: 11,
  //     labelJaJp: 'jaJp1',
  //     labelEnUs: 'enUs',
  //     labelZhCn: 'ZhCn',
  //     fieldItems: [
  //       {
  //         itemId: 1,
  //         isAvailable: true,
  //         itemOrder: 1,
  //         isDefault: false,
  //         labelJaJp: 'jaJp',
  //         labelEnUs: 'enUs',
  //         labelZhCn: 'zhCn',
  //         departmentId: null,
  //         departmentName: null,
  //         departmentOrder: null,
  //         parentId: null,
  //         managerId: null,
  //         positionId: null,
  //         positionName: null,
  //         positionOrder: null
  //       }
  //     ]
  //   },
  //   {
  //     fieldId: 12,
  //     fieldName: 'employeeSurnameKana',
  //     fieldType: 10,
  //     fieldOrder: 12,
  //     required: true,
  //     isDefault: false,
  //     isDoubleColumn: false,
  //     doubleColumnOption: 4,
  //     isAvailable: true,
  //     isModify: true,
  //     isMobileModify: false,
  //     imeType: 5,
  //     searchType: 6,
  //     searchOption: 7,
  //     ownPermissionLevel: 8,
  //     othersPermissionLevel: 9,
  //     urlTarget: 'urlTarget',
  //     urlEncode: 10,
  //     urlText: 'UrlText',
  //     iframeHeight: 'iframeHeight',
  //     isLineNameDisplay: true,
  //     configValue: 'configValue',
  //     decimalPlace: 11,
  //     labelJaJp: 'jaJp2',
  //     labelEnUs: 'enUs',
  //     labelZhCn: 'ZhCn',
  //     fieldItems: [
  //       {
  //         itemId: 1,
  //         isAvailable: true,
  //         itemOrder: 1,
  //         isDefault: false,
  //         labelJaJp: 'jaJp',
  //         labelEnUs: 'enUs',
  //         labelZhCn: 'zhCn',
  //         departmentId: null,
  //         departmentName: null,
  //         departmentOrder: null,
  //         parentId: null,
  //         managerId: null,
  //         positionId: null,
  //         positionName: null,
  //         positionOrder: null
  //       }
  //     ]
  //   },
  //   {
  //     fieldId: 14,
  //     fieldName: 'employeeSubordinates',
  //     fieldType: 10,
  //     fieldOrder: 14,
  //     required: true,
  //     isDefault: false,
  //     isDoubleColumn: true,
  //     doubleColumnOption: 4,
  //     isAvailable: true,
  //     isModify: true,
  //     isMobileModify: false,
  //     imeType: 5,
  //     searchType: 6,
  //     searchOption: 7,
  //     ownPermissionLevel: 8,
  //     othersPermissionLevel: 9,
  //     urlTarget: 'urlTarget',
  //     urlEncode: 10,
  //     urlText: 'UrlText',
  //     iframeHeight: 'iframeHeight',
  //     isLineNameDisplay: true,
  //     configValue: 'configValue',
  //     decimalPlace: 11,
  //     labelJaJp: 'employeeSubordinates',
  //     labelEnUs: 'enUs',
  //     labelZhCn: 'ZhCn',
  //     fieldItems: [
  //       {
  //         itemId: 1,
  //         isAvailable: true,
  //         itemOrder: 1,
  //         isDefault: false,
  //         labelJaJp: 'jaJp',
  //         labelEnUs: 'enUs',
  //         labelZhCn: 'zhCn',
  //         departmentId: null,
  //         departmentName: null,
  //         departmentOrder: null,
  //         parentId: null,
  //         managerId: null,
  //         positionId: null,
  //         positionName: null,
  //         positionOrder: null
  //       }
  //     ]
  //   },
  //   {
  //     fieldId: 13,
  //     fieldName: 'employeeManagers',
  //     fieldType: 10,
  //     fieldOrder: 13,
  //     required: true,
  //     isDefault: false,
  //     isDoubleColumn: false,
  //     doubleColumnOption: 4,
  //     isAvailable: true,
  //     isModify: true,
  //     isMobileModify: false,
  //     imeType: 5,
  //     searchType: 6,
  //     searchOption: 7,
  //     ownPermissionLevel: 8,
  //     othersPermissionLevel: 9,
  //     urlTarget: 'urlTarget',
  //     urlEncode: 10,
  //     urlText: 'UrlText',
  //     iframeHeight: 'iframeHeight',
  //     isLineNameDisplay: true,
  //     configValue: 'configValue',
  //     decimalPlace: 11,
  //     labelJaJp: 'employeeManagers',
  //     labelEnUs: 'enUs',
  //     labelZhCn: 'ZhCn',
  //     fieldItems: [
  //       {
  //         itemId: 1,
  //         isAvailable: true,
  //         itemOrder: 1,
  //         isDefault: false,
  //         labelJaJp: 'jaJp',
  //         labelEnUs: 'enUs',
  //         labelZhCn: 'zhCn',
  //         departmentId: null,
  //         departmentName: null,
  //         departmentOrder: null,
  //         parentId: null,
  //         managerId: null,
  //         positionId: null,
  //         positionName: null,
  //         positionOrder: null
  //       }
  //     ]
  //   },
  //   {
  //     fieldId: 20,
  //     fieldName: 'email',
  //     fieldType: 10,
  //     fieldOrder: 20,
  //     required: true,
  //     isDefault: false,
  //     isDoubleColumn: true,
  //     doubleColumnOption: 4,
  //     isAvailable: true,
  //     isModify: true,
  //     isMobileModify: false,
  //     imeType: 5,
  //     searchType: 6,
  //     searchOption: 7,
  //     ownPermissionLevel: 8,
  //     othersPermissionLevel: 9,
  //     urlTarget: 'urlTarget',
  //     urlEncode: 10,
  //     urlText: 'UrlText',
  //     iframeHeight: 'iframeHeight',
  //     isLineNameDisplay: true,
  //     configValue: 'configValue',
  //     decimalPlace: 11,
  //     labelJaJp: 'jaJp20',
  //     labelEnUs: 'enUs',
  //     labelZhCn: 'ZhCn',
  //     fieldItems: [
  //       {
  //         itemId: 1,
  //         isAvailable: true,
  //         itemOrder: 1,
  //         isDefault: false,
  //         labelJaJp: 'jaJp',
  //         labelEnUs: 'enUs',
  //         labelZhCn: 'zhCn',
  //         departmentId: null,
  //         departmentName: null,
  //         departmentOrder: null,
  //         parentId: null,
  //         managerId: null,
  //         positionId: null,
  //         positionName: null,
  //         positionOrder: null
  //       }
  //     ]
  //   },
  //   {
  //     fieldId: 3,
  //     fieldName: 'telephoneNumber',
  //     fieldType: 10,
  //     fieldOrder: 3,
  //     required: true,
  //     isDefault: true,
  //     isDoubleColumn: true,
  //     doubleColumnOption: 4,
  //     isAvailable: true,
  //     isModify: true,
  //     isMobileModify: false,
  //     imeType: 5,
  //     searchType: 6,
  //     searchOption: 7,
  //     ownPermissionLevel: 8,
  //     othersPermissionLevel: 9,
  //     urlTarget: 'urlTarget',
  //     urlEncode: 10,
  //     urlText: 'UrlText',
  //     iframeHeight: 'iframeHeight',
  //     isLineNameDisplay: true,
  //     configValue: 'configValue',
  //     decimalPlace: 11,
  //     labelJaJp: 'jaJp3',
  //     labelEnUs: 'enUs',
  //     labelZhCn: 'ZhCn',
  //     fieldItems: [
  //       {
  //         itemId: 1,
  //         isAvailable: true,
  //         itemOrder: 1,
  //         isDefault: false,
  //         labelJaJp: 'jaJp',
  //         labelEnUs: 'enUs',
  //         labelZhCn: 'zhCn',
  //         departmentId: null,
  //         departmentName: null,
  //         departmentOrder: null,
  //         parentId: null,
  //         managerId: null,
  //         positionId: null,
  //         positionName: null,
  //         positionOrder: null
  //       }
  //     ]
  //   },
  //   {
  //     fieldId: 4,
  //     fieldName: 'cellphoneNumber',
  //     fieldType: 10,
  //     fieldOrder: 4,
  //     required: true,
  //     isDefault: false,
  //     isDoubleColumn: false,
  //     doubleColumnOption: 4,
  //     isAvailable: true,
  //     isModify: true,
  //     isMobileModify: false,
  //     imeType: 5,
  //     searchType: 6,
  //     searchOption: 7,
  //     ownPermissionLevel: 8,
  //     othersPermissionLevel: 9,
  //     urlTarget: 'urlTarget',
  //     urlEncode: 10,
  //     urlText: 'UrlText',
  //     iframeHeight: 'iframeHeight',
  //     isLineNameDisplay: true,
  //     configValue: 'configValue',
  //     decimalPlace: 11,
  //     labelJaJp: 'jaJp4',
  //     labelEnUs: 'enUs',
  //     labelZhCn: 'ZhCn',
  //     fieldItems: [
  //       {
  //         itemId: 1,
  //         isAvailable: true,
  //         itemOrder: 1,
  //         isDefault: false,
  //         labelJaJp: 'jaJp',
  //         labelEnUs: 'enUs',
  //         labelZhCn: 'zhCn',
  //         departmentId: null,
  //         departmentName: null,
  //         departmentOrder: null,
  //         parentId: null,
  //         managerId: null,
  //         positionId: null,
  //         positionName: null,
  //         positionOrder: null
  //       }
  //     ]
  //   },
  //   {
  //     fieldId: 5,
  //     fieldName: 'employeeDepartments',
  //     fieldType: 10,
  //     fieldOrder: 12,
  //     required: true,
  //     isDefault: false,
  //     isDoubleColumn: false,
  //     doubleColumnOption: 4,
  //     isAvailable: true,
  //     isModify: true,
  //     isMobileModify: false,
  //     imeType: 5,
  //     searchType: 6,
  //     searchOption: 7,
  //     ownPermissionLevel: 8,
  //     othersPermissionLevel: 9,
  //     urlTarget: 'urlTarget',
  //     urlEncode: 10,
  //     urlText: 'UrlText',
  //     iframeHeight: 'iframeHeight',
  //     isLineNameDisplay: true,
  //     configValue: 'configValue',
  //     decimalPlace: 11,
  //     labelJaJp: 'jaJp5',
  //     labelEnUs: 'enUs',
  //     labelZhCn: 'ZhCn',
  //     fieldItems: [
  //       {
  //         itemId: 1,
  //         isAvailable: 1,
  //         itemOrder: 1,
  //         isDefault: false,
  //         labelJaJp: null,
  //         labelEnUs: null,
  //         labelZhCn: null,
  //         departmentId: 1,
  //         departmentName: 'DEV1',
  //         departmentOrder: 2,
  //         parentId: null,
  //         managerId: 1,
  //         positionId: null,
  //         positionName: 'CEO',
  //         positionOrder: 1
  //       },
  //       {
  //         itemId: 2,
  //         isAvailable: 2,
  //         itemOrder: 2,
  //         isDefault: false,
  //         labelJaJp: null,
  //         labelEnUs: null,
  //         labelZhCn: null,
  //         departmentId: 2,
  //         departmentName: 'DEV2',
  //         departmentOrder: 1,
  //         parentId: null,
  //         managerId: 1,
  //         positionId: null,
  //         positionName: 'CTO',
  //         positionOrder: 1
  //       }
  //     ]
  //   },
  //   {
  //     fieldId: 6,
  //     fieldName: 'employeePositions',
  //     fieldType: 10,
  //     fieldOrder: 6,
  //     required: true,
  //     isDefault: false,
  //     isDoubleColumn: false,
  //     doubleColumnOption: 4,
  //     isAvailable: true,
  //     isModify: true,
  //     isMobileModify: false,
  //     imeType: 5,
  //     searchType: 6,
  //     searchOption: 7,
  //     ownPermissionLevel: 8,
  //     othersPermissionLevel: 9,
  //     urlTarget: 'urlTarget',
  //     urlEncode: 10,
  //     urlText: 'UrlText',
  //     iframeHeight: 'iframeHeight',
  //     isLineNameDisplay: true,
  //     configValue: 'configValue',
  //     decimalPlace: 11,
  //     labelJaJp: 'jaJp6',
  //     labelEnUs: 'enUs',
  //     labelZhCn: 'ZhCn',
  //     fieldItems: [
  //       {
  //         itemId: null,
  //         isAvailable: null,
  //         itemOrder: null,
  //         isDefault: null,
  //         labelJaJp: null,
  //         labelEnUs: null,
  //         labelZhCn: null,
  //         departmentId: 5,
  //         departmentName: 'DEV12',
  //         departmentOrder: null,
  //         parentId: 1,
  //         managerId: 1,
  //         positionId: 1,
  //         positionName: 'CEO',
  //         positionOrder: null
  //       }
  //     ]
  //   }
  // ],
  // data: {
  //   employeeIcon: {
  //     fileName: 'avc',
  //     filePath: '../../../content/images/ic-avatar.svg'
  //   },
  //   positionId: 1,
  //   employeeSurname: 'Surname',
  //   employeeName: 'Name',
  //   employeeSurnameKana: 'SurnameKana',
  //   employeeNameKana: 'NameKana',
  //   email: 'test1@gmail.com',
  //   telephoneNumber: '08-111-111',
  //   cellphoneNumber: '111-111-111',
  //   managerId: 1,
  //   userId: '4',
  //   password: null,
  //   languageId: 2,
  //   timezoneId: 1,
  //   employeeStatus: 0,
  //   updatedDate: '2020-02-07T04:01:19.433186Z',
  //   employeeManagers: [
  //     {
  //       employeeIcon: '../../../content/images/ic-avatar.svg',
  //       employeeId: 8,
  //       managerId: 8,
  //       employeeName: 'Manager 1',
  //       departmentName: 'MNG'
  //     },
  //     {
  //       employeeIcon: '../../../content/images/ic-avatar.svg',
  //       employeeId: 9,
  //       managerId: 9,
  //       employeeName: 'Manager 2',
  //       departmentName: 'DEV 1'
  //     }
  //   ],
  //   employeeSubordinates: [
  //     {
  //       employeeIcon: '../../../content/images/ic-avatar.svg',
  //       employeeId: 12,
  //       employeeName: 'Subordinates 1',
  //       departmentName: 'DEV 2'
  //     },
  //     {
  //       employeeIcon: '../../../content/images/ic-avatar.svg',
  //       employeeId: 13,
  //       employeeName: 'Subordinates 2',
  //       departmentName: 'DEV 2'
  //     }
  //     // {
  //     //   photo: {
  //     //     fileName: 'test8',
  //     //     filePath: 'D:/test/'
  //     //   },
  //     //   employeeId: 8,
  //     //   employeeSurname: 'surname 8',
  //     //   employeeName: 'name 8',
  //     //   employeeSurnameKana: 'surname kana 8',
  //     //   employeeNameKana: 'name kana 8'
  //     // },
  //     // {
  //     //   photo: {
  //     //     fileName: 'test7',
  //     //     filePath: 'D:/test/'
  //     //   },
  //     //   employeeId: 7,
  //     //   employeeSurname: 'surname 7',
  //     //   employeeName: 'name 7',
  //     //   employeeSurnameKana: 'surname kana 7',
  //     //   employeeNameKana: 'name kana 7'
  //     // }
  //   ],
  //   employeeDepartments: [
  //     {
  //       departmentId: 1,
  //       departmentName: 'departmentName1',
  //       departmentOrder: 1,
  //       positionId: 4,
  //       positionName: 'positionName1',
  //       positionOrder: 4
  //     },
  //     {
  //       departmentId: 2,
  //       departmentName: 'departmentName2',
  //       departmentOrder: 2,
  //       positionId: 2,
  //       positionName: 'positionName2',
  //       positionOrder: 1
  //     },
  //     {
  //       departmentId: 3,
  //       departmentName: 'departmentName3',
  //       departmentOrder: 3,
  //       positionId: 1,
  //       positionName: 'positionName3',
  //       positionOrder: 1
  //     }
  //   ],
  //   employeesSubscriptions: [
  //     {
  //       subscriptionId: 1,
  //       subscriptionName: 'License 01'
  //     },
  //     {
  //       subscriptionId: 2,
  //       subscriptionName: 'License 02'
  //     },
  //     {
  //       subscriptionId: 3,
  //       subscriptionName: 'License 03'
  //     }
  //   ],
  //   employeeData: [
  //     {
  //       fieldType: '2',
  //       key: 'date_1',
  //       value: '2019-12-01'
  //     },
  //     {
  //       fieldType: '2',
  //       key: 'radio_1',
  //       value: '13.0'
  //     },
  //     {
  //       fieldType: '2',
  //       key: 'number_1',
  //       value: '5.0'
  //     },
  //     {
  //       fieldType: '2',
  //       key: 'fieldName',
  //       value: 'text data 1'
  //     },
  //     {
  //       fieldType: '2',
  //       key: 'checkbox_1',
  //       value: '[1, 3]'
  //     },
  //     {
  //       fieldType: '2',
  //       key: 'pulldown_1',
  //       value: '5.0'
  //     }
  //   ]
  // },
  // dataTabsInfo: [
  //   {
  //     tabInfoId: 1,
  //     tabId: '1',
  //     labelJaJp: '基本情報',
  //     labelEnUs: '',
  //     labelZhCn: '',
  //     tabOrder: 1,
  //     isDisplay: true,
  //     isDisplaySummary: true,
  //     maxRecord: 5
  //   },
  //   {
  //     tabInfoId: 2,
  //     tabId: '2',
  //     labelJaJp: '顧客',
  //     labelEnUs: '',
  //     labelZhCn: '',
  //     tabOrder: 2,
  //     isDisplay: true,
  //     isDisplaySummary: true,
  //     maxRecord: 1
  //   },
  //   {
  //     tabInfoId: 3,
  //     tabId: '3',
  //     labelJaJp: '名刺',
  //     labelEnUs: '',
  //     labelZhCn: '',
  //     tabOrder: 3,
  //     isDisplay: true,
  //     isDisplaySummary: true,
  //     maxRecord: 1
  //   },
  //   {
  //     tabInfoId: 4,
  //     tabId: '4',
  //     labelJaJp: 'タスク',
  //     labelEnUs: '',
  //     labelZhCn: '',
  //     tabOrder: 4,
  //     isDisplay: true,
  //     isDisplaySummary: true,
  //     maxRecord: 1,
  //     badges: 101
  //   },
  //   {
  //     tabInfoId: 5,
  //     tabId: '5',
  //     labelJaJp: 'メール',
  //     labelEnUs: '',
  //     labelZhCn: '',
  //     tabOrder: 5,
  //     isDisplay: true,
  //     isDisplaySummary: true,
  //     maxRecord: 5
  //   },
  //   {
  //     tabInfoId: 6,
  //     tabId: '6',
  //     labelJaJp: '取引商品',
  //     labelEnUs: '',
  //     labelZhCn: '',
  //     tabOrder: 6,
  //     isDisplay: true,
  //     isDisplaySummary: true,
  //     maxRecord: 5,
  //     badges: 99
  //   },
  //   {
  //     tabInfoId: 7,
  //     tabId: '7',
  //     labelJaJp: '予実',
  //     labelEnUs: '',
  //     labelZhCn: '',
  //     tabOrder: 7,
  //     isDisplay: true,
  //     isDisplaySummary: true,
  //     maxRecord: 5
  //   },
  //   {
  //     tabInfoId: 8,
  //     tabId: '8',
  //     labelJaJp: 'カレンダー',
  //     labelEnUs: '',
  //     labelZhCn: '',
  //     tabOrder: 8,
  //     isDisplay: true,
  //     isDisplaySummary: true,
  //     maxRecord: 5,
  //     badges: 50
  //   },
  //   {
  //     tabInfoId: 10,
  //     tabId: '10',
  //     labelJaJp: '参加中グループ',
  //     labelEnUs: '',
  //     labelZhCn: '',
  //     tabOrder: 7,
  //     isDisplay: true,
  //     isDisplaySummary: true,
  //     maxRecord: 2
  //   },
  //   {
  //     tabInfoId: 11,
  //     tabId: '11',
  //     labelJaJp: '変更履歴',
  //     labelEnUs: '',
  //     labelZhCn: '',
  //     tabOrder: 7,
  //     isDisplay: true,
  //     isDisplaySummary: true,
  //     maxRecord: 2
  //   }
  // ],
  dataCustomers: {
    dataInfo: [
      {
        customerId: '1',
        customerName: '顧客A',
        createdDate: '2020-02-27',
        industryType: '	農業・林業',
        address: '〒000-0000 東京都新宿区河田町2-1 〇〇ビル4F',
        telephoneNumber: '012-345-678',
        faxNumber: '111-222-3333'
      },
      {
        customerId: '2',
        customerName: '顧客B',
        createdDate: '2020-02-28',
        industryType: '農業・林業',
        address: '〒000-0000 東京都新宿区河田町2-1 〇〇ビル4F',
        telephoneNumber: '012-345-6711',
        faxNumber: '111-222-3441'
      }
    ],
    fieldInfo: [
      {
        fieldId: 1,
        fieldInfoTabId: 1,
        fieldInfoTabPersonalId: 1,
        fieldName: 'customerName',
        labelJaJp: '顧客名',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 1,
        fieldOrder: 1,
        isColumnFixed: false,
        columnWidth: 12,
        fieldItems: []
      },
      {
        fieldId: 2,
        fieldInfoTabId: 2,
        fieldInfoTabPersonalId: 2,
        fieldName: 'creatDate',
        labelJaJp: '登録日',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 1,
        fieldOrder: 2,
        isColumnFixed: false,
        columnWidth: 12,
        fieldItems: []
      },
      {
        fieldId: 2,
        fieldInfoTabId: 2,
        fieldInfoTabPersonalId: 2,
        fieldName: 'industryType',
        labelJaJp: '業種',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 1,
        fieldOrder: 2,
        isColumnFixed: false,
        columnWidth: 12,
        fieldItems: []
      },
      {
        fieldId: 3,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'address',
        labelJaJp: '住所',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 1,
        fieldOrder: 3,
        isColumnFixed: false,
        columnWidth: 40,
        fieldItems: []
      },
      {
        fieldId: 4,
        fieldInfoTabId: 4,
        fieldInfoTabPersonalId: 4,
        fieldName: 'telephoneNumber',
        labelJaJp: '電話番号',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 1,
        fieldOrder: 4,
        isColumnFixed: false,
        columnWidth: 12,
        fieldItems: []
      },
      {
        fieldId: 5,
        fieldInfoTabId: 5,
        fieldInfoTabPersonalId: 5,
        fieldName: 'faxNumber',
        labelJaJp: 'FAX番号',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 1,
        fieldOrder: 5,
        isColumnFixed: false,
        columnWidth: 12,
        fieldItems: []
      }
    ]
  },
  dataBusinessCards: {
    dataInfo: [
      {
        businessCardImage: {
          businessCardImagePath: '../../../content/images/ic-avatar.svg',
          businessCardImageName: '顧客名'
        },
        customerName: '顧客名',
        firstName: '名刺名',
        lastName: '名刺名',
        departmentName: '部署',
        titleName: '役職名',
        prefecture: '住所1',
        addressUnderPrefecture: '住所1',
        building: '住所2',
        phoneNumber: '000-000-000',
        mobileNumber: '000-000-001',
        email: 'mail@example.com',
        fieldName: []
      },
      {
        businessCardImage: {
          businessCardImagePath: '../../../content/images/ic-avatar.svg',
          businessCardImageName: '顧客名'
        },
        customerName: '顧客名',
        firstName: '名刺名',
        lastName: '名刺名',
        departmentName: '部署',
        titleName: '役職名',
        prefecture: '住所1',
        addressUnderPrefecture: '住所1',
        building: '住所2',
        phoneNumber: '000-000-000',
        mobileNumber: '000-000-001',
        email: 'mail@example.com',
        fieldName: []
      }
    ],
    fieldInfo: [
      {
        fieldId: 1,
        fieldInfoTabId: 1,
        fieldInfoTabPersonalId: 1,
        fieldName: 'businessCardImage',
        labelJaJp: '名刺画像',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 0,
        fieldOrder: 1,
        isColumnFixed: false,
        columnWidth: 10,
        fieldItems: []
      },
      {
        fieldId: 2,
        fieldInfoTabId: 2,
        fieldInfoTabPersonalId: 2,
        fieldName: 'customerName-businessCardName',
        labelJaJp: '顧客名・名刺名',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 0,
        fieldOrder: 2,
        isColumnFixed: false,
        columnWidth: 10,
        fieldItems: []
      },
      {
        fieldId: 3,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'departmentName-position',
        labelJaJp: '部署・役職名',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 3,
        fieldOrder: 3,
        isColumnFixed: false,
        columnWidth: 10,
        fieldItems: []
      },
      {
        fieldId: 5,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'InformationContact',
        labelJaJp: '連絡先',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 3,
        fieldOrder: 5,
        isColumnFixed: false,
        columnWidth: 20,
        fieldItems: []
      },
      {
        fieldId: 4,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'addressUnderPrefecture',
        labelJaJp: '住所',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 3,
        fieldOrder: 4,
        isColumnFixed: false,
        columnWidth: 50,
        fieldItems: []
      }
    ]
  },
  dataCalendar: [
    {
      date: '2019/08/02',
      perpetualCalendar: '先勝',
      holidayName: '祝日',
      isHoliday: 1,
      day: '木曜日',
      itemList: [
        {
          itemType: 3,
          itemId: 123456,
          itemName: 'Milestone Name1',
          employeeId: 2221,
          startDate: '01/01/2020 01:00:00',
          endDate: '01/01/2020 23:00',
          itemIcon: '\\image\\damphan.png',
          isFullDay: 1,
          isOverDay: 0,
          isRepeat: 1,
          scheduleRepeatId: 33458,
          isPublic: 1,
          isReportActivity: 1,
          isParticipantUser: 0,
          isDuplicate: 0,
          milestoneStatus: '01',
          taskStatus: '',
          participationDivision: '01',
          attendanceDivision: '',
          customers: [
            {
              customerId: 1112,
              customerName: '曜曜曜'
            },
            {
              customerId: 1112,
              customerName: '曜曜曜1'
            }
          ],
          productTradings: [
            {
              productTradingId: 656,
              productId: 31,
              productName: '商品名１'
            }
          ],
          businessCards: [
            {
              businessCardId: 33356,
              businessCardName: '名刺名1'
            }
          ]
        },
        {
          itemType: 3,
          itemId: 123456,
          itemName: 'Schedule Name1',
          employeeId: 332,
          startDate: '01/01/2020 00:00:00',
          endDate: '01/01/2020 23:59',
          itemIcon: '\\image\\damphan.png',
          isFullDay: 1,
          isOverDay: 0,
          isRepeat: 0,
          scheduleRepeatId: null,
          isPublic: 1,
          isReportActivity: 0,
          isParticipantUser: 0,
          isDuplicate: 0,
          milestoneStatus: '',
          taskStatus: '',
          participationDivision: '00',
          attendanceDivision: '',
          customers: [],
          productTradings: [
            {
              productTradingId: 4446,
              productId: 31,
              productName: '商品名3'
            }
          ],
          businessCards: [
            {
              businessCardId: 33356,
              businessCardName: '名刺名1'
            }
          ]
        }
      ],
      countSchedule: 1
    },
    {
      date: '2019/01/02',
      perpetualCalendar: '',
      holidayName: '',
      isHoliday: 0,
      day: '金曜日',
      itemList: [
        {
          itemType: 3,
          itemId: 123456,
          itemName: 'Schedule Name2',
          employeeId: 665,
          startDate: '01/02/2020 00:00',
          endDate: '01/02/2020 23:59',
          itemIcon: '\\image\\damphan.png',
          isFullDay: 1,
          isOverDay: 0,
          isRepeat: 0,
          scheduleRepeatId: null,
          isPublic: 1,
          isReportActivity: 1,
          isParticipantUser: 0,
          isDuplicate: 0,
          milestoneStatus: '',
          taskStatus: '',
          participationDivision: '',
          attendanceDivision: '02',
          customers: [],
          productTradings: [],
          businessCards: []
        }
      ],
      countSchedule: 1
    }
  ],
  dataTasks: {
    dataInfo: [
      {
        statusTaskId: '1',
        taskName: 'タスク名1',
        finishDate: '2020/03/03',
        customers: [
          {
            customerName: '顧客名0',
            customerUrl: '#'
          },
          {
            customerName: '顧客名1',
            customerUrl: '#'
          },
          {
            customerName: '顧客名2',
            customerUrl: '#'
          },
          {
            customerName: '顧客名3',
            customerUrl: '#'
          }
        ],
        productTradings: [
          {
            productTradingName: '商品取引名A',
            productTradingUrl: '#'
          },
          {
            productTradingName: '商品取引名B',
            productTradingUrl: '#'
          },
          {
            productTradingName: '商品取引名C',
            productTradingUrl: '#'
          }
        ],
        employees: [
          {
            employeeName: '従業員名A',
            employeeUrl: '#'
          },
          {
            employeeName: '従業員名B',
            employeeUrl: '#'
          },
          {
            employeeName: '従業員名C',
            employeeUrl: '#'
          }
        ]
      },
      {
        statusTaskId: '2',
        taskName: 'タスク名2',
        finishDate: '2020/03/04',
        customers: [
          {
            customerName: '顧客名4',
            customerUrl: '#'
          },
          {
            customerName: '顧客名5',
            customerUrl: '#'
          }
        ],
        productTradings: [
          {
            employeeName: '従業員名D',
            productTradingUrl: '#'
          },
          {
            employeeName: '従業員名E',
            productTradingUrl: '#'
          }
        ],
        employees: [
          {
            employeeName: '従業員名D',
            employeeUrl: '#'
          },
          {
            employeeName: '従業員名E',
            employeeUrl: '#'
          }
        ]
      }
    ],
    fieldInfo: [
      {
        fieldId: 1,
        fieldInfoTabId: 1,
        fieldInfoTabPersonalId: 1,
        fieldName: 'finishDate',
        labelJaJp: '期限',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 0,
        fieldOrder: 1,
        isColumnFixed: false,
        columnWidth: 10,
        fieldItems: []
      },
      {
        fieldId: 1,
        fieldInfoTabId: 1,
        fieldInfoTabPersonalId: 1,
        fieldName: 'taskName',
        labelJaJp: 'タスク名',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 0,
        fieldOrder: 1,
        isColumnFixed: false,
        columnWidth: 10,
        fieldItems: []
      },
      {
        fieldId: 2,
        fieldInfoTabId: 2,
        fieldInfoTabPersonalId: 2,
        fieldName: 'customerName',
        labelJaJp: '	顧客名',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 0,
        fieldOrder: 2,
        isColumnFixed: false,
        columnWidth: 10,
        fieldItems: []
      },
      {
        fieldId: 3,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'productTradingName',
        labelJaJp: '商品名',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 3,
        fieldOrder: 3,
        isColumnFixed: false,
        columnWidth: 10,
        fieldItems: []
      },
      {
        fieldId: 4,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'statusTaskId',
        labelJaJp: 'ステータス',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 3,
        fieldOrder: 4,
        isColumnFixed: false,
        columnWidth: 20,
        fieldItems: []
      },
      {
        fieldId: 5,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'employeesName',
        labelJaJp: '担当者',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 3,
        fieldOrder: 5,
        isColumnFixed: false,
        columnWidth: 20,
        fieldItems: []
      }
    ]
  },
  dataGroups: {
    data: {
      groups: [
        {
          groupId: 1,
          groupName: 'GroupA',
          groupType: '',
          groupMode: '',
          note: 'note1',
          createdDate: '2020/11/02',
          image: {
            groupImg: '../../content/images/Groupa.svg'
          },
          employees: [
            {
              employeeId: 1
            },
            {
              employeeId: 2
            },
            {
              employeeId: 3
            }
          ]
        },
        {
          groupId: 2,
          groupName: 'GroupB',
          groupType: '',
          groupMode: '',
          note: 'note2',
          createdDate: '2020/11/02',
          image: {
            groupImg: '../../content/images/Groupa.svg'
          },
          employees: [
            {
              employeeId: 1
            },
            {
              employeeId: 2
            },
            {
              employeeId: 3
            }
          ]
        },
        {
          groupId: 3,
          groupName: 'GroupC',
          groupType: '',
          groupMode: '',
          note: 'note3',

          createdDate: '2020/11/02',
          image: {
            groupImg: '../../content/images/Groupa.svg'
          },
          employees: [
            {
              employeeId: 1
            },
            {
              employeeId: 2
            },
            {
              employeeId: 3
            }
          ]
        },
        {
          groupId: 4,
          groupName: 'GroupD',
          groupType: '',
          groupMode: '',
          note: 'note4',
          createdDate: '2020/11/02',
          image: {
            groupImg: '../../content/images/Groupa.svg'
          },
          employees: [
            {
              employeeId: 1
            },
            {
              employeeId: 2
            },
            {
              employeeId: 3
            }
          ]
        },
        {
          groupId: 5,
          groupName: 'GroupF',
          groupType: '',
          groupMode: '',
          note: 'note4',
          createdDate: '2020/11/20',
          image: {
            groupImg: '../../content/images/Groupa.svg'
          },
          employees: [
            {
              employeeId: 1
            },
            {
              employeeId: 2
            },
            {
              employeeId: 3
            }
          ]
        }
      ],
      employees: [
        {
          employeeId: 1,
          employeeIcon: {
            fileName: '',
            filePath: '../../content/images/ic-user1.svg'
          },
          employeeSurname: 'empSurName1',
          employeeName: 'empName1',
          employeeSurnameKana: 'empSurKanaNameKana1',
          employeeNameKana: 'employeeNameKana1',
          employeePositonName: 'giam doc1'
        },
        {
          employeeId: 2,
          employeeIcon: {
            fileName: '',
            filePath: '../../content/images/ic-user2.svg'
          },
          employeeSurname: 'empSurName2',
          employeeName: 'empName2',
          employeeSurnameKana: 'empSurKanaNameKana2',
          employeeNameKana: 'employeeNameKana2',
          employeePositonName: 'giam doc2'
        },
        {
          employeeId: 3,
          employeeIcon: {
            fileName: '',
            filePath: '../../content/images/ic-user3.svg'
          },
          employeeSurname: 'empSurName3',
          employeeName: 'empName3',
          employeeSurnameKana: 'empSurKanaNameKana3',
          employeeNameKana: 'employeeNameKana3',
          employeePositonName: 'giam doc3'
        },
        {
          employeeId: 4,
          employeeIcon: {
            fileName: '',
            filePath: '../../content/images/ic-user3.svg'
          },
          employeeSurname: 'empSurName4',
          employeeName: 'empName4',
          employeeSurnameKana: 'empSurKanaNameKana4',
          employeeNameKana: 'employeeNameKana4',
          employeePositonName: 'giam doc4'
        },
        {
          employeeId: 5,
          employeeIcon: {
            fileName: '',
            filePath: '../../content/images/ic-user2.svg'
          },
          employeeSurname: 'empSurName5',
          employeeName: 'empName5',
          employeeSurnameKana: 'empSurKanaNameKana5',
          employeeNameKana: 'employeeNameKana5',
          employeePositonName: 'giam doc5'
        },
        {
          employeeId: 6,
          employeeIcon: {
            fileName: '',
            filePath: '../../content/images/ic-user1.svg'
          },
          employeeSurname: 'empSurName6',
          employeeName: 'empName6',
          employeeSurnameKana: 'empSurKanaNameKana6',
          employeeNameKana: 'employeeNameKana6',
          employeePositonName: 'giam doc6'
        },
        {
          employeeId: 7,
          employeeIcon: {
            fileName: '',
            filePath: '../../content/images/ic-user2.svg'
          },
          employeeSurname: 'empSurName7',
          employeeName: 'empName7',
          employeeSurnameKana: 'empSurKanaNameKana7',
          employeeNameKana: 'employeeNameKana7',
          employeePositonName: 'giam doc7'
        },
        {
          employeeId: 8,
          employeeIcon: {
            fileName: '',
            filePath: '../../content/images/ic-user1.svg'
          },
          employeeSurname: 'empSurName8',
          employeeName: 'empName8',
          employeeSurnameKana: 'empSurKanaNameKana8',
          employeeNameKana: 'employeeNameKana8',
          employeePositonName: 'giam doc8'
        },
        {
          employeeId: 9,
          employeeIcon: {
            fileName: '',
            filePath: '../../content/images/ic-user3.svg'
          },
          employeeSurname: 'empSurName9',
          employeeName: 'empName9',
          employeeSurnameKana: 'empSurKanaNameKana9',
          employeeNameKana: 'employeeNameKana9',
          employeePositonName: 'giam doc'
        },
        {
          employeeId: 10,
          employeeIcon: {
            fileName: '',
            filePath: '../../content/images/ic-user3.svg'
          },
          employeeSurname: 'empSurName10',
          employeeName: 'empName10',
          employeeSurnameKana: 'empSurKanaNameKana10',
          employeeNameKana: 'employeeNameKana10',
          employeePositonName: 'giam doc10'
        },
        {
          employeeId: 11,
          employeeIcon: {
            fileName: '',
            filePath: '../../content/images/ic-user2.svg'
          },
          employeeSurname: 'empSurName11',
          employeeName: 'empName11',
          employeeSurnameKana: 'empSurKanaNameKana11',
          employeeNameKana: 'employeeNameKana11',
          employeePositonName: 'giam doc11'
        },
        {
          employeeId: 12,
          employeeIcon: {
            fileName: '',
            filePath: '../../content/images/ic-user1.svg'
          },
          employeeSurname: 'empSurName12',
          employeeName: 'empName12',
          employeeSurnameKana: 'empSurKanaNameKana12',
          employeeNameKana: 'employeeNameKana12',
          employeePositonName: 'giam doc12'
        }
      ]
    }
  },
  dataListFavoriteGroup: {
    state: 0,
    data: {
      groupId: [
        {
          groupId: 1
        },
        {
          groupId: 4
        }
      ]
    },
    errors: null,
    success: null
  },
  dataTradingProducts: {
    dataInfo: {
      totalRecord: 2,
      productTradingBadge: 3,
      productTradings: [
        {
          amountTotal: 100000,
          productsTradingsId: 101,
          customerId: 111,
          customerName: '顧客A',
          employeeId: 1,
          employeeName: '社員A',
          productId: 1002,
          productName: '商品C',
          businessCardName: '名刺A',
          productTradingProgressId: 1,
          progressName: 'アプローチ',
          estimatedCompletionDate: '2020/10/11',
          quantity: 1,
          price: 1000,
          amount: 2000,
          numeric1: 11,
          checkbox1: '0',
          endPlanDate: 2020 / 10 / 11
        },
        {
          amountTotal: 100000,
          productsTradingsId: 101,
          customerId: 111,
          customerName: '顧客B',
          employeeId: 1,
          employeeName: '社員B',
          productId: 10421,
          productName: '商品C',
          productTradingProgressId: 1,
          progressName: 'アプローチ',
          estimatedCompletionDate: '2020/10/11',
          quantity: 1,
          price: 1000,
          amount: 2000,
          numeric1: 11,
          checkbox1: '0',
          endPlanDate: 2020 / 10 / 11,
          businessCardName: '名刺B'
        },
        {
          amountTotal: 100000,
          productsTradingsId: 101,
          customerId: 1112,
          customerName: '顧客C',
          employeeId: 1,
          employeeName: '社員A',
          productId: 10421,
          productName: '商品Z',
          productTradingProgressId: 1,
          progressName: 'アプローチ',
          estimatedCompletionDate: '2020/10/11',
          quantity: 1,
          price: 1000,
          amount: 2000,
          numeric1: 11,
          checkbox1: '0',
          endPlanDate: 2020 / 10 / 11,
          businessCardName: '名刺C'
        },
        {
          amountTotal: 100000,
          productsTradingsId: 101,
          customerId: 111,
          customerName: '顧客B',
          employeeId: 1,
          employeeName: '社員B',
          productId: 10421,
          productName: '商品C',
          productTradingProgressId: 1,
          progressName: 'アプローチ',
          estimatedCompletionDate: '2020/10/11',
          quantity: 1,
          price: 1000,
          amount: 2000,
          numeric1: 11,
          checkbox1: '0',
          endPlanDate: 2020 / 10 / 11,
          businessCardName: '名刺D'
        },
        {
          amountTotal: 100000,
          productsTradingsId: 101,
          customerId: 1112,
          customerName: '顧客C',
          employeeId: 1,
          employeeName: '社員A',
          productId: 10421,
          productName: '商品Z',
          productTradingProgressId: 1,
          progressName: 'アプローチ',
          estimatedCompletionDate: '2020/10/11',
          quantity: 1,
          price: 1000,
          amount: 2000,
          numeric1: 11,
          checkbox1: '0',
          endPlanDate: 2020 / 10 / 11,
          businessCardName: '名刺E'
        }
      ]
    },
    fieldInfoTab: [
      {
        fieldId: 1,
        fieldInfoTabId: 1,
        fieldInfoTabPersonalId: 1,
        fieldName: 'productName',
        labelJaJp: '顧客名',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 10,
        fieldOrder: 1,
        isColumnFixed: false,
        columnWidth: 10,
        fieldItems: []
      },
      {
        fieldId: 2,
        fieldInfoTabId: 2,
        fieldInfoTabPersonalId: 2,
        fieldName: 'customerName',
        labelJaJp: '顧客名',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 10,
        fieldOrder: 2,
        isColumnFixed: false,
        columnWidth: 10,
        fieldItems: []
      },
      {
        fieldId: 3,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'employeeName',
        labelJaJp: '顧客名',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 10,
        fieldOrder: 3,
        isColumnFixed: false,
        columnWidth: 10,
        fieldItems: []
      },
      {
        fieldId: 4,
        fieldInfoTabId: 4,
        fieldInfoTabPersonalId: 4,
        fieldName: 'progressName',
        labelJaJp: '顧客名',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 10,
        fieldOrder: 4,
        isColumnFixed: false,
        columnWidth: 20,
        fieldItems: []
      },
      {
        fieldId: 5,
        fieldInfoTabId: 5,
        fieldInfoTabPersonalId: 5,
        fieldName: 'endPlanDate',
        labelJaJp: '顧客名',
        labelEnUs: 'enUs',
        labelZhCn: 'ZhCn',
        fieldType: 30,
        fieldOrder: 5,
        isColumnFixed: false,
        columnWidth: 30,
        fieldItems: []
      }
    ]
  },
  dataWatchs: {
    isWatchTarget: true,
    watch: [
      {
        watchTargetId: 1
      },
      {
        watchTargetId: 2
      },
      {
        watchTargetId: 3
      }
    ]
  }
};

export const ITEM_TYPE = {
  itemTypeSchedule: 3
};

export const BADGES = {
  maxBadges: 99
};

export const PARAM_CHANGE_EMPLOYEE_STATUS = (employeeId, employeeStatus, updatedDate) => ({
  employeeId,
  employeeStatus,
  updatedDate
});

export const PARAM_EMPLOYEES_LAYOUT = () =>
  `  query{
      employeeLayout {
          fieldName
          fieldLabel
          fieldItems {
              itemId
              itemLabel
          }
      }
  }
    `;

export const PARAM_EMPLOYEE_FOLLOW = (watchTargetType, watchTargetId) =>
  `query {
        employee {
          watchTargetType,
          watchTargetId
        }
    }`;

export const DUMMY_RES_DELETE_EMPLOYEE = {
  data: {
    // countCustomers: 5,
    // countSchedules: 6,
    // countSaleProducts: 1,
    // countNameCards: 10
  }
};

export const RESPONSE_FIELD_NAME = {
  DEPARTMENT_IDS: 'employeeDepartments',
  POSITION_ID: 'employeePositions',
  CUSTOMER_NAME: 'customerName',
  ADDRESS: 'addressUnderPrefecture',
  BUSINESS_CARD_IMAGE: 'businessCardImage',
  CUSTOMER_NAME_BUSINESS_CARD_NAME: 'customerName-businessCardName',
  DEPARTMENT_NAME_POSITION: 'departmentName-position',
  INFORMATION_CONTACT: 'InformationContact',
  FINISH_DATE: 'finishDate',
  TASK_NAME: 'taskName',
  PRODUCT_TRADING_NAME: 'productTradingName',
  STATUS_TASK_ID: 'statusTaskId',
  EMPLOYEE_NAME: 'employeesName',
  MANAGER: 'employeeManagers',
  SUBORDINATES: 'employeeSubordinates',
  EMAIL: 'email',
  BUSINESS_CARD_NAME: 'businessCardName',
  LANGUAGE_ID: 'languageId',
  TIME_ZONE_ID: 'timezoneId',
  EMPLOYEE_ICON: 'employeeIcon',
  EMPLOYEE_PACKAGES: 'employeePackages',
  IS_ADMIN: 'isAdmin'
};

export const TAB_ID_LIST = {
  summary: 0,
  customer: 4,
  businessCard: 3,
  task: 5,
  tradingProduct: 1,
  calendar: 9,
  product: 6,
  groups: 7,
  changeHistory: 2
};

export const DUMMY_CUSTOMER_DATA = {
  data: {
    dataInfo: [
      {
        customerId: 1,
        customerName: '顧客A	',
        creatDate: '2020-02-27',
        industryType: '農業・林業',
        address: '〒000-0000 東京都新宿区河田町2-1 〇〇ビル4F',
        telephoneNumber: '012-345-678',
        faxNumber: '111-222-3333'
      },
      {
        customerId: 2,
        customerName: '顧客B',
        creatDate: '2020-02-28',
        industryType: '農業・林業',
        address: '〒000-0000 東京都新宿区河田町2-1 〇〇ビル4F',
        telephoneNumber: '012-345-6711',
        faxNumber: '111-222-3441'
      },
      {
        customerId: 3,
        customerName: '顧客C',
        creatDate: '2020-02-28',
        industryType: '農業・林業',
        address: '〒000-0000 東京都新宿区河田町2-1 〇〇ビル4F',
        telephoneNumber: '012-345-6711',
        faxNumber: '111-222-3441'
      },
      {
        customerId: 4,
        customerName: '顧客D',
        creatDate: '2020-02-28',
        industryType: '	農業・林業',
        address: '〒000-0000 東京都新宿区河田町2-1 〇〇ビル4F',
        telephoneNumber: '012-345-6711',
        faxNumber: '111-222-3441'
      },
      {
        customerId: 5,
        customerName: '顧客E',
        creatDate: '2020-02-28',
        industryType: '	農業・林業',
        address: '〒000-0000 東京都新宿区河田町2-1 〇〇ビル4F',
        telephoneNumber: '012-345-6711',
        faxNumber: '111-222-3441'
      },
      {
        customerId: 6,
        customerName: '顧客F',
        creatDate: '2020-02-28',
        industryType: '農業・林業',
        address: '〒000-0000 東京都新宿区河田町2-1 〇〇ビル4F',
        telephoneNumber: '012-345-6711',
        faxNumber: '111-222-3441'
      }
    ],
    fieldInfo: [
      {
        fieldId: 1,
        fieldInfoTabId: 1,
        fieldInfoTabPersonalId: 1,
        fieldName: 'customerName',
        fieldLabel: '顧客名',
        fieldType: 13,
        fieldOrder: 1,
        isColumnFixed: false,
        columnWidth: 175,
        fieldItems: []
      },
      {
        fieldId: 2,
        fieldInfoTabId: 2,
        fieldInfoTabPersonalId: 2,
        fieldName: 'creatDate',
        fieldLabel: '登録日',
        fieldType: 10,
        fieldOrder: 2,
        isColumnFixed: false,
        columnWidth: 175,
        fieldItems: []
      },
      {
        fieldId: 3,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'address',
        fieldLabel: '	住所',
        fieldType: 16,
        fieldOrder: 3,
        isColumnFixed: false,
        columnWidth: 584,
        fieldItems: []
      },
      {
        fieldId: 3,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'industryType',
        fieldLabel: '業種',
        fieldType: 16,
        fieldOrder: 3,
        isColumnFixed: false,
        columnWidth: 584,
        fieldItems: []
      },
      {
        fieldId: 4,
        fieldInfoTabId: 4,
        fieldInfoTabPersonalId: 4,
        fieldName: 'telephoneNumber',
        fieldLabel: '電話番号',
        fieldType: 146,
        fieldOrder: 4,
        isColumnFixed: false,
        columnWidth: 175,
        fieldItems: []
      },
      {
        fieldId: 5,
        fieldInfoTabId: 5,
        fieldInfoTabPersonalId: 5,
        fieldName: 'faxNumber',
        fieldLabel: 'FAX番号',
        fieldType: 10,
        fieldOrder: 5,
        isColumnFixed: false,
        columnWidth: 175,
        fieldItems: []
      }
    ]
  }
};

export const DUMMY_TASK_DATA = {
  data: {
    dataInfo: [
      {
        taskId: 1,
        finishDate: '2020-11-11',
        taskName: 'taskName link',
        customers: [
          {
            customerId: 1,
            customerNames: 'Customer 1'
          },
          {
            customerId: 2,
            customerNames: 'Customer 2'
          }
        ],
        productTradings: [
          {
            productTradingId: 101,
            productTradingName: 'product trading 1'
          },
          {
            productTradingId: 102,
            productTradingName: 'product trading 2'
          }
        ],
        statusTaskId: 211,
        employees: [
          {
            employeeId: 11,
            employeeName: 'employee 1'
          },
          {
            employeeId: 12,
            employeeName: 'employee 2'
          }
        ]
      }
    ],
    fieldInfo: [
      {
        fieldId: 1,
        fieldInfoTabId: 1,
        fieldInfoTabPersonalId: 1,
        fieldName: 'finishDate',
        fieldLabel: '期限',
        fieldType: 13,
        fieldOrder: 1,
        isColumnFixed: false,
        columnWidth: 233,
        fieldItems: []
      },
      {
        fieldId: 2,
        fieldInfoTabId: 2,
        fieldInfoTabPersonalId: 2,
        fieldName: 'taskName',
        fieldLabel: 'タスク名',
        fieldType: 10,
        fieldOrder: 2,
        isColumnFixed: false,
        columnWidth: 233,
        fieldItems: []
      },
      {
        fieldId: 3,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'taskName',
        fieldLabel: '顧客名',
        fieldType: 16,
        fieldOrder: 3,
        isColumnFixed: false,
        columnWidth: 248,
        fieldItems: []
      },
      {
        fieldId: 4,
        fieldInfoTabId: 4,
        fieldInfoTabPersonalId: 4,
        fieldName: 'taskName',
        fieldLabel: '商品名',
        fieldType: 10,
        fieldOrder: 4,
        isColumnFixed: false,
        columnWidth: 248,
        fieldItems: []
      },
      {
        fieldId: 5,
        fieldInfoTabId: 5,
        fieldInfoTabPersonalId: 5,
        fieldName: 'statusTaskId',
        fieldLabel: 'ステータス',
        fieldType: 10,
        fieldOrder: 5,
        isColumnFixed: false,
        columnWidth: 248,
        fieldItems: []
      },
      {
        fieldId: 6,
        fieldInfoTabId: 6,
        fieldInfoTabPersonalId: 6,
        fieldName: 'taskName',
        fieldLabel: '担当者',
        fieldType: 10,
        fieldOrder: 6,
        isColumnFixed: false,
        columnWidth: 248,
        fieldItems: []
      }
    ]
  }
};
// export const DUMMY_TAB_LIST = [
//   //   {
//   //     TAB_SUMMARY:
//   //   {
//   //     TAB_ID: '#tab1',
//   //     TAB_LABEL: '基本情報'
//   //   }
//   //   },
//   //   {
//   //   TAB_CUSTOMER:
//   //   {
//   //     TAB_ID: '#tab2',
//   //     TAB_LABEL: '顧客'
//   //   },
//   // }
//   //   TAB_BUSINESS_CARDS:
//   //   {
//   //     TAB_ID: '#tab3',
//   //     TAB_LABEL: '名刺'
//   //   },
//   //   TAB_CALENDAR:
//   //   {
//   //     TAB_ID: '#tab4',
//   //     TAB_LABEL: 'タスク'
//   //   },
//   //   TAB_EMAIL:
//   //   {
//   //     TAB_ID: '#tab5',
//   //     TAB_LABEL: 'メール'
//   //   },
//   //   TAB_PRODUCT:
//   //   {
//   //     TAB_ID: '#tab6',
//   //     TAB_LABEL: '取引商品'
//   //   },
//   //   TAB_INTENDED_ACHIVEMENT:
//   //   {
//   //     TAB_ID: '#tab7',
//   //     TAB_LABEL: '予実'
//   //   },
//   //   TAB_GROUP_LIST:
//   //   {
//   //     TAB_ID: '#tab8',
//   //     TAB_LABEL: '参加中グループ'
//   //   },
// ];

export const DUMMY_GROUPS = {
  groups: [
    {
      groupId: 1,
      groupName: 'GroupA',
      groupType: '',
      groupMode: '',
      note: 'note1',
      createdDate: '2020/11/02',
      image: {
        groupImg: '../../content/images/Groupc.svg'
      },
      employees: [
        {
          employeeId: 1
        },
        {
          employeeId: 11
        },
        {
          employeeId: 10
        },
        {
          employeeId: 8
        },
        {
          employeeId: 7
        }
      ]
    },
    {
      groupId: 2,
      groupName: 'GroupB',
      groupType: '',
      groupMode: '',
      note: 'note2',
      createdDate: '2020/11/02',
      image: {
        groupImg: '../../content/images/Groupa.svg'
      },
      employees: [
        {
          employeeId: 2
        },
        {
          employeeId: 11
        },
        {
          employeeId: 7
        },
        {
          employeeId: 9
        },
        {
          employeeId: 6
        }
      ]
    },
    {
      groupId: 3,
      groupName: 'GroupC',
      groupType: '',
      groupMode: '',
      note: 'note3',

      createdDate: '2020/11/02',
      image: {
        groupImg: '../../content/images/Groupd.svg'
      },
      employees: [
        {
          employeeId: 2
        },
        {
          employeeId: 3
        },
        {
          employeeId: 5
        },
        {
          employeeId: 7
        },
        {
          employeeId: 11
        }
      ]
    },
    {
      groupId: 4,
      groupName: 'GroupD',
      groupType: '',
      groupMode: '',
      note: 'note4',
      createdDate: '2020/11/02',
      image: {
        groupImg: '../../content/images/Groupb.svg'
      },
      employees: [
        {
          employeeId: 1
        },
        {
          employeeId: 2
        },
        {
          employeeId: 3
        },
        {
          employeeId: 4
        },
        {
          employeeId: 5
        },
        {
          employeeId: 6
        },
        {
          employeeId: 7
        },
        {
          employeeId: 8
        },
        {
          employeeId: 9
        },
        {
          employeeId: 10
        },
        {
          employeeId: 11
        },
        {
          employeeId: 12
        }
      ]
    },
    {
      groupId: 5,
      groupName: 'GroupF',
      groupType: '',
      groupMode: '',
      note: 'note4',
      createdDate: '2020/11/20',
      image: {
        groupImg: '../../content/images/Groupa.svg'
      },
      employees: [
        {
          employeeId: 1
        },
        {
          employeeId: 3
        },
        {
          employeeId: 4
        },
        {
          employeeId: 5
        },
        {
          employeeId: 6
        },
        {
          employeeId: 7
        },
        {
          employeeId: 8
        },
        {
          employeeId: 9
        },
        {
          employeeId: 10
        },
        {
          employeeId: 12
        },
        {
          employeeId: 11
        }
      ]
    }
  ],
  employees: [
    {
      employeeId: 1,
      employeeIcon: {
        fileName: '',
        filePath: '../../content/images/ic-user1.svg'
      },
      employeeSurname: 'empSurName1',
      employeeName: 'empName1',
      employeeSurnameKana: 'empSurKanaNameKana1',
      employeeNameKana: 'employeeNameKana1',
      employeePositonName: 'giam doc1'
    },
    {
      employeeId: 2,
      employeeIcon: {
        fileName: '',
        filePath: '../../content/images/ic-user2.svg'
      },
      employeeSurname: 'empSurName2',
      employeeName: 'empName2',
      employeeSurnameKana: 'empSurKanaNameKana2',
      employeeNameKana: 'employeeNameKana2',
      employeePositonName: 'giam doc2'
    },
    {
      employeeId: 3,
      employeeIcon: {
        fileName: '',
        filePath: '../../content/images/ic-user3.svg'
      },
      employeeSurname: 'empSurName3',
      employeeName: 'empName3',
      employeeSurnameKana: 'empSurKanaNameKana3',
      employeeNameKana: 'employeeNameKana3',
      employeePositonName: 'giam doc3'
    },
    {
      employeeId: 4,
      employeeIcon: {
        fileName: '',
        filePath: '../../content/images/ic-user3.svg'
      },
      employeeSurname: 'empSurName4',
      employeeName: 'empName4',
      employeeSurnameKana: 'empSurKanaNameKana4',
      employeeNameKana: 'employeeNameKana4',
      employeePositonName: 'giam doc4'
    },
    {
      employeeId: 5,
      employeeIcon: {
        fileName: '',
        filePath: '../../content/images/ic-user2.svg'
      },
      employeeSurname: 'empSurName5',
      employeeName: 'empName5',
      employeeSurnameKana: 'empSurKanaNameKana5',
      employeeNameKana: 'employeeNameKana5',
      employeePositonName: 'giam doc5'
    },
    {
      employeeId: 6,
      employeeIcon: {
        fileName: '',
        filePath: '../../content/images/ic-user1.svg'
      },
      employeeSurname: 'empSurName6',
      employeeName: 'empName6',
      employeeSurnameKana: 'empSurKanaNameKana6',
      employeeNameKana: 'employeeNameKana6',
      employeePositonName: 'giam doc6'
    },
    {
      employeeId: 7,
      employeeIcon: {
        fileName: '',
        filePath: '../../content/images/ic-user2.svg'
      },
      employeeSurname: 'empSurName7',
      employeeName: 'empName7',
      employeeSurnameKana: 'empSurKanaNameKana7',
      employeeNameKana: 'employeeNameKana7',
      employeePositonName: 'giam doc7'
    },
    {
      employeeId: 8,
      employeeIcon: {
        fileName: '',
        filePath: '../../content/images/ic-user1.svg'
      },
      employeeSurname: 'empSurName8',
      employeeName: 'empName8',
      employeeSurnameKana: 'empSurKanaNameKana8',
      employeeNameKana: 'employeeNameKana8',
      employeePositonName: 'giam doc8'
    },
    {
      employeeId: 9,
      employeeIcon: {
        fileName: '',
        filePath: '../../content/images/ic-user3.svg'
      },
      employeeSurname: 'empSurName9',
      employeeName: 'empName9',
      employeeSurnameKana: 'empSurKanaNameKana9',
      employeeNameKana: 'employeeNameKana9',
      employeePositonName: 'giam doc'
    },
    {
      employeeId: 10,
      employeeIcon: {
        fileName: '',
        filePath: '../../content/images/ic-user3.svg'
      },
      employeeSurname: 'empSurName10',
      employeeName: 'empName10',
      employeeSurnameKana: 'empSurKanaNameKana10',
      employeeNameKana: 'employeeNameKana10',
      employeePositonName: 'giam doc10'
    },
    {
      employeeId: 11,
      employeeIcon: {
        fileName: '',
        filePath: '../../content/images/ic-user2.svg'
      },
      employeeSurname: 'empSurName11',
      employeeName: 'empName11',
      employeeSurnameKana: 'empSurKanaNameKana11',
      employeeNameKana: 'employeeNameKana11',
      employeePositonName: 'giam doc11'
    },
    {
      employeeId: 12,
      employeeIcon: {
        fileName: '',
        filePath: '../../content/images/ic-user1.svg'
      },
      employeeSurname: 'empSurName12',
      employeeName: 'empName12',
      employeeSurnameKana: 'empSurKanaNameKana12',
      employeeNameKana: 'employeeNameKana12',
      employeePositonName: 'giam doc12'
    }
  ]
};

export const DUMMY_USER_LOGIN = {
  employeeId: 1,
  employeeName: 'sakura',
  email: 'sakura@gmail.com',
  langKey: 'ja_jp',
  authorities: ['ROLE_USER']
};

export const DUMMY_LIST_FAVORITE_GROUP = {
  state: 0,
  data: {
    groupId: [
      {
        groupId: 1
      },
      {
        groupId: 4
      }
    ]
  },
  errorss: null,
  success: null
};

export const DUMMY_TRADING_PRODUCTS = {
  data: {
    dataInfo: {
      totalRecord: 2,
      productTradingBadge: 30,
      productTradings: [
        {
          amountTotal: 100000,
          productsTradingsId: 101,
          customerId: 111,
          customerName: '顧客A',
          employeeId: 1,
          employeeName: '社員A',
          productId: 1002,
          productName: '商品C',
          productTradingProgressId: 1,
          progressName: 'アプローチ',
          endPlanDate: '2020/10/11',
          quantity: 1,
          price: 1000,
          amount: 2000
        },
        {
          amountTotal: 100000,
          productsTradingsId: 101,
          customerId: 111,
          customerName: '顧客B',
          employeeId: 1,
          employeeName: '社員B',
          productId: 10421,
          productName: '商品C',
          productTradingProgressId: 1,
          progressName: 'アプローチ',
          endPlanDate: '2020/10/11',
          quantity: 1,
          price: 1000,
          amount: 2000
        },
        {
          amountTotal: 100000,
          productsTradingsId: 101,
          customerId: 1112,
          customerName: '顧客C',
          employeeId: 1,
          employeeName: '社員A',
          productId: 10421,
          productName: '商品Z',
          productTradingProgressId: 1,
          progressName: 'アプローチ',
          endPlanDate: '2020/10/11',
          quantity: 1,
          price: 1000,
          amount: 2000
        }
      ]
    },
    fieldInfo: [
      {
        fieldId: 1,
        fieldInfoTabId: 1,
        fieldInfoTabPersonalId: 1,
        fieldName: 'productName',
        fieldLabel: '商品',
        fieldType: 10,
        fieldOrder: 1,
        isColumnFixed: false,
        columnWidth: 50,
        fieldItems: []
      },
      {
        fieldId: 2,
        fieldInfoTabId: 2,
        fieldInfoTabPersonalId: 2,
        fieldName: 'customerName',
        fieldLabel: '顧客名',
        fieldType: 10,
        fieldOrder: 2,
        isColumnFixed: false,
        columnWidth: 50,
        fieldItems: []
      },
      {
        fieldId: 3,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'employeeName',
        fieldLabel: '客先担当者',
        fieldType: 10,
        fieldOrder: 3,
        isColumnFixed: false,
        columnWidth: 50,
        fieldItems: []
      },
      {
        fieldId: 4,
        fieldInfoTabId: 4,
        fieldInfoTabPersonalId: 4,
        fieldName: 'progressName',
        fieldLabel: '進捗状況',
        fieldType: 10,
        fieldOrder: 4,
        isColumnFixed: false,
        columnWidth: 50,
        fieldItems: []
      },
      {
        fieldId: 5,
        fieldInfoTabId: 5,
        fieldInfoTabPersonalId: 5,
        fieldName: 'endPlanDate',
        fieldLabel: '完了予定日',
        fieldType: 10,
        fieldOrder: 5,
        isColumnFixed: false,
        columnWidth: 50,
        fieldItems: []
      },
      {
        fieldId: 6,
        fieldInfoTabId: 6,
        fieldInfoTabPersonalId: 6,
        fieldName: 'amount',
        fieldLabel: '金額',
        fieldType: 10,
        fieldOrder: 5,
        isColumnFixed: false,
        columnWidth: 50,
        fieldItems: []
      }
    ]
  }
};

export const DUMMY_BUSINESS_CARDS_TAB = {
  data: {
    dataInfo: [
      {
        businessCardId: 1,
        businessCardName: '商号',
        buildingName: 'ビル名',
        contactInformation: '連絡先',
        customerName: '顧客名',
        departmentName: '部署名',
        employmentFlag: 1,
        email: 'luvina@gmail.com',
        introductionRefer: 'はじめに参照',
        introductionDate: '2020/11/11',
        mobileNumber: '0123456789',
        phoneNumber: '987654321',
        zipCode: '0001',
        streetAddress: '住所',
        position: 'ポジション',
        businessCardImage: {
          businessCardImageId: 1,
          businessCardImagePath: '../../content/images/Groupa.svg',
          businessCardImageName: 'GroupA'
        }
      },
      {
        businessCardId: 2,
        businessCardName: '商号',
        buildingName: 'ビル名',
        contactInformation: '連絡先',
        customerName: '顧客名',
        departmentName: '部署名',
        employmentFlag: 1,
        email: 'com@gmail.com',
        introductionRefer: 'はじめに参照',
        introductionDate: '2020/11/11',
        mobileNumber: '012345678',
        phoneNumber: '98765432',
        zipCode: '0002',
        streetAddress: '住所',
        position: 'ポジション',
        businessCardImage: {
          businessCardImageId: 1,
          businessCardImagePath: '../../content/images/Groupb.svg',
          businessCardImageName: 'GroupB'
        }
      }
    ],
    fieldInfo: [
      {
        fieldId: 1,
        fieldInfoTabId: 1,
        fieldInfoTabPersonalId: 1,
        fieldName: 'businessCardName',
        fieldLabel: '名刺画像',
        fieldType: 10,
        fieldOrder: 1,
        isColumnFixed: false,
        columnWidth: 50,
        fieldItems: []
      },
      {
        fieldId: 2,
        fieldInfoTabId: 2,
        fieldInfoTabPersonalId: 2,
        fieldName: 'customerName',
        fieldLabel: '顧客名・名刺名',
        fieldType: 10,
        fieldOrder: 2,
        isColumnFixed: false,
        columnWidth: 50,
        fieldItems: []
      },
      {
        fieldId: 3,
        fieldInfoTabId: 3,
        fieldInfoTabPersonalId: 3,
        fieldName: 'position',
        fieldLabel: '部署・役職名',
        fieldType: 10,
        fieldOrder: 3,
        isColumnFixed: false,
        columnWidth: 50,
        fieldItems: []
      },
      {
        fieldId: 4,
        fieldInfoTabId: 4,
        fieldInfoTabPersonalId: 4,
        fieldName: 'contactInformation',
        fieldLabel: '連絡先',
        fieldType: 10,
        fieldOrder: 4,
        isColumnFixed: false,
        columnWidth: 50,
        fieldItems: []
      },
      {
        fieldId: 5,
        fieldInfoTabId: 5,
        fieldInfoTabPersonalId: 5,
        fieldName: 'streetAddress',
        fieldLabel: '住所',
        fieldType: 10,
        fieldOrder: 5,
        isColumnFixed: false,
        columnWidth: 50,
        fieldItems: []
      }
    ]
  }
};

export const DUMMY_CALENDAR_MONTH = {
  dayListInWeek: [
    {
      dayName: 'thu2',
      dateListByDay: [
        {
          date: '01/01/2020',
          perpetualCalendar: '先勝',
          holidayName: '祝日',
          isHoliday: 0,
          isOverItemNumberInDay: 0,
          hideItemNumber: 0,
          maxItemNumber: 5,
          itemListInDay: [
            {
              itemType: 1,
              itemId: 123456,
              itemName: 'Milestone Name1',
              employeeId: 12221,
              startDate: '01/01/2020 00:00',
              endDate: '01/01/2020 23:59',
              itemIcon: '\\image\\damphan.png',
              isFullDay: 1,
              isOverDay: 0,
              isRepeat: 0,
              scheduleRepeatId: null,
              isPublic: 1,
              isReportActivity: 1,
              isParticipantUser: 0,
              isDuplicate: 0,
              milestoneStatus: '01',
              taskStatus: '',
              participationDivision: '',
              attendanceDivision: '',
              isStartDaySchedule: 0,
              isEndDaySchedule: 0,
              isFirstDayInWeek: 0,
              isLastDayInWeek: 0,
              isFirstDayInCalendar: 0,
              isLastDayInCalendar: 0
            },
            {
              itemType: 2,
              itemId: 123457,
              itemName: 'Task Name2',
              employeeId: 12222,
              startDate: '01/01/2020 10:00',
              endDate: '01/01/2020 15:00',
              itemIcon: '',
              isFullDay: 0,
              isOverDay: 0,
              isRepeat: 0,
              scheduleRepeatId: null,
              isPublic: 1,
              isReportActivity: 1,
              isParticipantUser: 0,
              isDuplicate: 0,
              milestoneStatus: '',
              taskStatus: '00',
              participationDivision: '',
              attendanceDivision: '',
              isStartDaySchedule: 0,
              isEndDaySchedule: 0,
              isFirstDayInWeek: 0,
              isLastDayInWeek: 0,
              isFirstDayInCalendar: 0,
              isLastDayInCalendar: 0
            }
          ]
        },
        {
          date: '01/07/2020',
          perpetualCalendar: '先勝',
          holidayName: '祝日',
          isHoliday: 0,
          isOverItemNumberInDay: 0,
          hideItemNumber: 0,
          maxItemNumber: 5,
          itemListInDay: [
            {
              itemType: 1,
              itemId: 123458,
              itemName: 'Milestone Name1',
              employeeId: 121,
              startDate: '01/07/2020 00:00',
              endDate: '01/07/2020 23:59',
              itemIcon: '\\image\\damphan.png',
              isFullDay: 1,
              isOverDay: 0,
              isRepeat: 0,
              scheduleRepeatId: null,
              isPublic: 1,
              isReportActivity: 0,
              isParticipantUser: 0,
              isDuplicate: 0,
              milestoneStatus: '00',
              taskStatus: '',
              participationDivision: '',
              attendanceDivision: '',
              isStartDaySchedule: 0,
              isEndDaySchedule: 0,
              isFirstDayInWeek: 0,
              isLastDayInWeek: 0,
              isFirstDayInCalendar: 0,
              isLastDayInCalendar: 0
            }
          ]
        }
      ]
    },
    {
      dayName: 'thu3',
      dateListByDay: [
        {
          date: '01/02/2020',
          perpetualCalendar: '先勝',
          holidayName: '祝日',
          isHoliday: 0,
          isOverItemNumberInDay: 0,
          hideItemNumber: 0,
          maxItemNumber: 5,
          itemListInDay: [
            {
              itemType: 1,
              itemId: 123456,
              itemName: 'Milestone Name1',
              employeeId: 12221,
              startDate: '01/02/2020 00:00',
              endDate: '01/02/2020 23:59',
              itemIcon: '\\image\\damphan.png',
              isFullDay: 1,
              isOverDay: 0,
              isRepeat: 0,
              scheduleRepeatId: null,
              isPublic: 1,
              isReportActivity: 1,
              isParticipantUser: 0,
              isDuplicate: 0,
              milestoneStatus: '',
              taskStatus: '00',
              participationDivision: '',
              attendanceDivision: '',
              isStartDaySchedule: 0,
              isEndDaySchedule: 0,
              isFirstDayInWeek: 0,
              isLastDayInWeek: 0,
              isFirstDayInCalendar: 0,
              isLastDayInCalendar: 0
            },
            {
              itemType: 2,
              itemId: 123457,
              itemName: 'Task Name2',
              employeeId: 9000,
              startDate: '01/02/2020 10:00',
              endDate: '01/02/2020 15:00',
              itemIcon: '',
              isFullDay: 0,
              isOverDay: 0,
              isRepeat: 0,
              scheduleRepeatId: null,
              isPublic: 1,
              isReportActivity: 1,
              isParticipantUser: 0,
              isDuplicate: 0,
              milestoneStatus: '',
              taskStatus: '00',
              participationDivision: '',
              attendanceDivision: '',
              isStartDaySchedule: 0,
              isEndDaySchedule: 0,
              isFirstDayInWeek: 0,
              isLastDayInWeek: 0,
              isFirstDayInCalendar: 0,
              isLastDayInCalendar: 0
            }
          ]
        },
        {
          date: '01/08/2020',
          perpetualCalendar: '先勝',
          holidayName: '祝日',
          isHoliday: 0,
          isOverItemNumberInDay: 0,
          hideItemNumber: 0,
          maxItemNumber: 5,
          itemListInDay: [
            {
              itemType: 1,
              itemId: 123458,
              itemName: 'Milestone Name1',
              employeeId: 12221,
              startDate: '01/08/2020 00:00',
              endDate: '01/08/2020 23:59',
              itemIcon: '\\image\\damphan.png',
              isFullDay: 1,
              isOverDay: 0,
              isRepeat: 0,
              scheduleRepeatId: null,
              isPublic: 1,
              isReportActivity: 1,
              isParticipantUser: 0,
              isDuplicate: 0,
              milestoneStatus: '00',
              taskStatus: '',
              participationDivision: '',
              attendanceDivision: '',
              isStartDaySchedule: 0,
              isEndDaySchedule: 0,
              isFirstDayInWeek: 0,
              isLastDayInWeek: 0,
              isFirstDayInCalendar: 0,
              isLastDayInCalendar: 0
            }
          ]
        }
      ]
    }
  ]
};

export const SCREEN_ID = {
  EMPLOYEE_DETAIL: 110814
};

export const DUMMY_EMPLOYEE_LIST_ID = [1, 2, 3, 4, 5, 6];

export const DUMMY_ALL_DYNAMIC_FIELD = [
  {
    fieldId: '1',
    fieldName: 'employeeSurname1',
    // fieldLabel: 'the 名前（姓）must be break line',
    labelJaJp: 'Pulldown (single)',
    labelEnUs: null,
    labelZhCn: null,
    fieldType: '1',
    fieldOrder: '1',
    searchType: '1',
    searchOption: '1',
    isDoubleColumn: false,
    isAvailable: true,
    fieldItems: []
  },
  {
    fieldId: '2',
    fieldName: 'employeeSurname',
    // fieldLabel: '名前（姓）',
    labelJaJp: 'Pulldown (multi)',
    labelEnUs: null,
    labelZhCn: null,
    fieldType: '2',
    fieldOrder: '1',
    searchType: '1',
    searchOption: '1',
    isDoubleColumn: false,
    isAvailable: true,
    fieldItems: []
  },
  {
    fieldId: '3',
    fieldName: 'employeeName',
    // fieldLabel: '名前（名）',
    labelJaJp: 'Checkbox',
    labelEnUs: null,
    labelZhCn: null,
    fieldType: '3',
    fieldOrder: '2',
    searchType: '1',
    searchOption: '1',
    isDoubleColumn: false,
    isAvailable: true,
    fieldItems: []
  },
  {
    fieldId: '4',
    fieldName: 'checkbox1',
    // fieldLabel: '勝因',
    labelJaJp: 'Radio button',
    labelEnUs: null,
    labelZhCn: null,
    fieldType: '4',
    fieldOrder: '4',
    searchType: '1',
    searchOption: '1',
    isDoubleColumn: true,
    isAvailable: true,
    fieldItems: [
      {
        itemId: '1',
        itemLabel: '趣味1',
        itemOrder: '1',
        isDefault: false
      },
      {
        itemId: '2',
        itemLabel: '趣味2',
        itemOrder: '2',
        isDefault: true
      },
      {
        itemId: '3',
        itemLabel: 'サービス',
        itemOrder: '3',
        isDefault: false
      }
    ]
  },
  {
    fieldId: '5',
    fieldName: 'single_select_box_1',
    // fieldLabel: '部署名',
    labelJaJp: 'numberic',
    labelEnUs: null,
    labelZhCn: null,
    fieldType: '5',
    fieldOrder: '5',
    searchType: '1',
    searchOption: '1',
    isDoubleColumn: false,
    isAvailable: false,
    fieldItems: [
      {
        departmentId: '1',
        departmentName: '趣味1',
        departmentOrder: '1',
        parentId: '1',
        managerId: '1'
      },
      {
        departmentId: '2',
        departmentName: '趣味11',
        departmentOrder: '2',
        parentId: '1',
        managerId: '1'
      },
      {
        departmentId: '3',
        departmentName: '趣味12',
        departmentOrder: '3',
        parentId: '1',
        managerId: '1'
      },
      {
        departmentId: '4',
        departmentName: '趣味2',
        departmentOrder: '4',
        parentId: '4',
        managerId: '1'
      },
      {
        departmentId: '5',
        departmentName: '趣味21',
        departmentOrder: '5',
        parentId: '4',
        managerId: '1'
      }
    ]
  },
  {
    fieldId: '6',
    fieldName: 'keyword',
    // fieldLabel: 'キーワード',
    labelJaJp: 'Date',
    labelEnUs: null,
    labelZhCn: null,
    fieldType: '6',
    fieldOrder: '6',
    searchType: '1',
    searchOption: '1',
    isDoubleColumn: false,
    isAvailable: false,
    fieldItems: []
  },
  {
    fieldId: '7',
    fieldName: 'link',
    // fieldLabel: 'リンク',
    labelJaJp: 'Ngày giờ',
    labelEnUs: null,
    labelZhCn: null,
    fieldType: '7',
    fieldOrder: '7',
    searchType: '1',
    searchOption: '1',
    isDoubleColumn: false,
    isAvailable: true,
    fieldItems: []
  },
  {
    fieldId: '8',
    fieldName: 'keyword',
    // fieldLabel: 'キーワード',
    labelJaJp: 'Thời gian',
    labelEnUs: null,
    labelZhCn: null,
    fieldType: '8',
    fieldOrder: '8',
    searchType: '1',
    searchOption: '1',
    isDoubleColumn: false,
    isAvailable: false,
    fieldItems: []
  },
  {
    fieldId: '9',
    fieldName: 'link',
    // fieldLabel: 'リンク',
    labelJaJp: 'Text',
    labelEnUs: null,
    labelZhCn: null,
    fieldType: '9',
    fieldOrder: '9',
    searchType: '1',
    searchOption: '1',
    isDoubleColumn: false,
    isAvailable: true,
    fieldItems: []
  },
  {
    fieldId: '10',
    fieldName: 'keyword',
    // fieldLabel: 'キーワード',
    labelJaJp: 'Relation',
    labelEnUs: null,
    labelZhCn: null,
    fieldType: '17',
    fieldOrder: '10',
    searchType: '1',
    searchOption: '1',
    isDoubleColumn: false,
    isAvailable: false,
    fieldItems: []
  },
  {
    fieldId: '11',
    fieldName: 'link',
    // fieldLabel: 'リンク',
    labelJaJp: 'Tab',
    labelEnUs: null,
    labelZhCn: null,
    fieldType: '20',
    fieldOrder: '11',
    searchType: '1',
    searchOption: '1',
    isDoubleColumn: false,
    isAvailable: true,
    fieldItems: []
  }
];

export const DUMMY_CHANGE_HISTORY = {
  data: [
    {
      createdDate: '2019/10/10 15:50',
      createdUser: 123,
      createdUserName: '山田',
      createdUserImage: '../../content/images/ic-user1.svg',
      contentChange: [
        {
          employeeName: '社員A > 社員B'
        },
        {
          telephoneNumber: '000-0000-0001 > 000-0000-0002'
        }
      ]
    },
    {
      createdDate: '2019/10/11 16:50',
      createdUser: 123,
      createdUserName: '山田',
      createdUserImage: '../../content/images/ic-user1.svg',
      contentChange: [
        {
          employeeNameKana: 'シャインエー > シャインビー'
        },
        {
          employeeStatus: '0 > 1'
        },
        {
          photoFilePath: '../../content/images/Groupa.svg > ../../content/images/Groupb.svg'
        },
        {
          checkbox1: {
            1: '1 > 2',
            2: '3 > 4'
          }
        }
      ]
    },
    {
      createdDate: '2019/10/11 10:10',
      createdUser: 100,
      createdUserName: 'haibeo',
      createdUserImage: '../../content/images/ic-user3.svg',
      contentChange: [
        {
          email: 'haibeo@gmail.com > haibeo1@gmail.com'
        },
        {
          cellphoneNumber: '333-333-333 > 888-888-888'
        },
        {
          employeeSurname: 'HAICN > CNHAI'
        },
        {
          checkbox1: {
            1: '1 > 2',
            2: '3 > 4'
          }
        }
      ]
    }
  ]
};

export const JAPAN_LANGUAGE_ID = 'ja_jp';
export const ENGLISH_LANGUAGE_ID = 2;
export const CHINA_LANGUAGE_ID = 3;

export const DUMMY_EMPLOYEE_LAYOUT = {
  fields: [
    {
      fieldName: 'employeeName',
      labelJaJp: '従業員名',
      labelEnUs: 'employee name',
      labelZhCn: '员工姓名'
    },
    {
      fieldName: 'telephoneNumber',
      labelJaJp: '電話番号',
      labelEnUs: 'telephone number',
      labelZhCn: '电话号码'
    },
    {
      fieldName: 'employeeNameKana',
      labelJaJp: ' 従業員名かな',
      labelEnUs: 'employee name kana',
      labelZhCn: '员工姓名假名'
    },
    {
      fieldName: 'employeeStatus',
      labelJaJp: '従業員の地位',
      labelEnUs: 'employee status',
      labelZhCn: '员工身份'
    },
    {
      fieldName: 'photoFilePath',
      labelJaJp: '写真ファイルのパス',
      labelEnUs: 'photo file path',
      labelZhCn: '照片文件路径'
    },
    {
      fieldName: 'email',
      labelJaJp: 'Eメール',
      labelEnUs: 'email',
      labelZhCn: '电子邮件'
    },
    {
      fieldName: 'cellphoneNumber',
      labelJaJp: '携帯電話',
      labelEnUs: 'cellphone number',
      labelZhCn: '手机'
    },
    {
      fieldName: 'employeeSurname',
      labelJaJp: '従業員の姓',
      labelEnUs: 'employee surname',
      labelZhCn: '员工姓'
    },
    {
      fieldName: 'checkbox_1',
      fieldItems: [
        {
          itemId: 1,
          labelJaJp: 'チェックボックス1',
          labelEnUs: 'checkbox 1',
          labelZhCn: '复选框1'
        },
        {
          itemId: 2,
          labelJaJp: 'チェックボックス2',
          labelEnUs: 'checkbox 2',
          labelZhCn: 'i复选框2'
        }
      ]
    }
  ]
};

export const MESSAGE_CODE = {
  countCustomers: 'countCustomers',
  countSchedules: 'countSchedules',
  countSaleProducts: 'countSaleProducts',
  countNameCards: 'countNameCards',
  countTimeLines: 'countTimeLines',
  countTimeLineGroups: 'countTimeLineGroups',
  countTimeLineGroupsFavorites: 'countTimeLineGroupsFavorites',
  countTimeLineWatchs: 'countTimeLineWatchs',
  countTimeLineNotices: 'countTimeLineNotices',
  countTimeLineStars: 'countTimeLineStars',
  countTimeLineReactions: 'countTimeLineReactions',
  countTimeLineFilters: 'countTimeLineFilters',
  countActivities: 'countActivities',
  countAnalysisReports: 'countAnalysisReports',
  countTodos: 'countTodos',
  countOcrNameCards: 'countOcrNameCards'
};

export const EMPLOYEE_ACTION_TYPES = {
  CREATE: 0,
  UPDATE: 1
};

export const EMPLOYEE_ADMIN = {
  IS_NOT_ADMIN: 0,
  IS_ADMIN: 1
};

export const EMPLOYEE_VIEW_MODES = {
  EDITABLE: 0,
  PREVIEW: 1
};

export const PARAM_EMPLOYEE_HISTORY = (employeeId, currentPage, limit) =>
  `
  query {
    getEmployeeHistory(
        employeeId  : ${employeeId},
        currentPage : ${currentPage},
        limit       : ${limit}
    )
    {
      employeeHistory {
        createdDate
        createdUser
        createdUserName
        createdUserImage
        contentChange {
          key
          value
        }
      }
      }
    }
    `;

export const DUMMY_EMPLOYEE_FIELD_INFO = {
  fields: [
    {
      fieldId: '6',
      fieldName: 'cellphone_number',
      fieldLabel: 'field type is 15',
      labelJaJp: 'any field - jp',
      labelEnUs: '',
      labelZhCn: '',
      fieldType: '15',
      fieldOrder: '1',
      searchType: '1',
      searchOption: '1',
      isDoubleColumn: false,
      isAvailable: true,
      fieldItems: []
    },
    {
      fieldId: '1',
      fieldName: 'employee_surname',
      fieldLabel: '??(?)',
      labelJaJp: '??(?)',
      labelEnUs: '',
      labelZhCn: '',
      fieldType: '10',
      fieldOrder: '1',
      searchType: '1',
      searchOption: '1',
      isDoubleColumn: false,
      isAvailable: true,
      fieldItems: []
    },
    {
      fieldId: '2',
      fieldName: 'employee_name',
      fieldLabel: '??(?)',
      labelJaJp: '??(?)',
      labelEnUs: '',
      labelZhCn: '',
      fieldType: '10',
      fieldOrder: '3',
      searchType: '1',
      searchOption: '1',
      isDoubleColumn: false,
      isAvailable: true,
      fieldItems: []
    },
    {
      fieldId: '11',
      fieldName: 'employee_surname_kana',
      fieldLabel: '??(??)(?)',
      labelJaJp: '??(??)(?)',
      labelEnUs: '',
      labelZhCn: '',
      fieldType: '10',
      fieldOrder: '7',
      searchType: '1',
      searchOption: '1',
      isDoubleColumn: false,
      isAvailable: true,
      fieldItems: []
    },
    {
      fieldId: '21',
      fieldName: 'employee_name_kana',
      fieldLabel: '??(??)(?)',
      labelJaJp: '??(??)(?)',
      labelEnUs: '',
      labelZhCn: '',
      fieldType: '10',
      fieldOrder: '8',
      searchType: '1',
      searchOption: '1',
      isDoubleColumn: false,
      isAvailable: true,
      fieldItems: []
    },
    {
      fieldId: '4',
      fieldName: 'checkbox_2',
      fieldLabel: '??',
      labelJaJp: '??',
      labelEnUs: '',
      labelZhCn: '',
      fieldType: '4',
      fieldOrder: '4',
      searchType: '1',
      searchOption: '1',
      isDoubleColumn: false,
      isAvailable: true,
      fieldItems: [
        {
          itemId: '1',
          itemLabel: '??1',
          labelJaJp: '??1',
          labelEnUs: '',
          labelZhCn: '',
          itemOrder: '1',
          isDefault: false
        },
        {
          itemId: '2',
          itemLabel: '??2',
          labelJaJp: '??2',
          labelEnUs: '',
          labelZhCn: '',
          itemOrder: '2',
          isDefault: true
        },
        {
          itemId: '3',
          itemLabel: '????',
          labelJaJp: '????',
          labelEnUs: '',
          labelZhCn: '',
          itemOrder: '3',
          isDefault: false
        }
      ]
    },
    {
      fieldId: '5',
      fieldName: 'employee_departments',
      fieldLabel: '???',
      labelJaJp: '??? - jp',
      labelEnUs: '',
      labelZhCn: '',
      fieldType: '1',
      fieldOrder: '5',
      searchType: '1',
      searchOption: '1',
      isDoubleColumn: false,
      isAvailable: true,
      fieldItems: [
        {
          departmentId: 1,
          departmentName: '??1',
          departmentOrder: 1,
          parentId: 1,
          managerId: 1
        },
        {
          departmentId: 2,
          departmentName: '??11',
          departmentOrder: 2,
          parentId: 1,
          managerId: 1
        },
        {
          departmentId: 3,
          departmentName: '??12',
          departmentOrder: 3,
          parentId: 1,
          managerId: 1
        },
        {
          departmentId: 4,
          departmentName: '??2',
          departmentOrder: 4,
          parentId: 4,
          managerId: 1
        },
        {
          departmentId: 5,
          departmentName: '??21',
          departmentOrder: 5,
          parentId: 4,
          managerId: 1
        }
      ]
    },
    {
      fieldId: '9',
      fieldName: 'employee_positions',
      fieldLabel: '???',
      labelJaJp: '??? - jp',
      labelEnUs: '',
      labelZhCn: '',
      fieldType: '1',
      fieldOrder: '9',
      searchType: '1',
      searchOption: '1',
      isDoubleColumn: false,
      isAvailable: true,
      fieldItems: [
        {
          positionId: 1,
          positionName: '??1',
          positionOrder: 1,
          parentId: 1,
          managerId: 1
        },
        {
          positionId: 2,
          positionName: '??11',
          positionOrder: 2,
          parentId: 1,
          managerId: 1
        }
      ]
    },
    {
      fieldId: '3',
      fieldName: 'checkbox_1',
      fieldLabel: '??',
      labelJaJp: '??',
      labelEnUs: '',
      labelZhCn: '',
      fieldType: '3',
      fieldOrder: '2',
      searchType: '1',
      searchOption: '1',
      isDoubleColumn: true,
      isAvailable: true,
      fieldItems: [
        {
          itemId: '1',
          itemLabel: '??1',
          labelJaJp: '??1',
          labelEnUs: '',
          labelZhCn: '',
          itemOrder: '1',
          isDefault: false
        },
        {
          itemId: '2',
          itemLabel: '??2',
          labelJaJp: '??2',
          labelEnUs: '',
          labelZhCn: '',
          itemOrder: '2',
          isDefault: true
        },
        {
          itemId: '3',
          itemLabel: '????',
          labelJaJp: '????',
          labelEnUs: '',
          labelZhCn: '',
          itemOrder: '3',
          isDefault: false
        }
      ]
    }
  ],
  employeeData: {
    updatedDate: '2020-03-20T10:09:02.617498Z',
    employeeName: 'Nguyen Van A',
    email: 'nguyenvana@gmail.com',
    file1: {
      fileName: 'PHP tutorial.xlsx',
      filePath: 'http://abc.com/12333949xldjiel.xlsx'
    },
    checkbox1: {
      1: true,
      3: false
    },
    employeeDepartments: [
      {
        departmentId: 1,
        departmentName: '',
        departmentOrder: 0,
        positionId: 1,
        positionName: '',
        positionOrder: 0
      },
      {
        departmentId: 1,
        departmentName: '',
        departmentOrder: 0,
        positionId: 2,
        positionName: '',
        positionOrder: 0
      }
    ],
    employeeSurname: '?????',
    employeeSurname1: '?????1',
    employeeSurnameKana: '???',
    employeeNameKana: '???'
  }
};

export const DUMMY_CREATE_EMPLOYEE_RESPONSE = {
  errorMsg: 'L?i common!!',
  errors: [
    {
      item: 'employee_surname_1',
      errorCode: 'ERR_COM_0001'
    },
    {
      item: 'employee_surname',
      errorCode: 'ERR_COM_0002'
    },
    {
      item: 'employee_name',
      errorCode: 'ERR_PRO_0001'
    },
    {
      item: 'employee_surname_kana',
      errorCode: 'ERR_COM_0003'
    },
    {
      item: 'employee_kame_kana',
      errorCode: 'ERR_COM_0004'
    },
    {
      item: 'checkbox_2',
      errorCode: 'ERR_COM_0001'
    },
    {
      item: 'employee_departments',
      errorCode: 'ERR_COM_0002'
    },
    {
      item: 'employee_positions',
      errorCode: 'ERR_COM_0004'
    }
  ]
};
export const DUMMY_UPDATE_EMPLOYEE_RESPONSE = DUMMY_CREATE_EMPLOYEE_RESPONSE;

export const PARAM_INITIALIZE_LIST_INFO = fieldBelong =>
  `query
  {
    getInitializeListInfo(fieldBelong: ${fieldBelong}) {
      initializeInfo {
        selectedTargetType
        selectedTargetId
        extraSettings {
          key
          value
        }
        orderBy {
          isNested
          key
          value
          fieldType
        }
        filterListConditions {
          targetType
          targetId
          filterConditions {
            isNested
            fieldType
            isDefault
            fieldName
            fieldValue
            searchType
            searchOption
          }
        }
      }
      fields {
        fieldId
        fieldName
      }
    }
  }`;

export const DUMMY_INITIALIZE_LIST_INFO = {
  fields: [
    { fieldId: 10336, fieldName: 'time_10038' },
    { fieldId: 10307, fieldName: 'date_10069' },
    { fieldId: 105, fieldName: 'employee_departments' },
    { fieldId: 106, fieldName: 'employee_positions' },
    { fieldId: 107, fieldName: 'email' },
    { fieldId: 10284, fieldName: 'date_time_10077' },
    { fieldId: 108, fieldName: 'telephone_number' },
    { fieldId: 10350, fieldName: 'checkbox_10047' },
    { fieldId: 110, fieldName: 'employee_managers' },
    { fieldId: 111, fieldName: 'employee_subordinates' },
    { fieldId: 112, fieldName: 'user_id' },
    { fieldId: 1234, fieldName: 'language_id' },
    { fieldId: 116, fieldName: 'timezone_id' },
    { fieldId: 10357, fieldName: 'pulldown_10042' },
    { fieldId: 10296, fieldName: 'relation_10045' },
    { fieldId: 10265, fieldName: 'calculation_10010' },
    { fieldId: 10266, fieldName: 'calculation_10011' },
    { fieldId: 10271, fieldName: 'file_10013' }
  ],
  initializeInfo: [
    {
      selectedTargetType: 3,
      selectedTargetId: 478,
      orderBy: [
        {
          fieldType: '99',
          isNested: false,
          key: 'employee_subordinates',
          value: 'asc'
        }
      ],
      extraSettings: {
        getSubCatelogy: true
      },
      filterListConditions: {
        targetType: 3,
        targetId: 478,
        filterConditions: [
          {
            isNested: false,
            fieldId: 1234,
            fieldName: 'language_id',
            fieldBelong: 8,
            isDefault: 'true',
            fieldType: 1,
            searchType: 1,
            searchCondition: 2,
            searchValue: '1'
          },
          {
            isNested: false,
            fieldId: 111,
            fieldName: 'employee_subordinates',
            fieldBelong: 8,
            isDefault: 'true',
            fieldType: 1,
            searchType: 1,
            searchCondition: 2,
            searchValue: '名前（姓）'
          }
        ]
      }
    }
  ]
};
