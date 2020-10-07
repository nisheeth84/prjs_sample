import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { BusinessCardDetailState } from "./business-card-detail-reducer";

/**
 * BusinessCard detail selector
 */
export const businessCardDetailSelector = createSelector(
  (state: RootState) => state.businessCardDetail,
  (businessCard: BusinessCardDetailState) => businessCard.businessCardDetail
);

/**
 * selector of field info for basic tab
 */
export const businessCardBasicFieldInfoSelector = createSelector(
  (state: RootState) => state.businessCardDetail,
  (businessCard: BusinessCardDetailState) => businessCard.basicFieldInfo
);

/**
 * selector of trading product business
 */
export const businessCardTradingProductSelector = createSelector(
  (state: RootState) => state.businessCardDetail,
  (businessCard: BusinessCardDetailState) => businessCard.businessTrading
);

/**
 * BusinessCard detail history update selector
 */
export const businessCardHistoryUpdateSelector = createSelector(
  (state: RootState) => state.businessCardDetail,
  (businessCard: BusinessCardDetailState) => businessCard.historyUpdate
);


/**
 * BusinessCard detail oldest history update selector
 */
export const businessCardOldestHistoryUpdateSelector = createSelector(
  (state: RootState) => state.businessCardDetail,
  (businessCard: BusinessCardDetailState) => businessCard.oldestHistoryUpdate
);


/**
 * BusinessCard detail history update field info selector
 */
export const bnCardHistoryUpdateFieldInfoSelector = createSelector(
  (state: RootState) => state.businessCardDetail,
  (businessCard: BusinessCardDetailState) => businessCard.historyFieldInfo
);

/**
 * BusinessCard detail state selector
 */
export const statusSelector = createSelector(
  (state: RootState) => state.businessCardDetail,
  (businessCard: BusinessCardDetailState) => businessCard.status
);
