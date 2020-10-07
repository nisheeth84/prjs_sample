import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../config/clients/api-client";
import {
  getProductHistoryApiUrl,
  getProductSetApiUrl,
  getProductSetHistoryApiUrl,
  getProductTradingApiUrl,
  getProductsApiUrl,
  productsTradingApiUrl,
  searchProductsApiUrl,
  getProductDetailApiUrl,
} from "../../config/constants/api";

export interface DynamicData {
  fieldType: any;
  key: string;
  value: string;
}

export interface Product {
  productId: number;
  productData: Array<DynamicData>;
  productName: string;
  unitPrice: number;
  isDisplay: number;
  productImagePath: string;
  productImageName: string;
  productCategoryId: number;
  productCategoryName: string;
  productTypeId: number;
  productTypeName: string;
  memo: string;
  isSet: string;
  createdDate: string;
  createdUserId: number;
  createdUserName: string;
  updatedDate: string;
  updatedUserId: number;
  updatedUserName: string;
  productSetData: Array<DynamicData>;
  setId: number;
  quantity: number;
}

export interface ProductTradingProgressName {
  jaJp: string;
  enUs: string;
  zhCn: string;
}

export interface ProductTradingProgress {
  productTradingProgressId: number;
  progressName: ProductTradingProgressName;
  isAvailable: boolean;
  progressOrder: number;
}

export interface ProductDetailTrading {
  productTradingId: number;
  productName: string;
  quantity: number;
  price: number;
  amount: number;
  productTradingProgressId: number;
  progressName: string;
  progressOrder: number;
  isAvailable: string;
  employeeId: number;
  employeeName: string;
  endPlanDate: string;
  orderPlanDate: string;
  memo: string;
  productTradingData: DynamicData;
  updateDate: string;
  customerName: string;
  customerId: number;
  productId: number;
  isFinish: boolean;
}

export interface ProductDetailSetInclude {
  productId: number;
  productImagePath: string;
  productName: string;
  unitPrice: number;
  isSet: number;
  productImageName: string;
  productCategoryId: number;
  productCategoryName: string;
  productTypeId: number;
  productTypeName: string;
  memo: string;
  isDisplay: number;
  productData: Array<any>;
  createdDate: string;
  createdUserId: number;
  createdUserName: string;
  updatedDate: string;
  updatedUserId: number;
  updatedUserName: string;
}

export interface Category {
  productCategoryId: number;
  productCategoryName: string;
  productCategoryLevel: number;
  productCategoryChild: Array<any>;
}

export interface DataInfo {
  products: Array<Product>;
  productCategories: Array<Category>;
}

export interface ProductsInfoResponse {
  dataInfo: DataInfo;
  recordCount: number;
  totalCount: number;
  initializeInfo: {
    extraSetting: {
      isContainCategoryChild: boolean;
    };
  };
}

export interface ProductsDataDataResponse {
  products: ProductsInfoResponse;
}

export interface ProductsDataResponse {
  errors?: any;
  dataInfo: ProductsDataDataResponse;
}

export interface ProductResponse {
  data: ProductsDataResponse;
  status: number;
}

export interface ProductPayload {
  query: string;
}

export interface HistoryProduct {
  createdDate: string;
  createdUserId: number;
  createdUserName: string;
  createdUserImage: string;
  contentChange: any;
}

export interface HistorySetProduct {
  createdDate: string;
  createdUserId: number;
  createdUserName: string;
  createdUserImage: string;
  contentChange: any;
  reasonEdit: string;
}

/**
 * Product details Response
 */

export interface ProductDetailTradingGeneralInfo {
  productTradingBadge: number;
  productTradings: Array<ProductDetailTrading>;
  fieldInfoTab: Array<any>;
}

export interface ProductDetailInfoResponse {
  product: Product;
  productCategories: Array<Category>;
  productTypes: Array<any>;
  productSets: Array<ProductDetailSetInclude>;
  productTradings: ProductDetailTradingGeneralInfo;
  productHistories: HistoryProduct;
  fieldInfo: Array<any>;
  tabInfo?: any;
}

export interface ProductDetailDataDataResponse {
  // Todo change
  product: ProductDetailInfoResponse;
}

export interface ProductDetailDataResponse {
  [x: string]: any;
  data: ProductDetailDataDataResponse;
}

export interface ProductDetailResponse {
  data: ProductDetailDataResponse;
  status: number;
}

/**
 * product set details
 */

export interface ProductSetDetailInfoResponse {
  productSet: ProductDetailSetInclude;
  products: Array<Product>;
  productSets: Array<ProductDetailSetInclude>;
  productCategories: Array<Category>;
  productTypes: Array<any>;
  productTradings: ProductDetailTradingGeneralInfo;
  productHistories: HistoryProduct;
}

export interface ProductSetDetailDataInfo {
  dataInfo: ProductSetDetailInfoResponse;
  fieldInfoProductSet: any;
}

export interface ProductSetDetailDataDataResponse {
  dataInfo: ProductSetDetailDataInfo;
  fieldInfoProduct: any[];
  fieldInfoProductSet: any[];
  tabInfo: any[];
}

export interface ProductSetDetailDataResponse {
  productSet: ProductSetDetailDataDataResponse;
}

export interface ProductSetDetailResponse {
  data: ProductSetDetailDataResponse;
  status: number;
}

/**
 * Call api get listProducts
 * @param payload
 * @param config
 */
export const getProducts = async (
  payload: ProductPayload,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      searchProductsApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Call api get products detail
 * @param payload
 * @param config
 */
export const getProductDetail = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<ProductDetailResponse> => {
  try {
    const response = await apiClient.post(
      getProductDetailApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface ProductHistoriesResponse {
  productHistory: Array<HistoryProduct>;
}
export interface ProductHistoryDataResponse {
  data: ProductHistoriesResponse;
}
export interface ProductHistoryResponse {
  data: ProductHistoriesResponse;
}

/**
 * Call api get listProductHistory
 * @param payload
 * @param config
 */
export const getProductHistory = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<ProductHistoryResponse> => {
  try {
    const response = await apiClient.post(
      getProductHistoryApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Call api get listProductSetHistory
 * @param payload
 * @param config
 */
export const getProductSetHistory = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<ProductDetailResponse> => {
  try {
    const response = await apiClient.post(
      getProductSetHistoryApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/*
 * Call api get products set detail
 * @param payload
 * @param config
 */
export const getProductSetDetail = async (
  payload: ProductPayload,
  config?: AxiosRequestConfig
): Promise<ProductSetDetailResponse> => {
  try {
    const response = await apiClient.post(getProductSetApiUrl, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * product detail trading
 */

export interface ProductDetailTradingInfoResponse {
  productTradings: Array<ProductDetailTrading>;
  progresses: Array<ProductTradingProgress>;
  initializeInfo: any;
  fieldInfo: any;
}

export interface ProductDetailTradingDataDataResponse {
  productTradings: ProductDetailTradingInfoResponse;
}

export interface ProductDetailTradingDataResponse {
  data: ProductDetailTradingDataDataResponse;
}

export interface ProductDetailTradingResponse {
  data: ProductDetailTradingDataResponse;
  status: number;
}

/**
 * Call api get product detail trading
 * @param payload
 * @param config
 */
export const getProductDetailTrading = async (
  payload: ProductPayload,
  config?: AxiosRequestConfig
): Promise<ProductDetailTradingResponse> => {
  try {
    const response = await apiClient.post(
      productsTradingApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
