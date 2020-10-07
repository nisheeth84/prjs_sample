import axios from 'axios';
import { Storage } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { setLocale } from 'app/shared/reducers/locale';
import {
  API_PUBLIC_CONTEXT_PATH,
  AUTH_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  USER_FORMAT_DATE_KEY,
  USER_TIMEZONE_KEY,
  USER_ICON_PATH,
  CHECK_RESPONSE_FROM_SAML,
  SIGNOUT_SAML_URL,
  API_CONFIG
} from 'app/config/constants';
import { CONFIG } from 'app/modules/account/constants';

export const ACTION_TYPES = {
  LOGIN: 'authentication/LOGIN',
  GET_SESSION: 'authentication/GET_SESSION',
  LOGOUT: 'authentication/LOGOUT',
  CLEAR_AUTH: 'authentication/CLEAR_AUTH',
  ERROR_MESSAGE: 'authentication/ERROR_MESSAGE',
  ONLINE: 'authentication/ONLINE',
  RESET_ONLINE: 'authentication/RESET_ONLINE',
  RESET: 'authentication/RESET',
  GET_EMPLOYEE_CHATPLUS: 'authentication/GET_EMPLOYEE_CHATPLUS'
};

export enum ActionSession {
  None,
  Request,
  Done
}

/**
 * initial state
 */
const initialState = {
  isLoading: false,
  isAuthenticated: false,
  isLoginSuccess: false,
  isLoginError: false, // Errors returned from server side
  account: {} as any,
  signInUrl: null as string,
  errorMessage: null as string, // Errors returned from server side
  redirectMessage: null as string,
  isSessionHasBeenFetched: false,
  idToken: null as string,
  isLogoutSuccess: false,
  isPasswordExpired: false,
  sessionEnum: ActionSession.None,
  online: -1,
  newPasswordRequired: false,
  isAccept: null as boolean,
  isAccessContract: null as boolean,
  isModifyEmployee: null as boolean,
  statusContract: null as number,
  dayRemainTrial: null as number,
  msgContract: null as string,
  siteContract: null as string,
  isEmployeeExisted: false,
  isMissingLicense: false,
  checkLicenses: null,
  infoEmpChatplus: null,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Reducer
const convertMessage = errorList => {
  return errorList && errorList.length > 0 ? errorList[0].errorCode : null;
};

export default (state: AuthenticationState = initialState, action): AuthenticationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.LOGIN):
    case REQUEST(ACTION_TYPES.LOGOUT):
    case REQUEST(ACTION_TYPES.ONLINE):
    case REQUEST(ACTION_TYPES.GET_EMPLOYEE_CHATPLUS):
      return {
        ...state,
        isLoading: true
      };
    case REQUEST(ACTION_TYPES.GET_SESSION):
      return {
        ...state,
        isLoading: true,
        sessionEnum: ActionSession.Request
      };
    case FAILURE(ACTION_TYPES.LOGIN):
      return {
        ...initialState,
        errorMessage: convertMessage(action.payload.response.data.parameters.extensions.errors),
        isLoginError: true
      };
    case FAILURE(ACTION_TYPES.LOGOUT):
    case FAILURE(ACTION_TYPES.ONLINE):
      return {
        ...initialState,
        errorMessage: action.payload,
        isLogoutSuccess: true
      };
    case FAILURE(ACTION_TYPES.GET_SESSION):
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        isSessionHasBeenFetched: true,
        errorMessage: action.payload,
        sessionEnum: ActionSession.Done
      };
    case FAILURE(ACTION_TYPES.GET_EMPLOYEE_CHATPLUS):
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.LOGIN):
      return {
        ...state,
        isLoading: false,
        isLoginError: false,
        isPasswordExpired: action.payload.data.remainingDays <= 0,
        isLoginSuccess: true,
        newPasswordRequired: action.payload.data.newPasswordRequired
      };
    case SUCCESS(ACTION_TYPES.LOGOUT):
      return {
        ...initialState,
        isLogoutSuccess: true,
        isAuthenticated: false
      };
    case SUCCESS(ACTION_TYPES.GET_SESSION): {
      const { data } = action.payload;
      if (action.payload && data && data.signOutUrl) {
        Storage.session.set(SIGNOUT_SAML_URL, data.signOutUrl);
      }
      const isAuthenticated = action.payload && data && data.authenticated;
      return {
        ...state,
        isAuthenticated,
        isLoading: false,
        isSessionHasBeenFetched: true,
        sessionEnum: ActionSession.Done,
        account: isAuthenticated ? data.authenticated : { authorities: [] },
        signInUrl: data.signInUrl,
        isAccept: data.isAccept,
        isAccessContract: data.authenticated ? data.authenticated.isAccessContract : false,
        isModifyEmployee: data.authenticated ? data.authenticated.isModifyEmployee : false,
        siteContract: data.siteContract,
        isEmployeeExisted: data.authenticated ? data.authenticated.isEmployeeExisted : false,
        statusContract: data.statusContract,
        dayRemainTrial: data.dayRemainTrial,
        isMissingLicense: data.isMissingLicense
      };
    }
    case SUCCESS(ACTION_TYPES.ONLINE): {
      const online = action.payload && action.payload.data;
      return {
        ...state,
        online
      };
    }
    case ACTION_TYPES.ERROR_MESSAGE:
      return {
        ...initialState,
        redirectMessage: action.message
      };
    case ACTION_TYPES.CLEAR_AUTH:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false
      };
    case ACTION_TYPES.RESET_ONLINE:
      return {
        ...state,
        online: -1
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        isLoginSuccess: false,
        isLoginError: false,
        errorMessage: null,
        redirectMessage: null,
        isLogoutSuccess: false,
        isPasswordExpired: false,
        newPasswordRequired: false,
        statusContract: null,
        dayRemainTrial: null,
        msgContract: null
      };
    case SUCCESS(ACTION_TYPES.GET_EMPLOYEE_CHATPLUS):
      return {
        ...state,
        infoEmpChatplus: action.payload.data,
        isLoading: false
      };
    default:
      return {
        ...state,
        isAuthenticated: !!(
          Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY)
        )
      };
  }
};

