import 'app/modules/account/login/login.scss';
import React, { useEffect, useState } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { RouteComponentProps, Redirect, Router, Switch } from 'react-router-dom';
import { getSession } from 'app/shared/reducers/authentication';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import Footer from '../login/footer';

export interface ITenantInputInitProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const TenantInputInit = (props: ITenantInputInitProps) => {
  const [tenantName, setTenantName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Handle redirect to login screen
   */
  const handleRedirect = () => {
    const path = `/${tenantName}/account/login${window.location.search}`;
    if (!props.isAuthenticated && tenantName.length > 0) {
      window.location.replace(path);
    }
  };

  if (props.isAuthenticated) {
    return (
      <Switch>
        <ErrorBoundaryRoute path="/" component={PageNotFound} />
      </Switch>
    );
  }

  /**
   * Detect Enter key
   * @param event
   */
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleRedirect();
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    handleRedirect();
  };

  /**
   * Set new value for tenantName whenever user enters text
   */
  const handleTextChange = event => {
    setTenantName(event.target.value);
  };

  return (
    <div className="wrap-login">
      <div className="left">
        <div className="login-content">
          <div className="login-logo">
            <img src="/content/images/logo.svg" />
          </div>
          <div className="form-reset">
            <div className="form-group">
              <label>
                {translate('account.login.form.tenant')}
                <span className="label-red ml-4">{translate('account.login.form.label.required')}</span>
              </label>
              <div className={`input-common-wrap ${isSubmitted && tenantName.length <= 0 && 'error'}`}>
                <input
                  type="text"
                  className="input-normal"
                  placeholder={translate('account.login.form.tenant.placeholder')}
                  autoFocus
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {isSubmitted && tenantName.length <= 0 && (
                <span className="messenger error-validate-msg">{translate('messages.ERR_COM_0013')}</span>
              )}
            </div>
            <button onClick={() => handleSubmit()} className="button-login button-blue">
              {translate('account.tenant.input-tenant.button')}
            </button>
          </div>
        </div>
        {<Footer />}
      </div>
      <div className="login-img">
        <img src="../../../content/images/bg-login.svg"></img>
      </div>
    </div>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated
});

const mapDispatchToProps = { getSession };
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect<any, any, {}>(
  mapStateToProps,
  mapDispatchToProps
)(TenantInputInit);
