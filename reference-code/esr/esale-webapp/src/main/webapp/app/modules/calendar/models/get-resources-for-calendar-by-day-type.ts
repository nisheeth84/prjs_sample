/**
 * Define data structure for API getResourcesForCalendarByDay
 **/

import { ResourceListType } from './resource-list-type';
import { ApiHeaderDayType } from './common-type';
import moment from 'moment';
import { LocalNavigation } from '../constants';
import { DataOfResource, CalenderViewMonthCommon } from '../grid/common';
import { GetEquipmentTypeIdsSelected } from './get-data-for-calendar-by-month-type';

export type GetResourcesForCalendarByDay = ApiHeaderDayType & {
  monthInYear?: any;
  resourceList?: ResourceListType[];
};

const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  resource?: DataOfResource
) => {
  const searchEquipmentTypes: number[] = GetEquipmentTypeIdsSelected(localNavigation);
  return {
    equipmentTypeIds: searchEquipmentTypes,
    isGetDateInfo: true,
    date: CalenderViewMonthCommon.roundDownDay(
      CalenderViewMonthCommon.localToTimezoneOfConfig(date)
    )
      .utc()
      .format()
  };
};

export const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY_FULL = (
  date: moment.Moment,
  localNavigation: LocalNavigation
) => {
  return PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY(date, localNavigation);
};

export const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY_SHORT = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  resource: DataOfResource
) => {
  return PARAM_GET_RESOURCES_FOR_CALENDAR_BY_DAY(date, localNavigation, resource);
};
