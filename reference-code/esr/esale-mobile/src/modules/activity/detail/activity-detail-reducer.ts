import { ActivityDataResponse, Progresses, Scenario, ActivityLayoutDataResponse } from './../activity-repository'
import {
  SliceCaseReducers,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit"

export interface ActivityFormat {
  activityFormatId: number
  name: string
  fieldUse: string
  displayOrder: number
  isAvailable: boolean
}

export interface Employee {
  employeeId: any
  employeeName: any
  employeeSurname: any
  employeePhoto: DataPhoto
}

export type ActivityHistories = {
  activityHistoryId: any
  activityId: any
  updatedDate: any
  updatedUser: UpdatedUserChangeHistories
  contentChange: any
}
export interface UpdatedUserChangeHistories {
  employeeId: any
  employeeName: any
  employeeSurname: any
  employeePhoto: DataPhoto
}
export interface DataPhoto {
  filePath: any
  fileUrl: any
  fileName: any
}

export interface GetActivityHistoryPayload {
  activityHistories: Array<ActivityHistories>
}

export interface BusinessCard {
  businessCardId: any
  customerName: any
  firstName: any
  lastName: any
  firstNameKana: any
  lastNameKana: any
  position: any
  departmentName: any
  businessCardImagePath: any
  businessCardImageName: any
}

export interface ProductTrading {
  productTradingId: any
  customerId: any
  customerName: any
  productId: any
  productName: any
  productImagePath: any
  productImageName: any
  quantity: any
  price: any
  amount: any
  productTradingProgressId: any
  progressName: any
  endPlanDate: any
  orderPlanDate: any
  employee: Employee
  memo: any
  productTradingData: any
}

export interface CustomerRelation {
  customerRelationId: any,
  customerName: any,
  customerPhoto: DataPhoto,
  customerParent: {
    customerId: number
    customerName: string
  },
  customerAddress: {
    address: string
  },
  customerId: number,
  parentCustomerName: string,
  address: string
}

export interface Customer {
  customerId: any,
  customerName: any,
  customerPhoto: DataPhoto,
  parentCustomerName: string,
  address: string
}

export interface Task {
  taskId: any,
  taskName: any,
  finishDate: any,
  milestoneName: string,
  customerParent: {
    customerId: number
    customerName: string
  },
  customerAddress: {
    address: string
  }
}

export interface Schedule {
  scheduleId: any,
  scheduleName: any,
  finishDate: any,
  customer: {
    parentCustomerName: string
    customerName: string
  }
  productTradings: {productTradingName: string}[]
}

export interface Milestone {
  milestoneId: any,
  milestoneName: any,
  endDate: any
}

export interface CreatedUser {
  createdDate: any,
  employeeName: any,
  employeeSurname: any,
  employeePhoto: DataPhoto,
  employeeId: any
}

export interface UpdatedUser {
  updatedDate: any,
  employeeName: any,
  employeeSurname: any,
  employeePhoto: DataPhoto,
  employeeId: any
}

export interface FieldInfoActivity {
  fieldId: any,
  fieldName: any
}

export interface TabInfo {
  tabId: any,
  labelName: any
}

export interface FieldInfoProductTrading {
  fieldId: any,
  fieldName: any
}

export interface FieldInfoSchedule {
  fieldId: any,
  fieldName: any
}

export interface Progress {
  productTradingProgressId: any,
  progressName: any,
  isAvailable: any,
  progressOrder: any
}

export interface Activity {
  activityDraftId?: any
  activityId?: any
  contactDate?: any
  activityStartTime?: any
  activityEndTime?: any
  activityDuration?: any
  activityFormatId?: any
  name?: any
  activityFormats?: Array<ActivityFormat>
  employee?: Employee
  businessCards?: Array<BusinessCard>
  interviewer?: Array<string>
  customer?: Customer
  productTradings?: Array<ProductTrading>
  customerRelations?: Array<CustomerRelation>
  memo?: any
  task?: Task
  schedule?: Schedule
  milestone?: Milestone
  nextSchedule?: Calendar
  createdUser?: CreatedUser
  updatedUser?: UpdatedUser
  activityData?: Array<ActivityData>
}
export interface Calendar {
  scheduleId?: number;
  scheduleName?: string;
  startDate?: any;
  finishDate?: any;
  isFullDay?: boolean;
  isRepeated?: any;
  repeatType?: any;
  repeatCycle?: any;
  regularDayOfWeek?: any;
  regularWeekOfMonth?: any;
  regularDayOfMonth?: any;
  regularEndOfMonth?: any;
  repeatEndType?: any;
  repeatEndDate?: any;
  repeatNumber?: any;
  zipCode?: any;
  iconPath?: any;
  prefecturesId?: any;
  prefecturesName?: any;
  addressBelowPrefectures?: any;
  buildingName?: any;
  isAllAttended?: any;
  equipmentTypeId?: any;
  note?: any;
  isPublic?: any;
  canModify?: any;
  scheduleType?: {
    scheduleTypeId?: any;
    scheduleTypeName?: any;
  };
  isParticipant?: any;
  customer?: customerType;
  relatedCustomers?: RelatedCustomersType[];
  productTradings?: ProductTradingsType[];
  businessCards?: BusinessCardsType[];
  participants?: {
    employees?: EmployeesType[];

    departments?: DepartmentsType[];

    groups?: GroupsType[];
  };
  sharers?: {
    employees?: EmployeesType[];

    departments?: DepartmentsType[];

    groups?: GroupsType[];
  };
  equipments?: EquipmentsType[];
  files?: FilesType[];
  tasks?: TasksType[];
  milestones?: MilestonesType[];
  scheduleHistories?: ScheduleHistoriesType[];
  employeeLoginId?: any;
  updatedDate?: any;
  scheduleTypeId?: any;
}
export type ScheduleHistoriesType = {
  updatedDate?: any;
  updatedUserId?: number;
  updatedUserName?: string;
  updatedUserImage?: any;
  contentChange?: any;
};
export type MilestonesType = {
  milestonesId?: any;
  milestoneName?: any;
  time?: any;
  startDate?: any;
  endDate?: any;
};
export type TasksType = {
  taskId?: any;
  taskName?: any;
  endDate?: any;
  time?: any;
};
export type FilesType = {
  fileData?: any;
  fileName?: any;
};
export type EquipmentsType = {
  equipmentId?: any;
  equipmentName?: any;
  startTime?: any;
  endTime?: any;
};
export type GroupsType = {
  groupId?: any;
  groupName?: any;
};
export type DepartmentsType = {
  departmentId?: any;
  departmentName?: any;
};
export type EmployeesType = {
  employeeId?: any;
  employeeName?: any;
  photoEmployeeImg?: string;
  status?: number;
};
type BusinessCardsType = {
  businessCardId?: any;
  businessCardName?: any;
};
type ProductTradingsType = {
  productTradingId?: any;
  productTradingName?: any;
  customerId?: any;
};
interface RelatedCustomersType {
  customerId?: number;
  customerName?: string;
}
export type customerType = {
  customerId?: any;
  parentCustomerName?: any;
  customerName?: any;
  customerAddress?: any;
};
export interface ActivityData {
  fieldType: any;
  key: string;
  value: string;
}

export interface Interviewer {
  interviewer: any,
}

export interface ActivityDetailState {
  activityId: number
  activities: Activity
  fieldInfoActivity: Array<FieldInfo>
  fieldInfoProductTrading: Array<FieldInfo>
  tabInfo: Array<any>
  progresses: Array<Progresses>
  scenario: Scenario
  activityHistories: Array<ActivityHistories>
  dataInfo: ActivityLayoutDataInfo
  status: any
  messages: any
}
interface Messages {
  type?: any,
  content?: string,
  isShow?: any
}
/**
 * Get Type Messages
 */
export interface GetTypeMessages {
  messages: Messages
}
/**
 * data info activity layout
 */
export interface ActivityLayoutDataInfo {
  employeeName: any
  employeeSurname: any
  activitiesFormats: Array<ActivityFormat>
}

/**
 * Field info interface
 */
export interface FieldInfo {
  availableFlag: number,
  fieldId: number
  fieldName: string
  fieldLabel: string
  fieldType: number
  fieldOrder: number
  isDefault: number
  fieldItems: FieldItemsType[]
  modifyFlag: number
  typeUnit: number
  currencyUnit: string
}

export interface FieldItemsType {
  itemId?: any
  isAvailable?: any
  itemOrder?: any
  isDefault?: any
  itemLabel?: any
}

export interface ActivityIdPayload {
  activityId: number;
}

export interface ActivityDetailReducers extends SliceCaseReducers<ActivityDetailState> { }

const activityDetailSlice = createSlice<ActivityDetailState, ActivityDetailReducers>({
  name: 'activityDetail',
  initialState: {
    activityId: 0,
    activities: {},
    dataInfo: {
      employeeName: null,
      employeeSurname: null,
      activitiesFormats: []
    },
    fieldInfoActivity: [],
    activityHistories: [],
    progresses: [],
    scenario: {
      milestones: []
    },
    fieldInfoProductTrading: [],
    tabInfo: [],
    status: "pending",
    messages: {}
  },
  reducers: {
    setActivityId(state, { payload }: PayloadAction<ActivityIdPayload>) {
      state.activityId = payload.activityId
    },
    getActivity(state, { payload }: PayloadAction<ActivityDataResponse>) {
      state.activities = payload.activities
      state.fieldInfoActivity = payload.fieldInfoActivity
      state.fieldInfoProductTrading = payload.fieldInfoProductTrading
      state.tabInfo = payload.tabInfo
      state.progresses = payload.progresses
      state.scenario = payload.scenario
      state.status = "success"
    },
    getActivityLayout(state, { payload }: PayloadAction<ActivityLayoutDataResponse>) {
      state.dataInfo = payload.dataInfo
      state.fieldInfoActivity = payload.fieldInfoActivity
      state.fieldInfoProductTrading = payload.fieldInfoProductTrading
      state.progresses = payload.progresses
      state.status = "success"
    },
    getActivityHistory(state, { payload }: PayloadAction<GetActivityHistoryPayload>) {
      state.activityHistories = payload.activityHistories
    },
    setMessages(
      state,
      { payload }: PayloadAction<GetTypeMessages>
    ) {
      state.messages = payload.messages
    }
  },
})

export const activityDetailActions = activityDetailSlice.actions
export default activityDetailSlice.reducer
