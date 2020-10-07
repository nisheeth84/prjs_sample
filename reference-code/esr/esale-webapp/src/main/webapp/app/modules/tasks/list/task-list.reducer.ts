import { SUCCESS, FAILURE, REQUEST } from 'app/shared/reducers/action-type.util';
import {
  API_CONFIG,
  API_CONTEXT_PATH,
  ScreenMode,
  TYPE_MSG_EMPTY,
  USER_FORMAT_DATE_KEY,
  APP_DATE_FORMAT
} from 'app/config/constants';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import axios from 'axios';
import _ from 'lodash';
import {
  TASK_DEF,
  PARAM_SAVE_LOCAL_MENU,
  FUNCTION_DIVISION,
  FILTER_BY_USER_LOGIN_FLAG,
  AllFieldInfoDetailTask,
  RESPONSE_FIELD_NAME,
  STATUS_TASK,
  VIEW_CARD_LIMIT,
  TASK_STATUS_KEY
} from 'app/modules/tasks/constants';
import { handleGetTaskWorkGlobalTools } from 'app/modules/global/task/global-control-task.reducer';
import moment from 'moment';
import { STATUS_MILESTONE } from 'app/modules/global/constants';
// import { DUMMY_GET_TASK, DUMMY_LOCAL_MENU } from '../dummy';
import { getValueProp } from 'app/shared/util/entity-utils';
import StringUtils, { parseErrorRespose } from 'app/shared/util/string-utils';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import { Storage } from 'react-jhipster';

export enum TaskAction {
  None,
  Request,
  Error,
  Success,
  ResquestAfterSuccess,
  SuccessDelete
}

const schedulesUrl = `${API_CONTEXT_PATH}/${API_CONFIG.SCHEDULES_SERVICE_PATH}`;

/**
 * generate param getTasks
 * @param offset
 * @param limit
 */
const makeConditionSearchDefault = (offset, limit) => {
  return {
    statusTaskIds: [],
    searchLocal: '',
    employeeIds: [],
    customerIds: [],
    groupIds: [],
    startDate: null,
    finishDate: null,
    searchConditions: [],
    filterConditions: [],
    orderBy: [{ key: 'task_name', value: 'ASC' }],
    offset,
    limit,
    filterByUserLoginFlg: FILTER_BY_USER_LOGIN_FLAG.ALL
  };
};

const initialState = {
  tasks: [],
  action: TaskAction.None,
  screenMode: ScreenMode.DISPLAY,
  openCardView: true,
  successMessage: null,
  errorMessage: null,
  errorItems: null,
  customFieldInfos: null,
  totalRecord: 0,
  paramGetTask: makeConditionSearchDefault(0, RECORD_PER_PAGE_OPTIONS[1]),
  localMenu: null,
  updatedTaskIds: [],
  saveLocalNavigation: null,
  typeMsgEmpty: TYPE_MSG_EMPTY.NONE,
  offsets: null,
  totalRecordStatus: [0, 0, 0]
};

export const ACTION_TYPES = {
  TASK_LIST_OPEN_CARD_VIEW: 'taskList/OPEN_CARD_VIEW',
  TASK_LIST_GET_TASKS: 'taskList/GET_TASKS',
  TASK_LIST_DELETE_TASKS: 'taskList/DELETE_TASKS',
  TASK_LIST_UPDATE_TASK_STATUS: 'taskList/UPDATE_TASK_STATUS',
  TASK_LIST_UPDATE_LIST_STATUS: 'taskList/UPDATE_LIST_TASK_STATUS',
  TASK_LIST_GET_LOCAL_NAVIGATION: 'taskList/GET_LOCAL_NAVIGATION',
  TASK_LIST_SAVE_LOCAL_MENU: 'taskList/SAVE_LOCAL_MENU',
  TASK_LIST_SET_LOCAL_MENU: 'taskList/SET_LOCAL_MENU',
  TASK_LIST_SET_PARAM_GET_TASK: 'taskList/SET_PARAM_GET_TASK',
  TASK_LIST_GET_CUSTOM_FIELD_INFO: 'taskList/GET_CUSTOM_FIELD_INFO',
  TASK_LIST_ACTION_CONTINUE_CALL_API: 'taskList/CALL_NEXT_API',
  TASK_LIST_CHANGE_TO_EDIT: 'taskList/EDIT',
  TASK_LIST_CHANGE_TO_DISPLAY: 'taskList/DISPLAY',
  TASK_LIST_TASKS_UPDATE: 'taskList/TASKS_UPDATE',
  TASK_LIST_SHOW_MESSAGE_DELETE_SUCCESS: 'taskList/TASK_LIST_SHOW_MESSAGE_DELETE_SUCCESS',
  INIT_LOCAL_NAVIGATION: 'taskList/INIT_LOCAL_NAVIGATION',
  TASK_LIST_CHANGE_OFFSETS: 'taskList/TASK_LIST_CHANGE_OFFSETS',
  TASK_LIST_START_GET_TASK: 'taskList/TASK_LIST_START_GET_TASK'
};

/**
 * Convert special field of type is 99.
 * @param fieldInfos
 */
const convertFieldTypeForSpecialField = fields => {
  const customFieldsSpecial = _.cloneDeep(fields);
  for (let i = 0; i < customFieldsSpecial.customFieldsInfo.length; i++) {
    switch (customFieldsSpecial.customFieldsInfo[i].fieldName) {
      case 'customer_id':
        customFieldsSpecial.customFieldsInfo[i]['fieldType'] = 5;
        break;
      case 'customer_name':
        customFieldsSpecial.customFieldsInfo[i]['fieldType'] = 9;
        break;
      case 'product_trading_id':
        customFieldsSpecial.customFieldsInfo[i]['fieldType'] = 5;
        break;
      case 'product_name':
        customFieldsSpecial.customFieldsInfo[i]['fieldType'] = 9;
        break;
      case 'parent_id':
        customFieldsSpecial.customFieldsInfo[i]['fieldType'] = 9;
        break;
      case 'created_user':
        customFieldsSpecial.customFieldsInfo[i]['fieldType'] = 9;
        break;
      case 'updated_user':
        customFieldsSpecial.customFieldsInfo[i]['fieldType'] = 9;
        break;
      default:
        break;
    }
  }
  return customFieldsSpecial;
};

