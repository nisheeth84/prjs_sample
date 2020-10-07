import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import axios from 'axios';
import _ from 'lodash';

export enum PeriodAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  PERIOD_RESET: 'period/RESET',
  GET_PERIOD: 'period/GET',
  UPDATE_PERIOD: 'period/UPDATE'
};
const initialState = {
  action: PeriodAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: [],
  period: null,
  periodUpdate: null,
  periodUpdateSuccess: null,
  loading: false
};
export type PeriodState = Readonly<typeof initialState>;

// API base URL
const schedulesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SCHEDULES_SERVICE_PATH;

const parseGeneralApiResponse = res => {
  const errorCodeList = [];
  if (_.get(res, 'parameters.extensions.errors.length', 0) > 0) {
    const errRes = res.parameters.extensions.errors;
    if (errRes && errRes.length > 0) {
      errRes.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }
  return { errorCodeList };
};

// Reducer
export default (state: PeriodState = initialState, action): PeriodState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_PERIOD): {
      return {
        ...state,
        periodUpdateSuccess: null,
        action: PeriodAction.Request,
        errorItems: []
      };
    }

    case REQUEST(ACTION_TYPES.UPDATE_PERIOD): {
      return {
        ...state,
        loading: true,
        periodUpdateSuccess: null,
        action: PeriodAction.Request,
        errorItems: []
      };
    }

    case FAILURE(ACTION_TYPES.GET_PERIOD):
    case FAILURE(ACTION_TYPES.UPDATE_PERIOD): {
      const resFai = parseGeneralApiResponse(action.payload.response.data);
      return {
        ...state,
        action: PeriodAction.Error,
        periodUpdateSuccess: false,
        loading: false,
        errorItems: resFai ? resFai.errorCodeList : null
      };
    }

    case ACTION_TYPES.PERIOD_RESET: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.GET_PERIOD): {
      return {
        ...state,
        period: action.payload.data
      };
    }

    case SUCCESS(ACTION_TYPES.UPDATE_PERIOD): {
      return {
        ...state,
        loading: false,
        periodUpdateSuccess: true,
        periodUpdate: action.payload.data
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
  type: ACTION_TYPES.PERIOD_RESET
});

export const getPeriod = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_PERIOD,
    payload: axios.post(`${API_CONTEXT_PATH + '/' + 'schedules/api/get-periods'}`, null, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

export const updatePeriod = period => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_PERIOD,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/update-periods'}`,
      {
        monthBegin: period.monthBegin,
        isCalendarYear: period.isCalendarYear,
        updatedDate: period.updatedDate
      },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};
