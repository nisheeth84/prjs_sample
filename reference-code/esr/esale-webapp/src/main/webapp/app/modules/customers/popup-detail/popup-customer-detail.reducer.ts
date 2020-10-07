import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import {
  TAB_ID_LIST
} from 'app/modules/customers/constants';
import _ from 'lodash';

export const ACTION_TYPES = {
  CUSTOMER_DETAIL_CUSTOMER_GET: 'customerDetail/CUSTOMER_GET_DETAIL',
  CUSTOMER_DETAIL_DELETE: 'customerDetail/CUSTOMER_DELETE',
  CUSTOMER_LIST_CHANGE_TO_EDIT: 'customerDetail/EDIT',
  CUSTOMER_LIST_CHANGE_TO_DISPLAY: 'customerDetail/DISPLAY',
  TASK_DATA_GET: 'customerDetail/TASK_GET_TAB',
  CUSTOMER_DETAIL_UPDATE_SCREEN_LAYOUT: 'customerDetail/UPDATE_SCREEN_LAYOUT',
  CUSTOMER_DETAIL_RESET: 'customerDetail/RESET',
  CUSTOMER_CHANGE_HISTORY: 'customerDetail/CUSTOMER_CUSTOMER_CHANGE_HISTORY',
  CUSTOMER_UPDATE_CUSTOM_FIELD_INFO: 'customerDetail/CUSTOMER_UPDATE_CUSTOM_FIELD_INFO',
  CUSTOMER_GET_ACTIVITIES: 'customerDetail/CUSTOMER_GET_ACTIVITIES',
  CUSTOMER_GET_PRODUCT_TRADING: 'customerDetail/CUSTOMER_GET_PRODUCT_TRADING',
  CUSTOMER_GET_TASKS: 'customerDetail/CUSTOMER_GET_TASKS',
  CUSTOMER_GET_CHILD_CUSTOMER: 'customerDetail/CUSTOMER_GET_CHILD_CUSTOMER',
  CUSTOMER_GET_URL_QUICKSIGHT: 'customerDetail/CUSTOMER_GET_URL_QUICKSIGHT',
  CUSTOMER_GET_FOLLOWED: 'customerDetail/CUSTOMER_GET_FOLLOWED',
  CUSTOMER_CREATE_FOLLOW: 'customerDetail/CUSTOMER_CREATE_FOLLOW',
  CUSTOMER_DELETE_FOLLOW: 'customerDetail/CUSTOMER_DELETE_FOLLOW',
  CUSTOMER_COUNT_RELATION_CUSTOMER: 'customerDetail/CUSTOMER_COUNT_RELATION_CUSTOMER'
};

export enum CustomerAction {
  None,
  RequestDetail,
  RequestPopup,
  ErrorList,
  ErrorPopup,
  DoneList,
  DonePopup,
  UpdateCustomerSuccess,
  UpdateCustomerFailure,
  RequestCustomer,
  RequestTask,
  GetUrlQuicksightSuccess,
  GetUrlQuicksightError
}

const initialState = {
  action: CustomerAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessageInList: null,
  errorItems: null,
  errorMessageChangeStatusFailed: null,
  errorMessageDeleteCustomer: null,
  fieldInfos: null,
  customFieldInfos: null,
  fieldSearchInfos: null,
  customFieldSearchInfos: null,
  customer: null,
  customersCheckList: null,
  groupId: null,
  groups: null,
  userLogin: null,
  calendarMonth: null,
  changeHistory: null,
  tabActivities: null,
  tabProductTrading: null,
  customerChild: null,
  customerLayout: null,
  dummyCustomers: null,
  customerFieldsUnVailable: null,
  messageDeleteSuccess: null,
  messageChangeStatusSuccess: null,
  tabListShow: null,
  customerFieldsAvailable: null,
  fieldIds: null,
  tabInfoIds: null,
  fieldInfoTabIds: null,
  messageUpdateCustomFieldInfoSuccess: null,
  messageUpdateCustomFieldInfoError: null,
  urlQuicksight: null,
  errorMessageGetUrlQuicksight: null,
  isFollowed: false,
  errorCountRelation: null,
  relationCustomerData: null
};

