import { apiClient } from "../../../../config/clients/api-client";
import { EmployeeState } from "../interface/employee-suggest-result-search-interface";
import { SearchConditions } from "../employee/employee-search-detail/search-detail-interface";

export const getEmployeesUrl = "/services/employees/api/get-employees";
export interface EmployeeSuggestPayload {
  status: number,
  data: EmployeeState
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
export const getEmployyees = async (
  //input
  payload: SearchCondition
  //output
): Promise<EmployeeSuggestPayload> => {
  try {
    const response = await apiClient.post(
      getEmployeesUrl,
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