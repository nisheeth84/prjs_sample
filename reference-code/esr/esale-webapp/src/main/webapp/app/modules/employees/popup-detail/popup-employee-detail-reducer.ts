import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, ScreenMode, FIELD_BELONG } from 'app/config/constants';
import { API_CONFIG, AVAILABLE_FLAG } from 'app/config/constants';
import { convertFieldType } from 'app/shared/util/fieldType-utils';

import {
  DUMMY_EMPLOYEE_DETAIL,
  DUMMY_CUSTOMER_DATA,
  DUMMY_TASK_DATA,
  PARAM_GET_EMPLOYEE_DETAIL,
  PARAM_CHANGE_EMPLOYEE_STATUS,
  DUMMY_USER_LOGIN,
  DUMMY_LIST_FAVORITE_GROUP,
  DUMMY_TRADING_PRODUCTS,
  DUMMY_BUSINESS_CARDS_TAB,
  DUMMY_CALENDAR_MONTH,
  DUMMY_GROUPS,
  PARAM_UPDATE_CUSTOM_FIELD_INFO,
  TAB_ID_LIST
} from 'app/modules/employees/constants';
import _ from 'lodash';
import { modeScreenType } from 'app/shared/util/fieldType-utils';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import StringUtils, { parseErrorRespose } from 'app/shared/util/string-utils';

export const ACTION_TYPES = {
  EMPLOYEE_UNFOLLOW: 'employeeDetail/UNFOLLOW',
  EMPLOYEE_FOLLOW: 'employeeDetail/FOLLOW',
  EMPLOYEE_GET_FOLLOWS: 'employeeDetail/GET_FOLLOWS',
  EMPLOYEE_DETAIL_EMPLOYEE_GET: 'employeeDetail/EMPLOYEE_GET_DETAIL',
  EMPLOYEE_DETAIL_CHANGE_STATUS: 'employeeDetail/EMPLOYEE_CHANGE_STATUS',
  EMPLOYEE_LIST_CHANGE_TO_EDIT: 'employeeDetail/EDIT',
  EMPLOYEE_LIST_CHANGE_TO_DISPLAY: 'employeeDetail/DISPLAY',
  CUSTOMER_DATA_GET: 'employeeDetail/CUSTOMER_GET_TAB',
  TASK_DATA_GET: 'employeeDetail/TASK_GET_TAB',
  EMPLOYEE_DETAIL_GROUPS: 'employeeDetail/EMPLOYEE_GROUPS',
  EMPLOYEE_USER_LOGIN: 'employeeDetail/EMPLOYEE_USER_LOGIN',
  LIST_FAVORITE_GROUP_GET: 'employeeDetail/LIST_FAVORITE_GROUP_GET',
  EMPLOYEE_TRADING_PRODUCTS: 'employeeDetail/EMPLOYEE_TRADING_PRODUCTS',
  EMPLOYEE_BUSINESS_CARDS: 'employeeDetail/EMPLOYEE_BUSINESS_CARDS',
  EMPLOYEE_CALENDAR_MONTH: 'employeeDetail/EMPLOYEE_CALENDAR_MONTH',
  EMPLOYEE_CHANGE_HISTORY: 'employeeDetail/EMPLOYEE_EMPLOYEE_CHANGE_HISTORY',
  EMPLOYEE_GET_EMPLOYEE_LAYOUT: 'employeeDetail/EMPLOYEE_GET_EMPLOYEE_LAYOUT',
  EMPLOYEE_DETAIL_UPDATE_SCREEN_LAYOUT: 'employeeDetail/UPDATE_SCREEN_LAYOUT',
  EMPLOYEE_DETAIL_RESET: 'employeeDetail/RESET',
  EMPLOYEE_UPDATE_CUSTOM_FIELD_INFO: 'employeeDetail/EMPLOYEE_UPDATE_CUSTOM_FIELD_INFO',
  GET_BUSINESS_CARDS_TAB: 'employeeDetail/GET_BUSINESS_CARDS_TAB',
  GET_CUSTOMER_LAYOUT_TAB: 'employeeDetail/GET_CUSTOMER_LAYOUT_TAB',
};

