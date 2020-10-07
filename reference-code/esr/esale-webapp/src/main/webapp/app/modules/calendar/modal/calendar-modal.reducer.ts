import axios from 'axios';
import { isArray } from 'util';

import { REQUEST, FAILURE, SUCCESS } from 'app/shared/reducers/action-type.util';
import { MODAL_CALENDAR, ItemTypeSchedule } from '../constants';
import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { PARAM_GET_SCHEDULE_HISTORY } from 'app/modules/calendar/models/get-schedule-history-type';
import { PARAM_DELETE_SCHEDULE } from 'app/modules/calendar/models/delete-schedule-type';
import { PARAM_UPDATE_SCHEDULE_STATUS } from 'app/modules/calendar/models/update-schedule-status';
import { handleDelete } from '../grid/calendar-grid.reducer';
import { translate } from 'react-jhipster/lib/src/language/translate';

export const ACTION_TYPE = {
  /**
   * calendar modal reducer start
   */
  SHOW_DETAIL: 'SHOW_DETAIL',
  HIDE_DETAIL: 'HIDE_DETAIL',
  SHOW_DELETE: 'SHOW_DELETE',
  HIDE_DELETE: 'HIDE_DELETE',
  SET_ITEM_DELETE_MILESTONE_TASK: 'SET_ITEM_DELETE_MILESTONE_TASK',
  RESET_DATA_DELETE_MILESTONE_TASK: 'RESET_DATA_DELETE_MILESTONE_TASK',
  SET_ITEM_ID_SHOW_MODAL: 'SET_ITEM_ID_SHOW_MODAL',
  RESET_DATA_SHOW_MODAL: 'RESET_DATA_SHOW_MODAL',
  SET_DATA_SHOW_EDIT_OR_COPY_MODAL: 'SET_DATA_SHOW_EDIT_OR_COPY_MODAL',
  RESET_DATA_SHOW_EDIT_OR_COPY_MODAL: 'RESET_DATA_SHOW_EDIT_OR_COPY_MODAL',
  SET_CURRENT_SCREEN: 'SET_CURRENT_SCREEN',
  CHANGE_PREV_NEXT_ID: 'changePrevNextScheduleId',
  DELETE_SCHEDULE: 'deleteSchedule',
  GET_SCHEDULE_HISTORY: 'getScheduleHistory',
  /**
   * calendar modal reducer end
   */
  GET_SCHEDULE_BY_ID: 'GET_SCHEDULE/ID',
  GET_TASK_BY_ID: 'GET_TASK/ID',
  GET_MILESTONE_BY_ID: 'GET_MILESTONE/ID',
  /**
   * status license service start
   */
  ACTIVATE: true,
  DEACTIVATE: false,
  /**
   * status license service end
   */
  SHOW_SUB_DETAIL: 'SHOW_SUB_DETAIL',
  HIDE_SUB_DETAIL: 'HIDE_SUB_DETAIL',
  UPDATE_SCHEDULE_STATUS: 'UPDATE_SCHEDULE_STATUS',
  SHOW_MODAL_CONFIRM_DELETE: 'showModalConfirmDelete',
  HIDE_MODAL_CONFIRM_DELETE: 'hideModalConfirmDelete',
  SET_FLAG_DELETE: 'calendar/setFlagDelete',
  SET_SCHEDULE_DATA_NEW_WINDOW: 'calendar/setSchedulePopupNewWindow',
  RESET_STATE_VALIDATE: 'calendar/schedule/RESET_STATE_VALIDATE'
};

const DummyData = false;
const DummyScheduleHistoryId = 1;
const DummyCurrentPage = 1;

export enum ScheduleModalAction {
  None,
  Request,
  Error,
  Success
}

export const enum FLAG_DELETE {
  CURRENT = 0,
  REPEAT = 1,
  ALL = 2
}

