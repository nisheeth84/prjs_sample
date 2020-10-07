/**
 * Define values of milestone
 */
export interface Milestone {
  milestoneId:number,// data mapping response
  milestoneName:string,// data mapping response
  parentCustomerName:string,// data mapping response
  customerName:string,// data mapping response
  productName:string, // data mapping response
  finishDate:string // data mapping response

}

/**
 * Define prop of product trading
 */
export interface RelationMilestoneProps {
  //milestone relation data
  fieldInfo?: any;
  belong?:number;
  extensionData?:any // extension relation data
}


/**
 * Define payload
 */
export interface RelationMilestoneResponse {
  data: Milestone[];// list data form response
  status: number;// status off response
}