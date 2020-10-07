import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import _ from 'lodash';
import { STATUS_MILESTONE, MILESTONE_UPDATE_FLG } from 'app/modules/global/constants';
import moment from 'moment';
import { STATUS_TASK, TASK_UPDATE_FLG } from 'app/modules/tasks/constants';
// import {DUMMY_FIELD_INFO_GLOBAL_TASK} from 'app/modules/global/dummy'
export const ACTION_TYPES = {
  GLOBAL_GET_TODO_TASK: 'globalTask/GET_TODO_TASK',
  GLOBAL_GET_FINISH_TASK: 'globalTask/GET_FINISH_TASK',
  GLOBAL_DELETE_TASK: 'globalTask/GLOBAL_DELETE_TASK',
  GLOBAL_DELETE_TASK_GET_TODO: 'globalTask/GLOBAL_DELETE_TASK_GET_TODO',
  GLOBAL_DELETE_TASK_GET_FINISH: 'globalTask/GLOBAL_DELETE_TASK_GET_TODO',
  GLOBAL_UPDATE_STATUS_TASK: 'globalTask/GLOBAL_UPDATE_STATUS_TASK',
  GLOBAL_UPDATE_STATUS_TASK_GET_TODO: 'globalTask/GLOBAL_UPDATE_STATUS_TASK_GET_TODO',
  GLOBAL_UPDATE_STATUS_TASK_GET_FINISH: 'globalTask/GLOBAL_UPDATE_STATUS_TASK_GET_FINISH',
  GLOBAL_UPDATE_STATUS_MILESTONE: 'globalTask/GLOBAL_UPDATE_STATUS_MILESTONE',
  GLOBAL_COLLAPSE_TODO_TASK: 'globalTool/COLLAPSE_TODO_TASK',
  GLOBAL_COLLAPSE_FINISH_TASK: 'globalTool/COLLAPSE_FINISH_TASK',
  GLOBAL_DELETE_MILESTONE: 'globalTool/GLOBAL_DELETE_MILESTONE',
  GLOBAL_SET_DATA: 'globalTool/SET_DATA',
  GLOBAL_TASK_NAME: 'globalTool/TASK_NAME'
};
import { parseErrorRespose } from 'app/shared/util/string-utils';

export enum GlobalAction {
  None,
  Request,
  Error,
  Success
}

const initialState = {
  action: GlobalAction.None,
  errorMessage: null,
  globalTaskWorking: [],
  globalTaskFinished: [],
  openTodoTaskFirst: true,
  openFinishTaskFirst: false,
  showMsg: false,
  countGlobalTaskWorking: 0,
  countGlobalTaskFinished: 0,
  currentTaskId: 0,
  errorItem: null,
  position: null,
  globalData: [],
  type: '',
  isShowComponent: false
};

// API base URL
const globalUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

export type GlobalState = Readonly<typeof initialState>;

/**
 * count total task and milestone in list
 * @param list
 */
const countTaskMilestone = list => {
  let count = 0;
  list.forEach(task => {
    if (task.taskData) {
      count += 1;
    }
    if (task.milestoneData) {
      count += 1;
    }
  });
  return count;
};

/**
 * parse Response getTaskGlobalTool
 * @param res
 */
const parseGlobalListTaskResponse = res => {
  let errorMsg = _.get(res, 'errors[0].message', '');
  if (_.has(res, 'errors[0].extensions.errors[0].errorCode')) {
    errorMsg = res.errors[0].extensions.errors[0].errorCode;
  }
  const action = errorMsg.length > 0 ? GlobalAction.Error : GlobalAction.Success;
  let globalTasks = [];
  if (_.has(res, 'dataGlobalTools[0]')) {
    globalTasks = res.dataGlobalTools;
    globalTasks = globalTasks.map(item => {
      if (item.taskData && item.taskData.files) {
        // add file extension
        item.taskData.files = item.taskData.files.map(file => {
          if (!file.filePath) return file;
          let extension = file.filePath.split('.').pop();
          if (extension === 'jpg' || extension === 'png') {
            extension = 'img';
          }
          file.extension = extension;
          return file;
        });
      }
      return item;
    });
  }
  return { errorMsg, action, globalTasks };
};

/**
 * parser the response of api updateTaskStatus
 * @param res
 * @param state
 */
