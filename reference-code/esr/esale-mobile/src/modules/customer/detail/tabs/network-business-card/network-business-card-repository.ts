import { apiClient } from "../../../../../config/clients/api-client";
import { initializeNetworkMapApi, deleteNetworkStandApi, updateNetworkStandApi, addNetworkStandApi } from "../../customer-api";

export interface StandDataDepartment {
  networkStandId: number;
  standId?: number;
  motivationId?: number;
  tradingProductIds?: number;
  comment?: string;
}

export interface NetworkStandData {
  businessCardId: number;
  stands: StandDataDepartment | null;
}

export interface DepartmentData {
  departmentId: number;
  departmentName: string;
  parentId: number;
  networkStands: Array<NetworkStandData>;
}

export interface BusinessCardData {
  businessCardId: number;
  businessCardName: string;
  companyName: string;
  firstName?: string;
  lastName?: string;
  departmentName: string;
  businessCardImage: {
    businessCardImageName: string;
    businessCardImagePath: string;
  };
  position: string;
  emailAddress: string;
  phoneNumber: string;
  lastContactDate: string;
  employeeIds: Array<number>;
  businessCardsReceives: Array<businessCardsReceive>;
  receiveDate: string;
}

export interface businessCardsReceive {
  employeeId: number;
  employeeName: string | null;
  filePath: string | null;
}

export interface EmployeeData {
  employeeId: number;
  departmentName: string;
  positionName: string;
  employeeSurname: string;
  employeeName: string;
  employeeImage: {
    photoFileName: string;
    photoFilePath: string;
    fileUrl?: string;
  }
}

export interface StandData {
  masterStandId: number;
  masterStandName: string;
}

export interface MotivationData {
  motivationId: number;
  motivationName: string;
  motivationIcon: {
    iconName: string;
    iconPath: string;
    backgroundColor: string;
  }
}

export interface TradingProductData {
  tradingProductId: number;
  tradingProductName: string;
}

export interface KeyValueObject {
  key: number | null;
  value: string;
}

export interface ExtendDepartment {
  departmentId: number;
  extended: boolean;
}

export interface NetworkBusinessCardData {
  companyId: number;
  departments: Array<DepartmentData>;
  businessCardDatas: Array<BusinessCardData>;
  standDatas: Array<StandData>;
  employeeDatas: Array<EmployeeData>;
  motivationDatas: Array<MotivationData>;
  tradingProductDatas: Array<TradingProductData>;
  customer?: any;
  customerParent?: any;
  customerChilds?: any
}

export interface NetworkBusinessCardResponse {
  data: NetworkBusinessCardData;
  status: number;
}

export interface NetworkBusinessCardPayload {
  customerId: number;
}

/**
 * get network map function
 * 
 * @param payload NetworkBusinessCardPayload
 */
export const getNetworkMap = async (
  payload: NetworkBusinessCardPayload,
): Promise<NetworkBusinessCardResponse> => {
  try {
    const response = await apiClient.post(
      initializeNetworkMapApi,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface DeleteNetworkBusinessCardPayload {
  networkStandId: number;
}
export interface DeleteNetworkStandResponse {
  data: {
    networkStandId: number;
  };
  status: number;
}

/**
 * Delete network stand function
 * 
 * @param payload DeleteNetworkBusinessCardPayload
 */
export const deleteNetworkStand = async (
  payload: DeleteNetworkBusinessCardPayload,
): Promise<DeleteNetworkStandResponse> => {
  try {
    const response = await apiClient.post(
      deleteNetworkStandApi,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

export interface UpdateNetworkStandPayload {
  networkStandId: number;
  businessCardCompanyId: number;
  businessCardDepartmentId: number;
  businessCardId: number;
  standId: number | null;
  motivationId: number | null;
  comment?: string;
}

export interface UpdateNetworkStandResponse {
  data: {
    networkStandId: number;
  };
  status: number;
}

/**
 * Update network stand function
 * 
 * @param payload UpdateNetworkStandPayload
 */
export const updateNetworkStand = async (
  payload: UpdateNetworkStandPayload,
): Promise<UpdateNetworkStandResponse> => {
  try {
    const response = await apiClient.post(
      updateNetworkStandApi,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

export interface AddNetworkStandPayload {
  businessCardCompanyId: number;
  businessCardDepartmentId: number;
  businessCardId: number;
  standId: number | null;
  motivationId: number | null;
  comment?: string;
}

export interface AddNetworkStandResponse {
  data: {
    networkStandId: number;
  };
  status: number;
}

/**
 * Create network stand function
 * 
 * @param payload AddNetworkStandPayload
 */
export const createNetworkStand = async (
  payload: AddNetworkStandPayload,
): Promise<AddNetworkStandResponse> => {
  try {
    const response = await apiClient.post(
      addNetworkStandApi,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
}
