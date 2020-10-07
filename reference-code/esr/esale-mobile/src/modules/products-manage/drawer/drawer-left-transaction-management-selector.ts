import { createSelector } from "@reduxjs/toolkit";
import { DrawerState } from "./drawer-left-transaction-management-reducer";
import { RootState } from "../../../reducers";

/**
 * left drawer status selector
 */
export const productTradingDrawerSelector = createSelector(
  (state: RootState) => state.ProductManagerDrawerReducers,
  (productManager: DrawerState) => productManager.isDrawerOpen
);
