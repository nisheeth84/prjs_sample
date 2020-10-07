import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode, AVAILABLE_FLAG } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import _ from 'lodash';
import {
  PARAM_UPDATE_CUSTOM_FIELD_INFO,
  DUMMY_PRODUCT_TRADING
} from 'app/modules/businessCards/constants';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';

export const ACTION_TYPES = {
  BUSINESSCARD_DETAIL_GET: 'businesscardDetail/BUSINESSCARD_DETAIL_GET',
  BUSINESSCARD_DETAIL_CHANGE_HISTORY: 'businesscardDetail/BUSINESSCARD_DETAIL_CHANGE_HISTORY',
  BUSINESSCARD_DETAIL_DELETE: 'businesscardDetail/BUSINESSCARD_DETAIL_DELETE',
  BUSINESSCARD_DETAIL_TRADING: 'businesscardDetail/BUSINESSCARD_DETAIL_TRADING',
  BUSINESSCARD_DETAIL_UPDATE_CUSTOMFIELDSINFO: 'businesscardDetail/BUSINESSCARD_DETAIL_UPDATE_CUSTOMFIELDSINFO',
  BUSINESSCARD_DETAIL_CHANGE_TO_EDIT: 'businesscardDetail/EDIT',
  BUSINESSCARD_DETAIL_CHANGE_TO_DISPLAY: 'businesscardDetail/DISPLAY',
  BUSINESSCARD_CREARTE_FOLLOWED: 'businesscardDetail/BUSINESSCARD_CREARTE_FOLLOWED',
  BUSINESSCARD_DELETE_FOLLOWEDS: 'businesscardDetail/BUSINESSCARD_DELETE_FOLLOWEDS',
  BUSINESS_CARD_DETAIL_RESET: 'businesscardDetail/BUSINESS_CARD_DETAIL_RESET',
  BUSINESS_CARD_DETAIL_GET_ACTIVITIES: 'businesscardDetail/GET_ACTIVITIES',
  BUSINESS_CARD_GET_LIST_CUSTOMER: 'businesscardDetail/GET_LIST_CUSTOMER',
  BUSINESS_CARD_GET_EXTENSION_TIME_LINE: 'businesscardDetail/GET_EXTENSION_TIME_LINE',
  BUSINESSCARD_DETAIL_HISTORY_BY_ID: 'businesscardDetail/BUSINESSCARD_DETAIL_HISTORY_BY_ID',
  BUSINESS_CARD_DETAIL_RESET_HISTORY: 'businesscardDetail/BUSINESS_CARD_DETAIL_RESET_HISTORY',
};

export enum BusinessCardAction {
  None,
  Request,
  Error,
  Success,
  UpdateSuccess
}

const initialState = {
  action: BusinessCardAction.None,
  actionDelete: BusinessCardAction.None,
  actionHistory: BusinessCardAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessage: null,
  errorItems: null,
  businessCard: null,
  businessCardHistory: null,
  businessCardFieldsUnVailable: null,
  businessCardFieldsAvailable: null,
  deleteBusinessCards: null,
  productTrading: null,
  tabListShow: null,
  timelineFollowed: null,
  followeds: null,
  customers: null,
  extTimeLine: null,
  messageUpdateCustomFieldInfoSuccess: null,
  messageUpdateCustomFieldInfoError: null,
  businessCardHistoryById: null
};

// API base URL
const businessApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH;
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;

const parseBusinessCardResponse = res => {
  let businessCard = null;
  let filteredUnVailable = [];
  let tabListShow = null;
  let businessCardFieldsAvailable = null;
  const action = BusinessCardAction.Success;

  if (res && res.data) {
    businessCard = res.data;
    businessCardFieldsAvailable = _.cloneDeep(businessCard)
  }
  if (res && res.data && res.data.fieldInfo) {
    res.data.fieldInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
    filteredUnVailable = res.data.fieldInfo.filter(field => {
      return field.availableFlag === AVAILABLE_FLAG.UNAVAILABLE;
    });
    const filteredAvailable = res.data.fieldInfo.filter(field => {
      return field.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE;
    });
    businessCardFieldsAvailable.fieldInfo = filteredAvailable;
  }

  if (res && res.data && res.data.tabInfos) {
    tabListShow = res.data.tabInfos.filter(tabInfo => {
      return tabInfo.isDisplay === true;
    });
  }
  return { action, businessCard, tabListShow, filteredUnVailable, businessCardFieldsAvailable };
}

