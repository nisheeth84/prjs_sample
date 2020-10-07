/**
 * Define data structure for API getTask
 **/

type listSearchConditions = {
  fieldType?: any;
  isDefault?: any;
  fieldName?: any;
  fieldValue?: any;
  searchType?: any;
  searchOption?: any;
};

type listOperators = {
  employees?: [];
  departments?: [];
  groups?: [];
};

type listTotalEmployees = {
  employeeId?: any;
  employeeName?: any;
  photoEmployeeImg?: any;
  departmentName?: any;
  positionName?: any;
};

type listCustomers = {
  customerId?: any;
  parentCustomerName?: any;
  customerName?: any;
  customerAddress?: any;
};

type listTaskData = {
  fieldType?: any;
  key?: any;
  value?: any;
};

type listProductTradings = {
  productTradingId?: any;
  productId?: any;
  productName?: any;
};

type listField = {
  fileId?: any;
  filePath?: any;
  fileName?: any;
};

type listSubTask = {
  taskId?: any;
  statusTaskId?: any;
  taskName?: any;
  startDate?: any;
  finishDate?: any;
  memo?: any;
};

export interface GetTask {
  dataInfo?: {
    task?: {
      taskId?: any;
      taskData: listTaskData[];
      taskName?: any;
      memo?: any;
      operators?: listOperators[];
      totalEmployees?: listTotalEmployees[];
      isOperator?: any;
      countEmployee?: any;
      startDate?: any;
      finishDate?: any;
      parentTaskId?: any;
      statusParentTaskId?: any;
      customers?: listCustomers[];
      productTradings?: listProductTradings[];
      milestoneId?: any;
      milestoneName?: any;
      milestoneFinishDate?: any;
      milestoneParentCustomerName?: any;
      milestoneCustomerName?: any;
      files?: listField[];
      statusTaskId?: any;
      isPublic?: any;
      subtasks?: listSubTask[];
      registDate?: any;
      refixDate?: any;
      registPersonNameName?: any;
      refixPersonNameName?: any;
    };
  };
  statusTaskIds?: any;
  searchLocal: any;
  employeeIds: any;
  groupIds: any;
  cutomerIds: any;
  startDate: any;
  finishDate: any;
  searchConditions: listSearchConditions[];
  orderBy: any;
  limit: any;
  offset: any;
  filterByUserLoginFlg: any;
}

/**
 * Get task By Id
 * @param taskId
 */

export const PARAM_GET_TASK = taskId =>
  `{
      getTask(taskId: ${taskId}) {
       dataInfo{
                task{
                    taskId
                    taskData{
                        fieldType
                        key
                        value
                    }
                    taskName
                    memo
                    operators{
                        employees{
                            employeeId
                            employeeName
                            photoEmployeeImg
                            departmentName
                        }
                        departments {
                  departmentId
                  departmentName
                  departmentParentName
                  photoDepartmentImg
                        }
                 groups {
                  groupId
                  groupName
                  photoGroupImg
                 }

               }
               totalEmployees {
                employeeId
                employeeName
                photoEmployeeImg
                departmentName
                positionName
              }
        customers {
                customerId
                parentCustomerName
                customerName
                customerAddress
              }
              milestoneId
              milestoneName
              milestoneFinishDate
              milestoneParentCustomerName
              milestoneCustomerName
              files {
                fileId
                filePath
                fileName
              }
              productTradings {
                productTradingId
                productId
                productName
              }
              subtasks {
                taskId
                statusTaskId
                taskName
                finishDate

              }

              countEmployee
              startDate
              finishDate
              parentTaskId
              statusParentTaskId
                }

            }
      }
  }`;
