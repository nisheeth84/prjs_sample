import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, API_CONFIG } from 'app/config/constants';
import { SHOW_MESSAGE_SUCCESS } from '../constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';

export const ACTION_TYPES = {
  INIT_DEPARTMENT_MODEL: 'department/INIT_DEPARTMENT_MODEL',
  UPDATE_DEPARTMENT: 'department/UPDATE_DEPARTMENT',
  CREATE_DEPARTMENT: 'department/CREATE_DEPARTMENT',
  RESET_DEPARTMENT: 'department/RESET_DEPARTMENT',
  GET_DEPARTMENT_MANAGER: 'department/GET_DEPARTMENT_MANAGER'
};

export enum DepartmentRegistEditAction {
  None,
  Init,
  Create,
  Update
}

const departmentRegistEditState = {
  actionType: DepartmentRegistEditAction.None,
  isUpdateSuccess: false,
  errorMessage: null,
  errorItem: null,
  errorCode: null,
  msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.NONE },
  department: {
    departmentId: null,
    departmentName: '',
    managerId: null,
    parentId: null,
    updatedDate: null,
    manager: {
      managerId: null,
      managerName: null,
      managerSurname: null
    }
  },
  employees: [
    {
      employeeId: null,
      employeeSurname: null,
      employeeName: String
    }
  ],
  departments: [
    {
      departmentId: null,
      departmentName: null,
      managerId: null,
      parentId: null,
      updatedDate: null
    }
  ],
  managerDepartment: {}
};

/**
 * parse for init screen
 */
const parseInitDepartmentResponse = res => {
  let department = {
    departmentId: 0,
    departmentName: '',
    managerId: null,
    parentId: null,
    updatedDate: '',
    manager: {
      managerId: null,
      managerName: null,
      managerSurname: null
    }
  };
  let departments = [];
  let employees = [];
  if (res != null) {
    if (res.department != null) {
      department = res.department;
    }
    if (res.departments != null) {
      departments = res.departments;
    }
    if (res.employees != null) {
      employees = res.employees;
    }
  }
  return { department, departments, employees };
};

export type DepartmentRegistEditState = Readonly<typeof departmentRegistEditState>;

/**
 * Reducer for popup Department regist or edit
 */
export default (
  state: DepartmentRegistEditState = departmentRegistEditState,
  action
): DepartmentRegistEditState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.INIT_DEPARTMENT_MODEL):
    case ACTION_TYPES.RESET_DEPARTMENT:
      return {
        ...departmentRegistEditState
      };
    case REQUEST(ACTION_TYPES.UPDATE_DEPARTMENT):
    case REQUEST(ACTION_TYPES.CREATE_DEPARTMENT):
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.INIT_DEPARTMENT_MODEL):
    case FAILURE(ACTION_TYPES.UPDATE_DEPARTMENT):
    case FAILURE(ACTION_TYPES.CREATE_DEPARTMENT): {
      return {
        ...state,
        errorMessage: action.payload.message,
        errorItem: parseErrorRespose(action.payload)[0]?.item,
        errorCode: parseErrorRespose(action.payload)[0]?.errorCode,
        isUpdateSuccess: false
      };
    }
    case SUCCESS(ACTION_TYPES.INIT_DEPARTMENT_MODEL): {
      const res = parseInitDepartmentResponse(action.payload.data);
      return {
        ...state,
        department: res.department,
        employees: res.employees,
        departments: res.departments
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_DEPARTMENT): {
      return {
        ...state,
        isUpdateSuccess: true,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE }
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE_DEPARTMENT): {
      return {
        ...state,
        isUpdateSuccess: true,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.CREATE }
      };
    }
    case SUCCESS(ACTION_TYPES.GET_DEPARTMENT_MANAGER): {
      const employeeListResponse = action.payload.data.employees;
      return {
        ...state,
        managerDepartment:
          employeeListResponse && employeeListResponse.length > 0 ? employeeListResponse[0] : {}
      };
    }
    default:
      return state;
  }
};

/**
 * init screen
 */
export const initializeDepartmentModal = departmentId => ({
  type: ACTION_TYPES.INIT_DEPARTMENT_MODEL,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'employees/api/get-initialize-department-modal'}`,
    { departmentId },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

/**
 * create department
 */
export const createDepartment = params => ({
  type: ACTION_TYPES.CREATE_DEPARTMENT,
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'employees/api/create-department'}`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

/**
 * update department
 */
export const updateDepartment = params => ({
  type: ACTION_TYPES.UPDATE_DEPARTMENT,
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'employees/api/update-department'}`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

const employeeApiUrl = `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}`;

export const getManagerById = employeeIds => ({
  type: ACTION_TYPES.GET_DEPARTMENT_MANAGER,
  payload: axios.post(
    `${employeeApiUrl}/get-employees-by-ids`,
    {
      employeeIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * init screen
 */
export const handleInitializeDepartmentModal = departmentId => async dispatch => {
  await dispatch(initializeDepartmentModal(departmentId));
};

/**
 * create department
 */
export const handleCreateDepartment = (departmentName, managerId, parentId) => async dispatch => {
  const data = { departmentName, managerId, parentId };
  await dispatch(createDepartment(data));
};

/**
 * update department
 */
export const handleUpdateDepartment = (
  departmentId,
  departmentName,
  managerId,
  parentId,
  updatedDate
) => async dispatch => {
  const data = { departmentId, departmentName, managerId, parentId, updatedDate };
  await dispatch(updateDepartment(data));
};

/**
 * get manager department
 */
export const handleGetManagerDepartment = managerId => async dispatch => {
  await dispatch(getManagerById([managerId]));
};

/**
 * clear state
 */
export const reset = () => ({
  type: ACTION_TYPES.RESET_DEPARTMENT
});
