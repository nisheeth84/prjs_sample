import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { DrawerState } from "./product-drawer-reducer";

/**
 * left drawer status selector
 */
export const productsDrawerSelector = createSelector(
  (state: RootState) => state.productDrawerReducers,
  (product: DrawerState) => product.isDrawerOpen
);
