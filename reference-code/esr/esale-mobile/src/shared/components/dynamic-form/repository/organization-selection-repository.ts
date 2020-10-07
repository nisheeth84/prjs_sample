import { apiClient } from '../../../../config/clients/api-client';
import { getSelectedOrganizationInfoUrl } from '../../../../config/constants/api';

export interface OrganizationSelectionPayLoad {
  departmentId: any;
  groupId: any;
  employeeId: any;

}
/**
 * Define function call API get data 
 */
export const getSelectedOrganizationInfo = async (
  payload: OrganizationSelectionPayLoad
): Promise<OrganizationSelectionResponse> => {
  try {
    const response = await apiClient.post(
      getSelectedOrganizationInfoUrl,
      {
        departmentId: payload.departmentId,
        groupId: payload.groupId,
        employeeId: payload.employeeId
      },
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

/**
* Define structure values of data api
*/
export interface OrganizationSelectionResponse {
  data: any;
  status: number;// status of response
}