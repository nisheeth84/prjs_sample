import 'app/modules/account/login/login.scss';
import { IRootState } from 'app/shared/reducers';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import React, { useEffect, useState } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'reactstrap';
import { handlePasswordResetInit, resetCheck } from './password-reset.reducer';
import { VALIDATION_TYPE } from '../constants';

export interface IPasswordResetInitProps extends StateProps, DispatchProps, RouteComponentProps { }

export const PasswordResetInit = (props: IPasswordResetInitProps) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [resetPasswordFailure, setResetPasswordFailure] = useState(false);

  const tenant = window.location.pathname.split('/')[1];

  useEffect(() => {
    return () => {
      props.resetCheck();
    };
  }, []);

  useEffect(() => {
    setResetPasswordFailure(props.resetPasswordFailure);
  }, [props.resetPasswordFailure]);

  const handleValidSubmit = (event, values) => {
    setIsSubmit(true);
    setResetPasswordFailure(false);
    if (values.username !== null && values.username !== "") {
      props.handlePasswordResetInit(values.username.trim());
      setIsSubmit(false);
      event.preventDefault();
    }
  };

  const routeChange = event => {
    props.history.push('/account/login' + window.location.search);
    event.preventDefault();
  };

  /**
   * Get validation arguments for input
   * @param required
   * @param minLength
   * @param maxLength
   */
  const getValidationArgs = (required?, maxLength?) => {
    let objValidation = null;
    if (isSubmit) {
      if (required === VALIDATION_TYPE.REQUIRED) {
        objValidation = { ...objValidation, required: { value: true, errorMessage: translate('messages.ERR_COM_0013') } };
      }
      if (maxLength === VALIDATION_TYPE.MAX_LENGTH) {
        objValidation = { ...objValidation, maxLength: { value: 50, errorMessage: translate('messages.ERR_COM_0025', { 0: 50 }) } };
      }
    }
    return objValidation;
  };

  const { resetPasswordSuccess, errorMessage } = props;
  if (resetPasswordSuccess) {
    return (
      <div className="wrap-login reset">
        <div className="reset-password">
          <img className="logo" src="/content/images/logo.svg" />
          <p className="title">{translate('account.reset.title')}</p>
          <div className="import-email">
            <p>{translate('account.reset.init.info1')}</p>
            <p>{translate('account.reset.init.info2')}</p>
            <p>{translate('account.reset.init.info3')}</p>
          </div>
          <button className="btn-login button-blue" type="button" onClick={routeChange}>
            {translate('account.reset.init.form.button-back')}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="wrap-login reset">
      <div className="reset-password">
        <img className="logo" src="/content/images/logo.svg" />
        <p className="title">{translate('account.reset.title')}</p>
        <div className="import-email">
          <p>{translate('account.reset.init.messages.info')}</p>
        </div>
        <div className="form-reset">
          {resetPasswordFailure && (
            <div className="form-group error">
              <span className="icon">
                <img src="/content/images/ic-dont.svg" alt="" title="" />
              </span>
              {errorMessage === 'ERR_COM_0035' ? translate('messages.' + errorMessage, { 0: tenant }) : translate('messages.' + errorMessage)}
            </div>
          )}
          <AvForm onValidSubmit={handleValidSubmit}>
            <div className="form-group">
              <label htmlFor="username">
                {translate('account.reset.init.form.username')}
                <span className="label-red ml-3">{translate('account.login.form.label.required')}</span>
              </label>
              <AvField
                name="username"
                className="form-control"
                placeholder={translate('account.reset.init.form.username-placeholder')}
                validate={getValidationArgs(VALIDATION_TYPE.REQUIRED, VALIDATION_TYPE.MAX_LENGTH)}
                autoFocus
              />
            </div>
            <Button type="submit" className="button-login button-blue">
              {translate('account.reset.init.form.button-submit')}
            </Button>
          </AvForm>
          <button className="button-login v2" onClick={routeChange}>
            {translate('account.reset.init.form.button-back')}
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ passwordReset }: IRootState) => ({
  resetPasswordSuccess: passwordReset.isResetPasswordSuccess,
  resetPasswordFailure: passwordReset.isResetPasswordFailure,
  errorMessage: passwordReset.errorMessage
});

const mapDispatchToProps = { handlePasswordResetInit, resetCheck };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordResetInit);
