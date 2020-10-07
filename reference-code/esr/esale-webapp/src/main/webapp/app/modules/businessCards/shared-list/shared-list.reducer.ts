import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { SHARE_LISTS_MODES, PARAM_GET_CUSTOM_FIELD_INFO, BUSINESS_CARD_DEF } from '../constants';
import _ from 'lodash';

export const ACTION_TYPES = {
  SHARED_LIST_GET: 'sharedList/GET',
  SHARED_LIST_CREATE: 'sharedList/CREATE',
  SHARED_LIST_UPDATE: 'sharedList/UPDATE',
  SHARED_LIST_RESET: 'sharedList/RESET',
  SHARED_LIST_DRAGDROP: 'sharedList/DRAGDROP',
  SHARED_LIST_RESET_ERROR: 'sharedList/RESET_ERROR',
  BUSINESS_CARD_LIST_CUSTOM_FIELD_INFO_GET_LIST: 'BusinessCardList/CUSTOM_FIELD_INFO_GET_LAYOUT',
  GET_EMPLOYEES: 'sharedList/GET_EMPLOYEES',
  GET_GENERAL_SETTING: 'sharedList/GET_GENERAL_SETTING',
  SIDEBAR_DELETE_LIST: 'sharedList/SIDEBAR_DELETE_LIST'
};
import StringUtils from 'app/shared/util/string-utils';

export enum SharedListAction {
  None,
  RequestInit,
  RequestCreate,
  RequestUpdate,
  ErrorModal,
  Doneinit,
  DoneModal,
  ErrorValidate,
  CreateUpdateGroupSuccess
}

const initialState = {
  action: SharedListAction.None,
  group: null,
  errorItems: [],
  isSuccess: null,
  errorMessageInModal: [],
  errorMessage: [],
  rowIds: [],
  listFieldSearch: [],
  listUpdateTime: null,
  // customFieldsInfo: [],
  groupParticipants: [],
  updatedGroupId: null,
  employees: null,
  ownerList: null,
  viewerList: null,
  isOverwrite: null
};

