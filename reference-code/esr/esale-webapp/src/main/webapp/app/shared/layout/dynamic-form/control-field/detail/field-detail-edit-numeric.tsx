import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react'
import _ from 'lodash';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { translate } from 'react-jhipster';
import { useId } from 'react-id-generator';
import {findErrorMessage,  replaceAll, autoFormatNumber, isValidNumber } from 'app/shared/util/string-utils';
import { UNIT_POSITION } from 'app/config/constants';
import { FIELD_MAXLENGTH } from '../../constants';
import { isCanSettingField } from 'app/shared/util/option-manager';

type IFieldDetailEditNumericProps = IDynamicFieldProps

/**
 * Component for mode setting numberic
 * 
 * @param props
 */
const FieldDetailEditNumeric = forwardRef((props: IFieldDetailEditNumericProps, ref) => {

  const [defaultValue, setDefaultValue] = useState('')
  const [typeUnit, setTypeUnit] = useState(0)
  const [currencyUnit, setCurrencyUnit] = useState('')
  const [decimalPlace, setDecimalPlace] = useState(-1);
  const [openDropdownDecimal, setOpenDropdownDecimal] = useState(false);
  const ddSelectDecimal = useRef(null)
  const idAutomatic = useId(2, "field_detail_numeric_id_");
  const nameAutomatic = useId(1, "field_detail_numeric_name_");
  const prefix = 'dynamic-control.fieldDetail.layoutNumberic.';

  useImperativeHandle(ref, () => ({

  }));

  const { fieldInfo, errorInfos } = props;

  /**
   * to hide dropdown
   * 
   * @param event 
   */
  const handleUserMouseDown = (event) => {
    if (ddSelectDecimal.current && !ddSelectDecimal.current.contains(event.target)) {
      setOpenDropdownDecimal(false);
    }
  };

  const autoCutDecimal = () => {
    if (!defaultValue.includes('.')) {
      return autoFormatNumber(defaultValue, decimalPlace);
    } else {
      const stringNumberAfterDot = defaultValue.slice(defaultValue.indexOf('.') + 1, defaultValue.length)
      const stringNumberBeforeDot = defaultValue.slice(0, defaultValue.indexOf('.'));
      if (stringNumberAfterDot.length < decimalPlace) {
        return autoFormatNumber(defaultValue, decimalPlace);
      } else {
        const suffix = stringNumberAfterDot.substr(0, decimalPlace);
        if (decimalPlace !== 0) {
          return stringNumberBeforeDot + '.' + suffix;
        } else {
          return stringNumberBeforeDot;
        }
      }
    }
  }

  useEffect (() => {
    setDefaultValue(autoCutDecimal());
  },[decimalPlace])

  /**
   * initialize defaultValue
   */
  const initialize = () => {
    if (fieldInfo.defaultValue) {
      setDefaultValue(fieldInfo.defaultValue);
    }
    if (fieldInfo.typeUnit !== null && fieldInfo.typeUnit !== undefined) {
      setTypeUnit(fieldInfo.typeUnit)
    }
    if (fieldInfo.currencyUnit) {
      setCurrencyUnit(fieldInfo.currencyUnit)
    }
    if (fieldInfo.decimalPlace !== null && fieldInfo.decimalPlace !== undefined) {
      setDecimalPlace(fieldInfo.decimalPlace);
    }
  }
  useEffect(() => {
    window.addEventListener('mousedown', handleUserMouseDown);
    initialize()
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, [])

  useEffect(() => {
    if (props.updateStateElement) {
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, { defaultValue : replaceAll(defaultValue, ',', ''), typeUnit, currencyUnit, decimalPlace })
    }
  }, [defaultValue, typeUnit, currencyUnit, decimalPlace]);

  /**
   * get Decimal Place to Display
   */
  const getDecimalPlaceDisplay = () => {
    if (decimalPlace < 0) {
      return translate(prefix + 'placeholder.decimal');
    } else {
      return `${decimalPlace !== 0 ? decimalPlace + translate(prefix + 'textNumber') : translate(prefix + 'doNotUse')}` 
    }
  }

  /**
   * handle Change DefaultValue
   * 
   * @param evt
   */
  const onChangeDefaultValue = (evt) => {
    const value = evt.target.value
    if ((value === '' || isValidNumber(value, decimalPlace)) && value.length <= FIELD_MAXLENGTH.defaultValue) {
      setDefaultValue(value);
    }
  }
    
  const renderComponent = () => {
    const defValError = findErrorMessage(errorInfos, 'defaultValue');
    const isShowDefaultValue = isCanSettingField(props.belong, fieldInfo.fieldName, 'defaultValue');
    return <>
      <div className="form-group">
        <label>{translate(prefix + 'label')}&ensp;
          <span className="label-red">{translate('dynamic-control.fieldDetail.common.label.required')}</span>
        </label>
        <div className={`input-common-wrap  ${defValError ? 'error' : ''}`}>
          <input type="text" className={`input-normal ${!isShowDefaultValue ? 'disable' : ''}`} placeholder={translate(prefix + 'placeholder.defaultValue')}
            disabled={!isShowDefaultValue}
            value={defaultValue}
            onChange={onChangeDefaultValue} 
            onBlur={() => setDefaultValue(autoFormatNumber(defaultValue, decimalPlace))}
            onFocus={() => setDefaultValue(replaceAll(defaultValue, ',', ''))}
            // onBlur={() => setDefaultValue(_.trim(defaultValue))} 
            />
        </div>
        {defValError && <span className="messenger-error">{defValError}</span>}
      </div>
      <div className="form-group">
        <label>{translate(prefix + 'label.currency')}</label>
        <div className="wrap-check-radio">
          <p className="radio-item">
            <input name={nameAutomatic[0]} id={idAutomatic[0]} type="radio" value={0}
              checked={typeUnit === 0}
              onChange={(e) => setTypeUnit(e.target.checked ? 0 : 1)} />
            <label htmlFor={idAutomatic[0]}>{translate(prefix + 'radio.symbol')}</label>
          </p>
          <p className="radio-item">
            <input name={nameAutomatic[0]} id={idAutomatic[1]} type="radio" value={1}
              checked={typeUnit === 1}
              onChange={(e) => setTypeUnit(e.target.checked ? 1 : 0)} />
            <label htmlFor={idAutomatic[1]}>{translate(prefix + 'radio.unit')}</label>
          </p>
        </div>
      </div>
      <div className="form-group">
        <div>
          <input type="text" className="input-normal"
            placeholder={translate(prefix + ((typeUnit === 0) ? 'placeholder.symbol' : 'placeholder.unit'))}
            value={currencyUnit}
            onBlur={() => {setCurrencyUnit(_.trim(currencyUnit))}}
            onChange={evt => evt.target.value.length <= FIELD_MAXLENGTH.unit && setCurrencyUnit(evt.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <div className="currency-wrap w40">
          <label>{translate(prefix + 'label.example')}</label>
          <div className="position-relative">
            <input type="text"
              readOnly
              className={`input-normal no-bg input-common2 ${typeUnit === UNIT_POSITION.START ? 'text-right' : ''}`}
              placeholder={translate(prefix + 'placeholder')}
              value={translate(prefix + 'exampleValue')}
            />
            <span className={typeUnit === UNIT_POSITION.END ? "currency" : "currency1"}>{currencyUnit}</span>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>{translate(prefix + 'label.formatDecimal')}</label>
        <div className="select-option w65">
          <button type="button" className="select-text text-left" onClick={() => setOpenDropdownDecimal(!openDropdownDecimal)}>{getDecimalPlaceDisplay()}</button>
          {openDropdownDecimal &&
            <ul className={"drop-down"} 
              ref={ddSelectDecimal}>
              {_.range(15).map((n, idx) =>
                <li key={idx} className={`item ${idx === decimalPlace ? 'active' : ''} smooth`}
                  onClick={() => {setDecimalPlace(idx); setOpenDropdownDecimal(false)}}
                >
                  {`${idx !== 0 ? idx + translate(prefix + 'textNumber') : translate(prefix + 'doNotUse')}`}
                </li>
              )}
            </ul>
          }
        </div>
      </div>
      <div className="form-group">
        <label>{translate(prefix + 'label.example')}</label>
        <div className="currency-wrap w40">
          <input type="text" className="input-normal no-bg input-common2" readOnly
            placeholder={(Number(1000).toFixed(decimalPlace < 0 ? 0 : decimalPlace).toString())}
            value={(Number(1000).toFixed(decimalPlace < 0 ? 0 : decimalPlace).toString())} />
        </div>
      </div>
    </>
  }
  return renderComponent();
});

export default FieldDetailEditNumeric
