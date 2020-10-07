import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import axios from 'axios';

export enum SearchGlobalAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  SEARCH_GLOBAL_RESET: 'searchGlobal/RESET',
  SEARCH_EMPLOYEE: 'searchGlobal/EMPLOYEE',
  SEARCH_PRODUCT: 'searchGlobal/PRODUCT',
  SEARCH_CALENDAR: 'searchGlobal/CALENDAR',
  SEARCH_SALES: 'searchGlobal/SALES',
  SEARCH_TASK: 'searchGlobal/TASK'
};
const initialState = {
  action: SearchGlobalAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: null,
  employeeSuggestion: null,
  productSuggestion: null,
  calendarSuggestion: null,
  salesSuggestion: null,
  taskSuggestion: null
};
export type SearchGlobalState = Readonly<typeof initialState>;

// Reducer
export default (state: SearchGlobalState = initialState, action): SearchGlobalState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_EMPLOYEE):
    case REQUEST(ACTION_TYPES.SEARCH_PRODUCT):
    case REQUEST(ACTION_TYPES.SEARCH_CALENDAR):
    case REQUEST(ACTION_TYPES.SEARCH_SALES):
    case REQUEST(ACTION_TYPES.SEARCH_TASK): {
      return {
        ...state,
        action: SearchGlobalAction.Request,
        errorItems: null
      };
    }

    case FAILURE(ACTION_TYPES.SEARCH_EMPLOYEE):
    case FAILURE(ACTION_TYPES.SEARCH_PRODUCT):
    case FAILURE(ACTION_TYPES.SEARCH_CALENDAR):
    case FAILURE(ACTION_TYPES.SEARCH_SALES):
    case FAILURE(ACTION_TYPES.SEARCH_TASK): {
      return {
        ...state,
        action: SearchGlobalAction.Error,
        errorMessage: action.payload.message
      };
    }

    case ACTION_TYPES.SEARCH_GLOBAL_RESET: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.SEARCH_EMPLOYEE): {
      return {
        ...state,
        employeeSuggestion: action.payload.data
      };
    }

    case SUCCESS(ACTION_TYPES.SEARCH_PRODUCT): {
      return {
        ...state,
        productSuggestion: action.payload.data
      };
    }

    case SUCCESS(ACTION_TYPES.SEARCH_CALENDAR): {
      return {
        ...state,
        calendarSuggestion: action.payload.data
      };
    }

    case SUCCESS(ACTION_TYPES.SEARCH_SALES): {
      return {
        ...state,
        salesSuggestion: action.payload.data
      };
    }

    case SUCCESS(ACTION_TYPES.SEARCH_TASK): {
      return {
        ...state,
        taskSuggestion: action.payload.data
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
  type: ACTION_TYPES.SEARCH_GLOBAL_RESET
});

export const getEmployeeSuggestion = keySearh => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.SEARCH_EMPLOYEE,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'employees/api/get-employee-suggestions-global'}`,
      keySearh,
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

export const getProductSuggestion = keySearh => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.SEARCH_PRODUCT,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'products/api/get-product-suggestions-global'}`,
      keySearh,
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

export const getCalendarSuggestion = keySearh => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.SEARCH_CALENDAR,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/get-schedule-suggestions-global'}`,
      keySearh,
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

export const getSalesSuggestion = keySearh => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.SEARCH_SALES,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'sales/api/get-product-trading-suggestions-global'}`,
      keySearh,
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

export const getTaskSuggestion = keySearh => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.SEARCH_TASK,
    payload: axios.post(
      `${API_CONTEXT_PATH + '/' + 'schedules/api/get-task-suggestions-global'}`,
      keySearh,
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};
