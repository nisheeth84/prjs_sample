import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../reducers";
import { TimelineState } from "./timeline-reducer";

/**
 * suggest timeline group name selector
 */
export const dataSuggestTimelineGroupNameSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) =>
    timelineReducers.dataSuggestionTimelineGroupName
);

/**
 * get timeline groups selector
 */
export const dataGetTimelineGroupsSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) => timelineReducers.timelineGroup
);

/**
 * get user timelines selector
 */
export const dataGetUserTimelinesSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) => timelineReducers.timelines
);

/**
 * get group timeline color selector
 */
export const groupColorSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) => timelineReducers.groupColor
);

/**
 * get list color selector
 */
export const listColorSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) => timelineReducers.listColor
);

/**
 * get timeline group ò employee selector
 */
export const dataGetTimelineGroupsOfEmployeeSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) =>
    timelineReducers.dataGetTimelineGroupsOfEmployee
);

/**
 * get timeline filter selector
 */
export const dataGetTimelineFilterSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) => timelineReducers.dataGetTimelineFilter
);

/**
 * get Attached Filters selector
 */
export const dataGetAttachedFilesSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) => timelineReducers.dataAttachedFiles
);

/**
 * get comment selector
 */
export const dataGetCommentAndRepliesSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) => timelineReducers.dataCommentAndReplies
);

/**
 * get update filterOption selector
 */
export const updateFilterOptionsSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) => timelineReducers.filterOptions
);

/**
 * get update Sort selector
 */
export const updateSortOptionsSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) => timelineReducers.sortOptions
);

/**
 * get update Sort selector
 */
export const updateListTypeOptionOptionsSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) => timelineReducers.listTypeOption
);
/**
 * get update dataGetFavorite selector
 */
export const dataGetFavoriteTimelineGroupsSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) =>
    timelineReducers.dataFavoriteTimelineGroups
);

/**
 * get employee suggestion
 */
export const getEmployeeSuggestionSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) => timelineReducers.dataEmployeeSuggestion
);

/**
 * get suggestion Timeline
 */
export const getSuggestionTimelineSelector = createSelector(
  (state: RootState) => state.timelineReducers,
  (timelineReducers: TimelineState) => timelineReducers.suggestionTimeline
);

