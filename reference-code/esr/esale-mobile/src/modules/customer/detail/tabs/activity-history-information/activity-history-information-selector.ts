import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../../../reducers";
import { ActivityHistoryInformationState } from "./activity-history-information-reducer";

export const getActivitiesSelector = createSelector(
  (state: RootState) => state.activityHistoryInformation,
  (activities: ActivityHistoryInformationState) => activities.activityList
);

export const statusDeleteConfirmDialogSelector = createSelector(
  (state: RootState) => state.activityHistoryInformation,
  (statusPupop: ActivityHistoryInformationState) => statusPupop.isModalDeleteConfirmDialog,
);

export const GetActivityIdSelector = createSelector(
  (state: RootState) => state.activityHistoryInformation,
  (id: ActivityHistoryInformationState) => id.activityId,
);

export const ResponeCustomerDetailTabSelector = createSelector(
  (state: RootState) => state.activityHistoryInformation,
  (response: ActivityHistoryInformationState) => response.responseCustomerDetailTab
);

export const IsShowMessageSelector = createSelector(
  (state: RootState) => state.activityHistoryInformation,
  (type: ActivityHistoryInformationState) => type.isMessage
);

export const ParamActivitySelector = createSelector(
  (state: RootState) => state.activityHistoryInformation,
  (param: ActivityHistoryInformationState) => param.activityParam
);
