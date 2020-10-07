import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { translate, Storage } from 'react-jhipster';
import { ControlType, APP_TIME_FORMAT, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT_ES } from 'app/config/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import DatePicker from 'app/shared/layout/common/date-picker';
import _ from 'lodash';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import DayPicker from 'react-day-picker';
import { 
  getHourMinute, 
  isValidTimeFormat, 
  tzToUtc, 
  utcToTz, 
  DATE_TIME_FORMAT,
  trimTimezoneMark,
  timeUtcToTz
} from 'app/shared/util/date-utils';
import TimePicker from '../component/time-picker';
import moment from 'moment-timezone';
import { getTimeString, getDateTimeNowTz } from 'app/shared/util/date-utils';

type IFieldEditDateTimeProps = IDynamicFieldProps;

const FieldEditDateTime = forwardRef((props: IFieldEditDateTimeProps, ref) => {

  const [dateEdit, setDateEdit] = useState(null);
  const [timeEdit, setTimeEdit] = useState('');
  const [dateDisable, setDateDisable] = useState(false);
  const [timeDisable, setTimeDisable] = useState(false);
  const { fieldInfo } = props;
  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }

  const isValidTime = (strValue: string) => {
    if (!strValue || strValue.toString().trim().length < 1) {
      return true;
    }
    if (!isValidTimeFormat(strValue)) {
      return false;
    }
    const hhMM = getHourMinute(strValue);
    if (hhMM.hour < 0 || hhMM.hour >= 24 || hhMM.minute < 0 || hhMM.minute >= 60) {
      return false;
    }
    return true;
  }

  const autoFormatTime = (strValue: string) => {
    if (!strValue || strValue.toString().trim().length < 1) {
      return ''
    }
    if (!isValidTime(strValue)) {
      return strValue;
    }
    const hhMM = getHourMinute(strValue);
    const hh = `${hhMM.hour}`.padStart(2, '0');
    const mm = `${hhMM.minute}`.padStart(2, '0');
    return `${hh}:${mm}`
  }

  const makeKeyUpdateField = () => {
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    return keyObject;
  }

  const TIME_STRING_LENGTH = 5;

  const initialize = () => {
    let arr;
    if (props.fieldInfo["configValue"]) {
      arr = props.fieldInfo["configValue"].split(",");
    } else {
      arr = ["0", "0"];
    }
    if (arr[0] === "1") {
      setDateDisable(true);
    }
    if (arr[1] === "1") {
      setTimeDisable(true);
    }
    if (props.updateStateElement) {
      if (props.elementStatus && props.elementStatus.fieldValue) {
        const parsed = dateFnsParse(props.elementStatus.fieldValue);
        if (DayPicker.DateUtils.isDate(parsed)) {
          const dateTimezone = moment(utcToTz(parsed, DATE_TIME_FORMAT.Database), "YYYY-MM-DDTHH:mmZ", false).toDate();
          setDateEdit(dateTimezone)
          setTimeEdit(getTimeString(dateTimezone));
        }
      } else if (type === ControlType.ADD) {
        const currentTime = getDateTimeNowTz();
        const defaultValue = fieldInfo.defaultValue ? fieldInfo.defaultValue : null;
        let parsed = null;
        if (defaultValue) {
          if (defaultValue.split(" ").length === 2) {
            parsed = utcToTz(defaultValue, DATE_TIME_FORMAT.Database).split(" ");
          } else if (defaultValue.length === TIME_STRING_LENGTH) {
            parsed = [];
            parsed.push(timeUtcToTz(defaultValue));
          } else {
            parsed = [];
            parsed.push(defaultValue);
          }
        }
        if (arr[0] === "1") {
          setDateEdit(currentTime);
        }
        if (arr[1] === "1") {
          setTimeEdit(dateFnsFormat(currentTime, "HH:mm"));
        }
        // This code only works stably when the data in the database is correct. If the data in the DB is wrong, an error will occur.
        // For the code to work stably, it's necessary to check the conditions of the library's correct transmission and reception conditions.
        // Deliberately accessing and modifying the database may be result in a program error.
        const regexTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (parsed) {
          if (arr[0] === "2") {
            if (parsed[0] && parsed[0].length > TIME_STRING_LENGTH) {
              setDateEdit(moment(parsed[0], APP_DATE_FORMAT_ES).toDate());
            }
          }
          if (arr[1] === "2") {
            if (parsed.length === 2 && regexTime.test(parsed[1])) {
              setTimeEdit(parsed[1])
            } else if (parsed.length === 1 && regexTime.test(parsed[0])) {
              setTimeEdit(parsed[0])
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    let params = null;
    if (dateEdit || timeEdit) {
      const formatDate = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT_ES);
      const datetime = dateEdit ? dateFnsFormat(dateEdit, APP_DATE_FORMAT_ES) : ''
      params = `${datetime} ${autoFormatTime(timeEdit)}`;
      const _formatTime = APP_TIME_FORMAT;
      const format = `${formatDate} ${_formatTime}`;
      params = dateFnsFormat(tzToUtc(params, DATE_TIME_FORMAT.Database), format);
    }
    if (props.updateStateElement) {
      props.updateStateElement(makeKeyUpdateField(), fieldInfo.fieldType, params)
    }
  }, [dateEdit, timeEdit]);

  useImperativeHandle(ref, () => ({
    resetValue() {
      setDateEdit(null);
    },
    setValueEdit(val) {
      if (val) {
        // const parsed = dateFnsParse(val);
        // if (DayPicker.DateUtils.isDate(parsed)) {
        //   setTimeEdit(dateFnsFormat(parsed, "hh:mm"));
        //   setDateEdit(parsed);
        // }
        const parsed = dateFnsParse(trimTimezoneMark(val));
        if (DayPicker.DateUtils.isDate(parsed)) {
          const dateTimezone = moment(utcToTz(parsed, DATE_TIME_FORMAT.Database), "YYYY-MM-DDTHH:mmZ", false).toDate();
          setDateEdit(dateTimezone)
          setTimeEdit(getTimeString(dateTimezone));
        }
      } else {
        setDateEdit(null)
        setTimeEdit(null);
      }
    }
  }));

  const getStyleClass = (attr: string) => {
    return _.get(props.fieldStyleClass, `datetimeBox.edit.${attr}`)
  }

  const renderComponent = (isList?) => {
    let msg = null;
    let isError = false;
    if (props.errorInfo) {
      isError = true;
      if (props.errorInfo.errorCode) {
        let params = {}
        if (props.errorInfo.errorParams && Array.isArray(props.errorInfo.errorParams)) {
          props.errorInfo.errorParams.forEach((e, idx) => {
            params[`${idx}`] = e;
          });
        } else {
          params = props.errorInfo.errorParams
        }
        msg = translate(`messages.${props.errorInfo.errorCode}`, params);
      } else if (props.errorInfo.errorMsg) {
        msg = props.errorInfo.errorMsg;
      }
    }
    return (
      <>
       <div className="d-flex">
       <div className={`${getStyleClass('wrapDate')} mr-1 form-group has-delete`}>
          <DatePicker
            date={dateEdit}
            forcePosition={type === ControlType.EDIT_LIST}
            isError={isError}
            isFocusError={props.isFocus}
            inputClass={`${getStyleClass('inputDate')} ${isList ? "input-common" : "input-common2"}`}
            isDisabled={props.isDisabled || dateDisable}
            onDateChanged={(d) => setDateEdit(d)}
            placeholder={translate('dynamic-control.placeholder.dateInput')}
            componentClass = {props.isLastColumn ? "location-r0" : ""}
            fieldInfo={props.fieldInfo}
          />
        </div>
        <TimePicker
          fieldInfo={props.fieldInfo}
          getStyleClass={getStyleClass}
          forcePosition={type === ControlType.EDIT_LIST}
          selectBoxClass = {`${type === ControlType.EDIT_LIST ? 'top-100' : ''}`}
          isDisabled={props.isDisabled || timeDisable}
          errorInfo={props.errorInfo}
          onChangeTime={(val) => setTimeEdit(val)}
          enterInputControl={props.enterInputControl}
          placeholder={translate('dynamic-control.placeholder.timeInput')}
          timeInit={timeEdit}
          noPositionAbsolute = {1}
          isLastColumn = {props.isLastColumn}
        />
       </div>
       <div>{<span className="messenger-error d-block word-break-all">{msg}</span>}</div>
      </>
    );
  }

  const renderComponentEdit = () => {
    return (
      <div className={`${getStyleClass('wrapBox')} mt-0`}>
        {renderComponent()}
      </div>
    )
  }

  const renderComponentEditList = () => {
    return (
      <div className={`${getStyleClass('wrapBox')}`}>
        {renderComponent(true)}
      </div>
    )
  }

  if (type === ControlType.EDIT || type === ControlType.ADD) {
    return renderComponentEdit();
  } else if (type === ControlType.EDIT_LIST) {
    return renderComponentEditList();
  }
  return <></>;
});

export default FieldEditDateTime
