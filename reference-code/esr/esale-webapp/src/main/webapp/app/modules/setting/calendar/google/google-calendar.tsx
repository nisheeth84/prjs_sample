import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { reset, hanldleGetData, hanldleupdate } from './google-calendar.reducer';
import { getJsonBName } from 'app/modules/setting/utils';
import { CALENDAR_TAB, SHOW_MESSAGE, TIME_OUT_MESSAGE } from 'app/modules/setting/constant';
import GoogleLogin from 'react-google-login';
import { isNullOrUndefined } from 'util';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import GoogleLoginAuth from './google-login-auth';
import TimePicker from 'app/shared/layout/dynamic-form/control-field/component/time-picker';
import moment, { Moment } from 'moment';
import { timeTzToUtc, timeUtcToTz } from 'app/shared/util/date-utils';

const ButtonAuthInfomation = props => {
  if (props.hidden) return null;

  const openGoogleAuth = useCallback(() => {
    if (props.onClick) {
      props.onClick();
    }

    if (props.openGoogleAuth) {
      props.openGoogleAuth();
    }
  }, [props.onClick, props.openGoogleAuth]);

  useEffect(() => {
    if (props.openGoogleAuth) {
      setTimeout(() => {
        openGoogleAuth();
      }, 1000);
    }
  }, [props.openGoogleAuth]);

  return (
    <button type="button" className="button-primary button-activity-registration pr-3 pl-3" onClick={openGoogleAuth}>
      {translate('setting.calendar.google.btnAuthInfomation')}
    </button>
  );
};

