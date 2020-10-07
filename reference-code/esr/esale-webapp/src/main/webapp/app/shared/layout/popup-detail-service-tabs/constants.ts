export const TAB_ID_LIST = {
  summary: 0,
  customer: 4,
  businessCard: 3,
  task: 5,
  tradingProduct: 1,
  calendar: 7,
  product: 6,
  groups: 8,
  changeHistory: 2
};

export enum TabAction {
  None,
  RequestDetail,
  FailureGetData,
  SuccessGetData
}

export enum TypeGetTaskByIdService {
  CustomerId,
  EmployeeId
}

export enum ConditionScope {
  Total,
  PersonInCharge
}

export enum ConditionRange {
  ThisAndChildren,
  ThisCustomerOnly
}

export const PRODUCT_TRADING_CUSTOM_CONTENT_FIELD = {
  customerId: 'customerId',
  productId: 'productId',
  productTradingProgressId: 'productTradingProgressId',
  employeeId: 'employeeId',
  createdUser: 'createdUser',
  updatedUser: 'updatedUser'
};

export const PRODUCT_TRADING_CUSTOM_FIELD_VALUE = {
  productTradingId: 'productTradingId',
  quantity: 'quantity',
  price: 'price',
  amount: 'amount',
  orderPlanDate: 'orderPlanDate',
  endPlanDate: 'endPlanDate',
  memo: 'memo',
  createdDate: 'createdDate',
  updatedDate: 'updatedDate'
};
