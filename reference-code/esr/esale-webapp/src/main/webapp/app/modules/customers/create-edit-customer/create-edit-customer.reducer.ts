import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import {
  CUSTOMER_ACTION_TYPES,
  SHOW_MESSAGE_SUCCESS
} from '../constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import _ from 'lodash';

export const ACTION_TYPES = {
  CUSTOMER_GET_ADD: 'customer/GET_ADD',
  CUSTOMER_GET_EDIT: 'customer/GET_EDIT',
  CUSTOMER_CREATE: 'customer/CREATE',
  CUSTOMER_UPDATE: 'customer/UPDATE',
  CUSTOMER_RESET: 'customer/RESET',
  CUSTOMER_GET_SCENARIO: 'customer/GET_SCENARIO_CUSTOMER',
  CUSTOMER_GET_MASTER_SCENARIO: 'customer/CUSTOMER_GET_MASTER_SCENARIO',
  CUSTOMER_GET_MASTER_SCENARIOS: 'customer/CUSTOMER_GET_MASTER_SCENARIOS',
  CUSTOMER_CHANGE_SCENARIO: 'customer/CUSTOMER_CHANGE_SCENARIO',
  GET_MILESTONE: 'milestone/GET_MILESTONE',
  UPDATE_MILESTONE: 'milestone/UPDATE_MILESTONE',
  DELETE_MILESTONE: 'milestone/DELETE_MILESTONE',
  CUSTOMER_SAVE_SCENARIO: 'customer/SAVE_SCENARIO_CUSTOMER'
};

export enum CustomerAction {
  None,
  RequestModal,
  ErrorModal,
  DoneModal,
  UpdateCustomerSuccess,
  CreateCustomerSuccess,
  UpdateCustomerFailure,
  CreateCustomerFailure,
  SuccessCreateScenario,
  CreateTagCustomerSuccess
}

interface ICreateEditCustomerStateData {
  action: CustomerAction,
  customerData: any,
  fields: any,
  errorItems: any,
  responseStatus: number,
  errorMessage: any,
  successMessage: any,
  customerId: any,
  scenarioData: any,
  masterScenarios: any,
  masterScenario: any,
  checkTagCustomer: any
}

const defaultStateValue = {
  action: CustomerAction.None,
  customerData: {},
  fields: [],
  errorItems: [],
  responseStatus: 0,
  errorMessage: null,
  successMessage: null,
  customerId: null,
  scenarioData: [],
  masterScenarios: [],
  masterScenario: {},
  checkTagCustomer: false
};

const initialState = {
  data: new Map<string, ICreateEditCustomerStateData>()
};

