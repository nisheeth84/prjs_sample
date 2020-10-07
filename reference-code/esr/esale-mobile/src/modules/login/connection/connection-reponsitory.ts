import { apiClient } from '../../../config/clients/api-client';
import { ApiResponse } from '../../../shared/interfaces/api-response';
import { AxiosRequestConfig } from 'axios';

export const GET_COMPANY_NAME_API = "services/tenants/api/get-company-name";

/** 
 * function call getCompanyName api
 */
export const getCompanyName = async (
  { tenantName }: { tenantName: string },
  config?: AxiosRequestConfig
): Promise<ApiResponse> => {
  try{
    const response = await apiClient.post(
      GET_COMPANY_NAME_API,
      { tenantName: tenantName },
      config
    );
    return response;
  } catch (error) {
    return error;
  }
}