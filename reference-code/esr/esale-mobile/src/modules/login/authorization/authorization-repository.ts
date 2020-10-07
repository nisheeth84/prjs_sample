import { apiClient } from "../../../config/clients/api-client";
import { ApiResponse } from "../../../shared/interfaces/api-response";
import { AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { ID_TOKEN } from "../../../config/constants/constants";

export const EMPLOYEES_LOGIN = "services/employees/auth/login";
export const EMPLOYEES_VERIFY = "services/employees/auth/verify";

/**
 * function call login api
 */
export const login = async (
  {
    email,
    password,
    rememberMe,
  }: { email: string; password: string; rememberMe: boolean },
  config?: AxiosRequestConfig
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post(
      EMPLOYEES_LOGIN,
      { username: email, password: password, rememberMe: rememberMe },
      config
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const COMMONS_UPDATE_PUSH_NOTIFICATION = "services/commons/api/update-push-notification";

/**
 * function call login api
 */
export const updatePushNotification = async (
  payload: { employeeId: number, deviceUniqueId: string, deviceToken: string, isLogged: boolean, tenantId: string },
  config?: AxiosRequestConfig
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post(
      COMMONS_UPDATE_PUSH_NOTIFICATION,
      payload,
      config);
    return response;
  } catch (error) {
    return error;
  }
};

/** 
 * function call verify api before login
 */
export const verifyBeforeLogin = async (
  { site, tenantId, userAgent }: { site: string, tenantId: string, userAgent?: string },
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.get(
      EMPLOYEES_VERIFY,
      { params: { site: site }, headers: { "X-TenantID": tenantId, "User-Agent": userAgent } }
    );
    return response;
  } catch (error) {
    return error;
  }
}

/** 
 * function call verify api after login
 */
export const verifyAfterLogin = async (): Promise<ApiResponse> => {
  try {
    const idToken = await AsyncStorage.getItem(ID_TOKEN)
    const response = await apiClient.get(
      EMPLOYEES_VERIFY,
      { headers: { authorization: `Bearer ${idToken}` } }
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const EMPLOYEES_GET_STATUS_CONTRACT = "services/employees/api/get-status-contract";

/** 
 * function call get status contract
 */
export const getStatusContract = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post(
      EMPLOYEES_GET_STATUS_CONTRACT,
      {}
    );
    return response;
  } catch (error) {
    return error;
  }
}