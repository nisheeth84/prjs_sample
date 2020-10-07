import React, { useImperativeHandle, useState, useEffect, forwardRef } from 'react';
import { useId } from 'react-id-generator';
import { translate} from 'react-jhipster';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import TimePicker from '../component/time-picker';
import { timeTzToUtc, timeUtcToTz } from 'app/shared/util/date-utils';
import _ from 'lodash';
type IFieldListFilterTimeProps = IDynamicFieldProps


/**
 * Component for mode filter time
 *
 * @param props
 */
const FieldListFilterTime = forwardRef((props: IFieldListFilterTimeProps, ref) => {
  const [valueFilter, setValueFilter] = useState(null);
  const [searchBlank, setSearchBlank] = useState(false);
  const [valueFrom, setValueFrom] = useState('');
  const [valueTo, setValueTo] = useState('');
  const [isFirst, setIsFirst] = useState(true);

  const idRadio = useId(2, "fieldtime_radio_");
  const nameRadio = useId(1, "fieldtime_radioGroup_");

  const trimSecond = (timeString) =>{
    if(!timeString){
      return timeString;
    }
    const timeStringArray = timeString.split(":");
    if(timeStringArray.length > 2){
      return `${timeStringArray[0]}:${timeStringArray[1]}`
    } else {
      return timeString;
    }
  }

  const initialize = () => {
    if (props.elementStatus) {
      if(props.elementStatus['savedFieldValue'] && props.elementStatus['savedFieldValue'].length > 0){
        const savedValue = props.elementStatus['savedFieldValue'][0];
        setValueFrom(trimSecond(savedValue['from']));
        setValueTo(trimSecond(savedValue['to']));
      } else {
        let valueFilterProps = null;
        try {
          if (_.isString(props.elementStatus.valueFilter)) {
            valueFilterProps = JSON.parse(props.elementStatus.valueFilter);
          } else {
            valueFilterProps = props.elementStatus.valueFilter;
          }
        } catch {
          valueFilterProps = [];
        }
        if((valueFilterProps && valueFilterProps.length > 0) || (valueFilterProps && valueFilterProps.from)) {
          setValueFilter(valueFilterProps);
          if (Array.isArray(valueFilterProps)) {
            setValueFrom(timeUtcToTz(trimSecond(valueFilterProps[0]['from'])));
            setValueTo(timeUtcToTz(trimSecond(valueFilterProps[0]['to'])));
          }
          if(_.isObject(valueFilterProps)){
            setValueFrom(timeUtcToTz(trimSecond(valueFilterProps['from'])));
            setValueTo(timeUtcToTz(trimSecond(valueFilterProps['to'])));
          }
        }
      }
      if(props.elementStatus.isSearchBlank) {
        setSearchBlank(props.elementStatus.isSearchBlank);
      }
      if(!Object.prototype.hasOwnProperty.call(props.elementStatus, 'isSearchBlank') && (props.elementStatus.valueFilter === '[]' || props.elementStatus.valueFilter === '')){
        setSearchBlank(true);
      }
    }
    setIsFirst(false)
  }
  useEffect(() => {
    initialize();
  }, []);

  useImperativeHandle(ref, () => ({
    resetValueFilter() {
      setValueFilter([]);
      setValueFrom('');
      setValueTo('');
      setSearchBlank(false);
    },
  }));

  useEffect(() => {
    if (props.updateStateElement) {
      const objValue = {valueFilter, searchBlank}
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, objValue)
    }
  }, [valueFilter, searchBlank]);

  const getTimezoneTime = (val, isFrom) => {
    if(!val){
      if(isFrom){
        val = '00:00:00';
      } else {
        val = '23:59:59';
      }
    }
    return timeTzToUtc(val);
  }

  useEffect(() => {
    if (props.updateStateElement && !isFirst) {
      const objValue = {}
      objValue['searchBlank'] = searchBlank
      objValue['valueFilter'] = [];
      objValue['savedFieldValue'] = [];
      if(valueFrom || valueTo){
        objValue['savedFieldValue'].push({"from":valueFrom, "to": valueTo});
        objValue['valueFilter'].push({from: getTimezoneTime(valueFrom, true), to: getTimezoneTime(valueTo, false)});
      }
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, objValue)
    }
  }, [valueFrom, valueTo, searchBlank])

  const fieldNamePlaceHolder = '00:00';
  return (
    <>
      <div className="wrap-check-radio">
        <span className="font-weight-500">{translate('dynamic-control.fieldFilterAndSearch.common.label.filter')}</span>
        <p className="radio-item">
          <input type="radio" id={idRadio[0]} name={nameRadio[0]} checked={!searchBlank} value='1' onChange={() => setSearchBlank(false)} />
          <label htmlFor={idRadio[0]} className="color-666">{translate('dynamic-control.fieldFilterAndSearch.layoutDateTime.radio.searchDate')}</label>
        </p>
        <p className="radio-item">
          <input type="radio" id={idRadio[1]} name={nameRadio[0]} checked={searchBlank} value='0' onChange={() => setSearchBlank(true)} />
          <label htmlFor={idRadio[1]} className="color-666">{translate('dynamic-control.fieldFilterAndSearch.layoutDateTime.radio.searchNone')}</label>
        </p>
      </div>
      {!searchBlank &&
      <div className="wrap-input-number mt-2">
        <TimePicker
          fieldInfo = {props.fieldInfo}
          divClass = "form-group form-group2 common has-delete mt-1"
          inputClass = "input-normal text-center"
          selectBoxClass = "filter-time-from l-0"
          isDisabled = {props.isDisabled}
          errorInfo = {props.errorInfo}
          onChangeTime = {(val) => setValueFrom(val)}
          enterInputControl = {props.enterInputControl}
          placeholder={fieldNamePlaceHolder}
          timeInit = {valueFrom}
          noPositionAbsolute = {1}
        />
        <span className="approximately color-999">〜</span>
        <TimePicker
          fieldInfo = {props.fieldInfo}
          divClass = "form-group form-group2 common has-delete mt-1"
          inputClass = "input-normal text-center"
          selectBoxClass = "filter-time-to location-r0"
          isDisabled = {props.isDisabled}
          errorInfo = {props.errorInfo}
          onChangeTime = {(val) => setValueTo(val)}
          enterInputControl = {props.enterInputControl}
          placeholder={fieldNamePlaceHolder}
          timeInit = {valueTo}
          noPositionAbsolute = {1}
        />
      </div>
      }
    </>
  );
})

export default FieldListFilterTime