/**
 * parse response from api getTasks
 * @param res
 * @param state
 */
export const parseGetTaskResponse = (res, state) => {
  let successMsg = '';
  let errorMsg = _.get(res, 'errors[0].message', '');
  if (_.has(res, 'errors[0].extensions.errors[0].errorCode')) {
    errorMsg = res.errors[0].extensions.errors[0].errorCode;
  }
  let action = errorMsg && errorMsg.length > 0 ? TaskAction.Error : TaskAction.Success;
  let tasks = [];
  let total = 0;
  if (_.has(res, 'dataInfo.tasks[0]')) {
    errorMsg = '';
    action = TaskAction.Success;
    tasks = res.dataInfo.tasks;
    total = res.dataInfo.countTotalTask;
    // add file extension
    tasks = tasks.map(task => {
      task.files = task.files.map(file => {
        if (!file.filePath) return file;
        let extension = file.filePath.split('.').pop();
        if (extension === 'jpg' || extension === 'png') {
          extension = 'img';
        }
        file.extension = extension;
        return file;
      });
      task['fileName'] = task.files;
      return task;
    });
  }
  if (state.action === TaskAction.ResquestAfterSuccess && action === TaskAction.Success) {
    errorMsg = state.errorMessage;
    successMsg = state.successMessage;
  }
  return { errorMsg, action, tasks, total, successMsg };
};

/**
 * parse response from api deleteTasks
 * @param res
 * @param state
 */
const parseApiResponse = res => {
  let errorMsg = _.get(res, 'errors[0].message', '');
  if (_.has(res, 'errors[0].extensions.errors[0].errorCode')) {
    errorMsg = res.errors[0].extensions.errors[0].errorCode;
  }
  const action = errorMsg.length > 0 ? TaskAction.Error : TaskAction.Success;
  const saveLocalNavigation = res;
  return { errorMsg, action, saveLocalNavigation };
};

/**
 * parse response call api updateListTaskStatus
 * @param res
 */
const parseUpdateDeleteTasksResponse = res => {
  let errorMsg = _.get(res, 'errors[0].message', '');
  if (_.has(res, 'errors[0].extensions.errors[0].errorCode')) {
    errorMsg = res.errors[0].extensions.errors[0].errorCode;
  }
  const action = errorMsg.length > 0 ? TaskAction.Error : TaskAction.Success;
  let updatedListTask = [];
  if (_.has(res, 'taskIds[0]')) {
    updatedListTask = res.taskIds;
  }
  return { errorMsg, action, updatedListTask };
};

/**
 * parse response call api getLocalNavigation
 * @param res
 * @param state
 */
const parseGetLocalNavigationResponse = res => {
  let errorMsg = _.get(res, 'errors[0].message', '');
  if (_.has(res, 'errors[0].extensions.errors[0].errorCode')) {
    errorMsg = res.errors[0].extensions.errors[0].errorCode;
  }
  const action = errorMsg.length > 0 ? TaskAction.Error : TaskAction.Success;
  let localMenuData = null;
  if (res) {
    localMenuData = res;
  }
  return { errorMsg, action, localMenu: localMenuData };
};

/**
 * parse response get custom field info
 * @param res
 * @param type
 */
const parseCustomFieldsInfoResponse = (res, type) => {
  let errorMsg = _.get(res, 'errors[0].message', '');
  if (_.has(res, 'errors[0].extensions.errors[0].errorCode')) {
    errorMsg = res.errors[0].extensions.errors[0].errorCode;
  }
  const action = errorMsg.length > 0 ? TaskAction.Error : TaskAction.Success;
  const fieldInfosBefore = { customFieldsInfo: res.customFieldsInfo };
  if (fieldInfosBefore.customFieldsInfo) {
    fieldInfosBefore.customFieldsInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  const fieldInfos = convertFieldTypeForSpecialField(fieldInfosBefore);
  return { errorMsg, action, fieldInfos };
};

export type TaskListState = Readonly<typeof initialState>;

const actionRequestFailure = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.TASK_LIST_SHOW_MESSAGE_DELETE_SUCCESS:
      return {
        ...state,
        action: TaskAction.SuccessDelete,
        successMessage: 'INF_COM_0005'
      };
    case REQUEST(ACTION_TYPES.TASK_LIST_DELETE_TASKS):
    case REQUEST(ACTION_TYPES.TASK_LIST_GET_TASKS):
    case REQUEST(ACTION_TYPES.TASK_LIST_UPDATE_TASK_STATUS):
    case REQUEST(ACTION_TYPES.TASK_LIST_UPDATE_LIST_STATUS):
    case REQUEST(ACTION_TYPES.TASK_LIST_GET_LOCAL_NAVIGATION):
    case REQUEST(ACTION_TYPES.TASK_LIST_SAVE_LOCAL_MENU):
    case REQUEST(ACTION_TYPES.TASK_LIST_GET_CUSTOM_FIELD_INFO):
    case REQUEST(ACTION_TYPES.TASK_LIST_TASKS_UPDATE):
      return {
        ...state,
        action:
          state.action === TaskAction.ResquestAfterSuccess
            ? TaskAction.ResquestAfterSuccess
            : TaskAction.Request,
        errorItems: null
      };
    case FAILURE(ACTION_TYPES.TASK_LIST_GET_TASKS):
    case FAILURE(ACTION_TYPES.TASK_LIST_DELETE_TASKS):
    case FAILURE(ACTION_TYPES.TASK_LIST_UPDATE_TASK_STATUS):
    case FAILURE(ACTION_TYPES.TASK_LIST_UPDATE_LIST_STATUS):
    case FAILURE(ACTION_TYPES.TASK_LIST_GET_LOCAL_NAVIGATION):
    case FAILURE(ACTION_TYPES.TASK_LIST_GET_CUSTOM_FIELD_INFO):
    case FAILURE(ACTION_TYPES.TASK_LIST_TASKS_UPDATE): {
      return {
        ...state,
        action: TaskAction.Error,
        errorItems: parseErrorRespose(action.payload)
      };
    }
    case FAILURE(ACTION_TYPES.TASK_LIST_SAVE_LOCAL_MENU):
      return {
        ...state,
        tasks: [],
        action: TaskAction.Error,
        errorItems: parseErrorRespose(action.payload)
      };
    default:
      return state;
  }
};

