import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { ProductSetDetailsState } from "./product-set-details-reducer";

/**
 * product set detail selector
 */
export const productSetDetailSelector = createSelector(
  (state: RootState) => state.productSetDetails,
  (productSetDetail: ProductSetDetailsState) => productSetDetail.productSetDetail
);

/**
 * product set detail history selector
 */
export const productSetHistorySelector = createSelector(
  (state: RootState) => state.productSetDetails,
  (product: ProductSetDetailsState) => product.historySetProduct
);

/**
 * product set detail trading general information selector
 */
export const productSetDetailTradingGeneralInfoSelector = createSelector(
  (state: RootState) => state.productSetDetails,
  (productSetDetails: ProductSetDetailsState) => productSetDetails.productDetailTradingGeneralInfo
);

/**
 * product set detail trading selector
 */
export const productSetDetailTradingSelector = createSelector(
  (state: RootState) => state.productSetDetails,
  (productSetDetails: ProductSetDetailsState) => productSetDetails.productDetailTrading
);

/**
 * product set detail set include selector
 */
export const productSetDetailSetIncludeSelector = createSelector(
  (state: RootState) => state.productSetDetails,
  (productSetDetails: ProductSetDetailsState) => productSetDetails.productDetailSetInclude
);


/**
 * product set detail product include selector
 */
export const productSetDetailProductIncludeSelector = createSelector(
  (state: RootState) => state.productSetDetails,
  (productSetDetails: ProductSetDetailsState) => productSetDetails.product
);

/**
 * status selector
 */
export const statusSetSelector = createSelector(
  (state: RootState) => state.productSetDetails,
  (status: ProductSetDetailsState) => status.status
);

/**
 * status selector
 */
export const fieldInfoProductSelector = createSelector(
  (state: RootState) => state.productSetDetails,
  (fieldInfoProduct: ProductSetDetailsState) => fieldInfoProduct.fieldInfo
);

/**
 * status selector
 */
export const fieldInfoProductSetSelector = createSelector(
  (state: RootState) => state.productSetDetails,
  (fieldInfoProductSet: ProductSetDetailsState) => fieldInfoProductSet.fieldInfoSet
);

/**
 * product types set selector
 */
export const productTypesSetSelector = createSelector(
  (state: RootState) => state.productSetDetails,
  (productTypesSet: ProductSetDetailsState) => productTypesSet.productTypesSet
);

/**
 * tab info selector
 */
export const productSetTabInfoSelector = createSelector(
  (state: RootState) => state.productSetDetails,
  (status: ProductSetDetailsState) => status.tabInfo
);