// API base URL
const customersApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH;
const tasksApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.CALENDAR_SERVICE_PATH;

export type CustomerDetailState = Readonly<typeof initialState>;

/**
 * Action request
 */
const actionRequestApi = (stateRequest, actionRequest) => {
  switch (actionRequest.type) {
    case REQUEST(ACTION_TYPES.CUSTOMER_DETAIL_DELETE):
    case REQUEST(ACTION_TYPES.CUSTOMER_DETAIL_CUSTOMER_GET):
    case REQUEST(ACTION_TYPES.CUSTOMER_CHANGE_HISTORY):
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_PRODUCT_TRADING):
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_TASKS):
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_CHILD_CUSTOMER):
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_ACTIVITIES):
    case REQUEST(ACTION_TYPES.CUSTOMER_UPDATE_CUSTOM_FIELD_INFO):
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_URL_QUICKSIGHT):
    case REQUEST(ACTION_TYPES.CUSTOMER_GET_FOLLOWED):
    case REQUEST(ACTION_TYPES.CUSTOMER_CREATE_FOLLOW):
    case REQUEST(ACTION_TYPES.CUSTOMER_COUNT_RELATION_CUSTOMER):
    case REQUEST(ACTION_TYPES.CUSTOMER_DELETE_FOLLOW):
      return {
        ...stateRequest,
        action: CustomerAction.RequestDetail,
        errorItems: null,
        messageUpdateCustomFieldInfoError: null,
        messageUpdateCustomFieldInfoSuccess: null,
        errorMessageGetUrlQuicksight: null
      };  
    default:
      break;
  }
};

/**
 * Action Failure
 */
