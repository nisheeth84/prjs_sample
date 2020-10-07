/**
 * Define employee
 */
export interface EmployeeState {
  // list of employees
  employees: Array<Employee>;
  // department
  department: Departments;
  // list of field info personals
  fieldInfoPersonals: Array<FieldInfoPersonal>;
  // request status
  status: string;
  // employee selected
  selectedEmployeeIds: Array<number>;
  // total records
  totalRecords: number;
  // title display
  titleDisplay: string;
}

/**
 * Define employee item
 */
export interface Employee {
  employeeId: number;// data mathing with response
  photoFilePath: string;// data mathing with response
  employeeSurname: string;// data mathing with response
  employeeName: string;// data mathing with response
  employeeSurnameKana: string;// data mathing with response
  employeeNameKana: string;// data mathing with response
  email: string;// data mathing with response
  userId: string;// data mathing with response
  employeeStatus: number;// data mathing with response
  employeeData: string;// data mathing with response
  cellphoneNumber: string;// data mathing with response
  telephoneNumber: string;// data mathing with response
  languageId: number;// data mathing with response
  updatedDate: string;// data mathing with response
  employeeDepartments: Array<EmployeeDepartements>;// data mathing with response
}

/**
 * Define employee department
 */
export interface EmployeeDepartements {
  departmentId: number;// data mathing with response
  departmentName: string;// data mathing with response
  positionId: number;// data mathing with response
  positionName: string;// data mathing with response
  employeeId: number;// data mathing with response
  employeeFullName: string;// data mathing with response
}

/**
 * Define department
 */
export interface Departments {
  departmentId: number;// data mathing with response
  departmentName: string;// data mathing with response
  managerId: number;// data mathing with response
  managerName: string;// data mathing with response
}

/**
 * Define field item
 */
export interface FieldItem {
  itemId: number;// data mathing with response
  itemLabel: string;// data mathing with response
  itemOrder: number;// data mathing with response
  isDefault: boolean;// data mathing with response
}

/**
 * Define fieldinfo personal
 */
export interface FieldInfoPersonal {
  fieldId: number;// data mathing with response
  fieldName: string;// data mathing with response
  fieldLabel: string;// data mathing with response
  fieldItems: Array<FieldItem>;// data mathing with response
  isDefault: boolean;// data mathing with response
}
/**
 * Define employee item personal
 */
export interface EmployeeItem {
  title: string;// data prop
  type: string;// data prop
}
/**
 * Define employee item prop
 */
export interface EmployeeItemProps {
  employeeId: number;// data prop
  employeeName:string;// data prop
  avatarUrl: any;// data prop
  dataDisplay: any;// data prop
}

/**
 * Define employee list prop
 */
export interface RelationEmployeeProps {
  fieldInfo?: any; //employee relation data
  extensionData?:any // extension relation data
  belong?:number;
}

/**
 * Define payload
 */
export interface RelationEmployeeResponse {
  status: number,//status response
  data: EmployeeState//data response
}
