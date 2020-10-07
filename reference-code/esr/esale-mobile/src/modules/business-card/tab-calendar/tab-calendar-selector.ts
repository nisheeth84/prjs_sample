import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { TabCalendarState } from "./tab-calendar-reducer";

// data calendar by day selector
export const dataCalendarByDaySelector = createSelector(
    (state: RootState) => state.tabCalendar,
    (calendar: TabCalendarState) => calendar.dataCalendarByDay
);

// data calendar by list selector
export const dataCalendarByListSelector = createSelector(
    (state: RootState) => state.tabCalendar,
    (calendar: TabCalendarState) => calendar.dataCalendarByList
);
