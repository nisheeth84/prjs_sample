import axios, { AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../../../shared/interfaces/api-response';
import { apiClient } from '../../../config/clients/api-client';
import { apiUrl } from '../../../config/constants/api';

export const EMPLOYEES_FORGOT_PASSWORD = "/services/employees/auth/forgot";

/**
 * Define function call API change password
 */
export const forgotPassword = async (
  payload: {
    url: string,
    email: string
  },
  config?: AxiosRequestConfig
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(
      `${apiUrl}services/employees/auth/forgot`,
      {
        username: payload.email
      },
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const SERVICE_EMPLOYEE_CHANGE_PASSOWRD = "/services/employees/api/change-password";

/**
 * Define function call API change password
 */
export const changePassword = async (
  payload: { username: string, oldPassword: string, newPassword: string }
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post(
      SERVICE_EMPLOYEE_CHANGE_PASSOWRD,
      {
        username: payload.username,
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const SERVICE_EMPLOYEE_CONFIRM = "/services/employees/register/account/confirm";
/**
 * Define function call API confirm, the first login
 */
export const confirmPassword = async (
  payload: { username: string, oldPassword: string, newPassword: string },
  config?: AxiosRequestConfig
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post(
      SERVICE_EMPLOYEE_CONFIRM,
      {
        username: payload.username,
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
      },
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const SERVICE_EMPLOYEE_RESET_PASSWORD = "/services/employees/auth/reset-password";
/**
 * Define function call API reset password
 */
export const resetPassword = async (
  payload: { username: string, resetCode: string, newPassword: string },
  config?: AxiosRequestConfig
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post(
      SERVICE_EMPLOYEE_RESET_PASSWORD,
      {
        username: payload.username,
        resetCode: payload.resetCode,
        newPassword: payload.newPassword,
      },
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};