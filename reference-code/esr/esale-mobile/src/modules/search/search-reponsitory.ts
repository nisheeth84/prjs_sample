import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../config/clients/api-client";
import {
  SALES_API,
  CUSTOMER_API,
  getEmployeesApi,
  searchActivitiesApiUrl,
  searchEmployeesScheduleApiUrl,
  searchGlobalApiUrl,
  searchProductSuggestionsApiUrl,
  searchSuggestScheduleApiUrl,
  searchProductsApiUrl,
  searchReportApiUrl,
  searchSuggestProductTradingApiUrl,
  getFieldInforApiUrl,
  updateFieldInforPersonalsApiUrl,
  getCustomFieldInfoApiUrl,
  searchSuggestTimelineApiUrl,
  searchBussinessCardSuggestionsApiUrl,
} from "../../config/constants/api";

export interface SearchGlobal {
  query: string;
}

export interface SearchGlobalResponse {
  customerId: number;
  customerName: string;
  parentCustomerName: string;
}

export interface Schedules {
  scheduleId: number;
  scheduleName: string;
  startDate: string;
  endDate: string;
}

// export interface SearchOrConditions {
//   fieldType: number;
//   fieldName: string;
//   fieldValue: Array<Schedules>;
// }

// export interface SearchConditions {
//   fieldType: number;
//   fieldName: string;
//   fieldValue: number;
// }

export interface SuggestScheduleDataResponse {
  // searchOrConditions: Array<SearchOrConditions>;
  // searchConditions: Array<SearchConditions>;
  resultFields: Array<Schedules>;
}

export interface SuggestScheduleResponse {
  data: any;
  status: number;
}
/**
 *
 * @param get service Calendar api getScheduleSuggestionsGlobal
 */
