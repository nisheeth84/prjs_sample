import { GetLocalNavigation } from './api/get-local-navigation-type';
import { GetViewTypesForCalendar } from './api/get-view-types-for-calendar-type';
import { translate } from "../../config/i18n";
import { messages } from "./calendar-list-messages"
import moment from 'moment';
// import { GET_SCHEDULE } from './assets/dummy';

/**
 * type view of calendar
 */
export enum CalendarView {
  DAY = 13,
  LIST = 14,
  
  OPTION_SHOW_ALL = 15, 
 
  OPTION_SHOW_LUNARDAY = 16,

  OPTION_SHOW_HOLIDAY = 17 ,
}

/**
 * type of edit repeat schedule
 */
export enum FlagEditRepeatedSchedule {
  One,
  AllAfter,
  All
}

/**
 * tab focus on screen
 */
export enum TabFocus {
  SCHEDULE = 0,
  RESOURCE = 1 
}

/**
 * Attendance division type
 */
export const AttendanceDivisionType = {
  NOT_CONFIRMED: 0,
  AVAILABLE: 1,
  ABSENT: 2,
  SHARE: 3
};

/**
 * Participation division type
 */
export const ParticipationDivisionType = {
  AVAILABLE: 0,
  SHARE: 1
};

/**
 * type of item schedule
 */
export enum ItemTypeSchedule {
  MILESTONE =1 ,
  TASK = 2,
  SCHEDULE = 3
}

// Number schedule show when 折り畳み表示 = checked
export const NumberOfScheduleShow = 4;

// Number schedule show in view list
export const NumberOfScheduleInListView = 20;
export const NumberOfDayLoadDataInListView = 100;
export const LimitLoadDataInListView = 20;

export type LocalNavigation = GetLocalNavigation & {
  tabFocus?: TabFocus;
};

export type ViewTypesForCalendar = GetViewTypesForCalendar & {
  currentDate: Date;
  typeView: CalendarView;
};

/**
 * 
 */
export enum EnumScheduleTypesType {
  PERSON = 1,
  USER = 2,
  PHONE = 3,
  BAG = 4,
  RECYCLE_BIN = 5,
  BELL = 6,
  TEXT = 7
}

/**
 * status of modal start
 */

export const MODAL_CALENDAR = {
  HIDE: false,
  SHOW: true,
  CAN_MODIFY: true
};

/**
 * status of modal end
 */

/**
 * Y-m-d of startDate = Y-m-d of endDate => Y-m-d H:i:s_start ~ H:i:s_end
 * @param startDate
 * @param endDate
 * @constructor
 */
export const CONVERT_DATE = (startDate: moment.Moment, endDate: moment.Moment) => {
  startDate = moment(startDate);
  endDate = moment(endDate);
  const formatDate = {
    year: startDate.year(),
    month: startDate.month() + 1,
    day: startDate.day()
  };
  const formatDateTime = {
    fromYear: startDate.year(),
    fromMonth: startDate.month() + 1,
    fromDay: startDate.day(),
    fromHour: startDate.hour(),
    fromMin: startDate.minute(),
    toYear: endDate.year(),
    toMonth: endDate.month() + 1,
    toDay: endDate.day(),
    toHour: endDate.hour(),
    toMin: endDate.minute()
  };
  const formatTime = {
    fromHour: startDate.hour(),
    fromMin: startDate.minute(),
    toHour: endDate.hour(),
    toMin: endDate.minute()
  };

  if (startDate && endDate) {
    if (
      formatDateTime.fromYear === formatDateTime.toYear &&
      formatDateTime.fromMonth === formatDateTime.toMonth &&
      formatDateTime.fromDay === formatDateTime.toDay
    ) {
      return `${translate(messages.formatFullDate, formatDate)} ${translate(messages.formatTime, formatTime)}`;
    }
    return `${translate(messages.formatDateTime, formatDateTime)}`;
  }
  return;
};

export const HIGHT_OF_TH_HEADER = 37;
export const HIGHT_OF_SCHEDULE = 26;
export const HIGHT_OF_DIV_DATE_IN_MONTH_VIEW = 27;

