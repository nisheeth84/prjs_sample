import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { AVAILABLE_FLAG, API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { PARAM_DELETE_TASK, STATUS_TASK } from '../constants';
import _ from 'lodash';
import { modeScreenType, convertFieldType } from 'app/shared/util/fieldType-utils';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import { handleGetTaskWorkGlobalTools } from 'app/modules/global/task/global-control-task.reducer';
import moment from 'moment';
import { STATUS_MILESTONE } from 'app/modules/global/constants';

export const ACTION_TYPES = {
  TASK_DETAIL_RESET: 'taskDetail/RESET_DETAIL_TASK',
  TASK_CHANGE_TO_EDIT: 'taskDetail/EDIT',
  TASK_CHANGE_TO_DISPLAY: 'taskDetail/DISPLAY',
  TASK_DETAIL_TASK_GET: 'taskDetail/TASK_DETAIL_TASK_GET',
  TASK_CHANGE_HISTORY_GET: 'taskDetail/TASK_CHANGE_HISTORY_GET',
  TASK_GET_TASK_LAYOUT: 'taskDetail/TASK_GET_TASK_LAYOUT',
  TASK_DETAIL_UPDATE_STATUS: 'taskDetail/TASK_DETAIL_UPDATE_STATUS',
  TASK_DETAIL_DELETE: 'taskDetail/TASK_DETAIL_DELETE',
  TASK_DETAIL_CHANGE_TO_DISPLAY: 'taskDetail/TASK_DETAIL_CHANGE_TO_DISPLAY',
  TASK_DETAIL_CHANGE_TO_EDIT: 'taskDetail/TASK_DETAIL_CHANGE_TO_EDIT',
  TASK_UPDATE_CUSTOM_FIELD_INFO: 'taskDetail/TASK_UPDATE_CUSTOM_FIELD_INFO',
  TASK_CLOSE_ALL_WINDOWS_OPENED: 'taskDetail/TASK_CLOSE_ALL_WINDOWS_OPENED',
  TASK_GET_TASK_AFTER_UPDATE: 'taskDetail/TASK_GET_TASK_AFTER_UPDATE',
  RESET_MESSAGE: 'taskDetail/RESET_MESSAGE'
};

export enum DetailTaskAction {
  None,
  Request,
  Error,
  UpdateSuccess,
  DeleteSuccess,
  RequestSuccess,
  DonePopup,
  RequestDetail,
  GetTaskSuccess,
  UpdateCustomFileInfoSuccess,
  GetTaskAfterUpdateCustomFieldInfoSuccess
}

const initialState = {
  task: null,
  changeHistory: null,
  taskLayout: null,
  action: DetailTaskAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: null,
  successMessage: null,
  dataDetail: null,
  fieldIds: null,
  tabInfoIds: null,
  fieldInfoTabIds: null,
  taskFieldsUnVailable: null,
  messageUpdateCustomFieldInfoSuccess: null,
  messageUpdateCustomFieldInfoError: null,
  messageChangeStatusSuccess: null,
  errorMessageChangeStatusFailed: null,
  isCloseAllWindownOpened: false
};

export type DetailTaskState = Readonly<typeof initialState>;

/**
 * parse response from create subtask
 * @param res
 */
const parseGeTaskResponse = res => {
  const errorItems = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorItems.push(e);
      });
    }
  }
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const taskData = _.cloneDeep(res);

  taskData.fieldInfo = convertFieldType(taskData.fieldInfo, modeScreenType.typeDetail).filter(
    e =>
      e.fieldName !== 'task_managers' &&
      e.fieldName !== 'task_subordinates' &&
      e.fieldName !== 'customer_id' &&
      e.fieldName !== 'products_tradings_id' &&
      e.fieldName !== 'milestone_id'
  );

  let taskLayout = taskData.fieldInfo
    ? taskData.fieldInfo.filter(field => {
        return field.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE;
      })
    : [];

  let fields = [];
  if (taskLayout.length > 0) {
    taskLayout = _.uniqBy(taskLayout, 'fieldName');
    fields = taskLayout.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  taskData.fieldInfo = fields;

  const filteredUnVailable = res.fieldInfo.filter(field => {
    return field.availableFlag === AVAILABLE_FLAG.UNAVAILABLE;
  });

  return { errorMsg, errorItems, taskData, taskLayout: fields, filteredUnVailable };
};

