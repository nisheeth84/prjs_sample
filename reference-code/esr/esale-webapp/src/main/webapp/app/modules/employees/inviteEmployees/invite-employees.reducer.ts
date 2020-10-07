import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { API_CONFIG } from 'app/config/constants';
import { INITIALIZE_INVITE_MODAL, INVITE_EMPLOYEES } from 'app/modules/employees/constants';
export const ACTION_TYPES = {
  INIT_INITIALIZE_INVITE_MODAL: 'inviteEmployees/INIT_INITIALIZE_INVITE_MODAL',
  INVITE_EMPLOYEES: 'inviteEmployees/INVITE_EMPLOYEES',
  INVITE_EMPLOYEES_RESET: 'inviteEmployees/RESET'
};

export enum InviteEmployeesAction {
  None,
  Init,
  InviteEmployeesSuccess,
  InviteEmployeesFailure
}

const initialState = {
  action: InviteEmployeesAction.None,
  errorMessage: [],
  errorItem: [],
  errorParams: [],
  rowIds: [],
  isSuccess: false,
  departments: [
    {
      departmentId: null,
      departmentName: null
    }
  ],
  subscriptions: [
    {
      subscriptionId: null,
      subscriptionName: null,
      remainLicenses: null
    }
  ],
  packages: [
    {
      packageId: null,
      packageName: null,
      remainPackages: null
    }
  ],
  inviteEmployee: {
    employeeSurname: null,
    employeeName: null,
    email: null,
    departmentIds: [],
    subscriptionIds: [],
    optionIds: [],
    isLogin: false,
    isAdmin: false
  },
  sendedMailResults: [
    {
      memberName: null,
      emailAddress: null,
      isSentEmailError: null
    }
  ],
  departmentsNotExist: []
};

// API base URL
const employeesApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

export const getInitializeInviteModal = () => ({
  type: ACTION_TYPES.INIT_INITIALIZE_INVITE_MODAL,
  payload: axios.post(
    `${API_CONTEXT_PATH}/${API_CONFIG.EMPLOYEE_SERVICE_PATH}/get-initialize-invite-modal`,
    null,
    {
      headers: { ['Content-Type']: 'application/json' }
    }
  )
});

export const inviteEmployees = inviteEmployee => ({
  type: ACTION_TYPES.INVITE_EMPLOYEES,
  payload: axios.post(
    `${employeesApiUrl}/invite-employees`,
    { inviteEmployeesIn: inviteEmployee },
    { headers: { ['Content-Type']: 'application/json' } }
  )
});

const parseInitInitializeInviteModal = res => {
  const departments = (res && res.departments) || [];
  const packages = (res && res.packages) || [];
  return { departments, packages };
};

const parseInviteEmployees = res => {
  const sendedMailResults = (res && res.employees) || [];
  return { sendedMailResults };
};

const parseInviteEmployeesFail = res => {
  let errorMsg = [];
  let errorItem = [];
  let errorParams = [];
  let isError = false;
  let rowIds = [];
  let departmentsNotExist = [];
  const errorsList =
    res.response.data.parameters &&
    res.response.data.parameters.extensions &&
    res.response.data.parameters.extensions.errors;
  if (errorsList && errorsList.length > 0) {
    if (errorsList.length > 1) {
      errorsList.forEach((e, i) => {
        errorMsg.push(errorsList[i].errorCode);
        errorItem.push(errorsList[i].item);
        rowIds.push(errorsList[i].rowId);
        errorParams.push(errorsList[i].errorParams);
        departmentsNotExist.push(errorsList[i].departmentsId);
      });
    } else {
      errorMsg = Array.isArray(errorsList[0].errorCode)
        ? errorsList[0].errorCode
        : [errorsList[0].errorCode];
      errorItem = Array.isArray(errorsList[0].item) ? errorsList[0].item : [errorsList[0].item];
      errorParams = Array.isArray(errorsList[0].errorParams)
        ? errorsList[0].errorParams
        : [errorsList[0].errorParams];
      if (errorsList[0].rowIds === undefined) {
        rowIds = Array.isArray(errorsList[0].rowId) ? errorsList[0].rowId : [errorsList[0].rowId];
      } else {
        rowIds = Array.isArray(errorsList[0].rowIds)
          ? errorsList[0].rowIds
          : [errorsList[0].rowIds];
      }
      departmentsNotExist = Array.isArray(errorsList[0].departmentsId)
        ? errorsList[0].departmentsId
        : [errorsList[0].departmentsId];
    }
  }
  isError = true;
  return { isError, errorMsg, errorItem, errorParams, rowIds, departmentsNotExist };
};

export type InviteEmployeesState = Readonly<typeof initialState>;

export default (state: InviteEmployeesState = initialState, action): InviteEmployeesState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.INIT_INITIALIZE_INVITE_MODAL):
    case REQUEST(ACTION_TYPES.INVITE_EMPLOYEES):
      return {
        ...state
      };
    case FAILURE(ACTION_TYPES.INIT_INITIALIZE_INVITE_MODAL):
      return {
        ...state,
        errorMessage: action.payload.message,
        isSuccess: false
      };

    case FAILURE(ACTION_TYPES.INVITE_EMPLOYEES): {
      const res = parseInviteEmployeesFail(action.payload);
      return {
        ...state,
        errorMessage: res.errorMsg,
        errorItem: res.errorItem,
        errorParams: res.errorParams,
        rowIds: res.rowIds,
        isSuccess: false,
        departmentsNotExist: res.departmentsNotExist
      };
    }

    case SUCCESS(ACTION_TYPES.INIT_INITIALIZE_INVITE_MODAL): {
      const res = parseInitInitializeInviteModal(action.payload.data);
      return {
        ...state,
        departments: res.departments,
        packages: res.packages
      };
    }
    case SUCCESS(ACTION_TYPES.INVITE_EMPLOYEES): {
      const res = parseInviteEmployees(action.payload.data);
      return {
        ...state,
        sendedMailResults: res.sendedMailResults,
        isSuccess: true
      };
    }
    case ACTION_TYPES.INVITE_EMPLOYEES_RESET:
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
};

export const handleGetInitializeInviteModal = () => async (dispatch, getState) => {
  await dispatch(getInitializeInviteModal());
};

export const handleInviteEmployees = params => async (dispatch, getState) => {
  const employees = [];
  if (!params || params.length <= 0) {
    await dispatch(inviteEmployees(employees));
  } else {
    for (let i = 0; i < params.length; i++) {
      employees.push({
        employeeSurname: params[i].employeeSurname,
        employeeName: params[i].employeeName,
        email: params[i].email,
        departmentIds: params[i].departmentIds,
        packageIds: params[i].subscriptionIds,
        isAdmin: params[i].isAdmin,
        isAccessContractSite: params[i].isLogin
      });
    }
    await dispatch(inviteEmployees(employees));
  }
};

export const reset = () => ({
  type: ACTION_TYPES.INVITE_EMPLOYEES_RESET
});
