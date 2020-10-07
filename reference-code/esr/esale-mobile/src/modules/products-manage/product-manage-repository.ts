import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../config/clients/api-client";
import { COMMONS_API, SALES_API } from "../../config/constants/api";

import {
  FieldInfo,
  InitializeInfo,
  ProductTradingsByProgress,
  Progresses,
} from "./product-type";

export interface SearchConditions {
  fieldId: number;
  searchType: number;
  searchOption: number;
  searchValue: string;
}

export interface PayloadCreateProductTradingsList {
  productTradingList: {
    productTradingListName: string;
    listType: number;
    listMode: number;
    ownerList: Array<any>;
    viewerList: Array<any>;
    isOverWrite: number;
  };
  searchConditions?: Array<SearchConditions>;
  listOfproductTradingId: Array<any>;
}

export interface CreateProductTradingsListDataResponse {
  productTradingListDetailId: number;
}

export interface CreateProductTradingsListResponse {
  data: CreateProductTradingsListDataResponse;
  status: number;
}

// get product trading
export interface ProductTradingDataResponse {
  productTradings: Array<any>;
  progresses: Array<Progresses>;
  initializeInfo: InitializeInfo;
  fieldInfo: Array<FieldInfo>;
}

// get product trading
export interface ProductTradingDataByProgressResponse {
  productTradingsByProgress: Array<ProductTradingsByProgress>;
  progresses: Array<Progresses>;
  initializeInfo: InitializeInfo;
  fieldInfo: Array<FieldInfo>;
}

export interface ProductTradingByProgressResponse {
  data: ProductTradingDataByProgressResponse;
  status: number;
}

