import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { translate } from 'react-jhipster';
import { ControlType } from 'app/config/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import _ from 'lodash';
import { roundTime, getHourMinute, isValidTimeFormat, autoFormatTime, timeUtcToTz, timeTzToUtc, getCurrentTimeRoundUp, getDateTimeNowTz, isValidTimeInput } from 'app/shared/util/date-utils';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import useHandleShowFixedTip from 'app/shared/util/useHandleShowFixedTip';

type IFieldEditTimeProps = IDynamicFieldProps;

const FieldEditTime = forwardRef((props: IFieldEditTimeProps, ref) => {
  const [valueEdit, setValueEdit] = useState('');
  const [showAreaEdit, setShowAreaEdit] = useState(false);
  const [divStyle, setDivStyle] = useState(null);


  const [hourEdit, setHourEdit] = useState(0)
  const [minuteEdit, setMinuteEdit] = useState(0)
  const [showDelete, setShowDelete] = useState(false)
  const [oldValueEdit, setOldValueEdit] = useState("")
  const divRefAreaEdit = useRef(null)
  const divInput = useRef(null)
  const textboxRef = useRef(null);


  const [customStyle] = useHandleShowFixedTip({
    inputRef:divInput,
    overlayRef: divRefAreaEdit,
    isFixedTip: !!props.fieldInfo?.isFixedTip
  }, [showAreaEdit])

  const { fieldInfo } = props;
  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }

  const getScrollParent = (node) => {
    if (node == null) {
      return null;
    }
    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return getScrollParent(node.parentNode);
    }
  }

  const isValidTime = (strValue: string, isInit?: boolean) => {
    if (!strValue || strValue.toString().trim().length < 1) {
      return true;
    }
    if (!isValidTimeFormat(strValue, isInit)) {
      return false;
    }
    const hhMM = getHourMinute(strValue);
    if (hhMM.hour < 0 || hhMM.hour >= 24 || hhMM.minute < 0 || hhMM.minute >= 60) {
      return false;
    }
    return true;
  }

  const makeKeyUpdateField = () => {
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    return keyObject;
  }

  const initialize = () => {
    if (props.updateStateElement) {
      if (props.elementStatus && props.elementStatus.fieldValue) {
        const formatVal = autoFormatTime(props.elementStatus.fieldValue, true);
        const time = timeUtcToTz(formatVal);
        setValueEdit(time);
        setOldValueEdit(time);
      } else if (type === ControlType.ADD) {
        if (fieldInfo.configValue === "1") {
          const dateNow = getDateTimeNowTz();
          const dateNowStr = `${dateNow.getHours()}:${dateNow.getMinutes()}`;
          setValueEdit(dateNowStr);
          setOldValueEdit(dateNowStr);
        } else {
          const formatVal = autoFormatTime(fieldInfo.defaultValue, true);
          const time = timeUtcToTz(formatVal);
          setValueEdit(time);
          setOldValueEdit(time);
        }
      }
    }
  };

  const handleUserMouseDown = (event) => {
    if (divRefAreaEdit.current && !divRefAreaEdit.current.contains(event.target)) {
      setShowAreaEdit(false);
    }
  };

  const handleParentScroll = (event) => {
    if (type === ControlType.EDIT_LIST && divRefAreaEdit && divRefAreaEdit.current 
        && divRefAreaEdit.current.style.position === 'fixed') {
      const left = textboxRef.current.getBoundingClientRect().left;
      const top = textboxRef.current.getBoundingClientRect().top;
      const heightPcker = divRefAreaEdit.current.children[0].getClientRects()[0].height;
      divRefAreaEdit.current.style.left = `${left}px`;
      divRefAreaEdit.current.style.setProperty('top', `${top - heightPcker - 1}px`, 'important')
    }
  }

  useEffect(() => {
    initialize();
    window.addEventListener('mousedown', handleUserMouseDown);
    if (textboxRef && textboxRef.current) {
      const divScroll = getScrollParent(textboxRef.current);
      if (divScroll) {
        const elemDiv = document.getElementsByClassName(divScroll.className);
        if (elemDiv && elemDiv.length > 0) {
          for (let i = 0; i < elemDiv.length; i++) {
            if (elemDiv[i] === divScroll) {
              document.getElementsByClassName(divScroll.className)[i].addEventListener('scroll', handleParentScroll);
              break;
            }
          }
        }
      }
    }
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
      const nodeScroll = getScrollParent(textboxRef.current);
      if (nodeScroll) {
        const elemNode = document.getElementsByClassName(nodeScroll.className);
        if (elemNode && elemNode.length > 0) {
          for (let i = 0; i < elemNode.length; i++) {
            if (elemNode[i] === nodeScroll) {
              document.getElementsByClassName(nodeScroll.className)[i].removeEventListener('scroll', handleParentScroll);
              break;
            }
          }
        }
      }
    };
  }, []);

  useEffect(() => {
    if (props.isFocus && textboxRef && textboxRef.current) {
      textboxRef.current.focus();
    }
  }, [props.isFocus]);

  useEffect(() => {
    if (valueEdit && _.trim(valueEdit) && isValidTime(valueEdit)) {
      const hhMM = getHourMinute(valueEdit);
      setHourEdit(hhMM.hour);
      setMinuteEdit(hhMM.minute - hhMM.minute % 5)
    }
    if (props.updateStateElement) {
      const timeUpdate = timeTzToUtc(autoFormatTime(valueEdit));
      props.updateStateElement(makeKeyUpdateField(), fieldInfo.fieldType, timeUpdate);
    }
  }, [valueEdit])

  useEffect(() => {
    if (type === ControlType.EDIT_LIST && showAreaEdit && textboxRef && textboxRef.current && divRefAreaEdit && divRefAreaEdit.current) {
      let left = textboxRef.current.getBoundingClientRect().left;
      const top = textboxRef.current.getBoundingClientRect().top;
      const height = textboxRef.current.getBoundingClientRect().height;
      const heightPcker = divRefAreaEdit.current.children[0].getClientRects()[0].height;
      const space = window.innerHeight - (top + height);
      if (space < heightPcker) {
        if(props.isLastColumn){
          const lengthPicker = divRefAreaEdit.current.children[0].clientWidth;
          const lengthInput = divInput.current.children[0].clientWidth;
          left = left - (lengthPicker - lengthInput);
        }
        divRefAreaEdit.current.style.left = `${left}px`;
        divRefAreaEdit.current.style.setProperty('top', `${top - heightPcker - 1}px`, 'important')
        divRefAreaEdit.current.style.position = 'fixed';
      } else if (props.isLastColumn) {
        setDivStyle("location-r0");
      }
    }
  }, [showAreaEdit])

  // api call outside
  useImperativeHandle(ref, () => ({
    resetValue() {
      setValueEdit('');
    },
    setValueEdit(val) {
      if (!_.isEqual(valueEdit, val)) {
        setValueEdit(timeUtcToTz(autoFormatTime(val, true)));
      }
    }
  }));

  const textEditHandleKeyUp = (event) => {
    setValueEdit(event.target.value);
  }
  const onChangeValueEdit = (event) => {
    if (event.target.value === '' || isValidTimeInput(event.target.value)) {
      setValueEdit(event.target.value);
      if (!event.target.value || !_.trim(event.target.value)) {
        const dateNow = getCurrentTimeRoundUp();
        setHourEdit(dateNow.getHours());
        setMinuteEdit(dateNow.getMinutes());
      }
      setShowAreaEdit(isValidTime(event.target.value));
    }
  }

  const onChangeHour = (event) => {
    setHourEdit(+event.target.value)
    setValueEdit(autoFormatTime(`${event.target.value}:${minuteEdit}`))
  }
  const onChangeMinute = (event) => {
    setMinuteEdit(+event.target.value)
    setValueEdit(autoFormatTime(`${hourEdit}:${event.target.value}`))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && props.enterInputControl) {
      props.enterInputControl(e);
      event.preventDefault();
    }
    if (e.key === 'Tab') {
      if (divRefAreaEdit.current && !divRefAreaEdit.current.contains(event.target)) {
        setShowAreaEdit(false);
      }
    }
  }

  const getStyleClass = (attr: string) => {
    return _.get(props.fieldStyleClass, `timeBox.edit.${attr}`)
  }

  const renderComponentEdit = (isList?) => {
    const style = {};
    if (props.errorInfo) {
      style['backgroundColor'] = '#ffdedd';
      style['color'] = '#fa5151';
      style['borderColor'] = '#fa5151';
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

    const onBlurValueEdit = () => {
      const blurVal = roundTime(autoFormatTime(valueEdit, false, oldValueEdit), false, false);
      setValueEdit(blurVal);
      setOldValueEdit(blurVal);
    }

    const onFocusTime = () => {
      setShowAreaEdit(isValidTime(valueEdit));
      if (!valueEdit || !_.trim(valueEdit)) {
        const dateNow = getCurrentTimeRoundUp();
        setHourEdit(dateNow.getHours());
        setMinuteEdit(dateNow.getMinutes());
      }
    }

    const handleClickTime = () => {
      const time = `${hourEdit}:${minuteEdit}`;
      if (isValidTime(time)) {
        const timeFormat = autoFormatTime(time);
        setValueEdit(timeFormat);
        setOldValueEdit(timeFormat);
      } else {
        setValueEdit("00:00");
        setOldValueEdit("00:00");
      }
    }

    const fieldNamePlaceHolder = getFieldLabel(fieldInfo, 'fieldLabel');
    return (
      <><div className={`${getStyleClass('wrapBox')}`} style={{ display: 'inline-flex' }}>
        <div className={`${getStyleClass('wrapInput')}`}>
          <div onMouseEnter={() => setShowDelete(true)}
            onMouseLeave={() => setShowDelete(false)}
            ref = {divInput}>
            <input disabled={props.isDisabled || fieldInfo.configValue === "1"}
              ref={textboxRef}
              type="text"
              className={`${isList? getStyleClass('inputList') : getStyleClass('input')} ${props.errorInfo ? 'error' : ''} ${props.isDisabled || fieldInfo.configValue === "1" ? 'disable' : ''}`}
              placeholder={StringUtils.translateSpecial('dynamic-control.placeholder.dateTime', { fieldNamePlaceHolder })}
              value={valueEdit}
              onBlur={() => onBlurValueEdit()}
              onFocus={() => onFocusTime()}
              onChange={onChangeValueEdit}
              onKeyUp={textEditHandleKeyUp}
              onKeyDown={handleKeyDown}
            />
            {msg && <span className="messenger-error d-block">{msg}</span>}
            {valueEdit.length > 0 && showDelete && !props.isDisabled && fieldInfo.configValue !== "1" &&
              <span className="delete" onClick={() => setValueEdit('')}>
              </span>}
          </div>
          {showAreaEdit &&
            <div className={`${type === ControlType.EDIT_LIST ? '' : 'position-absolute'} ${isList ? "filter-time-from" : ""}`} ref={divRefAreaEdit} >
              <div className={`select-box select-box-time top-100  ${divStyle ? divStyle : ""}  `}  style={customStyle} >
                <div className=" select-option">
                  <select className="select-text" value={hourEdit} onChange={(e) => onChangeHour(e)}
                    onClick={() => handleClickTime()}>
                    {_.range(24).map((n, index) =>
                      <option value={index} key={index} selected={false}>{`${index}`.padStart(2, '0')}</option>
                    )}
                  </select>
                </div>
                <div className="colon-box">:</div>
                <div className=" select-option">
                  <select className="select-text" value={minuteEdit} onChange={(e) => onChangeMinute(e)}
                    onClick={() => handleClickTime()}>
                    {_.range(12).map((n, index) =>
                      <option value={index * 5} key={index} selected={false}>{`${index * 5}`.padStart(2, '0')}</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      </>
    );
  }

  const renderComponentEditList = () => {
    return <>{renderComponentEdit(true)}</>;
  }

  const renderComponent = () => {
    if (type === ControlType.EDIT || type === ControlType.ADD) {
      return renderComponentEdit();
    } else if (type === ControlType.EDIT_LIST) {
      return renderComponentEditList();
    }
    return <></>;
  }

  return renderComponent();
});

export default FieldEditTime
