/**
 * Define data structure for API moveAndSortItemScheduleMonth
 **/

type ItemListInDayType = {
  itemType?: any;
  itemId?: any;
  itemName?: any;
  employeeIds?: any;
  startDate?: any;
  endDate?: any;
  itemIcon?: any;
  isFullDay?: any;
  isOverDay?: any;
  isRepeat?: any;
  scheduleRepeatId?: any;
  scheduleTypeId?: any;
  isPublic?: any;
  isReportActivity?: any;
  isParticipantUser?: any;
  isDuplicate?: any;
  milestoneStatus?: any;
  taskStatus?: any;
  participationDivision?: any;
  attendanceDivision?: any;
  isStartDaySchedule?: any;
  isEndDaySchedule?: any;
  isFirstDayInWeek?: any;
  isLastDayInWeek?: any;
};
type DateListByDayType = {
  date?: any;
  perpetualCalendar?: any;
  holidayName?: any;
  isHoliday?: any;
  isOverItemNumberInDay?: any;
  hideItemNumber?: any;
  maxItemNumber?: any;
  itemListInDay?: ItemListInDayType[];
};
type DayListInWeekType = {
  dayName?: any;
  dateListByDay?: DateListByDayType[];
};
export type MoveAndSortItemScheduleMonth = {
  dayListInWeek?: DayListInWeekType[];
};
