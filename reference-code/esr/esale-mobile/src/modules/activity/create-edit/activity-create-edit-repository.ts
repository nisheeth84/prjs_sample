import { ActivityLayoutDataResponse, ActivityResponse, Employee } from './../activity-repository'
import {
  SERVICES_GET_ACTIVITY_LAYOUT,
  SERVICES_CREATE_ACTIVITY,
  SERVICES_GET_PRODUCT_SUGGESTIONS,
  SERVICES_GET_PRODUCT_TRADING_SUGGESTIONS,
  SERVICES_GET_PRODUCT_TRADINGS,
  SERVICES_UPDATE_ACTIVITY,
  SERVICES_CREATE_ACTIVITY_DRAFT,
  SERVICES_GET_ACTIVITY_DRAFT,
  SERVICES_GET_CUSTOMERS_BY_IDS,
  SERVICES_GET_SCHEDULES_BY_IDS
} from './../../../config/constants/api'
import { apiClient } from './../../../config/clients/api-client'
import { ProductSuggestion } from './activity-create-edit-reducer'

/**
 * Response
 */
export interface getActivityLayoutResponse {
  data: ActivityLayoutDataResponse
  status: number
}

export interface ProductTrading {
  productTradingId?: any,
  customerName?: any,
  customerId?: any,
  productId?: any,
  productName?: any,
  productImageName?: any,
  productImagePath?: any,
  productCategoryId?: any,
  productCategoryName?: any,
  quantity?: any,
  price?: any,
  unitPrice?: any,
  amount?: any,
  productTradingProgressId?: any,
  progressName?: any,
  progressOrder?: any,
  isFinish?: any,
  isAvailable?: any,
  employeeId?: any,
  employeeName?: any,
  employeeSurname?: any,
  employee?: Employee,
  endPlanDate?: any,
  orderPlanDate?: any,
  memo?: any,
  memoProduct?: any,
  productTradingData?: any,
  updateDate?: any,
  productTradingHistories?: Array<ProductTrading>
  productMemo?: any,
}

export interface GetProductTradingResponse {
  data: GetProductTradings
  status: number
}

export interface GetProductTradings {
  productTradings?: Array<ProductTrading>,
  progresses?: Array<ProductTradingProgress>,
  total?: any,
  initializeInfo?: any,
  fieldInfo?: any,
  lastUpdateDate?: any
}

export interface ProductTradingProgress {
  productTradingProgressId?: any,
  progressName?: any,
  isAvailable?: any,
  progressOrder?: any
}

/**
 * data product trading for save activity
 */
export interface DataProductTrading {
  mode?: any,
  productTradings?: Array<ProductTrading>,
}

export interface CreateActivitiesPayload {
  contactDate?: any,
  activityStartTime?: any,
  activityEndTime?: any,
  activityDuration?: any,
  activityFormatId?: any,
  employeeId?: any,
  businessCardIds?: Array<any>,
  interviewers?: Array<string>,
  customerId?: any,
  dataProductTradings?: Array<DataProductTrading>,
  customerRelationIds?: Array<any>,
  memo?: any,
  taskId?: any,
  scheduleId?: any,
  milestoneId?: any,
  nextSchedule?: any,
  activityData?: any,
}

export interface UpdateActivitiesPayload {
  activityId?: any,
  contactDate?: any,
  activityStartTime?: any,
  activityEndTime?: any,
  activityDuration?: any,
  activityFormatId?: any,
  employeeId?: any,
  businessCardIds?: any,
  interviewers?: Array<string>,
  customerId?: any,
  dataProductTradings?: any,
  mode?: any,
  productTradings?: any,
  customerRelationIds?: any,
  memo?: any,
  taskId?: any,
  scheduleId?: any,
  milestoneId?: any,
  nextSchedule?: any,
  activityData?: any,
}

/**
 * API getActivityLayout
 * @param payload 
 */
export const getActivityLayout = async (
  payload: {}
): Promise<getActivityLayoutResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_ACTIVITY_LAYOUT,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}

/**
 * api create activity
 * @param payload 
 */
export const createActivities = async (
  payload: any,
): Promise<ActivityResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_CREATE_ACTIVITY,
      payload,
      {
        headers: {
          "content-type": "multipart/form-data",
        },
      }
    )
    return response
  } catch (error) {
    return error.response
  }
}

