import React from 'react';
import { Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import MenuPrivateRoute from 'app/shared/auth/menu-private-route';
import ActivityList from './list/activity-list';

import '../../../content/css/activity.css';
import '../../../content/css/calendar.css';
import '../calendar/style/custom.scss';

const Routes = ({ match }) => (
  <>
    <Helmet>
      <body className="wrap-activity"/>
    </Helmet>
    <Switch>
      <MenuPrivateRoute exact path={`${match.url}/list`} component={ActivityList} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </>
);

export default Routes;
