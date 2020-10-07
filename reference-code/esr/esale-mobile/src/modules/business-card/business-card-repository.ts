import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../config/clients/api-client";
import {
  CUSTOMER_API,
  getFieldInfoPersonalsApiUrl,
  BUSINESS_CARD_API,
  getRecordIdsUrl,
  EMPLOYEES_API,
  COMMONS_API,
} from "../../config/constants/api";

export interface BusinessCardsPayload {
  query: string;
}

export interface BusinessCardsDataDataResponse {
  selected?: boolean;
  businessCardId: number;
  customerId: number;
  customerName: string;
  alternativeCustomerName: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  position: string;
  departmentName: string;
  zipCode: string;
  prefecture: string;
  addressUnderPrefecture: string;
  building: string;
  address: string;
  emailAddress: string;
  phoneNumber: number;
  mobileNumber: number;
  lastContactDate: string;
  isWorking: number;
  memo: string;
  businessCardImagePath: string;
  businessCardImageName: string;
  businessCardsReceives: Array<{
    employeeId: number;
    employeeName: string;
    receiveDate: string;
    lastContactDateReceiver: string;
  }>;
  saveMode: boolean;
}

export interface BusinessCardsDataResponse {
  businessCards: BusinessCardsDataDataResponse[];
  totalRecords: number;
  initializeInfo: {
    selectedTargetType?: number;
    selectedTargetId?: number;
    extraSettings?: Array<{
      key: string;
      value: string;
    }>;
    orderBy?: Array<{
      key: string;
      filedType: number;
      value: "ASC" | "DESC";
      isNested: boolean;
    }>;
    filterListConditions?: Array<{
      targetType: number;
      targetId: number;
      filterConditions: Array<{
        fieldId: number;
        fieldName: string;
        fieldType: number;
        filedBelong: number;
        filterType: number;
        filterOption: number;
        fieldValue: string;
        isNested: boolean;
      }>;
    }>;
  };
  fieldInfo: Array<{
    fieldId: number;
    fieldName: string;
  }>;
  lastUpdateDate: string;
}

export interface BusinessCardsResponse {
  data: BusinessCardsDataResponse;
  status: number;
}

export interface GetBusinessCardsPayload {
  selectedTargetType?: number;
  selectedTargetId?: number;
  searchConditions?: Array<any>;
  order?: Array<{
    key: string;
    value: string;
    fieldType: number;
  }>;
  offset?: number;
  limit?: number;
  searchLocal?: string;
  filterConditions?: Array<{
    fieldType: number;
    fieldName: string;
    filterType: number;
    filterOption: number;
    fieldValue: any;
  }>;
  isFirstLoad?: boolean;
}

/**
 * Call api getBusinessCards
 * @param payload
 * @param config
 */

export const getBusinessCards = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<BusinessCardsResponse> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.getBusinessCards,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface HandleListBusinessCardsDataResponse {
  idOfList: number;
}

export interface HandleListBusinessCardsResponse {
  data: HandleListBusinessCardsDataResponse;
  status: number;
}

/**
 * Call api refreshAutoList,addListToFavorite, removeListFromFavorite, deleteBusinessCardList,
 * @param payload
 * @param config
 */
