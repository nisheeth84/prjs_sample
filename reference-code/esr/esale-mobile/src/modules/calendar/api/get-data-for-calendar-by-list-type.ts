/**
 * Define data structure for API getDataForCalendarByList
 **/
import { ScheduleListType } from './schedule-list-type';
import { ApiHeaderDayType, JSON_STRINGIFY } from './common-type';
import moment from 'moment';
import { LocalNavigation } from '../constants';
import { DataOfSchedule} from './common';
import {
  GetParamEmployeeIdsSelected,
  GetParamScheduleTypeIdsSelected,
  GetParamAttendanceDivisions,
  GetParamParticipationDivision,
  GetParamIsSearchTask,
  GetParamIsSearchMilestone,
  GetParamItemInfo
} from './get-data-for-calendar-by-month-type';
// import { GetLocalNavigation } from './get-local-navigation-type';

export type GetDataForCalendarByList = {
  dateFromData?: any;
  dateToData?: any;
  isGetMoreData?: any;
  dateList?: ApiHeaderDayType[];
  itemList?: ScheduleListType[];
  countSchedule?: any;
};

export type GetDataForCalendarByDay = {
  dateFromData?: any;
  dateToData?: any;
  isGetMoreData?: any;
  dateList?: ApiHeaderDayType[];
  itemList?: ScheduleListType[];
  countSchedule?: any;
};

export enum MODE_SEARCH_LIST {
  None = 1,
  SearchKeyword = 2,
  SearchDetail = 3
}

export const PARAM_GET_DATA_FOR_CALENDAR_BY_LIST = (
  modeSearch: MODE_SEARCH_LIST,
  dateFrom: moment.Moment,
  dateTo: moment.Moment,
  localNavigation: LocalNavigation,
  schedule?: DataOfSchedule,
  _limit?: number,
  _offset?: number,
  localSearchKeyword?: string,
  searchConditions?: any,
  isSearchSchedule?: boolean,
  isSearchTask?: boolean,
  isSearchMilestone?: boolean,
) => {
  // Ref to No [3.2], sheet [Chi tiết xử lý (dự định)], file [110204_カレンダー（リスト表示）.xlsx]
  const objConditionSearch: any = {};
  if (!modeSearch || modeSearch === MODE_SEARCH_LIST.None) {
    objConditionSearch['typeSearch'] = MODE_SEARCH_LIST.None;
    objConditionSearch['employeeIds'] = JSON_STRINGIFY(GetParamEmployeeIdsSelected(localNavigation));
    objConditionSearch['scheduleTypeIds'] = JSON_STRINGIFY(GetParamScheduleTypeIdsSelected(localNavigation));
    objConditionSearch['participationDivision'] = JSON_STRINGIFY(GetParamParticipationDivision(localNavigation));
    objConditionSearch['attendanceDivisions'] = JSON_STRINGIFY(GetParamAttendanceDivisions(localNavigation));
    objConditionSearch['dateFrom'] = dateFrom.utc().format();
    if (dateTo) {
      objConditionSearch['dateTo'] = dateTo.utc().format();
    }
    if (schedule) {
      objConditionSearch['itemInfo'] = JSON_STRINGIFY(GetParamItemInfo(schedule));
    }
    // objConditionSearch['dateFrom'] = CalenderViewCommon.roundDownDay(dateFrom)
    //   .utc()
    //   .format();
    // if (dateTo) {
    //   objConditionSearch['dateTo'] = CalenderViewCommon.roundUpDay(dateTo)
    //     .utc()
    //     .format();
    // }
    objConditionSearch['isSearchTask'] = GetParamIsSearchTask(localNavigation);
    objConditionSearch['isSearchMilestone'] = GetParamIsSearchMilestone(localNavigation);
    objConditionSearch['isSearchSchedule'] = true;
    objConditionSearch['isGetDateInfo'] = true;
    if (schedule) {
      objConditionSearch['isGetDateInfo'] = false;
      objConditionSearch['itemInfo'] = GetParamItemInfo(schedule);
    }
  }

  if (modeSearch === MODE_SEARCH_LIST.SearchKeyword) {
    objConditionSearch['typeSearch'] = MODE_SEARCH_LIST.SearchKeyword;
    objConditionSearch['localSearchKeyword'] = localSearchKeyword;
    objConditionSearch['isGetDateInfo'] = true;
    objConditionSearch['isSearchTask'] = GetParamIsSearchTask(localNavigation);
    objConditionSearch['isSearchMilestone'] = GetParamIsSearchMilestone(localNavigation);
    objConditionSearch['isSearchSchedule'] = true;
  }

  if (modeSearch === MODE_SEARCH_LIST.SearchDetail) {
    objConditionSearch['typeSearch'] = MODE_SEARCH_LIST.SearchDetail;
    objConditionSearch['searchScheduleCondition'] = searchConditions.searchScheduleCondition;
    objConditionSearch['searchTaskCondition'] = searchConditions.searchTaskCondition;
    objConditionSearch['searchMilestoneCondition'] = searchConditions.searchMilestoneCondition;
    objConditionSearch['isSearchSchedule'] = isSearchSchedule;
    objConditionSearch['isSearchTask'] = isSearchTask;
    objConditionSearch['isSearchMilestone'] = isSearchMilestone;
    if (!isSearchSchedule && !isSearchTask && !isSearchMilestone) {
      objConditionSearch['isSearchSchedule'] = true;
      objConditionSearch['isSearchTask'] = true;
      objConditionSearch['isSearchMilestone'] = true;
    }
    objConditionSearch['isGetDateInfo'] = true;
  }
  return {
    ...objConditionSearch,
    // limit: JSON_STRINGIFY(_limit),
    // offset: JSON_STRINGIFY(_offset)
  };
};

  export const PARAM_GET_DATA_FOR_CALENDAR_BY_LIST_FULL = (
    modeSearch: MODE_SEARCH_LIST,
    dateFrom: moment.Moment,
    dateTo: moment.Moment,
    localNavigation: LocalNavigation,
    _schedule?: DataOfSchedule,
    limit?: number,
    offset?: number,
    localSearchKeyword?: string,
    searchConditions?: any,
    isSearchSchedule?: boolean,
    isSearchTask?: boolean,
    isSearchMilestone?: boolean
  ) => {
    return PARAM_GET_DATA_FOR_CALENDAR_BY_LIST(
      modeSearch,
      dateFrom,
      dateTo,
      localNavigation,
      undefined,
      limit,
      offset,
      localSearchKeyword,
      searchConditions,
      isSearchSchedule,
      isSearchTask,
      isSearchMilestone
    );
  };
  export const PARAM_GET_DATA_FOR_CALENDAR_BY_LIST_SHORT = (
    modeSearch: MODE_SEARCH_LIST,
    dateFrom: moment.Moment,
    dateTo: moment.Moment,
    localNavigation: LocalNavigation,
    schedule: DataOfSchedule,
    limit?: number,
    offset?: number,
    localSearchKeyword?: string
  ) => {
    return PARAM_GET_DATA_FOR_CALENDAR_BY_LIST(
      modeSearch,
      dateFrom,
      dateTo,
      localNavigation,
      schedule,
      limit,
      offset,
      localSearchKeyword
    );
  };