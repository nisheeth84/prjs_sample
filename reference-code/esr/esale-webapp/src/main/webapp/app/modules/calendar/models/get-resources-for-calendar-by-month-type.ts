/**
 * Define data structure for API getResourcesForCalendarByMonth
 **/

import { ResourceListType } from './resource-list-type';
import { ApiHeaderDayType } from './common-type';
import moment from 'moment';
import { LocalNavigation } from '../constants';
import { GetEquipmentTypeIdsSelected } from './get-data-for-calendar-by-month-type';
import { DataOfResource, CalenderViewMonthCommon } from '../grid/common';

export type GetResourcesForCalendarByMonth = {
  dateGetMonth?: any;
  dateList?: ApiHeaderDayType[];
  resourceList?: ResourceListType[];
};

export const GetParamEquipmentInfo = (resource: DataOfResource) => {
  if (resource) {
    return {
      equipmentId: resource.resourceId,
      isRepeat: resource.isRepeat,
      scheduleRepeatId: resource.scheduleRepeatId
    };
  }
  return null;
};

const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_MONTH = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  resource?: DataOfResource
) => {
  // const isGetDateInfo = resource ? false : true;
  const searchEquipmentTypes: number[] = GetEquipmentTypeIdsSelected(localNavigation);
  // const equipmentInfo = GetParamEquipmentInfo(resource);
  // const sEquipmentInfo = 'equipmentInfo: ' + JSON_STRINGIFY(equipmentInfo) + ','
  const sEquipmentInfo = '';
  // const sGetDate = 'isGetDateInfo: ${JSON_STRINGIFY(isGetDateInfo)} ';
  const sGetDate = '';
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

export const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_MONTH_FULL = (
  date: moment.Moment,
  localNavigation: LocalNavigation
) => {
  return PARAM_GET_RESOURCES_FOR_CALENDAR_BY_MONTH(date, localNavigation);
};

export const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_MONTH_SHORT = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  resource: DataOfResource
) => {
  return PARAM_GET_RESOURCES_FOR_CALENDAR_BY_MONTH(date, localNavigation, resource);
};
