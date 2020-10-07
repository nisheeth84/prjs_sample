/**
 * Define data structure for API moveAndSortItemScheduleDay
 **/

type BadgeItemIdsType = {
  scheduleId?: any;
};
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
  address?: any;
  countBadge?: any;
  badgeItemIds?: BadgeItemIdsType[];
  isParticipantUser?: any;
  milestoneStatus?: any;
  taskStatus?: any;
  participationDivision?: any;
  attendanceDivision?: any;
};
export type MoveAndSortItemScheduleDay = {
  monthInYear?: any;
  dayName?: any;
  dateByDay?: any;
  perpetualCalendar?: any;
  isHoliday?: any;
  holidayName?: any;
  isOverItemNumberInDay?: any;
  hideItemNumber?: any;
  itemListInDay?: ItemListInDayType[];
};
