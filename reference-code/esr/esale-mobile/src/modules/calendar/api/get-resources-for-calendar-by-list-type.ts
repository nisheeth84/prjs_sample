/**
 * Define data structure for API getResourcesForCalendarByList
 **/

import { ResourceListType } from './resource-list-type';
import { ApiHeaderDayType, JSON_STRINGIFY } from './common-type';
import moment from 'moment';
import { LocalNavigation } from '../constants';
import { DataOfResource } from './common';
import { GetEquipmentTypeIdsSelected } from './get-data-for-calendar-by-month-type';

export type GetResourcesForCalendarByList = {
  dateFromData?: any;
  dateToData?: any;
  isGetMoreData?: any;
  countSchedule?: any;

  dayList?: ApiHeaderDayType[];
  resourceList?: ResourceListType[];
};

const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST = (
  dateFrom: moment.Moment,
  dateTo: moment.Moment,
  localNavigation: LocalNavigation,
  _resource?: DataOfResource,
  limit?: number,
  offset?: number
) => {
  const serachEquipmentTypes: number[] = GetEquipmentTypeIdsSelected(localNavigation);
  // const isGetDateInfo = resource ? false : true;
  return `
  getResourcesForCalendarByList(
    equipmentTypeIds: ${JSON_STRINGIFY(serachEquipmentTypes)}, 
    dateFrom: "${dateFrom.utc().format()}",
    dateTo: ${JSON_STRINGIFY(dateTo ? dateTo.utc().format() : null)}, 
    limit: ${JSON_STRINGIFY(limit)},
    offset: ${JSON_STRINGIFY(offset)}
  )
  `;
};

const RESONSE_DATE_LIST = `
dayList {
      dateByDay	
      perpetualCalendar	
      isHoliday	
      holidayName	
      isCompanyHoliday	
      companyHolidayName	
  }
  `;

export const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST_FULL = (
  dateFrom: moment.Moment,
  dateTo: moment.Moment,
  localNavigation: LocalNavigation,
  limit?: number,
  offset?: number
) => {
  return `
  {
    ${PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST(dateFrom, dateTo, localNavigation, undefined, limit, offset)} 
    {
      dateFromData
      dateToData
      isGetMoreData
      ${RESONSE_DATE_LIST}
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

export const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST_SHORT = (
  dateFrom: moment.Moment,
  dateTo: moment.Moment,
  localNavigation: LocalNavigation,
  resource: DataOfResource,
  limit?: number,
  offset?: number
) => {
  return `
  {
    ${PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST(dateFrom, dateTo, localNavigation, resource, limit, offset)} 
    {
      dateFromData
      dateToData
      isGetMoreData
      
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
