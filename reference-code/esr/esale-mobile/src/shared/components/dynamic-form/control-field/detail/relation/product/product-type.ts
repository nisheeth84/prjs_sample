
/**
 * Define prop of product
 */
export interface RelationProductProps {
  fieldInfo?: any; //product relation data
  extensionData?:any // extension relation data
  belong?:number;
}

/**
 * Define payload
 */
export interface RelationProductsResponse {
  status: number,//status response
  data: any//data response
}