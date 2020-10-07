import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { FollowState } from "./follow-management-reducer";

/**
 * followed list selector
 */
export const followedListSelector = createSelector(
  (state: RootState) => state.followListReducer,
  (data: FollowState) => data.followedList
);

/**
 * total of followed list selector
 */
export const totalFollowedItemSelector = createSelector(
  (state: RootState) => state.followListReducer,
  (data: FollowState) => data.total
);

/**
 * followed status 
 */
export const followedStatus = createSelector(
  (state: RootState) => state.followListReducer,
  (data: FollowState) => data.status
);
