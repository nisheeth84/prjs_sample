import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { MilestoneDetail } from "./milestone-reponsitory";
import { appStatus } from "../../../config/constants";

export interface MilestoneState {
  messages: Array<MilestoneDetail>;
  status: string;
}

export interface MilestoneReducers extends SliceCaseReducers<MilestoneState> { }

const milestoneSlice = createSlice<MilestoneState, MilestoneReducers>({
  name: "getMilestone",
  initialState: {
    messages: [],
    status: appStatus.PENDING,
  },
  reducers: {
    getMilestone(state, { payload }: PayloadAction<any>) {
      state.messages = payload.data;
      state.status = appStatus.SUCCESS;
    },
  },
});

export const milestoneActions = milestoneSlice.actions;
export default milestoneActions.reducer;