const parseCustomFieldsInfoResponse = (res, type) => {
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
  const fieldInfos = res.data;
  if (fieldInfos.customFieldsInfo) {
    fieldInfos.customFieldsInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { errorMsg, errorCodeList, fieldInfos };
};

const parseInitSharedGroupResponse = res => {
  let errorMsg = [];
  if (res.errors && res.errors.length > 0) {
    errorMsg = res.errors[0].message ? res.errors[0].message : [];
  }
  const action = errorMsg.length > 0 ? SharedListAction.ErrorModal : SharedListAction.Doneinit;
  let listFieldSearch = [];
  let group = {};
  // if (res.data.data && res.data.data.businessCardsList.businessCardList) {
  if (res.data && res.data.businessCardList) {
    group = res.data.businessCardList[0];
  }

  if (res.data && res.data.businessCardList[0].searchConditions) {
    // listFieldSearch = res.data.businessCardList[0].searchConditions;
    listFieldSearch = res.data.businessCardList[0].searchConditions.sort(
      (a, b) => a.fieldOrder - b.fieldOrder
    );
    listFieldSearch = listFieldSearch.map(sc => {
      const valueCheck = sc.searchValue;
      if (valueCheck && valueCheck.trim()) {
        return { ...sc, isSearchBlank: false, fieldValue: valueCheck };
      }
      return { ...sc, isSearchBlank: true, fieldValue: valueCheck };
    });
  }
  const groupParticipants = [];
  let ownerList;
  if (res.data && res.data.businessCardList[0].ownerList) {
    ownerList = res.data.businessCardList[0].ownerList.map(item => {
      return { ...item, participantType: 2 };
    });
    groupParticipants.push(...ownerList);
  }
  let viewerList;
  if (res.data && res.data.businessCardList[0].viewerList) {
    viewerList = res.data.businessCardList[0].viewerList.map(item => {
      return { ...item, participantType: 1 };
    });
    groupParticipants.push(...viewerList);
  }
  let isOverwrite = null;
  if (res.data && res.data.businessCardList[0]) {
    isOverwrite = res.data.businessCardList[0].isOverWrite === 1;
  }
  return {
    errorMsg,
    action,
    listFieldSearch,
    groupParticipants,
    group,
    ownerList,
    viewerList,
    isOverwrite
  };
};

const parseListEmployeeResponse = res => {
  let employees = null;
  employees = res.data.employees;
  if (
    res.data &&
    res.data.employees &&
    res.data.employees.employees &&
    res.data.employees.employees.length > 0
  ) {
    employees.employees.forEach((element, idx) => {
      const employeeData = element.employeeData;
      const newElement = {};
      for (const prop in element) {
        if (Object.prototype.hasOwnProperty.call(element, prop) && prop !== 'employeeData') {
          newElement[StringUtils.camelCaseToSnakeCase(prop)] = element[prop];
        }
      }
      employeeData.forEach(e => {
        newElement[e.key] = e.value;
      });
      employees.employees[idx] = newElement;
    });
  }
  return { employees };
};

const parseResponseGetSetting = res => {
  let errorCode = '';
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
  if (errorItems.length > 0) {
    errorCode = errorItems[0].errorCode;
  }
  const action = hasErrors
    ? SharedListAction.ErrorValidate
    : SharedListAction.CreateUpdateGroupSuccess;

  let listUpdateTime = null;
  if (res.data && res.data.settingValue) {
    const settingValue = JSON.parse(res.data.settingValue);
    if (settingValue && settingValue.listUpdateTime) {
      listUpdateTime = JSON.parse(res.data.settingValue).listUpdateTime;
    }
  }

  return { action, errorCode, errorItems, listUpdateTime };
};

export const parseErrorRespose = payload => {
  let errorMes = [];
  if (payload.response.data.parameters) {
    if (payload.response.data.parameters.message) {
      errorMes[0] = payload.response.data.parameters.message;
    } else if (payload.response.data.parameters.extensions) {
      const resError = payload.response.data.parameters.extensions;
      if (resError.errors) {
        errorMes = resError.errors;
      }
    }
  }
  return errorMes;
};

const parseCreateUpdateSharedGroupResponse = res => {
  const errorMsg = [];
  let isSuccess = true;
  const errorItems = [];
  const rowIds = [];
  if (res.data.errors && res.data.errors.length > 0) {
    if (res.data.errors[0].extensions && res.data.errors[0].extensions.errors.length > 0) {
      for (let i = 0; i < res.data.errors[0].extensions.errors.length; i++) {
        errorMsg.push(res.data.errors[0].extensions.errors[i].errorCode);
        errorItems.push(res.data.errors[0].extensions.errors[i].item);
        rowIds.push(res.data.errors[0].extensions.errors[i].rowId);
      }
    }

    isSuccess = false;
  }
  const action =
    errorItems && errorItems.length > 0
      ? SharedListAction.ErrorValidate
      : SharedListAction.CreateUpdateGroupSuccess;
  const groupId = res.data.businessCardListDetailId;
  return { errorMsg, errorItems, action, groupId, rowIds, isSuccess };
};

export type SharedListState = Readonly<typeof initialState>;

// Reducer
export default (state: SharedListState = initialState, action): SharedListState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SHARED_LIST_GET):
      return {
        ...state,
        action: SharedListAction.RequestInit
      };
    case REQUEST(ACTION_TYPES.SHARED_LIST_CREATE):
      return {
        ...state,
        action: SharedListAction.RequestCreate
      };
    case REQUEST(ACTION_TYPES.SHARED_LIST_UPDATE):
      return {
        ...state,
        action: SharedListAction.RequestUpdate
      };
    case REQUEST(ACTION_TYPES.GET_GENERAL_SETTING):
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.SHARED_LIST_GET):
    case FAILURE(ACTION_TYPES.SHARED_LIST_CREATE):
    case FAILURE(ACTION_TYPES.GET_GENERAL_SETTING):
    case FAILURE(ACTION_TYPES.SHARED_LIST_UPDATE): {
      const res = parseErrorRespose(action.payload);
      return {
        ...state,
        action: SharedListAction.ErrorModal,
        errorItems: res,
        errorMessage: res[0].errorCode ? ['messages.' + res[0].errorCode] : [action.payload.message]
      };
    }
    case SUCCESS(ACTION_TYPES.SHARED_LIST_GET):
    case ACTION_TYPES.SHARED_LIST_GET: {
      const res1 = parseInitSharedGroupResponse(action.payload);
      return {
        ...state,
        action: res1.action,
        errorMessageInModal: res1.errorMsg,
        group: res1.group,
        listFieldSearch: res1.listFieldSearch,
        groupParticipants: res1.groupParticipants,
        ownerList: res1.ownerList,
        viewerList: res1.viewerList,
        isOverwrite: res1.isOverwrite
      };
    }
    case SUCCESS(ACTION_TYPES.GET_GENERAL_SETTING): {
      const resSetting = parseResponseGetSetting(action.payload);
      return {
        ...state,
        listUpdateTime: resSetting.listUpdateTime
      };
    }
    case SUCCESS(ACTION_TYPES.SHARED_LIST_CREATE):
    case SUCCESS(ACTION_TYPES.SHARED_LIST_DRAGDROP):
    case SUCCESS(ACTION_TYPES.SHARED_LIST_UPDATE):
    case ACTION_TYPES.SHARED_LIST_DRAGDROP:
    case ACTION_TYPES.SHARED_LIST_CREATE:
    case ACTION_TYPES.SHARED_LIST_UPDATE: {
      const res2 = parseCreateUpdateSharedGroupResponse(action.payload);
      return {
        ...state,
        action: res2.action,
        errorItems: res2.errorItems,
        updatedGroupId: res2.groupId,
        rowIds: res2.rowIds,
        errorMessageInModal: res2.errorMsg,
        isSuccess: res2.isSuccess
      };
    }
    case SUCCESS(ACTION_TYPES.GET_EMPLOYEES): {
      const res3 = parseListEmployeeResponse(action.payload.data);
      return {
        ...state,
        employees: res3.employees
      };
    }
    case ACTION_TYPES.SHARED_LIST_RESET_ERROR:
      return {
        ...state,
        errorItems: [],
        errorMessageInModal: null
      };
    case ACTION_TYPES.SHARED_LIST_RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// API base URL
const businessCardsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.BUSINESS_CARD_SERVICE_PATH;
const employeesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;
const commonsApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
const generalSettingApiURL = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
/**
 * getInitialGroupInfos
 *
 * @param
 */
export const getBusinessCardsList = (businessCardListDetailId, isOwnerGroup, isAutoGroup) => ({
  type: ACTION_TYPES.SHARED_LIST_GET,
  payload: axios.post(
    `${businessCardsApiUrl}/get-business-cards-list`,
    {
      businessCardListDetailIds: [businessCardListDetailId]
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * createGroup
 *
 * @param groupParams
 */
const createGroup = (
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  searchConditions,
  listOfBusinessCardId
) => ({
  type: ACTION_TYPES.SHARED_LIST_CREATE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.BUSINESS_CARD_SERVICE_PATH}/create-business-cards-list`,
    {
      businessCardList: {
        businessCardListName,
        listType,
        listMode,
        ownerList,
        viewerList,
        isOverWrite
      },
      searchConditions,
      listOfBusinessCardId
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * updateGroup
 *
 * @param groupParams
 */
export const updateGroup = (
  businessCardListDetailId,
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  updatedDate,
  searchConditions
) => ({
  type: ACTION_TYPES.SHARED_LIST_UPDATE,
  payload: axios.post(
    `${businessCardsApiUrl}/update-business-cards-list`,
    {
      businessCardListDetailId,
      businessCardList: {
        businessCardListName,
        listType,
        ownerList,
        viewerList,
        listMode,
        isOverWrite,
        updatedDate
      },
      searchConditions
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const getGeneralSetting = () => ({
  type: ACTION_TYPES.GET_GENERAL_SETTING,
  payload: axios.post(
    `${generalSettingApiURL}/get-general-setting`,
    {
      settingName: 'list_update_time'
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetGeneralSetting = () => async dispatch => {
  await dispatch(getGeneralSetting());
};

/**
 * Get List
 *
 */
export const handleInitListModal = (groupId, isOwnerGroup, isAutoGroup) => async dispatch => {
  await dispatch(getBusinessCardsList(groupId, isOwnerGroup, isAutoGroup));
};
export const reset = () => ({
  type: ACTION_TYPES.SHARED_LIST_RESET
});

/**
 * Submit List
 * @param businessCardListDetailId
 * @param businessCardListName
 * @param listType
 * @param listMode
 * @param ownerList
 * @param viewerList
 * @param isOverWrite
 * @param searchConditions
 * @param listOfBusinessCardId
 * @param updatedDate
 * @param groupMode
 */
export const handleSubmitListInfos = (
  businessCardListDetailId,
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  searchConditions,
  listOfBusinessCardId,
  updatedDate,
  groupMode: number
) => async (dispatch, getState) => {
  switch (groupMode) {
    case SHARE_LISTS_MODES.MODE_CREATE_GROUP:
    case SHARE_LISTS_MODES.MODE_CREATE_GROUP_LOCAL:
    case SHARE_LISTS_MODES.MODE_COPY_GROUP:
      await dispatch(
        createGroup(
          businessCardListName,
          listType,
          listMode,
          ownerList,
          viewerList,
          isOverWrite,
          searchConditions,
          listOfBusinessCardId
        )
      );
      break;
    case SHARE_LISTS_MODES.MODE_EDIT_GROUP:
    case SHARE_LISTS_MODES.MODE_SWICH_GROUP_TYPE:
      await dispatch(
        updateGroup(
          businessCardListDetailId,
          businessCardListName,
          listType,
          listMode,
          ownerList,
          viewerList,
          isOverWrite,
          updatedDate,
          searchConditions
        )
      );
      break;
    default:
      break;
  }
};

/**
 * reset state
 */
export const resetError = () => ({
  type: ACTION_TYPES.SHARED_LIST_RESET_ERROR
});

export const getCustomFieldsInfo = extensionBelong => ({
  type: ACTION_TYPES.BUSINESS_CARD_LIST_CUSTOM_FIELD_INFO_GET_LIST,
  payload: axios.post(
    `${commonsApiUrl}`,
    {
      query: PARAM_GET_CUSTOM_FIELD_INFO(BUSINESS_CARD_DEF.FIELD_BELONG)
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * Get Employees
 * @param params
 */
export const getEmployees = params => ({
  type: ACTION_TYPES.GET_EMPLOYEES,
  payload: axios.post(
    `${employeesApiUrl}/get-employees`,
    {
      searchConditions: params.searchConditions,
      filterConditions: params.filterConditions,
      localSearchKeyword: params.localSearchKeyword,
      selectedTargetType: params.selectedTargetType,
      selectedTargetId: params.selectedTargetId,
      isUpdateListView: params.isUpdateListView,
      orderBy: params.orderBy,
      offset: params.offset,
      limit: params.limit
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});
