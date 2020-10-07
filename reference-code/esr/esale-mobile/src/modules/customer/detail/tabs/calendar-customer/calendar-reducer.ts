import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";

import { DataOfViewList } from "./type";

/**
 * state reducer of calendar
 */
export interface CalendarState {
  dataCalendarOfList: DataOfViewList;
  dataCalendarByDay: {
    monthInYear?: any;
    companyHolidayName?: any;
    holidayName?: any;
    dateByDay?: any;                                    
    perpetualCalendar?: any;                                    
    isWeekend?: any;                                    
    isHoliday?: any;                                    
    isCompanyHoliday?: any;
    endDate?: any,
    endHour?: any,
    endTimestamp?: any,
    fullDaySchedule?: any,
    listHourSchedule?: any,
    startDate?: any,
    startHour?: any,
    startTimestamp?: any,
  },
}
/**
 * data structure of payload data of view day
 */export interface DataCalendarByDayPayload {
  dataCalendarByDay: any
}

/**
 * data structure of payload data for view List
 */
export interface GetListCalendarPayload {
  dataCalendarOfList: DataOfViewList;
}

/**
 * Calendar reducers
 */
export interface CalendarReducers extends SliceCaseReducers<CalendarState> { }

const calendarSlice = createSlice<CalendarState, CalendarReducers>({
  name: "calendarCustomer",
  initialState: {
    dataCalendarOfList: {
      dataSchedule: {},
      dataResource: {}
    },
    dataCalendarByDay: {},
  },
  reducers: {
    setDataCalendarOfList(
      state,
      { payload }: PayloadAction<GetListCalendarPayload>
    ) {
      state.dataCalendarOfList = payload.dataCalendarOfList;
    },
    getDataCalendarByDay(state, { payload }: PayloadAction<DataCalendarByDayPayload>) {
      state.dataCalendarByDay = payload.dataCalendarByDay;
    },
  },
});

export const calendarActions = calendarSlice.actions;
export default calendarSlice.reducer;