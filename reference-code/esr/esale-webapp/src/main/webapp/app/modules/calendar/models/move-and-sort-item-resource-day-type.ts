/**
 * Define data structure for API moveAndSortItemResourceDay
 **/

type ResourceListInDayType = {
  resourceId?: any;
  resourceName?: any;
  scheduleId?: any;
  scheduleRepeatId?: any;
  scheduleTypeId?: any;
  scheduleName?: any;
  startDateSchedule?: any;
  finishDateSchedule?: any;
  isRepeat?: any;
  startDate?: any;
  finishDate?: any;
  isOverDay?: any;
};
export type MoveAndSortItemResourceDay = {
  monthInYear?: any;
  dayName?: any;
  dateByDay?: any;
  perpetualCalendar?: any;
  isHoliday?: any;
  holidayName?: any;
  isOverResourceNumberInDay?: any;
  hideResourceNumber?: any;
  resourceListInDay?: ResourceListInDayType[];
};