export enum EmployeeAction {
  None,
  RequestDetail,
  RequestPopup,
  ErrorList,
  ErrorPopup,
  DoneList,
  DonePopup,
  UpdateEmployeeSuccess,
  UpdateEmployeeFailure,
  RequestCustomer,
  RequestTask,
  UpdateSuccess
}

// const initialState = {
//   action: EmployeeAction.None,
//   screenMode: ScreenMode.DISPLAY,
//   errorMessageInList: null,
//   errorItems: null,
//   errorMessageChangeStatusFailed: null,
//   fieldInfos: null,
//   customFieldInfos: null,
//   fieldSearchInfos: null,
//   customFieldSearchInfos: null,
//   employee: null,
//   customers: null,
//   task: null,
//   employeesCheckList: null,
//   groupId: null,
//   groups: null,
//   userLogin: null,
//   listFavoriteGroup: null,
//   tradingProducts: null,
//   businessCards: DUMMY_BUSINESS_CARDS_TAB,
//   calendarMonth: null,
//   changeHistory: null,
//   employeeLayout: null,
//   dummyEmployees: null,
//   employeeFieldsUnVailable: null,
//   messageDeleteSuccess: null,
//   messageChangeStatusSuccess: null,
//   tabListShow: null,
//   employeeFieldsAvailable: null,
//   fieldIds: null,
//   tabInfoIds: null,
//   fieldInfoTabIds: null,
//   messageUpdateCustomFieldInfoSuccess: null,
//   messageUpdateCustomFieldInfoError: null,
//   isFollowed: false
// };

interface IEmployeeDetailStateData {
  action: EmployeeAction,
  screenMode: ScreenMode,
  errorMessageInList: any,
  errorItems: any,
  errorMessageChangeStatusFailed: any,
  fieldInfos: any,
  customFieldInfos: any,
  fieldSearchInfos: any,
  customFieldSearchInfos: any,
  employee: any,
  customers: any,
  task: any,
  employeesCheckList: any,
  groupId: any,
  groups: any,
  userLogin: any,
  listFavoriteGroup: any,
  tradingProducts: any,
  businessCards: any,
  calendarMonth: any,
  changeHistory: any,
  employeeLayout: any,
  dummyEmployees: any,
  employeeFieldsUnVailable: any,
  messageDeleteSuccess: any,
  messageChangeStatusSuccess: any,
  tabListShow: any,
  employeeFieldsAvailable: any,
  fieldIds: any,
  tabInfoIds: any,
  fieldInfoTabIds: any,
  messageUpdateCustomFieldInfoSuccess: any,
  messageUpdateCustomFieldInfoError: any,
  isFollowed: boolean,
  customerLayout: any,
}

const defaultStateValue = {
  action: EmployeeAction.None,
  screenMode: ScreenMode.DISPLAY,
  errorMessageInList: null,
  errorItems: null,
  errorMessageChangeStatusFailed: null,
  fieldInfos: null,
  customFieldInfos: null,
  fieldSearchInfos: null,
  customFieldSearchInfos: null,
  employee: null,
  customers: null,
  task: null,
  employeesCheckList: null,
  groupId: null,
  groups: null,
  userLogin: null,
  listFavoriteGroup: null,
  tradingProducts: null,
  businessCards: null,
  calendarMonth: null,
  changeHistory: null,
  employeeLayout: null,
  dummyEmployees: null,
  employeeFieldsUnVailable: null,
  messageDeleteSuccess: null,
  messageChangeStatusSuccess: null,
  tabListShow: null,
  employeeFieldsAvailable: null,
  fieldIds: null,
  tabInfoIds: null,
  fieldInfoTabIds: null,
  messageUpdateCustomFieldInfoSuccess: null,
  messageUpdateCustomFieldInfoError: null,
  isFollowed: false,
  customerLayout: null,
};

