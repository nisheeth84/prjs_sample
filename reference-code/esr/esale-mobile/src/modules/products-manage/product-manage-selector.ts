import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../reducers";
import { ProductManageState } from "./manage/product-manage-reducer";

/**
 * product trading selector
 */
export const productTradingSelector = createSelector(
  (state: RootState) => state.ProductManageReducers,
  (productTrading: ProductManageState) => productTrading.listProductTrading
);

/**
 * drawer list selected selector
 */
export const drawerListSelectedSelector = createSelector(
  (state: RootState) => state.ProductManageReducers,
  (productTrading: ProductManageState) => productTrading.drawerListSelected
);

/**
 * data get product trading selector
 */
export const dataGetProductTradingListSelector = createSelector(
  (state: RootState) => state.ProductManageReducers,
  (productTradingState: ProductManageState) =>
    productTradingState.dataProductTradingList
);

/**
 * tabbar product trading selector
 */
export const tabbarProductTradingSelector = createSelector(
  (state: RootState) => state.ProductManageReducers,
  (tab: ProductManageState) => tab.tab
);

/**
 * list screen warning message selector
 */
export const listScreenWarningMessageSelector = createSelector(
  (state: RootState) => state.ProductManageReducers,
  (tab: ProductManageState) => tab.warningMessage
);

/**
 * reload drawer selector
 */
export const reloadDrawerSelector = createSelector(
  (state: RootState) => state.ProductManageReducers,
  (tab: ProductManageState) => tab.reloadDrawer
);

/**
 * select record selector
 */
export const selectRecordSelector = createSelector(
  (state: RootState) => state.ProductManageReducers,
  (tab: ProductManageState) => tab.selectRecord
);

/**
 * reload auto list selector
 */
export const reloadAutoListSelector = createSelector(
  (state: RootState) => state.ProductManageReducers,
  (tab: ProductManageState) => tab.reloadAutoList
);

/**
 * refresh list selector
 */
export const refreshListSelector = createSelector(
  (state: RootState) => state.ProductManageReducers,
  (tab: ProductManageState) => tab.refreshList
);
