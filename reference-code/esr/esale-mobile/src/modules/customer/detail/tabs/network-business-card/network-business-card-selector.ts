import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../../../reducers";
import { NetworkBusinessCardState } from "./network-business-card-reducer";

export const departmentsSelector = createSelector(
  (state: RootState) => state.networkBusinessCard,
  (networkBusinessCard: NetworkBusinessCardState) => networkBusinessCard.departments
);

export const businessCardsSelector = createSelector(
  (state: RootState) => state.networkBusinessCard,
  (networkBusinessCard: NetworkBusinessCardState) => networkBusinessCard.businessCardDatas
);

export const employeesSelector = createSelector(
  (state: RootState) => state.networkBusinessCard,
  (networkBusinessCard: NetworkBusinessCardState) => networkBusinessCard.employeeDatas
);

export const standsSelector = createSelector(
  (state: RootState) => state.networkBusinessCard,
  (networkBusinessCard: NetworkBusinessCardState) => networkBusinessCard.standDatas
);

export const motivationsSelector = createSelector(
  (state: RootState) => state.networkBusinessCard,
  (networkBusinessCard: NetworkBusinessCardState) => networkBusinessCard.motivationDatas
);

export const tradingProductsSelector = createSelector(
  (state: RootState) => state.networkBusinessCard,
  (networkBusinessCard: NetworkBusinessCardState) => networkBusinessCard.tradingProductDatas
);

export const companyIdSelector = createSelector(
  (state: RootState) => state.networkBusinessCard,
  (networkBusinessCard: NetworkBusinessCardState) => networkBusinessCard.companyId
);

export const positionTypeSelector = createSelector(
  (state: RootState) => state.networkBusinessCard,
  (networkBusinessCard: NetworkBusinessCardState) => networkBusinessCard.positionType
);

export const networkStandDetailSelector = createSelector(
  (state: RootState) => state.networkBusinessCard,
  (networkBusinessCard: NetworkBusinessCardState) => networkBusinessCard.networkStandDetail
);

export const extendDepartmentsSelector = createSelector(
  (state: RootState) => state.networkBusinessCard,
  (networkBusinessCard: NetworkBusinessCardState) => networkBusinessCard.extendDepartments
);

export const motivationBusinessCardSelector = createSelector(
  (state: RootState) => state.networkBusinessCard,
  (networkBusinessCard: NetworkBusinessCardState) => networkBusinessCard.motivationBusinessCard
);

