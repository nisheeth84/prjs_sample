import { AuthorizationState } from './authorization-reducer';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../reducers';

/**
 * select state of auth
 */
export const authorizationSelector = createSelector(
  (state: RootState) => state.authorization,
  (authorization: AuthorizationState) => authorization
);