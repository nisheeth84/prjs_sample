import { apiClient } from "../../../config/clients/api-client";
import { getChildCustomerApi, getCustomerApi, deleteCustomersApi, createFollowedCustomerApi, deleteFollowedCustomerApi } from "./customer-api";

export interface CustomerDetail {
  customer: CustomerData,
  dataWatchs: WatchsData;
  fields: Array<DynamicData>;
  tabsInfo: Array<TabsInfoData>;
  dataTabs: Array<any>;
}

export interface CustomerData {
  customerId: number;
  customerLogo: {
    photoFileName: string;
    photoFilePath: string;
    fileUrl?: string;
  };
  parentName: string;
  parentId: number;
  customerName: string;
  customerAliasName: string;
  phoneNumber: string;
  zipCode: string;
  building: string;
  address: string;
  url: string;
  businessMainId?: number;
  businessMainName: string;
  businessSubId?: number;
  businessSubName: string;
  employeeId: number;
  departmentId: number;
  memo: string;
  createdDate: string;
  createdUser: {
    employeeId: number;
    employeeName: string;
    employeePhoto: string;
    fileUrl?: string;
  };
  updatedDate: string;
  updatedUser: {
    employeeId: number;
    employeeName: string;
    employeePhoto: string;
    fileUrl?: string;
  };
  customerData: Array<any>;
  personInCharge: {
    employeeId: number;
    employeeName: string;
    employeePhoto: string;
    fileUrl?: string;
    departmentId: number;
    departmentName: string;
    groupId: number;
    groupName: string;
  };
  nextSchedules: Array<any>;
  nextActions: Array<any>;
}

export interface ChildCustomer {
  customerId: number;
  customerName: string;
  level: number;
}

export interface DynamicData {
  fieldId: number;
  fieldBelong: number;
  fieldName: string;
  fieldLabel: any;
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
  urlType: number;
  urlTarget: string;
  urlEncode: number;
  urlText: string;
  linkTarget: number;
  configValue: string;
  isLinkedGoogleMap: boolean;
  fieldGroup: number;
  lookupData: any;
  lookedFieldId: number;
  relationData: any;
  tabData: any;
  fieldItems: any[]
}

export interface TabsInfoData {
  tabId: number;
  tabLabel: string;
  isDisplay: boolean;
}

export interface WatchsData {
  data?: {
    watch: Array<{watchTargetId: number}>
  }
}

export interface MilestoneData {
  finishDate: string;
  memo: string;
  milestoneId: number;
  milestoneName: string;
  taskIds: Array<any>;
  tasks: Array<any>;
  updatedDate: string;
}

export interface ContactHistoryItemData {
  id: number;
  closestContactDate: string;
  businessCard: string;
  receivedDate: string;
  employeeName: string;
}

export interface TradingProductItemData {
  productTradingId: number;
  customerId: number;
  customerName: string;
  employeeId: number;
  employeeName: string;
  productId: number;
  productName: string;
  businessCardName: string;
  productTradingProgressId: number;
  progressName: {
    ja_jp: string;
    en_us: string;
    zh_cn: string;
  };
  endPlanDate: string;
  price: number;
  amount: number;
}

export interface scheduleTimeData {
  icon?: string;
  itemName: string;
  startEndDate: string;
}

export interface ScheduleItemData {
  scheduleId: number;
  date: string;
  itemsList: Array<scheduleTimeData>;
}

export interface TaskItemData {
  taskId: number;
  finishDate: string;
  taskName: string;
  customer: {
    customerId: number;
    customerName: string;
  };
  productTradings: [{
    productTradingId: number;
    productTradingName: string;
  }];
  employees: [{
    employeeId: number;
    employeeName: string;
  }]
}

export interface ExtendSchedules {
  scheduleId: number;
  extend: boolean;
}

export interface ChildCustomerPayload {
  customerId: number;
}

export interface ChildCustomersResponse {
  data: {
    childCustomers: Array<ChildCustomer>;
  };
  status: number;
}

export interface CustomerDetailPayload {
  mode: string;
  customerId: number;
  childCustomerIds: Array<any>;
  isGetDataOfEmployee: boolean;
}

export interface CustomerDetailResponse {
  data: CustomerDetail;
  status: number;
}


export interface DeleteCustomersPayload {
  customerIds: Array<any>;
}

export interface CreateFollowPayload {
  followTargetType: number;
  followTargetId: number;
}

export interface DeleteFollowedPayload {
  followeds: Array<any>;
}

export interface DeleteCustomerResponse {
  data: {
    data: {
      customerIdsDeleteSuccess:  Array<{customerId: number}>
    }
  };
  status: number;
}

export interface CreateFollowedResponse {
  status: number;
  data?: {
    timelineFollowed: {
      timelineFollowedType: number;
      timelineFollowedId: number;
    }
  }
}

export interface DeletedFollowedResponse {
  status: number;
  data?: {
    followeds: Array<Followeds>;
  }
}

export interface Followeds {
  followTargetType: number;
  followTargetId: number;
}

export interface Followed {
  timelineFollowedType: number;
  timelineFollowedId: number;
}

export const getChildCustomerInfo = async (
  payload: ChildCustomerPayload,
): Promise<any> => {
  try {
    const response = await apiClient.post(
      getChildCustomerApi,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * get detail customer function
 * 
 * @param payload CustomerDetailPayload
 * @returns Promise<any>
 */
export const getDetailCustomer = async (
  payload: CustomerDetailPayload,
): Promise<any> => {
  try {
    const response = await apiClient.post(
      getCustomerApi,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * delete customer function
 * 
 * @param payload DeleteCustomersPayload
 * @returns Promise<DeleteCustomerResponse>
 */
export const deleteCustomer = async (
  payload: DeleteCustomersPayload,
): Promise<DeleteCustomerResponse> => {
  try {
    const response = await apiClient.post(
      deleteCustomersApi,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * create follow function
 * 
 * @param payload CreateFollowPayload
 * @returns Promise<FollowResponse>
 */
export const createFollow = async (
  payload: CreateFollowPayload,
): Promise<CreateFollowedResponse> => {
  try {
    const response = await apiClient.post(
      createFollowedCustomerApi,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

/**
 * delete Followed function
 * 
 * @param payload DeleteFollowedPayload
 * @returns Promise<FollowResponse>
 */
export const deleteFollowed = async (
  payload: DeleteFollowedPayload,
): Promise<DeletedFollowedResponse> => {
  try {
    const response = await apiClient.post(
      deleteFollowedCustomerApi,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
}