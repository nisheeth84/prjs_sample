import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "../../../reducers"
import { ActivityState } from "./activity-list-reducer"
export const activitySelector = createSelector(
  (state: RootState) => state.activity,
  (activityState: ActivityState) => activityState.listActivity
)
export const conditionSearchActivitySelector = createSelector(
  (state: RootState) => state.activity,
  (activityState: ActivityState) => activityState.conditionSearch
)