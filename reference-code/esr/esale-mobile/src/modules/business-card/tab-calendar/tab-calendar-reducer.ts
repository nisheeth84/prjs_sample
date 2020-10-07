import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {  DataForCalendarByDayDataResponse, DataCalendarByList } from "./tab-calendar-repository";

export interface TabCalendarState {
  dataCalendarByDay: DataForCalendarByDayDataResponse;
  dataCalendarByList: DataCalendarByList;
  status?: number;
}
export interface TabCalendarReducers
  extends SliceCaseReducers<TabCalendarState> {}

const tabCalendarSlice = createSlice<TabCalendarState, TabCalendarReducers>({
  name: "tabCalendar",
  initialState: {
    dataCalendarByDay: {
        itemList: []
    },
    dataCalendarByList: {
        dateFromData: "",
        dateToData: "",
        isGetMoreData: false,
        dateList: [],
        itemList: [],
        countSchedule: 0,
    }
  },
  reducers: {
    getDataCalendarByDay(state, { payload }: PayloadAction<DataForCalendarByDayDataResponse>) {
      state.dataCalendarByDay = payload;
    },
    getDataCalendarByList(
        state,
        { payload }: PayloadAction<DataCalendarByList>
    ) {
        state.dataCalendarByList = payload;
    },
  },
});

export const tabCalendarActions = tabCalendarSlice.actions;
export default tabCalendarSlice.reducer;
