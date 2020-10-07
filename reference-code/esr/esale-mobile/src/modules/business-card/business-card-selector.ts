import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import { BusinessCardState } from './business-card-reducer';

export const businessCardSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (card: BusinessCardState) => card.cards
);

export const dataGetBusinessCardsSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (businessCardState: BusinessCardState) => businessCardState.data
);

export const dataGetBusinessCardSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (businessCardState: BusinessCardState) =>
    businessCardState.dataGetBusinessCard
);

export const dataGetBusinessCardListSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (businessCardState: BusinessCardState) =>
    businessCardState.dataBusinessCardList
);

export const dataGetAddressesFromZipCodeSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (businessCardState: BusinessCardState) => businessCardState.addressInfos
);

export const dataSuggestBusinessCardCustomerSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (businessCardState: BusinessCardState) => businessCardState.customers
);

export const dataSuggestBusinessCardDepartmentSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (businessCardState: BusinessCardState) => businessCardState.department
);

export const dataGetEmployeesSuggestionSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (businessCardState: BusinessCardState) =>
    businessCardState.dataEmployeesSuggestion
);

export const tabbarBusinessCardSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (tab: BusinessCardState) => tab.tab
);
export const listBusinessCardSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (list: BusinessCardState) => list.list
);

export const listBusinessCardSuggestionSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (list: BusinessCardState) => list.listBusinessCardSuggestion
);

export const refreshSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (businessCardState: BusinessCardState) => businessCardState.refreshing
);

export const drawerListSelectedSelector = createSelector(
  (state: RootState) => state.businessCardReducers,
  (businessCardState: BusinessCardState) => businessCardState.drawerListSelected
);
