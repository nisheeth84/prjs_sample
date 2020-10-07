import moment from 'moment';
import _ from 'lodash';
import { ScheduleListType } from '../api/schedule-list-type';
import { ResourceListType } from '../api/resource-list-type';
import { GetDataForCalendarByList } from '../api/get-data-for-calendar-by-list-type';

import { ApiHeaderDayType } from '../api/common-type';
import { GetResourcesForCalendarByList } from '../api/get-resources-for-calendar-by-list-type';
import { ItemTypeSchedule } from '../constants';
import { GetResourcesForCalendarByDay } from './get-resources-for-calendar-by-day-type';
import { GetDataForCalendarByDay } from './get-data-for-calendar-by-day-type';
const FIRST_DATE_OF_MONTH = 1;


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

  startDateMoment?: string;
  finishDateMoment?: string;

  startDateSortMoment?: string;
  finishDateSortMoment?: string;

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

// define structure data for resource common in grid
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

  startDateMoment?: string;
  finishDateMoment?: string;

  startDateSortMoment?: string;
  finishDateSortMoment?: string;

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
  dateMoment?: any;
  timestamp?: number;
  isScheduleHeader?: boolean;
};

/**
 * Define data structure for 1 day
 */
export type DataOfDay = {
  dataHeader: DataHeader;

  listSchedule?: DataOfSchedule[];
  listResource?: DataOfResource[];
};

// Define data structure for the calendar display by week
export type HourOfDay = {
  // Start time
  startHour: any;
  startMinute: number;
  // End time
  endHour: any;
  endMinute: number;

  listDay: DataOfDay[];
};

/**
 * Define data structure for week and days calendar
 */
export type DataOfDetailWeek = {
  // Start day of the week
  startDate?: string;
  startTimestamp?: number;
  // End date of the week
  endDate?: string;
  endTimestamp?: number;

  // Start time
  startHour?: number;
  // End time
  endHour?: number;

  refSchedule?: {};
  refResource?: {};

  fullDaySchedule?: DataOfDay[];
  fullDayResource?: DataOfDay[];
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
  currentDate?: any
};

/**
 * get unique id for schedule
 */
export const UniqueID = (): string => {
  const chr4 = () => {
    return Math.random().toString(16).slice(-4);
  };
  return (
    chr4() +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    '-' +
    chr4() +
    chr4() +
    chr4()
  );
};

/**
 * check NVL of value
 * @param value
 * @param valueDefault
 */
export const NVL = (value: any, valueDefault?: any) => {
  return value === undefined
    ? valueDefault === undefined
      ? null
      : valueDefault
    : value;
};
/**
 * Calender View Common
 */
export class CalenderViewCommon {
  /**
   * Convert date to number of minute
   * @returns number
   */
  static convertDateToMinute = (h: moment.Moment | number, m?: number) => {
    if (moment.isMoment(h)) {
      return h.hour() * 60 + h.minute();
    }
    return h * 60 + (m ?? 0);
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
    const byDay = CalenderViewCommon.compareDateByDay(a, b);
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
        moment(b).clone().hours(0).minutes(0).seconds(0).milliseconds(0),
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
      .diff(moment(b).clone().seconds(0).milliseconds(0), 'hours');
  };

  /**
   * Sort data schedule or Resource
   * Refer to No1, sheet [画面レイアウト（予定）] of the file [110201_カレンダー（月表示）.xlsx]
   */
  static sortListScheduleOrResource = (
    listData: DataOfSchedule[] | DataOfResource[]
  ) => {
    if (listData) {
      listData.sort(
        (
          a: DataOfSchedule | DataOfResource,
          b: DataOfSchedule | DataOfResource
        ) => {
          const diffStart =
            (a.startDateSortTimestamp || 0) - (b.startDateSortTimestamp || 0); // CalenderViewCommon.compareDateByDay(a.startDateSortMoment, b.startDateSortMoment);
          // a.start < b.start || a.start > b.start
          if (diffStart !== 0) return diffStart;

          // case a.start = b.start
          const diffEnd =
            (a.finishDateSortTimestamp || 0) - (b.finishDateSortTimestamp || 0); // CalenderViewCommon.compareDateByDay(a.finishDateSortMoment, b.finishDateSortMoment);
          // a.end < b.end || a.end > b.end
          if (diffEnd !== 0) return -diffEnd;

          // case a.start = b.start AND a.end = b.end
          return (a['itemType'] || 0) - (b['itemType'] || 0);
        }
      );
    }
  };

