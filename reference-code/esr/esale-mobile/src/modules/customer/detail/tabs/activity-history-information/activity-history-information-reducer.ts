import { SliceCaseReducers, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Activity, GetActivity } from "./activity-history-information-repository";
import { MessageType } from "../../enum";

export interface GetActivityParam {
  selectedTargetId: number;
  selectedTargetType: number;
  searchConditions: any;
  filterConditions: any;
  listCustomerId: any;
  offset: number;
  limit: number;
}

export interface ActivityHistoryInformationState {
  activityList: GetActivity,
  isSuccess: boolean;
  isModalDeleteConfirmDialog: boolean;
  activityId: number;
  responseCustomerDetailTab: any;
  isMessage: number;
  activityParam: GetActivityParam;
  statusLoadmore: string;
}

export interface GetActivitysPayload {
  activityList: Array<Activity>
}

export interface setIsSuccessPayload {
  isSuccess: boolean;
}

export interface setActivityIdPayload {
  activityId: number;
}

export interface StatusIsModalDeleteConfirmDialog {
  isModalVisible: boolean;
}

export interface DeleteActivityPayload {
  activityId: number;
}

export interface GetResponseCustomerDetailTabPayload {
  responseCustomerDetailTab:  any;
}

export interface SetIsShowMessagePayload {
  isMessage:  number;
}

export interface GetStatusLoadmorePayload {
  statusLoadmore:  string;
}

export interface ActivityHistoryInformationReducer extends  SliceCaseReducers<ActivityHistoryInformationState> {}

const activityHistoryInformationSlice = createSlice<ActivityHistoryInformationState, ActivityHistoryInformationReducer>({
  name: "activityHistoryInformation",
  initialState: {
    activityList: {
      activities: [],
      total: 0
    },
    isSuccess: true,
    isModalDeleteConfirmDialog: false,
    activityId: 0,
    responseCustomerDetailTab: "",
    isMessage: MessageType.DEFAULT,
    activityParam: {
      searchConditions: [],
      filterConditions: [],
      listCustomerId: [],
      selectedTargetType: 0,
      selectedTargetId: 0,
      offset: 0,
      limit:20,
    },
    statusLoadmore: "default",
  },
  reducers: {
    getActivities(state, { payload }: PayloadAction<GetActivity>) {
      console.log("getActivities111111111111 state.statusLoadmore",state.statusLoadmore);
      if (state.statusLoadmore === "appending") {
        state.activityList.activities = {...state.activityList.activities, ...payload.activities}
      } else {
        state.activityList = payload;
      }
      console.log("getActivities111111111111 state.activityList.activities",state.activityList);
      state.statusLoadmore = "default";
    },
    getStatusLoadmore(state, { payload }: PayloadAction<GetStatusLoadmorePayload>) {
      
      state.statusLoadmore = payload.statusLoadmore;
    },
    handleSetIsSuccess(state, { payload }: PayloadAction<setIsSuccessPayload>) {
      state.isSuccess = payload.isSuccess;
    },
    handleSetActivityId(state, { payload }: PayloadAction<setActivityIdPayload>) {
      state.activityId = payload.activityId;
    },
    handleIsDeleteConfirmDialog(state, { payload }: PayloadAction<StatusIsModalDeleteConfirmDialog>) {
      state.isModalDeleteConfirmDialog = payload.isModalVisible;
    },
    getResponseCustomerDetailTab(state, { payload }: PayloadAction<GetResponseCustomerDetailTabPayload>) {
      state.responseCustomerDetailTab = payload.responseCustomerDetailTab;
    },
    handleSetIsShowMessage(state, { payload }: PayloadAction<SetIsShowMessagePayload>) {
      state.isMessage = payload.isMessage
    },

    setParamCustomers(state, { payload }: PayloadAction<GetActivityParam>) {
      state.activityParam = payload;
    },
  }
})

export const activityHistoryInformationActions = activityHistoryInformationSlice.actions;
export default activityHistoryInformationSlice.reducer;