export default (state: TaskListState = initialState, action): TaskListState => {
  switch (action.type) {
    case ACTION_TYPES.TASK_LIST_OPEN_CARD_VIEW:
      return {
        ...state,
        openCardView: action.payload,
        tasks: [],
        errorMessage: '',
        successMessage: ''
      };
    case ACTION_TYPES.TASK_LIST_ACTION_CONTINUE_CALL_API:
      return {
        ...state,
        action: TaskAction.ResquestAfterSuccess
      };
    case ACTION_TYPES.TASK_LIST_CHANGE_OFFSETS:
      return {
        ...state,
        offsets: action.payload
      };
    case ACTION_TYPES.TASK_LIST_GET_TASKS:
    case SUCCESS(ACTION_TYPES.TASK_LIST_GET_TASKS): {
      const res = parseGetTaskResponse(action.payload.data, state);
      const totalRecords = state.totalRecordStatus;
      if (res.tasks.length > 0) {
        totalRecords[res.tasks[0].statusTaskId - 1] = res.total;
      }
      return {
        ...state,
        action: res.action,
        tasks: state.tasks.concat([...res.tasks]),
        errorMessage: res.errorMsg,
        totalRecord: res.total,
        totalRecordStatus: totalRecords,
        successMessage: res.successMsg,
        typeMsgEmpty: initialState.typeMsgEmpty
      };
    }
    case SUCCESS(ACTION_TYPES.TASK_LIST_TASKS_UPDATE): {
      return {
        ...state,
        action: TaskAction.Success,
        successMessage: 'INF_COM_0004'
      };
    }
    case ACTION_TYPES.TASK_LIST_DELETE_TASKS:
    case SUCCESS(ACTION_TYPES.TASK_LIST_DELETE_TASKS): {
      const res = parseUpdateDeleteTasksResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        successMessage: null,
        updatedTaskIds: res.updatedListTask
      };
    }
    case ACTION_TYPES.TASK_LIST_UPDATE_LIST_STATUS:
    case SUCCESS(ACTION_TYPES.TASK_LIST_UPDATE_LIST_STATUS): {
      const res = parseUpdateDeleteTasksResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        updatedTaskIds: res.updatedListTask,
        successMessage: ''
      };
    }
    case ACTION_TYPES.TASK_LIST_UPDATE_TASK_STATUS:
    case SUCCESS(ACTION_TYPES.TASK_LIST_UPDATE_TASK_STATUS):
    case ACTION_TYPES.TASK_LIST_SAVE_LOCAL_MENU:
    case SUCCESS(ACTION_TYPES.TASK_LIST_SAVE_LOCAL_MENU): {
      const res = parseApiResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        saveLocalNavigation: res.saveLocalNavigation,
        successMessage: ''
      };
    }
    case ACTION_TYPES.TASK_LIST_GET_LOCAL_NAVIGATION:
    case SUCCESS(ACTION_TYPES.TASK_LIST_GET_LOCAL_NAVIGATION): {
      const res = parseGetLocalNavigationResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        localMenu: res.localMenu,
        successMessage: ''
      };
    }

    case ACTION_TYPES.TASK_LIST_SET_LOCAL_MENU:
      return {
        ...state,
        localMenu: { ...action.payload }
      };
    case ACTION_TYPES.TASK_LIST_SET_PARAM_GET_TASK:
      return {
        ...state,
        paramGetTask: { ...action.payload }
      };
    case SUCCESS(ACTION_TYPES.TASK_LIST_GET_CUSTOM_FIELD_INFO): {
      const res = parseCustomFieldsInfoResponse(
        action.payload.data,
        TASK_DEF.EXTENSION_BELONG_LIST
      );
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        customFieldInfos: res.fieldInfos,
        successMessage: ''
      };
    }
    case ACTION_TYPES.TASK_LIST_CHANGE_TO_DISPLAY:
      return {
        ...state,
        action: TaskAction.None,
        errorItems: [],
        errorMessage: null,
        screenMode: ScreenMode.DISPLAY
      };
    case ACTION_TYPES.TASK_LIST_CHANGE_TO_EDIT:
      return {
        ...state,
        screenMode: ScreenMode.EDIT
      };
    case ACTION_TYPES.INIT_LOCAL_NAVIGATION:
      return {
        ...state,
        localMenu: null
      };
    case ACTION_TYPES.TASK_LIST_START_GET_TASK: {
      const isClear =
        !action.offsets ||
        action.offsets.length === 0 ||
        (action.offsets[TASK_STATUS_KEY.WORKING] === 0 &&
          action.offsets[TASK_STATUS_KEY.COMPLETED] === 0 &&
          action.offsets[TASK_STATUS_KEY.NOT_STARTED] === 0);
      return {
        ...state,
        tasks: isClear ? [] : state.tasks
      };
    }
    default:
      return actionRequestFailure(state, action);
  }
};

/**
 * event switch from card view to list view
 * @param openCardView
 */
