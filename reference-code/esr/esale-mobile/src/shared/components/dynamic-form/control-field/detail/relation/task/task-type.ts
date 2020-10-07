  /**
   * Define values of task
   */
  export interface TaskList {
    taskId: number;// data in database mapping data form
    parentCustomerName: string; // data in database mapping
    milestone: MilestoneTask;// data in database mapping
    customer: CustomerTask;// data in database mapping
    productTradingName: string;// data in database mapping
    taskName: string;// data in database mapping
    finishDate: string;// data in database mapping
    finishType: number;// data in database mapping
    employeeName: string;// data in database mapping
    productTradings: ProductTradings// data in database mapping
    status: number// data in database mapping
  }

    /**
   * Define values of Milestone
   */
  export interface MilestoneTask {
    milestoneId: number;// data mapping with reponse
    milestoneName: string;// data mapping with reponse
  }

    
  /**
   * Define values of Customer
   */
  export interface CustomerTask{
    customerId: number;// data mapping with reponse
    customerName: string;// data mapping with reponse
    parentCustomerName: string;// data mapping with reponse
  }

  /**
   * Define values of Product
   */
  export interface ProductTradings {
    productTradingId: number,// data mapping with reponse
    productTradingName: string// data mapping with reponse
  }

  /**
   * Define prop of task
   */
  export interface RelationTaskProps {
    //task relation data
    fieldInfo?: any;
    extensionData?:any;
  }

  /**
 * Define payload
 */
export interface RelationTasksResponse {
  status: number,//status response
  data: TaskList[]//data response
}
