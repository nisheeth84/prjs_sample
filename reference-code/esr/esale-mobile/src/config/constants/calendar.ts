/**
 * type view of calendar
 */
export enum CalendarView {
  Day = 13,
  List = 14,
  OptionShowAll = 15,
  OptionShowLunarDay = 16,
  OptionShowHoliday = 17,
}

/**
 * tab focus on screen
 */
export enum TabFocus {
  Schedule = 0,
  Resource = 1,
}

/**
 * Attendance division type
 */
export const AttendanceDivisionType = {
  NotConfirmed: '00',
  Available: '01',
  Absent: '02',
};

/**
 * Participation division type
 */
export const ParticipationDivisionType = {
  Available: '00',
  Share: '01',
};

/**
 * type of item schedule
 */
export enum ItemTypeSchedule {
  Milestone = 1,
  Task = 2,
  Schedule = 3,
}

export const LimitLoadDataInListView = 20;

export type LocalNavigation = {
  tabFocus?: TabFocus;
  searchStatic: {
    isAllTime: any;
    isDesignation: any;
  };
  searchDynamic: {
    customersFavourite: any;
    departments: any;
    groups: any;
    scheduleTypes: any;
    equipmentTypes: any;
  };
};

export type ViewTypesForCalendar = {
  currentDate: Date;
  typeView: CalendarView;
  itemList?: [];
};

export const HIGHT_OF_SCHEDULE = 26;

export const HIGHT_OF_TD_IN_HOUR_WEEK_VIEW = 40;

export const MAX_SHOW_SCHEDULE_IN_LIST_VIEW = 20;

/**
 * list month
 */
export const MONTHS = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
};

/**
 * status of schedule
 */
export const SCHEDULE_STATUS = {
  JOIN: '1',
  ABSENT: '2',
};

/**
 * FUNCTION_DIVISION
 */
export const FUNCTION_DIVISION = '00';

/**
 * CALENDAR PICKER
 */
export const CALENDAR_PICKER = {
  MONTH_NAMES: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
    '_'
  ),
  MONTH_NAMES_SHORT: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
    '_'
  ),
  DAY_NAMES: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
  DAY_NAMES_SHORT: '月_火_水_木_金_土_日'.split('_'),
  TODAY: "Aujourd'hui",
  DEFAULT_LOCALE: 'fr',
};
/**
 * DEFAULT HOUR, Start, End
 */
export const DEFAULT_HOUR = {
  S_HOUR: 0,
  E_HOUR: 23,
};
/**
 * STATUS LAYOUT
 */
export const STATUS_LAYOUT = {
  MAX_HEIGHT: 60,
  LAYOUT: 0,
  ANIMATION: 60,
  MIN_HEIGHT: 60,
};
/**
 * Max item mini show
 */
export const MAX_ITEM_FULL_DAY = {
  MAX: 2,
};
