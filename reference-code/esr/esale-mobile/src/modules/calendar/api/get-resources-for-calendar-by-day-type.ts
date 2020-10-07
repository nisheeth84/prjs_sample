/**
 * Define data structure for API getResourcesForCalendarByDay
 **/

import { ResourceListType } from './resource-list-type';
import { ApiHeaderDayType, JSON_STRINGIFY } from './common-type';
import moment from 'moment';
import { LocalNavigation } from '../constants';
import { DataOfResource } from './common';
import { GetEquipmentTypeIdsSelected } from './get-data-for-calendar-by-month-type';

export type GetResourcesForCalendarByDay = ApiHeaderDayType & {
  monthInYear?: any;
  resourceList?: ResourceListType[];
};

const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY = (date: moment.Moment, localNavigation: LocalNavigation, _resource?: DataOfResource) => {
  const serachEquipmentTypes: number[] = GetEquipmentTypeIdsSelected(localNavigation);
  return `
  getResourcesForCalendarByDay(equipmentTypeIds: ${JSON_STRINGIFY(serachEquipmentTypes)}, date: "${date.utc().format()}")
  `;
};

export const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY_FULL = (date: moment.Moment, localNavigation: LocalNavigation) => {
  return `
  {
    ${PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY(date, localNavigation)} 
    {
      monthInYear
      dateByDay
      perpetualCalendar
      isHoliday
      isWeekend
      holidayName
      isCompanyHoliday
      companyHolidayName
      resourceList {
          resourceId
          resourceName
          scheduleId
          scheduleRepeatId
          scheduleTypeId
          scheduleName
          startDateSchedule
          finishDateSchedule
          isRepeat
          startDate
          finishDate
          isOverDay
      }
    }
 }
`;
};

export const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY_SHORT = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  resource: DataOfResource
) => {
  return `
  {
    ${PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY(date, localNavigation, resource)} 
    {
      monthInYear
      dateByDay
      perpetualCalendar
      isHoliday
      isWeekend
      holidayName
      isCompanyHoliday
      companyHolidayName
      resourceList {
          resourceId
          resourceName
          scheduleId
          scheduleRepeatId
          scheduleTypeId
          scheduleName
          startDateSchedule
          finishDateSchedule
          isRepeat
          startDate
          finishDate
          isOverDay
      }
    }
 }
`;
};
