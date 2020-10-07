import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import FieldEditTime from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-time';
import { translate } from 'react-jhipster';
import { timeFormat } from '../constants';
import moment from 'moment';
import { timeUtcToTz, timeTzToUtc } from 'app/shared/util/date-utils';
import { getErrorMessage, getFieldLabel } from 'app/shared/util/string-utils';
import InputNumeric from '../common/input-numeric';
import { CommonUtil } from '../common/common-util';

type IFieldActivityDurationProp = StateProps & DispatchProps & {
  className?: string
  firstErrorItem?: string
  errors?: { rowId, item, errorCode, errorMsg, params: {} }[]
  isDisabled?: boolean
  isRequired?: boolean
  tabIndex?: number
  itemDataField: any
  elementStatus?: any
  updateStateField: (fieldName, value) => void
  startTime?: any
  endTime?: any
  duration?: any
  errorInfo?: any
}


//   fieldLabel: string
//   itemDataFields: any[]
//   firstItemDataStatus: any
//   secondItemDataStatus: any

/**
 * component for show activity duration
 * @param props
 */
const FieldActivityDuration = (props: IFieldActivityDurationProp) => {
  const current = moment();
  const endTime = moment().add(-current.minute() % 5, 'm');
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const durationRef = useRef(null);

  // from GTM 0 => Time GMT config ( HH:MM )
  const convertStringDateToTimeDefault = (date: string) => {
    if (!date) {
      return null;
    }
    return date.slice(0, 16).split('T')[1];
  }

  const [durationCheckbox, setDurationCheckbox] = useState(!props.startTime);
  const [activityStartTime, setActivityStartTime]  = useState(convertStringDateToTimeDefault(props.startTime) || timeTzToUtc(endTime.clone().add(-1, 'h').format(timeFormat)));
  const [activityEndTime, setActivityEndTime] = useState(convertStringDateToTimeDefault(props.endTime) || timeTzToUtc(endTime.format(timeFormat)));
  const [activityDuration, setActivityDuration] = useState(props.duration || 60);
  const [isDidMount, setIsDidMount]   = useState(false);

  const calDuration = (_startTime?, _endTime?) => {
    const start = moment.utc(timeUtcToTz(_startTime || activityStartTime), timeFormat);
    const end = moment.utc(timeUtcToTz(_endTime || activityEndTime), timeFormat);
    const duration = (end.hour() * 60 + end.minute()) - (start.hour() * 60 + start.minute());
    setActivityDuration(duration);
    durationRef?.current?.setValueEdit && durationRef.current.setValueEdit(duration);
  }

  /**
   * on change start time/ end time/ duration check box
   * @param _startTime
   * @param _endTime
   */
  const onChangeStartTime = (_startTime?, _endTime?) => {
    if(isDidMount){
      if(_startTime) setActivityStartTime(_startTime);
      if(_endTime) setActivityEndTime(_endTime);
      if (durationCheckbox && activityStartTime) {
        const start = moment(_startTime || activityStartTime, timeFormat);
        const end = start.clone().add(1, 'h');
        setActivityDuration(60);
        durationRef?.current?.setValueEdit && durationRef.current.setValueEdit(60);
        setActivityEndTime(end.format(timeFormat));
        endTimeRef.current.setValueEdit(end.format(timeFormat));
      } else {
        calDuration(_startTime, _endTime);
      }
    }
  }

  const onChangeEndTime = (_startTime?, _endTime?) => {
    if(isDidMount){
      if(_startTime) setActivityStartTime(_startTime);
      if(_endTime) setActivityEndTime(_endTime);
      if (durationCheckbox && activityEndTime) {
        const end = moment(_endTime || activityEndTime, timeFormat);
        const start =  end.clone().add(-1, 'h');
        setActivityDuration(60);
        durationRef?.current?.setValueEdit && durationRef.current.setValueEdit(60);
        setActivityStartTime(start.format(timeFormat));
        startTimeRef.current.setValueEdit(start.format(timeFormat));
      } else {
        calDuration(_startTime, _endTime);
      }
    }
  }

  useEffect(() => {
    onChangeStartTime();
  }, [durationCheckbox])

  const updateStateElement = ( val) => {
    props.updateStateField('activityDuration', val);
  }


  useEffect(() => {
    props.updateStateField('activityDuration', activityDuration);
  }, [activityDuration])

  useEffect(()=>{
    startTimeRef?.current?.setValueEdit && startTimeRef.current.setValueEdit(activityStartTime);
    endTimeRef?.current?.setValueEdit && endTimeRef.current.setValueEdit(activityEndTime);
    durationRef?.current?.setValueEdit && durationRef.current.setValueEdit(activityDuration);
    setTimeout(()=>{
      setIsDidMount(true);
    }, 1000)
  }, [])
  const msg = getErrorMessage(props.errorInfo);
  const errorParams = props.errorInfo?.errorParams || "";
  return (
    <div className="col-lg-6 form-group">
      <label className="font-weight-bold">
        {getFieldLabel(props.itemDataField, 'fieldLabel')}
        <a className="label-red ml-1">{translate('activity.common.required')}</a>
      </label>
      <div className="wrap-check activity-duration">
        <div className={`wrap-input-date version2 version3 mb-0 mt-0 ${msg && msg.length > 0 ? "error" : ""}`}>
          <div className="form-control-wrap">
            <FieldEditTime fieldInfo={{ ...props.itemDataField, fieldName: 'activity_start_time' }}
              fieldStyleClass={{ timeBox: { edit: { wrapInput: 'input-normal', input: `input-normal input-common2 version2 text-center w100px w124 ${errorParams === 'activityStartTime' || errorParams === 'activityChoiseTheTime' ? 'error' : ''}` } } }}
              isDisabled={props.isDisabled}
              updateStateElement={(keyElement, type, objEditValue) => {
                onChangeStartTime(objEditValue, activityEndTime);
                props.updateStateField('activity_start_time', objEditValue);
              }}
              ref={startTimeRef}
            />
          </div>
          <span className="approximately ml-2 mr-2">〜</span>
          <div className="form-control-wrap">
            <FieldEditTime fieldInfo={{ ...props.itemDataField, fieldName: 'activity_end_time' }}
              fieldStyleClass={{ timeBox: { edit: { wrapInput: 'input-normal', input: `input-normal input-common2 version2 text-center w100px w124 ${errorParams === 'activityEndTime' || errorParams === 'activityChoiseTheTime' ? 'error' : ''}` } } }}
              isDisabled={props.isDisabled}
              updateStateElement={(keyElement, type, objEditValue) => {
                onChangeEndTime(activityStartTime, objEditValue);
                props.updateStateField('activity_end_time', objEditValue);
              }}
              ref={endTimeRef}
            />
          </div>
          <InputNumeric defaultValue={props.duration}
            updateStateElement={updateStateElement}
            ref={durationRef}
            // isPositive={true}
            isDisabled={props.isDisabled}
            wrapLabel={`${translate('activity.modal.minute')}`} 
            inputClassName={`input-normal input-common2 text-right pr-0 ml-2 ${errorParams === 'activityDuration' ? 'error' : ''}`}/>
        </div>
        {msg && <span className="messenger-error">{msg}</span>}
        <div className="wrap-check-box">
          <p className="check-box-item flex-100">

            {durationCheckbox &&
              <label className={props.isDisabled ? "icon-check icon-check-disable" : "icon-check"}>
                <input disabled={props.isDisabled} type="checkbox" defaultChecked onChange={(e) => {
                  if (!props.isDisabled) {
                    setDurationCheckbox(e.target.checked)
                  }
                }} 
                /><i /> {translate('activity.modal.checkbox-duration')}
              </label>
            }
            {!durationCheckbox &&
              <label className={props.isDisabled ? "icon-check icon-check-disable" : "icon-check"}>
                <input disabled={props.isDisabled} type="checkbox" onChange={(ev) => {
                  if (!props.isDisabled) {
                    setDurationCheckbox(ev.target.checked)
                  }
                }}/><i /> {translate('activity.modal.checkbox-duration')}
              </label>
            }
          </p>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FieldActivityDuration);