const parseCreateFollowed = res => {
  let timelineFollowed = null;
  const action = BusinessCardAction.Success;
  if (res && res.data) {
    timelineFollowed = res.data.timelineFollowed
  }
  return { timelineFollowed, action };
}

const parseDeleteFollowed = res => {
  let followeds = null;
  const action = BusinessCardAction.Success;
  if (res && res.data) {
    followeds = res.data.followeds
  }
  return { followeds, action };
}

const parseDeleteBusinessCard = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const actionDelete = errorMsg.length > 0 ? BusinessCardAction.Error : BusinessCardAction.Success;
  const deleteBusinessCards = res.data;
  return { errorMsg, actionDelete, deleteBusinessCards };
};

const parseBusinessCardHistory = res => {
  let errorMsg = '';
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message;
  }
  const actionHistory = errorMsg.length > 0 ? BusinessCardAction.Error : BusinessCardAction.Success;
  let businessCardHistory;
  if (res.data) {
    businessCardHistory = res.data;
  }
  return { errorMsg, actionHistory, businessCardHistory };
};

const parseGetListCustomer = res => {
  let customers = [];
  const action = BusinessCardAction.Success;
  if (res && res.data) {
    customers = res.data.childCustomers
  }
  return { customers, action };
}

const parseGetExtTimeLine = res => {
  let extTimeLine = [];
  const action = BusinessCardAction.Success;
  if (res && res.data) {
    extTimeLine = res.data.timelines
  }
  return { extTimeLine, action };
}

export type BusinessCardDetailState = Readonly<typeof initialState>;

const actionRequestApi = (stateRequest, actionRequest) => {
  switch (actionRequest.type) {
    /* REQUEST */
    case REQUEST(ACTION_TYPES.BUSINESSCARD_DETAIL_GET):
    case REQUEST(ACTION_TYPES.BUSINESSCARD_DETAIL_CHANGE_HISTORY):
    case REQUEST(ACTION_TYPES.BUSINESSCARD_DETAIL_DELETE):
    case REQUEST(ACTION_TYPES.BUSINESSCARD_DETAIL_TRADING):
    case REQUEST(ACTION_TYPES.BUSINESSCARD_DETAIL_UPDATE_CUSTOMFIELDSINFO):
    case REQUEST(ACTION_TYPES.BUSINESS_CARD_DETAIL_GET_ACTIVITIES):
    case REQUEST(ACTION_TYPES.BUSINESS_CARD_GET_LIST_CUSTOMER):
    case REQUEST(ACTION_TYPES.BUSINESS_CARD_GET_EXTENSION_TIME_LINE):
    case REQUEST(ACTION_TYPES.BUSINESSCARD_CREARTE_FOLLOWED):
    case REQUEST(ACTION_TYPES.BUSINESSCARD_DELETE_FOLLOWEDS):
    case REQUEST(ACTION_TYPES.BUSINESSCARD_DETAIL_HISTORY_BY_ID):
      {
        return {
          ...stateRequest,
          action: BusinessCardAction.Request,
          errorItems: null,
          messageUpdateCustomFieldInfoSuccess: null,
          messageUpdateCustomFieldInfoError: null
        };
      }
    default:
      break;
  }
}

const actionFailure = (stateRequestFailure, actionRequestFailure) => {
  switch (actionRequestFailure.type) {
    /* FAILURE */
    case FAILURE(ACTION_TYPES.BUSINESSCARD_DETAIL_GET):
    case FAILURE(ACTION_TYPES.BUSINESSCARD_DETAIL_CHANGE_HISTORY):
    case FAILURE(ACTION_TYPES.BUSINESSCARD_DETAIL_DELETE):
    case FAILURE(ACTION_TYPES.BUSINESSCARD_DETAIL_TRADING):
    case FAILURE(ACTION_TYPES.BUSINESSCARD_CREARTE_FOLLOWED):
    case FAILURE(ACTION_TYPES.BUSINESSCARD_DELETE_FOLLOWEDS):
    case FAILURE(ACTION_TYPES.BUSINESS_CARD_DETAIL_GET_ACTIVITIES):
    case FAILURE(ACTION_TYPES.BUSINESS_CARD_GET_LIST_CUSTOMER):
    case FAILURE(ACTION_TYPES.BUSINESS_CARD_GET_EXTENSION_TIME_LINE):
    case FAILURE(ACTION_TYPES.BUSINESSCARD_DETAIL_HISTORY_BY_ID):
      {
        let errors = [];
        if (actionRequestFailure.payload.response.data.parameters) {
          const resError = actionRequestFailure.payload.response.data.parameters.extensions;
          if (resError.errors) {
            errors = resError.errors;
          }
        }
        return {
          ...stateRequestFailure,
          action: BusinessCardAction.Error,
          errorItems: errors && errors.length ? errors[0].errorCode : null
        };
      }
    case FAILURE(ACTION_TYPES.BUSINESSCARD_DETAIL_UPDATE_CUSTOMFIELDSINFO):
      {
        const error = parseErrorRespose(actionRequestFailure.payload);
        return {
          ...stateRequestFailure,
          messageUpdateCustomFieldInfoError: error && error.length ? error[0].errorCode : 'ERR_COM_0050'
        };
      }

    default:
      break;
  }
};