const convertFieldLabel = (fields: any[]) => {
  const listField = [];
  if (!fields) {
    return listField;
  }
  fields.forEach(e => {
    const obj = _.cloneDeep(e);
    if (!_.isString(obj.fieldLabel)) {
      obj.fieldLabel = JSON.stringify(obj.fieldLabel);
    }
    if (_.has(obj, 'fieldItems') && _.isArray(obj.fieldItems)) {
      obj.fieldItems.forEach((item, idx) => {
        if (_.has(item, 'itemLabel') && !_.isString(item.itemLabel)) {
          obj.fieldItems[idx].itemLabel = JSON.stringify(item.itemLabel);
        }
      });
    }
    if (
      _.toString(obj.fieldType) === DEFINE_FIELD_TYPE.LOOKUP &&
      obj.lookupData &&
      obj.lookupData.itemReflect
    ) {
      obj.lookupData.itemReflect.forEach((item, idx) => {
        if (_.has(item, 'fieldLabel') && !_.isString(item.fieldLabel)) {
          obj.lookupData.itemReflect[idx].fieldLabel = JSON.stringify(item.fieldLabel);
        }
      });
    }
    listField.push(obj);
  });
  return listField;
};

export default (state: DetailTaskState = initialState, action): DetailTaskState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.TASK_DETAIL_TASK_GET):
    case REQUEST(ACTION_TYPES.TASK_CHANGE_HISTORY_GET):
    case REQUEST(ACTION_TYPES.TASK_DETAIL_UPDATE_STATUS):
    case REQUEST(ACTION_TYPES.TASK_DETAIL_DELETE):
      return {
        ...state,
        action: DetailTaskAction.Request,
        errorItems: null,
        errorMessage: null,
        successMessage: null,
        messageChangeStatusSuccess: null,
        errorMessageChangeStatusFailed: null
      };
    case REQUEST(ACTION_TYPES.TASK_UPDATE_CUSTOM_FIELD_INFO):
    case REQUEST(ACTION_TYPES.TASK_GET_TASK_AFTER_UPDATE):
      return {
        ...state,
        messageUpdateCustomFieldInfoSuccess: null,
        messageUpdateCustomFieldInfoError: null
      };
    case FAILURE(ACTION_TYPES.TASK_DETAIL_TASK_GET):
    case FAILURE(ACTION_TYPES.TASK_CHANGE_HISTORY_GET):
    case FAILURE(ACTION_TYPES.TASK_DETAIL_UPDATE_STATUS):
    case FAILURE(ACTION_TYPES.TASK_DETAIL_DELETE):
      return {
        ...state,
        action: DetailTaskAction.Error,
        errorItems: parseErrorRespose(action.payload),
        errorMessage: action.payload.message,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.TASK_UPDATE_CUSTOM_FIELD_INFO):
    case FAILURE(ACTION_TYPES.TASK_GET_TASK_AFTER_UPDATE):
      return {
        ...state,
        messageUpdateCustomFieldInfoError: parseErrorRespose(action.payload)
      };
    case SUCCESS(ACTION_TYPES.TASK_DETAIL_TASK_GET): {
      const result = parseGeTaskResponse(action.payload.data);
      return {
        ...state,
        task: result.taskData,
        taskLayout: result.taskData ? result.taskLayout : {},
        action: DetailTaskAction.GetTaskSuccess,
        dataDetail: action.payload.data,
        taskFieldsUnVailable: result.filteredUnVailable
      };
    }
    case SUCCESS(ACTION_TYPES.TASK_CHANGE_HISTORY_GET): {
      return {
        ...state,
        changeHistory: action.payload.data.data
      };
    }
    case SUCCESS(ACTION_TYPES.TASK_DETAIL_UPDATE_STATUS): {
      return {
        ...state,
        successMessage: 'INF_COM_0004',
        action: DetailTaskAction.UpdateSuccess
      };
    }
    case SUCCESS(ACTION_TYPES.TASK_DETAIL_DELETE): {
      return {
        ...state,
        successMessage: 'INF_COM_0005',
        action: DetailTaskAction.DeleteSuccess
      };
    }
    case SUCCESS(ACTION_TYPES.TASK_UPDATE_CUSTOM_FIELD_INFO): {
      const resUpdateCustomFieldInfo = action.payload.data;
      return {
        ...state,
        fieldIds: resUpdateCustomFieldInfo.fieldIds,
        tabInfoIds: resUpdateCustomFieldInfo.tabInfoIds,
        fieldInfoTabIds: resUpdateCustomFieldInfo.fieldInfoTabIds,
        action: DetailTaskAction.UpdateCustomFileInfoSuccess
      };
    }
    case SUCCESS(ACTION_TYPES.TASK_GET_TASK_AFTER_UPDATE): {
      const resUpdateCustomFieldInfo = parseGeTaskResponse(action.payload.data);
      return {
        ...state,
        task: resUpdateCustomFieldInfo.taskData,
        taskLayout: resUpdateCustomFieldInfo.taskData ? resUpdateCustomFieldInfo.taskLayout : {},
        dataDetail: action.payload.data,
        taskFieldsUnVailable: resUpdateCustomFieldInfo.filteredUnVailable,
        messageUpdateCustomFieldInfoSuccess: 'INF_COM_0004',
        action: DetailTaskAction.GetTaskAfterUpdateCustomFieldInfoSuccess
      };
    }
    case ACTION_TYPES.TASK_DETAIL_CHANGE_TO_DISPLAY:
      return {
        ...state,
        errorItems: [],
        screenMode: ScreenMode.DISPLAY
      };
    case ACTION_TYPES.TASK_DETAIL_CHANGE_TO_EDIT:
      return {
        ...state,
        screenMode: ScreenMode.EDIT
      };
    case ACTION_TYPES.TASK_DETAIL_RESET:
      return {
        ...initialState
      };
    case ACTION_TYPES.RESET_MESSAGE:
      return {
        ...state,
        successMessage: null,
        errorMessage: null
      };
    case ACTION_TYPES.TASK_CLOSE_ALL_WINDOWS_OPENED:
      return {
        ...initialState,
        isCloseAllWindownOpened: true
      };
    default:
      return state;
  }
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.TASK_DETAIL_RESET
});

