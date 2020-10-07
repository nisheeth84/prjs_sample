import { apiClient } from '../../../../config/clients/api-client';
import { CustomFieldsInfoResponse, FieldInfoPersonalsResponse, SuggestionsChoiceResponse, MilestoneSuggest } from '../interface/milestone-suggest-interface';
import { SearchConditions } from '../milestone/milestone-search-detail/search-detail-interface';

const getCustomFieldsInfoApiUrl = "/services/commons/api/get-custom-fields-info";
const getFieldInfoPersonalsApiUrl = "/services/commons/api/get-field-info-personals";
const saveSuggestionsChoiceApiUrl = "/services/commons/api/save-suggestions-choice";
const getMilestonesApiUrl = "/services/schedules/api/get-milestones";
const getMilestonesSuggestionApiUrl = "services/schedules/api/get-milestones-suggestion";

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


export interface MilestoneSuggestPayload {
  status: number,
  data: any
}


/**
 * Define function call API get data ressponse
 */
export const getMilestones = async (
  //input
  payload: SearchCondition
  //output
): Promise<MilestoneSuggestPayload> => {
  try {
    const response = await apiClient.post(
      getMilestonesApiUrl,
      {
        searchConditions: payload.searchConditions,
        limit: payload.limit,
        offset: payload.offset
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
}


export interface SearchCondition {
  searchConditions: SearchConditions[];
  limit: number;
  offset: number;
}

/**
 * payload of getMilestoneSuggestions
 */
export interface getMilestoneSuggestionsParameter {
  offset: number;
  searchValue: string;
  listIdChoice?: number[];
  limit: number;
}

export interface MilestoneSuggestRespone {
  status: number;
  data: any;
}

export interface dataInfoRespone {
  dataInfo: MilestoneSuggest[];
  total: number;
}

/**
 * Define function call getMilestoneSuggestions API
 */
export const getMilestoneSuggestions = async (
  //input
  payload: getMilestoneSuggestionsParameter
  //output
): Promise<MilestoneSuggestRespone> => {
  try {
    const response = await apiClient.post(
      getMilestonesSuggestionApiUrl,
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