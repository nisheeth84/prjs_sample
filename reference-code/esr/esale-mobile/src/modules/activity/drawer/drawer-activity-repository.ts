import { SERVICES_GET_BUSINESS_CARD_LIST, SERVICES_GET_CUSTOMER_LIST, SERVICES_GET_LIST, SERVICES_GET_BUSINESS_CARDS, SERVICES_GET_CUSTOMERS, SERVICES_GET_PRODUCT_TRADINGS } from './../../../config/constants/api';
import { apiClient } from './../../../config/clients/api-client';
import { BusinessCard } from './drawer-left-activity-reducer';
/**
 * Data of businessCardList response
 *
 * @export
 * @interface dataBusinessCardListResponse
 */
export interface dataBusinessCardListResponse {
  listInfo: Array<BusinessCard>
  listUpdateTime: any
}
/**
 * Response of API getBusinessCardList
 *
 * @export
 * @interface getBusinessCardListResponse
 */
export interface getBusinessCardListResponse {
  data: dataBusinessCardListResponse
  status: number
}
/**
 * Define interface BusinessCardListPayload
 */
export interface BusinessCardListPayload {
  idOfList: number
  mode: number
}

/**
 * Object param for API getCustomerList
 */
export interface CustomerListPayload {
  isFavourite: boolean
}
/**
 * Response of API getCustomerList
 */
export interface getCustomerListResponse {
  data: dataCustomerListResponse,
  status: number
}
export interface dataCustomerListResponse {
  myList: Array<CustomerListMyList>,
  shareList: Array<CustomerListShareList>,
  favouriteList: Array<CustomerListFavoriteList>,
}
/**
 * My List in response of API getCustomerList
 */
export interface CustomerListMyList {
  listId: number,
  listName: string,
  isAutoList: boolean
}
/**
 * Share List in response of API getCustomerList
 */
export interface CustomerListShareList {
  listId: number,
  listName: string,
  isAutoList: boolean
}
export interface CustomerListFavoriteList {
  customerListType: number,
  participantType: number,
  updatedDate: any,
  isOverWrite: number
  listId: number,
  listName: string,
  isAutoList: boolean,
}
/**
 * API getCustomerList
 * @param payload 
 */
export const getCustomerList = async (
  payload: CustomerListPayload
): Promise<getCustomerListResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_CUSTOMER_LIST,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}
/**
 * Object param of API getList
 */
export interface getListPayload {
  mode?: number;
  idOfList?: number;
}
/**
 * Response of API getList
 */
export interface getListResponse {
  data: dataGetListResponse;
  status: number;
}
/**
 * Data of getListResponse
 */
export interface dataGetListResponse {
  listInfo: Array<ProductTrading>,
  listUpdateTime: any
}
/**
 * Field product trading
 */
export interface ProductTrading {
  listId: number,
  listName: string,
  displayOrder: number,
  listType: number,
  displayOrderFavoriteList: number
}

/**
 * call API get list productTrading to show
 */
export const getList = async (payload: getListPayload): Promise<getListResponse> => {
  const defaultParams = {
    mode: 1,
  };
  
  try {
    const response = await apiClient.post(SERVICES_GET_LIST, {...defaultParams, ...payload});
    return response;
  } catch (error) {
    return error.response;
  }
}
/**
 * Object param of API getBusinessCards
 */
export interface getBusinessCardsPayload {
  selectedTargetId: number
}
/**
 * Response of API getBusinessCards
 */
export interface getBusinessCardsResponse {
  data: dataGetBusinessCardsResponse,
  status: number
}
/**
 * Data of getBusinessCardsResponse
 */
export interface dataGetBusinessCardsResponse {
  businessCards: Array<BusinessCardItem>
}
/**
 * BusinessCard item
 */
export interface BusinessCardItem {
  businessCardId: number
}
/**
 * API getBusinessCards
 * @param payload 
 */
export const getBusinessCards = async (
  payload: getBusinessCardsPayload
): Promise<getBusinessCardsResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_BUSINESS_CARDS,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}
/**
 * customerItem
 */
export interface customerItem {
  customerId: number
}
/**
 * Data of getCustomersResponse
 */
export interface dataGetCustomersResponse {
  customers: Array<customerItem>
}
/**
 * Response of API getCustomers
 */
export interface getCustomersResponse {
  data: dataGetCustomersResponse,
  status: number
}
/**
 * Object param of API getCustomers
 */
export interface getCustomersPayload {
  selectedTargetId: number
}
/**
 * API getCustomers
 * @param payload 
 */
export const getCustomers = async (
  payload: getCustomersPayload
): Promise<getCustomersResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_CUSTOMERS,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}
export interface productTradingItem {
  productTradingId: number
}
/**
 * Data of getProductTradingsResponse
 */
export interface dataGetProductTradingsResponse{
  productTradings: Array<productTradingItem>
}
/**
 * Response of API getProductTradings
 */
export interface getProductTradingsResponse {
  data: dataGetProductTradingsResponse,
  status: number
}
/**
 * Object param of API getProductTradings
 */
export interface getProductTradingsPayload {
  selectedTargetId: number
}
/**
 * API getProductTradings
 * @param payload 
 */
export const getProductTradings = async (payload: getProductTradingsPayload): Promise<getProductTradingsResponse> => {
  const defaultParams = {
    selectedTargetId: 1,
  };
  
  try {
    const response = await apiClient.post(SERVICES_GET_PRODUCT_TRADINGS, { ...defaultParams, ...payload });
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface GetBusinessCardListParams {
  mode?: number;
  idOfList?: number;
}

export const getBusinessCardList = async (payload: GetBusinessCardListParams) => {
  const defaultParams = {
    mode: 1,
  };
  
  try {
    const response = await apiClient.post(
      SERVICES_GET_BUSINESS_CARD_LIST,
      { ...defaultParams, ...payload }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
