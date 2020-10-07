import React, { Suspense, lazy } from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import MenuPrivateRoute from 'app/shared/auth/menu-private-route';
import { COMPONENT_DISPLAY_TYPE } from 'app/config/constants';

const CustomerList = lazy(() => import('./list/customer-list'));

const Routes = ({ match }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Switch>
      <MenuPrivateRoute
        exact
        path={`${match.url}/list`}
        component={CustomerList}
        componentDisplayName={COMPONENT_DISPLAY_TYPE.CUSTOMER_LIST}
      />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </Suspense>
);

export default Routes;
