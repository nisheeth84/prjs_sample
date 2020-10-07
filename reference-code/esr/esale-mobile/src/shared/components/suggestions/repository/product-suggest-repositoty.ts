import { apiClient } from "../../../../config/clients/api-client";
import { ProductSuggestionsChoiceResponse, ProductSuggest, CustomFieldsInfoResponse, ProductState } from "../interface/product-suggest-interface";
import { IFieldInfoPersonal, SearchConditions } from "../product/product-search-detail/search-detail-interface";


const getProductSuggestionsApiUrl = "/services/products/api/get-product-suggestions";
const saveSuggestionsChoiceApiUrl = "/services/commons/api/save-suggestions-choice";
const updateFieldInfoPersonalsApiUrl = "/services/commons/api/update-field-info-personals";
const getCustomFieldsInfoApiUrl = "/services/commons/api/get-custom-fields-info";
const getFieldInfoPersonalsApiUrl = "/services/commons/api/get-field-info-personals";
const getProductsUrl = "/services/products/api/get-products";

/**
 * payload of getProductSuggestions
 */
export interface getProductSuggestionsParameter {
  offset: number;
  searchValue: string;
  listIdChoice?: number[];
  limit: number;
}
export interface ProductSuggestRespone {
  status: number;
  data: dataInfoRespone;
}
export interface dataInfoRespone {
  dataInfo: ProductSuggest[];
  total: number;
}


/**
 * Define function call getProductSuggestions API
 */
export const getProductSuggestions = async (
  //input
  payload: getProductSuggestionsParameter
  //output
): Promise<ProductSuggestRespone> => {
  try {
    const response = await apiClient.post(
      getProductSuggestionsApiUrl,
      {
        searchValue: payload.searchValue,
        limit: payload.limit,
        offset: payload.offset,
        listIdChoice: payload.listIdChoice
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
}


/**
 * Define ProductSuggestionsChoicePayload Payload
 */
export interface ProductSuggestionsChoicePayload {
  sugggestionsChoice: {
    index: string,
    idResult: number
  }[]
}

/**
 * Define function call saveProductSuggestionsChoice API
 */
export const saveProductSuggestionsChoice = async (
  //input
  payload: ProductSuggestionsChoicePayload
  //output
): Promise<ProductSuggestionsChoiceResponse> => {
  try {
    const response = await apiClient.post(
      saveSuggestionsChoiceApiUrl,
      payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
}
/**
 * Define UpdateFieldInfoPersonals Payload
 */
export interface UpdateFieldInfoPersonalsPayload {
  fieldBelong: number,
  extensionBelong: number,
  fieldInfos: any[],
  selectedTargetType?: number,
  selectedTargetId?: number
}

/**
 * Define function call updateFieldInfoPersonals API
 */
export const updateFieldInfoPersonals = async (
  payload?: UpdateFieldInfoPersonalsPayload
): Promise<FieldInfoPersonalsResponse> => {
  try {
    const response = await apiClient.post(updateFieldInfoPersonalsApiUrl, payload);
    return response;
  } catch (error) {
    return error.response;
  }
};
/**
 * Define structure values of data api
 */
export interface FieldInfoPersonalsResponse {
  data: { fieldInfoPersonals: IFieldInfoPersonal[] };// data form response
  status: number;// status off response
}


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
 * Define GetFieldInfoPersonals Payload
 */
export interface GetFieldInfoPersonalsPayload {
  fieldBelong: number,
  extensionBelong: number,
  isContainRelationField?: boolean,
  selectedTargetType?: number,
  selectedTargetId?: number
}


export interface ProductSuggestPayload {
  status: number,
  data: ProductState
}

export interface SearchCondition {
  searchConditions: SearchConditions[],
  filterConditions: [],
  limit: number,
  offset: number
}
/**
 * Define function call API get data ressponse
 */
export const getProducts = async (

  //input
  payload: SearchCondition
  //output
): Promise<any> => {
  try {
    const response = await apiClient.post(
      getProductsUrl,
      {
        searchConditions: payload.searchConditions,
        filterConditions: payload.filterConditions,
        limit: payload.limit,
        offset: payload.offset
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
}