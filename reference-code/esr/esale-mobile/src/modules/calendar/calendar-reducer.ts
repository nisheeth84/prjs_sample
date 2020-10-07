import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { GetDataForCalendarByList } from "./api/get-data-for-calendar-by-list-type";
import { Calendar, ScheduleHistoriesType } from "./api/get-schedule-type";
import { GetLocalNavigation } from "./api/get-local-navigation-type";
import { TabFocus, CalendarView } from "./constants";
import { DataOfViewList } from "./api/common";
import moment from "moment";

/**
 * state reducer of calendar
 */
export interface CalendarState {
  dataCalendarOfList: DataOfViewList;
  calendar: Calendar;
  dataGlobalTool: GetDataForCalendarByList;
  scheduleHistories: Array<ScheduleHistoriesType>;
  localNavigation: GetLocalNavigation;
  tabFocus: TabFocus,
  statusLoading: boolean,
  dateShow: string,
  dataCalendarByDay: GetDataForCalendarByDay,
  offset: number,
  typeShowGrid: CalendarView,
  offsetDate: number,
  messages: any,
  messagesToast: any
}

/**
 * data structure of payload data for view List
 */
export interface GetListCalendarPayload {
  dataCalendarOfList: DataOfViewList;
}


/**
 * data structure of payload data show
 */
export interface GetDateShowPayLoad {
  dateShow: string
}

/**
 * data structure of payload offset in list data
 */
export interface GetOffsetPayLoad {
  offset: number,
  offsetDate: number,
}

/**
 * data structure of payload detail for schedule
 */
export interface GetCalendarPayload {
  calendar: Calendar;
}

/**
 * data structure of payload data history in schedule
 */
export interface GetScheduleHistoriesPayload {
  scheduleHistories: Array<ScheduleHistoriesType>
}

/**
 * data structure of payload get data of local navigation
 */
export interface SetLocalNavigationPayload {
  localNavigation: GetLocalNavigation;
}

/**
 * data structure of payload save data of local navigation
 */
export interface SetDataLocalNavigationPayload {
  data: {
    properties: string,
    value: object
  }
}

/**
 * data structure of payload status screen for loading
 */
export interface GetStatusLoadingPayload {
  statusLoading: boolean
}

/**
 * data structure of payload type show screen
 */
export interface GetTypeShowGridPayload {
  typeShowGrid: CalendarView,
  tabFocus: TabFocus
}

interface Messages {
  type?: any,
  content?: string,
  isShow?: any 
}
/**
 * Get Type Messages
 */
export interface GetTypeMessages {
  messages: Messages
}
/**
 * Get Type Messages
 */
export interface GetTypeMessagesToast {
  messagesToast: Messages
}

/**
 * data structure of payload data for global tool
 */
export interface DataCalendarByListPayload {
  dataGlobalTool: GetDataForCalendarByList
}

/**
 * data structure of payload data of view day
 */export interface DataCalendarByDayPayload {
  dataCalendarByDay: GetDataForCalendarByDay
}

/**
 * Calendar reducers
 */
export interface CalendarReducers extends SliceCaseReducers<CalendarState> { }

type GetDataForCalendarByDay = {
  
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
  fullDayResource?: any,
  listHourSchedule?: any,
  listHourResource?: any,
  startDate?: any,
  startHour?: any,
  startTimestamp?: any,
};

const calendarSlice = createSlice<CalendarState, CalendarReducers>({
  name: "calendars",
  initialState: {
    dataCalendarOfList: {
      dataSchedule: {},
      dataResource: {}
    },
    calendar: {},
    dataGlobalTool: {},
    scheduleHistories: [],
    localNavigation: {},
    tabFocus: TabFocus.SCHEDULE,
    statusLoading: false,
    dataCalendarByDay: {},
    dateShow: moment(new Date()).hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0).format("YYYY-MM-DDTHH:mm:ssZ"),
    offset: 0,
    typeShowGrid: CalendarView.LIST,
    offsetDate: 100,
    messages: {},
    messagesToast: {}
  },
  reducers: {
    setDataCalendarOfList(
      state,
      { payload }: PayloadAction<GetListCalendarPayload>
    ) {
      state.dataCalendarOfList = payload.dataCalendarOfList;
    },
    getCalendar(
      state,
      { payload }: PayloadAction<GetCalendarPayload>
    ) {
      state.calendar = payload.calendar;
    },
    getDataCalendarByList(state, { payload }: PayloadAction<DataCalendarByListPayload>) {
      state.dataGlobalTool = payload.dataGlobalTool;
    },
    getScheduleHistories(
      state,
      { payload }: PayloadAction<GetScheduleHistoriesPayload>
    ) {
      state.scheduleHistories = payload.scheduleHistories;
    },
    setStatusLoading(
      state,
      { payload }: PayloadAction<GetStatusLoadingPayload>
    ) {
      state.statusLoading = payload.statusLoading;
    },
    setLocalNavigation(
      state,
      { payload }: PayloadAction<SetLocalNavigationPayload>
    ) {
      state.localNavigation = payload.localNavigation;
    },
    getDataCalendarByDay(state, { payload }: PayloadAction<DataCalendarByDayPayload>) {
      state.dataCalendarByDay = payload.dataCalendarByDay;
    },
    onChangeDateShow(
      state,
      { payload }: PayloadAction<GetDateShowPayLoad>
    ) {
      state.dateShow = payload.dateShow
    },
    onChangeOffset(
      state,
      { payload }: PayloadAction<GetOffsetPayLoad>
    ) {
      state.offset = payload.offset
    },
    onChangeTypeShowGrid(
      state,
      { payload }: PayloadAction<GetTypeShowGridPayload>
    ) {
      state.typeShowGrid = payload.typeShowGrid
    },
    onChangeOffsetDate(
      state,
      { payload }: PayloadAction<GetOffsetPayLoad>
    ) {
      state.offsetDate = payload.offsetDate
    },
    onChangeTabFocus(
      state,
      { payload }: PayloadAction<GetTypeShowGridPayload>
    ) {
      state.tabFocus = payload.tabFocus
    },
    setMessages(
      state,
      { payload }: PayloadAction<GetTypeMessages>
    ) {
      state.messages = payload.messages
    },
    setMessagesToast(
      state,
      { payload }: PayloadAction<GetTypeMessagesToast>
    ) {
      state.messagesToast = payload.messagesToast
    }
  },
});

export const calendarActions = calendarSlice.actions;
export default calendarSlice.reducer;