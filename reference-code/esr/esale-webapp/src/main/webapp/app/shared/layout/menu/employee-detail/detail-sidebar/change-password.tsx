import React, { useEffect, useState } from 'react';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { handleChanePassword, changeFormData } from '../employee-detail-setting.reducer';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';
import _ from 'lodash';


export interface IChangePassWord extends StateProps, DispatchProps {
  switchMenu
}

export const ChangePassWord = (props: IChangePassWord) => {
  const [msgError, setMsgError] = useState("");
  const [errorItem, setErrorItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [dataChange, setDataChange] = useState({
    "oldPassword": "",
    "newPassword": "",
    "comfirmPassword": ""
  })
  const [isSubmitReady, setIsSubmitReady] = useState(false);

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

  /**
   * Set toast message at bottom screen
   * @param message
   * @param type
   */
  const displayToastMessage = (message: string, type: MessageType) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { message, type };
    setToastMessage(objParams);
    setTimeout(() => {
      setToastMessage(null);
      props.switchMenu(0);
    }, TIMEOUT_TOAST_MESSAGE);
  };

  const renderToastMessage = () => {
    if (toastMessage === null) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={toastMessage.type}
        message={toastMessage.message}
        className="message-area-bottom position-absolute"
      />
    )
  }

  const renderMessage = () => {
    if (!msgError || msgError.length <= 0) {
      return <></>;
    }
    return (
      <>
        <div className="col-6 mt-5">
          <div className="form-group font-size-12">
            <BoxMessage
              messageType={MessageType.Error}
              message={msgError}
            />
          </div>
        </div>
        <div className="col-6">
        </div>
      </>
    )
  }

  useEffect(() => {
    if (props.successMessage) {
      setIsSubmitReady(true);
      displayToastMessage(translateMsg('messages.' + props.successMessage), MessageType.Success);
    } else {
      setToastMessage(null);
    }
  }, [props.successMessage]);

  useEffect(() => {
    if (dataChange.oldPassword && props.errorMessage && props.errorMessage.errorItems && props.errorMessage.errorItems.length > 0) {
      setErrorItem(props.errorMessage.errorItems[0].item);
      const errorCode = props.errorMessage.errorItems[0].errorCode;
      if (errorCode === 'ERR_LOG_0009') {
        setErrorItem(null);
      }
      if (errorCode === 'ERR_COM_0038') {
        setMsgError(translateMsg('messages.' + errorCode, 8, 32));
      } else {
        setMsgError(translateMsg('messages.' + errorCode));
      }
      setIsSubmitReady(true);
    }
  }, [props.errorMessage]);

  useEffect(() => {
    props.changeFormData(dataChange.oldPassword !== '' || dataChange.comfirmPassword !== '' || dataChange.newPassword !== '');
  }, [dataChange]);

  const onChangePassword = (e, keyMap) => {
    let readyCheck = false;
    if (keyMap === 'comfirmPassword') {
      readyCheck = !(dataChange.oldPassword === '' || dataChange.newPassword === '' || e.target.value === '' || dataChange.newPassword !== e.target.value);
      setDataChange({ ...dataChange, comfirmPassword: e.target.value });
    } else if (keyMap === 'newPassword') {
      readyCheck = !(dataChange.oldPassword === '' || e.target.value === '' || dataChange.comfirmPassword === '' || e.target.value !== dataChange.comfirmPassword);
      setDataChange({ ...dataChange, newPassword: e.target.value });
    } else if (keyMap === 'oldPassword') {
      readyCheck = !(e.target.value === '' || dataChange.newPassword === '' || dataChange.comfirmPassword === '' || dataChange.newPassword !== dataChange.comfirmPassword);
      setDataChange({ ...dataChange, oldPassword: e.target.value });
    }
    setIsSubmitReady(readyCheck);
  };

  const changePassWord = () => {
    if (isSubmitReady) {
      setIsSubmitReady(false);
      props.handleChanePassword(dataChange)
    }
  };

  return (
    <>
      <div className="modal-body style-3">
        <div className="popup-content  style-3">
          <div className="row">
            <div className="col-4 offset-4 mt-4">
              <div className="error-alert">
                <div className="title">
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16">
                    <g id="Group_136" data-name="Group 136" transform="translate(0)">
                      <g id="Group_135" data-name="Group 135">
                        <path id="Path_52" data-name="Path 52" d="M4756,336a8,8,0,1,0,8,8A8,8,0,0,0,4756,336Zm0,14.5a6.5,6.5,0,1,1,6.5-6.5A6.508,6.508,0,0,1,4756,350.5Z" transform="translate(-4748 -336)" fill="#333" />
                        <rect id="Rectangle_283" data-name="Rectangle 283" width={2} height={5} transform="translate(7.03 4.227)" fill="#333" />
                        <circle id="Ellipse_2" data-name="Ellipse 2" cx={1} cy={1} r={1} transform="translate(7.03 10.227)" fill="#333" />
                      </g>
                    </g>
                  </svg>
                  <div>
                    <p>{translate('account.password.messages.info1')}</p>
                  </div>
                </div>
                <div className="contents">
                  <p>{translate('account.password.messages.info2')}</p>
                  <ul>
                    <li>・{translate('account.password.messages.suggest-info1')}</li>
                    <li>・{translate('account.password.messages.suggest-info2')}</li>
                    <li>・{translate('account.password.messages.suggest-info3')}</li>
                    <li>・{translate('account.password.messages.suggest-info4')}</li>
                    <li>・{translate('account.password.messages.suggest-info5')}</li>
                  </ul>
                </div>
              </div>
            </div>
            {!errorItem && renderMessage()}
            <div className="col-6">
              <div className="form-group common break-line">
                <label>{translate("account.password.form.current-password")} <a className="label-red">{translate("account.login.form.label.required")}</a></label>
                <input tabIndex={1} autoComplete="false" className={`input-normal ${errorItem === 'oldPassword' ? 'error' : ''}`}
                  name="oldPassword"
                  placeholder={translate('account.password.form.current-password-placeholder')}
                  type="password"
                  onChange={e => onChangePassword(e, 'oldPassword')}
                  autoFocus
                />
                {errorItem === 'oldPassword' && <span className="messenger-error">{msgError}</span>}
              </div>
            </div>
            <div className="col-6">
            </div>
            <div className="col-6">
              <div className="form-group common">
                <label>{translate("account.password.form.new-password")} <a className="label-red">{translate("account.login.form.label.required")}</a></label>
                <input tabIndex={2} autoComplete="false" className={`input-normal ${errorItem === 'newPassword' ? 'error' : ''}`}
                  type="password"
                  name="newPassword"
                  onChange={e => onChangePassword(e, 'newPassword')}
                  placeholder={translate("account.password.form.new-password-placeholder")}
                />
                {errorItem === 'newPassword' && <span className="messenger-error">{msgError}</span>}
              </div>
            </div>
            <div className="col-6">
              <div className="form-group common">
                <label>{translate("account.password.form.new-password-confirm")} <a className="label-red">{translate("account.login.form.label.required")}</a></label>
                <input tabIndex={3} autoComplete="false" className={`input-normal ${errorItem === 'comfirmPassword' ? 'error' : ''}`}
                  type="password"
                  name="comfirmPassword"
                  onChange={e => onChangePassword(e, 'comfirmPassword')}
                  placeholder={translate("account.password.form.new-password-confirm-placeholder")}
                />
                {errorItem === 'comfirmPassword' && <span className="messenger-error">{msgError}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="user-popup-form-bottom popup-membership-footer">
        <a tabIndex={4} className={`button-blue ${isSubmitReady ? '' : 'disable'}`} onClick={changePassWord}>{translate('account.password.form.button-update')}</a>
      </div>
      {renderToastMessage()}
    </>
  )
};

const mapStateToProps = ({ employeeDetailAction }: IRootState) => ({
  errorMessage: employeeDetailAction.errorMessage,
  successMessage: employeeDetailAction.successMessage
});

const mapDispatchToProps = {
  handleChanePassword,
  changeFormData
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePassWord);