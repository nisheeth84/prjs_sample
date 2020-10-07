import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { ProductDetailsState } from "./product-details-reducer";

/**
 * product detail selector
 */
export const productsDetailSelector = createSelector(
  (state: RootState) => state.productDetails,
  (product: ProductDetailsState) => product.productDetails
);

/**
 * product detail history selector
 */
export const productsHistorySelector = createSelector(
  (state: RootState) => state.productDetails,
  (product: ProductDetailsState) => product.historyProduct
);

/**
 * product detail trading general information selector
 */
export const productDetailTradingGeneralInfoSelector = createSelector(
  (state: RootState) => state.productDetails,
  (product: ProductDetailsState) => product.productDetailTradingGeneralInfo
);

/**
 * product detail trading selector
 */
export const productDetailTradingSelector = createSelector(
  (state: RootState) => state.productDetails,
  (product: ProductDetailsState) => product.productDetailTrading
);

/**
 * product detail set include selector
 */
export const productDetailSetIncludeSelector = createSelector(
  (state: RootState) => state.productDetails,
  (product: ProductDetailsState) => product.productDetailSetInclude
);

/**
 * status selector
 */
export const statusSelector = createSelector(
  (state: RootState) => state.productDetails,
  (status: ProductDetailsState) => status.status
);

/**
 * field info selector
 */
export const productFieldInfoSelector = createSelector(
  (state: RootState) => state.productDetails,
  (status: ProductDetailsState) => status.fieldInfo
);

/**
 * product types selector
 */
export const productTypesSelector = createSelector(
  (state: RootState) => state.productDetails,
  (status: ProductDetailsState) => status.productTypes
);

/**
 * tab info selector
 */
export const productTabInfoSelector = createSelector(
  (state: RootState) => state.productDetails,
  (status: ProductDetailsState) => status.tabInfo
);
