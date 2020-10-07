import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../../config/clients/api-client";
import {
  getFieldInfoPersonalsApiUrl,
  COMMONS_API,
  EMPLOYEES_API,
} from "../../../config/constants/api";

// Change password
export interface MenuSettingPayload {
  employeeId: number;
}
export interface MenuChangePasswordResponse {
  data: null;
  status: number;
}

// get language
export interface LanguageData {
  language_id: number;
  language_name: string;
  language_code: string;
}
export interface ListLanguagesDataResponse {
  languagesDTOList: any[];
}
export interface ListLanguagesResponse {
  data: ListLanguagesDataResponse;
  status: number;
}
export const getListLanguages = async (
  config?: AxiosRequestConfig
): Promise<ListLanguagesResponse> => {
  try {
    const response = await apiClient.post(COMMONS_API.getLanguages, {}, config);
    return response;
  } catch (error) {
    return error.response;
  }
};
export interface FormDateData {
  formatDate_id: number;
  formatDate: string;
  formatDate_name: string;
}
// get Time zone
export interface TimeZoneData {
  timezone_id: number;
  timezone_short_name: string;
  timezone_name: string;
}
export interface ListTimeZoneDataResponse {
  timezones: Array<TimeZoneData>;
}
export interface ListTimeZoneResponse {
  data: ListTimeZoneDataResponse;
  status: number;
}
export const getListTimeZone = async (
  config?: AxiosRequestConfig
): Promise<ListTimeZoneResponse> => {
  try {
    const response = await apiClient.post(COMMONS_API.getTimezones, {}, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// update Employee
export interface UpdateSettingEmployeePayload {
  languageId: number;
  timezoneId: number;
  formatDateId: number;
}
export interface UpdateSettingEmployeeDataResponse {
  data: any;
  status: number;
}
export const updateSettingEmployee = async (
  payload: UpdateSettingEmployeePayload,
  config?: AxiosRequestConfig
): Promise<UpdateSettingEmployeeDataResponse> => {
  try {
    const response = await apiClient.post(
      EMPLOYEES_API.updateSettingEmployeeUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
// get notification settings
export interface NotificationSettingData {
  notificationType: number;
  notificationSubtype: number;
  notificationSubtypeName: string;
  isNotification: boolean;
}
export interface NotificationSettingDataResponse {
  employeeId: number;
  email: string;
  notificationTime: number;
  data: Array<NotificationSettingData>;
}
export interface NotificationSettingResponse {
  data: NotificationSettingDataResponse;
  status: number;
}
export const getNotificationSetting = async (
  payload: MenuSettingPayload,
  config?: AxiosRequestConfig
): Promise<NotificationSettingResponse> => {
  try {
    const response = await apiClient.post(
      COMMONS_API.getNotificationSettingUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
// update notification settings

export interface UpdateNotificationSettingDataResponse {
  employeeId: number;
}
export interface ItemNotificationSetting {
  notificationType: number;
  notificationSubtype: number;
  isNotification: boolean;
}
export interface NotificationSettingPayload {
  employeeId: number;
  dataSettingNotifications: Array<ItemNotificationSetting> | any;
  notificationTime: number;
  emails: Array<string>;
}
export interface UpdateNotificationSettingResponse {
  data: UpdateNotificationSettingDataResponse;
  status: number;
}
export const updateNotificationDetailSetting = async (
  payload: NotificationSettingPayload,
  config?: AxiosRequestConfig
): Promise<UpdateNotificationSettingResponse> => {
  try {
    const response = await apiClient.post(
      COMMONS_API.updateNotificationDetailSettingUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
// get employee

export interface GetEmployeeDataResponse {
  employee: {
    email: string;
    languageId: number;
    timezoneId: number;
    formatDateId: number;
    isAdmin: boolean;
  };
}
export interface GetEmployeeResponse {
  data: GetEmployeeDataResponse;
  status: number;
}
export const getEmployee = async (
  payload: MenuSettingPayload,
  config?: AxiosRequestConfig
): Promise<GetEmployeeResponse> => {
  try {
    const response = await apiClient.post(
      getFieldInfoPersonalsApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
