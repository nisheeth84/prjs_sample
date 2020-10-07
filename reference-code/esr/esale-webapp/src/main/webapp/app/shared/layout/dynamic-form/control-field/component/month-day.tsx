import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { translate, Storage } from 'react-jhipster';
import _ from 'lodash';
import { format } from "date-fns";
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';

export interface IMonthDayProps {
  monthDay: string,
  placeHolder?: string,
  isDisabled?: boolean,
  errorInfo?: any,
  onChangeMonthDay?: (monthday: string) => void
  classFilter?: string
  noPositionAbsolute?: number
  location?: string
}

const MonthDayPicker = forwardRef((props: IMonthDayProps, ref) => {
  const [valueEdit, setValueEdit] = useState(props.monthDay);
  const [valueOldEdit, setValueOldEdit] = useState(props.monthDay);
  const [showAreaEdit, setShowAreaEdit] = useState(false);

  const [monthEdit, setMonthEdit] = useState(0)
  const [dayEdit, setDayEdit] = useState(0)
  const divRefAreaEdit = useRef(null)

  const prefix = "dynamic-control.fieldFilterAndSearch.layoutDateTime.";
  const FORMAT_DATE = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT)
  const IS_MONTH_BEFORE = FORMAT_DATE.indexOf("MM") < FORMAT_DATE.indexOf("DD");

  const getSeperate = () => {
    let arrFomarDate = []
    arrFomarDate = FORMAT_DATE.split("");
    if (arrFomarDate[0] === "Y") {
      return arrFomarDate[7];
    }else {
      return arrFomarDate[2];
    }
  }

  const SEPERATE = getSeperate();

  const numberDayInMonth = (month) => {
    if (month === 2) {
      return 29;
    }
    if (month < 1) {
      return 31;
    }
    const date = new Date();
    const d = new Date(date.getFullYear(), month, 0);
    return d.getDate();
  }

  const isValidMonthDay = (strValue: string) => {
    if (!strValue || strValue.toString().trim().length < 1) {
      return true;
    }
    const parts = _.split(strValue, getSeperate())
    if (parts.length < 1 || parts.length > 2) {
      return false;
    }
    if (!/^[0-9]+$/.test(parts[0]) || !/^[0-9]+$/.test(parts[1])) {
      return false;
    }
    let month;
    let day;

    if(IS_MONTH_BEFORE){
      month = _.toNumber(parts[0]);
      day = _.toNumber(parts[1]);
    } else {
      month = _.toNumber(parts[1]);
      day = _.toNumber(parts[0]);
    }
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }
    if (day > numberDayInMonth(month)) {
      return false;
    }
    return true;
  }

  const getMonthDay = (val) => {
    if (!val) {
      return val;
    }
    if (/^Y.*$/.test(FORMAT_DATE)) {
      val = val.slice(5);
    } else {
      val = val.slice(0, val.length - 6);
    }
    return val;
  }

  const getValueEdit = (monthValue, dayValue) => {
    if(IS_MONTH_BEFORE){
      return `${_.toString(monthValue).padStart(2, '0')}${getSeperate()}${_.toString(dayValue).padStart(2, '0')}`
    } else {
      return `${_.toString(dayValue).padStart(2, '0')}${getSeperate()}${_.toString(monthValue).padStart(2, '0')}`
    }
  }

  const autoFormatMonthDay = (strValue: string) => {
    if (!strValue || strValue.toString().trim().length < 1) {
      return ''
    }
    const parts = strValue.match(/\d+/g);
    if (!parts || parts.length < 1) {
      return undefined
    }
    let month;
    let day;
    if(IS_MONTH_BEFORE){
      month = _.toNumber(parts[0]);
      day = _.toNumber(parts[1]);
    } else {
      month = _.toNumber(parts[1]);
      day = _.toNumber(parts[0]);
    }
    if (month < 1 && month > 12) {
      return undefined
    }
    if (day > numberDayInMonth(month)) {
      day = 1;
    }
    return getValueEdit(month, day)
  }

  const handleUserMouseDown = (event) => {
    if (divRefAreaEdit.current && !divRefAreaEdit.current.contains(event.target)) {
      setShowAreaEdit(false);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, []);

  const formatMonthDay = (val) => {
    if(!val){
      return val;
    }
    const valArr = val.split("-");
    if(valArr.length !== 2){
      return val;
    }
    if(IS_MONTH_BEFORE){
      return `${valArr[0]}${SEPERATE}${valArr[1]}`
    } else {
      return `${valArr[1]}${SEPERATE}${valArr[0]}`
    }
  }

  useEffect(() => {
    const monthDay = formatMonthDay(props.monthDay);
    if (!_.isEqual(monthDay, valueEdit)) {
      setValueEdit(monthDay)
      setValueOldEdit(monthDay)
    }
  }, [props.monthDay])

  useEffect(() => {
    if (!valueEdit) {
      props.onChangeMonthDay("");
    }
    if (isValidMonthDay(valueEdit) && valueEdit !== "") {
      setValueOldEdit(valueEdit);
      const parts = valueEdit.split(getSeperate());
      if (props.onChangeMonthDay && !_.isEqual(formatMonthDay(props.monthDay), valueEdit)) {
        let valueOut;
        if (IS_MONTH_BEFORE) {
          valueOut = `${parts[0]}-${parts[1]}`;
        } else {
          valueOut = `${parts[1]}-${parts[0]}`;
        }
        props.onChangeMonthDay(valueOut)
      }
      if (_.isEmpty(valueEdit)) {
        setMonthEdit(0);
        setDayEdit(0);
      } else {
        if(IS_MONTH_BEFORE){
          setMonthEdit(_.toNumber(parts[0]))
          setDayEdit(_.toNumber(parts[1]))
        }
        else {
          setMonthEdit(_.toNumber(parts[1]))
          setDayEdit(_.toNumber(parts[0]))
        }
      }
    } 
    else {
      setMonthEdit(0);
      setDayEdit(0);
    }
  }, [valueEdit])

  const textEditHandleKeyUp = (event) => {
    setValueEdit(event.target.value);
  }
  const onChangeValueEdit = (event) => {
    setValueEdit(event.target.value);
    if (event.target.value === '') {
      setShowAreaEdit(false);
    } else {
      setShowAreaEdit(true);
    }
  }

  const forceSetValueEdit = (strMonthDay: string) => {
    const result = autoFormatMonthDay(strMonthDay)
    if (_.isNil(result)) {
      setValueEdit(valueOldEdit)
    } else {
      setValueEdit(result)
    }
  }

  const onChangeMonth = (event) => {
    const month = +event.target.value;
    setMonthEdit(month)
    if (month < 1 || dayEdit < 1) {
      setValueEdit('')
    } else {
      forceSetValueEdit(getValueEdit(event.target.value, dayEdit))
    }
  }
  const onChangeDay = (event) => {
    const day = +event.target.value;
    setDayEdit(day)
    if (day < 1 || monthEdit < 1) {
      setValueEdit('')
    } else {
      forceSetValueEdit(getValueEdit(monthEdit, event.target.value))
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (divRefAreaEdit.current && !divRefAreaEdit.current.contains(event.target)) {
        setShowAreaEdit(false);
      }
    }
  }

  const onBlurEdit = (ev) => {
    forceSetValueEdit(ev.target.value)
    // setShowAreaEdit(false);
  }

  const onFocusEdit = () => {
    if (!valueEdit) {
      const dateNow = new Date();
      setMonthEdit(dateNow.getMonth() + 1);
      setDayEdit(dateNow.getDate());
    }
    setShowAreaEdit(true)
  }

  const onClickPicker = () => {
    if (monthEdit && dayEdit) {
      forceSetValueEdit( getValueEdit(monthEdit, dayEdit))
    }
  }

  return (
    <><div className={`form-group has-delete ${props.classFilter ? props.classFilter : ''}`}>
      <input disabled={props.isDisabled}
        type="text"
        id={Math.random().toString()}
        className={`input-normal ${props.errorInfo ? 'error' : ''}`}
        placeholder={props.placeHolder}
        value={valueEdit}
        onBlur={onBlurEdit}
        onFocus={() => onFocusEdit()}
        onChange={onChangeValueEdit}
        onKeyUp={textEditHandleKeyUp}
        onKeyDown={handleKeyDown}
      />
      {valueEdit && !props.isDisabled && valueEdit.length > 0 &&
        <span className="delete" onClick={() => setValueEdit('')} />
      } {" "}
      {showAreaEdit &&
        <div className={`select-box select-box-time top-43 ${props.location ? props.location : ''} ${props.noPositionAbsolute === 1 ? '' : 'position-absolute'}`} ref={divRefAreaEdit}>
          <div className=" select-option">
            <select className="select-text" value={monthEdit} onChange={(e) => onChangeMonth(e)}
              onClick={() => onClickPicker()} >
              {_.range(13).map((n, idx) => {
                if (idx === 0) {
                  return <option value={idx} key={idx}></option>
                } else {
                  return <option value={idx} key={idx}>{`${idx}`.padStart(2, '0')}</option>
                }
              }
              )}
            </select>
          </div>
          <div className="colon-box">{translate(prefix + "label.month")}</div>
          <div className=" select-option">
            <select className="select-text" value={dayEdit} onChange={(e) => onChangeDay(e)}
              onClick={() => onClickPicker()}>
              {_.range(numberDayInMonth(monthEdit) + 1).map((n, index) => {
                if (index === 0) {
                  return <option value={index} key={index}></option>
                } else {
                  return <option value={index} key={index}>{`${index}`.padStart(2, '0')}</option>
                }
              }
              )}
            </select>
          </div>
          <div className="colon-box">{translate(prefix + "label.day")}</div>
        </div>
      }
      <div></div>
    </div>
    </>)
});

export default MonthDayPicker
