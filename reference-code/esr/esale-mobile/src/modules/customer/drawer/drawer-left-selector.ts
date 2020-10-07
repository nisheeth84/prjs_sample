import { createSelector } from "@reduxjs/toolkit";
import { DrawerLeftState } from "./drawer-left-reducer";
import { RootState } from "../../../reducers";

export const TitleListSelector = createSelector(
  (state: RootState) => state.drawerLeft,
  (title: DrawerLeftState) => title.titleList
);

export const reloadLocalMenuSelector = createSelector(
  (state: RootState) => state.drawerLeft,
  (initializeLocalMenu: DrawerLeftState) => initializeLocalMenu.updateLocalMenu
);