import moment from 'moment';
import _ from 'lodash';
import {
  ScheduleListType,
  ResourceListType,
  DataOfSchedule,
  DataHeader,
  DataOfDay,
  DataOfDetailWeek,
  DataOfResource,
  DataOfViewList,
  ApiHeaderDayType,
} from './type';
import { MAX_SHOW_SCHEDULE_IN_LIST_VIEW } from '../../../../../config/constants/calendar';

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
   * Sort data schedule or Resource
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
          if (a['itemType']) {
            /**
             * case sort ScheduleListType
             * - 1: milestone
             * - 2: task
             * - 3: schedule
             */
            return (a['itemType'] || 0) - (b['itemType'] || 0);
          }
          return 0;
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
      let minDay = values[0];
      for (let i = 1; i < values.length; i++) {
        if (!minDay && values[i]) minDay = values[i];
        else if (
          values[i] &&
          minDay &&
          CalenderViewCommon.compareDateByDay(
            moment(minDay),
            moment(values[i])
          ) > 0
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
      .utc(date.date || date.dateByDay)
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
   * Calender View Week Day
   */
  static classificationSchedule = (
    listFullDaySchedule: any,
    listHourSchedule: any,
    schedule: any
  ) => {
    if (!NVL(schedule['itemType']) && schedule['itemType'] !== 3) {
      listFullDaySchedule.push(schedule);
    } else {
      if (schedule.isOverDay || schedule['isFullDay']) {
        listFullDaySchedule.push(schedule);
      } else {
        listHourSchedule.push(schedule);
      }
    }
  };
}
/**
 * Calender ViewWeek List
 */
export class CalenderViewWeekList {
  /**
   * Copy data to state of calender list
   * @param oldState : DataOfDetailWeek
   * @param rawData
   *
   * @returns DataOfDetailWeek
   */
  static buildScheduleOfCalendarList = (
    oldDataOfList: DataOfViewList,
    apiData: any,
    itemId?: number,
  ): DataOfViewList => {
    /**
     * Sort data schedule
     */
    const dataOfList: DataOfViewList = oldDataOfList || {
      dataSchedule: {},
      dataResource: {},
    };
    if (!itemId || itemId < 1) {
      const dateList: ApiHeaderDayType[] = apiData['dateList'] || [];
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
                dateByDay: moment(data.date).startOf('months').date(),
                isScheduleHeader: true,
              },
              listSchedule: [],
              listResource: [],
            };
            dataScheduleHeader.dataHeader.timestamp = moment(
              dataScheduleHeader.dataHeader.dateMoment
            ).unix();
            dataOfList.dataSchedule!.listDay!.push(dataScheduleHeader);
          }
          dataOfList.dataSchedule!.listDay!.push(
            CalenderViewCommon.initDataOfDay(data)
          );
        });
      }
    }
    if (apiData) {
      // convert data
      let itemList: DataOfSchedule[] = CalenderViewCommon.convertScheduleList(
        apiData['itemList'] || []
      );
      if (itemList.length >= MAX_SHOW_SCHEDULE_IN_LIST_VIEW) {
        itemList = itemList.slice(0, MAX_SHOW_SCHEDULE_IN_LIST_VIEW);
        dataOfList.dataSchedule!.isGetMoreData = false;
      } else {
        dataOfList.dataSchedule!.isGetMoreData = true;
      }
      // sort data full days
      CalenderViewCommon.sortListScheduleOrResource(itemList);
      // Data classification
      itemList.forEach((schedule) => {
        const indexDay = dataOfList.dataSchedule!.listDay!.findIndex(
          (day: DataOfDay) => {
            return (
              !day.dataHeader.isScheduleHeader &&
              CalenderViewCommon.compareDateByDay(
                moment(day.dataHeader.dateMoment),
                moment(schedule.startDateSortMoment)
              ) === 0
            );
          }
        );
        if (indexDay >= 0) {
          if (!dataOfList.dataSchedule!.listDay![indexDay].listSchedule) {
            dataOfList.dataSchedule!.listDay![indexDay].listSchedule = [];
          }
          dataOfList.dataSchedule!.listDay![indexDay].listSchedule!.push(
            schedule
          );
        }
      });
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
    apiData: any,
    sHour: number,
    eHour: number,
    itemId?: number,
  ): DataOfDetailWeek => {
    /**
     * Sort data schedule
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
        const dateList: ApiHeaderDayType[] = [deaderInfo];
        // initial data of month with param is date
        CalenderViewWeekCommon.initDataOfGridWeek(
          dataOfWeek,
          dateList,
          insertSchedule
        );
      }
    }
    if (apiData) {
      // convert data
      const itemList: DataOfSchedule[] = CalenderViewCommon.convertScheduleList(
        apiData['itemList'] || []
      );
      // Data classification
      itemList.forEach((schedule) => {
        CalenderViewCommon.classificationSchedule(
          listFullDaySchedule,
          listHourSchedule,
          schedule
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
}
/**
 * Calender ViewWeek Common
 */
export class CalenderViewWeekCommon {
  /**
   * Copy data to state of calender month
   * @param dataOfWeek: DataOfDetailWeek
   * @param apiData:
   */
  static initDataOfGridWeek = (
    dataOfWeek: DataOfDetailWeek,
    dateList: ApiHeaderDayType[],
    insertSchedule: boolean
  ) => {
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
        const hourOfDay: any = {
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
    const fullDay = insertSchedule
      ? oldState.fullDaySchedule
      : oldState.fullDayResource;
    const findIndex = fullDay!.findIndex(
      (day) => objData.startDateSortTimestamp === day.dataHeader.timestamp
    );
    if (findIndex >= 0) {
      const dayFind = fullDay![findIndex];
      const listData = insertSchedule
        ? dayFind.listSchedule
        : dayFind.listResource;
      // Find the position without inserting data
      objData.sort = CalenderViewCommon.getLastEmptySortIndex(listData!);
      listData!.push(objData);
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
          let i = findIndex + 1;
          i < findIndex + maxDays + 1 && i < fullDay!.length;
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
      (hourx: any) =>
        hourx.startMinute <= startMinute && startMinute <= hourx.endMinute
    );
    if (indexHour < 0) return;

    // Find the date to insert data
    const findDayIndex = fullDay!.findIndex((day) => {
      return (
        CalenderViewCommon.compareDateByDay(
          moment(day.dataHeader.dateMoment),
          moment(objData.startDateSortMoment)
        ) === 0
      );
    });
    if (findDayIndex >= 0) {
      // if the end time over the end time
      const lastHearInHour: moment.Moment = moment(
        listHour![lengthListHour - 1].listDay[findDayIndex].dataHeader
          .dateMoment
      );
      const convertMinuteOfStart = CalenderViewCommon.convertDateToMinute(
        moment(objData.startDateSortMoment)
      );
      const convertMinuteOfEnd = CalenderViewCommon.convertDateToMinute(
        moment(objData.finishDateMoment)
      );
      const convertMinuteOfLatst =
        CalenderViewCommon.convertDateToMinute(lastHearInHour) + 59;
      const maxEndMinute = Math.min(convertMinuteOfEnd, convertMinuteOfLatst);
      if (convertMinuteOfEnd > convertMinuteOfLatst) {
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
      let leftWidh = 0;
      for (let i = 0; i < indexInListMinute; i++) {
        leftWidh += listMinute[startMinute][i].width;
      }
      s.left = leftWidh;
      s.width = parseFloat(((100 - leftWidh) / totalScheduleRight).toFixed(4));
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
}