export const handleOpenCardView = openCardView => ({
  type: ACTION_TYPES.TASK_LIST_OPEN_CARD_VIEW,
  payload: openCardView
});

/**
 *  call api getTasks
 * @param params
 */
export const getTasks = params => {
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
    filterByUserLoginFlg,
    statusTaskIds
  } = params;

  const localNavigationConditons = {
    employeeIds: employeeIds && employeeIds.length > 0 ? employeeIds : [],
    groupIds: groupIds && groupIds.length > 0 ? groupIds : [],
    customerIds: customerIds && customerIds.length > 0 ? customerIds : [],
    startDate: startDate ? startDate : null,
    finishDate: finishDate ? finishDate : null
  };

  return {
    type: ACTION_TYPES.TASK_LIST_GET_TASKS,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/get-tasks'}`,
      {
        statusTaskIds,
        searchLocal: searchLocal && searchLocal.length > 0 ? searchLocal : '',
        localNavigationConditons,
        searchConditions,
        orderBy,
        limit,
        filterConditions,
        offset,
        filterByUserLoginFlg
      },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  };
};

const buildConditions = (condition, val) => {
  const fieldType = condition.fieldType;
  const isDefault = condition.isDefault !== null ? `${condition.isDefault}` : null;
  const fieldName = `${condition.fieldName}`;
  const fieldValue = val;
  const searchType = condition.searchType !== undefined ? `${condition.searchType}` : null;
  const searchOption = condition.searchOption !== undefined ? `${condition.searchOption}` : null;
  const timeZoneOffset =
    condition.timeZoneOffset !== undefined ? `${condition.timeZoneOffset}` : null;
  return { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption, timeZoneOffset };
};

/**
 * combine localNavigation and searchLocal, searchCondition, limit, offset
 * @param params
 * @param localMenuData
 * @param dispatch
 * @param getState
 */
export const getTasksWithParam = async (params, localMenuData, dispatch, getState) => {
  if (localMenuData) {
    if (localMenuData.searchDynamic) {
      if (localMenuData.searchDynamic.customersFavourite) {
        params.customerIds = localMenuData.searchDynamic.customersFavourite
          .filter(customers => customers.isSelected === 1)
          .map(customers => customers.listCustomer.map(customer => customer.customerId))
          .flat();
      }

      let employeeIds = null;
      if (localMenuData.searchDynamic.departments) {
        employeeIds = [];
        for (let i = 0; i < localMenuData.searchDynamic.departments.length; i++) {
          const department = localMenuData.searchDynamic.departments[i];
          if (department.employees && department.employees.length > 0) {
            for (let j = 0; j < department.employees.length; j++) {
              const employee = department.employees[j];
              if (employee.isSelected === 1 && !employeeIds.includes(employee.employeeId)) {
                employeeIds.push(employee.employeeId);
              }
            }
          }
        }
      }

      if (localMenuData.searchDynamic.groups) {
        if (!employeeIds) {
          employeeIds = [];
        }
        localMenuData.searchDynamic.groups.map(group => {
          let employeeList = [];
          if (group.employees) {
            employeeList = group.employees
              .filter(emp => emp.isSelected === 1)
              .map(emp => emp.employeeId);
          }
          employeeIds.push(...employeeList);
        });
        params.groupIds = localMenuData.searchDynamic.groups
          .filter(group => group.isSelected === 1)
          .map(group => group.groupId);
      }
      params.employeeIds = employeeIds;
    }
    if (localMenuData.searchStatic) {
      if (localMenuData.searchStatic.isAllTime === 0) {
        params.startDate = localMenuData.searchStatic.startDate;
        params.finishDate = localMenuData.searchStatic.endDate;
      } else {
        params.startDate = null;
        params.finishDate = null;
      }
    }
  }

  await dispatch({
    type: ACTION_TYPES.TASK_LIST_START_GET_TASK,
    offsets: getState().taskList.offsets
  });
  if (getState().taskList.openCardView) {
    params.filterConditions = [];
    params.limit = VIEW_CARD_LIMIT;
    const apiCallLs = [];

    if (getState().taskList.offsets[TASK_STATUS_KEY.NOT_STARTED] != null) {
      const params1 = _.cloneDeep(params);
      params1.statusTaskIds = [STATUS_TASK.NOT_STARTED];
      params1.offset = getState().taskList.offsets[TASK_STATUS_KEY.NOT_STARTED];
      apiCallLs.push(dispatch(getTasks(params1)));
    }

    if (getState().taskList.offsets[TASK_STATUS_KEY.WORKING] != null) {
      const params2 = _.cloneDeep(params);
      params2.statusTaskIds = [STATUS_TASK.WORKING];
      params2.offset = getState().taskList.offsets[TASK_STATUS_KEY.WORKING];
      apiCallLs.push(dispatch(getTasks(params2)));
    }

    if (getState().taskList.offsets[TASK_STATUS_KEY.COMPLETED] != null) {
      const params3 = _.cloneDeep(params);
      params3.statusTaskIds = [STATUS_TASK.COMPLETED];
      params3.offset = getState().taskList.offsets[TASK_STATUS_KEY.COMPLETED];
      apiCallLs.push(dispatch(getTasks(params3)));
    }

    await Promise.all([apiCallLs]);
  } else {
    params.statusTaskIds = [];
    getState().taskList.offsets = {
      NOT_STARTED: 0,
      WORKING: 0,
      COMPLETED: 0
    };
    await dispatch(getTasks(params));
  }
  await dispatch({ type: ACTION_TYPES.TASK_LIST_SET_PARAM_GET_TASK, payload: params });
};

/**
 *  search condition for tasks
 * @param params
 */
