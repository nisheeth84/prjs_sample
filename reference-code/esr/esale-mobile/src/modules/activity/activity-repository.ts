import { AxiosRequestConfig } from "axios"
import { apiClient } from "../../config/clients/api-client"
import {
  SERVICES_DELETE_ACTIVITIES,
  SERVICES_GET_CHANGE_HISTORIES,
  SERVICES_GET_ACTIVITY,
  SERVICES_GET_ACTIVITIES,
  SERVICES_GET_SCENARIO,
  SERVICES_GET_ACTIVITY_DRAFT,
  SERVICES_DELETE_ACTIVITY_DRAFT,
  SERVICES_GET_ACTIVITY_DRAFTS,
} from "../../config/constants/api"
import { ActivityHistories, FieldInfo, ActivityLayoutDataInfo, Calendar } from "./detail/activity-detail-reducer"
import { Customers, BusinessCards, ProductTradings } from "./drawer/drawer-left-activity-reducer"
import { EmployeePhoto } from "./list/activity-list-reducer"

export interface ActivityResponse {
  data: ActivityDataResponse
  status: number
}

export interface ActivityDataResponse {
  activities: Activity
  fieldInfoActivity: Array<FieldInfo>
  tabInfo: Array<any>
  fieldInfoProductTrading: Array<FieldInfo>
  progresses: Array<Progresses>
  scenario: Scenario
}
export interface ActivityLayoutResponse {
  data: ActivityLayoutDataResponse
  status: number
}
export interface ActivityLayoutDataResponse {
  dataInfo: ActivityLayoutDataInfo
  fieldInfoActivity: Array<FieldInfo>
  fieldInfoProductTrading: Array<FieldInfo>
  progresses: Array<Progresses>
}
export interface Scenario {
  milestones: Array<MilestonesScenario>
}
export interface MilestonesScenario {
  milestoneId: number
  statusMilestoneId: number
  milestoneName: any
  finishDate: any
  memo: any
  isDone: number
  tasks: Array<TasksScenario>
}
export interface TasksScenario {
  taskId: number
  taskName: any
  memo: any
  employees: Array<EmployeeScenario>
  startDate: any
  finishDate: any
  statusTaskId: any
  subtasks: Array<SubtaskScenario>
}
export interface SubtaskScenario {
  taskId: number
  taskName: any
  memo: any
  employees: Array<EmployeeScenario>
  startDate: any
  finishDate: any
  subtasks: Array<any>
}
export interface EmployeeScenario {
  employeeId: number
  employeeName: any
  photoEmployeeImg: any

}
export interface Progresses {
  productTradingProgressId: number
  progressName: any
  bookedOrderType: number
  isEnd: boolean
  isAvailable: boolean
  progressOrder: number
}
export interface TabInfo {
  tabId: number
  labelName: any
}

export interface DeleteActivityResponse {
  data: DeleteActivityDataResponse
  status: number
}
export interface DeleteActivityDataResponse {
  activityIds: Array<number>
}

export interface GetActivityPayload {
  activityId?: any
  activityDraftId?: any
  isOnlyData?: boolean
  mode?: any
  hasTimeline?: boolean
}

export interface DeleteActivityPayload {
  activityIds: Array<number>
}

export const getActivity = async (
  payload: GetActivityPayload,
): Promise<ActivityResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_ACTIVITY,
      payload
    )
    return response
  } catch (error) {
    return error.response

  }
}

export interface CustomersResponse {
  data: DataCustomersResponse
  status: number
}

export interface DataCustomersResponse {
  data: DataGetCustomersResponse
}

export interface DataGetCustomersResponse {
  getCustomers: Customers
}

export interface GetCustomersPayload {
  query: string
}

export const getCustomers = async (
  payload: GetCustomersPayload,
  config?: AxiosRequestConfig
): Promise<CustomersResponse> => {
  try {
    const response = await apiClient.post(
      "",
      payload,
      config
    )
    return response
  } catch (error) {
    return error.response
  }
}

export interface BusinessCardsResponse {
  data: DataBusinessCardsResponse
  status: number
}

export interface DataBusinessCardsResponse {
  data: DataGetBusinessCardsResponse
}

export interface DataGetBusinessCardsResponse {
  getBusinessCards: BusinessCards
}


export interface ProductTradingsResponse {
  data: ProductTradings
  status: number
}

export interface ChangeHistoriesResponse {
  data: DataChangeHistoriesResponse
  status: number
}
export interface DataChangeHistoriesResponse {
  activityHistories : Array<ActivityHistories>
}

export interface GetChangeHistoriesPayload {
  activityId: number
  offset: number
  limit: number
}

export const getChangeHistories = async (
  payload: GetChangeHistoriesPayload
): Promise<ChangeHistoriesResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_CHANGE_HISTORIES,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}

