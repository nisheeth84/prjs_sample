import moment from 'moment';
import _ from 'lodash';
import { ScheduleListType } from '../models/schedule-list-type';
import { ResourceListType } from '../models/resource-list-type';
import { GetDataForCalendarByMonth } from '../models/get-data-for-calendar-by-month-type';
import { GetDataForCalendarByWeek } from '../models/get-data-for-calendar-by-week-type';
import { GetDataForCalendarByDay } from '../models/get-data-for-calendar-by-day-type';
import { GetDataForCalendarByList } from '../models/get-data-for-calendar-by-list-type';

import { ApiHeaderDayType } from '../models/common-type';
import { GetResourcesForCalendarByMonth } from '../models/get-resources-for-calendar-by-month-type';
import { GetResourcesForCalendarByWeek } from '../models/get-resources-for-calendar-by-week-type';
import { GetResourcesForCalendarByDay } from '../models/get-resources-for-calendar-by-day-type';
import { GetResourcesForCalendarByList } from '../models/get-resources-for-calendar-by-list-type';
import { ItemTypeSchedule, MAX_SHOW_SCHEDULE_IN_LIST_VIEW } from '../constants';
import { getTimezone } from 'app/shared/util/date-utils';

// Define data structure for one schedule
export type DataOfSchedule = ScheduleListType & {
  uniqueId?: string;

  // Define a field to manage in the client
  isShow?: boolean;
  sort?: number;
  color?: string;

  // schedule is root (case over day)
  isRoot?: boolean;
  // if over day, then how number day/hour to over
  numOverDay?: number;
  maxWidth?: number;

  // schedule is first of week (case over day)
  isFirstWeek?: boolean;

  startDateMoment?: moment.Moment;
  finishDateMoment?: moment.Moment;

  startDateSortMoment?: moment.Moment;
  finishDateSortMoment?: moment.Moment;

  startDateSortTimestamp?: number;
  finishDateSortTimestamp?: number;

  isStartPrevious?: boolean;
  isEndNext?: boolean;

  top?: number; // in minutes (top = (top * (height td/ 60)))
  height?: number; // in minutes

  left?: number; // in %
  width?: number; // in %

  // if isOverDay = true and isRoot = false then _root = root schedule
  rootId?: string;
  listChildId?: string[];
};

// define structure data Resource common for screen grid
export type DataOfResource = ResourceListType & {
  uniqueId?: string;

  // Define a field to manage in the client
  isShow?: boolean;
  sort?: number;
  color?: string;

  // schedule is root (case over day)
  isRoot?: boolean;
  // if over day, then how number day/hour to over
  numOverDay?: number;
  maxWidth?: number;

  // schedule is first of week (case over day)
  isFirstWeek?: boolean;

  startDateMoment?: moment.Moment;
  finishDateMoment?: moment.Moment;

  startDateSortMoment?: moment.Moment;
  finishDateSortMoment?: moment.Moment;

  startDateSortTimestamp?: number;
  finishDateSortTimestamp?: number;

  isStartPrevious?: boolean;
  isEndNext?: boolean;

  top?: number; // in minutes (top = (top * (height td/ 60)))
  height?: number; // in minutes

  left?: number; // in %
  width?: number; // in % of width TD

  // if isOverDay = true and isRoot = false then _root = root schedule
  rootId?: string;
  listChildId?: string[];
};

export type DataHeader = ApiHeaderDayType & {
  dateMoment?: moment.Moment;
  timestamp?: number;
};

/**
 * Define data structure for 1 day
 */
export type DataOfDay = {
  dataHeader: DataHeader;

  listSchedule?: DataOfSchedule[];
  listResource?: DataOfResource[];
};

/**
 * Define data structure for 1 week (calendar display by months)
 */
export type DataOfWeek = {
  // Start day
  startDate: moment.Moment;
  startTimestamp: number;
  // End date
  endDate: moment.Moment;
  endTimestamp: number;

  refSchedule: {};
  refResource: {};

  listDay: DataOfDay[];
};

/**
 * Defines data structure for calendar display by months
 */
export type DataOfMonth = {
  // Start day
  startDate: moment.Moment;
  startTimestamp: number;
  // End date
  endDate: moment.Moment;
  endTimestamp: number;

  refSchedule: {};
  refResource: {};

  listWeeksOfSchedule: DataOfWeek[];
  listWeeksOfResource: DataOfWeek[];
};

// Define data structure for the calendar display by week
export type HourOfDay = {
  // Start time
  startHour: moment.Moment;
  startMinute: number;
  // End time
  endHour: moment.Moment;
  endMinute: number;

  listDay: DataOfDay[];
};

/**
 * Define data structure for week and days calendar
 */
export type DataOfDetailWeek = {
  // Start day of the week
  startDate: moment.Moment;
  startTimestamp: number;
  // End date of the week
  endDate: moment.Moment;
  endTimestamp: number;

  // Start time
  startHour: number;
  // End time
  endHour: number;

  refSchedule: {};
  refResource: {};

  fullDaySchedule: DataOfDay[];
  fullDayResource: DataOfDay[];
  listHourSchedule?: HourOfDay[];
  listHourResource?: HourOfDay[];
};

/**
 * Define data structure for view list calendar
 */
export type DataOfList = {
  dateFromData?: any;
  dateToData?: any;
  isGetMoreData?: any;
  countSchedule?: any;
  listDay?: DataOfDay[];
};

/**
 * Define data structure for view list calendar
 */
export type DataOfViewList = {
  dataSchedule?: DataOfList;
  dataResource?: DataOfList;
};

export const UniqueID = (): string => {
  const chr4 = () => {
    return Math.random()
      .toString(16)
      .slice(-4);
  };
  return (
    chr4() + chr4() + '-' + chr4() + '-' + chr4() + '-' + chr4() + '-' + chr4() + chr4() + chr4()
  );
};

const NVL = (value: any, valueDefault?: any) => {
  return value === undefined ? (valueDefault === undefined ? null : valueDefault) : value;
};

export class CalenderViewMonthCommon {
  /**
   * Convert date to number of minute
   * @returns number
   */
  static convertDateToMinute = (h: moment.Moment | number, m?: number) => {
    if (moment.isMoment(h)) {
      return h.hour() * 60 + h.minute();
    }
    return h * 60 + m;
  };

  /**
   * Compare 2 date by day
   */
  static compareDateByDay = (a: moment.Moment, b: moment.Moment) => {
    const y = a.year() - b.year();
    if (y !== 0) return y;
    const m = a.month() - b.month();
    if (m !== 0) return m;
    return a.date() - b.date();
  };

  /**
   * Compare 2 by Hour
   */
  static compareDateByHour = (a: moment.Moment, b: moment.Moment) => {
    const byDay = CalenderViewMonthCommon.compareDateByDay(a, b);
    if (byDay !== 0) return byDay;
    const h = a.hour() - b.hour();
    if (h !== 0) return h;
    return a.minute() - b.minute();
  };

  /**
   * To get the difference days
   * @param a
   * @param b
   * @returns number
   */
  static getDaysDiff = (a: moment.Moment | any, b: moment.Moment | any) => {
    return moment(a)
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .diff(
        moment(b)
          .clone()
          .hours(0)
          .minutes(0)
          .seconds(0)
          .milliseconds(0),
        'days'
      );
  };

  /**
   * To get the difference days
   * @param a
   * @param b
   * @returns number
   */
  static getHoursDiff = (a: moment.Moment | any, b: moment.Moment | any) => {
    return moment(a)
      .clone()
      .seconds(0)
      .milliseconds(0)
      .diff(
        moment(b)
          .clone()
          .seconds(0)
          .milliseconds(0),
        'hours'
      );
  };

  /**
   * Sort data schedule or Resource
   * Refer to No1, sheet [画面レイアウト（予定）] of the file [110201_カレンダー（月表示）.xlsx]
   */
  static sortListScheduleOrResource = (listData: DataOfSchedule[] | DataOfResource[]) => {
    if (listData) {
      listData.sort((a: DataOfSchedule | DataOfResource, b: DataOfSchedule | DataOfResource) => {
        // const diffStart = a.startDateSortTimestamp - b.startDateSortTimestamp; // CalenderViewMonthCommon.compareDateByDay(a.startDateSortMoment, b.startDateSortMoment);
        const aTypeOverDay = a['isOverDay'] ? 0 : 1;
        const bTypeOverDay = b['isOverDay'] ? 0 : 1;
        const difTypeOverDay = aTypeOverDay - bTypeOverDay;
        if (difTypeOverDay !== 0) {
          return difTypeOverDay;
        }

        let diffStart = 0;
        let diffEnd = 0;
        const aFinishDateSortMoment = a.finishDateSortMoment;
        const bFinishDateSortMoment = b.finishDateSortMoment;

        // if (a['itemType'] && a['itemType'] === ItemTypeSchedule.Milestone) {
        //   aFinishDateSortMoment = a.startDateSortMoment;
        // }
        // if (b['itemType'] && b['itemType'] === ItemTypeSchedule.Milestone) {
        //   bFinishDateSortMoment = b.startDateSortMoment;
        // }

        if (a['isOverDay'] && b['isOverDay']) {
          diffStart = CalenderViewMonthCommon.compareDateByDay(
            a.startDateSortMoment,
            b.startDateSortMoment
          );
          if (diffStart !== 0) return diffStart;

          diffEnd = CalenderViewMonthCommon.compareDateByDay(
            aFinishDateSortMoment,
            bFinishDateSortMoment
          );
          if (diffEnd !== 0) return -diffEnd;

          diffStart = CalenderViewMonthCommon.compareDateByHour(
            a.startDateSortMoment,
            b.startDateSortMoment
          );
          if (diffStart !== 0) return diffStart;

          diffEnd = CalenderViewMonthCommon.compareDateByHour(
            aFinishDateSortMoment,
            bFinishDateSortMoment
          );
          if (diffEnd !== 0) return -diffEnd;
        } else {
          diffStart = CalenderViewMonthCommon.compareDateByHour(
            a.startDateSortMoment,
            b.startDateSortMoment
          );
          // a.start < b.start || a.start > b.start
          if (diffStart !== 0) return diffStart;

          diffEnd = CalenderViewMonthCommon.compareDateByHour(
            aFinishDateSortMoment,
            bFinishDateSortMoment
          );
          // a.end < b.end || a.end > b.end
          if (diffEnd !== 0) return -diffEnd;
        }

        // case a.start = b.start AND a.end = b.end
        let diffType = 0;
        if (a['itemType']) {
          /**
           * case sort ScheduleListType
           * - 1: milestone
           * - 2: task
           * - 3: schedule
           */
          diffType = a['itemType'] - b['itemType'];
        }

        if (diffType === 0) {
          if (a['itemType'] && a['itemType'] === ItemTypeSchedule.Schedule) {
            const typeA = a['isFullDay'] ? 0 : 1;
            const typeB = b['isFullDay'] ? 0 : 1;
            const type = typeA - typeB;
            if (type !== 0) return type;
          }
          if (a['itemId']) {
            return a['itemId'] - b['itemId'];
          }

          if (a['resourceId']) {
            return a['resourceId'] - b['resourceId'];
          }
        }

        return diffType;
      });
    }
  };