const initialState = {
  action: ScheduleModalAction.None,
  suscessMessage: null,
  errorMessage: null,
  showDetails: null,
  dataSchedule: {},
  itemTypeDelete: null,
  itemDelete: null,
  itemShowId: null,
  itemCopyOrEditId: null,
  typeItemCopyOrEdit: null,
  actionType: null,
  dataTask: {
    dataInfo: {
      task: {
        taskId: null,
        taskData: null,
        taskName: null,
        memo: null,
        operators: null,
        totalEmployees: null,
        isTaskOperator: null,
        countEmployee: null,
        startDate: null,
        milestoneStatus: null,
        finishDate: null,
        parentTaskId: null,
        statusParentTaskId: null,
        customers: null,
        productTradings: null,
        milestoneId: null,
        milestoneName: null,
        milestoneFinishDate: null,
        milestoneParentCustomerName: null,
        milestoneCustomerName: null,
        files: null,
        statusTaskId: null,
        isPublic: null,
        isDone: null,
        subtasks: null,
        registDate: null,
        refixDate: null,
        registPersonNameName: null,
        refixPersonNameName: null
      }
    }
  },
  dataMilestone: null,
  service: {
    activities: ACTION_TYPE.ACTIVATE,
    timelines: ACTION_TYPE.ACTIVATE,
    customerSales: ACTION_TYPE.ACTIVATE,
    businessCards: ACTION_TYPE.ACTIVATE,
    customer: ACTION_TYPE.ACTIVATE
  },
  modalDetailCalendar: MODAL_CALENDAR.HIDE,
  modalDeleteCalendar: MODAL_CALENDAR.HIDE,
  modalSubDetailCalendar: MODAL_CALENDAR.HIDE,
  scheduleId: null,
  itemId: null,
  mousePosition: null,
  itemType: null,
  modalConfirmDelete: MODAL_CALENDAR.HIDE,
  flagDelete: FLAG_DELETE.ALL,
  newWindowPopup: false
};

/**
 * handle response schedule data
 * @param res
 */
const handleResponse = res => {
  const dataRequest = (res && res.data) || {};
  return { dataRequest };
};

/**
 * handle response milestone data
 * @param res
 */
const handleMilestoneResponse = res => {
  const dataRequest = (res && res.data) || {};
  return { dataRequest };
};

/**
 * handle response task data
 * @param res
 */
const handleTaskResponse = res => {
  const dataRequest = (res && res.data) || {};
  return { dataRequest };
};

/**
 * handle response schedule history
 * @param res
 */
const handleResponseGetSchedule = res => {
  let dataRequest = res.data || {};
  if (isArray(dataRequest)) {
    dataRequest.forEach((item, idx) => {
      if (item.contentChange) {
        dataRequest = [
          ...dataRequest.slice(0, idx),
          {
            ...dataRequest[idx],
            contentChange: JSON.parse(item.contentChange)
          },
          ...dataRequest.slice(idx + 1)
        ];
      }
    });
  }

  return { dataRequest };
};
export type ScheduleModalState = Readonly<typeof initialState>;

const calendarApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

