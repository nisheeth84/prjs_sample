import axios from 'axios';
import { Storage } from 'react-jhipster';

import { SERVER_API_URL, AUTH_TOKEN_KEY, DEFAULT_TIMEZONE } from 'app/config/constants';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT_ES } from 'app/config/constants';
import { store } from 'app/index';
import { serverError } from 'app/shared/reducers/application-profile';
import { parseErrorRespose } from 'app/shared/util/string-utils';
import { isNullOrUndefined } from 'util';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_API_URL;

const setupAxiosInterceptors = onUnauthenticated => {
  const onRequestSuccess = config => {
    const token = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
    if (token && !config.url.includes('auth/login')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const tenant = window.location.pathname.split('/')[1];
    if (tenant !== 'login' && tenant !== '') {
      config.headers['X-TenantID'] = tenant;
      config.headers['formatDate'] = Storage.session
        .get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT_ES)
        .replace('YYYY', 'yyyy')
        .replace('DD', 'dd');
      config.headers['languageCode'] = Storage.session.get('locale', 'ja_jp');
      let timezone = Storage.session.get('userTimezoneKey', DEFAULT_TIMEZONE);
      if (!timezone) {
        timezone = DEFAULT_TIMEZONE;
      }
      config.headers['timezone'] = timezone;
    }
    if (config.url.includes('auth/login')) {
      axios.defaults.withCredentials = false;
    }
    return config;
  };
  const onResponseSuccess = response => response;
  const onResponseError = err => {
    const status = err.status || (err.response ? err.response.status : 0);

    if (status !== 403 && status !== 401 && !err.config.url.endsWith('/count-unread-notification') && err.config.url.indexOf("://") < 0) {
      if (status === 0) {
        store.dispatch(serverError('WAR_COM_0012'));
        return;
      }

      const errorList = parseErrorRespose(err);
      if (isNullOrUndefined(errorList) || errorList.length === 0 || isNullOrUndefined(errorList[0].errorCode) || errorList[0].errorCode === "ERR_TMS_999") {
        store.dispatch(serverError('ERR_COM_0093'));
        return;
      }
    }

    if (status === 403 || status === 401) {
      onUnauthenticated();
    } else if (status === 500) {
      err.message = 'error.http.500';
    }
    return Promise.reject(err);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
