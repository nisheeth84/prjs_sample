import get from 'lodash.get';
import { AxiosRequestConfig } from 'axios';
import { apiClient } from '../../config/clients/api-client';
import {
  getFieldInfoPersonalsApiUrl,
  // searchEmployeesApiUrl,
  // timelineGroupApiUrl,
  getEmployeeUrl,
  SERVICE_GET_INITIALIZE_LIST_INFO,
  SERVICE_GET_EMPLOYEES,
} from '../../config/constants/api';
import { Employee, FieldInfoPersonal, Departments } from './employees-types';
import { normalizeHttpError } from '../../shared/utils/errors';
import { ExtraSetting, FilterListCondition, OrderBy } from "./list/employee-list-interface";


export interface ListEmployee {
  totalRecords: number;
  employees: Array<Employee>;
  department: Departments;
  lastUpdatedDate: string;
}
export interface EmployeeResponse {
  data: ListEmployee;
  status: number;
}

export interface InitializeListInfo {
  initializeInfo: {
    selectedTargetType: number,
    selectedTargetId: number,
    extraSettings: Array<ExtraSetting>,
    orderBy: Array<OrderBy>,
    filterListConditions: Array<FilterListCondition>

  },
  fields: any
}
/**
 * Define interface InitializeListPayload
 */
export interface InitializeListPayload {
  fieldBelong: number;
}
/**
 * Export interface InitializeList
 */
export interface InitializeListResponse {
  data: InitializeListInfo;
  status: number;
}
/**
 * Define interface call API getInitilizeListInfo
 * @param payload 
 * @param config 
 */
export const initializeListInfo = async (
  payload: InitializeListPayload
): Promise<InitializeListResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICE_GET_INITIALIZE_LIST_INFO, payload);

    return ressponse;
  } catch (error) {
    return error.ressponse;
  }
}


export interface Order {
  key: string,
  value: string,
  fieldType: number

}
export interface EmployeePayload {
  searchConditions?: any,
  filterConditions?: any,
  localSearchKeyword?: string,
  selectedTargetType: number,
  selectedTargetId: number,
  isUpdateListView?: boolean,
  orderBy?: Order[],
  offset?: number,
  limit?: number
}
// call api to get employees
export const getEmployees = async (
  payload: EmployeePayload
): Promise<EmployeeResponse> => {
  try {
    const response = await apiClient.post(
      SERVICE_GET_EMPLOYEES, payload
    );
    return response;
  } catch (error) {
    throw normalizeHttpError(error);
  }
};

export interface GetFieldInfoPersonalsPayload { }
export interface FieldInfoPersonalsResponse {
  fieldInfoPersonals: Array<FieldInfoPersonal>;
}

/**
 * call api to get field info personals
 */
export const getFieldInfoPersonals = async (
  payload: GetFieldInfoPersonalsPayload,
  config?: AxiosRequestConfig
): Promise<FieldInfoPersonalsResponse> => {
  try {
    const response = await apiClient.post(
      getFieldInfoPersonalsApiUrl,
      payload,
      config
    );
    return get(response, 'data.data');
  } catch (error) {
    throw normalizeHttpError(error);
  }
};

// Al api for detail employee
export interface FieldItem {
  itemId: number;
  isAvailable: boolean;
  itemOrder: number;
  isDefault: boolean;
  labelJaJp: string;
  labelEnUs: string;
  labelZhCn: string;
  itemLabel: any;
  itemParentId: any;
}

export interface Field {
  fieldId: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: number;
  fieldOrder: number;
  required: boolean;
  isDefault: boolean;
  isDoubleColum: boolean;
  doubleColumnOptio: any;
  availableFlag: number;
  isModify: boolean;
  isMobileModify: any;
  searchType: number;
  searchOption: number;
  ownPermissionLevel: any;
  othersPermissionLevel: any;
  urlTarget: string;
  urlEncode: any;
  urlText: string;
  iframeHeight: string;
  isLineNameDisplay: boolean;
  configValue: string;
  decimalPlace: any;
  labelJaJp: string;
  labelEnUs: string;
  labelZhCn: string;
  fieldItems: Array<FieldItem>;
  tabData: Array<string>;
  lookupData: {
    fieldBelong: number,
    searchKey: number,
    itemReflect: [
      {
        fieldId: number,
        fieldLabel: string,
        itemReflect: number
      }
    ]
  };
}

export interface EmployeeIcon {
  fileName: string;
  filePath: string;
  fileUrl: string;
}

export interface EmployeeData {
  fieldType: any;
  key: string;
  value: string;
}

export interface EmployeePackages {
  packageId: number;
  packageName: string;
}

