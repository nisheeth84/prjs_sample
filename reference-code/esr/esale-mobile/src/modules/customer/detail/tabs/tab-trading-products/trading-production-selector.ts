import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../../../reducers";
import { TradingProductsState } from "./trading-products-reducer";
/**
 * selector get data
 */
export const tradingProductsSelector = createSelector(
  (state: RootState) => state.productsTrading,
  (productsTradings: TradingProductsState) => productsTradings.productsTradings 
);
export const sortData = createSelector(
  (state: RootState) => state.productsTrading,
  (sort: TradingProductsState) => sort.sort 
);
export const fieldInfoProductData = createSelector(
  (state: RootState) => state.productsTrading,
  (fieldInfo: TradingProductsState) => fieldInfo.fieldInfo 
);