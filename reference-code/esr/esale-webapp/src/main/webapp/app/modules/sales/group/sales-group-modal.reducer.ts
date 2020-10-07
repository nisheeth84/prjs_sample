import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, FIELD_BELONG } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { SHOW_MESSAGE_SUCCESS } from '../constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';

export const ACTION_TYPES = {
  RESET_GROUP_MODAL: 'GROUP/RESET',
  INITIALIZE_GROUP_MODAL: 'GROUP/SALES_INITIALIZE_GROUP_MODAL',
  CREATE_GROUP: 'GROUP/CREATE_GROUP',
  UPDATE_GROUP: 'GROUP/UPDATE_GROUP',
  PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO: 'sales/CUSTOM_FIELD_INFO',
  SHARED_GROUP_RESET_ERROR: 'sharedGroup/RESET_ERROR',
  RESET_SALES_GROUP_MODAL: 'GROUP/RESET',
  INITIALIZE_SALES_GROUP_MODAL: 'GROUP/INITIALIZE_SALES_GROUP_MODAL',
  MOVE_TO_SALES_GROUP: 'GROUP/MOVE_TO_SALES_GROUP',
  ADD_TO_SALES_GROUP: 'GROUP/ADD_TO_SALES_GROUP',
  SUGGESTIONS_SALE: 'GROUP/SUGGESTIONS_SALE',
  /**
   * share group
   */
  RESET_SALES_SHARED_GROUP_MODAL: 'GROUP/RESET_SHARE',
  CREATE_SALES_GROUP: 'GROUP/CREATE_SALES_GROUP',
  CREATE_SALES_SHARED_GROUP: 'GROUP/CREATE_SALES_SHARED_GROUP'
};

export enum GroupSaleModalAction {
  None,
  Error,
  ErrorValidate,
  Success
}
// API base URL
const salesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH;