// API base URL
const apiUrl = API_PUBLIC_CONTEXT_PATH + '/' + CONFIG.LOGIN_PATH;
const apiUrlEmp = API_PUBLIC_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH

export const displayAuthError = message => ({ type: ACTION_TYPES.ERROR_MESSAGE, message });

export const getSession = (site?) => async (dispatch, getState) => {
  const param = site ? '?site=' + site : '';
  const result = await dispatch({
    type: ACTION_TYPES.GET_SESSION,
    payload: axios.get(apiUrl + '/auth/verify' + param, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });

  if (
    result.action.payload &&
    result.action.payload.data &&
    result.action.payload.data.authenticated
  ) {
    const accountInfo = result.action.payload.data.authenticated;
    Storage.session.set(USER_FORMAT_DATE_KEY, accountInfo.formatDate);
    Storage.session.set(USER_TIMEZONE_KEY, accountInfo.timezoneName);
    Storage.session.set(USER_ICON_PATH, accountInfo.iconPath);
    Storage.session.set('locale', accountInfo.languageCode);
    await dispatch(setLocale(accountInfo.languageCode));
  }

  if (getState().isAuthenticated) {
    const { account } = getState().authentication;
    if (account) {
      if (account.languageCode) {
        const langCode = Storage.session.get('locale', account.languageCode);
        await dispatch(setLocale(langCode));
      }
    }
  }
};

export const login = (username, password, rememberMe = false) => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.LOGIN,
    payload: axios.post(apiUrl + '/auth/login', { username, password, rememberMe })
  });
  const jwt = result.action.payload.data.idToken;
  const refreshJwt = result.action.payload.data.refreshToken;
  Storage.session.set('locale', result.action.payload.data.languageCode);
  await dispatch(setLocale(result.action.payload.data.languageCode));
  if (jwt && refreshJwt) {
    if (rememberMe) {
      Storage.local.set(AUTH_TOKEN_KEY, jwt);
      Storage.local.set(AUTH_REFRESH_TOKEN_KEY, refreshJwt);
      Storage.session.remove(AUTH_TOKEN_KEY);
      Storage.session.remove(AUTH_REFRESH_TOKEN_KEY);
    } else {
      Storage.session.set(AUTH_TOKEN_KEY, jwt);
      Storage.session.set(AUTH_REFRESH_TOKEN_KEY, refreshJwt);
      Storage.local.remove(AUTH_TOKEN_KEY);
      Storage.local.remove(AUTH_REFRESH_TOKEN_KEY);
    }
  }
  await dispatch(getSession());
};

export const checkOnline = employeeId => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.ONLINE,
    payload: axios.post(apiUrl + '/auth/check-online', { employeeId })
  });
  await dispatch(getSession());
};

export const logout = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.LOGOUT,
    payload: axios.post(apiUrl + '/auth/logout', {}).then(response => {
      Storage.local.remove(AUTH_TOKEN_KEY);
      Storage.local.remove(AUTH_REFRESH_TOKEN_KEY);
      Storage.session.remove(AUTH_TOKEN_KEY);
      Storage.session.remove(AUTH_REFRESH_TOKEN_KEY);
      Storage.session.remove(USER_ICON_PATH);
      if (Storage.session.get(SIGNOUT_SAML_URL)) {
        Storage.session.set(CHECK_RESPONSE_FROM_SAML, true);
      }
    })
  });

  // fetch new csrf token
  // dispatch(getSession());
};

/**
 * Use for splitting string
 * @param str
 * @param char
 */
const splitString = (str, char) => {
  let tmp = [];
  if (typeof str === 'string' && str.length > 0) {
    tmp = str.split(char);
  }
  return tmp;
};

/**
 * Get param from url
 */
export const getParam = (urlParams, paramName) => {
  let result = null;
  const search = urlParams ? urlParams : '';
  if (typeof search === 'string' && search.length > 0) {
    const arr = splitString(search, '?');
    if (arr.length > 0 && arr[1].length > 0) {
      const arrParams = splitString(arr[1], '&');
      arrParams.forEach(e => {
        const param = splitString(e, '=');
        if (param[0].toLowerCase() === paramName.toLowerCase()) {
          result = param[1];
          return;
        }
      });
    }
  }
  return result;
};

export const clearAuthentication = messageKey => (dispatch, getState) => {
  dispatch(displayAuthError(messageKey));
  dispatch({
    type: ACTION_TYPES.CLEAR_AUTH
  });
};

export const resetOnline = () => ({
  type: ACTION_TYPES.RESET_ONLINE
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});


export const getEmployeeChatPlus = employeeId => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.GET_EMPLOYEE_CHATPLUS,
    payload: axios.post(apiUrlEmp + '/get-employee-basic', employeeId,
      {
        headers: { ['Content-Type']: 'application/json' }
      })
  });
}