export const getScheduleSuggestionsGlobal = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<SuggestScheduleResponse> => {
  try {
    const response = await apiClient.post(
      searchSuggestScheduleApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface TimelineSuggestionsGlobal {
  timelineId: number;
  createdDate: string;
  comment: string;
}

export interface TimelineSuggestionsGlobalDataResponse {
  timelines: Array<TimelineSuggestionsGlobal>;
}

export interface TimelineSuggestionsGlobalResponse {
  data: TimelineSuggestionsGlobalDataResponse;
  status: number;
}

/**
 *
 * @param get service Timeline api getTimelineSuggestionsGlobal
 */
export const getTimelineSuggestionsGlobal = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<TimelineSuggestionsGlobalResponse> => {
  try {
    const response = await apiClient.post(
      searchSuggestTimelineApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface BusinessCardGlobalDataResponse {
  businessCardId: number;
  businessCardImagePath: string;
  departmentName: string;
  businessCardName: string;
  position: string;
  customerName: string;
}

export interface BusinessCardSuggestionsGlobalResponse {
  data: any;
  status: number;
}
/**
 *
 * @param get businessCard api getBusinessCardSuggestionsGlobal
 */
export const getBusinessCardSuggestionsGlobal = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<BusinessCardSuggestionsGlobalResponse> => {
  try {
    const response = await apiClient.post(
      searchBussinessCardSuggestionsApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface CustomerParent {
  customerName: string;
}

export interface CustomerSuggestionsGlobalDataResponse {
  customerName: string;
  customerParent: CustomerParent;
  building: string;
  address: string;
}

export interface CustomerSuggestionsGlobalResponse {
  data: Array<CustomerSuggestionsGlobalDataResponse>;
  status: number;
}

/**
 *
 * @param get customers api getCustomerSuggestionsGlobal
 *   param: {                 									
    "searchValue": "data search",    									
    "limit": 10,               									
    "offset": 15									
  }                 									
 */
export const getCustomerSuggestionsGlobal = async (
  payload: SearchGlobal,
  config?: AxiosRequestConfig
): Promise<CustomerSuggestionsGlobalResponse> => {
  try {
    const response = await apiClient.post(
      searchGlobalApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface EmployeesPhoto {
  photoFileName: string;
  photoFilePath: string;
}

export interface EmployeesDepartments {
  departmentId: number;
  departmentName: string;
  positionId: number;
  positionName: string;
}

export interface Employees {
  employeeName: string;
  employeePhoto: EmployeesPhoto;
  employeeDepartments: Array<EmployeesDepartments>;
}

export interface EmployeeSuggestionsGlobalDataResponse {
  total: number;
  employees: Array<Employees>;
}

export interface EmployeeSuggestionsGlobalResponse {
  data: EmployeeSuggestionsGlobalDataResponse;
  status: number;
}

/**
 *
 * @param get api getEmployeeSuggestionsGlobal
 *   param: {                 									
    "searchValue": "data search",    									
    "limit": 10,               									
    "offset": 15									
  }                 									
 */
export const getEmployeeSuggestionsGlobal = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<EmployeeSuggestionsGlobalResponse> => {
  try {
    const response = await apiClient.post(
      searchEmployeesScheduleApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface Products {
  productId: number;
  productName: string;
  productCategoryName: string;
  productImagePath: string;
  unitPrice: number;
  isSet: boolean;
}

export interface ProductSuggestionsGlobalDataResponse {
  products: Array<Products>;
  totalRecord: number;
}

export interface ProductSuggestionsGlobalResponse {
  data: ProductSuggestionsGlobalDataResponse | any;
  status: number;
}

/**
 *
 * @param get api getSetProductSuggestionsGlobal + getProductSuggestionsGlobal
 *   param: {                 									
    "searchValue": "data search",    									
    "limit": 10,               									
    "offset": 15									
  }                 									
 */
export const getProductSuggestionsGlobal = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<ProductSuggestionsGlobalResponse> => {
  try {
    const response = await apiClient.post(
      searchProductSuggestionsApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface Milestone {
  milestoneId: number;
  milestoneName: string;
}

export interface Customer {
  customerId: number;
  customerName: string;
}
export interface ProductTradings {
  productTradingId: number;
  productTradingName: string;
}
export interface TaskSuggestionsGlobalDataResponse {
  taskId: number;
  taskName: string;
  milestone: Milestone;
  customer: Customer;
  productTradings: Array<ProductTradings>;
  finishDate: string;
}

export interface TaskSuggestionsGlobalResponse {
  data: Array<TaskSuggestionsGlobalDataResponse>;
  status: number;
}

/**
 *
 * @param get api getTaskSuggestionsGlobal
 *   param: {                 									
    "searchValue": "data search",    													
  }                 									
 */
// TODO use when integrate search global task
// export const getTaskSuggestionsGlobal = async (
//   payload: SearchGlobal,
//   config?: AxiosRequestConfig
// ): Promise<TaskSuggestionsGlobalResponse> => {
//   try {
//     const response = await apiClient.post(
//       searchSuggestScheduleApiUrl,
//       payload,
//       config
//     );
//     return response;
//   } catch (error) {
//     return error.response;
//   }
// };

export interface ProductTradingSuggestionsGlobalDataResponse {
  taskId: number;
  taskName: string;
  milestone: Milestone;
  customer: Customer;
  productTradings: ProductTradings;
  finishDate: string;
}

export interface ProductTradingSuggestionsGlobalResponse {
  data: any;
  status: number;
}

/**
 *
 * @param get sales api getProductTradingSuggestionsGlobal
 */
export const getProductTradingSuggestionsGlobal = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<ProductTradingSuggestionsGlobalResponse> => {
  try {
    const response = await apiClient.post(
      searchSuggestProductTradingApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface ActivitiesResponse {
  data: Array<any>;
  status: number;
}

/**
 *
 * @param get api getActivities
 *   param: {                 									
    "searchValue": "data search",    													
  }                 									
 */
export const getActivities = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<ActivitiesResponse> => {
  try {
    const response = await apiClient.post(
      searchActivitiesApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface ReportSuggestionsGlobalDataResponse {
  reportId: number;
  reportName: string;
  reportCategoryId: number;
  reportCategoryName: string;
}

export interface ReportSuggestionsGlobalResponse {
  data: Array<ReportSuggestionsGlobalDataResponse>;
  status: number;
}

/**
 * @param get api analysis getReportSuggestionsGlobal
 */
export const getReportSuggestionsGlobal = async (
  payload: SearchGlobal,
  config?: AxiosRequestConfig
): Promise<ActivitiesResponse> => {
  try {
    const response = await apiClient.post(
      searchReportApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface CustomersResponse {
  data: any;
  status: number;
}

export const getCustomers = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<CustomersResponse> => {
  try {
    const response = await apiClient.post(
      CUSTOMER_API.getCustomers,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getProductTradingByActivity = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<CustomersResponse> => {
  try {
    const response = await apiClient.post(
      SALES_API.getProductTradingByActivity,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface EmployeesResponse {
  data: any;
  status: number;
}

export interface EmployeesPayload {
  query: string;
}

export const getFieldInfoPersonal = async (
  payload?: any,
  config?: any
): Promise<any> => {
  try {
    const response = await apiClient.post(
      "services/commons/api/get-field-info-personals",
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getCustomFieldInfo = async (
  payload?: any,
  config?: any
): Promise<any> => {
  try {
    const response = await apiClient.post(
      getCustomFieldInfoApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};


export const getFieldInfo = async (
  payload?: any,
  config?: any
): Promise<any> => {
  try {
    const response = await apiClient.post(
      getFieldInforApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const updateFieldInfoPersonals = async (
  payload?: any,
  config?: any
): Promise<any> => {
  try {
    const response = await apiClient.post(
      updateFieldInforPersonalsApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getDataLayout = async (
  url: string,
  payload?: any,
  config?: any
): Promise<any> => {
  try {
    const response = await apiClient.post(url, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define function call API get data products
 */
export const getProducts = async (
  payload: any,
  config?: any
): Promise<any> => {
  try {
    const response = await apiClient.post(searchProductsApiUrl, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getEmployeeLists = async (
  payload: any,
  config?: any
): Promise<any> => {
  try {
    const response = await apiClient.post(getEmployeesApi, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getTradingProduct = async (
  payload: any,
  config?: any
): Promise<any> => {
  try {
    const response = await apiClient.post(SALES_API.getProductTradings, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// Missing
// 13_API設計_06_活動_getActivitySuggestionsGlobal.xlsx
// 13_API設計_14_商品_getSetProductSuggestionsGlobal.xlsx
// row 123 sai api name