export const HIGHT_OF_DIV_DATE_IN_WEEK_VIEW = 82;
export const MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK = 4;
export const MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK_EXTEND = 6;
export const MIN_HIGHT_OF_TR_FULL_DAY_IN_WEEK_VIEW =
  HIGHT_OF_SCHEDULE * MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK + HIGHT_OF_DIV_DATE_IN_WEEK_VIEW;

export const HIGHT_OF_DIV_DATE_IN_DAY_VIEW = 23;
export const HIGHT_OF_TD_IN_HOUR_WEEK_VIEW = 40;

export const MAX_SHOW_SCHEDULE_IN_LIST_VIEW = 20;

/**
 * status of participants in schedule
 */
export const STATUS_PARTICIPANTS = {
  PARTICIPANTS: 1,
  ABSENTEES: 2,
  UNCONFIRMED: 0,
  SHARE: 3,
  TXT_PARTICIPANTS: 'participants',
  TXT_SHARERS: 'sharers'
};

/**
 * id field info
 */
export enum ID_FIELD_INFO {
  SCHEDULE = 2,
  TASK = 15,
  MILESTONE = 1501
}

/**
 * type of schedule
 */
export const SCHEDULE_TYPES = () => {
  return [
    {
      scheduleTypeId: 1,
      scheduleTypeName: '外出',
      iconType: 1,
      iconName: 'ic-calendar-user1',
      iconPath: '../../../../content/images/common/calendar/ic-calendar-user1.svg',
      isAvailable: true,
      displayOrder: 1
    },
    {
      scheduleTypeId: 2,
      scheduleTypeName: '来客',
      iconType: 1,
      iconName: 'ic-calendar-phone',
      iconPath: '../../../../content/images/common/calendar/ic-calendar-phone.svg',
      isAvailable: true,
      displayOrder: 2
    }
  ]
}

/**
 * list day of week
 */
export const ARR_WEEK = () => {
  return [
    translate(messages.monday),
    translate(messages.tuesday),
    translate(messages.wednesday),
    translate(messages.thursday),
    translate(messages.friday),
    translate(messages.saturday),
    translate(messages.sunday)
  ]
}
/**
 * list repeat type
 */
export const LIST_REPEAT_TYPE = () => {
  return [translate(messages.day), translate(messages.week), translate(messages.month_2)]
}
/**
 * list repeat cycle
 */
export const LIST_REPEAT_CYCLE = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
}
/**
 * list day of month
 */
export const LIST_DAY_OF_MONTH = (year: any, month: any) => {
  let time = moment().year(year).month(month);
  time.endOf('month');
  let endDay = time.date() + 1;
  let rs = [];
  for (let i = 1; i < endDay; i++) {
    rs.push(i);
  }

  // return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 , 31]
  return rs;
}

/**
 * list year
 */
export const YEARS = () => {
  return [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]
}
/**
 * list month
 */
export const MONTHS = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}
export const HOUSE = () => {
  return [1,2,3,4,5,6,7,8,9,10,11,12]
}
export const MINUTE = () => {
 return [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,57,55,56,57,58,59]
}
export const SESSION = () =>{
  return ['AM', 'PM']
}
/**
 * list repeat type for convert
 */
export const LIST_REPEAT_TYPE_CONVERT = () => {
  return [
    {
      key: 0,
      value: translate(messages.day)
    },
    {
      key: 1,
      value: translate(messages.week)
    },
    {
      key: 2,
      value: translate(messages.month_2)
    }
  ]
}

/**
 * gen list to n
 * @param n max length
 */
export const LIST_NUMBER_REPEAT = (n: number) => {
  let arr: any = [];
  for (var i = 1; i <= n; i++) {
    arr.push(i);
  }
  return arr
}


/**
 * type create or edit schedule
 */
export const CREATE_EDIT ={
  create: 1,
  edit: 2
}
/**
 * type of switch tab 
 */
