import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { translate } from 'react-jhipster';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { getPlaceHolder, toKatakana } from 'app/shared/util/string-utils';
import _ from 'lodash';

type IFieldEditEmailProps = IDynamicFieldProps;

const FieldEditEmail = forwardRef((props: IFieldEditEmailProps, ref) => {
  const [valueEdit, setValueEdit] = useState('');
  const { fieldInfo } = props;
  const textboxRef = useRef(null);

  const makeKeyUpdateField = () => {
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    return keyObject;
  }

  useImperativeHandle(ref, () => ({
    resetValue() {
      setValueEdit('');
    },
    setValueEdit(val) {
      if (!_.isEqual(valueEdit, val)) {
        setValueEdit(val);
      }
    }
  }));

  useEffect(() => {
    if (!props.isDisabled && props.updateStateElement) {
      props.updateStateElement(makeKeyUpdateField(), fieldInfo.fieldType, !_.isNil(valueEdit) && valueEdit.length > 0 ? valueEdit.toString() : '');
    }
  }, [valueEdit]);

  const onChangeValueEdit = (event) => {
    const val = event.target.value;
    if (fieldInfo.isDefault && !_.isNil(fieldInfo.maxLength) &&
      val.length > fieldInfo.maxLength) {
      setValueEdit(val.slice(0, fieldInfo.maxLength));
      return;
    }
    setValueEdit(val);
  }

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
        } else if (!_.isNil(props.errorInfo.errorParams)) {
          params = props.errorInfo.errorParams
        }
        if (props.errorInfo.errorCode === 'ERR_COM_0027') {
          params['0'] = fieldInfo.maxLength;
        }
        if (props.errorInfo.errorCode === 'ERR_EMP_0004') {
          params['values'] = props.errorInfo['email'];
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
          onBlur={() => setValueEdit(toKatakana(valueEdit))}
        />
        {msg && <span className="messenger">{msg}</span>}
        </div>
    )
  }
  return renderComponentEdit();
});

export default FieldEditEmail
