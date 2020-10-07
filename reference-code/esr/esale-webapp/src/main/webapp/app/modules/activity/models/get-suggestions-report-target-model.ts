/**
 * Define data structure for API getSuggestionsReportTarget
 **/

type MilestonesType = {
  milestoneId?: any;
  milestoneName?: any;
  endDate?: any;
  customerId?: any;
  customerName?: any;
  parentCustomerName?: any;
};
type OperatorNamesType = {};
type ProductTradingsType = {
  productTradingId?: any;
  productTradingName?: any;
};
type TasksType = {
  taskId?: any;
  taskName?: any;
  milestone?: {
    milestoneId?: any;
    milestoneName?: any;
  };

  customer?: {
    customerId?: any;
    customerName?: any;
  };

  productTradings?: ProductTradingsType[];
  finishDate?: any;
  operatorNames?: OperatorNamesType[];
};
type SchedulesType = {
  scheduleId?: any;
  scheduleName?: any;
  scheduleTypeId?: any;
  startDate?: any;
  endDate?: any;
  productTradingId?: any;
  customerId?: any;
  customerName?: any;
  tasks?: TasksType[];
  milestones?: MilestonesType[];
};
export type GetSuggestionsReportTarget = {
  schedules?: SchedulesType[];
};
