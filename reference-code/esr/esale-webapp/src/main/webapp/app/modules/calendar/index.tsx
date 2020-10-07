import React from 'react';
import { Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import Calendar from './grid/calendar';
import CompositePrivateRoute from 'app/shared/auth/composite-private-route';
import { COMPONENT_DISPLAY_TYPE } from 'app/config/constants';

const Routes = ({ match }) => (
  <>
    <Helmet>
      <body className="wrap-calendar"/>
    </Helmet>
    <Switch>
      <CompositePrivateRoute path={`${match.url}/grid`} component={Calendar} componentDisplayName={COMPONENT_DISPLAY_TYPE.CALENDAR_GRID}/>
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </>
);

export default Routes;
