import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../config/clients/api-client";
import {
  COMMONS_API,
  EMPLOYEES_API,
  TENANT_API,
} from "../../config/constants/api";
import { Employee } from "../employees/employees-types";
import StringUtils from "../../shared/util/string-utils";

// Service Favorite
export interface ServicePayload {
  query: string;
}
export interface GetServiceFavoritePayload {
  employeeId: number;
}
export interface Service {
  serviceId: number;
  employeeId: number;
  serviceName: string;
}
export interface ServiceFavorite {
  createdDate: any;
  createdUser: number;
  updatedDate: any;
  updatedUser: number;
  serviceId: number;
  employeeId: number;
  serviceName: string;
}
export interface ServiceFavoriteResponse {
  data: { data: Array<ServiceFavorite> };
  status: number;
}
export const getServiceFavorite = async (
  payload: GetServiceFavoritePayload,
  config?: AxiosRequestConfig
): Promise<ServiceFavoriteResponse> => {
  try {
    const response = await apiClient.post(
      COMMONS_API.getServiceFavoriteUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
// Delete Service Favorite
export interface DeleteServiceFavoritePayload {
  serviceId: number | undefined;
  employeeId: number;
}
export interface DeleteServiceFavoriteResponse {
  serviceId: number;
}
export interface DeleteServiceFavoriteDataResponse {
  data: DeleteServiceFavoriteResponse;
  status: number;
}
export const deleteServiceFavorite = async (
  payload: DeleteServiceFavoritePayload,
  config?: AxiosRequestConfig
): Promise<DeleteServiceFavoriteDataResponse> => {
  try {
    const response = await apiClient.post(
      COMMONS_API.deleteServiceFavoriteUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
// Create Service Favorite
export interface CreateServiceFavoritePayLoad {
  employeeId: number;
  serviceId: number | undefined;
  serviceName: string;
}
export interface CreateServiceFavoriteResponse {
  serviceId: number;
}
export interface CreateServiceFavoriteDataResponse {
  data: CreateServiceFavoriteResponse;
  status: number;
}

export interface GetListSuggestionsDataDataResponse {
  listId: number;
  employeeName: string;
  listName: string;
  displayOrder: number;
  listType: number;
  displayOrderFavoriteList: number;
}

export interface GetListSuggestionsDataDataResponse {
  listId: number;
  employeeName: string;
  listName: string;
  displayOrder: number;
  listType: number;
  displayOrderFavoriteList: number;
}

export interface GetListSuggestionsDataDataResponse {
  listId: number;
  employeeName: string;
  listName: string;
  displayOrder: number;
  listType: number;
  displayOrderFavoriteList: number;
}

export const createServiceFavorite = async (
  payload: CreateServiceFavoritePayLoad,
  config?: AxiosRequestConfig
): Promise<CreateServiceFavoriteDataResponse> => {
  try {
    const response = await apiClient.post(
      COMMONS_API.createServiceFavoriteUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
// Get Company Name
export interface GetCompanyNamePayload {
  tenantName: string;
}
export interface TenantNamePayLoad {
  payload: TenantNamePayLoad;
}
export interface TenantNameResponse {
  companyName: string;
}
export interface TenantNameDataResponse {
  data: TenantNameResponse;
  status: number;
}
export const getCompanyName = async (
  payload: GetCompanyNamePayload,
  config?: AxiosRequestConfig
): Promise<TenantNameDataResponse> => {
  try {
    const response = await apiClient.post(
      TENANT_API.getCompanyNameUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// Get Service Orther
export interface GetServiceOrderPayload {
  employeeId: number | undefined;
  data: Array<{ serviceId: number }>;
}
export interface ServiceOrder {
  serviceId: number | undefined;
  serviceName: string | undefined;
  serviceOrder: number | undefined;
  updateDate?: any | undefined;
}

export interface GetListSuggestionsDataResponse {
  listInfo: GetListSuggestionsDataDataResponse[];
}

export interface GetServiceOrderResponse {
  employeeId: number;
  data: Array<ServiceOrder>;
}
export interface GetServiceOrderDataResponse {
  data: GetServiceOrderResponse;
  status: number;
}

export const getServiceOrder = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetServiceOrderDataResponse> => {
  try {
    const response = await apiClient.post(
      COMMONS_API.getServiceOrderUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
// Create Service Orther
export interface CreateServiceOrderPayload {
  employeeId: number;
  data: Array<ServiceOrder>;
}
export interface EmployeeId {
  serviceId: number;
}
export interface CreateServiceOrderResponse {
  data: EmployeeId;
  status: number;
}

export const createServiceOrder = async (
  payload: CreateServiceOrderPayload,
  config?: AxiosRequestConfig
): Promise<CreateServiceOrderResponse> => {
  try {
    const response = await apiClient.post(
      COMMONS_API.createServiceOrderUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
// Get ServiceInfo
export interface GetServiceInfoPayload {
  serviceType: number | null;
}
export interface ServiceInfo {
  serviceType: number;
  serviceId: number;
  serviceName: string;
}

export interface GetServiceInfoResponse {
  servicesInfo: Array<ServiceInfo>;
}
export interface GetServiceInfoDataResponse {
  data: GetServiceInfoResponse;
  status: number;
}

export const getServiceInfo = async (
  payload: GetServiceInfoPayload,
  config?: AxiosRequestConfig
): Promise<GetServiceInfoDataResponse> => {
  try {
    const response = await apiClient.post(
      COMMONS_API.getServicesInfoUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// Get employee
export interface GetEmployeePayload {
  employeeId: number;
}
export interface GetEmployeeDataResponse {
  data: any;
  status: number;
}

export const getEmployee = async (
  payload: GetEmployeePayload,
  config?: AxiosRequestConfig
): Promise<GetEmployeeDataResponse> => {
  try {
    const response = await apiClient.post(
      EMPLOYEES_API.getEmployeeUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// Get unread notification
export interface GetUnreadNotiPayload {
  employeeId: number;
}
export interface GetUnreadNotiDataResponse {
  data: { unreadNotificationNumber: number };
  status: number;
}

export const getUnreadNotification = async (
  payload: GetUnreadNotiPayload,
  config?: AxiosRequestConfig
): Promise<GetUnreadNotiDataResponse> => {
  try {
    const response = await apiClient.post(
      COMMONS_API.countUnreadNotificationUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface GetNormalLogoutDataResponse {
  data: any;
  status: number;
}

export const normalLogout = async (
  payload: object,
  config?: AxiosRequestConfig
): Promise<GetUnreadNotiDataResponse> => {
  try {
    const response = await apiClient.post(
      EMPLOYEES_API.logoutUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// getListSuggestions
export interface GetListSuggestionsPayload {
  searchValue: string;
}
export interface GetListSuggestionsDataDataResponse {
  listId: number;
  employeeName: string;
  listName: string;
  displayOrder: number;
  listType: number;
  displayOrderOfFavoriteList: number;
  customerListType: number;
  isFavoriteList: number;
}

export interface GetListSuggestionsDataResponse {
  listInfo: GetListSuggestionsDataDataResponse[];
}

export interface GetListSuggestionsResponse {
  data: GetListSuggestionsDataResponse;
  status: number;
}
/**
 * Call api getListSuggestions
 * @param payload
 * @param config
 */
export const getListSuggestions = async (
  apiUrl: string,
  payload: GetListSuggestionsPayload,
  config?: AxiosRequestConfig
): Promise<GetListSuggestionsResponse> => {
  try {
    const response = await apiClient.post(apiUrl, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface DataEmployee {
  employeeId: number;
  employeePhoto: {
      filePath: string;
      fileName: string;
  };
  employeeDepartments: Array<{
      departmentId: number;
      departmentName: string;
      positionId: number;
      positionName: string;
      managerId: number;
  }>;
  employeeSurname: string;
  employeeName: string;
  employeeSurnameKana: string;
  employeeNameKana: string;
  email: string;
  telephoneNumber: string;
  cellphoneNumber: string;
  isAdmin: boolean;
  userId: string;
  employeeStatus: number;
  languageId: number;
  isDisplayFirstScreen: boolean;
  employeeData: Array<{
      fieldType: number;
      key: string;
      value: string;
  }>;
}

export interface EmployeesByIds {
  employeeIds: Array<any>;
}

export interface EmployeeByIdsResponse {
  data: EmployeeByIdsDataResponse;
  status: number;
}

export interface EmployeeByIdsDataResponse {
  employees: Array<DataEmployee>;
}

export const getEmployeesByIds = async (
  payload: EmployeesByIds,
  config?: AxiosRequestConfig
): Promise<EmployeeByIdsResponse> => {
  try {
      const response = await apiClient.post(EMPLOYEES_API.getEmployeesByIds, payload, config);
      return response;
  } catch (error) {
      return error.response;
  }
};

export interface UpdateDisplayFirstScreenRequest {
  employeeId: string,
  isDisplayFirstScreen: boolean,
  updatedDate: string
}

export interface UpdateDisplayFirstScreenResponse {
  data: any,
  status: number
}

export const updateDisplayFirstScreen = async (
  payload: UpdateDisplayFirstScreenRequest,
  config?: AxiosRequestConfig
): Promise<UpdateDisplayFirstScreenResponse> => {
  try {
    const response = await apiClient.post(EMPLOYEES_API.updateDisplayFirstScreen, payload, config);
    return response;
  } catch (error) {
      return error.response;
  }
}