export const getProductTradingsByProgress = async (
  payload: object,
  config?: AxiosRequestConfig
): Promise<ProductTradingByProgressResponse> => {
  try {
    const response = await apiClient.post(
      SALES_API.getProductTradingsByProgress,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// delete product trading
export interface DeleteProductTradingPayload {
  productTradingIds: Array<number>;
}

export interface DeleteProductTradingResponse {
  data: {
    listOfproductTradingId: number[];
  };
  status: number;
}

export const deleteProductTrading = async (
  payload: DeleteProductTradingPayload,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      SALES_API.deleteProductTradings,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * request body of api addProductTradingsToList
 */
export interface AddProductTradingsToListPayload {
  listOfProductTradingId: Array<number>;
  idOfList: number;
}

/**
 * data response of api addProductTradingsToList
 */
export interface AddProductTradingsToListDataResponse {
  listOfProductTradingId: Array<number>;
}

/**
 * response of api addProductTradingsToList
 */
export interface AddProductTradingsToListResponse {
  data: AddProductTradingsToListDataResponse;
  status: number;
}

/**
 * call api addProductTradingsToList
 */
export const addProductTradingsToList = async (
  payload: AddProductTradingsToListPayload,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      SALES_API.addProductTradingsToList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * request body of api dragDropProductTrading
 */
export interface DragDropProductTradingPayload {
  listOfProductTradingId: Array<number>;
  idOfNewList: number;
  idOfOldList?: number;
}

export interface DragDropProductTradingDataResponse {
  oldIds: Array<number>;
  newIds: Array<number>;
}

/**
 * response of call api dragDropProductTrading
 */
export interface DragDropProductTradingResponse {
  data: DragDropProductTradingDataResponse;
  status: number;
}

/**
 * call api dragDropProductTrading to move product tradings to list
 */
export const dragDropProductTrading = async (
  payload: DragDropProductTradingPayload,
  config?: AxiosRequestConfig
): Promise<DragDropProductTradingResponse> => {
  try {
    const response = await apiClient.post(
      SALES_API.dragDropProductTrading,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Request body of api getRecordIds
 */
export interface GetRecordIdPayload {
  searchConditions?: any;
  deselectedRecordIds?: Array<number>;
}

export interface GetRecordIdDataResponse {
  totalRecords: number;
  recordIds: Array<number>;
}

export interface GetRecordIdResponse {
  data: GetRecordIdDataResponse;
  status: number;
}

/**
 * Call api getRecordIds
 * @param payload
 * @param config
 */
export const getRecordIds = async (
  payload: GetRecordIdPayload,
  config?: AxiosRequestConfig
): Promise<GetRecordIdResponse> => {
  try {
    const response = await apiClient.post(
      COMMONS_API.getRecordIds,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Call api createProductTradingsList
 * @param payload
 * @param config
 */
export const createProductTradingsList = async (
  payload: PayloadCreateProductTradingsList,
  config?: AxiosRequestConfig
): Promise<CreateProductTradingsListResponse> => {
  try {
    const response = await apiClient.post(
      SALES_API.createProductTradingList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * call api get product manager list
 * @param payload 
 * @param config 
 */
export const getProductManagerList = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetProductManagerListResponse> => {
  try {
    const response = await apiClient.post(SALES_API.getList, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface GetProductManagerListResponse {
  data: DataProductManagerList;
  status?: number;
}

export interface DataProductManagerList {
  listInfo: Array<{
    listId: number;
    listName: string;
    displayOrder: number;
    listType: number;
    listMode: number;
    ownerList: string;
    viewerList: string;
    isOverWrite: number;
    displayOrderOfFavoriteList: number;
    updatedDate: any;
  }>;
}


/**
 * Request body of api updateProductTradingsList
 */
export interface UpdateProductTradingsListPayload {
  productTradingListDetailId: number,
  productTradingList: {
    productTradingListName: string,
    listType: number,
    listMode: number,
    ownerList: number[],
    viewerList: number[],
    isOverWrite: number,
  },
  searchConditions?: Array<{
    productTradingListSearchConditionId: number,
    fieldId: number,
    searchType: number,
    searchOption: number,
    searchValue: string,
  }>,
}

export interface UpdateProductTradingsListDataResponse {

}

export interface UpdateProductTradingsListResponse {
  data: UpdateProductTradingsListDataResponse;
  status: number;
}

/**
 * Call api updateProductTradingsList
 * @param payload
 * @param config
 */
export const updateProductTradingsList = async (
  payload: UpdateProductTradingsListPayload,
  config?: AxiosRequestConfig
): Promise<UpdateProductTradingsListResponse> => {
  try {
    const response = await apiClient.post(
      SALES_API.updateProductTradingsList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};


/**
 * Request body of api getProductTradingsList
 */
export interface GetProductTradingsListPayload {
  productTradingListDetailId: number;
}

interface Employee {
  employeeId: number,
  employeePhoto: {
    filePath: string,
    fileName: string,
  },
  employeeDepartments: {
    departmentId: number,
    departmentName: string,
  },
  employeeSurname: string,
}

export interface GetProductTradingsListDataResponse {
  productTradingList: [{
    productTradingListDetailId: number,
    employees: Employee,
    productTradingListName: string,
    typeList: number,
    listMode: number,
    ownerList: Employee[],
    viewerList: Employee[],
    isOverWrite: number,
    searchConditions: any,
    listOfproductTradingId: number[],
    listUpdateTime: string
  }]
}

export interface GetProductTradingsListResponse {
  data: GetProductTradingsListDataResponse;
  status: number;
}
/**
 * Call api getProductTradingsList
 * @param payload
 * @param config
 */
export const getProductTradingsList = async (
  payload: GetProductTradingsListPayload,
  config?: AxiosRequestConfig
): Promise<GetProductTradingsListResponse> => {
  try {
    const response = await apiClient.post(
      SALES_API.getProductTradingsList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * api deleteProductTradingList, addListToFavorite, removeFromFavorite, refreshAutoList
 */
export interface HandleProductTradingListPayload {
  idOfList: number;
}

export interface HandleProductTradingListDataResponse {
  idOfList: number;
}

export interface HandleProductTradingListResponse {
  data: HandleProductTradingListDataResponse;
  status: number;
}
/**
 * Call api deleteProductTradingList, addListToFavorite, removeFromFavorite, refreshAutoList
 * @param payload
 * @param config
 */
export const handleProductTradingList = async (
  url: string,
  payload: HandleProductTradingListPayload,
  config?: AxiosRequestConfig
): Promise<HandleProductTradingListResponse> => {
  try {
    const response = await apiClient.post(
      url,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * request body of removeProductTradingsFromList api
 */
export interface RemoveProductTradingsFromListPayload {
  listOfproductTradingId: Array<number>;
  idOfList: number;
}

export interface RemoveProductTradingsFromListDataResponse {
  idOfList: number;
}

export interface RemoveProductTradingsFromListResponse {
  data: RemoveProductTradingsFromListDataResponse;
  status: number;
}
/**
 * Call api removeProductTradingsFromList
 * @param payload
 * @param config
 */
export const removeProductTradingsFromList = async (
  payload: RemoveProductTradingsFromListPayload,
  config?: AxiosRequestConfig
): Promise<RemoveProductTradingsFromListResponse> => {
  try {
    const response = await apiClient.post(
      SALES_API.removeProductTradingsFromList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
