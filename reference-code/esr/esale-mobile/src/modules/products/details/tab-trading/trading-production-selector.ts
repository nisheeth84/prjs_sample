import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../../reducers";
import { TradingProductsState } from "./trading-products-reducer";
/**
 * selector get data
 */
export const tradingProductsSelector = createSelector(
  (state: RootState) => state.productsTrading,
  (productsTradings: TradingProductsState) => productsTradings.productsTradings 
);
export const sortData = createSelector(
  (state: RootState) => state.productsTradingProduct,
  (sort: TradingProductsState) => sort.sort 
);
export const fieldInfoProductData = createSelector(
  (state: RootState) => state.productsTradingProduct,
  (fieldInfo: TradingProductsState) => fieldInfo.fieldInfo 
);