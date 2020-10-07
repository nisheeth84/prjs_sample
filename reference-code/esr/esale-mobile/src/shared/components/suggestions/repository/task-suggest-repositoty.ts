import { apiClient } from "../../../../config/clients/api-client";
import { GetTasksSuggestionResponse, CustomFieldsInfoResponse, FieldInfoPersonalsResponse, SuggestionsChoiceResponse, GetTasksResponse } from "../interface/task-suggest-interface";
import { ISearchCondition } from "../task/task-search-detail/search-detail-interface";

// URL
const getTasksSuggestApiUrl = "/services/schedules/api/get-task-suggestion";
const saveSuggestionsChoiceApiUrl = "/services/commons/api/save-suggestions-choice";
const getCustomFieldsInfoApiUrl = "/services/commons/api/get-custom-fields-info";
const getFieldInfoPersonalsApiUrl = "/services/commons/api/get-field-info-personals";
const updateFieldInfoPersonalsApiUrl = "/services/commons/api/update-field-info-personals";
const getTasksApiUrl = "/services/schedules/api/get-tasks";
const getDataLayoutApiUrl = "/services/schedules/api/get-task-layout";

/**
 * Define function call API get data ressponse
 */
export const getTasksSuggestion = async (
  payload: {
    searchValue?: string,
    offset?: number,
    limit?: number,
    listIdChoice?: number[]
  },
): Promise<GetTasksSuggestionResponse> => {
  try {
    const response = await apiClient.post(
      getTasksSuggestApiUrl,
      payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define function call API save data ressponse
 */
export const saveSuggestionsChoice = async (
  payload: {
    sugggestionsChoice: {
      index: string,
      idResult: number
    }[]
  }
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
 * Define payload
 */
export interface GetTasksPayload {
  statusTaskIds?: any[],
  searchLocal?: string,
  searchConditions?: ISearchCondition[],
  filterConditions?: ISearchCondition[],
  limit?: number,
  offset?: number,
  filterByUserLoginFlg?: number
}

/**
 * Define function call API get data ressponse
 */
export const getTasks = async (
  payload: GetTasksPayload
): Promise<GetTasksResponse> => {
  try {
    const response = await apiClient.post(
      getTasksApiUrl,
      payload
    );
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