import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  Milestone,
  MilestoneDetailInfoResponse,
  HistoryMilestone,
} from "../task-repository";
import { EnumStatus } from "../../../config/constants/enum-status";

export interface MilestoneDetailState {
  milestoneDetail: Array<Milestone>;
  status: EnumStatus;
  histories: Array<HistoryMilestone>;
}

export interface MilestoneDetailReducers extends SliceCaseReducers<MilestoneDetailState> { }

const milestoneSlice = createSlice<MilestoneDetailState, MilestoneDetailReducers>({
  name: "milestone-detail",
  initialState: {
    milestoneDetail: [],
    status: EnumStatus.PENDING,
    histories: [],
  },
  reducers: {
    getMilestoneDetail(state, { payload }: PayloadAction<MilestoneDetailInfoResponse>) {
      state.milestoneDetail = [payload];
      state.histories = payload.milestoneHistories;
      state.status = EnumStatus.SUCCESS;
    },

    saveMilestoneDetail(state, { payload }: PayloadAction<Milestone>) {
      if (payload != undefined) {
        state.milestoneDetail = [payload];
        state.status = EnumStatus.SUCCESS;
      }
    },

    getMilestoneError(state) {
      state.status = EnumStatus.ERROR;
      state.milestoneDetail = [];
    },
  },
});

export const milestoneDetailActions = milestoneSlice.actions;
export default milestoneSlice.reducer;
