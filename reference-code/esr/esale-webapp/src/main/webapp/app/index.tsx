import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';

import DevTools from './config/devtools';
import initStore from './config/store';
import { registerLocale } from './config/translation';
import setupAxiosInterceptors from './config/axios-interceptor';
import { clearAuthentication } from './shared/reducers/authentication';
import ErrorBoundary from './shared/error/error-boundary';
import AppComponent from './app';
import { loadIcons } from './config/icon-loader';
import { AUTH_TOKEN_KEY } from 'app/config/constants';
import { Storage } from 'react-jhipster';


const devTools = process.env.NODE_ENV === 'development' ? <DevTools /> : null;

export const store = initStore();
registerLocale(store);

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() => actions.clearAuthentication('login.error.unauthorized'));

loadIcons();

const tenant = window.location.pathname.split('/')[1];
const url = window.location.href;
if (url.includes(tenant)) {
  const items: string[] = url.split('#');
  if (items.length === 2) {
    const queryParams: string[] = items[1].split('&');
    if (queryParams.length > 1) {
      queryParams.forEach(function(queryParam) {
        const param: string[] = queryParam.split('=');
        if (param[0] === 'id_token') {
          Storage.session.set(AUTH_TOKEN_KEY, param[1]);
        }
      });
    }
  }
}

const rootEl = document.getElementById('root');

const render = Component =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <ErrorBoundary>
      <Provider store={store}>
        {/* If this slows down the app in dev disable it and enable when required  */}
        {devTools}
        <Component />
      </Provider>
    </ErrorBoundary>,
    rootEl
  );

render(AppComponent);
