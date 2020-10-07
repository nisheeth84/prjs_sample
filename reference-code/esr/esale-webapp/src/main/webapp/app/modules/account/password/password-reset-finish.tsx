import 'app/modules/account/login/login.scss';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { translate, getUrlParameter } from 'react-jhipster';
import { RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { resetCheck } from './password-reset.reducer';
import { isBoolean } from 'lodash';

export interface IPasswordResetFinishProps extends DispatchProps, StateProps, RouteComponentProps<{key: string}> {
  isCheckKeySuccess: false;
  isCheckKeyFailure: false;
  isKeyExpried: false;
  errorMessage: null;
}

export const PasswordResetFinishPage = (props: IPasswordResetFinishProps) => {
  const [flgSuccess, setFlgSuccess] = useState(false);

  useEffect(() => {
    setFlgSuccess(props.success.success);
    return () => props.resetCheck();
  }, []);

  const routeChange = () => {
    props.history.push('/account/login' + window.location.search);
  };

  const getResetForm = () => {
    if (!flgSuccess) {
      return (
        <div className="import-email v2">
          <p>{translate('account.reset.finish.info1')}</p>
          <p>{translate('account.reset.finish.info2')}</p>
        </div>
      );
    } else {
      return <div className="import-email">{translate('account.password.change-finish.info')}</div>;
    }
  };

  return (
    <div className="wrap-login reset">
      <div className="reset-password">
        <img className="logo" src="/content/images/logo.svg" />
        <p className="title">{translate('account.reset.title')}</p>
        {getResetForm()}
        <button className="btn-login button-blue" type="button" onClick={routeChange}>
          {translate('account.reset.finish.button-back-login')}
        </button>
      </div>
    </div>
  );
};
const mapStateToProps = ({ passwordReset, passwordResetCode }: IRootState) => ({
  isCheckKeySuccess: passwordReset.isCheckKeySuccess,
  isCheckKeyFailure: passwordReset.isCheckKeyFailure,
  isKeyExpried: passwordReset.isKeyExpried,
  errorMessage: passwordReset.errorMessage,
  success: passwordResetCode.success
});

const mapDispatchToProps = { resetCheck };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect<any, any, {}>(
  mapStateToProps,
  mapDispatchToProps
)(PasswordResetFinishPage);
