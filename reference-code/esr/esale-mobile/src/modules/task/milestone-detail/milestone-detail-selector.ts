import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { MilestoneDetailState } from "./milestone-detail-reducer";

/**
 * milestone detail selector
 */
export const milestoneDetailSelector = createSelector(
  (state: RootState) => state.milestoneDetail,
  (milestone: MilestoneDetailState) => milestone.milestoneDetail
);

/**
 * milestone detail state selector
 */
export const statusSelector = createSelector(
  (state: RootState) => state.milestoneDetail,
  (milestone: MilestoneDetailState) => milestone.status
);

/**
 * milestone detail history selector
 */
export const milestoneDetailHistorySelector = createSelector(
  (state: RootState) => state.milestoneDetail,
  (milestone: MilestoneDetailState) => milestone.histories
);
