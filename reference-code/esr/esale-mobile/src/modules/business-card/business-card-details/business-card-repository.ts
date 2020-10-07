import { AxiosRequestConfig } from "axios";
import { BUSINESS_CARD_API, TIMELINE_API } from "../../../config/constants/api";
import { apiClient } from "../../../config/clients/api-client";
import { Employee } from "../../employees/employees-types";

export interface DynamicData {
  fieldType: any;
  key: string;
  value: string;
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

export interface BusinessCardReceives {
  receiveDate: string;
  receivedLastContactDate: string;
  activityId: number;
  employeeId: number;
  employeeSurname: string;
  employeeName: string;
  employeePhoto: File;
}

export interface BusinessCard {
  customerId: number;
  customerName: string;
  alternativeCustomerName: string;
  businessCardId: number;
  departmentName: string;
  position: string;
  firstName: string;
  lastName: string;
  businessCardImagePath: string;
  businessCardImageName: string;
  businessCardReceives: Array<BusinessCardReceives>;
  hasActivity: number;
  hasFollow: number;
  firstNameKana: string;
  lastNameKana: string;
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
  url: string;
}

export interface BusinessCardsReceivesHistory {
  receiveDate: string;
  receivedLastContactDate: string;
  activityId: number;
  employeeId: number;
  employeeSurname: string;
  employeeName: string;
  employeePhoto: File;
}

export interface BusinessCardHistoryDetail {
  customerId: number;
  customerName: string;
  businessCardId: number;
  departmentName: string;
  position: string;
  firstName: string;
  lastName: string;
  businessCardImagePath: string;
  businessCardImageName: string;
  businessCardsReceivesHistories: Array<BusinessCardsReceivesHistory>;
}

export interface TradingProduct {
  tradingProductBudges: number;
  tradingProductData: Array<any>;
}

export interface Calendar {
  calendarBudges: number;
  calendarData: Array<any>;
}

export interface BusinessCardDetailInfoResponse {
  fieldInfo: Array<FieldInfo>;
  businessCardDetail: BusinessCard;
  businessCardHistoryDetail: Array<BusinessCardHistoryDetail>;
  timelines: any;
  tabInfo: Array<TabInfo>;
  activityHistories: Array<any>;
  tradingProduct: TradingProduct;
  calendar: Calendar;
  history: any;
}

export interface BusinessCardDetailDataDataResponse {
  getBusinessCard: BusinessCardDetailInfoResponse;
}

export interface BusinessCardDetailDataResponse {
  data: BusinessCardDetailDataDataResponse;
}

export interface BusinessCardDetailResponse {
  data: BusinessCardDetailDataResponse;
  status: number;
}

/*
 * Call api get businessCard detail
 * @param payload
 * @param config
 */

export interface BusinessCardPayload {
  query: string;
}

export interface UpdateBusinessCardPayload {
  mutation: string;
}

export const getBusinessCardDetail = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<BusinessCardDetailResponse> => {
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

// Delete BusinessCard

export interface DeleteBusinessCardInfoResponse {
  listOfBusinessCardId: Array<number>;
  listOfCustomerId: Array<number>;
  hasLastBusinessCard: boolean;
  messageWarning: string;
}

export interface DeleteBusinessCardDataDataResponse {
  deleteBusinessCard: DeleteBusinessCardInfoResponse;
}

export interface DeleteBusinessCardDataResponse {
  data: DeleteBusinessCardDataDataResponse;
}

export interface DeleteBusinessCardResponse {
  data: any;
  status: number;
}

export const deleteBusinessCard = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<DeleteBusinessCardResponse> => {
  try {
    const response = await apiClient.post(BUSINESS_CARD_API.deleteBusinessCards, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// update business card status

export interface UpdateBusinessCardStatusInfoResponse {
  businessCardIds: Array<number>;
}

export interface UpdateBusinessCardStatusDataDataResponse {
  updateBusinessCardStatus: UpdateBusinessCardStatusInfoResponse;
}

export interface UpdateBusinessCardStatusDataResponse {
  data: UpdateBusinessCardStatusDataDataResponse;
}

export interface UpdateBusinessCardStatusResponse {
  data: UpdateBusinessCardStatusDataResponse;
  status: number;
}

export const updateBusinessCardStatus = async (
  payload: BusinessCardPayload,
  config?: AxiosRequestConfig
): Promise<UpdateBusinessCardStatusResponse> => {
  try {
    const response = await apiClient.post(BUSINESS_CARD_API.updateBusinessCards, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// History BusinessCard

export interface MergedBusinessCard {
  businessCardId: number;
  companyName: string;
  alternativeCustomerName: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  position: string;
  departmentName: string;
  zipCode: string;
  address: string;
  building: string;
  emailAddress: string;
  phoneNumber: string;
  mobileNumber: string;
  lastContactDate: string;
  isWorking: boolean;
  memo: string;
  fax: string;
  url: string;
}

export interface BusinessCardHistoryUpdate {
  businessCardHistoryId: number;
  businessCardId: number;
  updatedDate: string;
  updatedUser: number;
  updatedUserName: string;
  updatedUserImage: string;
  updatedUserPhotoName: string;
  updatedUserPhotoPath: string;
  contentChange: any;
  firstName: string;
  lastName: string;
  companyName: string;
  mergedBusinessCards: Array<MergedBusinessCard>;
}

export interface HistoryUpdateBusinessCardInfoResponse {
  businessCardHistories: Array<BusinessCardHistoryUpdate>;
  fieldInfo: Array<FieldInfo>;
}

// export interface HistoryUpdateBusinessCardDataDataResponse {
//   dataInfo: HistoryUpdateBusinessCardInfoResponse;
// }

// export interface HistoryUpdateBusinessCardDataResponse {
//   data: HistoryUpdateBusinessCardDataDataResponse;
// }

export interface HistoryUpdateBusinessCardResponse {
  data: HistoryUpdateBusinessCardInfoResponse;
  status: number;
}


export interface HistoryUpdateBusinessCardPayload {
  businessCardId: number;
  offset: number;
  limit: number;
  orderBy: string;
}
export const getBusinessCardHistoryUpdate = async (
  payload: HistoryUpdateBusinessCardPayload,
  config?: AxiosRequestConfig
): Promise<HistoryUpdateBusinessCardResponse> => {
  try {
    const response = await apiClient.post(BUSINESS_CARD_API.getBusinessCardHistory, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

// create followed

export interface CreateFollowedInfoResponse {
  businessCardIds: Array<number>;
}

export interface CreateFollowedDataDataResponse {
  createFollowed: CreateFollowedInfoResponse;
}

export interface CreateFollowedDataResponse {
  data: CreateFollowedDataDataResponse;
}

export interface CreateFollowedResponse {
  data: CreateFollowedDataResponse;
  status: number;
}

export const createFollowed = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<CreateFollowedResponse> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.createdFollowed,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// Delete followed

export interface DeleteFollowedInfoResponse {
  followTargetType: number;
  followTargetId: number;
}

export interface DeleteFollowedDataDataResponse {
  followeds: DeleteFollowedInfoResponse;
}

export interface DeleteFollowedDataResponse {
  data: DeleteFollowedDataDataResponse;
}

export interface DeleteFollowedResponse {
  data: DeleteFollowedDataResponse;
  status: number;
}

export const deleteFollowed = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<DeleteFollowedResponse> => {
  try {
    const response = await apiClient.post(TIMELINE_API.deleteFollowedUrl, payload, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export interface ActivityResponse {
  activityData: Array<{
    dataInfo: {
      activities: {
        activityId: number;
        isDraft: boolean;
        contactDate: any;
        activityStartTime: any;
        activityEndTime: any;
        activityDuration: string;
        employee: {
          employeeName: string;
          employeeId: number;
          employeePhoto: {
            photoFileName: any;
            photoFilePath: any;
          };
        };
        listBusinessCard: Array<{
          businessCardId: number;
          firstName: string;
          lastName: string;
          firstNameKana: string;
          lastNameKana: string;
          titleName: string;
          departmentName: string;
        }>;
        interviewer: Array<string>;
        customer: {
          customerId: number;
          customerName: string;
        };
        productTradings: Array<{
          productTradingId: number;
          productId: number;
          productName: string;
          employeeId: number;
          employeeName: string;
          quantity: string;
          price: string;
          amount: number;
          endPlanDate: any;
          orderPlanDate: any;
          productTradingProgressId: number;
          productTradingProgressName: string;
          memo: string;
          productsTradingsDetailsData: {};
        }>;
        customers: Array<{
          customerId: number;
          customerName: string;
        }>;
        memo: string;
        createdUser: {
          createdDate: any;
          createdUserName: string;
          createdUserId: number;
        };
        updatedUser: {
          updatedDate: any;
          updatedUserName: string;
          updatedUserId: number;
        };
        extTimeline: {};
        initializeInfo: {
          selectedListType: number;
          selectedListId: number;
        };
        nextSchedule: {
          nextScheduleDate: any;
          nextScheduleName: string;
          iconPath: any;
        };
        task: string;
      };
    };
  }>;
}

export interface ActivityHistoryDataResponse {
  data: ActivityResponse;
}

export interface ActivityHistoryResponse {
  data: ActivityHistoryDataResponse;
  status: number;
}

/**
 * Call api getBusinessCards
 * @param payload
 * @param config
 */

// export const getActivity = async (
//   payload: BusinessCardPayload,
//   config?: AxiosRequestConfig
// ): Promise<ActivityHistoryResponse> => {
//   try {
//     const response = await apiClient.post(BUSINESS_CARD_API.getActivities, payload, config);
//     return response;
//   } catch (error) {
//     return error.response;
//   }
// };

export const getActivities = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      BUSINESS_CARD_API.getActivities,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
