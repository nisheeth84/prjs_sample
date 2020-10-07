import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ControlType, APP_DATE_FORMAT_ES } from 'app/config/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import DatePicker from 'app/shared/layout/common/date-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import _ from 'lodash';
import DayPicker from 'react-day-picker';
import { translate } from 'react-jhipster';
import StringUtils, {getFieldLabel} from 'app/shared/util/string-utils';
import { convertDateTimeToTz, trimTimezoneMark } from 'app/shared/util/date-utils';
import { USER_FORMAT_DATE_KEY } from 'app/config/constants';
import { Storage } from 'react-jhipster';

type IFieldEditDateProps = IDynamicFieldProps;

const FieldEditDate = forwardRef((props: IFieldEditDateProps, ref) => {
  const [dateEdit, setDateEdit] = useState(null);
  const { fieldInfo } = props;

  const userFormatDate = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT_ES);

  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }
  const makeKeyUpdateField = () => {
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    return keyObject;
  }
  const initialize = () => {
    if (props.updateStateElement) {
      if (props.elementStatus && props.elementStatus.fieldValue) {
        let dateTime = props.elementStatus.fieldValue;
        if (dateTime && _.isString(dateTime) && dateTime.endsWith('Z') && dateTime.length > 16) {
          dateTime = dateTime.slice(0, 16).replace('T',' ');
        }
        const parsed = dateFnsParse(dateTime);
        if (DayPicker.DateUtils.isDate(parsed)) {
          setDateEdit(parsed);
        }
      } else if (type === ControlType.ADD) {
        if (props.fieldInfo["configValue"] === "1") {
          setDateEdit(new Date());
        } else if (props.fieldInfo["configValue"] === "2" && props.fieldInfo.defaultValue) {
          const parsed = dateFnsParse(props.fieldInfo.defaultValue);
          if (DayPicker.DateUtils.isDate(parsed)) {
            setDateEdit(parsed);
          }
        }
      }
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (props.updateStateElement) {
      props.updateStateElement(makeKeyUpdateField(), fieldInfo.fieldType, dateEdit ? dateFnsFormat(convertDateTimeToTz(dateEdit), userFormatDate) : null);
    }
  }, [dateEdit])

  useImperativeHandle(ref, () => ({
    resetValue() {
      setDateEdit(null);
    },
    setValueEdit(val) {
      if (val) {
        if (_.isString(val) && val.endsWith('Z') && val.length > 16) {
          val = val.slice(0, 16).replace('T',' ');
        }
        const parsed = dateFnsParse(trimTimezoneMark(val));
        if (DayPicker.DateUtils.isDate(parsed)) {
          setDateEdit(parsed);
        }
      } else {
        setDateEdit(null)
      }
    }
  }));

  const getStyleClass = (attr: string) => {
    return _.get(props.fieldStyleClass, `dateBox.edit.${attr}`)
  }

  const getErrorMessage = () => {
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
    return { isError, msg }
  }

  const renderComponentEdit = () => {
    const { isError, msg } = getErrorMessage()
    const fieldNamePlaceHolder = getFieldLabel(fieldInfo, 'fieldLabel');
    const placeHolder = "dynamic-control.placeholder.dateTime";
    return (
      <div className={`${getStyleClass('wrapInput')} mt-0`}>
        <DatePicker
          date={dateEdit}
          inputClass={`${getStyleClass('input')}`}
          isError={isError}
          isFocusError={props.isFocus}
          isDisabled={props.isDisabled || props.fieldInfo["configValue"] === "1"}
          onDateChanged={(d) => setDateEdit(d)}
          placeholder  = {StringUtils.translateSpecial(placeHolder, {fieldNamePlaceHolder})}
          outerDivClass="position-relative"
          fieldInfo={props.fieldInfo}
        />
        <div>
        {msg && <span className="messenger-error d-block">{msg}</span>}
        </div>
      </div>
    );
  }

  const renderComponentEditList = () => {
    const { isError, msg } = getErrorMessage()
    const fieldNamePlaceHolder = getFieldLabel(fieldInfo, 'fieldLabel'); // list-edit-date-time
    const placeHolder = "dynamic-control.placeholder.dateTime";
    return (
      <div className={`${getStyleClass('wrapInput')} width-200`}>
        <div className = "cancel">
        <DatePicker
          date={dateEdit}
          forcePosition={true}
          inputClass={`${getStyleClass('input')}`}
          isError={isError}
          isDisabled={props.isDisabled || props.fieldInfo["configValue"] === "1"}
          onDateChanged={(d) => setDateEdit(d)}
          placeholder  = {StringUtils.translateSpecial(placeHolder, {fieldNamePlaceHolder})}
          componentClass = {props.isLastColumn ? "location-r0" : ""}
          fieldInfo={props.fieldInfo}
        />
        <div>
        {msg && <span className="messenger-error d-block word-break-all">{msg}</span>}
        </div>
      </div>
      </div>
    );
  }

  const renderComponent = () => {
    if (type === ControlType.EDIT || type === ControlType.ADD) {
      return (
        <>
          {renderComponentEdit()}
        </>)
    } else if (type === ControlType.EDIT_LIST) {
      return (
        <>
          {renderComponentEditList()}
        </>)
    }
    return <></>;
  }

  return renderComponent();
});

export default FieldEditDate
