import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import _ from 'lodash';
import {
  PARAM_INITIALIZE_MANAGER_MODAL,
  SHOW_MESSAGE_SUCCESS
} from 'app/modules/employees/constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';

export const ACTION_TYPES = {
  INIT_MANAGER_MODEL: 'manager/INIT_MANAGER_MODEL',
  SET_MANAGER: 'manager/SET_MANAGER',
  RESET_MANAGER: 'manager/RESET_MANAGER'
};

export enum SetManagerAction {
  None,
  Init,
  Setting
}

/**
 * init state
 */
const managerSettingState = {
  actionType: SetManagerAction.None,
  isUpdateSuccess: false,
  errorMessage: null,
  msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.NONE },
  errorItems: [
    {
      rowId: null,
      item: null,
      errorCode: null
    }
  ],
  employees: [
    {
      employeeId: null,
      employeeName: null,
      employeeSurname: null,
      employeePhoto: {
        filePath: null,
        fileName: null
      },
      departments: [
        {
          departmentId: null,
          departmentName: null,
          managerId: null,
          managerName: null
        }
      ]
    }
  ],
  departments: [
    {
      departmentId: null,
      departmentName: null,
      managerPhoto: {
        filePath: null,
        fileName: null
      },
      departmentUpdates: [
        {
          employeeId: null,
          updatedDate: null
        }
      ],
      managerId: null,
      managerName: null
    }
  ],
  managers: [
    {
      employeeId: null,
      employeeSurname: null,
      employeeName: null
    }
  ]
};

/**
 * Parse response for init
 */
const parseInitManagerResponse = res => {
  let employees = [];
  let departments = [];
  let managers = [];
  if (!_.isNil(res)) {
    employees = res.employees;
    departments = res.departments;
    managers = res.managers;
  }
  return { employees, departments, managers };
};

export type ManagerSettingState = Readonly<typeof managerSettingState>;

/**
 * Reducer manager setting
 */
export default (state: ManagerSettingState = managerSettingState, action): ManagerSettingState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.INIT_MANAGER_MODEL):
    case ACTION_TYPES.RESET_MANAGER:
      return {
        ...managerSettingState
      };
    case REQUEST(ACTION_TYPES.SET_MANAGER):
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.INIT_MANAGER_MODEL):
    case FAILURE(ACTION_TYPES.SET_MANAGER):
      return {
        ...state,
        errorMessage: action.payload.message,
        errorItems: parseErrorRespose(action.payload),
        isUpdateSuccess: false
      };
    case SUCCESS(ACTION_TYPES.INIT_MANAGER_MODEL): {
      const res = parseInitManagerResponse(action.payload.data);
      return {
        ...state,
        employees: res.employees,
        departments: res.departments,
        managers: res.managers
      };
    }
    case SUCCESS(ACTION_TYPES.SET_MANAGER): {
      return {
        ...state,
        isUpdateSuccess: true,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE }
      };
    }
    default:
      return state;
  }
};

// API base URL
const employeesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

/**
 * Init modal
 */
export const initializeManagerModal = employeeIds => ({
  type: ACTION_TYPES.INIT_MANAGER_MODEL,
  payload: axios.post(`${employeesApiUrl}/get-initialize-manager-modal`, employeeIds, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

// PARAM_INITIALIZE_MANAGER_MODAL
// initializeManagerModal(employeeIds: ${JSON.stringify(employeeIds).replace(/"(\w+)"\s*:/g, '$1:')}) {
/**
 * Update manager
 */
export const setManager = settingParams => ({
  type: ACTION_TYPES.SET_MANAGER,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/set-managers`,
    { settingParams },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Init modal
 */
export const handleInitializeManagerModal = employeeIds => async dispatch => {
  const data = { employeeIds };
  await dispatch(initializeManagerModal(data));
};

/**
 * update manager
 */
export const handleSetManager = settingParams => async dispatch => {
  await dispatch(setManager(settingParams));
};

/**
 * clear state
 */
export const resetManager = () => ({
  type: ACTION_TYPES.RESET_MANAGER
});
