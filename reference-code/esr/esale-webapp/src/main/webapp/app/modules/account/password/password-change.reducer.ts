import axios from 'axios';
import { translate } from 'react-jhipster';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { CONFIG } from 'app/modules/account/constants';

export const ACTION_TYPES = {
  UPDATE_PASSWORD: 'account/UPDATE_PASSWORD',
  CHANGE_PASSWORD: 'account/CHANGE_PASSWORD',
  RESET: 'account/RESET'
};

const initialState = {
  isLoading: false,
  errorMessage: null,
  errorMsg: null,
  isUpdateSuccess: false,
  isUpdateFailure: false
};

/**
 * Parse errorMessage and errorItems
 * @param res
 */
const getErrors = res => {
  let errorMsg = '';
  const errorItems = [];
  if (res.errors && res.errors.length > 0) {
    if (
      res.errors[0].extensions &&
      res.errors[0].extensions.errors &&
      res.errors[0].extensions.errors.length > 0
    ) {
      res.errors[0].extensions.errors.forEach(e => {
        errorItems.push(e);
      });
    } else {
      errorMsg = res.errors[0].errorCode;
    }
  }
  return { errorMsg, errorItems };
};

export type PasswordChangeState = Readonly<typeof initialState>;

// Reducer
export default (state: PasswordChangeState = initialState, action): PasswordChangeState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.UPDATE_PASSWORD):
    case REQUEST(ACTION_TYPES.CHANGE_PASSWORD):
      return {
        ...initialState,
        errorMessage: null,
        isUpdateSuccess: false,
        isLoading: true
      };
    case FAILURE(ACTION_TYPES.UPDATE_PASSWORD):
    case FAILURE(ACTION_TYPES.CHANGE_PASSWORD): {
      const resError = getErrors(action.payload.response.data.parameters.extensions);
      return {
        ...initialState,
        isLoading: false,
        errorMessage: action.payload.response.data,
        errorMsg: resError.errorMsg,
        isUpdateSuccess: false,
        isUpdateFailure: true
      };
    }
    case SUCCESS(ACTION_TYPES.UPDATE_PASSWORD):
    case SUCCESS(ACTION_TYPES.CHANGE_PASSWORD):
      return {
        ...initialState,
        isLoading: false,
        isUpdateSuccess: true,
        isUpdateFailure: false
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    // TODO
    // case ACTION_TYPES.UPDATE_PASSWORD:
    //   return {
    //     ...initialState,
    //     errorMessage: null,
    //     isUpdateSuccess: true,
    //     isLoading: false
    //   };
    default:
      return state;
  }
};

// API base URL
const apiUrl = API_CONTEXT_PATH + '/' + CONFIG.SERVICE_PATH;
const loginUrl = API_CONTEXT_PATH + '/' + CONFIG.LOGIN_PATH + '/register/account';

/**
 * Save change password at first access
 *
 * @param oldPassword
 * @param newPassword
 */
export const changePasswordFirstAccess = (username, oldPassword, newPassword) => ({
  type: ACTION_TYPES.UPDATE_PASSWORD,
  payload: axios.post(`${loginUrl}/confirm`, { username, oldPassword, newPassword }),
  meta: {
    successMessage: translate('password.messages.success'),
    errorMessage: translate('password.messages.error')
  }
});

/**
 * Save change password normally
 *
 * @param oldPassword
 * @param newPassword
 */
export const changePasswordNormal = (username, oldPassword, newPassword) => ({
  type: ACTION_TYPES.UPDATE_PASSWORD,
  payload: axios.post(`${apiUrl}/change-password`, { username, oldPassword, newPassword }),
  meta: {
    successMessage: translate('password.messages.success'),
    errorMessage: translate('password.messages.error')
  }
});

/**
 * resert change password
 */
export const resetChange = () => ({
  type: ACTION_TYPES.RESET
});
