import { apiClient } from '../../../../config/clients/api-client';
import { EmployeeSuggestionResponse, CustomFieldsInfoResponse, FieldInfoPersonalsResponse, EmployeeSuggestionsChoiceResponse, SelectedOrganizationInfoResponse } from '../interface/employee-suggest-interface';

// API url
const getCustomFieldsInfoApiUrl = "/services/commons/api/get-custom-fields-info";
const getFieldInfoPersonalsApiUrl = "/services/commons/api/get-field-info-personals";
const updateFieldInfoPersonalsApiUrl = "/services/commons/api/update-field-info-personals";
const getEmployeesSuggestionApiUrl = "/services/employees/api/get-employees-suggestion";
const saveEmployeeSuggestionsChoiceApiUrl = "/services/commons/api/save-suggestions-choice";
const getSelectedOrganizationInfoApiUrl = "/services/employees/api/get-selected-organization-info";

/**
 * Define EmployeeSuggestion Payload
 */
export interface EmployeeSuggestionPayload {
  keyWords?: string,
  startTime?: string,
  endTime?: string,
  searchType?: number | null,
  offSet?: number,
  limit?: number,
  listItemChoice?: {
    idChoice: number,
    searchType: number
  }[],
  relationFieldId?: number
}

/**
 * Define function call API get data ressponse
 */
export const employeesSuggestion = async (
  payload: EmployeeSuggestionPayload,
): Promise<EmployeeSuggestionResponse> => {
  try {
    const response = await apiClient.post(
      getEmployeesSuggestionApiUrl,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define EmployeeSuggestionsChoice Payload
 */
export interface EmployeeSuggestionsChoicePayload {
  sugggestionsChoice: {
    index: string,
    idResult: number
  }[]
}

/**
 * Define function call saveEmployeeSuggestionsChoice API
 */
export const saveEmployeeSuggestionsChoice = async (
  payload: EmployeeSuggestionsChoicePayload,
): Promise<EmployeeSuggestionsChoiceResponse> => {
  try {
    const response = await apiClient.post(
      saveEmployeeSuggestionsChoiceApiUrl,
      payload,
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
  fieldInfos: {
    fieldId: number,
  }[],
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
 * Define function call getSelectedOrganizationInfo API
 */
export const getSelectedOrganizationInfo = async (
  payload?: {
    departmentId: number[],
    groupId: number[],
    employeeId: number[]
  }
): Promise<SelectedOrganizationInfoResponse> => {
  try {
    const response = await apiClient.post(getSelectedOrganizationInfoApiUrl, payload);
    return response;
  } catch (error) {
    return error.response;
  }
};