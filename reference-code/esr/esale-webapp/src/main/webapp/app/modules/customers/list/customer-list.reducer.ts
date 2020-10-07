import axios from 'axios';
import { API_CONTEXT_PATH, ScreenMode, API_CONFIG, TYPE_MSG_EMPTY } from 'app/config/constants';
import {
  CUSTOMER_DEF,
  CUSTOMER_LIST_ID,
  SHOW_MESSAGE_SUCCESS,
  CUSTOMER_SPECIAL_LIST_FIELD
} from 'app/modules/customers/constants';
import { REQUEST, FAILURE, SUCCESS } from 'app/shared/reducers/action-type.util';
import StringUtils, { parseErrorRespose } from 'app/shared/util/string-utils';
import { getValueProp } from 'app/shared/util/entity-utils';
import { isNullOrUndefined } from 'util';
import _ from 'lodash';
import * as R from 'ramda';

/**
 * Enum action Customer
 */
export enum CustomerAction {
  None,
  Request,
  Error,
  Success
}

/**
 * Action type when call API
 */
export const ACTION_TYPES = {
  CUSTOMER_LIST_CUSTOMERS_GET: 'customerList/CUSTOMERS_GET',
  CUSTOMER_LIST_CUSTOM_FIELD_INFO_GET_LIST: 'customerList/CUSTOM_FIELD_INFO_GET_LIST',
  CUSTOMER_LIST_RESET: 'customerList/RESET',
  CUSTOMER_LIST_CHANGE_TO_EDIT: 'customer/EDIT',
  CUSTOMER_LIST_CHANGE_TO_DISPLAY: 'customerList/DISPLAY',
  CUSTOMER_LIST_SHOW_MAP: 'customerList/SHOW_MAP',
  CUSTOMER_REMOVE_FAVOURITE_LIST: 'customerList/REMOVE_CUSTOMER',
  CUSTOMER_DELETE_LIST: 'customerList/DELETE_LIST',
  CUSTOMER_DOWNLOAD_CUSTOMER: 'customerList/DOWNLOAD_CUSTOMER',
  CUSTOMER_DELETE_OUT_OF_LIST: 'customerList/DELETE_OUT_OF_LIST',
  CUSTOMER_ADD_CUSTOMER_TO_FAVOURITE_LIST: 'customerList/ADD_CUSTOMER_TO_FAVOURITE_LIST',
  CUSTOMER_MOVE_CUSTOMERS_TO_OTHER_LIST: 'customerList/MOVE_CUSTOMERS_TO_OTHER_LIST',
  CUSTOMER_COUNT_RELATION_CUSTOMER: 'customerList/COUNT_RELATION_CUSTOMER',
  CUSTOMER_DELETE_CUSTOMERS: 'customerList/DELETE_CUSTOMERS',
  CUSTOMER_UPDATE_CUSTOMERS: 'customerList/UPDATE_CUSTOMERS',
  CUSTOMER_GET_LAYOUT: 'customerList/GET_LAYOUT',
  CUSTOMER_LIST_RESET_MSG_SUCCESS: 'customerList/RESET_MSG_SUCCESS',
  CUSTOMER_LIST_RESET_LIST: 'customerList/RESET_LIST',
  CUSTOMER_ADD_CUSTOMER_TO_LIST: 'customerList/ADD_CUSTOMER_TO_LIST',
  CUSTOMER_LIST_GET_LIST_INFO_SEARCH_CONDITION: 'customerList/GET_LIST_SEARCH_CONDITION_INFO',
  CUSTOMER_GET_HISTORY_ACTIVITIES: 'customerList/CUSTOMER_GET_HISTORY.ACTIVITIES'
};

// API base URL
const customersApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH;
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
const activitiesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.ACTIVITY_SERVICE_PATH;
/**
 * State default
 */
const initialState = {
  action: CustomerAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: null,
  responseStatus: null,
  customFieldInfos: null,
  errorMessageChangeStatusSuccess: null,
  fieldInfos: null,
  customerset: null,
  customers: null,
  customersCheckList: null,
  isShowMap: false,
  countRelationCustomer: null,
  customersDownload: null,
  downloadCustomersMsg: null,
  moveToCustomertMsg: null,
  moveToCustomerId: null,
  addFavouriteCustomerId: null,
  addFavouriteMsg: null,
  removeFavouriteCustomerId: null,
  removeFavouriteMsg: null,
  errorCountRelation: null,
  customerIdsDeleteSuccess: null,
  customerDeleteFails: null,
  customerListIdDelete: null,
  deleteCustomerId: null,
  relationCustomerData: null,
  customerLayout: null,
  updateCustomerList: null,
  addCustomerToList: null,
  msgSuccess: null,
  typeMsgEmpty: TYPE_MSG_EMPTY.NONE,
  infoSearchConditionList: null,
  msgSuccesUpdateCustomers: null,
  customersMsgGetSuccess: null,
  historyActivities: null,
  msgRemoveFavouriteList: null,
  customerDeleteOutOfList: null
};

