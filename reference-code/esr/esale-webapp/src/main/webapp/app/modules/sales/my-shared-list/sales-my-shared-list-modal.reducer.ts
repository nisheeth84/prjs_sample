import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { FIELD_BELONG, API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { SHOW_MESSAGE_SUCCESS, PARTICIPANT_TYPE } from '../constants';
import _ from 'lodash';
import { DynamicGroupModalAction } from 'app/shared/layout/dynamic-form/group/dynamic-group-modal.reducer.ts';
import { parseResInitializeGroup } from 'app/shared/layout/dynamic-form/group/dynamic-group-helper.ts';
import { GROUP_MODE_SCREEN } from 'app/shared/layout/dynamic-form/group/constants';

/**
 * CONST ACTION TYPES
 */
export const ACTION_TYPES = {
  INITIAL: 'sharedGroup/SALES_INITIAL',
  CREATE: 'sharedGroup/CREATE',
  UPDATE: 'sharedGroup/SALES_UPDATE',
  RESET: 'sharedGroup/RESET',
  RESET_ERROR: 'sharedGroup/RESET_ERROR',
  SALE_LIST_INITIALIZE_LIST_INFO: 'employeeList/INITIALIZE_LIST_INFO',
  PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO: 'sales/CUSTOM_FIELD_INFO'
};

/**
 * Initial State
 */
const initialState = {
  action: DynamicGroupModalAction.None,
  group: {},
  list: {},
  errorItems: [],
  isSuccess: null,
  errorMessageInModal: [],
  rowIds: [],
  listFieldSearch: [],
  customFieldsInfo: [],
  fieldBelong: [],
  customFieldsInfoRelation: [],
  listParticipants: [],
  updatedListId: null,
  errorParams: [],
  listUpdateTime: null,
  msgSuccess: null
};

type GroupType = {
  groupId: any;
  groupName: any;
  groupType: any;
  isAutoGroup: any;
  isOverWrite: any;
};

export const getInitializeListInfo = fieldBelong => ({
  type: ACTION_TYPES.PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO,
  payload: axios.post(
    `${API_CONTEXT_PATH + '/' + 'commons/api/get-custom-fields-info'}`,
    { fieldBelong: FIELD_BELONG.PRODUCT_TRADING },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetInitializeListInfo = fieldBelong => async (dispatch, getState) => {
  await dispatch(getInitializeListInfo(fieldBelong));
};

/**
 * Parse Init Shared Response
 * @param res
 */
let customFields = [];

const parseInitializeListInfo = res => {
  const action = DynamicGroupModalAction.Success;
  let initializeListInfo = [];
  let fields = [];
  if (res && res.initializeInfo) {
    initializeListInfo = res.initializeInfo;
  }
  if (res && res.fields && res.fields.length > 0) {
    fields = res.fields;
  }
  if (fields.length > 0) {
    customFields = fields;
  }
  return { action, initializeListInfo, fields };
};

const parseCustomFieldsInfoResponse = res => {
  let customFieldsInfo = [];
  if (res.data) {
    customFieldsInfo = res.data.customFieldsInfo.sort((a, b) => a.fieldOrder - b.fieldOrder);
  }
  if (customFieldsInfo.length > 0) {
    customFields = customFieldsInfo;
  }
  return { customFieldsInfo };
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

const parseInitSharedGroupResponse = resp => {
  if (_.isNil(resp.data)) {
    return;
  }
  // convert all to group
  let groups = {};
  if (resp.data && resp.data.productTradingList) {
    groups = resp.data.productTradingList[0];
  }
  const isAuto = groups['listMode'] !== 1;

  const group: GroupType = {
    groupId: groups['productTradingListDetailId'],
    groupName: groups['productTradingListName'],
    groupType: groups['typeList'],
    isAutoGroup: isAuto,
    isOverWrite: groups['isOverWrite']
  };

  const field = customFields;

  const restConvert = parseResInitializeGroup(
    // resp.data.fields,
    field,
    resp.data.productTradingList[0].searchConditions,
    resp.data.participantEmployees,
    resp.data.participantDepartments,
    resp.data.participantGroups,
    resp.data.listParticipants,
    resp.data.productTradingList[0].listUpdateTime
  );

  const listFieldSearch = restConvert.listFieldSearch;
  // const listParticipants = restConvert.listParticipants;
  // const customFieldsInfo = restConvert.customFieldsInfo;
  // const listUpdateTime = restConvert.listUpdateTime;

  // listParticipants:
  let groupParticipants = [];
  if (resp.data && resp.data.productTradingList[0].ownerList) {
    const ownerList = resp.data.productTradingList[0].ownerList.map((elm, index) => {
      return elm && reFormEmployee(elm, PARTICIPANT_TYPE.OWNER);
    });
    groupParticipants = [...groupParticipants, ...ownerList];
  }
  if (resp.data && resp.data.productTradingList[0].viewerList) {
    const viewerList = resp.data.productTradingList[0].viewerList.map((elm, index) => {
      return elm && reFormEmployee(elm, PARTICIPANT_TYPE.VIEWER);
    });
    groupParticipants = [...groupParticipants, ...viewerList];
  }
  if (resp.data && resp.data.participantGroups) {
    resp.data.participantGroups.forEach(element => {
      const paticipant = resp.data.groupParticipants.filter(e => {
        return e.participantGroupId === element.groupId;
      });
      Object.assign(element, { participantType: paticipant[0].participantType });
      groupParticipants.push(element);
    });
  }
  let listUpdateTime = null;
  if (resp.data) {
    listUpdateTime = parseListUpdateTime(resp.data.listUpdateTime);
  }
  // remove if employee null
  groupParticipants = [...groupParticipants].filter(elm => elm);

  return { listFieldSearch, groupParticipants, group, listUpdateTime };
};

/**
 * Pase Create update Share
 * @param res
 */
// const parseCreateUpdateSharedGroupResponse = res => {
//   let isSuccess = true;
//   const rowIds = [];
//   if (res.data.errors && res.data.errors.length > 0) {
//     for (let i = 0; i < res.data.errors[0].extensions.errors.length; i++) {
//       rowIds.push(res.data.errors[0].extensions.errors[i].rowId);
//     }
//     isSuccess = false;
//   }

//   const groupId = res.data.productTradingListDetailId;
//   return { groupId, rowIds, isSuccess };
// };

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
      ? DynamicGroupModalAction.Error
      : DynamicGroupModalAction.CreateUpdateSuccess;
  const msgSuccess = errorItems && errorItems.length > 0 ? SHOW_MESSAGE_SUCCESS.NONE : EnumMsg;
  const groupId = res.data.productTradingListDetailId;
  return { errorMsg, errorItems, action, groupId, rowIds, isSuccess, errorParams, msgSuccess };
};

const parseSharedListFail = res => {
  let errorMsg = [];
  const errorCode = [];
  if (res.parameters.extensions.errors && res.parameters.extensions.errors.length > 0) {
    errorMsg = res.parameters.extensions.errors[0].message
      ? res.parameters.extensions.errors[0].message
      : [];
    errorCode.push(res.parameters.extensions.errors[0].errorCode);
  }
  return { errorCode, errorMsg };
};

const parseErrorCreateUpadte = res => {
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
  }
  return { errorMsg, errorItems, rowIds, errorParams };
};

export type SalesMySharedListState = Readonly<typeof initialState>;

// Reducer
export default (state: SalesMySharedListState = initialState, action): SalesMySharedListState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.INITIAL):
    case REQUEST(ACTION_TYPES.CREATE):
    case REQUEST(ACTION_TYPES.UPDATE):
    case REQUEST(ACTION_TYPES.PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO): {
      return {
        ...state,
        action: DynamicGroupModalAction.Request
      };
    }
    case FAILURE(ACTION_TYPES.INITIAL): {
      {
        const res = parseSharedListFail(action.payload.response.data);
        return {
          ...state,
          action: DynamicGroupModalAction.Error,
          errorMessageInModal: res.errorCode
        };
      }
    }
    case FAILURE(ACTION_TYPES.CREATE):
    case FAILURE(ACTION_TYPES.UPDATE): {
      const res = parseErrorCreateUpadte(action.payload.response.data);
      return {
        ...state,
        action: DynamicGroupModalAction.Error,
        errorItems: res.errorItems,
        rowIds: res.rowIds,
        errorMessageInModal: res.errorMsg,
        errorParams: res.errorParams
      };
    }
    case SUCCESS(ACTION_TYPES.INITIAL): {
      const res = parseInitSharedGroupResponse(action.payload);
      return {
        ...state,
        action: DynamicGroupModalAction.Doneinit,
        group: res.group,
        listFieldSearch: res.listFieldSearch,
        listParticipants: res.groupParticipants,
        listUpdateTime: res.listUpdateTime
      };
    }
    case SUCCESS(ACTION_TYPES.PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO):
    case ACTION_TYPES.PRODUCT_TRADINGS_LIST_CUSTOM_FIELD_INFO: {
      const res = parseCustomFieldsInfoResponse(action.payload);
      return {
        ...state,
        action: DynamicGroupModalAction.Doneinit,
        customFieldsInfo: res.customFieldsInfo
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE): {
      const res = parseCreateUpdateSharedGroupResponse(action.payload, SHOW_MESSAGE_SUCCESS.CREATE);
      return {
        ...state,
        action: DynamicGroupModalAction.CreateUpdateSuccess,
        updatedListId: res.groupId,
        isSuccess: res.isSuccess,
        msgSuccess: res.msgSuccess
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE): {
      const res = parseCreateUpdateSharedGroupResponse(
        action.payload.data,
        SHOW_MESSAGE_SUCCESS.UPDATE
      );
      return {
        ...state,
        action: DynamicGroupModalAction.CreateUpdateSuccess,
        updatedListId: res.groupId,
        isSuccess: res.isSuccess,
        msgSuccess: res.msgSuccess
      };
    }
    case ACTION_TYPES.RESET_ERROR:
      return {
        ...state,
        errorItems: [],
        errorMessageInModal: null
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// API base URL
const salesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.SALES_SERVICE_PATH;

/**
 * getInitialListInfos
 *
 * @param
 */
export const getInitialListInfos = (listId, isOwnerList, isAutoList) => {
  return {
    type: ACTION_TYPES.INITIAL,
    payload: axios.post(
      `${salesApiUrl}/get-product-tradings-list`,
      {
        productTradingListDetailId: listId
      },
      { headers: { ['Content-Type']: 'application/json' } }
    )
  };
};

/**
 * createGroup
 *
 * @param groupParams
 */

const createGroup = params => ({
  type: ACTION_TYPES.CREATE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}/create-product-tradings-list`,
    params,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

const createListEmployeeId = (participantType, groupParticipantsParam) => {
  const listId = [];
  (groupParticipantsParam !== null ? groupParticipantsParam : [])
    .filter(y => y.participantType === participantType)
    .forEach(x3 => {
      if (x3.employeeId && !listId.includes(x3.employeeId)) {
        listId.push(x3.employeeId);
      } else if (x3.listEmployeeDepartment && x3.listEmployeeDepartment.length > 0) {
        x3.listEmployeeDepartment.forEach(departmentEmployee => {
          if (departmentEmployee.employeeId && !listId.includes(departmentEmployee.employeeId)) {
            listId.push(departmentEmployee.employeeId);
          }
        });
      } else if (x3.listEmployeeGroup && x3.listEmployeeGroup.length > 0) {
        x3.listEmployeeGroup.forEach(groupEmployee => {
          if (groupEmployee.employeeId && !listId.includes(groupEmployee.employeeId)) {
            listId.push(groupEmployee.employeeId);
          }
        });
      }
    });
  return listId;
};

const newFromCreateGroup = (
  groupName,
  groupType,
  isAutoGroup,
  isOverWrite,
  groupMembersParam = [],
  groupParticipantsParam,
  searchConditionsParam,
  listOfproductTradingId = []
) => {
  const ownerListId = createListEmployeeId(PARTICIPANT_TYPE.OWNER, groupParticipantsParam);
  const viewerListId = createListEmployeeId(PARTICIPANT_TYPE.VIEWER, groupParticipantsParam);
  const data = {};
  data[`productTradingList`] = {
    productTradingListName: groupName,
    listType: groupType,
    listMode: isAutoGroup === true ? 2 : 1,
    ownerList: ownerListId,
    viewerList: viewerListId,
    isOverWrite: isOverWrite ? 1 : 0
  };
  data[`searchConditions`] = searchConditionsParam;
  if (_.isArray(groupMembersParam) && groupMembersParam.length > 0) {
    data[`listOfproductTradingId`] = groupMembersParam.map(elm => elm.productTradingId);
  } else {
    data[`listOfproductTradingId`] = [];
  }
  return data;
};

/**
 * updateGroup
 *
 * @param groupParams
 */
export const updateGroup = params => ({
  type: ACTION_TYPES.UPDATE,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.SALES_SERVICE_PATH}/update-product-tradings-list`,
    params,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});
export const newFormUpdateGroup = (
  groupId,
  groupName,
  groupType,
  isAutoGroup,
  isOverWrite,
  groupParticipantsParam,
  searchConditionsParam
) => {
  const ownerListId = createListEmployeeId(PARTICIPANT_TYPE.OWNER, groupParticipantsParam);
  const viewerListId = createListEmployeeId(PARTICIPANT_TYPE.VIEWER, groupParticipantsParam);
  const data = {};
  data[`productTradingList`] = {
    productTradingListName: groupName,
    listType: groupType,
    listMode: isAutoGroup ? 2 : 1,
    ownerList: ownerListId,
    viewerList: viewerListId,
    isOverWrite: isOverWrite ? 1 : 0
  };
  data[`searchConditions`] = searchConditionsParam;
  data[`productTradingListDetailId`] = groupId;
  return data;
};

/**
 * Handle Init List Modal
 * @param groupId
 * @param isOwnerGroup
 * @param isAutoList
 */
export const handleInitListModal = (groupId, isOwnerGroup, isAutoList) => async dispatch => {
  await dispatch(getInitialListInfos(groupId, isOwnerGroup, isAutoList));
};

/**
 * Handle Reset
 */
export const reset = () => ({
  type: ACTION_TYPES.RESET
});

/**
 * Handle Submit List Infos
 */
export const handleSubmitGroupInfos = (
  groupId,
  groupName,
  groupType,
  isAutoGroup,
  isOverWrite,
  groupMembersParam,
  listParticipantsParam,
  searchConditionsParam,
  updatedDate,
  groupMode: number
) => async (dispatch, getState) => {
  switch (groupMode) {
    case GROUP_MODE_SCREEN.CREATE:
    case GROUP_MODE_SCREEN.CREATE_LOCAL:
    case GROUP_MODE_SCREEN.COPY:
      await dispatch(
        createGroup(
          newFromCreateGroup(
            groupName,
            groupType,
            isAutoGroup,
            isOverWrite,
            groupMembersParam,
            listParticipantsParam,
            searchConditionsParam
          )
        )
      );
      break;
    case GROUP_MODE_SCREEN.EDIT:
    case GROUP_MODE_SCREEN.SWITCH_TYPE:
      await dispatch(
        updateGroup(
          newFormUpdateGroup(
            groupId,
            groupName,
            groupType,
            isAutoGroup,
            isOverWrite,
            listParticipantsParam,
            searchConditionsParam
            // updatedDate
          )
        )
      );
      break;
    default:
      break;
  }
};

/**
 * reset state Error
 */
export const resetError = () => ({
  type: ACTION_TYPES.RESET_ERROR
});
