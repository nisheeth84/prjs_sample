/**
 * Define interface Member from ressponse inviteEmployee
 */
export interface Member {
  memberName: string;
  emailAddress: string;
  sentEmailError: boolean;
}
/**
 * Define interface CheckBoxProps
 */
export interface CheckBoxProps {
  name: string;
  id: number;
  addListSelected: Function;
  itemChecked: boolean;
}
/**
 * Define interface Props
 */
export interface Props {
  handleCloseModal: Function;
  setObjectSelect: (object: any) => void;
  arraySelection: number[];
}

/**
 * Define interface FormInviteEmployeeProps
 */
export interface FormInviteEmployeeProps {
  position: number;
  removeForm: (index: number) => void;
}
/**
 * Deffine interface Errors
 */
export interface Errors {
  errorCode: string;
  item: string;
  errorParam: [];
  rowId: number;
}
/**
 * Define interface FormInviteEmployeeProp
 */
export interface FormInviteEmployeeProp {
  employee: Employee;
  position: number;
  updateListInvite: (position: number, employee: Employee) => void;
  deleteInvite: (position: number) => void;
  length?:number|undefined;
  onFocus?: ()=> void;
  onEndEdit?: ()=> void;
}
/**
 * Define interface Employee
 */
// export interface Employee {
//   employeeSurname: string;
//   employeeName: string;
//   email: string;
//   departmentIds: Array<number>;
//   packageIds: Array<number>;
//   isAccessContractSite: boolean;
//   isAdmin: boolean;
// }
export interface Employee {
  surname: string;
  name: string;
  emailAddress: string;
  departments: Array<number>;
  isAccessContractSite: boolean;
  isAdmin: boolean;
  package: Array<number>;
}