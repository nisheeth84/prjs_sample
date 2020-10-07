import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { translate } from 'react-jhipster';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';
import { calculate } from 'app/shared/util/calculation-utils';
import { autoFormatNumber } from 'app/shared/util/string-utils';
import _ from 'lodash';
import useEventListener from 'app/shared/util/use-event-listener';

type IFieldEditCalculationProps = IDynamicFieldProps;

const FieldEditCalculation = forwardRef((props: IFieldEditCalculationProps, ref) => {
  const [value, setValue] = useState('');
  const [calculable, setCalculable] = useState(true);
  const { fieldInfo } = props;
  const textboxRef = useRef(null);


  const makeKeyUpdateField = () => {
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    return keyObject;
  };

  useEffect(() => {
    if (value && props.updateStateElement) {
      if (!/^-?\d*\.?\d*$/g.test(value)) {
        props.updateStateElement(makeKeyUpdateField(), fieldInfo.fieldType, null);
      } else {
        props.updateStateElement(makeKeyUpdateField(), fieldInfo.fieldType, +value);
      }
    }
  }, [value])

  useEffect(() => {
    if (calculable) {
      setValue(calculate(props.fieldInfo.configValue, props.elementStatus?.fieldValue, props.fieldInfo.decimalPlace));
    }
    // calculate();
  }, [props.elementStatus]);

  useImperativeHandle(ref, () => ({
    resetValue() {
      setValue('');
    },
    setValueEdit(val) {
      if (!_.isEqual(value, val)) {
        setCalculable(false);
        setValue(val);
      }
    }
  }));

  useEffect(() => {
    if (props.isFocus && textboxRef && textboxRef.current) {
      textboxRef.current.focus();
    }
  }, [props.isFocus])

  const onReceiveMessage = ev => {
    if (ev.data.type === DynamicControlAction.EDIT_NUMBER) {
      if (ev.data.fieldValue && props.recordId === ev.data.fieldValue.recordId) {
        setValue(calculate(props.fieldInfo.configValue, ev.data.fieldValue, props.fieldInfo.decimalPlace));
      }
    }
  };

  useEventListener('message', onReceiveMessage);

  const renderComponent = () => {
    return (
      <div className="position-relative">
        <input ref={textboxRef} className="input-normal input-case" type="text" disabled value={!/^-?\d*\.?\d*$/g.test(value) ? value : autoFormatNumber(value, props.fieldInfo.decimalPlace)} />
        <div className="left-input-case text-ellipsis">{translate(`dynamic-control.fieldTypeLabel.${DEFINE_FIELD_TYPE.CALCULATION}`)}</div>
      </div>
    );
  };
  return renderComponent();
});

export default FieldEditCalculation;
