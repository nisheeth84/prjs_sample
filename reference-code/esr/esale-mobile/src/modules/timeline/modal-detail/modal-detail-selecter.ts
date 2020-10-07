import { createSelector } from "@reduxjs/toolkit";
import { TimelineDetailReducers } from "./modal-detail-reducer";
import { RootState } from "../../../reducers";

/**
 * get timelines selector
 */
export const getTimelinesDetailSelector = createSelector(
  (state: RootState) => state.timelineDetail,
  (timelineDetail: TimelineDetailReducers) =>
    timelineDetail.resultTimelinesDetail
);
