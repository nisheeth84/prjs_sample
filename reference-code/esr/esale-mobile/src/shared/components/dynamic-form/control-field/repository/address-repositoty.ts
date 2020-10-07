import { apiClient } from "../../../../../config/clients/api-client";
import { AxiosRequestConfig } from "axios";
import { getCommonApiUrl } from "../../../../../config/constants/api";
import { AddressInfoResponse } from "../interface/address-interface";

/**
 * Define payload address
 */
export interface AddressSuggestionPayload { }

/**
 * Define function call API get data ressponse
 */
export const addressesSuggestions = async (
  payload: AddressSuggestionPayload,
  config?: AxiosRequestConfig
): Promise<AddressInfoResponse> => {
  try {
    const response = await apiClient.post(
      getCommonApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};