const parseResponseUpdateTaskStatus = (res, state) => {
  let errorMsg = _.get(res, 'errors[0].message', '');
  if (_.has(res, 'errors[0].extensions.errors[0].errorCode')) {
    errorMsg = res.errors[0].extensions.errors[0].errorCode;
  }
  if (res.errors && (!errorMsg || errorMsg.length === 0)) {
    errorMsg = 'WAR_TOD_0001';
  }
  const action = res.errors ? GlobalAction.Error : GlobalAction.Success;
  return { action, errorMsg };
};

/**
 * parse response call api updateMilestoneStatus
 * @param res
 * @param state
 */
const parseApiResponseUpdate = res => {
  let errorMsg = _.get(res, 'errors[0].message', '');
  if (_.has(res, 'errors[0].extensions.errors[0].errorCode')) {
    errorMsg = res.errors[0].extensions.errors[0].errorCode;
  }
  const action = res.errors ? GlobalAction.Error : GlobalAction.Success;
  return { action, errorMsg };
};

/**
 * remove a task from list, subtask from a task, task from a milestone
 * @param dataList
 * @param taskId
 */
const removeTaskFromList = (dataList, removedIds) => {
  for (let i = 0; i < dataList.length; i++) {
    const data = dataList[i];
    if (data.taskData && removedIds.includes(data.taskData.taskId)) {
      data.taskData = null;
    }
    if (_.has(data, 'taskData.subtasks[0]')) {
      for (let j = 0; j < data.taskData.subtasks.length; j++) {
        if (removedIds.includes(data.taskData.subtasks[j].taskId)) {
          data.taskData.subtasks.splice(j, 1);
          data.taskData.countSubtask -= 1;
        }
      }
    }
    if (_.has(data, 'milestoneData.tasks[0]')) {
      for (let j = 0; j < data.milestoneData.tasks.length; j++) {
        if (removedIds.includes(data.milestoneData.tasks[j].taskId)) {
          data.milestoneData.tasks.splice(j, 1);
          data.milestoneData.countTask -= 1;
        }
      }
    }
  }
};

/**
 * parse response call api deleteTasks
 * @param res
 * @param state
 */
const parseResponseDeleteTask = (res, state) => {
  let errorMsg = _.get(res, 'errors[0].message', '');
  if (_.has(res, 'errors[0].extensions.errors[0].errorCode')) {
    errorMsg = res.errors[0].extensions.errors[0].errorCode;
  }
  const action = res.errors ? GlobalAction.Error : GlobalAction.Success;
  const taskWorking = state.globalTaskWorking;
  const taskFinished = state.globalTaskFinished;
  if (action === GlobalAction.Success && _.has(res, 'taskIds[0]')) {
    errorMsg = 'INF_COM_0005';
    const removedIds = res.taskIds;
    removeTaskFromList(taskWorking, removedIds);
    removeTaskFromList(taskFinished, removedIds);
  }
  return { action, errorMsg, taskFinished, taskWorking };
};

