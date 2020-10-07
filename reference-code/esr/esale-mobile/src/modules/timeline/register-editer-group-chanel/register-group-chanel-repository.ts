import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../../config/clients/api-client";
import { timelinesUrl, TIMELINE_API } from "../../../config/constants/api";
import { Employee } from "../../employees/employees-repository";

export interface RegisterGroupResponse {
  data: { timelineGroupId: number };
  status: number;
}

export interface GroupPayload {
  query: string;
}

export const createGroupList = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<RegisterGroupResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.createTimelineGroupUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface Invite {
  inviteId: number;
  inviteType: number;
  inviteName: string;
  inviteImagePath: string;
  department: {
    parentId: number;
    parentName: string;
    employeeId: Array<number>;
    employeeName: Array<string>;
  };
  status: number;
  authority: number;
  employee: Array<{
    departmentName: string;
    positionName: string;
  }>;
}

export interface TimelineGroup {
  timelineGroupId: number;
  timelineGroupName: string;
  comment: string;
  createdDate: string;
  isPublic: boolean;
  color: string;
  imagePath: string;
  imageName: string;
  width: number;
  height: number;
  changedDate: string;
  invites: Array<Invite>;
}

export interface EditerGroupResponse {
  data: {
    imelineGroup: Array<TimelineGroup>;
  };
  status: number;
}

export interface getTimelineGroupResponse {
  data: { timelineGroupId: number };
  status: number;
}

export const editGroupList = async (
  payload: GroupPayload,
  config?: AxiosRequestConfig
): Promise<EditerGroupResponse> => {
  try {
    const response = await apiClient.post(timelinesUrl, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};
