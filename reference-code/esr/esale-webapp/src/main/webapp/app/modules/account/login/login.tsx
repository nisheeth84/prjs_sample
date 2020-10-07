import './login.scss';
import { PARAM_SITE, STATUS_CONTRACT } from 'app/modules/home/constants';
import {
  AUTH_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  SIGNOUT_SAML_URL
} from 'app/config/constants';
import { IRootState } from 'app/shared/reducers';
import { ActionSession, getParam, login, reset, getSession, logout } from 'app/shared/reducers/authentication';
import { AvField, AvForm, AvInput } from 'availity-reactstrap-validation';
import { isNil, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate, Storage } from 'react-jhipster';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Button, Label } from 'reactstrap';
import { isNullOrUndefined } from 'util';
import { VALIDATION_TYPE } from '../constants';
import PopupSelectDestination from '../popup/popup-select-destination';
import Footer from './footer';
import ExceptionPage from 'app/shared/error/exception-page';
import { openApp, isMobile } from '../../../shared/util/openApp';
import { clearStorage } from 'app/shared/util/utils';

const PAGE_TYPE = {
  EXCEPTION: 'exception',
  CONTRACT_INFO: 'contract info',
  LOGIN: 'login',
}

export interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps<{}> {
  isLoginError: boolean;
  isLoginSuccess: boolean;
  trial: number;
  isTrialExpired: boolean;
  isEndContract: boolean;
  isPasswordExpired: boolean;
  sessionEnum: ActionSession;
  logout: any;
}

