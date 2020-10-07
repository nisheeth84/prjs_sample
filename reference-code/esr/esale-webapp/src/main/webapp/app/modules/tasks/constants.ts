import task from '../setting/task/task';

export const TASK_DEF = {
  FIELD_BELONG: 15,
  EXTENSION_BELONG_LIST: 1
};

export const STATUS_TASK = {
  NOT_STARTED: 1,
  WORKING: 2,
  COMPLETED: 3
};

export const IS_PUBLIC = {
  PUBLIC: 1,
  NOT_PUBLIC: 0,
  ALL: 2
};

export const LICENSE = {
  CUSTOMER_LICENSE: 5,
  SALES_LICENSE: 16,
  TIMELINE_LICENSE: 3
};

export const FUNCTION_DIVISION = '00';

export const SEARCH_MODE = {
  NONE: 0,
  TEXT_DEFAULT: 1,
  CONDITION: 2
};
export const TASK_TABLE_ID = 'TASK_TABLE_ID';

export const TASK_ACTION_TYPES = {
  CREATE: 0,
  UPDATE: 1
};

export const TASK_VIEW_MODES = {
  EDITABLE: 0,
  PREVIEW: 1
};

export const TASK_UPDATE_FLG = {
  MOVE_TO_TODO: 1, // move task or subtask to TODO
  MOVE_TO_DONE: 2, // move task or subtask to DONE
  MOVE_TASK_SUBTASK_TO_DONE: 3, // move both task and subtasks to DONE and select the option [Complete Subtask]
  CHANGE_SUBTASK_TO_TASK_MOVE_TASK_TO_DONE: 4, // move task has UNFINISHED subtask to DONE and select the option [Change Subtask To Task]
  MOVE_TO_DOING: 5
};

export const TASKS_UPDATE_FLG = {
  MOVE_WITHOUT_CONFIRM: 0,
  MOVE_TASK_SUBTASK_TO_DONE: 1,
  MOVE_TASK_TO_DONE_CONVERT_SUBTASK: 2
};

export const TASK_DELETE_FLG = {
  DELETE_TASK: 1, // Only delete the physical task / subtask in question
  DELETE_TASK_SUBTASK: 2, // Delete the task under review and the subtask (if applicable)
  DELETE_TASK_CONVERT_SUBTASK: 3 // Delete the task under review, convert subtasks of the task under review to the task
};

export const FILTER_BY_USER_LOGIN_FLAG = {
  ALL: 0,
  CURRENT_USER: 1
};

export const FILE_EXTENSION_IMAGE = ['img', 'jpeg', 'gif', 'bmp', 'png', 'jpg'];

/**
 * query api getTasks
 * @param params
 */
export const PARAM_GET_TASKS = params => {
  const {
    searchLocal,
    employeeIds,
    groupIds,
    customerIds,
    startDate,
    finishDate,
    searchConditions,
    orderBy,
    limit,
    offset,
    filterConditions,
    filterByUserLoginFlg
  } = params;

  const localNavigationConditons = {
    employeeIds: employeeIds && employeeIds.length > 0 ? employeeIds : null,
    groupIds: groupIds && groupIds.length > 0 ? groupIds : null,
    customerIds: customerIds && customerIds.length > 0 ? customerIds : null,
    startDate: startDate ? startDate : null,
    finishDate: finishDate ? finishDate : null
  };

  return `query {
    getTasks(
        statusTaskIds: [],
        searchLocal: ${JSON.stringify(searchLocal ? searchLocal : '').replace(
          /"(\w+)"\s*:/g,
          '$1:'
        )},
        localNavigationConditons: ${JSON.stringify(localNavigationConditons).replace(
          /"(\w+)"\s*:/g,
          '$1:'
        )},
        searchConditions: ${JSON.stringify(searchConditions).replace(/"(\w+)"\s*:/g, '$1:')},
        orderBy: ${JSON.stringify(orderBy).replace(/"(\w+)"\s*:/g, '$1:')},
        limit: ${limit},
        filterConditions: ${JSON.stringify(filterConditions).replace(/"(\w+)"\s*:/g, '$1:')},
        offset: ${offset},
        filterByUserLoginFlg: ${filterByUserLoginFlg}
        ) {
      dataInfo {
        tasks {
          taskId
          statusTaskId
          taskData {
            fieldType
            key
            value
          } 
          parentTaskId
          parentStatusTaskId
          taskName
          startDate
          finishDate
          milestoneId
          milestoneName
          memo
          isPublic
          customers {
            customerId
            customerName
          }
          productTradings {
            productTradingId
            productName
          }
          subtasks {
            taskId
            taskName
            statusTaskId
          }
          countSubtask
          files {
            fileId
            fileName
            filePath
          }
          countFile
          employees {
            employeeId
            employeeName
            departmentName
            positionName
            photoFilePath
            employeeNameKana
            flagActivity
            cellphoneNumber
            telephoneNumber
            email
          }
          isOperator
          countEmployee
          taskCreatedDate
          taskUpdatedDate
          taskCreatedUser
          taskUpdatedUser
          taskCreatedUserName
          taskUpdatedUserName
        }
        countTask
        countTotalTask
      }
    }
  }`;
};

