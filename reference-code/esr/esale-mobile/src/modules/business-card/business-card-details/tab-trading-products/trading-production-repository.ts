import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../../../config/clients/api-client";
import { CUSTOMERS_API, SALES_API } from "../../../../config/constants/api";

export interface SearchConditions {
  fieldType: number;
  isDefault: boolean;
  fieldName: string;
  fieldValue: string;
  searchType: number;
  searchOption: number;
}

export interface TradingProductsPayload {
  tabBelong: number;
  offset: number;
  limit: number;
  searchConditions: Array<{
    fieldType: number;
    fieldName: string;
    fieldValue: string;
  }>;
}

export interface ProductsTrading {
  productTradingId: number;
  customerId: number;
  customerName: string;
  employeeId: number;
  employeeName: string;
  employeeSurname: string;
  productId: number;
  productName: string;
  productTradingProgressId: string;
  progressName: string;
  endPlanDate: string;
  quantity: number;
  price: number;
  isFinish: boolean;
  amount: number;
  productTradingData: Array<any>;
}

export interface FieldInfoTab {
  fieldId: number;
  fieldInfoTabId: number;
  fieldInfoTabPersonalId: number;
  fieldOrder: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: number;
  isColumnFixed: boolean;
  columnWidth: number;
}
export interface DataInfo {
  totalRecord: number;
  productTradingBadge: number;
  productTradings: ProductsTrading[];
}

export interface Fields {
  fieldId: number;
  fieldOrder: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: number;
  fieldItem: Array<{
    itemId: number;
    itemLabel: string;
  }>;
}

export interface TradingProductsResponse {
  dataInfo: DataInfo | undefined;
  fieldInfoTab: FieldInfoTab[];
  fields: Fields | undefined;
}

export interface TradingProductsDataResponse {
  data: TradingProductsResponse;
  status: number;
}
export const getTradingProducts = async (
  payload: TradingProductsPayload,
  config?: AxiosRequestConfig
): Promise<TradingProductsDataResponse> => {
  try {
    const response = await apiClient.post(
      SALES_API.getProductTradingTab,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// api getProductTradingIds
export interface ProductTradingIdsPayload {
  businessCardIds: Array<number>;
}

export interface ProductTradingIdsDataResponse {
  data: {
    productTradingIds: Array<number>;
  };
  status: number;
}

export const getProductTradingIds = async (
  payload: ProductTradingIdsPayload,
  config?: AxiosRequestConfig
): Promise<ProductTradingIdsDataResponse> => {
  try {
    const response = await apiClient.post(
      CUSTOMERS_API.getProductTradingIds,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
