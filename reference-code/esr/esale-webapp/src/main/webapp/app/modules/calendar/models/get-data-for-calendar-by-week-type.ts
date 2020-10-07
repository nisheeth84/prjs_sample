/**
 * Define data structure for API getDataForCalendarByWeek
 **/
import { ScheduleListType } from './schedule-list-type';
import { ApiHeaderDayType } from './common-type';
import moment from 'moment';
import { LocalNavigation } from '../constants';
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
import { DataOfSchedule, CalenderViewMonthCommon } from '../grid/common';

export type GetDataForCalendarByWeek = {
  startDateInWeek?: any;
  finishDateInWeek?: any;
  dayListInWeek?: ApiHeaderDayType[];

  itemList?: ScheduleListType[];
};

const PARAM_GET_DATA_FOR_CALENDAR_BY_WEEK = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  schedule?: DataOfSchedule
) => {
  const searchEmployeeIds =
    localNavigation.searchConditions.searchDynamic.employeeIds ||
    GetParamEmployeeIdsSelected(localNavigation);
  const searchScheduleTypeIds = GetParamScheduleTypeIdsSelected(localNavigation);
  // const searchCustomerIds = GetParamCustomerIdsSelected(localNavigation);
  const searchAttendanceDivisions = GetParamAttendanceDivisions(localNavigation);
  const searchParticipationDivision = GetParamParticipationDivision(localNavigation);
  const searchIsSearchTask = GetParamIsSearchTask(localNavigation);
  const searchIsSearchMilestoneParam = GetParamIsSearchMilestone(localNavigation);
  const isGetDateInfoParam = !(schedule && schedule.itemId > 0);
  const itemInfoParam = GetParamItemInfo(schedule);
  const searchCustomerIds = GetParamCustomerIdsSelected(localNavigation);
  const searchCardIds = GetParamBusinessCardIdsSelected(localNavigation);
  return {
    employeeIds: searchEmployeeIds,
    scheduleTypeIds: searchScheduleTypeIds,
    date: CalenderViewMonthCommon.roundDownDay(
      CalenderViewMonthCommon.localToTimezoneOfConfig(date)
    )
      .utc()
      .format(),
    participationDivision: searchParticipationDivision,
    attendanceDivisions: searchAttendanceDivisions,
    isSearchTask: searchIsSearchTask,
    isSearchMilestone: searchIsSearchMilestoneParam,
    isSearchSchedule: true,
    isGetDateInfo: isGetDateInfoParam,
    itemInfo: itemInfoParam,
    customerIds: searchCustomerIds,
    businessCardIds: searchCardIds
  };
};

export const PARAM_GET_DATA_FOR_CALENDAR_BY_WEEK_FULL = (
  date: moment.Moment,
  localNavigation: LocalNavigation
) => {
  return PARAM_GET_DATA_FOR_CALENDAR_BY_WEEK(date, localNavigation);
};

export const PARAM_GET_DATA_FOR_CALENDAR_BY_WEEK_SHORT = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  schedule: DataOfSchedule
) => {
  return PARAM_GET_DATA_FOR_CALENDAR_BY_WEEK(date, localNavigation, schedule);
};
