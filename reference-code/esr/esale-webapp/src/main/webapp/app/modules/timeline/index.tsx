import React from 'react';
import { Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import MenuPrivateRoute from 'app/shared/auth/menu-private-route';
import TimelineList from './timeline-list/timeline-list';
import TimelineGroupList from './timeline-group-list/timeline-group-list';

import '../../../content/css/time-line.css';
import TimelineGroupUser from './timeline-group-user/timeline-group-user';

const Routes = ({ match }) => (
  <>
    <Helmet>
      <body className="wrap-timeline"/>
    </Helmet>
    <Switch>
      <MenuPrivateRoute exact path={`${match.url}/list`} component={TimelineList} />
      <MenuPrivateRoute exact path={`${match.url}/channel`} component={TimelineGroupList} />
      <MenuPrivateRoute path="/timeline/channel/detail/:timelineGroupId" component={TimelineGroupUser} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>


  </>
);

export default Routes;
