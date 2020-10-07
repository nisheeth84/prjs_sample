import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import MenuPrivateRoute from 'app/shared/auth/menu-private-route';
import ProductList from './list/product-list';
import { COMPONENT_DISPLAY_TYPE } from 'app/config/constants';

const Routes = ({ match }) => (
  <>
    <Switch>
      <MenuPrivateRoute exact path={`${match.url}/list`} component={ProductList} componentDisplayName={COMPONENT_DISPLAY_TYPE.PRODUCT_LIST} />
      <MenuPrivateRoute path={`${match.url}/set/productTradingTab`} component={ProductList} />
      <MenuPrivateRoute path={`${match.url}/set/productSetHistory`} component={ProductList} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </>
);

export default Routes;
