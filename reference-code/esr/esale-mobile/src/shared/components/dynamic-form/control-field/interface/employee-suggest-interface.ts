/**
 * Define values of employees
 */
export interface EmployeeSuggest {
  departments: any[],// data mapping response
  employees: any[],// data mapping response
  groups: any[],// data mapping response

}

/**
 * Define values of employees
 */
export interface ItemData {
  itemId: number,// data mapping response
  groupSearch: number,// data mapping response
  employeeName: string, // data mapping rresponse
  departmentName: string,
  positionName: string,// data mapping response
  groupName: string, // data mapping reponse
  itemImage: string,
}
/**
 * Define structure values of data api
 */
export interface EmployeesSuggestionData {
  data: {
    employeesSuggestion: {
      data: EmployeeSuggest // list data form response
    }
  }
}

/**
 * Define structure values of data api
 */
export interface EmployeeSuggestionResponse {
  // data: {
  //   departments : Departments[]; // list data form response
  //   employeess: Employees[],// data mapping response
  //   groups: Groups[],// data mapping response
  // };
  data: any;
  status: number;// status of response
}