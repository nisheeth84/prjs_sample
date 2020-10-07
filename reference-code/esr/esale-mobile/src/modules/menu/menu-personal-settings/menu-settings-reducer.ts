import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  GetEmployeeDataResponse,
  ListLanguagesDataResponse,
  ListTimeZoneDataResponse,
  NotificationSettingDataResponse,
} from "./menu-personal-settings-repository";

export interface MenuSettingState {
  listLanguages: any[];
  listTimeZones: any[];
  dataNotificationSettings: NotificationSettingDataResponse;
  employee: any;
}
export interface DataNotificationSettingsPayload {
  dataNotificationSettings: NotificationSettingDataResponse;
}
export interface ListLanguagesPayload {
  listLanguages: any[];
}
export interface ListTimeZonePayload {
  listTimeZones: any[];
}

export interface EmployeePayload {
  data: any;
}
export interface MenuSettingReducers
  extends SliceCaseReducers<MenuSettingState> {}

const menuSettingSlice = createSlice<MenuSettingState, MenuSettingReducers>({
  name: "setting",
  initialState: {
    dataNotificationSettings: {
      employeeId: 0,
      email: "",
      data: [],
      notificationTime: -1,
    },
    listLanguages: [],
    listTimeZones: [],
    employee: {},
  },
  reducers: {
    getListLanguages(state, { payload }: PayloadAction<ListLanguagesPayload>) {
      state.listLanguages = payload.listLanguages;
    },
    getListTimeZone(state, { payload }: PayloadAction<ListTimeZonePayload>) {
      state.listTimeZones = payload.listTimeZones;
    },
    getNotificationSettings(
      state,
      { payload }: PayloadAction<DataNotificationSettingsPayload>
    ) {
      state.dataNotificationSettings = payload.dataNotificationSettings;
    },
    getEmployee(state, { payload }: PayloadAction<EmployeePayload>) {
      state.employee = payload.data;
    },
  },
});

export const menuSettingActions = menuSettingSlice.actions;
export default menuSettingSlice.reducer;