  /**
   * round of date
   */
  static roundDate = (d: moment.Moment) => {
    return d.second(0).millisecond(0);
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

        schedule.startDateMoment = CalenderViewCommon.roundDate(
          moment.utc(s.startDate)
        ).format('YYYY-MM-DDTHH:mm:ssZ');
        schedule.finishDateMoment = CalenderViewCommon.roundDate(
          moment.utc(s.finishDate)
        ).format('YYYY-MM-DDTHH:mm:ssZ');

        if (schedule['isFullDay']) {
          schedule.startDateSortMoment = CalenderViewCommon.roundDate(
            moment.utc(s.startDate).hour(0).minute(0).second(0).millisecond(0)
          ).format('YYYY-MM-DDTHH:mm:ssZ');
          schedule.finishDateSortMoment = CalenderViewCommon.roundDate(
            moment.utc(s.finishDate).hour(0).minute(0).second(0).millisecond(0)
          ).format('YYYY-MM-DDTHH:mm:ssZ');
        } else {
          schedule.startDateSortMoment = CalenderViewCommon.roundDate(
            moment.utc(s.startDate)
          ).format('YYYY-MM-DDTHH:mm:ssZ');
          schedule.finishDateSortMoment = CalenderViewCommon.roundDate(
            moment.utc(s.finishDate)
          ).format('YYYY-MM-DDTHH:mm:ssZ');
        }

        schedule.startDateSortTimestamp = moment(
          schedule.startDateSortMoment
        ).unix();
        schedule.finishDateSortTimestamp = moment(
          schedule.finishDateSortMoment
        ).unix();

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
      var minDay_ = values[0];
      for (let i = 1; i < values.length; i++) {
        if (!minDay_ && values[i]) {
          minDay_ = values[i];
        } else if (
          values[i] &&
          minDay_ &&
          CalenderViewCommon.compareDateByDay(
            moment(minDay_),
            moment(minDay_[i])
          ) > 0) {
          let temp = values[i];
          minDay_ = temp;
        }

      }
      return minDay_;
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
        if (
          values[i] &&
          maxDay &&
          CalenderViewCommon.compareDateByDay(
            moment(maxDay),
            moment(values[i])
          ) < 0
        )
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
      dataHeader: {},
      listSchedule: [],
      listResource: [],
    };
    const dataHeader: DataHeader = _.clone(date);
    dataHeader.dateMoment = moment
      .utc(date.dateByDay || date.date)
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .format('YYYY-MM-DDTHH:mm:ssZ');
    dataHeader.timestamp = moment(dataHeader.dateMoment).unix();
    dataOfDay.dataHeader = dataHeader;
    return dataOfDay;
  };
  /**
   * Get the empty sort value in the list
   * @returns number
   */
  static getLastEmptySortIndex = (
    list: DataOfSchedule[] | DataOfResource[]
  ) => {
    let lastEmptySort = 0;
    if (!list || list.length === 0) return 0;
    // Initialize an array of N elements with a default value of False
    let maxSort = 0;
    list.forEach(
      (e: DataOfSchedule | DataOfResource) =>
        (maxSort = Math.max(maxSort, e.sort ?? 0))
    );

    const arrayIndex = new Array(maxSort + 2);
    arrayIndex.fill(false);
    list.forEach((e: DataOfSchedule | DataOfResource) => {
      arrayIndex[e.sort ?? 0] = true; // If sorted, set true
    });
    lastEmptySort = arrayIndex.findIndex((e) => !e);

    return lastEmptySort;
  };

  /**
   * get next schedule in list schedule reference
   */
  static getNextScheduleInRef = (
    objRef: any,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    if (!objRef) return null;
    const keys = Object.keys(objRef);
    if (!keys) return null;
    const checkIdAndTypeAndShow = (o: any) => {
      return o.itemType === itemType && o.itemId === itemId && o.isShow;
    };
    const checkNotIdAndTypeAndShow = (o: any) => {
      return o.itemType === itemType && o.itemId !== itemId && o.isShow;
    };
    const indexFind = keys.findIndex((k) => checkIdAndTypeAndShow(objRef[k]));
    if (indexFind > -1) {
      for (let i = indexFind + 1; i < keys.length; i++) {
        if (objRef[keys[i]] && checkNotIdAndTypeAndShow(objRef[keys[i]]))
          return objRef[keys[i]];
      }
    }

    return null;
  };

  /**
   * get next previous in list schedule reference
   */
  static getPreviousScheduleInRef = (
    objRef: any,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    if (!objRef) return null;
    const keys = Object.keys(objRef);
    if (!keys) return null;
    const checkIdAndTypeAndShow = (o: any) => {
      return o.itemType === itemType && o.itemId === itemId && o.isShow;
    };
    const checkNotIdAndTypeAndShow = (o: any) => {
      return o.itemType === itemType && o.itemId !== itemId && o.isShow;
    };
    const indexFind = keys.findIndex((k) => checkIdAndTypeAndShow(objRef[k]));
    if (indexFind > -1) {
      for (let i = indexFind - 1; i > -1; i--) {
        if (objRef[keys[i]] && checkNotIdAndTypeAndShow(objRef[keys[i]]))
          return objRef[keys[i]];
      }
    }

    return null;
  };

  /**
   * Find and remove schedule
   * @param itemId: ID of schedule or Id of task, OR id of milestone OR id of resource
   * @param itemTypeSchedule: type MILESTONE, TASK, SCHEDULE (Resource not itemTypeSchedule )
   */
  static removeScheduleInDay = (
    dayFind: DataOfDay,
    itemId: number,
    itemTypeSchedule?: number
  ) => {
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
  /**
   * remove In On Day
   */
  static removeInOnDay = (
    day: DataOfDay,
    itemId: number,
    insertSchedule: boolean,
    itemTypeSchedule?: number
  ) => {
    insertSchedule
      ? CalenderViewCommon.removeScheduleInDay(day, itemId, itemTypeSchedule)
      : CalenderViewCommon.removeResourceInDay(day, itemId);
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
    return CalenderViewCommon.roundDownDay(d, 23, 59, 59, 999);
  };

  static roundDate_ = (d: moment.Moment) => {
    return d
      .clone()
      .second(0)
      .millisecond(0);
  };
}
/**
 * Calender ViewWeek List
 */