const parseGetCustomerResponse = res => {
  const customer = res || [];
  const action = CustomerAction.DoneModal;
  let fields = [];
  if (customer.fields && customer.fields.length > 0) {
    fields = customer.fields
      .filter(e => e.availableFlag)
      .sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  let customerData = {};
  let dataFields = [];
  if (customer) {
    customerData = customer.customer;
    dataFields = customer.customerData;
  }

  return { action, fields, customerData, dataFields };
};

const parseResponse = res => {
  const scenarios = (res && res.scenarios) || [];
  return { scenarios };
};

const parseGetCustomerLayoutResponse = res => {
  const customerLayout = res.fields ? res.fields : [];
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? CustomerAction.ErrorModal : CustomerAction.DoneModal;
  let fields = [];
  if (customerLayout.length > 0) {
    fields = customerLayout
      .filter(e => e.availableFlag)
      .sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { errorMsg, action, fields };
};

export type CustomerInfoState = Readonly<typeof initialState>;

const assignState = (state: CustomerInfoState, namespace: string, params: any) => {
  if (state.data.has(namespace)) {
    const val = state.data.get(namespace)
    _.assign(val, params);
    state.data.set(namespace, val);
  } else {
    const val = _.cloneDeep(defaultStateValue);
    _.assign(val, params);
    state.data.set(namespace, val);
  }
};

export default (state: CustomerInfoState = initialState, action): CustomerInfoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_ADD):
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_EDIT):
    case REQUEST(ACTION_TYPES.CUSTOMER_CREATE):
    case REQUEST(ACTION_TYPES.CUSTOMER_UPDATE):
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_MASTER_SCENARIO):
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_MASTER_SCENARIOS):
    case REQUEST(ACTION_TYPES.CUSTOMER_SAVE_SCENARIO):
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_SCENARIO):
      assignState(state, action.meta.namespace, {
        action: CustomerAction.RequestModal,
        errorMessage: null,
        successMessage: null,
      });
      return {...state};
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_ADD):
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_MASTER_SCENARIO):
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_MASTER_SCENARIOS):
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_SCENARIO):
      assignState(state, action.meta.namespace, {
        action: CustomerAction.ErrorModal,
        errorMessage: action.payload.message,
        responseStatus: action.payload.response.status,
        successMessage: null
      });
      return {...state};
    case FAILURE(ACTION_TYPES.CUSTOMER_CREATE): {
      assignState(state, action.meta.namespace, {
        errorItems: parseErrorRespose(action.payload),
        responseStatus: action.payload.response.status,
        action: CustomerAction.CreateCustomerFailure,
        checkTagCustomer: false
      });
      return {...state};
    }
    case FAILURE(ACTION_TYPES.CUSTOMER_SAVE_SCENARIO): {
      const errorMessageRes = (action.payload && action.payload.message) || null;
      assignState(state, action.meta.namespace, {
        errorItems: parseErrorRespose(action.payload),
        errorMessage: errorMessageRes,
        responseStatus: action.payload.response.status,
        action: CustomerAction.ErrorModal
      });
      return {...state};
    }
    case FAILURE(ACTION_TYPES.CUSTOMER_UPDATE):
      assignState(state, action.meta.namespace, {
        errorItems: parseErrorRespose(action.payload),
        responseStatus: action.payload.response.status,
        action: CustomerAction.UpdateCustomerFailure
      });
      return {...state};
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_EDIT): {
      assignState(state, action.meta.namespace, {
        errorItems: parseErrorRespose(action.payload),
        responseStatus: action.payload.response.status
      });
      return {...state};
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_GET_ADD): {
      const res = parseGetCustomerLayoutResponse(action.payload.data);
      assignState(state, action.meta.namespace, {
        action: res.action,
        errorMessage: res.errorMsg,
        successMessage: null,
        responseStatus: action.payload.status,
        fields: res.fields
      });
      return {...state};
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_GET_EDIT): {
      const res = parseGetCustomerResponse(action.payload.data);
      assignState(state, action.meta.namespace, {
        action: res.action,
        successMessage: null,
        customerData: res.customerData,
        responseStatus: action.payload.status,
        fields: res.fields
      });
      return {
        ...state
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_GET_SCENARIO): {
      const res = action.payload.data;
      assignState(state, action.meta.namespace, {
        scenarioData: (res && res.scenarios && res.scenarios.milestones) || [],
        successMessage: null,
        responseStatus: action.payload.status
      });
      return {
        ...state
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_CREATE): {
      let actionType = CustomerAction.CreateCustomerSuccess;
      let fieldsCreate = state.data.has(action.meta.namespace) ? state.data.get(action.meta.namespace).fields : [];
      if (state.data.has(action.meta.namespace) && state.data.get(action.meta.namespace).checkTagCustomer) {
        actionType = CustomerAction.CreateTagCustomerSuccess;
        fieldsCreate = null;
      }
      assignState(state, action.meta.namespace, {
        action: actionType,
        fields: fieldsCreate,
        customerId: action.payload.data,
        responseStatus: action.payload.status,
        checkTagCustomer: false,
        successMessage: SHOW_MESSAGE_SUCCESS.CREATE
      });
      return {
        ...state,
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_UPDATE): {
      assignState(state, action.meta.namespace, {
        action: CustomerAction.UpdateCustomerSuccess,
        customerId: action.payload.data,
        responseStatus: action.payload.status,
        successMessage: SHOW_MESSAGE_SUCCESS.UPDATE
      });
      return {
        ...state,
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_GET_MASTER_SCENARIOS): {
      const res = action.payload.data;
      assignState(state, action.meta.namespace, {
        masterScenarios: res && res.scenarios,
        responseStatus: action.payload.status
      });
      return {
        ...state,
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_GET_MASTER_SCENARIO): {
      const res = action.payload.data;
      assignState(state, action.meta.namespace, {
        masterScenario: res,
        responseStatus: action.payload.status
      });
      return {
        ...state,
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_SAVE_SCENARIO): {
      assignState(state, action.meta.namespace, {
        action: CustomerAction.SuccessCreateScenario,
        responseStatus: action.payload.status
      });
      return {
        ...state,
      };
    }
    case ACTION_TYPES.CUSTOMER_RESET:
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
const customersApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH;
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

const getCustomerLayout = (namespace: string) => ({
  type: ACTION_TYPES.CUSTOMER_GET_ADD,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-customer-layout`,
    null,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  ),
  meta: { namespace }
});

const getCustomer = (namespace: string, params) => ({
  type: ACTION_TYPES.CUSTOMER_GET_EDIT,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-customer`,
    params,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  ),
  meta: { namespace }
  // payload: DUMMY_CUSTOM_FIELD_INFO
});

// Build Form Data
const buildFormData = (params, fileUploads, isUpdate) => {
  const data = new FormData();
  let filesNameList;
  let mapFile = '';
  let separate = '';
  if (fileUploads) params['files'] = [];
  fileUploads.forEach((file, index) => {
    const key = Object.keys(file)[0];
    mapFile += separate + `"${key}": ["variables.files.${index}"]`;
    data.append('files', file[key]);
    if (!filesNameList) {
      filesNameList = [];
    }
    filesNameList.push(key);
    separate = ',';
  });
  if (filesNameList) {
    data.append('filesMap', filesNameList);
  }
  data.append('data', JSON.stringify(params['data']));
  if (isUpdate) {
    data.append('customerId', params.customerId);
  }
  return data;
};

const createCustomer = (namespace: string, params, fileUploads) => ({
  type: ACTION_TYPES.CUSTOMER_CREATE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/create-customer`,
    buildFormData(params, fileUploads, false),
    { headers: { ['Content-Type']: 'multipart/form-data' } }
  ),
  meta: { namespace }
});

/**
 * Push customerId to data array
 * @param data
 * @param customerId
 */
const getDataForUpdate = (data, customerId) => {
  data['customerId'] = customerId;
  return data;
};

const updateCustomer = (namespace: string, params, fileUploads) => ({
  type: ACTION_TYPES.CUSTOMER_UPDATE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/update-customer`,
    buildFormData(params, fileUploads, true),
    {
      headers: { ['Content-Type']: 'multipart/form-data' }
    }
  ),
  meta: { namespace }
});

export const getScenario = (namespace: string, customerId) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.CUSTOMER_GET_SCENARIO,
    payload: axios.post(`${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-scenario`, {
      customerId
    }),
    meta: { namespace }
  });
};

export const handleGetScenario = (namespace: string, id) => async dispatch => {
  await dispatch(getScenario(namespace, id));
};

export const handleSaveScenario = (namespace: string, param) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.CUSTOMER_SAVE_SCENARIO,
    payload: axios.post(
      `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/save-scenario`,
      param
    ),
    meta: { namespace }
  });
};