// Reducer
export default (state: GlobalState = initialState, action): GlobalState => {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_COLLAPSE_TODO_TASK:
      return {
        ...state,
        openTodoTaskFirst: action.payload
      };
    case ACTION_TYPES.GLOBAL_COLLAPSE_FINISH_TASK:
      return {
        ...state,
        openFinishTaskFirst: action.payload
      };
    case ACTION_TYPES.GLOBAL_SET_DATA: {
      const {
        errorMessage,
        globalTaskWorking,
        globalTaskFinished,
        countGlobalTaskWorking,
        countGlobalTaskFinished
      } = action.payload;
      return {
        ...state,
        errorMessage,
        globalTaskWorking,
        globalTaskFinished,
        countGlobalTaskWorking,
        countGlobalTaskFinished
      };
    }
    case REQUEST(ACTION_TYPES.GLOBAL_GET_TODO_TASK):
    case REQUEST(ACTION_TYPES.GLOBAL_GET_FINISH_TASK):
    case REQUEST(ACTION_TYPES.GLOBAL_UPDATE_STATUS_TASK):
    case REQUEST(ACTION_TYPES.GLOBAL_UPDATE_STATUS_MILESTONE):
    case REQUEST(ACTION_TYPES.GLOBAL_DELETE_TASK):
    case REQUEST(ACTION_TYPES.GLOBAL_DELETE_MILESTONE):
      return {
        ...state,
        action: GlobalAction.Request
      };
    case FAILURE(ACTION_TYPES.GLOBAL_GET_TODO_TASK):
    case FAILURE(ACTION_TYPES.GLOBAL_GET_FINISH_TASK):
    case FAILURE(ACTION_TYPES.GLOBAL_UPDATE_STATUS_TASK):
    case FAILURE(ACTION_TYPES.GLOBAL_UPDATE_STATUS_MILESTONE):
    case FAILURE(ACTION_TYPES.GLOBAL_DELETE_TASK):
    case FAILURE(ACTION_TYPES.GLOBAL_DELETE_MILESTONE): {
      return {
        ...state,
        action: GlobalAction.Error,
        errorItem: parseErrorRespose(action.payload)
      };
    }
    case ACTION_TYPES.GLOBAL_GET_TODO_TASK:
    case SUCCESS(ACTION_TYPES.GLOBAL_GET_TODO_TASK): {
      const res = parseGlobalListTaskResponse(action.payload.data);
      let task = res.globalTasks;
      task = task.map(item => {
        if (item.taskData) {
          item.taskData.isFinished = false;
          item.taskData.originStatus = STATUS_MILESTONE.TODO;
        }
        if (item.milestoneData) {
          item.milestoneData.isFinished = false;
          item.milestoneData.originStatus = STATUS_MILESTONE.TODO;
        }
        return item;
      });
      task.sort((a, b) => {
        if (a.milestoneData || b.milestoneData) {
          return 0;
        } else {
          const endDateA = moment(a.finishDate)
            .toDate()
            .getTime();
          const endDateB = moment(b.finishDate)
            .toDate()
            .getTime();
          if (endDateA !== endDateB) {
            return endDateA - endDateB;
          } else if (a.statusTaskId !== b.statusTaskId) {
            return a.statusTaskId - b.statusTaskId;
          } else {
            const startDateA = moment(a.startDate)
              .toDate()
              .getTime();
            const startDateB = moment(b.startDate)
              .toDate()
              .getTime();
            if (startDateA !== startDateB) {
              return startDateB - startDateA;
            } else {
              return b.taskId - a.taskId;
            }
          }
        }
      });
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        globalTaskWorking: task,
        countGlobalTaskWorking: countTaskMilestone(task)
      };
    }
    case ACTION_TYPES.GLOBAL_GET_FINISH_TASK:
    case SUCCESS(ACTION_TYPES.GLOBAL_GET_FINISH_TASK): {
      const res = parseGlobalListTaskResponse(action.payload.data);
      let task = res.globalTasks;
      task = task.map(item => {
        if (item.taskData) {
          item.taskData.isFinished = true;
          item.taskData.originStatus = STATUS_MILESTONE.FINISH;
        }
        if (item.milestoneData) {
          item.milestoneData.isFinished = true;
          item.milestoneData.originStatus = STATUS_MILESTONE.FINISH;
        }
        return item;
      });
      task.sort((a, b) => {
        if (a.milestoneData || b.milestoneData) {
          return 0;
        } else {
          const dateA = moment(a.finishDate)
            .toDate()
            .getTime();
          const dateB = moment(b.finishDate)
            .toDate()
            .getTime();
          if (dateA !== dateB) {
            return dateB - dateA;
          } else {
            return b.taskId - a.taskId;
          }
        }
      });
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        globalTaskFinished: task,
        countGlobalTaskFinished: countTaskMilestone(task)
      };
    }
    case ACTION_TYPES.GLOBAL_UPDATE_STATUS_TASK:
    case SUCCESS(ACTION_TYPES.GLOBAL_UPDATE_STATUS_TASK): {
      const res = parseResponseUpdateTaskStatus(action.payload.data, state);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        showMsg: !state.showMsg
      };
    }
    case ACTION_TYPES.GLOBAL_DELETE_TASK:
    case SUCCESS(ACTION_TYPES.GLOBAL_DELETE_TASK): {
      const res = parseResponseDeleteTask(action.payload.data, state);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        globalTaskFinished: res.taskFinished,
        globalTaskWorking: res.taskWorking,
        showMsg: !state.showMsg,
        countGlobalTaskWorking: countTaskMilestone(res.taskWorking),
        countGlobalTaskFinished: countTaskMilestone(res.taskFinished)
      };
    }
    case ACTION_TYPES.GLOBAL_DELETE_MILESTONE:
    case SUCCESS(ACTION_TYPES.GLOBAL_DELETE_MILESTONE):
    case ACTION_TYPES.GLOBAL_UPDATE_STATUS_MILESTONE:
    case SUCCESS(ACTION_TYPES.GLOBAL_UPDATE_STATUS_MILESTONE): {
      const res = parseApiResponseUpdate(action.payload.data);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        showMsg: !state.showMsg
      };
    }
    case ACTION_TYPES.GLOBAL_TASK_NAME:
      return {
        ...state,
        position: action.payload.position,
        globalData: action.payload.globalData,
        type: action.payload.type,
        isShowComponent: action.payload.isShowComponent
      };
    default:
      return state;
  }
};

