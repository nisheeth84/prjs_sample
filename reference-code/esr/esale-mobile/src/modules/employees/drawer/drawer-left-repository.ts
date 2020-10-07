import { AxiosRequestConfig } from 'axios';
import { apiClient } from '../../../config/clients/api-client';
import { searchEmployeesApiUrl, getInitializeLocalMenuUrl } from '../../../config/constants/api';
import { normalizeHttpError } from '../../../shared/utils/errors';

export interface Departments {
  departmentId: number;
  departmentName: string;
  parentId: number | null;
  departmentOrder: number;
  updatedDate: string;
  departmentChild: Departments[] | null;
}

export interface MyGroups {
  groupId: number;
  groupName: string;
  isAutoGroup: boolean;
}

export interface ShareGroups {
  groupId: number;
  groupName: string;
  isAutoGroup: boolean;
  participantType: number;
}

export interface InitializeLocalMenu {
  departments: Departments[];
  myGroups: MyGroups[];
  sharedGroups: ShareGroups[];
}

// InitializeLocalMenu Response
export interface InitializeLocalMenuResponse {
  data: InitializeLocalMenu;
  status: number;
}

// InitializeLocalMenu Payload
export interface InitializeLocalMenuPayload { }

/**
 * call api get initialize local menu
 */
export const getInitializeLocalMenu = async (
  payload: InitializeLocalMenuPayload
): Promise<InitializeLocalMenuResponse> => {
  try {
    const response = await apiClient.post(
      getInitializeLocalMenuUrl,
      payload
    );
    return response;
  } catch (error) {
    throw normalizeHttpError(error);
  }
};

// Retired Employee Response
export interface RetiredEmployeeResponse {
  data: any;
  status: number;
}

// Retired Employee Payload
export interface RetiredEmployeePayload { }

// Get Info Group Response
export interface GetInfoGroupResponse {
  data: any;
  status: number;
}

// Get InfoGroup Payload
export interface GetInfoGroupPayload { }

/**
 * api get info group
 */
//
export const getInfoGroup = async (
  payload: GetInfoGroupPayload,
  config?: AxiosRequestConfig
): Promise<GetInfoGroupResponse> => {
  try {
    const response = await apiClient.post(
      searchEmployeesApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// Leave Group Payload
export interface LeaveGroupPayload { }

// Leave Group Response
export interface LeaveGroupResponse {
  data: number;
  status: number;
}
// declare leaveGroupUrl
export const leaveGroupUrl = '/services/employees/api/leave-groups';
// api create group
export const leaveGroup = async (
  payload: LeaveGroupPayload
): Promise<LeaveGroupResponse> => {
  try {
    const response = await apiClient.post(leaveGroupUrl, payload);
    return response;
  } catch (error) {
    return error.response;
  }
};
