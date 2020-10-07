import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../reducers';
import { InitializeLocalMenuState } from './drawer-left-reducer';

export const initializeLocalMenuSelector = createSelector(
  (state: RootState) => state.initializeLocalMenu,
  (initializeLocalMenu: InitializeLocalMenuState) =>
    initializeLocalMenu.initLocalMenu
);

export const reloadLocalMenuSelector = createSelector(
  (state: RootState) => state.initializeLocalMenu,
  (initializeLocalMenu: InitializeLocalMenuState) =>
    initializeLocalMenu.updateLocalMenu
);
/**
 * get status keyboard
 */
export const statusKeyboard = createSelector(
  (state: RootState) => state.initializeLocalMenu,
  (status: InitializeLocalMenuState) =>
    status.statusKeyboard
);
