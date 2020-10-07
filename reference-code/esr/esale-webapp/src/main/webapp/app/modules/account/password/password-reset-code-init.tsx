import { INPUT_TYPE } from 'app/config/constants';
import 'app/modules/account/login/login.scss';
import ErrorMessageApi from 'app/shared/error/error-message-api';
import { IRootState } from 'app/shared/reducers';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import React, { useEffect, useState } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Button } from 'reactstrap';
import { VALIDATION_TYPE } from '../constants';
import { handlePasswordResetInit, resetCheck } from './password-reset-code.reducer';
import {getParam} from 'app/shared/reducers/authentication';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';

export interface IPasswordResetInitProps extends StateProps, DispatchProps, RouteComponentProps {
  isLoading: false;
  errorMessage: null;
  isUpdateSuccess: false;
  isUpdateFailure: false;
  resetErrorMessage: any;
  isResetPasswordSuccess: false;
  isResetPasswordFailure: false;
}

export const PasswordResetInit = (props: IPasswordResetInitProps) => {
  const [, setPassword] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const resetCode = getParam(window.location.search, 'resetCode');
  const [newValue, setNewValue] = useState({ newPass: null, confirmPass: null });

  useEffect(() => {
    return () => {
      props.resetCheck();
    };
  }, []);

  const isMessageCode = (msg) => {
    const codeRegex = /([_\-0-9a-z]*[.]){1,}[_\-0-9a-zA-Z]{1,}$/g;
    if (codeRegex.test(msg)) {
      return true;
    }
    return false;
  }

  const translateMsg = (msg, pram1?, pram2?) => {
    if (!msg || msg.length <= 0) {
      return "";
    }
    if (isMessageCode(msg)) {
      return translate(msg, { 0: pram1, 1: pram2 });
    } else {
      return msg;
    }
  }

  const renderMessage = () => {
    if (props.resetErrorMessage === 'ERR_COM_0038') {
      return translateMsg('messages.' + props.resetErrorMessage, 8, 32);
    } else {
      return translate('messages.' + props.resetErrorMessage);
    }
  }

  /**
   * Handle text change
   * @param e
   * @param key
   */
  const onTextChange = (e, key) => {
    if (e.target.value.length > 0) {
      if (key === INPUT_TYPE.NEW_PASS) {
        setNewValue({ ...newValue, newPass: e.target.value });
      }
      if (key === INPUT_TYPE.CONFIRM_PASS) {
        setNewValue({ ...newValue, confirmPass: e.target.value });
      }
    } else {
      if (key === INPUT_TYPE.NEW_PASS) {
        setNewValue({ ...newValue, newPass: '' });
      }
      if (key === INPUT_TYPE.CONFIRM_PASS) {
        setNewValue({ ...newValue, confirmPass: '' });
      }
    }
  };
  

  const handleValidSubmit = (event, values) => {
    setIsSubmit(true);
    if (values.username !== null && values.username !== "" && values.newPassword !== null && values.newPassword !== "") {
      props.handlePasswordResetInit(values.username.trim(), resetCode, values.newPassword);
      setIsSubmit(false);
      event.preventDefault();
    }
  };

  const updatePassword = event => setPassword(event.target.value);

  const {
    isUpdateFailure: updateFailure,
    isResetPasswordFailure
  } = props;

  if (!isResetPasswordFailure && props.success) {
    return <Redirect to={{ pathname: '/account/reset/finish', search: window.location.search}} />;
  }

  /**
   * Get validation arguments for input
   * @param required 
   */
  const getValidationArgs = (required?) => {
    let objValidation = null;
    if (isSubmit) {
      if (required === VALIDATION_TYPE.REQUIRED) {
        objValidation = { ...objValidation, required: { value: true, errorMessage: translate('messages.ERR_COM_0013') } };
      }
    }
    return objValidation;
  };

  return (
    <div className="wrap-login reset">
      <div className="reset-password">
        <img className="logo" src="/content/images/logo.svg" />
        <p className="title">{translate('account.reset.title')}</p>
        <div className="import-email">
          <p>{translate('account.reset.init.messages.info')}</p>
        </div>
        <div className="form-reset">
          {updateFailure && (
            <div>
              <ErrorMessageApi errorMessage={props.errorMessage} />
            </div>
          )}
          {props.isResetPasswordFailure && (
            <div>
              <BoxMessage
                messageType={MessageType.Error}
                message={renderMessage()}
                styleClassMessage="block-feedback block-feedback-pink form-group error pink"
              />
            </div>
          )}
          <AvForm onValidSubmit={newValue.newPass !== newValue.confirmPass ? null : handleValidSubmit}>
            <div className="form-group">
              <label htmlFor="username">
                {translate('account.reset.init.form.username')}
                <span className="label-red ml-3">{translate('account.login.form.label.required')}</span>
              </label>
              <AvField
                name="username"
                className="form-control"
                placeholder={translate('account.reset.init.form.username-placeholder')}
                validate={getValidationArgs(VALIDATION_TYPE.REQUIRED)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">
                {translate('account.password.form.new-password')}
                <span className="label-red ml-3">{translate('account.login.form.label.required')}</span>
              </label>
              <AvField
                name="newPassword"
                className="form-control"
                placeholder={translate('account.password.form.new-password-placeholder')}
                type="password"
                validate={getValidationArgs(VALIDATION_TYPE.REQUIRED)}
                onChange={e => {
                  updatePassword(e);
                  onTextChange(e, INPUT_TYPE.NEW_PASS);
                }}
              />
              <label htmlFor="confirmPassword">
                {translate('account.password.form.new-password-confirm')}
                <span className="label-red ml-3">{translate('account.login.form.label.required')}</span>
              </label>
              <AvField
                name="confirmPassword"
                className="form-control"
                placeholder={translate('account.password.form.new-password-confirm-placeholder')}
                type="password"
                validate={getValidationArgs(VALIDATION_TYPE.REQUIRED)}
                onChange={e => onTextChange(e, INPUT_TYPE.CONFIRM_PASS)}
              />
            </div>
            <Button type="submit" className={`button-login button-blue ${newValue.newPass !== newValue.confirmPass ? 'disable' : ''}`}>
              {translate('account.reset.init.form.button-submit')}
            </Button>
          </AvForm>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ passwordChange, passwordReset, passwordResetCode }: IRootState) => ({
  isUpdateSuccess: passwordChange.isUpdateSuccess,
  isUpdateFailure: passwordChange.isUpdateFailure,
  isLoading: passwordChange.isLoading,
  errorMessage: passwordResetCode.errorMessage,
  isResetPasswordSuccess: passwordResetCode.isResetPasswordSuccess,
  isKeyExpried: passwordReset.isKeyExpried,
  isResetPasswordFailure: passwordResetCode.isResetPasswordFailure,
  resetErrorMessage: passwordResetCode.errorMessage,
  success: passwordResetCode.success
});

const mapDispatchToProps = { handlePasswordResetInit, resetCheck };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect<any, any, {}>(
  mapStateToProps,
  mapDispatchToProps
)(PasswordResetInit);
