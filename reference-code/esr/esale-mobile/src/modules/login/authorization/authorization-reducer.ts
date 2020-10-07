import _ from "lodash";
import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
/**
 * Define state when login
 */
export interface AuthorizationState {
  username: string;
  email: string;
  employeeName: string;
  remainingDays: number;
  employeeId: number;
  languageCode: string;
  tenantId: string;
  accessToken: string;
  idToken: string;
  refreshToken: string;
  newPasswordRequired: boolean;
  rememberMe: boolean;
  currentPassword: string;
  timezoneName: string;
  formatDate?: string;
  isAdmin: boolean;
  isAccessContract: boolean;
}

export interface AuthorizationReducers
  extends SliceCaseReducers<AuthorizationState> { }

/**
 * Value and action with state
 */
export const authorizationSlice = createSlice<
  AuthorizationState,
  AuthorizationReducers
>({
  name: "authorization",
  initialState: {
    username: "",
    email: "",
    employeeName: "",
    remainingDays: 0,
    employeeId: 0,
    languageCode: "",
    tenantId: "",
    accessToken: "",
    idToken: "",
    refreshToken: "",
    newPasswordRequired: false,
    rememberMe: false,
    currentPassword: "",
    formatDate: "",
    timezoneName: "",
    isAdmin: false,
    isAccessContract: false
  },
  reducers: {
    /**
     * Set value of state auth
     * @param state
     * @param param1
     */
    setAuthorization(state, { payload }: PayloadAction<AuthorizationState>) {
      state.username = payload.username;
      state.email = payload.email;
      state.employeeName = payload.employeeName;
      state.remainingDays = payload.remainingDays;
      state.employeeId = payload.employeeId;
      state.languageCode = payload.languageCode;
      state.tenantId = payload.tenantId;
      state.accessToken = payload.accessToken;
      state.idToken = payload.idToken;
      state.refreshToken = payload.refreshToken;
      state.newPasswordRequired = payload.newPasswordRequired;
      state.rememberMe = payload.rememberMe;
      state.currentPassword = payload.currentPassword;
      state.formatDate = payload.formatDate;
      state.timezoneName = payload.timezoneName;
      state.isAdmin = payload.isAdmin;
      state.isAccessContract = payload.isAccessContract
    },

    setEmptyUserData(state) {
      state.username = ""
      state.email = ""
      state.employeeName = ""
      state.remainingDays = 0
      state.employeeId = 0
      state.languageCode = ""
      state.tenantId = ""
      state.accessToken = ""
      state.idToken = ""
      state.refreshToken = ""
      state.newPasswordRequired = false
      state.rememberMe = false
      state.currentPassword = ""
      state.formatDate = ""
      state.timezoneName = ""
      state.isAdmin = false
      state.isAccessContract = false
    },

    /**
     * Set tenant select
     */
    setTenant(state, { payload }: PayloadAction<string>) {
      state.tenantId = payload;
    },
    /**
     * delete tenant select
     */
    deleteTenantSelect(state) {
      state.tenantId = "";
    },
  },
});

export const authorizationActions = authorizationSlice.actions;
export default authorizationSlice.reducer;