export default (state: ScheduleModalState = initialState, action): ScheduleModalState => {
  let res;
  switch (action.type) {
    // get Schedule start
    case REQUEST(ACTION_TYPE.GET_SCHEDULE_BY_ID):
    case REQUEST(ACTION_TYPE.GET_TASK_BY_ID):
    case REQUEST(ACTION_TYPE.GET_MILESTONE_BY_ID):
    case REQUEST(ACTION_TYPE.UPDATE_SCHEDULE_STATUS):
    case REQUEST(ACTION_TYPE.GET_SCHEDULE_HISTORY):
    case REQUEST(ACTION_TYPE.DELETE_SCHEDULE):
      return {
        ...state,
        action: ScheduleModalAction.Request
      };
    case FAILURE(ACTION_TYPE.GET_SCHEDULE_HISTORY):
    case FAILURE(ACTION_TYPE.DELETE_SCHEDULE):
    case FAILURE(ACTION_TYPE.GET_TASK_BY_ID):
    case FAILURE(ACTION_TYPE.GET_MILESTONE_BY_ID):
    case FAILURE(ACTION_TYPE.UPDATE_SCHEDULE_STATUS):
      return {
        ...state,
        action: ScheduleModalAction.Error,
        errorMessage: action.payload.message,
        suscessMessage: null
      };
    case FAILURE(ACTION_TYPE.GET_SCHEDULE_BY_ID):
      return {
        ...state,
        action: ScheduleModalAction.Error,
        modalDetailCalendar: MODAL_CALENDAR.HIDE,
        errorMessage: action.payload.message,
        suscessMessage: null
      };
    case SUCCESS(ACTION_TYPE.GET_SCHEDULE_BY_ID):
      res = handleResponse(action.payload);
      return {
        ...state,
        action: ScheduleModalAction.Success,
        dataSchedule: res.dataRequest,
        errorMessage: null,
        scheduleId: res.dataRequest.scheduleId
      };
    case SUCCESS(ACTION_TYPE.GET_MILESTONE_BY_ID):
      res = handleMilestoneResponse(action.payload);
      return {
        ...state,
        dataMilestone: res.dataRequest,
        errorMessage: null
      };
    case SUCCESS(ACTION_TYPE.GET_TASK_BY_ID):
      res = handleTaskResponse(action.payload);
      return {
        ...state,
        dataTask: res.dataRequest,
        errorMessage: null
      };
    // get schedule end
    // delete schedule start
    case SUCCESS(ACTION_TYPE.DELETE_SCHEDULE):
      return {
        ...state,
        action: ScheduleModalAction.Success,
        modalDetailCalendar: MODAL_CALENDAR.HIDE,
        modalDeleteCalendar: MODAL_CALENDAR.HIDE,
        modalConfirmDelete: MODAL_CALENDAR.HIDE,
        modalSubDetailCalendar: MODAL_CALENDAR.HIDE,
        errorMessage: null,
        suscessMessage: translate('messages.INF_COM_0005')
      };
    // delete schedule end
    // Get schedule History start
    case SUCCESS(ACTION_TYPE.GET_SCHEDULE_HISTORY):
      res = handleResponseGetSchedule(action.payload);
      return {
        ...state,
        action: ScheduleModalAction.Success,
        dataSchedule: {
          ...state.dataSchedule,
          scheduleHistories: res.dataRequest
        },
        errorMessage: null
      };
    // Get schedule History end
    case SUCCESS(ACTION_TYPE.UPDATE_SCHEDULE_STATUS):
      return {
        ...state,
        action: ScheduleModalAction.Success,
        errorMessage: null
      };
    case ACTION_TYPE.SHOW_DETAIL:
      return {
        ...state,
        modalDetailCalendar: MODAL_CALENDAR.SHOW,
        modalSubDetailCalendar: MODAL_CALENDAR.HIDE,
        modalConfirmDelete: MODAL_CALENDAR.HIDE,
        scheduleId: action.payload,
        suscessMessage: null
      };
    case ACTION_TYPE.SET_ITEM_DELETE_MILESTONE_TASK:
      return {
        ...state,
        itemDelete: action.itemDelete,
        itemTypeDelete: action.itemTypeDelete
      };
    case ACTION_TYPE.RESET_DATA_DELETE_MILESTONE_TASK:
      return {
        ...state,
        itemDelete: null,
        itemTypeDelete: null
      };
    case ACTION_TYPE.SHOW_SUB_DETAIL: {
      return {
        ...state,
        itemId: action.param,
        scheduleId: action.param,
        mousePosition: action.position,
        itemType: action.itemType,
        modalSubDetailCalendar: MODAL_CALENDAR.SHOW,
        modalDetailCalendar: MODAL_CALENDAR.HIDE,
        suscessMessage: null
      };
    }
    case ACTION_TYPE.HIDE_SUB_DETAIL:
      return {
        ...state,
        modalSubDetailCalendar: MODAL_CALENDAR.HIDE
      };
    case ACTION_TYPE.SET_ITEM_ID_SHOW_MODAL:
      return {
        ...state,
        showDetails: action.itemShowType,
        itemShowId: action.itemId
      };
    case ACTION_TYPE.SET_DATA_SHOW_EDIT_OR_COPY_MODAL:
      return {
        ...state,
        typeItemCopyOrEdit: action.itemType,
        actionType: action.actionType,
        itemCopyOrEditId: action.itemId
      };
    case ACTION_TYPE.RESET_DATA_SHOW_MODAL:
      return {
        ...state,
        showDetails: null,
        itemShowId: null
      };
    case ACTION_TYPE.RESET_DATA_SHOW_EDIT_OR_COPY_MODAL:
      return {
        ...state,
        typeItemCopyOrEdit: null,
        actionType: null,
        itemCopyOrEditId: null
      };
    case ACTION_TYPE.HIDE_DETAIL:
      return {
        ...state,
        modalDetailCalendar: MODAL_CALENDAR.HIDE,
        dataSchedule: {},
        scheduleId: {}
      };
    case ACTION_TYPE.SHOW_DELETE:
      return {
        ...state,
        modalDeleteCalendar: MODAL_CALENDAR.SHOW,
        modalDetailCalendar: MODAL_CALENDAR.HIDE,
        modalSubDetailCalendar: MODAL_CALENDAR.HIDE
      };
    case ACTION_TYPE.HIDE_DELETE:
      return {
        ...state,
        modalDeleteCalendar: MODAL_CALENDAR.HIDE
      };
    case ACTION_TYPE.SHOW_MODAL_CONFIRM_DELETE:
      return {
        ...state,
        modalConfirmDelete: MODAL_CALENDAR.SHOW
      };
    case ACTION_TYPE.HIDE_MODAL_CONFIRM_DELETE:
      return {
        ...state,
        modalConfirmDelete: MODAL_CALENDAR.HIDE
      };
    case ACTION_TYPE.SET_FLAG_DELETE:
      return {
        ...state,
        flagDelete: action.payload
      };
    case ACTION_TYPE.SET_SCHEDULE_DATA_NEW_WINDOW:
      return {
        ...state,
        dataSchedule: action.payload,
        newWindowPopup: true
      };
    case ACTION_TYPE.RESET_STATE_VALIDATE:
      return {
        ...state,
        suscessMessage: null,
        errorMessage: null
      };
    default:
      return state;
  }
};