/**
 * query api deleteTask
 * @param tasks
 * @param updateFlg
 */
export const PARAM_DELETE_TASK = (tasks, updateFlg) => {
  return {
    taskIdList: tasks.length ? tasks : [tasks],
    processFlg: updateFlg
  };
};

/**
 * query api updateTaskStatus
 * @param taskId
 */
export const PARAM_GET_TASK = taskId =>
  `query{
    getTask(taskId: ${taskId}, language: null) {
      dataInfo {
          task {
              taskId
              taskData {
                  fieldType
                  key
                  value
              }
              taskName
              memo
              countEmployee
              startDate
              finishDate
              isPublic
              parentTaskId
              statusTaskId
              statusParentTaskId
              milestoneId
              milestoneName
              milestoneFinishDate
              registDate
              refixDate
              milestoneCustomerName
              milestoneParentCustomerName
              registPersonName
              refixPersonName
              registPersonId
              refixPersonId
              subtasks {
                  taskId
                  statusTaskId
                  taskName
                  finishDate
              }
              operators {
                  employees {
                      employeeId
                      employeeName
                      photoEmployeeImg
                      departmentName
                      positionName
                  }
                  departments {
                      departmentId
                      departmentName
                      departmentParentName
                      photoDepartmentImg
                  }
                  groups {
                      groupId
                      groupName
                      photoGroupImg
                  }
              }
              totalEmployees {
                  employeeId
                  employeeName
                  photoEmployeeImg
                  departmentName
                  positionName
              }
              customers {
                  customerId
                  customerName
                  parentCustomerName
                  customerAddress
              }
              productTradings {
                  productTradingId
                  productName
                  productId
              }
              files {
                  fileId
                  fileName
                  filePath
              }
              isTaskOperator
          }
      }
      fieldInfo {
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
          decimalPlace
          isLinkedGoogleMap
          tabData
          updatedDate
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
          fieldItems {
              itemId
              isAvailable
              itemOrder
              isDefault
              itemLabel
          }
      }
      tabInfo {
          tabId
          labelName
          isDisplay
          isDisplaySummary
          maxRecord
          tabOrder
          updatedDate
      }
  }
}`;

/**
 * query api saveLocalNavigation
 * @param employeeId
 * @param functionDivision
 * @param searchConditions
 */
export const PARAM_SAVE_LOCAL_MENU = (functionDivision, searchConditions) => {
  return {
    functionDivision,
    searchConditions
  };
};

/**
 * query api gettask layout
 */
export const PARAM_GET_TASK_LAYOUT = () =>
  `query{
    getTaskLayout {
      dataInfo {
          userLoginId
          userLoginName
          userLoginPhotoFilePath
          userLoginDepartmentName
          userLoginPositionName
      }
      fieldInfo {
          fieldId
          fieldBelong
          fieldName
          fieldType
          fieldOrder
          fieldLabel
          isDefault
          availableFlag
          isDoubleColumn
          modifyFlag
          urlTarget
          urlText
          configValue
          decimalPlace
          linkTarget
          isLinkedGoogleMap
          defaultValue
          fieldGroup
          updatedDate
          fieldItems {
              itemId
              isAvailable
              itemOrder
              isDefault
              itemLabel
          }
      }
  }
}`;

export const BADGES = {
  maxBadges: 99
};

export const PARAM_CREATE_TASK = params => {
  const {
    taskName,
    status,
    operatorId,
    startDate,
    finishDate,
    memo,
    isPublic,
    parentTaskId,
    subtasks,
    taskData,
    updateFlg,
    productsTradingsId,
    milestoneId,
    milestoneName,
    queryFile,
    customers,
    updatedDate
  } = params;
  let subtaskInsert = subtasks || [];
  subtaskInsert = subtaskInsert.map(item => {
    return {
      taskId: item.taskId,
      statusTaskId: item.statusTaskId,
      subtaskName: item.taskName
    };
  });

  const data = {
    taskName: taskName ? taskName : null,
    statusTaskId: status,
    customers: customers ? customers : null,
    productTradingIds: productsTradingsId ? productsTradingsId : [],
    operators:
      !operatorId || operatorId.length === 0 ? [] : operatorId.length ? operatorId : [operatorId],
    startDate: startDate ? '' + startDate + '' : null,
    finishDate: finishDate ? '' + finishDate + '' : null,
    memo,
    isPublic,
    parentTaskId: parentTaskId || null,
    subTasks: subtaskInsert && subtaskInsert.length > 0 ? subtaskInsert : [],
    milestoneId: milestoneId || null,
    milestoneName: milestoneName ? milestoneName : null,
    updateFlg: updateFlg || null,
    taskData:
      taskData && JSON.stringify(taskData) !== '{}'
        ? taskData.length
          ? taskData
          : [taskData]
        : null,
    updatedDate: updatedDate ? updatedDate : null,
    fileNameOlds: queryFile ? queryFile : []
  };
  return data;
};

