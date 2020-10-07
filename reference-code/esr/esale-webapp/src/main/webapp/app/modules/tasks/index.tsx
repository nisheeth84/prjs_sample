
import React from 'react';
import { Switch } from 'react-router-dom';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import MenuPrivateRoute from 'app/shared/auth/menu-private-route';
import TaskList from 'app/modules/tasks/list/task-list';
import { COMPONENT_DISPLAY_TYPE } from 'app/config/constants';

const Routes = ({ match }) => (
  <>
    <Switch>
      <MenuPrivateRoute exact path={`${match.url}/list`} component={TaskList} componentDisplayName={COMPONENT_DISPLAY_TYPE.TASK_LIST}/>
      <ErrorBoundaryRoute component={PageNotFound}/>
    </Switch>
  </>
);
export default Routes
