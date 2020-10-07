import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../../config/clients/api-client";
import { timelinesUrl, TIMELINE_API } from "../../../config/constants/api";

export interface DynamicData {
  fieldType: any;
  key: string;
  value: string;
}

export interface Employee {
  employeeId: number;
  employeeName: string;
  photoEmployeeImg: string;
  departmentName: string;
  positionName: string;
}

export interface Department {
  departmentId: number;
  departmentName: string;
  departmentParentName: string;
  photoDepartmentImg: string;
}

export interface Group {
  groupId: number;
  groupName: string;
  photoGroupImg: string;
}

export interface Operator {
  employees: Array<Employee>;
  departments: Array<Department>;
  groups: Array<Group>;
}

export interface TotalEmployee {
  employeeId: number;
  employeeName: string;
  photoEmployeeImg: string;
  departmentName: string;
  positionName: string;
}

export interface Customer {
  customerId: number;
  parentCustomerName: string;
  customerName: string;
  customerAddress: string;
}

export interface File {
  fileId: number;
  filePath: string;
  fileName: string;
}

export interface FieldInfo {
  fieldId: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: number;
  fieldOrder: number;
}

export interface TabInfo {
  tabId: number;
  isDisplay: boolean;
  isDisplaySummary: boolean;
  maxRecord: number;
}

export interface Followed {
  followTargetId: number;
  followTargetType: number;
  followTargetName: string;
  createdDate: string;
}

export interface FollowedListDataInfo {
  followeds: Array<Followed>;
  total: number;
}


export interface FollowedListDataResponse {
  data: FollowedListDataInfo;
}

export interface FollowedListResponse {
  data: FollowedListDataResponse;
  status: number;
}

export interface FollowPayload {
  query: string;
}

export const getFollowedList = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<FollowedListResponse> => {
  try {
    const response = await apiClient.post(
      TIMELINE_API.getFollowedUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
