/**
 * Define data structure for API getProductTradings
 **/

type FieldInfoType = {
  fieldId?: any;
  fieldName?: any;
};
type ProgressesType = {
  productTradingProgressId?: any;
  progressName?: {
    jaJp?: any;
    enUs?: any;
    zhCn?: any;
  };

  isAvailable?: any;
  progressOrder?: any;
};
type ProductTradingsType = {
  productTradingId?: any;
  customerName?: any;
  customerId?: any;
  productId?: any;
  productName?: any;
  quantity?: any;
  price?: any;
  amount?: any;
  productTradingProgressId?: any;
  progressName?: any;
  progressOrder?: any;
  isAvailable?: any;
  employeeId?: any;
  employeeName?: any;
  endPlanDate?: any;
  orderPlanDate?: any;
  memo?: any;
  productTradingData?: any;
  updateDate?: any;
  progresses?: ProgressesType[];
  initializeInfo?: {};

  fieldInfo?: FieldInfoType[];
};
export type GetProductTradings = {
  productTradings?: ProductTradingsType[];
};
