import { IRootState } from 'app/shared/reducers';
import { logout } from 'app/shared/reducers/authentication';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Storage } from 'react-jhipster';
import { SIGNOUT_SAML_URL } from 'app/config/constants';

export interface ILogoutProps extends StateProps, DispatchProps {
  idToken: string;
  isLoading: boolean;
  isLogoutSuccess: boolean;
}

export class Logout extends React.Component<ILogoutProps> {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    const isLogoutSuccess = this.props.isLogoutSuccess;
    if (!this.props.isLoading && isLogoutSuccess) {
      const samlUrl = Storage.session.get(SIGNOUT_SAML_URL);
      if (samlUrl) {
        Storage.session.remove(SIGNOUT_SAML_URL);
        window.location.replace(samlUrl);
      }
      else {
        if (!this.props.isLoading && this.props.isLogoutSuccess) {
          const site = Storage.session.get('site');
          const tenant = window.location.pathname.split('/')[1];
          window.location.href = `${tenant}/${site ? '?site=' + site : ''}`;
        }
      }
    }

    return (
      <div>
        <div className="p-5">
          <h4>Logout...</h4>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  isLogoutSuccess: storeState.authentication.isLogoutSuccess,
  idToken: storeState.authentication.idToken,
  isLoading: storeState.authentication.isLoading,
});

const mapDispatchToProps = { logout };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout);
