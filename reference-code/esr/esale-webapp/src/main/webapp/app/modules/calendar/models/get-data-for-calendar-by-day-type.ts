/**
 * Define data structure for API getDataForCalendarByDay
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

export type GetDataForCalendarByDay = ApiHeaderDayType & {
  monthInYear?: any;
  itemList?: ScheduleListType[];
};

const PARAM_GET_DATA_FOR_CALENDAR_BY_DAY = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  schedule?: DataOfSchedule
) => {
  const searchEmployeeIds =
    localNavigation.searchConditions.searchDynamic.employeeIds ||
    GetParamEmployeeIdsSelected(localNavigation);
  const searchScheduleTypeIds = GetParamScheduleTypeIdsSelected(localNavigation);
  const searchAttendanceDivisions = GetParamAttendanceDivisions(localNavigation);
  const searchParticipationDivision = GetParamParticipationDivision(localNavigation);
  const searchIsSearchTask = GetParamIsSearchTask(localNavigation);
  const searchIsSearchMilestone = GetParamIsSearchMilestone(localNavigation);
  const isGetDateInfoValue = !(schedule && schedule.itemId > 0);
  const itemInfoValue = GetParamItemInfo(schedule);
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
    isSearchMilestone: searchIsSearchMilestone,
    isSearchSchedule: true,
    isGetDateInfo: isGetDateInfoValue,
    itemInfo: itemInfoValue,
    customerIds: searchCustomerIds,
    businessCardIds: searchCardIds
  };
};

export const PARAM_GET_DATA_FOR_CALENDAR_BY_DAY_FULL = (
  date: moment.Moment,
  localNavigation: LocalNavigation
) => {
  return PARAM_GET_DATA_FOR_CALENDAR_BY_DAY(date, localNavigation);
};

export const PARAM_GET_DATA_FOR_CALENDAR_BY_DAY_SHORT = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  schedule: DataOfSchedule
) => {
  return PARAM_GET_DATA_FOR_CALENDAR_BY_DAY(date, localNavigation, schedule);
};