export interface IGGCalendar extends StateProps, DispatchProps {
  changeGoogleCalendar;
  resetpapge?;
  isSave?;
  calendarTabs;
}
export const GoogleCalendar = (props: IGGCalendar) => {
  const iframeRef = useRef(null);
  const [listReferenceField, setListReferenceField] = useState([]);
  const [listScheduleTypes, setListScheduleTypes] = useState([]);
  const [googleCalendar, setGoogleCalendar] = useState({});
  const [codeMessage, setCodeMessage] = useState(SHOW_MESSAGE.NONE);
  const [isActive, setIsActive] = useState(true);
  const { scheduleGoogleCalendar } = props;
  const [isStartSettingGoogleKey, setIsStartSettingGoogleKey] = useState(false);
  const [loginGG, setLoginGG] = useState(false);

  // useEffect(() => {
  //   console.log('XXX', googleCalendar);
  // });

  useEffect(() => {
    props.reset();
    props.hanldleGetData();
  }, [props.resetpapge]);

  useEffect(() => {
    if (props.iDSS !== null) {
      props.reset();
      props.hanldleGetData();
    }
  }, [props.iDSS]);

  useEffect(() => {
    if (scheduleGoogleCalendar['scheduleGoogleCalendar']) {
      setGoogleCalendar(scheduleGoogleCalendar['scheduleGoogleCalendar']);
      if (scheduleGoogleCalendar['scheduleGoogleCalendar']['scheduleSyncSelect'] === 2) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }

      if(scheduleGoogleCalendar['scheduleGoogleCalendar']['scheduleSyncSelect'] === null){
        scheduleGoogleCalendar['scheduleGoogleCalendar']['scheduleSyncSelect'] = 2;
      }

    }
    if (scheduleGoogleCalendar['scheduleTypes']) {
      setListScheduleTypes(scheduleGoogleCalendar['scheduleTypes']);
      scheduleGoogleCalendar['scheduleGoogleCalendar']['scheduleTypeId'] = scheduleGoogleCalendar['scheduleTypes'][0].scheduleTypeId;
    }
    if (scheduleGoogleCalendar['referenceField']) {
      setListReferenceField(scheduleGoogleCalendar['referenceField']);
    }
    if (scheduleGoogleCalendar['scheduleTypes'] && !scheduleGoogleCalendar['scheduleGoogleCalendar']) {
      if (scheduleGoogleCalendar['scheduleTypes'].length > 0)
        googleCalendar['scheduleTypeId'] = scheduleGoogleCalendar['scheduleTypes'][0].scheduleTypeId;
      if (scheduleGoogleCalendar['referenceField'].length > 0)
        googleCalendar['referenceFieldId'] = scheduleGoogleCalendar['referenceField'][0].fieldId;
    }
  }, [scheduleGoogleCalendar]);

  const getErrorMessage = errorCode => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  };
  const getErrorMessageValidate = objErr => {
    let errorMessage = '';
    if (!isNullOrUndefined(objErr.errorCode)) {
      if (objErr.errorParams) {
        if (objErr.errorCode === 'ERR_COM_0027' || objErr.errorCode === 'ERR_COM_0025') {
          errorMessage = translate('messages.' + objErr.errorCode, { 0: objErr.errorParams[0] });
        } else {
          errorMessage = translate('messages.' + objErr.errorCode, { values: objErr.errorParams[0] });
        }
      } else {
        errorMessage = translate('messages.' + objErr.errorCode);
      }
    }
    return errorMessage;
  };

  const renderErrorMessage = () => {
    if (codeMessage === SHOW_MESSAGE.SUCCESS) {
      setTimeout(() => {
        setCodeMessage(SHOW_MESSAGE.NONE);
        props.reset();
      }, TIME_OUT_MESSAGE);
    }
    if (codeMessage === 2) {
      return (
        <>
          <div>
            <BoxMessage messageType={MessageType.Success} message={getErrorMessage('INF_COM_0008')} />
          </div>
        </>
      );
    }
    if (props.messageError && props.messageError.length > 0 && !props.messageError[0]['errorParams']) {
      return (
        <>
          <div>
            <BoxMessage
              messageType={MessageType.Error}
              message={getErrorMessage(props.messageError[0] && props.messageError[0]['errorCode'])}
            />
          </div>
        </>
      );
    }
  };

  const responseGoogle = response => {
    console.log(response);
  };

  const hasErrors = useMemo(() => {
    const listMessage = {};
    if (props.messageError) {
      props.messageError.forEach(element => {
        listMessage[`${element.item}`] = true;
      });
    }
    return listMessage;
  }, [props.messageError]);

  const renderErrorMessageValidate = useCallback((itemName) => {
    if (props.messageError && props.messageError.length === 0) return <></>;

    const message = props.messageError ? props.messageError.find(m => m.item === itemName):null;
    if (message) {
      return <div>
        <span className="setting-input-valis-msg">{getErrorMessageValidate(message)} </span>
      </div>
    }
    return <></>;
  }, [props.messageError]);

  const changeTimeStartTime = (event, key) => {
    const dataGoogleCalendar = _.cloneDeep(googleCalendar)
    dataGoogleCalendar[`${key}`] = event
    setGoogleCalendar(dataGoogleCalendar);
    if ((googleCalendar[`${key}`] && googleCalendar[`${key}`] !== event) ||
      (!googleCalendar[`${key}`] && event !== '')
    )
      props.changeGoogleCalendar(dataGoogleCalendar);
  }

  const handleChangeInput = (keyMap) => event => {
    // console.log('event.target.value', event.target.value);
    setGoogleCalendar({
      ...googleCalendar,
      [keyMap]: event.target.value
    });
    if (keyMap === 'scheduleSyncSelect' && event.target.value === '1') {
      setIsActive(false);
      setGoogleCalendar({
        ...googleCalendar,
        ['scheduleSyncSelect']: 1,
        ['scheduleSyncAllDayTime']: null
      });
    } else if (keyMap === 'scheduleSyncSelect' && event.target.value === '2') {
      setIsActive(true);
      setGoogleCalendar({
        ...googleCalendar,
        ['scheduleSyncSelect']: 2,
        ['scheduleSyncEndTime']: null,
        ['scheduleSyncStartTime']: null,
        ['scheduleSyncMinute']: null
      });
    }
    props.changeGoogleCalendar(googleCalendar);
  };
  const [error, setError] = useState(null);
  const checkError = () => {
    let isError = null;
    if (!_.isEmpty(googleCalendar)) {
      if (googleCalendar['scheduleSyncStartTime'] <= googleCalendar['scheduleSyncEndTime']) {
        isError = null;
      } else {
        isError = true;
      }
    }
    setError(!isActive ? isError : null);
    return !isActive ? isError : null;
  }

  const renderErrorTime = () => {
    return error ? <p className="setting-input-valis-msg ml-4">{translate('messages.ERR_COM_0037')}</p> : <></>
  }

  useEffect(() => {
    const isError = checkError();
    // if (googleCalendar['scheduleTypeId']) {
      if (isError === null) {
        props.hanldleupdate(googleCalendar);
      }
    // }
  }, [props.isSave]);

  useEffect(() => {
    setCodeMessage(SHOW_MESSAGE.NONE);
    if (props.iDSS !== null) {
      setCodeMessage(2);
    }
    if (props.messageError && props.messageError.length > 0) {
      setCodeMessage(SHOW_MESSAGE.ERROR);
    }
  }, [props.iDSS]);
  // console.log(codeMessage);

  const onStartSettingGoogleKey = () => {
    const html = `
      <html>
        <head>
          <script src="https://apis.google.com/js/api.js"></script>
          <script>
            var GoogleAuth;
            var SCOPE = 'https://www.googleapis.com/auth/calendar';

            function hasGrantedScopes(user) {
              // user = user || GoogleAuth.currentUser.get();
              // console.log('hasGrantedScopes', user);
              // if(!user.Ea) return;
              // var isAuthorized = user.hasGrantedScopes(SCOPE);
              // if (!isAuthorized) {
              //   onFail('User does not accept!');
              //   return;
              // }

              if(user){
                onLoggedin();
              }else{
                onFail('User does not accept!');
              }

              
            }

            function start() {
              gapi.client.init({
                'clientId': '${googleCalendar['clientId']}',
                'scope': SCOPE,
              }).then(function() {
                GoogleAuth = gapi.auth2.getAuthInstance();

                var user = GoogleAuth.currentUser.get();

                if(!user.Ea) {
                  GoogleAuth.isSignedIn.listen(hasGrantedScopes);
                  GoogleAuth.signIn();
                } else {
                  hasGrantedScopes(user)
                }
              }, function(reason) {
                onFail(reason)
              });
            };
            gapi.load('client', start);
          </script>
        </head>
        <body>
        </body>
      </html>
    `;
    const iframeWindow = iframeRef.current.contentWindow || iframeRef.current.contentDocument;
    iframeWindow.document.location.reload(true);
    setTimeout(() => {
      iframeWindow.onLoggedin = () => setLoginGG(true);
      iframeWindow.onFail = (reason) => setLoginGG(false);
      iframeWindow.document.write(`${html}`);
    }, 1000);

    setIsStartSettingGoogleKey(true);
  };

  const [defaultTime, setDefaultTime] = useState('');
  return (
    <>
      <div className="form-group">
        <label className="font-size-18 color-333">{translate('setting.calendar.google.title')}</label>
        <div className="block-feedback block-feedback-yellow border-radius-12 magin-top-5">
          {translate('setting.calendar.google.text1')}
        </div>
      </div>
      {/* {codeMessage !== SHOW_MESSAGE.SUCCESS && renderErrorMessage()} */}
      <div className="magin-top-10">
        <label className="color-333">{translate('setting.calendar.google.autInfomation')}</label>
        {
          !loginGG && (
            <div className="block-feedback block-feedback-yellow border-radius-12 magin-top-5">
              {translate('setting.calendar.google.text2')}
            </div>
          )
        }

        <div className="block-feedback block-feedback-blue border-radius-12 padding-bottom-30 magin-top-10 line-height-175">
          <a className="color-blue" href="https://code.google.com/apis/console">
            Google APIs console
          </a>
          {translate('setting.calendar.google.text3')}
        </div>
      </div>
      <div className="magin-top-10">
        <div className="wrap-check w-100">
          <div>
            <label className="color-333">Client ID</label>
            <div className="w60 magin-top-5">
              <input
                type="text"
                className={`input-normal ${hasErrors['clientId'] && 'setting-input-valid'}`}
                onChange={event => {
                  handleChangeInput('clientId')(event);
                  setIsStartSettingGoogleKey(false);
                }}
                value={googleCalendar['clientId'] || ''}
                placeholder="Client IDを入力"
              />
            </div>
            {renderErrorMessageValidate('clientId')}
          </div>
          <div className="magin-top-15">
            <label className="color-333">Client secret</label>
            <div className="w60 magin-top-5">
              <input
                type="text"
                className={`input-normal ${hasErrors['clientSecret'] && 'setting-input-valid'}`}
                onChange={handleChangeInput('clientSecret')}
                value={googleCalendar['clientSecret'] || ''}
                placeholder="Client secretを入力"
              />
            </div>
            {renderErrorMessageValidate('clientSecret')}
          </div>
          <div className="magin-top-15 wapsetting-p color-333">
            <p>Authorized Redirect URLs</p>
            <p>https://remixms.softbrain.co.jp/mstZYWW2Q0oZ/esales-pc?page=google_calendar_setting&amp;type=oauth_response</p>
            <p>Authorized JavaScript origins</p>
            <p>https://remixms.softbrain.co.jp</p>
          </div>

          <div className="wrap-select setting-mt10">
            <ButtonAuthInfomation
              onClick={onStartSettingGoogleKey}
            // hidden={isStartSettingGoogleKey}
            />
            {/* {isStartSettingGoogleKey && getGoogleLogin()} */}
            <iframe
              ref={iframeRef}
              frameBorder="0"
              width="0px"
              height="0px"
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
      <div className="magin-top-15">
        <label className="color-333">{translate('setting.calendar.google.googleAcc')}</label>
        <div className="wrap-check magin-top-5 w-100">
          <div className="esr-pagination">
            <div className="select-option">
              <select className="max-w111" value={googleCalendar['referenceFieldId']} onChange={handleChangeInput('referenceFieldId')}>
                {listReferenceField &&
                  listReferenceField.length > 0 &&
                  listReferenceField &&
                  listReferenceField.map((item, index) => (
                    <option value={item.fieldId} key={item.fieldId}>
                      {getJsonBName(item.labelName)}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="wrap-select setting-mt10">

            <button className="button-primary button-activity-registration pr-3 pl-3">{translate('setting.calendar.google.btnConnectionTest')}</button>

          </div>
        </div>
      </div>
      <div className="form-group mt-4">
        <label className="font-size-18">{translate('setting.calendar.google.title-snd')}</label>
        <label className="magin-top-10">{translate('setting.calendar.google.radioSync')}</label>
        <div className="wrap-check w-100 magin-top-10">
          <div className="mt-0">
            <div className="radio-item normal w-100 pt-2">
              <input type="radio" id="radio-one-1" onChange={handleChangeInput('scheduleSyncSelect')} value={1} checked={!isActive} />
              <label htmlFor="radio-one-1">
                <span className="wrap-input-date version2 version3">
                  <div
                    className={`${(hasErrors['scheduleSyncMinute'] ||
                      hasErrors['scheduleSyncStartTime']) ?
                      'inputNotErr' : ''}`}
                  >
                    <span className="form-control-wrap">
                      {
                        <TimePicker placeholder={"00:00"}
                          onChangeTime={(e) => changeTimeStartTime(e, 'scheduleSyncStartTime')}
                          divClass="form-group form-group2 common has-delete m-0"
                          inputClass={`input-normal input-common2 version2 text-left ${hasErrors['scheduleSyncStartTime'] &&
                            'setting-input-valid'}`}
                          isWithoutOuterDiv={false}
                          isWithoutInnerDiv={false}
                          timeInit={googleCalendar['scheduleSyncStartTime'] || ''}
                          isDisabled={isActive}
                          errorInfo={error}
                        />
                      }
                    </span>
                    {renderErrorMessageValidate('scheduleSyncStartTime')}
                  </div>
                  <span className="approximately">{translate('setting.calendar.google.from')}</span>
                  <div
                    className={`${(hasErrors['scheduleSyncMinute'] ||
                      hasErrors['scheduleSyncStartTime']) &&
                      'inputNotErr'}`}
                  >
                    <span className="form-control-wrap">
                      {
                        <TimePicker placeholder={"00:00"}
                          onChangeTime={(e) => changeTimeStartTime(e, 'scheduleSyncEndTime')}
                          divClass="form-group form-group2 common has-delete m-0"
                          inputClass={`input-normal input-common2 version2 text-left ${hasErrors['scheduleSyncEndTime'] &&
                            'setting-input-valid'}`}
                          isWithoutOuterDiv={false}
                          isWithoutInnerDiv={false}
                          timeInit={googleCalendar['scheduleSyncEndTime'] || ''}
                          isDisabled={isActive}
                          errorInfo={error}
                        />
                      }
                    </span>
                    {renderErrorMessageValidate('scheduleSyncEndTime')}
                  </div>
                  <span className="approximately">{translate('setting.calendar.google.forUpTo')}</span>
                  <div
                    className={`${(hasErrors['scheduleSyncEndTime'] ||
                      hasErrors['scheduleSyncStartTime']) &&
                      'inputNotErr'}`}
                  >
                    <span className="form-control-wrap">
                      <input
                        type="text"
                        className={`input-normal input-common2 version2 text-left ${hasErrors['scheduleSyncMinute'] &&
                          'setting-input-valid'}`}
                        onChange={handleChangeInput('scheduleSyncMinute')}
                        value={googleCalendar['scheduleSyncMinute'] || ''}
                        disabled={isActive}
                        placeholder="15"
                      />
                      <span className="setting-currency">{translate('setting.calendar.google.minute')}</span>
                    </span>
                    {renderErrorMessageValidate('scheduleSyncMinute')}
                  </div>
                  <span className="approximately">{translate('setting.calendar.google.runEveryMinute')}</span>
                </span>
              </label>
            </div>
            {renderErrorTime()}
            <div className="radio-item normal w-100 pt-2 magin-top-5">
              <input type="radio" id="radio-one-2" onChange={handleChangeInput('scheduleSyncSelect')} value={2} checked={isActive} />
              <label htmlFor="radio-one-2">
                <span className="wrap-input-date version2 version3">
                  <span className="form-control-wrap">
                    {
                      <TimePicker placeholder={"00:00"}
                        onChangeTime={(e) => changeTimeStartTime(e, 'scheduleSyncAllDayTime')}
                        divClass="form-group form-group2 common has-delete m-0"
                        inputClass={`input-normal input-common2 version2 text-left ${hasErrors['scheduleSyncAllDayTime'] &&
                          'setting-input-valid'}`}
                        isWithoutOuterDiv={false}
                        isWithoutInnerDiv={false}
                        timeInit={googleCalendar['scheduleSyncAllDayTime'] || ''}
                        isDisabled={!isActive}
                      // errorInfo={props.errorInfo && !defaultTime}
                      />
                    }
                  </span>
                  <span className="approximately">{translate('setting.calendar.google.runTo')}</span>
                </span>
                {renderErrorMessageValidate('scheduleSyncAllDayTime')}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>{translate('setting.calendar.google.sync')}</label>
        <div className="block-feedback block-feedback-blue border-radius-12 magin-top-5 line-height-175">
          {translate('setting.calendar.google.text4')}
        </div>
        <div className="show-search magin-top-10">
          <div className="advanced-search-wrap">
            <div className="advanced-search no-padding border-0">
              <div className="starting-today">
                <p className="today">{translate('setting.calendar.google.past')}</p>
                <div className="from">
                  <input
                    type="number"
                    maxLength={3}
                    className={`form-control ${hasErrors['scheduleSyncTargetRangeStart'] && 'setting-input-valid'}`}
                    id="from-date-one"
                    onChange={handleChangeInput('scheduleSyncTargetRangeStart')}
                    value={googleCalendar['scheduleSyncTargetRangeStart'] || ''}
                    placeholder="7"
                  />
                  <span>{translate('setting.calendar.google.day')}</span>
                </div>
              </div>
              {renderErrorMessageValidate('scheduleSyncTargetRangeStart')}
              <div className="starting-today magin-top-10 mb-0">
                <p className="today">{translate('setting.calendar.google.future')}</p>
                <div className="from">
                  <input
                    type="number"
                    className={`form-control ${hasErrors['scheduleSyncTargetRangeEnd'] && 'setting-input-valid'}`}
                    id="from-date-two"
                    onChange={handleChangeInput('scheduleSyncTargetRangeEnd')}
                    value={googleCalendar['scheduleSyncTargetRangeEnd'] || ''}
                    placeholder="5"
                  />
                  <span>{translate('setting.calendar.google.year')}</span>
                </div>
              </div>
              {renderErrorMessageValidate('scheduleSyncTargetRangeEnd')}
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="font-size-18">{translate('setting.calendar.google.scheduleTemplate')}</label>
        <label className="magin-top-10">{translate('setting.calendar.google.defaultSubject')}</label>
        <div className="block-feedback block-feedback-blue border-radius-12 magin-top-5 line-height-175">
          {translate('setting.calendar.google.text5')}
        </div>
        <div className="w58 magin-top-10 mb-0">
          <input
            type="text"
            className={`input-normal ${hasErrors['scheduleSyncDefaultSubject'] && 'setting-input-valid'}`}
            onChange={handleChangeInput('scheduleSyncDefaultSubject')}
            value={googleCalendar['scheduleSyncDefaultSubject'] || ''}
            placeholder="件名なし"
          />
        </div>
        {renderErrorMessageValidate('scheduleSyncDefaultSubject')}
      </div>
      <div className="form-group">
        <label>{translate('setting.calendar.google.defaultScheduleType')}</label>
        <div className="block-feedback block-feedback-blue border-radius-12 magin-top-5 padding-bottom-30 line-height-175">
          <div>{translate('setting.calendar.google.text6')}</div>
          <div>{translate('setting.calendar.google.text7')}</div>
        </div>
        <div className="select-option w58 magin-top-10">
          <div className="select-option">
            <select className="select-text" value={googleCalendar['scheduleTypeId']} onChange={handleChangeInput('scheduleTypeId')}>
              {listScheduleTypes &&
                listScheduleTypes.length > 0 &&
                listScheduleTypes &&
                listScheduleTypes.map((item, index) => (
                  <option value={item.scheduleTypeId} key={item.scheduleTypeId}>
                    {getJsonBName(item.scheduleTypeName)}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ googleCalendar, applicationProfile }: IRootState) => ({
  scheduleGoogleCalendar: googleCalendar.scheduleGoogleCalendar,
  iDSS: googleCalendar.updatedSuccsess,
  messageError: googleCalendar.errorItems,
  tenant: applicationProfile.tenant
});

const mapDispatchToProps = {
  reset,
  hanldleGetData,
  hanldleupdate
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleCalendar);
