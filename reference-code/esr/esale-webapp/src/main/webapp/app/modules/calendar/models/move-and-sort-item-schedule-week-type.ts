/**
 * Define data structure for API moveAndSortItemScheduleWeek
 **/
type ItemListInDayType = {
  itemType?: any;
  itemId?: any;
  itemName?: any;
  employeeIds?: any;
  startDate?: any;
  finishDate?: any;
  itemIcon?: any;
  isFullDay?: any;
  isOverDay?: any;
  isRepeat?: any;
  scheduleRepeatId?: any;
  scheduleTypeId?: any;
  isPublic?: any;
  isReportActivity?: any;
  isParticipantUser?: any;
  milestoneStatus?: any;
  taskStatus?: any;
  participationDivision?: any;
  attendanceDivision?: any;
  isStartDaySchedule?: any;
  isEndDaySchedule?: any;
};
type DayListInWeekType = {
  dayName?: any;
  dateByDay?: any;
  perpetualCalendar?: any;
  isHoliday?: any;
  holidayName?: any;
  isOverItemNumberInDay?: any;
  hideItemNumber?: any;
  itemListInDay?: ItemListInDayType[];
};
export type MoveAndSortItemScheduleWeek = {
  startDateInWeek?: any;
  finishDateInWeek?: any;
  dayListInWeek?: DayListInWeekType[];
};
