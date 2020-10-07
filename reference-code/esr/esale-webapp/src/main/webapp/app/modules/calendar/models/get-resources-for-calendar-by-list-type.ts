/**
 * Define data structure for API getResourcesForCalendarByList
 **/

import { ResourceListType } from './resource-list-type';
import { ApiHeaderDayType } from './common-type';
import moment from 'moment';
import { LocalNavigation } from '../constants';
import { DataOfResource, CalenderViewMonthCommon } from '../grid/common';
import { GetEquipmentTypeIdsSelected } from './get-data-for-calendar-by-month-type';

export type GetResourcesForCalendarByList = {
  dateFromData?: any;
  dateToData?: any;
  isGetMoreData?: any;

  dayList?: ApiHeaderDayType[];
  resourceList?: ResourceListType[];
};

const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST = (
  dateFrom: moment.Moment,
  dateTo: moment.Moment,
  localNavigation: LocalNavigation,
  resource?: DataOfResource,
  limitParam?: number,
  offsetParam?: number
) => {
  const searchEquipmentTypes: number[] = GetEquipmentTypeIdsSelected(localNavigation);
  // const isGetDateInfo = resource ? false : true;
  return {
    equipmentTypeIds: searchEquipmentTypes,
    dateFrom: CalenderViewMonthCommon.roundDownDay(
      CalenderViewMonthCommon.localToTimezoneOfConfig(dateFrom)
    )
      .utc()
      .format(),
    dateTo: dateTo
      ? CalenderViewMonthCommon.roundUpDay(CalenderViewMonthCommon.localToTimezoneOfConfig(dateTo))
          .utc()
          .format()
      : null,
    limit: limitParam,
    offset: offsetParam
  };
};

export const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST_FULL = (
  dateFrom: moment.Moment,
  dateTo: moment.Moment,
  localNavigation: LocalNavigation,
  limit?: number,
  offset?: number
) => {
  return PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST(
    dateFrom,
    dateTo,
    localNavigation,
    null,
    limit,
    offset
  );
};

export const PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST_SHORT = (
  dateFrom: moment.Moment,
  dateTo: moment.Moment,
  localNavigation: LocalNavigation,
  resource: DataOfResource,
  limit?: number,
  offset?: number
) => {
  return PARAM_GET_RESOURCES_FOR_CALENDAR_BY_LIST(
    dateFrom,
    dateTo,
    localNavigation,
    resource,
    limit,
    offset
  );
};
