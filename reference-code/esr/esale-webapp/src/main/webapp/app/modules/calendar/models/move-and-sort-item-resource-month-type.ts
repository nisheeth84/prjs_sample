/**
 * Define data structure for API moveAndSortItemResourceMonth
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
  endDate?: any;
  isOverDay?: any;
  isStartDayResource?: any;
  isEndDayResource?: any;
  isFirstDayInWeek?: any;
  isLastDayInWeek?: any;
};
type DateListByDayType = {
  date?: any;
  perpetualCalendar?: any;
  holidayName?: any;
  isHoliday?: any;
  isOverResourceNumberInDay?: any;
  hideResourceNumber?: any;
  maxResourceNumber?: any;
  resourceListInDay?: ResourceListInDayType[];
};
type DayListInWeekType = {
  dayName?: any;
  dateListByDay?: DateListByDayType[];
};
export type MoveAndSortItemResourceMonth = {
  dayListInWeek?: DayListInWeekType[];
};
