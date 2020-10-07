import './app.scss';

import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Redirect, RouteComponentProps } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { IRootState } from 'app/shared/reducers';
import { getSession, getParam, logout, getEmployeeChatPlus } from 'app/shared/reducers/authentication';
import { checkTokenExpire } from 'app/shared/reducers/administration.reducer';
import { setLocale } from 'app/shared/reducers/locale';
import Header from 'app/shared/layout/header/header';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import { AUTHORITIES, SIGNOUT_SAML_URL } from 'app/config/constants';
import AppRoutes from 'app/routes';
import ExecutingPanel from './shared/layout/common/executing-panel';
import { setInterval, setTimeout } from 'timers';
import { isNullOrUndefined } from 'util';
import { Storage, translate } from 'react-jhipster';
import ExceptionPage from './shared/error/exception-page';
import ErrorPage from './shared/error/error-page';
import { CommonUtil } from './modules/activity/common/common-util';
import { STATUS_CONTRACT, PARAM_SITE } from './modules/home/constants';



export interface IAppProps extends StateProps, DispatchProps, RouteComponentProps { }

export const App = (props: IAppProps) => {
  const timerRef = useRef(null);
  const intervalMili = 300000; // interval check 10 minute
  const [isLoaded, setIsLoaded] = useState(null);


  const intervalCheck = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      props.checkTokenExpire();
    }, intervalMili);
  };

  const addChatplus = (chatPlusId) => {
    // const w = window;
    const d = document;
    const s = "https://app.chatplus.jp/cp.js";
    d["__cp_d"] = "https://app.chatplus.jp";
    d["__cp_c"] = chatPlusId;
    const a = d.createElement("script"), m = d.getElementsByTagName("script")[0];
    a.async = true;
    a.src = s;
    m.parentNode.insertBefore(a, m);

  }

  useEffect(() => {
    if (props.infoEmpChatplus) {
      const accessTokens = '66def6a1b350ff2ac2b5e960adb08770dc93e100';
      const userInfo = {
        siteId: 1,
        accessToken: accessTokens,
        name: `${props.infoEmpChatplus.employeeSurname}${props.infoEmpChatplus.employeeName ? props.infoEmpChatplus.employeeName : ''}`,
        tel: props.infoEmpChatplus.telephoneNumber ? props.infoEmpChatplus.telephoneNumber : (props.infoEmpChatplus.cellphoneNumber ? props.infoEmpChatplus.cellphoneNumber : ''),
        email: props.infoEmpChatplus.email ? props.infoEmpChatplus.email : '',
        companyName: props.infoEmpChatplus.employeeDepartments && props.infoEmpChatplus.employeeDepartments.lenght > 0 ? props.infoEmpChatplus.employeeDepartments[0].departmentName : ''
      };
      if (window['ChatplusScript'] && window['ChatplusScript'].updateUser)
        window['ChatplusScript'].updateUser(accessTokens, 1, userInfo);
    }
  }, [props.infoEmpChatplus]);

  const isDisplayChatPlus = () => {
    if (Storage.session.get('site') === PARAM_SITE.CONTRACT) {
      return false;
    }

    if (isNullOrUndefined(props.account) || isNullOrUndefined(props.account.licenses) || isNullOrUndefined(props.statusContract)) {
      return false;
    }

    if (props.isMissingLicense || props.account.licenses.length === 0 || !props.isModifyEmployee) {
      return false;
    }

    if (props.statusContract !== STATUS_CONTRACT.START || isNullOrUndefined(props.dayRemainTrial) || props.dayRemainTrial <= 0) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (isDisplayChatPlus()) {
      const haveChatPlus = document.getElementsByTagName("chat")[0];
      const employeeId = CommonUtil.getUserLogin().employeeId;
      if (!haveChatPlus && !isLoaded && employeeId) {
        setIsLoaded(true);
        const chatPlusId = "9a113f2a_1"
        addChatplus(chatPlusId);
        setTimeout(() => {
          props.getEmployeeChatPlus(employeeId);
        }, 2000)
      }
    }
  }, [props.dayRemainTrial, props.statusContract]);

  useEffect(() => {
    const param = getParam(window.location.search, 'site');
    const redirectUrl = getParam(window.location.search, 'redirect_url');

    if (isNullOrUndefined(Storage.session.get(SIGNOUT_SAML_URL))) {
      Storage.session.set('redirect_url', redirectUrl);
      Storage.session.set('site', param);
    }

    if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('/input/tenant')) {
      props.getSession(Storage.session.get('site'));
    }

    intervalCheck();
  }, []);

  // Redirect to 403 error page
  if (!isNullOrUndefined(props.isAccept) && !props.isAccept) {
    return (
      <ExceptionPage
        type={403}
        description={translate('exception.403')}
        onBackTo={props.logout}
        titleButton={translate('exception.back')}
      />
    )
  }

  if (props.signInUrl) {
    window.location.replace(props.signInUrl);
  }

  if (props.messageError) {
    return (
      <ErrorPage messageError={props.messageError} />
    )
  }

  return (
    <Router basename={window.location.pathname.endsWith('/input/tenant') ? '/' : props.tenant}>
      <>
        <ErrorBoundary>
          <Header isAuthenticated={props.isAuthenticated} />
        </ErrorBoundary>
        <ErrorBoundary>
          {/* {props.tenant.length <= 0 ? <ErrorBoundaryRoute path="/" component={PageNotFound} /> : <DndProvider backend={Backend}><AppRoutes /></DndProvider>} */}
          {props.tenant.length <= 0 ? (
            !props.isAuthenticated ? (
              <Redirect to={{ pathname: '/account/input/tenant', search: window.location.search}} />
            ) : (
              <ErrorBoundaryRoute path="/" component={PageNotFound} />
            )
          ) : (
            <DndProvider backend={Backend}>
              <AppRoutes />
            </DndProvider>
          )}
        </ErrorBoundary>
        <ExecutingPanel />
      </>
    </Router>
  );
};

const mapStateToProps = ({ authentication, applicationProfile, locale }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  ribbonEnv: applicationProfile.ribbonEnv,
  isInProduction: applicationProfile.inProduction,
  tenant: applicationProfile.tenant,
  signInUrl: authentication.signInUrl,
  isAccept: authentication.isAccept,
  isLoading: authentication.isLoading,
  messageError: applicationProfile.messageError,
  statusContract: authentication.statusContract,
  infoEmpChatplus: authentication.infoEmpChatplus,
  dayRemainTrial: authentication.dayRemainTrial,
  isMissingLicense: authentication.isMissingLicense,
  isModifyEmployee: authentication.isModifyEmployee,
  account: authentication.account
});

const mapDispatchToProps = { getEmployeeChatPlus, setLocale, getSession, checkTokenExpire, logout };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(hot(module)(App));
