import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import MenuPrivateRoute from 'app/shared/auth/menu-private-route';
import SalesList from './sales-list/sales-list';

const Routes = ({ match }) => (
  <>
    <Switch>
      <MenuPrivateRoute exact path={`${match.url}/list`} component={SalesList} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </>
);

export default Routes;