  /**
   * Convert format UTC to Local
   * @param d
   */
  static utcToLocal = (d: string | Date | moment.Moment): moment.Moment => {
    // moment.tz.setDefault(getTimezone());
    return moment.tz(moment.tz(d, 'UTC').toDate(), getTimezone()).clone();
    // return moment(
    //   moment
    //     .utc(d)
    //     .local(false)
    //     .toDate()
    // );
  };

  /**
   * Convert to Timezone Of congifg
   * @param d
   */
  static localToTimezoneOfConfig = (d: string | Date | moment.Moment): moment.Moment => {
    return moment.tz(
      moment(d)
        .clone()
        .format(),
      getTimezone()
    );
  };

  /**
   * Convert to Timezone Of Client
   * @param d
   */
  static localToTimezoneOfClient = (d: string | Date | moment.Moment): moment.Moment => {
    // const nowClient = moment();
    // console.log('moment.tz.guess()', moment.tz.guess())
    return moment.tz(
      moment(d)
        .clone()
        .format(),
      moment.tz.guess()
    );
  };

  /**
   * New moment with TimezoneOfConfig
   */
  static nowDate = (): moment.Moment => {
    // moment.tz.setDefault(getTimezone());
    const nowDate = CalenderViewMonthCommon.localToTimezoneOfConfig(new Date());
    // console.log('nowDate', nowDate.format());

    return nowDate;
  };

  static roundDownDay = (d: moment.Moment, h?: number, m?: number, s?: number, ms?: number) => {
    return d
      .clone()
      .hour(h || 0)
      .minute(m || 0)
      .second(s || 0)
      .millisecond(ms || 0);
  };

  static roundUpDay = (d: moment.Moment) => {
    return CalenderViewMonthCommon.roundDownDay(d, 23, 59, 59, 999);
  };

  static roundDate = (d: moment.Moment) => {
    return d
      .clone()
      .second(0)
      .millisecond(0);
  };

  /**
   * Convert the data type received from the API
   * @param listRawData
   * @returns DataOfSchedule[] | DataOfResource[]
   */
  static convertScheduleList = (
    listRawData: ScheduleListType[] | ResourceListType[]
  ): DataOfSchedule[] | DataOfResource[] => {
    const listData: DataOfSchedule[] | DataOfResource[] = [];
    if (listRawData) {
      listRawData.forEach((s: ScheduleListType | ResourceListType) => {
        const schedule: DataOfSchedule | DataOfResource = s;
        schedule.uniqueId = UniqueID();

        schedule.isShow = true;
        schedule.sort = 0;
        schedule.numOverDay = 1;
        schedule.maxWidth = 0;

        // case isOverDay
        schedule.isRoot = s.isOverDay;

        schedule.startDateMoment = CalenderViewMonthCommon.roundDate(
          CalenderViewMonthCommon.utcToLocal(s.startDate)
        );
        // console.log('startDateMoment', s.startDate, schedule.startDateMoment.format('YYYY-MM-DD HH:mm:ss'))
        schedule.finishDateMoment = CalenderViewMonthCommon.roundDate(
          CalenderViewMonthCommon.utcToLocal(s.finishDate)
        );

        if (
          schedule['isFullDay'] ||
          schedule['itemType'] === ItemTypeSchedule.Milestone ||
          schedule['itemType'] === ItemTypeSchedule.Task
        ) {
          schedule.startDateSortMoment = CalenderViewMonthCommon.roundDate(
            CalenderViewMonthCommon.utcToLocal(s.startDate)
              .hour(0)
              .minute(0)
              .second(0)
              .millisecond(0)
          );
          schedule.finishDateSortMoment = CalenderViewMonthCommon.utcToLocal(s.finishDate)
            .hour(23)
            .minute(59)
            .second(59)
            .millisecond(999);
        } else {
          schedule.startDateSortMoment = CalenderViewMonthCommon.roundDate(
            CalenderViewMonthCommon.utcToLocal(s.startDate)
          );
          schedule.finishDateSortMoment = CalenderViewMonthCommon.roundDate(
            CalenderViewMonthCommon.utcToLocal(s.finishDate)
          );
        }

        schedule.startDateSortTimestamp = schedule.startDateSortMoment.unix();
        schedule.finishDateSortTimestamp = schedule.finishDateSortMoment.unix();

        schedule.isStartPrevious = false;
        schedule.isEndNext = false;

        schedule.rootId = null;
        schedule.listChildId = [];

        listData.push(schedule);
      });
    }

    return listData;
  };

  /**
   * Get the smallest day
   * @param ...
   * @returns moment.Moment
   */
  static getMinDay = (...values: moment.Moment | any) => {
    if (values.length) {
      let minDay = values[0];
      for (let i = 1; i < values.length; i++) {
        if (
          (!minDay && values[i]) ||
          (values[i] && minDay && CalenderViewMonthCommon.compareDateByDay(minDay, values[i]) > 0)
        )
          minDay = values[i];
      }
      return minDay;
    }
    return null;
  };

  /**
   * Get the biggest day
   * @param ...
   * @returns moment.Moment
   */
  static getMaxDay = (...values: moment.Moment | any) => {
    if (values.length) {
      let maxDay = values[0];
      for (let i = 1; i < values.length; i++) {
        if (!maxDay && values[i]) maxDay = values[i];
        if (values[i] && maxDay && CalenderViewMonthCommon.compareDateByDay(maxDay, values[i]) < 0)
          maxDay = values[i];
      }
      return maxDay;
    }
    return null;
  };

  /**
   * Update header info
   * @param dayApi
   * @returns DataOfDay
   */
  static initDataOfDay = (date: ApiHeaderDayType) => {
    const dataOfDay = {
      dataHeader: null,
      listSchedule: [],
      listResource: []
    };
    const dataHeader: DataHeader = _.clone(date);
    dataHeader.dateMoment = CalenderViewMonthCommon.utcToLocal(date.date || date.dateByDay)
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
    dataHeader.timestamp = dataHeader.dateMoment.unix();
    dataOfDay.dataHeader = dataHeader;

    return dataOfDay;
  };

  /**
   * Copy data to state of calender month
   * @param oldState : DataOfMonth
   * @param rawData
   *
   * @returns DataOfMonth
   */
  static initDataOfGridMonth = (
    oldState: DataOfMonth,
    apiData: GetDataForCalendarByMonth | GetResourcesForCalendarByMonth,
    insertSchedule: boolean
  ): DataOfMonth => {
    const dateList: ApiHeaderDayType[] = apiData.dateList;
    insertSchedule && (oldState.listWeeksOfSchedule = []);
    !insertSchedule && (oldState.listWeeksOfResource = []);
    const listWeeksInit: DataOfWeek[] = insertSchedule
      ? oldState.listWeeksOfSchedule
      : oldState.listWeeksOfResource;
    // Convert header data
    if (dateList.length > 0) {
      oldState.startDate = CalenderViewMonthCommon.utcToLocal(dateList[0].date)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
      oldState.startTimestamp = oldState.startDate.unix();
      oldState.endDate = CalenderViewMonthCommon.utcToLocal(dateList[dateList.length - 1].date)
        .hour(23)
        .minute(59)
        .second(59)
        .millisecond(0);
      oldState.endTimestamp = oldState.endDate.unix();

      dateList.forEach((date: ApiHeaderDayType, index: number) => {
        if (index % 7 === 0) {
          const startDateOfWeek = CalenderViewMonthCommon.utcToLocal(date.date)
            .hour(0)
            .minute(0)
            .second(0)
            .millisecond(0);
          const endDateOfWeek = CalenderViewMonthCommon.utcToLocal(date.date)
            .add(6, 'days')
            .clone();
          endDateOfWeek
            .hour(23)
            .minute(59)
            .second(59)
            .millisecond(0);
          const dataOfWeek: DataOfWeek = {
            // Start day
            startDate: startDateOfWeek,
            startTimestamp: 0,
            // End date
            endDate: endDateOfWeek,
            endTimestamp: 0,
            refSchedule: {},
            refResource: {},

            listDay: []
          };
          dataOfWeek.startTimestamp = dataOfWeek.startDate.unix();
          dataOfWeek.endTimestamp = dataOfWeek.endDate.unix();
          listWeeksInit.push(dataOfWeek);
        }
        listWeeksInit[listWeeksInit.length - 1].listDay.push(
          CalenderViewMonthCommon.initDataOfDay(date)
        );
      });
    }

    return oldState;
  };

  /**
   * Get the empty sort value in the list
   * @returns number
   */
  static getLastEmptySortIndex = (list: DataOfSchedule[] | DataOfResource[]) => {
    let lastEmptySort = 0;
    if (!list || list.length === 0) return 0;
    // Initialize an array of N elements with a default value of False
    let maxSort = 0;
    list.forEach((e: DataOfSchedule | DataOfResource) => (maxSort = Math.max(maxSort, e.sort)));

    const arrayIndex = new Array(maxSort + 2);
    arrayIndex.fill(false);
    list.forEach((e: DataOfSchedule | DataOfResource) => {
      arrayIndex[e.sort] = true; // If sorted, set true
    });
    lastEmptySort = arrayIndex.findIndex(e => !e);

    return lastEmptySort;
  };

  /**
   * Get end of week in list weeks
   * @returns moment.Moment
   */
  static getEndOfWeek = (date: moment.Moment, listWeeks: DataOfWeek[]) => {
    let endOfWeek: moment.Moment = null;
    const unix = date.unix();
    const indexFind = listWeeks.findIndex(
      (w: DataOfWeek) => w.startTimestamp <= unix && unix <= w.endTimestamp
    );
    if (indexFind > -1) {
      const w: DataOfWeek = listWeeks[indexFind];
      endOfWeek = w.listDay[w.listDay.length - 1].dataHeader.dateMoment;
    }

    return endOfWeek;
  };

  /**
   * Get start of week in list weeks
   * @returns moment.Moment
   */
  static getStartOfWeek = (date: moment.Moment, listWeeks: DataOfWeek[]) => {
    let startOfWeek: moment.Moment = null;
    const unix = date.unix();
    const indexFind = listWeeks.findIndex(
      (w: DataOfWeek) => w.startTimestamp <= unix && unix <= w.endTimestamp
    );
    if (indexFind > -1) {
      const w: DataOfWeek = listWeeks[indexFind];
      startOfWeek = w.listDay[0].dataHeader.dateMoment;
    }

    return startOfWeek;
  };

  /**
   * Get schedule by Id in Week
   * @returns DataOfSchedule
   */
  static getScheduleInWeek = (idObject: string, dataOfWeek: DataOfWeek) => {
    return dataOfWeek.refSchedule[idObject];
  };

