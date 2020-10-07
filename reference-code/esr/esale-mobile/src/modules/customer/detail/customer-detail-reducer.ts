import { SliceCaseReducers, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CustomerDetail,
  TaskItemData,
  ScheduleItemData,
  TradingProductItemData,
  ContactHistoryItemData,
  ExtendSchedules,
  TabsInfoData,
  MilestoneData
} from "./customer-detail-repository";

const initCustomerDetail = {
  customer: {
    customerId: 0,
    customerLogo: {
      photoFileName: "",
      photoFilePath: ""
    },
    parentName: "",
    parentId: 0,
    customerName: "",
    customerAliasName: "",
    phoneNumber: "",
    zipCode: "",
    building: "",
    address: "",
    url: "",
    businessMainId: 0,
    businessMainName: "",
    businessSubId: 0,
    businessSubName: "",
    employeeId: 0,
    departmentId: 0,
    memo: "",
    createdDate: "",
    createdUser: {
      employeeId: 0,
      employeeName: "",
      employeePhoto: "",
    },
    updatedDate: "",
    updatedUser: {
      employeeId: 0,
      employeeName: "",
      employeePhoto: "",
    },
    customerData: [],
    personInCharge: {
      employeeId: 0,
      employeeName: "",
      employeePhoto: "",
      departmentId: 0,
      departmentName: "",
      groupId: 0,
      groupName: "",
    },
    nextSchedules: [],
    nextActions: [],
  },
  dataWatchs: {},
  fields: [],
  tabsInfo: [],
  dataTabs: [],
};

export interface CustomerDetailState {
  detail: CustomerDetail;
  status: string;
  tabInfo: Array<TabsInfoData>;
  activityHistoryList: Array<any>;
  tradingProducts: Array<TradingProductItemData>;
  schedules: Array<ScheduleItemData>;
  tasks:  Array<any>;
  extendSchedules: Array<ExtendSchedules>;
  scenarios: {
    milestones: Array<MilestoneData>
  },
  isFollow: boolean;
  badges: {
    task: number;
    calendar: number;
    tradingProduct: number;
    mail: number;
  }
  customerId: number;
  childCustomersList: Array<any>;
  customerNavigationList: Array<number>;
}

export interface GetCustomerDetailPayload {
  detail: CustomerDetail;
}

export interface ScenarioPayload {
  milestones: Array<MilestoneData>;
}

export interface GetTabInfoPayload {
  tabInfo: Array<TabsInfoData>;
}

export interface GetTasksPayload {
  taskBadge?: number;
  tasks:  Array<any>;
}

export interface GetSchedulesPayload {
  schedules: Array<ScheduleItemData>;
}

export interface GetTradingProductPayload {
  productTradingBadge: number;
  productTradings: Array<TradingProductItemData>;
}

export interface GetContactHistoryListPayload {
  contactHistoryList: Array<ContactHistoryItemData>;
}

export interface DeleteCustomerPayload {
  position: number;
}

export interface UpdateTaskPayload {
  position: number;
  connection: TaskItemData;
}

export interface updateExtendPayload {
  position: number
}

export interface setFollowPayload {
  isFollow: boolean;
}

export interface CustomerDetailReducer extends  SliceCaseReducers<CustomerDetailState> {}

const customerDetailSlice = createSlice<CustomerDetailState, CustomerDetailReducer>({
  name: "customerDetail",
  initialState: {
    detail: initCustomerDetail,
    status: "pending",
    tabInfo: [],
    tasks: [],
    tradingProducts: [],
    schedules: [],
    activityHistoryList: [],
    extendSchedules: [],
    isFollow: false,
    badges: {
      task: 0,
      calendar: 0,
      tradingProduct: 0,
      mail: 0,
    },
    customerId: 0,
    childCustomersList: [],
    customerNavigationList: [],
    scenarios: {
      milestones: []
    }
  },
  reducers: {
    setChildCustomersList(state, { payload }: PayloadAction<Array<any>>) {
      state.childCustomersList = payload;
    },
    getCustomerDetail(state, { payload }: PayloadAction<GetCustomerDetailPayload>) {
      state.detail = payload.detail;
      state.status = "success";
    },
    getTabInfo(state, {payload}: PayloadAction<GetTabInfoPayload>) {
      state.tabInfo = payload.tabInfo;
    },
    getActivityHistoryList(state, { payload }: PayloadAction<GetActivityHistoryListPayload>) {
      state.activityHistoryList = payload.activityHistoryList;
    },
    getTradingProducts(state, { payload }: PayloadAction<GetTradingProductPayload>) {
      state.tradingProducts = payload.productTradings;
    },
    getSchedules(state, { payload }: PayloadAction<GetSchedulesPayload>) {
      state.schedules = payload.schedules;
    },
    getTasks(state, { payload }: PayloadAction<GetTasksPayload>) {
      state.tasks = payload.tasks;
    },
    setExtendSchedule(state, { payload }: PayloadAction<GetSchedulesPayload>) {
      state.extendSchedules = payload.schedules.map((item) => {
        return {
          scheduleId: item.scheduleId,
          extend: false
        }
      })
    },
    setScenarios(state, { payload }: PayloadAction<ScenarioPayload>) {
      state.scenarios = payload
    },
    initFollowOrNot(state, { payload }: PayloadAction<GetCustomerDetailPayload>) {
      let watchs = payload.detail.dataWatchs.data;
      if (watchs) {
        watchs.watch.forEach((item) => {
          if(item.watchTargetId === payload.detail.customer.customerId) {
            state.isFollow = true;
          }
        })
      }
    },
    setFollowOrNot(state, { payload }: PayloadAction<setFollowPayload>) {
      state.isFollow = payload.isFollow;
    },
    handleScheduleExtend(state, { payload }: PayloadAction<updateExtendPayload>) {
      let temp = state.extendSchedules[payload.position];
      temp.extend = !temp.extend;
      state.extendSchedules[payload.position] = temp;
    },
    setTaskBadges(state, { payload }: PayloadAction<number>) {
      state.badges.task = payload;
    },
    setTradingProductBadges(state, { payload }: PayloadAction<number>) {
      state.badges.tradingProduct = payload;
    },
    setCustomerId(state, { payload }: PayloadAction<number>) {
      state.customerId = payload;
    },
    addCustomerIdNavigation(state, { payload }: PayloadAction<number>) {
      state.customerNavigationList.push(payload);
    },
    removeCustomerIdNavigation(state, { payload }: PayloadAction<number>) {
      state.customerNavigationList = state.customerNavigationList.filter(item => item !== payload);
    },
  }
})

export const customerDetailActions = customerDetailSlice.actions;

export default customerDetailSlice.reducer;