export const handleSearchTask = params => (dispatch, getState) => {
  const { searchLocal, searchConditions, orderBy, limit, offset, filterConditions } = params;
  const condition = getState().taskList.paramGetTask;
  if (limit !== undefined) {
    condition.limit = limit;
  }
  if (offset !== undefined) {
    condition.offset = offset;
  }
  const searchConditionList = [];
  const filterConditionList = [];
  const a = getState().fieldInfos;
  const b = getState();
  if (searchConditions && searchConditions.length > 0) {
    condition.searchLocal = null;
    for (let i = 0; i < searchConditions.length; i++) {
      if (!_.isNil(searchConditions[i].fieldRelation)) {
        continue;
      }
      const isArray = Array.isArray(searchConditions[i].fieldValue);
      if (
        !searchConditions[i].isSearchBlank &&
        (!searchConditions[i].fieldValue ||
          (searchConditions[i].fieldValue === 'false' &&
            searchConditions[i].fieldName !== 'is_public') ||
          searchConditions[i].fieldValue.length <= 0)
      ) {
        continue;
      }
      let val = null;
      if (searchConditions[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else if (isArray) {
        let jsonVal = searchConditions[i].fieldValue;
        if (
          jsonVal.length > 0 &&
          jsonVal[0] &&
          (Object.prototype.hasOwnProperty.call(jsonVal[0], 'from') ||
            Object.prototype.hasOwnProperty.call(jsonVal[0], 'to'))
        ) {
          jsonVal = jsonVal[0];
        }
        val = JSON.stringify(jsonVal);
      } else {
        val = searchConditions[i].fieldValue.toString();
      }
      searchConditionList.push(buildConditions(searchConditions[i], val));
    }
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
  } else if (searchLocal !== undefined) {
    condition.searchLocal = searchLocal;
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
  }
  if (filterConditions && filterConditions.length > 0) {
    for (let i = 0; i < filterConditions.length; i++) {
      _.remove(
        condition.filterConditions,
        (filterCondition: any) => filterCondition.fieldName === filterConditions[i].fieldName
      );
      if (
        !filterConditions[i].isSearchBlank &&
        (!filterConditions[i].fieldValue ||
          (filterConditions[i].fieldValue === 'false' &&
            filterConditions[i].fieldName !== 'is_public') ||
          filterConditions[i].fieldValue.length <= 0)
      ) {
        continue;
      }
      let val = filterConditions[i].fieldValue;
      let isArray = false;
      let jsonObj;
      try {
        isArray = _.isString(val) ? _.isArray((jsonObj = JSON.parse(val))) : _.isArray(val);
      } catch {
        isArray = false;
      }
      if (filterConditions[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else {
        if (isArray && jsonObj[0] && Object.prototype.hasOwnProperty.call(jsonObj[0], 'from')) {
          val = JSON.stringify(jsonObj[0]);
        } else {
          val = filterConditions[i].fieldValue.toString();
        }
      }
      condition.filterConditions.push(buildConditions(filterConditions[i], val));
    }
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }
  condition.searchConditions = searchConditionList;
  condition.orderBy = [];
  if (orderBy && orderBy.length > 0) {
    orderBy.forEach(element => {
      if (element.key.includes('.')) {
        const keyArr = element.key.split('.');
        if (keyArr[0].includes('task_data')) {
          element.key = element.isDefault === 'true' ? keyArr[1] : 'task_data.'.concat(keyArr[1]);
        } else {
          element.key = element.isDefault === 'true' ? keyArr[0] : 'task_data.'.concat(keyArr[0]);
        }
      } else {
        element.key = element.isDefault === 'true' ? element.key : 'task_data.'.concat(element.key);
      }
    });
    condition.orderBy.push(...orderBy);
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }
  getTasksWithParam(condition, getState().taskList.localMenu, dispatch, getState);
};

/**
 *  call api deleteTasks
 * @param taskIdList
 * @param updateFlg
 */
export const handleDeleteTask = (taskIdList, processFlg, removeSelectedRecord?) => async (
  dispatch,
  getState
) => {
  await dispatch({
    type: ACTION_TYPES.TASK_LIST_DELETE_TASKS,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/delete-tasks'}`,
      { taskIdList, processFlg },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
  let isDeleteOK = false;
  if (getState().taskList.action === TaskAction.Success) {
    isDeleteOK = true;
    await dispatch({ type: ACTION_TYPES.TASK_LIST_ACTION_CONTINUE_CALL_API });
    await getTasksWithParam(
      getState().taskList.paramGetTask,
      getState().taskList.localMenu,
      dispatch,
      getState
    );
    removeSelectedRecord && removeSelectedRecord();
  }
  await dispatch(
    handleGetTaskWorkGlobalTools(
      [STATUS_TASK.NOT_STARTED, STATUS_TASK.WORKING],
      STATUS_MILESTONE.TODO,
      moment()
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0 })
        .toDate(),
      moment()
        .utcOffset(0)
        .set({ hour: 23, minute: 59, second: 59 })
        .add(2, 'days')
        .toDate()
    )
  );
  await dispatch(
    handleGetTaskWorkGlobalTools(
      [STATUS_TASK.COMPLETED],
      STATUS_MILESTONE.FINISH,
      moment()
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0 })
        .subtract(2, 'days')
        .toDate(),
      moment()
        .utcOffset(0)
        .set({ hour: 23, minute: 59, second: 59 })
        .toDate()
    )
  );
  if (isDeleteOK) {
    await dispatch({ type: ACTION_TYPES.TASK_LIST_SHOW_MESSAGE_DELETE_SUCCESS });
  }
};

/**
 *  call api updateTaskStatus
 * @param task
 * @param updateFlg
 */
export const handleUpdateTaskStatus = (task, updateFlg) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TASK_LIST_UPDATE_TASK_STATUS,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/update-task-status'}`,
      { taskId: task.taskId, statusTaskId: task.statusTaskId, updateFlg },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
  if (getState().taskList.action === TaskAction.Success) {
    await dispatch({ type: ACTION_TYPES.TASK_LIST_ACTION_CONTINUE_CALL_API });
    await getTasksWithParam(
      getState().taskList.paramGetTask,
      getState().taskList.localMenu,
      dispatch,
      getState
    );
  }
  await dispatch(
    handleGetTaskWorkGlobalTools(
      [STATUS_TASK.NOT_STARTED, STATUS_TASK.WORKING],
      STATUS_MILESTONE.TODO,
      moment()
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0 })
        .toDate(),
      moment()
        .utcOffset(0)
        .set({ hour: 23, minute: 59, second: 59 })
        .add(2, 'days')
        .toDate()
    )
  );
  await dispatch(
    handleGetTaskWorkGlobalTools(
      [STATUS_TASK.COMPLETED],
      STATUS_MILESTONE.FINISH,
      moment()
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0 })
        .subtract(2, 'days')
        .toDate(),
      moment()
        .utcOffset(0)
        .set({ hour: 23, minute: 59, second: 59 })
        .toDate()
    )
  );
};

