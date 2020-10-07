import React, { forwardRef, useState, useEffect, useImperativeHandle, useRef } from 'react';
import { translate } from 'react-jhipster';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { getPlaceHolder, toKatakana }  from 'app/shared/util/string-utils';
import _ from 'lodash';

type IFieldEditPhoneNumberProps = IDynamicFieldProps;

const FieldEditPhoneNumber = forwardRef((props: IFieldEditPhoneNumberProps, ref) => {
  const [valueEdit, setValueEdit] = useState('');
  const { fieldInfo } = props;
  const textboxRef = useRef(null);

  /**
   * make object to call updateStateElement
   */
  const makeKeyUpdateField = () => {
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    return keyObject;
  }

  useEffect(() => {
    if (!props.isDisabled && props.updateStateElement) {
      props.updateStateElement(makeKeyUpdateField(), fieldInfo.fieldType, valueEdit.length > 0 ? valueEdit.toString() : '');
    }
  }, [valueEdit]);

  useImperativeHandle(ref, () => ({
    resetValue() {
      setValueEdit('');
    },
    setValueEdit(val) {
      if (!_.isEqual(valueEdit, val)) {
        setValueEdit(val || '');
      }
    }
  }));

  /**
  * check is number RegExp
  */
  const isValidNumber = (strValue: string) => {
    if (!strValue || strValue.trim().length < 1) {
      return true;
    }
    return (/^[-+()\d]*$/g).test(strValue);
  }

  /**
   * validate when user inpup
   */
  const onChangeValueEdit = (event) => {
    const PHONE_MAX_LENGTH = 20;
    if (event.target.value === '' || isValidNumber(event.target.value)) {
      const val = event.target.value;
      if (!fieldInfo.isDefault && 
        val.length > PHONE_MAX_LENGTH) {
        return;
      }
      if (fieldInfo.isDefault && !_.isNil(fieldInfo.maxLength) &&
        val.length > fieldInfo.maxLength) {
        setValueEdit(val.slice(0, fieldInfo.maxLength));
        return;
      }
      setValueEdit(val);
    }
  }

  /**
    * initialize defaultVal
    */
  const initialize = () => {
    const defaultVal = (props.elementStatus && props.elementStatus.fieldValue) ? props.elementStatus.fieldValue : fieldInfo.defaultValue;
    if (defaultVal !== null && defaultVal !== undefined) {
      setValueEdit(defaultVal.toString());
    }
  };

  useEffect(() => {
    if (props.isFocus && textboxRef && textboxRef.current) {
      textboxRef.current.focus();
    }
  }, [props.isFocus])

  useEffect(() => {
    initialize();
  }, []);

  const renderComponentEdit = () => {
    const defaultVal = props.elementStatus ? props.elementStatus.fieldValue : "";
    let msg = null;
    if (props.errorInfo) {
      if (props.errorInfo.errorCode) {
        let params = {}
        if (props.errorInfo.errorParams && Array.isArray(props.errorInfo.errorParams)) {
          props.errorInfo.errorParams.forEach((e, idx) => {
            params[`${idx}`] = e;
          });
        } else if (!_.isNil(props.errorInfo.errorParams)){
          params = props.errorInfo.errorParams
        }
        if (props.errorInfo.errorCode === 'ERR_COM_0027') {
          params['0'] = fieldInfo.maxLength;
        }
        msg = translate(`messages.${props.errorInfo.errorCode}`, params);
      } else if (props.errorInfo.errorMsg) {
        msg = props.errorInfo.errorMsg;
      }
    }
    return (
          <div className={`input-common-wrap ${props.errorInfo ? 'error' : ''}`}>
          <input disabled={props.isDisabled}
            ref={textboxRef}
            className={`form-control input-normal ${props.errorInfo ? 'error' : ''} ${props.isDisabled ? 'disable' : ''}`}
            defaultValue={defaultVal} type="text"
            placeholder={getPlaceHolder(fieldInfo)}
            value={valueEdit}
            onChange={onChangeValueEdit}
            onBlur={() => setValueEdit(_.trim(valueEdit))}
          />
          {msg && <span className="messenger word-break-all">{msg}</span>}
          </div>
    )
  }
  return renderComponentEdit();
});

export default FieldEditPhoneNumber
