import { AxiosRequestConfig } from "axios";
import { apiClient } from "../../config/clients/api-client";
import { TASK_API } from "../../config/constants/api";
import { TEXT_EMPTY } from "../../config/constants/constants";

/**
 * product detail trading information
 */
export interface ProductDetailTrading {
  productTradingId: number;
  productName: string;
  quantity: number;
  price: number;
  amount: number;
  productTradingProgressId: number;
  progressName: string;
  progressOrder: number;
  isAvailable: string;
  employeeId: number;
  employeeName: string;
  endPlanDate: string;
  orderPlanDate: string;
  memo: string;
  productTradingData: DynamicData;
  updateDate: string;
  customerName: string;
  customerId: number;
  productId: number;
  isFinish: boolean;
}

/**
 * task create screen payload information
 */
export interface TaskCreatePayload {
  taskId?: number;
  taskName: string;
  statusTaskId: number;
  customers: Array<any>;
  startDate: string;
  finishDate: string;
  files: Array<any>;
  memo: string;
  isPublic: number;
  subtasks: Array<any>;
  isVisibleCustomer: boolean;
  productTradings: Array<any>;
  operators: Array<any>;
  milestoneId: number;
  milestoneName: string;
  taskData: any;
  milestoneFinishDate: string;
}

export const DATA_TASK_CREATE_EMPTY = {
  taskName: TEXT_EMPTY,
  statusTaskId: 1,
  customers: null,
  productTradingIds: [],
  operators: [],
  startDate: TEXT_EMPTY,
  finishDate: TEXT_EMPTY,
  isPublic: 0,
  parentTaskId: null,
  subTasks: [],
  milestoneId: null,
  milestoneName: TEXT_EMPTY,
  updateFlg: null,
  taskData: [],
  updatedDate: null,
  fileNameOlds: [],
};

/**
 * call api get global tool
 * @param payload
 * @param config
 */