export const getListSuggestions = (searchValue: any) => ({
  type: ACTION_TYPES.SUGGESTIONS_SALE,
  payload: axios.post(
    `${salesApiUrl + '/get-list-suggestions'}`,
    { searchValue },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

// // Update based on design ver 0.6
export const handleGetListSuggetions = (searchValue: any) => async dispatch => {
  await dispatch(getListSuggestions(searchValue));
};

export const moveToGroup = (
  idOfOldList: number,
  idOfNewList: number,
  listOfProductTradingId: any
) => ({
  type: ACTION_TYPES.MOVE_TO_SALES_GROUP,
  payload: axios.post(
    `${salesApiUrl + '/drag-drop-product-trading'}`,
    {
      idOfOldList,
      idOfNewList,
      listOfProductTradingId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleMoveToGroup: any = (
  idOfOldList: number,
  idOfNewList: number,
  listOfProductTradingId: any
) => async dispatch => {
  await dispatch(moveToGroup(idOfOldList, idOfNewList, listOfProductTradingId));

  return Promise.resolve();
};

export const addToGroup = params => ({
  type: ACTION_TYPES.ADD_TO_SALES_GROUP,
  payload: axios.post(`${salesApiUrl + '/add-product-tradings-to-list'}`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const handleAddToGroup = (groupId, listOfProductTradingId) => async dispatch => {
  const data = {
    idOfList: parseInt(groupId, 10),
    listOfProductTradingId
  };
  await dispatch(addToGroup(data));
};

export const reset = () => ({
  type: ACTION_TYPES.RESET_SALES_GROUP_MODAL
});

export const resetShared = () => ({
  type: ACTION_TYPES.RESET_SALES_SHARED_GROUP_MODAL
});

const initialModalState = {
  group: null,
  groups: [],
  errorCode: '',
  modalAction: GroupSaleModalAction.None,
  searchConditions: null,
  customFields: null,
  errorItems: [],
  listUpdateTime: null,
  msgSuccess: SHOW_MESSAGE_SUCCESS.NONE,

  // CREATE_SALES_GROUP
  msgSharedSuccess: SHOW_MESSAGE_SUCCESS.NONE,
  modalSharedAction: GroupSaleModalAction.None,
  errorSharedItems: null,
  errorSharedCode: null,
  listInfo: [],
  updateMyGroupId: null,
  timeUpdate: null,
  searchSuggest: '',
  errorMessageInModal: [],
  isSubmit: false
};

const parseShareGroupFail = res => {
  let errorMsg = [];
  let errorCode = '';
  if (res.parameters.extensions.errors && res.parameters.extensions.errors.length > 0) {
    errorMsg = res.parameters.extensions.errors[0].message
      ? res.parameters.extensions.errors[0].message
      : [];
    errorCode = res.parameters.extensions.errors[0].errorCode;
  }
  return { errorCode, errorMsg };
};

const parseListUpdateTime = listUpdateTime => {
  try {
    const list = JSON.parse(listUpdateTime);
    if (list && list[0] && list[0]['list_update_time']) {
      return list[0]['list_update_time'];
    }
  } catch (e) {
    // do nothing
  }
  return null;
};

const parseInitializeGroupModalResponse = res => {
  let group = null;
  let groups = [];
  let fields = [];
  let searchConditions = [];
  let customFields = [];
  let listUpdateTime = null;
  if (res) {
    group = res.group;
    groups = res.groups;
    fields = res.fields;
    listUpdateTime = parseListUpdateTime(res.listUpdateTime);
    searchConditions = res.searchConditions;
    customFields = res.customFields;
  }
  return { group, groups, fields, searchConditions, customFields, listUpdateTime };
};
const parseInitializeGroupModal = res => {
  let group = null;
  let groups = [];
  let fields = [];
  let searchConditions = [];
  let customFields = [];
  if (res) {
    group = res.productTradingList[0];
    groups = res.groups;
    fields = res.fields;
    searchConditions = res.searchConditions;
    customFields = res.customFields;
  }
  return { group, groups, fields, searchConditions, customFields };
};

const parseCreateUpdateMyGroupResponse = (res, EnumMsg) => {
  const errorMsg = [];
  let isSuccess = true;
  const errorItems = [];
  const rowIds = [];
  const errorParams = [];
  if (res.data.errors && res.data.errors.length > 0) {
    for (let i = 0; i < res.data.errors[0].extensions.errors.length; i++) {
      errorMsg.push(res.data.errors[0].extensions.errors[i].errorCode);
      errorItems.push(res.data.errors[0].extensions.errors[i].item);
      rowIds.push(res.data.errors[0].extensions.errors[i].rowId);
      errorParams.push(res.data.errors[0].extensions.errors[i].errorParams || null);
    }
    isSuccess = false;
  }
  const action =
    errorItems && errorItems.length > 0
      ? GroupSaleModalAction.ErrorValidate
      : GroupSaleModalAction.Success;
  const msgSuccess = errorItems && errorItems.length > 0 ? SHOW_MESSAGE_SUCCESS.NONE : EnumMsg;
  const productTradingListDetailId = res.data.productTradingListDetailId;
  return {
    errorMsg,
    errorItems,
    action,
    productTradingListDetailId,
    rowIds,
    isSuccess,
    errorParams,
    msgSuccess
  };
};

export type SalesGroupModalState = Readonly<typeof initialModalState>;

// Reducer
export default (state: SalesGroupModalState = initialModalState, action): SalesGroupModalState => {
  const timeStamp = new Date().getTime();
  switch (action.type) {
    case REQUEST(ACTION_TYPES.INITIALIZE_SALES_GROUP_MODAL):
    case REQUEST(ACTION_TYPES.CREATE_GROUP):
    case REQUEST(ACTION_TYPES.UPDATE_GROUP):
    case REQUEST(ACTION_TYPES.PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO):
      return {
        ...state
      };
    case SUCCESS(ACTION_TYPES.INITIALIZE_GROUP_MODAL): {
      const res = parseInitializeGroupModal(action.payload.data);
      return {
        ...state,
        group: res.group,
        groups: res.groups
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO): {
      const res = parseInitializeGroupModalResponse(action.payload.data);
      return {
        ...state,
        groups: res.groups,
        customFields: res.customFields,
        searchConditions: res.searchConditions,
        listUpdateTime: res.listUpdateTime
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE_GROUP):
    case ACTION_TYPES.CREATE_GROUP: {
      const res = parseCreateUpdateMyGroupResponse(action.payload, SHOW_MESSAGE_SUCCESS.CREATE);
      return {
        ...state,
        modalAction: GroupSaleModalAction.Success,
        updateMyGroupId: res.productTradingListDetailId,
        msgSuccess: SHOW_MESSAGE_SUCCESS.CREATE
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_GROUP): {
      const res = parseCreateUpdateMyGroupResponse(action.payload, SHOW_MESSAGE_SUCCESS.CREATE);
      return {
        ...state,
        modalAction: GroupSaleModalAction.Success,
        msgSuccess: SHOW_MESSAGE_SUCCESS.UPDATE,
        updateMyGroupId: res.productTradingListDetailId
      };
    }

    // CREATE_SALES_GROUP
    case REQUEST(ACTION_TYPES.CREATE_SALES_SHARED_GROUP):
    case REQUEST(ACTION_TYPES.SUGGESTIONS_SALE):
      return {
        ...state,
        errorItems: null,
        errorCode: null,
        errorSharedItems: null,
        errorSharedCode: null
      };
    case REQUEST(ACTION_TYPES.MOVE_TO_SALES_GROUP):
    case REQUEST(ACTION_TYPES.ADD_TO_SALES_GROUP):
      return {
        ...state,
        errorItems: null,
        errorCode: null,
        errorSharedItems: null,
        errorSharedCode: null,
        isSubmit: true
      };
    case SUCCESS(ACTION_TYPES.INITIALIZE_SALES_GROUP_MODAL): {
      const res = parseInitializeGroupModal(action.payload.data);
      return {
        ...state,
        group: res.group,
        groups: res.groups,
        customFields: res.customFields,
        searchConditions: res.searchConditions
        // groupParticipants: res.groupParticipants
        // listUpdateTime: res.listUpdateTime
      };
    }
    case SUCCESS(ACTION_TYPES.MOVE_TO_SALES_GROUP):
    case SUCCESS(ACTION_TYPES.ADD_TO_SALES_GROUP): {
      return {
        ...state,
        isSubmit: false,
        modalAction: GroupSaleModalAction.Success,
        msgSuccess: SHOW_MESSAGE_SUCCESS.UPDATE,
        errorCode: null
      };
    }
    case SUCCESS(ACTION_TYPES.SUGGESTIONS_SALE): {
      const res = action.payload.data;
      const tmpData = res.listInfo;
      return {
        ...state,
        listInfo: [...tmpData]
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE_SALES_GROUP): {
      const res = parseCreateUpdateMyGroupResponse(action.payload, SHOW_MESSAGE_SUCCESS.CREATE);
      return {
        ...state,
        modalAction: res.action,
        msgSuccess: res.msgSuccess,
        // modalSharedAction: GroupSaleModalAction.None,
        // msgSharedSuccess: res.NONE,
        timeUpdate: timeStamp
      };
    }
    case FAILURE(ACTION_TYPES.CREATE_GROUP):
    case FAILURE(ACTION_TYPES.UPDATE_GROUP):
    case FAILURE(ACTION_TYPES.SUGGESTIONS_SALE):
    case FAILURE(ACTION_TYPES.INITIALIZE_SALES_GROUP_MODAL):
      return {
        ...state,
        modalAction: GroupSaleModalAction.Error,
        errorItems: parseErrorRespose(action.payload),
        errorCode: parseErrorRespose(action.payload)[0].errorCode
      };
    case FAILURE(ACTION_TYPES.MOVE_TO_SALES_GROUP):
    case FAILURE(ACTION_TYPES.ADD_TO_SALES_GROUP): {
      const error = parseErrorRespose(action.payload)[0].errorCode;
      return {
        ...state,
        modalAction: GroupSaleModalAction.Error,
        errorItems: parseErrorRespose(action.payload),
        errorCode: error,
        isSubmit: false
      };
    }
    case FAILURE(ACTION_TYPES.CREATE_SALES_GROUP): {
      const res = parseShareGroupFail(action.payload.response.data);
      return {
        ...state,
        modalAction: GroupSaleModalAction.Error,
        errorItems: res.errorMsg,
        errorCode:
          parseErrorRespose(action.payload)[0].errorCode || JSON.parse(action.payload).error,
        errorSharedItems: null,
        errorSharedCode: null,
        errorMessageInModal: res.errorMsg
      };
    }
    /**
     * MODAL CREATE SHARED GROUP
     */
    case SUCCESS(ACTION_TYPES.CREATE_SALES_SHARED_GROUP): {
      const res = parseCreateUpdateMyGroupResponse(action.payload, SHOW_MESSAGE_SUCCESS.CREATE);
      return {
        ...state,
        modalAction: res.action,
        msgSuccess: res.msgSuccess,
        modalSharedAction: res.action,
        msgSharedSuccess: res.msgSuccess,
        timeUpdate: timeStamp
      };
    }
    case FAILURE(ACTION_TYPES.CREATE_SALES_SHARED_GROUP): {
      const res = parseShareGroupFail(action.payload.response.data);
      return {
        ...state,
        modalSharedAction: GroupSaleModalAction.Error,
        errorSharedItems: parseErrorRespose(action.payload) || JSON.parse(action.payload).message,
        errorSharedCode:
          parseErrorRespose(action.payload)[0].errorCode || JSON.parse(action.payload).error,
        errorItems: null,
        errorCode: null,
        errorMessageInModal: res.errorMsg
      };
    }
    case ACTION_TYPES.RESET_GROUP_MODAL:
    case ACTION_TYPES.RESET_SALES_GROUP_MODAL:
    case ACTION_TYPES.RESET_SALES_SHARED_GROUP_MODAL: {
      return {
        ...initialModalState,
        listInfo: state.listInfo
      };
    }
    case ACTION_TYPES.SHARED_GROUP_RESET_ERROR:
      return {
        ...state,
        errorItems: [],
        errorMessageInModal: null,
        msgSuccess: SHOW_MESSAGE_SUCCESS.NONE
      };
    default:
      return state;
  }
};

// ADD-MY-LIST
// const salesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH;
export const initializeGroupModal = groupIdParam => ({
  type: ACTION_TYPES.INITIALIZE_SALES_GROUP_MODAL,
  payload: axios.post(
    `${salesApiUrl + '/get-product-tradings-list'}`,
    {
      // groupId: groupIdParam
      productTradingListDetailId: groupIdParam
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
export const handleInitializeGroupModal = (productTradingListDetailId = null) => async dispatch => {
  await dispatch(initializeGroupModal(productTradingListDetailId)); // productTradingListDetailId = groupId
};

// ADD-MY-LIST
export const getFieldInfoGroupShare = () => ({
  type: ACTION_TYPES.PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'commons/api/get-custom-fields-info'}`,
    {
      fieldBelong: FIELD_BELONG.PRODUCT_TRADING
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

// ADD-MY-LIST
export const dispatchCreateGroup = params => ({
  type: ACTION_TYPES.CREATE_GROUP,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'sales/api/create-product-tradings-list'}`,
    params,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const handleCreateGroup = (
  productTradingListNameParam,
  listTypeParam,
  listModeParam,
  isOverWriteParam,
  ownerListParam = [],
  viewerListParam = [],
  searchConditionsParam,
  listOfproductTradingIdParam = []
) => async dispatch => {
  const data = {
    productTradingList: {
      productTradingListName: productTradingListNameParam,
      listType: listTypeParam || 1,
      listMode: listModeParam || 1,
      isOverWrite: isOverWriteParam || 1,
      ownerList: ownerListParam,
      viewerList: viewerListParam
    },
    searchConditions: searchConditionsParam,
    listOfproductTradingId: listOfproductTradingIdParam
  };
  await dispatch(dispatchCreateGroup(data));
};

// ADD-MY-LIST
const dispatchUpdateGroup = params => ({
  type: ACTION_TYPES.UPDATE_GROUP,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'sales/api/update-product-tradings-list'}`,
    params,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

// ADD-MY-LIST
export const handleUpdateGroup = (
  productTradingListDetailIdParam,
  productTradingListNameParam,
  listTypeParam,
  listModeParam,
  isOverWriteParam,
  ownerListParam = [],
  viewerListParam = [],
  searchConditionsParam = null
  // listOfproductTradingIdParam = [1]
) => async dispatch => {
  const data = {
    productTradingListDetailId: productTradingListDetailIdParam,
    productTradingList: {
      productTradingListName: productTradingListNameParam,
      listType: listTypeParam || 1,
      listMode: listModeParam || 1,
      isOverWrite: isOverWriteParam || 1,
      ownerList: ownerListParam,
      viewerList: viewerListParam
    },
    searchConditions: searchConditionsParam
  };
  await dispatch(dispatchUpdateGroup(data));
};

// API base URL
const saleListApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH;

export const dispatchCreateMyGroup = body => ({
  type: ACTION_TYPES.CREATE_SALES_GROUP,
  payload: axios.post(`${saleListApiUrl}/create-product-tradings-list`, body, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const dispatchCreateSharedGroup = body => ({
  type: ACTION_TYPES.CREATE_SALES_SHARED_GROUP,
  payload: axios.post(`${saleListApiUrl}/create-product-tradings-list`, body, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const handleCreateMyGroup = param => async dispatch => {
  await dispatch(dispatchCreateMyGroup(param));
};
export const handleCreateSharedGroup = param => async dispatch => {
  await dispatch(dispatchCreateSharedGroup(param));
};
