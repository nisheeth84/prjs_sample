/**
 * Define data structure for API createActivity
 **/
export type CreateActivity = {
  activityId?: any;
};

type ProductTradingsType = {
  productTradingId?: any;
  customerId?: any;
  productId?: any;
  quantity?: any;
  price?: any;
  amount?: any;
  productTradingProgressId?: any;
  endPlanDate?: any;
  orderPlanDate?: any;
  employeeId?: any;
  memo?: any;
  productTradingData?: any;
};

export type ActivityForm = {
  contactDate?: any;
  activityStartTime?: any;
  activityEndTime?: any;
  activityDuration?: any;
  activityFormatId?: any;
  employeeId?: any;
  businessCardIds?: [];
  interviewer?: any;
  customerId?: any;
  productTradings?: ProductTradingsType[];
  customerIds?: [];
  memo?: any;
  taskIds?: [];
  scheduleIds?: [];
  activityData?: any;
  isDraft?: any;
  activityDataDraft?: any;
};