  /**
   * Get resource by Id in Week
   * @returns DataOfResource
   */
  static getResourceInWeek = (idObject: string, dataOfWeek: DataOfWeek) => {
    return dataOfWeek.refResource[idObject];
  };

  /**
   * Get schedule by Id in month
   * @returns DataOfSchedule
   */
  static getScheduleInMonth = (idObject: string, dataOfMonth: DataOfMonth): DataOfSchedule => {
    return dataOfMonth.refSchedule[idObject];
  };

  /**
   * Get resource by Id in month
   * @returns DataOfResource
   */
  static getResourceInMonth = (idObject: string, dataOfMonth: DataOfMonth): DataOfResource => {
    return dataOfMonth.refResource[idObject];
  };

  /**
   * Check schedule by Id is Ref in month
   * @returns DataOfSchedule
   */
  static checkScheduleRefInMonth = (
    idObject: string,
    idObjectDragging: string,
    dataOfMonth: DataOfMonth
  ) => {
    const rootData: DataOfSchedule = CalenderViewMonthCommon.getScheduleInMonth(
      idObject,
      dataOfMonth
    );
    const refData: DataOfSchedule = CalenderViewMonthCommon.getScheduleInMonth(
      idObjectDragging,
      dataOfMonth
    );
    const checkChild = (r: DataOfSchedule) => {
      // find ref in list child
      const indexRef = r.listChildId.findIndex(id => id === idObjectDragging);
      return indexRef >= 0;
    };

    if (rootData && refData) {
      if (rootData.uniqueId === refData.uniqueId) return true;

      // if root element
      if (!rootData.rootId) {
        return checkChild(rootData);
      } else {
        const parentData: DataOfSchedule = CalenderViewMonthCommon.getScheduleInMonth(
          rootData.rootId,
          dataOfMonth
        );
        if (parentData && parentData.uniqueId === refData.uniqueId) return true;
        return checkChild(parentData);
      }
    }

    return false;
  };

  /**
   * Check schedule by Id is Ref in month
   * @returns DataOfSchedule
   */
  static checkResourceRefInMonth = (
    idObject: string,
    idObjectDragging: string,
    dataOfMonth: DataOfMonth
  ) => {
    const rootData: DataOfResource = CalenderViewMonthCommon.getResourceInMonth(
      idObject,
      dataOfMonth
    );
    const refData: DataOfResource = CalenderViewMonthCommon.getResourceInMonth(
      idObjectDragging,
      dataOfMonth
    );
    const checkChild = (r: DataOfResource) => {
      // find ref in list child
      const indexRef = r.listChildId.findIndex(id => id === idObjectDragging);
      return indexRef >= 0;
    };

    if (rootData && refData) {
      if (rootData.uniqueId === refData.uniqueId) return true;

      // if root element
      if (!rootData.rootId) {
        return checkChild(rootData);
      } else {
        const parentData: DataOfResource = CalenderViewMonthCommon.getResourceInMonth(
          rootData.rootId,
          dataOfMonth
        );
        return checkChild(parentData);
      }
    }

    return false;
  };

  static getNextScheduleInRef = (objRef, itemId: number, itemType: ItemTypeSchedule) => {
    if (!objRef) return null;
    const keys = Object.keys(objRef);
    if (!keys) return null;
    const checkIdAndTypeAndShow = o => {
      return o.itemType === itemType && o.itemId === itemId && o.isShow;
    };
    const checkNotIdAndTypeAndShow = o => {
      return o.itemType === itemType && o.itemId !== itemId && o.isShow;
    };
    const indexFind = keys.findIndex(k => checkIdAndTypeAndShow(objRef[k]));
    if (indexFind > -1) {
      for (let i = indexFind + 1; i < keys.length; i++) {
        if (objRef[keys[i]] && checkNotIdAndTypeAndShow(objRef[keys[i]])) return objRef[keys[i]];
      }
    }

    return null;
  };

  static getPreviousScheduleInRef = (objRef, itemId: number, itemType: ItemTypeSchedule) => {
    if (!objRef) return null;
    const keys = Object.keys(objRef);
    if (!keys) return null;
    const checkIdAndTypeAndShow = o => {
      return o.itemType === itemType && o.itemId === itemId && o.isShow;
    };
    const checkNotIdAndTypeAndShow = o => {
      return o.itemType === itemType && o.itemId !== itemId && o.isShow;
    };
    const indexFind = keys.findIndex(k => checkIdAndTypeAndShow(objRef[k]));
    if (indexFind > -1) {
      for (let i = indexFind - 1; i > -1; i--) {
        if (objRef[keys[i]] && checkNotIdAndTypeAndShow(objRef[keys[i]])) return objRef[keys[i]];
      }
    }

    return null;
  };

  static getNextSchedule = (
    dataOfMonth: DataOfMonth,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    return CalenderViewMonthCommon.getNextScheduleInRef(dataOfMonth.refSchedule, itemId, itemType);
  };

  static getPreviousSchedule = (
    dataOfMonth: DataOfMonth,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    return CalenderViewMonthCommon.getPreviousScheduleInRef(
      dataOfMonth.refSchedule,
      itemId,
      itemType
    );
  };

  /**
   * Split calculation of weekly over schedules
   * @param listRawData : ScheduleListType[] | ResourceListType[]
   */
  static breakWeek = (
    oldState: DataOfMonth,
    listRawData: DataOfSchedule[] | DataOfResource[],
    insertSchedule: boolean
  ): DataOfSchedule[] | DataOfResource[] => {
    const newListRawData: DataOfSchedule[] | DataOfResource[] = [];
    const insertOverSchedule = (
      s: DataOfSchedule | DataOfResource,
      rootSchedule: DataOfSchedule | DataOfResource
    ) => {
      // Cases schedule starting from the previous month
      s.isStartPrevious =
        CalenderViewMonthCommon.compareDateByDay(oldState.startDate, s.startDateSortMoment) > 0;
      if (s.isStartPrevious) {
        s.startDateSortMoment = CalenderViewMonthCommon.roundDate(oldState.startDate.clone());
        s.startDateSortTimestamp = s.startDateSortMoment.unix();
      }

      const listWeeksProcess: DataOfWeek[] = insertSchedule
        ? oldState.listWeeksOfSchedule
        : oldState.listWeeksOfResource;
      const lastDayInWeek = CalenderViewMonthCommon.getMinDay(
        CalenderViewMonthCommon.getEndOfWeek(s.startDateSortMoment, listWeeksProcess),
        s.finishDateSortMoment,
        oldState.endDate
      );
      const maxDays = Math.abs(
        CalenderViewMonthCommon.getDaysDiff(s.startDateSortMoment, lastDayInWeek)
      );
      s.numOverDay = maxDays + 1;
      newListRawData.push(s);
      if (CalenderViewMonthCommon.compareDateByDay(lastDayInWeek, s.finishDateSortMoment) === 0) {
        return;
      }
      if (CalenderViewMonthCommon.compareDateByDay(lastDayInWeek, oldState.endDate) === 0) {
        if (
          CalenderViewMonthCommon.compareDateByDay(s.finishDateSortMoment, oldState.endDate) > 0
        ) {
          // Cases schedule ends in the next month
          s.isEndNext = true;
          if (s.isEndNext) {
            s.finishDateSortMoment = CalenderViewMonthCommon.roundDate(oldState.endDate.clone());
            s.finishDateSortTimestamp = s.finishDateSortMoment.unix();
          }
        }
        return;
      }
      s.finishDateSortMoment = CalenderViewMonthCommon.roundDate(lastDayInWeek.clone());
      s.finishDateSortTimestamp = s.finishDateSortMoment.unix();

      const nextDay = lastDayInWeek.clone().add(1, 'days');
      const nextOfSchedule: DataOfSchedule | DataOfResource = _.cloneDeep(s);
      nextOfSchedule.uniqueId = UniqueID();
      nextOfSchedule.listChildId = [];
      nextOfSchedule.rootId = rootSchedule.uniqueId;

      nextOfSchedule.startDateSortMoment = CalenderViewMonthCommon.roundDate(nextDay);
      nextOfSchedule.startDateSortTimestamp = nextOfSchedule.startDateSortMoment.unix();

      nextOfSchedule.finishDateSortMoment = CalenderViewMonthCommon.roundDate(
        s.finishDateMoment.clone()
      );
      nextOfSchedule.finishDateSortTimestamp = nextOfSchedule.finishDateSortMoment.unix();

      nextOfSchedule.isShow = true;
      nextOfSchedule.isFirstWeek = true;
      nextOfSchedule.isRoot = false;

      rootSchedule.listChildId.push(nextOfSchedule.uniqueId);

      insertOverSchedule(nextOfSchedule, rootSchedule);
    };

    if (listRawData && listRawData.length > 0) {
      listRawData.forEach((s: DataOfSchedule | DataOfResource) => {
        if (s.isOverDay) {
          insertOverSchedule(s, s);
        } else {
          newListRawData.push(s);
        }
      });
    }

    return newListRawData;
  };

