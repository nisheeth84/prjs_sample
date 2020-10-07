// import { API_CONFIG, API_CONTEXT_PATH, FIELD_BELONG, ScreenMode, SEARCH_OPTION, SEARCH_TYPE, TYPE_MSG_EMPTY } from 'app/config/constants';
import {
  API_CONFIG,
  API_CONTEXT_PATH,
  FIELD_BELONG,
  ScreenMode,
  TYPE_MSG_EMPTY
} from 'app/config/constants';
import {
  // PARAM_GET_CUSTOM_FIELD_INFO, // ADD_MY_LIST
  // PARAM_GET_PRODUCT_TRADING_LIST, // ADD_MY_LIST
  // QUERY_DELETE_PRODUCTS_TRADING,
  // QUERY_UPDATE_PRODUCTS_TRADING, // ADD_MY_LIST
  API_URL,
  SHOW_MESSAGE_SUCCESS,
  MENU_TYPE,
  orderDefault
} from 'app/modules/sales/constants';

import { ACTION_TYPES as ACTION_TYPES_EMPLOYEE } from 'app/modules/employees/create-edit/create-edit-employee.reducer';
import { ACTION_TYPES as ACTION_TYPES_CUSTOMER } from 'app/modules/customers/create-edit-customer/create-edit-customer.reducer';

import {
  mapFieldAndMergeToProductTradingList,
  correctParamsToUpdateProductTrading
} from '../utils';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import StringUtils, { parseErrorRespose } from 'app/shared/util/string-utils';
import axios from 'axios';
import _ from 'lodash';
import { SALES_LIST_ID } from '../constants';
export const ACTION_TYPES = {
  PRODUCT_LIST_CUSTOM_FIELD_INFO_GET_LIST: 'sales/CUSTOM_FIELD_INFO_GET_LIST',
  PRODUCT_TRADING_LIST_PRODUCTS_GET: 'productTradingList/PRODUCTS_GET',
  PRODUCT_TRADING_LIST_RESET: 'productTradingList/RESET',
  PRODUCT_TRADING_UPDATE: 'productTradingList/UPDATE',
  PRODUCT_TRADINGS_LIST_CHANGE_TO_EDIT: 'productTradingList/EDIT',
  PRODUCT_TRADINGS_LIST_CHANGE_TO_DISPLAY: 'productTradingList/DISPLAY',
  PRODUCT_TRADINGS_FIELD_INFO_PROGRESS: 'productTradingFieldInfo/GET',
  PRODUCT_TRADING_UPDATE_FIELD_INFO_PROGRESS: 'productTradingFieldInfo/EDIT',
  PRODUCT_TRADINGS_PROGRESS_GET: 'productTradingProgress/GET',
  PRODUCT_TRADING_LIST_BY_PROGRESS_GET: 'productTradingByProgress/GET',
  PRODUCT_TRADING_LIST_BY_PROGRESS_GET_SCROLL: 'productTradingByProgressScroll/GET',
  SALES_LIST_RESET_MSG_SUCCESS: 'productTradingList/SALES_LIST_RESET_MSG_SUCCESS',
  SALE_LIST_INITIALIZE_LIST_INFO: 'employeeList/INITIALIZE_LIST_INFO',
  SALE_LIST_DRAG_DROP_PRODUCT_TRADING: 'employeeList/SALE_LIST_DRAG_DROP_PRODUCT_TRADING',
  REMOVE_PRODUCT_TRADINGS_FROM_LIST: 'productTradings/REMOVE_PRODUCT_TRADINGS',
  SALE_LIST_RESET_LIST: 'saleList/SALE_LIST_RESET_LIST',
  DELETE_PRODUCT_TRADINGS: 'productTradings/PRODUCT_TRADINGS_DELETE',
  UPDATE_PRODUCT_TRADING_BY_FIELD_NAME: 'productTradingByProgress/UPDATE',
  PRODUCT_TRADING_LIST_RESET_ERROR_ITEMS: 'productTradingList/RESET_ERROR_ITEMS'
};
export enum SalesAction {
  None,
  Request,
  Error,
  Success
}

const initialState = {
  action: SalesAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorCodeList: null,
  customFieldInfos: null,
  productTradings: null,
  fieldSearchInfos: null,
  customFieldSearchInfos: null,
  productsInfo: null,
  deleteProductTradings: null,
  updateProductTradings: null,
  progresses: [],
  productTradingsByProgress: null,
  fieldInfoProgresses: [],
  msgSuccess: SHOW_MESSAGE_SUCCESS.NONE,
  initializeListInfo: null,
  fields: null,
  timeAddToList: null,
  errorItems: null,
  errorMsg: null,
  numberOfItem: 0,
  typeMsgEmpty: TYPE_MSG_EMPTY.NONE,
  leaveGroupProductTradingsId: null,
  relatedProductTradingData: null,
  isEmployeeUpdated: -1,
  isCustomerUpdated: -1
};

const parseListProductResponse = res => {
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? SalesAction.Error : SalesAction.Success;
  let productTradingsInfo = null;
  if (res && res.productTradings) {
    productTradingsInfo = res;
  }

  productTradingsInfo.productTradings.forEach((element, idx) => {
    const productTradingData = element.productTradingData;
    const newElement = {};
    for (const prop in element) {
      if (Object.prototype.hasOwnProperty.call(element, prop) ) {
        newElement[StringUtils.camelCaseToSnakeCase(prop)] = element[prop] ? element[prop] : null;
      }
    }
    if (productTradingData) {
      productTradingData.forEach(e => {
        newElement[e.key] = e.value;
      });
    }
    productTradingsInfo.productTradings[idx] = newElement;
  });

  return { errorMsg, errorCodeList, action, productTradingsInfo };
};

const parseCustomFieldsInfoResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].extensions.errors;
  }
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }
  const action = errorMsg.length > 0 ? SalesAction.Error : SalesAction.Success;
  const fieldInfos = res.customFieldsInfo;
  if (fieldInfos) {
    fieldInfos.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { errorMsg, errorCodeList, action, fieldInfos };
};

const parseDeleteProductTradingResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].extensions.errors;
  }
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }
  const action = errorMsg.length > 0 ? SalesAction.Error : SalesAction.Success;
  let deleteProductTrading = null;
  if (res.data && res.data.deleteProductTradings) {
    deleteProductTrading = res.data.deleteProductTradings.productTradingIds;
  }
  return { errorMsg, errorCodeList, action, deleteProductTradings: deleteProductTrading };
};

const parseUpdateProgressTradingResponse = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].extensions.errors;
  }
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }
  const action = errorMsg.length > 0 ? SalesAction.Error : SalesAction.Success;
  let updateProductTradings = null;
  if (res.data && res.data.updateProductTradings) {
    updateProductTradings = res.data.updateProductTradings.productTradingIds;
  } else if (res.productTradingIds) {
    updateProductTradings = new Date().getTime();
  }

  return { errorMsg, errorCodeList, action, updateProductTradings };
};

const parserGetProgresses = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].extensions.errors;
  }
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }

  const action = errorMsg.length > 0 ? SalesAction.Error : SalesAction.Success;
  let progresses = [];
  if (res.data && res.data.progresses) {
    progresses = res.data.progresses
      .sort((a, b) => a.progressOrder - b.progressOrder)
      .filter(el => el.isAvailable);
  }

  // // convert snake case to camel case
  // progresses = progresses.map(ele => {
  //   const newObj = _.mapKeys(ele, (value, key) => _.camelCase(key));
  //   return newObj;
  // });

  return { errorMsg, errorCodeList, action, progresses };
};

const parserGetProductTradingsForCard = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].extensions.errors;
  }
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }

  const action = errorMsg.length > 0 ? SalesAction.Error : SalesAction.Success;
  let productTradingsByProgress = {};
  if (res.data) {
    productTradingsByProgress = res.data;
  }
  return { errorMsg, errorCodeList, action, productTradingsByProgress };
};

const parserGetFieldInfoProgress = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].extensions.errors;
  }
  const errorCodeList = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorCodeList.push(e);
      });
    }
  }

  const action = errorMsg.length > 0 ? SalesAction.Error : SalesAction.Success;
  let fieldInfoProgresses = [];
  if (res.data && res.data.fieldInfoProgresses) {
    fieldInfoProgresses = res.data.fieldInfoProgresses;
  }
  return { errorMsg, errorCodeList, action, fieldInfoProgresses };
};

// export const parseErrorRespose = payload => {
//   let errorMes = [];
//   if (payload.response.data.parameters && payload.response.data.parameters.message) {
//     errorMes[0] = payload.response.data.parameters.message;
//   } else if (payload.response.data.parameters) {
//     const resError = payload.response.data.parameters.extensions;
//     if (resError.errors) {
//       errorMes = resError.errors;
//     }
//   }
//   return errorMes;
// };

const parseDragDropTradingListFail = res => {
  const errorMsg = [];
  const errorItems = [];
  const rowIds = [];
  const errorParams = [];
  const errorList = res.parameters.extensions.errors;
  const hasErrors = errorList && errorList.length > 0;
  if (hasErrors) {
    for (let i = 0; i < errorList.length; i++) {
      errorMsg.push(errorList[i]);
      errorItems.push(errorList[i].item);
      rowIds.push(errorList[i].rowId);
      errorParams.push(errorList[i].errorParams);
    }
  } else {
    errorMsg.push(res.parameters.extensions.message);
  }
  return { errorMsg, errorItems, rowIds, errorParams };
};

const parseInitializeListInfo = res => {
  const action = SalesAction.Success;
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

export type SalesListState = Readonly<typeof initialState>;

// Reducer
// To fix Warning Arrow function has a complexity of 41. Maximum allowed is 40
const watchActionUpdate = (state, action) => {
  const tmpTime = new Date().getTime();
  switch (action.type) {
    case REQUEST(ACTION_TYPES.PRODUCT_TRADING_LIST_BY_PROGRESS_GET_SCROLL):
      return {
        ...state,
        action: SalesAction.Request,
        errorCodeList: null,
        timeAddToList: null
      };

    case FAILURE(ACTION_TYPES.PRODUCT_TRADING_LIST_BY_PROGRESS_GET_SCROLL):
      return {
        ...state,
        action: SalesAction.Error,
        errorMessage: action.payload.message,
        errorItems: parseErrorRespose(action.payload)
      };

    case SUCCESS(ACTION_TYPES.PRODUCT_TRADING_LIST_BY_PROGRESS_GET_SCROLL): {
      const res: any = parserGetProductTradingsForCard(action.payload);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        productTradingsByProgress: [
          ...state.productTradingsByProgress,
          ...res.productTradingsByProgress
        ]
      };
    }

    // Catch event employee updated
    case SUCCESS(ACTION_TYPES_EMPLOYEE.EMPLOYEE_UPDATE): {
      return {
        ...state,
        isEmployeeUpdated: tmpTime
      };
    }

    // Catch event customer updated
    case SUCCESS(ACTION_TYPES_CUSTOMER.CUSTOMER_UPDATE): {
      return {
        ...state,
        isCustomerUpdated: tmpTime
      };
    }

    default:
      return state;
  }
};

