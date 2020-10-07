import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../../../../config/clients/api-client";
const getProductTradingTab = "/services/sales/api/get-product-tradings"
const getFieldInfor = "/services/commons/api/get-fields-info"

/**
 * interface value payload
 */
export interface TradingProductsPayload {
  isOnlyData: any;
  orders: any[];
  offset: any;
  limit: any;
  isFirstLoad: any;
  searchConditions: any[],
  selectedTargetId: number,
  selectedTargetType: number,
  customerIdFilters: any[]
}

/**
 * interface SearchConditions
 */
export interface SearchConditions {
  fieldType: number;
  isDefault: boolean;
  fieldName: string;
  fieldValue: any;
  searchType: number;
  searchOption:number;

}
export interface FieldInfor{
  fieldBelong: number;
}
/**
 * get data API getTradingProducts
 * @param payload 
 * @param config 
 */
export const getTradingProducts = async (
  payload: TradingProductsPayload,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      getProductTradingTab,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getFieldInfors = async (
  payload: FieldInfor,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      getFieldInfor,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};