/**
 * get schedule by id
 * @param scheduleId
 */
export const getScheduleById = (scheduleId: number) => {
  return {
    type: ACTION_TYPE.GET_SCHEDULE_BY_ID,
    payload: axios.post(
      `${calendarApiUrl}/get-schedule`,
      {
        scheduleId
      },
      { headers: { 'Content-Type': 'application/json' } }
    )
  };
};
/**
 * get data task by id
 * @param taskId
 */
export const getTaskById = (taskId: number) => {
  return {
    type: ACTION_TYPE.GET_TASK_BY_ID,
    payload: axios.post(
      `${calendarApiUrl}/get-task`,
      {
        taskId
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  };
};
/**
 * get data milestone by id
 * @param milestoneId
 */
export const getMilestoneById = (milestoneId: number) => {
  return {
    type: ACTION_TYPE.GET_MILESTONE_BY_ID,
    payload: axios.post(
      `${calendarApiUrl}/get-milestone`,
      {
        milestoneId
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  };
};

/**
 * show modal schedule details
 * DO NOT IMPORT INTO ANOTHER MODULES
 * @param scheduleId
 */
export const showModalDetail = (scheduleId: number) => ({
  type: ACTION_TYPE.SHOW_DETAIL,
  payload: scheduleId
});

/**
 * hidden modal schedule details
 */
export const hideModalDetail = () => ({ type: ACTION_TYPE.HIDE_DETAIL });

/**
 * show modal delete
 */
export const showModalDelete = () => ({ type: ACTION_TYPE.SHOW_DELETE });

/**
 * hidden tip details schedule, task, milestone
 */
export const hideModalDelete = () => ({ type: ACTION_TYPE.HIDE_DELETE });

/**
 * set data on show modal Task , Milestone Details
 * @param itemId
 * @param itemShowType
 */
export const setItemId = (itemId, itemShowType) => ({
  type: ACTION_TYPE.SET_ITEM_ID_SHOW_MODAL,
  itemId,
  itemShowType
});

/**
 * set data on show modal edit or copy Task , Milestone
 * @param itemId
 * @param itemType
 * @param actionType
 */
export const setItemIdCopyOrEdit = (itemId, itemType, actionType) => async dispatch =>
  await dispatch({
    type: ACTION_TYPE.SET_DATA_SHOW_EDIT_OR_COPY_MODAL,
    itemId,
    itemType,
    actionType
  });

/**
 * reset data on show modal Task , Milestone Details
 */
export const resetItemId = () => ({ type: ACTION_TYPE.RESET_DATA_SHOW_MODAL });

/**
 * set data delete Task , Milestone
 * @param itemDelete
 * @param itemTypeDelete
 */
export const setItemDelete = (itemDelete, itemTypeDelete) => ({
  type: ACTION_TYPE.SET_ITEM_DELETE_MILESTONE_TASK,
  itemDelete,
  itemTypeDelete
});

/**
 * reset data delete Task , Milestone
 */
export const resetItemDelete = () => ({ type: ACTION_TYPE.RESET_DATA_DELETE_MILESTONE_TASK });

/**
 * reset data on show modal copy or edit Task , Milestone
 */
export const resetItemIdCopyOrEdit = () => ({
  type: ACTION_TYPE.RESET_DATA_SHOW_EDIT_OR_COPY_MODAL
});

/**
 * hidden tip details
 */
export const hideModalSubDetail = () => ({ type: ACTION_TYPE.HIDE_SUB_DETAIL });

/**
 *delete schedule
 * @param scheduleId
 * @param flagDelete
 */
export const deleteSchedule = (scheduleId: number, flagDelete: number) => async (
  dispatch,
  getState
) => {
  await dispatch({
    type: ACTION_TYPE.DELETE_SCHEDULE,
    payload: axios.post(
      `${calendarApiUrl}/delete-schedule`,
      PARAM_DELETE_SCHEDULE(scheduleId, flagDelete),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  });
  if (getState().dataModalSchedule.action === ScheduleModalAction.Success) {
    // location.reload();
    await dispatch(handleDelete(scheduleId, ItemTypeSchedule.Schedule));
  }
};

/**
 * show tip details schedule, task, milestone
 */
export const showModalSubDetail = (scheduleId, position, itemType) => ({
  type: ACTION_TYPE.SHOW_SUB_DETAIL,
  param: scheduleId,
  position,
  itemType
});

/**
 * update schedule status
 * @param scheduleId
 * @param status
 * @param updateDate
 */
export const updateScheduleStatus = (scheduleId, status, updateDate) => async (
  dispatch,
  getState
) => {
  await dispatch({
    type: ACTION_TYPE.UPDATE_SCHEDULE_STATUS,
    payload: axios.post(
      `${calendarApiUrl}/update-schedule-status`,
      PARAM_UPDATE_SCHEDULE_STATUS(scheduleId, status, updateDate),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  });
  if (getState().dataModalSchedule.action === ScheduleModalAction.Success) {
    await dispatch(showModalDetail(scheduleId));
    await dispatch(getScheduleById(scheduleId));
  }
};

/**
 * update schedule status
 * @param scheduleId
 * @param status
 * @param updateDate
 */
export const updateScheduleStatusSubSchedule = (scheduleId, status, updateDate) => async (
  dispatch,
  getState
) => {
  await dispatch({
    type: ACTION_TYPE.UPDATE_SCHEDULE_STATUS,
    payload: axios.post(
      `${calendarApiUrl}/update-schedule-status`,
      PARAM_UPDATE_SCHEDULE_STATUS(scheduleId, status, updateDate),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  });
  if (getState().dataModalSchedule.action === ScheduleModalAction.Success) {
    await dispatch(getScheduleById(scheduleId));
  }
};

/**
 * get schedule history
 * @param scheduleId
 * @param currentPage
 * @param limit
 */
export const getScheduleHistory = (scheduleId, currentPage, limit) => {
  scheduleId = DummyData ? DummyScheduleHistoryId : scheduleId;
  currentPage = DummyData ? DummyCurrentPage : currentPage;
  return {
    type: ACTION_TYPE.GET_SCHEDULE_HISTORY,
    payload: axios.post(
      `${calendarApiUrl}`,
      PARAM_GET_SCHEDULE_HISTORY(scheduleId, currentPage, limit),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  };
};

/**
 * show modal confirm delete
 */
export const showModalConfirmDelete = () => ({ type: ACTION_TYPE.SHOW_MODAL_CONFIRM_DELETE });

/**
 * hidden modal confirm delete
 */
export const hideModalConfirmDelete = () => ({ type: ACTION_TYPE.HIDE_MODAL_CONFIRM_DELETE });

/**
 * set type delete of schedule repeat
 * @param flag
 */
export const setFlagDelete = flag => ({ type: ACTION_TYPE.SET_FLAG_DELETE, payload: flag });

/**
 * set data schedule in new window
 * @param schedule
 */
export const setSchedulePopupNewWindow = schedule => ({
  type: ACTION_TYPE.SET_SCHEDULE_DATA_NEW_WINDOW,
  payload: schedule
});

export const resetMessageTip = () => {
  return {
    type: ACTION_TYPE.RESET_STATE_VALIDATE
  };
};
