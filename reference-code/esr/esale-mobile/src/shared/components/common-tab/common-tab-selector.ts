import { CommonTabState } from './common-tab-reducer';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../reducers';

export const fieldInfosSelector = createSelector(
  (state: RootState) => state.commonTab,
  (fieldInfos: CommonTabState) => fieldInfos.fieldInfosList
);

export const extensionDataSelector = createSelector(
  (state: RootState) => state.commonTab,
  (extensionData: CommonTabState) => extensionData.extensionData
);