/**
 * Define structure business card item
 */
export interface BusinessCard {
  businessCardId: number,// data mapping with response
  customerName: string,// data mapping with response
  alternativeCustomerName: string,// data mapping with response
  firstName: string,// data mapping with response
  lastName: string,// data mapping with response
  firstNameKana: string,// data mapping with response
  lastNameKana: string,// data mapping with response
  position: string,// data mapping with response
  departmentName: string,// data mapping with response
  zipCode: string,// data mapping with response
  building: string,// data mapping with response
  address: string,// data mapping with response
  emailAddress: string,// data mapping with response
  phoneNumber: number,// data mapping with response
  mobileNumber: number,// data mapping with response
  lastContactDate: string,// data mapping with response
  isWorking: number,// data mapping with response
  memo: string,// data mapping with response
  businessCardImagePath: string,// data mapping with response
  businessCardImageName: string,// data mapping with response
  saveMode:number// data mapping with response
}
/**
 * Define structure business card state
 */
export interface BusinessCardState {
  businessCards: Array<BusinessCard>;// data mapping with response
  data: any;// data mapping with response
  dataBusinessCardList: any;// data mapping with response
  tab: boolean;// data mapping with response
}

/**
 * Define props business card
 */
export interface RelationBusinessCardProps {
  //business card data
  fieldInfo?: any;
  belong?:number;
  extensionData?:any // extension relation data
}

/**
 * Define payload
 */
export interface RelationBusinessCardResponse {
  status: number,//status response
  data: BusinessCardState//data response
}
