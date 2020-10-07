/**
 * Define data structure for API getDataForCalendarByMonth
 **/
import { ScheduleListType } from './schedule-list-type';
import { ApiHeaderDayType } from './common-type';
import moment from 'moment';
import _ from 'lodash';
import { LocalNavigation, AttendanceDivisionType, ParticipationDivisionType } from '../constants';
import {
  DepartmentsType,
  EmployeesType,
  ScheduleTypesType,
  EquipmentTypesType,
  GroupsType
} from './get-local-navigation-type';
import { DataOfSchedule, CalenderViewMonthCommon } from '../grid/common';

export type GetDataForCalendarByMonth = {
  dateGetMonth?: any;
  dateList?: ApiHeaderDayType[];
  itemList?: ScheduleListType[];
};

export const GetParamEmployeeIdsSelected = (localNavigation: LocalNavigation): number[] => {
  const departments =
    localNavigation &&
    localNavigation.searchConditions &&
    localNavigation.searchConditions.searchDynamic
      ? localNavigation.searchConditions.searchDynamic.departments
      : [];
  const groups =
    localNavigation &&
    localNavigation.searchConditions &&
    localNavigation.searchConditions.searchDynamic
      ? localNavigation.searchConditions.searchDynamic.groups
      : [];
  const searchEmployeeIds: number[] = [];
  if (_.isArray(departments)) {
    departments.forEach((d: DepartmentsType) => {
      d.employees &&
        d.employees.forEach((e: EmployeesType) => {
          if (e.isSelected) searchEmployeeIds.push(e.employeeId);
        });
    });
  }
  if (_.isArray(groups)) {
    groups.forEach((g: GroupsType) => {
      g.employees &&
        g.employees.forEach((e: EmployeesType) => {
          if (e.isSelected) searchEmployeeIds.push(e.employeeId);
        });
    });
  }
  return searchEmployeeIds;
};

export const GetParamScheduleTypeIdsSelected = (localNavigation: LocalNavigation): number[] => {
  const scheduleTypeIds =
    localNavigation &&
    localNavigation.searchConditions &&
    localNavigation.searchConditions.searchDynamic
      ? localNavigation.searchConditions.searchDynamic.scheduleTypes
      : [];
  const searchScheduleTypeIds: number[] = [];

  if (_.isArray(scheduleTypeIds)) {
    scheduleTypeIds.forEach((e: ScheduleTypesType) => {
      if (e.isSelected) searchScheduleTypeIds.push(e.scheduleTypeId);
    });
  }
  return searchScheduleTypeIds;
};

export const GetParamCustomerIdsSelected = (localNavigation: LocalNavigation): number[] => {
  return localNavigation.searchConditions.searchDynamic.customerIds;
};

export const GetParamBusinessCardIdsSelected = (localNavigation: LocalNavigation): number[] => {
  return localNavigation.searchConditions.searchDynamic.businessCardIds;
};

export const GetEquipmentTypeIdsSelected = (localNavigation: LocalNavigation): number[] => {
  const equipmentTypes =
    localNavigation &&
    localNavigation.searchConditions &&
    localNavigation.searchConditions.searchDynamic
      ? localNavigation.searchConditions.searchDynamic.equipmentTypes
      : [];
  const searchEquipmentTypes: number[] = [];

  if (_.isArray(equipmentTypes)) {
    equipmentTypes.forEach((e: EquipmentTypesType) => {
      if (e.isSelected) searchEquipmentTypes.push(e.equipmentTypeId);
    });
  }
  return searchEquipmentTypes;
};

export const GetParamAttendanceDivisions = (localNavigation: LocalNavigation): number[] => {
  /**
   * Checkbox 出席 / join: checked 01
   * Checkbox 欠席 / absent: checked 02
   * Checkbox 未確認 / unConfirmed: 00
   */
  const searchAttendanceDivisions: number[] = [];
  if (
    localNavigation &&
    localNavigation.searchConditions &&
    localNavigation.searchConditions.searchStatic
  ) {
    const searchStatic = localNavigation.searchConditions.searchStatic;
    if (searchStatic.isUnconfirmed)
      searchAttendanceDivisions.push(AttendanceDivisionType.NotConfirmed);
    if (searchStatic.isAbsence) searchAttendanceDivisions.push(AttendanceDivisionType.Absent);
    if (searchStatic.isAttended) searchAttendanceDivisions.push(AttendanceDivisionType.Available);
  }
  return searchAttendanceDivisions;
};

export const GetParamParticipationDivision = (localNavigation: LocalNavigation): number => {
  if (
    localNavigation &&
    localNavigation.searchConditions &&
    localNavigation.searchConditions.searchStatic
  ) {
    const searchStatic = localNavigation.searchConditions.searchStatic;
    if (searchStatic.isShared) return ParticipationDivisionType.Share;
  }
  return null;
};

export const GetParamIsSearchTask = (localNavigation: LocalNavigation): boolean => {
  if (
    localNavigation &&
    localNavigation.searchConditions &&
    localNavigation.searchConditions.searchStatic
  ) {
    const searchStatic = localNavigation.searchConditions.searchStatic;
    if (searchStatic.task) return true;
  }
  return false;
};

export const GetParamIsSearchMilestone = (localNavigation: LocalNavigation): boolean => {
  if (
    localNavigation &&
    localNavigation.searchConditions &&
    localNavigation.searchConditions.searchStatic
  ) {
    const searchStatic = localNavigation.searchConditions.searchStatic;
    if (searchStatic.milestone) return true;
  }
  return false;
};

export const GetParamItemInfo = (schedule: DataOfSchedule) => {
  if (schedule) {
    return {
      itemId: schedule.itemId,
      itemType: schedule.itemType,
      isRepeat: schedule.isRepeat,
      scheduleRepeatId: schedule.scheduleRepeatId
    };
  }
  return {};
};

const PARAM_GET_DATA_FOR_CALENDAR_BY_MONTH = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  schedule?: DataOfSchedule
) => {
  const searchEmployeeIds =
    localNavigation.searchConditions.searchDynamic.employeeIds ||
    GetParamEmployeeIdsSelected(localNavigation);
  const searchScheduleTypeIds = GetParamScheduleTypeIdsSelected(localNavigation);
  const searchCustomerIds = GetParamCustomerIdsSelected(localNavigation);
  const searchCardIds = GetParamBusinessCardIdsSelected(localNavigation);
  const searchAttendanceDivisions = GetParamAttendanceDivisions(localNavigation);
  const searchParticipationDivision = GetParamParticipationDivision(localNavigation);
  const searchIsSearchTask = GetParamIsSearchTask(localNavigation);
  const searchIsSearchMilestone = GetParamIsSearchMilestone(localNavigation);
  const isGetDateInfoParam = !(schedule && schedule.itemId > 0);
  const itemInfoParam = GetParamItemInfo(schedule);

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
    isGetDateInfo: isGetDateInfoParam,
    itemInfo: itemInfoParam,
    customerIds: searchCustomerIds,
    businessCardIds: searchCardIds
  };
};

export const PARAM_GET_DATA_FOR_CALENDAR_BY_MONTH_FULL = (
  date: moment.Moment,
  localNavigation: LocalNavigation
) => {
  return PARAM_GET_DATA_FOR_CALENDAR_BY_MONTH(date, localNavigation);
};

export const PARAM_GET_DATA_FOR_CALENDAR_BY_MONTH_SHORT = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  schedule: DataOfSchedule
) => {
  return PARAM_GET_DATA_FOR_CALENDAR_BY_MONTH(date, localNavigation, schedule);
};
