/**
 * format data task
 */
export interface TaskItem{
  taskId: number;
  customers: [
    {
      customerName: string; 
    }
  ]
  taskName: string;
  finishDate: string;
  subtasks: Array<any>;
  parentTaskId: any;
  productTradings: productTrading[];
  milestoneId?: number;
  milestoneName?: string
  statusTaskId: number;
  employees: Employee[]
}

/**
 * format data Employee
 */
export interface Employee{
  employeeId: number;
  photoFilePath: string;
  employeeName: string;
  positionName: string;
  departmentName: string;
  employeeSurname: string;
}

/**
 * Format prop of CustomerDetailTasks
 */
export interface CustomerDetailTasksProp{
  searchConditions: {
    fieldName: string,
    fieldValue: string
  }
}

export interface productTrading{
  productTradingId: number;
  productTradingName: string
}