export const getGlobalTool = async (
  payload: any,
  config?: any
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TASK_API.getTaskGlobalTools,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * call api get layout task
 * @param payload
 * @param config
 */
export const getTaskLayout = async (config?: any): Promise<any> => {
  try {
    const response = await apiClient.post(
      TASK_API.getTaskLayoutUrl,
      {},
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * call api remove task
 * @param payload
 * @param config
 */
export const removeTask = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TASK_API.removeTaskApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * call api get navigation data
 * @param payload
 * @param config
 */
export const getTaskLocalNavigation = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TASK_API.getTaskNavigation,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * call api save local navigation state
 * @param payload
 * @param config
 */
export const saveTaskLocalNavigation = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TASK_API.saveLocalNavigation,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * call api get list task from api
 * @param payload
 * @param config
 */
export const getListTask = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TASK_API.getListTaskApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// Task detail

/**
 * Dynamic data interface
 */
export interface DynamicData {
  fieldType: any;
  key: string;
  value: string;
}

/**
 * Employee interface
 */
export interface Employee {
  employeeId: number;
  employeeName: string;
  photoEmployeeImg: string;
  departmentName: string;
  positionName: string;
}

/**
 * Department interface
 */
export interface Department {
  departmentId: number;
  departmentName: string;
  departmentParentName: string;
  photoDepartmentImg: string;
}

/**
 * Group interface
 */
export interface Group {
  groupId: number;
  groupName: string;
  photoGroupImg: string;
}

/**
 * Operator interface
 */
export interface Operator {
  employees: Array<Employee>;
  departments: Array<Department>;
  groups: Array<Group>;
}

/**
 * Total Employee interface
 */
export interface TotalEmployee {
  employeeId: number;
  employeeName: string;
  photoEmployeeImg: string;
  departmentName: string;
  positionName: string;
}

/**
 * Customer interface
 */
export interface Customer {
  customerId: number;
  parentCustomerName: string;
  customerName: string;
  customerAddress: string;
}

/**
 * File interface
 */
export interface File {
  fileId: number;
  filePath: string;
  fileName: string;
}

/**
 * Field info interface
 */
export interface FieldInfo {
  fieldId: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: number;
  fieldOrder: number;
}

/**
 * Tab information interface
 */
export interface TabInfo {
  tabId: number;
  isDisplay: boolean;
  isDisplaySummary: boolean;
  maxRecord: number;
}

/**
 * Task interface
 */
export interface Task {
  taskId: number;
  taskData: Array<DynamicData>;
  taskName: string;
  memo: string;
  operators: Array<Operator>;
  totalEmployees: Array<TotalEmployee>;
  isOperator: number;
  countEmployee: number;
  startDate: string;
  finishDate: string;
  parentTaskId: number;
  statusParentTaskId: number;
  customers: Array<Customer>;
  productTradings: Array<ProductDetailTrading>;
  milestoneId: number;
  milestoneName: string;
  milestoneFinishDate: string;
  milestoneParentCustomerName: string;
  milestoneCustomerName: string;
  files: Array<File>;
  statusTaskId: number;
  status: number;
  isPublic: number;
  subtasks: Array<Task>;
  registDate: string;
  refixDate: string;
  registPersonName: string;
  refixPersonName: string;
  registPersonId: number;
}

/**
 * Task detail data information
 */
export interface TaskDetailDataInfo {
  task: Task;
}

/**
 * Task detail information response
 */
export interface TaskDetailInfoResponse {
  dataInfo: TaskDetailDataInfo;
  fieldInfo: Array<FieldInfo>;
  tabInfo: Array<TabInfo>;
}

/**
 * Task detail response
 */
export interface TaskDetailResponse {
  data: TaskDetailInfoResponse;
  status: number;
}

/*
 * Call api get task detail
 * @param payload
 * @param config
 */

/**
 * task payload interface
 */
export interface TaskPayload {
  query: string;
}

/**
 * update task interface
 */
export interface UpdateTaskPayload {
  mutation: string;
}

/**
 * call api get task detail
 * @param payload
 * @param config
 */
export const getTaskDetail = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<TaskDetailResponse> => {
  try {
    const response = await apiClient.post(
      TASK_API.getTaskDetailApi,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * delete task information response
 */
export interface DeleteTaskInfoResponse {
  taskIds: Array<number>;
}

/**
 * delete task sub data response
 */
export interface DeleteTaskDataDataResponse {
  deleteTasks: DeleteTaskInfoResponse;
}

/**
 * delete task data response
 */
export interface DeleteTaskDataResponse {
  data: DeleteTaskDataDataResponse;
}


/**
 * update task information response
 */
export interface UpdateTaskInfoResponse {
  taskIds: Array<number>;
}

/**
 * update task sub data response
 */
export interface UpdateTaskDataDataResponse {
  updateTaskStatus: UpdateTaskInfoResponse;
}

/**
 * update task data response
 */
export interface UpdateTaskDataResponse {
  data: UpdateTaskDataDataResponse;
}

/**
 * update task response
 */
export interface UpdateTaskResponse {
  data: any;
  status: number;
}

/**
 * call api update task status
 * @param payload
 * @param config
 */
export const updateTaskStatus = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<UpdateTaskResponse> => {
  try {
    const response = await apiClient.post(
      TASK_API.updateStatusTaskApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Task History interface
 */
export interface HistoryTask {
  updatedDate: string;
  updatedUserId: number;
  updatedUserName: string;
  updatedUserImage: string;
  contentChange: any;
}

/**
 * History update information response
 */
export interface HistoryUpdateTaskInfoResponse {
  data: Array<HistoryTask>;
}

/**
 * History update task response
 */
export interface HistoryUpdateTaskResponse {
  data: HistoryUpdateTaskInfoResponse;
  status: number;
}

export interface GetTaskHistoryPayload {
  taskId: number;
  currentPage: number;
  limit: number;
}

/**
 * call api get history update
 * @param payload
 * @param config
 */
export const getHistoryTask = async (
  payload: GetTaskHistoryPayload,
  config?: AxiosRequestConfig
): Promise<HistoryUpdateTaskResponse> => {
  try {
    const response = await apiClient.post(
      TASK_API.getTaskHistory,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * Milestone history interface
 */
export interface HistoryMilestone {
  updatedDate: string;
  updatedUserId: number;
  updatedUserName: string;
  updatedUserImage: string;
  contentChange: any;
  reasonEdit: string;
}

/**
 * Milestone information interface
 */
export interface Milestone {
  milestoneId: number;
  milestoneName: string;
  memo: string;
  listTask: Array<Task>;
  endDate: string;
  isDone: any;
  isPublic: number;
  customer: Customer;
  timelines: any;
  createdDate: string;
  createdUser: number;
  createdUserName: string;
  updatedDate: string;
  updatedUser: number;
  updatedUserName: string;
  url: string;
  milestoneHistories: Array<HistoryMilestone>;
  isCreatedUser: boolean
}

/**
 * milestone detail data information
 */
export interface MilestoneDetailDataInfo {
  milestone: Milestone;
}

/**
 * Milestone detail information response
 */
export interface MilestoneDetailInfoResponse extends Milestone {
  fieldInfo: Array<FieldInfo>;
  tabInfo: Array<TabInfo>;
}

/**
 * Milestone Detail sub data response
 */
export interface MilestoneDetailDataDataResponse {
  getMilestone: MilestoneDetailInfoResponse;
}

/**
 * Milestone detail data response
 */
export interface MilestoneDetailDataResponse {
  data: MilestoneDetailDataDataResponse;
}

/**
 * Milestone detail response
 */
export interface MilestoneDetailResponse {
  data: Milestone;
  status: number;
}

/**
 * milestone payload interface
 */
export interface MilestonePayload {
  query: string;
}

/**
 * update milestone payload interface
 */
export interface UpdateMilestonePayload {
  mutation: string;
}

/**
 * call api get milestone detail
 * @param payload
 * @param config
 */
export const getMilestoneDetail = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<MilestoneDetailResponse> => {
  try {
    const response = await apiClient.post(
      TASK_API.getMilestoneApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * delete milestone information response
 */
export interface DeleteMilestoneInfoResponse {
  milestoneIds: Array<number>;
}

/**
 * delete milestone sub data response
 */
export interface DeleteMilestoneDataDataResponse {
  deleteMilestone: DeleteMilestoneInfoResponse;
}

/**
 * delete milestone data response
 */
export interface DeleteMilestoneDataResponse {
  data: DeleteMilestoneDataDataResponse;
}

/**
 * delete milestone response
 */
export interface DeleteMilestoneResponse {
  data: DeleteMilestoneDataResponse;
  status: number;
}

/**
 * call api delete milestone
 * @param payload
 * @param config
 */
export const deleteMilestones = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<DeleteMilestoneResponse> => {
  try {
    const response = await apiClient.post(
      TASK_API.deleteMilestone,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * update milestone information response
 */
export interface UpdateMilestoneInfoResponse {
  milestoneIds: Array<number>;
}

/**
 * update milestone sub data response
 */
export interface UpdateMilestoneDataDataResponse {
  updateMilestoneStatus: UpdateMilestoneInfoResponse;
}

/**
 * update milestone response
 */
export interface UpdateMilestoneDataResponse {
  data: UpdateMilestoneDataDataResponse;
}

/**
 * update milestone response
 */
export interface UpdateMilestoneResponse {
  data: UpdateMilestoneDataResponse;
  status: number;
}

/**
 * call api update milestone status
 * @param payload
 * @param config
 */
export const updateMilestoneStatus = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<UpdateMilestoneResponse> => {
  try {
    const response = await apiClient.post(
      TASK_API.updateMilestoneStatusApi,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * history update milestone information
 */
export interface HistoryMilestone {
  updatedDate: string;
  updatedUserId: number;
  updatedUserName: string;
  updatedUserImage: string;
  contentChange: any;
  reasonEdit: string;
}

/**
 * history update milestone information response
 */
export interface HistoryUpdateMilestoneInfoResponse {
  histories: Array<HistoryMilestone>;
}

/**
 * history update milestone sub data response
 */
export interface HistoryUpdateMilestoneDataDataResponse {
  dataInfo: HistoryUpdateMilestoneInfoResponse;
}

/**
 * history update milestone data response
 */
export interface HistoryUpdateMilestoneDataResponse {
  data: HistoryUpdateMilestoneDataDataResponse;
}

/**
 * history update milestone response
 */
export interface HistoryUpdateMilestoneResponse {
  data: DeleteMilestoneDataResponse;
  status: number;
}

// /**
//  * call api get history milestone
//  * @param payload
//  * @param config
//  */
// export const getHistoryMilestone = async (
//   payload: MilestonePayload,
//   config?: AxiosRequestConfig
// ): Promise<HistoryUpdateMilestoneResponse> => {
//   try {
//     const response = await apiClient.post(
//       TASK_API.getTaskGlobalTools,
//       payload,
//       config
//     );
//     return response;
//   } catch (error) {
//     return error.response;
//   }
// };

/**
 * Operators information interface
 */
export interface Operators {
  employeeId: number;
  departmentId: number;
  groupId: number;
}

/**
 * Files infomation interface
 */
export interface Files {
  fileData: string;
  fileName: string;
}

/**
 * Sub tab payload interface
 */
export interface SubTabPayload {
  query: string;
}

// /**
//  * Call api create sub task
//  * @param payload
//  * @param config
//  */
// export const createSubTask = async (
//   payload: SubTabPayload,
//   config?: AxiosRequestConfig
// ): Promise<any> => {
//   try {
//     const response = await apiClient.post(
//       TASK_API.createSubTaskApiUrl,
//       payload,
//       config
//     );
//     return response;
//   } catch (error) {
//     return error.response;
//   }
// };

// /**
//  * call api update subtask
//  * @param payload
//  * @param config
//  */
// export const updateSubTask = async (
//   payload: SubTabPayload,
//   config?: AxiosRequestConfig
// ): Promise<any> => {
//   try {
//     const response = await apiClient.post(
//       TASK_API.createSubTaskApiUrl,
//       payload,
//       config
//     );
//     return response;
//   } catch (error) {
//     return error.response;
//   }
// };

/**
 * product trading information
 */
export interface ProductTradings {
  productTradingId: number;
  productId: number;
  productName: string;
  customerId: number;
  customerName: string;
  employeeId: number;
  employeeName: string;
  progressName: string;
  amount: number;
  tradingDate: string;
}

/**
 * subtask information
 */
export interface SubTask {
  taskId: number;
  statusTaskId: number;
  taskName: string;
}

/**
 * Customer infomation
 */
export interface Customers {
  customerId: number;
  customerName: string;
}

/**
 * Create Task Payload
 */
export interface CreateTaskPayload {
  taskName: string;
  statusTaskId: string;
  operators: Array<Operators>;
  startDate: string;
  finishDate: string;
  files: Array<Files>;
  memo: string;
  isPublic: number;
  productTradings: Array<ProductTradings>;
  subtasks: Array<SubTask>;
  milestoneId: number;
  milestoneName: string;
  updateFlg: number;
  taskData: object;
  customers: Array<Customers>;
}

/**
 * Call api create task
 * @param payload
 * @param config
 */
export const createTask = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  try {
    const response = await apiClient.post(
      TASK_API.createSubTaskApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
 * update task detail response
 */
export interface UpdateTaskDetailResponse {
  taskIds: number;
}

/**
 * update task detail sub data response
 */
export interface UpdateTaskDetailDataDataResponse {
  updateTask: UpdateTaskDetailResponse;
}

/**
 * update task detail data response
 */
export interface UpdateTaskDetailDataResponse {
  data: UpdateTaskDetailDataDataResponse;
}

/**
 * update task detail data status response
 */
export interface UpdateTaskDetailDataStatusResponse {
  data: UpdateTaskDetailDataResponse;
  status: number;
}

/**
 * call api update task
 */
export const updateTaskDetail = async (
  payload: any,
  config?: AxiosRequestConfig
): Promise<UpdateTaskDetailDataStatusResponse> => {
  try {
    const response = await apiClient.post(
      TASK_API.updateTaskApiUrl,
      payload,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
