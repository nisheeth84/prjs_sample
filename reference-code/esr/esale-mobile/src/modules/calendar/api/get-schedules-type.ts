/**
 * Define data structure for API getSchedules
 **/

type EmployeesType = {
  employeeId?: any;
  employeeName?: any;
  attendanceDivision?: any;
};
type BusinessCardsType = {
  businessCardId?: any;
  businessCardName?: any;
};
type ProductTradingsType = {
  productTradingId?: any;
  producTradingName?: any;
};
type FilesType = {
  fileData?: any;
  fileName?: any;
};
type SchedulesType = {
  scheduleId?: any;
  scheduleName?: any;
  startDate?: any;
  endDate?: any;
  isFullDay?: any;
  isRepeated?: any;
  repeatCondition?: {
    repeatType?: any;
    repeatCycle?: any;
    regularDayOfWeek?: any;
    regularWeekOfMonth?: any;
    regularDayOfMonth?: any;
    regularEndOfMonth?: any;
    repeatEndType?: any;
    repeatEndDate?: any;
    repeatNumber?: any;
  };

  customers?: {
    customerId?: any;
    customerName?: any;
  };

  address?: any;
  note?: any;
  files?: FilesType[];
  isPublic?: any;
  productTradings?: ProductTradingsType[];
  businessCards?: BusinessCardsType[];
  employees?: EmployeesType[];
  canModify?: any;
  createdUser?: any;
  createdDate?: any;
  updatedUser?: any;
  updatedDate?: any;
};

export type ScheduleType = {
  scheduleTypeId: number;
  scheduleTypeName: string;
  iconType: number;
  iconName: string;
  iconPath: string;
  isAvailable: boolean;
  displayOrder: number;
};

export type GetSchedules = {
  schedules?: SchedulesType[];
};
