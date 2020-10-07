import { SliceCaseReducers, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { GetUserTimelinesDataDataResponse } from "../../timeline/timeline-repository"

export interface Employee {
  employeeId: number
  employeeName: string
  employeeSurname: string
  employeePhoto: EmployeePhoto
}

export interface EmployeePhoto {
  filePath: string
  fileName: string
  fileUrl: string
}

export interface Customer {
  customerId: number
  customerName: string
}

export interface CreatedUserInfo {
  createdUserId: number
  createdDate: string
  createdUserName: string
}

export interface UpdateUserInfo {
  updatedUserId: number
  updatedUserName: string
  updatedDate: string
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

export interface CreatedUser {
  createdUserId: number
  createdDate: string
  createdUserName: string
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

export interface ProductTradingSchedule {
  productTradingName: string
}

export interface NextSchedule {
  nextScheduleDate: string
  nextScheduleId: number
  nextScheduleName: string
  iconPath: string
  customerName: string
  productTradings: Array<ProductTradingSchedule>
}

export type DataNextSchedule = {
  customers: Array<Customer>
  productTradings: Array<ProductTrading>
  itemName: string
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
  extTimeline: Array<GetUserTimelinesDataDataResponse>
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
export interface ActivityState {
  listActivity: {
    activities: Array<Activity>,
    total: number
  }
  conditionSearch: ConditionSearch
  status: number,
  customerNavigationList: Array<number>
}

export interface UpdateActivityPayload {
  position: number
  connection: Activity
}

export interface AddActivityPayload {
  activity: Activity
}

export interface DeleteActivityPayload {
  position: number
}

export interface GetAllActivityPayload {
  activities: Array<Activity>
}
export interface ConditionSearch {
  titleActivityList: any,
  searchLocal: any,
  selectedTargetType: any,
  selectedTargetId: any,
  listCustomerId: Array<number>,
  listBusinessCardId: Array<number>,
  listProductTradingId: Array<number>
}

export interface ConditionSearchPayload {
  conditionSearch: ConditionSearch
}

export interface ActivityReducers extends SliceCaseReducers<ActivityState> {}
const activitySlice = createSlice<ActivityState, ActivityReducers>({
  name: "activities",
  initialState: {
    listActivity: {
      activities: [],
      total: 0
    },
    conditionSearch: {
      titleActivityList: 'activities',
      searchLocal: null,
      selectedTargetType: null,
      selectedTargetId: 0,
      listCustomerId: [],
      listBusinessCardId: [],
      listProductTradingId: []
    },
    status: 200,
    customerNavigationList: []
  },
  reducers: {
    // get data activities
    getActivities(state, { payload }: PayloadAction<GetAllActivityPayload>) {
      state.listActivity = {...state.listActivity, ...payload}
      state.status = 200
    },
    update(state, { payload }: PayloadAction<UpdateActivityPayload>) {
      const newList = state.listActivity.activities
      newList[payload.position] = payload.connection
      state.listActivity.activities = newList
    },
    add(state, { payload }: PayloadAction<AddActivityPayload>) {
      const newList = state.listActivity.activities
      newList.push(payload.activity)
      state.listActivity.activities = newList
    },
    delete(state, { payload }: PayloadAction<DeleteActivityPayload>) {
      state.listActivity.activities = state.listActivity.activities.filter(
        (_, index) => index !== payload.position
      )
    },
    updateConditionSearch(state, { payload }: PayloadAction<ConditionSearchPayload>) {
      state.conditionSearch = payload.conditionSearch
    },
    addCustomerIdNavigation(state, { payload }: PayloadAction<number>) {
      state.customerNavigationList.push(payload);
    }
  },
})

export const activityActions = activitySlice.actions
export default activitySlice.reducer