// Reducer
export default (state: BusinessCardDetailState = initialState, action): BusinessCardDetailState => {
  const stateRequest = actionRequestApi(state, action);
  if (!_.isNil(stateRequest)) {
    return stateRequest;
  }
  const stateFailure = actionFailure(state, action);
  if (!_.isNil(stateFailure)) {
    return stateFailure;
  }
  switch (action.type) {
    /* SUCCESS */
    case SUCCESS(ACTION_TYPES.BUSINESSCARD_CREARTE_FOLLOWED):
      {
        const res = parseCreateFollowed(action.payload);
        return {
          ...state,
          action: res.action,
          timelineFollowed: res.timelineFollowed
        };
      }
    case SUCCESS(ACTION_TYPES.BUSINESSCARD_DELETE_FOLLOWEDS):
      {
        const res = parseDeleteFollowed(action.payload);
        return {
          ...state,
          action: res.action,
          followeds: res.followeds
        };
      }
    case SUCCESS(ACTION_TYPES.BUSINESSCARD_DETAIL_GET):
      {
        const res = parseBusinessCardResponse(action.payload);
        return {
          ...state,
          action: res.action,
          businessCard: res.businessCard,
          tabListShow: res.tabListShow,
          businessCardFieldsUnVailable: res.filteredUnVailable,
          businessCardFieldsAvailable: res.businessCardFieldsAvailable
        };
      }
    case SUCCESS(ACTION_TYPES.BUSINESSCARD_DETAIL_CHANGE_HISTORY):
      {
        const res = parseBusinessCardHistory(action.payload);
        return {
          ...state,
          action: res.actionHistory,
          errorMessage: res.errorMsg,
          businessCardHistory: res.businessCardHistory
        };
      }
    case SUCCESS(ACTION_TYPES.BUSINESSCARD_DETAIL_HISTORY_BY_ID): {
      const res = parseBusinessCardHistory(action.payload);
      return {
        ...state,
        action: res.actionHistory,
        errorMessage: res.errorMsg,
        businessCardHistoryById: res.businessCardHistory
      };
    }
    case SUCCESS(ACTION_TYPES.BUSINESSCARD_DETAIL_DELETE):
      {
        const res = parseDeleteBusinessCard(action.payload);
        return {
          ...state,
          actionDelete: res.actionDelete,
          errorMessage: res.errorMsg,
          deleteBusinessCards: res.deleteBusinessCards
        };
      }
    case SUCCESS(ACTION_TYPES.BUSINESSCARD_DETAIL_TRADING):
      {
        return {
          ...state,
          productTrading: DUMMY_PRODUCT_TRADING
        };
      }
    case SUCCESS(ACTION_TYPES.BUSINESSCARD_DETAIL_UPDATE_CUSTOMFIELDSINFO):
      {
        return {
          ...state,
          action: BusinessCardAction.UpdateSuccess,
          messageUpdateCustomFieldInfoSuccess: 'INF_COM_0004'
        };
      }
    case SUCCESS(ACTION_TYPES.BUSINESS_CARD_DETAIL_GET_ACTIVITIES):
      {
        const res = parseBusinessCardHistory(action.payload);
        return {
          ...state,
          businessCardHistory: res.businessCardHistory
        }
      }
    case SUCCESS(ACTION_TYPES.BUSINESS_CARD_GET_LIST_CUSTOMER):
      {
        const res = parseGetListCustomer(action.payload);
        return {
          ...state,
          action: res.action,
          customers: res.customers
        };
      }
    case SUCCESS(ACTION_TYPES.BUSINESS_CARD_GET_EXTENSION_TIME_LINE):
      {
        const res = parseGetExtTimeLine(action.payload);
        return {
          ...state,
          action: res.action,
          extTimeLine: res.extTimeLine
        };
      }
    /* EDIT MODE */
    case ACTION_TYPES.BUSINESSCARD_DETAIL_CHANGE_TO_EDIT:
      {
        return {
          ...state,
          screenMode: ScreenMode.EDIT
        };
      }

    case ACTION_TYPES.BUSINESSCARD_DETAIL_CHANGE_TO_DISPLAY:
      {
        return {
          ...state,
          errorItems: [],
          screenMode: ScreenMode.DISPLAY
        };
      }

    case ACTION_TYPES.BUSINESS_CARD_DETAIL_RESET:
      return {
        ...initialState
      };
    case ACTION_TYPES.BUSINESS_CARD_DETAIL_RESET_HISTORY:
      return {
        ...state,
        businessCardHistory: null
      };

    default:
      return state;
  }
};

