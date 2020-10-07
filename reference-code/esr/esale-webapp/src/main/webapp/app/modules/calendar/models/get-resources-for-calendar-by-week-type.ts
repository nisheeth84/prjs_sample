/**
 * Define data structure for API getResourcesForCalendarByWeek
 **/

import { ResourceListType } from './resource-list-type';
import { ApiHeaderDayType } from './common-type';
import moment from 'moment';
import { LocalNavigation } from '../constants';
import { GetEquipmentTypeIdsSelected } from './get-data-for-calendar-by-month-type';
import { DataOfResource, CalenderViewMonthCommon } from '../grid/common';

export type GetResourcesForCalendarByWeek = {
  startDateInWeek?: any;
  finishDateInWeek?: any;
  dayListInWeek?: ApiHeaderDayType[];
  resourceList?: ResourceListType[];
};

const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_WEEK = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  resource?: DataOfResource
) => {
  const searchEquipmentTypes: number[] = GetEquipmentTypeIdsSelected(localNavigation);
  return {
    isGetDateInfo: true,
    equipmentTypeIds: searchEquipmentTypes,
    date: CalenderViewMonthCommon.roundDownDay(
      CalenderViewMonthCommon.localToTimezoneOfConfig(date)
    )
      .utc()
      .format()
  };
};

export const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_WEEK_FULL = (
  date: moment.Moment,
  localNavigation: LocalNavigation
) => {
  return PARAM_GET_RESOURCES_FOR_CALENDAR_BY_WEEK(date, localNavigation);
};

export const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_WEEK_SHORT = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  resource: DataOfResource
) => {
  return PARAM_GET_RESOURCES_FOR_CALENDAR_BY_WEEK(date, localNavigation, resource);
};