  /**
   * Push schedule to days in week
   * @param dayApi
   */
  static pushScheduleToDays = (
    oldState: DataOfMonth,
    objData: DataOfSchedule | DataOfResource,
    insertSchedule: boolean
  ) => {
    const unix = objData.startDateSortMoment
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .unix();
    const listWeeksProcess: DataOfWeek[] = insertSchedule
      ? oldState.listWeeksOfSchedule
      : oldState.listWeeksOfResource;
    const indexWeek = listWeeksProcess.findIndex(
      weekToFind => weekToFind.startTimestamp <= unix && unix <= weekToFind.endTimestamp
    );
    if (indexWeek < 0) return;
    const week = listWeeksProcess[indexWeek];

    // Find the date to insert data
    const findIndex = week.listDay.findIndex(
      day =>
        CalenderViewMonthCommon.compareDateByDay(
          day.dataHeader.dateMoment,
          objData.startDateSortMoment
        ) === 0
    );
    // const findIndex = week.listDay.findIndex(day => unix === day.dataHeader.timestamp);
    if (findIndex >= 0) {
      const dayFind = week.listDay[findIndex];
      const listData = insertSchedule ? dayFind.listSchedule : dayFind.listResource;
      // Find the position without inserting data
      objData.sort = CalenderViewMonthCommon.getLastEmptySortIndex(listData);
      listData.push(objData);

      // insert ref to object
      if (insertSchedule) {
        oldState.refSchedule[objData.uniqueId] = objData;
        week.refSchedule[objData.uniqueId] = objData;
      } else {
        oldState.refResource[objData.uniqueId] = objData;
        week.refResource[objData.uniqueId] = objData;
      }

      // Where the schedule over another day
      if (objData.isOverDay) {
        objData.isRoot = true;
        // Insert schedule into weekdays
        const lastDayInWeek = CalenderViewMonthCommon.getMinDay(
          objData.finishDateSortMoment,
          CalenderViewMonthCommon.getEndOfWeek(objData.startDateSortMoment, listWeeksProcess)
        );
        objData.finishDateSortMoment = CalenderViewMonthCommon.roundDate(lastDayInWeek);
        objData.finishDateSortTimestamp = objData.finishDateSortMoment.unix();
        const maxDays = Math.abs(
          CalenderViewMonthCommon.getDaysDiff(objData.startDateSortMoment, lastDayInWeek)
        );
        objData.numOverDay = maxDays + 1;

        // add schedule to all days
        for (let i = findIndex + 1; i < findIndex + maxDays + 1 && i < week.listDay.length; i++) {
          const newOfSchedule: DataOfSchedule | DataOfResource = _.clone(objData);
          newOfSchedule.uniqueId = UniqueID();
          newOfSchedule.listChildId = [];
          newOfSchedule.rootId = objData.uniqueId;

          // newOfSchedule.listChild = [];
          newOfSchedule.isShow = false;
          newOfSchedule.isRoot = false;
          // newOfSchedule.startDateSortMoment = CalenderViewMonthCommon.roundDate(week.listDay[i].dataHeader.dateMoment.clone());
          // newOfSchedule.finishDateSortMoment = CalenderViewMonthCommon.roundDate(week.listDay[i].dataHeader.dateMoment.clone());

          // newOfSchedule.startDateSortTimestamp = newOfSchedule.startDateSortMoment.unix();
          // newOfSchedule.finishDateSortTimestamp = newOfSchedule.finishDateSortMoment.unix();

          objData.listChildId.push(newOfSchedule.uniqueId);

          if (insertSchedule) {
            week.listDay[i].listSchedule.push(newOfSchedule);
          } else {
            week.listDay[i].listResource.push(newOfSchedule);
          }

          // insert ref to object
          if (insertSchedule) {
            oldState.refSchedule[newOfSchedule.uniqueId] = newOfSchedule;
            week.refSchedule[newOfSchedule.uniqueId] = newOfSchedule;
          } else {
            oldState.refResource[newOfSchedule.uniqueId] = newOfSchedule;
            week.refResource[newOfSchedule.uniqueId] = newOfSchedule;
          }
        }
      }
    }
  };

  /**
   * Find and remove schedule
   * @param itemId: ID of schedule or Id of task, OR id of milestone OR id of resource
   * @param itemTypeSchedule: type MILESTONE, TASK, SCHEDULE (Resource not itemTypeSchedule )
   */
  static removeScheduleInDay = (dayFind: DataOfDay, itemId: number, itemTypeSchedule?: number) => {
    const listData = dayFind.listSchedule;
    let indexSearch = -1;
    while (
      listData &&
      (indexSearch = listData.findIndex((s: DataOfSchedule) => {
        return s.itemId === itemId && s.itemType === itemTypeSchedule;
      })) > -1
    ) {
      listData.splice(indexSearch, 1);
    }
  };

  /**
   * Find and remove resource
   * @param itemId: ID of schedule or Id of task, OR id of milestone OR id of resource
   * @param itemTypeSchedule: type MILESTONE, TASK, SCHEDULE (Resource not itemTypeSchedule )
   */
  static removeResourceInDay = (dayFind: DataOfDay, itemId: number) => {
    const listData = dayFind.listResource;
    let indexSearch = -1;
    while (
      listData &&
      (indexSearch = listData.findIndex((s: DataOfResource) => {
        return s.resourceId === itemId;
      })) > -1
    ) {
      listData.splice(indexSearch, 1);
    }
  };

  static removeInOnDay = (
    day: DataOfDay,
    itemId: number,
    insertSchedule: boolean,
    itemTypeSchedule?: number
  ) => {
    insertSchedule
      ? CalenderViewMonthCommon.removeScheduleInDay(day, itemId, itemTypeSchedule)
      : CalenderViewMonthCommon.removeResourceInDay(day, itemId);
  };

  /**
   * Find and remove item
   * @param oldState: DataOfMonth
   * @param itemId: ID of schedule or Id of task, OR id of milestone OR id of resource
   * @param insertSchedule : remove schedule or  schedule
   * @param itemTypeSchedule: type MILESTONE, TASK, SCHEDULE (Resource not itemTypeSchedule )
   */
  static removeObject = (
    oldState: DataOfMonth,
    itemId: number,
    insertSchedule: boolean,
    itemTypeSchedule?: number
  ) => {
    const listWeeksProcess: DataOfWeek[] = insertSchedule
      ? oldState.listWeeksOfSchedule
      : oldState.listWeeksOfResource;
    listWeeksProcess.forEach((week: DataOfWeek) => {
      week.listDay.forEach((day: DataOfDay) => {
        CalenderViewMonthCommon.removeInOnDay(day, itemId, insertSchedule, itemTypeSchedule);
      });
    });
  };

  /**
   * Copy data to state of calender month
   * if itemId != null then case update data
   * @param oldState : DataOfMonth
   * @param rawData
   *
   * @returns DataOfMonth
   */
  static buildScheduleOfCalendarMonth = (
    oldDataOfMonth: DataOfMonth,
    apiData: GetDataForCalendarByMonth,
    itemId?: number,
    itemType?: number
  ): DataOfMonth => {
    /**
     * Sort data schedule
     * Refer to No1, sheet [画面レイアウト（予定）] of the file [110201_カレンダー（月表示）.xlsx]
     */
    const dataOfMonth: DataOfMonth = oldDataOfMonth || {
      startDate: null,
      startTimestamp: 0,
      endDate: null,
      endTimestamp: 0,
      refSchedule: {},
      refResource: {},
      listWeeksOfSchedule: [],
      listWeeksOfResource: []
    };

    const insertSchedule = true;
    if (!itemId || itemId < 1) {
      if (apiData && apiData['dateList']) {
        // case update data
        dataOfMonth.refSchedule = {}; // init array data
        // initial data of month with param is date
        CalenderViewMonthCommon.initDataOfGridMonth(dataOfMonth, apiData, insertSchedule);
      }
    } else {
      CalenderViewMonthCommon.removeObject(dataOfMonth, itemId, insertSchedule, itemType);
    }

    if (apiData && apiData['itemList']) {
      // convert data
      let itemList: DataOfSchedule[] = CalenderViewMonthCommon.convertScheduleList(
        apiData['itemList'] || []
      );
      itemList = CalenderViewMonthCommon.breakWeek(dataOfMonth, itemList, insertSchedule);
      // Sort data schedule data
      CalenderViewMonthCommon.sortListScheduleOrResource(itemList);
      // push data to state
      itemList.forEach(schedule => {
        CalenderViewMonthCommon.pushScheduleToDays(dataOfMonth, schedule, insertSchedule);
      });

      // resort in each one day
      dataOfMonth.listWeeksOfSchedule.forEach(week => {
        week.listDay.forEach(day => {
          day.listSchedule.sort((a, b) => a.sort - b.sort);
        });
      });
    }

    return dataOfMonth;
  };

  /**
   * Copy data to state of calender month
   * @param oldState : DataOfMonth
   * @param rawData
   *
   * @returns DataOfMonth
   */
  static buildResourceOfCalendarMonth = (
    oldDataOfMonth: DataOfMonth,
    apiData: GetResourcesForCalendarByMonth,
    itemId?: number
  ): DataOfMonth => {
    /**
     * Sort data schedule
     * Refer to No1, sheet [画面レイアウト（予定）] of the file [110201_カレンダー（月表示）.xlsx]
     */
    const dataOfMonth: DataOfMonth = oldDataOfMonth || {
      startDate: null,
      startTimestamp: 0,
      endDate: null,
      endTimestamp: 0,
      refSchedule: {},
      refResource: {},
      listWeeksOfSchedule: [],
      listWeeksOfResource: []
    };

    const insertSchedule = false;
    if (!itemId || itemId < 1) {
      if (apiData && apiData['dateList']) {
        dataOfMonth.refResource = {}; // init array data
        // initial data of month with param is date
        CalenderViewMonthCommon.initDataOfGridMonth(dataOfMonth, apiData, insertSchedule);
      }
    } else {
      CalenderViewMonthCommon.removeObject(dataOfMonth, itemId, insertSchedule);
    }

    if (apiData && apiData['resourceList']) {
      // convert data
      let itemList: DataOfResource[] = CalenderViewMonthCommon.convertScheduleList(
        apiData['resourceList'] || []
      );
      itemList = CalenderViewMonthCommon.breakWeek(dataOfMonth, itemList, insertSchedule);
      // Sort data schedule data
      CalenderViewMonthCommon.sortListScheduleOrResource(itemList);
      // push data to state
      itemList.forEach(schedule => {
        CalenderViewMonthCommon.pushScheduleToDays(dataOfMonth, schedule, insertSchedule);
      });

      // resort in each one day
      dataOfMonth.listWeeksOfResource.forEach(week => {
        week.listDay.forEach(day => {
          day.listResource.sort((a, b) => a.sort - b.sort);
        });
      });
    }

    return dataOfMonth;
  };
}

export class CalenderViewWeekCommon {
  static getNextSchedule = (
    dataOfWeek: DataOfDetailWeek,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    return CalenderViewMonthCommon.getNextScheduleInRef(dataOfWeek.refSchedule, itemId, itemType);
  };

  static getPreviousSchedule = (
    dataOfWeek: DataOfDetailWeek,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    return CalenderViewMonthCommon.getPreviousScheduleInRef(
      dataOfWeek.refSchedule,
      itemId,
      itemType
    );
  };

  /**
   * Copy data to state of calender month
   * @param dataOfWeek: DataOfDetailWeek
   * @param apiData: GetDataForCalendarByWeek | GetResourcesForCalendarByWeek
   */
  static initDataOfGridWeek = (
    dataOfWeek: DataOfDetailWeek,
    dateList: ApiHeaderDayType[],
    insertSchedule: boolean
  ) => {
    // const dateList: ApiHeaderDayType[] = apiData.dayListInWeek;
    // Convert header data
    if (insertSchedule) {
      dataOfWeek.listHourSchedule = [];
      dataOfWeek.fullDaySchedule = [];
    } else {
      dataOfWeek.listHourResource = [];
      dataOfWeek.fullDayResource = [];
    }
    const listHour = insertSchedule ? dataOfWeek.listHourSchedule : dataOfWeek.listHourResource;
    const fullDay = insertSchedule ? dataOfWeek.fullDaySchedule : dataOfWeek.fullDayResource;
    if (dateList.length > 0) {
      dataOfWeek.startDate = CalenderViewMonthCommon.utcToLocal(
        dateList[0].date || dateList[0].dateByDay
      )
        .clone()
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
      dataOfWeek.startTimestamp = dataOfWeek.startDate.unix();
      dataOfWeek.endDate = CalenderViewMonthCommon.utcToLocal(
        dateList[dateList.length - 1].date || dateList[dateList.length - 1].dateByDay
      )
        .clone()
        .hour(23)
        .minute(59)
        .second(59)
        .millisecond(0);
      dataOfWeek.endTimestamp = dataOfWeek.endDate.unix();
      for (let i = dataOfWeek.startHour; i <= dataOfWeek.endHour; i++) {
        const startHourDate = dataOfWeek.startDate
          .clone()
          .hours(i)
          .minutes(0)
          .seconds(0)
          .milliseconds(0);
        const endHourDate = dataOfWeek.startDate
          .clone()
          .hours(i)
          .minutes(59)
          .seconds(0)
          .milliseconds(0);
        const hourOfDay: HourOfDay = {
          // Start time
          startHour: startHourDate,
          startMinute: i * 60,
          // End time
          endHour: endHourDate,
          endMinute: i * 60 + 59,
          listDay: []
        };
        listHour.push(hourOfDay);
      }

      dateList.forEach((date: ApiHeaderDayType, index: number) => {
        fullDay.push(CalenderViewMonthCommon.initDataOfDay(date));
        listHour.forEach(h => {
          const cloneObj: DataOfDay = CalenderViewMonthCommon.initDataOfDay(date);
          cloneObj.dataHeader.dateMoment
            .hour(h.startHour.hour())
            .minute(0)
            .second(0)
            .millisecond(0);
          h.listDay.push(cloneObj);
        });
      });
    }
  };