/**
 * call api updateListTaskStatus
 * @param items
 * @param newStatusTask
 * @param updateFlg
 */
export const handleUpdateListStaskStatus = (items, updatedStatus, updateFlg) => async (
  dispatch,
  getState
) => {
  const taskIds = items.map(item => item.taskId);
  await dispatch({
    type: ACTION_TYPES.TASK_LIST_UPDATE_LIST_STATUS,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/update-list-task-status'}`,
      { taskIds, updatedStatus, updateFlg },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
  if (getState().taskList.action === TaskAction.Success) {
    await dispatch({ type: ACTION_TYPES.TASK_LIST_ACTION_CONTINUE_CALL_API });
    await getTasksWithParam(
      getState().taskList.paramGetTask,
      getState().taskList.localMenu,
      dispatch,
      getState
    );
  }
};

const buildFormData = (params, fileUploads) => {
  const data = new FormData();
  let filesNameList;
  let mapFile = '';
  let separate = '';
  if (fileUploads) params['files'] = [];
  fileUploads.forEach((file, index) => {
    const key = Object.keys(file)[0];
    mapFile += separate + `"${key}": ["variables.files.${index}"]`;
    // filesMap[key] = file[key];
    data.append('files', file[key]);
    if (!filesNameList) {
      filesNameList = [];
    }
    filesNameList.push(key);
    separate = ',';
    // params['files'].push(file);
  });
  if (filesNameList) {
    data.append('filesMap', filesNameList);
  }
  data.append('data', JSON.stringify(params['tasks']));
  return data;
};

const isDefaultNotUpdate = fieldNameCamelCase => {
  if (
    RESPONSE_FIELD_NAME.CREATE_DATE === fieldNameCamelCase ||
    RESPONSE_FIELD_NAME.UPDATE_DATE === fieldNameCamelCase ||
    RESPONSE_FIELD_NAME.CREATE_USER === fieldNameCamelCase ||
    RESPONSE_FIELD_NAME.UPDATE_USER === fieldNameCamelCase
  ) {
    return true;
  }
  return false;
};

const isFieldInfos = fieldInfos => {
  return !fieldInfos || !fieldInfos.fieldInfoPersonals || fieldInfos.fieldInfoPersonals.length <= 0;
};

const createParamsForUpdateTask = (fieldInfos, grouptask, tasks, updateFlag) => {
  const params = [];
  for (const emp in grouptask) {
    if (!Object.prototype.hasOwnProperty.call(grouptask, emp)) {
      continue;
    }
    const param = {};
    param['taskId'] = Number(emp);
    let recordIdx = -1;
    if (tasks && tasks.length > 0) {
      recordIdx = tasks.findIndex(e => e['taskId'].toString() === emp.toString());
      if (recordIdx >= 0) {
        param['updatedDate'] = getValueProp(tasks[recordIdx], 'taskUpdatedDate');
      }
    }
    for (let i = 0; i < grouptask[emp].length; i++) {
      if (isFieldInfos(fieldInfos)) {
        continue;
      }
      const fieldIdx = fieldInfos.fieldInfoPersonals.findIndex(
        e => e.fieldId.toString() === grouptask[emp][i].fieldId.toString()
      );
      if (fieldIdx < 0) {
        continue;
      }
      const fieldName = fieldInfos.fieldInfoPersonals[fieldIdx].fieldName;
      const fieldNameCamelCase = StringUtils.snakeCaseToCamelCase(fieldName);
      if (isDefaultNotUpdate(fieldNameCamelCase)) {
        continue;
      }
      if (RESPONSE_FIELD_NAME.PRODUCT_NAME === fieldNameCamelCase && grouptask[emp][i].itemValue) {
        const productTradingIds = grouptask[emp][i].itemValue.map(item => {
          return item.productTradingId;
        });
        param['productTradingIds'] = productTradingIds;
        continue;
      } else if (RESPONSE_FIELD_NAME.CUSTOMER_NAME === fieldNameCamelCase) {
        if (grouptask[emp][i].itemValue && grouptask[emp][i].itemValue.length > 0) {
          param[RESPONSE_FIELD_NAME.CUSTOMER_ID] = grouptask[emp][i].itemValue[0].customerId;
        }
        continue;
      } else if (RESPONSE_FIELD_NAME.MILESTONE_NAME === fieldNameCamelCase) {
        if (grouptask[emp][i].itemValue && grouptask[emp][i].itemValue.length > 0) {
          param[RESPONSE_FIELD_NAME.MILESTONE_ID] = grouptask[emp][i].itemValue[0].milestoneId;
        }
        continue;
      }
      const isDefault = fieldInfos.fieldInfoPersonals[fieldIdx].isDefault;
      if (isDefault) {
        if (
          RESPONSE_FIELD_NAME.FINISH_DATE === fieldNameCamelCase ||
          RESPONSE_FIELD_NAME.START_DATE === fieldNameCamelCase
        ) {
          param[fieldNameCamelCase] = convertDateTimeToServer(
            grouptask[emp][i].itemValue,
            Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT)
          );
        } else if (RESPONSE_FIELD_NAME.OPERATOR === fieldNameCamelCase) {
          param['operators'] = grouptask[emp][i].itemValue;
        } else if ('fileName' === fieldNameCamelCase) {
          const valueTag = grouptask[emp][i].itemValue.map(item => {
            // Skip file delete
            if (item.status === 1) {
              return;
            }
            return item.fileName ? item.fileName : '';
          });
          param['fileNameOlds'] = valueTag;
        } else if (RESPONSE_FIELD_NAME.STATUS === fieldNameCamelCase) {
          // Status
          const task = tasks.find(
            taskTmp => taskTmp['taskId'].toString() === grouptask[emp][i].itemId.toString()
          );
          if (
            task &&
            task.parentTaskId === null &&
            task.statusTaskId.toString() !== grouptask[emp][i].itemValue &&
            '3' === grouptask[emp][i].itemValue
          ) {
            const isIncomplete = task.subtasks.some(sub => sub.statusTaskId <= STATUS_TASK.WORKING);
            if (isIncomplete && updateFlag) {
              param['updateFlg'] = updateFlag;
            }
          }
          param[fieldNameCamelCase] = grouptask[emp][i].itemValue;
        } else if (RESPONSE_FIELD_NAME.IS_PUBLIC === fieldNameCamelCase) {
          if (grouptask[emp][i].itemValue && grouptask[emp][i].itemValue.length > 0) {
            param['isPublic'] = grouptask[emp][i].itemValue[0];
          }
        } else {
          param[fieldNameCamelCase] = grouptask[emp][i].itemValue;
        }
      } else {
        if (param['taskData'] === null || param['taskData'] === undefined) {
          param['taskData'] = [];
        }
        const isArray = Array.isArray(grouptask[emp][i].itemValue);
        const itemValue = isArray
          ? JSON.stringify(grouptask[emp][i].itemValue)
          : grouptask[emp][i].itemValue
          ? grouptask[emp][i].itemValue.toString()
          : '';
        param['taskData'].push({
          fieldType: fieldInfos.fieldInfoPersonals[fieldIdx].fieldType.toString(),
          key: fieldName,
          value: itemValue
        });
      }
    }
    // fill other item not display
    if (!Object.prototype.hasOwnProperty.call(param, 'taskData')) {
      param['taskData'] = [];
    }
    if (!_.has(param, 'finishDate')) {
      param['finishDate'] = getValueProp(tasks[recordIdx], 'finishDate');
    }
    if (!_.has(param, 'status')) {
      param['status'] = getValueProp(tasks[recordIdx], 'statusTaskId');
    }
    params.push(param);
  }
  return params;
};

export const handleUpdateTask = (
  idList: string,
  listtask: any[],
  offset,
  limit,
  searchConditions,
  filterConditions?: any[],
  isUpdateListView?: boolean,
  orderBy?: any[],
  fileUploads?: any[],
  updateFlag?: any
) => async (dispatch, getState) => {
  const { tasks } = getState().taskList;
  const { fieldInfos } = getState().dynamicList.data.get(idList);
  const grouptask = listtask.reduce(function(h, obj) {
    h[obj.itemId] = (h[obj.itemId] || []).concat(obj);
    return h;
  }, {});
  
  const params = createParamsForUpdateTask(fieldInfos, grouptask, tasks, updateFlag);
  await dispatch({
    type: ACTION_TYPES.TASK_LIST_TASKS_UPDATE,
    payload: axios.post(
      `${API_CONTEXT_PATH}/schedules/api/update-tasks`,
      buildFormData({ tasks: params }, fileUploads),
      {
        headers: { ['Content-Type']: 'multipart/form-data' }
      }
    )
  });
  const { action } = getState().taskList;
  if (action === TaskAction.Success) {
    const param = {
      searchLocal: searchConditions,
      searchConditions,
      orderBy,
      limit,
      offset,
      filterConditions
    };
    await dispatch(handleSearchTask(param));
    await dispatch({ type: ACTION_TYPES.TASK_LIST_CHANGE_TO_DISPLAY });
  }
  await dispatch(
    handleGetTaskWorkGlobalTools(
      [STATUS_TASK.NOT_STARTED, STATUS_TASK.WORKING],
      STATUS_MILESTONE.TODO,
      moment()
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0 })
        .toDate(),
      moment()
        .utcOffset(0)
        .set({ hour: 23, minute: 59, second: 59 })
        .add(2, 'days')
        .toDate()
    )
  );
  await dispatch(
    handleGetTaskWorkGlobalTools(
      [STATUS_TASK.COMPLETED],
      STATUS_MILESTONE.FINISH,
      moment()
        .utcOffset(0)
        .set({ hour: 0, minute: 0, second: 0 })
        .subtract(2, 'days')
        .toDate(),
      moment()
        .utcOffset(0)
        .set({ hour: 23, minute: 59, second: 59 })
        .toDate()
    )
  );
};

