import React, { useImperativeHandle, useState, useEffect, forwardRef, useRef } from 'react';
import { useId } from 'react-id-generator';
import _, { parseInt } from 'lodash';
import DayPicker from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import DatePicker from '../../../common/date-picker';
import MonthDayPicker from '../component/month-day';
import 'react-day-picker/lib/style.css';
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';
import { FilterModeDate, NumberModeDate } from '../../constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Storage, translate } from 'react-jhipster';
import {getDateBeforeAfter, convertDateTimeToTz, convertDateTimeFromTz} from 'app/shared/util/date-utils';
import { APP_DATE_FORMAT_ES, DATE_MODE, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';

import { getNumberFromDay, getNumberToDay } from 'app/shared/util/string-utils';
import moment from 'moment';


type IFieldListFilterDateProps = IDynamicFieldProps

const FieldListFilterDate = forwardRef((props: IFieldListFilterDateProps, ref) => {
  const FORMAT_DATE = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT)
  const IS_MONTH_BEFORE = FORMAT_DATE.indexOf("MM") < FORMAT_DATE.indexOf("DD");
  const [, setValueFilter] = useState(null);
  const [, setSearchBlank] = useState(false);
  const [filterModeDate, setFilterModeDate] = useState(FilterModeDate.PeriodYmd);
  const [isFirst, setIsFirst] = useState(true);

  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [monthdayTo, setMonthdayTo] = useState('')
  const [monthdayFrom, setMonthdayFrom] = useState('')
  // const [monthFrom, setMonthFrom] = useState(0);
  // const [dayFrom, setDayFrom] = useState(0);
  // const [monthTo, setMonthTo] = useState(0);
  // const [dayTo, setDayTo] = useState(0);
  const [numberDateBeforeAfterFrom, setNumberDateBeforeAfterFrom] = useState(null);
  const [numberDateBeforeAfterTo, setNumberDateBeforeAfterTo] = useState(null);
  const [numberDateBeforeAfterMode, setNumberDateBeforeAfterMode] = useState(NumberModeDate.Normal);
  const [numberDateBeforeFrom, setNumberDateBeforeFrom] = useState(null);
  const [numberDateBeforeTo, setNumberDateBeforeTo] = useState(null);
  const [numberDateBeforeMode, setNumberDateBeforeMode] = useState(NumberModeDate.Normal);
  const [numberDateAfterFrom, setNumberDateAfterFrom] = useState(null);
  const [numberDateAfterTo, setNumberDateAfterTo] = useState(null);
  const [numberDateAfterMode, setNumberDateAfterMode] = useState(NumberModeDate.Normal);
  const [numberMonthBeforeAfterFrom, setNumberMonthBeforeAfterFrom] = useState(null);
  const [numberMonthBeforeAfterTo, setNumberMonthBeforeAfterTo] = useState(null);
  const [numberYearBeforeAfterFrom, setNumberYearBeforeAfterFrom] = useState(null);
  const [numberYearBeforeAfterTo, setNumberYearBeforeAfterTo] = useState(null);

  const [showModeSearch, setShowModeSearch] = useState(false);
  const divModeSearch = useRef(null)

  const idRadio = useId(9, "filter_list_radio_");
  const nameRadio = useId(2, "filter_list_radio_name_");
  const numberRegExp = new RegExp('^[0-9]*$');
  const prefix = 'dynamic-control.fieldFilterAndSearch.layoutDateTime.';

  const handleUserMouseDown = (event) => {
    if (divModeSearch.current && !divModeSearch.current.contains(event.target)) {
      setShowModeSearch(false);
    }
  };

  const setStateNumber = (number) => {
    setFilterModeDate(parseInt(number))
  }

  const setPeriodMDefault = (valueFilterProps) => {
    const monthdayFromData = !_.isEmpty(valueFilterProps.from) && (valueFilterProps.from.substr(0, 2) + '-' + valueFilterProps.from.substr(2, 2));
    const monthdayToData = !_.isEmpty(valueFilterProps.to) && (valueFilterProps.to.substr(0, 2) + '-' + valueFilterProps.to.substr(2, 2));
    setMonthdayFrom(monthdayFromData);
    setMonthdayTo(monthdayToData);
  }

  const setModeDateWorking = (valueFilter) => {
    switch (props.elementStatus.searchType.toString()) {
      case FilterModeDate.DayBeforeAfter.toString():
        valueFilter.from ? setNumberDateBeforeAfterFrom(getNumberFromDay(valueFilter.from).toString()) : setNumberDateBeforeAfterFrom(null);
        valueFilter.to ? setNumberDateBeforeAfterTo(getNumberToDay(valueFilter.to).toString()) : setNumberDateBeforeAfterTo(null);
        if (valueFilter['filterModeDate']) {
          setNumberDateBeforeAfterMode(NumberModeDate.Working);
          valueFilter.from ? setNumberDateBeforeAfterFrom(valueFilter.from) : setNumberDateBeforeAfterFrom(null);
          valueFilter.to ? setNumberDateBeforeAfterTo(valueFilter.to) : setNumberDateBeforeAfterTo(null);
        }
        break;
      case FilterModeDate.TodayBefore.toString(): {
        valueFilter.from ? setNumberDateBeforeFrom(getNumberFromDay(valueFilter.from).toString()) : setNumberDateBeforeFrom(null);
        valueFilter.to ? setNumberDateBeforeTo(getNumberFromDay(valueFilter.to).toString()) : setNumberDateBeforeTo(null);
        if (valueFilter['filterModeDate']) {
          setNumberDateBeforeMode(NumberModeDate.Working);
          valueFilter.from ? setNumberDateBeforeFrom(valueFilter.from) : setNumberDateBeforeFrom(null);
          valueFilter.to ? setNumberDateBeforeTo(valueFilter.to) : setNumberDateBeforeTo(null);
        }
        break;
      }
      case FilterModeDate.TodayAfter.toString(): {
        valueFilter.from ? setNumberDateAfterFrom(getNumberToDay(valueFilter.from).toString()) : setNumberDateAfterFrom(null);
        valueFilter.to ? setNumberDateAfterTo(getNumberToDay(valueFilter.to).toString()) : setNumberDateAfterTo(null);
        if (valueFilter['filterModeDate']) {
          setNumberDateAfterMode(NumberModeDate.Working);
          valueFilter.from ? setNumberDateAfterFrom(valueFilter.from) : setNumberDateAfterFrom(null);
          valueFilter.to ? setNumberDateAfterTo(valueFilter.to) : setNumberDateAfterTo(null);
        }
        break;
      }
      default:
        break;
    }
  }

  const setFilterDateMonthYear = (valueFilter) => {
    switch (props.elementStatus.searchType.toString()) {
      case FilterModeDate.MonthBeforeAfter.toString():
        valueFilter.from ? setNumberMonthBeforeAfterFrom(getNumberFromDay(valueFilter.from, 'M').toString()) : setNumberMonthBeforeAfterFrom(null);
        valueFilter.to ? setNumberMonthBeforeAfterTo(getNumberToDay(valueFilter.to, 'M').toString()) : setNumberMonthBeforeAfterTo(null);
        break;
      case FilterModeDate.YearBeforeAfter.toString():
        valueFilter.from ? setNumberYearBeforeAfterFrom(getNumberFromDay(valueFilter.from, 'Y').toString()) : setNumberYearBeforeAfterFrom(null);
        valueFilter.to ? setNumberYearBeforeAfterTo(getNumberToDay(valueFilter.to, 'Y').toString()) : setNumberYearBeforeAfterTo(null);
        break;
      default:
        break;
    }
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
        valueFilterProps = [];
      }
      if(valueFilterProps) {
        if(props.elementStatus && props.elementStatus.searchType){
          switch (props.elementStatus.searchType.toString()) {
            case FilterModeDate.PeriodYmd.toString(): {
              valueFilterProps.from ? setDateFrom(new Date(valueFilterProps.from)) : setDateFrom(null);
              valueFilterProps.to ? setDateTo(new Date(valueFilterProps.to)) : setDateTo(null);
              break;
            }
            case FilterModeDate.PeriodMd.toString(): {
              setPeriodMDefault(valueFilterProps);
              break;
            }
            case FilterModeDate.TodayBefore.toString():
            case FilterModeDate.DayBeforeAfter.toString():
            case FilterModeDate.TodayAfter.toString(): {
              setModeDateWorking(valueFilterProps);
              break;
            }
            case FilterModeDate.MonthBeforeAfter.toString():
            case FilterModeDate.YearBeforeAfter.toString(): {
              setFilterDateMonthYear(valueFilterProps);
              break;
            }
            default:
              break;
          }
        }
        setValueFilter(valueFilterProps);
      }
      if(props.elementStatus && props.elementStatus.searchType){
        setStateNumber(props.elementStatus.searchType);
      }
      if(props.elementStatus.isSearchBlank) {
        setSearchBlank(props.elementStatus.isSearchBlank);
      }
      if(!_.isNil(props.elementStatus.filterModeDate)) {
        setFilterModeDate(props.elementStatus.filterModeDate);
      }
      const userDateFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
      if(props.elementStatus.dateFrom) {
        const parsed = dateFnsParse(props.elementStatus.dateFrom);
        if (DayPicker.DateUtils.isDate(parsed)) {
          setDateFrom(parsed)
        }
      }
      if(props.elementStatus.dateTo) {
        const parsed = dateFnsParse(props.elementStatus.dateTo);
        if (DayPicker.DateUtils.isDate(parsed)) {
          setDateTo(parsed)
        }
      }
      if (props.elementStatus.monthDayFrom) {
        setMonthdayFrom(props.elementStatus.monthDayFrom)
      }
      if (props.elementStatus.monthDayTo) {
        setMonthdayTo(props.elementStatus.monthDayTo)
      }
      if(props.elementStatus.numberDateBeforeAfterFrom) {
        setNumberDateBeforeAfterFrom(props.elementStatus.numberDateBeforeAfterFrom);
      }
      if(props.elementStatus.numberDateBeforeAfterTo) {
        setNumberDateBeforeAfterTo(props.elementStatus.numberDateBeforeAfterTo);
      }
      if(props.elementStatus.numberDateBeforeAfterMode) {
        setNumberDateBeforeAfterMode(props.elementStatus.numberDateBeforeAfterMode);
      }
      if(props.elementStatus.numberDateBeforeFrom) {
        setNumberDateBeforeFrom(props.elementStatus.numberDateBeforeFrom);
      }
      if(props.elementStatus.numberDateBeforeTo) {
        setNumberDateBeforeTo(props.elementStatus.numberDateBeforeTo);
      }
      if(props.elementStatus.numberDateBeforeMode) {
        setNumberDateBeforeMode(props.elementStatus.numberDateBeforeMode);
      }
      if(props.elementStatus.numberDateAfterFrom) {
        setNumberDateAfterFrom(props.elementStatus.numberDateAfterFrom);
      }
      if(props.elementStatus.numberDateAfterTo) {
        setNumberDateAfterTo(props.elementStatus.numberDateAfterTo);
      }
      if(props.elementStatus.numberDateAfterMode) {
        setNumberDateAfterMode(props.elementStatus.numberDateAfterMode);
      }
      if(props.elementStatus.numberMonthBeforeAfterFrom) {
        setNumberMonthBeforeAfterFrom(props.elementStatus.numberMonthBeforeAfterFrom);
      }
      if(props.elementStatus.numberMonthBeforeAfterTo) {
        setNumberMonthBeforeAfterTo(props.elementStatus.numberMonthBeforeAfterTo);
      }
      if(props.elementStatus.numberYearBeforeAfterFrom) {
        setNumberYearBeforeAfterFrom(props.elementStatus.numberYearBeforeAfterFrom);
      }
      if(props.elementStatus.numberYearBeforeAfterTo) {
        setNumberYearBeforeAfterTo(props.elementStatus.numberYearBeforeAfterTo);
      }
    }
    setIsFirst(false)
  }

  useEffect(() => {
    initialize()
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    resetValueFilter() {
      setValueFilter([])
      setDateFrom(null);
      setDateTo(null);
      setMonthdayFrom(null);
      setMonthdayTo(null);
      setNumberDateBeforeAfterFrom(null);
      setNumberDateBeforeAfterTo(null);
      setNumberDateBeforeFrom(null);
      setNumberDateBeforeTo(null);
      setNumberDateAfterFrom(null);
      setNumberDateAfterTo(null);
    },
  }));

  const getSeperate = () => {
    let arrFomarDate = []
    arrFomarDate = FORMAT_DATE.split("");
    if (arrFomarDate[0] === "Y") {
      return arrFomarDate[7];
    }else {
      return arrFomarDate[2];
    }
  }

  useEffect(() => {
    if (props.updateStateElement && !isFirst) {
      const objValue = {}
      objValue['searchBlank'] = filterModeDate === FilterModeDate.None;
      objValue['valueFilter'] = [];
      let valDown = '';
      let valUp = '';
      if (filterModeDate === FilterModeDate.PeriodYmd) {
        valDown = dateFrom ? dateFnsFormat(convertDateTimeFromTz(dateFrom), APP_DATE_FORMAT_ES) : '';
        valUp = dateTo ? dateFnsFormat(convertDateTimeFromTz(dateTo), APP_DATE_FORMAT_ES) : '';
      } else if (filterModeDate === FilterModeDate.PeriodMd) {
        if (!_.isEmpty(monthdayFrom)) {
          const monthDayArr = monthdayFrom.split('-')
          // if(IS_MONTH_BEFORE){
            valDown = monthDayArr[0] + monthDayArr[1]
          // } else {
          //   valDown = monthDayArr[1] + monthDayArr[0]
          // }
        }
        if (!_.isEmpty(monthdayTo)) {
          const monthDayArr = monthdayTo.split('-')
          // if(IS_MONTH_BEFORE){
            valUp = monthDayArr[0] + monthDayArr[1]
          // } else {
          //   valUp = monthDayArr[1] + monthDayArr[0]
          // }
        }
      } else if (filterModeDate === FilterModeDate.DayBeforeAfter) {
        if (NumberModeDate.Working === numberDateBeforeAfterMode) {
          valDown = numberDateBeforeAfterFrom;
          valUp = numberDateBeforeAfterTo;
        } else {
          valDown = getDateBeforeAfter(numberDateBeforeAfterFrom, DATE_MODE.DATE_BEFORE);
          valUp = getDateBeforeAfter(numberDateBeforeAfterTo, DATE_MODE.DATE_AFTER);
        }
      } else if (filterModeDate === FilterModeDate.TodayBefore) {
        if (NumberModeDate.Working === numberDateBeforeMode) {
          valDown = numberDateBeforeFrom;
          valUp = numberDateBeforeTo;
        } else {
          valDown = getDateBeforeAfter(numberDateBeforeFrom, DATE_MODE.DATE_BEFORE);
          valUp = getDateBeforeAfter(numberDateBeforeTo, DATE_MODE.DATE_BEFORE);
        }
      } else if (filterModeDate === FilterModeDate.TodayAfter) {
        if (NumberModeDate.Working === numberDateAfterMode) {
          valDown = numberDateAfterFrom;
          valUp = numberDateAfterTo;
        } else {
          valDown = getDateBeforeAfter(numberDateAfterFrom, DATE_MODE.DATE_AFTER);
          valUp = getDateBeforeAfter(numberDateAfterTo, DATE_MODE.DATE_AFTER);
        }
      } else if (filterModeDate === FilterModeDate.MonthBeforeAfter) {
          valDown = getDateBeforeAfter(numberMonthBeforeAfterFrom, DATE_MODE.MONTH_BEFORE);
          valUp = getDateBeforeAfter(numberMonthBeforeAfterTo, DATE_MODE.MONTH_AFTER);
      } else if (filterModeDate === FilterModeDate.YearBeforeAfter) {
          valDown = getDateBeforeAfter(numberYearBeforeAfterFrom, DATE_MODE.YEAR_BEFORE);
          valUp = getDateBeforeAfter(numberYearBeforeAfterTo, DATE_MODE.YEAR_AFTER);
      }
      if ((valDown && valDown.length > 0) || (valUp && valUp.length > 0)) {
        if ((NumberModeDate.Working === numberDateAfterMode && filterModeDate === FilterModeDate.TodayAfter)
            || (NumberModeDate.Working === numberDateBeforeMode && filterModeDate === FilterModeDate.TodayBefore)
            || (NumberModeDate.Working === numberDateBeforeAfterMode && filterModeDate === FilterModeDate.DayBeforeAfter)) {
          objValue['valueFilter'].push({from: valDown, to: valUp, filterModeDate});
        } else {
          objValue['valueFilter'].push({from: valDown, to: valUp});
        }
      }
      // save other properties
      objValue['filterModeDate'] = filterModeDate;
      objValue['dateFrom'] = dateFrom ? dateFnsFormat(dateFrom, APP_DATE_FORMAT_ES) : '';
      objValue['dateTo'] = dateTo ? dateFnsFormat(dateTo, APP_DATE_FORMAT_ES) : '';
      objValue['monthDayFrom'] = monthdayFrom;
      objValue['monthDayTo'] = monthdayTo;
      objValue['numberDateBeforeAfterFrom'] = numberDateBeforeAfterFrom;
      objValue['numberDateBeforeAfterTo'] = numberDateBeforeAfterTo;
      objValue['numberDateBeforeAfterMode'] = numberDateBeforeAfterMode;
      objValue['numberDateBeforeFrom'] = numberDateBeforeFrom;
      objValue['numberDateBeforeTo'] = numberDateBeforeTo;
      objValue['numberDateBeforeMode'] = numberDateBeforeMode;
      objValue['numberDateAfterFrom'] = numberDateAfterFrom;
      objValue['numberDateAfterTo'] = numberDateAfterTo;
      objValue['numberDateAfterMode'] = numberDateAfterMode;
      objValue['numberMonthBeforeAfterFrom'] = numberMonthBeforeAfterFrom;
      objValue['numberMonthBeforeAfterTo'] = numberMonthBeforeAfterTo;
      objValue['numberYearBeforeAfterFrom'] = numberYearBeforeAfterFrom;
      objValue['numberYearBeforeAfterTo'] = numberYearBeforeAfterTo;
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, objValue)
    }
  }, [filterModeDate, dateFrom, dateTo, monthdayFrom, monthdayTo,
      numberDateBeforeAfterFrom, numberDateBeforeAfterTo, numberDateBeforeAfterMode,
      numberDateBeforeFrom, numberDateBeforeTo, numberDateBeforeMode,
      numberDateAfterFrom, numberDateAfterTo, numberDateAfterMode,
      numberMonthBeforeAfterFrom, numberMonthBeforeAfterTo,
      numberYearBeforeAfterFrom, numberYearBeforeAfterTo]);


  const onChangeRangeFilter = (e, isFrom) => {
    const { value } = e.target;
    if (value.trim().length === 0 || numberRegExp.test(value)) {
      if (filterModeDate === FilterModeDate.DayBeforeAfter) {
        isFrom ? setNumberDateBeforeAfterFrom(value) : setNumberDateBeforeAfterTo(value);
      } else if (filterModeDate === FilterModeDate.TodayBefore) {
        isFrom ? setNumberDateBeforeFrom(value) : setNumberDateBeforeTo(value);
      } else if (filterModeDate === FilterModeDate.TodayAfter) {
        isFrom ? setNumberDateAfterFrom(value) : setNumberDateAfterTo(value);
      } else if (filterModeDate === FilterModeDate.MonthBeforeAfter) {
        isFrom ? setNumberMonthBeforeAfterFrom(value) : setNumberMonthBeforeAfterTo(value);
      } else if (filterModeDate === FilterModeDate.YearBeforeAfter) {
        isFrom ? setNumberYearBeforeAfterFrom(value) : setNumberYearBeforeAfterTo(value);
      }
    }
  }

  const renderComponentModeSearch = () => {
    const listModeSearch = [{id: FilterModeDate.PeriodYmd, name: translate(prefix + 'label.periodYmd')},
                            {id: FilterModeDate.PeriodMd, name: translate(prefix + 'label.periodMd')},
                            {id: FilterModeDate.DayBeforeAfter, name: translate(prefix + 'label.dayBeforeAfter')},
                            {id: FilterModeDate.TodayBefore, name: translate(prefix + 'label.todayBefore')},
                            {id: FilterModeDate.TodayAfter, name: translate(prefix + 'label.todayAfter')},
                            {id: FilterModeDate.MonthBeforeAfter, name: translate(prefix + 'label.monthBeforeAfter')},
                            // {id: FilterModeDate.YearBeforeAfter, name: translate(prefix + 'label.yearBeforeAfter')},
                            {id: FilterModeDate.None, name: translate(prefix + 'label.none')}];
    const indexSelected = listModeSearch.findIndex( e => e.id === filterModeDate);
    return (<>
      <div className="form-group">
        <button className="select-option mb-3 w100" onClick={() => setShowModeSearch(!showModeSearch)}>
          <span className="select-text">{listModeSearch[indexSelected].name}</span>
        </button>
        {showModeSearch &&
          <div ref={divModeSearch} className="drop-down drop-down2 w100">
            <ul>
              {listModeSearch.map((e, idx) =>
                <li key={idx} className={`item ${filterModeDate === e.id ? 'active' : ''} smooth`}
                  onClick={() => { setFilterModeDate(e.id); setShowModeSearch(false) }}
                >
                  <div className="text text2">{e.name}</div>
                </li>
              )}
            </ul>
          </div>
        }
      </div>
      </>);
  }

  return (<>
    {renderComponentModeSearch()}
    {filterModeDate === FilterModeDate.PeriodYmd && <>
      <div className="d-flex align-items-center">
        <DatePicker
          date={dateFrom}
          inputClass="input-normal mb-3"
          onDateChanged={(d) => setDateFrom(d)}
          placeholder={translate(prefix + 'placeholder.selectDate')}
          componentClass = "filter-box"
          classFilter="form-group common has-delete mb-0 mt-0"
        />
        <p className="white-space-nowrap w22 text-right mb-3">{translate(prefix + 'label.from')}</p>
      </div>
      <div className="d-flex align-items-center">
        <DatePicker
          date={dateTo}
          inputClass="input-normal mb-3"
          onDateChanged={(d) => setDateTo(d)}
          placeholder={translate(prefix + 'placeholder.selectDate')}
          componentClass = "filter-box"
          classFilter="form-group common has-delete mb-0 mt-0"
        />
        <p className="white-space-nowrap w22 text-right mb-3">{translate(prefix + 'label.to')}</p>
      </div>
    </>}
    {filterModeDate === FilterModeDate.PeriodMd && <>
      <div className="d-flex align-items-center">
        <MonthDayPicker
          classFilter="mb-3 mt-0"
          monthDay={monthdayFrom}
          onChangeMonthDay={(monthday) => setMonthdayFrom(monthday)}
          placeHolder = "--"
          noPositionAbsolute = {1}
          location = "l-0"
        />
        <p className="white-space-nowrap w22 text-right mb-3">{translate(prefix + 'label.from')}</p>
      </div>
      <div className="d-flex align-items-center">
        <MonthDayPicker
          classFilter="mb-3 mt-0"
          monthDay={monthdayTo}
          onChangeMonthDay={(monthday) => setMonthdayTo(monthday)}
          placeHolder = "--"
          noPositionAbsolute = {1}
          location = "l-0"
        />
        <p className="white-space-nowrap w22 text-right mb-3">{translate(prefix + 'label.to')}</p>
      </div>
    </>}
    {filterModeDate === FilterModeDate.DayBeforeAfter && <>
      <div className="advanced-search-wrap">
        <div className="advanced-search no-padding border-0">
          <div className="starting-today mt-2">
            <p className="today">{translate(prefix + 'label.dateFrom')}</p>
            <div className="from">
              <input className="form-control" id="from-date" type="text" placeholder="0"
                value={numberDateBeforeAfterFrom}
                onChange= {(e) => onChangeRangeFilter(e, true)}
                onKeyUp={(e) => onChangeRangeFilter(e, true)}
                onKeyDown={(e) => onChangeRangeFilter(e, true)}
              />
              <span>{translate(prefix + 'label.multilDayBefore')}</span>
            </div>
            <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
            <div className="to">
              <input className="form-control" id="to-date" type="text" placeholder="0"
                value={numberDateBeforeAfterTo}
                onChange= {(e) => onChangeRangeFilter(e, false)}
                onKeyUp={(e) => onChangeRangeFilter(e, false)}
                onKeyDown={(e) => onChangeRangeFilter(e, false)}
              />
              <span>{translate(prefix + 'label.multilDayAfter')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="my-3 d-flex justify-content-between">
        <p className="radio-item normal d-inline">
          <input id={idRadio[0]} name={nameRadio[0]} type="radio"
            value={NumberModeDate.Normal}
            checked={NumberModeDate.Normal === numberDateBeforeAfterMode}
            onChange={() => setNumberDateBeforeAfterMode(NumberModeDate.Normal)}
          />
          <label htmlFor={idRadio[0]}>{translate(prefix + 'label.realDate')}</label>
        </p>
        <p className="radio-item normal d-inline">
          <input id={idRadio[1]} name={nameRadio[0]} type="radio"
            value={NumberModeDate.Working}
            checked={NumberModeDate.Working === numberDateBeforeAfterMode}
            onChange={() => setNumberDateBeforeAfterMode(NumberModeDate.Working)}
          />
          <label htmlFor={idRadio[1]}>{translate(prefix + 'label.workDate')}</label>
        </p>
      </div>
    </>}
    {filterModeDate === FilterModeDate.TodayBefore && <>
      <div className="advanced-search-wrap">
        <div className="advanced-search no-padding border-0">
          <div className="starting-today mt-2">
            <p className="today">{translate(prefix + 'label.dateFrom')}</p>
            <div className="from">
              <input className="form-control" id="from-date" type="text" placeholder="0"
                value={numberDateBeforeFrom}
                onChange= {(e) => onChangeRangeFilter(e, true)}
                onKeyUp={(e) => onChangeRangeFilter(e, true)}
                onKeyDown={(e) => onChangeRangeFilter(e, true)}
              />
              <span>{translate(prefix + 'label.oneDayBefore')}</span>
            </div>
            <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
            <div className="to">
              <input className="form-control" id="to-date" type="text" placeholder="0"
                value={numberDateBeforeTo}
                onChange= {(e) => onChangeRangeFilter(e, false)}
                onKeyUp={(e) => onChangeRangeFilter(e, false)}
                onKeyDown={(e) => onChangeRangeFilter(e, false)}
              />
              <span>{translate(prefix + 'label.oneDayBefore')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="my-3 d-flex justify-content-between">
        <p className="radio-item normal d-inline">
          <input id={idRadio[0]} name={nameRadio[0]} type="radio"
            value={NumberModeDate.Normal}
            checked={NumberModeDate.Normal === numberDateBeforeMode}
            onChange={() => setNumberDateBeforeMode(NumberModeDate.Normal)}
          />
          <label htmlFor={idRadio[0]}>{translate(prefix + 'label.realDate')}</label>
        </p>
        <p className="radio-item normal d-inline">
          <input id={idRadio[1]} name={nameRadio[0]} type="radio"
            value={NumberModeDate.Working}
            checked={NumberModeDate.Working === numberDateBeforeMode}
            onChange={() => setNumberDateBeforeMode(NumberModeDate.Working)}
          />
          <label htmlFor={idRadio[1]}>{translate(prefix + 'label.workDate')}</label>
        </p>
      </div>
    </>}
    {filterModeDate === FilterModeDate.TodayAfter && <>
      <div className="advanced-search-wrap">
        <div className="advanced-search no-padding border-0">
          <div className="starting-today mt-2">
            <p className="today">{translate(prefix + 'label.dateFrom')}</p>
            <div className="from">
              <input className="form-control" id="from-date" type="text" placeholder="0"
                value={numberDateAfterFrom}
                onChange= {(e) => onChangeRangeFilter(e, true)}
                onKeyUp={(e) => onChangeRangeFilter(e, true)}
                onKeyDown={(e) => onChangeRangeFilter(e, true)}
              />
              <span>{translate(prefix + 'label.multilDayAfter')}</span>
            </div>
            <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
            <div className="to">
              <input className="form-control" id="to-date" type="text" placeholder="0"
                value={numberDateAfterTo}
                onChange= {(e) => onChangeRangeFilter(e, false)}
                onKeyUp={(e) => onChangeRangeFilter(e, false)}
                onKeyDown={(e) => onChangeRangeFilter(e, false)}
              />
              <span>{translate(prefix + 'label.multilDayAfter')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="my-3 d-flex justify-content-between">
        <p className="radio-item normal d-inline">
          <input id={idRadio[0]} name={nameRadio[0]} type="radio"
            value={NumberModeDate.Normal}
            checked={NumberModeDate.Normal === numberDateAfterMode}
            onChange={() => setNumberDateAfterMode(NumberModeDate.Normal)}
          />
          <label htmlFor={idRadio[0]}>{translate(prefix + 'label.realDate')}</label>
        </p>
        <p className="radio-item normal d-inline">
          <input id={idRadio[1]} name={nameRadio[0]} type="radio"
            value={NumberModeDate.Working}
            checked={NumberModeDate.Working === numberDateAfterMode}
            onChange={() => setNumberDateAfterMode(NumberModeDate.Working)}
          />
          <label htmlFor={idRadio[1]}>{translate(prefix + 'label.workDate')}</label>
        </p>
      </div>
    </>}
    {filterModeDate === FilterModeDate.MonthBeforeAfter &&
      <div className="advanced-search-wrap">
        <div className="advanced-search no-padding border-0">
          <div className="starting-today mt-2 date-before-after">
            <p className="today">{translate(prefix + 'label.dateFrom')}</p>
            <div className="from">
              <input className="form-control" id="from-date" type="text" placeholder="0"
                value={numberMonthBeforeAfterFrom}
                onChange= {(e) => onChangeRangeFilter(e, true)}
                onKeyUp={(e) => onChangeRangeFilter(e, true)}
                onKeyDown={(e) => onChangeRangeFilter(e, true)}
              />
              <span>{translate(prefix + 'label.monthBeforeAfterFrom')}</span>
            </div>
            <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
            <div className="to">
              <input className="form-control" id="to-date" type="text" placeholder="0"
                value={numberMonthBeforeAfterTo}
                onChange= {(e) => onChangeRangeFilter(e, false)}
                onKeyUp={(e) => onChangeRangeFilter(e, false)}
                onKeyDown={(e) => onChangeRangeFilter(e, false)}
              />
              <span>{translate(prefix + 'label.monthBeforeAfterTo')}</span>
            </div>
          </div>
        </div>
      </div>
    }
    {filterModeDate === FilterModeDate.YearBeforeAfter &&
      <div className="advanced-search-wrap">
        <div className="advanced-search no-padding border-0">
          <div className="starting-today mt-2">
            <p className="today">{translate(prefix + 'label.dateFrom')}</p>
            <div className="from">
              <input className="form-control" id="from-date" type="text" placeholder="0"
                value={numberYearBeforeAfterFrom}
                onChange= {(e) => onChangeRangeFilter(e, true)}
                onKeyUp={(e) => onChangeRangeFilter(e, true)}
                onKeyDown={(e) => onChangeRangeFilter(e, true)}
              />
              <span>{translate(prefix + 'label.multilYearBefore')}</span>
            </div>
            <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
            <div className="to">
              <input className="form-control" id="to-date" type="text" placeholder="0"
                value={numberYearBeforeAfterTo}
                onChange= {(e) => onChangeRangeFilter(e, false)}
                onKeyUp={(e) => onChangeRangeFilter(e, false)}
                onKeyDown={(e) => onChangeRangeFilter(e, false)}
              />
              <span>{translate(prefix + 'label.multilYearAfter')}</span>
            </div>
          </div>
        </div>
      </div>
    }
  </>)
})

export default FieldListFilterDate