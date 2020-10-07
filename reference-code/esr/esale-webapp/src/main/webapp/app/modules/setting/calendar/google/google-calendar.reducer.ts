import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import axios from 'axios';
import { isError } from 'lodash';
export enum GoogleCalendarAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  GOOGLE_CALENDAR_RESET: 'googleCalendar/RESET',
  GET_GOOGLE_CALENDAR: 'googleCalendar/GET_GOOGLE_CALENDAR',
  UPDATE_SCHEDULE_GOOGLE_CALENDAR: 'googleCalendar/UPDATE_SCHEDULE_GOOGLE_CALENDAR'
};
const initialState = {
  action: GoogleCalendarAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: [],
  scheduleGoogleCalendar: {},
  updatedSuccsess: null,
  isError: false
};

const parseGoodleEditResponse = res => {
  let errorMsg = [];
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].extensions.errors;
  }
  const resID = res.scheduleGoogleCalendarId;
  const action = errorMsg.length > 0 ? GoogleCalendarAction.Error : GoogleCalendarAction.Success;
  return { errorMsg, action, resID };
};

export type GoogleCalendarState = Readonly<typeof initialState>;

const parseEquipmentTypeFaiResponse = res => {
  let errorMsg = [];
  if (res.parameters) {
    errorMsg = res.parameters.extensions.errors;
  }
  return { errorMsg };
};

// API base URL
const scheduleApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

// Reducer
export default (state: GoogleCalendarState = initialState, action): GoogleCalendarState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_GOOGLE_CALENDAR):
    case REQUEST(ACTION_TYPES.UPDATE_SCHEDULE_GOOGLE_CALENDAR): {
      return {
        ...state,
        action: GoogleCalendarAction.Request,
        errorItems: []
      };
    }

    case FAILURE(ACTION_TYPES.GET_GOOGLE_CALENDAR):
    case FAILURE(ACTION_TYPES.UPDATE_SCHEDULE_GOOGLE_CALENDAR): {
      const resFai = parseEquipmentTypeFaiResponse(action.payload.response.data);
      return {
        ...state,
        action: GoogleCalendarAction.Error,
        errorItems: resFai.errorMsg,
        isError: true
      };
    }

    case ACTION_TYPES.GOOGLE_CALENDAR_RESET: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.GET_GOOGLE_CALENDAR): {
      const res = action.payload.data;
      return {
        ...state,
        scheduleGoogleCalendar: res
      };
    }

    case SUCCESS(ACTION_TYPES.UPDATE_SCHEDULE_GOOGLE_CALENDAR): {
      let randomId = null;
      if (action.payload.data.scheduleGoogleCalendarId) {
        randomId = Math.floor(Math.random() * Math.floor(100000));
      }
      return {
        ...state,
        updatedSuccsess: randomId
      };
    }
    default:
      return state;
  }
};

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.GOOGLE_CALENDAR_RESET
});

/**
 * Get schedules type
 */
export const getScheduleGoogleCalendar = () => ({
  type: ACTION_TYPES.GET_GOOGLE_CALENDAR,
  payload: axios.post(`${scheduleApiUrl}/get-schedule-google-calendar`, null, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

// const formatJsonData = param => {
//    let data =${JSON.stringify(

//    return data
// }

/**
 * update schedules type
 */
export const updateScheduleGoogleCalendar = params => ({
  type: ACTION_TYPES.UPDATE_SCHEDULE_GOOGLE_CALENDAR,
  payload: axios.post(
    `${scheduleApiUrl}/update-schedule-google-calendar`,
    { updateScheduleGoogleCalendar: params },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const hanldleupdate = params => async dispatch => {
  await dispatch(updateScheduleGoogleCalendar(params));
};
export const hanldleGetData = () => async dispatch => {
  await dispatch(getScheduleGoogleCalendar());
};
