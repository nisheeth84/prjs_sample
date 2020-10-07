import { apiClient } from '../../../../config/clients/api-client';
import {
  CustomersSuggestionResponse,
  SuggestionsChoiceResponse,
  GetCustomersResponse,
  CustomFieldsInfoResponse,
  FieldInfoPersonalsResponse,
} from '../interface/customer-suggest-interface';
import { ISearchCondition } from '../employee/employee-search-detail/search-detail-interface';

const customerSugesstionApiUrl = '/services/customers/api/get-customer-suggestion';
const saveSuggestionsChoiceApiUrl = '/services/commons/api/save-suggestions-choice';
const getCustomersApiUrl = '/services/customers/api/get-customers';
const getCustomFieldsInfoApiUrl = "/services/commons/api/get-custom-fields-info";
const getFieldInfoPersonalsApiUrl = "/services/commons/api/get-field-info-personals";
const getDataLayoutApiUrl = "/services/customers/api/get-customer-layout";

/**
 * Define payload
 */
export interface CustomersSuggestionPayload {
  keyWords?: string,
  offset?: number,
  limit?: number,
  listIdChoice?: number[]
}

/**
 * Define function call API get data ressponse
 */
export const getCustomersSuggestion = async (
  payload: CustomersSuggestionPayload
): Promise<CustomersSuggestionResponse> => {
  try {
    const response = await apiClient.post(
      customerSugesstionApiUrl,
      payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define payload
 */
export interface SaveSuggestionsChoicePayload {
  sugggestionsChoice: {
    index: string,
    idResult: number
  }[]
}

/**
 * Define function call API get data ressponse
 */
export const saveSuggestionsChoice = async (
  payload: SaveSuggestionsChoicePayload
): Promise<SuggestionsChoiceResponse> => {
  try {
    const response = await apiClient.post(
      saveSuggestionsChoiceApiUrl,
      payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
/**
 * Define payload
 */
export interface GetCustomersPayload {
  searchConditions?: ISearchCondition[],
  filterConditions?: ISearchCondition[],
  limit?: number,
  offset?: number
}

/**
 * Define function call API get data ressponse
 */
export const getCustomers = async (
  payload: GetCustomersPayload
): Promise<GetCustomersResponse> => {
  try {
    const response = await apiClient.post(
      getCustomersApiUrl,
      payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define function call getCustomFieldsInfo API
 */
export const getCustomFieldsInfo = async (
  payload?: { fieldBelong: number }
): Promise<CustomFieldsInfoResponse> => {
  try {
    const response = await apiClient.post(getCustomFieldsInfoApiUrl, payload);
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define GetFieldInfoPersonals Payload
 */
export interface GetFieldInfoPersonalsPayload {
  fieldBelong: number,
  extensionBelong: number,
  isContainRelationField?: boolean,
  selectedTargetType?: number,
  selectedTargetId?: number
}

/**
 * Define function call getFieldInfoPersonals API
 */
export const getFieldInfoPersonals = async (
  payload?: GetFieldInfoPersonalsPayload
): Promise<FieldInfoPersonalsResponse> => {
  try {
    const response = await apiClient.post(getFieldInfoPersonalsApiUrl, payload);
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define function call API getDataLayout
 */
export const getDataLayout = async (
  payload?: any,
  config?: any
): Promise<any> => {
  try {
    const response = await apiClient.post(getDataLayoutApiUrl, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};