/* Action */
const getBusinessCard = (businessCardId, mode, hasTimeLine, customerIds, hasLoginUser) => ({
  type: ACTION_TYPES.BUSINESSCARD_DETAIL_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-business-card`,
    {
      businessCardId, mode, hasTimeLine, customerIds, hasLoginUser
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const getBusinessCardChangeHistory = (businessCardId, offset, limit, orderBy, isMergeHistory = false) => ({
  type: !isMergeHistory ? ACTION_TYPES.BUSINESSCARD_DETAIL_CHANGE_HISTORY : ACTION_TYPES.BUSINESSCARD_DETAIL_HISTORY_BY_ID,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-business-card-history`,
    {
      businessCardId, offset, limit, orderBy
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const getBusinessCardActivities = (selectedTargetType, selectedTargetId, listBusinessCardId, orderBy) => ({
  type: ACTION_TYPES.BUSINESS_CARD_DETAIL_GET_ACTIVITIES,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.ACTIVITY_SERVICE_PATH}/get-activities`,
    {
      selectedTargetType,
      selectedTargetId,
      listBusinessCardId,
      orderBy
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
})

const deleteBusinessCard = (paramBusinessCards, paramProcessMode) => ({
  type: ACTION_TYPES.BUSINESSCARD_DETAIL_DELETE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/delete-business-cards`,
    {
      businessCards: paramBusinessCards,
      processMode: paramProcessMode
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const getProductTrading = (params: any) => ({
  type: ACTION_TYPES.BUSINESSCARD_DETAIL_TRADING
});

const convertFieldLabel = (fields: any[]) => {
  const listField = [];
  if (!fields) {
    return listField;
  }
  fields.forEach(e => {
    const obj = _.cloneDeep(e);
    delete obj.columnWidth;

    if (!_.isString(obj.fieldLabel)) {
      obj.fieldLabel = JSON.stringify(obj.fieldLabel);
    }
    if (_.has(obj, 'fieldItems') && _.isArray(obj.fieldItems)) {
      obj.fieldItems.forEach((item, idx) => {
        if (_.has(item, 'itemLabel') && !_.isString(item.itemLabel)) {
          obj.fieldItems[idx].itemLabel = JSON.stringify(item.itemLabel);
        }
      });
    }
    if (_.toString(obj.fieldType) === DEFINE_FIELD_TYPE.LOOKUP && obj.lookupData && obj.lookupData.itemReflect) {
      obj.lookupData.itemReflect.forEach((item, idx) => {
        if (_.has(item, 'fieldLabel') && !_.isString(item.fieldLabel)) {
          obj.lookupData.itemReflect[idx].itemLabel = JSON.stringify(item.fieldLabel);
        }
      });
    }
    listField.push(obj);
  });
  return listField;
};

const updateCustomFieldsInfo = (fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab) => ({
  type: ACTION_TYPES.BUSINESSCARD_DETAIL_UPDATE_CUSTOMFIELDSINFO,
  payload: axios.post(
    `${commonsApiUrl}/update-custom-fields-info`,
    PARAM_UPDATE_CUSTOM_FIELD_INFO(fieldBelong, deleteFields, convertFieldLabel(fields), tabs, deleteFieldsTab, fieldsTab),
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const createFollowed = (followTargetType, followTargetId) => ({
  type: ACTION_TYPES.BUSINESSCARD_CREARTE_FOLLOWED,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.TIMELINES_SERVICE_PATH}/create-followed`,
    {
      followTargetType, followTargetId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const deleteFolloweds = (followeds) => ({
  type: ACTION_TYPES.BUSINESSCARD_DELETE_FOLLOWEDS,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.TIMELINES_SERVICE_PATH}/delete-followeds`,
    {
      followeds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/* Add store */
export const handleInitBusinessCard = (businessCardId, mode, hasTimeLine, customerIds, hasLoginUser) => async (dispatch, getState) => {
  if (businessCardId != null) {
    await dispatch(getBusinessCard(businessCardId, mode, hasTimeLine, customerIds, hasLoginUser));
  }
};

export const handleInitBusinessCardChangeHistory = (businessCardId, offset, limit, orderBy, isMergeHistory = false) => async (dispatch, getState) => {
  if (businessCardId != null) {
    await dispatch(getBusinessCardChangeHistory(businessCardId, offset, limit, orderBy, isMergeHistory));
  }
};

export const handleDeleteBusinessCards = (businessCards, processMode) => async (dispatch, getState) => {
  if (processMode != null) {
    await dispatch(deleteBusinessCard(businessCards, processMode));
  }
};

export const handleInitBusinessCardActivities = (selectedTargetType, selectedTargetId, listBusinessCardId, orderBy) => async (dispatch, getState) => {
  if (listBusinessCardId !== null) {
    await dispatch(getBusinessCardActivities(selectedTargetType, selectedTargetId, listBusinessCardId, orderBy));
  }
}

export const handleInitProductTrading = (params) => async (dispatch, getState) => {
  await dispatch(getProductTrading(params));
};

export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit ? ACTION_TYPES.BUSINESSCARD_DETAIL_CHANGE_TO_EDIT : ACTION_TYPES.BUSINESSCARD_DETAIL_CHANGE_TO_DISPLAY
});

export const handleUpdateCustomFieldInfo = (fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab) => async (
  dispatch,
  getState
) => {
  if (fieldBelong != null) {
    await dispatch(updateCustomFieldsInfo(fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab));
  }
};
export const handleCreateFollowed = (followTargetType, followTargetId) => async (dispatch, getState) => {
  await dispatch(createFollowed(followTargetType, followTargetId));
};

export const handleDeleteFolloweds = (followeds) => async (dispatch, getState) => {
  await dispatch(deleteFolloweds(followeds));
};

export const handleReorderField = (dragIndex, dropIndex) => async (dispatch, getState) => {
  const { fieldInfos } = getState().employeeList;
  const objectFieldInfos = JSON.parse(JSON.stringify(fieldInfos));

  if (
    objectFieldInfos &&
    objectFieldInfos.fieldInfoPersonals &&
    objectFieldInfos.fieldInfoPersonals.length > 0
  ) {
    const tempObject = objectFieldInfos.fieldInfoPersonals.splice(
      dragIndex,
      1,
      objectFieldInfos.fieldInfoPersonals[dropIndex]
    )[0]; // get the item from the array
    objectFieldInfos.fieldInfoPersonals.splice(dropIndex, 1, tempObject);
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(1000);
  }
};

/**
 * reset state
 */
export const resetState = () => ({
  type: ACTION_TYPES.BUSINESS_CARD_DETAIL_RESET
});

/**
 * reset state
 */
export const resetStateHistory = () => ({
  type: ACTION_TYPES.BUSINESS_CARD_DETAIL_RESET_HISTORY
});

const getListCustomerChild = customerId => ({
  type: ACTION_TYPES.BUSINESS_CARD_GET_LIST_CUSTOMER,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-child-customers`,
    {
      customerId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
})

export const handleInitListCustomer = customerId => async (dispatch, getState) => {
  await dispatch(getListCustomerChild(customerId));
}

const getExtensionTimeLine = conditions => ({
  type: ACTION_TYPES.BUSINESS_CARD_GET_EXTENSION_TIME_LINE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.TIMELINES_SERVICE_PATH}/get-ext-timelines`,
    conditions,
    { headers: { ['Content-Type']: 'application/json' } }
  )
})

export const handleGetExtensionTimeLine = conditions => async (dispatch, getState) => {
  await dispatch(getExtensionTimeLine(conditions));
}