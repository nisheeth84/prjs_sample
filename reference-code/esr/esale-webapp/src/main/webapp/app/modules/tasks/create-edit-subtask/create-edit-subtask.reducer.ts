import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import _ from 'lodash';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { TASK_ACTION_TYPES, PARAM_CREATE_TASK, PARAM_UPDATE_TASK } from '../constants';
import { handleGetTaskWorkGlobalTools } from 'app/modules/global/task/global-control-task.reducer';
import { STATUS_TASK } from 'app/modules/tasks/constants';
import moment from 'moment';
import { STATUS_MILESTONE } from 'app/modules/global/constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';

export const ACTION_TYPES = {
  TASK_GET_LAYOUT: 'task/subtask/GET_TASK_LAYOUT',
  TASK_GET_EDIT: 'task/subtask/GET_EDIT',
  TASK_CREATE: 'task/subtask/CREATE',
  TASK_UPDATE: 'task/subtask/UPDATE',
  TASK_UPDATE_DETAIL: 'task/subtask/UPDATE_DETAIL',
  TASK_RESET: 'task/subtask/RESET',
  TASK_VALIDATE_ERROR: 'task/subtask/VALIDATE_ERROR',
  TASK_OPEN_EDIT_MODAL: 'task/subtask/OPEN_EDIT_MODAL',
  TASK_UPDATE_FIELDS: 'task/subtask/UPDATE_FIELDS',
  TASK_CLOSE_ALL_WINDOWS_OPENED: 'task/subtask/TASK_CLOSE_ALL_WINDOWS_OPENED'
};

export enum TaskAction {
  None,
  RequestModal,
  ErrorModal,
  GetTaskLayoutSuccess,
  UpdateTaskSuccess,
  UpdateTaskFailure,
  CreateTaskSuccess,
  CreateTaskFailure,
  GetTaskSuccess
}

const initialState = {
  action: TaskAction.None,
  taskData: {},
  fields: [],
  errorItems: [],
  errorMessage: null,
  successMessage: null,
  taskIdCreated: null,
  dataInfo: {},
  isCloseAllWindownOpened: false
};

/**
 * parse response from api getTaskLayout
 * @param res
 */
const parseGetTaskLayoutResponse = res => {
  let taskLayout = res.fieldInfo ? res.fieldInfo : [];
  const dataInfo = res.dataInfo ? res.dataInfo : [];

  const action = TaskAction.GetTaskLayoutSuccess;
  let fields = [];
  if (taskLayout.length > 0) {
    taskLayout = _.uniqBy(taskLayout, 'fieldName');
    fields = taskLayout.filter(e => e.availableFlag).sort((a, b) => a.fieldOrder - b.fieldOrder);
  }

  return { action, fields, dataInfo };
};

/**
 * parse response from api getTask
 * @param res
 */
const parseGetTaskDetailResponse = res => {
  let taskLayout = res.fieldInfo ? res.fieldInfo : [];

  const dataInfo = res.dataInfo ? res.dataInfo : {};
  const taskData = dataInfo.task ? dataInfo.task : {};
  const taskReceive = Object.assign({}, taskData);

  const taskDataDynamic = taskReceive.taskData || [];
  taskReceive.isPublic = taskReceive.isPublic ? { isPublic: true } : false;
  taskReceive.status = taskReceive.statusTaskId || '';
  const subtasks = taskReceive.subtasks ? [...taskReceive.subtasks] : [];
  taskReceive.subtasks = subtasks.map(subItem => {
    subItem.added = true;
    return subItem;
  });
  taskReceive.taskData = {};
  taskDataDynamic.forEach(itemData => {
    taskReceive.taskData[itemData.key] = itemData.value;
  });

  const action = TaskAction.GetTaskSuccess;
  let fields = [];
  if (taskLayout.length > 0) {
    taskLayout = _.uniqBy(taskLayout, 'fieldName');
    fields = taskLayout.filter(e => e.availableFlag).sort((a, b) => a.fieldOrder - b.fieldOrder);
  }

  return { action, fields, taskData: Object.assign({}, taskReceive) };
};

/**
 * parse response from create subtask
 * @param res
 */
const parseCreateEditSubTaskResponse = res => {
  let taskId = null;
  if (res.taskId) {
    taskId = res.taskId;
  }
  return { taskId };
};

export type SubTaskInfoState = Readonly<typeof initialState>;

