/**
 * Define product trading
 */
export interface Products {
  productTradingId: number;// data mapping with reponse
  customerId: number;// data mapping with reponse
  productTradingProgressId: number;// data mapping with reponse
  progressName: string;// data mapping with reponse
  progressOrder: number;// data mapping with reponse
  isAvailable: boolean;// data mapping with reponse
  productId: number;// data mapping with reponse
  productName: string;// data mapping with reponse
  quantity: number;// data mapping with reponse
  price: number;// data mapping with reponse
  amount: number;// data mapping with reponse
  customerName: string;// data mapping with reponse
  employeeId: number;// data mapping with reponse
  employeeName: string;// data mapping with reponse
  endPlanDate: string;// data mapping with reponse
  orderPlanDate: string;// data mapping with reponse
  memo: string;// data mapping with reponse
  updateDate: string;// data mapping with reponse
  productTradingData: Array<ProductTrading>;// data mapping with reponse
  check?: boolean;// data mapping with reponse
  estimatedCompletionDate?: string;// data mapping with reponse
  numeric1?: string;// data mapping with reponse
  checkbox1?: number;// data mapping with reponse
}

/**
 * Define product trading
 */
export interface ProductTrading {
  fieldType: number;
  key: string;
  value: string;
}

/**
 * Define prop of product trading
 */
export interface RelationProductTradingProps {
  //product trading relation data
  fieldInfo?: any;
}

/**
 * Define payload
 */
export interface RelationProductTradingsResponse {
  status: number,//status response
  data: Products[]//data response
}
