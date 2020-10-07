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
