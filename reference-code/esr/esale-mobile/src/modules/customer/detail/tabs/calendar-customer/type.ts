export type ApiHeaderDayType = {
  date?: any;
  dateByDay?: any;
  perpetualCalendar?: any;
  holidayName?: any;
  isWeekend?: any;
  isHoliday?: any;
  companyHolidayName?: any;
  isCompanyHoliday?: any;
};

// Define data structure for one schedule
export type DataOfSchedule = ScheduleListType & {
  uniqueId?: string;

  // Define a field to manage in the client
  isShow?: boolean;
  sort?: number;
  color?: string;

  // schedule is root (case over day)
  isRoot?: boolean;
  // if over day, then how number day/hour to over
  numOverDay?: number;
  maxWidth?: number;

  // schedule is first of week (case over day)
  isFirstWeek?: boolean;

  startDateMoment?: string;
  finishDateMoment?: string;

  startDateSortMoment?: string;
  finishDateSortMoment?: string;

  startDateSortTimestamp?: number;
  finishDateSortTimestamp?: number;

  isStartPrevious?: boolean;
  isEndNext?: boolean;

  top?: number; // in minutes (top = (top * (height td/ 60)))
  height?: number; // in minutes

  left?: number; // in %
  width?: number; // in %

  // if isOverDay = true and isRoot = false then _root = root schedule
  rootId?: string;
  listChildId?: string[];
};

// define structure data for resource common in grid
export type DataOfResource = ResourceListType & {
  uniqueId?: string;

  // Define a field to manage in the client
  isShow?: boolean;
  sort?: number;
  color?: string;

  // schedule is root (case over day)
  isRoot?: boolean;
  // if over day, then how number day/hour to over
  numOverDay?: number;
  maxWidth?: number;

  // schedule is first of week (case over day)
  isFirstWeek?: boolean;

  startDateMoment?: string;
  finishDateMoment?: string;

  startDateSortMoment?: string;
  finishDateSortMoment?: string;

  startDateSortTimestamp?: number;
  finishDateSortTimestamp?: number;

  isStartPrevious?: boolean;
  isEndNext?: boolean;

  top?: number; // in minutes (top = (top * (height td/ 60)))
  height?: number; // in minutes

  left?: number; // in %
  width?: number; // in % of width TD

  // if isOverDay = true and isRoot = false then _root = root schedule
  rootId?: string;
  listChildId?: string[];
};

export type DataHeader = ApiHeaderDayType & {
  dateMoment?: any;
  timestamp?: number;
  isScheduleHeader?: boolean
};

/**
 * Define data structure for 1 day
 */
export type DataOfDay = {
  dataHeader: DataHeader;

  listSchedule?: DataOfSchedule[];
  listResource?: DataOfResource[];
};


// Define data structure for the calendar display by week
export type HourOfDay = {
  // Start time
  startHour: any;
  startMinute: number;
  // End time
  endHour: any;
  endMinute: number;

  listDay: DataOfDay[];
};

/**
 * Define data structure for week and days calendar
 */
export type DataOfDetailWeek = {
  // Start day of the week
  startDate?: string;
  startTimestamp?: number;
  // End date of the week
  endDate?: string;
  endTimestamp?: number;

  // Start time
  startHour?: number;
  // End time
  endHour?: number;

  refSchedule?: {};
  refResource?: {};

  fullDaySchedule?: DataOfDay[];
  fullDayResource?: DataOfDay[];
  listHourSchedule?: HourOfDay[];
  listHourResource?: HourOfDay[];
};

/**
 * Define data structure for view list calendar
 */
export type DataOfList = {
  dateFromData?: any;
  dateToData?: any;
  isGetMoreData?: any;
  countSchedule?: any;
  listDay?: DataOfDay[];
};

/**
 * Define data structure for view list calendar
 */
export type DataOfViewList = {
  dataSchedule?: DataOfList;
  dataResource?: DataOfList;
};

/**
 * Define data structure for list ScheduleInfo
 **/

export type ProductTradingsType = {
  customerId?: any;
  productTradingId?: any;
  productId?: any;
  productName?: any;
};
export type CustomersType = {
  customerId?: any;
  customerName?: any;
};
export type EmployeeIdsType = {
  employeeId?: any;
};

export type BadgeItemIdsType = {
  scheduleId?: any;
};

export type BusinessCardsType = {
  businessCardId?: any;
  businessCardName?: any;
};

export type ScheduleListType = {
  itemType?: any;
  itemId?: any;
  itemName?: any;
  employeeIds?: EmployeeIdsType[];
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
  isDuplicate?: any;
  milestoneStatus?: any;
  taskStatus?: any;
  participationDivision?: any;
  attendanceDivision?: any;
  customers?: CustomersType[];
  productTradings?: ProductTradingsType[];

  address?: any;
  countBadge?: any;
  badgeItemIds?: BadgeItemIdsType[];
  updatedDate?: string;

  businessCards?: BusinessCardsType[];
  updateFlag?: number;
};

/**
 * Define data structure for list ResourceInfo
 **/

export type ResourceListType = {
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
  isFullDay?: any;
  itemType?: any;
  rootId?: any
};
