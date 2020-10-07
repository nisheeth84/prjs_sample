import { apiClient } from "../../../config/clients/api-client";
import { SERVICE_GET_CUSTOMER_LIST, SERVICE_ADD_TO_LIST_FAVOURITE, SERVICE_REMOVE_FAVOURITE_LIST, SERVICE_DELETE_LIST, SERVICE_COUNT_RELATION_CUSTOMER, SERVICE_UPDATE_LIST, SERVICE_CREATE_LIST, SERVICE_ADD_CUSTOMERS_TO_AUTO_LIST, SERVICE_DELETE_CUSTOMER_OUT_OF_LIST, SERVICE_DELETE_CUSTOMERS, SERVICE_GET_CUSTOMERS } from "../../../config/constants/api";


export interface ItemMyList {
  listId: number;
  listName: string;
  isAutoList: boolean;
  customerListType: number;
  participantType: number;
  extend: boolean;
}

export interface ItemSharedList {
  listId: number;
  listName: string;
  isAutoList: boolean;
  customerListType: number;
  participantType: number;
  extend: boolean;
}

export interface ItemFavouriteList {
  listId: number;
  listName: string;
  isAutoList: boolean;
  customerListType: number;
  participantType: number;
  extend: boolean;
}

export interface CustomerList {
  myList: ItemMyList[];
  sharedList: ItemSharedList[];
  favouriteList: ItemFavouriteList[];
}

export interface ValueCustomerList {
  listId: number;
  typeList: number;
  isAutoList: boolean;
  status: boolean;
  listIdCustomer: number[];
  statusScreen: boolean;
  selectedTargetType: number;
  listName: string;
}

export interface ItemCustomerListMemberIds {
  customerListMemberId: number;
  customerListSearchConditionId: number;
}

export interface createCustomerList {
  customerListMemberIds: Array<ItemCustomerListMemberIds>;
}

export interface ItemCustomer {
  customerId: number;
  customerName: string;
  photoFilePath: any;
  customerLogo: {
    photoFileName: string,
    photoFilePath: string,
    fileUrl: string
  };
  phoneNumber: string;
  customerAddressObject: {
    zipCode: string,
    addressName: string,
    buildingName: string,
    address: string,
  },
  customerAddress: string;
  business: {
    businessMainId: number,
    businessMainName: string,
    buisinessSubId: number,
    businessSubname: string,
  },
  url: any;
  scenarioId: any;
  longitude: any;
  latitude: any;
  customerParent: any;
  parentId: any;
  directParent: any;
  customerChildList: any;
  customerAliasName: any;
  memo: any;
  customerData: any;
  createdDate: string;
  createdUser: {
    employeeId: number,
    employeeName: string,
    employeePhoto: string,
  },
  updatedDate: string;
  updatedUser: {
    employeeId: number,
    employeeName: string,
    employeePhoto: string,
  },
  personInCharge: {
    employeeId: number,
    employeeName: string,
    employeePhoto: string,
    departmentId: number,
    departmentName: string,
    groupId: number,
    groupName: string,
  },
  customerDataString: any;
  parentTree: any;
  listUpdatedDate: any;
  nextActions: any;
  nextSchedules: any;
  extend: boolean;
  select: boolean;
}

export interface GetCustomers {
  totalRecords: number;
  customers: Array<ItemCustomer>;
  lastUpdatedDate: any;
}

export interface CustomerIds {
  customerId: number
}

export interface customerListMemberId {
  customerId: number
}

export interface Business {
  customerBusinessId: number
  customerBusinessName: string
  customerBusinessParent: number
}

export interface ItemListCountRelationCustomer {
  customerId: any;
  countBusinessCard: any;
  countActivities: any;
  countSchedules: any;
  countTasks: any;
  countTimelines: any;
  countEmail: any;
  countProductTrading: any;
}

export interface ItemCustomerId {
  customerId: number;
}

export interface CustomerListMemberId {
  customerListMemberId: number;
}

export interface ItemCustomerListMemberId {
  customerListMemberIds: Array<CustomerListMemberId>;
}

export interface extendItem {
  customerId: number;
  extend: boolean;
}

export interface TaskItemModal {
  id: number;
  cate: string;
}

export interface ItemSortTypeData {
  id: number;
  name: string;
  selected: boolean;
}

export interface TaskItemModalActionListUser {
  id: number;
  itemModal: string;
}

export interface DeleteCustomersPayload {
  customerIds: any;
}
export interface DeleteCustomerOutOfListPayload {
  customerListId: number;
  customerIds: any;
}

export interface AddCustomersToAutoListPayload {
  idOfList: number;
}

export interface UpdateListPayload { }

export interface CreateListPayload { }

export interface DeleteListPayload {
  customerListId: number;
}