  /**
   * Push schedule to days in week
   * @param dayApi
   */
  static pushScheduleFullDay = (
    oldState: DataOfDetailWeek,
    objData: DataOfSchedule | DataOfResource,
    insertSchedule: boolean
  ) => {
    const unixStart = objData.startDateSortMoment
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .unix();
    const unixEnd = objData.finishDateSortMoment
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .unix();

    // Cases schedule starting from the previous month
    objData.isStartPrevious = objData.isOverDay && unixStart < oldState.startTimestamp;
    if (objData.isStartPrevious) {
      objData.startDateSortMoment = oldState.startDate.clone();
      objData.startDateSortTimestamp = objData.startDateSortMoment.unix();
    }

    objData.isEndNext = objData.isOverDay && unixEnd > oldState.endTimestamp;
    if (objData.isEndNext) {
      objData.finishDateSortMoment = oldState.endDate.clone();
      objData.finishDateSortTimestamp = objData.finishDateSortMoment.unix();
    }

    // Find the date to insert data
    // const findIndex = week.listDay.findIndex(day => CalenderViewMonthCommon.compareDateByDay(day.dataHeader.dateMoment, objData.startDateSortMoment) === 0);
    const fullDay = insertSchedule ? oldState.fullDaySchedule : oldState.fullDayResource;
    // const findIndex = fullDay.findIndex(
    //   day => objData.startDateSortTimestamp === day.dataHeader.timestamp
    // );
    const findIndex = fullDay.findIndex(
      day =>
        CalenderViewMonthCommon.compareDateByDay(
          objData.startDateSortMoment,
          day.dataHeader.dateMoment
        ) === 0
    );

    if (findIndex >= 0) {
      const dayFind = fullDay[findIndex];
      const listData = insertSchedule ? dayFind.listSchedule : dayFind.listResource;

      // Find the position without inserting data
      objData.sort = CalenderViewMonthCommon.getLastEmptySortIndex(listData);
      listData.push(objData);

      // insert ref to object
      insertSchedule
        ? (oldState.refSchedule[objData.uniqueId] = objData)
        : (oldState.refResource[objData.uniqueId] = objData);

      // Where the schedule over another day
      if (objData.isOverDay) {
        objData.isRoot = true;
        // Insert schedule into weekdays
        const lastDayInWeek = CalenderViewMonthCommon.getMinDay(
          objData.finishDateSortMoment,
          oldState.endDate
        );
        objData.finishDateSortMoment = lastDayInWeek;
        objData.finishDateSortTimestamp = objData.finishDateSortMoment.unix();
        const maxDays = Math.abs(
          CalenderViewMonthCommon.getDaysDiff(objData.startDateSortMoment, lastDayInWeek)
        );
        objData.numOverDay = maxDays + 1;

        // add schedule to all days
        for (let i = findIndex + 1; i < findIndex + maxDays + 1 && i < fullDay.length; i++) {
          const newOfSchedule: DataOfSchedule | DataOfResource = _.cloneDeep(objData);
          newOfSchedule.uniqueId = UniqueID();
          newOfSchedule.listChildId = [];
          newOfSchedule.rootId = objData.uniqueId;

          newOfSchedule.isShow = false;
          newOfSchedule.isRoot = false;
          newOfSchedule.startDateSortMoment = fullDay[i].dataHeader.dateMoment.clone();
          newOfSchedule.finishDateSortMoment = fullDay[i].dataHeader.dateMoment.clone();

          newOfSchedule.startDateSortTimestamp = newOfSchedule.startDateSortMoment.unix();
          newOfSchedule.finishDateSortTimestamp = newOfSchedule.finishDateSortMoment.unix();

          newOfSchedule.isRoot = false;
          objData.listChildId.push(newOfSchedule.uniqueId);

          if (insertSchedule) {
            fullDay[i].listSchedule.push(newOfSchedule);
          } else {
            fullDay[i].listResource.push(newOfSchedule);
          }

          // insert ref to object
          insertSchedule
            ? (oldState.refSchedule[objData.uniqueId] = newOfSchedule)
            : (oldState.refResource[objData.uniqueId] = newOfSchedule);
        }
      }
    }
  };

  /**
   * Push schedule to days in week
   * @param dayApi
   */
  static pushScheduleInDay = (
    oldState: DataOfDetailWeek,
    objData: DataOfSchedule | DataOfResource,
    insertSchedule: boolean
  ) => {
    // Cases schedule starting from the previous hour
    objData.isStartPrevious = objData.startDateSortMoment.hour() < oldState.startHour;
    if (objData.isStartPrevious) {
      objData.startDateSortMoment.hour(oldState.startHour).minute(0); // reset hour = startHour of view
      objData.startDateSortTimestamp = objData.startDateSortMoment.unix();
    }

    const startMinute = CalenderViewMonthCommon.convertDateToMinute(objData.startDateSortMoment);

    // Where the object is outside the display area
    if (CalenderViewMonthCommon.compareDateByDay(objData.startDateMoment, oldState.endDate) > 0)
      return;
    if (CalenderViewMonthCommon.compareDateByDay(objData.finishDateMoment, oldState.startDate) < 0)
      return;
    // if (objData.startDateMoment.unix() > oldState.endTimestamp) return;
    // if (objData.finishDateMoment.unix() < oldState.startTimestamp) return;

    const fullDay = insertSchedule ? oldState.fullDaySchedule : oldState.fullDayResource;
    const listHour = insertSchedule ? oldState.listHourSchedule : oldState.listHourResource;
    const lengthListHour = listHour.length;
    const indexHour = listHour.findIndex(
      (hourToFind: HourOfDay) =>
        hourToFind.startMinute <= startMinute && startMinute <= hourToFind.endMinute
    );
    if (indexHour < 0) return;
    const hour: HourOfDay = listHour[indexHour];

    // Find the date to insert data
    const findDayIndex = fullDay.findIndex(day => {
      return (
        CalenderViewMonthCommon.compareDateByDay(
          day.dataHeader.dateMoment,
          objData.startDateSortMoment
        ) === 0
      );
    });
    // const findIndex = week.listDay.findIndex(day => unix === day.dataHeader.timestamp);

    if (findDayIndex >= 0) {
      const dayFind = hour.listDay[findDayIndex];
      const listData = insertSchedule ? dayFind.listSchedule : dayFind.listResource;
      // Find the position without inserting data
      // objData.sort = CalenderViewMonthCommon.getLastEmptySortIndex(listData);
      listData.push(objData);

      // insert ref to object
      insertSchedule
        ? (oldState.refSchedule[objData.uniqueId] = objData)
        : (oldState.refResource[objData.uniqueId] = objData);

      // if the end time over the end time
      const lastHearInHour: moment.Moment =
        listHour[lengthListHour - 1].listDay[findDayIndex].dataHeader.dateMoment;
      const convertMinuteOfStart = CalenderViewMonthCommon.convertDateToMinute(
        objData.startDateSortMoment
      );
      const convertMinuteOfEnd = CalenderViewMonthCommon.convertDateToMinute(
        objData.finishDateMoment
      );
      const convertMinuteOfLast = CalenderViewMonthCommon.convertDateToMinute(lastHearInHour) + 59;
      const maxEndMinute = Math.min(convertMinuteOfEnd, convertMinuteOfLast);
      if (convertMinuteOfEnd > convertMinuteOfLast) {
        objData.isEndNext = true;
        objData.finishDateSortMoment = lastHearInHour.clone().minute(59);
        objData.finishDateSortTimestamp = objData.finishDateSortMoment.unix();
      }
      // objData.numOverDay = maxEndMinute - convertMinuteOfStart; // over number Minute
      objData.height = maxEndMinute - convertMinuteOfStart; // over number Minute
    }
  };

  static calculateMaxWidthOfDay = (
    oldState: DataOfDetailWeek,
    indexDay: number,
    insertSchedule: boolean
  ) => {
    const listMinute = Array(24 * 60 + 60);
    for (let i = 0; i < listMinute.length; i++) {
      listMinute[i] = [];
    }

    const extendCol = (m: number, num: number) => {
      if (listMinute[m].length < num) {
        for (let j = 0; listMinute[m].length < num; j++) {
          listMinute[m].push(null);
        }
      }
    };

    const insertToListMinute = (s: DataOfSchedule | DataOfResource) => {
      const startMinute = CalenderViewMonthCommon.convertDateToMinute(s.startDateSortMoment);
      const endMinute = CalenderViewMonthCommon.convertDateToMinute(s.finishDateSortMoment);

      const positionEmpty = listMinute[startMinute].findIndex(
        (e: DataOfSchedule | DataOfResource) => !e
      );
      const maxScheduleStartTime = listMinute[startMinute].length;
      // Find position without data
      if (positionEmpty > -1) {
        for (let i = startMinute; i < endMinute; i++) {
          extendCol(i, positionEmpty + 1);
          listMinute[i][positionEmpty] = s;
        }
      } else {
        for (let i = startMinute; i < endMinute; i++) {
          extendCol(i, maxScheduleStartTime);
          listMinute[i].push(s);
        }
      }
    };
    const listHour = insertSchedule ? oldState.listHourSchedule : oldState.listHourResource;
    listHour.forEach(h => {
      const day = h.listDay[indexDay];
      const listData = insertSchedule ? day.listSchedule : day.listResource;
      listData.forEach((s: DataOfSchedule | DataOfResource) => {
        insertToListMinute(s);
      });
    });

    const aryIsSetWidth = [];
    const setLeftWidthOfSchedule = (s: DataOfSchedule | DataOfResource) => {
      const startMinute = CalenderViewMonthCommon.convertDateToMinute(s.startDateSortMoment);
      const endMinute = CalenderViewMonthCommon.convertDateToMinute(s.finishDateSortMoment);
      if (!listMinute[startMinute]) {
        // console.log('listMinute[startMinute] = undefined', listMinute, s)
        return;
      }

      const indexInListMinute = listMinute[startMinute].findIndex(
        (e: DataOfSchedule | DataOfResource) => {
          if (!e) return false;
          return e['uniqueId'] === s['uniqueId'];
        }
      );
      let totalScheduleRight = 1;
      for (let i = startMinute; i < endMinute; i++) {
        totalScheduleRight = Math.max(totalScheduleRight, listMinute[i].length - indexInListMinute);
      }
      let leftWidth = 0;
      if (indexInListMinute > 0) {
        leftWidth =
          listMinute[startMinute][indexInListMinute - 1].left +
          listMinute[startMinute][indexInListMinute - 1].width;
      }
      // for (let i = 0; i < indexInListMinute; i++) {
      //   leftWidth += listMinute[startMinute][i].width;
      // }
      s.left = leftWidth;
      let checkNextSetWidth = false;
      if (indexInListMinute < listMinute[startMinute].length - 1 && indexInListMinute > -1) {
        checkNextSetWidth =
          aryIsSetWidth.findIndex(
            (e: DataOfSchedule | DataOfResource) =>
              e === listMinute[startMinute][indexInListMinute + 1]
          ) > -1;
      }
      if (checkNextSetWidth === false) {
        s.width = parseFloat(((100 - leftWidth) / totalScheduleRight).toFixed(4));
      } else {
        s.width =
          listMinute[startMinute][indexInListMinute + 1].left -
          listMinute[startMinute][indexInListMinute].left;
      }

      aryIsSetWidth.push(s);
    };

    listHour.forEach(h => {
      const day = h.listDay[indexDay];
      const listData = insertSchedule ? day.listSchedule : day.listResource;
      listData.forEach((s: DataOfSchedule | DataOfResource) => {
        setLeftWidthOfSchedule(s);
      });
    });
  };

