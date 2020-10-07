import { GetLocalNavigation } from './models/get-local-navigation-type';
import { GetViewTypesForCalendar } from './models/get-view-types-for-calendar-type';
import moment from 'moment';
import { Storage } from 'react-jhipster';
import { translate } from 'react-jhipster';
import { CalenderViewMonthCommon } from './grid/common';
export const enum CalendarView {
  Month = 11,
  Week = 12,
  Day = 13,
  List = 14,
  OptionShowAll = 15,
  OptionShowLunarDay = 16,
  OptionShowHoliday = 17
}

export const enum EventItemDivison {
  Milestone = 1,
  Task = 2,
  Schedule = 3
}

export const enum ScheduleRepeatType {
  Day = 0,
  Week,
  Month
}

export const enum ScheduleRepeatEndType {
  None,
  Specific,
  Cycle
}

export const enum ScheduleRepeatMonthType {
  Day,
  Week,
  EndOfMonth
}

export const enum FlagEditRepeatedSchedule {
  One,
  AllAfter,
  All
}

export const PARAM_GET_DATA_OF_MONTH_CALENDAR = () => {
  return ``;
};

export const enum TabForcus {
  Schedule = 0,
  Resource = 1
}

export const AttendanceDivisionType = {
  NotConfirmed: 0,
  Available: 1,
  Absent: 2,
  Share: 3
};

export const ParticipationDivisionType = {
  Available: 1,
  Share: 2
};

export const enum ItemTypeSchedule {
  Milestone = 1,
  Task = 2,
  Schedule = 3
}

export const ItemTypeDrag = {
  MilestoneFullDay: 'MilestoneFullDay',
  TaskFullDay: 'TaskFullDay',
  ScheduleFullDay: 'ScheduleFullDay',
  ResourceFullDay: 'ResourceFullDay',

  MilestoneInHour: 'MilestoneInHour',
  TaskInHour: 'TaskInHour',
  ScheduleInHour: 'ScheduleInHour',
  ResourceInHour: 'ResourceInHour'
};

export const enum ModeAction {
  Create = 1,
  Edit = 2,
  Delete = 3,
  Detail = 4
}

// Number schedule show when 折り畳み表示 = checked
export const NumberOfScheduleShow = 4;

// Number schedule show in view list
export const NumberOfScheduleInListView = 20;
export const NumberOfDayLoadDataInListView = 100;
export const LimitLoadDataInListView = 20;

export type LocalNavigation = GetLocalNavigation & {
  tabFocus?: TabForcus;
  loginFlag?: boolean;
  limitLoadDataInListView?: number;
};

export type ViewTypesForCalendar = GetViewTypesForCalendar & {
  currentDate: Date;
  typeView: CalendarView;
};

export const enum EnumIconTypeTypes {
  PERSON = 1,
  USER = 2,
  PHONE = 3,
  BAG = 4,
  RECYCLEBIN = 5,
  BELL = 6,
  TEXT = 7
}

export const ACTION_TYPE = {
  /** control top start */
  CONTROL_TOP_GET_TYPE_VIEW_OF_CALENDAR: 'controlTopGetTypeViewOfCalendar',
  CONTROL_TOP_SHOW_MONTH_GRID: 'controlTopCalendarShowTypeMonth',
  CONTROL_TOP_SHOW_WEEK_GRID: 'controlTopCalendarShowTypeWeek',
  CONTROL_TOP_SHOW_DAY_GRID: 'controlTopCalendarShowTypeDay',
  CONTROL_TOP_SHOW_LIST_GRID: 'controlTopCalendarShowTypeList',
  CONTROL_TOP_SHOW_GRID: 'controlTopCalendarShowTypeWeek',
  CONTROL_TOP_ONCHANGE_DATE_SHOW: 'controlTopOnChangeDateShow',
  CONTROL_TOP_OPTION_SHOW_ALL: 'controlTopOptionShowAll',
  CONTROL_TOP_OPTION_SIX_DAY: 'controlTopOptionShowSixDay',
  CONTROL_TOP_OPTION_HOLIDAY: 'controlTopOptionShowHoliday',
  UPDATE_SCHEDULE_STATUS_GLOBAL: 'UPDATE_SCHEDULE_STATUS_GLOBAL',
  /** control top end */

  /** globalTool */
  SHOW_GLOBAL: 'SHOW_GLOBAL',
  HIDE_GLOBAL: 'HIDE_GLOBAL',
  GET_DATA: 'GET_DATA',
  FILTER_DATA_BY_DAY: 'FILTER_DATA_BY_DAY',
  NEXT_AND_PREV_DAY: 'NEXT_AND_PREV_DAY',
  PREV_DAY: 'PREV_DAY',
  NEXT: 1,
  PREV: -1,
  ATTENDANCE: 0,
  ABSENTEEISM: 1,
  SHARE: 2,
  IS_SHARE: '01'
  /** end globalTool */
};
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
 * @param globalDate
 * @constructor
 */