export const Login = (props: ILoginProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [showPopupDestination, setShowPopupDestination] = useState(false);
  const [componentType, setComponentType] = useState('');
  const [invalidAccessError, setInvalidAccessError] = useState(null);

  const tenant = window.location.pathname.split('/')[1];
  const uriContract = getParam(props.location.search, 'redirect_url') || Storage.session.get(SIGNOUT_SAML_URL) ? Storage.session.get('redirect_url') : null;
  const site = getParam(props.location.search, 'site') || Storage.session.get(SIGNOUT_SAML_URL) ? Storage.session.get('site') : null;
  const { statusContract, dayRemainTrial, isAccessContract } = props;

  useEffect(() => {
    return () => {
      props.reset();
    };
  }, []);

  const isInvalidAccess = (siteInner) => {
    if (isNullOrUndefined(siteInner)) {
      return false;
    }

    if (siteInner === PARAM_SITE.CONTRACT && !isAccessContract) {
      setInvalidAccessError('ERR_LOG_0014');
      props.logout();
      return true;
    }

    const countLicense = (props.account && props.account.licenses) ? props.account.licenses.length : 0;
    if (siteInner === PARAM_SITE.ESMS) {
      if (!props.isModifyEmployee) {
        setInvalidAccessError('ERR_LOG_0015');
        props.logout();
        return true;
      }
      if (countLicense === 0) {
        setInvalidAccessError('ERR_LOG_0016');
        props.logout();
        return true;
      }
    }
    
    return false;
  }

  const postToSite = (url) => {
    const form = document.createElement("form");
    const idToken = document.createElement("input");
    const refreshToken = document.createElement("input");
    form.method = "POST";
    form.action = url;

    idToken.value = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
    idToken.name = "id-token";
    idToken.type = "hidden";
    form.appendChild(idToken);

    refreshToken.value = Storage.local.get(AUTH_REFRESH_TOKEN_KEY) || Storage.session.get(AUTH_REFRESH_TOKEN_KEY);
    refreshToken.name ="refresh-token";
    refreshToken.type = "hidden";
    form.appendChild(refreshToken);

    document.body.appendChild(form);
    form.submit();
  }

    /**
   * Redirect by path
   * @param path
   */
  const redirectToESMS = (path = null) => {
    if (isInvalidAccess(PARAM_SITE.ESMS)) {
      return;
    }

    if (isMobile()) {
      openApp();
    }
    if (!path) {
      props.history.push('/');
      return;
    }
  };

   /**
   * Check param site getting from url
   */
  const checkParamUrl = () => {
    // if [site] does not exist or null, show popup to select destination
    if (isNullOrUndefined(site)) {
      setShowPopupDestination(true);
      return;
    }
    // if [site] exists, check its value to redirect to correspond site
    if (site.toLowerCase() === PARAM_SITE.ESMS) {
      redirectToESMS();
      return;
    } else if (site.toLowerCase() === PARAM_SITE.CONTRACT || uriContract) {
      postToSite(uriContract || props.siteContract);
    }
  };

  const checkContractToRender = () => {
    // 1. In case the contract expires or the contract expired trial
    if (statusContract === STATUS_CONTRACT.STOP || (statusContract === STATUS_CONTRACT.START && !isNil(dayRemainTrial) && dayRemainTrial <= 0)) {
      setComponentType(PAGE_TYPE.CONTRACT_INFO);
    }

    // 2. In case the contract is deleted
    if (statusContract === STATUS_CONTRACT.DELETE) {
      // 2.1 User can only redirect to contract site
      if (!isAccessContract || site === PARAM_SITE.ESMS) {
        setComponentType(PAGE_TYPE.EXCEPTION);
      }

      /* 2.2 User has right to access contract site and: */
      // user access to contract site
      if (site === PARAM_SITE.CONTRACT) {
        postToSite(uriContract || props.siteContract);
      }

      // param site dose not exist on url
      if (isNullOrUndefined(site) && !showPopupDestination) {
        setShowPopupDestination(true);
      }
    }

    // 3. In case the contract is still valid
    if (props.statusContract === STATUS_CONTRACT.START && (isNil(props.dayRemainTrial) || props.dayRemainTrial > 0)) {
      if (isAccessContract && !showPopupDestination) {
        checkParamUrl();
      } else if (!isAccessContract) { // go to esms site
        redirectToESMS();
      }
    }
  }

  const checkNotExistEmployee = () => {
    // check when not exits site
    if (isNullOrUndefined(site)){
      if (isAccessContract){
        postToSite(uriContract || props.siteContract);
      } else {
        setComponentType(PAGE_TYPE.EXCEPTION);
      }
      return;
    }
    // check site contract and is access true
    if (site === PARAM_SITE.CONTRACT && isAccessContract){
      postToSite(uriContract || props.siteContract);
      return;
    }

    setComponentType(PAGE_TYPE.EXCEPTION);
  }

  useEffect(() => {
    if (props.isMissingLicense && isEmpty(props.isAuthenticated)) {
      clearStorage();
      return;
    }
    // not authen
    if (isEmpty(props.isAuthenticated) || props.statusContract === null) {
      return;
    }

    if (isInvalidAccess(Storage.session.get('site'))) {
      return;
    }

    if (props.isAccessContract && uriContract){
      postToSite(uriContract);
      return;
    }

    // Employee not exits in posgres
    if (!props.isEmployeeExisted) {
      checkNotExistEmployee();
      return;
    }

    // Has licenses 
    checkContractToRender();

  }, [props.isAuthenticated, props.statusContract, props.isAccessContract, props.isTrialExpired, props.isEmployeeExisted, props.isMissingLicense, props.isModifyEmployee]);

  /**
   * Handle login when click submit button
   * @param event
   * @param values
   */
  const handleLogin = (event, values) => {
    setIsSubmit(true);
    setInvalidAccessError(null);
    if (values.username !== null && values.username !== "" && values.password !== null && values.password !== "") {
      setCurrentPassword(values.password);
      setUsername(values.username);
      props.login(values.username.trim(), values.password, values.rememberMe);
      setIsSubmit(false);
      event.preventDefault();
    }
  };

  const {
    // location,
    isAuthenticated,
    isLoginError: isLoginError,
    isLoginSuccess: isLoginSuccess,
    trial,
    isTrialExpired: isTrialExpired,
    isEndContract: isEndContract,
    isPasswordExpired: isPasswordExpired,
    newPasswordRequired
  } = props;
  // const { from } = location.state || { from: { pathname: '/', search: location.search } };

  if (props.sessionEnum === ActionSession.Request && !showPopupDestination) {
    return <div></div>;
  }

  if (isPasswordExpired && isLoginSuccess) {
    return <Redirect to={{ pathname: '/account/password', search: window.location.search, state: { username, isPasswordExpired } }} key="from-login" />;
  }

  if (newPasswordRequired && isLoginSuccess) {
    return (
      <Redirect
        to={{ pathname: '/account/password', search: window.location.search, state: { firstFlg: true, username, oldPassword: currentPassword } }}
        key="from-login"
      />
    );
  }

  /**
   * Handle for showing popup destination
   * @param flg
   */
  const onShowPopupDestination = (flg: boolean) => {
    setShowPopupDestination(flg);
  };

  /**
   * Get validation arguments for input
   * @param required
   */
  const getValidationArgs = (required?) => {
    let objValidation = null;
    if (isSubmit) {
      if (required === VALIDATION_TYPE.REQUIRED) {
        objValidation = { ...objValidation, required: { value: true, errorMessage: translate('messages.ERR_COM_0013') } };
      }
    }
    return objValidation;
  };

  const getMessageErrorByCode = (message) => {
    const messageError = message || props.errorMessage;
    if (messageError === 'ERR_COM_0035') {
      return translate('messages.' + messageError, {0: tenant});
    } else {
      return translate('messages.' + messageError);
    }
  }

  const switchToNotFoundPage = () => {
    setComponentType(PAGE_TYPE.EXCEPTION);
  }

  /**
   * Render login component
   */
  const renderComponent = () => {
    return (
      <>
        {showPopupDestination && (
          <PopupSelectDestination
            toggleShowPopupDestination={onShowPopupDestination}
            redirectUrl={props.statusContract ===  STATUS_CONTRACT.DELETE ? switchToNotFoundPage : redirectToESMS}
            uriContract={uriContract || props.siteContract}
          />
        )}
        {(isEmpty(isAuthenticated) || showPopupDestination) && (
          <div className="wrap-login">
            <div className="left">
              <div className="login-content">
                <div className="login-logo">
                  <img src="/content/images/logo.svg" />
                </div>
                <div className="login-form">
                  {trial > 0 && (
                    <div className="form-group error">
                      <span className="icon">
                        <img src="/content/images/ic-note.svg" />
                      </span>
                      {translate('account.login.messages.errors.trial-left-days', { trial })}
                    </div>
                  )}
                  {isTrialExpired ||
                    (isEndContract && (
                      <div className="form-group error">
                        <span className="icon">
                          <img src="/content/images/ic-note.svg" />
                        </span>
                        {translate('account.login.messages.errors.trial-ended')}
                      </div>
                    ))}
                  {(isLoginError || invalidAccessError) && (
                    <div className="form-group error pink">
                      <span className="icon">
                        <img src="/content/images/ic-dont.svg" alt="" title="" />
                      </span>
                      {getMessageErrorByCode(invalidAccessError)}
                    </div>
                  )}
                  {props.isMissingLicense && (
                    <div className="form-group error pink">
                      <span className="icon">
                        <img src="/content/images/ic-dont.svg" alt="" title="" />
                      </span>
                      {translate('account.licenses.error-licenses.message')}
                    </div>
                  )}
                  <AvForm id="login-form" onValidSubmit={handleLogin}>
                    <div className="form-group">
                      <label htmlFor="username">
                        {translate('account.login.form.username')}
                        <span className="label-red ml-3">{translate('account.login.form.label.required')}</span>
                      </label>
                      <AvField
                        name="username"
                        className="form-control"
                        placeholder={translate('account.login.form.username.placeholder')}
                        validate={getValidationArgs(VALIDATION_TYPE.REQUIRED)}
                        autoFocus
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">
                        {translate('account.login.form.password')}
                        <span className="label-red ml-3">{translate('account.login.form.label.required')}</span>
                      </label>
                      <AvField
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder={translate('account.login.form.password.placeholder')}
                        validate={getValidationArgs(VALIDATION_TYPE.REQUIRED)}
                      />
                    </div>
                    <div className="note">{translate('account.login.form.link.reset-password', { tenant })}</div>
                    <Button type="submit" className="button-login">
                      {translate('account.login.form.button.login')}
                    </Button>
                    <Label className="icon-check">
                      <AvInput type="checkbox" name="rememberMe" />
                      <i></i> <span>{translate('account.login.form.rememberme')}</span>
                    </Label>
                  </AvForm>
                </div>
              </div>
              {<Footer />}
            </div>
            <div className="login-img">
              <img src="../../../content/images/bg-login.svg"></img>
            </div>
          </div>
        )}
      </>
    );
  };


  switch (componentType) {
    case PAGE_TYPE.EXCEPTION: {
      return (
        <ExceptionPage
          beforeRender={props.logout}
          onBackTo={() => {
            setComponentType(PAGE_TYPE.LOGIN);
            setShowPopupDestination(false);
          }}
        />
      )
    }
    case PAGE_TYPE.CONTRACT_INFO: {
      return (
        <Redirect
          to={{
            pathname: '/account/contract-info', search: window.location.search,
            state: { isAccessContract: props.isAccessContract, siteContract: uriContract || props.siteContract }
          }}
        />
      );
    }
    default:
      return renderComponent();
  }
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  isLoginError: authentication.isLoginError,
  isLoginSuccess: authentication.isLoginSuccess,
  isPasswordExpired: authentication.isPasswordExpired,
  sessionEnum: authentication.sessionEnum,
  newPasswordRequired: authentication.newPasswordRequired,
  isAccessContract: authentication.isAccessContract,
  statusContract: authentication.statusContract,
  dayRemainTrial: authentication.dayRemainTrial,
  msgContract: authentication.msgContract,
  errorMessage: authentication.errorMessage,
  siteContract: authentication.siteContract,
  isEmployeeExisted: authentication.isEmployeeExisted,
  isMissingLicense: authentication.isMissingLicense,
  isModifyEmployee: authentication.isModifyEmployee,
  account: authentication.account
});

const mapDispatchToProps = { login, reset, getSession, logout };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
