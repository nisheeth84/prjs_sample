import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import _ from 'lodash';
import { API_CONTEXT_PATH, API_CONFIG } from 'app/config/constants';
import {
  TASK_ACTION_TYPES,
  PARAM_DELETE_TASK,
  PARAM_CREATE_TASK,
  PARAM_UPDATE_TASK
} from '../constants';
import { handleGetTaskWorkGlobalTools } from 'app/modules/global/task/global-control-task.reducer';
import { STATUS_TASK } from 'app/modules/tasks/constants';
import moment from 'moment';
import { STATUS_MILESTONE } from 'app/modules/global/constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';

export const ACTION_TYPES = {
  TASK_GET_LAYOUT: 'task/GET_TASK_LAYOUT',
  TASK_GET_EDIT: 'task/GET_EDIT',
  TASK_CREATE: 'task/CREATE',
  TASK_UPDATE: 'task/UPDATE',
  TASK_UPDATE_DETAIL: 'task/UPDATE_DETAIL',
  TASK_RESET: 'task/RESET',
  TASK_DELETE_SUBTASK: 'task/DELETE_SUBTASK',
  TASK_VALIDATE_ERROR: 'task/VALIDATE_ERROR',
  TASK_OPEN_EDIT_MODAL: 'task/OPEN_EDIT_MODAL',
  TASK_UPDATE_FIELDS: 'task/UPDATE_FIELDS',
  SET_TASK_COPY: 'task/SET_TASK_COPY',
  TASK_UPDATE_FLG_CLOSE_WINDOWS: 'task/TASK_UPDATE_FLG_CLOSE_WINDOWS',
  TASK_CLOSE_ALL_WINDOWS_OPENED: 'task/TASK_CLOSE_ALL_WINDOWS_OPENED',
  GET_PRODUCT_TRADINGS_BY_IDS: 'task/GET_PRODUCT_TRADINGS_BY_IDS',
  GET_CUSTOMERS_BY_IDS: 'task/GET_CUSTOMERS_BY_IDS'
};

export enum TaskAction {
  None,
  RequestModal,
  GetTaskLayoutSuccess,
  UpdateTaskSuccess,
  UpdateTaskFailure,
  DeleteSubtaskSuccess,
  DeleteSubtaskFailure,
  CreateTaskSuccess,
  CreateTaskFailure,
  GetTaskSuccess,
  ErrorModal,
  GetProductTradingsSuccess
}

const initialState = {
  action: TaskAction.None,
  taskData: {},
  fields: [],
  errorItems: [],
  errorMessage: null,
  successMessage: null,
  listTaskDelete: [],
  dataInfo: {},
  flgCloseWindows: false,
  taskId: null,
  isCloseAllWindownOpened: false,
  productTradings: [],
  customers: [],
  milestones: []
};

/**
 * parse response from api getTaskLayout
 * @param res
 */
const parseGetTaskLayoutResponse = res => {
  let taskLayout = res.fieldInfo ? res.fieldInfo : [];
  const dataInfo = res.dataInfo ? res.dataInfo : [];
  const customers = res.customers ? res.customers : [];
  const milestones = res.milestones ? res.milestones : [];
  const action = TaskAction.GetTaskLayoutSuccess;
  let fields = [];
  if (taskLayout.length > 0) {
    taskLayout = _.uniqBy(taskLayout, 'fieldName');
    fields = taskLayout.filter(e => e.availableFlag).sort((a, b) => a.fieldOrder - b.fieldOrder);
  }

  return { action, fields, dataInfo, customers, milestones };
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
 * parse response from api delete subtask
 * @param res
 */
const parseDeleteSubTaskResponse = res => {
  const dataRequest = res.data || {};
  const taskIds =
    dataRequest.deleteTasks && dataRequest.deleteTasks.tasksIds
      ? dataRequest.deleteTasks.tasksIds
      : [];
  const listTaskId = taskIds.map(item => item.taskId);
  const action = TaskAction.DeleteSubtaskSuccess;
  return { action, taskIds: listTaskId };
};

/**
 * parse response from api update task
 * @param res
 */
const parseCreateEditTaskResponse = res => {
  let taskId = null;
  if (res && res.taskId) {
    taskId = res.taskId;
  }
  return { taskId };
};

/**
 * parse response from api getProductTradingByIds
 * @param res
 */
const parseGetProductTradingsResponse = res => {
  const productTradings = res.productTradings ? res.productTradings : [];
  const action = TaskAction.GetProductTradingsSuccess;
  return { action, productTradings };
};

export type TaskInfoState = Readonly<typeof initialState>;

export default (state: TaskInfoState = initialState, action): TaskInfoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.TASK_GET_LAYOUT):
    case REQUEST(ACTION_TYPES.TASK_GET_EDIT):
    case REQUEST(ACTION_TYPES.TASK_DELETE_SUBTASK):
    case REQUEST(ACTION_TYPES.TASK_CREATE):
    case REQUEST(ACTION_TYPES.TASK_UPDATE_DETAIL):
    case REQUEST(ACTION_TYPES.GET_PRODUCT_TRADINGS_BY_IDS):
      return {
        ...state,
        action: TaskAction.RequestModal,
        errorMessage: null,
        successMessage: null
      };
    case FAILURE(ACTION_TYPES.TASK_GET_LAYOUT):
    case FAILURE(ACTION_TYPES.TASK_GET_EDIT):
    case FAILURE(ACTION_TYPES.TASK_DELETE_SUBTASK):
    case FAILURE(ACTION_TYPES.TASK_CREATE):
    case FAILURE(ACTION_TYPES.TASK_UPDATE_DETAIL):
    case FAILURE(ACTION_TYPES.GET_PRODUCT_TRADINGS_BY_IDS):
      return {
        ...state,
        action: TaskAction.ErrorModal,
        errorMessage: action.payload.message,
        errorItems: parseErrorRespose(action.payload)
      };
    case SUCCESS(ACTION_TYPES.TASK_GET_EDIT):
    case ACTION_TYPES.SET_TASK_COPY: {
      const res = parseGetTaskDetailResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        successMessage: null,
        fields: res.fields,
        taskData: res.taskData
      };
    }

    case SUCCESS(ACTION_TYPES.TASK_GET_LAYOUT): {
      const res = parseGetTaskLayoutResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        successMessage: null,
        fields: res.fields,
        dataInfo: res.dataInfo,
        customers: res.customers,
        milestones: res.milestones
      };
    }

    case SUCCESS(ACTION_TYPES.TASK_CREATE): {
      const res = parseCreateEditTaskResponse(action.payload.data);
      return {
        ...state,
        successMessage: 'INF_COM_0003',
        action: TaskAction.CreateTaskSuccess,
        taskId: res.taskId
      };
    }

    case SUCCESS(ACTION_TYPES.TASK_DELETE_SUBTASK): {
      const res = parseDeleteSubTaskResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        successMessage: null,
        listTaskDelete: res.taskIds
      };
    }

    case SUCCESS(ACTION_TYPES.TASK_UPDATE_DETAIL): {
      const res = parseCreateEditTaskResponse(action.payload.data);
      return {
        ...state,
        action: TaskAction.UpdateTaskSuccess,
        successMessage: 'INF_COM_0004',
        taskId: res.taskId
      };
    }
    case SUCCESS(ACTION_TYPES.GET_PRODUCT_TRADINGS_BY_IDS): {
      const res = parseGetProductTradingsResponse(action.payload.data);
      return {
        ...state,
        action: TaskAction.GetProductTradingsSuccess,
        productTradings: res.productTradings
      };
    }
    case ACTION_TYPES.TASK_UPDATE_FLG_CLOSE_WINDOWS:
      return {
        ...state,
        flgCloseWindows: action.payload.data
      };
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

