import { apiClient } from '../../../config/clients/api-client';
import { createGroupUrl, updateGroupUrl, deleteGroupUrl, updateAutoGroupUrl } from '../../../config/constants/api';

const employeesInitializeGroupModalUrl = '/services/employees/api/initialize-group-modal'

export interface GroupPayload { }

export interface CreateGroupResponse {
  data: any;
  status: number;
}

// api create group
export const createGroup = async (
  payload: GroupPayload
): Promise<CreateGroupResponse> => {
  try {
    const response = await apiClient.post(createGroupUrl, payload);
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface EditGroupResponse {
  data: any;
  status: number;
}

// Edit Group Payload
export interface EditGroupPayload { }

// call api edit group
export const editGroup = async (
  payload: EditGroupPayload
): Promise<EditGroupResponse> => {
  try {
    const response = await apiClient.post(
      updateGroupUrl,
      payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// Delete Group Payload
export interface DeleteGroupPayload { }
// Delete Group Response
export interface DeleteGroupResponse {
  data: any;
  status: number;
}

// delete group
export const deleteGroup = async (
  payload: DeleteGroupPayload,
): Promise<DeleteGroupResponse> => {
  try {
    return await apiClient.post(deleteGroupUrl, payload);
  } catch (error) {
    return error.response;
  }
};

// Update Auto Group Response
export interface UpdateAutoGroupResponse {
  data: any;
  status: number;
}

// Update Auto Group Payload
export interface UpdateAutoGroupPayload { }

// update auto group
export const updateAutoGroup = async (
  payload: UpdateAutoGroupPayload,
): Promise<UpdateAutoGroupResponse> => {
  try {
    const response = await apiClient.post(
      updateAutoGroupUrl,
      payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface AddGroupPayload { }

const employeesAddGroupUrl = '/services/employees/api/add-group'

export interface AddGroupResponse {
  data: any;
  status: number;
}

// api add to group
export const addGroup = async (
  payload: AddGroupPayload
): Promise<AddGroupResponse> => {
  try {
    const response = await apiClient.post(employeesAddGroupUrl, payload);
    return response;
  } catch (error) {
    return error.response
  }
};

const employeesMoveGroupUrl = '/services/employees/api/move-group'

export interface MoveGroupPayload {
}

export interface MoveGroupResponse {
  data: any;
  status: number;
}

// api move to group
export const moveGroup = async (
  payload: { sourceGroupId: number, destGroupId: number, employeeIds: number[] }
): Promise<MoveGroupResponse> => {
  try {
    const response = await apiClient.post(employeesMoveGroupUrl, payload);
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface InitializeGroupModalPayload { }

export interface InitializeGroupModal {
  customFields: any;
  group: any;
  groupParticipants: any;
  groups: any;
  searchConditions: any;
  fields: any;
}

export interface InitializeGroupModalResponse {
  data: InitializeGroupModal;
}

// api move to group
export const getInitializeGroupModal = async (
  { groupId = 0, isOwnerGroup = true, isAutoGroup = false }: { groupId?: number, isOwnerGroup?: boolean, isAutoGroup?: boolean }
): Promise<{ data: any; status: number }> => {
  try {
    const response = await apiClient.post(employeesInitializeGroupModalUrl,
      {
        groupId: groupId,
        isOwnerGroup: isOwnerGroup,
        isAutoGroup: isAutoGroup
      });
    return response
  } catch (error) {
    return error.response;
  }
};

export interface GroupSuggestionsPayload {
  searchValue: string
}

export interface GroupInfo {
  groupId: number;
  groupName: string
  groupType: number;
  isAutoGroup: boolean;
  lastUpdatedDate: string;
  isOverWrite: boolean;
  employeeName: string;
}

export interface GroupSuggestionsResponse {
  data: {
    groupInfo: GroupInfo[];
  }
  status: number;
}

const getGroupSuggestionUrl = '/services/employees/api/get-group-suggestions';
// api get suggestion group
export const getGroupSuggestions = async (payload: GroupSuggestionsPayload): Promise<GroupSuggestionsResponse> => {
  try {
    const response = await apiClient.post(getGroupSuggestionUrl,
      {
        searchValue: payload.searchValue
      });
    return response
  } catch (error) {
    return error.response;
  }
};