export const SWITCH_TAB_TYPE = {
  INFO: 1,
  HISTORY: 2
}
/**
 * delete flag
 */
export const DEL_FLAG = {
  AFTER: 1,
  ALL: 2,
  ONE: 0
}
/**
 * update flag
 */
export const UPDATE_FLAG = {
  AFTER: 1,
  ALL: 2,
  ONE: 0
}
/**
 * type create, update
 */
export const TYPE_CRUD = {
  COPY: 4,
  EDIT: 5
}
/**
 * status of schedule
 */
export const SCHEDULE_STATUS = {
  JOIN: "1",
  ABSENT: "2",
  SHARE : "3"
}
/**
 * default from create, update 
 */
export const DEFAULT_CRU = {
  REPEAT_CYCLE: 1,
  REPEAT_TYPE: 0,
  REPEAT_TYPE_WEEK: 1,
  REPEAT_TYPE_MONTH: 2,
  REGULAR_DAY_OG_WEEK: '0000000',
  REGULAR_DAY_OG_WEEK_SELECTED: '1',
  REGULAR_DAY_OG_WEEK_UNSELECTED: '0',
  REPEAT_END_TYPE_FALSE: 0,
  REPEAT_END_TYPE_TRUE: 1,
  REPEAT_END_TYPE_NONE: 2,
  REPEAT_NUMBER: 30,
  REPEAT_NUMBER_DAY: 30,
  REPEAT_NUMBER_WEEK: 13,
  REPEAT_NUMBER_MONTH: 12,
  REPEAT_NUMBER_MAX: 100,
  IS_REPEAT_0: 0,
  IS_REPEAT_1: 1,
}

/**
 * TAB current screen global tool
 */
export enum TAB_CURRENT_GLOBAL_TOOL {
  NOTIFICATION = 1,
  TASK,
  SCHEDULE
}

/**
 * Type action Local navigation
 */
export enum ACTION_LOCAL_NAVIGATION {
  SCHEDULE = 1,
  DEPARTMENT,
  GROUP,
  EQUIPMENT,
  TASK,
  MILESTONE,
  HOLIDAY,
  PERPETUAL_CALENDAR,
  PARTICIPANTS,
  ABSENTEES,
  UNCONFIRMED,
  SHARE,
}

/**
 * FUNCTION_DIVISION
 */
export const FUNCTION_DIVISION = '01';

/**
 * CALENDAR PICKER
 */
export const CALENDAR_PICKER = {
  MONTH_NAMES: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  MONTH_NAMES_SHORT: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  DAY_NAMES: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
  DAY_NAMES_SHORT: '月_火_水_木_金_土_日'.split('_'),
  TODAY: 'Aujourd\'hui',
  DEFAULT_LOCALE: 'fr',
}
/**
 * DEFAULT HOUR, Start, End
 */
export const DEFAULT_HOUR = {
  S_HOUR: 0,
  E_HOUR: 23
}
/**
 * STATUS LAYOUT
 */
export const STATUS_LAYOUT = {
  MAX_HEIGHT: 60,
  LAYOUT: 0,
  ANIMATION: 60,
  MIN_HEIGHT: 60
}
/**
 * Max item mini show
 */
export const MAX_ITEM_FULL_DAY = {
  MAX: 2
}
/**
 * Link google map
 */
export const LINK_GOOGLE_MAP = "https://www.google.com/maps/search/?api=1&query="
/**
 * number hour
 */
export const HOUR_IN_DAY = 24
/**
 * EMPLOYEE ACTION
 */
export const EMPLOYEE_ACTION = {
  SELECTED: 1,
  UNSELECTED: 0,
  DEFAULT_COLOR: '#0F6EB5',
  DEFAULT_COLOR_BORDER: '#999999',
  COLOR_SELECTED_DEFAULT: '#FB7D7D'
}
/**
 * STRING TRUNCATE LENGTH
 */
export const STRING_TRUNCATE_LENGTH = {
  LENGTH_60: 60,
  LENGTH_50: 50,
  LENGTH_40: 40,
  LENGTH_30: 30
}
/**
 * ARRAY COLOR
 */

