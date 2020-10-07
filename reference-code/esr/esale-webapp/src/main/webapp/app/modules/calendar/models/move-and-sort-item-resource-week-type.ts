/**
 * Define data structure for API moveAndSortItemResourceWeek
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
  isStartDayResource?: any;
  isEndDayResource?: any;
};
type DayListInWeekType = {
  dayName?: any;
  dateByDay?: any;
  perpetualCalendar?: any;
  holidayName?: any;
  isHoliday?: any;
  isOverResourceNumberInDay?: any;
  hideResourceNumber?: any;
  resourceListInDay?: ResourceListInDayType[];
};
export type MoveAndSortItemResourceWeek = {
  startDateInWeek?: any;
  finishDateInWeek?: any;
  dayListInWeek?: DayListInWeekType[];
};
