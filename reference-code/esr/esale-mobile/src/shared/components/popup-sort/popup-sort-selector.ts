import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { SortConditionState } from "./popup-sort-reducer";

/**
 * get sort result
 */
export const resultSortSelector = createSelector(
  (state: RootState) => state.commonSort,
  (sortState: SortConditionState) => sortState.result
);

/**
 * get screen name
 */
export const screenNameSortSelector = createSelector(
  (state: RootState) => state.commonSort,
  (sortState: SortConditionState) => sortState.screenName
);