export default (state: SubTaskInfoState = initialState, action): SubTaskInfoState => {
  let res = null;
  switch (action.type) {
    case REQUEST(ACTION_TYPES.TASK_GET_LAYOUT):
    case REQUEST(ACTION_TYPES.TASK_GET_EDIT):
    case REQUEST(ACTION_TYPES.TASK_CREATE):
    case REQUEST(ACTION_TYPES.TASK_UPDATE_DETAIL):
      return {
        ...state,
        action: TaskAction.RequestModal,
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.TASK_GET_LAYOUT):
    case FAILURE(ACTION_TYPES.TASK_GET_EDIT):
    case FAILURE(ACTION_TYPES.TASK_CREATE):
    case FAILURE(ACTION_TYPES.TASK_UPDATE_DETAIL):
      return {
        ...state,
        action: TaskAction.ErrorModal,
        errorMessage: action.payload.message,
        errorItems: parseErrorRespose(action.payload),
        successMessage: null
      };
    case SUCCESS(ACTION_TYPES.TASK_GET_EDIT): {
      res = parseGetTaskDetailResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        successMessage: null,
        fields: res.fields,
        taskData: res.taskData
      };
    }

    case SUCCESS(ACTION_TYPES.TASK_GET_LAYOUT): {
      res = parseGetTaskLayoutResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        successMessage: null,
        fields: res.fields,
        dataInfo: res.dataInfo
      };
    }

    case SUCCESS(ACTION_TYPES.TASK_CREATE):
      res = parseCreateEditSubTaskResponse(action.payload.data);
      return {
        ...state,
        successMessage: 'INF_COM_0003',
        action: TaskAction.CreateTaskSuccess,
        taskIdCreated: res.taskId
      };
    case SUCCESS(ACTION_TYPES.TASK_UPDATE_DETAIL): {
      res = parseCreateEditSubTaskResponse(action.payload.data);
      return {
        ...state,
        action: TaskAction.UpdateTaskSuccess,
        successMessage: 'INF_COM_0004',
        taskIdCreated: res.taskId
      };
    }
    case ACTION_TYPES.TASK_RESET:
      return {
        ...initialState
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

const taskApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

/**
 * get field info for create task
 */
const getTaskLayout = () => ({
  type: ACTION_TYPES.TASK_GET_LAYOUT,
  payload: axios.post(`${taskApiUrl}/get-task-layout`, null, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

/**
 * get task detail for edit
 * @param params
 */
const getTask = params => ({
  type: ACTION_TYPES.TASK_GET_EDIT,
  payload: axios.post(
    `${taskApiUrl}/get-task`,
    {
      taskId: params.taskId,
      language: null
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * build form data
 * @param params value query
 * @param taskActionType flag action
 * @param fileUpload fileUpload
 */
const buildFormData = (params, taskActionType, fileUpload) => {
  const data = new FormData();
  let filesNameList: any;
  let mapFile = '';
  let separate = '';

  if (taskActionType === TASK_ACTION_TYPES.CREATE) {
    data.append('data', JSON.stringify(PARAM_CREATE_TASK(params)));
  } else if (taskActionType === TASK_ACTION_TYPES.UPDATE) {
    data.append('taskId', params['taskId']);
    data.append('data', JSON.stringify(PARAM_UPDATE_TASK(params)));
  }

  fileUpload.forEach((file, index) => {
    const key = Object.keys(file)[0];
    if (key) {
      mapFile += separate + `"${key}": ["variables.files.${index}"]`;
      data.append('files', file[key]);
      if (!filesNameList) {
        filesNameList = [];
      }
      filesNameList.push(key);
      separate = ',';
    }
  });
  if (filesNameList) {
    data.append('filesMap', filesNameList);
  }
  return data;
};

/**
 * create task
 * @param params
 */
const createTask = (params, taskActionType, fileUpload) => ({
  type: ACTION_TYPES.TASK_CREATE,
  payload: axios.post(
    `${taskApiUrl}/create-task`,
    buildFormData(params, taskActionType, fileUpload),
    {
      headers: { ['Content-Type']: 'multipart/form-data' }
    }
  )
});

/**
 * update task
 * @param params
 */
const updateTask = (params, taskActionType, fileUpload) => ({
  type: ACTION_TYPES.TASK_UPDATE_DETAIL,
  payload: axios.post(
    `${taskApiUrl}/update-task`,
    buildFormData(params, taskActionType, fileUpload),
    {
      headers: { ['Content-Type']: 'multipart/form-data' }
    }
  )
});

/**
 * get data for create or edit task
 * @param params
 * @param taskModalMode
 */
export const handleGetDataTask = (params, taskModalMode) => async dispatch => {
  if (taskModalMode === TASK_ACTION_TYPES.CREATE) {
    await dispatch(getTaskLayout());
  } else if (taskModalMode === TASK_ACTION_TYPES.UPDATE) {
    await dispatch(getTask(params));
  }
};

/**
 * submit create or update task
 * @param params
 * @param taskModalMode
 */
export const handleSubmitTaskData = (params, taskActionType, fileUpload) => async dispatch => {
  if (taskActionType === TASK_ACTION_TYPES.CREATE) {
    await dispatch(createTask(params, taskActionType, fileUpload));
  } else if (taskActionType === TASK_ACTION_TYPES.UPDATE) {
    await dispatch(updateTask(params, taskActionType, fileUpload));
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
 * update list field info after get detail task edit
 */
export const updateListFields = () => dispatch => {
  dispatch({
    type: ACTION_TYPES.TASK_UPDATE_FIELDS,
    payload: {}
  });
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.TASK_RESET
});

/**
 * close All CreateEditSubTaskModal Opened
 */
export const closeAllCreateEditSubTaskModalOpened = () => ({
  type: ACTION_TYPES.TASK_CLOSE_ALL_WINDOWS_OPENED
});