/**
 *
 */
export const handleShowComponent = (
  top,
  right,
  bottom,
  left,
  globalData,
  type,
  isShowComponent?
) => dispatch => {
  dispatch({
    type: ACTION_TYPES.GLOBAL_TASK_NAME,
    payload: {
      position: {
        top,
        right,
        bottom,
        left
      },
      globalData,
      type,
      isShowComponent
    }
  });
};

/**
 * call api getTaskGlobalTool
 *
 * @param key
 */
export const handleGetTaskWorkGlobalTools = (
  statusTaskIds,
  statusMilestoneId,
  finishDateFrom,
  finishDateTo
) => async dispatch => {
  await dispatch({
    type:
      statusMilestoneId === STATUS_MILESTONE.TODO
        ? ACTION_TYPES.GLOBAL_GET_TODO_TASK
        : ACTION_TYPES.GLOBAL_GET_FINISH_TASK,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/get-task-global-tools'}`,
      { statusTaskIds, statusMilestoneId, finishDateFrom, finishDateTo },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
    // payload: DUMMY_FIELD_INFO_GLOBAL_TASK(statusMilestoneId)
  });
};

/**
 * find a task in milestoneData and change it's status
 * @param data
 * @param newStatus
 * @param taskId
 */
const updateStatusTaskInMilestone = (data, newStatus, taskId) => {
  for (let i = 0; i < data.length; i++) {
    if (_.has(data[i], 'milestoneData.tasks[0]')) {
      for (let j = 0; j < data[i].milestoneData.tasks.length; j++) {
        if (data[i].milestoneData.tasks[j].taskId === taskId) {
          data[i].milestoneData.tasks[j].statusTaskId = newStatus;
        }
      }
    }
    if (_.has(data[i], 'taskData.subtasks[0]')) {
      for (let j = 0; j < data[i].taskData.subtasks.length; j++) {
        if (data[i].taskData.subtasks[j].taskId === taskId) {
          data[i].taskData.subtasks[j].statusTaskId = newStatus;
        }
      }
    }
  }
};

/**
 * call api updateTaskStatus
 * @param taskId
 * @param statusTaskId
 * @param updateFlg
 */
