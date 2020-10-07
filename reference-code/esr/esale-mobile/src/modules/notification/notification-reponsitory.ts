import { AxiosRequestConfig } from 'axios';
import { apiClient } from '../../config/clients/api-client';
import {
  getListNotificationApiUrl,
  updateStatusNotification,
} from '../../config/constants/api';

export interface NotificationPayload {
  employeeId: number;
  limit: number;
  textSearch: string;
}

export interface NotificationDataResponse {
  messages?: any;
  notificationId: number;
  confirmNotificationDate?: string;
  data: any;
}

export interface ListNotificationResponse {
  messages?: NotificationDataResponse;
  notificationId?: number;
  confirmNotificationDate?: string;
  status: number;
}

/**
 * Call api get notification
 * @param payload
 * @param config
 */
export const getNotifications = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<ListNotificationResponse> => {
  try {
    const response = await apiClient.post(
      getListNotificationApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface StatusNotification {
  employeeId: number;
  notificationId: number;
  confirmNotificationDate: Date;
}

export const updateStatusNotifications = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      updateStatusNotification,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
