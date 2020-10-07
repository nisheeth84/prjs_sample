import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useId } from 'react-id-generator';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE } from '../../constants';
import { translate } from 'react-jhipster';
import TimePicker from '../component/time-picker';
import { timeTzToUtc, timeUtcToTz, addSecondStartEnd } from 'app/shared/util/date-utils';
import _ from 'lodash';
import { jsonParse } from 'app/shared/util/string-utils';


type IFieldSearchTimeProps = IDynamicFieldProps

const FieldSearchTime = forwardRef((props: IFieldSearchTimeProps, ref) => {
  const [valueFrom, setValueFrom] = useState('');
  const [valueTo, setValueTo] = useState('');
  const [isSearchBlank, setIsSearchBlank] = useState(false);

  const idRadioList = useId(2, "fieldtime_radio_");
  const nameRadio = useId(1, "fieldtime_radioGroup_");

  useImperativeHandle(ref, () => ({

  }));

  const {fieldInfo} = props;

  const initialize = () => {
    const defaultVal = props.elementStatus && props.elementStatus.fieldValue;
    const searchBlank = props.elementStatus ? props.elementStatus.isSearchBlank : false;

    setIsSearchBlank(searchBlank);

    if (props.updateStateElement && !props.isDisabled && defaultVal) {
      let fromTo;
      if (!_.isArray(defaultVal)) {
        fromTo = jsonParse(props.elementStatus['fieldValue']);
      } else if (defaultVal.length > 0) {
        fromTo = defaultVal[0];
      } else {
        return;
      }
      setValueFrom(timeUtcToTz(fromTo.from.toString().substring(0, 5)));
      setValueTo(timeUtcToTz(fromTo.to.toString().substring(0, 5)));
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const DEFAULT_TIME_FROM = '00:00';
  const DEFAULT_TIME_TO = '23:59';

  useEffect(() => {
    const conditions = {};
    conditions['fieldId'] = fieldInfo.fieldId;
    conditions['fieldType'] = fieldInfo.fieldType;
    conditions['isDefault'] = fieldInfo.isDefault ? fieldInfo.isDefault : false;
    conditions['fieldName'] = fieldInfo.fieldName;
    conditions['fieldValue'] = [];
    conditions['savedFieldValue'] = [];
    if ((valueFrom && valueFrom.length > 0) || (valueTo && valueTo.length > 0)) {
      conditions['savedFieldValue'].push({from: addSecondStartEnd(valueFrom, true), to: addSecondStartEnd(valueTo, false)});
    }
    if((valueFrom && valueFrom.length > 0) || (valueTo && valueTo.length > 0)){
      const start = addSecondStartEnd(valueFrom ? timeTzToUtc(valueFrom, false) :timeTzToUtc(DEFAULT_TIME_FROM, false), true)
      const end = addSecondStartEnd(valueTo ? timeTzToUtc(valueTo, false) : timeTzToUtc(DEFAULT_TIME_TO, false), false)
      conditions['fieldValue'].push({from: start, to: end});
    }
    conditions['isSearchBlank'] = isSearchBlank;
    if (props.updateStateElement) {
      props.updateStateElement(fieldInfo, DEFINE_FIELD_TYPE.TIME, conditions);
    }
  }, [valueFrom, valueTo, isSearchBlank])

  const renderComponent = () => {
    const fieldNamePlaceHolder = '00:00';
    return (
      <>
        <div className="right">
          <div className="wrap-check py-0">
            <div className="wrap-check-radio">
              <p className={`radio-item w35 ${props.isDisabled ? ' pointer-none': ''}`}>
                <input
                  disabled={props.isDisabled}
                  type="radio" value='1'
                  name={nameRadio[0]}
                  id={idRadioList[0]}
                  checked={!isSearchBlank}
                  onChange={() => setIsSearchBlank(false)}/>
                <label htmlFor={idRadioList[0]}>{translate('dynamic-control.fieldFilterAndSearch.layoutDateTime.radio.searchDate')}</label>
              </p>
              <p className={`radio-item ${props.isDisabled ? ' pointer-none': ''}`}>
                <input
                  disabled={props.isDisabled}
                  type="radio" value='0'
                  name={nameRadio[0]}
                  id={idRadioList[1]}
                  checked={isSearchBlank}
                  onChange={() => setIsSearchBlank(true)}/>
                <label htmlFor={idRadioList[1]}>{translate('dynamic-control.fieldFilterAndSearch.layoutDateTime.radio.searchNone')}</label>
              </p>
            </div>
            {!isSearchBlank && (<div className="wrap-input-number w70">
              <div className="form-group form-group2 common has-delete mt-0">
                <TimePicker
                  fieldInfo = {props.fieldInfo}
                  inputClass = "input-normal"
                  isDisabled = {props.isDisabled}
                  errorInfo = {props.errorInfo}
                  onChangeTime = {(val) => setValueFrom(val)}
                  enterInputControl = {props.enterInputControl}
                  placeholder={fieldNamePlaceHolder}
                  timeInit = {valueFrom}
                />
              </div>
              <span className="approximately color-999 mb-3">{translate('dynamic-control.approximately')}</span>
              <div className="form-group form-group2 common has-delete mt-0">
              <TimePicker
                  fieldInfo = {props.fieldInfo}
                  inputClass = "input-normal"
                  isDisabled = {props.isDisabled}
                  errorInfo = {props.errorInfo}
                  onChangeTime = {(val) => setValueTo(val)}
                  enterInputControl = {props.enterInputControl}
                  placeholder={fieldNamePlaceHolder}
                  timeInit = {valueTo}
                />
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
});

export default FieldSearchTime