/**
 * Parse data to display screen from API getCustomers
 * @param res
 */
const parseListCustomerResponse = res => {
  let customers = null;
  customers = res;
  customers.customers.forEach((element, idx) => {
    const newElement = {};
    const customerData = element.customerData;
    for (const prop in element) {
      if (Object.prototype.hasOwnProperty.call(element, prop) && prop !== 'customerData') {
        newElement[StringUtils.camelCaseToSnakeCase(prop)] = element[prop];
      }
    }
    customerData.forEach(field => {
      newElement[field.key] = field.value;
    });
    customers.customers[idx] = newElement;
  });
  customers.customers.forEach((element, idx) => {
    const newElementData = {};
    newElementData[StringUtils.camelCaseToSnakeCase('groupId')] =
      element['person_in_charge'].groupId;
    newElementData[StringUtils.camelCaseToSnakeCase('employeeId')] =
      element['person_in_charge'].employeeId;
    newElementData[StringUtils.camelCaseToSnakeCase('departmentId')] =
      element['person_in_charge'].departmentId;
    element['person_in_charge'] = [newElementData];
  });

  return { customers };
};

/**
 * Parse data to display screen from API getCustomFieldInfo
 * @param res
 * @param type
 */
const parseCustomFieldsInfoResponse = (res, type) => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? CustomerAction.Error : CustomerAction.Success;
  const fieldInfos = res.data;
  if (fieldInfos.customFieldsInfo) {
    fieldInfos.customFieldsInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { errorMsg, action, fieldInfos };
};

// use for deleting an customer
const parseDeleteCustomer = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const action = errorMsg.length > 0 ? CustomerAction.Error : CustomerAction.Success;
  const deleteCustomer = res.data.deleteCustomerOutOfList;
  return { errorMsg, action, deleteCustomer };
};

// use for downloading customer' info
const parseCustomersResError = res => {
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
  const action = errorMsg.length > 0 ? CustomerAction.Error : CustomerAction.Success;
  const customersInfo = res.data;
  return { errorMsg, errorCodeList, action, customersInfo };
};

const parseDeleteCustomers = res => {
  const customerIdsDeleteSuccess = res && res.customerIdsDeleteSuccess;
  const customerDeleteFails = res && res.customerDeleteFails;
  const successId = customerDeleteFails && customerDeleteFails.length === 0;
  return { customerIdsDeleteSuccess, successId, customerDeleteFails };
};

const parseRemoveFavouriteListResponse = res => {
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
  const action = errorMsg.length > 0 ? CustomerAction.Error : CustomerAction.Success;
  const favouriteListIdRemove = res.data;
  return { errorMsg, errorCodeList, action, favouriteListIdRemove };
};

const parseAddCustomerToFavouriteListResponse = res => {
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
  const action = errorMsg.length > 0 ? CustomerAction.Error : CustomerAction.Success;
  const addCustomerToFavouriteList = res.data.addToListFavourite;
  return { errorMsg, errorCodeList, action, addCustomerToFavouriteList };
};

const parseMoveCustomersToOtherListResponse = res => {
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
  const action = errorMsg.length > 0 ? CustomerAction.Error : CustomerAction.Success;
  const customersMoveToOtherListId = res.data;
  return { errorMsg, errorCodeList, action, customersMoveToOtherListId };
};

const paserUpdateCustomers = res => {
  const action = CustomerAction.Success;
  const updateCustomerList = res;
  return { action, updateCustomerList };
};

