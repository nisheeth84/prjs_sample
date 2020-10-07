/**
 * Define milestone suggest view
 */
export interface IEmployeeSuggestionsProps {
  invisibleLabel?: boolean, // hiden label
  typeSearch: number, // type search (SINGLE or MULTI)
  groupSearch?: number, // group search status search key( NONE,DEPARTMENT, EMPLOYEE, GROUP)
  fieldLabel: string, // label of field
  fieldInfo?: any,
  fields?:any;
  isError?: boolean,// set background error
  suggestionsChoice?: {
    departments: {
      departmentId: number,
      participantType: number
    }[],
    employees: {
      employeeId: number,
      participantType: number
    }[],
    groups: {
      groupId: number,
      participantType: number
    }[],
  },
  updateStateElement: (searchValue: any) => void; // callback when change status control
  exportError?: (err: any) => void;
}

/**
 * Define milestone suggest view
 */
export interface IResultSearchProps {
  typeSearch: number, // type search (SINGLE or MULTI)
  isRelation?: boolean,
  searchConditions: any[],
  updateStateElement: (searchValue: any) => void; // callback when change status control
  closeModal: () => void;
  exportError: (err: any) => void;
}

/**
 * Define values of milestone
 */
export interface Departments {
  departmentId: number,// data mapping response
  departmentName: string,// data mapping response
  parentDepartment: {
    departmentId: number,// data mapping response
    departmentName: string,// data mapping response
  },
  employeesDepartments: {
    employeeId: number,// data mapping response
    photoFileName: string,// data mapping response
    photoFilePath: string,// data mapping response
    employeeSurname: string,// data mapping response
    employeeName: string,// data mapping response
    employeeSurnameKana: string,// data mapping response
    employeeNameKana: string,// data mapping response
  }[],
  idHistoryChoice?: number
}

/**
 * Define values of employees
 */
export interface Employees {
  employeeId: number,// data mapping response
  employeeIcon: {
    fileName: string,// data mapping response
    filePath: string,// data mapping response
    fileUrl: string,// data mapping response
  },
  employeeSurname: string,// data mapping response
  employeeName: string,// data mapping response
  employeeSurnameKana: string,// data mapping response
  employeeNameKana: string,// data mapping response
  employeeDepartments: {
    departmentId: number,// data mapping response
    departmentName: string,// data mapping response
    positionId: string,// data mapping response
    positionName: string,// data mapping response
  }[],
  employeeData?:any,
  isBusy: boolean,
  idHistoryChoice?: number
}

/**
 * Define values of employees
 */
export interface Groups {
  groupId: number,// data mapping response
  groupName: string,// data mapping response
  employeesGroups: {
    employeeName: string,// data mapping response
    employeeId: number,// data mapping response
    employeeSurname: string// data mapping response
  }[],
  idHistoryChoice?: number
}

/**
 * Define error
 */
export interface Errors {
  errorCode: string;
  item: string;
  rowId: number;
  errorParam: [];
}
/**
 * Define values of employees
 */
export interface EmployeeSuggest {
  departments: Array<Departments>,// data mapping response
  employees: Array<Employees>,// data mapping response
  groups: Array<Groups>,// data mapping response
}

/**
 * Define values of employees
 */
export interface EmployeeDTO {
  itemId: number,// data mapping response
  groupSearch: number,// data mapping response
  itemName: string,// data mapping response
  departmentName?: string,// data mapping response
  groupName?: string,// data mapping response
  positionName: string,// data mapping response
  itemImage: string,// data mapping response
  participantType?: number,// data choice authorization
  isBusy?: boolean,// data mapping response
  listEmployeeName?: string,// data mapping response
  indexChoice: string// data mapping response
  employee: any,
  idHistoryChoice?: number;
  employeeData?:any,
}

/**
 * Define structure values of data api
 */
export interface EmployeeSuggestionResponse {
  data: EmployeeSuggest;// list data form response
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
export interface EmployeeSuggestionsChoiceResponse {
  data: {
    suggestionChoiceId: number[],
    parameters: {
      extensions: {
        errors: Errors[];
      }
    }
  };// data form response
  status: number;// status off response
}

/**
 * Define values of IOrganizationInfo
 */
export interface IOrganizationInfo {
  employee: any[],
  departments: {
    departmentId: number,// data mapping response
    departmentName: string,// data mapping response
    parentDepartment: {
      departmentId: number,// data mapping response
      departmentName: string// data mapping response
    },
    empoyeeIds: number[]// data mapping response
  }[],
  groupId: {
    groupId: number,// data mapping response
    groupName: string,// data mapping response
    empoyeeIds: number[]// data mapping response
  }[],
  employees: any[],
  parameters: {
    extensions: {
      errors: Errors[];
    }
  }

}

/**
 * Define structure values of data api
 */
export interface SelectedOrganizationInfoResponse {
  data: IOrganizationInfo;// data form response
  status: number;// status off response
}