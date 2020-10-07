import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { appStatus } from "../../../config/constants";
import { TimelineDataResponse } from "./modal-detail-repository";

export interface TimelineDetailState {
  resultTimelinesDetail?: TimelineDataResponse;
  status: string;
}

export interface TimelineDetailReducers
  extends SliceCaseReducers<TimelineDetailState> {}

/**
 * Search Reducers
 */

const SearchSlice = createSlice<TimelineDetailState, TimelineDetailReducers>({
  name: "timeline",
  initialState: {
    // resultTimelinesDetail: {
    //   timelineId: 2,
    //   parentId: null,
    //   rootId: null,
    //   timelineType: [
    //     {
    //       timelineTypeId: 1,
    //     },
    //   ],
    //   createdUser: 1,
    //   createdUserName: null,
    //   createdUserPhoto: null,
    //   createdDate: null,
    //   changedDate: "2020-07-13T11:43:49Z",
    //   timelineGroupId: null,
    //   timelineGroupName: null,
    //   color: null,
    //   imagePath: null,
    //   header: null,
    //   comment: {
    //     mode: 2,
    //     content: 'Kien dz',
    //   },
    //   sharedTimeline: {
    //     timelineId: null,
    //     parentId: null,
    //     rootId: null,
    //     createdUser: null,
    //     createdUserName: null,
    //     createdUserPhoto: null,
    //     createdDate: null,
    //     timelineGroupId: null,
    //     timelineGroupName: null,
    //     imagePath: null,
    //     header: null,
    //     comment: null,
    //   },
    //   attachedFiles: [],
    //   reactions: [],
    //   isFavorite: null,
    //   commentTimelines: [],
    // },
    status: appStatus.PENDING,
  },
  reducers: {
    getTimelinesDetail(state, { payload }: PayloadAction<any>) {
      state.resultTimelinesDetail = payload.data;
      state.status = appStatus.SUCCESS;
    },
  },
});

export const TimelinesActions = SearchSlice.actions;
export default SearchSlice.reducer;