  /**
   * Calculate the maximum width for the object
   */
  static calculateMaxWidth = (oldState: DataOfDetailWeek, insertSchedule: boolean) => {
    const listHour = insertSchedule ? oldState.listHourSchedule : oldState.listHourResource;
    const listDay = listHour && listHour[0] ? listHour[0].listDay : [];
    // type typeSort = [];
    listDay.forEach((day: DataOfDay, indexDay: number) => {
      CalenderViewWeekCommon.calculateMaxWidthOfDay(oldState, indexDay, insertSchedule);
    });
  };

  /**
   * Find and remove item
   * @param oldState: DataOfDetailWeek
   * @param itemId: ID of schedule or Id of task, OR id of milestone OR id of resource
   * @param insertSchedule : remove schedule or  schedule
   * @param itemTypeSchedule: type MILESTONE, TASK, SCHEDULE (Resource not itemTypeSchedule )
   */
  static removeObject = (
    oldState: DataOfDetailWeek,
    itemId: number,
    insertSchedule: boolean,
    itemTypeSchedule?: number
  ) => {
    const listFullDay: DataOfDay[] = insertSchedule
      ? oldState.fullDaySchedule
      : oldState.fullDayResource;
    const listHour: HourOfDay[] = insertSchedule
      ? oldState.listHourSchedule
      : oldState.listHourResource;

    listFullDay.forEach((day: DataOfDay) => {
      CalenderViewMonthCommon.removeInOnDay(day, itemId, insertSchedule, itemTypeSchedule);
    });

    listHour.forEach((hour: HourOfDay) => {
      hour.listDay.forEach((day: DataOfDay) => {
        CalenderViewMonthCommon.removeInOnDay(day, itemId, insertSchedule, itemTypeSchedule);
      });
    });
  };

  /**
   * Sort data schedule or Resource
   * Refer to No1, sheet [画面レイアウト（予定）] of the file [110201_カレンダー（月表示）.xlsx]
   */
  static sortListScheduleOrResource = (listData: DataOfSchedule[] | DataOfResource[]) => {
    if (listData) {
      listData.sort((a: DataOfSchedule | DataOfResource, b: DataOfSchedule | DataOfResource) => {
        const diffStart = a.startDateSortTimestamp - b.startDateSortTimestamp; // CalenderViewMonthCommon.compareDateByDay(a.startDateSortMoment, b.startDateSortMoment);
        // a.start < b.start || a.start > b.start
        if (diffStart !== 0) return diffStart;

        // case a.start = b.start
        const diffEnd = a.finishDateSortTimestamp - b.finishDateSortTimestamp; // CalenderViewMonthCommon.compareDateByDay(a.finishDateSortMoment, b.finishDateSortMoment);
        // a.end < b.end || a.end > b.end
        if (diffEnd !== 0) return diffEnd;

        // case a.start = b.start AND a.end = b.end
        if (a['itemType']) {
          /**
           * case sort ScheduleListType
           * - 1: milestone
           * - 2: task
           * - 3: schedule
           */
          return a['itemType'] - b['itemType'];
        }

        if (a['itemId']) {
          return a['itemId'] - b['itemId'];
        }

        if (a['resourceId']) {
          return a['resourceId'] - b['resourceId'];
        }

        return 0;
      });
    }
  };

  /**
   * Copy data to state of calender week
   * @param oldState : DataOfDetailWeek
   * @param rawData
   *
   * @returns DataOfDetailWeek
   */
  static buildScheduleOfCalendarWeek = (
    oldDataOfWeek: DataOfDetailWeek,
    apiData: GetDataForCalendarByWeek,
    sHour: number,
    eHour: number,
    itemId?: number,
    itemType?: number
  ): DataOfDetailWeek => {
    /**
     * Sort data schedule
     * Refer to No1, sheet [画面レイアウト（予定）] of the file [110201_カレンダー（月表示）.xlsx]
     */
    const dataOfWeek: DataOfDetailWeek = oldDataOfWeek || {
      startDate: null,
      startTimestamp: 0,
      endDate: null,
      endTimestamp: 0,

      startHour: sHour,
      endHour: eHour,

      refSchedule: {},
      refResource: {},

      fullDaySchedule: [],
      fullDayResource: [],
      listHourSchedule: [],
      listHourResource: []
    };
    dataOfWeek.startHour = sHour;
    dataOfWeek.endHour = eHour;

    const insertSchedule = true;
    const listFullDaySchedule: DataOfSchedule[] = [];
    const listHourSchedule: DataOfSchedule[] = [];

    if (!itemId || itemId < 1) {
      if (apiData && apiData['dayListInWeek']) {
        // initial data of month with param is date
        CalenderViewWeekCommon.initDataOfGridWeek(
          dataOfWeek,
          apiData['dayListInWeek'] || [],
          insertSchedule
        );
      }
    } else {
      // case update data
      CalenderViewWeekCommon.removeObject(dataOfWeek, itemId, insertSchedule, itemType);
    }

    if (apiData && apiData['itemList']) {
      // convert data
      const itemList: DataOfSchedule[] = CalenderViewMonthCommon.convertScheduleList(
        apiData['itemList'] || []
      );

      // Data classification
      itemList.forEach(schedule => {
        if (schedule.itemType !== 3) {
          listFullDaySchedule.push(schedule);
        } else {
          if (schedule.isOverDay || schedule['isFullDay']) {
            listFullDaySchedule.push(schedule);
          } else {
            listHourSchedule.push(schedule);
          }
        }
      });

      // sort data full days
      CalenderViewMonthCommon.sortListScheduleOrResource(listFullDaySchedule);
      listFullDaySchedule.forEach(schedule => {
        CalenderViewWeekCommon.pushScheduleFullDay(dataOfWeek, schedule, insertSchedule);
      });
      dataOfWeek.fullDaySchedule.forEach(day => {
        day.listSchedule.sort((a, b) => a.sort - b.sort);
      });

      // Processing Data in day
      // sort schedule in day
      CalenderViewWeekCommon.sortListScheduleOrResource(listHourSchedule);

      // push data to state
      listHourSchedule.forEach(schedule => {
        CalenderViewWeekCommon.pushScheduleInDay(dataOfWeek, schedule, insertSchedule);
      });

      CalenderViewWeekCommon.calculateMaxWidth(dataOfWeek, insertSchedule);
    }

    return dataOfWeek;
  };

  /**
   * Copy data to state of calender week
   * @param oldState : DataOfDetailWeek
   * @param rawData
   *
   * @returns DataOfDetailWeek
   */
  static buildResourceOfCalendarWeek = (
    oldDataOfWeek: DataOfDetailWeek,
    apiData: GetResourcesForCalendarByWeek,
    sHour: number,
    eHour: number,
    itemId?: number
  ): DataOfDetailWeek => {
    /**
     * Sort data schedule
     * Refer to No1, sheet [画面レイアウト（予定）] of the file [110201_カレンダー（月表示）.xlsx]
     */
    const dataOfWeek: DataOfDetailWeek = oldDataOfWeek || {
      startDate: null,
      startTimestamp: 0,
      endDate: null,
      endTimestamp: 0,

      startHour: sHour,
      endHour: eHour,

      refSchedule: {},
      refResource: {},

      fullDaySchedule: [],
      fullDayResource: [],
      listHourSchedule: [],
      listHourResource: []
    };

    dataOfWeek.startHour = sHour;
    dataOfWeek.endHour = eHour;

    const insertSchedule = false;
    const listFullDaySchedule: DataOfResource[] = [];
    const listHourSchedule: DataOfResource[] = [];

    if (!itemId || itemId < 1) {
      if (apiData && apiData['dayListInWeek']) {
        // initial data of month with param is date
        CalenderViewWeekCommon.initDataOfGridWeek(
          dataOfWeek,
          apiData['dayListInWeek'] || [],
          insertSchedule
        );
      }
    } else {
      CalenderViewWeekCommon.removeObject(dataOfWeek, itemId, insertSchedule);
    }

    if (apiData && apiData['resourceList']) {
      // convert data
      const itemList: DataOfResource[] = CalenderViewMonthCommon.convertScheduleList(
        apiData['resourceList'] || []
      );

      // Data classification
      itemList.forEach(schedule => {
        if (schedule.isOverDay || schedule['isFullDay']) {
          listFullDaySchedule.push(schedule);
        } else {
          listHourSchedule.push(schedule);
        }
      });

      // sort data full days
      CalenderViewMonthCommon.sortListScheduleOrResource(listFullDaySchedule);
      listFullDaySchedule.forEach(schedule => {
        CalenderViewWeekCommon.pushScheduleFullDay(dataOfWeek, schedule, insertSchedule);
      });
      dataOfWeek.fullDayResource.forEach(day => {
        day.listResource.sort((a, b) => a.sort - b.sort);
      });

      // Processing Data in day
      // sort schedule in day
      CalenderViewWeekCommon.sortListScheduleOrResource(listHourSchedule);

      // push data to state
      listHourSchedule.forEach(schedule => {
        CalenderViewWeekCommon.pushScheduleInDay(dataOfWeek, schedule, insertSchedule);
      });

      CalenderViewWeekCommon.calculateMaxWidth(dataOfWeek, insertSchedule);
    }

    return dataOfWeek;
  };
}