export const CONVERT_DATE = (
  startDate: moment.Moment,
  endDate: moment.Moment,
  globalDate = false
) => {
  startDate = CalenderViewMonthCommon.localToTimezoneOfConfig(startDate);
  endDate = CalenderViewMonthCommon.localToTimezoneOfConfig(endDate);
  const formatDate = {
    year: startDate.year(),
    month: startDate.month() + 1,
    day: startDate.date()
  };
  const formatDateTime = {
    fromYear: startDate.year(),
    fromMonth: startDate.month() + 1,
    fromDay: startDate.date(),
    fromHour: startDate.hour(),
    fromMin: `${startDate.format('mm')}`,
    toYear: endDate.year(),
    toMonth: endDate.month() + 1,
    toDay: endDate.date(),
    toHour: endDate.hour(),
    toMin: `${endDate.format('mm')}`
  };
  const formatTime = {
    fromHour: startDate.hour(),
    fromMin: `${startDate.format('mm')}`,
    toHour: endDate.hour(),
    toMin: `${endDate.format('mm')}`
  };

  if (startDate && endDate) {
    if (
      formatDateTime.fromYear === formatDateTime.toYear &&
      formatDateTime.fromMonth === formatDateTime.toMonth &&
      formatDateTime.fromDay === formatDateTime.toDay
    ) {
      return !globalDate
        ? `${translate('calendars.commons.formatFullDate', formatDate)} ${translate(
            'calendars.commons.formatTime',
            formatTime
          )}`
        : `${translate('calendars.commons.formatFullDateGlobal', formatDate)} ${translate(
            'calendars.commons.formatTimeGlobal',
            formatTime
          )}`;
    }
    return !globalDate
      ? `${translate('calendars.commons.formatDatetime', formatDateTime)}`
      : `${translate('calendars.commons.formatDatetimeGlobal', formatDateTime)}`;
  }
  return;
};

/**
 * Y-m-d of startDate = Y-m-d of endDate => Y-m-d H:i:s_start ~ H:i:s_end
 * @param startDate
 * @param endDate
 * @constructor
 */
export const CONVERT_DATE_GLOBAL = (startDate: moment.Moment, endDate: moment.Moment) => {
  startDate = CalenderViewMonthCommon.utcToLocal(startDate);
  endDate = CalenderViewMonthCommon.utcToLocal(endDate);
  const formatDate = {
    year: startDate.year(),
    month: ('0' + (startDate.month() + 1)).slice(-2),
    day: ('0' + startDate.dates()).slice(-2)
  };
  const formatDateTime = {
    fromYear: startDate.year(),
    fromMonth: ('0' + (Number(startDate.month()) + 1)).slice(-2),
    fromDay: ('0' + startDate.dates()).slice(-2),
    fromHour: ('0' + startDate.hours()).slice(-2),
    fromMin: ('0' + startDate.minutes()).slice(-2),
    toYear: endDate.year(),
    toMonth: ('0' + (Number(endDate.month()) + 1)).slice(-2),
    toDay: ('0' + endDate.dates()).slice(-2),
    toHour: ('0' + endDate.hours()).slice(-2),
    toMin: ('0' + endDate.minutes()).slice(-2)
  };
  const formatTime = {
    fromHour: ('0' + startDate.hours()).slice(-2),
    fromMin: ('0' + startDate.minutes()).slice(-2),
    toHour: ('0' + endDate.hours()).slice(-2),
    toMin: ('0' + endDate.minutes()).slice(-2)
  };

  if (startDate && endDate) {
    if (
      formatDateTime.fromYear === formatDateTime.toYear &&
      formatDateTime.fromMonth === formatDateTime.toMonth &&
      formatDateTime.fromDay === formatDateTime.toDay
    ) {
      return `${translate('calendars.commons.formatFullDateGlobal', formatDate)} ${translate(
        'calendars.commons.formatTimeGlobal',
        formatTime
      )}`;
    }
    return `${translate('calendars.commons.formatDatetimeGlobal', formatDateTime)}`;
  }
  return;
};

/**
 * Y-m-d of startDate = Y-m-d of endDate => Y-m-d H:i:s_start ~ H:i:s_end
 * @param startDate
 * @param endDate
 * @constructor
 */
