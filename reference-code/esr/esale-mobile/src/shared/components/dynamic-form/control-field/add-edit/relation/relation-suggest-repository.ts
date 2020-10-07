import { EmployeeSuggestionResponse } from "../../interface/employee-suggest-interface";
import { apiClient } from "../../../../../../config/clients/api-client";
import { CustomerSuggest } from "./customer/customer-suggest-interface";
const getEmployeesSuggestionApiUrl = "/services/employees/api/get-employees-suggestion";
const customerSugesstionApiUrl = '/services/customers/api/get-customer-suggestion';
const getTasksSuggestApiUrl = "/services/schedules/api/get-task-suggestion";

export interface ListItemChoice {
  idChoice : number;
  searchType: number;
}

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
  relationFieldI?: number
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
export interface MilestoneTaskSuggest {
  milestoneId: number;
  milestoneName: string;
}


export interface CustomerTaskSuggest {
 customerId: number;
 customerName: string;
 parentCustomerName: string;
}

/**
* Define values of Product
*/
export interface ProductTradings {
 productTradingId: number,
 productTradingName: string
}


export interface Tasks {
  taskId: number,// data in database mapping data form
  taskName: string,// data in database mapping
  milestone: MilestoneTaskSuggest,// data in database mapping
  customer: CustomerTaskSuggest,// data in database mapping
  productTradings: ProductTradings[],// data in database mapping
  finishDate: string,// data in database mapping
  status: number// data in database mapping
  operators: {
    employeeId: number,
    employeeName: string,
    employeeSurname: string
  }[]
}


export interface GetTasksSuggestionResponse {
  data: {
    tasks: Tasks[],// data ressponse from database
    total: number// data ressponse from database
  }
  status: number;// status off response
}
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
 * Define payload
 */
export interface CustomersSuggestionPayload {
  keyWords?: string,
  offset?: number,
  limit?: number,
  listIdChoice?: number[],
  relationFieldId?:number
}

/**
 * Define structure values of data api
 */
export interface CustomersSuggestionResponse {
  data: { customers: CustomerSuggest[] };// list data form response
  status: number;// status off response
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
