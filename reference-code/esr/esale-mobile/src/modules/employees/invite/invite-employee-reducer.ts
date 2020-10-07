import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { inviteEmployeeConst } from "./invite-employee-constants";
/**
 * Define interface Packages
 */
export interface Packages {
  packageId: number;
  packageName: string;
  remainPackages: number;
}
/**
 * Define interface Department
 */
export interface Department {
  departmentId: number;
  departmentName: string;
}

/**
 * Define interface Employee
 */
export interface Employee {
  surname: string;
  name: string;
  emailAddress: string;
  departments: Array<number>;
  isAccessContractSite: boolean;
  isAdmin: boolean;
  package: Array<number>;
  updateTime?: string;
}
/**
 * Difine interface InviteEmployeeState
 */
export interface InviteEmployeeState {
  employees: Employee[];
  status: string;
  selectDepartment: Department[];
  package: Packages[];
  erroRessponse: Errors[];
}

/**
 * Defome interface GetSelectDatainitializeInvite
 */
export interface GetSelectDatainitializeInvitePayload {
  data: Array<any>;
  type: string
}


/**
 * Deffine interface Errors
 */
export interface Errors {
  errorCode: string;
  item: string;
  errorParam: [];
  rowId: number;
  departmentsId?: number[];
}
/**
 * Define interface AddErrorRessponsePayload
 */
export interface AddErrorRessponsePayload {
  data: Errors[];
}

/**
 * Define interface InviteEmployeeReducers
 */
export interface InviteEmployeeReducers
  extends SliceCaseReducers<InviteEmployeeState> { }

const inviteEmployeeSlice = createSlice<
  InviteEmployeeState,
  InviteEmployeeReducers
>({
  name: 'employee',
  initialState: {
    employees: [
      {
        surname: '',
        name: '',
        emailAddress: '',
        departments: [],
        isAccessContractSite: false,
        isAdmin: false,
        package: [],
      },
    ],
    status: 'pending',
    selectDepartment: [],
    package: [],
    erroRessponse: [],
  },
  reducers: {
    // Set packages from resstponse initializeInviteModal to store
    setSelectDatainitializeInvite(state, { payload }: PayloadAction<GetSelectDatainitializeInvitePayload>) {
      if (payload.type === inviteEmployeeConst.department) {
        state.selectDepartment = payload.data;
      } else if (payload.type === inviteEmployeeConst.package) {
        state.package = payload.data;
      }
    },

    // Set array ressponse to store
    setErrorRessponse(state, { payload }: PayloadAction<AddErrorRessponsePayload>) {
      state.erroRessponse = payload.data;
    },
  },
});

export const inviteEmployeeActions = inviteEmployeeSlice.actions;
export default inviteEmployeeSlice.reducer;
