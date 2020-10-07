import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import MenuPrivateRoute from 'app/shared/auth/menu-private-route';
import AnalysisReportList from './list/analysis-report-list';
import { COMPONENT_DISPLAY_TYPE } from 'app/config/constants';

const Routes = ({ match }) => (
  <>
    <Switch>
      <MenuPrivateRoute exact path={`${match.url}/list`} component={AnalysisReportList} componentDisplayName={COMPONENT_DISPLAY_TYPE.ANALYSIS_REPORT_LIST} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </>
);

export default Routes;
