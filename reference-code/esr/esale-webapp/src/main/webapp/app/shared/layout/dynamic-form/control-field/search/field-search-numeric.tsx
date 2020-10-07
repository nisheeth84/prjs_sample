import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { useId } from "react-id-generator";
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { translate } from 'react-jhipster';
import { replaceAll, autoFormatNumber, jsonParse, isValidNumber, removeNumericComma } from 'app/shared/util/string-utils';
import _ from 'lodash';


type IFieldSearchNumericProps = IDynamicFieldProps

/**
 * Component for mode search numberic
 *
 * @param props
 */
const FieldSearchNumeric = forwardRef((props: IFieldSearchNumericProps, ref) => {
  const [valueFrom, setValueFrom] = useState('');
  const [valueTo, setValueTo] = useState('');
  const [isSearchBlank, setIsSearchBlank] = useState(false);
  const idRadioList = useId(2, "numeric_radio_");
  const nameRadio = useId(1, "numeric_radioGroup_");
  const textboxFromRef = useRef(null);
  const textboxToRef = useRef(null);

  const {fieldInfo} = props;
  const UNIT = 1;

  /**
   * Handle Key Up textFrom
   *
   * @param event
   */
  const textFromHandleKeyUp = (event) => {
    setValueFrom(event.target.value);
  }

  /**
   * handle Change Text From
   *
   * @param event
   */
  const onChangeTextFrom = (event) => {
    if (event.target.value === '' || isValidNumber(event.target.value, _.get(props, 'fieldInfo.decimalPlace'))) {
      setValueFrom(event.target.value);
    }
  }

  /**
   * Handle Key Up text To
   *
   * @param event
   */
  const textToHandleKeyUp = (event) => {
    setValueTo(event.target.value);
  }

  /**
   * onChange value To
   *
   * @param event
   */
  const onChangeTextTo = (event) => {
    if (event.target.value === '' || isValidNumber(event.target.value, _.get(props, 'fieldInfo.decimalPlace'))) {
      setValueTo(event.target.value);
    }
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
   * initialize value
   */
  const initialize = () => {
    if (props.elementStatus && props.elementStatus.isSearchBlank !== null) {
      setIsSearchBlank(props.elementStatus.isSearchBlank);
    }

    if (props.elementStatus && props.elementStatus.fieldValue ) {
      let fromTo = props.elementStatus.fieldValue;
      if(_.isString(fromTo)){
        fromTo = jsonParse(fromTo);
      }
      if ( fromTo && fromTo.from && !_.isEqual(removeNumericComma(valueFrom),fromTo.from)) {
        setValueFrom(autoFormatNumber(fromTo.from.toString(),props.fieldInfo.decimalPlace));
      }
      if (fromTo && fromTo.to && !_.isEqual(removeNumericComma(valueTo),fromTo.to)) {
        setValueTo(autoFormatNumber(fromTo.to.toString(),props.fieldInfo.decimalPlace));
      }
    } 
    // else if(props.fieldInfo && props.fieldInfo.fieldValue) {
    //   const fromTo = JSON.parse(props.fieldInfo.fieldValue);
    //   if(fromTo.from) {
    //     setValueFrom(fromTo.from.toString());
    //   }
    //   if(fromTo.to) {
    //     setValueTo(fromTo.to.toString());
    //   }
    // }
    if(props.elementStatus && props.elementStatus['searchValue']) {
      const fromTo = jsonParse(props.elementStatus['searchValue'])[1];
      if(fromTo) {
        setValueFrom(jsonParse(fromTo).from.toString());
        setValueTo(jsonParse(fromTo).to.toString());
      }
      
    }
  };

  useEffect(() => {
    if (props.isFocus) {
      if (textboxFromRef && textboxFromRef.current) {
        textboxFromRef.current.focus();
      } else if (textboxToRef && textboxToRef.current) {
        textboxToRef.current.focus();
      }
    }
    initialize();
  }, []);

  useEffect(() => {
    if (!props.isDisabled && props.updateStateElement) {
      const conditions = {};
      conditions['fieldId'] = fieldInfo.fieldId;
      conditions['fieldType'] = fieldInfo.fieldType;
      conditions['isDefault'] = fieldInfo.isDefault ? fieldInfo.isDefault : false;
      conditions['fieldName'] = fieldInfo.fieldName;
      conditions['isSearchBlank'] = isSearchBlank;
      conditions['fieldValue'] = [];
      const valDown = removeNumericComma(valueFrom);
      const valUp = removeNumericComma(valueTo);
      if ((valDown && valDown.length > 0) || (valUp && valUp.length > 0)) {
        conditions['fieldValue'] = JSON.stringify({from: valDown, to: valUp});
      }
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, conditions)
    }
  }, [isSearchBlank, valueFrom, valueTo])

  const getClassByTypeUnit = (typeUnit : number, currencyUnit : string) => {
    if (_.isNil(currencyUnit) || !currencyUnit) {
      if (typeUnit === UNIT) {
        return "pr-1";
      }else {
        return "pr-3";
      }
    } else {
      if (typeUnit === UNIT) {
        return "pr-0";
      }
    }
    
  }

  const renderComponent = () => {
    return (
      <>
        <div className="right">
          <div className="wrap-check py-0">
            <div className="wrap-check-radio">
              <p className="radio-item w50 no-margin">
                <input
                  disabled={props.isDisabled}
                  type="radio" value='1'
                  name={nameRadio[0]}
                  id={idRadioList[0]}
                  checked={!isSearchBlank}
                  onChange={() => setIsSearchBlank(false)}/>
                <label htmlFor={idRadioList[0]}>{translate('dynamic-control.fieldFilterAndSearch.layoutNumberic.radio.searchRange')}</label>
              </p>
              <p className="radio-item">
                <input
                  disabled={props.isDisabled}
                  type="radio" value='0'
                  name={nameRadio[0]}
                  id={idRadioList[1]}
                  checked={isSearchBlank}
                  onChange={() => setIsSearchBlank(true)}/>
                <label htmlFor={idRadioList[1]}>{translate('dynamic-control.fieldFilterAndSearch.layoutNumberic.radio.searchNone')}</label>
              </p>
            </div>
            {!isSearchBlank && (<div className="wrap-input-number">
            <div className="form-group form-group2 common">
                <div className={`form-control-wrap currency-form ${props.isDisabled ? ' pointer-none': ''}`}>
                  <input disabled={props.isDisabled}
                    ref={textboxFromRef}
                    type="text"
                    className={`input-normal input-common text-right ${getClassByTypeUnit(props.fieldInfo.typeUnit, props.fieldInfo.currencyUnit)}`}
                    placeholder={translate('dynamic-control.fieldFilterAndSearch.layoutNumberic.placeholder.search')}
                    value={valueFrom}
                    onBlur={() => setValueFrom(autoFormatNumber(valueFrom,props.fieldInfo.decimalPlace))}
                    onFocus={() => setValueFrom(replaceAll(valueFrom, ',', ''))}
                    onChange= {onChangeTextFrom}
                    onKeyUp={textFromHandleKeyUp}
                    onKeyDown={handleKeyDown}
                  />
                  {props.fieldInfo.typeUnit === UNIT && <span className={`currency position-static ${(_.isNil(props.fieldInfo.currencyUnit) || !props.fieldInfo.currencyUnit) ? 'ml-0' : ''}`}>{props.fieldInfo.currencyUnit}</span>}
                  {valueFrom.length > 0 && <span className="delete" onClick={() => setValueFrom('')} />}
                  {props.fieldInfo.typeUnit !== UNIT && <span className="currency1">{props.fieldInfo.currencyUnit}</span>}
                </div>
              </div>
              <span className="approximately color-999 mb-3">{translate('dynamic-control.fieldFilterAndSearch.layoutNumberic.approximately')}</span>
              <div className="form-group form-group2 common">
                <div className={`form-control-wrap currency-form ${props.isDisabled ? ' pointer-none': ''}`}>
                  <input disabled={props.isDisabled}
                    ref={textboxToRef}
                    type="text"
                    className={`input-normal input-common text-right ${getClassByTypeUnit(props.fieldInfo.typeUnit, props.fieldInfo.currencyUnit)}`}
                    placeholder={translate('dynamic-control.fieldFilterAndSearch.layoutNumberic.placeholder.search')}
                    value={valueTo}
                    onBlur={() => setValueTo(autoFormatNumber(valueTo,props.fieldInfo.decimalPlace))}
                    onFocus={() => setValueTo(replaceAll(valueTo, ',', ''))}
                    onChange= {onChangeTextTo}
                    onKeyUp={textToHandleKeyUp}
                    onKeyDown={handleKeyDown}
                  />
                  {props.fieldInfo.typeUnit === UNIT && <span className={`currency position-static ${(_.isNil(props.fieldInfo.currencyUnit) || !props.fieldInfo.currencyUnit) ? 'ml-0' : ''}`}>{props.fieldInfo.currencyUnit}</span>}
                  {valueTo.length > 0 && <span className="delete" onClick={() => setValueTo('')} />}
                  {props.fieldInfo.typeUnit !== UNIT && <span className="currency1">{props.fieldInfo.currencyUnit}</span>}
                </div>
              </div>
            </div>)}
          </div>
        </div>
      </>
    );
  }

  return (
    <>{renderComponent()}</>
  );
})

export default FieldSearchNumeric
