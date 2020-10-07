import React, { useImperativeHandle, useState, useEffect, forwardRef, useRef } from 'react';
import _ from 'lodash';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { getErrorMessage, getPlaceHolder, toKatakana } from 'app/shared/util/string-utils';
import { ControlType } from 'app/config/constants';

type IFieldEditTextProps = IDynamicFieldProps;

const FieldEditText = forwardRef((props: IFieldEditTextProps, ref) => {
  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }
  const textboxRef = useRef(null);
  const { fieldInfo } = props;
  const [value, setValue] = useState(fieldInfo.defaultValue && type === ControlType.ADD ? fieldInfo.defaultValue : '');
  const [isChangeValue, setIsChangeValue] = useState(false);

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
    return _.get(props.fieldStyleClass, `textBox.edit.${attr}`)
  }

  const initialize = () => {
    let defaultVal = '';
    if (props.elementStatus) {
      defaultVal = props.elementStatus.fieldValue
    } else if (type === ControlType.ADD) {
      defaultVal = fieldInfo.defaultValue;
    }
    if (props.updateStateElement) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
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
    if (!props.updateStateElement || props.isDisabled) {
      return;
    }
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    props.updateStateElement(keyObject, fieldInfo.fieldType, value);
  }, [value]);

  const onChangeValueEdit = (event) => {
    setIsChangeValue(true);
    const val = event.target.value;
    if (fieldInfo.isDefault && !_.isNil(fieldInfo.maxLength) &&
      val.length > fieldInfo.maxLength) {
      setValue(val.slice(0, fieldInfo.maxLength));
      return;
    }
    setValue(val);
  }

  const onBlurValueEdit = (event) => {
    if (isChangeValue) {
      setValue(toKatakana(event.target.value));
    }
  }

  const renderComponent = () => {
    const msg = getErrorMessage(props.errorInfo);
    return (
      <>
        <div className={`input-common-wrap ${props.errorInfo ? 'error' : ''}`}>
          <input disabled={props.isDisabled}
            ref={textboxRef}
            className={`${getStyleClass('input')}  ${props.isDisabled ? 'disable' : ''}`}
            value={value} type="text"
            placeholder={getPlaceHolder(fieldInfo)}
            onChange={onChangeValueEdit}
            onBlur={onBlurValueEdit}
          />
          {msg && <span className="messenger-error d-block word-break-all">{msg}</span>}
        </div>
      </>
    )
  }

  return renderComponent();
});

export default FieldEditText
