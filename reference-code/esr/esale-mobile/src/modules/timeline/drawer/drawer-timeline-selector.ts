import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { DrawerState } from "./timeline-drawer-reducer";

export const localNavigationSelector = createSelector(
  (state: RootState) => state.drawerTimeline,
  (localNavigationData: DrawerState) => localNavigationData.localNavigationData
);

export const userTimelineSelector = createSelector(
  (state: RootState) => state.drawerTimeline,
  (userTimelineData: DrawerState) => userTimelineData.userTimelineData
);
