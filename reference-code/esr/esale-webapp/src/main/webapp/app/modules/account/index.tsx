import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Login from './login/login';
import Logout from './login/logout';
import PasswordChangeInit from './password/password-change-init';
import PasswordChangeFinist from './password/password-change-finish';
import PasswordResetInit from './password/password-reset-init';
import PasswordResetFinish from './password/password-reset-finish';
import PasswordResetCodeInit from './password/password-reset-code-init';
import TenantInputInit from './tenant/tenant-input-init';
import TenantContractInfo from './tenant/tenant-contract-info';
import ExceptionPage from 'app/shared/error/exception-page';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/login`} component={Login} />
      <ErrorBoundaryRoute exact path={`${match.url}/logout`} component={Logout} />
      <ErrorBoundaryRoute exact path={`${match.url}/password`} component={PasswordChangeInit} />
      <ErrorBoundaryRoute exact path={`${match.url}/password/finish`} component={PasswordChangeFinist} />
      <ErrorBoundaryRoute exact path={`${match.url}/reset/password`} component={PasswordResetInit} />
      <ErrorBoundaryRoute exact path={`${match.url}/reset/finish/:key?`} component={PasswordResetFinish} />
      <ErrorBoundaryRoute exact path={`${match.url}/reset/code`} component={PasswordResetCodeInit} />
      <ErrorBoundaryRoute exact path={`${match.url}/input/tenant`} component={TenantInputInit} />
      <ErrorBoundaryRoute exact path={`${match.url}/contract-info`} component={TenantContractInfo} />
      <ErrorBoundaryRoute component={ExceptionPage} />
    </Switch>
  </>
);

export default Routes;
