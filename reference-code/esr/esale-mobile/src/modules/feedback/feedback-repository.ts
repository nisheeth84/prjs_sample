import { AxiosRequestConfig } from 'axios';
import { apiClient } from '../../config/clients/api-client';
import { FEEDBACK_API, TENANT_API } from '../../config/constants/api';

/**
 * request body of api create feedback status
 */
export interface CreateFeedbackStatusPayload {
  employeeId?: number;
}

/**
 * response data of create feedback status
 */
export interface CreateFeedbackStatusDataResponse {
  employeeId: number;
}

/**
 * response of api create feedback status
 */
export interface FeedbackStatusResponse {
  data: CreateFeedbackStatusDataResponse;
  status: number;
}

/**
 * Call api create feedback status
 * @param payload
 * @param config
 */
export const createFeedbackStatus = async (
  payload: CreateFeedbackStatusPayload,
  config?: AxiosRequestConfig
): Promise<FeedbackStatusResponse> => {
  try {
    const response = await apiClient.post(
      FEEDBACK_API.createFeedbackStatusApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * request body of api create feedback
 */
export interface CreateFeedbackPayload {
  tenantName: string;
  companyName: string;
  employeeId?: number;
  feedbackType: string;
  feedbackContent: string;
  displayType: string;
  terminalType: string;
  content: string;
}

/**
 * response data of api create feedback
 */
export interface CreateFeedbackDataResponse {
  feedback_id: number;
}

/**
 * response of api create feedback
 */
export interface CreateFeedbackResponse {
  data: CreateFeedbackDataResponse;
  status: number;
}

/**
 * Call api create feedback
 * @param payload
 * @param config
 */
export const createFeedback = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<CreateFeedbackResponse> => {
  try {
    const response = await apiClient.post(
      FEEDBACK_API.createFeedbackApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * request body of api get company name
 */
export interface GetCompanyNamePayload {
  tenantName: string;
}

/**
 * response data of api get company name
 */
export interface GetCompanyNameData {
  companyName: string;
}

/**
 * response of api get company name
 */
export interface GetCompanyNameResponse {
  data: GetCompanyNameData;
  status: number;
}

/**
 * Call api get company name
 * @param payload
 * @param config
 */
export const getCompanyName = async (
  payload: GetCompanyNamePayload,
  config?: AxiosRequestConfig
): Promise<GetCompanyNameResponse> => {
  try {
    const response = await apiClient.post(
      TENANT_API.getCompanyNameUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * request body of api get status open feedback
 */
export interface GetStatusOpenFeedbackPayload {
  employeeId?: number;
}

/**
 * data response of api get status open feedback
 */
export interface GetStatusOpenFeedbackDataResponse {
  employeeId: number;
  tenantName: string;
}

/**
 * response of api get status open feedback
 */
export interface GetStatusOpenFeedbackResponse {
  data: GetStatusOpenFeedbackDataResponse;
  status: number;
}

/**
 * Call api get status open feedback
 * @param payload
 * @param config
 */

export const getStatusOpenFeedback = async (
  payload: GetStatusOpenFeedbackPayload,
  config?: AxiosRequestConfig
): Promise<GetStatusOpenFeedbackResponse> => {
  try {
    const response = await apiClient.post(
      FEEDBACK_API.getStatusOpenFeedbackApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Request model of get tenant status contract
 */
export interface GetTenantStatusContractRequest {
  tenantName: string;
}

/**
 * Response modal of get tenant status contract
 */
export interface GetTenantStatusContractDataResponse {
  contractStatus: number;
  trialEndDate: string;
}

/**
 * Axios response model of get tenant status contract
 */
export interface GetTenantStatusContractResponse {
  data: GetTenantStatusContractDataResponse;
  status: number;
}

/**
 * Get tenant status contract api
 * @param payload 
 * @param config 
 */
export const getTenantStatusContract = async (
  payload: GetTenantStatusContractRequest,
  config?: AxiosRequestConfig
): Promise<GetTenantStatusContractResponse> => {
  try {
    const response = await apiClient.post(
      FEEDBACK_API.getStatusContractApiUrl,
      payload,
      config
    );
    return response
  } catch (error) {
    return error.response;
  }
}