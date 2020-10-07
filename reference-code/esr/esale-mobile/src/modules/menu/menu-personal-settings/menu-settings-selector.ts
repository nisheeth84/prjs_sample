import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { MenuSettingState } from "./menu-settings-reducer";

export const ListLanguagesSelector = createSelector(
  (state: RootState) => state.setting,
  (listLanguages: MenuSettingState) => listLanguages.listLanguages
);
export const ListTimeZoneSelector = createSelector(
  (state: RootState) => state.setting,
  (listTimeZone: MenuSettingState) => listTimeZone.listTimeZones
);
export const EmployeeSelector = createSelector(
  (state: RootState) => state.setting,
  (employee: MenuSettingState) => employee.employee
);
export const NotificationSettingsSelector = createSelector(
  (state: RootState) => state.setting,
  (dataNotificationSettings: MenuSettingState) =>
    dataNotificationSettings.dataNotificationSettings
);
