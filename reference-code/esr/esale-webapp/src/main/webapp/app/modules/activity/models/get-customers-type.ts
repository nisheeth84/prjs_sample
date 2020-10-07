/**
 * Define data structure for API getCustomers
 **/

type FieldInfoType = {
  fieldId?: any;
};
type ProductTradingsType = {
  productId?: any;
  productName?: any;
  customerId?: any;
  customerName?: any;
  businessCardId?: any;
  businessCardName?: any;
  employeeId?: any;
  employeeName?: any;
  progressName?: any;
  tradingDate?: any;
  quantity?: any;
  amount?: any;
};
type CustomerDataType = {
  fieldType?: any;
  key?: any;
  value?: any;
};
type CustomersType = {
  customerId?: any;
  customerName?: any;
  customerAliasName?: any;
  phoneNumber?: any;
  zipCode?: any;
  prefecture?: any;
  building?: any;
  address?: any;
  businessMainId?: any;
  businessMainName?: any;
  businessSubId?: any;
  businessSubName?: any;
  url?: any;
  memo?: any;
  customerData?: CustomerDataType[];
  createdDate?: any;
  createdUser?: any;
  updatedDate?: any;
  updatedUser?: any;
  productTradingData?: any;
  productTradings?: ProductTradingsType[];
  fieldInfo?: FieldInfoType[];
  personInCharge?: {};

  employeeId?: any;
  employeeName?: any;
  departmentId?: any;
  departmentName?: any;
  groupId?: any;
  groupName?: any;
};

export type GetCustomers = {
  totalRecords?: any;
  customers?: CustomersType[];
  fieldInfo?: FieldInfoType[];
};