export default (state: SalesListState = initialState, action): SalesListState => {
  const tmpTime = new Date().getTime();
  switch (action.type) {
    case REQUEST(ACTION_TYPES.PRODUCT_LIST_CUSTOM_FIELD_INFO_GET_LIST):
    case REQUEST(ACTION_TYPES.PRODUCT_TRADING_LIST_PRODUCTS_GET):
    case REQUEST(ACTION_TYPES.PRODUCT_TRADING_UPDATE):
    case REQUEST(ACTION_TYPES.PRODUCT_TRADINGS_FIELD_INFO_PROGRESS):
    case REQUEST(ACTION_TYPES.PRODUCT_TRADINGS_PROGRESS_GET):
    case REQUEST(ACTION_TYPES.DELETE_PRODUCT_TRADINGS):
    case REQUEST(ACTION_TYPES.PRODUCT_TRADING_LIST_BY_PROGRESS_GET):
    case REQUEST(ACTION_TYPES.PRODUCT_TRADING_UPDATE_FIELD_INFO_PROGRESS):
    case REQUEST(ACTION_TYPES.SALE_LIST_DRAG_DROP_PRODUCT_TRADING):
    case REQUEST(ACTION_TYPES.REMOVE_PRODUCT_TRADINGS_FROM_LIST):
      return {
        ...state,
        action: SalesAction.Request,
        errorCodeList: null,
        timeAddToList: null
      };

    case FAILURE(ACTION_TYPES.PRODUCT_LIST_CUSTOM_FIELD_INFO_GET_LIST):
    case FAILURE(ACTION_TYPES.PRODUCT_TRADING_LIST_PRODUCTS_GET):
    case FAILURE(ACTION_TYPES.PRODUCT_TRADING_UPDATE):
    case FAILURE(ACTION_TYPES.PRODUCT_TRADINGS_FIELD_INFO_PROGRESS):
    case FAILURE(ACTION_TYPES.PRODUCT_TRADING_LIST_BY_PROGRESS_GET):
    case FAILURE(ACTION_TYPES.SALE_LIST_INITIALIZE_LIST_INFO):
    case FAILURE(ACTION_TYPES.PRODUCT_TRADING_UPDATE_FIELD_INFO_PROGRESS):
    case FAILURE(ACTION_TYPES.REMOVE_PRODUCT_TRADINGS_FROM_LIST):
    case FAILURE(ACTION_TYPES.DELETE_PRODUCT_TRADINGS):
      return {
        ...state,
        action: SalesAction.Error,
        errorMessage: action.payload.message,
        errorItems: parseErrorRespose(action.payload)
      };
    case FAILURE(ACTION_TYPES.SALE_LIST_DRAG_DROP_PRODUCT_TRADING): {
      const resDrag = parseDragDropTradingListFail(action.payload.response.data);
      return {
        ...state,
        action: SalesAction.Error,
        errorMessage: action.payload.message,
        errorCodeList: resDrag.errorMsg,
        errorMsg: resDrag.errorMsg
      };
    }

    case SUCCESS(ACTION_TYPES.PRODUCT_TRADINGS_FIELD_INFO_PROGRESS): {
      const res = parserGetFieldInfoProgress(action.payload);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        fieldInfoProgresses: res.fieldInfoProgresses
      };
    }

    case SUCCESS(ACTION_TYPES.REMOVE_PRODUCT_TRADINGS_FROM_LIST): {
      const res = action.payload.data;
      return {
        ...state,
        msgSuccess: SHOW_MESSAGE_SUCCESS.DELETE,
        leaveGroupProductTradingsId: res && res.listOfProductTradingId,
        timeAddToList: tmpTime
      };
    }

    case SUCCESS(ACTION_TYPES.DELETE_PRODUCT_TRADINGS): {
      const res = action.payload.data;
      return {
        ...state,
        action: SalesAction.Success,
        relatedProductTradingData: res.productTradingIds,
        msgSuccess: res.productTradingIds ? null : SHOW_MESSAGE_SUCCESS.DELETE
      };
    }

    case SUCCESS(ACTION_TYPES.PRODUCT_TRADING_LIST_BY_PROGRESS_GET): {
      const res = parserGetProductTradingsForCard(action.payload);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        productTradingsByProgress: res.productTradingsByProgress
      };
    }

    case SUCCESS(ACTION_TYPES.SALE_LIST_INITIALIZE_LIST_INFO): {
      const res = parseInitializeListInfo(action.payload.data);
      return {
        ...state,
        initializeListInfo: res.initializeListInfo,
        fields: res.fields
      };
    }

    case SUCCESS(ACTION_TYPES.PRODUCT_TRADINGS_PROGRESS_GET): {
      const res = parserGetProgresses(action.payload);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        progresses: res.progresses
      };
    }

    case SUCCESS(ACTION_TYPES.PRODUCT_LIST_CUSTOM_FIELD_INFO_GET_LIST): {
      const res = parseCustomFieldsInfoResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        customFieldInfos: res.fieldInfos
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_TRADING_LIST_PRODUCTS_GET): {
      const res = parseListProductResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        productTradings: res.productTradingsInfo,
        errorMessage: res.errorMsg,
        errorCodeList: res.errorCodeList,
        typeMsgEmpty: initialState.typeMsgEmpty
      };
    }

    case SUCCESS(ACTION_TYPES.PRODUCT_TRADING_UPDATE): {
      const res = parseUpdateProgressTradingResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        updateProductTradings: res.updateProductTradings,
        errorMessage: res.errorMsg,
        errorCodeList: res.errorCodeList,
        msgSuccess: SHOW_MESSAGE_SUCCESS.UPDATE,
        timeAddToList: tmpTime,
        errorItems: []
      };
    }
    case SUCCESS(ACTION_TYPES.SALE_LIST_DRAG_DROP_PRODUCT_TRADING): {
      return {
        ...state,
        action: SalesAction.Success,
        timeAddToList: tmpTime,
        msgSuccess: SHOW_MESSAGE_SUCCESS.DRAG_TO_LIST,
        numberOfItem: action.payload.data.newIds.length
      };
    }

    case ACTION_TYPES.PRODUCT_TRADINGS_LIST_CHANGE_TO_DISPLAY:
      return {
        ...state,
        action: SalesAction.None,
        errorCodeList: [],
        errorMessage: null,
        screenMode: ScreenMode.DISPLAY
      };

    case ACTION_TYPES.PRODUCT_TRADINGS_LIST_CHANGE_TO_EDIT:
      return {
        ...state,
        screenMode: ScreenMode.EDIT
      };

    case ACTION_TYPES.PRODUCT_TRADING_LIST_RESET:
      return {
        ...initialState
      };
    case ACTION_TYPES.PRODUCT_TRADING_LIST_RESET_ERROR_ITEMS:
      return {
        ...state,
        errorItems: null
      };
    case ACTION_TYPES.SALE_LIST_RESET_LIST:
      return {
        ...state,
        productTradings: initialState.productTradings
      };

    case ACTION_TYPES.SALES_LIST_RESET_MSG_SUCCESS:
      return {
        ...state,
        msgSuccess: SHOW_MESSAGE_SUCCESS.NONE
      };

    default:
      return watchActionUpdate(state, action);
  }
};

