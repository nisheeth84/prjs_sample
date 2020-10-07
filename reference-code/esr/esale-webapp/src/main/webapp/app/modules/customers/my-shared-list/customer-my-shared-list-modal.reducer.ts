import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { SHOW_MESSAGE_SUCCESS } from '../constants';
import _ from 'lodash';
import { DynamicGroupModalAction } from 'app/shared/layout/dynamic-form/group/dynamic-group-modal.reducer.ts';
import { parseResInitializeGroup } from 'app/shared/layout/dynamic-form/group/dynamic-group-helper.ts';
import { GROUP_MODE_SCREEN } from 'app/shared/layout/dynamic-form/group/constants';

/**
 * CONST ACTION TYPES
 */
export const ACTION_TYPES = {
  INITIAL: 'customer-listModal/INITIAL',
  CREATE: 'sharedList/CREATE',
  UPDATE: 'sharedList/UPDATE',
  RESET: 'sharedList/RESET',
  RESET_ERROR: 'sharedList/RESET_ERROR'
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
  customFieldsInfoRelation: [],
  listParticipants: [],
  updatedListId: null,
  errorParams: [],
  listUpdateTime: null,
  msgSuccess: null,
  searchConditionsParam: null
};

type GroupType = {
  groupId: any;
  groupName: any;
  groupType: any;
  isAutoGroup: any;
  isOverWrite: any;
};

/**
 * Parse Init Shared Response
 * @param res
 */

const parseInitSharedGroupResponse = res => {
  if (_.isNil(res.data)) {
    return;
  }
  // convert all to group
  let list = {};
  if (res.data && res.data.list) {
    list = res.data.list;
  }

  const group: GroupType = {
    groupId: list['customerListId'],
    groupName: list['customerListName'],
    groupType: list['customerListType'],
    isAutoGroup: list['isAutoList'],
    isOverWrite: list['isOverWrite']
  };

  const restConvert = parseResInitializeGroup(
    res.data.fields,
    res.data.searchConditions,
    res.data.participantEmployees,
    res.data.participantDepartments,
    res.data.participantGroups,
    res.data.listParticipants,
    res.data.listUpdateTime
  );

  const listFieldSearch = restConvert.listFieldSearch;
  const listParticipants = restConvert.listParticipants;
  const customFieldsInfo = restConvert.customFieldsInfo;
  const listUpdateTime = restConvert.listUpdateTime;

  return { listFieldSearch, listParticipants, customFieldsInfo, group, listUpdateTime };
};

/**
 * Pase Create update Share
 * @param res
 */
const parseCreateUpdateSharedGroupResponse = res => {
  let isSuccess = true;
  const rowIds = [];
  if (res.data.errors && res.data.errors.length > 0) {
    for (let i = 0; i < res.data.errors[0].extensions.errors.length; i++) {
      rowIds.push(res.data.errors[0].extensions.errors[i].rowId);
    }
    isSuccess = false;
  }

  const customerListId = res.data.customerListId;
  return { customerListId, rowIds, isSuccess };
};

const parseSharedListFail = res => {
  let errorMsg = [];
  let errorCode = '';
  if (res.parameters.extensions.error && res.parameters.extensions.error.length > 0) {
    errorMsg = res.parameters.extensions.error[0].message
      ? res.parameters.extensions.error[0].message
      : [];
    errorCode = res.parameters.extensions.errors[0].errorCode;
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

export type CustomerMySharedListState = Readonly<typeof initialState>;

// Reducer
export default (
  state: CustomerMySharedListState = initialState,
  action
): CustomerMySharedListState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.INITIAL):
    case REQUEST(ACTION_TYPES.CREATE):
    case REQUEST(ACTION_TYPES.UPDATE): {
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
          errorMessageInModal: res.errorMsg
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
        listParticipants: res.listParticipants,
        customFieldsInfo: res.customFieldsInfo,
        listUpdateTime: res.listUpdateTime
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE): {
      return {
        ...state,
        action: DynamicGroupModalAction.CreateUpdateSuccess,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.CREATE },
        searchConditionsParam: action.meta.searchConditionsParam
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE): {
      const res = parseCreateUpdateSharedGroupResponse(action.payload);
      return {
        ...state,
        action: DynamicGroupModalAction.CreateUpdateSuccess,
        updatedListId: { customerListId: res.customerListId },
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE },
        searchConditionsParam: action.meta.searchConditionsParam
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
const customersApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.CUSTOMER_SERVICE_PATH;

/**
 * getInitialListInfos
 *
 * @param
 */
export const getInitialListInfos = (listId, isOwnerList, isAutoList) => {
  return {
    type: ACTION_TYPES.INITIAL,
    payload: axios.post(
      `${customersApiUrl}/get-initialize-list-modal`,
      {
        customerListId: listId,
        isAutoList
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
const createGroup = (
  groupName,
  groupType,
  isAutoGroup,
  isOverWrite,
  groupMembersParam,
  listParticipantsParam,
  searchConditionsParam
) => ({
  type: ACTION_TYPES.CREATE,
  payload: axios.post(
    `${customersApiUrl}/create-list`,
    {
      customerListName: groupName,
      customerListType: groupType,
      isAutoList: isAutoGroup,
      isOverWrite,
      listMembers: groupMembersParam,
      listParticipants: listParticipantsParam,
      searchConditions: searchConditionsParam
    },
    { headers: { ['Content-Type']: 'application/json' } }
    ),
    meta: {searchConditionsParam}
});

/**
 * updateGroup
 *
 * @param groupParams
 */
export const updateGroup = (
  groupId,
  groupName,
  groupType,
  isAutoGroup,
  isOverWrite,
  listParticipantsParam,
  searchConditionsParam,
  updatedDate
) => ({
  type: ACTION_TYPES.UPDATE,
  payload: axios.post(
    `${customersApiUrl}/update-list`,
    {
      customerListId: groupId,
      customerListType: groupType,
      customerListName: groupName ? groupName : '',
      updatedDate,
      isAutoList: isAutoGroup,
      isOverWrite,
      listParticipants: listParticipantsParam,
      searchConditions: searchConditionsParam
    },
    { headers: { ['Content-Type']: 'application/json' } }
    ),
    meta: {searchConditionsParam}
});

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
export const handleSubmitListInfos = (
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
          groupName,
          groupType,
          isAutoGroup,
          isOverWrite,
          groupMembersParam,
          listParticipantsParam,
          searchConditionsParam
        )
      );
      break;
    case GROUP_MODE_SCREEN.EDIT:
    case GROUP_MODE_SCREEN.SWITCH_TYPE:
      await dispatch(
        updateGroup(
          groupId,
          groupName,
          groupType,
          isAutoGroup,
          isOverWrite,
          listParticipantsParam,
          searchConditionsParam,
          updatedDate
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
