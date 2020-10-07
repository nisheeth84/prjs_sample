import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { AUTH_TOKEN_KEY, AUTH_REFRESH_TOKEN_KEY } from 'app/config/constants';
import { Storage } from 'react-jhipster';
import jwtDecode from 'jwt-decode';

export const ACTION_TYPES = {
  FETCH_HEALTH: 'administration/FETCH_HEALTH'
};

const initialState = {
  loading: false,
  errorMessage: null,
  health: {} as any
};

export type AdministrationState = Readonly<typeof initialState>;

export default (state: AdministrationState = initialState, action): AdministrationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_HEALTH):
      return {
        ...state,
        errorMessage: null,
        loading: true
      };
    case FAILURE(ACTION_TYPES.FETCH_HEALTH):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_HEALTH):
      return {
        ...state,
        loading: false,
        health: action.payload.data
      };
    default:
      return state;
  }
};

export const systemHealth = () => ({
  type: ACTION_TYPES.FETCH_HEALTH,
  payload: axios.get('management/health')
});

/**
 * on refresh token
 * @param jwtData token data
 */
export const onRefreshToken = (jwtData, refreshJwt) => {
  if (jwtData && refreshJwt) {
    fetch(jwtData['iss'], {
      headers: {
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
        'Content-Type': 'application/x-amz-json-1.1'
      },
      mode: 'cors',
      cache: 'no-cache',
      method: 'POST',
      body: JSON.stringify({
        ClientId: jwtData['aud'],
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
          REFRESH_TOKEN: refreshJwt
        }
      })
    })
      .then(res => res.json())
      .then(jsonData => {
        const jwt = Storage.local.get(AUTH_TOKEN_KEY);
        if (jwt) {
          Storage.local.set(AUTH_TOKEN_KEY, jsonData.AuthenticationResult['IdToken']);
        } else {
          Storage.session.set(AUTH_TOKEN_KEY, jsonData.AuthenticationResult['IdToken']);
        }
      });
  }
};

/**
 * check token expire
 */
export const checkTokenExpire = () => {
  let jwt = Storage.local.get(AUTH_TOKEN_KEY);
  let refreshJwt = Storage.local.get(AUTH_REFRESH_TOKEN_KEY);
  if (!jwt) {
    jwt = Storage.session.get(AUTH_TOKEN_KEY);
    refreshJwt = Storage.session.get(AUTH_REFRESH_TOKEN_KEY);
  }
  if (jwt) {
    const jwtData = jwtDecode(jwt);
    // refresh token before 90s
    if (jwtData.exp - 360 < Date.now() / 1000) {
      onRefreshToken(jwtData, refreshJwt);
    }
  } else {
    Storage.local.remove(AUTH_TOKEN_KEY);
    Storage.local.remove(AUTH_REFRESH_TOKEN_KEY);
    Storage.session.remove(AUTH_TOKEN_KEY);
    Storage.session.remove(AUTH_REFRESH_TOKEN_KEY);
  }
};
