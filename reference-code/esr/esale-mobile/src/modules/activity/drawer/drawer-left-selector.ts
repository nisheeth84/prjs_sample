import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "../../../reducers"
import { DrawerActivityState } from "./drawer-left-activity-reducer"
/**
 * left drawer status selector
 */
export const drawerActivitySelector = createSelector(
  (state: RootState) => state.drawerActivity,
  (drawerActivityState: DrawerActivityState) => drawerActivityState,
)

export const businessCardListSelector = createSelector(
  (state: RootState) => state.drawerActivity,
  (drawerActivityState: DrawerActivityState) => drawerActivityState.businessCardListNew,
)

export const tradingProductsSelector = createSelector(
  (state: RootState) => state.drawerActivity,
  (drawerActivityState: DrawerActivityState) => drawerActivityState.productTradings,
)
export const customerFavoriteListSelector = createSelector(
  (state: RootState) => state.drawerActivity,
  (drawerActivityState: DrawerActivityState) => drawerActivityState.customerFavoriteList,
)

export const listProductForSelectionSelector = createSelector(
  (state: RootState) => state.drawerActivity,
  (drawerActivityState: DrawerActivityState) => drawerActivityState.listData,
)