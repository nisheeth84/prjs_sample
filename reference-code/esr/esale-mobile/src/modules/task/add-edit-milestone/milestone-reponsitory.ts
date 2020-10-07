import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../../config/clients/api-client";
import {
  TASK_API,
 
} from "../../../config/constants/api";

/**
 * Call api get notification
 * @param payload
 * @param config
 */

export interface MilestonePayload {
  milestoneName: string;
  memo: string;
  endDate: string;
  isDone: number;
  isPublic: number;
}

export const createMilestone = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TASK_API.createMilestoneApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface MilestoneId {
  milestone_id: number;
}

export interface MilestoneDetail {
  milestoneId: number;
  milestoneName: string;
  memo: string;
  listTask: any;
  endDate: string;
  isDone: number;
  isPublic: number;
  createdDate: string;
  createdUser: number;
  updatedDate: string;
  updatedUser: number;
}

export interface MilestoneDetailResponse {
  data: MilestoneDetail;
  status: number;
}

export const getMilestone = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<MilestoneDetailResponse> => {
  try {
    const response = await apiClient.post(
      TASK_API.getMilestoneApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface UpdateMilestonePayload {
  milestoneId?: number;
  milestoneName?: string;
  memo?: string;
  endDate?: string;
  isDone?: number;
  isPublic?: number;
}

export const updateMilestone = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TASK_API.updateMilestoneApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