// API base URL
const salesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH;
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

const makeConditionSearchDefault = (
  offset,
  limit,
  isFirstLoad,
  selectedTargetType,
  selectedTargetId,
  searchConditions,
  orders
) => {
  return {
    isOnlyData: false,
    searchLocal: null,
    searchConditions,
    filterConditions: [],
    orders,
    offset,
    limit,
    isFirstLoad,
    selectedTargetType,
    selectedTargetId
  };
};

const makeConditionSearchDefault2 = (offset, limit) => {
  return {
    searchConditions: [],
    filterConditions: [],
    searchLocal: null,
    selectedTargetType: 0,
    selectedTargetId: 0,
    isOnlyData: false,
    orders: [],
    offset,
    limit
  };
};

/**
 * Get custom fields info
 *
 * @param
 */
export const getCustomFieldsInfo = () => ({
  type: ACTION_TYPES.PRODUCT_LIST_CUSTOM_FIELD_INFO_GET_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}/get-custom-fields-info`,
    {
      fieldBelong: FIELD_BELONG.PRODUCT_TRADING
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const updateFieldInfoProgressPersonal = params => {
  const fieldInfoProgresses = params;
  return {
    type: ACTION_TYPES.PRODUCT_TRADING_UPDATE_FIELD_INFO_PROGRESS,
    payload: axios.post(
      `${salesApiUrl}${API_URL.UPDATE_FIELD_INFO_PROGRESS_PERSONAL}`,
      { fieldInfoProgresses },
      { headers: { 'Content-Type': 'application/json' } }
    )
  };
};

export const getFieldInfoProgressPersonal = () => {
  return {
    type: ACTION_TYPES.PRODUCT_TRADINGS_FIELD_INFO_PROGRESS,
    payload: axios.post(
      `${salesApiUrl}${API_URL.GET_FIELD_INFO_PROGRESS_PERSONAL}`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    )
  };
};

export const getProgresses = () => {
  return {
    type: ACTION_TYPES.PRODUCT_TRADINGS_PROGRESS_GET,
    payload: axios.post(
      `${salesApiUrl}${API_URL.GET_PRODUCT_PROGRESS}`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    )
  };
};

export const getProductTradingsByProgress = params => {
  return {
    type: ACTION_TYPES.PRODUCT_TRADING_LIST_BY_PROGRESS_GET,
    payload: axios.post(`${salesApiUrl}${API_URL.GET_PRODUCT_TRADING_BY_PROGRESS}`, params, {
      headers: { 'Content-Type': 'application/json' }
    })
  };
};

export const getProductTradingsByProgressScroll = params => {
  return {
    type: ACTION_TYPES.PRODUCT_TRADING_LIST_BY_PROGRESS_GET_SCROLL,
    payload: axios.post(`${salesApiUrl}${API_URL.GET_PRODUCT_TRADING_BY_PROGRESS}`, params, {
      headers: { 'Content-Type': 'application/json' }
    })
  };
};

const buildFormData = (params, fileUploads) => {
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
  data.append('data', JSON.stringify(params['productTradings']));
  return data;
};

/**
 * get ProductTradings
 *
 * @param key
 */
const getProductTradings = params => {
  return {
    type: ACTION_TYPES.PRODUCT_TRADING_LIST_PRODUCTS_GET,
    payload: axios.post(`${salesApiUrl}${API_URL.GET_PRODUCT_TRADING}`, params, {
      headers: { 'Content-Type': 'application/json' }
    })
  };
};

export const updateProductsTradings = (params, fileUploads?: any[]) => ({
  type: ACTION_TYPES.PRODUCT_TRADING_UPDATE,
  payload: axios.post(
    `${salesApiUrl}/update-product-tradings`,
    buildFormData({ productTradings: params }, fileUploads),
    // {
    //   productTradings: params
    // },
    { headers: { ['Content-Type']: 'application/json' } }
  )
  // payload : null
});

// Handle
export const dragDropProductTrading = body => ({
  type: ACTION_TYPES.SALE_LIST_DRAG_DROP_PRODUCT_TRADING,
  payload: axios.post(`${salesApiUrl}${API_URL.DRAG_DROP_PRODUCT_TRADING}`, body, {
    headers: { 'Content-Type': 'application/json' }
  })
});

export const handleDragDropProductTrading = body => async (dispatch, getState) => {
  await dispatch(dragDropProductTrading(body));
};

export const handleInitProductTradingList = (
  offset,
  limit,
  selectedTargetType,
  selectedTargetId,
  searchConditions,
  orders,
  settingDate
) => async (dispatch, getState) => {
  initialState.typeMsgEmpty = TYPE_MSG_EMPTY.NONE;
  await dispatch(
    getProductTradings({
      ...makeConditionSearchDefault(
        offset,
        limit,
        true,
        selectedTargetType,
        selectedTargetId,
        searchConditions,
        orders
      ),
      settingDate
    })
  );
};

export const getInitializeListInfo = fieldBelong => ({
  type: ACTION_TYPES.SALE_LIST_INITIALIZE_LIST_INFO,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'commons/api/get-initialize-list-info'}`,
    { fieldBelong },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetInitializeListInfo = fieldBelong => async (dispatch, getState) => {
  await dispatch(getInitializeListInfo(fieldBelong));
};

export const handleInitProductTradingListByProgress = (
  offset,
  limit,
  isFirstLoad,
  selectedTargetType,
  selectedTargetId,
  searchConditions,
  orderBy,
  settingDate
) => async dispatch => {
  try {
    await dispatch(
      getProductTradingsByProgress({
        ...makeConditionSearchDefault(
          offset,
          limit,
          isFirstLoad,
          selectedTargetType,
          selectedTargetId,
          searchConditions,
          orderBy
        ),
        productTradingProgressIds: [],
        settingDate
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateProductTrading = (
  saveEditValues: any,
  fieldInfos: any,
  productTradingList: any,
  saveProductChangeProgress: any,
  fileUploads?: any[]
) => async (dispatch, getState) => {
  let nextData = mapFieldAndMergeToProductTradingList({
    saveEditValues,
    fieldInfos,
    productTradingList,
    saveProductChangeProgress
  });
  nextData = correctParamsToUpdateProductTrading(nextData);
  await dispatch(updateProductsTradings(nextData, fileUploads));
};

export const handleUpdateProductTradingByProgress = (params, filters) => async dispatch => {
  const {
    offset,
    limit,
    menuType,
    selectedTargetId,
    searchCondition,
    orderBy,
    settingDate
  } = filters;
  await dispatch(updateProductsTradings(params));
  await dispatch(
    getProductTradingsByProgress({
      ...makeConditionSearchDefault(
        offset,
        limit,
        true,
        menuType,
        selectedTargetId,
        searchCondition,
        orderBy
      ),
      selectedTargetType: 0,
      productTradingProgressIds: [],
      settingDate
    })
  );
};

export const handleFilterProductTradingsByMenu = (
  offset,
  limit,
  conditions?,
  selectedTargetType?: number,
  selectedTargetId?: number,
  isOnlyData?: boolean,
  filterConditions?,
  orders?,
  settingDate?
) => async (dispatch, getState) => {
  initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  const condition = makeConditionSearchDefault2(offset, limit);
  // condition.filterType = filterGroup;
  if (conditions) {
    const searchConditions = [];
    for (let i = 0; i < conditions.length; i++) {
      if (!conditions[i].fieldValue || !_.isNil(conditions[i].fieldRelation)) {
        continue;
      }
      const isArray = Array.isArray(conditions[i].fieldValue);
      if (isArray) {
        if (conditions[i].fieldValue.length <= 0) {
          continue;
        }
        if (conditions[i].statusChoose !== null && conditions[i].statusChoose === false) {
          continue;
        }
      }
      if (conditions[i].toString().length <= 0) {
        continue;
      }
      searchConditions.push({
        fieldType: conditions[i].fieldType,
        isDefault: `${conditions[i].isDefault}`,
        fieldName: conditions[i].fieldName,
        fieldValue: isArray ? JSON.stringify(conditions[i].fieldValue) : conditions[i].fieldValue,
        searchType: conditions[i].searchType || 1,
        searchOption: conditions[i].searchOption || 1
      });
    }
    condition.searchConditions = searchConditions;
  }

  if (selectedTargetType) {
    condition.selectedTargetType = selectedTargetType;
  }
  if (selectedTargetId) {
    condition.selectedTargetId = +selectedTargetId;
  }
  if (isOnlyData) {
    condition.isOnlyData = isOnlyData;
  }

  if (filterConditions && filterConditions.length > 0) {
    condition.filterConditions = filterConditions;
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }
  if (orders && orders.length > 0) {
    condition.orders = orders;
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }
  await dispatch(getProductTradings({ ...condition, settingDate }));
};

/** update -> refresh list */
export const handleUpdateFieldInfoProgressPersonal: any = params => async dispatch => {
  await dispatch(updateFieldInfoProgressPersonal(params));
  await dispatch(getFieldInfoProgressPersonal());
  return Promise.resolve();
};

export const handleSearchProductTrading = (
  offset: number,
  limit: number,
  isFirstLoad: boolean,
  selectedTargetType: number,
  selectedTargetId: number,
  searchLocal?: string,
  conditions?: string | any[],
  filterConditions?: any[],
  orderBy?: any[],
  settingDate?: any
) => async (dispatch, getState) => {
  initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
  const condition = makeConditionSearchDefault(
    offset,
    limit,
    isFirstLoad,
    selectedTargetType,
    selectedTargetId,
    [],
    []
  );
  // fix bug #16091
  if (searchLocal) condition.searchLocal = searchLocal;
  const params = _.cloneDeep(conditions);
  condition.isOnlyData = false;
  if (!params || params.length <= 0) {
    // await dispatch(getEmployees(condition));
  } else if (params.constructor === 'test'.constructor) {
    // condition.localSearchKeyword = params; // `"${params.toString().replace(/"(\w+)"\s*:/g, '$1:')}"`;
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
  } else if ((params.constructor === [].constructor) || (params && params.length>0)) {
    const searchConditions = [];
    for (let i = 0; i < params.length; i++) {
      if (!_.isNil(params[i].fieldRelation)) {
        continue;
      }
      const isArray = Array.isArray(params[i].fieldValue);
      // if (!params[i].isSearchBlank && (!params[i].fieldValue || params[i].fieldValue.length <= 0)) {
      //   continue;
      // }
      let val = null;
      if (params[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else if (isArray) {
        let jsonVal = params[i].fieldValue;
        if (
          jsonVal.length > 0 &&
          jsonVal[0] &&
          (Object.prototype.hasOwnProperty.call(jsonVal[0], 'from') ||
            Object.prototype.hasOwnProperty.call(jsonVal[0], 'to'))
        ) {
          jsonVal = jsonVal[0];
        }
        val = JSON.stringify(jsonVal);
      } else {
        val = params[i].fieldValue.toString();
      }
      searchConditions.push({
        // isNested: checkIsNested(params[i]),
        fieldType: params[i].fieldType,
        fieldId: params[i].fieldId,
        isDefault: `${params[i].isDefault}`,
        fieldName: params[i].fieldName,
        fieldValue: val,
        searchType: params[i].searchType,
        searchOption: params[i].searchOption,
        timeZoneOffset: params[i].timeZoneOffset
      });
    }
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
    condition.searchConditions = searchConditions;
  }
  if (filterConditions && filterConditions.length > 0) {
    for (let i = 0; i < filterConditions.length; i++) {
      if (
        !filterConditions[i].isSearchBlank &&
        (!filterConditions[i].fieldValue || filterConditions[i].fieldValue.length <= 0)
      ) {
        continue;
      }
      let val = filterConditions[i].fieldValue;
      let isArray = false;
      let jsonObj;
      try {
        isArray = _.isString(val) ? _.isArray((jsonObj = JSON.parse(val))) : _.isArray(val);
      } catch {
        isArray = false;
      }
      if (filterConditions[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else {
        if (isArray && jsonObj[0] && Object.prototype.hasOwnProperty.call(jsonObj[0], 'from')) {
          val = JSON.stringify(jsonObj[0]);
        } else {
          if (filterConditions[i].fieldName === 'is_admin') {
            filterConditions[i].fieldValue = JSON.parse(filterConditions[i].fieldValue);
            filterConditions[i].fieldValue.forEach((element, idx) => {
              if (element === '0') {
                filterConditions[i].fieldValue[idx] = 'false';
              } else {
                filterConditions[i].fieldValue[idx] = 'true';
              }
            });
            filterConditions[i].fieldValue = JSON.stringify(filterConditions[i].fieldValue);
          }
          val = filterConditions[i].fieldValue.toString();
        }
      }
      condition.filterConditions.push({
        // isNested: checkIsNested(filterConditions[i]),
        fieldId: filterConditions[i].fieldId,
        fieldType: filterConditions[i].fieldType,
        isDefault: `${filterConditions[i].isDefault}`,
        fieldName: filterConditions[i].fieldName,
        fieldValue: val,
        searchType: filterConditions[i].searchType,
        searchOption: filterConditions[i].searchOption,
        timeZoneOffset: filterConditions[i].timeZoneOffset
      });
    }
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }
  if (orderBy && orderBy.length > 0) {
    const fieldInfos = getState().dynamicList.data.get(SALES_LIST_ID) || {};
    orderBy.forEach((e, idx) => {
      if (fieldInfos && fieldInfos.fieldInfoPersonals) {
        const fIndex = fieldInfos.fieldInfoPersonals.findIndex(o => o.fieldName === e.key);
        if (fIndex >= 0 && !fieldInfos.fieldInfoPersonals[fIndex].isDefault) {
          orderBy[idx].key = `product_trading_data.${e.key}`;
        }
      }
    });
    condition.orders.push(...orderBy);
  }

  await dispatch(getProductTradings({ ...condition, settingDate }));
};

export const handleSearchProductTradingProgress = (
  offset: number,
  limit: number,
  isFirstLoad: boolean,
  selectedTargetType: number,
  selectedTargetId: number,
  searchLocal?: string,
  conditions?: string | any[],
  filterCondition?: any[],
  orderBy?: any[],
  settingDate?: any
) => async (dispatch, getState) => {
  const condition = makeConditionSearchDefault(
    offset,
    limit,
    isFirstLoad,
    selectedTargetType,
    selectedTargetId,
    [],
    []
  );
  // fix bug #16091
  if (searchLocal) condition.searchLocal = searchLocal;
  const params = _.cloneDeep(conditions);

  // fix bug show field info
  condition.isOnlyData = false;
  if (!params || params.length <= 0) {
    // await dispatch(getEmployees(condition));
  } else if (params.constructor === 'test'.constructor) {
    // condition.localSearchKeyword = params; // `"${params.toString().replace(/"(\w+)"\s*:/g, '$1:')}"`;
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
  } else if (params.constructor === [].constructor) {
    const searchConditions = [];
    for (let i = 0; i < params.length; i++) {
      if (!_.isNil(params[i].fieldRelation)) {
        continue;
      }
      const isArray = Array.isArray(params[i].fieldValue);
      if (!params[i].isSearchBlank && (!params[i].fieldValue || params[i].fieldValue.length <= 0)) {
        continue;
      }
      let val = null;
      if (params[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else if (isArray) {
        // spe
        // if (params[i].fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin) {
        //   params[i].fieldValue.forEach((element, idx) => {
        //     if (element === '0') {
        //       params[i].fieldValue[idx] = 'false';
        //     } else {
        //       params[i].fieldValue[idx] = 'true';
        //     }
        //   });
        // }
        let jsonVal = params[i].fieldValue;
        if (
          jsonVal.length > 0 &&
          jsonVal[0] &&
          (Object.prototype.hasOwnProperty.call(jsonVal[0], 'from') ||
            Object.prototype.hasOwnProperty.call(jsonVal[0], 'to'))
        ) {
          jsonVal = jsonVal[0];
        }
        val = JSON.stringify(jsonVal);
      } else {
        val = params[i].fieldValue.toString();
      }
      searchConditions.push({
        // isNested: checkIsNested(params[i]),
        fieldType: params[i].fieldType,
        fieldId: params[i].fieldId,
        isDefault: `${params[i].isDefault}`,
        fieldName: params[i].fieldName,
        fieldValue: val,
        searchType: params[i].searchType,
        searchOption: params[i].searchOption,
        timeZoneOffset: params[i].timeZoneOffset
      });
    }
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
    condition.searchConditions = searchConditions;
  }
  if (filterCondition && filterCondition.length > 0) {
    for (let i = 0; i < filterCondition.length; i++) {
      if (
        !filterCondition[i].isSearchBlank &&
        (!filterCondition[i].fieldValue || filterCondition[i].fieldValue.length <= 0)
      ) {
        continue;
      }
      let val = filterCondition[i].fieldValue;
      let isArray = false;
      let jsonObj;
      try {
        isArray = _.isString(val) ? _.isArray((jsonObj = JSON.parse(val))) : _.isArray(val);
      } catch {
        isArray = false;
      }
      if (filterCondition[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else {
        if (isArray && jsonObj[0] && Object.prototype.hasOwnProperty.call(jsonObj[0], 'from')) {
          val = JSON.stringify(jsonObj[0]);
        } else {
          if (filterCondition[i].fieldName === 'is_admin') {
            filterCondition[i].fieldValue = JSON.parse(filterCondition[i].fieldValue);
            filterCondition[i].fieldValue.forEach((element, idx) => {
              if (element === '0') {
                filterCondition[i].fieldValue[idx] = 'false';
              } else {
                filterCondition[i].fieldValue[idx] = 'true';
              }
            });
            filterCondition[i].fieldValue = JSON.stringify(filterCondition[i].fieldValue);
          }
          val = filterCondition[i].fieldValue.toString();
        }
      }
      condition.filterConditions.push({
        // isNested: checkIsNested(filterConditions[i]),
        fieldId: filterCondition[i].fieldId,
        fieldType: filterCondition[i].fieldType,
        isDefault: `${filterCondition[i].isDefault}`,
        fieldName: filterCondition[i].fieldName,
        fieldValue: val,
        searchType: filterCondition[i].searchType,
        searchOption: filterCondition[i].searchOption,
        timeZoneOffset: filterCondition[i].timeZoneOffset
      });
    }
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }
  if (orderBy && orderBy.length > 0) {
    const fieldInfos = getState().dynamicList.data.get(SALES_LIST_ID) || {};
    orderBy.forEach((e, id) => {
      if (fieldInfos && fieldInfos.fieldInfoPersonals) {
        const fieldIndex = fieldInfos.fieldInfoPersonals.findIndex(o => o.fieldName === e.key);
        if (fieldIndex >= 0 && !fieldInfos.fieldInfoPersonals[fieldIndex].isDefault) {
          orderBy[id].key = `product_trading_data.${e.key}`;
        }
      }
    });
    condition.orders.push(...orderBy);
  }

  await dispatch(getProductTradingsByProgress({ ...condition, settingDate }));
};

export const handleScrollEachProgress = (
  productTradingProgressId,
  offset: number,
  limit: number,
  isFirstLoad: boolean,
  selectedTargetType: number,
  selectedTargetId: number,
  searchLocal?: string,
  conditions?: string | any[],
  filterCondition?: any[],
  orderBy?: any[],
  settingDate?: any
) => async (dispatch, getState) => {
  const condition = makeConditionSearchDefault(
    offset,
    limit,
    isFirstLoad,
    selectedTargetType,
    selectedTargetId,
    [],
    []
  );
  // fix bug #16091
  if (searchLocal) condition.searchLocal = searchLocal;
  const params = _.cloneDeep(conditions);

  // fix bug show field info
  condition.isOnlyData = false;
  if (!params || params.length <= 0) {
    // await dispatch(getEmployees(condition));
  } else if (params.constructor === 'test'.constructor) {
    // condition.localSearchKeyword = params; // `"${params.toString().replace(/"(\w+)"\s*:/g, '$1:')}"`;
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
  } else if (params.constructor === [].constructor) {
    const searchConditions = [];
    for (let i = 0; i < params.length; i++) {
      if (!_.isNil(params[i].fieldRelation)) {
        continue;
      }
      const isArray = Array.isArray(params[i].fieldValue);
      if (!params[i].isSearchBlank && (!params[i].fieldValue || params[i].fieldValue.length <= 0)) {
        continue;
      }
      let val = null;
      if (params[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else if (isArray) {
        // spe
        // if (params[i].fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin) {
        //   params[i].fieldValue.forEach((element, idx) => {
        //     if (element === '0') {
        //       params[i].fieldValue[idx] = 'false';
        //     } else {
        //       params[i].fieldValue[idx] = 'true';
        //     }
        //   });
        // }
        let jsonVal = params[i].fieldValue;
        if (
          jsonVal.length > 0 &&
          jsonVal[0] &&
          (Object.prototype.hasOwnProperty.call(jsonVal[0], 'from') ||
            Object.prototype.hasOwnProperty.call(jsonVal[0], 'to'))
        ) {
          jsonVal = jsonVal[0];
        }
        val = JSON.stringify(jsonVal);
      } else {
        val = params[i].fieldValue.toString();
      }
      searchConditions.push({
        // isNested: checkIsNested(params[i]),
        fieldType: params[i].fieldType,
        fieldId: params[i].fieldId,
        isDefault: `${params[i].isDefault}`,
        fieldName: params[i].fieldName,
        fieldValue: val,
        searchType: params[i].searchType,
        searchOption: params[i].searchOption,
        timeZoneOffset: params[i].timeZoneOffset
      });
    }
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
    condition.searchConditions = searchConditions;
  }
  if (filterCondition && filterCondition.length > 0) {
    for (let i = 0; i < filterCondition.length; i++) {
      if (
        !filterCondition[i].isSearchBlank &&
        (!filterCondition[i].fieldValue || filterCondition[i].fieldValue.length <= 0)
      ) {
        continue;
      }
      let val = filterCondition[i].fieldValue;
      let isArray = false;
      let jsonObj;
      try {
        isArray = _.isString(val) ? _.isArray((jsonObj = JSON.parse(val))) : _.isArray(val);
      } catch {
        isArray = false;
      }
      if (filterCondition[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else {
        if (isArray && jsonObj[0] && Object.prototype.hasOwnProperty.call(jsonObj[0], 'from')) {
          val = JSON.stringify(jsonObj[0]);
        } else {
          if (filterCondition[i].fieldName === 'is_admin') {
            filterCondition[i].fieldValue = JSON.parse(filterCondition[i].fieldValue);
            filterCondition[i].fieldValue.forEach((elementInFilterCondition, idx) => {
              if (elementInFilterCondition === '0') {
                filterCondition[i].fieldValue[idx] = 'false';
              } else {
                filterCondition[i].fieldValue[idx] = 'true';
              }
            });
            filterCondition[i].fieldValue = JSON.stringify(filterCondition[i].fieldValue);
          }
          val = filterCondition[i].fieldValue.toString();
        }
      }
      condition.filterConditions.push({
        // isNested: checkIsNested(filterConditions[i]),
        fieldId: filterCondition[i].fieldId,
        fieldType: filterCondition[i].fieldType,
        isDefault: `${filterCondition[i].isDefault}`,
        fieldName: filterCondition[i].fieldName,
        fieldValue: val,
        searchType: filterCondition[i].searchType,
        searchOption: filterCondition[i].searchOption,
        timeZoneOffset: filterCondition[i].timeZoneOffset
      });
    }
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
  }
  if (orderBy && orderBy.length > 0) {
    const fieldInfos = getState().dynamicList.data.get(SALES_LIST_ID) || {};
    orderBy.forEach((e, idx) => {
      if (fieldInfos && fieldInfos.fieldInfoPersonals) {
        const fieldIndex = fieldInfos.fieldInfoPersonals.findIndex(o => o.fieldName === e.key);
        if (fieldIndex >= 0 && !fieldInfos.fieldInfoPersonals[fieldIndex].isDefault) {
          orderBy[idx].key = `product_trading_data.${e.key}`;
        }
      }
    });
    condition.orders.push(...orderBy);
  }

  await dispatch(
    getProductTradingsByProgressScroll({
      ...condition,
      settingDate,
      progressId: productTradingProgressId
    })
  );
};

// use for leaving group
export const removeProductTradingFromList = (idOfList, listOfProductTradingId) => ({
  type: ACTION_TYPES.REMOVE_PRODUCT_TRADINGS_FROM_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}/remove-product-tradings-from-list`,
    {
      listOfProductTradingId,
      idOfList
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const updateProductTradingByFieldName = bodyRequest => ({
  type: ACTION_TYPES.UPDATE_PRODUCT_TRADING_BY_FIELD_NAME,
  payload: axios.post(
    `${salesApiUrl}${API_URL.UPDATE_PRODUCT_TRADING_BY_FIELD_NAME}`,
    bodyRequest,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleUpdateProductTradingDragDrop: any = (body, filters, view) => async dispatch => {
  const {
    offset,
    limit,
    isFirstLoad,
    selectedTargetType,
    selectedTargetId,
    searchConditions,
    orderBy,
    settingDate
  } = filters;

  await dispatch(updateProductTradingByFieldName(body));
  if (parseInt(view, 0) === 1) {
    await dispatch(
      getProductTradings(
        makeConditionSearchDefault(
          offset,
          limit,
          true,
          selectedTargetType,
          selectedTargetId,
          searchConditions,
          orderDefault
        )
      )
    );
  } else {
    await dispatch(
      getProductTradingsByProgress({
        ...makeConditionSearchDefault(
          offset,
          limit,
          isFirstLoad,
          selectedTargetType,
          selectedTargetId,
          searchConditions,
          orderBy
        ),
        productTradingProgressIds: [],
        selectedTargetType: 0,
        settingDate
      })
    );
  }

  return Promise.resolve();
};

export const handleRemoveProductTradingFromList: any = (idOfList, listOfProductTradingId) => async (
  dispatch,
  getState
) => {
  await dispatch(removeProductTradingFromList(idOfList, listOfProductTradingId));
  return Promise.resolve();
};

export const deleteProductTradings = param => ({
  type: ACTION_TYPES.DELETE_PRODUCT_TRADINGS,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}/delete-product-tradings`,
    param,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleDeleteProductTradings: any = productTradingIds => async (dispatch, getState) => {
  const param = { productTradingIds };
  await dispatch(deleteProductTradings(param));

  return Promise.resolve();
};
/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.PRODUCT_TRADING_LIST_RESET
});

export const resetErrorItems = () => ({
  type: ACTION_TYPES.PRODUCT_TRADING_LIST_RESET_ERROR_ITEMS
});

export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit
    ? ACTION_TYPES.PRODUCT_TRADINGS_LIST_CHANGE_TO_EDIT
    : ACTION_TYPES.PRODUCT_TRADINGS_LIST_CHANGE_TO_DISPLAY
});
/**
 * reset state
 */
export const resetMessageSuccess = () => ({
  type: ACTION_TYPES.SALES_LIST_RESET_MSG_SUCCESS
});

/**
 * reset state
 */
export const resetList = () => ({
  type: ACTION_TYPES.SALE_LIST_RESET_LIST
});

// temp
export interface DataResponseOverflowMenu {
  employee: any;
  email: string;
}