/**
 * event call api getLcalMenu
 */
export const handleGetLocalNavigation = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TASK_LIST_GET_LOCAL_NAVIGATION,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/get-local-navigation'}`,
      { functionDivision: FUNCTION_DIVISION },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
    // payload: DUMMY_LOCAL_MENU
  });
  if (getState().taskList.action === TaskAction.Success) {
    await getTasksWithParam(
      getState().taskList.paramGetTask,
      getState().taskList.localMenu,
      dispatch,
      getState
    );
  }
};

/**
 * event call api saveLocalNavigation
 * @param localMenuData
 */
export const handleSaveLocalNavigation = localMenuData => async (dispatch, getState) => {
  const params = {
    searchStatic: localMenuData.searchStatic,
    searchDynamic: {
      customersFavourite: [],
      departments: [],
      groups: [],
      scheduleTypes: [],
      equipmentTypes: []
    }
  };
  if (localMenuData.searchDynamic.customersFavourite) {
    params.searchDynamic.customersFavourite = localMenuData.searchDynamic.customersFavourite.map(
      ({ listId, isSelected }) => ({
        listId,
        isSelected
      })
    );
  }
  if (localMenuData.searchDynamic.departments) {
    params.searchDynamic.departments = localMenuData.searchDynamic.departments.map(department => {
      let employeeList = [];
      if (department.employees) {
        employeeList = department.employees.map(({ employeeId, isSelected }) => ({
          employeeId,
          isSelected
        }));
      }
      return {
        employees: employeeList,
        departmentId: department.departmentId,
        isSelected: department.isSelected
      };
    });
  }
  if (localMenuData.searchDynamic.groups) {
    // params.searchDynamic.groups = localMenuData.searchDynamic.groups.map(({ groupId, isSelected }) => ({ groupId, isSelected }));
    params.searchDynamic.groups = localMenuData.searchDynamic.groups.map(group => {
      let employeeList = [];
      if (group.employees) {
        employeeList = group.employees.map(({ employeeId, isSelected }) => ({
          employeeId,
          isSelected
        }));
      }
      return { employees: employeeList, groupId: group.groupId, isSelected: group.isSelected };
    });
  }
  await dispatch({
    type: ACTION_TYPES.TASK_LIST_SAVE_LOCAL_MENU,
    payload: axios.post(
      `${schedulesUrl}/save-local-navigation`,
      PARAM_SAVE_LOCAL_MENU(FUNCTION_DIVISION, params),
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
  if (getState().taskList.action === TaskAction.Success) {
    dispatch({ type: ACTION_TYPES.TASK_LIST_ACTION_CONTINUE_CALL_API });
    await dispatch({ type: ACTION_TYPES.TASK_LIST_SET_LOCAL_MENU, payload: localMenuData });
    await getTasksWithParam(getState().taskList.paramGetTask, localMenuData, dispatch, getState);
  }
};

/**
 * Get custom fields info
 */
export const handleGetCustomFieldsInfo = () => ({
  type: ACTION_TYPES.TASK_LIST_GET_CUSTOM_FIELD_INFO,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'commons/api/get-custom-fields-info'}`,
    { fieldBelong: TASK_DEF.FIELD_BELONG },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit ? ACTION_TYPES.TASK_LIST_CHANGE_TO_EDIT : ACTION_TYPES.TASK_LIST_CHANGE_TO_DISPLAY
});

/**
 * event call api saveLocalNavigation and search local
 * @param localMenuData
 */
export const handleLocalSearchTask = params => async (dispatch, getState) => {
  const localMenuData = getState().taskList.localMenu;
  localMenuData.searchStatic.isAllTime = 1;
  const paramsSaveLocalNavigation = {
    searchStatic: localMenuData.searchStatic,
    searchDynamic: {
      customersFavourite: [],
      departments: [],
      groups: [],
      scheduleTypes: [],
      equipmentTypes: []
    }
  };
  if (localMenuData.searchDynamic.customersFavourite) {
    paramsSaveLocalNavigation.searchDynamic.customersFavourite = localMenuData.searchDynamic.customersFavourite.map(
      ({ listId }) => ({
        listId,
        isSelected: 0
      })
    );
    localMenuData.searchDynamic.customersFavourite.forEach(customer => {
      customer.isSelected = 0;
    });
  }
  if (localMenuData.searchDynamic.departments) {
    paramsSaveLocalNavigation.searchDynamic.departments = localMenuData.searchDynamic.departments.map(
      department => {
        let employeeList = [];
        if (department.employees) {
          employeeList = department.employees.map(({ employeeId }) => ({
            employeeId,
            isSelected: 0
          }));
        }
        return { employees: employeeList, departmentId: department.departmentId, isSelected: 0 };
      }
    );
    localMenuData.searchDynamic.departments.forEach(department => {
      department.isSelected = 0;
      if (department.employees) {
        department.employees.forEach(employee => {
          employee.isSelected = 0;
        });
      }
    });
  }
  if (localMenuData.searchDynamic.groups) {
    paramsSaveLocalNavigation.searchDynamic.groups = localMenuData.searchDynamic.groups.map(
      group => {
        let employeeList = [];
        if (group.employees) {
          employeeList = group.employees.map(({ employeeId }) => ({ employeeId, isSelected: 0 }));
        }
        return { employees: employeeList, groupId: group.groupId, isSelected: 0 };
      }
    );
    localMenuData.searchDynamic.groups.forEach(group => {
      group.isSelected = 0;
      if (group.employees) {
        group.employees.forEach(employee => {
          employee.isSelected = 0;
        });
      }
    });
  }
  await dispatch({
    type: ACTION_TYPES.TASK_LIST_SAVE_LOCAL_MENU,
    payload: axios.post(
      `${schedulesUrl}/save-local-navigation`,
      PARAM_SAVE_LOCAL_MENU(FUNCTION_DIVISION, paramsSaveLocalNavigation),
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
  if (getState().taskList.action === TaskAction.Success) {
    dispatch({ type: ACTION_TYPES.TASK_LIST_ACTION_CONTINUE_CALL_API });
    await dispatch({ type: ACTION_TYPES.TASK_LIST_SET_LOCAL_MENU, payload: localMenuData });
    await dispatch(handleSearchTask(params));
  }
};

export const resetLocalNavigation = () => ({
  type: ACTION_TYPES.INIT_LOCAL_NAVIGATION
});

export const handleChangeOffset = offsets => (dispatch, getState) => {
  dispatch({ type: ACTION_TYPES.TASK_LIST_CHANGE_OFFSETS, payload: offsets });
};