export const PARAM_UPDATE_TASK = params => {
  const {
    taskName,
    status,
    operatorId,
    startDate,
    finishDate,
    queryFile,
    // files,
    memo,
    isPublic,
    subtasks,
    taskData,
    updateFlg,
    productsTradingsId,
    // taskId,
    milestoneId,
    milestoneName,
    parentTaskId,
    fileNameOlds,
    refixDate,
    deleteSubtaskIds,
    customers,
    processFlg
  } = params;

  let subtaskInsert = subtasks || [];
  subtaskInsert = subtaskInsert.map(itemSubtask => {
    return {
      taskId: itemSubtask.taskId,
      statusTaskId: itemSubtask.statusTaskId,
      subtaskName: itemSubtask.taskName
    };
  });

  const data = {
    taskName: taskName ? taskName : null,
    statusTaskId: status || null,
    customers: customers ? customers : null,
    productTradingIds: productsTradingsId ? productsTradingsId : [],
    operators:
      !operatorId || operatorId.length === 0 ? [] : operatorId.length ? operatorId : [operatorId],
    startDate: startDate ? '' + startDate + '' : null,
    finishDate: finishDate ? '' + finishDate + '' : null,
    memo: memo ? memo : null,
    isPublic,
    parentTaskId: parentTaskId || null,
    subTasks: subtaskInsert && subtaskInsert.length > 0 ? subtaskInsert : [],
    milestoneId: milestoneId || null,
    milestoneName: milestoneName ? milestoneName : null,
    updateFlg: updateFlg || null,
    taskData:
      taskData && JSON.stringify(taskData) !== '{}'
        ? taskData.length
          ? taskData
          : [taskData]
        : [],
    updatedDate: refixDate,
    fileNameOlds: fileNameOlds ? fileNameOlds : null,
    files: queryFile,
    deleteSubtaskIds,
    processFlg
  };
  return data;
};

export const TASK_SPECIAL_FIELD_NAMES = {
  taskName: 'task_name',
  productName: 'product_name',
  customersId: 'customer_id',
  customersName: 'customer_name',
  productTradingIds: 'products_tradings_id',
  operatorId: 'operator_id',
  startDate: 'start_date',
  finishDate: 'finish_date',
  taskFile: 'file_name',
  milestoneName: 'milestone_name',
  statusTaskId: 'status',
  taskPublic: 'is_public',
  createdDate: 'created_date',
  createdUser: 'created_user',
  updatedDate: 'updated_date',
  updatedUser: 'updated_user',
  milestoneId: 'milestone_id',
  parentId: 'parent_id',
  memo: 'memo',
  taskID: 'task_id'
};

export const FieldInfoSubTaskRemove = [
  TASK_SPECIAL_FIELD_NAMES.productName,
  TASK_SPECIAL_FIELD_NAMES.customersId,
  TASK_SPECIAL_FIELD_NAMES.customersName,
  TASK_SPECIAL_FIELD_NAMES.productTradingIds,
  TASK_SPECIAL_FIELD_NAMES.milestoneName,
  TASK_SPECIAL_FIELD_NAMES.milestoneId,
  TASK_SPECIAL_FIELD_NAMES.parentId
];

export const AllFieldInfoDetailTask = [
  TASK_SPECIAL_FIELD_NAMES.taskName,
  TASK_SPECIAL_FIELD_NAMES.productName,
  TASK_SPECIAL_FIELD_NAMES.customersId,
  TASK_SPECIAL_FIELD_NAMES.customersName,
  TASK_SPECIAL_FIELD_NAMES.productTradingIds,
  TASK_SPECIAL_FIELD_NAMES.operatorId,
  TASK_SPECIAL_FIELD_NAMES.startDate,
  TASK_SPECIAL_FIELD_NAMES.finishDate,
  TASK_SPECIAL_FIELD_NAMES.taskFile,
  TASK_SPECIAL_FIELD_NAMES.milestoneName,
  TASK_SPECIAL_FIELD_NAMES.statusTaskId,
  TASK_SPECIAL_FIELD_NAMES.taskPublic,
  TASK_SPECIAL_FIELD_NAMES.createdDate,
  TASK_SPECIAL_FIELD_NAMES.createdUser,
  TASK_SPECIAL_FIELD_NAMES.updatedDate,
  TASK_SPECIAL_FIELD_NAMES.updatedUser,
  TASK_SPECIAL_FIELD_NAMES.milestoneId,
  TASK_SPECIAL_FIELD_NAMES.parentId,
  TASK_SPECIAL_FIELD_NAMES.memo,
  TASK_SPECIAL_FIELD_NAMES.taskID
];

