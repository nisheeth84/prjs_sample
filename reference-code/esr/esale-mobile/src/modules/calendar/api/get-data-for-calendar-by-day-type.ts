/**
 * Define data structure for API getDataForCalendarByDay
 **/
import { ScheduleListType } from './schedule-list-type';
import { JSON_STRINGIFY } from './common-type';
import moment from 'moment';
import { LocalNavigation } from '../constants';
import { DataOfSchedule } from './common';
import {
  GetParamEmployeeIdsSelected,
  GetParamScheduleTypeIdsSelected,
  GetParamAttendanceDivisions,
  GetParamParticipationDivision,
  GetParamIsSearchTask,
  GetParamIsSearchMilestone,
  GetParamItemInfo
} from './get-data-for-calendar-by-month-type';

export type GetDataForCalendarByDay = {
  monthInYear?: any;
  companyHolidayName?: any;
  holidayName?: any;                                                                                                                                                                                                                                         
  dateByDay?: any;                                                                                                                                                                                                                                  
  perpetualCalendar?:any;                                                            
  isWeekend?: any;                                                                                                                                                                                                                                 
  isHoliday?: any;                                                                                                                                                                                                                                      
  isCompanyHoliday?: any;
  itemList?: ScheduleListType[];
  endDate?: any,
  endHour?: any,
  endTimestamp?: any,
  fullDaySchedule?: any,
  listHourSchedule?: any,
  startDate?: any,
  startHour?: any,
  startTimestamp?: any,
  date?: any
};

export const PARAM_GET_DATA_FOR_CALENDAR_BY_DAY = (date: moment.Moment, localNavigation: LocalNavigation, schedule?: DataOfSchedule) => {
  const searchEmployeeIds = GetParamEmployeeIdsSelected(localNavigation);
  const searchScheduleTypeIds = GetParamScheduleTypeIdsSelected(localNavigation);
  const searchAttendanceDivisions = GetParamAttendanceDivisions(localNavigation);
  const searchParticipationDivision = GetParamParticipationDivision(localNavigation);
  const searchIsSearchTask = GetParamIsSearchTask(localNavigation);
  const searchIsSearchMilestone = GetParamIsSearchMilestone(localNavigation);
  const isGetDateInfo = !(schedule && schedule.itemId > 0);
  const itemInfo = GetParamItemInfo(schedule);
  return {
    employeeIds: JSON_STRINGIFY(searchEmployeeIds),
    scheduleTypeIds: JSON_STRINGIFY(searchScheduleTypeIds),
    date: date.utc().format(),
    participationDivision: JSON_STRINGIFY(searchParticipationDivision),
    attendanceDivisions: JSON_STRINGIFY(searchAttendanceDivisions),
    isSearchTask: JSON_STRINGIFY(searchIsSearchTask),
    isSearchMilestone: JSON_STRINGIFY(searchIsSearchMilestone),
    isSearchSchedule: JSON_STRINGIFY(true),
    isGetDateInfo: JSON_STRINGIFY(isGetDateInfo),
    itemInfo: JSON_STRINGIFY(itemInfo),

  };
};

export const PARAM_GET_DATA_FOR_CALENDAR_BY_DAY_FULL = (date: moment.Moment, localNavigation: LocalNavigation) => {
  return `
  {
    ${PARAM_GET_DATA_FOR_CALENDAR_BY_DAY(date, localNavigation)}
    {
                 monthInYear
                 dateByDay
                 perpetualCalendar
                 holidayName
                 isHoliday
                 isWeekend
                 isCompanyHoliday
                 companyHolidayName
                 itemList {
                     itemType
                     itemId
                     itemName
                     employeeIds {
                         employeeId
                     }
                     startDate
                     finishDate
                     itemIcon
                     isFullDay
                     isOverDay
                     isRepeat
                     scheduleRepeatId
                     scheduleTypeId
                     isPublic
                     isReportActivity
                     address
                     countBadge
                     badgeItemIds {
                         scheduleId
                     }
                     isParticipantUser
                     milestoneStatus
                     taskStatus
                     participationDivision
                     attendanceDivision
                     isDuplicate
                     customers {
                         customerId
                         customerName
                     }
                     productTradings {
                         productTradingId
                         productName
                     }
                 }
        }
 }
`;
};

export const PARAM_GET_DATA_FOR_CALENDAR_BY_DAY_SHORT = (
  date: moment.Moment,
  localNavigation: LocalNavigation,
  schedule: DataOfSchedule
) => {
  return `
  {
    ${PARAM_GET_DATA_FOR_CALENDAR_BY_DAY(date, localNavigation, schedule)}
    {
                 monthInYear
                 dateByDay
                 perpetualCalendar
                 holidayName
                 isHoliday
                 isWeekend
                 isCompanyHoliday
                 companyHolidayName
                 itemList {
                     itemType
                     itemId
                     itemName
                     employeeIds {
                         employeeId
                     }
                     startDate
                     finishDate
                     itemIcon
                     isFullDay
                     isOverDay
                     isRepeat
                     scheduleRepeatId
                     scheduleTypeId
                     isPublic
                     isReportActivity
                     address
                     countBadge
                     badgeItemIds {
                         scheduleId
                     }
                     isParticipantUser
                     milestoneStatus
                     taskStatus
                     participationDivision
                     attendanceDivision
                     isDuplicate
                     customers {
                         customerId
                         customerName
                     }
                     productTradings {
                         productTradingId
                         productName
                     }
                 }
        }
 }
`;
};
