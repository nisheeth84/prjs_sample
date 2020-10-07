import axios from 'axios';
import { translate } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { API_CONTEXT_PATH } from 'app/config/constants';
import { CONFIG } from 'app/modules/account/constants';

export const ACTION_TYPES = {
  RESET_PASSWORD_INIT: 'passwordReset/RESET_PASSWORD_INIT',
  RESET_PASSWORD_CHECK_KEY: 'passwordReset/RESET_PASSWORD_CHECK_KEY',
  RESET: 'passwordReset/RESET'
};

const initialState = {
  isLoading: false,
  isResetPasswordSuccess: false,
  isResetPasswordFailure: false,
  isCheckKeySuccess: false,
  isCheckKeyFailure: false,
  isKeyExpried: false,
  errorMessage: null
};

export type PasswordResetState = Readonly<typeof initialState>;

// Reducer
export default (state: PasswordResetState = initialState, action): PasswordResetState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.RESET_PASSWORD_INIT):
      return {
        ...state,
        isLoading: true,
        errorMessage: null,
        isResetPasswordFailure: false
      };
    case FAILURE(ACTION_TYPES.RESET_PASSWORD_INIT):
      return {
        ...initialState,
        isLoading: false,
        isResetPasswordFailure: true,
        errorMessage: action.payload.response.data.parameters.extensions.errors[0].errorCode
      };
    case SUCCESS(ACTION_TYPES.RESET_PASSWORD_INIT):
      return {
        ...initialState,
        isLoading: false,
        isResetPasswordSuccess: action.payload.data,
        isResetPasswordFailure: !action.payload.data
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    case FAILURE(ACTION_TYPES.RESET_PASSWORD_CHECK_KEY):
      return {
        ...initialState,
        isCheckKeyFailure: true
      };
    case SUCCESS(ACTION_TYPES.RESET_PASSWORD_CHECK_KEY):
      return {
        ...initialState,
        isLoading: false,
        isKeyExpried: !action.payload.data,
        isCheckKeySuccess: action.payload.data,
        isCheckKeyFailure: !action.payload.data
      };
    default:
      return state;
  }
};

// API base URL
const apiUrl = API_CONTEXT_PATH + '/' + CONFIG.SERVICE_PATH + '/account/reset-password';
const loginUrl = API_CONTEXT_PATH + '/' + CONFIG.LOGIN_PATH;

/**
 * Request reset password
 *
 * @param username
 */
export const handlePasswordResetInit = username => ({
  type: ACTION_TYPES.RESET_PASSWORD_INIT,
  // If the content-type isn't set that way, axios will try to encode the body and thus modify the data sent to the server.
  payload: axios.post(`${loginUrl}/auth/forgot`, { username }),
  meta: {
    successMessage: translate('reset.request.messages.success'),
    errorMessage: translate('reset.request.messages.notfound')
  }
});

/**
 * Check reset key
 *
 * @param key
 */
export const handlePasswordResetCheckKey = key => ({
  type: ACTION_TYPES.RESET_PASSWORD_CHECK_KEY,
  payload: axios.post(`${apiUrl}/checkkey`, key, { headers: { ['Content-Type']: 'text/plain' } }),
  meta: {
    successMessage: translate('reset.finish.messages.success')
  }
});

/**
 * reset check
 */
export const resetCheck = () => ({
  type: ACTION_TYPES.RESET
});
