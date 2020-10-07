import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { ProductState } from "./product-list-reducer";

/**
 * product list selector
 */
export const productsSelector = createSelector(
  (state: RootState) => state.product,
  (product: ProductState) => product.products
);


/**
 * category list selector
 */
export const categorySelector = createSelector(
  (state: RootState) => state.product,
  (product: ProductState) => product.categories
);

/**
 * total count selector
 */
export const totalCountSelector = createSelector(
  (state: RootState) => state.product,
  (product: ProductState) => product.totalCount
);

/**
 * category name selector
 */
export const productCategoryNameSelector = createSelector(
  (state: RootState) => state.product,
  (product: ProductState) => product.productCategoryName
);

/**
 * category id selector
 */
export const productCategoryIdSelector = createSelector(
  (state: RootState) => state.product,
  (product: ProductState) => product.productCategoryId
);

/**
 * status selector
 */
export const statusSelector = createSelector(
  (state: RootState) => state.product,
  (status: ProductState) => status.status
);

/**
 * option show category child selector
 */
export const isContainCategoryChildSelector = createSelector(
  (state: RootState) => state.product,
  (status: ProductState) => status.isContainCategoryChild
);

/**
 * custom fields info selector
 */
export const customFieldsInfoSelector = createSelector(
  (state: RootState) => state.product,
  (status: ProductState) => status.customFieldsInfo
);

/**
 * is set selector
 */
export const isSetSelector = createSelector(
  (state: RootState) => state.product,
  (status: ProductState) => status.isSet
);

/**
 * is set selector productID
 */
export const getProductID = createSelector(
  (state: RootState) => state.product,
  (status: ProductState) => status.productID
);