const actionFailure = (stateRequestFailure, actionRequestFailure) => {
  switch (actionRequestFailure.type) {
    case FAILURE(ACTION_TYPES.CUSTOMER_DETAIL_CUSTOMER_GET):
    case FAILURE(ACTION_TYPES.CUSTOMER_CHANGE_HISTORY):
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_CHILD_CUSTOMER):
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_ACTIVITIES):
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_TASKS):
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_PRODUCT_TRADING):
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_FOLLOWED):
    case FAILURE(ACTION_TYPES.CUSTOMER_CREATE_FOLLOW):
    case FAILURE(ACTION_TYPES.CUSTOMER_DELETE_FOLLOW):
    case FAILURE(ACTION_TYPES.CUSTOMER_DETAIL_DELETE): {
      return {
        ...stateRequestFailure,
        errorMessageDeleteCustomer: parseErrorRespose(actionRequestFailure.payload)
      };
    }
    case FAILURE(ACTION_TYPES.CUSTOMER_UPDATE_CUSTOM_FIELD_INFO): {
      return {
        ...stateRequestFailure,
        messageUpdateCustomFieldInfoError: parseErrorRespose(actionRequestFailure.payload)
      };
    }
    case FAILURE(ACTION_TYPES.CUSTOMER_COUNT_RELATION_CUSTOMER): {
      return {
        ...stateRequestFailure,
        errorMessage: actionRequestFailure.payload.message,
        errorItems: parseErrorRespose(actionRequestFailure.payload)
      };
    }
    case FAILURE(ACTION_TYPES.CUSTOMER_GET_URL_QUICKSIGHT): {
      return {
        ...stateRequestFailure,
        action: CustomerAction.GetUrlQuicksightError,
        errorMessageGetUrlQuicksight: parseErrorRespose(actionRequestFailure.payload)
      };
    }
    default:
      break;
  }
};
// Reducer
export default (state: CustomerDetailState = initialState, action): CustomerDetailState => {
  const stateRequest = actionRequestApi(state, action);
  if (!_.isNil(stateRequest)) {
    return stateRequest;
  }
  const stateFailure = actionFailure(state, action);
  if (!_.isNil(stateFailure)) {
    return stateFailure;
  }
  switch (action.type) {
    case SUCCESS(ACTION_TYPES.CUSTOMER_DETAIL_DELETE): {
      return {
        ...state,
        messageDeleteSuccess: 'INF_COM_0005'
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_DETAIL_CUSTOMER_GET): {
      const customerDetail = action.payload.data;
      const filteredAvailable = customerDetail.fields
        ? customerDetail.fields.filter(field => {
            return field.availableFlag > 0;
          })
        : [];

      const filteredUnVailable = customerDetail.fields
        ? customerDetail.fields.filter(field => {
            return field.availableFlag <= 0;
          })
        : [];
      const customerFieldsAvailable = _.cloneDeep(customerDetail);
      customerFieldsAvailable.fields = filteredAvailable;
      const dataTabs = customerDetail.dataTabs;
      const tabListShow = customerDetail.tabsInfo
        ? customerDetail.tabsInfo.filter(tab => {
            return tab.isDisplay === true;
          })
        : [];
      tabListShow.map(elm => {
        dataTabs.map(dataTab => {
          if (dataTab.tabId === elm.tabId && elm.tabId === TAB_ID_LIST.task) {
            elm['badges'] = dataTab['data'] ? dataTab['data']['badges'] : null;
          }
          if (dataTab.tabId === elm.tabId && elm.tabId === TAB_ID_LIST.tradingProduct) {
            elm['badges'] =
              dataTab['data'] && dataTab['data']['dataInfo']
                ? dataTab['data']['dataInfo']['productTradingBadge']
                : null;
          }
        });
      });

      return {
        ...state,
        customerFieldsAvailable,
        customer: customerDetail,
        customerFieldsUnVailable: filteredUnVailable,
        tabListShow
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_CHANGE_HISTORY):
    case ACTION_TYPES.CUSTOMER_CHANGE_HISTORY: {
      return {
        ...state,
        changeHistory: {
          history: action.payload.data.customersHistory,
          isReset: action.meta.isReset
        }
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_GET_ACTIVITIES):
    case ACTION_TYPES.CUSTOMER_GET_ACTIVITIES: {
      return {
        ...state,
        tabActivities: []
      };
    }

    case SUCCESS(ACTION_TYPES.CUSTOMER_GET_CHILD_CUSTOMER): {
      return {
        ...state,
        customerChild: action.payload.data.childCustomers
      };
    }

    case SUCCESS(ACTION_TYPES.CUSTOMER_GET_PRODUCT_TRADING): {
      return {
        ...state,
        tabProductTrading: []
      };
    }
    case ACTION_TYPES.CUSTOMER_LIST_CHANGE_TO_DISPLAY:
      return {
        ...state,
        errorItems: [],
        screenMode: ScreenMode.DISPLAY
      };

    case ACTION_TYPES.CUSTOMER_LIST_CHANGE_TO_EDIT:
      return {
        ...state,
        screenMode: ScreenMode.EDIT
      };

    case SUCCESS(ACTION_TYPES.CUSTOMER_UPDATE_CUSTOM_FIELD_INFO): {
      const resUpdateCustomFieldInfo = action.payload.data;
      return {
        ...state,
        action: CustomerAction.UpdateCustomerSuccess,
        fieldIds: resUpdateCustomFieldInfo.fieldIds,
        tabInfoIds: resUpdateCustomFieldInfo.tabInfoIds,
        fieldInfoTabIds: resUpdateCustomFieldInfo.fieldInfoTabIds,
        messageUpdateCustomFieldInfoSuccess: 'INF_COM_0004'
      };
    }

    case SUCCESS(ACTION_TYPES.CUSTOMER_GET_URL_QUICKSIGHT): {
      return {
        ...state,
        action: CustomerAction.GetUrlQuicksightSuccess,
        urlQuicksight: action.payload.data.urlQuickSight
      };
    }

    case SUCCESS(ACTION_TYPES.CUSTOMER_GET_FOLLOWED): {
      return {
        ...state,
        isFollowed: action.payload.data.followeds && action.payload.data.followeds.length > 0
      };
    }

    case SUCCESS(ACTION_TYPES.CUSTOMER_COUNT_RELATION_CUSTOMER): {
      const res = action.payload.data;
      return {
        ...state,
        errorCountRelation: _.isNil(res && res.listCount) || res.listCount.length === 0,
        relationCustomerData: res && res.listCount
      };
    }
    case SUCCESS(ACTION_TYPES.CUSTOMER_CREATE_FOLLOW):
    case SUCCESS(ACTION_TYPES.CUSTOMER_DELETE_FOLLOW): {
      return {
        ...state,
        isFollowed: !state.isFollowed
      };
    }
    case ACTION_TYPES.CUSTOMER_DETAIL_RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

/**
 * Get customer detail
 */
export const getCustomerDetail = param => ({
  type: ACTION_TYPES.CUSTOMER_DETAIL_CUSTOMER_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-customer`,
    {
      mode: param.mode,
      customerId: +param.customerId,
      isGetDataOfEmployee: param.isGetDataOfEmployee,
      isGetChildCustomer: param.isGetChildCustomer,
      childCustomerIds: param.childCustomerIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Action init customer detail
 */
export const handleInitCustomerDetail = param => async (dispatch, getState) => {
  if (_.get(param, 'customerId')) {
    await dispatch(getCustomerDetail(param));
  }
};

export const getCustomerFollowed = param => ({
  type: ACTION_TYPES.CUSTOMER_GET_FOLLOWED,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.TIMELINES_SERVICE_PATH}/get-followeds`,
    {
      followTargetType: param.followTargetType,
      followTargetId: param.followTargetId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetCustomerFollowed = param => async (dispatch, getState) => {
  await dispatch(getCustomerFollowed(param));
};
/**
 * Follow
 * @param param
 */
export const createFollowed = param => ({
  type: ACTION_TYPES.CUSTOMER_CREATE_FOLLOW,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.TIMELINES_SERVICE_PATH}/create-followed`,
    {
      followTargetType: param.followTargetType,
      followTargetId: param.followTargetId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Action follow
 * @param param
 */
export const handleCreateFollowed = param => async (dispatch, getState) => {
  await dispatch(createFollowed(param));
};

/**
 * Unfollow
 * @param param
 */
export const deleteFollowed = param => ({
  type: ACTION_TYPES.CUSTOMER_DELETE_FOLLOW,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.TIMELINES_SERVICE_PATH}/delete-followeds`,
    {
      followeds: [
        {
          followTargetType: param.followTargetType,
          followTargetId: param.followTargetId
        }
      ]
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Aciton unfollow
 * @param param
 */
export const handleDeleteFollowed = param => async (dispatch, getState) => {
  await dispatch(deleteFollowed(param));
};

/**
 * Delete customer
 */
export const deleteCustomer = customerId => ({
  type: ACTION_TYPES.CUSTOMER_DETAIL_DELETE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/delete-customers`,
    {
      customerIds: [customerId]
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Action delete customer
 */
export const handleInitDeleteCustomer = customerId => async (dispatch, getState) => {
  if (customerId != null) {
    await dispatch(deleteCustomer(customerId));
  }
};

export const getChangeHistory = (customerId, page, limit, isReset) => ({
  type: ACTION_TYPES.CUSTOMER_CHANGE_HISTORY,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-customer-history`,
    {
      customerId,
      currentPage: page,
      limit
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { isReset }
});

export const handleInitChangeHistory = (customerId, page, limit, isReset) => async (
  dispatch,
  getState
) => {
  await dispatch(getChangeHistory(customerId, page, limit, isReset));
};

export const getActivities = (customerId, page, limit) => ({
  type: ACTION_TYPES.CUSTOMER_GET_ACTIVITIES,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-activities`,
    {
      customerId,
      currentPage: page,
      limit
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetActivities = (customerId, page, limit) => async (dispatch, getState) => {
  await dispatch(getActivities(customerId, page, limit));
};

export const getProductTradingTab = (tabBelong, currentPage, limit, searchConditions) => ({
  type: ACTION_TYPES.CUSTOMER_GET_PRODUCT_TRADING,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-product-trading-tab`,
    {
      tabBelong,
      currentPage,
      limit,
      searchConditions
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetProductTradingTab = (
  tabBelong,
  currentPage,
  limit,
  searchConditions
) => async (dispatch, getState) => {
  await dispatch(getProductTradingTab(tabBelong, currentPage, limit, searchConditions));
};

export const getTasksTabElementSummary = customerId => ({
  type: ACTION_TYPES.CUSTOMER_GET_TASKS,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/'get-tasks-tab`,
    {
      customerId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetTasksTabElementSummary = customerId => async (dispatch, getState) => {
  await dispatch(getTasksTabElementSummary(customerId));
};

export const getCustomerChild = customerId => ({
  type: ACTION_TYPES.CUSTOMER_GET_CHILD_CUSTOMER,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-child-customers`,
    {
      customerId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetCustomerChild = customerId => async (dispatch, getState) => {
  await dispatch(getCustomerChild(customerId));
};

const getUrlQuicksight = customerId => ({
  type: ACTION_TYPES.CUSTOMER_GET_URL_QUICKSIGHT,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-url-quicksight`,
    { customerId },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const changeScreenMode = (isEdit: boolean) => ({
  type: isEdit
    ? ACTION_TYPES.CUSTOMER_LIST_CHANGE_TO_EDIT
    : ACTION_TYPES.CUSTOMER_LIST_CHANGE_TO_DISPLAY
});

/**
 * handle reorder field
 */
export const handleReorderField = (dragIndex, dropIndex) => async (dispatch, getState) => {
  const { fieldInfos } = getState().customerList;
  const objectFieldInfos = JSON.parse(JSON.stringify(fieldInfos));

  if (
    objectFieldInfos &&
    objectFieldInfos.fieldInfoPersonals &&
    objectFieldInfos.fieldInfoPersonals.length > 0
  ) {
    // const objParam = [];
    const tempObject = objectFieldInfos.fieldInfoPersonals.splice(
      dragIndex,
      1,
      objectFieldInfos.fieldInfoPersonals[dropIndex]
    )[0]; // get the item from the array
    objectFieldInfos.fieldInfoPersonals.splice(dropIndex, 1, tempObject);
    // Todo for await dispatch
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    await sleep(1000);
  }
};

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
 * Get info relation list customers
 * @param customerIds
 */
export const handleCountRelationCustomers = customerIds => async (dispatch, getState) => {
  await dispatch(countRelationCustomers(customerIds));
};

const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
export const updateCustomFieldInfo = (
  fieldBelong,
  deletedFields,
  fields,
  tabs,
  deletedFieldsTab,
  fieldsTab
) => ({
  type: ACTION_TYPES.CUSTOMER_UPDATE_CUSTOM_FIELD_INFO,
  payload: axios.post(
    `${commonsApiUrl}/update-custom-fields-info`,
    {
      fieldBelong,
      deletedFields,
      fields,
      tabs,
      deletedFieldsTab,
      fieldsTab
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleUpdateCustomFieldInfo = (
  fieldBelong,
  deleteFields,
  fields,
  tabs,
  deleteFieldsTab,
  fieldsTab
) => async (dispatch, getState) => {
  if (fieldBelong != null) {
    // delete listFieldsItem
    if (fields && fields.length > 0) {
      fields.map(field => {
        delete field['listFieldsItem'];
      });
    }

    await dispatch(
      updateCustomFieldInfo(fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab)
    );
  }
};

export const reset = () => ({
  type: ACTION_TYPES.CUSTOMER_DETAIL_RESET
});

export const handleGetUrlQuicksight = customerId => async (dispatch, getState) => {
  await dispatch(getUrlQuicksight(customerId));
};