export const handleGetDataCustomer = (namespace: string, prarams, customerModalMode) => async dispatch => {
  if (customerModalMode === CUSTOMER_ACTION_TYPES.CREATE) {
    await dispatch(getCustomerLayout(namespace));
  } else if (customerModalMode === CUSTOMER_ACTION_TYPES.UPDATE) {
    await dispatch(getCustomer(namespace, prarams));
  }
};

/**
 * Get master scenarios
 */
const getMasterScenarios = (namespace: string) => ({
  type: ACTION_TYPES.CUSTOMER_GET_MASTER_SCENARIOS,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-master-scenarios`,
    null,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  ),
  meta: { namespace }
});

const getMasterScenario = (namespace: string, scenarioId) => ({
  type: ACTION_TYPES.CUSTOMER_GET_MASTER_SCENARIO,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-master-scenario`,
    { scenarioId },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  ),
  meta: { namespace }
});

/**
 * Handle getting master scenarios
 */
export const handleGetMasterScenarios = (namespace: string) => async dispatch => {
  await dispatch(getMasterScenarios(namespace));
};

/**
 * Handle getting master scenario
 */
export const handleGetMasterScenario = (namespace: string, id) => async dispatch => {
  await dispatch(getMasterScenario(namespace, id));
};

export const handleSubmitCustomerData = (
  namespace: string,
  params,
  customerModalMode,
  fileUploads,
  fromTagAuto?: boolean
) => async (dispatch, getState) => {
  if (customerModalMode === CUSTOMER_ACTION_TYPES.CREATE) {
    assignState(getState().customerInfo, namespace, {
      checkTagCustomer: fromTagAuto
    });
    // if (fromTagAuto && getState().customerInfo.data.has(namespace)) {
    //   getState().customerInfo.data.get(namespace).checkTagCustomer = true
    // } else {
    //   getState().customerInfo.data.get(namespace).checkTagCustomer = false;
    // }
    await dispatch(createCustomer(namespace, { data: params.data }, fileUploads));
  } else if (customerModalMode === CUSTOMER_ACTION_TYPES.UPDATE) {
    await dispatch(updateCustomer(namespace, params, fileUploads));
  }
};

/**
 * reset state
 */
export const reset = (namespace: string) => ({
  type: ACTION_TYPES.CUSTOMER_RESET,
  meta: { namespace }
});
