import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../reducers";
import { MenuState } from "./menu-feature-reducer";

export const ServiceFavoriteSelector = createSelector(
  (state: RootState) => state.menu,
  (listServiceFavorites: MenuState) => listServiceFavorites.listServiceFavorite
);
export const ServiceOrderSelector = createSelector(
  (state: RootState) => state.menu,
  (listServiceOrders: MenuState) => listServiceOrders.listServiceOrder
);
export const ServiceInfoSelector = createSelector(
  (state: RootState) => state.menu,
  (listServiceInfo: MenuState) => listServiceInfo.listServiceInfo
);
export const CompanyNameSelector = createSelector(
  (state: RootState) => state.menu,
  (companyInfo: MenuState) => companyInfo.companyName
);
export const UnreadNotificationSelector = createSelector(
  (state: RootState) => state.menu,
  (unreadNotificationNumber: MenuState) =>
    unreadNotificationNumber.unreadNotificationNumber
);
export const ListInfoSelector = createSelector(
  (state: RootState) => state.menu,
  (MenuReducer: MenuState) => MenuReducer.listSuggestion
);
