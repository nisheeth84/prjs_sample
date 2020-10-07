import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../../../reducers";

/**
 * get state dataCalendarOfList
 */
export const calendarListSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar) => calendar.dataCalendarOfList
);

export const dataCalendarByDaySelector = createSelector( 
  (state: RootState) => state.calendar,
  (calendar) => calendar.dataCalendarByDay
);