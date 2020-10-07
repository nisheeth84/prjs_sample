import { apiClient } from "../../../../../config/clients/api-client";
import { getCustomerHistoryApi } from "../../customer-api";

export interface contentChange {
  old: string;
  new: string;
  name: string;
}
export interface ChangeHistory {
  customersHistory: CustomerHistory[];
  // mergedCustomer: MergedCustomers[];
}
export interface CustomerHistory {
  createdDate: string;
  createdUserId: number;
  createdUserName: string;
  createdUserImage: string;
  contentChange: string;
  mergedCustomerId: string;
}
export interface MergedCustomers {
  customerId: number;
  customerName: string;
}

export interface ChangeHistoryResponse {
  data: ChangeHistory;
  status: number;
}

export interface ChangeHistoryPayload {
  customerId: number;
  currentPage: number;
  limit: number;
}

/**
 * get change history tab
 * 
 * @param payload ChangeHistoryPayload
 * @param config AxiosRequestConfig
 * @returns Promise<ChangeHistoryResponse>
 */
export const getChangeHistory = async (
  payload: ChangeHistoryPayload
): Promise<ChangeHistoryResponse> => {
  try {
    const response = await apiClient.post(
      getCustomerHistoryApi,
      payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
