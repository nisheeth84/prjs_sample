import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import ErrorBoundary from 'app/shared/error/error-boundary';
interface IOwnProps extends RouteProps {
  hasAnyAuthorities?: string[];
}

export interface IPopupPrivateRouteProps extends IOwnProps, StateProps {}

export const PopupPrivateRouteComponent = ({
  component: Component,
  isAuthenticated,
  isSessionHasBeenFetched,
  isAuthorized,
  hasAnyAuthorities = [],
  ...rest
}: IPopupPrivateRouteProps) => {
  const checkAuthorities = props =>
    isAuthorized ? (
      <ErrorBoundary>
        <Component {...props} popout={true} popoutParams = {props.match.params} />
      </ErrorBoundary>
    ) : (
      <div className="insufficient-authority">
        <div className="alert alert-danger">
          <Translate contentKey="error.http.403">You are not authorized to access this page.</Translate>
        </div>
      </div>
    );

  const renderRedirect = props => {
    if (!isSessionHasBeenFetched) {
      return <div />;
    } else {
      return isAuthenticated ? (
        checkAuthorities(props)
      ) : (
        <Redirect
          to={{
            pathname: '/account/login',
            state: { from: props.location, search: props.location.search }
          }}
        />
      );
    }
  };

  if (!Component) throw new Error(`A component needs to be specified for private route for path ${(rest as any).path}`);

  return <Route {...rest} render={renderRedirect} />;
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
  { authentication: { isAuthenticated, account, isSessionHasBeenFetched } }: IRootState,
  { hasAnyAuthorities = [] }: IOwnProps
) => ({
  isAuthenticated,
  isAuthorized: hasAnyAuthority(account.authorities, hasAnyAuthorities),
  isSessionHasBeenFetched
});

type StateProps = ReturnType<typeof mapStateToProps>;

/**
 * A route wrapped in an authentication check so that routing happens only when you are authenticated.
 * Accepts same props as React router Route.
 * The route also checks for authorization if hasAnyAuthorities is specified.
 */
export const PopupPrivateRoute = connect<StateProps, undefined, IOwnProps>(
  mapStateToProps,
  null,
  null,
  { pure: false }
)(PopupPrivateRouteComponent);

export default PopupPrivateRoute;
