import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { SHOW_MESSAGE_SUCCESS } from '../constants';
import _ from 'lodash';

export const ACTION_TYPES = {
  SIDEBAR_EMPLOYEE_LOCAL_MENU: 'controlSidebar/LOCAL_MENU',
  SIDEBAR_DELETE_GROUP: 'controlSidebar/DELETE_GROUP',
  SIDEBAR_UPDATE_AUTO_GROUP: 'controlSidebar/UPDATE_AUTO_GROUP',
  SIDEBAR_DELETE_DEPARTMENT: 'controlSidebar/DELETE_DEPARTMENT',
  SIDEBAR_CHANGE_DEPARTMENT_ORDER: 'controlSidebar/CHANGE_DEPARTMENT_ORDER',
  SIDEBAR_RESET: 'controlSidebar/RESET',
  SIDEBAR_RESET_MSG_ERROR: 'controlSidebar/SIDEBAR_RESET_MSG_ERROR'
};
import { parseErrorRespose } from 'app/shared/util/string-utils';

export enum EmployeeSidebarAction {
  None,
  Request,
  Error,
  Success
}

const initialState = {
  action: EmployeeSidebarAction.None,
  localMenuData: null,
  deletedGroupId: null,
  updatedAutoGroupId: null,
  deletedDepartmentId: null,
  departmentOrderList: null,
  errorMessage: null,
  errorItems: null,
  msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.NONE }
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

const parseLocalMenuResponse = res => {
  const localMenu = { initializeLocalMenu: res };
  return { localMenu };
};

export type EmployeeControlSidebarState = Readonly<typeof initialState>;

export default (
  state: EmployeeControlSidebarState = initialState,
  action
): EmployeeControlSidebarState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SIDEBAR_EMPLOYEE_LOCAL_MENU):
    case REQUEST(ACTION_TYPES.SIDEBAR_DELETE_GROUP):
    case REQUEST(ACTION_TYPES.SIDEBAR_UPDATE_AUTO_GROUP):
    case REQUEST(ACTION_TYPES.SIDEBAR_DELETE_DEPARTMENT):
    case REQUEST(ACTION_TYPES.SIDEBAR_CHANGE_DEPARTMENT_ORDER):
      return {
        ...state,
        action: EmployeeSidebarAction.Request
      };
    case FAILURE(ACTION_TYPES.SIDEBAR_EMPLOYEE_LOCAL_MENU):
    case FAILURE(ACTION_TYPES.SIDEBAR_UPDATE_AUTO_GROUP):
    case FAILURE(ACTION_TYPES.SIDEBAR_DELETE_GROUP):
    case FAILURE(ACTION_TYPES.SIDEBAR_DELETE_DEPARTMENT):
    case FAILURE(ACTION_TYPES.SIDEBAR_CHANGE_DEPARTMENT_ORDER):
      return {
        ...state,
        action: EmployeeSidebarAction.Error,
        errorMessage: parseErrorRespose(action.payload)[0],
        errorItems: parseErrorRespose(action.payload)
      };
    case SUCCESS(ACTION_TYPES.SIDEBAR_EMPLOYEE_LOCAL_MENU): {
      const res = parseLocalMenuResponse(action.payload.data);
      return {
        ...state,
        localMenuData: res.localMenu
      };
    }
    case SUCCESS(ACTION_TYPES.SIDEBAR_DELETE_GROUP): {
      const res = action.payload.data;
      return {
        ...state,
        deletedGroupId: res.groupId ? res.groupId : null,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.DELETE }
      };
    }
    case SUCCESS(ACTION_TYPES.SIDEBAR_UPDATE_AUTO_GROUP): {
      return {
        ...state,
        updatedAutoGroupId: action.payload.data,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE }
      };
    }
    case SUCCESS(ACTION_TYPES.SIDEBAR_DELETE_DEPARTMENT): {
      const res = action.payload.data;
      return {
        ...state,
        deletedDepartmentId: res.departmentId,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.DELETE }
      };
    }
    case SUCCESS(ACTION_TYPES.SIDEBAR_CHANGE_DEPARTMENT_ORDER): {
      const res = action.payload.data;
      return {
        ...state,
        departmentOrderList: res && res.departmentIds,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE }
      };
    }
    case ACTION_TYPES.SIDEBAR_RESET:
      return {
        ...state,
        errorMessage: initialState.errorMessage,
        errorItems: initialState.errorItems
      };
    default:
      return state;
  }
};

const employeesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;
// use for get local menu data
export const getLocalMenu = () => ({
  type: ACTION_TYPES.SIDEBAR_EMPLOYEE_LOCAL_MENU,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/get-initialize-local-menu`,
    null,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleInitLocalMenu = () => async (dispatch, getState) => {
  await dispatch(getLocalMenu());
};
// use for deleting group
export const deleteGroup = groupId => ({
  type: ACTION_TYPES.SIDEBAR_DELETE_GROUP,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/delete-groups`,
    {
      groupId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleDeleteGroup = groupId => async (dispatch, getState) => {
  await dispatch(deleteGroup(groupId));
};
// use for updating auto group
export const updateAutoGroup = groupId => ({
  type: ACTION_TYPES.SIDEBAR_UPDATE_AUTO_GROUP,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/refresh-auto-group`,
    {
      idOfList: groupId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleUpdateAutoGroup = groupId => async (dispatch, getState) => {
  await dispatch(updateAutoGroup(groupId));
};
// use for delete department
export const deleteDepartment = departmentId => ({
  type: ACTION_TYPES.SIDEBAR_DELETE_DEPARTMENT,
  payload: axios.post(
    `${API_CONTEXT_PATH}/employees/api/delete-department`,
    { departmentId },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleDeleteDepartment = departmentId => async (dispatch, getState) => {
  await dispatch(deleteDepartment(departmentId));
};
// use for delete department
export const changeDepartmentOrder = departmentParams => ({
  type: ACTION_TYPES.SIDEBAR_CHANGE_DEPARTMENT_ORDER,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'employees/api/change-department-order'}`,
    { departmentParams },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleChangeDepartmentOrder = departmentParams => async (dispatch, getState) => {
  await dispatch(changeDepartmentOrder(departmentParams));
};

export const resetSidebar = () => ({
  type: ACTION_TYPES.SIDEBAR_RESET
});
