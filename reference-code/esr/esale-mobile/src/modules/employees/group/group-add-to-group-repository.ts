import { apiClient } from "../../../config/clients/api-client";
export const getGroupSuggestions = "/services/employees/api/get-group-suggestions";
export const addGroup = "/services/employees/api/add-group";

/**
 * Interface search
 */
export interface SearchConditions {
  searchValue: string;
}

/**
 * Interface post 
 */
export interface AddGroup {
  groupId: number;
  employeeIds: [];
}

/**
 * get API Search
 * @param payload get data API
 */
export const getGroupSuggestionFromAPI = async (payload: SearchConditions): Promise<any> => {
  try {
    const response = await apiClient.post(
      getGroupSuggestions,
      {
        searchValue: payload.searchValue
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * get API Add Group
 * @param payload get data API
 */
export const addGroupAPI = async (payload: AddGroup): Promise<any> => {
  try {
    const response = await apiClient.post(
      addGroup,
      {
        groupId: payload.groupId,
        employeeIds: payload.employeeIds
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
}													
