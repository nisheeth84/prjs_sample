import { InitializeFieldState } from './api-reducer';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';

export const initializeFieldSelector = createSelector(
  (state: RootState) => state.initializeField,
  (initializeField: InitializeFieldState) => initializeField
);