/**
 * api edit activity
 * @param payload 
 */
export const updateActivities = async (
  payload: any,
): Promise<ActivityResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_UPDATE_ACTIVITY,
      payload,
      {
        headers: {
          "content-type": "multipart/form-data",
        },
      }
    )
    return response
  } catch (error) {
    return error.response
  }
}


export interface ProductTradingResponse {
  productSuggestions: Array<ProductSuggestion>,
  status: number
}

export interface ProductSuggestionPayload {
  searchValue: string,
  offset: number,
  customerIds?: Array<any>,
  listIdChoice?: Array<any>,
  relationFieldId?: Array<any>,
}

/**
 * api getProductTradingSuggestions
 * @param payload 
 */
export const getProductTradingSuggestions = async (
  payload: ProductSuggestionPayload
): Promise<ProductTradingResponse> => {
  try {
    const response: ProductTradingResponse = await apiClient.post(
      SERVICES_GET_PRODUCT_TRADING_SUGGESTIONS,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}

/**
 * api getProductSuggestions
 * @param payload 
 */
export const getProductSuggestions = async (
  payload: ProductSuggestionPayload
): Promise<ProductTradingResponse> => {
  try {
    const response: ProductTradingResponse = await apiClient.post(
      SERVICES_GET_PRODUCT_SUGGESTIONS,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}

export interface GetProductTradingsPayload {
  selectedTargetId: number
  isOnlyData: boolean
  searchConditions: Array<SearchCondition>
  isFinish: boolean
}

export interface SearchCondition {
  fieldType: any,
  isDefault: boolean,
  fieldName: string,
  fieldValue: string,
}

/**
 * api getProductTradings
 * @param payload 
 */
export const getProductTradings = async (
  payload: GetProductTradingsPayload
): Promise<GetProductTradingResponse> => {
  try {
    const response: GetProductTradingResponse = await apiClient.post(
      SERVICES_GET_PRODUCT_TRADINGS,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}

/**
 * api create activity draft
 * @param payload 
 */
export const createActivityDraft = async (
  payload: any,
): Promise<ActivityResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_CREATE_ACTIVITY_DRAFT,
      payload,
      {
        headers: {
          ["x-tenantId"]: "common16",
          "content-type": "application/json",
        },
      }
    )
    return response
  } catch (error) {
    return error.response
  }
}

/**
 * api create activity draft
 * @param payload 
 */
export const getActivityDraft = async (
  payload: any,
): Promise<ActivityResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_ACTIVITY_DRAFT,
      payload,
      {
        headers: {
          ["x-tenantId"]: "common16",
          "content-type": "application/json",
        },
      }
    )
    return response
  } catch (error) {
    return error.response
  }
}

export interface getCustomersByIdsResponse {
  data: dataGetCustomersByIds
  status: number
}

export interface dataGetCustomersByIds {
  customers: dataGetCustomerById[]
}

export interface dataGetCustomerById {
  customerId?: number
  customerLogo?: {
    fileName?: any
    filePath?: any
  }
  customerName?: any
  customerAliasName?: any
  customerParent?: {
    customerId?: number
    customerName?: any
  }
  phoneNumber?: any
  customerAddress?: {
    zipCode?: any
    addressName?: any
    buildingName?: any
    address?: any
  }
  businessMain?: {
    value?: any
    label?: any
  }
  businessSub?: {
    value?: any
    label?: any
  }
  url?: any
  memo?: any
  totalTradingAmount?: any
  personInCharge?: {
    employeeId?: number
    groupId?: number
    departmentId?: number
    employeeName?: any
    departmentName?: any
    groupName?: any
  }
  customerData?: extendData[]
}

/**
 * api getCustomersByIds
 * @param payload 
 */
export const getCustomersByIds = async (
  payload: any
): Promise<getCustomersByIdsResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_CUSTOMERS_BY_IDS,
      payload,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    )
    return response
  } catch (error) {
    return error.response
  }
}

export interface getSchedulesByIdsResponse {
  data: dataGetSchedulesById
  status: number
}

