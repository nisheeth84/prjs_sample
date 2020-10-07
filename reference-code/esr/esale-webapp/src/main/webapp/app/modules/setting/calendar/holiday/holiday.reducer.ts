import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import axios from 'axios';
import {
  DataOfMonthSetting,
  initDataOfMonthSetting
} from '../holiday/model/holiday-calendar-model';

export enum HolidayAction {
  None,
  Request,
  Error,
  Success
}

export enum DayName {
  Monday = 2,
  Tuesday = 3,
  Wednesday = 4,
  Thurday = 5,
  Friday = 6,
  Saturday = 7,
  Sunday = 1
}

export const ACTION_TYPES = {
  HOLIDAY_RESET: 'holiday/RESET',
  GET_HOLIDAY: 'holiday/GET',
  UPDATE_HOLIDAY: 'holiday/UPDATE',
  ONCHANGE_START_WEEK: 'holiday/ONCHANGE_START_WEEK',
  ONCHANGE_DATE_SHOW: 'holiday/ONCHANGE_DATE_SHOW',
  INIT_DATA_OF_MONTH: 'holiday/INIT_DATA_OF_MONTH',
  GET_NATION_HOLIDAYS: 'holiday/GET_NATION_HOLIDAYS'
};
const initialState = {
  action: HolidayAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: null,
  holiday: null,
  holidayUpdatedId: null,
  isSuccess: false,
  dateShowCurrent: new Date(),
  dataOfMonthSetting: {
    startDate: new Date(),
    endDate: new Date(),
    listDataOfWeekSetting: []
  },
  startWeekSetting: DayName.Monday,
  errorCodeList: null,
  nationHoliday: []
};

export type HolidayState = {
  action?: HolidayAction;
  screenMode?: ScreenMode;
  errorMessage?: any;
  errorItems?: any;
  holiday?: any;
  holidayUpdatedId?: number;
  isSuccess?: boolean;
  dateShowCurrent: Date;
  dataOfMonthSetting: DataOfMonthSetting;
  startWeekSetting: DayName;
  errorCodeList?: any;
  nationHoliday?: any;
};

// export type HolidayState = Readonly<typeof initialState>;

const parseGeneralApiResponse = res => {
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }

  if (errorCodeList.length > 0) return { errorCodeList };
  else return res;
};

// Reducer
export default (state: HolidayState = initialState, action): HolidayState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_HOLIDAY):
    case REQUEST(ACTION_TYPES.GET_NATION_HOLIDAYS): {
      return {
        ...state,
        action: HolidayAction.Request,
        errorItems: null
      };
    }

    case FAILURE(ACTION_TYPES.GET_HOLIDAY):
    case FAILURE(ACTION_TYPES.GET_NATION_HOLIDAYS): {
      return {
        ...state,
        action: HolidayAction.Error,
        errorMessage: action.payload.message
      };
    }

    case FAILURE(ACTION_TYPES.UPDATE_HOLIDAY): {
      return {
        ...state,
        action: HolidayAction.Error,
        errorMessage: action.payload
      };
    }

    case ACTION_TYPES.HOLIDAY_RESET: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.GET_HOLIDAY): {
      return {
        ...state,
        holiday: action.payload.data,
        holidayUpdatedId: null,
        startWeekSetting: action.payload.data && action.payload.data.dayStart
      };
    }

    case SUCCESS(ACTION_TYPES.GET_NATION_HOLIDAYS): {
      return {
        ...state,
        nationHoliday: action.payload.data.nationalHolidays
      };
    }

    case SUCCESS(ACTION_TYPES.UPDATE_HOLIDAY): {
      // const res = parseGeneralApiResponse(action.payload.data);
      return {
        ...state,
        holidayUpdatedId: action.payload.data.holidayId
        // errorCodeList: res.errorCodeList
      };
    }

    case ACTION_TYPES.ONCHANGE_START_WEEK: {
      return {
        ...state,
        startWeekSetting: action.payload
      };
    }
    case ACTION_TYPES.INIT_DATA_OF_MONTH: {
      return {
        ...state,
        dataOfMonthSetting: action.payload
      };
    }
    case ACTION_TYPES.ONCHANGE_DATE_SHOW: {
      return {
        ...state,
        dateShowCurrent: action.payload
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
  type: ACTION_TYPES.HOLIDAY_RESET
});

export const initDataOfMonth = (holiday: any) => (dispatch, getState) => {
  const holidayState: HolidayState = getState().holiday;
  const dataOfMonth: DataOfMonthSetting = initDataOfMonthSetting(
    holidayState.startWeekSetting,
    holidayState.dateShowCurrent,
    holiday
  );
  dispatch({
    type: ACTION_TYPES.INIT_DATA_OF_MONTH,
    payload: dataOfMonth
  });
};

/**
 * Get schedules type
 */
export const getHoliday = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_HOLIDAY,
    payload: axios.post(`${API_CONTEXT_PATH + '/' + 'schedules/api/get-holidays'}`, null, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

export const updateHoliday = holiday => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_HOLIDAY,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/update-holidays'}`,
      { holidays: holiday },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
  if (!getState().holiday.errorCodeList || getState().holiday.errorCodeList === []) {
    await dispatch(getHoliday());
  }
};

export const onStartWeekSetting = (startWeekSetting: DayName) => ({
  type: ACTION_TYPES.ONCHANGE_START_WEEK,
  payload: startWeekSetting
});

export const onChangeDateShow = (dateShow: Date) => ({
  type: ACTION_TYPES.ONCHANGE_DATE_SHOW,
  payload: dateShow
});

export const getNationalHolidays = (monthParam: number, yearParam: number) => ({
  type: ACTION_TYPES.GET_NATION_HOLIDAYS,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SCHEDULES_SERVICE_PATH}/get-national-holidays`,
    {
      month: monthParam,
      year: yearParam
    },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});
