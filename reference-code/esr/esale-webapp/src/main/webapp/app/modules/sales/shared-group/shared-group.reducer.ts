import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH, FIELD_BELONG } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
// import { PARAM_CREATE_SHARE_GROUP, PARAM_UPDATE_SHARE_GROUP } from 'app/modules/employees/constants';
// import { SHARE_GROUP_MODES, SHOW_MESSAGE_SUCCESS, PARTICIPANT_TYPE, API_URL, LIST_TYPE, LIST_MODE } from '../constants';
import { SHARE_GROUP_MODES, SHOW_MESSAGE_SUCCESS, PARTICIPANT_TYPE, API_URL } from '../constants';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import _ from 'lodash';
// import { jsonParse } from 'app/shared/util/string-utils';

export const ACTION_TYPES = {
  SHARED_GROUP_INITIAL: 'sharedGroup/SALES_INITIAL',
  SHARED_GROUP_CREATE: 'sharedGroup/CREATE',
  SHARED_GROUP_UPDATE: 'sharedGroup/SALES_UPDATE',
  SHARED_GROUP_RESET: 'sharedGroup/RESET',
  SHARED_GROUP_DRAGDROP: 'sharedGroup/DRAGDROP',
  SHARED_GROUP_RESET_ERROR: 'sharedGroup/RESET_ERROR',
  PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO: 'sales/CUSTOM_FIELD_INFO',
  SALES_LIST_RESET_SHARED_MSG_SUCCESS: 'sales/SALES_LIST_RESET_SHARED_MSG_SUCCESS',
  SALES_UPDATED_TIME: 'sharedGroup/SALES_UPDATED_TIME'
};

export enum SharedGroupAction {
  None,
  RequestInit,
  RequestCreate,
  RequestUpdate,
  ErrorModal,
  Doneinit,
  DoneModal,
  ErrorValidate,
  CreateUpdateGroupSuccess,
  requestFielInfo
}

const initialState = {
  action: SharedGroupAction.None,
  group: {},
  errorItems: [],
  isSuccess: null,
  errorMessageInModal: [],
  errorCodeInModal: '',
  rowIds: [],
  listFieldSearch: [],
  customFieldsInfo: [],
  groupParticipants: [],
  updatedGroupId: null,
  errorParams: [],
  listUpdateTime: null,
  msgSuccess: SHOW_MESSAGE_SUCCESS.NONE,
  autoGroupUpdatedTime: null
};

const reFormEmployee = (data: any, participantType: any) => {
  return {
    employeeGroupParticipantId: null,
    employeeId: data.employeeId,
    groupId: null,
    participantGroupId: null,
    positionName: '',
    departmentName: data.employeeDepartments[0] ? data.employeeDepartments[0].departmentName : null,
    createdUser: -1,
    departmentId: data.employeeDepartments[0] ? data.employeeDepartments[0].departmentId : null,
    updatedDate: '2020-07-05T23:52:48.453834Z',
    createdDate: '2020-07-05T23:52:48.453834Z',
    updatedUser: -1,
    participantType,
    actionId: 1,
    employeeName: data.employeeName,
    employeePhoto: data.employeePhoto,
    employeeSurname: data.employeeSurname,
    employeeDepartments: data.employeeDepartments
  };
};

const parseListUpdateTime = listUpdateTime => {
  try {
    const list = JSON.parse(listUpdateTime);
    if (list && list['listUpdateTime']) {
      return list['listUpdateTime'];
    }
  } catch (e) {
    return null;
  }
  return null;
};

