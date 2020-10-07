/**
 * Define data structure for API getBusinessCards
 **/

type FieldInfoType = {
  fieldId?: any;
  fieldName?: any;
};
type BusinessCardsReceivesType = {
  employeeId?: any;
  employeeName?: any;
  receiveDate?: any;
  lastContactDateReceiver?: any;
};
type BusinessCardsType = {
  businessCardId?: any;
  customerId?: any;
  customerName?: any;
  alternativeCustomerName?: any;
  firstName?: any;
  lastName?: any;
  firstNameKana?: any;
  lastNameKana?: any;
  position?: any;
  departmentName?: any;
  zipCode?: any;
  prefecture?: any;
  addressUnderPrefecture?: any;
  building?: any;
  emailAddress?: any;
  phoneNumber?: any;
  mobileNumber?: any;
  lastContactDate?: any;
  isWorking?: any;
  memo?: any;
  businessCardImagePath?: any;
  businessCardImageName?: any;
  businessCardsReceives?: BusinessCardsReceivesType[];
  totalRecords?: any;
  initializeInfo?: {};
  fieldInfo?: FieldInfoType[];
};
export type GetBusinessCards = {
  businessCards?: BusinessCardsType[];
};