export interface dataGetSchedulesById {
  scheduleId?: number
  scheduleType?: {
    scheduleTypeId?: number
    scheduleTypeName?: string
  }
  scheduleName?: string
  startDate?: string
  finishDate?: string
  isFullDay?: boolean
  isRepeated?: boolean
  repeatType?: number
  repeatCycle?: number
  regularDayOfWeek?: string
  regularWeekOfMonth?: string
  regularDayOfMonth?: string
  regularEndOfMonth?: string
  repeatEndType?: number
  repeatEndDate?: boolean
  repeatNumber?: number
  customer?: {
    customerId?: number
    parentCustomerName?: string
    customerName?: string
    customerAddress?: string
  }
  relatedCustomers?: dataRelatedCustomersGetScheduleById[]
  zipCode?: string
  prefecturesId?: number
  prefecturesName?: string
  addressBelowPrefectures?: string
  buildingName?: string
  productTradings?: dataProductTradings[]
  businessCards?: dataBusinessCardsGetScheduleById[]
  participants?: {
    employees?: dataEmployees[]
    departments?: dataDepartments[]
    groups?: dataGroups[]
    allEmployees?: dataEmployees[]
  }
  isAllAttended?: boolean
  sharers?: {
    employees?: dataEmployees[]
    departments?: dataDepartments[]
    groups?: dataGroups[]
    allEmployees?: dataEmployees[]
  }
  equipmentTypeId?: number
  equipments?: dataEquipmentsGetScheduleById[]
  note?: string
  files?: dataFiles[]
  tasks?: dataTasksGetScheduleById[]
  milestones?: dataMilestonesGetScheduleById[]
  isPublic?: boolean
  canModify?: boolean
}

export interface dataRelatedCustomersGetScheduleById {
  customerId?: number
  customerName?: string
}

export interface dataProductTradings {
  productTradingId?: number
  productId?: number
  productTradingName?: string
}

export interface dataBusinessCardsGetScheduleById {
  businessCardId?: number
  businessCardName?: string
}

export interface dataEmployees {
  employeeId?: number
  employeeName?: string
  photoEmployeeImg?: string
  attendanceDivision?: string
  departmentName?: string
  positionName?: string
}

export interface dataDepartments {
  departmentId?: number
  departmentName?: string
  departmentParentName?: string
  photoDepartmentImg?: string
}

export interface dataGroups {
  groupId?: number
  groupName?: string
  photoGroupImg?: string
}

export interface dataEquipmentsGetScheduleById {
  equipmentId?: number
  equipmentName?: string
  startTime?: string
  endTime?: string
}

export interface dataFiles {
  fileId?: number
  filePath?: string
  fileName?: string
}

export interface dataTasksGetScheduleById {
  taskId?: number
  taskName?: string
}

export interface dataMilestonesGetScheduleById {
  milestonesId?: number
  milestonesName?: string
}

export interface extendData {
  fieldType?: number
  key?: string
  value?: string
}

/**
 * api getScheduleByIds
 * @param payload 
 */
export const getScheduleByIds = async (
  payload: any
): Promise<getSchedulesByIdsResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_SCHEDULES_BY_IDS,
      payload,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    )
    return response
  } catch (error) {
    return error.response
  }
}

export interface getTasksByIdsResponse {
  data: dataGetSchedulesById
  status: number
}

export interface dataGetTasksByIds {
  tasks: []
}

export interface dataGetTaskById {
  taskId?: number
  taskData?: extendData[]
  taskName?: string
  memo?: string
  operators?: {
    employees?: dataEmployees[]
    departments?: dataDepartments[]
    groups?: dataGroups[]
  }
  totalEmployees?: dataEmployees[]
  isOperator?: boolean
  countEmployee?: number
  startDate?: string
  finishDate?: string
  parentTaskId?: number
  statusParentTaskId?: number
  customers?: dataCustomers[]
  productTradings?: dataProductTradings
  milestoneId?: number
  milestoneName?: string
  milestoneFinishDate?: string
  milestoneParentCustomerName?: string
  milestoneCustomerName?: string
  files?: dataFiles[]
  statusTaskId?: number
  isPublic?: boolean
  subtasks?: dataSubTasks[]
  registDate?: string
  refixDate?: string
  registPersonNameName?: string
  refixPersonNameName?: string
}

export interface dataCustomers {
  customerId?: number
  parentCustomerName?: string
  customerName?: string
  customerAddress?: string
}

export interface dataSubTasks {
  taskId?: number
  statusTaskId?: number
  taskName?: string
  startDate?: string
  finishDate?: string
  memo?: string
}