export const FieldInfoDetailTaskRemove = [
  TASK_SPECIAL_FIELD_NAMES.customersId,
  TASK_SPECIAL_FIELD_NAMES.productTradingIds
];

export const FLAG_DELETE_TASK = {
  ONLY_TASK: 1,
  INCLUDE_SUB: 2,
  CONVERT_SUB: 3
};

export const CREATE_TASK_FIELDS_REQUIRE = ['taskName', 'statusTaskId', 'operator_id', 'finishDate'];

export const BASE_FIELD_NAMES = [
  'memo',
  'task_name',
  'is_public',
  'status',
  'customer_id',
  'milestone_id',
  'created_date',
  'created_user',
  'updated_date',
  'updated_user',
  'operator_id',
  'finish_date',
  'start_date',
  'task_id',
  'file_name'
];

export const FIELD_ITEM_TYPE_DND = {
  SWICH_ORDER: 'SwichOrderTypeItemCard',
  ADD_FIELD: 'AddFieldTypeItemCard'
};

export const PARAM_UPDATE_STATUS_TASK = (taskId, statusTaskId, updateFlg) =>
  `taskId:${taskId},
   statusTaskId:${statusTaskId},
   updateFlg:${updateFlg}
  `;

export const TAB_ID_LIST = {
  summary: 0,
  changeHistory: 1
};

export const RESPONSE_FIELD_NAME = {
  SUBTASK: 'subtaskName',
  TASK_NAME: 'taskName',
  MEMO: 'memo',
  EMPLOYEE: 'totalEmployees',
  START_DATE: 'startDate',
  FINISH_DATE: 'finishDate',
  CUSTOMER_ID: 'customerId',
  CUSTOMER_NAME: 'customerName',
  MILESTONE_ID: 'milestoneId',
  MILESTONE_NAME: 'milestoneName',
  OPERATOR: 'operatorId',
  FILE: 'fileName',
  STATUS: 'status',
  IS_PUBLIC: 'isPublic',
  CREATE_USER: 'createdUser',
  UPDATE_USER: 'updatedUser',
  CREATE_DATE: 'createdDate',
  UPDATE_DATE: 'updatedDate',
  PARENT_ID: 'parentId',
  PRODUCTS_TRADINGS_ID: 'productsTradingsId',
  PRODUCT_NAME: 'productName',
  TASK_DATA: 'taskData'
};

export const DEFINE_FIELD_NAME_TASK = {
  STATUS: 'status',
  IS_PUBLIC: 'is_public',
  TASK_ID: 'task_id',
  START_DATE: 'start_date',
  FINISH_DATE: 'finish_date',
  UPDATED_DATE: 'updated_date',
  CREATED_DATE: 'created_date',
  TASK_NAME: 'task_name',
  MEMO: 'memo',
  FILE_NAME: 'file_name',
  MILESTONE_NAME: 'milestone_name',
  MILESTONE_ID: 'milestone_id',
  OPERATOR_ID: 'operator_id',
  UPDATED_USER: 'updated_user',
  PARENT_ID: 'parent_id',
  PRODUCTS_TRADINGS_ID: 'products_tradings_id',
  CREATED_USER: 'created_user',
  PRODUCT_NAME: 'product_name',
  CUSTOMER_NAME: 'customer_name',
  CUSTOMER_ID: 'customer_id'
};

export const LINK_FIELD_LIST_TASK = [
  TASK_SPECIAL_FIELD_NAMES.taskID,
  TASK_SPECIAL_FIELD_NAMES.taskName,
  TASK_SPECIAL_FIELD_NAMES.operatorId,
  TASK_SPECIAL_FIELD_NAMES.customersName,
  TASK_SPECIAL_FIELD_NAMES.productName,
  TASK_SPECIAL_FIELD_NAMES.milestoneId,
  TASK_SPECIAL_FIELD_NAMES.milestoneName,
  TASK_SPECIAL_FIELD_NAMES.taskFile,
  TASK_SPECIAL_FIELD_NAMES.createdUser,
  TASK_SPECIAL_FIELD_NAMES.updatedUser,
  TASK_SPECIAL_FIELD_NAMES.taskPublic,
  TASK_SPECIAL_FIELD_NAMES.statusTaskId
];

export const VIEW_CARD_LIMIT = 30;

export const TASK_STATUS_KEY = {
  NOT_STARTED: 'NOT_STARTED',
  WORKING: 'WORKING',
  COMPLETED: 'COMPLETED'
};
