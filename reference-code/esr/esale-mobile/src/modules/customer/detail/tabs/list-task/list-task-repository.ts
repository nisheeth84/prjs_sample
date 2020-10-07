import { apiClient } from '../../../../../config/clients/api-client';
export const deleteTaskUrl = "/services/schedules/api/delete-tasks";
export const updateTaskStatusUrl = "/services/schedules/api/update-task-status";
export const getTasksUrl = "/services/schedules/api/get-tasks";
export const getFieldsInfoUrl = "/services/commons/api/get-fields-info";

// delete task Response
export interface deleteTaskResponse {
  data: any;
  status: number;
}

// delete task Payload
export interface deleteTaskPayload { }

/**
 * call API delete task
 * @param payload object call API
 */
export const deleteTask = async (
  payload: deleteTaskPayload,
): Promise<deleteTaskResponse> => {
  try {
    const response = await apiClient.post(
      deleteTaskUrl,
      payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

// Response call API updateTaskStatus
export interface updateTaskStatusResponse {
  data: any;
  status: number;
}

// Object param call API updateTaskStatus
export interface updateTaskStatusPayload { }

/**
 * api update auto group
 * @param updateTaskStatusPayload Object param call API updateTaskStatus
 */
export const updateTaskStatus = async (
  payload: updateTaskStatusPayload,
): Promise<updateTaskStatusResponse> => {
  try {
    const response = await apiClient.post(
      updateTaskStatusUrl,
      payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
}

// Response call API getTask
export interface getTasksResponse {
  data: any;
  status: number;
}

// Object call API getTask
export interface getTasksPayload { }

/**
 * call API getTask
 * @param payload object param call API getTask
 */
export const getTasks = async (
  payload: getTasksPayload,
): Promise<getTasksResponse> => {
  try {
    const response = await apiClient.post(
      getTasksUrl,
      payload
    );
    return response;
  } catch (error) {
    return error.response;
  }
}