export interface CountRelationCustomerPayload {
  customerIds: number[];
}

export interface RemoveFavouriteListPayload {
  customerListId: number;
}

export interface AddToListFavouritePayload {
  customerListId: number;
}

export interface CustomerListPayload {
  mode: number;
  isFavourite: boolean;
}

export interface GetCustomersPayload {
  searchConditions: any;
  filterConditions: any;
  localSearchKeyword: string;
  selectedTargetType: number;
  selectedTargetId: any;
  isUpdateListView: boolean;
  orderBy: any;
  offset: number;
  limit: number;
}

export interface CustomerListResponse {
  data: CustomerList;
  status: number;
}

export interface GetCustomersResponse {
  data:  GetCustomers;
  status: number;
}

export interface CustomerListIdAddCustomersToAutoListResponse {
  customerListId: number;
}

export interface AddCustomersToAutoListResponse {
  data: CustomerListIdAddCustomersToAutoListResponse;
  status: number;
}

export interface CustomerListId {
  customerListId: number;
}

export interface DeleteListResponse {
  data: any;
  status: number;
}

export interface RemoveFavouriteListResponse {
  data: any;
  status: number;
}

export interface AddToListFavouriteResponse {
  data: any;
  status: number;
}

export interface DeleteCustomersResponse {
  data: any;
  status: number;
}

export interface EditOrCreateListResponse {
  data: any;
  status: number;
}

export interface ListCount {
  listCount: ItemListCountRelationCustomer[];
}

export interface CountRelationCustomerResponse {
  data: ListCount;
  status: number;
}

export interface CustomerIdsDeleteCustomerOutOfList {
  customerIds: ItemCustomerId[];
}

export interface DeleteCustomerOutOfListResponse {
  data: CustomerIdsDeleteCustomerOutOfList
  status: number;
}


export interface MoveCustomersToOtherListResponse {
  data: {
    data: {
      customerListMemberIds: Array<ItemCustomerListMemberId>
    }
  };
  status: number;
}


export const deleteCustomers = async (
  payload: DeleteCustomersPayload
): Promise<DeleteCustomersResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICE_DELETE_CUSTOMERS, payload);

    return ressponse;
  } catch (error) {
    return error.response;
  }
}

export const deleteCustomerOutOfList = async (
  payload: DeleteCustomerOutOfListPayload
): Promise<DeleteCustomerOutOfListResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICE_DELETE_CUSTOMER_OUT_OF_LIST, payload);

    return ressponse;
  } catch (error) {
    return error.ressponse;
  }
}

export const addCustomersToAutoList = async (
  payload: AddCustomersToAutoListPayload
): Promise<AddCustomersToAutoListResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICE_ADD_CUSTOMERS_TO_AUTO_LIST, payload);

    return ressponse;
  } catch (error) {
    return error.ressponse;
  }
}

export const createList = async (
  payload: CreateListPayload
): Promise<EditOrCreateListResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICE_CREATE_LIST, payload);

    return ressponse;
  } catch (error) {
    return error.ressponse;
  }
}

export const updateList = async (
  payload: UpdateListPayload
): Promise<EditOrCreateListResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICE_UPDATE_LIST, payload);

    return ressponse;
  } catch (error) {
    return error.ressponse;
  }
}

export const countRelationCustomer = async (
  payload: CountRelationCustomerPayload
): Promise<CountRelationCustomerResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICE_COUNT_RELATION_CUSTOMER, payload);

    return ressponse;
  } catch (error) {
    return error.ressponse;
  }
}

export const deleteList = async (
  payload: DeleteListPayload
): Promise<DeleteListResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICE_DELETE_LIST, payload);
    return ressponse;
  } catch (error) {
    return error.ressponse;
  }
}

export const removeFavouriteList = async (
  payload: RemoveFavouriteListPayload
): Promise<RemoveFavouriteListResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICE_REMOVE_FAVOURITE_LIST, payload);

    return ressponse;
  } catch (error) {
    return error.ressponse;
  }
}

export const addToListFavourite = async (
  payload: AddToListFavouritePayload
): Promise<AddToListFavouriteResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICE_ADD_TO_LIST_FAVOURITE, payload);

    return ressponse;
  } catch (error) {
    return error.ressponse;
  }
}

export const customerList = async (
  payload: CustomerListPayload
): Promise<CustomerListResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICE_GET_CUSTOMER_LIST, payload);

    return ressponse;
  } catch (error) {
    return error.ressponse;
  }
}

export const getCustomers = async (
  payload: GetCustomersPayload
): Promise<GetCustomersResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICE_GET_CUSTOMERS, payload);

    return ressponse;
  } catch (error) {
    return error.ressponse;
  }
}