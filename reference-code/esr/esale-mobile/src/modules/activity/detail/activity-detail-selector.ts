import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "../../../reducers"
import { ActivityDetailState } from "./activity-detail-reducer"
export const activityDetailSelector = createSelector(
  (state: RootState) => state.activityDetail,
  (activityDetailState: ActivityDetailState) => activityDetailState.activities
)

export const activityIdSelector = createSelector(
  (state: RootState) => state.activityDetail,
  (activityDetailState: ActivityDetailState) => activityDetailState.activityId
)

export const fieldInfosSelector = createSelector(
  (state: RootState) => state.activityDetail,
  (activityDetailState: ActivityDetailState) => activityDetailState.fieldInfoActivity
)

export const fieldInfosProductTradingSelector = createSelector(
  (state: RootState) => state.activityDetail,
  (activityDetailState: ActivityDetailState) => activityDetailState.fieldInfoProductTrading
)

export const dataInfoSelector = createSelector(
  (state: RootState) => state.activityDetail,
  (activityDetailState: ActivityDetailState) => activityDetailState.dataInfo
)

export const activityHistoriesSelector = createSelector(
  (state: RootState) => state.activityDetail,
  (activityDetailState: ActivityDetailState) => activityDetailState.activityHistories
)

export const messagesSelector = createSelector(
  (state: RootState) => state.activityDetail,
  (activityDetailState: ActivityDetailState) => activityDetailState.messages
)

export const scenarioSelector = createSelector(
  (state: RootState) => state.activityDetail,
  (activityDetailState: ActivityDetailState) => activityDetailState.scenario
)

export const progressSelector = createSelector(
  (state: RootState) => state.activityDetail,
  (activityDetailState: ActivityDetailState) => activityDetailState.progresses
)

