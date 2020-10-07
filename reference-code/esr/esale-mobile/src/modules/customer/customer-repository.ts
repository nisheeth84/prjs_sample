import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../config/clients/api-client";
import { CUSTOMERS_API, CUSTOMER_API } from "../../config/constants/api";

/**
 * interface use for api getCustomerList
 */
export interface GeneralPayload {
  query: string;
}

/**
 * interface use for api updateCustomer
 */
export interface UpdateCustomerPayload {
  query: string;
}

/**
 * interface use for api getCustomerPayload
 */
export interface GetCustomerPayload {
  query: string;
}

/**
 * interface use for api data of api get list customer
 */
export interface GetCustomerListDataList {
  listId: number;
  listName: string;
  isAutoList: boolean;
}

/**
 * interface use for get list customer response data
 */
export interface GetCustomerListDataResponse {
  myList: GetCustomerListDataList[];
  sharedList: GetCustomerListDataList[];
  favouriteList: GetCustomerListDataList[];
}

/**
 * interface use for get list customer response
 */
export interface GetCustomerListResponse {
  data: GetCustomerListDataResponse;
  status: number;
}

/**
 * Call api getCustomerList
 * @param payload
 * @param config
 */
export const getCustomerList = async (
  payload: GeneralPayload,
  config?: AxiosRequestConfig
): Promise<GetCustomerListResponse> => {
  try {
    const response = await apiClient.post(
      CUSTOMERS_API.getCustomerList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * interface use for api moveCustomersToOtherList
 */
export interface MoveCustomersToOtherListDataResponse {
  customerListMemberIds: Array<{
    customerListMemberId: number;
  }>;
}

/**
 * interface use for move customers to other list response
 */
export interface MoveCustomersToOtherListResponse {
  data: MoveCustomersToOtherListDataResponse;
  status: number;
}

/**
 * Call api moveCustomersToOtherList
 * @param payload
 * @param config
 */
export const moveCustomersToOtherList = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<MoveCustomersToOtherListResponse> => {
  try {
    const response = await apiClient.post(
      CUSTOMERS_API.moveCustomersToOtherList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// api addCustomersToList
export interface AddCustomersToListDataResponse {
  customerListMemberIds: Array<{
    customerListMemberId: number;
  }>;
}

export interface AddCustomersToListResponse {
  data: AddCustomersToListDataResponse;
  status: number;
}

/**
 * Call api addCustomersToList
 * @param payload
 * @param config
 */
export const addCustomersToList = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<AddCustomersToListResponse> => {
  try {
    const response = await apiClient.post(
      CUSTOMERS_API.addCustomersToList,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * interface use for api getMasterScenarios
 */
export interface GetMasterScenariosDataDataResponse {
  scenarioId: number;
  scenarioName: string;
}

/**
 * interface use for getMasterScenarios data
 */
export interface GetMasterScenariosDataResponse {
  scenarios: GetMasterScenariosDataDataResponse[];
}

/**
 * interface use for getMasterScenarios response
 */
export interface GetMasterScenariosResponse {
  data: GetMasterScenariosDataResponse;
  status: number;
}

/**
 * Call api getMasterScenarios
 * @param payload
 * @param config
 */
export const getMasterScenarios = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetMasterScenariosResponse> => {
  try {
    const response = await apiClient.post(
      CUSTOMERS_API.getMasterScenarios,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// api getMasterScenario
export interface GetMasterScenarioDataResponse {
  milestones: Array<{
    milestoneName: string;
  }>;
}

export interface GetMasterScenarioResponse {
  data: GetMasterScenarioDataResponse;
  status: number;
}

/**
 * Call api getMasterScenario
 * @param payload
 * @param config
 */
export const getMasterScenario = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetMasterScenarioResponse> => {
  try {
    const response = await apiClient.post(
      CUSTOMERS_API.getMasterScenario,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// api getScenario
export interface GetScenarioDataDataResponse {}

export interface GetScenarioDataResponse {
  scenarios: {
    milestones: Array<any>;
  };
}

export interface GetScenarioResponse {
  data: GetScenarioDataResponse;
  status: number;
}
export interface GetCustomerDataResponse {
  fields: [
    {
      fieldId: number;
      fieldName: string;
      fieldType: number;
      fieldOrder: number;
      required: boolean;
      isDefault: boolean;
      isDoubleColumn: boolean;
      doubleColumnOption: number;
      isAvailable: boolean;
      isModify: boolean;
      isMobileModify: boolean;
      imeType: number;
      searchType: number;
      searchOption: number;
      ownPermissionLevel: number;
      othersPermissionLevel: number;
      urlTarget: string;
      urlEncode: number;
      urlText: string;
      iframeHeight: string;
      isLineNameDisplay: boolean;
      configValue: number;
      decimalPlace: number;
      labelJaJp: string;
      labelEnUs: string;
      labelZhCn: string;
      fieldItems: [
        {
          itemId: number;
          isAvailable: boolean;
          itemOrder: string;
          isDefault: boolean;
          labelJaJp: string;
          labelEnUs: string;
          labelZhCn: string;
        }
      ];
    }
  ];
  customer: {
    photoFileName: string;
    photoFilePath: string;
    parentId: number;
    customerName: string;
    customerAliasName: string;
    phoneNumber: number;
    zipCode: number;
    prefecture: string;
    building: string;
    address: string;
    businessMainId: number;
    businessMainName: string;
    businessSubId: number;
    url: string;
    employeeId: number;
    departmentId: string;
    groupId: number;
    memo: string;
    customerData: object;
    productTradingData: Array<{}>;
    nextSchedules: Array<{}>;
    nextActions: Array<{}>;
    checkbox1: {
      1: boolean;
      3: boolean;
    };
  };
  tabsInfo: Array<{}>;
  dataTab: Array<{}>;
  dataWatchs: object;
}

export interface GetCustomerResponse {
  data: GetCustomerDataResponse;
  status: number;
}
export interface CreateCustomerPayload {
  query: string;
}

export interface CreateCustomerDataResponse {
  data: {
    customerId: number;
  };
}
export interface CreateCustomerResponse {
  data: CreateCustomerDataResponse;
  status: number;
}

/**
 * Call api createCustomer
 * @param payload
 * @param config
 */

export const createCustomer = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      CUSTOMERS_API.createCustomer,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Call api getScenario
 * @param payload
 * @param config
 */
export const getCustomer = async (
  payload: { customerId: number; mode: string },
  config?: AxiosRequestConfig
): Promise<GetCustomerResponse> => {
  try {
    const response = await apiClient.post(
      CUSTOMERS_API.getCustomer,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Call api getScenario
 * @param payload
 * @param config
 */
export const getScenario = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetScenarioResponse> => {
  try {
    const response = await apiClient.post(
      CUSTOMERS_API.getScenario,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface UpdateCustomerDataResponse {
  data: {
    customerId: number;
  };
  parameters: any;
}

export interface UpdateCustomerResponse {
  data: UpdateCustomerDataResponse;
  status: number;
}
/**
 *
 * @param payload
 * @param config
 */
export const updateCustomer = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<UpdateCustomerResponse> => {
  try {
    const response = await apiClient.post(
      CUSTOMERS_API.updateCustomer,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface UpdateCustomerDataResponse {
  data: {
    customerId: number;
  };
}

export interface GetCustomerLayoutResponse {
  fields: Array<{
    fieldId: number;
    fieldBelong: number;
    lookupFieldId: number;
    fieldName: string;
    fieldLabel: string;
    fieldType: number;
    fieldOrder: number;
    isDefault: boolean;
    maxLength: number;
    modifyFlag: number;
    availableFlag: number;
    isDoubleColumn: boolean;
    ownPermissionLevel: number;
    othersPermissionLevel: number;
    defaultValue: string;
    currencyUnit: string;
    typeUnit: number;
    decimalPlace: number;
    activityLinkedFieldId: number;
    urlType: number;
    urlTarget: string;
    urlEncode: number;
    urlText: string;
    linkTarget: number;
    configValue: string;
    isLinkedGoogleMap: boolean;
    fieldGroup: number;
    lookupData: {
      extensionBelong: number;
      searchKey: number;
      itemReflect: string;
    };
    relationData: {
      extensionBelong: number;
      fieldId: number;
      format: number;
      displayTab: number;
      displayFields: Array<number>;
    };
    tabData: Array<number>;
    fieldItems: Array<{
      itemId: number;
      isAvailable: boolean;
      itemOrder: number;
      isDefault: boolean;
      itemLabel: string;
    }>;
    differenceSetting: {
      isDisplay: boolean;
      backwardColor: string;
      backwardText: string;
      forwardColor: string;
      forwardText: string;
    };
  }>;
}
export interface GetCustomerFieldDataResponse {
  data: GetCustomerLayoutResponse;
  status: number;
}
/**
 *
 * @param payload
 * @param config
 */
export const getCustomerLayout = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<GetCustomerFieldDataResponse> => {
  try {
    const response = await apiClient.post(
      CUSTOMERS_API.getCustomerLayout,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * saveScenario
 * @param payload
 * @param config
 */
export const saveScenario = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      CUSTOMERS_API.saveScenario,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