export interface SearchConditionsActivities {
  fieldType: number
  isDefault: boolean
  fieldName: any
  fieldValue: any
  searchType: number
  searchOption: number
}
export interface FilterConditionsActivities {
  fieldType: number
  fieldName: any
  filterType: any
  searchType: number
  filterOption: number
  fieldValue: any
}
export interface ActivitiesResponse {
  data: DataActivitiesResponse
  status: number
}
export interface getActivitiesPayload {
  listBusinessCardId: Array<number>
  listCustomerId: Array<number>
  searchLocal: any
  searchConditions: SearchConditionsActivities
  filterConditions :Array<FilterConditionsActivities>
  isFirstLoad: boolean
  selectedTargetType: number
  selectedTargetId: number
  orderBy: Array<any>
  offset: number
  limit: number
  hasTimeline: number
}
export interface DataActivitiesResponse {
  activities : Array<Activity>
}
export interface DataInfo {
  activities : Activity
}
export interface Activity {
  activityId : number
  activityDraftId: number
  contactDate: any
  activityStartTime: any
  activityEndTime: any
  activityDuration: any
  employee: Employee
  businessCards: Array<BusinessCardsActivities>
  interviewer: Array<string>
  customer: CustomerRelationsActivities
  productTradings: Array<ProductTradingsActivities>
  customersRelations: Array<CustomerRelationsActivities>
  memo: any
  createdUser: CreatedUserActivities
  updatedUser: UpdatedUserActivities
  extTimeline: any
  task: Task
  schedule: Schedule
  milestone: Milestone
  nextSchedule: Calendar
}
export interface Milestone {
  milestoneId: boolean
  milestoneName : number
}
export interface Schedule {
  scheduleId: boolean
  scheduleName : number
}
export interface Task {
  taskId: boolean
  taskName : number
}
export interface Employee {
  employeeName : number
  employeeSurname: number
  employeeId: boolean
  employeePhoto: EmployeePhoto
}
export interface BusinessCardsActivities {
  businessCardId : number
  firstName: any
  lastName: any
  firstNameKana: any
  lastNameKana: any
  position: any
  departmentName: any
}
export interface CustomerRelationsActivities {
  customerRelationId : number
  customerName: any
}
export interface ProductTradingsActivities {
  productTradingId : number
  productId: number
  productName : number
  quantity: any
  price : any
  amount: any
  productTradingProgressId : number
  progressName: any
  endPlanDate : any
  orderPlanDate: any
  employee : Employee
  memo: any
}
export interface CreatedUserActivities {
  createdDate : any
  employeeId: number
  employeeName:any
  employeeSurname: any
  employeePhoto: EmployeePhoto
}
export interface UpdatedUserActivities {
  updatedDate : any
  employeeId: number
  employeeName:any
  employeeSurname: any
  employeePhoto: EmployeePhoto
}

export interface ScenarioPayload {
  customerId: number
}

export interface ScenarioResponse {
  scenario: Scenario
  status: number
}

export const getScenario = async (
  payload: ScenarioPayload
): Promise<ScenarioResponse> => {
  try {
    const response: ScenarioResponse = await apiClient.post(
      SERVICES_GET_SCENARIO,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}

export interface GetActivitiesParams {
  searchConditions?: Array<SearchConditionsActivities>
  filterConditions?: Array<FilterConditionsActivities>
  selectedTargetType?: number
  selectedTargetId?: number
  listProductTradingId?: Array<number>
  listBusinessCardId?: Array<number>
  listCustomerId?: Array<number>
  limit?: number
  orderBy?: Array<any>
  offset?: any
  isDraft?: boolean
}

export const getActivities = async (payload: GetActivitiesParams) => {
  const defaultParams = {
    searchConditions: [],
    filterConditions: [],
    selectedTargetType: 0,
    selectedTargetId: 0,
    limit: 30,
    offset: 0
  };

  try {
    const response = await apiClient.post(SERVICES_GET_ACTIVITIES, { ...defaultParams, ...payload });
    return response;
  } catch (error) {
    return error.response;
  }
}

export interface DeleteActivitiesResponse {
  data: DeleteActivityDataResponse
  status: number
}

export const deleteActivities = async (
  payload: DeleteActivityPayload,
): Promise<DeleteActivitiesResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_DELETE_ACTIVITIES,
      payload
    )
    return response
  } catch (error) {
    return error.response
  }
}
export interface getListActivitiesDraftPayload {
  filterConditions?: Array<number>
  orderBy?: Array<any>,
  limit?: any,
  offset?: any
}
export const getActivityDrafts = async (
  payload: getListActivitiesDraftPayload,
) : Promise<ActivitiesResponse> => {
  const defaultParams = {
    filterConditions: [],
    orderBy: []
  };
  try {
    const response = await apiClient.post(
      SERVICES_GET_ACTIVITY_DRAFTS,
      { ...defaultParams, ...payload },
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
export interface getActivityDraftPayload {
  activityDraftId: number
}
export const getActivityDraft = async (
  payload: getActivityDraftPayload,
) : Promise<ActivityResponse> => {
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
export interface DeleteActivityDraftPayload {
  activityDraftId: number
}

export interface DeleteActivitiesDraftResponse {
  data: DeleteActivityDraftDataResponse
  status: number
}
export interface DeleteActivityDraftDataResponse {
  activityDraftId: number
}
export const deleteActivityDraft = async (
  payload: DeleteActivityDraftPayload,
): Promise<DeleteActivitiesDraftResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_DELETE_ACTIVITY_DRAFT,
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