import { API_CONFIG, API_CONTEXT_PATH } from 'app/config/constants';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import axios from 'axios';
import { onRefreshToken } from '../../../reducers/administration.reducer';
import { AUTH_TOKEN_KEY, AUTH_REFRESH_TOKEN_KEY } from 'app/config/constants';
import { Storage } from 'react-jhipster';
import jwtDecode from 'jwt-decode';

export const ACTION_TYPES = {
  CHANGE_NOMAL_PASSWORD: 'employeeDetail/CHANGE_NOMAL_PASSWORD',
  GET_LANGUAGES: 'employeeDetail/GET_LANGUAGES',
  GET_TIMEZONES: 'employeeDetail/GET_TIMEZONES',
  GET_NOTIFICATION_SETTING: 'employeeDetail/GET_NOTIFICATION_SETTING',
  UPDATE_NOTIFICATION_DETAIL_SETTING: 'employeeDetail/UPDATE_NOTIFICATION_DETAIL_SETTING',
  UPDATE_SETTING_EMPLOYEE: 'employeeDetail/UPDATE_SETTING_EMPLOYEE',
  EMPLOYEE_DETAIL_RESET: 'employeeDetail/EMPLOYEE_DETAIL_RETSET',
  EMPLOYEE_FORM_DATA_CHANGED: 'employeeDetail/EMPLOYEE_FORM_DATA_CHANGED'
};

export enum employeeDetailAction {
  None,
  RequestModal,
  ErrorModal,
  DoneModal
}

const initialState = {
  action: employeeDetailAction.None,
  errorMessage: null,
  dataInfo: null,
  successMessage: null,
  idUpdate: null,
  dataGetLang: null,
  dataEmployee: null,
  dataGetTimeZones: null,
  dataGetnotification: null,
  formDataChanged: false
};

/**
 * Parse errorMessage and errorItems
 * @param res
 */
const getErrors = res => {
  let errorMsg = '';
  const errorItems = [];
  if (
    res.parameters &&
    res.parameters.extensions &&
    res.parameters.extensions.errors &&
    res.parameters.extensions.errors.length > 0
  ) {
    res.parameters.extensions.errors.forEach(item => errorItems.push(item));
  } else {
    errorMsg = res.message;
  }
  return { errorMsg, errorItems };
};

export type EmployeeDetailActionState = Readonly<typeof initialState>;

