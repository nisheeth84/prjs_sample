import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { FilterTimelineState } from "./filter-timeline-reducer";

export const FilterTimelineSelector = createSelector(
  (state: RootState) => state.filterTimeline,
  (data: FilterTimelineState) => data
);
