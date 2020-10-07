export interface Employee {
  [x: string]: any;
  employeeId: number;
  employeeIcon: any;
  photoFilePath: string;
  employeeSurname: string;
  employeeName: string;
  employeeSurnameKana: string;
  employeeNameKana: string;
  email: string;
  userId: string;
  employeeStatus: number;
  employeeData: string;
  cellphoneNumber: string;
  telephoneNumber: string;
  languageId: number;
  updatedDate: string;
  employeeDepartments: Array<EmployeeDepartements>;
}

export interface EmployeeDepartements {
  departmentId: number;
  departmentName: string;
  departmentOrder: number;
  positionId: number;
  positionName: string;
  positionOrder: number;
  employeeId: number;
  employeeFullName: string;
}

export interface Departments {
  departmentId: number;
  departmentName: string;
  managerId: number;
  managerName: string;
  managerSurname: string;
}

export interface FieldItem {
  itemId: number;
  itemLabel: string;
  itemOrder: number;
  isDefault: boolean;
}

export interface FieldInfoPersonal {
  fieldId: number;
  fieldName: string;
  fieldLabel: string;
  fieldItems: Array<FieldItem>;
  isDefault: boolean;
}
