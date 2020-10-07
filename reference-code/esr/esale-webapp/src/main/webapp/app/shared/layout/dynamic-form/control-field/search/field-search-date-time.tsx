import React, { useState, useEffect, useRef, forwardRef } from 'react';
import DayPicker from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';
import { useId } from 'react-id-generator';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { NumberModeDate, FilterModeDate } from '../../constants';
import DatePicker from 'app/shared/layout/common/date-picker';
import { Storage, translate } from 'react-jhipster';
import StringUtils, {getFieldLabel, getNumberFromDay, getNumberToDay, parseDateDefault, jsonParse} from 'app/shared/util/string-utils';
import { APP_DATE_FORMAT_ES, DATE_MODE, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';
import {  getHourMinute, isValidTimeFormat, getDateBeforeAfter, convertDateTimeToTz, convertDateTimeFromTz,
  tzDateToDateTimeUtc, DATE_TIME_FORMAT, tzToUtc, getTimezonesOffset, DEFAULT_TIME, addSecondStartEnd } from 'app/shared/util/date-utils';
import TimePicker from '../component/time-picker';
import { getIconSrc } from 'app/config/icon-loader';
import _ from 'lodash';

export interface IFieldSearchDateTimeOwnProps {
  fieldRelation?: any;
}

type IFieldSearchDateTimeProps = IDynamicFieldProps & IFieldSearchDateTimeOwnProps

const FieldSearchDateTime = forwardRef((props: IFieldSearchDateTimeProps, ref) => {
  const FORMAT_DATE = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT)
  const [datetimeDayFrom, setDatetimeDayFrom] = useState(null);
  const [datetimeTimeFrom, setDatetimeTimeFrom] = useState(null);
  const [datetimeDayTo, setDatetimeDayTo] = useState(null);
  const [datetimeTimeTo, setDatetimeTimeTo] = useState(null);
  const [timeFrom, setTimeFrom] = useState(null);
  const [timeTo, setTimeTo] = useState(null);
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

  const [showTooltip, setShowTooltip] = useState(false);
  const [searchModeDate, setSearchModeDate] = useState(FilterModeDate.PeriodYmdHm);
  const [showModeSearch, setShowModeSearch] = useState(false);

  const divModeSearch = useRef(null);
  const divToolTip = useRef(null);
  const idRadioList = useId(12, "datetimebox_radio_");
  const nameRadio = useId(2, "datetimebox_radioGroup_");

  const {fieldInfo} = props;

  const numberRegExp = new RegExp('^[0-9]*$');
  const baseUrl = window.location.origin.toString();
  const prefix = 'dynamic-control.fieldFilterAndSearch.layoutDateTime.';

  const handleUserMouseDown = (event) => {
    if (divModeSearch.current && !divModeSearch.current.contains(event.target)) {
      setShowModeSearch(false);
    }
    if(divToolTip.current && !divToolTip.current.contains(event.target)){
      setShowTooltip(false);
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

  const setStateNumber = (number) => {
    setSearchModeDate(parseInt(number, 10));
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

  const setModeDateWorking = (valueSearch) => {
    switch (props.elementStatus.searchType.toString()) {
      case FilterModeDate.DayBeforeAfter.toString():
        valueSearch['dayFrom'] ? setNumberDateBeforeAfterFrom(getNumberFromDay(valueSearch['dayFrom']).toString()) : setNumberDateBeforeAfterFrom(null);
        valueSearch['dayTo'] ? setNumberDateBeforeAfterTo(getNumberToDay(valueSearch['dayTo']).toString()) : setNumberDateBeforeAfterTo(null);
        if (valueSearch['filterModeDate']) {
          setNumberDateBeforeAfterMode(NumberModeDate.Working);
          valueSearch['dayFrom'] ? setNumberDateBeforeAfterFrom(valueSearch['dayFrom']) : setNumberDateBeforeAfterFrom(null);
          valueSearch['dayTo'] ? setNumberDateBeforeAfterTo(valueSearch['dayTo']) : setNumberDateBeforeAfterTo(null);
        }
        break;
      case FilterModeDate.TodayBefore.toString():
        valueSearch['dayFrom'] ? setNumberDateBeforeFrom(getNumberFromDay(valueSearch['dayFrom']).toString()) : setNumberDateBeforeFrom(null);
        valueSearch['dayTo'] ? setNumberDateBeforeTo(getNumberFromDay(valueSearch['dayTo']).toString()) : setNumberDateBeforeTo(null);
        if (valueSearch['filterModeDate']) {
          setNumberDateBeforeMode(NumberModeDate.Working);
          valueSearch['dayFrom'] ? setNumberDateBeforeFrom(valueSearch['dayFrom']) : setNumberDateBeforeFrom(null);
          valueSearch['dayTo'] ? setNumberDateBeforeTo(valueSearch['dayTo']) : setNumberDateBeforeTo(null);
        }
        break;
      case FilterModeDate.TodayAfter.toString():
        valueSearch['dayFrom'] ? setNumberDateAfterFrom(getNumberToDay(valueSearch['dayFrom']).toString()) : setNumberDateAfterFrom(null);
        valueSearch['dayTo'] ? setNumberDateAfterTo(getNumberToDay(valueSearch['dayTo']).toString()) : setNumberDateAfterTo(null);
        if (valueSearch['filterModeDate']) {
          setNumberDateAfterMode(NumberModeDate.Working);
          valueSearch['dayFrom'] ? setNumberDateAfterFrom(valueSearch['dayFrom']) : setNumberDateAfterFrom(null);
          valueSearch['dayTo'] ? setNumberDateAfterTo(valueSearch['dayTo']) : setNumberDateAfterTo(null);
        }
        break;
      default:
        break;
    }
  }

  const initialize = () => {
    if (props.updateStateElement && !props.isDisabled) {
      if (props.elementStatus) {
        const valueFilterProps = jsonParse(props.elementStatus['searchValue']);
        if(valueFilterProps) {
          const valueFilterTime = parseDateDefault(valueFilterProps);
          if(props.elementStatus && props.elementStatus.searchType){
            setStateNumber(props.elementStatus.searchType);
            switch (props.elementStatus.searchType.toString()) {
              case FilterModeDate.PeriodYmdHm.toString(): {
                setDateTimePeriodYmdHm(valueFilterTime);
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
              case FilterModeDate.TodayAfter.toString():{
                setModeDateWorking(valueFilterTime);
                break;
              }
              default:
                break;
            }
          }
          else {
            setSearchModeDate(FilterModeDate.None);
            return;
          }
        }

        if(!_.isNil(props.elementStatus.searchModeDate)) {
          setSearchModeDate(props.elementStatus.searchModeDate);
        } else if (_.isEmpty(valueFilterProps)) {
          setSearchModeDate(FilterModeDate.None);
        }
        if(props.elementStatus.datetimeDayFrom) {
          const parsed = dateFnsParse(props.elementStatus.datetimeDayFrom);
          if (DayPicker.DateUtils.isDate(parsed)) {
            setDatetimeDayFrom(convertDateTimeToTz(parsed))
          }
        }
        if(props.elementStatus.datetimeDayTo) {
          const parsed = dateFnsParse(props.elementStatus.datetimeDayTo);
          if (DayPicker.DateUtils.isDate(parsed)) {
            setDatetimeDayTo(convertDateTimeToTz(parsed))
          }
        }
        if(props.elementStatus.datetimeTimeFrom) {
          setDatetimeTimeFrom(props.elementStatus.datetimeTimeFrom);
        }
        if(props.elementStatus.datetimeTimeTo) {
          setDatetimeTimeTo(props.elementStatus.datetimeTimeTo);
        }
        if(props.elementStatus.timeFrom) {
          setTimeFrom(props.elementStatus.timeFrom);
        }
        if(props.elementStatus.timeTo) {
          setTimeTo(props.elementStatus.timeTo);
        }
        if(props.elementStatus.dateFrom) {
          const parsed = dateFnsParse(props.elementStatus.dateFrom);
          if (DayPicker.DateUtils.isDate(parsed)) {
            setDateFrom(convertDateTimeToTz(parsed))
          }
        }
        if(props.elementStatus.dateTo) {
          const parsed = dateFnsParse(props.elementStatus.dateTo);
          if (DayPicker.DateUtils.isDate(parsed)) {
            setDateTo(convertDateTimeToTz(parsed))
          }
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
      }
    }
  };

  const getFromToSpecial = () => {
    let valDown;
    let valUp;
    let timeZoneOffset;
    
    if (searchModeDate === FilterModeDate.PeriodYmd) {
      valDown = dateFrom ? dateFnsFormat(dateFrom, APP_DATE_FORMAT_ES) :  '';
      valUp = dateTo ? dateFnsFormat(dateTo, APP_DATE_FORMAT_ES) : '';
      if(dateFrom || dateTo){
        valDown = `${dateFrom ? tzDateToDateTimeUtc(dateFrom, DATE_TIME_FORMAT.Database, DEFAULT_TIME.FROM) : ""}`;
        valUp = `${dateTo ? tzDateToDateTimeUtc(dateTo, DATE_TIME_FORMAT.Database, DEFAULT_TIME.TO) : ""}`;
      }
    } else if (searchModeDate === FilterModeDate.DayBeforeAfter) {
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
    } else if (searchModeDate === FilterModeDate.TodayBefore) {
      if (NumberModeDate.Working === numberDateBeforeMode) {
        valDown = numberDateBeforeFrom;
        valUp = numberDateBeforeTo;
        timeZoneOffset = getTimezonesOffset();
      } else {
        valDown = getDateBeforeAfter(numberDateBeforeFrom, DATE_MODE.DATE_BEFORE);
        valUp = getDateBeforeAfter(numberDateBeforeTo, DATE_MODE.DATE_BEFORE);
        valDown = `${valDown ? `${tzDateToDateTimeUtc(valDown, DATE_TIME_FORMAT.Database, DEFAULT_TIME.FROM)}:00` : ""}`;
        valUp = `${valUp ? `${tzDateToDateTimeUtc(valUp, DATE_TIME_FORMAT.Database, DEFAULT_TIME.TO)}:59` : ""}`;
      }
    } else if (searchModeDate === FilterModeDate.TodayAfter) {
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
    return {valDown, valUp, timeZoneOffset};
  }

  const addSeconds = (datetime) => {
    if (!_.isNil(datetime) && datetime.length === 16) {
      return `${datetime}:00`
    }
    return datetime;
  }

  const getRangeSearchDate = () => {
    let valDown = '';
    let valUp = '';
    let timeZoneOffset;

    if (searchModeDate === FilterModeDate.PeriodYmdHm) {
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
      valDown = addSecondStartEnd(valDown, true);
      valUp = addSecondStartEnd(valUp, false);
    } else if (searchModeDate === FilterModeDate.PeriodHm) {
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
      if(valDown || valUp){
        valDown = valDown ? valDown : DEFAULT_TIME.FROM;
        valUp = valUp ? valUp : DEFAULT_TIME.TO;
      }
    }

    if(!valDown && !valUp){
      const special = getFromToSpecial();
      valDown = special.valDown;
      valUp = special.valUp;
      timeZoneOffset = special.timeZoneOffset;
    }
    return {valDown: addSeconds(valDown), valUp: addSeconds(valUp), timeZoneOffset}
  }

  useEffect(() => {
    initialize();
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, []);

  useEffect(() => {
    let params = null;
    const conditions = {};
    conditions['fieldId'] = fieldInfo.fieldId;
    conditions['fieldType'] = fieldInfo.fieldType;
    conditions['isDefault'] = fieldInfo.isDefault ? fieldInfo.isDefault : false;
    conditions['fieldName'] = fieldInfo.fieldName;
    conditions['isSearchBlank'] = searchModeDate === FilterModeDate.None;
    conditions['fieldValue'] = [];
    const {valDown, valUp, timeZoneOffset} = getRangeSearchDate()
    conditions['timeZoneOffset'] = timeZoneOffset;
    if ((valDown && valDown.length > 0) || (valUp && valUp.length > 0)) {
      if ((NumberModeDate.Working === numberDateAfterMode && searchModeDate === FilterModeDate.TodayAfter)
        || (NumberModeDate.Working === numberDateBeforeMode && searchModeDate === FilterModeDate.TodayBefore)
        || (NumberModeDate.Working === numberDateBeforeAfterMode && searchModeDate === FilterModeDate.DayBeforeAfter)) {
        conditions['fieldValue'].push({ from: valDown, to: valUp, filterModeDate: searchModeDate});
      } else {
        conditions['fieldValue'].push({from: valDown, to: valUp});
      }
    }
    // save other properties
    conditions['searchModeDate'] = searchModeDate;
    conditions['datetimeDayFrom'] = datetimeDayFrom ? dateFnsFormat(convertDateTimeFromTz(datetimeDayFrom), FORMAT_DATE) : '';
    conditions['datetimeDayTo'] = datetimeDayTo ? dateFnsFormat(convertDateTimeFromTz(datetimeDayTo), FORMAT_DATE) : '';
    conditions['datetimeTimeFrom'] = datetimeTimeFrom;
    conditions['datetimeTimeTo'] = datetimeTimeTo;
    conditions['timeFrom'] = timeFrom;
    conditions['timeTo'] = timeTo;
    conditions['dateFrom'] = dateFrom ? dateFnsFormat(dateFrom, FORMAT_DATE) : '';
    conditions['dateTo'] = dateTo ? dateFnsFormat(dateTo, FORMAT_DATE) : '';
    conditions['numberDateBeforeAfterFrom'] = numberDateBeforeAfterFrom;
    conditions['numberDateBeforeAfterTo'] = numberDateBeforeAfterTo;
    conditions['numberDateBeforeAfterMode'] = numberDateBeforeAfterMode;
    conditions['numberDateBeforeFrom'] = numberDateBeforeFrom;
    conditions['numberDateBeforeTo'] = numberDateBeforeTo;
    conditions['numberDateBeforeMode'] = numberDateBeforeMode;
    conditions['numberDateAfterFrom'] = numberDateAfterFrom;
    conditions['numberDateAfterTo'] = numberDateAfterTo;
    conditions['numberDateAfterMode'] = numberDateAfterMode;
    params = conditions;


    if (!props.isDisabled && props.updateStateElement) {
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, params)
    }
  }, [searchModeDate, timeFrom, timeTo, dateFrom, dateTo,
      datetimeDayFrom, datetimeDayTo, datetimeTimeFrom, datetimeTimeTo,
      numberDateBeforeAfterFrom, numberDateBeforeAfterTo, numberDateBeforeAfterMode,
      numberDateBeforeFrom, numberDateBeforeTo, numberDateBeforeMode,
      numberDateAfterFrom, numberDateAfterTo, numberDateAfterMode
    ]);

  const onChangeRangeFilter = (e, isFrom) => {
    const { value } = e.target;
    if (value.trim().length === 0 || numberRegExp.test(value)) {
      if (searchModeDate === FilterModeDate.DayBeforeAfter) {
        isFrom ? setNumberDateBeforeAfterFrom(value) : setNumberDateBeforeAfterTo(value);
      } else if (searchModeDate === FilterModeDate.TodayBefore) {
        isFrom ? setNumberDateBeforeFrom(value) : setNumberDateBeforeTo(value);
      } else if (searchModeDate === FilterModeDate.TodayAfter) {
        isFrom ? setNumberDateAfterFrom(value) : setNumberDateAfterTo(value);
      }
    }
  }

  const isDisableTooltip = () => {
    return searchModeDate !== FilterModeDate.PeriodYmdHm && searchModeDate !== FilterModeDate.PeriodHm
    && searchModeDate !== FilterModeDate.PeriodYmd && searchModeDate !== FilterModeDate.DayBeforeAfter
    && searchModeDate !== FilterModeDate.TodayBefore && searchModeDate !== FilterModeDate.TodayAfter;
  }

  const renderHeaderTitle = () => {
    const headerClass = 'advance-search-popup-label-title';
    let label = StringUtils.escapeSpaceHtml(getFieldLabel(props.fieldInfo, 'fieldLabel'));
    let iconSrc = getIconSrc(props.belong)
    if (props.fieldInfo.relationFieldId > 0 && props.fieldRelation && props.fieldRelation.length > 0) {
      label = `${label} (${StringUtils.escapeSpaceHtml(getFieldLabel(props.fieldRelation[0], 'fieldLabel'))})`;
      iconSrc = getIconSrc(_.get(props.fieldRelation[0], 'relationData.fieldBelong'))
    }
    return (
      <>
        {props.showFieldLabel && props.isRequired && (
          <label className={headerClass}>
            <img className="mr-2 badge-icon" src={getIconSrc(props.belong)} alt="" />{label}
            <label className="label-red">{translate('dynamic-control.fieldFilterAndSearch.common.required')}</label>
          </label>
        )}
        {props.showFieldLabel && !props.isRequired && <label className={headerClass}><img className="mr-2 badge-icon" src={iconSrc} alt="" />{label}</label>}
        {!props.showFieldLabel && props.isRequired && (
          <label className={`${headerClass} label-red`}><img className="mr-2 badge-icon" src={iconSrc} alt="" />{translate('dynamic-control.fieldFilterAndSearch.common.required')}</label>
        )}
      </>
    );
  };

  const renderComponentHeaderJa = () => {
    return (
      <>
        {renderHeaderTitle()}
        <div className="advance-search-popup-wrap">
          <a className={`icon-small-primary icon-help-small ${showTooltip && "active"} ${isDisableTooltip() && "disable"}`}
             onClick={() => {setShowTooltip(true); setShowModeSearch(false)}}
          />
        <div ref = {divToolTip}>
          {showTooltip && searchModeDate === FilterModeDate.PeriodYmdHm &&
          <div className="advance-search-popup mt-3 mb-3">
            <p className="mb-3">範囲の開始と終了の日時を指定して検索を行うと、その範囲内の日時が入力されているシートが検索対象になります。</p>
            <p>例）「2005/01/01 9:30 - 2010/12/31 20:15」と範囲指定した場合 </p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow20.svg`}/>
            </div>
            <p className="mb-3">範囲の開始のみ指定すると、それ以降の日時が入力されているシートが検索対象になります。</p>
            <p>例）「2005/01/01 9:30」と範囲指定した場合 </p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow21.svg`}/>
            </div>
            <p className="mb-3">範囲の終了のみ指定すると、それ以前の日時が入力されているシートが検索対象になります。</p>
            <p>例）「 - 2010/12/21 15:15」と範囲指定した場合</p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow22.svg`}/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.PeriodHm &&
          <div className="advance-search-popup mt-3 mb-3">
            <p>範囲の開始と終了の時間を指定して検索を行うと、その範囲内の時間が入力されているシートが検索対象になります。</p>
            <p className="mb-3">（どの日でも、検索対象になります）</p>
            <p>例）「9:30 - 9:45」と範囲指定した場合</p>
            <div className="advance-search-date-arrow mb-0">
              <img src={baseUrl + `/content/images/common/advance-search-arrow23.svg`}/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.PeriodYmd &&
          <div className="advance-search-popup mb-3">
            範囲の開始と終了の日付を指定して検索を行うと、その範囲内の日付が入力されているシートが検索対象になります。<br/>
            例）「2005-01-01 - 2010-12-31」と範囲指定した場合
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow1.svg`} alt="" title=""/>
            </div>
            範囲の開始のみ指定すると、それ以降の日付が入力されているシートが検索対象になります。<br/>
            例）「2005-01-01 - 」と範囲指定した場合
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow2.svg`} alt="" title=""/>
            </div>
            範囲の終了のみ指定すると、それ以前の日付が入力されているシートが検索対象になります。<br/>
            例）「 - 2010-12-31」と範囲指定した場合
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow3.svg`} alt="" title=""/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.DayBeforeAfter &&
          <div className="advance-search-popup mb-3">
            今日の日付を基準にして範囲が計算され、その範囲内の日付が入力されているシートが検索対象になります。<br/>
            ※ 検索条件を保存しておき、明日/明後日/・・・に再度検索を行うと、明日/明後日/・・・の日付を基準にして都度、範囲が計算されます。<br/><br/>
            例）「3日前 - 5日後」と範囲指定した場合
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow5.svg`} alt="" title=""/>
            </div>
            範囲の開始のみ指定すると、それ以降の日付が入力されているシートが検索対象になります。<br/><br/>
            例）「3日前 - 」と範囲指定した場合
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow6.svg`} alt="" title=""/>
            </div>
            範囲の終了のみ指定すると、それ以前の日付が入力されているシートが検索対象になります。<br/><br/>
            例）「 - 5日後」と範囲指定した場合
            <div className="advance-search-date-arrow">
                <img src={baseUrl + `/content/images/common/advance-search-arrow7.svg`} alt="" title=""/>
            </div>
            「実日数で算出」を選択していると、休日もカウントして範囲の開始/終了が計算されます。<br/>
            「営業日数で算出」を選択していると、休日はカウントせずに範囲の開始/終了が計算されます。
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.TodayBefore &&
          <div className="advance-search-popup mb-3">
            今日の日付を基準にして範囲が計算され、その範囲内の日付が入力されているシートが検索対象になります。<br/>
            ※ 検索条件を保存しておき、明日/明後日/・・・に再度検索を行うと、明日/明後日/・・・の日付を基準にして都度、範囲が計算されます。<br/><br/>
            例）「5日前 - 3日前」と範囲指定した場合
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow8.svg`} alt="" title=""/>
            </div>
            範囲の開始のみ指定すると、それ以降の日付が入力されているシートが検索対象になります。<br/><br/>
            例）「5日前 - 」と範囲指定した場合
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow9.svg`} alt="" title=""/>
            </div>
            範囲の終了のみ指定すると、それ以前の日付が入力されているシートが検索対象になります。<br/><br/>
            例）「 - 3日前」と範囲指定した場合
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow10.svg`} alt="" title=""/>
            </div>
            「実日数で算出」を選択していると、休日もカウントして範囲の開始/終了が計算されます。<br/>
            「営業日数で算出」を選択していると、休日はカウントせずに範囲の開始/終了が計算されます。
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.TodayAfter &&
          <div className="advance-search-popup mb-3">
            今日の日付を基準にして範囲が計算され、その範囲内の日付が入力されているシートが検索対象になります。<br/>
            ※ 検索条件を保存しておき、明日/明後日/・・・に再度検索を行うと、明日/明後日/・・・の日付を基準にして都度、範囲が計算されます。<br/><br/>
            例）「3日後 - 5日後」と範囲指定した場合
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow11.svg`} alt="" title=""/>
            </div>
            範囲の開始のみ指定すると、それ以降の日付が入力されているシートが検索対象になります。<br/><br/>
            例）「3日後 - 」と範囲指定した場合
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow12.svg`} alt="" title=""/>
            </div>
            範囲の終了のみ指定すると、それ以前の日付が入力されているシートが検索対象になります。<br/><br/>
            例）「 - 5日後」と範囲指定した場合
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow13.svg`} alt="" title=""/>
            </div>
            「実日数で算出」を選択していると、休日もカウントして範囲の開始/終了が計算されます。<br/>
            「営業日数で算出」を選択していると、休日はカウントせずに範囲の開始/終了が計算されます。
          </div>
          }
        </div>
    </div></>
    )
  }

  const renderComponentHeaderEn = () => {
    return (
      <>
        {renderHeaderTitle()}
        <div className="advance-search-popup-wrap">
          <a className={`icon-small-primary icon-help-small ${showTooltip && "active"} ${isDisableTooltip() && "disable"}`}
             onClick={() => {setShowTooltip(true); setShowModeSearch(false)}}
          />
        <div ref = {divToolTip}>
          {showTooltip && searchModeDate === FilterModeDate.PeriodYmdHm &&
          <div className="advance-search-popup mt-3 mb-3">
            <p className="mb-3"> When searching by specifying a range using both start point and end point (date and time included), the sheets with time within the range will be searched.</p>
            <p>Example) If the specified range is &quot;9:30 2005/01/01 – 20:15 2010/12/31&quot; </p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow20.svg`}/>
            </div>
            <p className="mb-3"> When searching by specifying a range using start point only (date and time included), the sheets with time after that specified point will be searched.</p>
            <p>Example) If the specified range is &quot;9:30 2005/01/01&quot; </p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow21.svg`}/>
            </div>
            <p className="mb-3"> When searching by specifying a range using end point only, the sheets with time prior to that specified point will be searched. </p>
            <p>Example) If the specified range is &quot;- 15:15 2010/12/21&quot;</p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow22.svg`}/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.PeriodHm &&
          <div className="advance-search-popup mt-3 mb-3">
            <p>When searching by specifying a range between a start point and an end point (hour and minute included), the sheets with time within the range will be searched. </p>
             <p className="mb-3"> (Any date will be searched.)</p>
             <p>Example) If the specified range is &quot;9:30 - 9:45&quot;</p>
            <div className="advance-search-date-arrow mb-0">
              <img src={baseUrl + `/content/images/common/advance-search-arrow23.svg`}/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.PeriodYmd &&
          <div className="advance-search-popup mb-3">
            If a nonexistent date is specified, it will be automatically replaced by the last day of that month.<br/>
            Example) If the specified range is &quot;2005-01-01 – 2010-12-31&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow1.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using start date only, the sheets with dates after that specified date will be searched.<br/>
            Example) If the specified range is &quot;2005-01-01 -&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow2.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using end date only, the sheets with dates prior to that specified date will be searched. <br/>
            Example) If the specified range is &quot;- 2010-12-31&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow3.svg`} alt="" title=""/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.DayBeforeAfter &&
          <div className="advance-search-popup mb-3">
            The range is calculated based on the current date and the sheets with dates within the range will be searched. <br/>
            ※If the search conditions are saved and is re-conducted the following days, the range will be re-calculated each time based on that following day. <br/><br/>
            Example) If the specified range is &quot;3 (days) past – 5 (days) next&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow5-EN.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using start point only, the sheets with dates after that specified point will be searched. <br/><br/>
            Example) If the specified range is &quot;3 (days) past –&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow6-EN.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using end point only, the sheets with dates prior to that specified point will be searched. <br/><br/>
            Example) If the specified range is &quot; – 5 (days) next&quot;
            <div className="advance-search-date-arrow">
                <img src={baseUrl + `/content/images/common/advance-search-arrow7-EN.svg`} alt="" title=""/>
            </div>
            If &quot;Calculate based on calendar days&quot; is selected, the holidays inbetween will also be counted when calculating the start date and/or the end date of the range. <br/>
            If &quot;Calculate based on working days&quot; is selected, the holidays inbetween will not be counted when calculating the start date and/or the end date of the range.
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.TodayBefore &&
          <div className="advance-search-popup mb-3">
            The range is calculated based on the current date and the sheets with dates within the range will be searched.<br/>
            ※If the search conditions are saved and is re-conducted the following days, the range will be re-calculated each time based on that following day. <br/><br/>
            Example) If the specified range is &quot;5 (days) past - 3 (days) past&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow8-EN.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using start point only, the sheets with dates after that specified point will be searched. <br/><br/>
            Example) If the specified range is &quot;5 (days) past –&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow9-EN.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using end point only, the sheets with dates prior to that specified point will be searched.. <br/><br/>
            Example) If the specified range is &quot;- 3 (days) past &quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow10-EN.svg`} alt="" title=""/>
            </div>
            If &quot;Calculate based on calendar days&quot; is selected, the holidays inbetween will also be counted when calculating the start date and/or the end date of the range. <br/>
            If &quot;Calculate based on working days&quot; is selected, the holidays inbetween will not be counted when calculating the start date and/or the end date of the range.
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.TodayAfter &&
          <div className="advance-search-popup mb-3">
            The range is calculated based on the current date and the sheets with dates within the range will be searched. <br/>
            ※If the search conditions are saved and is re-conducted the following days, the range will be re-calculated each time based on that following day. <br/><br/>
            Example) If the specified range is &quot;3 (days) next – 5 (days) next&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow11-EN.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using start point only, the sheets with dates after that specified point will be searched. <br/><br/>
            Example) If the specified range is &quot;3 (days) next –&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow12-EN.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using end point only, the sheets with dates prior to that specified point will be searched.<br/><br/>
            Example) If the specified range is &quot;– 5 (days) next&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow13-EN.svg`} alt="" title=""/>
            </div>
            If  &quot;Calculate based on calendar days&quot; is selected, the holidays inbetween will also be counted when calculating the start date and/or the end date of the range.<br/>
            If &quot;Calculate based on working days&quot; is selected, the holidays inbetween will not be counted when calculating the start date and/or the end date of the range.
          </div>
          }
        </div>
    </div></>
    )
  }

  const renderComponentHeaderCn = () => {
    return (
      <>
        {renderHeaderTitle()}
        <div className="advance-search-popup-wrap">
          <a className={`icon-small-primary icon-help-small ${showTooltip && "active"} ${isDisableTooltip() && "disable"}`}
             onClick={() => {setShowTooltip(true); setShowModeSearch(false)}}
          />
        <div ref = {divToolTip}>
          {showTooltip && searchModeDate === FilterModeDate.PeriodYmdHm &&
          <div className="advance-search-popup mt-3 mb-3">
            <p className="mb-3">如果您指定范围的开始日期和时间以及结束日期和时间并执行搜索，则搜索对象将是在此范围内输入日期的工作表。</p>
            <p>例如)如果指定的范围为&quot;2005/01/01 9:30 - 2010/12/31 20:15&quot; </ p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow20.svg`}/>
            </div>
            <p className ="mb-3">如果仅指定了范围的开始，那么输入了该时间、日期及其以后时间、日期的工作表将成为检索对象。</ p>
             <p>例如)如果指定的范围为&quot;2005/01/01 9:30&quot;时</ p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow21.svg`}/>
            </div>
            <p className ="mb-3">如果您仅指定范围的结束日期和时间，则搜索对象将是从该日期和时间或更早的日期和时间输入的工作表。 </ p>
             <p>例如)如果指定的范围为&quot;-2010/12/21 15:15&quot; </ p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow22.svg`}/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.PeriodHm &&
          <div className="advance-search-popup mt-3 mb-3">
            <p>通过指定范围的开始和结束时间进行检索时，输入了该范围内时间的工作表将成为检索对象。</ p>
             <p className ="mb-3">（任何日期都可以成为搜索对象)</ p>
             <p>例如)如果指定的范围为&quot;9：30-9：45&quot; </ p>
            <div className="advance-search-date-arrow mb-0">
              <img src={baseUrl + `/content/images/common/advance-search-arrow23.svg`}/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.PeriodYmd &&
          <div className="advance-search-popup mb-3">
           通过指定范围的开始和结束时间进行检索时，输入了该范围内时间的工作表将成为检索对象。<br/>
           例如)如果指定的范围为&quot;2005-01-01 - 2010-12-31&quot;时
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow1.svg`} alt="" title=""/>
            </div>
            如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。<br/>
            例如)如果指定的范围为&quot;2005-01-01-&quot;时
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow2.svg`} alt="" title=""/>
            </div>
            如果您仅指定范围的结束日期，则搜索对象将是从该日期或更早的日期输入的工作表。<br/>
            例如)如果指定的范围为&quot;-2010-12-31&quot;时
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow3.svg`} alt="" title=""/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.DayBeforeAfter &&
          <div className="advance-search-popup mb-3">
            根据今天的日期计算范围，并将在该日期范围内输入的工作表作为搜索对象。 <br/>
            ※如果您保存搜索条件并在明天/后天/ ...再次执行搜索，则该范围将根据明天/后天...得到相应计算。 <br/> <br/>
            例如)指定的范围为&quot;3天前-5天后
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow5-CN.svg`} alt="" title=""/>
            </div>
            如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。<br/> <br/>
            例如)如果指定的范围为&quot;3天前-&quot;
             <div className ="advance-search-date-arrow">
               <img src = {baseUrl +`/content/images/common/advance-search-arrow6-CN.svg`} alt ="" title ="" />
             </ div>
             如果您仅指定范围的结束日期，则搜索对象将是该日期或更早的日期输入的工作表。<br/> <br/>
             例如)如果指定的范围为&quot;-5天后
            <div className="advance-search-date-arrow">
                <img src={baseUrl + `/content/images/common/advance-search-arrow7-CN.svg`} alt="" title=""/>
            </div>
            如果您选择「按实际天数计算」，则开始日期/结束日期范围将包括假日。<br/>
            如果您选择「按工作日数计算」，则开始日期/结束日期范围将不包括假日。
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.TodayBefore &&
          <div className="advance-search-popup mb-3">
            根据今天的日期计算范围，并将在该日期范围内输入的工作表作为搜索对象。 <br/>
            ※如果您保存搜索条件并在明天/后天/ ...再次执行搜索，则该范围将根据明天/后天...得到相应计算。 <br/> <br/>
            例如) 如果指定的范围为&quot;5天前-3天前&quot;
            <div className ="advance-search-date-arrow">
              <img src = {baseUrl +`/content/images/common/advance-search-arrow8-CN.svg`} alt ="" title ="" />
            </ div>
            如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。 <br/> <br/>
            例如)如果指定的范围为&quot;5天前-&quot;
            <div className ="advance-search-date-arrow">
              <img src = {baseUrl +`/content/images/common/advance-search-arrow9-CN.svg`} alt ="" title ="" />
            </ div>
            如果您仅指定范围的结束日期，则搜索对象将是该日期或更早的日期输入的工作表。<br/> <br/>
            例如)如果指定的范围为&quot;-3天前&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow10-CN.svg`} alt="" title=""/>
            </div>
            如果您选择「按实际天数计算」，则开始日期/结束日期范围将包括假日。 <br/>
            如果您选择「按工作日数计算」，则开始日期/结束日期范围将不包括假日。
           </ div>
           }
           {showTooltip && searchModeDate === FilterModeDate.TodayAfter &&
           <div className ="advance-search-popup mb-3">
             根据今天的日期计算范围，并将在该日期范围内输入的工作表作为搜索对象。 <br/>
             ※如果您保存搜索条件并在明天/后天/ ...再次执行搜索，则该范围将根据明天/后天...得到相应计算。 <br/> <br/>
             例如)如果指定的范围为&quot;3天后5天后
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow11-CN.svg`} alt="" title=""/>
            </div>
            如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。<br/> <br/>
            例如)如果指定的范围为&quot;3天后-&quot;
            <div className ="advance-search-date-arrow">
              <img src = {baseUrl +`/content/images/common/advance-search-arrow12-CN.svg`} alt ="" title ="" />
            </ div>
            如果您仅指定范围的结束日期，则搜索对象将是从该日期或更早的日期输入的工作表。 <br/> <br/>
            例如)如果指定的范围为&quot;-5天后&quot;
            <div className ="advance-search-date-arrow">
              <img src = {baseUrl +`/content/images/common/advance-search-arrow13-CN.svg`} alt ="" title ="" />
            </ div>
            如果您选择「按实际天数计算」，则开始日期/结束日期范围将包括假日。 <br/>
            如果您选择「按工作日数计算」，则开始日期/结束日期范围将不包括假日。
          </div>
          }
        </div>
    </div></>
    )
  }

  const renderComponentHeaderSearch = () => {
    const lang = Storage.session.get('locale', "ja_jp");
    if (lang === 'ja_jp') {
      return renderComponentHeaderJa();
    } else if (lang === 'en_us') {
      return renderComponentHeaderEn();
    }else if (lang === 'zh_cn') {
      return renderComponentHeaderCn();
    } else {
      return <></>;
    }
  }

  const renderComponentModeSearch = () => {
    const listModeSearch = [{id: FilterModeDate.PeriodYmdHm, name: translate(prefix + 'label.periodYmdHm')},
                            {id: FilterModeDate.PeriodHm, name: translate(prefix + 'label.periodHm')},
                            {id: FilterModeDate.PeriodYmd, name: translate(prefix + 'label.periodYmd')},
                            {id: FilterModeDate.DayBeforeAfter, name: translate(prefix + 'label.dayBeforeAfter')},
                            {id: FilterModeDate.TodayBefore, name: translate(prefix + 'label.todayBefore')},
                            {id: FilterModeDate.TodayAfter, name: translate(prefix + 'label.todayAfter')},
                            {id: FilterModeDate.None, name: translate(prefix + 'label.none')}];
    const indexSelected = listModeSearch.findIndex( e => e.id === searchModeDate);
    return (
      <button type="button" className={`select-option w44 ${props.isDisabled ? ' pointer-none': ''}`}>
        <span className="select-text" onClick={() => setShowModeSearch(!showModeSearch)} >
          {indexSelected >= 0 ? listModeSearch[indexSelected].name : ''}
        </span>
        {showModeSearch && !props.isDisabled &&
        <div className="select-box w100" ref={divModeSearch}>
          <div className="wrap-check-radio">
            {listModeSearch.map((e, idx) =>
              <p className="radio-item" key={idx}>
                <input type="radio" id={idRadioList[idx]} name={nameRadio[0]} value={e.id}
                  checked={e.id === searchModeDate}
                  onClick={() => {setSearchModeDate(e.id); setShowModeSearch(false)}}
                />
                <label htmlFor={idRadioList[idx]}>{listModeSearch[idx].name}</label>
              </p>
            )}
          </div>
        </div>
        }
      </button>
    );
  }

  const renderComponent = () => {
    const fieldNamePlaceHolder = getFieldLabel(fieldInfo, 'fieldLabel');
    return (
      <>
        {renderComponentHeaderSearch()}
        <div className="show-search" id={Math.random().toString()}>
          {renderComponentModeSearch()}
          {searchModeDate === FilterModeDate.PeriodYmdHm &&
          <div className="wrap-input-date wrap-input-date-4-input">
            <div className="form-group form-group2 common has-delete mt-1 mr-4">
              <DatePicker
                date={datetimeDayFrom}
                isDisabled={props.isDisabled}
                onDateChanged={(d) => setDatetimeDayFrom(d)}
                placeholder={translate('dynamic-control.fieldFilterAndSearch.layoutDateTime.placeholder.selectDate')}
              />
            </div>
            <TimePicker
                  fieldInfo = {props.fieldInfo}
                  divClass = "form-group form-group2 common has-delete mt-1"
                  inputClass = "input-normal"
                  isDisabled = {props.isDisabled}
                  errorInfo = {props.errorInfo}
                  onChangeTime = {(val) => setDatetimeTimeFrom(val)}
                  enterInputControl = {props.enterInputControl}
                  placeholder={translate('dynamic-control.fieldFilterAndSearch.layoutDateTime.placeholder.selectTime')}
                  timeInit = {datetimeTimeFrom}
            />
            <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
            <div className="form-group form-group2 common has-delete mt-1 mr-4">
              <DatePicker
                date={datetimeDayTo}
                isDisabled={props.isDisabled}
                onDateChanged={(d) => setDatetimeDayTo(d)}
                placeholder={translate('dynamic-control.fieldFilterAndSearch.layoutDateTime.placeholder.selectDate')}
              />
            </div>
            <TimePicker
                  fieldInfo = {props.fieldInfo}
                  divClass = "form-group form-group2 common has-delete mt-1"
                  inputClass = "input-normal"
                  isDisabled = {props.isDisabled}
                  errorInfo = {props.errorInfo}
                  onChangeTime = {(val) => setDatetimeTimeTo(val)}
                  enterInputControl = {props.enterInputControl}
                  placeholder={translate('dynamic-control.fieldFilterAndSearch.layoutDateTime.placeholder.selectTime')}
                  timeInit = {datetimeTimeTo}
            />
          </div>
          }
          {searchModeDate === FilterModeDate.PeriodHm &&
          <div className="wrap-input-date wrap-input-date-4-input">
            <TimePicker
                  fieldInfo = {props.fieldInfo}
                  divClass = "form-group form-group2 common has-delete mt-1"
                  inputClass = "input-normal"
                  isDisabled = {props.isDisabled}
                  errorInfo = {props.errorInfo}
                  onChangeTime = {(val) => setTimeFrom(val)}
                  enterInputControl = {props.enterInputControl}
                  placeholder={"00:00"}
                  timeInit = {timeFrom}
            />
            <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
            <TimePicker
                  fieldInfo = {props.fieldInfo}
                  divClass = "form-group form-group2 common has-delete mt-1"
                  inputClass = "input-normal"
                  isDisabled = {props.isDisabled}
                  errorInfo = {props.errorInfo}
                  onChangeTime = {(val) => setTimeTo(val)}
                  enterInputControl = {props.enterInputControl}
                  placeholder={"00:00"}
                  timeInit = {timeTo}
            />
          </div>
          }
          {searchModeDate === FilterModeDate.PeriodYmd &&
          <div className="wrap-input-date wrap-input-date-2-input">
            <div className="form-group form-group2 common has-delete mt-1 mr-3">
              <DatePicker
                date={dateFrom}
                isDisabled={props.isDisabled}
                onDateChanged={(d) => setDateFrom(d)}
                placeholder={StringUtils.translateSpecial('dynamic-control.placeholder.dateTime', {fieldNamePlaceHolder})}
              />
            </div>
            <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
            <div className="form-group form-group2 common has-delete mt-1 ml-3">
              <DatePicker
                date={dateTo}
                isDisabled={props.isDisabled}
                onDateChanged={(d) => setDateTo(d)}
                placeholder={StringUtils.translateSpecial('dynamic-control.placeholder.dateTime', {fieldNamePlaceHolder})}
              />
            </div>
          </div>
          }
          {searchModeDate === FilterModeDate.DayBeforeAfter && <>
            <div className="wrap-input-date version2">
              <span className="date-from">{translate(prefix + 'label.dateFrom')}</span>
              <div className="form-control-wrap mr-2 ml-3">
                <input type="text" className="input-normal input-common2 mr-1" placeholder="0"
                  value={numberDateBeforeAfterFrom}
                  onChange= {(e) => onChangeRangeFilter(e, true)}
                  onKeyUp={(e) => onChangeRangeFilter(e, true)}
                  onKeyDown={(e) => onChangeRangeFilter(e, true)}
                />
                <span className="currency">{translate(prefix + 'label.oneDayBefore')}</span>
              </div>
              <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
              <div className="form-control-wrap ml-3">
                <input type="text" className="input-normal input-common2 version2" placeholder="0"
                  value={numberDateBeforeAfterTo}
                  onChange= {(e) => onChangeRangeFilter(e, false)}
                  onKeyUp={(e) => onChangeRangeFilter(e, false)}
                  onKeyDown={(e) => onChangeRangeFilter(e, false)}
                />
                <span className="currency">{translate(prefix + 'label.oneDayAfter')}</span>
              </div>
            </div>
            <div className="wrap-check-radio version3">
              <p className="radio-item mr-5">
                <input type="radio" id={idRadioList[8]} name={nameRadio[1]}
                  value={NumberModeDate.Normal}
                  checked={NumberModeDate.Normal === numberDateBeforeAfterMode}
                  onChange={() => setNumberDateBeforeAfterMode(NumberModeDate.Normal)}
                />
                <label htmlFor={idRadioList[8]}>{translate(prefix + 'label.realDate')}</label>
              </p>
              <p className="radio-item ml-4">
                <input type="radio" id={idRadioList[9]} name={nameRadio[1]}
                  value={NumberModeDate.Working}
                  checked={NumberModeDate.Working === numberDateBeforeAfterMode}
                  onChange={() => setNumberDateBeforeAfterMode(NumberModeDate.Working)}
                />
                <label htmlFor={idRadioList[9]}>{translate(prefix + 'label.workDate')}</label>
              </p>
            </div>
          </>}
          {searchModeDate === FilterModeDate.TodayBefore && <>
            <div className="wrap-input-date version2">
              <span className="date-from">{translate(prefix + 'label.dateFrom')}</span>
              <div className="form-control-wrap mr-2 ml-3">
                <input type="text" className="input-normal input-common2 mr-1" placeholder="0"
                  value={numberDateBeforeFrom}
                  onChange= {(e) => onChangeRangeFilter(e, true)}
                  onKeyUp={(e) => onChangeRangeFilter(e, true)}
                  onKeyDown={(e) => onChangeRangeFilter(e, true)}
                />
                <span className="currency">{translate(prefix + 'label.oneDayBefore')}</span>
              </div>
              <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
              <div className="form-control-wrap ml-3">
                <input type="text" className="input-normal input-common2 version2" placeholder="0"
                  value={numberDateBeforeTo}
                  onChange= {(e) => onChangeRangeFilter(e, false)}
                  onKeyUp={(e) => onChangeRangeFilter(e, false)}
                  onKeyDown={(e) => onChangeRangeFilter(e, false)}
                />
                <span className="currency">{translate(prefix + 'label.oneDayBefore')}</span>
              </div>
            </div>
            <div className="wrap-check-radio version3">
              <p className="radio-item mr-5">
                <input type="radio" id={idRadioList[8]} name={nameRadio[1]}
                  value={NumberModeDate.Normal}
                  checked={NumberModeDate.Normal === numberDateBeforeMode}
                  onChange={() => setNumberDateBeforeMode(NumberModeDate.Normal)}
                />
                <label htmlFor={idRadioList[8]}>{translate(prefix + 'label.realDate')}</label>
              </p>
              <p className="radio-item ml-4">
                <input type="radio" id={idRadioList[9]} name={nameRadio[1]}
                  value={NumberModeDate.Working}
                  checked={NumberModeDate.Working === numberDateBeforeMode}
                  onChange={() => setNumberDateBeforeMode(NumberModeDate.Working)}
                />
                <label htmlFor={idRadioList[9]}>{translate(prefix + 'label.workDate')}</label>
              </p>
            </div>
          </>}
          {searchModeDate === FilterModeDate.TodayAfter && <>
            <div className="wrap-input-date version2">
              <span className="date-from">{translate(prefix + 'label.dateFrom')}</span>
              <div className="form-control-wrap mr-2 ml-3">
                <input type="text" className="input-normal input-common2 mr-1" placeholder="0"
                  value={numberDateAfterFrom}
                  onChange= {(e) => onChangeRangeFilter(e, true)}
                  onKeyUp={(e) => onChangeRangeFilter(e, true)}
                  onKeyDown={(e) => onChangeRangeFilter(e, true)}
                />
                <span className="currency">{translate(prefix + 'label.oneDayAfter')}</span>
              </div>
              <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
              <div className="form-control-wrap ml-3">
                <input type="text" className="input-normal input-common2 version2" placeholder="0"
                  value={numberDateAfterTo}
                  onChange= {(e) => onChangeRangeFilter(e, false)}
                  onKeyUp={(e) => onChangeRangeFilter(e, false)}
                  onKeyDown={(e) => onChangeRangeFilter(e, false)}
                />
                <span className="currency">{translate(prefix + 'label.oneDayAfter')}</span>
              </div>
            </div>
            <div className="wrap-check-radio version3">
              <p className="radio-item mr-5">
                <input type="radio" id={idRadioList[8]} name={nameRadio[1]}
                  value={NumberModeDate.Normal}
                  checked={NumberModeDate.Normal === numberDateAfterMode}
                  onChange={() => setNumberDateAfterMode(NumberModeDate.Normal)}
                />
                <label htmlFor={idRadioList[8]}>{translate(prefix + 'label.realDate')}</label>
              </p>
              <p className="radio-item ml-4">
                <input type="radio" id={idRadioList[9]} name={nameRadio[1]}
                  value={NumberModeDate.Working}
                  checked={NumberModeDate.Working === numberDateAfterMode}
                  onChange={() => setNumberDateAfterMode(NumberModeDate.Working)}
                />
                <label htmlFor={idRadioList[9]}>{translate(prefix + 'label.workDate')}</label>
              </p>
            </div>
          </>}
        </div>
      </>
    );
  }

  return (
    <>{renderComponent()}</>
  );
})

export default FieldSearchDateTime
