
/**
 * define value of API
 */
export interface EmployeeState {
  // list of employees
  employees: Array<Employee>;
  // department
  department: Department;
  // request status
  status: string;
  // total records
  totalRecords: number;
}

/**
 * value of Employee
 */
export interface Employee {
  employeeId: number;
  employeeDepartments: Array<EmployeeDepartments>;
  employeeGroups?: Array<EmployeeGroups>;
  employeeSurname?: string;
  employeeName?: string;
  employeeSurnameKana?: string;
  employeeNameKana?: string;
  email?: string;
  telephoneNumber?: string;
  cellphoneNumber?: string;
  employeeSubordinates?: Array<EmployeeSubordinates>;
  userId?: string;
  language?: string;
  timezone?: string;
  employeeStatus?: number;
  employeeData?: [];
  employeeIcon: EmployeeIcon;
  isBusy: boolean;
}

/**
 * Value of icon
 */
export interface EmployeeIcon {
  fileName: string,
  filePath: string,
  fileUrl: string,
  status: string
}

/**
 * Value of EmployeeDepartments
 */
export interface EmployeeDepartments {
  departmentId: number;
  departmentName: string;
  positionId?: number;
  positionName: string;
  employeeId: number;
  employeeSurName: string;
  employeeName: string;
  employeeFullName: string;
  pathTreeName: string;
}

/**
 * Value of Groups
 */
export interface EmployeeGroups {
  groupId: number;
  groupName: string;
}

/**
 * Value of EmployeeSubordinates
 */
export interface EmployeeSubordinates {
  employeeId: number;
  employeeFullName: string;
  employeeSurname: string;
  employeeName: string;
  employeeSurnameKana?: string;
  employeeNameKana?: string;
}

/**
 * Value of EmployeeData
 */
export interface EmployeeData {
  fieldType: number;
  key: string;
  value: string;

}

/**
 * Value Of department
 */
export interface Department {
  departmentId: number;
  departmentName: string;
  managerId: number;
  managerName: string;

}
export interface EmployeeIcon {
  filePath: string;
  fileName: string;
}
