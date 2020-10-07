import { apiClient } from "../../../../config/clients/api-client";
import { TradingProductSuggestionsChoiceResponse, CustomFieldsInfoResponse, TradingProductState, GetTradingProductSuggestionResponse } from "../interface/trading-product-suggest-interface";
import { IFieldInfoPersonal, SearchConditions } from "../trading-product/trading-product-search-detail/search-detail-interface";

const saveSuggestionsChoiceApiUrl = "/services/commons/api/save-suggestions-choice";
const updateFieldInfoPersonalsApiUrl = "/services/commons/api/update-field-info-personals";
const getCustomFieldsInfoApiUrl = "/services/commons/api/get-custom-fields-info";
const getFieldInfoPersonalsApiUrl = "/services/commons/api/get-field-info-personals";
const getTradingProductsApiUrl = "/services/sales/api/get-product-tradings";
const getTradingProductSuggestApiUrl = "/services/sales/api/get-product-trading-suggestions"

/**
 * Define ProductSuggestionsChoicePayload Payload
 */
export interface ProductSuggestionsChoicePayload {
    suggestionsChoice: {
        index: string,
        idResult: number
    }[]
}

export interface SearchCondition {
    searchConditions: SearchConditions[],
    filterConditions: [],
    limit: number,
    offset: number,
    isFirstLoad: boolean,
    isOnlyData: boolean,
    selectedTargetId: number
}

/**
 * Define function call saveProductSuggestionsChoice API
 */
export const saveTradingProductSuggestionsChoice = async (
    //input
    payload: any
    //output
): Promise<TradingProductSuggestionsChoiceResponse> => {
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
 * Define structure values of data api
 */
export interface FieldInfoPersonalsResponse {
    data: { fieldInfoPersonals: IFieldInfoPersonal[] };// data form response
    status: number;// status off response
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


export interface TradingProductSuggestPayload {
    status: number,
    data: TradingProductState
}

/**
 * Define function call API get data ressponse
 */
export const getTradingProducts = async (
    //input
    payload: SearchCondition
    //output
): Promise<TradingProductSuggestPayload> => {
    try {
        const response = await apiClient.post(
            getTradingProductsApiUrl,
            {
                searchConditions: payload.searchConditions,
                limit: payload.limit,
                offset: payload.offset,
                isFirstLoad: payload.isFirstLoad,
                isOnlyData: payload.isOnlyData,
                selectedTargetId: payload.selectedTargetId
            }
        );
        console.log(response);
        return response;
    } catch (error) {
        return error.response;
    }
}

/**
 * Define function call API get data ressponse
 */
export const GetTradingProductSuggestion = async (
    payload: {
        searchValue?: string,
        offset?: number,
        listIdChoice?: number[]
    },
): Promise<GetTradingProductSuggestionResponse> => {
    try {
        const response = await apiClient.post(
            getTradingProductSuggestApiUrl,
            payload
        );
        return response;
    } catch (error) {
        return error.response;
    }
};