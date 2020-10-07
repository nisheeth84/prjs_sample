
/**
 * Define task suggest view
 */
export interface ITaskSuggestProps {
  invisibleLabel?: boolean, // hiden label
  typeSearch: number, // type search (SINGLE or MULTI)
  fieldLabel: string, // label of field
  fields?: any,//fields data 
  fieldInfo:any// fieldInfo relation
  isError?: boolean,// set background error
  isRequire?: boolean,// display require label
  initData?: TaskSuggest[],// initial data
  hiddenSelectedData?: boolean,// hidden data selected
  updateStateElement: (searchValue: any) => void; // callback when change status control
  exportError?: (err: any) => void;
}

/**
 * Define values of Milestone
 */
export interface MilestoneTaskSuggest {
  milestoneId: number;
  milestoneName: string;
}


/**
 * Define values of Customer
 */
export interface CustomerTaskSuggest {
  customerId: number;
  customerName: string;
  parentCustomerName: string;
}

/**
 * Define values of Product
 */
export interface ProductTradings {
  productTradingId: number,
  productTradingName: string
}

/**
 * Define values of TaskSuggest
 */
export interface Tasks {
  taskId: number,// data in database mapping data form
  taskName: string,// data in database mapping
  milestone: MilestoneTaskSuggest,// data in database mapping
  customer: CustomerTaskSuggest,// data in database mapping
  productTradings: ProductTradings[],// data in database mapping
  finishDate: string,// data in database mapping
  status: number// data in database mapping
  operators: {
    employeeId: number,
    employeeName: string,
    employeeSurname: string
  }[]
}

/**
 * Define values of TaskSuggest
 */
export interface TaskSuggest {
  taskId: number,// data in database mapping data form
  parentCustomerName: string, // data in database mapping
  milestoneName: string,// data in database mapping
  customerName: string,// data in database mapping
  productTradingName: string,
  taskName: string,// data in database mapping
  finishDate: string,// data in database mapping
  finishType: number,// data in database mapping
  employeeName: string,// data in database mapping
  status: number,// data in database mapping
  taskData?:any,
  data: any
}

/**
 * Define structure values of data api getTasksSuggestion
 */
export interface GetTasksSuggestionData {
  data: {
    taskSuggestions: {
      tasks: TaskSuggest[] // list data form response
    }
  }
}

/**
 * Define values of api getTasksSuggestion
 */
export interface GetTasksSuggestionResponse {
  data: {
    tasks: Tasks[],// data ressponse from database
    total: number// data ressponse from database
  }
  status: number;// status off response
}

/**
 * Define param of data api saveSuggestionsChoice
 */
export interface SuggestionChoice {
  index: string;
  idResult: number;
}

/**
 * Define structure values of data api saveSuggestionsChoice
 */
export interface SaveTasksSuggestionData {
  data: {
    saveSuggestionsChoice: {
      data: {
        suggestionChoiceId: number[];
      }
    }
  }
}

/**
 * Define values of api saveSuggestionsChoice
 */
export interface SuggestionsChoiceResponse {
  data: number[];// data ressponse from database
  status: number;// status off response
}

/**
 * Define structure values of data api
 */
export interface CustomFieldsInfoResponse {
  data: { customFieldsInfo: any[] };// list data form response
  status: number;// status off response
}

/**
 * Define structure values of data api
 */
export interface GetTasksResponse {
  data: {
    dataInfo: {
      tasks: ITask[],
      countTask: number,
      countTotalTask: number,
      taskHistories: {
        updatedDate: string,
        updatedUserId: number,
        updatedUserName: string,
        updatedUserImage: string,
        contentChange: any[]
      }
    },
    fieldInfo: {
      fieldId: number,
      fieldName: string
    }
  },
  status: number
}

export interface ITask {
  taskId: number,
  taskName: string,
  statusTaskId: number,
  finishDate: string,
  milestoneId: number,
  milestoneName: string,
  customers: {
    customerId: number,
    customerName: string,
    parentCustomerName: string
  }[],
  productTradings: {
    productTradingId: number,
    productName: string
  }[],
  employees: {
    employeeId: number,
    employeeName: string
  }[]
}