export const ARR_COLOR = [
  {
    color: '#FB7D7D',
    name: 'colorName0'
  },
  {
    color: "#ff9d9d",
    name: "colorName1"
  },
  {
    color: "#ffb379",
    name: "colorName2"
  },
  {
    color: "#88d9b0",
    name: "colorName3"
  },
  {
    color: "#85acdc",
    name: "colorName4"
  },
  {
    color: "#fc82fc",
    name: "colorName5"
  },
  {
    color: "#ff92b9",
    name: "colorName6"
  },
  {
    color: "#b4d887",
    name: "colorName7"
  },
  {
    color: "#d8cc75",
    name: "colorName8"
  },
  {
    color: "#6dcacc",
    name: "colorName9"
  },
  {
    color: "#7171e2",
    name: "colorName10"
  },
  {
    color: "#cc8bd1",
    name: "colorName11"
  },
  {
    color: "#ceaa91",
    name: "colorName12"
  },
  {
    color: "#fed3d3",
    name: "colorName13"
  },
  {
    color: "#ffe7d2",
    name: "colorName14"
  },
  {
    color: "#d8f2e5",
    name: "colorName15"
  },
  {
    color: "#d6e3f3",
    name: "colorName16"
  },
  {
    color: "#ffdede",
    name: "colorName17"
  },
  {
    color: "#d6e3f3",
    name: "colorName18"
  },
  {
    color: "#ffdede",
    name: "colorName19"
  },
  {
    color: "#d6e3f3",
    name: "colorName20"
  },
  {
    color: "#ffe0eb",
    name: "colorName21"
  },
  {
    color: "#d7eabe",
    name: "colorName22"
  },
  {
    color: "#ece5b9",
    name: "colorName23"
  },
  {
    color: "#c8ebec",
    name: "colorName24"
  },
  {
    color: "#dbdbf7",
    name: "colorName25"
  },
  {
    color: "#e7d3ef",
    name: "colorName26"
  },
  {
    color: "#e6d4c7",
    name: "colorName27"
  }
]
const SERVICES = "services/schedules/api/";
// const SERVICES = "";
/**
 * Api Config
 */
export const API = {
  GET_DATA_FOR_CALENDAR_BY_DAY: SERVICES + "get-data-for-calendar-by-day",
  GET_SCHEDULE: SERVICES + "get-schedule",
  UPDATE_SCHEDULE_STATUS: SERVICES + "update-schedule-status",
  DELETE_SCHEDULE: SERVICES + "delete-schedule",
  GET_LOCAL_NAVIGATION: SERVICES + "get-local-navigation",
  GET_DATA_FOR_CALENDAR_BY_LIST: SERVICES + "get-data-for-calendar-by-list",
  SAVE_LOCAL_NAVIGATION: SERVICES + "save-local-navigation",
  GET_EQUIPMENT_TYPES: SERVICES + "get-equipment-types",
  GET_SCHEDULE_HISTORY: SERVICES + "get-schedule-history",
  CREATE_SCHEDULE: SERVICES + "create-schedule",
  GET_SCHEDULE_TYPES: SERVICES + "get-schedule-types",
  GET_RESOURCE_FOR_CALENDAR_BY_LIST: SERVICES + "get-resources-for-calendar-by-list",
  GET_RESOURCE_FOR_CALENDAR_BY_DAY: SERVICES + "get-resources-for-calendar-by-day",
  GET_DATA_FOR_CALENDAR_BY_MONTH: SERVICES + "get-data-for-calendar-by-day",
  GET_VIEW_TYPE_FOR_CALENDAR: SERVICES + "get-view-type-for-calendar",
  GET_HOLIDAY: SERVICES + "get-holidays",
} 
/**
 * time default show messages
 */
export const TOAST_MSG_DEFAULT = 2000
/**
 * position toast message
 */
export const TOAST_MSG_POSITION = {
  BOTTOM: "bottom",
  TOP: "top"
}
