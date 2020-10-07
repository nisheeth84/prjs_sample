import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import axios from 'axios';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import _ from 'lodash';
import { changeOrder } from 'app/shared/util/dragdrop';

export enum EmployeesSettingAction {
  None,
  Request,
  Error,
  Success
}

export const ACTION_TYPES = {
  EMPLOYEES_SETTING_RESET: 'employeesSetting/RESET',
  GET_EMPLOYEES_TYPE: 'employeesSetting/GET',
  UPDATE_EMPLOYEES_TYPE: 'employeesSetting/UPDATE',
  CHECK_EMPLOYEES_TYPE: 'employeesSetting/CHECK_DELETE',
  CHANGE_ORDER_POSITION: 'employeesSetting/CHANGE_ORDER_POSITION'
};
const initialState = {
  action: EmployeesSettingAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: [],
  positions: null,
  checkDelete: null,
  positionsUpdate: null,
  loaded: false
};

/**
 * Parse errorMessage and errorItems
 * @param res
 */
const getErrors = res => {
  let errorMsg = '';
  const errorItems = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorItems.push(e);
      });
    } else {
      errorMsg = res.errors[0].message;
    }
  }
  return { errorMsg, errorItems };
};

const parseEmPloyeesSettingEditResponse = res => {
  let errorMsg = [];
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].extensions.errors;
  }
  const resID = res.updatedPositions ? res.updatedPositions : null;
  const action =
    errorMsg.length > 0 ? EmployeesSettingAction.Error : EmployeesSettingAction.Success;
  return { errorMsg, action, resID };
};

export type EmployeesSettingState = Readonly<typeof initialState>;

// API base URL
const employeesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

// Reducer
export default (state: EmployeesSettingState = initialState, action): EmployeesSettingState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_EMPLOYEES_TYPE):
    case REQUEST(ACTION_TYPES.CHECK_EMPLOYEES_TYPE):
    case REQUEST(ACTION_TYPES.UPDATE_EMPLOYEES_TYPE): {
      return {
        ...state,
        action: EmployeesSettingAction.Request,
        errorItems: []
      };
    }

    case FAILURE(ACTION_TYPES.GET_EMPLOYEES_TYPE):
    case FAILURE(ACTION_TYPES.UPDATE_EMPLOYEES_TYPE): {
      const resError = getErrors(action.payload.response.data.parameters.extensions);
      return {
        ...state,
        action: EmployeesSettingAction.Error,
        errorMessage: resError.errorMsg,
        errorItems: resError.errorItems,
        loaded: true
      };
    }

    case FAILURE(ACTION_TYPES.CHECK_EMPLOYEES_TYPE):
      return {
        ...state,
        action: EmployeesSettingAction.Error,
        errorItems: parseErrorRespose(action.payload),
        errorMessage: parseErrorRespose(action.payload)[0]
      };

    case ACTION_TYPES.EMPLOYEES_SETTING_RESET: {
      return {
        ...initialState
      };
    }

    case SUCCESS(ACTION_TYPES.GET_EMPLOYEES_TYPE): {
      const res = action.payload.data;
      return {
        ...state,
        positions: res.positions,
        loaded: true
      };
    }

    case SUCCESS(ACTION_TYPES.CHECK_EMPLOYEES_TYPE): {
      const res = action.payload.data;
      return {
        ...state,
        checkDelete: res.positionIds,
        loaded: true
      };
    }

    case SUCCESS(ACTION_TYPES.UPDATE_EMPLOYEES_TYPE): {
      const res = parseEmPloyeesSettingEditResponse(action.payload.data);
      return {
        ...state,
        action: EmployeesSettingAction.Success,
        positionsUpdate: res.resID,
        errorItems: res.errorMsg
      };
    }

    case ACTION_TYPES.CHANGE_ORDER_POSITION: {
      return {
        ...state,
        positions: action.payload
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
  type: ACTION_TYPES.EMPLOYEES_SETTING_RESET
});

/**
 * Get Positions type
 */
export const getPositions = () => ({
  type: ACTION_TYPES.GET_EMPLOYEES_TYPE,
  payload: axios.post(`${employeesApiUrl}/get-positions`, null, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

/**
 * update Positions type
 */
export const updatePositions = param => ({
  type: ACTION_TYPES.UPDATE_EMPLOYEES_TYPE,
  payload: axios.post(
    `${employeesApiUrl}/update-positions`,
    {
      positions: param.listItem,
      deletedPositions: param.deletedPositions
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * check Positions type
 */
export const checkPositions = param => ({
  type: ACTION_TYPES.CHECK_EMPLOYEES_TYPE,
  payload: axios.post(
    `${employeesApiUrl}/check-delete-positions`,
    { positionIds: [param] },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

/**
 * update order postition
 *
 */
export const changeOrderPosition = (sourceIndex, targetIndex) => (dispatch, getState) => {
  const newServiceInfo = changeOrder(
    sourceIndex,
    targetIndex,
    getState().emPloyeesSetting.positions
  );
  // TODO: add service

  dispatch({
    type: ACTION_TYPES.CHANGE_ORDER_POSITION,
    payload: newServiceInfo
  });
};
