import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { InviteEmployeeState } from "./invite-employee-reducer";

/**
 * Define function listDepartmentSelector, get selectDepartment from store
 */
export const listDepartmentSelector = createSelector(
  (state: RootState) => state.inviteEmployee,
  (employee: InviteEmployeeState) => employee.selectDepartment
);
/**
 * Define function listPackageSelector, get package from store
 */
export const listPackageSelector = createSelector(
  (state: RootState) => state.inviteEmployee,
  (employee: InviteEmployeeState) => employee.package
);
/**
 * Define function listRessponseErrorSelecttor, get erroRessponse from store
 */
export const listRessponseErrorSelecttor = createSelector(
  (state: RootState) => state.inviteEmployee,
  (employee: InviteEmployeeState) => employee.erroRessponse
);