const getDataSuccess = (state, action) => {
  switch (action.type) {
    // api get
    case SUCCESS(ACTION_TYPES.CUSTOMER_GET_LAYOUT): {
      const res = action.payload.data;
      return {
        ...state,
        customerLayout: res.fields
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_LIST_CUSTOMERS_GET): {
      const res = parseListCustomerResponse(action.payload.data);
      return {
        ...state,
        customers: Object.assign(res.customers, { typeMsgEmpty: initialState.typeMsgEmpty }),
        customersMsgGetSuccess: { successId: 'Get Success' }
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_COUNT_RELATION_CUSTOMER): {
      const res = action.payload.data;
      return {
        ...state,
        action: CustomerAction.Success,
        errorCountRelation: _.isNil(res && res.listCount) || res.listCount.length === 0,
        relationCustomerData: res && res.listCount
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_DOWNLOAD_CUSTOMER): {
      return {
        ...state,
        customersDownload: action.payload.data,
        downloadCustomersMsg: null
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_LIST_CUSTOM_FIELD_INFO_GET_LIST): {
      const res = parseCustomFieldsInfoResponse(action.payload, CUSTOMER_DEF.EXTENSION_BELONG_LIST);
      return {
        ...state,
        action: res.action,
        errorMessage: res.errorMsg,
        customFieldInfos: res.fieldInfos
      };
    }
    // api update
    case SUCCESS(ACTION_TYPES.CUSTOMER_UPDATE_CUSTOMERS): {
      const res = paserUpdateCustomers(action.payload.data);
      return {
        ...state,
        action: res.action,
        updateCustomerList: res.updateCustomerList,
        // msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE },
        msgSuccesUpdateCustomers: { successId: SHOW_MESSAGE_SUCCESS.UPDATE },
        screenMode: ScreenMode.DISPLAY
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_ADD_CUSTOMER_TO_LIST): {
      const res = action.payload.data;
      return {
        ...state,
        action: CustomerAction.Success,
        addCustomerToList: res.customerListMemberIds,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE }
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_ADD_CUSTOMER_TO_FAVOURITE_LIST): {
      return {
        ...state,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.CREATE }
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_MOVE_CUSTOMERS_TO_OTHER_LIST): {
      const res = parseMoveCustomersToOtherListResponse(action.payload.data);
      return {
        ...state,
        action: res.action,
        moveToCustomerId: action.payload.data && action.payload.data.customerListMemberIds,
        errorMessage: res.errorMsg,
        moveToCustomertMsg: res.errorCodeList,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE }
      };
    }
    // api delete
    case SUCCESS(ACTION_TYPES.CUSTOMER_DELETE_OUT_OF_LIST): {
      return {
        ...state,
        action: CustomerAction.Success,
        customerDeleteOutOfList: action.payload.data,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.DELETE }
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_DELETE_LIST): {
      return {
        ...state,
        action: CustomerAction.Success,
        customerListIdDelete: action.payload.data,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.DELETE }
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_DELETE_CUSTOMERS): {
      const res = parseDeleteCustomers(action.payload.data);
      return {
        ...state,
        action: CustomerAction.Success,
        customerIdsDeleteSuccess: res.customerIdsDeleteSuccess,
        customerDeleteFails: res.customerDeleteFails,
        msgSuccess: res.successId ? { successId: SHOW_MESSAGE_SUCCESS.DELETE } : null
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_REMOVE_FAVOURITE_LIST): {
      return {
        ...state,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.DELETE },
        msgRemoveFavouriteList: { successId: SHOW_MESSAGE_SUCCESS.DELETE },
        removeFavouriteCustomerId: action.payload.data
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_LIST_GET_LIST_INFO_SEARCH_CONDITION): {
      return {
        ...state,
        action: CustomerAction.Success,
        infoSearchConditionList: action.payload.data.customerListSearchConditionInfos
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_GET_HISTORY_ACTIVITIES): {
      const res = action.payload.data;
      return {
        ...state,
        historyActivities: res.activities !== null && res.activities.length > 0
      };
    }
    default:
      return state;
  }
};

/**
 * ListState Customers
 */
export type CustomerListState = Readonly<typeof initialState>;

export default (state: CustomerListState = initialState, action): CustomerListState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.CUSTOMER_LIST_CUSTOMERS_GET):
    case REQUEST(ACTION_TYPES.CUSTOMER_LIST_CUSTOM_FIELD_INFO_GET_LIST):
    case REQUEST(ACTION_TYPES.CUSTOMER_REMOVE_FAVOURITE_LIST):
    case REQUEST(ACTION_TYPES.CUSTOMER_DELETE_LIST):
    case REQUEST(ACTION_TYPES.CUSTOMER_DOWNLOAD_CUSTOMER):
    case REQUEST(ACTION_TYPES.CUSTOMER_DELETE_OUT_OF_LIST):
    case REQUEST(ACTION_TYPES.CUSTOMER_ADD_CUSTOMER_TO_FAVOURITE_LIST):
    case REQUEST(ACTION_TYPES.CUSTOMER_MOVE_CUSTOMERS_TO_OTHER_LIST):
    case REQUEST(ACTION_TYPES.CUSTOMER_DELETE_CUSTOMERS):
    case REQUEST(ACTION_TYPES.CUSTOMER_COUNT_RELATION_CUSTOMER):
    case REQUEST(ACTION_TYPES.CUSTOMER_UPDATE_CUSTOMERS):
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_LAYOUT):
    case REQUEST(ACTION_TYPES.CUSTOMER_ADD_CUSTOMER_TO_LIST):
    case REQUEST(ACTION_TYPES.CUSTOMER_LIST_GET_LIST_INFO_SEARCH_CONDITION):
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_HISTORY_ACTIVITIES):
      return {
        ...state,
        action: CustomerAction.Request,
        errorItems: null,
        historyActivities: null
      };
    case FAILURE(ACTION_TYPES.CUSTOMER_LIST_CUSTOMERS_GET):
    case FAILURE(ACTION_TYPES.CUSTOMER_LIST_CUSTOM_FIELD_INFO_GET_LIST):
    case FAILURE(ACTION_TYPES.CUSTOMER_REMOVE_FAVOURITE_LIST):
    case FAILURE(ACTION_TYPES.CUSTOMER_DELETE_LIST):
    case FAILURE(ACTION_TYPES.CUSTOMER_DOWNLOAD_CUSTOMER):
    case FAILURE(ACTION_TYPES.CUSTOMER_DELETE_OUT_OF_LIST):
    case FAILURE(ACTION_TYPES.CUSTOMER_ADD_CUSTOMER_TO_FAVOURITE_LIST):
    case FAILURE(ACTION_TYPES.CUSTOMER_MOVE_CUSTOMERS_TO_OTHER_LIST):
    case FAILURE(ACTION_TYPES.CUSTOMER_DELETE_CUSTOMERS):
    case FAILURE(ACTION_TYPES.CUSTOMER_COUNT_RELATION_CUSTOMER):
    case FAILURE(ACTION_TYPES.CUSTOMER_UPDATE_CUSTOMERS):
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_LAYOUT):
    case FAILURE(ACTION_TYPES.CUSTOMER_ADD_CUSTOMER_TO_LIST):
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_HISTORY_ACTIVITIES): {
      return {
        ...state,
        action: CustomerAction.Error,
        errorMessage: action.payload.message,
        errorItems: parseErrorRespose(action.payload),
        responseStatus: action.payload.response.status
      };
    }

    case ACTION_TYPES.CUSTOMER_LIST_RESET_MSG_SUCCESS:
      return {
        ...state,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.NONE }
      };

    case ACTION_TYPES.CUSTOMER_LIST_CUSTOMERS_GET: {
      return {
        ...state,
        customers: action.payload.customers
      };
    }

    case ACTION_TYPES.CUSTOMER_LIST_CHANGE_TO_DISPLAY:
      return {
        ...state,
        action: CustomerAction.None,
        errorItems: [],
        errorMessage: null,
        responseStatus: null,
        screenMode: ScreenMode.DISPLAY
      };
    case ACTION_TYPES.CUSTOMER_LIST_CHANGE_TO_EDIT:
      return {
        ...state,
        screenMode: ScreenMode.EDIT
      };
    // Dummy data for countRelationCustomers
    case ACTION_TYPES.CUSTOMER_COUNT_RELATION_CUSTOMER: {
      const res = action.payload;
      return {
        ...state,
        countRelationCustomer: res.data
      };
    }
    case ACTION_TYPES.CUSTOMER_LIST_RESET_LIST:
      return {
        ...state,
        customers: initialState.customers
      };

    case REQUEST(ACTION_TYPES.CUSTOMER_LIST_SHOW_MAP):
      return {
        ...state,
        isShowMap: action
      };

    case ACTION_TYPES.CUSTOMER_LIST_RESET:
      return {
        ...initialState
      };
    default:
      return getDataSuccess(state, action);
  }
};

