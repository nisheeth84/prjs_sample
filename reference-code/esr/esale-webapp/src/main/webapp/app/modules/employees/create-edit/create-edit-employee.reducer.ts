import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG, AVAILABLE_FLAG } from 'app/config/constants';
import {
  EMPLOYEE_ACTION_TYPES,
  PARAM_GET_EMPLOYEES_LAYOUT,
  PARAM_GET_EMPLOYEE,
  PARAM_CREATE_UPDATE_EMPLOYEE
} from '../constants';
import { modeScreenType, convertFieldType } from 'app/shared/util/fieldType-utils';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import { handleCheckInvalidLicense } from '../list/employee-list.reducer';

export const ACTION_TYPES = {
  EMPLOYEE_GET_ADD: 'employee/GET_ADD',
  EMPLOYEE_GET_EDIT: 'employee/GET_EDIT',
  EMPLOYEE_CREATE: 'employee/CREATE',
  EMPLOYEE_UPDATE: 'employee/UPDATE',
  EMPLOYEE_RESET: 'employee/RESET'
};

export enum EmployeeAction {
  None,
  RequestModal,
  ErrorModal,
  DoneModal,
  UpdateEmployeeSuccess,
  CreateEmployeeSuccess,
  UpdateEmployeeFailure,
  CreateEmployeeFailure
}

interface ICreateEditEmployeeStateData {
  action: EmployeeAction,
  employeeData: any,
  initEmployee: any,
  fields: any,
  errorItems: any,
  errorMessage: any,
  successMessage: any,
  employeeId: any
}

const defaultStateValue = {
  action: EmployeeAction.None,
  employeeData: {},
  initEmployee: {},
  fields: [],
  errorItems: [],
  errorMessage: null,
  successMessage: null,
  employeeId: null
};

