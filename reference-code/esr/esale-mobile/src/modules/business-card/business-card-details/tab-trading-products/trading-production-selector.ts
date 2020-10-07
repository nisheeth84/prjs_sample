import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../../reducers";
import { TradingProductsState } from "./trading-products-reducer";

export const BusinessCardDetailState = createSelector(
  (state: RootState) => state.productTradings,
  (productTradings: TradingProductsState) => productTradings.productTradings
);
