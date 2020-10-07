import React, { useImperativeHandle, useState, useEffect, forwardRef, useRef } from 'react';
import { useId } from 'react-id-generator';
import _, { parseInt } from 'lodash';
import DayPicker from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import DatePicker from '../../../common/date-picker';
import 'react-day-picker/lib/style.css';
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';
import { FilterModeDate, NumberModeDate } from '../../constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { getFieldLabel, parseDateDefault } from 'app/shared/util/string-utils';
import { Storage, translate } from 'react-jhipster';
import { APP_DATE_FORMAT_ES, DATE_MODE, APP_DATE_FORMAT, USER_FORMAT_DATE_KEY } from 'app/config/constants';
import {
  getHourMinute, isValidTimeFormat, getDateBeforeAfter, convertDateTimeToTz, convertDateTimeFromTz,
  DATE_TIME_FORMAT, tzToUtc, timeTzToUtc, getTimezonesOffset, DEFAULT_TIME, tzDateToDateTimeUtc
} from 'app/shared/util/date-utils';
import TimePicker from '../component/time-picker';
import moment from 'moment';

import StringUtils, { getNumberFromDay, getNumberToDay } from 'app/shared/util/string-utils';


type IFieldListFilterDateTimeProps = IDynamicFieldProps

const FieldListFilterDateTime = forwardRef((props: IFieldListFilterDateTimeProps, ref) => {
  // const FORMAT_DATE = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT)
  const [, setValueFilter] = useState(null);
  const [, setSearchBlank] = useState(false);
  const [filterModeDate, setFilterModeDate] = useState(FilterModeDate.PeriodYmdHm);
  const [isFirst, setIsFirst] = useState(true);
  const [datetimeDayFrom, setDatetimeDayFrom] = useState(null);
  const [datetimeTimeFrom, setDatetimeTimeFrom] = useState('');
  const [datetimeDayTo, setDatetimeDayTo] = useState(null);
  const [datetimeTimeTo, setDatetimeTimeTo] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [numberDateBeforeAfterFrom, setNumberDateBeforeAfterFrom] = useState(null);
  const [numberDateBeforeAfterTo, setNumberDateBeforeAfterTo] = useState(null);
  const [numberDateBeforeAfterMode, setNumberDateBeforeAfterMode] = useState(NumberModeDate.Normal);
  const [numberDateBeforeFrom, setNumberDateBeforeFrom] = useState(null);
  const [numberDateBeforeTo, setNumberDateBeforeTo] = useState(null);
  const [numberDateBeforeMode, setNumberDateBeforeMode] = useState(NumberModeDate.Normal);
  const [numberDateAfterFrom, setNumberDateAfterFrom] = useState(null);
  const [numberDateAfterTo, setNumberDateAfterTo] = useState(null);
  const [numberDateAfterMode, setNumberDateAfterMode] = useState(NumberModeDate.Normal);

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

  const setStateNumber = (number) => {
    setFilterModeDate(parseInt(number))
  }

  const tryParseToJson = (valueObj, defaultValue) => {
    let objJson = null;
    try {
      if (_.isString(valueObj)) {
        objJson = JSON.parse(valueObj);
      } else {
        objJson = valueObj;
      }
    } catch {
      objJson = defaultValue;
    }
    return objJson;
  }

  const setModeDateWorking = (valueFilter) => {
    switch (props.elementStatus.searchType.toString()) {
      case FilterModeDate.DayBeforeAfter.toString():
        valueFilter['dayFrom'] ? setNumberDateBeforeAfterFrom(getNumberFromDay(valueFilter['dayFrom']).toString()) : setNumberDateBeforeAfterFrom(null);
        valueFilter['dayTo'] ? setNumberDateBeforeAfterTo(getNumberToDay(valueFilter['dayTo']).toString()) : setNumberDateBeforeAfterTo(null);
        if (valueFilter['filterModeDate']) {
          setNumberDateBeforeAfterMode(NumberModeDate.Working);
          valueFilter['dayFrom'] ? setNumberDateBeforeAfterFrom(valueFilter['dayFrom']) : setNumberDateBeforeAfterFrom(null);
          valueFilter['dayTo'] ? setNumberDateBeforeAfterTo(valueFilter['dayTo']) : setNumberDateBeforeAfterTo(null);
        }
        break;
      case FilterModeDate.TodayBefore.toString():
        valueFilter['dayFrom'] ? setNumberDateBeforeFrom(getNumberFromDay(valueFilter['dayFrom']).toString()) : setNumberDateBeforeFrom(null);
        valueFilter['dayTo'] ? setNumberDateBeforeTo(getNumberFromDay(valueFilter['dayTo']).toString()) : setNumberDateBeforeTo(null);
        if (valueFilter['filterModeDate']) {
          setNumberDateBeforeMode(NumberModeDate.Working);
          valueFilter['dayFrom'] ? setNumberDateBeforeFrom(valueFilter['dayFrom']) : setNumberDateBeforeFrom(null);
          valueFilter['dayTo'] ? setNumberDateBeforeTo(valueFilter['dayTo']) : setNumberDateBeforeTo(null);
        }
        break;
      case FilterModeDate.TodayAfter.toString():
        valueFilter['dayFrom'] ? setNumberDateAfterFrom(getNumberToDay(valueFilter['dayFrom']).toString()) : setNumberDateAfterFrom(null);
        valueFilter['dayTo'] ? setNumberDateAfterTo(getNumberToDay(valueFilter['dayTo']).toString()) : setNumberDateAfterTo(null);
        if (valueFilter['filterModeDate']) {
          setNumberDateAfterMode(NumberModeDate.Working);
          valueFilter['dayFrom'] ? setNumberDateAfterFrom(valueFilter['dayFrom']) : setNumberDateAfterFrom(null);
          valueFilter['dayTo'] ? setNumberDateAfterTo(valueFilter['dayTo']) : setNumberDateAfterTo(null);
        }
        break;
      default:
        break;
    }
  }

  const setDateTimePeriodYmdHm = (valueSearch) => {
    valueSearch['dayFrom'] &&  setDatetimeDayFrom(new Date(valueSearch['dayFrom']));
    valueSearch['timeFrom'] && setDatetimeTimeFrom(valueSearch['timeFrom']);
    valueSearch['dayTo'] ? setDatetimeDayTo(new Date(valueSearch['dayTo'])) : setDatetimeDayTo(null);
    valueSearch['timeTo'] && setDatetimeTimeTo(valueSearch['timeTo']);
  }

  const setDatePeriodYmd = (valueSearch) => {
    valueSearch['dayFrom'] ? setDateFrom(new Date(valueSearch['dayFrom'])) : setDateFrom(null);
    valueSearch['dayTo'] ? setDateTo(new Date(valueSearch['dayTo'])) : setDateTo(null);
  }

  const initialize = () => {
    if (props.elementStatus) {
      const valueFilterProps = tryParseToJson(props.elementStatus.valueFilter, []);
      if (valueFilterProps) {
        const valueFilterTime = parseDateDefault(valueFilterProps);
        if (props.elementStatus && props.elementStatus.searchType && valueFilterTime) {
          setStateNumber(props.elementStatus.searchType);
          switch (props.elementStatus.searchType.toString()) {
            case FilterModeDate.PeriodYmdHm.toString(): {
              setDateTimePeriodYmdHm(valueFilterTime);
                break;
              break;
            }
            case FilterModeDate.PeriodHm.toString(): {
              setTimeFrom(valueFilterProps.from);
              setTimeTo(valueFilterProps.to);
              break;
            }
            case FilterModeDate.PeriodYmd.toString(): {
              setDatePeriodYmd(valueFilterTime);
              break;
            }
            case FilterModeDate.DayBeforeAfter.toString():
            case FilterModeDate.TodayBefore.toString():
            case FilterModeDate.TodayAfter.toString():
              {
                setModeDateWorking(valueFilterTime);
                break;
              }
            default:
              break;
          }
        }
      }

      if (props.elementStatus && props.elementStatus.searchType) {
        setStateNumber(props.elementStatus.searchType);
      }
      if (props.elementStatus.valueFilter && props.elementStatus.valueFilter.length > 0) {
        setValueFilter(props.elementStatus.valueFilter);
      }
      if (props.elementStatus.isSearchBlank) {
        setSearchBlank(props.elementStatus.isSearchBlank);
      }
      if (props.elementStatus.datetimeDayFrom) {
        const parsed = dateFnsParse(props.elementStatus.datetimeDayFrom);
        if (DayPicker.DateUtils.isDate(parsed)) {
          setDatetimeDayFrom(parsed)
        }
      }
      if (props.elementStatus.datetimeDayTo) {
        const parsed = dateFnsParse(props.elementStatus.datetimeDayTo);
        if (DayPicker.DateUtils.isDate(parsed)) {
          setDatetimeDayTo(parsed)
        }
      }
      if (props.elementStatus.datetimeTimeFrom) {
        setDatetimeTimeFrom(props.elementStatus.datetimeTimeFrom.toString());
      }
      if (props.elementStatus.datetimeTimeTo) {
        setDatetimeTimeTo(props.elementStatus.datetimeTimeTo.toString());
      }
      if (!_.isNil(props.elementStatus.filterModeDate)) {
        setFilterModeDate(props.elementStatus.filterModeDate);
      }
      if (props.elementStatus.timeFrom) {
        setTimeFrom(props.elementStatus.timeFrom);
      }
      if (props.elementStatus.timeTo) {
        setTimeTo(props.elementStatus.timeTo);
      }
      if (props.elementStatus.dateFrom) {
        const parsed = dateFnsParse(props.elementStatus.dateFrom);
        if (DayPicker.DateUtils.isDate(parsed)) {
          setDateFrom(convertDateTimeToTz(parsed))
        }
      }
      if (props.elementStatus.dateTo) {
        const parsed = dateFnsParse(props.elementStatus.dateTo);
        if (DayPicker.DateUtils.isDate(parsed)) {
          setDateTo(convertDateTimeToTz(parsed))
        }
      }
      if (props.elementStatus.numberDateBeforeAfterFrom) {
        setNumberDateBeforeAfterFrom(props.elementStatus.numberDateBeforeAfterFrom);
      }
      if (props.elementStatus.numberDateBeforeAfterTo) {
        setNumberDateBeforeAfterTo(props.elementStatus.numberDateBeforeAfterTo);
      }
      if (props.elementStatus.numberDateBeforeAfterMode) {
        setNumberDateBeforeAfterMode(props.elementStatus.numberDateBeforeAfterMode);
      }
      if (props.elementStatus.numberDateBeforeFrom) {
        setNumberDateBeforeFrom(props.elementStatus.numberDateBeforeFrom);
      }
      if (props.elementStatus.numberDateBeforeTo) {
        setNumberDateBeforeTo(props.elementStatus.numberDateBeforeTo);
      }
      if (props.elementStatus.numberDateBeforeMode) {
        setNumberDateBeforeMode(props.elementStatus.numberDateBeforeMode);
      }
      if (props.elementStatus.numberDateAfterFrom) {
        setNumberDateAfterFrom(props.elementStatus.numberDateAfterFrom);
      }
      if (props.elementStatus.numberDateAfterTo) {
        setNumberDateAfterTo(props.elementStatus.numberDateAfterTo);
      }
      if (props.elementStatus.numberDateAfterMode) {
        setNumberDateAfterMode(props.elementStatus.numberDateAfterMode);
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
      setDatetimeDayFrom(null);
      setDatetimeTimeFrom('');
      setDatetimeDayTo(null);
      setDatetimeTimeTo('');
      setDateFrom(null);
      setDateTo(null);
      setTimeFrom('');
      setTimeTo('');
      setNumberDateBeforeAfterFrom(null);
      setNumberDateBeforeAfterTo(null);
      setNumberDateBeforeFrom(null);
      setNumberDateBeforeTo(null);
      setNumberDateAfterFrom(null);
      setNumberDateAfterTo(null);
    },
  }));

  const getValueFilter = (objValue: {}, valDown: string, valUp: string) => {
    if ((NumberModeDate.Working === numberDateAfterMode && filterModeDate === FilterModeDate.TodayAfter)
      || (NumberModeDate.Working === numberDateBeforeMode && filterModeDate === FilterModeDate.TodayBefore)
      || (NumberModeDate.Working === numberDateBeforeAfterMode && filterModeDate === FilterModeDate.DayBeforeAfter)) {
      objValue['valueFilter'].push({ from: valDown, to: valUp, filterModeDate });
    }
    else {
      objValue['valueFilter'].push({ from: valDown, to: valUp });
    }
  }

  const getFromToSpecial = () => {
    let valDown;
    let valUp;
    let timeZoneOffset;
    if (filterModeDate === FilterModeDate.PeriodYmd) {
      valDown = dateFrom ? dateFnsFormat(dateFrom, APP_DATE_FORMAT_ES) : '';
      valUp = dateTo ? dateFnsFormat(dateTo, APP_DATE_FORMAT_ES) : '';
      if (dateFrom || dateTo) {
        valDown = `${dateFrom ? tzDateToDateTimeUtc(dateFrom, DATE_TIME_FORMAT.Database, DEFAULT_TIME.FROM) : ""}`;
        valUp = `${dateTo ? tzDateToDateTimeUtc(dateTo, DATE_TIME_FORMAT.Database, DEFAULT_TIME.TO) : ""}`;
      }
    } else if (filterModeDate === FilterModeDate.DayBeforeAfter) {
      if (NumberModeDate.Working === numberDateBeforeAfterMode) {
        valDown = numberDateBeforeAfterFrom;
        valUp = numberDateBeforeAfterTo;
        timeZoneOffset = getTimezonesOffset();
      } else {
        valDown = getDateBeforeAfter(numberDateBeforeAfterFrom, DATE_MODE.DATE_BEFORE);
        valUp = getDateBeforeAfter(numberDateBeforeAfterTo, DATE_MODE.DATE_AFTER);
        valDown = `${valDown ? `${tzDateToDateTimeUtc(valDown, DATE_TIME_FORMAT.Database, DEFAULT_TIME.FROM)}:00` : ""}`;
        valUp = `${valUp ? `${tzDateToDateTimeUtc(valUp, DATE_TIME_FORMAT.Database, DEFAULT_TIME.TO)}:59` : ""}`;
      }
    } else if (filterModeDate === FilterModeDate.TodayBefore) {
      if (NumberModeDate.Working === numberDateBeforeMode) {
        valDown = numberDateBeforeFrom;
        valUp = numberDateBeforeTo;
        timeZoneOffset = getTimezonesOffset();
      } else {
        valDown = getDateBeforeAfter(numberDateBeforeFrom, DATE_MODE.DATE_BEFORE);
        valUp = getDateBeforeAfter(numberDateBeforeTo, DATE_MODE.DATE_BEFORE);
        valDown = `${valDown ? `${tzDateToDateTimeUtc(valDown, DATE_TIME_FORMAT.Database, DEFAULT_TIME.FROM)}:00` : ""}`;
        valUp = `${valUp ? `${tzDateToDateTimeUtc(valUp, DATE_TIME_FORMAT.Database, DEFAULT_TIME.TO)}:59}` : ""}`;
      }
    } else if (filterModeDate === FilterModeDate.TodayAfter) {
      if (NumberModeDate.Working === numberDateAfterMode) {
        valDown = numberDateAfterFrom;
        valUp = numberDateAfterTo;
        timeZoneOffset = getTimezonesOffset();
      } else {
        valDown = getDateBeforeAfter(numberDateAfterFrom, DATE_MODE.DATE_AFTER);
        valUp = getDateBeforeAfter(numberDateAfterTo, DATE_MODE.DATE_AFTER);
        valDown = `${valDown ? `${tzDateToDateTimeUtc(valDown, DATE_TIME_FORMAT.Database, DEFAULT_TIME.FROM)}:00` : ""}`;
        valUp = `${valUp ? `${tzDateToDateTimeUtc(valUp, DATE_TIME_FORMAT.Database, DEFAULT_TIME.TO)}:59` : ""}`;
      }
    }
    return { valDown, valUp, timeZoneOffset };
  }

  useEffect(() => {
    if (props.updateStateElement && !isFirst) {
      const objValue = {}
      objValue['searchBlank'] = filterModeDate === FilterModeDate.None;
      objValue['valueFilter'] = [];
      let valDown = '';
      let valUp = '';
      let timeZoneOffset;
      if (filterModeDate === FilterModeDate.PeriodYmdHm) {
        let hhMMFrom;
        if (datetimeTimeFrom && isValidTime(datetimeTimeFrom)) {
          hhMMFrom = getHourMinute(datetimeTimeFrom);
        }
        let hhMMTo;
        if (datetimeTimeTo && isValidTime(datetimeTimeTo)) {
          hhMMTo = getHourMinute(datetimeTimeTo);
        }

        if (hhMMFrom && datetimeTimeFrom) {
          hhMMFrom = `${hhMMFrom.hour.toString().padStart(2, '0')}:${hhMMFrom.minute.toString().padStart(2, '0')}:00`;
        } else {
          hhMMFrom = "00:00:00";
        }
        if (hhMMTo && datetimeTimeTo) {
          hhMMTo = `${hhMMTo.hour.toString().padStart(2, '0')}:${hhMMTo.minute.toString().padStart(2, '0')}:59`;
        } else {
          hhMMTo = "23:59:59";
        }
        valDown = `${datetimeDayFrom ? `${tzToUtc(dateFnsFormat(datetimeDayFrom, APP_DATE_FORMAT_ES) + " " + hhMMFrom, DATE_TIME_FORMAT.Database)}` : ""}`;
        valUp = `${datetimeDayTo ? `${tzToUtc(dateFnsFormat(datetimeDayTo, APP_DATE_FORMAT_ES) + " " + hhMMTo, DATE_TIME_FORMAT.Database)}` : ""}`;
      } else if (filterModeDate === FilterModeDate.PeriodHm) {
        let hhMMFrom;
        if (timeFrom && isValidTime(timeFrom)) {
          hhMMFrom = getHourMinute(timeFrom);
        }
        let hhMMTo;
        if (timeTo && isValidTime(timeTo)) {
          hhMMTo = getHourMinute(timeTo);
        }
        if (hhMMFrom && timeFrom) {
          valDown = `${hhMMFrom.hour.toString().padStart(2, '0')}:${hhMMFrom.minute.toString().padStart(2, '0')}`;
        }
        if (hhMMTo && timeTo) {
          valUp = `${hhMMTo.hour.toString().padStart(2, '0')}:${hhMMTo.minute.toString().padStart(2, '0')}`;
        }
        if (valDown || valUp) {
          valDown = valDown ? valDown : DEFAULT_TIME.FROM;
          valUp = valUp ? valUp : DEFAULT_TIME.TO;
        }
      }
      if (!valDown && !valUp) {
        const special = getFromToSpecial();
        valDown = special.valDown;
        valUp = special.valUp;
        timeZoneOffset = special.timeZoneOffset;
      }

      if ((valDown && valDown.length > 0) || (valUp && valUp.length > 0)) {
        getValueFilter(objValue, valDown, valUp);
      }
      // save other properties
      objValue['filterModeDate'] = filterModeDate;
      objValue['datetimeDayFrom'] = datetimeDayFrom ? dateFnsFormat(datetimeDayFrom, APP_DATE_FORMAT_ES) : '';
      objValue['datetimeDayTo'] = datetimeDayTo ? dateFnsFormat(datetimeDayTo, APP_DATE_FORMAT_ES) : '';
      objValue['datetimeTimeFrom'] = datetimeTimeFrom;
      objValue['datetimeTimeTo'] = datetimeTimeTo;
      objValue['timeFrom'] = timeFrom;
      objValue['timeTo'] = timeTo;
      objValue['dateFrom'] = dateFrom ? dateFnsFormat(dateFrom, APP_DATE_FORMAT_ES) : '';
      objValue['dateTo'] = dateTo ? dateFnsFormat(dateTo, APP_DATE_FORMAT_ES) : '';
      objValue['numberDateBeforeAfterFrom'] = numberDateBeforeAfterFrom;
      objValue['numberDateBeforeAfterTo'] = numberDateBeforeAfterTo;
      objValue['numberDateBeforeAfterMode'] = numberDateBeforeAfterMode;
      objValue['numberDateBeforeFrom'] = numberDateBeforeFrom;
      objValue['numberDateBeforeTo'] = numberDateBeforeTo;
      objValue['numberDateBeforeMode'] = numberDateBeforeMode;
      objValue['numberDateAfterFrom'] = numberDateAfterFrom;
      objValue['numberDateAfterTo'] = numberDateAfterTo;
      objValue['numberDateAfterMode'] = numberDateAfterMode;
      objValue['timeZoneOffset'] = timeZoneOffset;
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, objValue)
    }
  }, [filterModeDate, timeFrom, timeTo, dateFrom, dateTo,
    datetimeDayFrom, datetimeTimeFrom, datetimeDayTo, datetimeTimeTo,
    numberDateBeforeAfterFrom, numberDateBeforeAfterTo, numberDateBeforeAfterMode,
    numberDateBeforeFrom, numberDateBeforeTo, numberDateBeforeMode,
    numberDateAfterFrom, numberDateAfterTo, numberDateAfterMode,
  ]);


  const onChangeRangeFilter = (e, isFrom) => {
    const { value } = e.target;
    if (value.trim().length === 0 || numberRegExp.test(value)) {
      if (filterModeDate === FilterModeDate.DayBeforeAfter) {
        isFrom ? setNumberDateBeforeAfterFrom(value) : setNumberDateBeforeAfterTo(value);
      } else if (filterModeDate === FilterModeDate.TodayBefore) {
        isFrom ? setNumberDateBeforeFrom(value) : setNumberDateBeforeTo(value);
      } else if (filterModeDate === FilterModeDate.TodayAfter) {
        isFrom ? setNumberDateAfterFrom(value) : setNumberDateAfterTo(value);
      }
    }
  }

  const renderComponentModeSearch = () => {
    const listModeSearch = [{ id: FilterModeDate.PeriodYmdHm, name: translate(prefix + 'label.periodYmdHm') },
    { id: FilterModeDate.PeriodHm, name: translate(prefix + 'label.periodHm') },
    { id: FilterModeDate.PeriodYmd, name: translate(prefix + 'label.periodYmd') },
    { id: FilterModeDate.DayBeforeAfter, name: translate(prefix + 'label.dayBeforeAfter') },
    { id: FilterModeDate.TodayBefore, name: translate(prefix + 'label.todayBefore') },
    { id: FilterModeDate.TodayAfter, name: translate(prefix + 'label.todayAfter') },
    { id: FilterModeDate.None, name: translate(prefix + 'label.none') }];
    const indexSelected = listModeSearch.findIndex(e => e.id === filterModeDate);
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
  const fieldNamePlaceHolder = getFieldLabel(props.fieldInfo, 'fieldLabel');
  return (<>
    {renderComponentModeSearch()}
    {filterModeDate === FilterModeDate.PeriodYmdHm && <>
      <div className="d-flex align-items-center justify-content-between">
        <div className="w40 form-group common has-delete mt-0">
          <DatePicker
            date={datetimeDayFrom}
            inputClass="input-normal w100"
            onDateChanged={(d) => setDatetimeDayFrom(d)}
            placeholder={translate(prefix + 'placeholder.selectDate')}
            componentClass="filter-box"
          />
        </div>
        <div className="w40 form-group has-delete mt-0">
          <TimePicker
            isWithoutOuterDiv={true}
            isWithoutInnerDiv={true}
            selectOptionClass="position-relative"
            fieldInfo={props.fieldInfo}
            inputClass="input-normal w100"
            selectBoxClass="filter-time-from location-r0"
            isDisabled={props.isDisabled}
            errorInfo={props.errorInfo}
            onChangeTime={(val) => setDatetimeTimeFrom(val)}
            enterInputControl={props.enterInputControl}
            placeholder={translate(prefix + 'placeholder.selectTime')}
            timeInit={datetimeTimeFrom}
            noPositionAbsolute={1}
          />
        </div>
        <p className="white-space-nowrap text-right mb-4">{translate(prefix + 'label.from')}</p>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="w40 form-group common has-delete mt-0">
          <DatePicker
            date={datetimeDayTo}
            inputClass="input-normal w100"
            onDateChanged={(d) => setDatetimeDayTo(d)}
            placeholder={translate(prefix + 'placeholder.selectDate')}
            componentClass="filter-box"
          />
        </div>
        <div className="w40 form-group has-delete mt-0">
          <TimePicker
            isWithoutOuterDiv={true}
            isWithoutInnerDiv={true}
            selectOptionClass="position-relative"
            fieldInfo={props.fieldInfo}
            inputClass="input-normal w100"
            selectBoxClass="filter-time-from location-r0"
            isDisabled={props.isDisabled}
            errorInfo={props.errorInfo}
            onChangeTime={(val) => setDatetimeTimeTo(val)}
            enterInputControl={props.enterInputControl}
            placeholder={translate(prefix + 'placeholder.selectTime')}
            timeInit={datetimeTimeTo}
            noPositionAbsolute={1}
          />
        </div>
        <p className="white-space-nowrap text-right mb-4">{translate(prefix + 'label.to')}</p>
      </div>
    </>}
    {filterModeDate === FilterModeDate.PeriodHm &&
      <div className="wrap-input-number">
        <div className="form-group common position-relative has-delete mt-0 mb-3">
          <TimePicker
            isWithoutInnerDiv={true}
            isWithoutOuterDiv={true}
            fieldInfo={props.fieldInfo}
            inputClass="input-normal text-center"
            selectBoxClass="filter-time-from l-0"
            isDisabled={props.isDisabled}
            errorInfo={props.errorInfo}
            onChangeTime={(val) => setTimeFrom(val)}
            enterInputControl={props.enterInputControl}
            placeholder="00:00"
            timeInit={timeFrom}
            noPositionAbsolute={1}
          />
        </div>
        <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
        <div className="form-group common position-relative has-delete mt-0 mb-3">
          <TimePicker
            isWithoutInnerDiv={true}
            isWithoutOuterDiv={true}
            fieldInfo={props.fieldInfo}
            inputClass="input-normal text-center"
            selectBoxClass="filter-time-to location-r0"
            isDisabled={props.isDisabled}
            errorInfo={props.errorInfo}
            onChangeTime={(val) => setTimeTo(val)}
            enterInputControl={props.enterInputControl}
            placeholder="00:00"
            timeInit={timeTo}
            noPositionAbsolute={1}
          />
        </div>
      </div>
    }
    {filterModeDate === FilterModeDate.PeriodYmd && <>
      <div className="d-flex align-items-center form-group has-delete">
        <DatePicker
          classFilter="position-relative"
          date={dateFrom}
          inputClass="input-normal"
          onDateChanged={(d) => setDateFrom(d)}
          placeholder={StringUtils.translateSpecial('dynamic-control.placeholder.dateTime', { fieldNamePlaceHolder })}
          componentClass="filter-box"
        />
        <p className="white-space-nowrap w22 text-right mb-3">{translate(prefix + 'label.from')}</p>
      </div>
      <div className="d-flex align-items-center form-group has-delete">
        <DatePicker
          classFilter="position-relative"
          date={dateTo}
          inputClass="input-normal"
          onDateChanged={(d) => setDateTo(d)}
          placeholder={StringUtils.translateSpecial('dynamic-control.placeholder.dateTime', { fieldNamePlaceHolder })}
          componentClass="filter-box"
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
                onChange={(e) => onChangeRangeFilter(e, true)}
                onKeyUp={(e) => onChangeRangeFilter(e, true)}
                onKeyDown={(e) => onChangeRangeFilter(e, true)}
              />
              <span>{translate(prefix + 'label.oneDayBefore')}</span>
            </div>
            <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
            <div className="to">
              <input className="form-control" id="to-date" type="text" placeholder="0"
                value={numberDateBeforeAfterTo}
                onChange={(e) => onChangeRangeFilter(e, false)}
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
                onChange={(e) => onChangeRangeFilter(e, true)}
                onKeyUp={(e) => onChangeRangeFilter(e, true)}
                onKeyDown={(e) => onChangeRangeFilter(e, true)}
              />
              <span>{translate(prefix + 'label.oneDayBefore')}</span>
            </div>
            <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
            <div className="to">
              <input className="form-control" id="to-date" type="text" placeholder="0"
                value={numberDateBeforeTo}
                onChange={(e) => onChangeRangeFilter(e, false)}
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
                onChange={(e) => onChangeRangeFilter(e, true)}
                onKeyUp={(e) => onChangeRangeFilter(e, true)}
                onKeyDown={(e) => onChangeRangeFilter(e, true)}
              />
              <span>{translate(prefix + 'label.multilDayAfter')}</span>
            </div>
            <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
            <div className="to">
              <input className="form-control" id="to-date" type="text" placeholder="0"
                value={numberDateAfterTo}
                onChange={(e) => onChangeRangeFilter(e, false)}
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
  </>)
})

export default FieldListFilterDateTime
