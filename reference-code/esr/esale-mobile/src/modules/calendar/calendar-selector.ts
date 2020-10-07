import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../reducers";
import { CalendarState } from "./calendar-reducer";

/**
 * get state dataCalendarOfList
 */
export const calendarListSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.dataCalendarOfList
);

/**
 * get state calendar
 */
export const calendarDetailSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.calendar
);

/**
 * get state scheduleHistories
 */
export const scheduleHistoriesSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.scheduleHistories
);

/**
 * get state tabFocus
 */
export const tabFocusSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.tabFocus
)

/**
 * get state dataGlobalTool
 */
export const dataCalendarByListSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.dataGlobalTool
);

export const dataCalendarByDaySelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.dataCalendarByDay
);


/**
 * get state localNavigation
 */
export const localNavigationSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.localNavigation
)

/**
 * get state statusLoading
 */
export const statusLoadingSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.statusLoading
)

export const dateShowSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.dateShow
)

export const offsetSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.offset
)

export const typeShowGridSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.typeShowGrid
)

export const offsetDateSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.offsetDate
)

export const messagesSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.messages
)

export const messagesToastSelector = createSelector(
  (state: RootState) => state.calendar,
  (calendar: CalendarState) => calendar.messagesToast
)