export interface TabsInfo {
  tabId: number;
  tabOrder: number;
  isDisplay: boolean;
  isDisplaySummary: boolean;
  maxRecord: number;
  updatedDate: string;
  tabLabel: string;
}
export interface EmployeeManagers {
  employeeIcon: any;
  employeeId: number;
  employeeName: string;
  managerId: number;
  departmentName: string;
}
export interface EmployeeDepartments {
  departmentId: number;
  departmentName: string;
  departmentOrder?: number;
  positionId: number;
  positionName: string;
  positionOrder?: number;
}
export interface EmployeeSubordinates {
  employeeIcon: any;
  employeeId: number;
  employeeName: string;
  departmentName: string;
  positionName: string;

}

export interface Data {
  employeeIcon: EmployeeIcon;
  employeeDepartments: EmployeeDepartments[];
  employeeSurname: string;
  employeeName: string;
  employeeSurnameKana: string;
  employeeNameKana: string;
  email: string;
  telephoneNumber: string;
  cellphoneNumber: string;
  employeeManagers: EmployeeManagers[];
  employeeSubordinates: EmployeeSubordinates[];
  userId: string;
  isAdmin: boolean;
  languageId: number;
  timezoneId: number;
  formatDateId: number;
  employeeStatus: number;
  employeeData: EmployeeData[];
  employeePackages: EmployeePackages[];
  updatedDate: string;
  createDate: string;
}

export interface DetailEmployee {
  fields: Array<Field>;
  data: Data;
  tabsInfo: Array<TabsInfo>;
  dataTabs: any;
  dataListFavoriteGroup: any;
  dataWatchs: any;
}

export interface DetailResponse {
  data: DetailEmployee;
  status: number;
}

export interface DetailPayload { }

/**
 * call api get detail information
 */
export const detailInformation = async (
  payload: DetailPayload
): Promise<DetailResponse> => {
  try {
    const response = await apiClient.post(getEmployeeUrl, payload);
    return response;
  } catch (error) {
    return error.response;
  }
};
//TODO
// export interface TimelineResponse {
//   timelineGroupFavoriteId: number;
// }
// export interface TimelinePayload { }
// // call api get detail information
// export const addFavoriteTimelineGroup = async (
//   payload: TimelinePayload,
//   config?: AxiosRequestConfig
// ): Promise<TimelineResponse> => {
//   try {
//     const response = await apiClient.post(timelineGroupApiUrl, payload, config);
//     return response.data.data;
//   } catch (error) {
//     return error.response;
//   }
// };
// export interface RegisterGroupResponse {
//   timelineGroupInviteIds: number[];
// }

// /**
//  * call api get detail information
//  */
// export const registerGroup = async (
//   payload: TimelinePayload,
//   config?: AxiosRequestConfig
// ): Promise<RegisterGroupResponse> => {
//   try {
//     const response = await apiClient.post(timelineGroupApiUrl, payload, config);
//     return response.data.data;
//   } catch (error) {
//     return error.response;
//   }
// };

// export interface RegisterFollowPayload { }

// export interface RegisterFollowResponse {
//   data: any;
// }

// /**
//  * call api register follow
//  */
// export const registerFollow = async (
//   payload: RegisterFollowPayload
// ): Promise<RegisterFollowResponse> => {
//   try {
//     const response = await apiClient.post(timelineGroupApiUrl, payload);
//     return response.data;
//   } catch (error) {
//     return error.response;
//   }
// };

// /**
//  * call api remove register follow
//  */
// export const removeRegisterFollow = async (
//   payload: RegisterFollowPayload
// ): Promise<RegisterFollowResponse> => {
//   try {
//     const response = await apiClient.post(timelineGroupApiUrl, payload);
//     return response.data;
//   } catch (error) {
//     return error.response;
//   }
// };

export const GET_EMPLOYEE_LAYOUT_URL = "/services/employees/api/get-employee-layout";

/**
 * call api remove register follow
 */
export const getEmployeeLayout = async (): Promise<{ data: any, status: number }> => {
  try {
    const response = await apiClient.post(GET_EMPLOYEE_LAYOUT_URL, {});
    return response;
  } catch (error) {
    return error.response;
  }
};

export const GET_EMPLOYEE_HISTORY_URL = "/services/employees/api/get-employee-history";

/**
 * call api remove register follow
 */
export const getEmployeeHistory = async (
  payload: { employeeId: number, currentPage: number, limit: number }
): Promise<{ data: any, status: number }> => {
  try {
    const response = await apiClient.post(GET_EMPLOYEE_HISTORY_URL, payload);
    return response;
  } catch (error) {
    return error.response;
  }
};