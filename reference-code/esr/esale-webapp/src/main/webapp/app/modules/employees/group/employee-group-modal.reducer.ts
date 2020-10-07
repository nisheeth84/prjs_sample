import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { SHOW_MESSAGE_SUCCESS } from '../constants';
import { parseErrorRespose } from 'app/shared/util/string-utils';

export const ACTION_TYPES = {
  RESET_GROUP_MODAL: 'GROUP/RESET',
  INITIALIZE_GROUP_MODAL: 'GROUP/INITIALIZE_GROUP_MODAL',
  CREATE_GROUP: 'GROUP/CREATE_GROUP',
  UPDATE_GROUP: 'GROUP/UPDATE_GROUP',
  MOVE_TO_GROUP: 'GROUP/MOVE_TO_GROUP',
  ADD_TO_GROUP: 'GROUP/ADD_TO_GROUP',
  SUGGEST_GROUP: 'GROUP/SUGGEST_GROUP'
};

export enum GroupModalAction {
  None,
  Error,
  Success
}

const initialModalState = {
  group: null,
  groups: [],
  errorCode: '',
  modalAction: GroupModalAction.None,
  searchConditions: null,
  customFields: null,
  errorItems: null,
  listUpdateTime: null,
  msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.NONE },
  groupSuggestions: []
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
    searchConditions =
      res.searchConditions && res.searchConditions.sort((a, b) => a.fieldOrder - b.fieldOrder);
    customFields = res.customFields;
  }
  return { group, groups, fields, searchConditions, customFields, listUpdateTime };
};

export type GroupModalState = Readonly<typeof initialModalState>;

// Reducer
export default (state: GroupModalState = initialModalState, action): GroupModalState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.INITIALIZE_GROUP_MODAL):
    case REQUEST(ACTION_TYPES.MOVE_TO_GROUP):
    case REQUEST(ACTION_TYPES.CREATE_GROUP):
    case REQUEST(ACTION_TYPES.UPDATE_GROUP):
    case REQUEST(ACTION_TYPES.ADD_TO_GROUP):
    case REQUEST(ACTION_TYPES.SUGGEST_GROUP):
      return {
        ...state
      };
    case SUCCESS(ACTION_TYPES.INITIALIZE_GROUP_MODAL): {
      const res = parseInitializeGroupModalResponse(action.payload.data);
      return {
        ...state,
        group: res.group,
        groups: res.groups,
        customFields: res.customFields,
        searchConditions: res.searchConditions,
        listUpdateTime: res.listUpdateTime
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE_GROUP): {
      return {
        ...state,
        modalAction: GroupModalAction.Success,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.CREATE }
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_GROUP):
    case SUCCESS(ACTION_TYPES.MOVE_TO_GROUP):
    case SUCCESS(ACTION_TYPES.ADD_TO_GROUP): {
      return {
        ...state,
        modalAction: GroupModalAction.Success,
        msgSuccess: { successId: SHOW_MESSAGE_SUCCESS.UPDATE }
      };
    }
    case SUCCESS(ACTION_TYPES.SUGGEST_GROUP): {
      return {
        ...state,
        groupSuggestions: action.payload.data.groupInfo
      };
    }
    case FAILURE(ACTION_TYPES.INITIALIZE_GROUP_MODAL):
    case FAILURE(ACTION_TYPES.MOVE_TO_GROUP):
    case FAILURE(ACTION_TYPES.CREATE_GROUP):
    case FAILURE(ACTION_TYPES.UPDATE_GROUP):
    case FAILURE(ACTION_TYPES.SUGGEST_GROUP):
    case FAILURE(ACTION_TYPES.ADD_TO_GROUP): {
      return {
        ...state,
        modalAction: GroupModalAction.Error,
        errorItems: parseErrorRespose(action.payload),
        errorCode: parseErrorRespose(action.payload)[0].errorCode
      };
    }
    case ACTION_TYPES.RESET_GROUP_MODAL:
      return {
        ...initialModalState
      };
    default:
      return state;
  }
};

// API base URL
const employeesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

export const initializeGroupModal = (groupIdParam, isOwnerGroupParam, isAutoGroupParam) => ({
  type: ACTION_TYPES.INITIALIZE_GROUP_MODAL,
  payload: axios.post(
    `${employeesApiUrl + '/initialize-group-modal'}`,
    {
      groupId: groupIdParam,
      isOwnerGroup: isOwnerGroupParam,
      isAutoGroup: isAutoGroupParam
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

// Update based on design ver 0.6
export const handleInitializeGroupModal = (
  groupId = null,
  isOwnerGroup = true,
  isAutoGroup = false
) => async dispatch => {
  await dispatch(initializeGroupModal(groupId, isOwnerGroup, isAutoGroup));
};

export const moveToGroup = (sourceGroupId: number, destGroupId: number, employeeIds: any) => ({
  type: ACTION_TYPES.MOVE_TO_GROUP,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/move-group`,
    {
      sourceGroupId,
      destGroupId,
      employeeIds
    },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleMoveToGroup = (
  sourceGroupId: number,
  destGroupId: number,
  employeeIds: any
) => async dispatch => {
  await dispatch(moveToGroup(sourceGroupId, destGroupId, employeeIds));
};

export const dispatchCreateGroup = params => ({
  type: ACTION_TYPES.CREATE_GROUP,
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'employees/api/create-groups'}`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const handleCreateGroup = (
  groupNameParam,
  groupTypeParam,
  isAutoGroupParam,
  isOverWriteParam,
  groupMembersParam = [],
  groupParticipantsParam = null,
  searchConditionsParam = null
) => async dispatch => {
  const data = {
    groupName: groupNameParam,
    groupType: groupTypeParam || 1,
    isAutoGroup: isAutoGroupParam || false,
    isOverWrite: isOverWriteParam || false,
    groupMembers: groupMembersParam,
    groupParticipants: groupParticipantsParam,
    searchConditions: searchConditionsParam
  };
  await dispatch(dispatchCreateGroup(data));
};

const dispatchUpdateGroup = params => ({
  type: ACTION_TYPES.UPDATE_GROUP,
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'employees/api/update-groups'}`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const handleUpdateGroup = (
  groupIdParam,
  groupNameParam,
  groupTypeParam,
  isAutoGroupParam,
  isOverWriteParam,
  updatedDateParam,
  searchConditionsParam = null
) => async dispatch => {
  const data = {
    groupId: groupIdParam,
    groupName: groupNameParam,
    groupType: groupTypeParam || 1,
    isAutoGroup: isAutoGroupParam || false,
    isOverWrite: isOverWriteParam || false,
    updatedDate: updatedDateParam,
    searchConditions: searchConditionsParam
  };
  await dispatch(dispatchUpdateGroup(data));
};

export const addToGroup = params => ({
  type: ACTION_TYPES.ADD_TO_GROUP,
  payload: axios.post(`${API_CONTEXT_PATH + '/' + 'employees/api/add-group'}`, params, {
    headers: { ['Content-Type']: 'application/json' }
  })
});

export const handleAddToGroup = (groupId, employeeIds) => async dispatch => {
  const data = {
    groupId: parseInt(groupId, 10),
    employeeIds
  };
  await dispatch(addToGroup(data));
};

const getGroupSuggestions = searchValue => ({
  type: ACTION_TYPES.SUGGEST_GROUP,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/get-group-suggestions`,
    { searchValue },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

export const handleGetGroupSuggestions = searchValue => async dispatch => {
  await dispatch(getGroupSuggestions(searchValue));
};

export const reset = () => ({
  type: ACTION_TYPES.RESET_GROUP_MODAL
});
