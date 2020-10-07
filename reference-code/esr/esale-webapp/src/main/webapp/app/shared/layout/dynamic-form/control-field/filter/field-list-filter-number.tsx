import React, { useImperativeHandle, useState, useEffect, forwardRef } from 'react';
import { useId } from 'react-id-generator';
import { translate} from 'react-jhipster';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import {DEFINE_FIELD_TYPE} from '../../constants'
import { replaceAll, autoFormatNumber, isValidNumber, removeNumericComma } from 'app/shared/util/string-utils';
import _ from 'lodash';
import { JSON_STRINGIFY } from 'app/modules/calendar/models/common-type';

type IFieldListFilterNumberProps = IDynamicFieldProps


/**
 * Component for mode filter numberic
 *
 * @param props
 */
const FieldListFilterNumber = forwardRef((props: IFieldListFilterNumberProps, ref) => {

  const [valueFilter, setValueFilter] = useState(null);
  const [searchBlank, setSearchBlank] = useState(false);
  const [valueFrom, setValueFrom] = useState(null);
  const [valueTo, setValueTo] = useState(null);

  const idRadio = useId(9, "filter_list_radio_");
  const nameRadio = useId(2, "filter_list_radio_name_");
  const UNIT = 1;

  const isFieldNumber = () => {
    return (
      props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC ||
      props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION
    )
  }

  const initialize = () => {
    if (props.elementStatus) {
      let valueFilterProps = null;
      try {
        if (_.isString(props.elementStatus.valueFilter)) {
          valueFilterProps = JSON.parse(props.elementStatus.valueFilter);
        } else {
          valueFilterProps = props.elementStatus.valueFilter;
        }
      } catch {
        valueFilterProps = null;
      }
      if(valueFilterProps){
        setValueFilter(valueFilterProps);
        setValueFrom(autoFormatNumber(valueFilterProps['from'], props.fieldInfo.decimalPlace));
        setValueTo(autoFormatNumber(valueFilterProps['to'], props.fieldInfo.decimalPlace));
      }
      if(props.elementStatus.isSearchBlank) {
        setSearchBlank(props.elementStatus.isSearchBlank);
      }
      if(!Object.prototype.hasOwnProperty.call(props.elementStatus, 'isSearchBlank') && (props.elementStatus.valueFilter === '[]' || props.elementStatus.valueFilter === '')){
        setSearchBlank(true);
      }
    }
  }

  useImperativeHandle(ref, () => ({
    resetValueFilter() {
      setValueFilter(null);
    },
  }));

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (props.updateStateElement) {
      const objValue = {valueFilter: valueFilter ? (_.isString(valueFilter) ? valueFilter :  JSON.stringify(valueFilter)) : valueFilter, searchBlank}
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, objValue)
    }
  }, [valueFilter, searchBlank]);

  /**
   * handle Choose Status Change
   *
   * @param event
   */
  const onChooseStatusChange = (event) => {
    const isShow = event.target.value === "1";
    setSearchBlank(!isShow);
  }

  const onChangeRangeFilter = (e, isFrom) => {
    const { value } = e.target;
    let tmp = null;
    let obj = {from: null, to: null}
    if (isFieldNumber()) {
      const check = isValidNumber(value, _.get(props, 'fieldInfo.decimalPlace'));
      if (value === '' || check) {
        isFrom ? setValueFrom(value) : setValueTo(value);
        isFrom ? (obj = {from: value, to: valueTo}) : (obj = {from: valueFrom, to: value});
      } else {
        return;
      }
    } else {
      isFrom ? setValueFrom(value) : setValueTo(value);
    }
    if (obj.from || obj.to) {
      obj.from = removeNumericComma(obj.from);
      obj.to = removeNumericComma(obj.to);
      tmp = JSON.stringify(obj);
      setValueFilter(tmp);
    } else {
      setValueFilter(null);
    }
  }

  const getClassByTypeUnit = (typeUnit : number, currencyUnit : string) => {
    if (_.isNil(currencyUnit) || !currencyUnit) {
      if (typeUnit === UNIT) {
        return "pr-1";
      }else {
        return "pr-3";
      }
    } else {
      if (typeUnit === UNIT) {
        return "pr-0 w82";
      }
      if (typeUnit !== UNIT) {
        return "mr-1"
      }
    }
    
  }

  const prefix = 'dynamic-control.fieldFilterAndSearch.layoutNumberic.';
  return (
    <>
      <div className="wrap-check-radio">
        <span className="font-weight-500">{translate('dynamic-control.fieldFilterAndSearch.common.label.filter')}</span>
        <p className="radio-item">
          <input type="radio" id={idRadio[0]} name={nameRadio[0]} checked={!searchBlank} value='1' onChange={onChooseStatusChange} />
          <label htmlFor={idRadio[0]} className="color-666">{translate(prefix + 'radio.searchRange')}</label>
        </p>
        <p className="radio-item">
          <input type="radio" id={idRadio[1]} name={nameRadio[0]} checked={searchBlank} value='0' onChange={onChooseStatusChange} />
          <label htmlFor={idRadio[1]} className="color-666">{translate(prefix + 'radio.searchNone')}</label>
        </p>
      </div>
      {!searchBlank && <>
        <div className="d-flex flex-nowrap align-items-center mt-3">
          <div className="form-control-wrap currency-form flex-180">
            {props.fieldInfo.typeUnit !== UNIT && <span className="currency1 position-static white-space-nowrap pl-12 line-height">{props.fieldInfo.currencyUnit}</span>}
            <input type="text" className={`input-normal input-common2 text-right ${getClassByTypeUnit(props.fieldInfo.typeUnit,props.fieldInfo.currencyUnit)}`}
            value={valueFrom}
            onChange={(e) => onChangeRangeFilter(e, true)}
            onKeyUp={(e) => onChangeRangeFilter(e, true)}
            onKeyDown={(e) => onChangeRangeFilter(e, true)}
            onBlur={() => setValueFrom(autoFormatNumber(valueFrom,props.fieldInfo.decimalPlace))}
            onFocus={() => setValueFrom(replaceAll(valueFrom, ',', ''))}
            />
            {props.fieldInfo.typeUnit === UNIT && <span className={`currency position-static ${(_.isNil(props.fieldInfo.currencyUnit) || !props.fieldInfo.currencyUnit) ? 'ml-0' : ''}`}>{props.fieldInfo.currencyUnit}</span>}
          </div>
          <p className="ml-3 white-space-nowrap mb-0">{translate(prefix + 'label.from')}</p>
        </div>
        <div className="d-flex flex-nowrap align-items-center my-3">
          <div className="form-control-wrap currency-form flex-180">
          {props.fieldInfo.typeUnit !== UNIT && <span className="currency1 position-static white-space-nowrap pl-12 line-height">{props.fieldInfo.currencyUnit}</span>}
            <input type="text" className={`input-normal input-common2 text-right ${getClassByTypeUnit(props.fieldInfo.typeUnit, props.fieldInfo.currencyUnit)}`}
            value={valueTo}
            onChange={(e) => onChangeRangeFilter(e, false)}
            onKeyUp={(e) => onChangeRangeFilter(e, false)}
            onKeyDown={(e) => onChangeRangeFilter(e, false)}
            onBlur={() => setValueTo(autoFormatNumber(valueTo,props.fieldInfo.decimalPlace))}
            onFocus={() => setValueTo(replaceAll(valueTo, ',', ''))}
            />
            {props.fieldInfo.typeUnit === UNIT && <span className={`currency position-static ${(_.isNil(props.fieldInfo.currencyUnit) || !props.fieldInfo.currencyUnit) ? 'ml-0' : ''}`}>{props.fieldInfo.currencyUnit}</span>}
          </div>
          <p className="ml-3 white-space-nowrap mb-0">{translate(prefix + 'label.to')}</p>
        </div>
      </>}
    </>
  );
})


export default FieldListFilterNumber