// Reducer
export default (
  state: EmployeeDetailActionState = initialState,
  action
): EmployeeDetailActionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.CHANGE_NOMAL_PASSWORD):
    case REQUEST(ACTION_TYPES.GET_LANGUAGES):
    case REQUEST(ACTION_TYPES.GET_TIMEZONES):
    case REQUEST(ACTION_TYPES.GET_NOTIFICATION_SETTING):
    case REQUEST(ACTION_TYPES.UPDATE_NOTIFICATION_DETAIL_SETTING):
    case REQUEST(ACTION_TYPES.UPDATE_SETTING_EMPLOYEE): {
      return {
        ...state,
        successMessage: null,
        errorMessage: null
      };
    }
    case FAILURE(ACTION_TYPES.CHANGE_NOMAL_PASSWORD):
    case FAILURE(ACTION_TYPES.GET_LANGUAGES):
    case FAILURE(ACTION_TYPES.GET_TIMEZONES):
    case FAILURE(ACTION_TYPES.GET_NOTIFICATION_SETTING):
    case FAILURE(ACTION_TYPES.UPDATE_NOTIFICATION_DETAIL_SETTING):
    case FAILURE(ACTION_TYPES.UPDATE_SETTING_EMPLOYEE): {
      const resError = getErrors(action.payload.response.data);
      return {
        ...state,
        action: employeeDetailAction.ErrorModal,
        errorMessage: resError
      };
    }
    case SUCCESS(ACTION_TYPES.CHANGE_NOMAL_PASSWORD): {
      return {
        ...state,
        successMessage: 'INF_COM_0004',
        formDataChanged: false
      };
    }
    case SUCCESS(ACTION_TYPES.GET_LANGUAGES): {
      return {
        ...state,
        dataGetLang: action.payload.data
      };
    }
    case SUCCESS(ACTION_TYPES.GET_TIMEZONES): {
      return {
        ...state,
        dataGetTimeZones: action.payload.data
      };
    }
    case SUCCESS(ACTION_TYPES.GET_NOTIFICATION_SETTING): {
      return {
        ...state,
        dataGetnotification: action.payload.data
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_NOTIFICATION_DETAIL_SETTING):
    case SUCCESS(ACTION_TYPES.UPDATE_SETTING_EMPLOYEE): {
      let randomId = null;
      if (action.payload.data.employeeId) {
        randomId = Math.floor(Math.random() * Math.floor(100000));
      }
      return {
        ...state,
        successMessage: action.payload.data.employeeId > 0 ? 'INF_COM_0004' : '',
        formDataChanged: false,
        idUpdate: randomId
      };
    }
    case ACTION_TYPES.EMPLOYEE_FORM_DATA_CHANGED:
      return {
        ...state,
        formDataChanged: action.payload
      };
    case ACTION_TYPES.EMPLOYEE_DETAIL_RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// API base URL
const commonApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.COMMON_SERVICE_PATH;
const employeeApiUrl = API_CONTEXT_PATH + '/' + API_CONFIG.EMPLOYEE_SERVICE_PATH;

/**
 * get changeNomalPassword
 *
 * @param
 */
export const handleChanePassword = params => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.CHANGE_NOMAL_PASSWORD,
    payload: axios.post(
      `${employeeApiUrl}/change-password`,
      { oldPassword: params.oldPassword, newPassword: params.newPassword },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/**
 * get Languages
 *
 * @param
 */
export const getLanguages = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_LANGUAGES,
    payload: axios.post(`${commonApiUrl}/get-languages`, null, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

/**
 * get Timezones
 *
 * @param
 */
export const getTimezones = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_TIMEZONES,
    payload: axios.post(`${commonApiUrl}/get-timezones`, null, {
      headers: { ['Content-Type']: 'application/json' }
    })
  });
};

/**
 * get Notification Setting
 *
 * @param
 */
export const getNotificationSetting = param => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_NOTIFICATION_SETTING,
    payload: axios.post(
      `${commonApiUrl}/get-notification-setting`,
      { employeeId: param, isNotification: true },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/**
 * update Notification Detail Setting
 *
 * @param
 */
export const handleUpdateNotificationDetailSetting = params => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.UPDATE_NOTIFICATION_DETAIL_SETTING,
    payload: axios.post(
      `${commonApiUrl}/update-notification-detail-setting`,
      {
        dataSettingNotifications: params.dataSettingNotifications,
        notificationTime: params.notificationTime ? params.notificationTime : null,
        emails: params.emails
      },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });
};

/**
 * update Employee
 *
 * @param
 */
export const handleUpdateSettingEmployee = params => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SETTING_EMPLOYEE,
    payload: axios.post(
      `${employeeApiUrl}/update-setting-employee`,
      {
        languageId: params.languageId,
        languageCode: params.languageCode,
        timezoneId: params.timezoneId,
        timezoneName: params.timezoneName,
        formatDateId: params.formatDateId,
        formatDate: params.formatDate
      },
      {
        headers: { ['Content-Type']: 'application/json' }
      }
    )
  });

  // refresh token
  if (
    result.action.payload &&
    result.action.payload.data &&
    result.action.payload.data.employeeId > 0
  ) {
    let jwt = Storage.local.get(AUTH_TOKEN_KEY);
    let refreshJwt = Storage.local.get(AUTH_REFRESH_TOKEN_KEY);
    if (!jwt) {
      jwt = Storage.session.get(AUTH_TOKEN_KEY);
      refreshJwt = Storage.session.get(AUTH_REFRESH_TOKEN_KEY);
    }
    if (jwt) {
      const jwtData = jwtDecode(jwt);
      onRefreshToken(jwtData, refreshJwt);
    }
  }
};

export const reset = () => ({
  type: ACTION_TYPES.EMPLOYEE_DETAIL_RESET
});

export const changeFormData = changed => ({
  type: ACTION_TYPES.EMPLOYEE_FORM_DATA_CHANGED,
  payload: changed
});
