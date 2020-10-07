import axios from 'axios';
import { API_CONTEXT_PATH, ScreenMode, API_CONFIG } from 'app/config/constants';

import {
  SHOW_MESSAGE_SUCCESS,
  GET_LIST_TYPE
} from 'app/modules/customers/constants';
import { REQUEST, FAILURE, SUCCESS } from 'app/shared/reducers/action-type.util';
import StringUtils, { parseErrorRespose } from 'app/shared/util/string-utils';

/**
 * Enum action Customer Sidebar
 */
export enum CustomerSidebarAction {
  None,
  Request,
  Error,
  Success
}

/**
 * Action type when call API
 */
export const ACTION_TYPES = {
  SIDEBAR_CUSTOMER_LOCAL_MENU: 'controlCustomerSidebar/LOCAL_MENU_SIDEBAR',
  CUSTOMER_LIST_ADD_CUSTOMERS_TO_AUTOLIST: 'controlCustomerSidebar/ADD_CUSTOMERS_TO_AUTOLIST',
  CUSTOMER_LIST_INITIALIZE_LIST_INFO: 'controlCustomerSidebar/INITIALIZE_LIST_INFO'
};

/**
 * Default state
 */
const initialState = {
  action: CustomerSidebarAction.None,
  localMenuData: null,
  errorItems: null,
  localMenuMsg: null,
  errorMessage: null,
  listIdAddToAutoList: null,
  initializeListInfo: null,
  fields: null,
  msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.NONE }
};

/**
 * Parse data when call API getCustomerList
 * @param res
 */
const parseLocalMenuResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? CustomerSidebarAction.Error : CustomerSidebarAction.Success;
  const localMenu = res;
  return { errorMsg, action, localMenu };
};

const parseCustomerToAutolist = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? CustomerSidebarAction.Error : CustomerSidebarAction.Success;
  const addCustomersToAutoList = res.data.addCustomersToAutoList;
  return { errorMsg, action, addCustomersToAutoList };
};

const parseInitializeListInfo = res => {
  const action = CustomerSidebarAction.Success;
  let initializeListInfo = [];
  let fields = [];
  if (res && res.initializeInfo) {
    initializeListInfo = res.initializeInfo;
  }
  if (res && res.fields && res.fields.length > 0) {
    fields = res.fields;
  }
  return { action, initializeListInfo, fields };
};

export type CustomerControlSidebarState = Readonly<typeof initialState>;

export default (
  state: CustomerControlSidebarState = initialState,
  action
): CustomerControlSidebarState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SIDEBAR_CUSTOMER_LOCAL_MENU):
    case REQUEST(ACTION_TYPES.CUSTOMER_LIST_ADD_CUSTOMERS_TO_AUTOLIST):
    case REQUEST(ACTION_TYPES.CUSTOMER_LIST_INITIALIZE_LIST_INFO):
      return {
        ...state,
        action: CustomerSidebarAction.Request,
        errorItems: null
      };
    case FAILURE(ACTION_TYPES.CUSTOMER_LIST_ADD_CUSTOMERS_TO_AUTOLIST):
    case FAILURE(ACTION_TYPES.SIDEBAR_CUSTOMER_LOCAL_MENU):
    case FAILURE(ACTION_TYPES.CUSTOMER_LIST_INITIALIZE_LIST_INFO): {
      return {
        ...state,
        action: CustomerSidebarAction.Error,
        errorMessage: action.payload.message,
        errorItems: parseErrorRespose(action.payload)
      };
    }

    case SUCCESS(ACTION_TYPES.CUSTOMER_LIST_INITIALIZE_LIST_INFO): {
      const res = parseInitializeListInfo(action.payload.data);
      return {
        ...state,
        initializeListInfo: res.initializeListInfo,
        fields: res.fields
      };
    }
    case SUCCESS(ACTION_TYPES.SIDEBAR_CUSTOMER_LOCAL_MENU): {
      const res = parseLocalMenuResponse(action.payload.data);
      return {
        ...state,
        localMenuData: res.localMenu,
        action: CustomerSidebarAction.Success
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_LIST_ADD_CUSTOMERS_TO_AUTOLIST): {
      return {
        ...state,
        action: CustomerSidebarAction.Success,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE }
      };
    }
    case ACTION_TYPES.SIDEBAR_CUSTOMER_LOCAL_MENU: {
      // const res = parseLocalMenuResponse(action.payload.data);
      return {
        ...state,
        action: CustomerSidebarAction.Success,
        localMenuData: action.payload
      };
    }
    default:
      return state;
  }
};

// API base URL
const customersApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH;

/**
 * Get list cutomer to display sidebar
 * @param isOwner
 * @param isFavourite
 */
export const getLocalMenu = isFavourite => ({
  type: ACTION_TYPES.SIDEBAR_CUSTOMER_LOCAL_MENU,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-customer-list`,
    {
      isFavourite,
      mode: GET_LIST_TYPE.BASE_ON_USE_LOGIN
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
export const addCustomersToAutoList = listId => ({
  type: ACTION_TYPES.CUSTOMER_LIST_ADD_CUSTOMERS_TO_AUTOLIST,
  payload: axios.post(
    `${customersApiUrl}/refresh-auto-list`,
    {
      idOfList: listId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const getInitializeListInfo = fieldBelong => ({
  type: ACTION_TYPES.CUSTOMER_LIST_INITIALIZE_LIST_INFO,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'commons/api/get-initialize-list-info'}`,
    { fieldBelong },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Add customer to favourite list
 * @param listId
 */
export const handleAddCustomersToAutoList = listId => async (dispatch, getState) => {
  await dispatch(addCustomersToAutoList(listId));
};

/**
 * Init menu local => call API
 * @param isOwner
 * @param isFavourite
 */
export const handleInitLocalMenu = isFavourite => async (dispatch, getState) => {
  await dispatch(getLocalMenu(isFavourite));
};

export const handleGetInitializeListInfo = fieldBelong => async (dispatch, getState) => {
  await dispatch(getInitializeListInfo(fieldBelong));
};
