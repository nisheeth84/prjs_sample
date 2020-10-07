import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, AVAILABLE_FLAG } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { SHOW_MESSAGE_SUCCESS } from '../../../../modules/customers/constants';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { GROUP_MODE_SCREEN } from 'app/shared/layout/dynamic-form/group/constants';

/**
 * CONST ACTION TYPES
 */
export const ACTION_TYPES = {
  FIELDS_SEARCH_CUSTOM_FIELD_GET: 'dynamicGroup/CUSTOM_FIELD_GET',
  SHARED_GROUP_GET_EMPLOYEE_LOGIN: 'dynamicGroup/SHARED_GROUP_GET_EMPLOYEE_LOGIN'
};

/**
 * ENUM SHARED LIST ACTION
 */
export enum DynamicGroupModalAction {
  None,
  Request,
  Error,
  Success,
  Doneinit,
  CreateUpdateSuccess
}

/**
 * Initial State
 */
const initialState = {
  action: DynamicGroupModalAction.None,
  customFieldsInfoRelation: [],
  employeeDataLogin: {}
};

const parseCustomFieldsInfoResponse = res => {
  const fieldInfos = res;
  if (fieldInfos && fieldInfos.customFieldsInfo) {
    fieldInfos.customFieldsInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  const dataCustomFieldsInfo = fieldInfos.customFieldsInfo;
  return { dataCustomFieldsInfo };
};

const copyData = from => {
  const employeeDepartments = [];
  from.employeeDepartments.map(item => {
    employeeDepartments.push({
      departmentId: item.departmentId,
      positionId: item.positionId
    });
  });
  return {
    ...from,
    employeeDepartments
  };
};

const parseGetEmployeeResponse = res => {
  let fields = [];
  if (res.fields && res.fields.length > 0) {
    fields = res.fields
      .filter(e => e.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE)
      .sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  let employeeData = {};
  let initEmployee = {};
  if (res.data) {
    employeeData = res.data;
    initEmployee = copyData(res.data);
  }

  return { fields, employeeData, initEmployee };
};

export type DynamicGroupModalState = Readonly<typeof initialState>;

// Reducer
export default (state: DynamicGroupModalState = initialState, action): DynamicGroupModalState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SHARED_GROUP_GET_EMPLOYEE_LOGIN):
    case REQUEST(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_GET):
      return {
        ...state,
        action: DynamicGroupModalAction.Request
      };
    case FAILURE(ACTION_TYPES.SHARED_GROUP_GET_EMPLOYEE_LOGIN):
    case FAILURE(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_GET): {
      return {
        ...state,
        action: DynamicGroupModalAction.Error
      };
    }
    case SUCCESS(ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_GET): {
      const res = parseCustomFieldsInfoResponse(action.payload.data);
      return {
        ...state,
        action: DynamicGroupModalAction.Success,
        customFieldsInfoRelation: res.dataCustomFieldsInfo
      };
    }
    case SUCCESS(ACTION_TYPES.SHARED_GROUP_GET_EMPLOYEE_LOGIN): {
      const res = parseGetEmployeeResponse(action.payload.data);
      return {
        ...state,
        action: DynamicGroupModalAction.Success,
        employeeDataLogin: res.employeeData
      };
    }
    default:
      return state;
  }
};

/**
 * Get custom fields info
 *
 * @param
 */
export const getCustomFieldsInfo = fieldBelong => ({
  type: ACTION_TYPES.FIELDS_SEARCH_CUSTOM_FIELD_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}/get-custom-fields-info`,
    {
      fieldBelong
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const getEmployeeLogin = params => ({
  type: ACTION_TYPES.SHARED_GROUP_GET_EMPLOYEE_LOGIN,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/get-employee`,
    params,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleGetDataEmployeeLogin = params => async dispatch => {
  await dispatch(getEmployeeLogin(params));
};
