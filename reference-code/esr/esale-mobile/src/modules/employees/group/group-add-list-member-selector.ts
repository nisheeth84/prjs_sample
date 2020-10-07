import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../reducers';
import { ListMemberState } from './group-add-list-member-reducer';

export const listMemberSelector = createSelector(
  (state: RootState) => state.listMember,
  (listMember: ListMemberState) => listMember.listMember
);

export const initializeGroupModalSelector = createSelector(
  (state: RootState) => state.listMember,
  (listMember: ListMemberState) => listMember.initializeGroupModal
);