export const handleUpdateStatusTask = (taskData, updateFlg) => async (dispatch, getState) => {
  const { taskId, statusTaskId, originStatus } = taskData;
  await dispatch({
    type: ACTION_TYPES.GLOBAL_UPDATE_STATUS_TASK,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/update-task-status'}`,
      { taskId, statusTaskId, updateFlg },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
  const {
    globalTaskWorking,
    globalTaskFinished,
    countGlobalTaskWorking,
    countGlobalTaskFinished,
    action
  } = getState().global;
  if (action === GlobalAction.Success) {
    let task;
    if (originStatus === STATUS_MILESTONE.FINISH) {
      task = globalTaskFinished.find(i => i.taskData && i.taskData.taskId === taskId);
    } else {
      task = globalTaskWorking.find(i => i.taskData && i.taskData.taskId === taskId);
    }
    let errorMessage = '';
    switch (updateFlg) {
      case TASK_UPDATE_FLG.MOVE_TO_TODO: {
        task.taskData.statusTaskId = STATUS_TASK.NOT_STARTED;
        task.taskData.isFinished = false;
        errorMessage = 'INF_TOD_0002';
        updateStatusTaskInMilestone(globalTaskWorking, STATUS_TASK.NOT_STARTED, taskId);
        updateStatusTaskInMilestone(globalTaskFinished, STATUS_TASK.NOT_STARTED, taskId);
        break;
      }
      case TASK_UPDATE_FLG.MOVE_TO_DONE: {
        task.taskData.statusTaskId = STATUS_TASK.COMPLETED;
        task.taskData.isFinished = true;
        errorMessage = 'INF_TOD_0001';
        updateStatusTaskInMilestone(globalTaskWorking, STATUS_TASK.COMPLETED, taskId);
        updateStatusTaskInMilestone(globalTaskFinished, STATUS_TASK.COMPLETED, taskId);
        break;
      }
      case TASK_UPDATE_FLG.MOVE_TASK_SUBTASK_TO_DONE: {
        const list = [task.taskData, ...task.taskData.subtasks];
        errorMessage = 'INF_TOD_0001';
        for (let i = 0; i < list.length; i++) {
          const taskItem = list[i];
          const found =
            globalTaskWorking.find(j => j.taskData && j.taskData.taskId === taskItem.taskId) ||
            globalTaskFinished.find(j => j.taskData && j.taskData.taskId === taskItem.taskId);
          if (found) {
            found.taskData.statusTaskId = STATUS_TASK.COMPLETED;
            found.taskData.isFinished = true;
          }
          updateStatusTaskInMilestone(globalTaskWorking, STATUS_TASK.COMPLETED, taskItem.taskId);
          updateStatusTaskInMilestone(globalTaskFinished, STATUS_TASK.COMPLETED, taskItem.taskId);
        }
        break;
      }
      case TASK_UPDATE_FLG.CHANGE_SUBTASK_TO_TASK_MOVE_TASK_TO_DONE: {
        const list = [task.taskData];
        errorMessage = 'INF_TOD_0001';
        for (let i = 0; i < list.length; i++) {
          const taskItem = list[i];
          const found =
            globalTaskWorking.find(j => j.taskData && j.taskData.taskId === taskItem.taskId) ||
            globalTaskFinished.find(j => j.taskData && j.taskData.taskId === taskItem.taskId);
          if (found) {
            found.taskData.statusTaskId = STATUS_TASK.COMPLETED;
            found.taskData.isFinished = true;
          }
          updateStatusTaskInMilestone(globalTaskWorking, STATUS_TASK.COMPLETED, taskItem.taskId);
          updateStatusTaskInMilestone(globalTaskFinished, STATUS_TASK.COMPLETED, taskItem.taskId);
        }
        task.taskData.subtasks = task.taskData.subtasks.filter(
          i => i.statusTaskId === STATUS_TASK.COMPLETED
        );
        task.taskData.countSubtask =
          task.taskData.subtasks && task.taskData.subtasks.length
            ? task.taskData.subtasks.length
            : 0;
        break;
      }
      default: {
        const list = [
          task.taskData,
          ...task.taskData.subtasks.filter(i => i.statusTaskId <= STATUS_TASK.WORKING)
        ];
        // errorMessage = 'INF_TOD_0002';
        for (let i = 0; i < list.length; i++) {
          const taskItem = list[i];
          const found =
            globalTaskWorking.find(j => j.taskData && j.taskData.taskId === taskItem.taskId) ||
            globalTaskFinished.find(j => j.taskData && j.taskData.taskId === taskItem.taskId);
          if (found) {
            found.taskData.statusTaskId = STATUS_TASK.COMPLETED;
            found.taskData.isFinished = true;
          }
          updateStatusTaskInMilestone(globalTaskWorking, STATUS_TASK.COMPLETED, taskItem.taskId);
          updateStatusTaskInMilestone(globalTaskFinished, STATUS_TASK.COMPLETED, taskItem.taskId);
        }
        task.taskData.subtasks = task.taskData.subtasks.filter(
          i => i.statusTaskId === STATUS_TASK.COMPLETED
        );
        task.taskData.countSubtask =
          task.taskData.subtasks && task.taskData.subtasks.length
            ? task.taskData.subtasks.length
            : 0;
      }
    }
    dispatch({
      type: ACTION_TYPES.GLOBAL_SET_DATA,
      payload: {
        errorMessage,
        globalTaskWorking,
        globalTaskFinished,
        countGlobalTaskWorking,
        countGlobalTaskFinished
      }
    });
  }
};

/**
 * Update status milestone
 *
 * @param statusMilestoneId
 * @param milestoneId
 * @param updateFlg
 */
export const handleUpdateStatusMilestone = (milestoneData, updateFlg) => async (
  dispatch,
  getState
) => {
  const { statusMilestoneId, milestoneId, originStatus } = milestoneData;
  await dispatch({
    type: ACTION_TYPES.GLOBAL_UPDATE_STATUS_MILESTONE,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/update-milestone-status'}`,
      { statusMilestoneId, milestoneId, updateFlg },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
  const {
    globalTaskWorking,
    globalTaskFinished,
    countGlobalTaskWorking,
    countGlobalTaskFinished,
    action
  } = getState().global;
  if (action === GlobalAction.Success) {
    let milestone;
    if (originStatus === STATUS_MILESTONE.FINISH) {
      milestone = globalTaskFinished.find(
        i => i.milestoneData && i.milestoneData.milestoneId === milestoneId
      );
    } else {
      milestone = globalTaskWorking.find(
        i => i.milestoneData && i.milestoneData.milestoneId === milestoneId
      );
    }
    let errorMessage = '';
    if (updateFlg === MILESTONE_UPDATE_FLG.TODO) {
      if (milestone) {
        milestone.milestoneData.statusMilestoneId = STATUS_MILESTONE.TODO;
        milestone.milestoneData.isFinished = false;
        errorMessage = 'INF_TOD_0002';
      }
    } else {
      if (milestone) {
        milestone.milestoneData.statusMilestoneId = STATUS_MILESTONE.FINISH;
        milestone.milestoneData.isFinished = true;
        errorMessage = 'INF_TOD_0001';
        if (_.has(milestone.milestoneData, 'tasks[0]')) {
          for (let i = 0; i < milestone.milestoneData.tasks.length; i++) {
            const task = milestone.milestoneData.tasks[i];
            task.statusTaskId = STATUS_TASK.COMPLETED;
            const found = globalTaskWorking.find(
              item => item.taskData && item.taskData.taskId === task.taskId
            );
            if (found) {
              found.taskData.statusTaskId = STATUS_TASK.COMPLETED;
              found.taskData.isFinished = true;
            }
          }
        }
      }
    }
    dispatch({
      type: ACTION_TYPES.GLOBAL_SET_DATA,
      payload: {
        errorMessage,
        globalTaskWorking,
        globalTaskFinished,
        countGlobalTaskWorking,
        countGlobalTaskFinished
      }
    });
  }
};

/**
 * Delete task
 *
 * @param taskIdList
 * @param processFlg
 */
export const handleDeleteTaskGlobal = (taskIdList, processFlg) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GLOBAL_DELETE_TASK,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/delete-tasks'}`,
      { taskIdList, processFlg },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/**
 * call api deleteMilestone
 * @param milestoneId
 */
export const handleDeleteMilestone = milestoneData => async (dispatch, getState) => {
  const { milestoneId, originStatus } = milestoneData;
  await dispatch({
    type: ACTION_TYPES.GLOBAL_DELETE_MILESTONE,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/delete-milestone'}`,
      { milestoneId },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
  const { globalTaskWorking, globalTaskFinished, action } = getState().global;
  let { countGlobalTaskWorking, countGlobalTaskFinished } = getState().global;
  if (action === GlobalAction.Success) {
    let milestone;
    if (originStatus === STATUS_MILESTONE.FINISH) {
      milestone = globalTaskFinished.find(
        i => i.milestoneData && i.milestoneData.milestoneId === milestoneId
      );
    } else {
      milestone = globalTaskWorking.find(
        i => i.milestoneData && i.milestoneData.milestoneId === milestoneId
      );
    }
    const errorMessage = 'INF_COM_0005';
    if (milestone) {
      milestone.milestoneData = null;
      for (let i = 0; i < globalTaskWorking.length; i++) {
        if (
          globalTaskWorking[i].taskData &&
          globalTaskWorking[i].taskData.milestoneId === milestoneId
        ) {
          globalTaskWorking[i].taskData.milestoneId = 0;
          globalTaskWorking[i].taskData.milestoneName = null;
        }
      }
      for (let i = 0; i < globalTaskFinished.length; i++) {
        if (
          globalTaskFinished[i].taskData &&
          globalTaskFinished[i].taskData.milestoneId === milestoneId
        ) {
          globalTaskFinished[i].taskData.milestoneId = 0;
          globalTaskFinished[i].taskData.milestoneName = null;
        }
      }
      if (originStatus === STATUS_MILESTONE.FINISH) {
        countGlobalTaskFinished -= 1;
      } else {
        countGlobalTaskWorking -= 1;
      }
    }
    dispatch({
      type: ACTION_TYPES.GLOBAL_SET_DATA,
      payload: {
        errorMessage,
        globalTaskWorking,
        globalTaskFinished,
        countGlobalTaskWorking,
        countGlobalTaskFinished
      }
    });
  }
};

/**
 * event open/collapse todo task area
 * @param open
 */
export const handleCollapseTodoArea = open => ({
  type: ACTION_TYPES.GLOBAL_COLLAPSE_TODO_TASK,
  payload: open
});

/**
 * event open/collapse finish task area
 * @param open
 */
export const handleCollapseFinishArea = open => ({
  type: ACTION_TYPES.GLOBAL_COLLAPSE_FINISH_TASK,
  payload: open
});