// API base URL
const taskApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;
const saleApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH;

/**
 * get field info for create task
 */
const getTaskLayout = params => {
  if (!params) {
    return {
      type: ACTION_TYPES.TASK_GET_LAYOUT,
      payload: axios.post(`${taskApiUrl}/get-task-layout`, null, {
        headers: { ['Content-Type']: 'application/json' }
      })
    };
  }
  return {
    type: ACTION_TYPES.TASK_GET_LAYOUT,
    payload: axios.post(
      `${taskApiUrl}/get-task-layout`,
      { customerIds: params.customerIds, milestoneIds: params.milestoneIds },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  };
};

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
 * delete subtask
 * @param params
 */
const deleteSubTask = params => ({
  type: ACTION_TYPES.TASK_DELETE_SUBTASK,
  payload: axios.post(
    `${taskApiUrl}/delete-tasks`,
    PARAM_DELETE_TASK(params.taskIdList, params.processFlg),
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

const updateFlgCloseWindows = flgClose => ({
  type: ACTION_TYPES.TASK_UPDATE_FLG_CLOSE_WINDOWS,
  payload: {
    data: flgClose
  }
});

/**
 * get data task layout for create or get data task for edit
 * @param params
 * @param taskModalMode
 */
export const handleGetDataTask = (params, taskModalMode) => async dispatch => {
  if (taskModalMode === TASK_ACTION_TYPES.CREATE) {
    await dispatch(getTaskLayout(params));
  } else if (taskModalMode === TASK_ACTION_TYPES.UPDATE) {
    await dispatch(getTask(params));
  }
};

/**
 * submit create or edit task
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
 * delete subtask
 * @param taskIdList
 * @param processFlg
 */
export const handleDeleteSubTask = (taskIdList, processFlg, closeWindows) => async dispatch => {
  dispatch(updateFlgCloseWindows(closeWindows));
  await dispatch(
    deleteSubTask({
      taskIdList,
      processFlg
    })
  );
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
 * close All CreateEditTaskModel Opened
 */
export const closeAllCreateEditTaskModalOpened = () => ({
  type: ACTION_TYPES.TASK_CLOSE_ALL_WINDOWS_OPENED
});

/**
 * set info Task copy to store
 */
export const setTaskCopyToStore = params => ({
  type: ACTION_TYPES.SET_TASK_COPY,
  payload: {
    data: params
  }
});

/**
 * Set Task copy
 */
export const setTaskCopy = params => async (dispatch, getState) => {
  params.data.getTask.dataInfo.task.taskId = null;
  params.data.getTask.dataInfo.task.subtasks = [];
  await dispatch(setTaskCopyToStore(params));
};

/**
 * Get product tradings by ids
 * @param params
 */
const getProductTradingsIds = productTradingIds => ({
  type: ACTION_TYPES.GET_PRODUCT_TRADINGS_BY_IDS,
  payload: axios.post(
    `${saleApiUrl}/get-product-tradings-by-ids`,
    { productTradingIds },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Handle get product tradings by ids
 * @param productTradingIds
 */
export const handleGetProductTradingsByIds = productTradingIds => async dispatch => {
  await dispatch(getProductTradingsIds(productTradingIds));
};
