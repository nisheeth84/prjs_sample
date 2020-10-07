import { apiClient } from '../../../../config/clients/api-client';
import { AxiosRequestConfig } from 'axios';

/**
 * Define payload
 */
export interface ListModalPayload {}

/**
 * Define structure values of data api
 */
export interface InitializeListModalResponse {
  data: any;// data form response
  status: number;// status off response
}

export const getInitializeListModal = '/services/customers/api/get-initialize-list-modal';

/**
 * Define function call API get data init ressponse
 */
export const initializeListModal = async (
  payload: ListModalPayload,
): Promise<InitializeListModalResponse> => {
  try {
    const response = await apiClient.post(
      getInitializeListModal,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const createListUrl = '/services/customers/api/create-list';

/**
 * Define payload
 */
export interface CreateListPayload {}

/**
 * Define structure values of data api
 */
export interface CreateListResponse {
  data: any;// data form response
  status: number;// status off response
}
/**
 * Define function call API get data init ressponse
 */
export const createList = async (
  payload: CreateListPayload,
): Promise<CreateListResponse> => {
  try {
    const response = await apiClient.post(
      createListUrl,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const updateListUrl = '/services/customers/api/update-list';
/**
 * Define payload
 */
export interface UpdateListPayload {}

/**
 * Define structure values of data api
 */
export interface UpdateListResponse {
  data: any;// data form response
  status: number;// status off response
}
/**
 * Define function call API get data init ressponse
 */
export const updateList = async (
  payload: UpdateListPayload,
): Promise<UpdateListResponse> => {
  try {
    const response = await apiClient.post(
      updateListUrl,
      payload,
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Define structure values of create list share api
 */
export interface ActionListShareResponse {
  status: number;// status off response
}

/**
 * Define function call API update, create list share ressponse
 */
export const updateListShareFromMyList = async (
  apiUrl: string,
  payload: ListModalPayload,
  config?: AxiosRequestConfig,
): Promise<ActionListShareResponse> => {
  try {
    const response = await apiClient.post(
      apiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};