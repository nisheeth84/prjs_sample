import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { CustomerDetailState } from "./customer-detail-reducer";

export const getChildCustomerListSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.childCustomersList
);

export const CustomerDetailSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.detail
);

export const statusSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (status: CustomerDetailState) => status.status
);

export const taskSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.tasks
);

export const scheduleSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.schedules
);

export const extendScheduleSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.extendSchedules
);

export const tradingProductsSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.tradingProducts
);

export const activityHistorySelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.activityHistoryList
);

export const isFollowSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.isFollow
);

export const tabInfoSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.tabInfo
);

export const badgesSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.badges
);

export const getCustomerIdSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.customerId
);

export const customerIdsNavigationSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.customerNavigationList
);

export const scenariosSelector = createSelector(
  (state: RootState) => state.customerDetail,
  (customer: CustomerDetailState) => customer.scenarios
);
