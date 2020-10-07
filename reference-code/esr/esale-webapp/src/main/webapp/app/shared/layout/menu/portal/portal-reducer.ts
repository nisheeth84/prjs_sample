import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, API_CONFIG } from 'app/config/constants';
import axios from 'axios';

export enum BeginerProtalAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  STATUS_CONTRACT: 'statusContract/GET',
  DISPLAY_FIRSTSCREEN: 'displayFirstScreen/UPDATE',
  GET_EMPLOYEES: 'employees/GET'
};
const initialState = {
  action: BeginerProtalAction.None,
  errorMessage: null,
  errorItems: null,
  trialEndDate: null,
  updateSuccess: null
};
export type BeginerPortalState = Readonly<typeof initialState>;

const apiTenantsUrl = API_CONTEXT_PATH + '/' + API_CONFIG.TENANTS_SERVICE_PATH;
const apiUpdateDisPlay = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

// Reducer
export default (state: BeginerPortalState = initialState, action): BeginerPortalState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.STATUS_CONTRACT):
    case REQUEST(ACTION_TYPES.DISPLAY_FIRSTSCREEN): {
      return {
        ...state,
        action: BeginerProtalAction.Request,
        errorItems: null
      };
    }

    case FAILURE(ACTION_TYPES.DISPLAY_FIRSTSCREEN):
    case FAILURE(ACTION_TYPES.STATUS_CONTRACT): {
      return {
        ...state,
        action: BeginerProtalAction.Error,
        errorMessage: action.payload.message
      };
    }

    case ACTION_TYPES.DISPLAY_FIRSTSCREEN:
    case ACTION_TYPES.STATUS_CONTRACT: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.DISPLAY_FIRSTSCREEN): {
      return {
        ...state,
        updateSuccess: true
      };
    }

    case SUCCESS(ACTION_TYPES.STATUS_CONTRACT): {
      const res = action.payload.data;
      return {
        ...state,
        trialEndDate: res.trialEndDate
      };
    }
    default:
      return state;
  }
};

/**
 * change when confirm drity check
 */
export const reloadDrityCheck = () => ({
  type: ACTION_TYPES.STATUS_CONTRACT
});

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.STATUS_CONTRACT
});

export const getStatusContract = param => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.STATUS_CONTRACT,
    payload: axios.post(
      `${apiTenantsUrl}/get-status-contract`,
      { tenantName: param },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

export const updateDisplayScreen = param => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.DISPLAY_FIRSTSCREEN,
    payload: axios.post(`${apiUpdateDisPlay}/update-display-first-screen`, param, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};
