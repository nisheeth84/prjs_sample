import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { TEXT_EMPTY } from "../../../config/constants/constants";

export interface SortConditionState {
  screenName: string;
  result: any
}

export interface SortConditionReducers extends SliceCaseReducers<SortConditionState> { }

const commonPopupSortSlice = createSlice<SortConditionState, SortConditionReducers>({
  name: "popupSort",
  initialState: {
    screenName: TEXT_EMPTY,
    result: {}
  },
  reducers: {
    updateSortCondition(state, { payload }: PayloadAction<any>) {
      state.screenName = payload.screenName;
      state.result = payload.result;
    }
  },
});

export const commonPopupSortActions = commonPopupSortSlice.actions;
export default commonPopupSortSlice.reducer;