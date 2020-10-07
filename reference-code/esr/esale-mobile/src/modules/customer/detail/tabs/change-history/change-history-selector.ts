import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../../../reducers";
import { ChangeHistoryState } from "./change-history-reducer";

export const getChangeHistorySelector = createSelector(
  (state: RootState) => state.changeHistory,
  (changeHistory: ChangeHistoryState) => changeHistory.changeHistoryList
);
