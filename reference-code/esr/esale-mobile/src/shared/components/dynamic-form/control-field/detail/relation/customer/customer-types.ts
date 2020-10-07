/**
 * Define list customer view
 */
export interface ListCustomers {
  totalRecords: number;// data mathing with response
  lastUpdatedDate: string// data mathing with response
  customers: Array<ItemListCustomer>;// data mathing with response
}

/**
 * Define item list customer
 */
export interface ItemListCustomer {
  customerId: number;// data mathing with response
  customerName: string;// data mathing with response
  customerParent: {
    pathTreeId: number,// data mathing with response
    pathTreeName: string// data mathing with response
  };
  customerAddress: {
    zipCode: string,// data mathing with response
    addressName: string,// data mathing with response
    buildingName: string,// data mathing with response
    address: string,// data mathing with response
  },
  extend: boolean;// data mathing with response
  select: boolean;// data mathing with response
}

/**
 * Define customer props
 */
export interface CustomerProps {
  // data item customer
  data: ItemListCustomer;
}

/**
 * Define payload
 */
export interface RelationCustomersResponse {
  status: number,//status response
  data: ListCustomers//data response
}

/**
 * Define relation customer props
 */
export interface RelationCustomerProps {
  //employee relation data
  fieldInfo?: any;
  extensionData?:any;
  belong?:number;
}