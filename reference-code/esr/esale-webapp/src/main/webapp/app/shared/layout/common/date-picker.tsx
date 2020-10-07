import 'react-day-picker/lib/style.css';
import React, { useState, useEffect, useRef } from 'react';
import { Storage, translate } from 'react-jhipster';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import DayPicker, { DayModifiers } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';
import dateFns from "date-fns";
import dateFnsFormat from 'date-fns/format';
import _ from 'lodash';
import moment from 'moment';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';
import { toKatakana } from 'app/shared/util/string-utils';
import useHandleShowFixedTip from 'app/shared/util/useHandleShowFixedTip';

export interface IDatePickerProps {
  date?: Date,
  inputClass?: string,
  dayPickerClass?: string,
  isError?: boolean,
  isDisabled?: boolean,
  tabIndex?: number,
  placeholder?: string,
  onDateChanged?: (day: Date) => void,
  borderClass?: string,
  componentClass?: string
  isFocusError?: boolean
  overlayClass?: string
  classFilter?: string
  outerDivClass?: string
  formatDate?: string
  disabledDays?: any,
  forcePosition?: boolean
  onDateSelected?: (day: Date) => void,
  fieldInfo?:any
}

const DatePicker = (props: IDatePickerProps) => {
  const [dateSelected, setDateSelected] = useState(props.date)
  const [listYear, setListYear] = useState([]);
  const [yearSelected, setYearSelected] = useState(1970);
  const [monthSelected, setMonthSelected] = useState(1);
  const [oldDate, setOldDate] = useState(null)

  const inputDateRef = useRef(null);
  const dayPickerRef = useRef(null);
  const overlayRef = useRef(null);
  const [inputKey, setInputKey] = useState(0);
  const [, setTextInput] = useState('');
  const [styleOverlay, setStyleOverlay] = useState({})

  const FORMAT_DATE = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT)

  const compareDateYmd = (date1: Date, date2: Date) => {
    if (!date1 && !date2) {
      return 0;
    }
    if (!date1 && date2) {
      return -1;
    }
    if (date1 && !date2) {
      return 1;
    }
    if (date1.getFullYear() !== date2.getFullYear()) {
      return date1.getFullYear() - date2.getFullYear();
    }
    if (date1.getMonth() !== date2.getMonth()) {
      return date1.getMonth() - date2.getMonth();
    }
    if (date1.getDate() !== date2.getDate()) {
      return date1.getDate() - date2.getDate();
    }
    return 0;
  }

  useEffect(() => {
    if (props.onDateSelected) {
      // Callback when a date is selected on calendar, will trigger even if the date is the same as seleted
      props.onDateSelected(dateSelected);
    }
    if (props.onDateChanged && compareDateYmd(props.date, dateSelected) !== 0) {
      // Callback when a new date is selected on calendar
      props.onDateChanged(dateSelected);
    }
    if (!dateSelected) {
      const now = new Date();
      setYearSelected(now.getFullYear())
      setMonthSelected(now.getMonth());
      if (inputDateRef && inputDateRef.current && !_.isEmpty(inputDateRef.current.value)) {
        inputDateRef.current.focus();
      }
    } else {
      setYearSelected(dateSelected.getFullYear());
      setMonthSelected(dateSelected.getMonth());
    }
  }, [dateSelected])

  useEffect(() => {
    const tmp = [];
    for (let i = yearSelected - 10; i <= yearSelected + 10; i++) {
      tmp.push(i);
    }
    setListYear(tmp);
  }, [yearSelected])

  useEffect(() => {
    if (compareDateYmd(props.date, dateSelected) !== 0) {
      setDateSelected(props.date)
      setOldDate(props.date);
    }
  }, [props.date]);

  const formatDate = (date, format, locale) => {
    return dateFnsFormat(date, format, { locale });
  }

  const lang = Storage.session.get('locale', 'ja_jp');

  const parseDate = (str, format, locale) => {
    str = toKatakana(str);
    if (!moment(str, format, true).isValid()) {
      return undefined;
    }
    const parsed = moment(str, format).toDate();
    if (DayPicker.DateUtils.isDate(parsed) && parsed.getFullYear() > 0) {
      return parsed;
    }
    return undefined;
  }

  const forceSetInputDate = (date) => {
    setTimeout(() => {
      setDateSelected(date);
      setOldDate(date);
      setInputKey(Math.random())
      if (!date) {
        dayPickerRef.current.hideDayPicker();
      }
    }, 100);
  }

  const autoFormatDate = (valueDate) => {
    if (_.isNil(valueDate) || _.isEmpty(valueDate.trim())) {
      forceSetInputDate(null)
      return;
    }
    const val = valueDate.trim();
    const parsed = parseDate(val, FORMAT_DATE, lang);
    if (parsed !== undefined) {
      forceSetInputDate(parsed);
    } else {
      forceSetInputDate(oldDate);
    }
    // const currentDate = new Date()
    // let strDate = null
    // let parsed = null
    // if (!val.includes("/")) {
    //   if (!/^[0-9]+$/.test(val)) {
    //     forceSetInputDate(oldDate);
    //     return;
    //   }
    //   const valueNumber = _.toNumber(val)
    //   if (val.toString().length <= 2) {
    //     if (valueNumber > 12) {
    //       forceSetInputDate(new Date(currentDate.getFullYear() + 1, 0, 1))
    //       return;
    //     } else if (valueNumber > 0) {
    //       let year = currentDate.getFullYear()
    //       if (valueNumber < (currentDate.getMonth() + 1)) {
    //         year = year + 1;
    //       }
    //       forceSetInputDate(new Date(year, valueNumber - 1, 1));
    //     } else {
    //       forceSetInputDate(oldDate);
    //     }
    //   } else if (val.toString().length === 4) {
    //     forceSetInputDate(new Date(valueNumber, 0, 1));
    //   } else if (val.toString().length === 8) {
    //     parsed = dateFnsParse(val);
    //     const simpleFomat = replaceAll(FORMAT_DATE, ['-', '/', '\\'], '');
    //     if (moment(val, simpleFomat, lang).isValid() && parsed.getFullYear() > 0) {
    //       forceSetInputDate(parsed)
    //     } else {
    //       forceSetInputDate(oldDate);
    //     }
    //   } else {
    //     forceSetInputDate(oldDate);
    //   }
    // } else {
    //   const parts = val.split('/');
    //   if (parts.length > 3 || parts.length === 1) {
    //     return forceSetInputDate(oldDate);
    //   }
    //   if (!/^[0-9]+$/.test(parts.join(''))) {
    //     forceSetInputDate(oldDate);
    //     return;
    //   }
    //   let year = currentDate.getFullYear();
    //   let month = -1;
    //   let day = -1;
    //   if (_.toNumber(parts[0]) > 12) {
    //     day = _.toNumber(parts[0])
    //     month = _.toNumber(parts[1])
    //   } else {
    //     month = _.toNumber(parts[0])
    //     day = _.toNumber(parts[1])
    //   }
    //   const monthDay = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    //   if (parts.length === 3) {
    //     parsed = dateFnsParse(val);
    //     if (DayPicker.DateUtils.isDate(parsed) && parsed.getFullYear() > 0) {
    //       forceSetInputDate(parsed)
    //     } else {
    //       if (+parts[2] >= 0 && +parts[2] <= 99) {
    //         year = +parts[2] + 2000
    //       } else if (+parts[2] >= 1900 && +parts[2] <= 2100) {
    //         year = +parts[2]
    //       } else {
    //         forceSetInputDate(oldDate)
    //         return;
    //       }
    //       strDate = `${year}/${monthDay}`
    //       parsed = dateFnsParse(strDate);
    //       if (DayPicker.DateUtils.isDate(parsed) && parsed.getFullYear() > 0) {
    //         forceSetInputDate(parsed)
    //       } else {
    //         forceSetInputDate(oldDate)
    //       }
    //     }
    //   } else if (parts.length === 2) {
    //     if (month < currentDate.getMonth()) {
    //       year += 1;
    //     }
    //     strDate = `${year}/${monthDay}`
    //     parsed = dateFnsParse(strDate);
    //     if (DayPicker.DateUtils.isDate(parsed) && parsed.getFullYear() > 0) {
    //       forceSetInputDate(parsed)
    //     } else {
    //       forceSetInputDate(oldDate)
    //     }
    //   } else {
    //     forceSetInputDate(oldDate);
    //   }
    // }
  }

  const onDateChange = (day: Date, dayModifiers: DayModifiers, dayPickerInput: DayPickerInput) => {
    if (!_.isNil(day)) {
      setDateSelected(day);
      setOldDate(day)
    }
  }

  const onClearDate = () => {
    if (inputDateRef && inputDateRef.current.value) {
      inputDateRef.current.value = null;
      dayPickerRef.current.state.value = null;
      dayPickerRef.current.state.typedValue = null;
    }
    setTextInput(null);
    setOldDate(null);
    setDateSelected(null);
  }

  const onChangeMonth = (month: number) => {
    const monthDate = new Date(yearSelected, monthSelected);
    setYearSelected((dateFns.addMonths(monthDate, month)).getFullYear());
    setMonthSelected((dateFns.addMonths(monthDate, month)).getMonth());
  }

  const onDayPickerHide = () => {
    if (inputDateRef && inputDateRef.current) {
      autoFormatDate(toKatakana(inputDateRef.current.value));
    }
    if (props.onDateChanged && compareDateYmd(props.date, dateSelected) !== 0) {
      props.onDateChanged(dateSelected);
    }
  }

  const [customStyle, triggerCalc] = useHandleShowFixedTip({
    inputRef: inputDateRef,
    overlayRef,
    isFixedTip: !!props.fieldInfo?.isFixedTip
  })

  const onDayPickerShow = () => {
    triggerCalc()
    if (props.forcePosition && inputDateRef && inputDateRef.current) {
      const left = inputDateRef.current.getBoundingClientRect().left;
      const top = inputDateRef.current.getBoundingClientRect().top;
      const height = inputDateRef.current.getBoundingClientRect().height;
      const heightDatePicker = overlayRef.current.children[0].getClientRects()[0].height;
      const space = window.innerHeight - top;
      if (space < heightDatePicker) {
        const style = {}
        if (!_.toString(overlayRef.current.className).includes('position-fixed') && overlayRef.current.style.position !== 'fixed') {
          style['top'] = `${0 - heightDatePicker - height}px`;
        } else {
          style['left'] = `${left}px`;
          style['top'] = `${top - heightDatePicker - 1}px`;
        }
        setStyleOverlay(style);
      } else {
        setStyleOverlay({})
      }
    }
  }

  if (props.isFocusError && inputDateRef && inputDateRef.current) {
    inputDateRef.current.focus();
  }

  const renderNavHeader = () => {
    return (
      <div className="DayPicker-NavCustom" role="heading">
        <div className="">
          <select className="DayPicker-NavCustomSelectYear" value={yearSelected} onChange={(e) => setYearSelected(+e.target.value)}>
            {listYear.map((e, idx) =>
              <option key={idx} value={e}>{translate('calendars.datePicker.formatYear', { year: e })}</option>
            )}
          </select>
          <select className="DayPicker-NavCustomSelectMonth" value={monthSelected} onChange={(e) => setMonthSelected(+e.target.value)}>
            {_.range(12).map((n, index) =>
              <option value={index} key={index}>{translate('calendars.datePicker.formatMonth', { month: `${index + 1}`.padStart(2, '0') })}</option>
            )}
          </select>
          <div className="float-right">
            <a tabIndex={0} role="button" aria-label="Previous Month" className="icon-small-primary icon-prev" onClick={() => onChangeMonth(-1)} />
            <a tabIndex={0} role="button" aria-label="Next Month" className="icon-small-primary icon-next" onClick={() => onChangeMonth(1)} />
          </div>
        </div>
      </div>);
  }

  const handleUserMouseDown = (event) => {
    if ((inputDateRef && inputDateRef.current && !inputDateRef.current.contains(event.target)) &&
      (overlayRef && overlayRef.current && !overlayRef.current.contains(event.target))) {
      dayPickerRef.current.hideDayPicker();
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, [])

  return (
    <div className={`${props.classFilter} no-select`}>
      <DayPickerInput
        ref={dayPickerRef}
        key={inputKey}
        value={dateSelected}
        format={props && props.formatDate ? props.formatDate : FORMAT_DATE}
        formatDate={formatDate}
        parseDate={parseDate}
        placeholder={props.placeholder ? props.placeholder : `${formatDate(new Date(), FORMAT_DATE, lang)}`}
        dayPickerProps={{
          firstDayOfWeek: 1,
          selectedDays: dateSelected,
          month: new Date(yearSelected, monthSelected),
          showOutsideDays: true,
          locale: lang,
          localeUtils: MomentLocaleUtils,
          disabledDays: props && props.disabledDays || []
        }}
        component={p =>
          <div className={props.outerDivClass ? props.outerDivClass : ''}>
            <div
              className={props.borderClass}
            >
              <input
                id={Math.random().toString()}
                ref={inputDateRef}
                type="text"
                disabled={props.isDisabled}
                className={`${props.inputClass} ${props.isError ? 'error' : ''} ${props.isDisabled ? 'disable' : ''}`} {...p}
                tabIndex={props.tabIndex}
                // onChange={input=> setTextInput(input.target.value)}
                // value={inputDateRef.current.value}
                autoFocus={!dateSelected && inputDateRef && inputDateRef.current && !_.isEmpty(inputDateRef.current.value)}
              />
              {dateSelected && !props.isDisabled &&
                <span className={`delete`} onClick={(e) => { onClearDate(); inputDateRef.current.value = null }} />
              }
            </div>
          </div>}
        overlayComponent={({ classNames, selectedDay, children, ...p }) => {
          return (
            <div style={{...styleOverlay, ...customStyle}}
              className={`${classNames.overlayWrapper} ${props.overlayClass ? props.overlayClass : ""}`
              } {...p} ref={overlayRef}>
              <div className={`${classNames.overlay} ${props.componentClass ? props.componentClass : ""}`} >
                {renderNavHeader()}
                {children}
              </div>
            </div>)
        }}
        onDayChange={onDateChange}
        onDayPickerHide={onDayPickerHide}
        onDayPickerShow={onDayPickerShow}
      />
      <div></div>
    </div >
  );
};

DatePicker.defaultProps = {
  inputClass: "input-normal input-common2 one-item",
}

export default DatePicker;