const parseInitSharedGroupResponse = res => {
  let listFieldSearch = [];
  let group = {};
  if (res.data && res.data.productTradingList) {
    group = res.data.productTradingList[0];
  }
  if (res.data && res.data.productTradingList) {
    listFieldSearch = res.data.productTradingList[0].searchConditions;
  }
  let groupParticipants = [];
  if (res.data && res.data.productTradingList[0].ownerList) {
    const ownerList = res.data.productTradingList[0].ownerList.map((elm, index) => {
      return elm && reFormEmployee(elm, PARTICIPANT_TYPE.OWNER);
    });
    groupParticipants = [...groupParticipants, ...ownerList];
  }
  if (res.data && res.data.productTradingList[0].viewerList) {
    const viewerList = res.data.productTradingList[0].viewerList.map((elm, index) => {
      return elm && reFormEmployee(elm, PARTICIPANT_TYPE.VIEWER);
    });
    groupParticipants = [...groupParticipants, ...viewerList];
  }
  if (res.data && res.data.participantGroups) {
    res.data.participantGroups.forEach(element => {
      const paticipant = res.data.groupParticipants.filter(e => {
        return e.participantGroupId === element.groupId;
      });
      Object.assign(element, { participantType: paticipant[0].participantType });
      groupParticipants.push(element);
    });
  }
  // Get list_update_time
  let listUpdateTime = null;
  if (res.data) {
    listUpdateTime = parseListUpdateTime(res.data.listUpdateTime);
  }
  // remove if employee null
  groupParticipants = [...groupParticipants].filter(elm => elm);
  return { listFieldSearch, groupParticipants, group, listUpdateTime };
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

const parseErrorCreateUpdate = res => {
  const errorMsg = [];
  const errorItems = [];
  const rowIds = [];
  const errorParams = [];
  const errorList = res.parameters.extensions.errors;
  const hasErrors = errorList && errorList.length > 0;
  if (hasErrors) {
    for (let i = 0; i < errorList.length; i++) {
      errorMsg.push(errorList[i].errorCode);
      errorItems.push(errorList[i].item);
      rowIds.push(errorList[i].rowId);
      errorParams.push(errorList[i].errorParams);
    }
  } else {
    errorMsg.push(res.parameters.extensions.message);
  }
  return { errorMsg, errorItems, rowIds, errorParams };
};

export const parseErrorRespose = payload => {
  let errorMes = [];
  if (payload.response.data.parameters && payload.response.data.parameters.message) {
    errorMes[0] = payload.response.data.parameters.message;
  } else if (payload.response.data.parameters) {
    const resError = payload.response.data.parameters.extensions;
    if (resError.errors) {
      errorMes = resError.errors;
    }
  }
  return errorMes;
};

const parseCreateUpdateSharedGroupResponse = (res, EnumMsg) => {
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
      ? SharedGroupAction.ErrorValidate
      : SharedGroupAction.CreateUpdateGroupSuccess;
  const msgSuccess = errorItems && errorItems.length > 0 ? SHOW_MESSAGE_SUCCESS.NONE : EnumMsg;
  const groupId = res.data.productTradingListDetailId;
  return { errorMsg, errorItems, action, groupId, rowIds, isSuccess, errorParams, msgSuccess };
};

const parseCustomFieldsInfoResponse = res => {
  let customFieldsInfo = [];
  if (res.data) {
    customFieldsInfo = res.data.customFieldsInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  return { customFieldsInfo };
};

export const resetSharedMessageSuccess = () => ({
  type: ACTION_TYPES.SALES_LIST_RESET_SHARED_MSG_SUCCESS
});

export type SharedGroupSalesState = Readonly<typeof initialState>;

// Reducer
export default (state: SharedGroupSalesState = initialState, action): SharedGroupSalesState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SHARED_GROUP_INITIAL):
    case REQUEST(ACTION_TYPES.SALES_UPDATED_TIME):
    case REQUEST(ACTION_TYPES.PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO):
      return {
        ...state,
        action: SharedGroupAction.RequestInit
      };
    case REQUEST(ACTION_TYPES.SHARED_GROUP_CREATE):
      return {
        ...state,
        action: SharedGroupAction.RequestCreate
      };
    case REQUEST(ACTION_TYPES.SHARED_GROUP_UPDATE):
      return {
        ...state,
        action: SharedGroupAction.RequestUpdate
      };
    case FAILURE(ACTION_TYPES.SHARED_GROUP_INITIAL): {
      const resp = parseShareGroupFail(action.payload.response.data);
      return {
        ...state,
        action: SharedGroupAction.ErrorModal,
        errorMessageInModal: resp.errorMsg,
        errorCodeInModal: resp.errorCode
      };
    }
    case FAILURE(ACTION_TYPES.SALES_UPDATED_TIME): {
      const res = parseShareGroupFail(action.payload.response.data);
      return {
        ...state,
        action: SharedGroupAction.ErrorModal,
        errorMessageInModal: res.errorMsg
      };
    }
    case FAILURE(ACTION_TYPES.SHARED_GROUP_CREATE):
    case FAILURE(ACTION_TYPES.SHARED_GROUP_UPDATE): {
      const res = parseErrorCreateUpdate(action.payload.response.data);
      return {
        ...state,
        action: SharedGroupAction.ErrorModal,
        errorItems: res.errorItems,
        rowIds: res.rowIds,
        errorMessageInModal: res.errorMsg,
        errorParams: res.errorParams
      };
    }

    case SUCCESS(ACTION_TYPES.SHARED_GROUP_INITIAL):
    case ACTION_TYPES.SHARED_GROUP_INITIAL: {
      const res = parseInitSharedGroupResponse(action.payload);
      return {
        ...state,
        action: SharedGroupAction.Doneinit,
        group: res.group,
        listFieldSearch: res.listFieldSearch,
        groupParticipants: res.groupParticipants,
        // customFieldsInfo: res.customFieldsInfo,
        listUpdateTime: res.listUpdateTime
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO):
    case ACTION_TYPES.PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO: {
      const res = parseCustomFieldsInfoResponse(action.payload);
      return {
        ...state,
        action: SharedGroupAction.Doneinit,
        customFieldsInfo: res.customFieldsInfo
      };
    }
    case SUCCESS(ACTION_TYPES.SHARED_GROUP_CREATE):
    case ACTION_TYPES.SHARED_GROUP_CREATE: {
      const res = parseCreateUpdateSharedGroupResponse(action.payload, SHOW_MESSAGE_SUCCESS.CREATE);
      return {
        ...state,
        action: res.action,
        updatedGroupId: res.groupId,
        isSuccess: res.isSuccess,
        msgSuccess: res.msgSuccess
      };
    }
    case SUCCESS(ACTION_TYPES.SHARED_GROUP_DRAGDROP):
    case SUCCESS(ACTION_TYPES.SHARED_GROUP_UPDATE):
    case ACTION_TYPES.SHARED_GROUP_DRAGDROP:
    case ACTION_TYPES.SHARED_GROUP_UPDATE: {
      const res = parseCreateUpdateSharedGroupResponse(
        action.payload.data,
        SHOW_MESSAGE_SUCCESS.UPDATE
      );
      return {
        ...state,
        action: res.action,
        updatedGroupId: res.groupId,
        isSuccess: res.isSuccess,
        msgSuccess: res.msgSuccess
      };
    }
    case SUCCESS(ACTION_TYPES.SALES_UPDATED_TIME): {
      const res = action.payload.data;
      return {
        ...state,
        action: SharedGroupAction.None,
        autoGroupUpdatedTime: JSON.parse(res.settingValue).listUpdateTime
      };
    }
    case ACTION_TYPES.SHARED_GROUP_RESET_ERROR:
      return {
        ...state,
        errorItems: [],
        errorMessageInModal: null,
        msgSuccess: SHOW_MESSAGE_SUCCESS.NONE
      };
    case ACTION_TYPES.SALES_LIST_RESET_SHARED_MSG_SUCCESS:
      return {
        ...state,
        msgSuccess: SHOW_MESSAGE_SUCCESS.NONE
      };
    case ACTION_TYPES.SHARED_GROUP_RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// API base URL
const employeesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

const buildParamInitialGroup = (groupId, isOwnerGroup, isAutoGroup) => {
  const data = new FormData();
  data.append('groupId', groupId);
  data.append('isOwnerGroup', isOwnerGroup);
  data.append('isAutoGroup', isAutoGroup);
  return data;
};
/**
 * getInitialGroupInfos
 *
 * @param
 */
export const getInitialGroupInfos = groupIdParam => ({
  type: ACTION_TYPES.SHARED_GROUP_INITIAL,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'sales/api/get-product-tradings-list'}`,
    {
      productTradingListDetailId: groupIdParam
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

/**
 * getFieldInfoGroupShare
 *
 * @param
 */
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

/**
 * createGroup
 *
 * @param params
 */
const createGroup = params => ({
  type: ACTION_TYPES.SHARED_GROUP_CREATE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}/create-product-tradings-list`,
    params,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

/**
 * updateSalesGroup
 *
 * @param params
 */
export const updateSalesGroup = params => ({
  type: ACTION_TYPES.SHARED_GROUP_UPDATE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}/update-product-tradings-list`,
    params,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

/**
 * getGeneralSetting
 *
 * @param params
 */
export const getGeneralSetting = params => ({
  type: ACTION_TYPES.SALES_UPDATED_TIME,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.COMMON_SERVICE_PATH}/get-general-setting`,
    {
      settingName: params
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetGeneralSetting = settingName => async dispatch => {
  await dispatch(getGeneralSetting(settingName));
};

export const handleInitGroupModal = groupId => async dispatch => {
  await dispatch(getInitialGroupInfos(groupId));
};
export const reset = () => ({
  type: ACTION_TYPES.SHARED_GROUP_RESET
});

const newFromCreateGroup = (
  groupName,
  groupType,
  isAutoGroup,
  isOverWrite,
  groupMembersParam,
  groupParticipantsParam,
  searchConditionsParam,
  listOfproductTradingId = []
) => {
  const data = {};
  data[`productTradingList`] = {
    productTradingListName: groupName,
    listType: groupType,
    listMode: isAutoGroup === true ? 2 : 1,
    ownerList: groupParticipantsParam
      .filter(y => y.participantType === PARTICIPANT_TYPE.OWNER)
      .map(x2 => {
        if (x2.employeeId) {
          return x2.employeeId;
        }
      }),
    viewerList: groupParticipantsParam
      .filter(y => y.participantType === PARTICIPANT_TYPE.VIEWER)
      .map(x1 => {
        if (x1.employeeId) {
          return x1.employeeId;
        }
      }),
    isOverWrite: isOverWrite ? 1 : 0
  };
  data[`searchConditions`] = searchConditionsParam;
  data[`listOfproductTradingId`] = listOfproductTradingId.map(elm => elm.productTradingId);
  return data;
};

const newFormUpdateGroup = (
  groupId,
  groupName,
  groupType,
  isAutoGroup,
  isOverWrite,
  groupParticipantsParam,
  searchConditionsParam
) => {
  const data = {};
  data[`productTradingList`] = {
    productTradingListName: groupName,
    listType: groupType,
    listMode: isAutoGroup ? 2 : 1,
    ownerList: groupParticipantsParam
      .filter(y => y.participantType === PARTICIPANT_TYPE.OWNER)
      .map(x3 => {
        if (x3.employeeId) {
          return x3.employeeId;
        }
      }),
    viewerList: groupParticipantsParam
      .filter(y => y.participantType === PARTICIPANT_TYPE.VIEWER)
      .map(x4 => {
        if (x4.employeeId) {
          return x4.employeeId;
        }
      }),
    isOverWrite: isOverWrite ? 1 : 0
  };
  data[`searchConditions`] = searchConditionsParam;
  data[`productTradingListDetailId`] = groupId;
  return data;
};

export const convertMyListToShareList = params => {
  return {
    type: ACTION_TYPES.SHARED_GROUP_UPDATE,
    payload: axios.post(
      `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}${API_URL.CHANGE_MY_LIST_TO_SHARED_LIST}`,
      params,
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  };
};

export const handleSubmitGroupInfos = (
  groupId,
  groupName,
  groupType,
  isAutoGroup,
  isOverWrite,
  groupMembersParam,
  groupParticipantsParam,
  searchConditionsParam,
  groupMode: number,
  listOfproductTradingId
) => async (dispatch, getState) => {
  switch (groupMode) {
    case SHARE_GROUP_MODES.MODE_CREATE_GROUP:
    case SHARE_GROUP_MODES.MODE_CREATE_GROUP_LOCAL:
    case SHARE_GROUP_MODES.MODE_COPY_GROUP:
      await dispatch(
        createGroup(
          newFromCreateGroup(
            groupName,
            groupType,
            isAutoGroup,
            isOverWrite,
            groupMembersParam,
            groupParticipantsParam,
            searchConditionsParam,
            listOfproductTradingId
          )
        )
      );
      break;
    case SHARE_GROUP_MODES.MODE_EDIT_GROUP:
      await dispatch(
        updateSalesGroup(
          newFormUpdateGroup(
            groupId,
            groupName,
            groupType,
            isAutoGroup,
            isOverWrite,
            groupParticipantsParam,
            searchConditionsParam
          )
        )
      );
      break;
    case SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE:
      await dispatch(
        convertMyListToShareList(
          newFormUpdateGroup(
            groupId,
            groupName,
            groupType,
            isAutoGroup,
            isOverWrite,
            groupParticipantsParam,
            searchConditionsParam
          )
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
  type: ACTION_TYPES.SHARED_GROUP_RESET_ERROR
});