const initialState = {
  data: new Map<string, ICreateEditEmployeeStateData>()
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

export const parseGetEmployeeResponse = res => {
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

const parseGetEmployeeLayoutResponse = res => {
  const employeeLayout = res.employeeLayout ? res.employeeLayout : [];
  let fields = [];
  if (employeeLayout.length > 0) {
    fields = employeeLayout
      .filter(e => e.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE)
      .sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { fields };
};

const parseCreateEmployeeResponse = res => {
  let employeeId = null;
  if (res) {
    employeeId = res.employeeId;
  }
  return { employeeId };
};

const parseUpdateEmployeeResponse = res => {
  let employeeId = null;
  if (res && res.employeeId) {
    employeeId = res.employeeId;
  }
  return { employeeId };
};

const parseResponseFail = res => {
  let errorMsg = '';
  if (res.parameters.extensions && res.parameters.extensions.length > 0) {
    errorMsg = res.parameters.extensions[0].message;
  }

  return { errorMsg };
};

export type EmployeeInfoState = Readonly<typeof initialState>;

const assignState = (state: EmployeeInfoState, namespace: string, params: any) => {
  if (state.data.has(namespace)) {
    _.assign(state.data.get(namespace), params);
  } else {
    const val = _.cloneDeep(defaultStateValue);
    _.assign(val, params);
    state.data.set(namespace, val);
  }
};

export default (state: EmployeeInfoState = initialState, action): EmployeeInfoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.EMPLOYEE_GET_ADD):
    case REQUEST(ACTION_TYPES.EMPLOYEE_GET_EDIT):
    case REQUEST(ACTION_TYPES.EMPLOYEE_CREATE):
    case REQUEST(ACTION_TYPES.EMPLOYEE_UPDATE):
      assignState(state, action.meta.namespace, {
        action: EmployeeAction.RequestModal,
        errorMessage: null,
        successMessage: null,
        fields: [],
      });
      return { ...state };
    case FAILURE(ACTION_TYPES.EMPLOYEE_CREATE):
      assignState(state, action.meta.namespace, {
        errorItems: parseErrorRespose(action.payload),
        action: EmployeeAction.CreateEmployeeFailure
      });
      return { ...state };
    case FAILURE(ACTION_TYPES.EMPLOYEE_UPDATE):
      assignState(state, action.meta.namespace, {
        errorItems: parseErrorRespose(action.payload),
        action: EmployeeAction.UpdateEmployeeFailure
      });
      return { ...state };
    case FAILURE(ACTION_TYPES.EMPLOYEE_GET_ADD): {
      const res = parseResponseFail(action.payload.response.data);
      assignState(state, action.meta.namespace, {
        action: EmployeeAction.ErrorModal,
        errorMessage: res.errorMsg,
        successMessage: null
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_GET_ADD): {
      const res = parseGetEmployeeLayoutResponse(action.payload.data);
      const fieldsTmp = convertFieldType(res.fields, modeScreenType.typeAddEdit).filter(
        e => e.fieldType.toString() !== DEFINE_FIELD_TYPE.OTHER && e.fieldName !== 'is_admin'
      );
      assignState(state, action.meta.namespace, {
        action: EmployeeAction.DoneModal,
        successMessage: null,
        fields: fieldsTmp
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_GET_EDIT): {
      const res = parseGetEmployeeResponse(action.payload.data);
      const fieldsTmp = convertFieldType(res.fields, modeScreenType.typeAddEdit).filter(
        e => e.fieldType.toString() !== DEFINE_FIELD_TYPE.OTHER && e.fieldName !== 'is_admin'
      );
      res.fields = fieldsTmp;
      assignState(state, action.meta.namespace, {
        action: EmployeeAction.DoneModal,
        successMessage: null,
        employeeData: res.employeeData,
        fields: res.fields,
        initEmployee: res.initEmployee
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_CREATE): {
      const res = parseCreateEmployeeResponse(action.payload.data);
      assignState(state, action.meta.namespace, {
        action: EmployeeAction.CreateEmployeeSuccess,
        employeeId: res.employeeId
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_UPDATE): {
      const res = parseUpdateEmployeeResponse(action.payload.data);
      assignState(state, action.meta.namespace, {
        action: EmployeeAction.UpdateEmployeeSuccess,
        employeeId: res.employeeId
      });
      return { ...state };
    }
    case ACTION_TYPES.EMPLOYEE_RESET:
      if (state.data.has(action.meta.namespace)) {
        state.data.delete(action.meta.namespace);
      }
      return {
        ...state
      };
    default:
      return state;
  }
};

// API base URL
const employeesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

const getEmployeeLayout = (namespace: string) => ({
  type: ACTION_TYPES.EMPLOYEE_GET_ADD,
  payload: axios.post(`${employeesApiUrl}/get-employee-layout`, null, {
    headers: { ['Content-Type']: 'application/json' }
  }),
  meta: { namespace }
});

const getEmployee = (namespace: string, params) => ({
  type: ACTION_TYPES.EMPLOYEE_GET_EDIT,
  payload: axios.post(`${employeesApiUrl}/get-employee`, params, {
    headers: { ['Content-Type']: 'application/json' }
  }),
  meta: { namespace }
});

const buildFormData = (params, fileUploads, isUpdate) => {
  const data = new FormData();
  let filesNameList;
  let mapFile = '';
  let separate = '';
  if (fileUploads) params['files'] = [];
  fileUploads.forEach((file, index) => {
    const key = Object.keys(file)[0];
    mapFile += separate + `"${key}": ["variables.files.${index}"]`;
    // filesMap[key] = file[key];
    data.append('files', file[key]);
    if (!filesNameList) {
      filesNameList = [];
    }
    filesNameList.push(key);
    separate = ',';
    // params['files'].push(file);
  });
  if (filesNameList) {
    data.append('filesMap', filesNameList);
  }
  data.append('data', JSON.stringify(params['data']));
  if (isUpdate) {
    data.append('employeeId', params.employeeId);
  }

  // const query = JSON.stringify(PARAM_CREATE_UPDATE_EMPLOYEE(params, isUpdate));

  // data.append('operations', query.replace(/\n/g, '').replace('  ', ' '));
  // data.append('map', '{' + mapFile + '}');
  return data;
};

const createEmployee = (namespace: string, params, fileUploads) => ({
  type: ACTION_TYPES.EMPLOYEE_CREATE,
  payload: axios.post(
    `${employeesApiUrl}/create-employee`,
    buildFormData(params, fileUploads, false),
    {
      headers: { ['Content-Type']: 'multipart/form-data' }
    }
  ),
  meta: { namespace }
});

const updateEmployee = (namespace: string, params, fileUploads) => ({
  type: ACTION_TYPES.EMPLOYEE_UPDATE,
  payload: axios.post(
    `${employeesApiUrl}/update-employee`,
    buildFormData(params, fileUploads, true),
    {
      headers: { ['Content-Type']: 'multipart/form-data' }
    }
  ),
  meta: { namespace }
});

export const handleGetDataEmployee = (namespace: string, prarams, employeeModalMode?) => async dispatch => {
  if (employeeModalMode === EMPLOYEE_ACTION_TYPES.CREATE) {
    // console.log(PARAM_GET_EMPLOYEES_LAYOUT());
    await dispatch(getEmployeeLayout(namespace));
  } else {
    await dispatch(getEmployee(namespace, prarams));
  }
};

export const handleSubmitEmployeeData = (namespace: string, params, action, fileUploads) => async dispatch => {
  if (action === EMPLOYEE_ACTION_TYPES.CREATE) {
    let paramsCreate = (params && params.data) || {};
    if (paramsCreate && paramsCreate.comment) {
      paramsCreate = Object.assign(paramsCreate, { isSendMail: true });
    } else {
      paramsCreate = Object.assign(paramsCreate, { isSendMail: false });
    }
    await dispatch(createEmployee(namespace, { data: paramsCreate }, fileUploads));
  } else if (action === EMPLOYEE_ACTION_TYPES.UPDATE) {
    await dispatch(updateEmployee(namespace, params, fileUploads));
  }

  dispatch(handleCheckInvalidLicense(true));
};

/**
 * reset state
 */
export const reset = (namespace: string) => ({
  type: ACTION_TYPES.EMPLOYEE_RESET,
  meta: { namespace }
});
