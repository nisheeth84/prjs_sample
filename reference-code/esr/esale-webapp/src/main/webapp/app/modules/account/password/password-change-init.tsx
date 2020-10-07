import { AUTH_TOKEN_KEY, INPUT_TYPE } from 'app/config/constants';
import 'app/modules/account/login/login.scss';
import ErrorMessageApi from 'app/shared/error/error-message-api';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { IRootState } from 'app/shared/reducers';
import { AvField, AvForm } from 'availity-reactstrap-validation';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Button } from 'reactstrap';
import { VALIDATION_TYPE } from '../constants';
import { changePasswordFirstAccess, changePasswordNormal, resetChange } from './password-change.reducer';
import { resetCheck } from './password-reset.reducer';

export interface IUserPasswordProps extends StateProps, DispatchProps, RouteComponentProps {
  isLoading: false;
  errorMessage: null;
  isUpdateSuccess: false;
  isUpdateFailure: false;
  resetErrorMessage: [];
  isResetPasswordSuccess: false;
  isResetPasswordFailure: false;
}

export const PasswordChangeInitPage = (props: IUserPasswordProps) => {
  const [oldPassword, setOldPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstFlg, setFirstFlg] = useState(false);
  const [, setFromMail] = useState(false);
  const [isPasswordExpired, setIsPasswordExpired] = useState(false);
  const [, setPassword] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [newValue, setNewValue] = useState({ newPass: null, confirmPass: null });

  useEffect(() => {
    const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
    if (jwt) {
      const jwtData = jwtDecode(jwt);
      setUsername(jwtData.email);
    }
    if (props.location.state && props.location.state.firstFlg) {
      setFirstFlg(props.location.state.firstFlg);
    }
    if (props.location.state && props.location.state.username) {
      setUsername(props.location.state.username);
    }
    if (props.location.state && props.location.state.oldPassword) {
      setOldPassword(props.location.state.oldPassword);
    }
    if (props.location.state && props.location.state.fromMail) {
      setFromMail(props.location.state.fromMail);
    }
    if (props.location.state && props.location.state.isPasswordExpired) {
      setIsPasswordExpired(props.location.state.isPasswordExpired);
    }
    return () => {
      props.resetChange();
      props.resetCheck();
    };
  }, []);

  const handleValidSubmit = (event, values) => {
    event.preventDefault();
    setIsSubmit(true);
    if ((values.currentPassword !== null || oldPassword) && values.newPassword !== null && values.confirmPassword !== null) {
      if (firstFlg && oldPassword.length > 0) {
        // change password on first access
        if (values.newPassword !== null && values.newPassword !== "") {
          props.changePasswordFirstAccess(username, oldPassword, values.newPassword);
        }
      } else if (values.currentPassword) {
        // change password || remaining day <= 0
        props.changePasswordNormal(username, values.currentPassword, values.newPassword);
      } else {
        // remaining day <= 0
        props.changePasswordNormal(username, values.currentPassword, values.newPassword);
      }
      setIsSubmit(false);
      setNewValue({ newPass: null, confirmPass: null });
    }
  };

  const updatePassword = event => setPassword(event.target.value);

  const hideOldPassword = firstFlg && oldPassword.length > 0;

  const {
    isUpdateSuccess: updateSuccess,
    isUpdateFailure: updateFailure,
    isResetPasswordSuccess: resetPasswordSuccess,
    isResetPasswordFailure: resetPasswordFailure
  } = props;

  if (updateSuccess || resetPasswordSuccess) {
    return <Redirect to={{ pathname: '/account/password/finish', search: window.location.search }} />;
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

  /**
   * Get validation arguments for input
   * @param required
   * @param minLength
   * @param maxLength
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
    if (props.errorMsg === 'ERR_LOG_0001') {
      return null;
    }
    if (props.errorMsg === 'ERR_COM_0038') {
      return translateMsg('messages.' + props.errorMsg, 8, 32);
    } else {
      return translate('messages.' + props.errorMsg);
    }
  }

  return (
    <div className="wrap-login reset">
      <div className="reset-password">
        <img className="logo" src="/content/images/logo.svg" />
        <p className="title">{translate('account.password.title')}</p>
        <div className="import-email">
          {/* {!fromMail && <p>{translate('account.password.reset.messages.info')}</p>} */}
          <p>{translate('account.password.messages.info1')}</p>
          <p>{translate('account.password.messages.info2')}</p>
          <div className="check-list">
            {translate('account.password.messages.suggest-info1')}
            <ul>
              <li>{translate('account.password.messages.suggest-info2')}</li>
              <li>{translate('account.password.messages.suggest-info3')}</li>
              <li>{translate('account.password.messages.suggest-info4')}</li>
              <li>{translate('account.password.messages.suggest-info5')}</li>
            </ul>
          </div>
        </div>
        <div className="form-reset">
          {isPasswordExpired && (
            <div className="form-group error warning-message">
              <span className="icon">
                <img src="../../../content/images/ic-note.svg" />
              </span>
              {translate('account.password.messages.expired-message')}
            </div>
          )}
          {updateFailure && (
            <div>
              {props.errorMsg ? (
                <div className="form-group font-size-12">
                  <BoxMessage message={renderMessage()} messageType={MessageType.Error} styleClassMessage="block-feedback block-feedback-pink form-group error pink"/>
                </div>
              ) : (
                <ErrorMessageApi errorMessage={props.errorMessage} />
              )}
            </div>
          )}
          {resetPasswordFailure && (
            <div>
              <ErrorMessageApi errorMessage={props.resetErrorMessage} />
            </div>
          )}
          <AvForm id="password-form" onValidSubmit={newValue.newPass !== newValue.confirmPass ? null : handleValidSubmit}>
            {!hideOldPassword && (
              <div className="form-group">
                <label htmlFor="currentPassword">
                  {translate('account.password.form.current-password')}
                  <span className="label-red ml-3">{translate('account.login.form.label.required')}</span>
                </label>
                <AvField
                  name="currentPassword"
                  className="form-control"
                  placeholder={translate('account.password.form.current-password-placeholder')}
                  type="password"
                  validate={getValidationArgs(VALIDATION_TYPE.REQUIRED)}
                  autoFocus
                />
              </div>
            )}
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
                autoFocus={hideOldPassword}
              />
            </div>
            <div className="form-group">
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
              {translate('account.password.form.button-update')}
            </Button>
          </AvForm>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ passwordChange, passwordReset }: IRootState) => ({
  isUpdateSuccess: passwordChange.isUpdateSuccess,
  isUpdateFailure: passwordChange.isUpdateFailure,
  isLoading: passwordChange.isLoading,
  errorMessage: passwordChange.errorMessage,
  errorMsg: passwordChange.errorMsg,
  isResetPasswordSuccess: passwordReset.isResetPasswordSuccess,
  isKeyExpried: passwordReset.isKeyExpried,
  isResetPasswordFailure: passwordReset.isResetPasswordFailure,
  resetErrorMessage: passwordReset.errorMessage
});

const mapDispatchToProps = {
  changePasswordFirstAccess,
  changePasswordNormal,
  resetChange,
  resetCheck
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect<any, any, {}>(
  mapStateToProps,
  mapDispatchToProps
)(PasswordChangeInitPage);