const initialState = {
  data: new Map<string, IEmployeeDetailStateData>()
};

const parseErrorUpdate = res => {
  const errorData = [];
  if (res.errors && res.errors.length > 0) {
    res.errors.map(item => {
      if (item.extensions) {
        item.extensions.errors.map(error => {
          errorData.push(error.errorCode);
        });
      }
    });
  }
  return errorData.filter((item, index) => errorData.indexOf(item) === index);
};

const convertFieldLabel = (fields: any[]) => {
  const listField = [];
  if (!fields) {
    return listField;
  }
  fields.forEach(e => {
    const obj = _.cloneDeep(e);
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
    if (
      _.toString(obj.fieldType) === DEFINE_FIELD_TYPE.LOOKUP &&
      obj.lookupData &&
      obj.lookupData.itemReflect
    ) {
      obj.lookupData.itemReflect.forEach((item, idx) => {
        if (_.has(item, 'fieldLabel') && !_.isString(item.fieldLabel)) {
          obj.lookupData.itemReflect[idx].fieldLabel = JSON.stringify(item.fieldLabel);
        }
      });
    }
    listField.push(obj);
  });
  return listField;
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

// API base URL
const employeesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

export type EmployeeDetailState = Readonly<typeof initialState>;

const assignState = (state: EmployeeDetailState, namespace: string, params: any) => {
  if (state.data.has(namespace)) {
    _.assign(state.data.get(namespace), params);
  } else {
    const val = _.cloneDeep(defaultStateValue);
    _.assign(val, params);
    state.data.set(namespace, val);
  }
};

const actionRequestApi = (stateRequest, actionRequest) => {
  switch (actionRequest.type) {
    case REQUEST(ACTION_TYPES.EMPLOYEE_DETAIL_CHANGE_STATUS):
      assignState(stateRequest, actionRequest.meta.namespace, {
        messageChangeStatusSuccess: null,
        errorMessageChangeStatusFailed: null
      });
      return { ...stateRequest };
    case REQUEST(ACTION_TYPES.EMPLOYEE_FOLLOW):
    case REQUEST(ACTION_TYPES.EMPLOYEE_UNFOLLOW):
    case REQUEST(ACTION_TYPES.EMPLOYEE_DETAIL_EMPLOYEE_GET):
      assignState(stateRequest, actionRequest.meta.namespace, {
        action: EmployeeAction.RequestDetail,
        errorItems: null
      });
      return { ...stateRequest };
    case REQUEST(ACTION_TYPES.CUSTOMER_DATA_GET):
      assignState(stateRequest, actionRequest.meta.namespace, {
        action: EmployeeAction.RequestCustomer,
        errorItems: null
      });
      return { ...stateRequest };
    case REQUEST(ACTION_TYPES.EMPLOYEE_DETAIL_GROUPS):
    case REQUEST(ACTION_TYPES.EMPLOYEE_USER_LOGIN):
    case REQUEST(ACTION_TYPES.LIST_FAVORITE_GROUP_GET):
    case REQUEST(ACTION_TYPES.EMPLOYEE_TRADING_PRODUCTS):
    case REQUEST(ACTION_TYPES.EMPLOYEE_BUSINESS_CARDS):
    case REQUEST(ACTION_TYPES.EMPLOYEE_CALENDAR_MONTH):
    case REQUEST(ACTION_TYPES.EMPLOYEE_CHANGE_HISTORY):
    case REQUEST(ACTION_TYPES.EMPLOYEE_GET_EMPLOYEE_LAYOUT):
    case REQUEST(ACTION_TYPES.EMPLOYEE_UPDATE_CUSTOM_FIELD_INFO):
      assignState(stateRequest, actionRequest.meta.namespace, {
        messageUpdateCustomFieldInfoSuccess: null,
        messageUpdateCustomFieldInfoError: null
      });
      return { ...stateRequest };
    case REQUEST(ACTION_TYPES.TASK_DATA_GET):
      assignState(stateRequest, actionRequest.meta.namespace, {
        action: EmployeeAction.RequestTask,
        errorItems: null
      });
      return { ...stateRequest };
    default:
      break;
  }
};

const actionFailure = (stateRequestFailure, actionRequestFailure) => {
  switch (actionRequestFailure.type) {
    case FAILURE(ACTION_TYPES.EMPLOYEE_DETAIL_EMPLOYEE_GET):
    case FAILURE(ACTION_TYPES.EMPLOYEE_FOLLOW):
    case FAILURE(ACTION_TYPES.EMPLOYEE_UNFOLLOW):
    case FAILURE(ACTION_TYPES.EMPLOYEE_DETAIL_CHANGE_STATUS):
    case FAILURE(ACTION_TYPES.CUSTOMER_DATA_GET):
    case FAILURE(ACTION_TYPES.GET_CUSTOMER_LAYOUT_TAB):
    case FAILURE(ACTION_TYPES.TASK_DATA_GET):
    case FAILURE(ACTION_TYPES.EMPLOYEE_DETAIL_GROUPS):
    case FAILURE(ACTION_TYPES.EMPLOYEE_USER_LOGIN):
    case FAILURE(ACTION_TYPES.LIST_FAVORITE_GROUP_GET):
    case FAILURE(ACTION_TYPES.EMPLOYEE_TRADING_PRODUCTS):
    case FAILURE(ACTION_TYPES.EMPLOYEE_BUSINESS_CARDS):
    case FAILURE(ACTION_TYPES.EMPLOYEE_CALENDAR_MONTH):
    case FAILURE(ACTION_TYPES.EMPLOYEE_CHANGE_HISTORY):
    case FAILURE(ACTION_TYPES.EMPLOYEE_GET_EMPLOYEE_LAYOUT):
    case FAILURE(ACTION_TYPES.EMPLOYEE_UPDATE_CUSTOM_FIELD_INFO): {
      assignState(stateRequestFailure, actionRequestFailure.meta.namespace, {
        messageUpdateCustomFieldInfoError: parseErrorRespose(actionRequestFailure.payload)
      });
      return { ...stateRequestFailure };
    }
    default:
      break;
  }
};
// Reducer
export default (state: EmployeeDetailState = initialState, action): EmployeeDetailState => {
  const stateRequest = actionRequestApi(state, action);
  if (!_.isNil(stateRequest)) {
    return stateRequest;
  }
  const stateFailure = actionFailure(state, action);
  if (!_.isNil(stateFailure)) {
    return stateFailure;
  }
  switch (action.type) {
    case SUCCESS(ACTION_TYPES.EMPLOYEE_FOLLOW): {
      assignState(state, action.meta.namespace, {
        isFollowed: true
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_GET_FOLLOWS): {
      assignState(state, action.meta.namespace, {
        isFollowed: action.payload.data?.followeds?.length > 0
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_UNFOLLOW): {
      assignState(state, action.meta.namespace, {
        isFollowed: false
      });
      return { ...state };
    }

    case SUCCESS(ACTION_TYPES.EMPLOYEE_DETAIL_CHANGE_STATUS): {
      const errorChangeStatus = parseErrorUpdate(action.payload.data);
      if (errorChangeStatus.length > 0) {
        assignState(state, action.meta.namespace, {
          errorMessageChangeStatusFailed: errorChangeStatus
        });
      } else {
        assignState(state, action.meta.namespace, {
          messageChangeStatusSuccess: 'INF_COM_0004'
        });
      }
      return { ...state };
    }
    // case SUCCESS(ACTION_TYPES.CUSTOMER_DATA_GET):
    case SUCCESS(ACTION_TYPES.TASK_DATA_GET):
    case SUCCESS(ACTION_TYPES.EMPLOYEE_DETAIL_EMPLOYEE_GET): {
      const resEmployeeDetail = action.payload.data;
      const employeeDetail = Object.assign(resEmployeeDetail, DUMMY_EMPLOYEE_DETAIL);
      employeeDetail.fields = convertFieldType(
        employeeDetail.fields,
        modeScreenType.typeDetail
      ).filter(e => e.fieldName !== 'employee_managers' && e.fieldName !== 'employee_subordinates');
      const filteredAvailable = employeeDetail.fields.filter(field => {
        return field.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE;
      });

      // filteredAvailable = _.cloneDeep(reOrderSort(filteredAvailable));

      const filteredUnVailable = employeeDetail.fields.filter(field => {
        return field.availableFlag === AVAILABLE_FLAG.UNAVAILABLE;
      });

      // filteredUnVailable = reOrderSort(filteredUnVailable);

      const employeeFieldsAvailable = _.cloneDeep(employeeDetail);
      employeeFieldsAvailable.fields = filteredAvailable;

      const tabListShow = employeeDetail.tabsInfo.filter(tab => {
        return tab.isDisplay === true;
      });

      const dataTabs = employeeDetail.dataTabs || [];
      tabListShow.map(elm => {
        dataTabs.map(dataTab => {
          if (dataTab.tabId === elm.tabId && (elm.tabId === TAB_ID_LIST.task || elm.tabId === TAB_ID_LIST.calendar)) {
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
		assignState(state, action.meta.namespace, {
        employeeFieldsAvailable,
        employee: employeeDetail,
        employeeFieldsUnVailable: filteredUnVailable,
        tabListShow
		});
      return { ...state };
    }

    case SUCCESS(ACTION_TYPES.CUSTOMER_DATA_GET): {
      const res = parseListCustomerResponse(action.payload.data);
      assignState(state, action.meta.namespace, {
        customers: res.customers,
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.GET_CUSTOMER_LAYOUT_TAB): {
      assignState(state, action.meta.namespace, {
        customerLayout: action.payload.data?.fields,
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_BUSINESS_CARDS): {
      assignState(state, action.meta.namespace, {
        businessCards: {
          businessCardList: action.payload.data.businessCards,
          totalRecord: action.payload.data.totalRecords
        }
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.LIST_FAVORITE_GROUP_GET): {
      assignState(state, action.meta.namespace, {
        listFavoriteGroup: DUMMY_LIST_FAVORITE_GROUP
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_USER_LOGIN):
    case ACTION_TYPES.EMPLOYEE_USER_LOGIN:
      assignState(state, action.meta.namespace, {
        userLogin: DUMMY_USER_LOGIN
      });
      return { ...state };
    case ACTION_TYPES.TASK_DATA_GET: {
      const resTask = DUMMY_TASK_DATA;
      assignState(state, action.meta.namespace, {
        task: resTask
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_DETAIL_GROUPS):
    case ACTION_TYPES.EMPLOYEE_DETAIL_GROUPS:
      assignState(state, action.meta.namespace, {
        groups: DUMMY_GROUPS
      });
      return { ...state };
    case SUCCESS(ACTION_TYPES.EMPLOYEE_TRADING_PRODUCTS):
    case ACTION_TYPES.EMPLOYEE_TRADING_PRODUCTS:
      assignState(state, action.meta.namespace, {
        tradingProducts: DUMMY_TRADING_PRODUCTS
      });
      return { ...state };
    case SUCCESS(ACTION_TYPES.EMPLOYEE_CALENDAR_MONTH):
    case ACTION_TYPES.EMPLOYEE_CALENDAR_MONTH:
      assignState(state, action.meta.namespace, {
        calendarMonth: DUMMY_CALENDAR_MONTH
      });
      return { ...state };
    case SUCCESS(ACTION_TYPES.EMPLOYEE_CHANGE_HISTORY):
    case ACTION_TYPES.EMPLOYEE_CHANGE_HISTORY: {
      assignState(state, action.meta.namespace, {
        changeHistory: {
          history: action.payload.data.employeeHistory,
          isReset: action.meta.isReset
        }
      });
      return { ...state };
    }
    case SUCCESS(ACTION_TYPES.EMPLOYEE_GET_EMPLOYEE_LAYOUT):
    case ACTION_TYPES.EMPLOYEE_GET_EMPLOYEE_LAYOUT: {
      assignState(state, action.meta.namespace, {
        employeeLayout: action.payload.data.employeeLayout
      });
      return { ...state };
    }

    case SUCCESS(ACTION_TYPES.EMPLOYEE_UPDATE_CUSTOM_FIELD_INFO): {
      const resUpdateCustomFieldInfo = action.payload.data;
      assignState(state, action.meta.namespace, {
        action: EmployeeAction.UpdateSuccess,
        fieldIds: resUpdateCustomFieldInfo.fieldIds,
        tabInfoIds: resUpdateCustomFieldInfo.tabInfoIds,
        fieldInfoTabIds: resUpdateCustomFieldInfo.fieldInfoTabIds,
        messageUpdateCustomFieldInfoSuccess: 'INF_COM_0004'
      });
      return { ...state };
      // }
    }

    case ACTION_TYPES.EMPLOYEE_LIST_CHANGE_TO_DISPLAY:
      assignState(state, action.meta.namespace, {
        errorItems: [],
        screenMode: ScreenMode.DISPLAY
      });
      return { ...state };
    case ACTION_TYPES.EMPLOYEE_LIST_CHANGE_TO_EDIT:
      assignState(state, action.meta.namespace, {
        screenMode: ScreenMode.EDIT
      });
      return { ...state };
    case ACTION_TYPES.EMPLOYEE_DETAIL_RESET:
      if (state.data.has(action.meta.namespace)) {
        state.data.delete(action.meta.namespace);
      }
      return {...state};
    default:
      return state;
  }
};

export const getEmployeeDetail = (namespace: string, employeeId) => ({
  type: ACTION_TYPES.EMPLOYEE_DETAIL_EMPLOYEE_GET,
  payload: axios.post(
    `${employeesApiUrl}/get-employee`,
    PARAM_GET_EMPLOYEE_DETAIL(employeeId, 'detail'),
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  ),
  meta: { namespace }
});

// Have a param

export const getCalendarMonth = (namespace: string, employeeId) => ({
  type: ACTION_TYPES.EMPLOYEE_CALENDAR_MONTH,
  meta: { namespace }
});

// Have a param

export const getBusinessCards = (namespace: string, param) => ({
  type: ACTION_TYPES.EMPLOYEE_BUSINESS_CARDS,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/get-business-cards-tab`,
    param,
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { namespace }
});

// Have a param

export const getTradingProducts = (namespace: string, employeeId) => ({
  type: ACTION_TYPES.EMPLOYEE_TRADING_PRODUCTS,
  meta: { namespace }
});

export const getUserLogin = (namespace: string) => ({
  type: ACTION_TYPES.EMPLOYEE_USER_LOGIN,
  meta: { namespace }
});

// Have a param

export const getlistFavoriteGroup = (namespace: string, userLoginId) => ({
  type: ACTION_TYPES.LIST_FAVORITE_GROUP_GET,
  meta: { namespace }
});

// Have a param
export const getGroups = (namespace: string, employeeId) => ({
  type: ACTION_TYPES.EMPLOYEE_DETAIL_GROUPS,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/get-groups`,
    { employeeId },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { namespace }
});

export const handleInitEmployeeDetail = (namespace: string, param) => async (dispatch, getState) => {
  if (param != null) {
    await dispatch(getEmployeeDetail(namespace, param));
  }
};

// change status employee

export const changeEmployeeStatus = (namespace: string, employeeId, employeeStatus, updateDate) => ({
  type: ACTION_TYPES.EMPLOYEE_DETAIL_CHANGE_STATUS,
  payload: axios.post(
    employeesApiUrl + '/update-employee-status',
    PARAM_CHANGE_EMPLOYEE_STATUS(employeeId, employeeStatus, updateDate),
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  ),
  meta: { namespace }
});

export const getEmployeeFollowed = (namespace: string, watchTargetType, watchTargetId) => ({
  type: ACTION_TYPES.EMPLOYEE_GET_FOLLOWS,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.TIMELINES_SERVICE_PATH}/get-followeds`,
    {
      followTargetType: watchTargetType,
      followTargetId: watchTargetId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { namespace }
});

export const followEmployee = (namespace: string, watchTargetType, watchTargetId) => ({
  type: ACTION_TYPES.EMPLOYEE_FOLLOW,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.TIMELINES_SERVICE_PATH}/create-followed`,
    {
      followTargetType: watchTargetType,
      followTargetId: watchTargetId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { namespace }
});

export const unfollowEmployee = (namespace: string, followTargetType, followTargetId) => ({
  type: ACTION_TYPES.EMPLOYEE_UNFOLLOW,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.TIMELINES_SERVICE_PATH}/delete-followeds`,
    {
      followeds: [
        {
          followTargetType,
          followTargetId
        }
      ]
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { namespace }
});

// Have a param

export const getCustomerTab = (namespace: string, employeeId) => ({
  type: ACTION_TYPES.CUSTOMER_DATA_GET,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'customers/api/get-customers'}`,
    { selectedTargetId: employeeId, selectedTargetType: 1 },
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  ),
  meta: { namespace }
});

export const getTaskTab = (namespace: string, employeeId) => ({
  type: ACTION_TYPES.TASK_DATA_GET,
  meta: { namespace }
});

export const getChangHistory = (namespace: string, employeeId, currentPage, limit, isReset) => ({
  type: ACTION_TYPES.EMPLOYEE_CHANGE_HISTORY,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'employees/api/get-employee-history'}`,
    {
      employeeId,
      currentPage,
      limit
    },
    { headers: { ['Content-Type']: 'application/json' } }
  ),
  meta: { namespace, isReset }
});

export const getEmployeeLayout = (namespace: string) => ({
  type: ACTION_TYPES.EMPLOYEE_GET_EMPLOYEE_LAYOUT,
  payload: axios.post(`${employeesApiUrl}/get-employee-layout`, null, {
    headers: { ['Content-Type']: 'application/json' }
  }),
  meta: { namespace }
});

const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
export const updateCustomFieldInfo = (
  namespace: string,
  fieldBelong,
  deleteFields,
  fields,
  tabs,
  deleteFieldsTab,
  fieldsTab
) => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.EMPLOYEE_UPDATE_CUSTOM_FIELD_INFO,
    payload: axios.post(
      commonsApiUrl + '/update-custom-fields-info',
      PARAM_UPDATE_CUSTOM_FIELD_INFO(
        fieldBelong,
        deleteFields,
        convertFieldLabel(fields),
        tabs,
        deleteFieldsTab,
        fieldsTab
      ),
      { headers: { ['Content-Type']: 'application/json' } },
    ),
    meta: { namespace }
  });
};

export const handleUpdateCustomFieldInfo = (
  namespace: string,
  fieldBelong,
  deleteFields,
  fields,
  tabs,
  deleteFieldsTab,
  fieldsTab
) => async (dispatch, getState) => {
  if (fieldBelong != null) {
    await dispatch(
      updateCustomFieldInfo(namespace, fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab)
    );
  }
};

export const handleInitCustomerTab = (namespace: string, employeeId) => async (dispatch, getState) => {
  await dispatch(getCustomerTab(namespace, employeeId));
};

export const handleInitTaskTab = (namespace: string, param) => async (dispatch, getState) => {
  if (param != null) {
    await dispatch(getTaskTab(namespace, param));
  }
};

export const handleInitChangeEmployeeStatus = (namespace: string, employeeId, employeeStatus, updatedDate) => async (
  dispatch,
  getState
) => {
  if (employeeId != null && employeeStatus != null && updatedDate != null) {
    await dispatch(changeEmployeeStatus(namespace, employeeId, employeeStatus, updatedDate));
    await dispatch(getEmployeeDetail(namespace, employeeId));
  }
};

export const handleGetFollowEmployee = (namespace: string, watchTargetType, watchTargetId) => async dispatch => {
  await dispatch(getEmployeeFollowed(namespace, watchTargetType, watchTargetId));
};

export const handleInitFollowEmployee = (namespace: string, watchTargetType, watchTargetId) => async (
  dispatch,
  getState
) => {
  if (watchTargetType != null && watchTargetId != null) {
    await dispatch(followEmployee(namespace, watchTargetType, watchTargetId));
  }
};

export const handleInitUnfollowEmployee = (namespace: string, watchTargetType, watchTargetId) => async (
  dispatch,
  getState
) => {
  if (watchTargetType && watchTargetId) {
    await dispatch(unfollowEmployee(namespace, watchTargetType, watchTargetId));
  }
};

export const handleInitCalendarMonth = (namespace: string, param) => async (dispatch, getState) => {
  if (param != null) {
    await dispatch(getCalendarMonth(namespace, param));
  }
};

export const handleInitGroups = (namespace: string, param) => async (dispatch, getState) => {
  if (param != null) {
    await dispatch(getGroups(namespace, param));
  }
};

export const handleInitlistFavoriteGroup = (namespace: string, param) => async (dispatch, getState) => {
  if (param != null) {
    await dispatch(getlistFavoriteGroup(namespace, param));
  }
};

export const handleInitTradingProducts = (namespace: string, param) => async (dispatch, getState) => {
  if (param != null) {
    await dispatch(getTradingProducts(namespace, param));
  }
};

export const handleBusinessCards = (namespace: string, param) => async (dispatch, getState) => {
  if (param != null) {
    await dispatch(getBusinessCards(namespace, param));
  }
};

export const handleInitChangeHistory = (namespace: string, employeeId, currentPage, limit, isReset) => async (
  dispatch,
  getState
) => {
  await dispatch(getChangHistory(namespace, employeeId, currentPage, limit, isReset));
};

export const handleInitEmployeeLayout = (namespace: string) => async (dispatch, getState) => {
  await dispatch(getEmployeeLayout(namespace));
};

export const handleInitUserLogin = (namespace: string) => async (dispatch, getState) => {
  await dispatch(getUserLogin(namespace));
};

export const changeScreenMode = (namespace: string, isEdit: boolean) => ({
  type: isEdit
    ? ACTION_TYPES.EMPLOYEE_LIST_CHANGE_TO_EDIT
    : ACTION_TYPES.EMPLOYEE_LIST_CHANGE_TO_DISPLAY,
  meta: { namespace }
});

export const handleReorderField = (namespace: string, dragIndex, dropIndex) => async (dispatch, getState) => {
  const { fieldInfos } = getState().employeeList.data.get(namespace);
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

export const handleInitBusinessCardTab = (namespace: string, param) => async (dispatch, getState) => {
  await dispatch(getBusinessCards(namespace, param));
};

const getCustomerLayoutTab = (namespace: string) => ({
  type: ACTION_TYPES.GET_CUSTOMER_LAYOUT_TAB,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.CUSTOMER_SERVICE_PATH}/get-customer-layout`,
    null,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  ),
  meta: { namespace }
});

export const handleGetCustomerLayoutTab = (namespace: string) => async (dispatch, getState) => {
  await dispatch(getCustomerLayoutTab(namespace));
};

export const reset = (namespace: string) => ({
  type: ACTION_TYPES.EMPLOYEE_DETAIL_RESET,
  meta: { namespace }
});
