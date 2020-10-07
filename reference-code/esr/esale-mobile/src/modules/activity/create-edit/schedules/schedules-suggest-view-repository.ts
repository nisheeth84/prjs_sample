import { SERVICES_GET_MILESTONES_SUGGESTION, SERVICES_GET_TASKS_SUGGESTION, SERVICES_GET_SCHEDULE_SUGGESTIONS, SERVICES_GET_MILESTONES_BY_IDS } from './../../../../config/constants/api';
import { apiClient } from './../../../../config/clients/api-client';
/**
 * API get MilestonesSuggestion
 * @param payload 
 */
export const getMilestonesSuggestion = async (
  payload: ReportTargetParams
): Promise<GetMilestonesSuggestionResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_MILESTONES_SUGGESTION,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}
/**
 * Object params for API getMilestonesSuggestion, getTasksSuggestion, getSuggestionsReportTarget
 */
export interface ReportTargetParams {
  searchValue: string
  customerId?: number
  listIdChoice?: Array<number>
  offset?: number
  limit?: number
  relationFieldId?: any
}
/**
 * Response of api getMilestonesSuggestion
 */
export interface GetMilestonesSuggestionResponse {
  data: DataGetMilestonesSuggestionResponse
  status: number
}
/**
 * Data of api getMilestonesSuggestionResponse
 */
export interface DataGetMilestonesSuggestionResponse {
  milestones: Array<Milestone>
}
/** 
 * Milestone
 */
export interface Milestone {
  milestoneId: number
  milestoneName: string
  endDate: string
  customerId: number
  customerName: string
  parentCustomerName: string
}

/**
 * API getTasksSuggestion
 * @param payload 
 */
export const GetTasksSuggestion = async (
  payload: ReportTargetParams
): Promise<GetTasksSuggestionResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_TASKS_SUGGESTION,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}
/**
 * Response of api getTasksSuggestion
 */
export interface GetTasksSuggestionResponse {
  data: DataGetTasksSuggestionResponse
  status: number
}
/**
 * Data of GetTasksSuggestionResponse
 */
export interface DataGetTasksSuggestionResponse {
  tasks: Array<Task>
}
/**
 * Task
 */
export interface Task {
  taskId: number
  taskName: string
  milestone: Milestone
  customer: Customer
  productTradings: Array<ProductTrading>
  status: number
  finishDate: string
}
/**
 * Customer
 */
export interface Customer {
  customerId: number
  customerName: string
  parentCustomerName: string
}
/**
 * ProductTrading
 */
export interface ProductTrading {
  productTradingId: number
  productTradingName: string
}
/**
 * API getScheduleSuggestions
 * @param payload 
 */
export const getScheduleSuggestions = async (
  payload: ReportTargetParams
): Promise<GetScheduleSuggestionsResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_SCHEDULE_SUGGESTIONS,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}
/**
 * Response of api getSuggestionsReportTarget
 */
export interface GetScheduleSuggestionsResponse {
  data: DataGetScheduleSuggestionsResponse
  status: number
}
/**
 * Data of GetSuggestionsReportTargetResponse
 */
export interface DataGetScheduleSuggestionsResponse {
  schedules: Array<Schedule>
}
/**
 * Schedule
 */
export interface Schedule {
  scheduleId: number
  scheduleName: string
  scheduleTypeId: number
  startDate: string
  endDate: string
  productTradingId: number
  customerId: number
  customerName: string
  productTradingName: string
  parentCustomerName: string
}

/**
 * API GetMilestoneByIds
 * @param payload 
 */
export const GetMilestonesByIds = async (
  payload: GetMilestonesByIdsParams
): Promise<GetMilestonesByIdsResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_MILESTONES_BY_IDS,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}

/**
 * Param of API GetMilestoneByIds
 */
export interface GetMilestonesByIdsParams {
  milestoneIds: Array<number>
}
/**
 * Response of API GetMilestoneByIds
 */
export interface GetMilestonesByIdsResponse {
  data: Array<MilestoneInfo>,
  status: number
}

/**
 * DataResponse of API GetMilestoneByIds
 */
export interface DataGetMilestonesByIdsResponse {
  milestones: Array<Schedule>
}

/**
 * Milestone information
 */
export interface MilestoneInfo {
  milestoneId: number
  milestoneName: string
  memo: string
  listTask: Array<Task>
  endDate: string
  customer: Customer
  isDone: number
  isPublic: number
  createdDate: string
  createdUserId: number
  createdUserName: string
  updatedDate: string
  updatedUserId: number
  updatedUserName: string
}