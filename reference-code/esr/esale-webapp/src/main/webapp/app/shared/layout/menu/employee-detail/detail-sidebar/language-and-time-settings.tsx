import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

import {
  USER_FORMAT_DATE_KEY,
  USER_TIMEZONE_KEY,
  USER_LANGUAGE
} from 'app/config/constants';
import {
  getLanguages, getTimezones, handleUpdateSettingEmployee, changeFormData
} from "../employee-detail-setting.reducer";
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { Storage } from 'react-jhipster';
import { TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';
import _ from 'lodash';
import { WindowActionMessage } from '../../constants';
import { setLocale } from 'app/shared/reducers/locale';
import { Store } from 'redux';
import { store } from 'app/index';
import { registerLocale } from 'app/config/translation';


const TIME_FORMAT_OPTIONS = [
  { value: "1", label: "YYYY-MM-DD" },
  { value: "2", label: "MM-DD-YYYY" },
  { value: "3", label: "DD-MM-YYYY" },
];

export interface ILanguageAndTimeSettings extends StateProps, DispatchProps {
  switchMenu
}

const LanguageAndTimeSettings = (props: ILanguageAndTimeSettings) => {

  const [msgError, setMsgError] = useState("");
  const [visibleSelectLang, setVisibleSelectLang] = useState(false);
  const [visibleSelectTimezone, setVisibleSelectTimezone] = useState(false);
  const [visibleSelectDateFormat, setVisibleSelectDateFormat] = useState(false);
  const [languageId, setLanguageId] = useState();
  const [dateFormat, setDateFormat] = useState(null);
  const [timezone, setTimezone] = useState();
  const [submitDisable, setSubmitDisable] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  let theDivLanguage: HTMLDivElement = null;

  const checkVisibleSelectLang = () => props.dataGetLang?.languagesDTOList && props.dataGetLang?.languagesDTOList?.length && visibleSelectLang

  const checkVisibleSelectTimezone = () => props.dataGetTimeZones?.timezones && props.dataGetTimeZones?.timezones?.length && visibleSelectTimezone

  const getLanguageById = (id) => props.dataGetLang?.languagesDTOList?.find(e => e.languageId === id)

  const getLanguageByCode = (code) => props.dataGetLang?.languagesDTOList?.find(e => e.languageCode === code)

  const getTimezoneById = (id) => props.dataGetTimeZones?.timezones?.find(e => e.timezoneId === id)

  const getTimezoneByName = (name) => props.dataGetTimeZones?.timezones?.find(e => e.timezoneShortName === name)

  const getDateFormatById = (id) => TIME_FORMAT_OPTIONS.find(e => e.value === id)

  const getDateFormatByLabel = (label) => TIME_FORMAT_OPTIONS.find(e => (label && e.label === label.toUpperCase()))

  const checkSubmitable = () => !((!languageId || getLanguageByCode(Storage.session.get(USER_LANGUAGE))?.languageId === languageId)
    && (!timezone || getTimezoneByName(Storage.session.get(USER_TIMEZONE_KEY))?.timezoneId === timezone)
    && (!dateFormat || getDateFormatByLabel(Storage.session.get(USER_FORMAT_DATE_KEY))?.value === dateFormat))

  const submitChange = () => {
    if (!submitDisable) {
      const payload = {};
      if (languageId) payload["languageId"] = languageId;
      else payload["languageId"] = getLanguageByCode(Storage.session.get(USER_LANGUAGE))?.languageId;
      if (timezone) payload["timezoneId"] = timezone;
      else payload["timezoneId"] = getTimezoneByName(Storage.session.get(USER_TIMEZONE_KEY))?.timezoneId;
      if (dateFormat) payload["formatDateId"] = parseInt(dateFormat, 10);
      else payload["formatDateId"] = parseInt(getDateFormatByLabel(Storage.session.get(USER_FORMAT_DATE_KEY))?.value, 10);
      // get name
      payload["languageCode"] = getLanguageById(payload["languageId"])?.languageCode;
      payload["timezoneName"] = getTimezoneById(payload["timezoneId"])?.timezoneShortName;
      const formatDate = getDateFormatById('' + payload["formatDateId"])?.label;
      if (formatDate) {
        payload["formatDate"] = formatDate.replace('YYYY', 'yyyy').replace('DD', 'dd');
      }
      props.handleUpdateSettingEmployee(payload);
    }
  }

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

  const displayToastMessage = (message: string, type: MessageType) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { message, type };
    setToastMessage(objParams);
    setTimeout(() => {
      setToastMessage(null);
      props.switchMenu(0);
      props.changeFormData(false);
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
    if (props.errorMessage && props.errorMessage.errorItems && props.errorMessage.errorItems.length > 0) {
      const errorCode = props.errorMessage.errorItems[0].errorCode;
      setMsgError(translateMsg('messages.' + errorCode));
    }
  }, [props.errorMessage]);

  const isFocused = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else if (!isFocused.current) {
      isFocused.current = true;
      theDivLanguage?.focus();
    }
  });

  useEffect(() => {
    props.getLanguages();
    props.getTimezones();
  }, []);

  useEffect(() => {
    setLanguageId(getLanguageByCode(Storage.session.get(USER_LANGUAGE))?.languageId);
    setTimezone(getTimezoneByName(Storage.session.get(USER_TIMEZONE_KEY))?.timezoneId);
    setDateFormat(getDateFormatByLabel(Storage.session.get(USER_FORMAT_DATE_KEY))?.value);
  }, [props.dataGetLang, props.dataGetTimeZones]);

  useEffect(() => {
    setSubmitDisable(!checkSubmitable());
    props.changeFormData(checkSubmitable());
  }, [languageId, timezone, dateFormat]);


  useEffect(() => {
    if (props.successMessage) {
      displayToastMessage(translateMsg('messages.' + props.successMessage), MessageType.Success);
    } else {
      setToastMessage(null);
    }
    if (dateFormat) {
      Storage.session.set(USER_FORMAT_DATE_KEY, getDateFormatById('' + dateFormat)?.label);
    }
    if (timezone) {
      Storage.session.set(USER_TIMEZONE_KEY, getTimezoneById(timezone)?.timezoneShortName);
    }
    if (languageId) {
      Storage.session.set(USER_LANGUAGE, getLanguageById(languageId)?.languageCode);
      registerLocale(store)
    }
    if (props.successMessage) {
      window.postMessage({ type: WindowActionMessage.ReloadList }, window.location.origin);
      window.postMessage({ type: WindowActionMessage.ReloadServiceSideBar }, window.location.origin);
      window.postMessage({ type: WindowActionMessage.ReloadLocalNavigationTask }, window.location.origin);
    }
  }, [props.successMessage]);

  useEffect(() => {
    const ele: HTMLElement = document.querySelector(".timezone-option .active");
    const scrollTop = ele?.offsetTop;
    if (document.querySelector(".timezone-option .drop-down"))
      document.querySelector(".timezone-option .drop-down").scrollTop = scrollTop;
    document.onclick = (event) => {
      let target = event.target || event.srcElement; // IE specials
      let insideTimezone = false;
      let insideLanguage = false;
      let insideDate = false;
      do {
        if (target === document.querySelector(".timezone-option")) {
          insideTimezone = true;
          break;
        }
        if (target === document.querySelector(".language-option")) {
          insideLanguage = true;
          break;
        }
        if (target === document.querySelector(".date-format-option")) {
          insideDate = true;
          break;
        }
        target = (target as Node).parentElement;
      } while (target);
      if (!insideTimezone) setVisibleSelectTimezone(false);
      if (!insideLanguage) setVisibleSelectLang(false);
      if (!insideDate) setVisibleSelectDateFormat(false);
    }
  }, [visibleSelectTimezone])

  return (
    <>
      <div className="modal-body style-3">
        <div className="popup-content  style-3">
          <div className="row">
            {msgError && renderMessage()}
            <div className="col-6">
              <div className="form-group common">
                <label>{translate('employees.settings.language-time-zone-settings.language')}</label>
                <div ref={elem => (theDivLanguage = elem)} tabIndex={1} className="select-option language-option" onClick={() => setVisibleSelectLang(!visibleSelectLang)}>
                  <span className="select-text text-gray">{getLanguageById(languageId)?.languageName}</span>
                  {checkVisibleSelectLang() && <div>
                    <div className="drop-down drop-down2" style={{ maxHeight: 240 }}>
                      <ul>
                        {props.dataGetLang?.languagesDTOList?.map(e => <li
                          key={e.languageId}
                          onClick={() => setLanguageId(e.languageId)}
                          className={e.languageId === languageId ? "item smooth active" : "item smooth"}
                        >{e.languageName}</li>)}
                      </ul>
                    </div>
                  </div>}
                </div>
              </div>
              <div className="form-group common mt-5">
                <label>{translate('employees.settings.language-time-zone-settings.date-format')}</label>
                <div tabIndex={2} className="select-option date-format-option" onClick={() => setVisibleSelectDateFormat(!visibleSelectDateFormat)}>
                  <span className="select-text text-gray">{getDateFormatById('' + dateFormat)?.label}</span>
                  {visibleSelectDateFormat && <div>
                    <div className="drop-down drop-down2">
                      <ul>
                        {TIME_FORMAT_OPTIONS.map(e => <li
                          key={e.value}
                          onClick={() => setDateFormat(e.value)}
                          className={e.value === dateFormat ? "item smooth active" : "item smooth"}
                        >{e.label}</li>)}
                      </ul>
                    </div>
                  </div>}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group common">
                <label>{translate('employees.settings.language-time-zone-settings.timezone')}</label>
                <div tabIndex={3} className="select-option  timezone-option" onClick={() => setVisibleSelectTimezone(!visibleSelectTimezone)}>
                  <span className="select-text text-gray">{getTimezoneById(timezone)?.timezoneName}</span>
                  {checkVisibleSelectTimezone() && <div>
                    <div className="drop-down drop-down2 height-300">
                      <ul>
                        {props.dataGetTimeZones?.timezones?.map(e => <li
                          key={e.timezoneId}
                          onClick={() => setTimezone(e.timezoneId)}
                          className={e.timezoneId === timezone ? "item smooth active" : "item smooth"}
                        >{e.timezoneName}</li>)}
                      </ul>
                    </div>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="user-popup-form-bottom  popup-membership-footer">
        <a tabIndex={4} onClick={submitChange} className={submitDisable ? "button-blue disable" : "button-blue"} >{translate('employees.settings.language-time-zone-settings.submit')}</a>
      </div>
      {renderToastMessage()}
    </>
  )
};

const mapStateToProps = ({ employeeDetailAction }: IRootState) => ({
  errorMessage: employeeDetailAction.errorMessage,
  dataGetLang: employeeDetailAction.dataGetLang,
  dataGetTimeZones: employeeDetailAction.dataGetTimeZones,
  idUpdate: employeeDetailAction.idUpdate,
  successMessage: employeeDetailAction.successMessage
});

const mapDispatchToProps = {
  getLanguages,
  getTimezones,
  handleUpdateSettingEmployee,
  changeFormData,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageAndTimeSettings);