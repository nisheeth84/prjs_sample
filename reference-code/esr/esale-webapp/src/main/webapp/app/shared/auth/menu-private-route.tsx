import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import ErrorBoundary from 'app/shared/error/error-boundary';
import SidebarMenuLeft from '../layout/menu/sidebar-menu-left';

interface IOwnProps extends RouteProps {
  hasAnyAuthorities?: string[];
}

export interface IMenuPrivateRouteProps extends IOwnProps, StateProps {
  componentDisplayName?: any;
}

export const MenuPrivateRouteComponent = ({
  componentDisplayName,
  component: Component,
  isAuthenticated,
  isSessionHasBeenFetched,
  isAuthorized,
  hasAnyAuthorities = [],
  expand,
  ...rest
}: IMenuPrivateRouteProps) => {

  if (!Component) throw new Error(`A component needs to be specified for private route for path ${(rest as any).path}`);

  const checkAuthorities = props =>
    isAuthorized ? (
      <ErrorBoundary>
        <div className={`${expand ? "" : "sidebar-left-mini "}wrap-container`}>
          <Component {...props} popout={true} popoutParams = {props.match.params} />
        </div>
      </ErrorBoundary>
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
    return <Redirect
      to={{
        pathname: '/account/login',
        search: props.location.search,
        state: { from: props.location }
      }}
    />
  };

  return <Route {...rest} render={renderRedirect} />;

  // return (
  //   <div className="wrap-container">
  //     <SidebarMenuLeft componentDisplay={componentDisplay}></SidebarMenuLeft>
  //     <Route {...rest} render={renderRedirect} />
  //   </div>
  // );
};

export const hasAnyAuthority = (authorities: string[], hasAnyAuthorities: string[]) => {
  if (authorities && authorities.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true;
    }
    return hasAnyAuthorities.some(auth => authorities.includes(auth));
  }
  return false;
};

const mapStateToProps = (
  { authentication: { isAuthenticated, account, isSessionHasBeenFetched }, menuLeft }: IRootState,
  { hasAnyAuthorities = [] }: IOwnProps
) => ({
  isAuthenticated,
  isAuthorized: hasAnyAuthority(account.authorities, hasAnyAuthorities),
  isSessionHasBeenFetched,
  expand: menuLeft.expand
});

MenuPrivateRouteComponent.defaultProps = {
  componentDisplayName: "",
}

type StateProps = ReturnType<typeof mapStateToProps>;

/**
 * A route wrapped in an authentication check so that routing happens only when you are authenticated.
 * Accepts same props as React router Route.
 * The route also checks for authorization if hasAnyAuthorities is specified.
 */
export const MenuPrivateRoute = connect<StateProps, undefined, IOwnProps>(
  mapStateToProps,
  null,
  null,
  { pure: false }
)(MenuPrivateRouteComponent);

export default MenuPrivateRoute;
