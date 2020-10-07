import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../reducers';
import { DetailScreenState } from './detail-screen-reducer';

export const customerSelector = createSelector(
  (state: RootState) => state.detailScreen,
  (detail: DetailScreenState) => detail.customers
);

export const businessCardSelector = createSelector(
  (state: RootState) => state.detailScreen,
  (detail: DetailScreenState) => detail.cards
);

export const calendarsSelector = createSelector(
  (state: RootState) => state.detailScreen,
  (detail: DetailScreenState) => detail.calendars
);

export const taskSelector = createSelector(
  (state: RootState) => state.detailScreen,
  (detail: DetailScreenState) => detail.tasks
);

export const tradingProductSelector = createSelector(
  (state: RootState) => state.detailScreen,
  (detail: DetailScreenState) => detail.tradingProducts
);

export const groupSelector = createSelector(
  (state: RootState) => state.detailScreen,
  (detail: DetailScreenState) => detail.groups
);

export const timelineSelector = createSelector(
  (state: RootState) => state.detailScreen,
  (detail: DetailScreenState) => detail.timelines
);

export const employeeDataSelector = createSelector(
  (state: RootState) => state.detailScreen,
  (detail: DetailScreenState) => detail.employeeData
);

export const employeeIdSelector = createSelector(
  (state: RootState) => state.detailScreen,
  (detail: DetailScreenState) => detail.employeeId
);

export const userIdSelector = createSelector(
  (state: RootState) => state.detailScreen,
  (detail: DetailScreenState) => detail.userId
);
export const employeeIdsListSelector = createSelector(
  (state: RootState) => state.detailScreen,
  (detail: DetailScreenState) => detail.employeeIdsList
);

