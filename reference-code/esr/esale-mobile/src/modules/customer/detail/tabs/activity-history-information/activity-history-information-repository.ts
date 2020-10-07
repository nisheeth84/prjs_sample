import { apiClient } from "../../../../../config/clients/api-client";
import { SERVICES_GET_ACTIVITIES, SERVICES_DELETE_ACTIVITIES } from "../../../../../config/constants/api";

export interface Customer {
  customerId: number
  customerName: string
}

export interface GetActivity {
  activities: Array<Activity>,
  total: number
}

export interface Activity {
  activityId: number
  activityDraftId: any
  contactDate: string
  activityStartTime: string
  activityEndTime: string
  activityDuration: number
  employee: Employee
  businessCards: Array<BusinessCard>
  interviewers: Array<any>
  customer: Customer
  productTradings: Array<ProductTrading>
  customers: Array<Customer>
  memo: string
  createdUser: {
    createdUserId: number
    createdDate: string
    createdUserName: string
    createdUserPhoto: any
  }
  updatedUser: {
    updatedUserId: number
    updatedUserName: string
    updatedDate: string
    updatedUserPhoto: any
  },
  extTimeline: any
  task: Task
  schedule: Schedule
  milestone: Milestone
  nextSchedule: NextSchedule
  initializeInfo: any
  total: number
}

export interface Calendar {
  scheduleId?: number
  scheduleName?: string
  startDate?: any
  finishDate?: any
  isFullDay?: boolean
  isRepeated?: any
  repeatType?: any
  repeatCycle?: any
  regularDayOfWeek?: any
  regularWeekOfMonth?: any
  regularDayOfMonth?: any
  regularEndOfMonth?: any
  repeatEndType?: any
  repeatEndDate?: any
  repeatNumber?: any
  zipCode?: any
  prefecturesId?: any
  prefecturesName?: any
  addressBelowPrefectures?: any
  buildingName?: any
  isAllAttended?: any
  equipmentTypeId?: any
  note?: any
  isPublic?: any
  iconPath?:any
  canModify?: any
  scheduleType?: {
    scheduleTypeId?: any
    scheduleTypeName?: any
  }
  isParticipant?: any
  customer?: customerType
  relatedCustomers?: RelatedCustomersType[]
  productTradings?: ProductTradingsType[]
  businessCards?: BusinessCardsType[]
  participants?: {
    employees?: EmployeesType[]

    departments?: DepartmentsType[]

    groups?: GroupsType[]
  }
  sharers?: {
    employees?: EmployeesType[]

    departments?: DepartmentsType[]

    groups?: GroupsType[]
  }
  equipments?: EquipmentsType[]
  files?: FilesType[]
  tasks?: TasksType[]
  milestones?: MilestonesType[]
  scheduleHistories?: ScheduleHistoriesType[]
  employeeLoginId?: any
  updatedDate?: any
  scheduleTypeId?: any
}
export type customerType = {
  customerId?: any
  parentCustomerName?: any
  customerName?: any
  customerAddress?: any
}
interface RelatedCustomersType {
  customerId?: number
  customerName?: string
}
type ProductTradingsType = {
  productTradingId?: any
  producTradingName?: any
  customerId?: any
}
type BusinessCardsType = {
  businessCardId?: any
  businessCardName?: any
}
export type EmployeesType = {
  employeeId?: any
  employeeName?: any
  photoEmployeeImg?: string
  status?: number
}
export type DepartmentsType = {
  departmentId?: any
  departmentName?: any
}
export type GroupsType = {
  groupId?: any
  groupName?: any
}
export type TasksType = {
  taskId?: any
  taskName?: any
  endDate?: any
  time?: any
}
export type FilesType = {
  fileData?: any
  fileName?: any
}
export type ScheduleHistoriesType = {
  updatedDate?: any
  updatedUserId?: number
  updatedUserName?: string
  updatedUserImage?: any
  contentChange?: any
}
export type MilestonesType = {
  milestonesId?: any
  milestoneName?: any
  time?: any
  startDate?: any
  endDate?: any
}
export type EquipmentsType = {
  equipmentId?: any
  equipmentName?: any
  startTime?: any
  endTime?: any
}
export interface NextSchedule {
  nextScheduleDate: string
  nextScheduleId: number
  nextScheduleName: string
  iconPath: string
  customerName: string
  productTradings: Array<ProductTradingSchedule>
}
export interface ProductTradingSchedule {
  productTradingName: string
}
export interface Task {
  taskId: number
  taskName: string
}
export interface Schedule {
  scheduleId: number
  scheduleName: string
}
export interface Milestone {
  milestoneId: number
  milestoneName: string
}
export interface EmployeePhoto {
  filePath: string
  fileName: string
}
export interface Employee {
  employeeId: number
  employeeName: string
  employeeSurname: string
  employeePhoto: EmployeePhoto
}
export interface BusinessCard {
  customerName: string
  businessCardId: number
  firstName: string
  lastName: string
  firstNameKana: string
  lastNameKana: string
  position: any
  departmentName: string
  businessCardImagePath: string
  businessCardImageName: string
}
export interface ProductTrading {
  productTradingId: number
  customerName: string
  productId: number
  productName: string
  productImagePath: string
  productImageName: string
  quantity: number
  price: number
  amount: number
  productTradingProgressId: number
  progressName: string
  endPlanDate: string
  orderPlanDate: string
  employee: Employee	
  memo: string
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

export interface GetActivityPayload {
  searchConditions?: Array<SearchConditionsActivities>
  filterConditions?: Array<FilterConditionsActivities>
  selectedTargetType?: number
  selectedTargetId?: number
  listCustomerId?: Array<number>
  offset?: number
  limit?: number
}

export interface GetActivityResponse {
  data: GetActivity;
  status: number;
}

export interface DeleteActivityResponse {
  data: any;
  status: number;
}

export interface ActivityHistoryInformationPayload {
  query: string;
}

export interface DeleteActivityDataResponse {
  activityIds: Array<number>
}

export interface DeleteActivitiesResponse {
  data: DeleteActivityDataResponse
  status: number
}

export interface DeleteActivityPayload {
  activityIds: Array<number>
}

export const deleteActivities = async (
  payload: DeleteActivityPayload
): Promise<DeleteActivitiesResponse> => {
  try {
    const ressponse = await apiClient.post(
      SERVICES_DELETE_ACTIVITIES, payload);

    return ressponse;
  } catch (error) {
    return error.ressponse;
  }
}

// call api to get Activitys
export const getActivityHistoryInformation = async (
  payload: GetActivityPayload
): Promise<GetActivityResponse> => {
  try {
    const response = await apiClient.post(
      SERVICES_GET_ACTIVITIES, 
      payload
    );
    return response;
  } catch (error) {
    return error.response
  }
};