export class CalenderViewWeekDay {
  static getNextSchedule = (
    dataOfDay: DataOfDetailWeek,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    return CalenderViewMonthCommon.getNextScheduleInRef(dataOfDay.refSchedule, itemId, itemType);
  };

  static getPreviousSchedule = (
    dataOfDay: DataOfDetailWeek,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    return CalenderViewMonthCommon.getPreviousScheduleInRef(
      dataOfDay.refSchedule,
      itemId,
      itemType
    );
  };

  static classificationSchedule = (
    listFullDaySchedule: ScheduleListType[] | ResourceListType[],
    listHourSchedule: ScheduleListType[] | ResourceListType[],
    schedule: ScheduleListType | ResourceListType
  ) => {
    // Resource
    if (schedule['resourceId'] !== undefined) {
      if (schedule.isOverDay || schedule['isFullDay']) {
        listFullDaySchedule.push(schedule);
      } else {
        listHourSchedule.push(schedule);
      }
    } else {
      if (!NVL(schedule['itemType']) && schedule['itemType'] !== 3) {
        listFullDaySchedule.push(schedule);
      } else {
        if (schedule.isOverDay || schedule['isFullDay']) {
          listFullDaySchedule.push(schedule);
        } else {
          listHourSchedule.push(schedule);
        }
      }
    }
  };

  /**
   * Copy data to state of calender day
   * @param oldState : DataOfDetailWeek
   * @param rawData
   *
   * @returns DataOfDetailWeek
   */
  static buildScheduleOfCalendarDay = (
    oldDataOfWeek: DataOfDetailWeek,
    apiData: GetDataForCalendarByDay,
    dateSearch: moment.Moment,
    sHour: number,
    eHour: number,
    itemId?: number,
    itemType?: number
  ): DataOfDetailWeek => {
    /**
     * Sort data schedule
     * Refer to No1, sheet [画面レイアウト（予定）] of the file [110201_カレンダー（月表示）.xlsx]
     */
    const dataOfWeek: DataOfDetailWeek = oldDataOfWeek || {
      startDate: null,
      startTimestamp: 0,
      endDate: null,
      endTimestamp: 0,

      startHour: sHour,
      endHour: eHour,

      refSchedule: {},
      refResource: {},

      fullDaySchedule: [],
      fullDayResource: [],
      listHourSchedule: [],
      listHourResource: []
    };

    dataOfWeek.startHour = sHour;
    dataOfWeek.endHour = eHour;

    const insertSchedule = true;
    const listFullDaySchedule: DataOfSchedule[] = [];
    const listHourSchedule: DataOfSchedule[] = [];

    if (!itemId || itemId < 1) {
      if (apiData) {
        const deaderInfo: ApiHeaderDayType = apiData;
        deaderInfo.date = dateSearch.clone(); // .date(apiData.dateByDay);
        const dateList: ApiHeaderDayType[] = [deaderInfo];
        // initial data of month with param is date
        CalenderViewWeekCommon.initDataOfGridWeek(dataOfWeek, dateList, insertSchedule);
      }
    } else {
      // case update data
      CalenderViewWeekCommon.removeObject(dataOfWeek, itemId, insertSchedule, itemType);
    }

    if (apiData) {
      // convert data
      const itemList: DataOfSchedule[] = CalenderViewMonthCommon.convertScheduleList(
        apiData['itemList'] || []
      );

      // Data classification
      itemList.forEach(schedule => {
        CalenderViewWeekDay.classificationSchedule(listFullDaySchedule, listHourSchedule, schedule);
      });

      // sort data full days
      CalenderViewMonthCommon.sortListScheduleOrResource(listFullDaySchedule);
      listFullDaySchedule.forEach(schedule => {
        CalenderViewWeekCommon.pushScheduleFullDay(dataOfWeek, schedule, insertSchedule);
      });
      dataOfWeek.fullDaySchedule.forEach(day => {
        day.listSchedule.sort((a, b) => a.sort - b.sort);
      });

      // Processing Data in day
      // sort schedule in day
      CalenderViewWeekCommon.sortListScheduleOrResource(listHourSchedule);

      // push data to state
      listHourSchedule.forEach(schedule => {
        CalenderViewWeekCommon.pushScheduleInDay(dataOfWeek, schedule, insertSchedule);
      });

      CalenderViewWeekCommon.calculateMaxWidth(dataOfWeek, insertSchedule);
    }

    return dataOfWeek;
  };

  /**
   * Copy data to state of calender day
   * @param oldState : DataOfDetailWeek
   * @param rawData
   *
   * @returns DataOfDetailWeek
   */
  static buildResourceOfCalendarDay = (
    oldDataOfWeek: DataOfDetailWeek,
    apiData: GetResourcesForCalendarByDay,
    dateSearch: moment.Moment,
    sHour: number,
    eHour: number,
    itemId?: number
  ): DataOfDetailWeek => {
    /**
     * Sort data schedule
     * Refer to No1, sheet [画面レイアウト（予定）] of the file [110201_カレンダー（月表示）.xlsx]
     */
    const dataOfWeek: DataOfDetailWeek = oldDataOfWeek || {
      startDate: null,
      startTimestamp: 0,
      endDate: null,
      endTimestamp: 0,

      startHour: sHour,
      endHour: eHour,

      refSchedule: {},
      refResource: {},

      fullDaySchedule: [],
      fullDayResource: [],
      listHourSchedule: [],
      listHourResource: []
    };

    dataOfWeek.startHour = sHour;
    dataOfWeek.endHour = eHour;

    const insertSchedule = false;
    const listFullDaySchedule: DataOfResource[] = [];
    const listHourSchedule: DataOfResource[] = [];

    if (!itemId || itemId < 1) {
      if (apiData) {
        const deaderInfo: ApiHeaderDayType = apiData;
        deaderInfo.date = dateSearch.clone(); // .date(apiData.dateByDay);
        const dateList: ApiHeaderDayType[] = [deaderInfo];
        // initial data of month with param is date
        CalenderViewWeekCommon.initDataOfGridWeek(dataOfWeek, dateList, insertSchedule);
      }
    } else {
      CalenderViewWeekCommon.removeObject(dataOfWeek, itemId, insertSchedule);
    }

    if (apiData) {
      // convert data
      const itemList: DataOfResource[] = CalenderViewMonthCommon.convertScheduleList(
        apiData['resourceList'] || []
      );

      // Data classification
      itemList.forEach(schedule => {
        CalenderViewWeekDay.classificationSchedule(listFullDaySchedule, listHourSchedule, schedule);
      });

      // sort data full days
      CalenderViewMonthCommon.sortListScheduleOrResource(listFullDaySchedule);
      listFullDaySchedule.forEach(schedule => {
        CalenderViewWeekCommon.pushScheduleFullDay(dataOfWeek, schedule, insertSchedule);
      });
      dataOfWeek.fullDayResource.forEach(day => {
        day.listSchedule.sort((a, b) => a.sort - b.sort);
      });

      // Processing Data in day
      // sort schedule in day
      CalenderViewWeekCommon.sortListScheduleOrResource(listHourSchedule);

      // push data to state
      listHourSchedule.forEach(schedule => {
        CalenderViewWeekCommon.pushScheduleInDay(dataOfWeek, schedule, insertSchedule);
      });

      CalenderViewWeekCommon.calculateMaxWidth(dataOfWeek, insertSchedule);
    }

    return dataOfWeek;
  };
}

export class CalenderViewWeekList {
  static getNextSchedule = (
    dataOfList: DataOfViewList,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    if (!dataOfList.dataSchedule || !dataOfList.dataSchedule.listDay) return null;
    const sFind: DataOfSchedule = null;
    const checkIdAndTypeAndShow = (o: DataOfSchedule) => {
      return o.itemType === itemType && o.itemId === itemId && o.isShow;
    };
    const checkNotIdAndTypeAndShow = (o: DataOfSchedule) => {
      return o.itemType === itemType && o.itemId !== itemId && o.isShow;
    };

    for (let index = 0; index < dataOfList.dataSchedule.listDay.length; index++) {
      const d: DataOfDay = dataOfList.dataSchedule.listDay[index];
      if (d.listSchedule) {
        const indexFind = d.listSchedule.findIndex((s: DataOfSchedule) => checkIdAndTypeAndShow(s));
        if (indexFind > -1) {
          for (let i = indexFind + 1; i < d.listSchedule.length; i++) {
            if (checkNotIdAndTypeAndShow(d.listSchedule[i])) {
              return d.listSchedule[i];
            }
          }
        }
      }
    }
    return sFind;
  };

  static getPreviousSchedule = (
    dataOfList: DataOfViewList,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    if (!dataOfList.dataSchedule || !dataOfList.dataSchedule.listDay) return null;
    const sFind: DataOfSchedule = null;
    const checkIdAndTypeAndShow = (o: DataOfSchedule) => {
      return o.itemType === itemType && o.itemId === itemId && o.isShow;
    };
    const checkNotIdAndTypeAndShow = (o: DataOfSchedule) => {
      return o.itemType === itemType && o.itemId !== itemId && o.isShow;
    };

    for (let index = 0; index < dataOfList.dataSchedule.listDay.length; index++) {
      const d: DataOfDay = dataOfList.dataSchedule.listDay[index];
      if (d.listSchedule) {
        const indexFind = d.listSchedule.findIndex((s: DataOfSchedule) => checkIdAndTypeAndShow(s));
        if (indexFind > -1) {
          for (let i = indexFind - 1; i > -1; i--) {
            if (checkNotIdAndTypeAndShow(d.listSchedule[i])) {
              return d.listSchedule[i];
            }
          }
        }
      }
    }
    return sFind;
  };

  /**
   * Sort data schedule or Resource
   * Refer to No1, sheet [画面レイアウト（予定）] of the file [110201_カレンダー（月表示）.xlsx]
   */
  static sortListScheduleOrResource = (listData: DataOfSchedule[] | DataOfResource[]) => {
    if (listData) {
      listData.sort((a: DataOfSchedule | DataOfResource, b: DataOfSchedule | DataOfResource) => {
        let itemType = null;

        if (a['itemType'] !== undefined && b['itemType'] !== undefined) {
          /**
           * case sort ScheduleListType
           * - 1: milestone
           * - 2: task
           * - 3: schedule
           */
          itemType = a['itemType'] - b['itemType'];
        }
        if (itemType !== null && itemType !== 0) return itemType;

        if (a['itemType'] !== null && a['itemType'] === ItemTypeSchedule.Schedule) {
          const typeA = a['isFullDay'] ? 0 : a.isOverDay ? 1 : 2;
          const typeB = b['isFullDay'] ? 0 : b.isOverDay ? 1 : 2;
          const type = typeA - typeB;
          if (type !== 0) return type;
        }

        const diffStart = a.startDateMoment.unix() - b.startDateMoment.unix(); // CalenderViewMonthCommon.compareDateByDay(a.startDateSortMoment, b.startDateSortMoment);
        // a.start < b.start || a.start > b.start
        if (diffStart !== 0) return diffStart;

        // case a.start = b.start
        const diffEnd = a.finishDateMoment.unix() - b.finishDateMoment.unix(); // CalenderViewMonthCommon.compareDateByDay(a.finishDateSortMoment, b.finishDateSortMoment);
        // a.end < b.end || a.end > b.end
        if (diffEnd !== 0) return -diffEnd;

        if (a['itemId']) {
          return a['itemId'] - b['itemId'];
        }

        if (a['resourceId']) {
          return a['resourceId'] - b['resourceId'];
        }

        return 0;
      });
    }
  };

