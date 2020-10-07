import React, { useImperativeHandle, useState, useEffect, forwardRef, useRef } from 'react';
import _ from 'lodash';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { ControlType } from 'app/config/constants';
import { getErrorMessage, getPlaceHolder, toKatakana } from 'app/shared/util/string-utils';

type IFieldEditTextAreaProps = IDynamicFieldProps;

const FieldEditTextArea = forwardRef((props: IFieldEditTextAreaProps, ref) => {
  const textboxRef = useRef(null);
  const {fieldInfo} = props;
  

  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }
  const [value, setValue] = useState(fieldInfo.defaultValue && type === ControlType.ADD ? fieldInfo.defaultValue : '');
  useImperativeHandle(ref, () => ({
    resetValue() {
      setValue('');
    },
    setValueEdit(val) {
      if (!_.isEqual(value, val)) {
        setValue(val);
      }
    }
  }));

  const getStyleClass = (attr: string) => {
    return _.get(props.fieldStyleClass, `textArea.edit.${attr}`)
  }

  const initialize = () => {
    let defaultVal = '';
    if (props.elementStatus) {
      defaultVal = props.elementStatus.fieldValue
    } else if (type === ControlType.ADD) {
      defaultVal = fieldInfo.defaultValue;
    }
    if (props.updateStateElement) {
        const keyObject = {itemId: null, fieldId: fieldInfo.fieldId};
        if (props.elementStatus) {
          keyObject.itemId = props.elementStatus.key;
        }
        props.updateStateElement(keyObject, fieldInfo.fieldType, defaultVal);
    }
    setValue(defaultVal);
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (props.isFocus && textboxRef && textboxRef.current) {
      textboxRef.current.focus();
    }
  }, [props.isFocus]);

  useEffect(() => {
    if(!props.updateStateElement || props.isDisabled) {
      return;
    }
    const keyObject = {itemId: null, fieldId: fieldInfo.fieldId};
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    props.updateStateElement(keyObject, fieldInfo.fieldType, value);
  }, [value]);

  const onChangeValueEdit = (event) => {
    const val = event.target.value;
    if (fieldInfo.isDefault && !_.isNil(fieldInfo.maxLength) &&
      val.length > fieldInfo.maxLength) {
      setValue(val.slice(0, fieldInfo.maxLength));
      return;
    }
    setValue(val);
  }


  const renderComponentEdit = () => {
    const msg = getErrorMessage(props.errorInfo);
    return (
      <>
          <div className={`input-common-wrap ${props.errorInfo ? 'error' : ''}`}>
          <textarea disabled={props.isDisabled}
          ref={textboxRef}
          className={`${getStyleClass('input')} ${type === ControlType.EDIT_LIST ? 'unset-min-height middle d-block' : ''} ${props.isDisabled ? 'disable' : ''}`}
          value={value}
          placeholder={getPlaceHolder(fieldInfo)}
          onChange={onChangeValueEdit}
          rows={type === ControlType.EDIT_LIST ? 1 : 0}
          onBlur={(e) => setValue(toKatakana(e.target.value))}
        />
        {msg && <span className="messenger-error d-block word-break-all">{msg}</span>}
        </div>
      </>
    )
  }


  const renderComponent = () => {
    return renderComponentEdit();
  }

  return renderComponent();
});

export default FieldEditTextArea
