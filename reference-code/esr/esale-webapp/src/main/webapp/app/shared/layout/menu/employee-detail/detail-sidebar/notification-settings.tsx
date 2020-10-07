import React, { useEffect, useState } from 'react';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { getNotificationSetting, handleUpdateNotificationDetailSetting, changeFormData } from '../employee-detail-setting.reducer';
import _ from 'lodash';
import { AUTH_TOKEN_KEY } from 'app/config/constants';
import jwtDecode from 'jwt-decode';
import { Storage } from 'react-jhipster';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';
import TimePicker from '../../../dynamic-form/control-field/component/time-picker';
import { timeUtcToTz, timeTzToUtc } from 'app/shared/util/date-utils';

export interface INotificationSettings extends StateProps, DispatchProps {
  switchMenu
}
const NotificationSettings = (props: INotificationSettings) => {
  const [msgError, setMsgError] = useState("");
  const [errorItem, setErrorItem] = useState(null);
  const [errorItemEmails, setErrorItemEmails] = useState(null);
  const [msgErrorEmails, setMsgErrorEmails] = useState(null);
  const [errorNotificationTime, setErrorNotificationTime] = useState(null);
  const [msgErrorNotificationTime, setMsgErrorNotificationTime] = useState(null);
  const [errorNotify, setErrorNotify] = useState(null);
  const [msgErrorNotify, setMsgErrorNotify] = useState(null);
  const [errorNotifyDay, setErrorNotifyDay] = useState(null);
  const [msgErrorNotifyDay, setMsgErrorNotifyDay] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [notifyTime, setNotifyTime] = useState("");
  const [email, setEmail] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [emailInputDisable, setEmailInputDisable] = useState(false);
  const [isSubmitReady, setIsSubmitReady] = useState(false);
  const [dataNotifyChange, setDataNotifyChange] = useState(null);
  const [checkedItem11, setCheckedItem11] = useState(false);
  const [checkedItem12, setCheckedItem12] = useState(false);
  const [checkedItem13, setCheckedItem13] = useState(false);
  const [checkedItem14, setCheckedItem14] = useState(false);
  const [checkedItem61, setCheckedItem61] = useState(false);
  const [checkedItem71, setCheckedItem71] = useState(false);
  const [checkedItem111, setCheckedItem111] = useState(false);
  const [checkedItem112, setCheckedItem112] = useState(false);
  const [checkedItem91, setCheckedItem91] = useState(false);
  const [checkedItem92, setCheckedItem92] = useState(false);
  const [checkedItem93, setCheckedItem93] = useState(false);

  const resetError = () => {
    setMsgError("");
    setErrorItem(null);
    setErrorItemEmails(null);
    setMsgErrorEmails(null);
    setErrorNotificationTime(null);
    setMsgErrorNotificationTime(null);
    setErrorNotify(null);
    setMsgErrorNotify(null);
    setErrorNotifyDay(null);
    setMsgErrorNotifyDay(null);
  }
  const resetScreenState = () => {
    setCheckedItem11(false);
    setCheckedItem12(false);
    setCheckedItem13(false);
    setCheckedItem14(false);
    setCheckedItem61(false);
    setCheckedItem71(false);
    setCheckedItem111(false);
    setCheckedItem112(false);
    setCheckedItem91(false);
    setCheckedItem92(false);
    setCheckedItem93(false);
    setNotifyTime("");
    setEmail("");
    setEmailList([]);
    setIsSubmitReady(false);
    props.changeFormData(false);
  }
  useEffect(() => {
    const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
      if (jwt) {
        const jwtData = jwtDecode(jwt);
        props.getNotificationSetting(jwtData['custom:employee_id']);
      }
    resetError();
    resetScreenState();
  }, []);

  const checkedItem = (type, subType, isCheck) => {
    if (type) {
      switch (type) {
        case 1:
          if (subType === 1) {
            setCheckedItem11(isCheck);
          } else if (subType === 2) {
            setCheckedItem12(isCheck);
          } else if (subType === 3) {
            setCheckedItem13(isCheck);
          } else if (subType === 4) {
            setCheckedItem14(isCheck);
          }
          break;
        case 6:
          setCheckedItem61(isCheck);
          break;
        case 7:
          setCheckedItem71(isCheck);
          break;
        case 11:
          if (subType === 1) {
            setCheckedItem111(isCheck);
          } else if (subType === 2) {
            setCheckedItem112(isCheck);
          }
          break;
        case 9:
          if (subType === 1) {
            setCheckedItem91(isCheck);
          } else if (subType === 2) {
            setCheckedItem92(isCheck);
          } else if (subType === 3) {
            setCheckedItem93(isCheck);
          }
          break;
        default:
      }
    }
  }
  useEffect(() => {
    const _data = _.cloneDeep(props.dataGetnotification);
    if (_data) {
      _data.data.forEach((item) => item.notificationSubtypeName = undefined);
    }
    setDataNotifyChange(_data);
    if (_data && _data.email) {
      setEmailList(_data.email.split(';'));
    }
    if (_data && _data.data) {
      _data.data.forEach(item => {
        checkedItem(item.notificationType, item.notificationSubtype, true);
      });
    }
    if (_data && _data.notificationTime) {
      const _hh = Math.floor(_data.notificationTime / 60);
      const _ii = _data.notificationTime % 60;
      const _hhStr = _hh < 10 ? '0' + _hh : _hh;
      const _iiStr = _ii < 10 ? '0' + _ii : _ii;
      setNotifyTime(timeUtcToTz(_hhStr + ':' + _iiStr));
    }
  }, [props.dataGetnotification]);

  const convertNotifyToTime = (_time) => {
    if (_time) {
      const items = _time.split(':');
      if (/^[0-9]+$/.test(items[0]) && parseInt(items[0], 10) <= 23 && items[1] && /^[0-9]+$/.test(items[1]) && parseInt(items[1], 10) <= 59) {
        return parseInt(items[0], 10) * 60 + parseInt(items[1], 10);
      }
    }
    return undefined;
  }

  const checkChange = (_t?) => {
    const _time = _t !== undefined ? _t : notifyTime;
    let isChange = (props.dataGetnotification
      && ((!props.dataGetnotification['email'] && emailList.length > 0)
        || (props.dataGetnotification['email'] && props.dataGetnotification['email'] !== emailList.join(';'))
      ) || (props.dataGetnotification && props.dataGetnotification.notificationTime !== convertNotifyToTime(_time))
    )
      || ((!props.dataGetnotification || !props.dataGetnotification.data) && (!dataNotifyChange || !dataNotifyChange.data))
      || (props.dataGetnotification && props.dataGetnotification.data && dataNotifyChange && dataNotifyChange.data
        && props.dataGetnotification.data.length !== dataNotifyChange.data.length
      );

    if (!isChange && props.dataGetnotification && props.dataGetnotification.data && dataNotifyChange && dataNotifyChange.data) {
      props.dataGetnotification.data.forEach(item1 => {
        const hasItem = dataNotifyChange.data.filter((item2) => (item1.notificationType === item2.notificationType
          && item1.notificationSubtype === item2.notificationSubtype
          && item1.isNotification === item2.isNotification));
        if (hasItem.length > 0 && !isChange) {
          isChange = false;
        } else {
          isChange = true;
        }
      });
    }
    setIsSubmitReady(isChange);
    props.changeFormData(isChange);
  }

  const checkNotify = (type: number, subType: number) => {
    let _checked = false;
    if (dataNotifyChange && dataNotifyChange.data && dataNotifyChange.data.length > 0) {
      dataNotifyChange.data.forEach((item) => {
        if (item.isNotification && item.notificationType === type
          && item.notificationSubtype === subType) {
          _checked = true;
        }
      });
    }
    checkedItem(type, subType, _checked);
  }

  const changeNotify = (e, type: number, subType: number) => {
    let hasItem = false;
    if (dataNotifyChange && dataNotifyChange.data && dataNotifyChange.data.length > 0) {
      dataNotifyChange.data.map((item, idx) => {
        if (item.notificationType === type && item.notificationSubtype === subType) {
          item.isNotification = e.target.checked;
          hasItem = true;
        }
      });
    }
    if (!hasItem && e.target.checked) {
      if (!dataNotifyChange) {
        setDataNotifyChange({});
      }
      if (dataNotifyChange && !dataNotifyChange.data) {
        dataNotifyChange['data'] = [];
      }
      if (subType) {
        dataNotifyChange.data.push({
          "notificationType": type,
          "notificationSubtype": subType,
          "isNotification": e.target.checked
        });
      }
    }
    checkNotify(type, subType);
    checkChange();
  };

  const notifyTimeInput = (val) => {
    setNotifyTime(val);
    checkChange(val);
  }

  const emailInput = (e) => {
    setEmail(e.target.value);
  }

  const onRemoveEmail = (index: number) => {
    emailList.splice(index, 1);
    setEmailList(_.cloneDeep(emailList));
    checkChange();
    setEmailInputDisable(false);
  }

  const renderListEmail = () => {
    if (!emailList || emailList.length <= 0) {
      let jwt = Storage.local.get(AUTH_TOKEN_KEY);
      if (!jwt) {
        jwt = Storage.session.get(AUTH_TOKEN_KEY);
      }
      if (jwt) {
        const jwtData = jwtDecode(jwt);
        emailList.push(jwtData.email);
      }
    }
    return <>
      {
        emailList.map((item, idx) => {
          if (item) {
            return <>
              <p className="ml-2 text-small email-notification text-ellipsis" style={{width: 190}}>{item} 
                {idx > 0 && <a className="icon-small-primary icon-close-up-small size-16" onClick={e => onRemoveEmail(idx)}></a>}
              </p>
            </>
          }
        })
      }
    </>
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

  useEffect(() => {
    setEmailInputDisable(emailList.length >= 6);
  }, [emailList]);

  const addEmail = () => {
    if (emailList.length < 6) {
      if (email && /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(email)) {
        if (emailList.includes(email)) {
          setErrorItemEmails('emails');
          setMsgErrorEmails(translateMsg('messages.ERR_EMP_0002'));
        } else {
          emailList.push(email);
          setEmailList(_.cloneDeep(emailList));
          setEmail("");
          setErrorItemEmails(null);
          setMsgErrorEmails(null);
        }
        document.getElementById("emailId").focus();
      } else {
        setErrorItemEmails('emails');
        setMsgErrorEmails(translateMsg('messages.ERR_COM_0017'));
      }
      checkChange();
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
    resetError();
  }, [props.successMessage]);

  useEffect(() => {
    if (props.errorMessage && props.errorMessage.errorItems && props.errorMessage.errorItems.length > 0) {
      props.errorMessage.errorItems.forEach((error) => {
        if (error.errorCode === 'ERR_COM_0003') {
          setErrorItem(error.item);
          setMsgError(translateMsg('messages.' + error.errorCode));
        } else if (error.item === 'emails') {
          setErrorItemEmails(error.item);
          setMsgErrorEmails(translateMsg('messages.' + error.errorCode));
        } else if (error.item === 'notificationTime') {
          setErrorNotificationTime(error.item);
          setMsgErrorNotificationTime(translateMsg('messages.' + error.errorCode));
        } else if (error.item === 'dataSettingNotifications') {
          if (!dataNotifyChange || !dataNotifyChange.data || dataNotifyChange.data.length <= 0 || dataNotifyChange.data?.find(e => e.notificationType !== 9)) {
            setErrorNotify(error.item);
            setMsgErrorNotify(translateMsg('messages.' + error.errorCode));
          } else if (dataNotifyChange.data?.find(e => e.notificationType === 9)) {
            setErrorNotifyDay(error.item);
            setMsgErrorNotifyDay(translateMsg('messages.' + error.errorCode));
          }
        }
      });
      setIsSubmitReady(true);
    }
  }, [props.errorMessage]);

  const handleChangeNotify = () => {
    if (isSubmitReady) {
      const dataUpdate = {
        dataSettingNotifications: dataNotifyChange.data.filter((item) => [1, 6, 7, 11, 9].includes(item.notificationType)),
        notificationTime: notifyTime ? convertNotifyToTime(timeTzToUtc(notifyTime)) : undefined,
        emails: emailList
      };
      setIsSubmitReady(false);
      props.handleUpdateNotificationDetailSetting(dataUpdate);
    }
  };

  useEffect(()=>{
    console.log(props.acc);
  })

  return (
    <>
      <div className="modal-body style-3">
        <div className="popup-content  style-3">
          <div className="row">
            {!errorItem && renderMessage()}
            <div className="col-6">
              <div className="form-group common">
                <p className="black">{translate("employees.settings.notify.receive-settings")}</p>
                <div className="list-select-function">
                  <label className={`icon-check color-333 ${errorNotify ? 'error' : ''}`}><input autoFocus tabIndex={1} type="checkbox" checked={checkedItem11} onChange={e => changeNotify(e, 1, 1)} /><i /> {translate("employees.settings.notify.destination-posts-comments")}</label>
                  <label className={`icon-check color-333 ${errorNotify ? 'error' : ''}`}><input tabIndex={2} type="checkbox" checked={checkedItem12} onChange={e => changeNotify(e, 1, 2)} /><i /> {translate("employees.settings.notify.posts-article")}</label>
                  <label className={`icon-check color-333 ${errorNotify ? 'error' : ''}`}><input tabIndex={3} type="checkbox" checked={checkedItem13} onChange={e => changeNotify(e, 1, 3)} /><i /> {translate("employees.settings.notify.posts-comments")}</label>
                  <label className={`icon-check color-333 ${errorNotify ? 'error' : ''}`}><input tabIndex={4} type="checkbox" checked={checkedItem14} onChange={e => changeNotify(e, 1, 4)} /><i /> {translate("employees.settings.notify.posts-comments-of-comments")}</label>
                  <label className={`icon-check color-333 ${errorNotify ? 'error' : ''}`}><input tabIndex={5} type="checkbox" checked={checkedItem61} onChange={e => changeNotify(e, 6, 1)} /><i /> {translate("employees.settings.notify.schedule-register-update")}</label>
                  <label className={`icon-check color-333 ${errorNotify ? 'error' : ''}`}><input tabIndex={6} type="checkbox" checked={checkedItem71} onChange={e => changeNotify(e, 7, 1)} /><i /> {translate("employees.settings.notify.task-register-update")}</label>
                  <label className={`icon-check color-333 ${errorNotify ? 'error' : ''}`}><input tabIndex={7} type="checkbox" checked={checkedItem111 || checkedItem112} onChange={e => { changeNotify(e, 11, 1); changeNotify(e, 11, 2); }} /><i /> {translate("employees.settings.notify.completed-article")}</label>
                </div>
                {errorNotify && <span className="messenger-error">{msgErrorNotify}</span>}
                <p className="mt-5 mb-3">{translate("employees.settings.notify.notify-daily-task")}</p>
                <div className="box-function">
                  <label className={`icon-check ${errorNotifyDay ? 'error' : ''}`}><input tabIndex={8} type="checkbox" checked={checkedItem91} onChange={e => changeNotify(e, 9, 1)} /><i />{translate("employees.settings.notify.schedule")}</label>
                  <label className={`icon-check ${errorNotifyDay ? 'error' : ''}`}><input tabIndex={9} type="checkbox" checked={checkedItem92} onChange={e => changeNotify(e, 9, 2)} /><i />{translate("employees.settings.notify.milestone")}</label>
                  <label className={`icon-check ${errorNotifyDay ? 'error' : ''}`}><input tabIndex={10} type="checkbox" checked={checkedItem93} onChange={e => changeNotify(e, 9, 3)} /><i />{translate("employees.settings.notify.task")}</label>
                  {errorNotifyDay && <><br /><span className="messenger-error">{msgErrorNotifyDay}</span></>}
                  <div className="form-group  common mt-4 mb-2 has-delete">
                    <span className="pr-3">{translate("employees.settings.notify.prefix-send-to")}</span>
                    <TimePicker
                        tabIndex={11}
                        divClass = "position-relative"
                        inputClass = "input-normal"
                        isDisabled = {false}
                        isWithoutOuterDiv = {false}
                        errorInfo = {errorNotificationTime}
                        onChangeTime = {(val) => notifyTimeInput(val)}
                        placeholder={translate("employees.settings.notify.send-placeholder")}
                        timeInit = {notifyTime}
                        isWithoutDeleteButton={false}
                      />
                      <span className="pl-3">{translate("employees.settings.notify.send-to")}</span>
                  </div>
                  {errorNotificationTime && <span className="messenger-error">{msgErrorNotificationTime}</span>}
                </div>
              </div>
            </div>
            <div className="col-6">
              <p className="black">{translate("employees.settings.notify.destination-email")}</p>
              {renderListEmail()}
              <div className="form-group common break-line e-disabled">
                <input tabIndex={12} id="emailId" type="text" className={`input-normal ${errorItemEmails ? 'error' : 'bgcl-input'}`} disabled={emailInputDisable} value={email} onChange={e => emailInput(e)} />
                {errorItemEmails && <span className="messenger-error">{msgErrorEmails}</span>}
              </div>
              <div className="upload-wrap">
                <br /><br />
                <div tabIndex={13} className={`btn btn--browse ${emailInputDisable ? 'disable' : ''}`} onClick={e => addEmail()}>
                  <span><i className="far fa-plus mr-2" />{translate("employees.settings.notify.add-email")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="user-popup-form-bottom  popup-membership-footer">
        <a tabIndex={14} className={`button-blue ${isSubmitReady ? '' : 'disable'}`} onClick={handleChangeNotify}>{translate("employees.settings.notify.button-save")}</a>
      </div>
      {renderToastMessage()}
    </>
  )
};

const mapStateToProps = ({ employeeDetailAction , authentication }: IRootState) => ({
  errorMessage: employeeDetailAction.errorMessage,
  successMessage: employeeDetailAction.successMessage,
  dataGetnotification: employeeDetailAction.dataGetnotification,
  acc : authentication.account
});

const mapDispatchToProps = {
  getNotificationSetting,
  handleUpdateNotificationDetailSetting,
  changeFormData
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationSettings);