import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "../../../reducers"
import { ActivityCreateEditState } from "./activity-create-edit-reducer"

export const productSuggestionSelector = createSelector(
  (state: RootState) => state.activityCreateEdit,
  (activityCreateEditState: ActivityCreateEditState) => activityCreateEditState.productSuggestions
)

export const businessCardSuggestSelector = createSelector(
  (state: RootState) => state.activityCreateEdit,
  (activityCreateEditState: ActivityCreateEditState) => activityCreateEditState.businessCardSuggestions
)