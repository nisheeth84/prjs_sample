import { apiClient } from "../../../../config/clients/api-client";
import { DataResponse } from "./interface/dynamic-field-interface";
import { SERVICE_EMPLOYEE, SERVICE_SALE, SERVICE_PRODUCT, SERVICE_SCHEDULES, SERVICE_BUSSINESS_CARDS, SERVICE_CUSTOMER, SERVICE_ACTIVITIES,SERVICE_COMMONS } from "../../../../config/constants/constants";

/**
 * Define payload Employee
 */
export interface EmployeePayload {
  searchConditions: any[];
  filterConditions: any[];
  localSearchKeyword: any;
  selectedTargetType: any;
  selectedTargetId: any;
  isUpdateListView: any;
  orderBy: any[];
  offset: any;
  limit: any;
}

/**
 * Define function call API get data employees
 */
export const getEmployees = async (
  payload: EmployeePayload,
): Promise<DataResponse> => {
  try {
    const response = await apiClient.post(
      `${SERVICE_EMPLOYEE}/get-employees`,
      {
        searchConditions: payload.searchConditions,
        filterConditions: payload.filterConditions,
        localSearchKeyword: payload.localSearchKeyword,
        selectedTargetType: payload.selectedTargetType,
        selectedTargetId: payload.selectedTargetType === 1 ? 0 : payload.selectedTargetId,
        isUpdateListView: payload.isUpdateListView,
        orderBy: payload.orderBy,
        offset: payload.offset,
        limit: payload.limit
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define payload ProductTrading
 */
export interface ProductTradingPayload {
  isOnlyData: any;
  searchLocal: any;
  searchConditions: any[];
  filterConditions: any[];
  orderBy: any[];
  offset: any;
  limit: any;
  isFirstLoad: any;
  selectedTargetType: any;
  selectedTargetId: any;
}

/**
 * Define function call API get data product tradings
 */
export const getProductTradings = async (
  payload: ProductTradingPayload
): Promise<DataResponse> => {
  try {
    const response = await apiClient.post(
      `${SERVICE_SALE}/get-product-tradings`,
      {
        isOnlyData: payload.isOnlyData,
        searchLocal: payload.searchLocal,
        searchConditions: payload.searchConditions,
        filterConditions: payload.filterConditions,
        orderBy: payload.orderBy,
        offset: payload.offset,
        limit: payload.limit,
        isFirstLoad: payload.isFirstLoad,
        selectedTargetType: payload.selectedTargetType,
        selectedTargetId: payload.selectedTargetId
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};


/**
 * Define payload Product
 */
export interface ProductPayload {
  searchConditions: any[];
  productCategoryId: any;
  isContainCategoryChild: any;
  searchLocal: any;
  orderBy: any[];
  offset: any;
  limit: any;
  isOnlyData: any;
  filterConditions: any[];
  isUpdateListInfo: any;
}

/**
 * Define function call API get data products
 */
export const getProducts = async (
  payload: ProductPayload
): Promise<DataResponse> => {
  try {
    const response = await apiClient.post(
      `${SERVICE_PRODUCT}/get-products`,
      {
        searchConditions: payload.searchConditions,
        productCategoryId: payload.productCategoryId,
        isContainCategoryChild: payload.isContainCategoryChild,
        searchLocal: payload.searchLocal,
        orderBy: payload.orderBy,
        offset: payload.offset,
        limit: payload.limit,
        isOnlyData: payload.isOnlyData,
        filterConditions: payload.filterConditions,
        isUpdateListInfo: payload.isUpdateListInfo
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define payload Task
 */
export interface TaskPayload {
  statusTaskIds: any[];
  searchLocal: any;
  localNavigationConditons: any;
  searchConditions: any[];
  filterConditions: any[];
  orderBy: any[];
  limit: any;
  offset: any;
  filterByUserLoginFlg: any;
}

/**
 * Define function call API get data tasks
 */
export const getTasks = async (
  payload: TaskPayload
): Promise<DataResponse> => {
  try {
    const response = await apiClient.post(
      `${SERVICE_SCHEDULES}/get-tasks`,
      {
        statusTaskIds: payload.statusTaskIds,
        searchLocal: payload.searchLocal,
        localNavigationConditons: payload.localNavigationConditons,
        searchConditions: payload.searchConditions,
        filterConditions: payload.filterConditions,
        orderBy: payload.orderBy,
        limit: payload.limit,
        offset: payload.offset,
        filterByUserLoginFlg: payload.filterByUserLoginFlg
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define payload BusinessCard
 */
export interface BusinessCardPayload {
  searchConditions: any[];
  orderBy: any[];
  offset: any;
  limit?: any;
  searchLocal: any;
  filterConditions: any[];
  isFirstLoad: any;
}

/**
 * Define function call API get data BusinessCards
 */
export const getBusinessCards = async (
  payload: BusinessCardPayload
): Promise<DataResponse> => {
  try {
    const response = await apiClient.post(
      `${SERVICE_BUSSINESS_CARDS}/get-business-cards`,
      {
        searchConditions: payload.searchConditions,
        orderBy: payload.orderBy,
        offset: payload.offset,
        limit: payload.limit,
        searchLocal: payload.searchLocal,
        filterConditions: payload.filterConditions,
        isFirstLoad: payload.isFirstLoad
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define payload Customer
 */
export interface CustomerPayload {
  searchConditions: any[];
  localSearchKeyword: any;
  selectedTargetType: any;
  selectedTargetId: any;
  isFirstLoad?: any;
  isUpdateListView: any;
  filterConditions: any[];
  orderBy: any[];
  offset: any;
  limit?: any;
}

/**
 * Define function call API get data Customers
 */
export const getCustomers = async (
  payload: CustomerPayload
): Promise<DataResponse> => {
  try {
    const response = await apiClient.post(
      `${SERVICE_CUSTOMER}/get-customers`,
      {
        searchConditions: payload.searchConditions,
        localSearchKeyword: payload.localSearchKeyword,
        selectedTargetType: payload.selectedTargetType,
        selectedTargetId: payload.selectedTargetId,
        isFirstLoad: payload.isFirstLoad,
        isUpdateListView: payload.isUpdateListView,
        filterConditions: payload.filterConditions,
        orderBy: payload.orderBy,
        offset: payload.offset,
        limit: payload.limit,
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define payload Activity
 */
export interface ActivityPayload {
  listBusinessCardId: any[];
  listCustomerId: any[];
  listProductTradingId: any[];
  searchLocal: any;
  searchConditions: any[];
  filterConditions: any[];
  isFirstLoad: any;
  selectedTargetType: any;
  selectedTargetId: any;
  orderBy: any[];
  offset: any;
  limit: any;
  hasTimeline: any;
}

/**
 * Define function call API get data Activities
 */
export const getActivities = async (
  payload: ActivityPayload
): Promise<DataResponse> => {
  try {
    const response = await apiClient.post(
      `${SERVICE_ACTIVITIES}/get-activities`,
      {
        listBusinessCardId: payload.listBusinessCardId,
        listCustomerId: payload.listCustomerId,
        listProductTradingId: payload.listProductTradingId,
        searchLocal: payload.searchLocal,
        searchConditions: payload.searchConditions,
        filterConditions: payload.filterConditions,
        isFirstLoad: payload.isFirstLoad,
        selectedTargetType: payload.selectedTargetType,
        selectedTargetId: payload.selectedTargetId,
        orderBy: payload.orderBy,
        offset: payload.offset,
        limit: payload.limit,
        hasTimeline: payload.hasTimeline
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define payload Address
 */
export interface AddressesPayload {
  zipCode: string,
  offset: number,
  limit: number
}

/**
 * Define function call API get data AddressesFromZipCode
 */
export const getAddressesFromZipCode = async (
  payload: AddressesPayload
): Promise<DataResponse> => {
  try {
    const response = await apiClient.post(
      `${SERVICE_COMMONS}/get-addresses-from-zip-code`,
      {
        zipCode: payload.zipCode,
        offset: payload.offset,
        limit: payload.limit,
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};



export interface MilestonesPayload {
  searchCondition: any[],
  offset?: number,
  limit?: number
}

/**
 * Define function call API get data Customers
 */
export const getMilestones = async (
  payload: MilestonesPayload
): Promise<DataResponse> => {
  try {
    const response = await apiClient.post(
      `${SERVICE_SCHEDULES}/get-milestones`,
      {
        searchConditions: payload.searchCondition,
        offset: payload.offset,
        limit: payload.limit,
      }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};