  /**
   * Split calculation of daily over schedules
   * @param listRawData : ScheduleListType[] | ResourceListType[]
   */
  static breakByDate = (
    dateFromData: moment.Moment,
    dateToData: moment.Moment,
    listRawData: DataOfSchedule[] | DataOfResource[]
  ): DataOfSchedule[] | DataOfResource[] => {
    const newListRawData: DataOfSchedule[] | DataOfResource[] = [];
    const insertOverSchedule = (s: DataOfSchedule | DataOfResource) => {
      newListRawData.push(s);
      const startDate = CalenderViewMonthCommon.getMaxDay(dateFromData, s.startDateMoment);
      const endDate = CalenderViewMonthCommon.getMinDay(dateToData, s.finishDateMoment);
      const nextDate = startDate.clone();

      const maxDays = Math.abs(CalenderViewMonthCommon.getDaysDiff(startDate, endDate));
      for (let i = 1; i <= maxDays; i++) {
        const nextDay = nextDate.clone().add(i, 'days');
        const nextOfSchedule: DataOfSchedule | DataOfResource = _.cloneDeep(s);
        nextOfSchedule.uniqueId = UniqueID();
        nextOfSchedule.listChildId = [];
        nextOfSchedule.rootId = s.uniqueId;

        nextOfSchedule.startDateSortMoment = CalenderViewMonthCommon.roundDate(nextDay);
        nextOfSchedule.startDateSortTimestamp = nextOfSchedule.startDateSortMoment.unix();

        nextOfSchedule.finishDateSortMoment = CalenderViewMonthCommon.roundDate(
          s.finishDateMoment.clone()
        );
        nextOfSchedule.finishDateSortTimestamp = nextOfSchedule.finishDateSortMoment.unix();

        nextOfSchedule.isShow = true;
        nextOfSchedule.isFirstWeek = true;
        nextOfSchedule.isRoot = false;

        s.listChildId.push(nextOfSchedule.uniqueId);

        newListRawData.push(nextOfSchedule);
      }
    };

    if (listRawData && listRawData.length > 0) {
      listRawData.forEach((s: DataOfSchedule | DataOfResource) => {
        if (s.isOverDay) {
          insertOverSchedule(s);
        } else {
          newListRawData.push(s);
        }
      });
    }

    return newListRawData;
  };

  /**
   * Find and remove item
   * @param oldState: DataOfDetailWeek
   * @param itemId: ID of schedule or Id of task, OR id of milestone OR id of resource
   * @param insertSchedule : remove schedule or  schedule
   * @param itemTypeSchedule: type MILESTONE, TASK, SCHEDULE (Resource not itemTypeSchedule )
   */
  static removeObject = (
    oldState: DataOfViewList,
    itemId: number,
    deleteSchedule: boolean,
    itemTypeSchedule?: number
  ) => {
    const listFullDay: DataOfDay[] = deleteSchedule
      ? oldState.dataSchedule.listDay
      : oldState.dataResource.listDay;

    listFullDay.forEach((day: DataOfDay) => {
      CalenderViewMonthCommon.removeScheduleInDay(day, itemId, itemTypeSchedule);
    });
  };

  /**
   * Copy data to state of calender list
   * @param oldState : DataOfDetailWeek
   * @param rawData
   *
   * @returns DataOfDetailWeek
   */
  static buildScheduleOfCalendarList = (
    oldDataOfList: DataOfViewList,
    apiData: GetDataForCalendarByList,
    itemId?: number,
    itemType?: number
  ): DataOfViewList => {
    /**
     * Sort data schedule
     * Refer to No1, sheet [画面レイアウト（予定）] of the file [110201_カレンダー（月表示）.xlsx]
     */
    const dataOfList: DataOfViewList = oldDataOfList || {
      dataSchedule: {},
      dataResource: {}
    };
    // dataOfList.dataSchedule = apiData;

    if (!itemId || itemId < 1) {
      const dateList: ApiHeaderDayType[] = (apiData && apiData['dateList']) || [];
      dataOfList.dataSchedule['listDay'] = [];
      if (apiData) {
        dataOfList.dataSchedule.dateFromData = CalenderViewMonthCommon.utcToLocal(
          apiData['dateFromData']
        );
        dataOfList.dataSchedule.dateToData = CalenderViewMonthCommon.utcToLocal(
          apiData['dateToData']
        );
        dataOfList.dataSchedule.isGetMoreData = apiData['isGetMoreData'];
        dataOfList.dataSchedule.countSchedule = apiData['countSchedule'];

        dateList.forEach((date: ApiHeaderDayType, index: number) => {
          dataOfList.dataSchedule.listDay.push(CalenderViewMonthCommon.initDataOfDay(date));
        });
      }
    } else {
      dataOfList.dataSchedule &&
        dataOfList.dataSchedule.listDay &&
        dataOfList.dataSchedule.listDay.forEach((day: DataOfDay) => {
          CalenderViewMonthCommon.removeScheduleInDay(day, itemId, itemType);
        });
    }

    if (apiData) {
      // convert data
      let itemList: DataOfSchedule[] = CalenderViewMonthCommon.convertScheduleList(
        apiData['itemList'] || []
      );
      itemList = CalenderViewWeekList.breakByDate(
        dataOfList.dataSchedule.dateFromData,
        dataOfList.dataSchedule.dateToData,
        itemList
      );
      dataOfList.dataSchedule.isGetMoreData = apiData['isGetMoreData'];

      // if (itemList.length >= MAX_SHOW_SCHEDULE_IN_LIST_VIEW) {
      //   itemList = itemList.slice(0, MAX_SHOW_SCHEDULE_IN_LIST_VIEW);
      //   dataOfList.dataSchedule.isGetMoreData = false;
      // } else {
      //   dataOfList.dataSchedule.isGetMoreData = true;
      // }
      // sort data full days
      CalenderViewWeekList.sortListScheduleOrResource(itemList);

      // Data classification
      itemList.forEach(schedule => {
        const indexDay = dataOfList.dataSchedule.listDay.findIndex((day: DataOfDay) => {
          return (
            CalenderViewMonthCommon.compareDateByDay(
              day.dataHeader.dateMoment,
              schedule.startDateSortMoment
            ) === 0
          );
        });
        if (indexDay >= 0) {
          dataOfList.dataSchedule.listDay[indexDay].listSchedule.push(schedule);
        }
      });

      // delete day not schedule
      for (let i = dataOfList.dataSchedule.listDay.length - 1; i > -1; i--) {
        if (
          dataOfList.dataSchedule.listDay[i].listSchedule &&
          dataOfList.dataSchedule.listDay[i].listSchedule.length === 0
        ) {
          dataOfList.dataSchedule.listDay.splice(i, 1);
        }
      }
    }

    return dataOfList;
  };

  /**
   * Copy data to state of calender list
   * @param oldState : DataOfDetailWeek
   * @param rawData
   *
   * @returns DataOfDetailWeek
   */
  static buildResourceOfCalendarList = (
    oldDataOfList: DataOfViewList,
    apiData: GetResourcesForCalendarByList,
    itemId?: number
  ): DataOfViewList => {
    /**
     * Sort data schedule
     * Refer to No1, sheet [画面レイアウト（予定）] of the file [110201_カレンダー（月表示）.xlsx]
     */
    const dataOfList: DataOfViewList = oldDataOfList || {
      dataSchedule: {},
      dataResource: {}
    };
    // dataOfList.dataResource = apiData;

    if (!itemId || itemId < 1) {
      const dateList: ApiHeaderDayType[] = (apiData && apiData['dayList']) || [];
      dataOfList.dataResource['listDay'] = [];
      if (apiData) {
        dataOfList.dataResource.dateFromData = CalenderViewMonthCommon.utcToLocal(
          apiData['dateFromData']
        );
        dataOfList.dataResource.dateToData = CalenderViewMonthCommon.utcToLocal(
          apiData['dateToData']
        );
        dataOfList.dataResource.isGetMoreData = apiData['isGetMoreData'];
        dataOfList.dataResource.countSchedule = apiData['countSchedule'];
        dateList.forEach((date: ApiHeaderDayType, index: number) => {
          dataOfList.dataResource.listDay.push(CalenderViewMonthCommon.initDataOfDay(date));
        });
      }
    } else {
      dataOfList.dataResource &&
        dataOfList.dataResource.listDay &&
        dataOfList.dataResource.listDay.forEach((day: DataOfDay) => {
          CalenderViewMonthCommon.removeResourceInDay(day, itemId);
        });
    }

    if (apiData) {
      // convert data
      let itemList: DataOfResource[] = CalenderViewMonthCommon.convertScheduleList(
        apiData['resourceList'] || []
      );
      itemList = CalenderViewWeekList.breakByDate(
        dataOfList.dataResource.dateFromData,
        dataOfList.dataResource.dateToData,
        itemList
      );
      dataOfList.dataResource.isGetMoreData = apiData['isGetMoreData'];
      // if (itemList.length >= MAX_SHOW_SCHEDULE_IN_LIST_VIEW) {
      //   itemList = itemList.slice(0, MAX_SHOW_SCHEDULE_IN_LIST_VIEW);
      //   dataOfList.dataResource.isGetMoreData = false;
      // } else {
      //   dataOfList.dataResource.isGetMoreData = true;
      // }
      // sort data full days
      CalenderViewWeekList.sortListScheduleOrResource(itemList);

      // Data classification
      itemList.forEach(schedule => {
        const indexDay = dataOfList.dataResource.listDay.findIndex((dayInList: DataOfDay) => {
          return (
            CalenderViewMonthCommon.compareDateByDay(
              dayInList.dataHeader.dateMoment,
              schedule.startDateSortMoment
            ) === 0
          );
        });
        if (indexDay >= 0) {
          dataOfList.dataResource.listDay[indexDay].listResource.push(schedule);
        }
      });
      for (let i = dataOfList.dataResource.listDay.length - 1; i > -1; i--) {
        if (
          dataOfList.dataResource.listDay[i].listSchedule &&
          dataOfList.dataResource.listDay[i].listResource.length === 0
        ) {
          dataOfList.dataResource.listDay.splice(i, 1);
        }
      }
    }

    return dataOfList;
  };
}