/**
 * Make Param search to get list customer
 * @param offset
 * @param limit
 * @param searchConditions
 * @param localSearchKeyword
 * @param selectedTargetType
 * @param selectedTargetId
 * @param isUpdateListView
 * @param filterConditions
 * @param orderBy
 */
const makeConditionSearchDefault = (
  offset: number,
  limit: number,
  searchConditions?: any[],
  localSearchKeyword?: string,
  selectedTargetType?: number,
  selectedTargetId?: number,
  isUpdateListView?: boolean,
  filterConditions?: any[],
  orderBy?: any[]
) => {
  return {
    offset,
    limit,
    searchConditions: searchConditions ? searchConditions : [],
    localSearchKeyword: localSearchKeyword ? localSearchKeyword : '',
    selectedTargetType: selectedTargetType ? selectedTargetType : 0,
    selectedTargetId: selectedTargetId ? selectedTargetId : 0,
    isUpdateListView: isUpdateListView ? isUpdateListView : false,
    filterConditions: filterConditions ? filterConditions : [],
    orderBy: orderBy ? orderBy : []
  };
};

/**
 * Get custom history activitis
 */

export const getCustomerHistoryAcivities = param => ({
  type: ACTION_TYPES.CUSTOMER_GET_HISTORY_ACTIVITIES,
  payload: axios.post(
    `${activitiesApiUrl}/get-activities`,
    {
      listCustomerId: [param.customerId],
      filterConditions: [],
      hasTimeline: true,
      isFirstLoad: null,
      limit: 30,
      listBusinessCardId: [],
      listProductTradingId: [],
      offset: 0,
      orderBy: [],
      searchConditions: [],
      searchLocal: '',
      selectedTargetId: 0,
      selectedTargetType: 0
    },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleGetCustomerHistoryAcivities = param => async dispatch => {
  await dispatch(getCustomerHistoryAcivities(param));
};

export const getCustomFieldsInfo = () => ({
  type: ACTION_TYPES.CUSTOMER_LIST_CUSTOM_FIELD_INFO_GET_LIST,
  payload: axios.post(`${commonsApiUrl}/get-custom-fields-info`, CUSTOMER_DEF.FIELD_BELONG, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const handleGetCustomFieldInfo = () => async dispatch => {
  await dispatch(getCustomFieldsInfo());
};

/**
 * Get Customers
 * @param key
 */
export const getCustomers = params => ({
  type: ACTION_TYPES.CUSTOMER_LIST_CUSTOMERS_GET,
  // payload: DUMMY_CUSTOMERS
  payload: axios.post(
    `${customersApiUrl}/get-customers`,
    {
      searchConditions: params.searchConditions,
      filterConditions: params.filterConditions,
      localSearchKeyword: params.localSearchKeyword,
      selectedTargetType: params.selectedTargetType,
      selectedTargetId: params.selectedTargetType === 1 ? 0 : params.selectedTargetId,
      isUpdateListView: params.isUpdateListView,
      orderBy: params.orderBy,
      offset: params.offset,
      limit: params.limit
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const changeShowMap = isShowMap => ({
  type: ACTION_TYPES.CUSTOMER_LIST_SHOW_MAP,
  action: isShowMap
});

/**
 * handle get list customer (map to state : call in screen)
 * @param offset
 * @param limit
 * @param searchConditions
 * @param localSearchKeyword
 * @param selectedTargetType
 * @param selectedTargetId
 * @param isUpdateListView
 * @param filterConditions
 * @param orderBy
 */

export const handleGetCustomerList = (
  offset: number,
  limit: number,
  searchConditions?: any[],
  localSearchKeyword?: string,
  selectedTargetType?: number,
  selectedTargetId?: number,
  isUpdateListView?: boolean,
  filterConditions?: any[],
  orderBy?: any[]
) => async (dispatch, getState) => {
  await dispatch(
    getCustomers(
      makeConditionSearchDefault(
        offset,
        limit,
        searchConditions,
        localSearchKeyword,
        selectedTargetType,
        selectedTargetId,
        isUpdateListView,
        filterConditions,
        orderBy
      )
    )
  );
};

/**
 * Get customer to display in screen with multi condition
 * @param offset
 * @param limit
 * @param localSearchKeyword
 * @param selectedTargetType
 * @param selectedTargetId
 * @param isUpdateListView
 * @param filterConditions
 * @param orderBy
 * @param searchConditions
 */

export const handleGetCustomersHasCondition = (
  offset,
  limit,
  localSearchKeyword?,
  selectedTargetType?,
  selectedTargetId?,
  isUpdateListView?,
  filterConditions?,
  orderBy?,
  searchConditionsData?
) => async (dispatch, getState) => {
  initialState.typeMsgEmpty = TYPE_MSG_EMPTY.NONE;
  if (localSearchKeyword) {
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
  }
  // localSearchKeyword = JSON.stringify(localSearchKeyword);
  const searchConditions = _.cloneDeep(searchConditionsData);
  const conditions = [];
  if (searchConditions && searchConditions.length > 0) {
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.SEARCH;
    for (let i = 0; i < searchConditions.length; i++) {
      if (!_.isNil(searchConditions[i].fieldRelation)) {
        continue;
      }
      const isArray = Array.isArray(searchConditions[i].fieldValue);
      if (
        !searchConditions[i].isSearchBlank &&
        (!searchConditions[i].fieldValue || searchConditions[i].fieldValue.length <= 0)
      ) {
        continue;
      }
      let val = null;
      if (searchConditions[i].isSearchBlank) {
        val = isArray ? '[]' : '';
      } else if (isArray) {
        if (searchConditions[i].fieldName === CUSTOMER_SPECIAL_LIST_FIELD.DISPLAY_CHILD_CUSTOMERS) {
          if (searchConditions[i].fieldValue[0].toString() === '1') {
            searchConditions[i].fieldValue = true;
          }
        }
        let jsonVal = searchConditions[i].fieldValue;
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
        val = searchConditions[i].fieldValue.toString();
      }
      conditions.push({
        fieldType: searchConditions[i].fieldType,
        fieldId: searchConditions[i].fieldId,
        isDefault: `${searchConditions[i].isDefault}`,
        fieldName: searchConditions[i].fieldName,
        fieldValue: val,
        searchType: searchConditions[i].searchType,
        searchOption: searchConditions[i].searchOption,
        timeZoneOffset: searchConditions[i].timeZoneOffset
      });
    }
  }
  const filterItemConditions = [];
  if (filterConditions && filterConditions.length > 0) {
    initialState.typeMsgEmpty = TYPE_MSG_EMPTY.FILTER;
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
          val = filterConditions[i].fieldValue.toString();
        }
      }
      filterItemConditions.push({
        fieldType: filterConditions[i].fieldType,
        fieldId: filterConditions[i].fieldId,
        isDefault: `${filterConditions[i].isDefault}`,
        fieldName: filterConditions[i].fieldName,
        fieldValue: val,
        searchType: filterConditions[i].searchType,
        searchOption: filterConditions[i].searchOption,
        timeZoneOffset: filterConditions[i].timeZoneOffset
      });
    }
  }
  if (orderBy && orderBy.length > 0) {
    const { fieldInfos } = getState().dynamicList.data.get(CUSTOMER_LIST_ID);
    orderBy.forEach((e, idx) => {
      if (fieldInfos && fieldInfos.fieldInfoPersonals) {
        const fIndex = fieldInfos.fieldInfoPersonals.findIndex(o => o.fieldName === e.key);
        if (fIndex >= 0 && !fieldInfos.fieldInfoPersonals[fIndex].isDefault) {
          orderBy[idx].key = `customer_data.${e.key}`;
        }
      }
    });
  }
  const condition = makeConditionSearchDefault(
    offset,
    limit,
    conditions,
    localSearchKeyword,
    selectedTargetType,
    selectedTargetId,
    isUpdateListView,
    filterItemConditions,
    orderBy
  );
  await dispatch(getCustomers(condition));
};

/**
 * Remove favourite list
 * @param listId
 */
const removeFavouriteList = listId => ({
  type: ACTION_TYPES.CUSTOMER_REMOVE_FAVOURITE_LIST,
  payload: axios.post(
    `${customersApiUrl}/remove-favourite-list`,
    {
      customerListId: listId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * delete list customer
 * @param listId
 */
const deleteList = listId => ({
  type: ACTION_TYPES.CUSTOMER_DELETE_LIST,
  payload: axios.post(
    `${customersApiUrl}/delete-list`,
    {
      customerListId: listId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Dowload info customers select
 * @param listCustomerDownload
 * @param listOderBy
 */
const downloadCustomer = (listCustomerDownload, listOderBy, selectedTargetType, selectedTargetId) => ({
  type: ACTION_TYPES.CUSTOMER_DOWNLOAD_CUSTOMER,
  payload: axios.post(
    `${customersApiUrl}/download-customers`,
    {
      customerIds: listCustomerDownload,
      orderBy: listOderBy,
      selectedTargetType, 
      selectedTargetId,
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Delete customers out of list
 * @param customerListId
 * @param customerIds
 */
const deleteCustomerOutOfList = (customerListId, customerIds) => ({
  type: ACTION_TYPES.CUSTOMER_DELETE_OUT_OF_LIST,
  payload: axios.post(
    `${customersApiUrl}/delete-customer-out-of-list`,
    {
      customerListId,
      customerIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Add customers to favorite list
 * @param listId
 */
const addCustomersToFavouriteList = listId => ({
  type: ACTION_TYPES.CUSTOMER_ADD_CUSTOMER_TO_FAVOURITE_LIST,
  payload: axios.post(
    `${customersApiUrl}/add-to-list-favourite`,
    {
      customerListId: listId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * move customer to orther list
 * @param sourceListId
 * @param destListId
 * @param customerIds
 */

const moveCustomersToOtherList = (sourceListId, destListId, customerIds) => ({
  type: ACTION_TYPES.CUSTOMER_MOVE_CUSTOMERS_TO_OTHER_LIST,
  payload: axios.post(
    `${customersApiUrl}/move-customers-to-other-list`,
    { sourceListId, destListId, customerIds },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Get info relation list customers
 * @param customerIds
 */
const countRelationCustomers = customerIds => ({
  type: ACTION_TYPES.CUSTOMER_COUNT_RELATION_CUSTOMER,
  payload: axios.post(
    `${customersApiUrl}/count-relation-customers`,
    {
      customerIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
/**
 * Build form to update Customers
 * @param params
 * @param fileUploads
 */
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
  data.append('data', JSON.stringify(params['customers']));
  return data;
};

/**
 * delete list customer
 * @param customerIds
 */
const deleteCustomers = customerIds => ({
  type: ACTION_TYPES.CUSTOMER_DELETE_CUSTOMERS,
  payload: axios.post(
    `${customersApiUrl}/delete-customers`,
    {
      customerIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const updateCustomers = (params, fileUploads) => ({
  type: ACTION_TYPES.CUSTOMER_UPDATE_CUSTOMERS,
  payload: axios.post(
    `${customersApiUrl}/update-customers`,
    buildFormData({ customers: params }, fileUploads),
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

/**
 * move customer to orther list
 * @param sourceListId
 * @param destListId
 * @param customerIds
 */
export const handleMoveCustomersToOtherList = (sourceListId, destListId, customerIds) => async (
  dispatch,
  getState
) => {
  await dispatch(moveCustomersToOtherList(sourceListId, destListId, customerIds));
};

export const handleUpdateCustomers = (listCustomers: any[], fileUploads) => async (
  dispatch,
  getState
) => {
  const { customers } = getState().customerList;
  const { fieldInfos } = getState().dynamicList.data.get(CUSTOMER_LIST_ID);
  const params = [];
  const groupCustomer = listCustomers.reduce(function(h, obj) {
    h[obj.itemId] = (h[obj.itemId] || []).concat(obj);
    return h;
  }, {});
  for (const emp in groupCustomer) {
    if (!Object.prototype.hasOwnProperty.call(groupCustomer, emp)) {
      continue;
    }
    const param = {};
    param['customerId'] = Number(emp);

    let recordIdx = -1;
    if (customers && customers.customers && customers.customers.length > 0) {
      recordIdx = customers.customers.findIndex(
        e => e['customer_id'].toString() === emp.toString()
      );
      if (recordIdx >= 0) {
        param['updatedDate'] = getValueProp(customers.customers[recordIdx], 'updatedDate');
      }
    }

    for (let i = 0; i < groupCustomer[emp].length; i++) {
      if (
        !fieldInfos ||
        !fieldInfos.fieldInfoPersonals ||
        fieldInfos.fieldInfoPersonals.length <= 0
      ) {
        continue;
      }
      const fieldIdx = fieldInfos.fieldInfoPersonals.findIndex(
        e => e.fieldId.toString() === groupCustomer[emp][i].fieldId.toString()
      );
      if (fieldIdx < 0) {
        continue;
      }

      const fieldName = fieldInfos.fieldInfoPersonals[fieldIdx].fieldName;
      const isDefault = fieldInfos.fieldInfoPersonals[fieldIdx].isDefault;
      if (isDefault) {
        if (fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_LOGO) {
          const customerLogo = JSON.stringify(groupCustomer[emp][i].itemValue);
          param['customerLogo'] = customerLogo;
        } else if (fieldName === CUSTOMER_SPECIAL_LIST_FIELD.PERSON_IN_CHARGE) {
          const customerPersonData = groupCustomer[emp][i].itemValue;
          const personInChargeData = customerPersonData[0];
          const objData = {
            employeeId: R.path(['employee_id'], personInChargeData)
              ? R.path(['employee_id'], personInChargeData)
              : 0,
            groupId: R.path(['group_id'], personInChargeData)
              ? R.path(['group_id'], personInChargeData)
              : 0,
            departmentId: R.path(['department_id'], personInChargeData)
              ? R.path(['department_id'], personInChargeData)
              : 0
          };
          param['personInCharge'] = objData;
        } else if (fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_ADDRESS) {
          const customerAddress = JSON.parse(groupCustomer[emp][i].itemValue);
          param['zipCode'] =
            customerAddress && R.path(['zip_code'], customerAddress)
              ? R.path(['zip_code'], customerAddress)
              : '';
          param['building'] =
            customerAddress && R.path(['zip_code'], customerAddress)
              ? R.path(['building_name'], customerAddress)
              : '';
          param['address'] =
            customerAddress && R.path(['zip_code'], customerAddress)
              ? R.path(['address_name'], customerAddress)
              : '';
        } else if (fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_PARENT) {
          const customerParent = getValueProp(customers.customers[recordIdx], 'customerParent');
          const valueDefault = R.path(['pathTreeId', 0], customerParent)
            ? R.path(['pathTreeId', 0], customerParent)
            : 0;
          const idValueParent = !_.isNil(groupCustomer[emp][i].itemValue)
            ? groupCustomer[emp][i].itemValue
            : valueDefault;
          param['parentId'] = idValueParent;
        } else {
          param[StringUtils.snakeCaseToCamelCase(fieldName)] = groupCustomer[emp][i].itemValue;
        }
      } else {
        if (param['customerData'] === null || param['customerData'] === undefined) {
          param['customerData'] = [];
        }
        const isArray = Array.isArray(groupCustomer[emp][i].itemValue);
        const itemValue = isArray
          ? JSON.stringify(groupCustomer[emp][i].itemValue)
          : groupCustomer[emp][i].itemValue
          ? groupCustomer[emp][i].itemValue.toString()
          : '';
        param['customerData'].push({
          fieldType: fieldInfos.fieldInfoPersonals[fieldIdx].fieldType.toString(),
          key: fieldName,
          value: itemValue
        });
      }
    }
    // fill other item not display
    if (!Object.prototype.hasOwnProperty.call(param, 'customerData')) {
      param['customerData'] = [];
    }

    params.push(param);
  }
  await dispatch(updateCustomers(params, fileUploads));
};

const getCustomerLayout = () => ({
  type: ACTION_TYPES.CUSTOMER_GET_LAYOUT,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-customer-layout`,
    null,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

const addCustomersToList = (customerListId, customerIds) => ({
  type: ACTION_TYPES.CUSTOMER_ADD_CUSTOMER_TO_LIST,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/add-customers-to-list`,
    {
      customerListId,
      customerIds
    },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

/**
 * get condtionList Search detail auto list
 */
export const getSearchConditionInfoList = listId => ({
  type: ACTION_TYPES.CUSTOMER_LIST_GET_LIST_INFO_SEARCH_CONDITION,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-list-search-condition-info`,
    { listId },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * handle get condtionList Search detail auto list
 */
export const handleGetSearchConditionInfoList = listId => async (dispatch, getState) => {
  await dispatch(getSearchConditionInfoList(listId));
};
/**
 * remove favourite list
 */
export const handleRemoveFavouriteList = listId => async (dispatch, getState) => {
  await dispatch(removeFavouriteList(listId));
};

export const handleGetCustomerLayout = () => async (dispatch, getState) => {
  await dispatch(getCustomerLayout());
};

/**
 * Delete customer select
 */
export const handleDeleteList = listId => async (dispatch, getState) => {
  await dispatch(deleteList(listId));
};

/**
 * Download info list customer
 * @param listCustomerDownload
 * @param listOderBy
 */
export const handleDownloadCustomers = (listCustomerDownload, listOderBy, selectedTargetType, selectedTargetId) => async (
  dispatch,
  getState
) => {
  await dispatch(downloadCustomer(listCustomerDownload, listOderBy, selectedTargetType, selectedTargetId));
};

/**
 * Delete customer out of list
 * @param customerListId
 * @param customerIds
 */
export const handleDeleteCustomerOutOfList = (customerListId, customerIds) => async (
  dispatch,
  getState
) => {
  await dispatch(deleteCustomerOutOfList(customerListId, customerIds));
};

/**
 * Add customers to favourite list
 * @param listId
 */
export const handleAddCustomersToFavouriteList = listId => async (dispatch, getState) => {
  await dispatch(addCustomersToFavouriteList(listId));
};

/**
 * Get info relation list customers
 * @param customerIds
 */
export const handleCountRelationCustomers = customerIds => async (dispatch, getState) => {
  await dispatch(countRelationCustomers(customerIds));
};

/**
 * detele customer select
 * @param customerIds
 */
export const handleDeleteCustomers = customerIds => async (dispatch, getState) => {
  await dispatch(deleteCustomers(customerIds));
};

/**
 * Change mode screen display
 * @param isEdit
 */
export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit
    ? ACTION_TYPES.CUSTOMER_LIST_CHANGE_TO_EDIT
    : ACTION_TYPES.CUSTOMER_LIST_CHANGE_TO_DISPLAY
});

/**
 * reset state
 */
export const reset = () => ({
  type: ACTION_TYPES.CUSTOMER_LIST_RESET
});

export const resetMessageSuccess = () => ({
  type: ACTION_TYPES.CUSTOMER_LIST_RESET_MSG_SUCCESS
});

export const handleAddCustomersToList = (customerListId, customerIds) => async (
  dispatch,
  getState
) => {
  await dispatch(addCustomersToList(customerListId, customerIds));
};

/**
 * reset state
 */
export const resetList = () => ({
  type: ACTION_TYPES.CUSTOMER_LIST_RESET_LIST
});
