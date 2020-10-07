import { SliceCaseReducers, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChangeHistory } from "./change-history-repository";

export interface ChangeHistoryState {
  changeHistoryList: ChangeHistory;
}

export interface getChangeHistoryPayload {
  list: ChangeHistory
}

export interface ChangeHistoryReducer extends SliceCaseReducers<ChangeHistoryState> { }

const changeHistorySlice = createSlice<ChangeHistoryState, ChangeHistoryReducer>({
  name: "changeHistory",
  initialState: {
    changeHistoryList: {
      customersHistory: [],
      // mergedCustomer: []
    },
  },
  reducers: {
    getChangeHistory(state, { payload }: PayloadAction<getChangeHistoryPayload>) {
      state.changeHistoryList.customersHistory = payload.list.customersHistory;
    },
    addItemChangeHistory(state, { payload }: PayloadAction<getChangeHistoryPayload>) {
      state.changeHistoryList.customersHistory = [...state.changeHistoryList.customersHistory, ...payload.list.customersHistory];
    },
  }
})

export const changeHistoryActions = changeHistorySlice.actions;

export default changeHistorySlice.reducer;
