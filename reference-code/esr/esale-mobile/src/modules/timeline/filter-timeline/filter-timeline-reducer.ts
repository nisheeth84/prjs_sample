import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { TimelineFiltersDataResponse } from "./filter-timeline-repository";

export interface FilterTimelineState {
  timelineFilters: Array<TimelineFiltersDataResponse>;
  status?: number;
}
/**
 * FilterTimeline Reducers
 */
export interface FilterTimelineReducers
  extends SliceCaseReducers<FilterTimelineState> {}

const FilterTimelineSlice = createSlice<
  FilterTimelineState,
  FilterTimelineReducers
>({
  name: "filterTimeline",
  initialState: {
    timelineFilters: [],
  },
  reducers: {
    updateTimelineFilters(state, { payload }: PayloadAction<any>) {
      state.timelineFilters = payload.data;
    },
  },
});

export const FilterTimelineActions = FilterTimelineSlice.actions;
export default FilterTimelineSlice.reducer;