export const resetMessageTaskDelete = () => {
  return {
    type: ACTION_TYPES.RESET_MESSAGE
  };
};

export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit
    ? ACTION_TYPES.TASK_DETAIL_CHANGE_TO_EDIT
    : ACTION_TYPES.TASK_DETAIL_CHANGE_TO_DISPLAY
});

export const getTaskDetail = taskId => ({
  type: ACTION_TYPES.TASK_DETAIL_TASK_GET,
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'schedules/api/get-task'}`, taskId, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const getChangHistory = (taskId, offset, limit) => ({
  type: ACTION_TYPES.TASK_CHANGE_HISTORY_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'schedules/api/get-task-history'}`,
    { taskId, currentPage: offset, limit },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

/**
 * call api updateTaskStatus
 * @param taskId
 * @param statusTaskId
 * @param updateFlg
 */
export const handleUpdateStatusTask = (taskId, statusTaskId, updateFlg) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.TASK_DETAIL_UPDATE_STATUS,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/update-task-status'}`,
      { taskId, statusTaskId, updateFlg },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
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
 * call api deleteTask
 * @param taskIdList
 * @param updateFlg
 */
export const handleDeleteTask = (taskIdList, updateFlg) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.TASK_DETAIL_DELETE,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/delete-tasks'}`,
      PARAM_DELETE_TASK(taskIdList, updateFlg),
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
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

export const updateCustomFieldInfo = (
  fieldBelong,
  deleteFields,
  fields,
  tabs,
  deleteFieldsTab,
  fieldsTab,
  taskCurrentId
) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.TASK_UPDATE_CUSTOM_FIELD_INFO,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'commons/api/update-custom-fields-info'}`,
      {
        fieldBelong,
        deletedFields: deleteFields,
        fields: convertFieldLabel(fields),
        tabs,
        deletedFieldsTab: deleteFieldsTab,
        fieldsTab
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  });
  if (getState().detailTask.action === DetailTaskAction.UpdateCustomFileInfoSuccess) {
    await dispatch({
      type: ACTION_TYPES.TASK_GET_TASK_AFTER_UPDATE,
      payload: axios.post(`${API_CONTEXT_PATH + '/' + 'schedules/api/get-task'}`, taskCurrentId, {
        headers: { ['Content-Type']: 'application/json' }
      })
    });
  }
};

export const handleInitTaskDetail = taskId => async (dispatch, getState) => {
  if (taskId != null) {
    await dispatch(getTaskDetail(taskId));
  }
};

export const handleUpdateCustomFieldInfo = (
  fieldBelong,
  deleteFields,
  fields,
  tabs,
  deleteFieldsTab,
  fieldsTab,
  taskCurrentId
) => async (dispatch, getState) => {
  if (fieldBelong != null) {
    await dispatch(
      updateCustomFieldInfo(
        fieldBelong,
        deleteFields,
        fields,
        tabs,
        deleteFieldsTab,
        fieldsTab,
        taskCurrentId
      )
    );
  }
};

export const handleInitChangeHistory = (taskId, offset, limit) => async (dispatch, getState) => {
  if (taskId != null) {
    await dispatch(getChangHistory(taskId, offset, limit));
  }
};

export const handleReorderField = (dragIndex, dropIndex) => (dispatch, getState) => {
  const { fieldInfos } = getState().employeeList;
  const objectFieldInfos = JSON.parse(JSON.stringify(fieldInfos));

  if (
    objectFieldInfos &&
    objectFieldInfos.fieldInfoPersonals &&
    objectFieldInfos.fieldInfoPersonals.length > 0
  ) {
    const tempObject = objectFieldInfos.fieldInfoPersonals.splice(
      dragIndex,
      1,
      objectFieldInfos.fieldInfoPersonals[dropIndex]
    )[0]; // get the item from the array
    objectFieldInfos.fieldInfoPersonals.splice(dropIndex, 1, tempObject);
  }
};

/**
 * Close all modal is opended
 */
export const closeAllDetailTaskModalOpened = () => ({
  type: ACTION_TYPES.TASK_CLOSE_ALL_WINDOWS_OPENED
});
