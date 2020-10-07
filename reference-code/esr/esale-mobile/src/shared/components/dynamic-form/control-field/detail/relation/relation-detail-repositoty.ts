
import { apiClient } from '../../../../../../config/clients/api-client';
import { RelationCustomersResponse } from './customer/customer-types';
import { RelationEmployeeResponse } from './employee/employees-types';
import { RelationMilestoneResponse } from './milestone/milestone-type';
import { RelationProductTradingsResponse } from './product-trading/product-trading-type';
import { RelationProductsResponse } from './product/product-type';
import { RelationTasksResponse } from './task/task-type';
const getRelationEmployeesUrl = "/services/employees/api/get-employees-by-ids";
const getRelationCustomersUrl = "/services/customers/api/get-customers-by-ids";
const getRelationProductsUrl = "/services/products/api/get-products-by-ids";
const getRelationProductTradingUrl = "/services/sales/api/get-product-trading-by-ids";
const getRelationBusinessCardsUrl = "/services/businesscards/api/get-business-card-by-ids";
const getRelationMilestoneUrl = "/services/schedules/api/get-milestones-by-ids";
const getRelationTasksUrl = "/services/schedules/api/get-task-by-ids";
const getRelationDataUrl = "/services/commons/api/get-relation-data";

/**
 * Define payload
 */
export interface InitializePayload { }

/**
 * Define function call API get data ressponse
 */
export const getRelationData = async (
  //input
  payload: InitializePayload
  //output
): Promise<RelationProductsResponse> => {
  try {
    const response = await apiClient.post(
      getRelationDataUrl, payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * Define function call API get data ressponse
 */
export const getRelationEmployyees = async (
  //input
  payload: InitializePayload
  //output
): Promise<RelationEmployeeResponse> => {
  try {
    const response = await apiClient.post(
      getRelationEmployeesUrl, payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * Define function call API get data ressponse
 */
export const getRelationCustomers = async (
  //input
  payload: InitializePayload
  //output
): Promise<RelationCustomersResponse> => {
  try {
    const response = await apiClient.post(
      getRelationCustomersUrl, payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * Define function call API get data ressponse
 */
export const getRelationBusinessCards = async (
  //input
  payload: InitializePayload
  //output
): Promise<RelationEmployeeResponse> => {
  try {
    const response = await apiClient.post(
      getRelationBusinessCardsUrl, payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * Define function call API get data ressponse
 */
export const getRelationProducts = async (
  //input
  payload: InitializePayload
  //output
): Promise<RelationProductsResponse> => {
  try {
    const response = await apiClient.post(
      getRelationProductsUrl, payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * Define function call API get data ressponse
 */
export const getRelationProductTradings = async (
  //input
  payload: InitializePayload
  //output
): Promise<RelationProductTradingsResponse> => {
  try {
    const response = await apiClient.post(
      getRelationProductTradingUrl, payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * Define function call API get data ressponse
 */
export const getRelationMilestones = async (
  //input
  payload: InitializePayload
  //output
): Promise<RelationMilestoneResponse> => {
  try {
    const response = await apiClient.post(
      getRelationMilestoneUrl, payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * Define function call API get data ressponse
 */
export const getRelationTasks = async (
  //input
  payload: InitializePayload
  //output
): Promise<RelationTasksResponse> => {
  try {
    const response = await apiClient.post(
      getRelationTasksUrl, payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
}
