import { messages } from './../../../config/constants';
import axios from 'axios';
import _ from 'lodash';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, API_CONFIG } from 'app/config/constants';
import { AVAILABLE_FLAG, SHOW_MESSAGE_SUCCESS } from '../constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';

export const ACTION_TYPES = {
  RESET_CUSTOMER_MODAL: 'customerIntegration/RESET',
  GET_CUSTOMER_LAYOUT: 'customerIntegration/GET_CUSTOMER_LAYOUT',
  GET_CUSTOMERS_BY_IDS: 'customerIntegration/GET_CUSTOMERS_BY_IDS',
  INTEGRATE_CUSTOMER: 'customerIntegration/INTEGRATE_CUSTOMER'
};

export enum ModalAction {
  None,
  Error,
  GetCustomersSuccess,
  IntegrateCustomerSuccess
}

const initialModalState = {
  customers: null,
  fieldInfos: null,
  errorItems: null,
  customerId: null,
  action: ModalAction.None,
  msgSuccess: null
};

export type CustomerModalState = Readonly<typeof initialModalState>;

// API base URL
const customersApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH;

/**
 * Destructuring response from create/update API
 * @param res
 */
const parseMutationResponse = res => {
  let errorItems = [];
  const hasErrors = res.errors && res.errors.length > 0;
  if (hasErrors) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      errorItems = _.cloneDeep(res.errors[0].extensions.errors);
    }
  }
  const action = hasErrors ? ModalAction.Error : ModalAction.IntegrateCustomerSuccess;
  return { errorItems, action };
};

/**
 * Reducer for Customer
 */
export default (state: CustomerModalState = initialModalState, action): CustomerModalState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_CUSTOMER_LAYOUT):
    case REQUEST(ACTION_TYPES.INTEGRATE_CUSTOMER):
    case REQUEST(ACTION_TYPES.GET_CUSTOMERS_BY_IDS):
      return {
        ...state,
        errorItems: null
      };
    case FAILURE(ACTION_TYPES.GET_CUSTOMER_LAYOUT):
    case FAILURE(ACTION_TYPES.INTEGRATE_CUSTOMER):
    case FAILURE(ACTION_TYPES.GET_CUSTOMERS_BY_IDS): {
      // const errors = action.payload.response
      return {
        ...state,
        errorItems: action.payload.response?.data?.parameters?.extensions?.errors
          ? parseErrorRespose(action.payload)
          : action.payload.messages ? action.payload.messages : [{errorCode: 'ERR_COM_0001'}]
      };
    }
    case SUCCESS(ACTION_TYPES.GET_CUSTOMER_LAYOUT): {
      return {
        ...state,
        fieldInfos:
          action.payload.data && action.payload.data.fields
            ? action.payload.data.fields.filter(
                e => e.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE
              )
            : [],
        errorItems: action.payload.errorItems,
        action: action.payload.action
      };
    }
    case SUCCESS(ACTION_TYPES.INTEGRATE_CUSTOMER): {
      const res = parseMutationResponse(action.payload.data);
      return {
        ...state,
        errorItems: res.errorItems,
        action: res.action,
        customerId: action.payload.data.customerId,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE }
      };
    }
    case SUCCESS(ACTION_TYPES.GET_CUSTOMERS_BY_IDS): {
      return {
        ...state,
        customers:
          action.payload.data && action.payload.data.customers ? action.payload.data.customers : []
      };
    }
    case ACTION_TYPES.RESET_CUSTOMER_MODAL:
      return {
        ...initialModalState
      };
    default:
      return state;
  }
};

/**
 * Reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.RESET_CUSTOMER_MODAL
});

const getCustomerLayout = () => ({
  type: ACTION_TYPES.GET_CUSTOMER_LAYOUT,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-customer-layout`,
    {},
    { headers: { ['Content-Type']: 'application/json' } }
  )
  // payload: DUMMY_GET_CUSTOMER_LAYOUT
});

export const handleGetCustomerLayout = () => async dispatch => {
  await dispatch(getCustomerLayout());
};

const getCustomersByIds = customerIds => ({
  type: ACTION_TYPES.GET_CUSTOMERS_BY_IDS,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-customers-by-ids`,
    {
      customerIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
  // payload: DUMMY_GET_CUSTOMERS_BY_IDS
});

export const handleGetCustomersByIds = customerIds => async dispatch => {
  await dispatch(getCustomersByIds(customerIds));
};

const buildFormData = (params, fileUploads, isUpdate) => {
  const data = new FormData();
  let filesNameList;
  let mapFile = '';
  let separate = '';
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
  data.append('data', JSON.stringify(params));
  if (isUpdate) {
    data.append('customerId', params.customerId);
  }
  return data;
};

export const integrateCustomer = (customerIntegrationData, fileUploads) => ({
  type: ACTION_TYPES.INTEGRATE_CUSTOMER,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/integrate-customer`,
    buildFormData(
      {
        address: customerIntegrationData.address,
        building: customerIntegrationData.building,
        businessMainId: customerIntegrationData.businessMainId,
        businessSubId: customerIntegrationData.businessSubId,
        customerAliasName: customerIntegrationData.customerAliasName,
        customerData: customerIntegrationData.customerData,
        customerId: customerIntegrationData.customerId,
        customerIdsDelete: customerIntegrationData.customerIdsDelete,
        customerLogo: customerIntegrationData.customerLogo,
        customerName: customerIntegrationData.customerName,
        departmentId: customerIntegrationData.departmentId,
        employeeId: customerIntegrationData.employeeId,
        groupId: customerIntegrationData.groupId,
        memo: customerIntegrationData.memo,
        parentId: customerIntegrationData.parentId,
        phoneNumber: customerIntegrationData.phoneNumber,
        updatedDate: customerIntegrationData.updatedDate,
        url: customerIntegrationData.url,
        zipCode: customerIntegrationData.zipCode
      },
      fileUploads,
      true
    ),
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleIntegrateCustomer = (customerIntegrationData, fileUploads) => async dispatch => {
  await dispatch(integrateCustomer(customerIntegrationData, fileUploads));
};