export class CalenderViewWeekList {
  /**
   * get Next Schedule
   */
  static getNextSchedule = (
    dataOfList: DataOfViewList,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    if (!dataOfList.dataSchedule || !dataOfList.dataSchedule.listDay)
      return null;
    const sFind: DataOfSchedule = {};
    const checkIdAndTypeAndShow = (o: DataOfSchedule) => {
      return o.itemType === itemType && o.itemId === itemId && o.isShow;
    };
    const checkNotIdAndTypeAndShow = (o: DataOfSchedule) => {
      return o.itemType !== itemType && o.itemId !== itemId && o.isShow;
    };

    for (
      let index = 0;
      index < dataOfList.dataSchedule.listDay.length;
      index++
    ) {
      const d: DataOfDay = dataOfList.dataSchedule.listDay[index];
      if (d.listSchedule) {
        const indexFind = d.listSchedule.findIndex((s: DataOfSchedule) =>
          checkIdAndTypeAndShow(s)
        );
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
  /**
   * get Previous Schedule
   */
  static getPreviousSchedule = (
    dataOfList: DataOfViewList,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    if (!dataOfList.dataSchedule || !dataOfList.dataSchedule.listDay)
      return null;
    const sFind: DataOfSchedule = {};
    const checkIdAndTypeAndShow = (o: DataOfSchedule) => {
      return o.itemType === itemType && o.itemId === itemId && o.isShow;
    };
    const checkNotIdAndTypeAndShow = (o: DataOfSchedule) => {
      return o.itemType !== itemType && o.itemId !== itemId && o.isShow;
    };

    for (
      let index = 0;
      index < dataOfList.dataSchedule.listDay.length;
      index++
    ) {
      const d: DataOfDay = dataOfList.dataSchedule.listDay[index];
      if (d.listSchedule) {
        const indexFind = d.listSchedule.findIndex((s: DataOfSchedule) =>
          checkIdAndTypeAndShow(s)
        );
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
  static sortListScheduleOrResource = (
    listData: DataOfSchedule[] | DataOfResource[]
  ) => {
    if (listData) {
      listData.sort(
        (
          a: DataOfSchedule | DataOfResource,
          b: DataOfSchedule | DataOfResource
        ) => {
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

          if (
            a['itemType'] !== null &&
            a['itemType'] === ItemTypeSchedule.SCHEDULE
          ) {
            const typeA = a['isFullDay'] ? 0 : a.isOverDay ? 1 : 2;
            const typeB = b['isFullDay'] ? 0 : b.isOverDay ? 1 : 2;
            const type = typeA - typeB;
            if (type !== 0) return type;
          }

          const diffStart =
            moment(a.startDateMoment).unix() - moment(b.startDateMoment).unix(); // CalenderViewCommon.compareDateByDay(a.startDateSortMoment, b.startDateSortMoment);
          // a.start < b.start || a.start > b.start
          if (diffStart !== 0) return diffStart;

          // case a.start = b.start
          const diffEnd =
            moment(a.finishDateMoment).unix() -
            moment(b.finishDateMoment).unix(); // CalenderViewCommon.compareDateByDay(a.finishDateSortMoment, b.finishDateSortMoment);
          // a.end < b.end || a.end > b.end
          if (diffEnd !== 0) return -diffEnd;

          return 0;
        }
      );
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
      const startDate = CalenderViewCommon.getMaxDay(
        dateFromData,
        moment(s.startDateMoment)
      );
      const endDate = CalenderViewCommon.getMinDay(
        dateToData,
        moment(s.finishDateMoment)
      );
      const nextDate = startDate.clone();

      const maxDays = Math.abs(
        CalenderViewCommon.getDaysDiff(startDate, endDate)
      );
      for (let i = 1; i <= maxDays; i++) {
        const nextDay = nextDate.clone().add(i, 'days');
        const nextOfSchedule: DataOfSchedule | DataOfResource = _.cloneDeep(s);
        nextOfSchedule.uniqueId = UniqueID();
        nextOfSchedule.listChildId = [];
        nextOfSchedule.rootId = s.uniqueId;

        nextOfSchedule.startDateSortMoment = CalenderViewCommon.roundDate(
          nextDay
        ).format('YYYY-MM-DDTHH:mm:ssZ');
        nextOfSchedule.startDateSortTimestamp = moment(
          nextOfSchedule.startDateSortMoment
        ).unix();

        nextOfSchedule.finishDateSortMoment = CalenderViewCommon.roundDate(
          moment(s.finishDateMoment).clone()
        ).format('YYYY-MM-DDTHH:mm:ssZ');
        nextOfSchedule.finishDateSortTimestamp = moment(
          nextOfSchedule.finishDateSortMoment
        ).unix();

        nextOfSchedule.isShow = true;
        nextOfSchedule.isFirstWeek = true;
        nextOfSchedule.isRoot = false;

        // s.listChildId!.push(nextOfSchedule.uniqueId+"");
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
    const listFullDay: DataOfDay[] =
      (deleteSchedule
        ? oldState?.dataSchedule?.listDay
        : oldState?.dataResource?.listDay) || [];

    listFullDay.forEach((day: DataOfDay) => {
      CalenderViewCommon.removeScheduleInDay(day, itemId, itemTypeSchedule);
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
      dataResource: {},
      currentDate: moment(),
    };

    // dataOfList.dataSchedule = apiData;

    if (!itemId || itemId < 1) {
      const dateList: ApiHeaderDayType[] =
        (apiData && apiData['dateList']) || [];
      dataOfList.dataSchedule!['listDay'] = [];
      if (apiData) {
        dataOfList.dataSchedule!.dateFromData = moment
          .utc(apiData['dateFromData'])
          .format('YYYY-MM-DDTHH:mm:ssZ');
        dataOfList.dataSchedule!.dateToData = moment
          .utc(apiData['dateToData'])
          .format('YYYY-MM-DDTHH:mm:ssZ');
        dataOfList.dataSchedule!.isGetMoreData = apiData['isGetMoreData'];
        dataOfList.dataSchedule!.countSchedule = apiData['countSchedule'];
        dateList.forEach((data: ApiHeaderDayType, index: number) => {
          if (
            index === 0 ||
            moment(data.date).date() ===
            moment(data.date).startOf('months').date()
          ) {
            const dataScheduleHeader: DataOfDay = {
              dataHeader: {
                date: moment(data.date).startOf('months').date(),
                dateMoment: moment
                  .utc(data.date || data.dateByDay)
                  .clone()
                  .hours(0)
                  .minutes(0)
                  .seconds(0)
                  .milliseconds(0)
                  .format('YYYY-MM-DDTHH:mm:ssZ'),
                dateByDay: FIRST_DATE_OF_MONTH,
                isScheduleHeader: true,
              },
              listSchedule: [],
              listResource: [],
            };
            dataScheduleHeader.dataHeader.timestamp = moment(
              dataScheduleHeader.dataHeader.dateMoment
            ).unix();
            // dataOfList.dataSchedule!.listDay!.push(dataScheduleHeader);
          }
          dataOfList.dataSchedule!.listDay!.push(
            CalenderViewCommon.initDataOfDay(data)
          );
        });
      }
    } else {
      dataOfList.dataSchedule &&
        dataOfList.dataSchedule.listDay &&
        dataOfList.dataSchedule.listDay.forEach((day: DataOfDay) => {
          CalenderViewCommon.removeScheduleInDay(day, itemId, itemType);
        });
    }

    if (apiData) {
      // convert data
      let itemList: DataOfSchedule[] = CalenderViewCommon.convertScheduleList(
        apiData['itemList'] || []
      );

      itemList = CalenderViewWeekList.breakByDate(moment(dataOfList.dataSchedule!.dateFromData).utc(), moment(dataOfList.dataSchedule!.dateToData).utc(), itemList);
      // if (itemList.length >= MAX_SHOW_SCHEDULE_IN_LIST_VIEW) {
      //   itemList = itemList.slice(0, MAX_SHOW_SCHEDULE_IN_LIST_VIEW);
      //   dataOfList.dataSchedule!.isGetMoreData = false;
      // } else {
      //   dataOfList.dataSchedule!.isGetMoreData = true;
      // }
      // sort data full days
      CalenderViewWeekList.sortListScheduleOrResource(itemList);
      // Data classification
      itemList.forEach((schedule) => {
        let indexDay = dataOfList.dataSchedule!.listDay!.findIndex(
          (day: DataOfDay) => {
            return (
              !!!day.dataHeader.isScheduleHeader &&
              CalenderViewCommon.compareDateByDay(
                moment(day.dataHeader.dateMoment),
                moment(schedule.startDateSortMoment)
              ) === 0
            );
          }
        );
        if (indexDay >= 0) {
          if (!!!dataOfList.dataSchedule!.listDay![indexDay].listSchedule) {
            dataOfList.dataSchedule!.listDay![indexDay].listSchedule = [];
          }
          dataOfList.dataSchedule!.listDay![indexDay].listSchedule!.push(
            schedule
          );
        } else {
          indexDay = dataOfList.dataSchedule!.listDay!.findIndex(
            (day: DataOfDay) => {
              return (
                !!!day.dataHeader.isScheduleHeader &&
                CalenderViewCommon.compareDateByDay(
                  moment(day.dataHeader.dateMoment),
                  moment(schedule.finishDateMoment)
                ) === 0
              );
            }
          );
          if (indexDay >= 0) {
            if (!!!dataOfList.dataSchedule!.listDay![indexDay].listSchedule) {
              dataOfList.dataSchedule!.listDay![indexDay].listSchedule = [];
            }
            // dataOfList.dataSchedule!.listDay![indexDay].listSchedule!.push(
            //   schedule
            // );
          }
        }
        //



      });

      //delete day not schedule
      if (dataOfList && dataOfList.dataSchedule && dataOfList.dataSchedule.listDay) {
        for (let i = dataOfList.dataSchedule.listDay.length - 1; i > -1; i--) {
          let isStartWeek = moment(dataOfList.dataSchedule.listDay[i].dataHeader.dateMoment).date() == moment(dataOfList.dataSchedule.listDay[i].dataHeader.dateMoment).startOf("isoWeeks").date();
          let isStartMonth = moment(dataOfList.dataSchedule.listDay[i].dataHeader.dateMoment).date() == moment(dataOfList.dataSchedule.listDay[i].dataHeader.dateMoment).startOf('months').date();
          let isCurrentDate = moment(dataOfList.dataSchedule.listDay[i].dataHeader.dateMoment).format("yyyy-MM-DD") == moment(dataOfList.currentDate).format("yyyy-MM-DD");
          let isBeforeToday = moment(dataOfList.dataSchedule.listDay[i].dataHeader.dateMoment).format("yyyy-MM-DD") < moment(dataOfList.currentDate).format("yyyy-MM-DD");
          if (!isStartMonth && !isStartWeek && !isCurrentDate) {
            if ((dataOfList.dataSchedule.listDay[i].listSchedule && dataOfList.dataSchedule?.listDay[i]?.listSchedule?.length === 0) || isBeforeToday ) {
              dataOfList.dataSchedule.listDay.splice(i, 1);
            }
          }
        }
      }
    }

    return dataOfList;
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
    _dateSearch: moment.Moment,
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
      listHourResource: [],
    };
    dataOfWeek.startHour = sHour;
    dataOfWeek.endHour = eHour;

    const insertSchedule = true;
    const listFullDaySchedule: DataOfSchedule[] = [];
    const listHourSchedule: DataOfSchedule[] = [];
    // debugger
    if (!itemId || itemId < 1) {
      if (apiData) {
        const deaderInfo: ApiHeaderDayType = apiData;
        const dateList: ApiHeaderDayType[] = [deaderInfo];
        // initial data of month with param is date
        CalenderViewWeekCommon.initDataOfGridWeek(
          dataOfWeek,
          dateList,
          insertSchedule
        );
      }
    } else {
      // case update data
      CalenderViewWeekCommon.removeObject(
        dataOfWeek,
        itemId,
        insertSchedule,
        itemType
      );
    }
    if (apiData) {
      // convert data
      const itemList: DataOfSchedule[] = CalenderViewCommon.convertScheduleList(
        apiData['itemList'] || []
      );
      // Data classification
      itemList.forEach((scheduleModel) => {
        CalenderViewWeekDay.classificationSchedule(
          listFullDaySchedule,
          listHourSchedule,
          scheduleModel
        );
      });


      // sort data full days
      CalenderViewCommon.sortListScheduleOrResource(listFullDaySchedule);
      listFullDaySchedule.forEach((_schedule) => {
        CalenderViewWeekCommon.pushScheduleFullDay(
          dataOfWeek,
          _schedule,
          insertSchedule
        );
      });
      dataOfWeek.fullDaySchedule!.forEach((day) => {
        day.listSchedule!.sort((a, b) => a.sort! - b.sort!);
      });

      // Processing Data in day
      // sort schedule in day
      CalenderViewCommon.sortListScheduleOrResource(listHourSchedule);

      // push data to state
      listHourSchedule.forEach((scheduleInHour) => {
        CalenderViewWeekCommon.pushScheduleInDay(
          dataOfWeek,
          scheduleInHour,
          insertSchedule
        );
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
    _dateSearch: moment.Moment,
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
      listHourResource: [],
    };

    dataOfWeek.startHour = sHour;
    dataOfWeek.endHour = eHour;

    const insertSchedule = false;
    const listFullDaySchedule: DataOfResource[] = [];
    const listHourSchedule: DataOfResource[] = [];
    // debugger
    if (!itemId || itemId < 1) {
      if (apiData) {
        const deaderInfo: ApiHeaderDayType = apiData;
        const dateList: ApiHeaderDayType[] = [deaderInfo];
        // initial data of month with param is date
        CalenderViewWeekCommon.initDataOfGridWeek(
          dataOfWeek,
          dateList,
          insertSchedule
        );
      }
    } else {
      // case update data
      CalenderViewWeekCommon.removeObject(dataOfWeek, itemId, insertSchedule, itemType);
    }
    if (apiData) {
      // convert data
      const itemList: DataOfResource[] = CalenderViewCommon.convertScheduleList(
        apiData['resourceList'] || []
      );

      // Data classification
      itemList.forEach((resource) => {
        CalenderViewWeekDay.classificationSchedule(
          listFullDaySchedule,
          listHourSchedule,
          resource
        );
      });

      // sort data full days
      CalenderViewCommon.sortListScheduleOrResource(listFullDaySchedule);
      listFullDaySchedule.forEach((scheduleFull) => {
        CalenderViewWeekCommon.pushScheduleFullDay(
          dataOfWeek,
          scheduleFull,
          insertSchedule
        );
      });
      dataOfWeek.fullDayResource?.forEach((day) => {
        day.listSchedule?.sort((a: any, b: any) => a.sort - b.sort);
      });

      // Processing Data in day
      // sort schedule in day
      CalenderViewCommon.sortListScheduleOrResource(listHourSchedule);

      // push data to state
      listHourSchedule.forEach((scheduleInHours) => {
        CalenderViewWeekCommon.pushScheduleInDay(
          dataOfWeek,
          scheduleInHours,
          insertSchedule
        );
      });

      CalenderViewWeekCommon.calculateMaxWidth(dataOfWeek, insertSchedule);
    }
    return dataOfWeek;
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
      dataResource: {},
      currentDate: moment(),
    };
    // dataOfList.dataResource = apiData;

    if (!itemId || itemId < 1) {
      const dateList: ApiHeaderDayType[] =
        (apiData && apiData['dayList']) || [];
      dataOfList.dataResource!['listDay'] = [];
      if (apiData) {
        dataOfList.dataResource!.dateFromData = moment
          .utc(apiData['dateFromData'])
          .format('YYYY-MM-DDTHH:mm:ssZ');
        dataOfList.dataResource!.dateToData = moment
          .utc(apiData['dateToData'])
          .format('YYYY-MM-DDTHH:mm:ssZ');
        dataOfList.dataResource!.isGetMoreData = apiData['isGetMoreData'];
        dataOfList.dataResource!.countSchedule = apiData['countSchedule'];
        dateList.forEach((date: ApiHeaderDayType) => {
          dataOfList.dataResource!.listDay!.push(
            CalenderViewCommon.initDataOfDay(date)
          );
        });
      }
    } else {
      dataOfList.dataResource &&
        dataOfList.dataResource.listDay &&
        dataOfList.dataResource.listDay.forEach((day: DataOfDay) => {
          CalenderViewCommon.removeResourceInDay(day, itemId);
        });
    }

    if (apiData) {
      // convert data
      let itemList: DataOfResource[] = CalenderViewCommon.convertScheduleList(
        apiData['resourceList'] || []
      );
      itemList = CalenderViewWeekList.breakByDate(
        moment(dataOfList.dataResource!.dateFromData),
        moment(dataOfList.dataResource!.dateToData),
        itemList
      );
      // if (itemList.length >= MAX_SHOW_SCHEDULE_IN_LIST_VIEW) {
      //   itemList = itemList.slice(0, MAX_SHOW_SCHEDULE_IN_LIST_VIEW);
      //   dataOfList.dataResource!.isGetMoreData = false;
      // } else {
      //   dataOfList.dataResource!.isGetMoreData = true;
      // }
      // sort data full days
      CalenderViewWeekList.sortListScheduleOrResource(itemList);

      // Data classification
      itemList.forEach((schedule) => {
        const indexDay = dataOfList.dataResource!.listDay!.findIndex(
          (day: DataOfDay) => {
            return (
              CalenderViewCommon.compareDateByDay(
                moment(day.dataHeader.dateMoment),
                moment(schedule.startDateSortMoment)
              ) === 0
            );
          }
        );
        if (indexDay >= 0) {
          if (!!!dataOfList.dataResource!.listDay![indexDay].listResource) {
            dataOfList.dataResource!.listDay![indexDay].listResource = [];
          }
          dataOfList.dataResource!.listDay![indexDay]?.listResource?.push(
            schedule
          );
        }
      });
    }
    //delete day not schedule
    if (dataOfList && dataOfList.dataResource && dataOfList.dataResource.listDay) {
      for (let i = dataOfList.dataResource.listDay.length - 1; i > -1; i--) {
        const dateMoment = dataOfList.dataResource.listDay[i].dataHeader.dateMoment;
        let isStartWeek = moment(dateMoment).date() == moment(dateMoment).startOf("isoWeeks").date();
        let isStartMonth = moment(dateMoment).date() == moment(dateMoment).startOf('months').date();
        let isCurrentDate = moment(dateMoment).format("yyyy-MM-DD") == moment(dataOfList.currentDate).format("yyyy-MM-DD");
        let isBeforeToday = moment(dateMoment).format("yyyy-MM-DD") < moment(dataOfList.currentDate).format("yyyy-MM-DD");
        if (!isStartMonth && !isStartWeek && !isCurrentDate) {
          if ((dataOfList.dataResource.listDay[i].listSchedule && dataOfList.dataResource?.listDay[i]?.listSchedule?.length === 0) || isBeforeToday) {
            dataOfList.dataResource.listDay.splice(i, 1);
          }
        }
      }
    }

    return dataOfList;
  };
}
/**
 * Calender ViewWeek Common
 */
export class CalenderViewWeekCommon {
  static getNextSchedule = (
    dataOfWeek: DataOfDetailWeek,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    return CalenderViewCommon.getNextScheduleInRef(
      dataOfWeek.refSchedule,
      itemId,
      itemType
    );
  };

  static getPreviousSchedule = (
    dataOfWeek: DataOfDetailWeek,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    return CalenderViewCommon.getPreviousScheduleInRef(
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
    const listHour = insertSchedule
      ? dataOfWeek.listHourSchedule
      : dataOfWeek.listHourResource;
    const fullDay = insertSchedule
      ? dataOfWeek.fullDaySchedule
      : dataOfWeek.fullDayResource;
    if (dateList.length > 0) {
      dataOfWeek.startDate = moment()
        .utc(dateList[0].date || dateList[0].dateByDay)
        .clone()
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .format('YYYY-MM-DDTHH:mm:ssZ');
      dataOfWeek.startTimestamp = moment(dataOfWeek.startDate).unix();
      dataOfWeek.endDate = moment()
        .utc(
          dateList[dateList.length - 1].date ||
          dateList[dateList.length - 1].dateByDay
        )
        .clone()
        .hour(23)
        .minute(59)
        .second(59)
        .millisecond(0)
        .format('YYYY-MM-DDTHH:mm:ssZ');
      dataOfWeek.endTimestamp = moment(dataOfWeek.endDate).unix();
      for (let i = dataOfWeek.startHour; i! <= dataOfWeek.endHour!; i!++) {
        const startHourDate = moment(dataOfWeek.startDate)
          .clone()
          .hours(i!)
          .minutes(0)
          .seconds(0)
          .milliseconds(0);
        const endHourDate = moment(dataOfWeek.startDate)
          .clone()
          .hours(i!)
          .minutes(59)
          .seconds(0)
          .milliseconds(0);
        const hourOfDay: HourOfDay = {
          // Start time
          startHour: startHourDate.format('HH:mm'),
          startMinute: i! * 60,
          // End time
          endHour: endHourDate.format('HH:mm'),
          endMinute: i! * 60 + 59,
          listDay: [],
        };
        listHour!.push(hourOfDay);
      }

      dateList.forEach((date: ApiHeaderDayType) => {
        fullDay!.push(CalenderViewCommon.initDataOfDay(date));
        listHour!.forEach((h) => {
          const cloneObj: DataOfDay = CalenderViewCommon.initDataOfDay(date);
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
    const unixStart = moment(objData.startDateSortMoment)
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .unix();
    const unixEnd = moment(objData.finishDateSortMoment)
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .unix();
    // debugger
    // Cases schedule starting from the previous month
    objData.isStartPrevious =
      objData.isOverDay && unixStart < oldState.startTimestamp!;
    if (objData.isStartPrevious) {
      objData.startDateSortMoment = moment(oldState.startDate)
        .clone()
        .format('YYYY-MM-DDTHH:mm:ssZ');
      objData.startDateSortTimestamp = moment(
        objData.startDateSortMoment
      ).unix();
    }

    objData.isEndNext = objData.isOverDay && unixEnd > oldState.endTimestamp!;
    if (objData.isEndNext) {
      objData.finishDateSortMoment = moment(oldState.endDate)
        .clone()
        .format('YYYY-MM-DDTHH:mm:ssZ');
      objData.finishDateSortTimestamp = moment(
        objData.finishDateSortMoment
      ).unix();
    }

    // Find the date to insert data
    // const findIndex = week.listDay.findIndex(day => CalenderViewCommon.compareDateByDay(day.dataHeader.dateMoment, objData.startDateSortMoment) === 0);
    const fullDay = insertSchedule
      ? oldState.fullDaySchedule
      : oldState.fullDayResource;
    const findIndex = fullDay!.findIndex(
      (day) => objData.startDateSortTimestamp === day.dataHeader.timestamp
    );


    if (findIndex < 0) {
      const dayFind = fullDay![0];
      const listData = insertSchedule
        ? dayFind.listSchedule
        : dayFind.listResource;

      // Find the position without inserting data
      objData.sort = CalenderViewCommon.getLastEmptySortIndex(listData!);
      listData!.push(objData);

      // insert ref to object

      // insertSchedule ? ( oldState.refSchedule[objData.uniqueId] = objData) : (oldState.refResource[objData.uniqueId] = objData);

      // Where the schedule over another day
      if (objData.isOverDay) {
        objData.isRoot = true;
        // Insert schedule into weekdays
        const lastDayInWeek = CalenderViewCommon.getMinDay(
          objData.finishDateSortMoment,
          oldState.endDate
        );
        objData.finishDateSortMoment = lastDayInWeek;
        objData.finishDateSortTimestamp = moment(
          objData.finishDateSortMoment
        ).unix();
        const maxDays = Math.abs(
          CalenderViewCommon.getDaysDiff(
            moment(objData.startDateSortMoment),
            lastDayInWeek
          )
        );
        objData.numOverDay = maxDays + 1;

        // add schedule to all days
        for (
          let i = 0 + 1;
          i < 0 + maxDays + 1 && i < fullDay!.length;
          i++
        ) {
          const newOfSchedule: DataOfSchedule | DataOfResource = _.cloneDeep(
            objData
          );
          newOfSchedule.uniqueId = UniqueID();
          newOfSchedule.listChildId = [];
          newOfSchedule.rootId = objData.uniqueId;

          newOfSchedule.isShow = false;
          newOfSchedule.isRoot = false;
          newOfSchedule.startDateSortMoment = fullDay![
            i
          ].dataHeader.dateMoment.clone();
          newOfSchedule.finishDateSortMoment = fullDay![
            i
          ].dataHeader.dateMoment.clone();

          newOfSchedule.startDateSortTimestamp = moment(
            newOfSchedule.startDateSortMoment
          ).unix();
          newOfSchedule.finishDateSortTimestamp = moment(
            newOfSchedule.finishDateSortMoment
          ).unix();

          newOfSchedule.isRoot = false;
          objData.listChildId!.push(newOfSchedule.uniqueId);

          if (insertSchedule) {
            fullDay![i].listSchedule!.push(newOfSchedule);
          } else {
            fullDay![i].listResource!.push(newOfSchedule);
          }
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
    objData.isStartPrevious =
      moment(objData.startDateSortMoment).hour() < oldState.startHour!;
    if (objData.isStartPrevious) {
      moment(objData.startDateSortMoment).hour(oldState.startHour!).minute(0); // reset hour = startHour of view
      objData.startDateSortTimestamp = moment(
        objData.startDateSortMoment
      ).unix();
    }

    const startMinute = CalenderViewCommon.convertDateToMinute(
      moment(objData.startDateSortMoment)
    );

    // Where the object is outside the display area
    if (moment(objData.startDateMoment).unix() > oldState.endTimestamp!) return;
    if (moment(objData.finishDateMoment).unix() < oldState.startTimestamp!)
      return;

    const fullDay = insertSchedule
      ? oldState.fullDaySchedule
      : oldState.fullDayResource;
    const listHour = insertSchedule
      ? oldState.listHourSchedule
      : oldState.listHourResource;
    const lengthListHour = listHour!.length;
    const indexHour = listHour!.findIndex(
      (_hour: HourOfDay) =>
      _hour.startMinute <= startMinute && startMinute <= _hour.endMinute
    );
    if (indexHour < 0) return;
    const hour: HourOfDay = listHour![indexHour];

    // Find the date to insert data
    const findDayIndex = fullDay!.findIndex((day) => {
      return (
        CalenderViewCommon.compareDateByDay(
          moment(day.dataHeader.dateMoment),
          moment(objData.startDateSortMoment)
        ) === 0
      );
    });
    // const findIndex = week.listDay.findIndex(day => unix === day.dataHeader.timestamp);
    // debugger
    if (findDayIndex < 0) {
      const dayFind = hour.listDay[0];
      const listData = insertSchedule
        ? dayFind.listSchedule
        : dayFind.listResource;
      // Find the position without inserting data
      // objData.sort = CalenderViewCommon.getLastEmptySortIndex(listData);
      listData!.push(objData);

      // if the end time over the end time
      const lastHearInHour: moment.Moment = moment(
        listHour![lengthListHour - 1].listDay[0].dataHeader
          .dateMoment
      );
      const convertMinuteOfStart = CalenderViewCommon.convertDateToMinute(
        moment(objData.startDateSortMoment)
      );
      const convertMinuteOfEnd = CalenderViewCommon.convertDateToMinute(
        moment(objData.finishDateMoment)
      );
      const convertMinuteOfLast =
        CalenderViewCommon.convertDateToMinute(lastHearInHour) + 59;
      const maxEndMinute = Math.min(convertMinuteOfEnd, convertMinuteOfLast);
      if (convertMinuteOfEnd > convertMinuteOfLast) {
        objData.isEndNext = true;
        objData.finishDateSortMoment = moment(objData.finishDateSortMoment)
          .clone()
          .minute(59)
          .format('YYYY-MM-DDTHH:mm:ssZ');
        objData.finishDateSortTimestamp = moment(
          objData.finishDateSortMoment
        ).unix();
      }
      objData.height = maxEndMinute - convertMinuteOfStart; // over number Minute
    }
  };

  /**
   * calculate max width of schedule in day (for view schedule in hour)
   */
  static calculateMaxWidthOfDay = (
    oldState: DataOfDetailWeek,
    indexDay: number,
    insertSchedule: boolean
  ) => {
    const listMinute = Array(24 * 60 + 60);
    /**
     * insert To List Minute
     */
    const insertToListMinute = (s: DataOfSchedule | DataOfResource) => {
      const startMinute = CalenderViewCommon.convertDateToMinute(
        moment(s.startDateSortMoment)
      );
      const endMinute = CalenderViewCommon.convertDateToMinute(
        moment(s.finishDateSortMoment)
      );
      for (let i = startMinute; i <= endMinute; i++) {
        if (!listMinute[i]) {
          listMinute[i] = [];
        }
        listMinute[i].push(s);
      }
    };
    const listHour = insertSchedule
      ? oldState.listHourSchedule
      : oldState.listHourResource;
    listHour!.forEach((h) => {
      const day = h.listDay[indexDay];
      const listData = insertSchedule ? day.listSchedule : day.listResource;
      listData!.forEach((s: DataOfSchedule | DataOfResource) => {
        insertToListMinute(s);
      });
    });

    /**
     * calculate position left of schedule in view (view schedule in hour)
     * @param s
     */
    const setLeftWidthOfSchedule = (s: DataOfSchedule | DataOfResource) => {
      const startMinute = CalenderViewCommon.convertDateToMinute(
        moment(s.startDateSortMoment)
      );
      const endMinute = CalenderViewCommon.convertDateToMinute(
        moment(s.finishDateSortMoment)
      );
      if (!listMinute[startMinute]) {
        return;
      }
      const indexInListMinute = listMinute[startMinute].findIndex(
        (e: DataOfSchedule | DataOfResource) => e === s
      );
      let totalScheduleRight = 1;
      for (let i = startMinute; i <= endMinute; i++) {
        totalScheduleRight = Math.max(
          totalScheduleRight,
          listMinute[i].length - indexInListMinute
        );
      }
      let leftWidth = 0;
      for (let i = 0; i < indexInListMinute; i++) {
        leftWidth += listMinute[startMinute][i].width;
      }
      s.left = leftWidth;
      s.width = parseFloat(((100 - leftWidth) / totalScheduleRight).toFixed(4));
    };

    listHour!.forEach((h) => {
      const day = h.listDay[indexDay];
      const listData = insertSchedule ? day.listSchedule : day.listResource;
      listData!.forEach((s: DataOfSchedule | DataOfResource) => {
        setLeftWidthOfSchedule(s);
      });
    });
  };

  /**
   * Calculate the maximum width for the object
   */
  static calculateMaxWidth = (
    oldState: DataOfDetailWeek,
    insertSchedule: boolean
  ) => {
    const listHour = insertSchedule
      ? oldState.listHourSchedule
      : oldState.listHourResource;
    const listDay = listHour![0].listDay;
    listDay.forEach((_day: DataOfDay, indexDay: number) => {
      CalenderViewWeekCommon.calculateMaxWidthOfDay(
        oldState,
        indexDay,
        insertSchedule
      );
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
    const listFullDay: DataOfDay[] =
      (insertSchedule ? oldState.fullDaySchedule : oldState.fullDayResource) ||
      [];
    const listHour: HourOfDay[] =
      (insertSchedule
        ? oldState.listHourSchedule
        : oldState.listHourResource) || [];

    listFullDay.forEach((dayFull: DataOfDay) => {
      CalenderViewCommon.removeInOnDay(
        dayFull,
        itemId,
        insertSchedule,
        itemTypeSchedule
      );
    });

    listHour.forEach((hour: HourOfDay) => {
      hour.listDay.forEach((day: DataOfDay) => {
        CalenderViewCommon.removeInOnDay(
          day,
          itemId,
          insertSchedule,
          itemTypeSchedule
        );
      });
    });
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
      listHourResource: [],
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
      CalenderViewWeekCommon.removeObject(
        dataOfWeek,
        itemId,
        insertSchedule,
        itemType
      );
    }

    if (apiData && apiData['itemList']) {
      // convert data
      const itemList: DataOfSchedule[] = CalenderViewCommon.convertScheduleList(
        apiData['itemList'] || []
      );

      // Data classification
      itemList.forEach((schedule) => {
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
      CalenderViewCommon.sortListScheduleOrResource(listFullDaySchedule);
      listFullDaySchedule.forEach((item) => {
        CalenderViewWeekCommon.pushScheduleFullDay(
          dataOfWeek,
          item,
          insertSchedule
        );
      });
      dataOfWeek.fullDaySchedule!.forEach((day) => {
        day.listSchedule!.sort((a, b) => a.sort! - b.sort!);
      });

      // Processing Data in day
      // sort schedule in day
      CalenderViewCommon.sortListScheduleOrResource(listHourSchedule);

      // push data to state
      listHourSchedule.forEach((scheduleHours) => {
        CalenderViewWeekCommon.pushScheduleInDay(
          dataOfWeek,
          scheduleHours,
          insertSchedule
        );
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
      listHourResource: [],
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
      const itemList: DataOfResource[] = CalenderViewCommon.convertScheduleList(
        apiData['resourceList'] || []
      );

      // Data classification
      itemList.forEach((schedule) => {
        if (schedule.isOverDay || schedule['isFullDay']) {
          listFullDaySchedule.push(schedule);
        } else {
          listHourSchedule.push(schedule);
        }
      });

      // sort data full days
      CalenderViewCommon.sortListScheduleOrResource(listFullDaySchedule);
      listFullDaySchedule.forEach((scheduleInListFull) => {
        CalenderViewWeekCommon.pushScheduleFullDay(
          dataOfWeek,
          scheduleInListFull,
          insertSchedule
        );
      });
      dataOfWeek.fullDayResource!.forEach((day) => {
        day.listResource!.sort((a, b) => a.sort! - b.sort!);
      });

      // Processing Data in day
      // sort schedule in day
      CalenderViewCommon.sortListScheduleOrResource(listHourSchedule);

      // push data to state
      listHourSchedule.forEach((itemInHour) => {
        CalenderViewWeekCommon.pushScheduleInDay(
          dataOfWeek,
          itemInHour,
          insertSchedule
        );
      });

      CalenderViewWeekCommon.calculateMaxWidth(dataOfWeek, insertSchedule);
    }

    return dataOfWeek;
  };
}
/**
 * Calender View Week Day
 */
export class CalenderViewWeekDay {
  /**
   * get Next Schedule
   */
  static getNextSchedule = (
    dataOfDay: DataOfDetailWeek,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    return CalenderViewCommon.getNextScheduleInRef(
      dataOfDay.refSchedule,
      itemId,
      itemType
    );
  };
  /**
   * get Previous Schedule
   */
  static getPreviousSchedule = (
    dataOfDay: DataOfDetailWeek,
    itemId: number,
    itemType: ItemTypeSchedule
  ) => {
    return CalenderViewCommon.getPreviousScheduleInRef(
      dataOfDay.refSchedule,
      itemId,
      itemType
    );
  };
  /**
   * classification Schedule
   */
  static classificationSchedule = (
    listFullDaySchedule: any,
    listHourSchedule: any,
    schedule: any
  ) => {


    if ((schedule['itemType']) && schedule['itemType'] != 3) {
      listFullDaySchedule.push(schedule);
    } else {
      if (schedule.isOverDay || schedule.isFullDay) {
        listFullDaySchedule.push(schedule);
      } else {
        listHourSchedule.push(schedule);
      }
    }
    // if (!NVL(schedule['itemType']) ) {
    //   listFullDaySchedule.push(schedule);
    // } else {
    //   listHourSchedule.push(schedule);
    // }
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
      listHourResource: [],
    };

    dataOfWeek.startHour = sHour;
    dataOfWeek.endHour = eHour;

    const insertSchedule = true;
    const listFullDaySchedule: DataOfSchedule[] = [];
    const listHourSchedule: DataOfSchedule[] = [];

    if (!itemId || itemId < 1) {
      if (apiData) {
        const deaderInfo: ApiHeaderDayType = apiData;
        deaderInfo.date = dateSearch.clone().date(apiData.dateByDay);
        const dateList: ApiHeaderDayType[] = [deaderInfo];
        // initial data of month with param is date
        CalenderViewWeekCommon.initDataOfGridWeek(
          dataOfWeek,
          dateList,
          insertSchedule
        );
      }
    } else {
      // case update data
      CalenderViewWeekCommon.removeObject(
        dataOfWeek,
        itemId,
        insertSchedule,
        itemType
      );
    }

    if (apiData) {
      // convert data
      const itemList: DataOfSchedule[] = CalenderViewCommon.convertScheduleList(
        apiData['itemList'] || []
      );

      // Data classification
      itemList.forEach((item) => {
        CalenderViewWeekDay.classificationSchedule(
          listFullDaySchedule,
          listHourSchedule,
          item
        );
      });

      // sort data full days
      CalenderViewCommon.sortListScheduleOrResource(listFullDaySchedule);
      listFullDaySchedule.forEach((schedule) => {
        CalenderViewWeekCommon.pushScheduleFullDay(
          dataOfWeek,
          schedule,
          insertSchedule
        );
      });
      dataOfWeek.fullDaySchedule!.forEach((day) => {
        day.listSchedule!.sort((a, b) => a.sort! - b.sort!);
      });

      // Processing Data in day
      // sort schedule in day
      CalenderViewCommon.sortListScheduleOrResource(listHourSchedule);

      // push data to state
      listHourSchedule.forEach((schedule) => {
        CalenderViewWeekCommon.pushScheduleInDay(
          dataOfWeek,
          schedule,
          insertSchedule
        );
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
      listHourResource: [],
    };

    dataOfWeek.startHour = sHour;
    dataOfWeek.endHour = eHour;

    const insertSchedule = false;
    const listFullDaySchedule: DataOfResource[] = [];
    const listHourSchedule: DataOfResource[] = [];

    if (!itemId || itemId < 1) {
      if (apiData) {
        const deaderInfo: ApiHeaderDayType = apiData;
        deaderInfo.date = dateSearch.clone().date(apiData.dateByDay);
        const dateList: ApiHeaderDayType[] = [deaderInfo];
        // initial data of month with param is date
        CalenderViewWeekCommon.initDataOfGridWeek(
          dataOfWeek,
          dateList,
          insertSchedule
        );
      }
    } else {
      CalenderViewWeekCommon.removeObject(dataOfWeek, itemId, insertSchedule);
    }

    if (apiData) {
      // convert data
      const itemList: DataOfResource[] = CalenderViewCommon.convertScheduleList(
        apiData['resourceList'] || []
      );

      // Data classification
      itemList.forEach((schedule) => {
        CalenderViewWeekDay.classificationSchedule(
          listFullDaySchedule,
          listHourSchedule,
          schedule
        );
      });

      // sort data full days
      CalenderViewCommon.sortListScheduleOrResource(listFullDaySchedule);
      listFullDaySchedule.forEach((data) => {
        CalenderViewWeekCommon.pushScheduleFullDay(
          dataOfWeek,
          data,
          insertSchedule
        );
      });
      dataOfWeek.fullDayResource!.forEach((day) => {
        day.listSchedule!.sort((a, b) => a.sort! - b.sort!);
      });

      // Processing Data in day
      // sort schedule in day
      CalenderViewCommon.sortListScheduleOrResource(listHourSchedule);

      // push data to state
      listHourSchedule.forEach((item) => {
        CalenderViewWeekCommon.pushScheduleInDay(
          dataOfWeek,
          item,
          insertSchedule
        );
      });

      CalenderViewWeekCommon.calculateMaxWidth(dataOfWeek, insertSchedule);
    }

    return dataOfWeek;
  };
}
/**
 * Get Resources For Calendar By Week
 */
export type GetResourcesForCalendarByWeek = {
  startDateInWeek?: any;
  finishDateInWeek?: any;
  dayListInWeek?: ApiHeaderDayType[];

  resourceList?: ResourceListType[];
};
/**
 * Get Data For Calendar By Week
 */
export type GetDataForCalendarByWeek = {
  startDateInWeek?: any;
  finishDateInWeek?: any;
  dayListInWeek?: ApiHeaderDayType[];

  itemList?: ScheduleListType[];
};


