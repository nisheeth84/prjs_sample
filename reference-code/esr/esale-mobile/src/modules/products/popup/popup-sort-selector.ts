import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { SortConditionState } from "./popup-sort-reducer";

/**
 * order sort selector
 */
export const orderSortSelector = createSelector(
    (state: RootState) => state.popupSort,
    (orderSort: SortConditionState) => orderSort.order
);

/**
 * category sort selector
 */
export const categorySortSelector = createSelector(
    (state: RootState) => state.popupSort,
    (categorySort: SortConditionState) => categorySort.category
);