export const CONVERT_DATE_HISTORY = (startDate: Date) => {
  const formatDateTime = {
    fromYear: startDate.getFullYear(),
    fromMonth: startDate.getMonth() + 1,
    fromDay: startDate.getDate(),
    fromHour: ('0' + startDate.getHours()).slice(-2),
    fromMin: ('0' + startDate.getMinutes()).slice(-2)
  };
  if (startDate) {
    console.log(formatDateTime);
    return `${translate('calendars.commons.formatDatetimeHistory', formatDateTime)}`;
  }
  return;
};

export const HIGHT_OF_TH_HEADER = 40;
export const HIGHT_OF_SCHEDULE = 26;
export const HIGHT_OF_DIV_DATE_IN_MONTH_VIEW = 26;

export const HIGHT_OF_DIV_DATE_IN_WEEK_VIEW = 82;
export const MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK = 3;
export const MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK_EXTEND = 6;
export const MIN_HIGHT_OF_TR_FULL_DAY_IN_WEEK_VIEW =
  HIGHT_OF_SCHEDULE * MAX_SHOW_SCHEDULE_IN_FULL_DAY_WEEK + HIGHT_OF_DIV_DATE_IN_WEEK_VIEW;

export const HIGHT_OF_DIV_DATE_IN_DAY_VIEW = 23;
export const HIGHT_OF_TD_IN_HOUR_WEEK_VIEW = 111;

export const MAX_SHOW_SCHEDULE_IN_LIST_VIEW = 20;
export const HIGHT_OF_SCHEDULE_IN_LIST_VIEW = 32;
export const PADDING_OF_SCHEDULE_IN_LIST_VIEW = 10;

export const enum VIEW_TYPE_CALENDAR {
  OptionSelect = '00',
  OptionCheckBox = '01'
}

export const CALENDAR_SCREEN = {
  LIST_SCHEDULE: 2
};
export const STATUS_PARTICIPANTS = {
  PARTICIPANTS: 1,
  ABSENTEES: 2,
  UNCONFIRMED: 0,
  SHARE: 3,
  TXT_PARTICIPANTS: 'participants',
  TXT_SHARERS: 'sharers'
};

export const enum ID_FIELD_INFO {
  SCHEDULE = 2,
  TASK = 15,
  MILESTONE = 1501
}

export const OPACITY_DRAGGING = 0.3;

/**
 * Type action Local navigation
 */
export const enum ACTION_LOCAL_NAVIGATION {
  SCHEDULE = 1,
  EQUIPMENT = 2
}

const getJsonData = fieldName => {
  const lang = Storage.session.get('locale', 'ja_jp');
  if (fieldName) {
    try {
      const objectName = JSON.parse(fieldName);
      const patternLangs = ['ja_jp', 'en_us', 'zh_cn'];
      return (
        objectName[lang] ||
        objectName[patternLangs[0]] ||
        objectName[patternLangs[1]] ||
        objectName[patternLangs[2]] ||
        fieldName
      );
    } catch (e) {
      return fieldName;
    }
  }
};

export const getJsonBName = fieldName => {
  return getJsonData(fieldName);
};

export const CALENDAR_EMP_COLOR = {
  'color-0': '#fb7d7d',
  'color-1': '#ff9d9d',
  'color-2': '#ffb379',
  'color-3': '#88d9b0',
  'color-4': '#85acdc',
  'color-5': '#fc82fc',
  'color-6': '#ff9d9d',
  'color-7': '#ff92b9',
  'color-8': '#b4d887',
  'color-9': '#d8cc75',
  'color-10': '#6dcacc',
  'color-11': '#7171e2',
  'color-12': '#cc8bd1',
  'color-13': '#ceaa91',
  'color-14': '#fed3d3',
  'color-15': '#ffe7d2',
  'color-16': '#d8f2e5',
  'color-17': '#d6e3f3',
  'color-18': '#ffdede',
  'color-19': '#d6e3f3',
  'color-20': '#ffdede',
  'color-21': '#d6e3f3',
  'color-22': '#ffe0eb',
  'color-23': '#d7eabe',
  'color-24': '#ece5b9',
  'color-25': '#c8ebec',
  'color-26': '#dbdbf7',
  'color-27': '#e7d3ef',
  'color-28': '#e6d4c7'
};

export const enum LICENSE_IN_CALENDAR {
  TIMELINE_LICENSE = 3,
  BUSINESS_CARD_LICENSE = 4,
  CUSTOMER_LICENSE = 5,
  ACTIVITY_LICENSE = 6,
  SALES_LICENSE = 16
}

export const enum IndexSaveSuggestionChoice {
  Schedule = 'schedule_type',
  Equipment = 'equipment'
}
