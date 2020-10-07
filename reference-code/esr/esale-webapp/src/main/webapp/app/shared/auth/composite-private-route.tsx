import React from 'react';
import { connect } from 'react-redux';
import { Translate } from "react-jhipster";
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { Location } from 'history';

import { IRootState } from 'app/shared/reducers';
import ErrorBoundary from 'app/shared/error/error-boundary';
import SidebarMenuLeft from 'app/shared/layout/menu/sidebar-menu-left';
import { hasAnyAuthority } from './menu-private-route';

type OwnProps = RouteProps & {
  componentDisplayName?: any;
  hasAnyAuthorities?: string[];
}

type CompositePrivateRouteProps = OwnProps & StateProps;

const useQuery = (location: Location) => (new URLSearchParams(location.search));

export const CompositePrivateRouteComponent = ({
  componentDisplayName,
  component: Component,
  isAuthenticated,
  isSessionHasBeenFetched,
  isAuthorized,
  hasAnyAuthorities = [],
  location,
  expand,
  ...rest
}: CompositePrivateRouteProps) => {

  if (!Component) throw new Error(`A component needs to be specified for private route for path ${(rest as any).path}`);

  const queryParams = useQuery(location);
  const isPopout = parseInt(queryParams.get('popout'), 10) === 1;

  const checkAuthorities = props =>
    isAuthorized ? (
      isPopout ? (
        <ErrorBoundary>
          <Component {...props} popout={true}/>
        </ErrorBoundary>
      ) : (
        <ErrorBoundary>
          <div className={`${expand ? "" : "sidebar-left-mini "}wrap-container`}>
            {/* <SidebarMenuLeft componentDisplay={componentDisplayName}/> */}
            <Component {...props} />
          </div>
        </ErrorBoundary>
      )
    ) : (
      <div className="insufficient-authority">
        <div className="alert alert-danger">
          <Translate contentKey="error.http.403">You are not authorized to access this page.</Translate>
        </div>
      </div>
    );

  const renderRedirect = props => {
    if (isAuthenticated) {
      if (!isSessionHasBeenFetched) {
        return <div/>;
      } else {
        return checkAuthorities(props);
      }
    }
    return isPopout ? (
      <a onClick={() => { window.close()}}>Close</a>
    ) : (
      <Redirect
        to={{
          pathname: '/account/login',
          search: props.location.search,
          state: { from: props.location }
        }}
      />
    )
  };

  return <Route {...rest} render={renderRedirect}/>;
}

CompositePrivateRouteComponent.defaultProps = {
  componentDisplayName: "",
}

const mapStateToProps = (
  { authentication: { isAuthenticated, account, isSessionHasBeenFetched },menuLeft }: IRootState,
  { hasAnyAuthorities = [] }: OwnProps
) => ({
  isAuthenticated,
  isAuthorized: hasAnyAuthority(account.authorities, hasAnyAuthorities),
  isSessionHasBeenFetched,
  expand: menuLeft.expand
});

type StateProps = ReturnType<typeof mapStateToProps>;

export const CompositePrivateRoute = connect(
  mapStateToProps,
  null,
  null,
  { pure: false }
)(CompositePrivateRouteComponent);

export default CompositePrivateRoute;
