import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import StringUtils, { getErrorMessage, getFieldLabel, getPlaceHolder, toKatakana } from 'app/shared/util/string-utils';
import { MODIFY_FLAG } from 'app/config/constants';
import _ from 'lodash';
export interface IFieldTextBoxDoubleColumnProps {
  className?: string
  firstErrorItem?: string;
  fieldLabel: string;
  itemDataFields: any[];
  firstItemDataStatus: any;
  secondItemDataStatus: any;
  errors?: { rowId; item; errorCode; errorMsg; params: {} }[];
  isDisabled?: boolean;
  isRequired?: boolean
  tabIndex?: any;
  updateStateField: (itemData, type, itemEditValue) => void;
}

const FieldTextBoxDoubleColumn = (props: IFieldTextBoxDoubleColumnProps) => {
  const { fieldLabel, itemDataFields, errors, firstErrorItem } = props;
  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  let firstClass = '';
  let secondClass = '';

  useEffect(() => {
    const firstFiled = StringUtils.snakeCaseToCamelCase(itemDataFields[0].fieldName);
    const secondFiled = StringUtils.snakeCaseToCamelCase(itemDataFields[1].fieldName);
    if (errors[0] && (firstErrorItem === firstFiled || firstErrorItem === secondFiled)) {
      firstRef.current?.focus();
      firstClass = 'auto-focus-input col-lg-6 form-group';
    } else if (firstErrorItem === secondFiled && errors[1]) {
      secondRef.current?.focus();
      secondClass = 'auto-focus-input col-lg-6 form-group'
    }
  }, [errors]);

  const onChangeValueText = (event, itemDataField, isFirst) => {
    if (!props.updateStateField && props.isDisabled) {
      return;
    }
    const changeVal = event.target.value;
    if (itemDataField.isDefault && !_.isNil(itemDataField.maxLength) &&
      changeVal.length > itemDataField.maxLength) {
      if (isFirst) {
        setFirstValue(changeVal.slice(0, itemDataField.maxLength));
      } else {
        setSecondValue(changeVal.slice(0, itemDataField.maxLength));
      }
      props.updateStateField(itemDataField, itemDataField.fieldType.toString(), changeVal.slice(0, itemDataField.maxLength));
      return;
    }

    if (isFirst) {
      setFirstValue(changeVal);
    } else {
      setSecondValue(changeVal);
    }
    props.updateStateField(itemDataField, itemDataField.fieldType.toString(), changeVal);

  };

  const convertToKatakana = (event, itemDataField, isFirst) => {
    if (!props.updateStateField && props.isDisabled) {
      return;
    }
    const changeVal = toKatakana(event.target.value);
    if (isFirst) {
      setFirstValue(changeVal);
    } else {
      setSecondValue(changeVal);
    }
    props.updateStateField(itemDataField, itemDataField.fieldType.toString(), changeVal);
  }

  useEffect(() => {    
    const firstDef = props.firstItemDataStatus ? props.firstItemDataStatus.fieldValue : itemDataFields[0].defaultValue;
    const secondDef = props.secondItemDataStatus ? props.secondItemDataStatus.fieldValue : itemDataFields[1].defaultValue;
    setFirstValue(firstDef);
    setSecondValue(secondDef);
    props.updateStateField(itemDataFields[0], itemDataFields[0].fieldType.toString(), firstDef);
    props.updateStateField(itemDataFields[1], itemDataFields[1].fieldType.toString(), secondDef);
  }, []);

  return (
    <div className={props.className ? props.className : "col-lg-12 form-group"}>
      <label>{fieldLabel}</label>
      <div className="row box-border">
        {itemDataFields.map((item, index) => {
          const error = getErrorMessage(errors[index]);
          return (
            <div className={`${props.errors[index] ? 'auto-focus-input col-lg-6 form-group' : 'col-lg-6 form-group'}`} key={item.fieldId}>
              <div className="form-group">
                <label>{getFieldLabel(item, 'fieldLabel')}
                  {(item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED)
                    && <a className="label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</a>}
                </label>
                <input tabIndex={props.tabIndex} type="text" className={`input-normal ${props.errors[index] ? 'error' : ''} ${props.isDisabled ? 'disable' : ''}`}
                  key={item.fieldId}
                  ref={index === 0 ? firstRef : secondRef}
                  value={index === 0 ? firstValue : secondValue}
                  disabled={props.isDisabled}
                  placeholder={getPlaceHolder(item)}
                  onChange={(event) => onChangeValueText(event, item, index === 0)}
                  onBlur={(event) => convertToKatakana(event, item, index === 0)}
                />
                {error && <span className="messenger-error">{error}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default FieldTextBoxDoubleColumn;
