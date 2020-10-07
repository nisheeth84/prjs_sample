import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { DrawerState } from "./business-card-drawer-reducer";

/**
 * left drawer status selector
 */
export const businessCardDrawerSelector = createSelector(
  (state: RootState) => state.businessCardDrawerReducers,
  (businessCard: DrawerState) => businessCard.isDrawerOpen
);

/**
 * refresh list selector
 */
export const refreshListSelector = createSelector(
  (state: RootState) => state.businessCardDrawerReducers,
  (businessCard: DrawerState) => businessCard.refresh
);
