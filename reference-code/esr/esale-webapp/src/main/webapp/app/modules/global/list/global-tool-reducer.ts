import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { ACTION_TYPE, MODAL_CALENDAR } from 'app/modules/calendar/constants.ts';
import moment from 'moment';
import axios from 'axios';
import { PARAM_GET_DATA_SCHEDULE_GLOBAL_TOOL } from 'app/modules/calendar/models/get-data-for-calendar-by-list-type';
import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { PARAM_UPDATE_SCHEDULE_STATUS } from 'app/modules/calendar/models/update-schedule-status.ts';

export enum globalToolAction {
  None,
  Request,
  Error,
  Success
}

const initialState = {
  action: globalToolAction.None,
  globalTool: MODAL_CALENDAR.HIDE,
  scheduleDay: '',
  dataResponse: null,
  errorMessage: null,
  successMessage: null
};

/**
 * handle data response
 */

const handleResponseCalendarList = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? globalToolAction.Error : globalToolAction.Success;
  const { itemList, countSchedule } = res;
  return { errorMsg, action, itemList, countSchedule };
};

/**
 * next and prev day
 * @param date
 * @param numberDay
 */

const nextAndPrevDay = (date, numberDay) => {
  const currentDay = moment(date).add(numberDay, 'days');
  return currentDay;
};

export type GlobalToolState = Readonly<typeof initialState>;

export default (state: GlobalToolState = initialState, action): GlobalToolState => {
  let res;
  let currentDate;
  let day;
  switch (action.type) {
    case REQUEST(ACTION_TYPE.GET_DATA):
      return {
        ...state
      };
    case REQUEST(ACTION_TYPE.UPDATE_SCHEDULE_STATUS_GLOBAL):
      return {
        ...state,
        action: globalToolAction.Request
      };
    case FAILURE(ACTION_TYPE.GET_DATA):
      return {
        ...state,
        errorMessage: action.payload.message,
        successMessage: null
      };
    case FAILURE(ACTION_TYPE.UPDATE_SCHEDULE_STATUS_GLOBAL):
      return {
        ...state,
        action: globalToolAction.Error,
        errorMessage: action.payload.message,
        successMessage: null
      };
    case SUCCESS(ACTION_TYPE.GET_DATA):
      res = handleResponseCalendarList(action.payload.data);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        dataResponse: {
          itemList: res.itemList,
          countSchedule: res.countSchedule
        }
      };
    case SUCCESS(ACTION_TYPE.UPDATE_SCHEDULE_STATUS_GLOBAL):
      return {
        ...state,
        action: globalToolAction.Success,
        errorMessage: null
      };
    case ACTION_TYPE.SHOW_GLOBAL:
      currentDate = action.param;
      return {
        ...state,
        scheduleDay: currentDate,
        globalTool: MODAL_CALENDAR.SHOW
      };
    case ACTION_TYPE.HIDE_GLOBAL:
      return {
        ...state,
        globalTool: MODAL_CALENDAR.HIDE
      };
    case ACTION_TYPE.NEXT_AND_PREV_DAY:
      day = nextAndPrevDay(state.scheduleDay, action.param);
      return {
        ...state,
        scheduleDay: day
      };
    default:
      return state;
  }
};
const calendarApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

/**
 * get list schedule by date
 * @param date
 */
export const getScheduleByList = date => ({
  type: ACTION_TYPE.GET_DATA,
  payload: axios.post(
    `${calendarApiUrl}/get-data-for-calendar-by-list`,
    PARAM_GET_DATA_SCHEDULE_GLOBAL_TOOL(date),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  )
});

/**
 * show global tool , get list schedule by current date
 * @param currentDate
 */
export const showGlobalTool = currentDate => ({
  type: ACTION_TYPE.SHOW_GLOBAL,
  param: currentDate
});

/**
 * hidden global tool
 */
export const hiddenGlobalTool = () => ({ type: ACTION_TYPE.HIDE_GLOBAL });
/**
 * next or prev date
 * @param number
 */
export const nextAndPrevDateGlobalTool = number => ({
  type: ACTION_TYPE.NEXT_AND_PREV_DAY,
  param: number
});
/**
 * update schedule status
 * @param scheduleId
 * @param status
 * @param updateDate
 */
export const updateScheduleStatus = (scheduleId, status, updateDate, scheduleDates) => async (
  dispatch,
  getState
) => {
  await dispatch({
    type: ACTION_TYPE.UPDATE_SCHEDULE_STATUS_GLOBAL,
    payload: axios.post(
      `${calendarApiUrl}/update-schedule-status`,
      PARAM_UPDATE_SCHEDULE_STATUS(scheduleId, status, updateDate),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  });
  await dispatch(getScheduleByList(scheduleDates));
};
