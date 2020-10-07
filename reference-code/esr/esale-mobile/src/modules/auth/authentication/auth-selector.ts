import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { AuthState } from "./auth-reducer";

export const authSelector = createSelector(
  (state: RootState) => state.authorization,
  (authorization: AuthState) => {
    if (!(authorization.token && authorization.tenant)) {
      return null;
    }
    return {
      token: authorization.token,
      tenant: authorization.tenant,
      languageCode: authorization.languageCode,
      rememberMe: authorization.rememberMe,
    };
  }
);

export const baseUrlSelector = createSelector(
  (state: RootState) => state.authorization,
  (authorization: AuthState) => authorization.baseUrl
);

export const tenantKeySelector = createSelector(
  (state: RootState) => state.authorization,
  (authorization: AuthState) => authorization.tenantKey
);

export const authNameSelector = createSelector(
  (state: RootState) => state.auth,
  (auth: AuthState) => {
    if (!(auth.token && auth.tenant)) {
      return null;
    }
    return {
      employeeName: auth.employeeName
    };
  }
);
