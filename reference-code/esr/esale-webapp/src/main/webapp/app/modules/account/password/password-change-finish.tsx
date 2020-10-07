import 'app/modules/account/login/login.scss';
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { logout } from 'app/shared/reducers/authentication';
import { translate } from 'react-jhipster';

export const PasswordChangeFinishPage = (props: any) => {

  const routeChange = (event) => {
    props.history.push('/account/logout');
    event.preventDefault();
  };

  return (
    <div className="wrap-login reset">
      <div className="reset-password">
        <img className="logo" src="/content/images/logo.svg" />
        <p className="title">{translate('account.password.title')}</p>
        <div className="import-email">
          {translate('account.password.change-finish.info')}
        </div>
        <button className="btn-login button-blue" type="button" onClick={routeChange}>{translate('account.password.change-finish.button-back-login')}</button>
      </div>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  isLogoutSuccess: storeState.authentication.isLogoutSuccess,
});

const mapDispatchToProps = { logout };


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordChangeFinishPage);
