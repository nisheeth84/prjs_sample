import React, { useState, useEffect, forwardRef, useRef } from 'react';
import _ from 'lodash';
import { roundTime, getHourMinute, isValidTimeFormat, autoFormatTime, getCurrentTimeRoundUp, isValidTimeInput } from 'app/shared/util/date-utils';
import { toKatakana } from 'app/shared/util/string-utils';
import useHandleShowFixedTip from 'app/shared/util/useHandleShowFixedTip';

interface ITimePickerOwnProps {
  placeholder?: string,
  isDisabled?: boolean,
  errorInfo?: any,
  fieldInfo?: any,
  enterInputControl?: any,
  isTimeTo?: boolean,
  timeInit?: any,
  divClass?: string,
  inputClass?: string,
  selectBoxClass?: string,
  selectOptionClass?: string,
  isWithoutOuterDiv?: boolean,
  isWithoutInnerDiv?: boolean,
  isWithoutDeleteButton?: boolean,
  iconDeleteClass?: string,
  tabIndex?: number,
  getStyleClass?: (name: string) => string
  onChangeTime?: (timeVal) => void
  forcePosition?: boolean
  noPositionAbsolute?: number
  isLastColumn?: boolean
}
type ITimePickerProps = ITimePickerOwnProps

const TimePicker = forwardRef((props: ITimePickerProps, ref) => {
  const [timeDisable, setTimeDisable] = useState(false);
  const [timeEdit, setTimeEdit] = useState(props.timeInit);
  const [oldTimeEdit, setOldTimeEdit] = useState('');
  const [hourEdit, setHourEdit] = useState(0);
  const [minuteEdit, setMinuteEdit] = useState(0)
  const [showAreaEdit, setShowAreaEdit] = useState(false);
  const divRefAreaEdit = useRef(null);
  const textboxRef = useRef(null);
  const [divStyle, setDivStyle] = useState(null);


  const [customStyle] = useHandleShowFixedTip({
    inputRef:textboxRef,
    overlayRef: divRefAreaEdit,
    isFixedTip: !!props.fieldInfo?.isFixedTip
  }, [showAreaEdit])

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

  const handleParentScroll = (event) => {
    if (props.forcePosition && divRefAreaEdit && divRefAreaEdit.current ) {
      const left = textboxRef.current.getBoundingClientRect().left;
      const top = textboxRef.current.getBoundingClientRect().top;
      const heightPcker = divRefAreaEdit.current.children[0].getClientRects()[0].height;
      if (!_.toString(divRefAreaEdit.current.className).includes('position-absolute') && divRefAreaEdit.current.style.position === 'fixed') {
        divRefAreaEdit.current.style.left = `${left}px`;
        divRefAreaEdit.current.style.setProperty('top', `${top - heightPcker - 1}px`, 'important')
      }
    }
  }

  const isValidTime = (strValue: string) => {
    if (!strValue || strValue.toString().trim().length < 1) {
      return true;
    }
    if (!isValidTimeFormat(strValue)) {
      return false;
    }
    const hhMM = getHourMinute(strValue);
    if (hhMM.hour < 0 || hhMM.hour >= 24 || hhMM.minute < 0 || hhMM.minute >= 60) {
      return false;
    }
    return true;
  }

  const handleUserMouseDown = (event) => {
    if (divRefAreaEdit.current && !divRefAreaEdit.current.contains(event.target)) {
      setShowAreaEdit(false);
    }
  };

  const handleClickTime = () => {
    const time = `${hourEdit}:${minuteEdit}`;
    if (isValidTime(time)) {
      const timeFormat = autoFormatTime(time);
      setTimeEdit(timeFormat);
      setOldTimeEdit(timeFormat);
    } else {
      setTimeEdit("00:00");
      setOldTimeEdit("00:00");
    }
  }

  const onChangeTimeEdit = (event) => {
    if (event.target.value === '' || isValidTimeInput(event.target.value)) {
      setTimeEdit(event.target.value);
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
    setTimeEdit(autoFormatTime(`${event.target.value}:${minuteEdit}`))
  }
  const onChangeMinute = (event) => {
    setMinuteEdit(+event.target.value)
    setTimeEdit(autoFormatTime(`${hourEdit}:${event.target.value}`))
  }

  const timeEditHandleKeyUp = (event) => {
    setTimeEdit(event.target.value);
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

  const initialize = () => {
    if (!_.isEqual(props.timeInit, toKatakana(timeEdit))) {
      setTimeEdit(props.timeInit);
      setOldTimeEdit(props.timeInit);
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
    if (props.forcePosition && showAreaEdit && textboxRef && textboxRef.current && divRefAreaEdit && divRefAreaEdit.current) {
      let left = textboxRef.current.getBoundingClientRect().left;
      const top = textboxRef.current.getBoundingClientRect().top;
      const height = textboxRef.current.getBoundingClientRect().height;
      const heightPcker = divRefAreaEdit.current.children[0].getClientRects()[0].height;
      const space = window.innerHeight - (top + height);
      if (space < heightPcker) {
        if (_.toString(divRefAreaEdit.current.className).includes('position-absolute')) {
          divRefAreaEdit.current.style.setProperty('top', `${0 - heightPcker - 1}px`, 'important')
        } else {
          if(props.isLastColumn){
            const lengthPicker = divRefAreaEdit.current.children[0].clientWidth;
            const lengthInput = textboxRef.current.clientWidth;
            left = left - (lengthPicker - lengthInput);
          }
          divRefAreaEdit.current.style.left = `${left}px`;
          divRefAreaEdit.current.style.setProperty('top', `${top - heightPcker - 1}px`, 'important')
          divRefAreaEdit.current.style.position = 'fixed';
        }
      } else if (props.isLastColumn) {
        setDivStyle("location-r0");
      }
    }
  }, [showAreaEdit])

  useEffect(() => {
    initialize();
  }, [props.timeInit]);

  useEffect(() => {
    setTimeDisable(props.isDisabled);
  }, [props.isDisabled]);

  useEffect(() => {
    if (timeEdit && _.trim(timeEdit)) {
      if (isValidTime(timeEdit)) {
        const hhMM = getHourMinute(timeEdit);
        setHourEdit(hhMM.hour);
        setMinuteEdit(hhMM.minute - hhMM.minute % 5)
      }
    }
    if (props.onChangeTime) {
      props.onChangeTime(toKatakana(timeEdit));
    }
  }, [timeEdit]);

  const onBlurTime = () => {
    const timeVal = roundTime(autoFormatTime(timeEdit, false, oldTimeEdit), props.isTimeTo, false);
    setTimeEdit(timeVal);
    setOldTimeEdit(timeVal);
  }

  const getInputClass = () => {
    if (props.getStyleClass) {
      return `${props.getStyleClass('inputTime')} ${props.errorInfo ? 'error' : ''}`;
    } else {
      return `${props.inputClass ? props.inputClass : ""} ${props.errorInfo ? 'error' : ''}`
    }
  }

  const getDivClass = () => {
    if (props.getStyleClass) {
      return props.getStyleClass('wrapTime');
    } else {
      return props.divClass ? props.divClass : "";
    }
  }

  const onFocusTime = () => {
    setShowAreaEdit(isValidTime(timeEdit));
    if (!timeEdit) {
      const dateNow = getCurrentTimeRoundUp();
      setHourEdit(dateNow.getHours());
      setMinuteEdit(dateNow.getMinutes());
    }
  }

  const renderInputTime = () => {
    return <>
      <input disabled={props.isDisabled || timeDisable}
        ref={textboxRef}
        tabIndex={props.tabIndex}
        type="text"
        id={Math.random().toString()}
        className={`${getInputClass()} ${props.isDisabled ? 'disable' : ''}`}
        placeholder={props.placeholder}
        value={timeEdit}
        onBlur={() => onBlurTime()}
        onFocus={() => onFocusTime()}
        onChange={onChangeTimeEdit}
        onKeyUp={timeEditHandleKeyUp}
        onKeyDown={handleKeyDown}
        autoFocus={false}
      // onMouseEnter={() => setIsShownDelete(true)}
      // onMouseLeave={() => setIsShownDelete(false)}
      />
      {!props.isWithoutDeleteButton && !timeDisable && timeEdit && timeEdit.length > 0
        && <span className={props.iconDeleteClass ? props.iconDeleteClass : "delete"} onClick={() => setTimeEdit('')}
        // onMouseEnter={() => setIsShownDelete(true)}
        // onMouseLeave={() => setIsShownDelete(false)}
        />}
    </>
  }

  const renderInputDiv = () => {
    if (props.isWithoutInnerDiv) {
      return (
        <>
          {renderInputTime()}
        </>
      )
    } else {
      return (
        <div>
          {renderInputTime()}
        </div>
      )
    }
  }



  const renderComponent = () => {
    return (
      <div>
        {renderInputDiv()}
        {showAreaEdit &&
          <div className={`${props.noPositionAbsolute === 1 ? '' : 'position-absolute'}`} ref={divRefAreaEdit} style={customStyle} >
            <div className={`select-box select-box-time ${props.selectBoxClass ? props.selectBoxClass : ""} ${divStyle ? divStyle : ""}`} >
              <div className={`select-option ${props.selectOptionClass ? props.selectOptionClass : ""}`}>
                <select className="select-text" value={hourEdit} onChange={(e) => onChangeHour(e)}
                  onClick={() => handleClickTime()}>
                  {_.range(24).map((n, index) =>
                    <option value={index} key={index}>{`${index}`.padStart(2, '0')}</option>
                  )}
                </select>
              </div>
              <div className="colon-box">:</div>
              <div className={`select-option ${props.selectOptionClass ? props.selectOptionClass : ""}`}>
                <select className="select-text" value={minuteEdit} onChange={(e) => onChangeMinute(e)}
                  onClick={() => handleClickTime()}>
                  {_.range(12).map((n, index) =>
                    <option value={index * 5} key={index}>{`${index * 5}`.padStart(2, '0')}</option>
                  )}
                </select>
              </div>
            </div>
          </div>
        }
        <div></div>
      </div>
    )
  }

  if (props.isWithoutOuterDiv) {
    return (
      <>
        {renderComponent()}
      </>
    )
  } else {
    return (
      <>
        <div className={getDivClass()}>
          {renderComponent()}
        </div>
      </>
    )
  }
});

export default TimePicker;