export const handleListBusinessCards = async (
  url: string,
  payload: any,
  config?: AxiosRequestConfig
): Promise<HandleListBusinessCardsResponse> => {
  try {
    const response = await apiClient.post(url, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface BusinessCardListPayload {
  query: string;
}

export interface BusinessCardListDataResponse {
  listInfo: Array<{
    listId: number;
    listName: string;
    displayOrder: number;
    listType: number;
    employeeId: number;
    listMode: number;
    ownerList: Array<string> | null;
    viewerList: Array<string> | null;
    displayOrderOfFavoriteList: number;
  }>;
}

export interface BusinessCardListResponse {
  data: BusinessCardListDataResponse;
  status: number;
}

export interface GetBusinessCardListPayload {
  idOfList?: number;
  mode?: number;
}

/**
 * Call api getBusinessCardList
 * @param payload
 * @param config
 */

export const getBusinessCardList = async (
  payload: GetBusinessCardListPayload,
  config?: AxiosRequestConfig
): Promise<BusinessCardListResponse> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.getBusinessCardList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface BusinessCardsListPayload {
  query: string;
}

export interface BusinessCardsListDataResponse {
  data: {
    businessCardListDetailId: number;
  };
}

export interface BusinessCardsListResponse {
  data: BusinessCardsListDataResponse;
  status: number;
}

/**
 * Call api createBusinessCardsList
 * @param payload
 * @param config
 */

export const createBusinessCardsList = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<BusinessCardsListResponse> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.createBusinessCardList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface UpdateBusinessCardsPayload {
  query: string;
}

export interface UpdateBusinessCardsDataResponse {
  data: {
    listOfBusinessCardId: Array<number>;
  };
}

export interface UpdateBusinessCardsResponse {
  data: any;
  status: number;
}

/**
 * Call api updateBusinessCards
 * @param payload
 * @param config
 */

export const updateBusinessCards = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<UpdateBusinessCardsResponse> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.updateBusinessCards,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getCustomFieldsInfo = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      COMMONS_API.getCustomFieldsInfoUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
export interface SuggestBusinessCardDepartmentPayload {
  query: string;
}

export interface SuggestBusinessCardDepartmentDataObjectResponse {
  departmentId: number;
  departmentName: string;
}

export interface SuggestBusinessCardDepartmentDataResponse {
  department: SuggestBusinessCardDepartmentDataObjectResponse[];
}

export interface SuggestBusinessCardDepartmentResponse {
  data: SuggestBusinessCardDepartmentDataResponse;
  status: number;
}

/**
 * Call api SuggestBusinessCardDepartment
 * @param payload
 * @param config
 */

export const suggestBusinessCardDepartment = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<SuggestBusinessCardDepartmentResponse> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.getListSuggestions,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface GetAddressesFromZipCodePayload {
  query: string;
}

export interface GetAddressesFromZipCodeDataObjectResponse {
  zipCode: string;
  prefectureName: string;
  cityName: string;
  areaName: string;
}

export interface GetAddressesFromZipCodeDataResponse {
  addressInfos: GetAddressesFromZipCodeDataObjectResponse[];
}

export interface GetAddressesFromZipCodeResponse {
  data: GetAddressesFromZipCodeDataResponse;
  status: number;
}

/**
 * Call api getAddressesFromZipCode
 * @param payload
 * @param config
 */

export const getAddressesFromZipCode = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetAddressesFromZipCodeResponse> => {
  try {
    const response = await apiClient.post(
      getFieldInfoPersonalsApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface GetEmployeesSuggestionPayload {
  query: string;
}

export interface GetEmployeesSuggestionDataResponse {
  data: any;
}

export interface GetEmployeesSuggestionResponse {
  data: GetEmployeesSuggestionDataResponse;
  status: number;
}

/**
 * Call api getEmployeesSuggestion
 * @param payload
 * @param config
 */

export const getEmployeesSuggestion = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetEmployeesSuggestionResponse> => {
  try {
    const response = await apiClient.post(
      EMPLOYEES_API.getEmployeesSuggestion,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface CreateBusinessCardPayload {
  query: string;
}

export interface CreateBusinessCardDataObjectResponse {
  departmentId: number;
  departmentName: string;
}

export interface CreateBusinessCardDataResponse {
  department: CreateBusinessCardDataObjectResponse[];
}

export interface CreateBusinessCardResponse {
  data: CreateBusinessCardDataResponse;
  status: number;
}

/**
 * Call api createBusinessCard
 * @param payload
 * @param config
 */
export const createBusinessCard = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<CreateBusinessCardResponse> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.createBusinessCard,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface GetBusinessCardPayload {
  businessCardId: number;
  mode: string;
  isOnlyData: boolean;
  hasTimeLine: boolean;
}

export interface GetBusinessCardDataResponse {
  data: {
    fieldInfo: Array<{
      fieldId: number;
      fieldName: string;
    }>;
    businessCardDetail: {
      customerId: number;
      customerName: string;
      businessCardId: number;
      departmentName: string;
      position: string;
      firstName: string;
      lastName: string;
      businessCardImagePath: string;
      businessCardImageName: string;
      businessCardReceives: Array<{
        receiveDate: string;
        receivedLastContactDate: string;
        activityId: number;
        employeeId: number;
        employeeSurname: string;
        employeeName: string;
      }>;
      hasActivity: number;
      hasFollow: number;
    };
    businessCardHistoryDetail: {
      customerId: number;
      customerName: string;
      businessCardId: number;
      departmentName: string;
      position: string;
      firstName: string;
      lastName: string;
      businessCardImagePath: string;
      businessCardImageName: string;
      businessCardsReceivesHistories: Array<{
        receiveDate: string;
        receivedLastContactDate: string;
        activityId: number;
        employeeId: number;
        employeeSurname: string;
        employeeName: string;
        employeePhoto: {
          filePath: string;
          fileName: string;
        };
      }>;
    };
    timelines: object;
    tabsInfo: object;
    activityHistories: Array<{}>;
    tradingProduct: {
      tradingProductBudges: number;
      tradingProductData: Array<{}>;
    };
    calendar: {
      calendarBudges: number;
      calendarData: Array<{}>;
    };
    histories: Array<{}>;
  };
}

export interface GetBusinessCardResponse {
  data: any;
  status: number;
}

/**
 * Call api getBusinessCard
 * @param payload
 * @param config
 */
export const getBusinessCard = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetBusinessCardResponse> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.getBusinessCard,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * getCustomerSuggestion
 */
export interface GetCustomerSuggestionPayload {
  query: string;
}

export interface GetCustomerSuggestionDataResponse {
  data: {
    customers: Array<{
      customerId: number;
      customerName: string;
      parentCustomerName: string;
      address: string;
    }>;
  };
}

export interface GetCustomerSuggestionResponse {
  data: GetCustomerSuggestionDataResponse;
  status: number;
}

/**
 * Call api getCustomerSuggestion
 * @param payload
 * @param config
 */
export const getCustomerSuggestion = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetCustomerSuggestionResponse> => {
  try {
    const response = await apiClient.post(
      CUSTOMER_API.getCustomersSuggestion,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// updateBusinessCardsList
export interface UpdateBusinessCardsListPayload {
  businessCardListDetailId: number;
  businessCardList: {
    businessCardListName: string;
    listType: number;
    ownerList?: number[];
  };
}

/**
 * Call api updateBusinessCardsList
 * @param payload
 * @param config
 */
export const updateBusinessCardsList = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.updateBusinessCardsList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

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
    const response = await apiClient.post(getRecordIdsUrl, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Request body of api removeBusinessCardsFromList
 */
export interface RemoveBusinessCardsFromListPayload {
  listOfBusinessCardId: Array<number>;
  idOfList: number;
}

export interface RemoveBusinessCardsFromListDataResponse {
  listOfBusinessCardId: Array<number>;
}

export interface RemoveBusinessCardsFromListResponse {
  data: RemoveBusinessCardsFromListDataResponse;
  status: number;
}

/**
 * Call api removeBusinessCardsFromList
 * @param payload
 * @param config
 */
export const removeBusinessCardsFromList = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<RemoveBusinessCardsFromListResponse> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.removeBusinessCardsFromList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Request body of api addBusinessCardsToList
 */
export interface AddBusinessCardsToListPayload {
  listOfBusinessCardId: Array<number>;
  idOfList: number;
}

/**
 * Response of api addBusinessCardsToList
 */
export interface AddBusinessCardsToListDataResponse {
  listOfBusinessCardId: Array<number>;
}

export interface AddBusinessCardsToListResponse {
  data: AddBusinessCardsToListDataResponse;
  status: number;
}

/**
 * Call api addBusinessCardsToList
 * @param payload
 * @param config
 */
export const addBusinessCardsToList = async (
  payload: AddBusinessCardsToListPayload,
  config?: AxiosRequestConfig
): Promise<AddBusinessCardsToListResponse> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.addBusinessCardsToList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Request body of api deleteBusinessCard
 */
export interface DeleteBusinessCardsPayload {
  businessCards: Array<{
    customerId?: number;
    businessCardIds: Array<number>;
    businessCardNames?: Array<string>;
  }>;
  processMode: number;
}

/**
 * Response of api deleteBusinessCards
 */
export interface DeleteBusinessCardsDataResponse {
  listOfBusinessCardId: Array<number>;
}

export interface DeleteBusinessCardsResponse {
  data: DeleteBusinessCardsDataResponse;
  status: number;
}

/**
 * Call api delete business card
 * @param payload
 * @param config
 */
export const deleteBusinessCards = async (
  payload: DeleteBusinessCardsPayload,
  config?: AxiosRequestConfig
): Promise<DeleteBusinessCardsResponse> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.deleteBusinessCards,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * call api dragDropBusinessCard
 * @param payload
 * @param config
 */
export const dragDropBusinessCard = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.dragDropBusinessCard,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
