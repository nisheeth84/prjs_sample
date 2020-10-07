import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import {  translate } from 'react-jhipster';
import { ControlType, UNIT_POSITION } from 'app/config/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import _ from 'lodash';
import { replaceAll, autoFormatNumber, getFieldLabel, isValidNumber } from 'app/shared/util/string-utils';
import { DynamicControlAction } from '../../constants';

type IFieldEditNumericProps = IDynamicFieldProps;

/**
 * Component for mode edit numberic
 *
 * @param props
 */
const FieldEditNumeric = forwardRef((props: IFieldEditNumericProps, ref) => {
  const textboxRef = useRef(null);
  const { fieldInfo } = props;
  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }

  const [valueEdit, setValueEdit] = useState('');

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

  const getPlaceHolder = (item) => {
    const fieldLabel = getFieldLabel(item, 'fieldLabel');
    return translate(`dynamic-control.fieldTypePlaceholder.${item.fieldType}`, { fieldLabel });
  }

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
    if (props.updateStateElement) {
      const numberEdit = replaceAll(_.toString(valueEdit), ',', '');
      props.updateStateElement(makeKeyUpdateField(), fieldInfo.fieldType, numberEdit.length > 0 ? numberEdit : '');
    }
    // setValueEdit(autoFormatNumber(valueEdit.toString(), props.fieldInfo.decimalPlace));
  }, [valueEdit]);

  /**
   * initialize defaultVal
   */
  const initialize = () => {
    let defaultVal = '';
    if (props.elementStatus) {
      defaultVal = props.elementStatus.fieldValue
    } else if (type === ControlType.ADD) {
      defaultVal = fieldInfo.defaultValue
    }
    // if (type === ControlType.EDIT) {
    if (defaultVal !== null && defaultVal !== undefined) {
      setValueEdit(autoFormatNumber(defaultVal.toString(), props.fieldInfo.decimalPlace));
    }
    // }
  };

  useEffect(() => {
    initialize();
  }, []);

  /**
   * validate when user input
   *
   * @param event
   */
  const onChangeValueEdit = (event) => {
    if (!props.isDisabled && (event.target.value === '' || isValidNumber(event.target.value, _.get(props, 'fieldInfo.decimalPlace')))) {
      const val = event.target.value;
      if (fieldInfo.isDefault && !_.isNil(fieldInfo.maxLength) &&
        val.length > fieldInfo.maxLength) {
        setValueEdit(val.slice(0, fieldInfo.maxLength));
        return;
      }
      setValueEdit(val);
      if (props.onExecuteAction) {
        const numberEdit = replaceAll(val, ',', '');
        props.onExecuteAction(fieldInfo, DynamicControlAction.USER_CHANGE, numberEdit)
      }
    }
  }

  /**
   * textEditHandleKeyUp
   *
   * @param event
   */
  const textEditHandleKeyUp = (event) => {
    setValueEdit(event.target.value);
  }

  /**
   * when KeyDown auto display whith decimalPart
   *
   * @param e
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && props.enterInputControl) {
      props.enterInputControl(e);
      event.preventDefault();
    }
  }

  /**
   * getStyleClass by type
   *
   * @param attr
   */
  const getStyleClass = (attr: string) => {
    if (type === ControlType.EDIT_LIST) {
      return _.get(props.fieldStyleClass, `numberBox.editList.${attr}`);
    } else {
      return _.get(props.fieldStyleClass, `numberBox.edit.${attr}`);
    }
  }

  let msg = null;
  if (props.errorInfo) {
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

  useEffect(() => {
    if (props.isFocus && textboxRef && textboxRef.current) {
      textboxRef.current.focus();
    }
  }, [props.isFocus])

  // const renderComponentEdit = () => {
  //   return <></>;
  // }

  // const renderComponentEditList = () => {
  //   return <></>;
  // }

  const renderComponent = () => {
    // if (type === ControlType.EDIT) {
    //   return renderComponentEdit();
    // } else if (type === ControlType.EDIT_LIST) {
    //   return renderComponentEditList();
    // }
    // return <></>;
    return (
      <>
        <div className={`${getStyleClass('wrapInput')} ${props.errorInfo ? 'error' : ''} ${props.isDisabled ? 'disable' : ''}`}>
          {props.fieldInfo && props.fieldInfo.typeUnit === UNIT_POSITION.START &&
            <span className={`currency1 ${type === ControlType.EDIT_LIST ? 'position-static white-space-nowrap pl-12 line-height' : ''}`}>{props.fieldInfo.currencyUnit}</span>
          }
          <input disabled={props.isDisabled}
            ref={textboxRef}
            type="text"
            className={`${getStyleClass('input')} ${props.fieldInfo.typeUnit === UNIT_POSITION.END ? 'pr-0' : ''}`}
            placeholder={getPlaceHolder(fieldInfo)}
            value={valueEdit}
            onBlur={() => setValueEdit(autoFormatNumber(valueEdit, props.fieldInfo.decimalPlace))}
            onFocus={() => !_.isEmpty(valueEdit) && setValueEdit(replaceAll(valueEdit, ',', ''))}
            onChange={onChangeValueEdit}
            onKeyUp={textEditHandleKeyUp}
            onKeyDown={handleKeyDown}
          />
          {props.fieldInfo && props.fieldInfo.typeUnit === UNIT_POSITION.END &&
            <span className={`currency ml-1 ${props.fieldInfo['noMarginLeft'] ? "" : "position-static" }`}>{props.fieldInfo.currencyUnit}</span>
          }
          {valueEdit && valueEdit.length > 0 && <span className="delete" onClick={() => setValueEdit('')} />}
        </div>
        {msg && <span className="messenger-error d-block word-break-all">{msg}</span>}
      </>
    )
  }

  return renderComponent();
});

export default FieldEditNumeric
