/**
 * Define data structure for API getDataForCalendarByList
 **/
import { ScheduleListType } from './schedule-list-type';
import { ApiHeaderDayType } from './common-type';
import moment from 'moment';
import { LocalNavigation } from '../constants';
import { DataOfSchedule, CalenderViewMonthCommon } from '../grid/common';
import {
  GetParamEmployeeIdsSelected,
  GetParamScheduleTypeIdsSelected,
  GetParamCustomerIdsSelected,
  GetParamBusinessCardIdsSelected,
  GetParamAttendanceDivisions,
  GetParamParticipationDivision,
  GetParamIsSearchTask,
  GetParamIsSearchMilestone,
  GetParamItemInfo
} from './get-data-for-calendar-by-month-type';

export type GetDataForCalendarByList = {
  dateFromData?: any;
  dateToData?: any;
  isGetMoreData?: any;
  dateList?: ApiHeaderDayType[];
  itemList?: ScheduleListType[];
  countSchedule?: any;
  badges?: number;
};

export enum MODE_SEARCH_LIST {
  None = 1,
  SearchKeyword = 2,
  SearchDetail = 3
}

const PARAM_SEARCH_CONDITION = (searchConditions: any) => {
  return null;
};

const PARAM_GET_DATA_FOR_CALENDAR_BY_LIST = (
  modeSearch: MODE_SEARCH_LIST,
  dateFrom: moment.Moment,
  dateTo: moment.Moment,
  localNavigation: LocalNavigation,
  schedule?: DataOfSchedule,
  limitParam?: number,
  offsetParam?: number,
  localSearchKeyword?: string,
  searchConditions?: any,
  isSearchSchedule?: boolean,
  isSearchTask?: boolean,
  isSearchMilestone?: boolean
) => {
  // Ref to No [3.2], sheet [Detail progress (schedule)], file [110204_カレンダー（リスト表示）.xlsx]
  const objConditionSearch = {};

  if (!modeSearch || modeSearch === MODE_SEARCH_LIST.None) {
    objConditionSearch['employeeIds'] =
      localNavigation.searchConditions.searchDynamic.employeeIds ||
      GetParamEmployeeIdsSelected(localNavigation);
    objConditionSearch['typeSearch'] = MODE_SEARCH_LIST.None;
    objConditionSearch['scheduleTypeIds'] = GetParamScheduleTypeIdsSelected(localNavigation);
    objConditionSearch['participationDivision'] = GetParamParticipationDivision(localNavigation);
    objConditionSearch['attendanceDivisions'] = GetParamAttendanceDivisions(localNavigation);
    objConditionSearch['dateFrom'] = CalenderViewMonthCommon.roundDownDay(dateFrom)
      .utc()
      .format();
    if (dateTo) {
      objConditionSearch['dateTo'] = CalenderViewMonthCommon.roundUpDay(dateTo)
        .utc()
        .format();
    }
    objConditionSearch['isSearchTask'] = GetParamIsSearchTask(localNavigation);
    objConditionSearch['isSearchMilestone'] = GetParamIsSearchMilestone(localNavigation);
    objConditionSearch['isSearchSchedule'] = true;
    objConditionSearch['isGetDateInfo'] = true;
    if (schedule) {
      objConditionSearch['isGetDateInfo'] = false;
      objConditionSearch['itemInfo'] = GetParamItemInfo(schedule);
    }
    const searchCustomerIds = GetParamCustomerIdsSelected(localNavigation);
    const searchCardIds = GetParamBusinessCardIdsSelected(localNavigation);
    objConditionSearch['customerIds'] = searchCustomerIds;
    objConditionSearch['businessCardIds'] = searchCardIds;
    objConditionSearch['loginFlag'] = !!localNavigation.loginFlag;
  }

  if (modeSearch === MODE_SEARCH_LIST.SearchKeyword) {
    objConditionSearch['typeSearch'] = MODE_SEARCH_LIST.SearchKeyword;
    objConditionSearch['localSearchKeyword'] = localSearchKeyword;
    objConditionSearch['isGetDateInfo'] = true;
    objConditionSearch['isSearchTask'] = GetParamIsSearchTask(localNavigation);
    objConditionSearch['isSearchMilestone'] = GetParamIsSearchMilestone(localNavigation);
    objConditionSearch['isSearchSchedule'] = true;
    // objConditionSearch['dateTo'] = CalenderViewMonthCommon.nowDate()
    //   .utc()
    //   .format();
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
    // objConditionSearch['dateTo'] = CalenderViewMonthCommon.nowDate()
    //   .utc()
    //   .format();
    if (searchConditions.searchScheduleCondition.length === 0) {
      objConditionSearch['isSearchSchedule'] = false;
    }
    if (searchConditions.searchTaskCondition.length === 0) {
      objConditionSearch['isSearchTask'] = false;
    }
    if (searchConditions.searchMilestoneCondition.length === 0) {
      objConditionSearch['isSearchMilestone'] = false;
    }
  }
  return {
    ...objConditionSearch,
    limit: limitParam,
    offset: offsetParam
  };
};

export const PARAM_GET_DATA_FOR_CALENDAR_BY_LIST_FULL = (
  modeSearch: MODE_SEARCH_LIST,
  dateFrom: moment.Moment,
  dateTo: moment.Moment,
  localNavigation: LocalNavigation,
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
    null,
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

export const PARAM_GET_DATA_SCHEDULE_GLOBAL_TOOL = (date: moment.Moment) => {
  const paramFromDate = CalenderViewMonthCommon.roundDownDay(
    CalenderViewMonthCommon.localToTimezoneOfConfig(date)
  )
    // convert 0:0:0 of local to UTC
    .utc()
    .format();
  const paramToDate = CalenderViewMonthCommon.roundUpDay(
    CalenderViewMonthCommon.localToTimezoneOfConfig(date)
  )
    // convert 23:59:59 of local to UTC
    .utc()
    .format();
  return {
    dateFrom: paramFromDate,
    dateTo: paramToDate,
    isSearchSchedule: true,
    isSearchTask: false,
    isSearchMilestone: false,
    isGetDateInfo: true,
    loginFlag: true
  };
};
