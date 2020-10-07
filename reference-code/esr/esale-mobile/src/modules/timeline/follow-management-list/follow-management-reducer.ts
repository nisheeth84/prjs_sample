import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  Followed,
  FollowedListInfoResponse,
} from "./follow-management-repository";
import { EnumStatus } from "../../../config/constants/enum-status";

export interface FollowState {
  followedList: Array<Followed>;
  total: number;
  status: EnumStatus;
}

export interface FollowReducers extends SliceCaseReducers<FollowState> {}

const followedSlice = createSlice<FollowState, FollowReducers>({
  name: "followed-detail",
  initialState: {
    followedList: [],
    total: 0,
    status: EnumStatus.PENDING,
  },
  reducers: {
    getFollowedList(
      state,
      { payload }: PayloadAction<FollowedListInfoResponse>
    ) {
      state.followedList = payload.followeds;
      state.total = payload.total;
      state.status = EnumStatus.SUCCESS;
    },

    setErrors(state) {
      state.status = EnumStatus.ERROR;
      state.followedList = [];
    },
  },
});

export const followedActions = followedSlice.actions;
export default followedSlice.reducer;
