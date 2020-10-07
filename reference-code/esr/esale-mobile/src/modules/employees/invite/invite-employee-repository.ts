import { apiClient } from "../../../config/clients/api-client";
import { Member, Errors } from "./invite-employee-interfaces";
import {SERVICE_INITIALIZE_INVITE_MODAL, SERVICE_INVITE_EMPLOYEE} from "./invite-employee-constants"

/**
 * Define interface InviteEmployeePayload
 */
export interface InviteEmployeePayload { }
/**
 * Define Member get data from ressponse when click button Send success
 */
export interface InviteEmployeeResponse {
  employees: Array<Member>,
  parameters: {
    extensions: {
      errors: Errors[];
    }
  }
}
/**
 * Define function InviteEmployees
 */
export interface InviteEmployees {
  data: InviteEmployeeResponse;
  status: number;
}

/**
 * Define interface Department
 */
export interface Department {
  departmentId: number;
  departmentName: string;
}
/**
 * Define interface Packages
 */
export interface Package {
  packageId: number;
  packageName: string;
  remainPackages: number;
}
/**
 * Define function InitializeInviteModalResponse
 */
export interface InitializeInviteModalResponse {
  departments: Array<Department>;
  packages: Package[];
}
/**
 * Define interface InviteModal
 */
export interface InviteModal {
  data: InitializeInviteModalResponse;
  status: number;
}

/**
 * Define interface InitializeInviteModalPayload
 */
export interface InitializeInviteModalPayload { }

/**
 * Define interface use Api inviteEmployees
 * @param payload 
 * @param config 
 */
export const inviteEmployee = async (
  payload: InviteEmployeePayload
): Promise<InviteEmployees> => {
  try {
    const response = await apiClient.post(SERVICE_INVITE_EMPLOYEE,
     {
      inviteEmployeesIn: payload
     });
    return response;
  } catch (error) {
    return error.response;
  }
};
/**
 * Define interface use Api initializeInviteModal
 * @param payload 
 * @param config 
 */
export const initializeInviteModal = async (
  payload: InitializeInviteModalPayload
): Promise<InviteModal> => {
  try {
    const response = await apiClient.post(SERVICE_INITIALIZE_INVITE_MODAL, payload);
    return response;
  } catch (error) {
    return error.response;
  }
};
