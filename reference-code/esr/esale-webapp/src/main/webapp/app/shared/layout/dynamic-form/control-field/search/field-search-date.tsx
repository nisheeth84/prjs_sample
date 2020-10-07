import React, { useState, useEffect, useRef, forwardRef } from 'react';
import DayPicker from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';
import { useId } from 'react-id-generator';
import _, { parseInt } from 'lodash';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { NumberModeDate, FilterModeDate, DEFINE_FIELD_TYPE } from '../../constants';
import DatePicker from 'app/shared/layout/common/date-picker';
import MonthDayPicker from '../component/month-day';
import { Storage, translate } from 'react-jhipster';
import StringUtils, {getFieldLabel, getNumberFromDay, getNumberToDay, jsonParse} from 'app/shared/util/string-utils';
import {getDateBeforeAfter, convertDateTimeToTz, convertDateTimeFromTz} from 'app/shared/util/date-utils';
import { DATE_MODE, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT, APP_DATE_FORMAT_ES } from 'app/config/constants';
import { getIconSrc } from 'app/config/icon-loader';

export interface IFieldSearchDateOwnProps {
  fieldRelation?: any;
}

type IFieldSearchDateProps = IDynamicFieldProps & IFieldSearchDateOwnProps

const FieldSearchDate = forwardRef((props: IFieldSearchDateProps, ref) => {
  const FORMAT_DATE = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT)
  const [, setValueFilter] = useState(null);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [monthdayFrom, setMonthdayFrom] = useState('')
  const [monthdayTo, setMonthdayTo] = useState('')
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
  const [numberMonthBeforeAfterMode, setNumberMonthBeforeAfterMode] = useState(NumberModeDate.Normal);
  const [numberYearBeforeAfterFrom, setNumberYearBeforeAfterFrom] = useState(null);
  const [numberYearBeforeAfterTo, setNumberYearBeforeAfterTo] = useState(null);
  const [numberYearBeforeAfterMode, setNumberYearBeforeAfterMode] = useState(NumberModeDate.Normal);

  const [showTooltip, setShowTooltip] = useState(false);
  const divToolTip = useRef(null);
  const [searchModeDate, setSearchModeDate] = useState(FilterModeDate.PeriodYmd);
  const [showModeSearch, setShowModeSearch] = useState(false);

  const divModeSearch = useRef(null)
  const idRadioList = useId(10, "datebox_radio_");
  const nameRadio = useId(2, "datebox_radioGroup_");

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
  };

  const setStateNumber = (number) => {
    setSearchModeDate(parseInt(number))
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

  const setModeDateSearch = (valueFilter) => {
    if (props.elementStatus && props.elementStatus.searchType && props.elementStatus.searchType !== '1' && props.elementStatus.searchType !== 1) {
      setStateNumber(props.elementStatus.searchType)
    } else if (!_.isNil(props.elementStatus.searchModeDate)) {
      setSearchModeDate(props.elementStatus.searchModeDate);
    } else if (_.isEmpty(valueFilter)) {
      setSearchModeDate(FilterModeDate.None);
    }
    else {
      setSearchModeDate(FilterModeDate.PeriodYmd)
    }
  }
  const initialize = () => {
    console.log({props});
    
    if (props.updateStateElement && !props.isDisabled) {
      if (props.elementStatus) {
        const valueFilterProps = jsonParse(props.elementStatus['searchValue']);
        if (valueFilterProps) {
          if (props.elementStatus && props.elementStatus.searchType) {
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
          } else {
            setSearchModeDate(FilterModeDate.None);
            return;
          }
          setValueFilter(valueFilterProps);
        }
        setModeDateSearch(valueFilterProps);
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
        if(props.elementStatus.numberMonthBeforeAfterMode) {
          setNumberMonthBeforeAfterMode(props.elementStatus.numberMonthBeforeAfterMode);
        }
        if(props.elementStatus.numberYearBeforeAfterFrom) {
          setNumberYearBeforeAfterFrom(props.elementStatus.numberYearBeforeAfterFrom);
        }
        if(props.elementStatus.numberYearBeforeAfterTo) {
          setNumberYearBeforeAfterTo(props.elementStatus.numberYearBeforeAfterTo);
        }
        if(props.elementStatus.numberYearBeforeAfterMode) {
          setNumberYearBeforeAfterMode(props.elementStatus.numberYearBeforeAfterMode);
        }
      }
    }
  };

  useEffect(() => {
    setSearchModeDate(FilterModeDate.PeriodYmd);
    initialize();
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, []);

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
    if (!props.isDisabled && props.updateStateElement) {
        const conditions = {};
        conditions['fieldId'] = fieldInfo.fieldId;
        conditions['fieldType'] = fieldInfo.fieldType;
        conditions['isDefault'] = fieldInfo.isDefault ? fieldInfo.isDefault : false;
        conditions['fieldName'] = fieldInfo.fieldName;
        conditions['isSearchBlank'] = searchModeDate === FilterModeDate.None;
        conditions['fieldValue'] = [];
        let valDown = '';
        let valUp = '';
        if (searchModeDate === FilterModeDate.PeriodYmd) {
          valDown = dateFrom ? dateFnsFormat(convertDateTimeFromTz(dateFrom), APP_DATE_FORMAT_ES) : '';
          valUp = dateTo ? dateFnsFormat(convertDateTimeFromTz(dateTo), APP_DATE_FORMAT_ES) : '';
        } else if (searchModeDate === FilterModeDate.PeriodMd) {
          const split = getSeperate();
          if (!_.isEmpty(monthdayFrom)) {
            const monthDayArr = monthdayFrom.split(split)
            // if(IS_YEAR_BEFORE){
              valDown = monthDayArr[0] + monthDayArr[1]
            // } else {
            //   valDown = monthDayArr[1] + monthDayArr[0]
            // }
          }
          if (!_.isEmpty(monthdayTo)) {
            const monthDayArr = monthdayTo.split(split)
            // if(IS_YEAR_BEFORE){
              valUp = monthDayArr[0] + monthDayArr[1]
            // } else {
            //   valUp = monthDayArr[1] + monthDayArr[0]
            // }
          }
        } else if (searchModeDate === FilterModeDate.DayBeforeAfter) {
          if (NumberModeDate.Working === numberDateBeforeAfterMode) {
            valDown = numberDateBeforeAfterFrom;
            valUp = numberDateBeforeAfterTo;
          } else {
            valDown = getDateBeforeAfter(numberDateBeforeAfterFrom, DATE_MODE.DATE_BEFORE);
            valUp = getDateBeforeAfter(numberDateBeforeAfterTo, DATE_MODE.DATE_AFTER);
          }
        } else if (searchModeDate === FilterModeDate.TodayBefore) {
          if (NumberModeDate.Working === numberDateBeforeMode) {
            valDown = numberDateBeforeFrom;
            valUp = numberDateBeforeTo;
          } else {
            valDown = getDateBeforeAfter(numberDateBeforeFrom, DATE_MODE.DATE_BEFORE);
            valUp = getDateBeforeAfter(numberDateBeforeTo, DATE_MODE.DATE_BEFORE);
          }
        } else if (searchModeDate === FilterModeDate.TodayAfter) {
          if (NumberModeDate.Working === numberDateAfterMode) {
            valDown = numberDateAfterFrom;
            valUp = numberDateAfterTo;
          } else {
            valDown = getDateBeforeAfter(numberDateAfterFrom, DATE_MODE.DATE_AFTER);
            valUp = getDateBeforeAfter(numberDateAfterTo, DATE_MODE.DATE_AFTER);
          }
        } else if (searchModeDate === FilterModeDate.MonthBeforeAfter) {
          valDown = getDateBeforeAfter(numberMonthBeforeAfterFrom, DATE_MODE.MONTH_BEFORE);
          valUp = getDateBeforeAfter(numberMonthBeforeAfterTo, DATE_MODE.MONTH_AFTER);
        } else if (searchModeDate === FilterModeDate.YearBeforeAfter) {
          valDown = getDateBeforeAfter(numberYearBeforeAfterFrom, DATE_MODE.YEAR_BEFORE);
          valUp = getDateBeforeAfter(numberYearBeforeAfterTo, DATE_MODE.YEAR_AFTER);
        }
        if ((valDown && valDown.length > 0) || (valUp && valUp.length > 0)) {
          if ((NumberModeDate.Working === numberDateAfterMode && searchModeDate === FilterModeDate.TodayAfter)
            || (NumberModeDate.Working === numberDateBeforeMode && searchModeDate === FilterModeDate.TodayBefore)
            || (NumberModeDate.Working === numberDateBeforeAfterMode && searchModeDate === FilterModeDate.DayBeforeAfter)) {
            conditions['fieldValue'].push({from: valDown, to: valUp, filterModeDate: searchModeDate});
          } else {
            conditions['fieldValue'].push({from: valDown, to: valUp});
          }
        }
        // save other properties
        conditions['searchModeDate'] = searchModeDate;
        conditions['dateFrom'] = dateFrom ? dateFnsFormat(convertDateTimeFromTz(dateFrom), FORMAT_DATE) : '';
        conditions['dateTo'] = dateTo ? dateFnsFormat(convertDateTimeFromTz(dateTo), FORMAT_DATE) : '';
        conditions['monthDayFrom'] = monthdayFrom;
        conditions['monthDayTo'] = monthdayTo;
        conditions['numberDateBeforeAfterFrom'] = numberDateBeforeAfterFrom;
        conditions['numberDateBeforeAfterTo'] = numberDateBeforeAfterTo;
        conditions['numberDateBeforeAfterMode'] = numberDateBeforeAfterMode;
        conditions['numberDateBeforeFrom'] = numberDateBeforeFrom;
        conditions['numberDateBeforeTo'] = numberDateBeforeTo;
        conditions['numberDateBeforeMode'] = numberDateBeforeMode;
        conditions['numberDateAfterFrom'] = numberDateAfterFrom;
        conditions['numberDateAfterTo'] = numberDateAfterTo;
        conditions['numberDateAfterMode'] = numberDateAfterMode;
        conditions['numberMonthBeforeAfterFrom'] = numberMonthBeforeAfterFrom;
        conditions['numberMonthBeforeAfterTo'] = numberMonthBeforeAfterTo;
        conditions['numberMonthBeforeAfterMode'] = numberMonthBeforeAfterMode;
        conditions['numberYearBeforeAfterFrom'] = numberYearBeforeAfterFrom;
        conditions['numberYearBeforeAfterTo'] = numberYearBeforeAfterTo;
        conditions['numberYearBeforeAfterMode'] = numberYearBeforeAfterMode;
        props.updateStateElement(fieldInfo, DEFINE_FIELD_TYPE.DATE, conditions)

    }

  }, [searchModeDate, dateFrom, dateTo, monthdayFrom, monthdayTo,
      numberDateBeforeAfterFrom, numberDateBeforeAfterTo, numberDateBeforeAfterMode,
      numberDateBeforeFrom, numberDateBeforeTo, numberDateBeforeMode,
      numberDateAfterFrom, numberDateAfterTo, numberDateAfterMode,
      numberMonthBeforeAfterFrom, numberMonthBeforeAfterTo, numberMonthBeforeAfterMode,
      numberYearBeforeAfterFrom, numberYearBeforeAfterTo, numberYearBeforeAfterMode]);

  const onChangeRangeFilter = (e, isFrom) => {
    const { value } = e.target;
    if (value.trim().length === 0 || numberRegExp.test(value)) {
      if (searchModeDate === FilterModeDate.DayBeforeAfter) {
        isFrom ? setNumberDateBeforeAfterFrom(value) : setNumberDateBeforeAfterTo(value);
      } else if (searchModeDate === FilterModeDate.TodayBefore) {
        isFrom ? setNumberDateBeforeFrom(value) : setNumberDateBeforeTo(value);
      } else if (searchModeDate === FilterModeDate.TodayAfter) {
        isFrom ? setNumberDateAfterFrom(value) : setNumberDateAfterTo(value);
      } else if (searchModeDate === FilterModeDate.MonthBeforeAfter) {
        isFrom ? setNumberMonthBeforeAfterFrom(value) : setNumberMonthBeforeAfterTo(value);
      } else if (searchModeDate === FilterModeDate.YearBeforeAfter) {
        isFrom ? setNumberYearBeforeAfterFrom(value) : setNumberYearBeforeAfterTo(value);
      }
    }
  }

  const isDisableTootltip = () => {
    return searchModeDate !== FilterModeDate.PeriodYmd && searchModeDate !== FilterModeDate.PeriodMd &&
    searchModeDate !== FilterModeDate.DayBeforeAfter && searchModeDate !== FilterModeDate.TodayBefore &&
    searchModeDate !== FilterModeDate.TodayAfter && searchModeDate !== FilterModeDate.MonthBeforeAfter
    && searchModeDate !== FilterModeDate.YearBeforeAfter;
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
        {props.showFieldLabel && !props.isRequired && 
          <label className={headerClass}>
            <img className="mr-2 badge-icon" src={iconSrc} alt="" />{label}
          </label>
        }
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
          <a className={`icon-small-primary icon-help-small ${showTooltip && "active"} ${isDisableTootltip() && "disable"}`}
            onClick={() => {setShowTooltip(true); setShowModeSearch(false)}}
          />
          <div ref = {divToolTip}>
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
          {showTooltip && searchModeDate === FilterModeDate.PeriodMd &&
          <div className="advance-search-popup mb-3">
             範囲の開始と終了の日付を指定して検索を行うと、その範囲内の日付が入力されているシート が検索対象になります。<br/>
            （どの年でも、検索対象になります）<br/><br/>
            例）「1月1日 - 3月31日」と範囲指定した場合
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow4.svg`} alt="" title=""/>
            </div>
            存在しない日が指定された場合、その月の最終日に補正されます。<br/>
            （例えば、「2月31日」と指定した場合、うるう年なら2月29日、非うるう年なら2月28日に補正されます）
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
          {showTooltip && searchModeDate === FilterModeDate.MonthBeforeAfter &&
          <div className="advance-search-popup mb-3">
            <p>今日の日付を基準にして範囲が計算され、その範囲内の日付が入力されているシートが検索対象になります。</p>
            <p className="mb-3">※ 検索条件を保存しておき、明日/明後日/・・・に再度検索を行うと、明日/明後日/・・・の日付を基準にして都度、範囲が計算されます。</p>
            <p>例）「3ヶ月前 - 5ヶ月後」と範囲指定した場合</p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow14.svg`}/>
            </div>
            <p className="mb-3">範囲の開始のみ指定すると、それ以降の日付が入力されているシートが検索対象になります。</p>
            <p>例）「3ヶ月前 - 」と範囲指定した場合</p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow15.svg`}/>
            </div>
            <p className="mb-3">範囲の終了のみ指定すると、それ以前の日付が入力されているシートが検索対象になります。</p>
            <p>例）「 - 5ヶ月後」と範囲指定した場合</p>
            <div className="advance-search-date-arrow mb-0">
              <img src={baseUrl + `/content/images/common/advance-search-arrow16.svg`}/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.YearBeforeAfter &&
          <div className="advance-search-popup mb-3">
            <p>今日の日付を基準にして範囲が計算され、その範囲内の日付が入力されているシートが検索対象になります。</p>
            <p className="mb-3">※ 検索条件を保存しておき、明日/明後日/・・・に再度検索を行うと、明日/明後日/・・・の日付を基準にして都度、範囲が計算されます。</p>
            <p>例）「3年前 - 5年後」と範囲指定した場合</p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow17.svg`}/>
            </div>
            <p className="mb-3">範囲の開始のみ指定すると、それ以降の日付が入力されているシートが検索対象になります。</p>
            <p>例）「3年前 - 」と範囲指定した場合</p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow18.svg`}/>
            </div>
            <p className="mb-3">範囲の終了のみ指定すると、それ以前の日付が入力されているシートが検索対象になります。</p>
            <p>例）「 - 5年後」と範囲指定した場合</p>
            <div className="advance-search-date-arrow mb-0">
              <img src={baseUrl + `/content/images/common/advance-search-arrow19.svg`}/>
            </div>
          </div>
          }
        </div>
        </div>
      </>
    )
  }

  const renderComponentHeaderEn = () => {
    return (
      <>
        {renderHeaderTitle()}
        <div className="advance-search-popup-wrap">
          <a className={`icon-small-primary icon-help-small ${showTooltip && "active"} ${isDisableTootltip() && "disable"}`}
            onClick={() => {setShowTooltip(true); setShowModeSearch(false)}}
          />
          <div ref = {divToolTip}>
          {showTooltip && searchModeDate === FilterModeDate.PeriodYmd &&
          <div className="advance-search-popup mb-3">
            When searching by specifying a range using both start date and end date, the sheets with dates within the range will be searched.<br/>
            Example) If the specified range is &quot;2005-01-01-2010-12-31&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow1.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using start date only, the sheets with dates after that specified date will be searched.<br/>
            Example) If the specified range is &quot;2005-01-01 -&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow2.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using end date only, the sheets with dates prior to that specified date will be searched<br/>
            Example) If the specified range is &quot;- 2010-12-31&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow3.svg`} alt="" title=""/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.PeriodMd &&
          <div className="advance-search-popup mb-3">
            When searching by specifying a range using both start date and end date, the sheets with dates within the range will be searched.<br/>
            (Any year will be searched)<br/><br/>
            Example) If the specified range is &quot;1/1 – 3/31&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow4.svg`} alt="" title=""/>
            </div>
            If a nonexistent date is specified, it will be automatically replaced by the last day of that month.<br/>
            (Example: If &quot;2-31&quot;, is specified, the date will be corrected to 2-29 for leap years and 2-28 for non-leap years)
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.DayBeforeAfter &&
          <div className="advance-search-popup mb-3">
            The range is calculated based on the current date and the sheets filled with dates within the range will be searched.<br/>
            ※If the search conditions are saved and used in the following days, the range will be re-vd each time based on that following day.<br/><br/>
            Example) If the specified range is &quot;3 (days) past - 5 (days) next&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow5-EN.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using start point only, the sheets with dates after that specified point will be searched.<br/><br/>
            Example) If the specified range is &quot;3 (days) past -&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow6-EN.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using end point only, the sheets with dates prior to that specified point will be searched.<br/><br/>
            Example) If the specified range is &quot;- 5 (days) next&quot;
            <div className="advance-search-date-arrow">
                <img src={baseUrl + `/content/images/common/advance-search-arrow7-EN.svg`} alt="" title=""/>
            </div>
            If &quot;Calculate based on calendar days&quot;is selected, the holidays inbetween will also be counted when calculating the start date and/or the end date of the range.<br/>
            If &quot;Calculate based on working days&quot;is selected, the holidays inbetween will not be counted when calculating the start date and/or the end date of the range.
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.TodayBefore &&
          <div className="advance-search-popup mb-3">
           The range is calculated based on the current date and the sheets with dates within the range will be searched.<br/>
           ※If the search conditions are saved and is re-conducted the following days, the range will be re-calculated each time based on that following day.<br/><br/>
           Example) If the specified range is &quot;5 (days) past - 3 (days) past&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow8-EN.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using start point only, the sheets with dates after that specified point will be searched.<br/><br/>
            Example) If the specified range is &quot;5 (days) past –&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow9-EN.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using end point only, the sheets with dates prior to that specified point will be searched.<br/><br/>
            Example) If the specified range is &quot;– 3 (days) past -&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow10-EN.svg`} alt="" title=""/>
            </div>
            If &quot;Calculate based on calendar days&quot; is selected, the holidays inbetween will also be counted when calculating the start date and/or the end date of the range.<br/>
            If &quot;Calculate based on working day&quot; is selected, the holidays inbetween will not be counted when calculating the start date and/or the end date of the range.
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.TodayAfter &&
          <div className="advance-search-popup mb-3">
            The range is calculated based on the current date and the sheets with dates within the range will be searched.<br/>
            ※If the search conditions are saved and is re-conducted the following days, the range will be re-calculated each time based on that following day.<br/><br/>
            Example) If the specified range is &quot;3 (days) next - 5 (days) next&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow11-EN.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using start point only, the sheets with dates after that specified point will be searched.<br/><br/>
            Example) If the specified range is &quot;3 (days) next -&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow12-EN.svg`} alt="" title=""/>
            </div>
            When searching by specifying a range using end point only, the sheets with dates prior to that specified point will be searched.<br/><br/>
            Example) If the specified range is &quot;- 5 (days) next &quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow13-EN.svg`} alt="" title=""/>
            </div>
            If &quot;Calculate based on calendar days&quot; is selected, the holidays inbetween will also be counted when calculating the start date and/or the end date of the range.<br/>
            If &quot;Calculate based on working days&quot; is selected, the holidays inbetween will not be counted when calculating the start date and/or the end date of the range.
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.MonthBeforeAfter &&
          <div className="advance-search-popup mb-3">
            <p>The range is calculated based on the current date and the sheets with dates within the range will be searched.</p>
            <p className="mb-3">※If the search conditions are saved and is re-conducted the following days, the range will be re-calculated each time based on that following day.</p>
            <p>Example) If the specified range is  &quot;3 (months) past – 5 (months) next&quot;</p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow14-EN.svg`}/>
            </div>
            <p className="mb-3"> When searching by specifying a range using start point only, the sheets with dates after that specified point will be searched. </p>
            <p>Example) If the specified range is &quot;3 (months) past -&quot;</p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow15-EN.svg`}/>
            </div>
            <p className="mb-3"> When searching by specifying a range using end point only, the sheets with dates prior to that specified point will be searched. </p>
            <p>Example) If the specified range is &quot;– 5 (months) next&quot;</p>
            <div className="advance-search-date-arrow mb-0">
              <img src={baseUrl + `/content/images/common/advance-search-arrow16-EN.svg`}/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.YearBeforeAfter &&
          <div className="advance-search-popup mb-3">
            <p>The range is calculated based on the current date and the sheets with dates within the range will be searched.</p>
            <p className="mb-3"> ※If the search conditions are saved and is re-conducted the following days, the range will be re-calculated each time based on that following day.</p>
            <p>Example) If the specified range is &quot;3 (years) past – 5 (years) next&quot;</p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow17-EN.svg`}/>
            </div>
            <p className="mb-3"> When searching by specifying a range using start point only, the sheets with dates after that specified point will be searched. </p>
            <p>Example) If the specified range is &quot;3 (years) past –&quot;</p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow18-EN.svg`}/>
            </div>
            <p className="mb-3"> When searching by specifying a range using end point only, the sheets with dates prior to that specified point will be searched. </p>
            <p>Example) If the specified range is &quot;– 5 (years) next&quot;</p>
            <div className="advance-search-date-arrow mb-0">
              <img src={baseUrl + `/content/images/common/advance-search-arrow19-EN.svg`}/>
            </div>
          </div>
          }
        </div>
        </div>
      </>
    )
  }

  const renderComponentHeaderCn = () => {
    return (
      <>
        {renderHeaderTitle()}
        <div className="advance-search-popup-wrap">
          <a className={`icon-small-primary icon-help-small ${showTooltip && "active"} ${isDisableTootltip() && "disable"}`}
            onClick={() => {setShowTooltip(true); setShowModeSearch(false)}}
          />
          <div ref = {divToolTip}>
          {showTooltip && searchModeDate === FilterModeDate.PeriodYmd &&
          <div className="advance-search-popup mb-3">
            通过指定范围的开始和结束日期进行搜索时，输入了该范围内的日期的工作表将成为搜索对象。 <br/>
            例如)指定的范围为&quot;2005-01-01-2010-12-31&quot;时
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow1.svg`} alt="" title=""/>
            </div>
            如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。 <br/>
            例如) 指定的范围为&quot;2005-01-01-&quot;时
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow2.svg`} alt="" title=""/>
            </div>
            如果只指定了范围的结束，则输入了该范围结束之前的日期的工作表将成为搜索对象。 <br/>
            例如) 指定的范围为&quot;-2010-12-31&quot;时
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow3.svg`} alt="" title=""/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.PeriodMd &&
         <div className ="advance-search-popup mb-3">
            通过指定范围的开始和结束日期进行搜索时，输入了该范围内的日期的工作表将成为搜索对象。 <br/>
            （任何一年都可以成为搜索对象）<br/> <br/>
            例如) 指定的范围为&quot;1月1日至3月31日&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow4.svg`} alt="" title=""/>
            </div>
            如果指定了不存在的日期，该日期将被更改为该月的最后一天。 <br/>
            (例如：您指定的日期为&quot;2月31日&quot;，如果是闰年，则该日期将被改为2月29日；如果是非闰年，则被改为2月28日)
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.DayBeforeAfter &&
          <div className="advance-search-popup mb-3">
            该范围将根据今天的日期进行计算。日期在该范围内的工作表将成为搜索对象。 <br/>
            ※如果您保存搜索条件并在明天/后天/ ...再次执行搜索，则该范围将根据明天/后天...得到相应计算。 <br/> <br/>
            例如)指定的范围为&quot;3天前-5天后&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow5-CN.svg`} alt="" title=""/>
            </div>
            如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。 <br/> <br/>
            例如)如果指定的范围为&quot;3天前-&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow6-CN.svg`} alt="" title=""/>
            </div>
            如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。 <br/> <br/>
            例如)如果指定的范围为&quot;-5天后&quot;
            <div className="advance-search-date-arrow">
                <img src={baseUrl + `/content/images/common/advance-search-arrow7-CN.svg`} alt="" title=""/>
            </div>
            如果您选择「按实际天数计算」，则开始日期/结束日期范围将包括假日。 <br/>
            如果您选择「按工作日数计算」，则开始日期/结束日期范围将不包括假日。
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.TodayBefore &&
          <div className="advance-search-popup mb-3">
            该范围将根据今天的日期进行计算。日期在该范围内的工作表将成为搜索对象。 <br/>
            ※如果您保存搜索条件并在明天/后天/ ...再次执行搜索，则该范围将根据明天/后天...得到相应计算。 <br/> <br/>
            例如) 如果指定的范围为&quot;5天前 - 3天前&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow8-CN.svg`} alt="" title=""/>
            </div>
            如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。 <br/> <br/>
            例如)如果指定的范围为&quot;5天前-&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow9-CN.svg`} alt="" title=""/>
            </div>
            如果您仅指定范围的结束日期，则搜索对象将是从该日期或更早的日期输入的工作表。<br/> <br/>
            例如)如果指定的范围为&quot;-3天前&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow10-CN.svg`} alt="" title=""/>
            </div>
            如果您选择「按实际天数计算」，则开始日期/结束日期范围将包括假日。 <br/>
            如果您选择「按工作日数计算」，则开始日期/结束日期范围将不包括假日。
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.TodayAfter &&
          <div className="advance-search-popup mb-3">
            根据今天的日期计算范围，并将在该日期范围内输入的工作表作为搜索对象。 <br/>
            ※如果您保存搜索条件并在明天/后天/ ...再次执行搜索，则该范围将根据明天/后天...得到相应计算。 <br/> <br/>
            例如)如果指定的范围为&quot;3天后 - 5天后&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow11-CN.svg`} alt="" title=""/>
            </div>
            如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。 <br/> <br/>
            例如)如果指定的范围为&quot;3天后-&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow12-CN.svg`} alt="" title=""/>
            </div>
            如果您仅指定范围的结束日期，则搜索对象将是在从该日期或更早的日期输入的工作表。<br/> <br/>
            例如)如果指定的范围为&quot;-5天后&quot;
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow13-CN.svg`} alt="" title=""/>
            </div>
            如果您选择「按实际天数计算」，则开始日期/结束日期范围将包括假日。 <br/>
            如果您选择「按工作日数计算」，则开始日期/结束日期范围将不包括假日。
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.MonthBeforeAfter &&
          <div className="advance-search-popup mb-3">
            <p>根据今天的日期计算范围，并将在此范围内输入日期的工作表作为搜索对象。 </ p>
             <p className ="mb-3"> ※如果您保存搜索条件并在明天/后天/ ...再次执行搜索，则该范围将根据明天/后天...得到相应计算。 </ p>
             <p>例如)指定的范围为&quot;3个月前-5个月后&quot; </ p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow14-CN.svg`}/>
            </div>
            <p className ="mb-3">如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。 </ p>
             <p>例如)如果指定的范围为&quot;3个月前-&quot; </ p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow15-CN.svg`}/>
            </div>
            <p className ="mb-3">如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。</ p>
             <p>例如)如果指定的范围为&quot;-5个月后&quot; </ p>
            <div className="advance-search-date-arrow mb-0">
              <img src={baseUrl + `/content/images/common/advance-search-arrow16-CN.svg`}/>
            </div>
          </div>
          }
          {showTooltip && searchModeDate === FilterModeDate.YearBeforeAfter &&
          <div className="advance-search-popup mb-3">
            <p>根据今天的日期计算范围，并将在该日期范围内输入的工作表作为搜索对象。 </ p>
             <p className ="mb-3"> ※如果您保存搜索条件并在明天/后天/ ...再次执行搜索，则该范围将根据明天/后天...得到相应计算。 </ p>
             <p>例如)如果指定的范围为&quot;3年前 – 5年后&quot; </ p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow17-CN.svg`}/>
            </div>
            <p className ="mb-3">如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。 </ p>
             <p>例如)如果指定的范围为&quot;3年前-&quot; </ p>
            <div className="advance-search-date-arrow">
              <img src={baseUrl + `/content/images/common/advance-search-arrow18-CN.svg`}/>
            </div>
            <p className ="mb-3">如果仅指定了范围的开始，那么输入了该日期以及该日期以后日期的工作表将成为检索对象。 </ p>
             <p>例如)如果指定的范围为&quot;-5年后&quot; </ p>
            <div className="advance-search-date-arrow mb-0">
              <img src={baseUrl + `/content/images/common/advance-search-arrow19-CN.svg`}/>
            </div>
          </div>
          }
        </div>
        </div>
      </>
    )
  }

  const renderComponentHeaderSearch = () => {
    const lang = Storage.session.get('locale', "ja_jp");
    if (lang === 'ja_jp') {
      return renderComponentHeaderJa();
    } else if (lang ==='en_us') {
      return renderComponentHeaderEn();
    } else if (lang === 'zh_cn') {
      return renderComponentHeaderCn();
    } else {
      return renderComponentHeaderJa();
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
    const indexSelected = listModeSearch.findIndex( e => e.id === searchModeDate);
    return (
      <button type="button" className={`select-option ${searchModeDate === FilterModeDate.PeriodYmd ? 'w45' : 'w30'} ${props.isDisabled ? ' pointer-none': ''}`}>
        <span className="select-text" onClick={() => setShowModeSearch(!showModeSearch)} >
          {indexSelected >= 0 ? listModeSearch[indexSelected].name : ''}
        </span>
        {showModeSearch && !props.isDisabled &&
        <div className="select-box w100" ref={divModeSearch}>
          <div className="wrap-check-radio unset-height">
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
          {searchModeDate === FilterModeDate.PeriodYmd &&
          <div className="wrap-input-date wrap-input-date-2-input">
            <div className="form-group form-group2 common has-delete mt-1 mr-1 w51">
              <DatePicker
                date={dateFrom}
                isDisabled={props.isDisabled}
                onDateChanged={(d) => setDateFrom(d)}
                placeholder={StringUtils.translateSpecial('dynamic-control.placeholder.dateTime', {fieldNamePlaceHolder})}
              />
            </div>
            <span className="approximately w10 text-center color-999">{translate('dynamic-control.approximately')}</span>
            <div className="form-group form-group2 common has-delete mt-1 w50">
              <DatePicker
                date={dateTo}
                isDisabled={props.isDisabled}
                onDateChanged={(d) => setDateTo(d)}
                placeholder={StringUtils.translateSpecial('dynamic-control.placeholder.dateTime', {fieldNamePlaceHolder})}
              />
            </div>
          </div>
          }
          {searchModeDate === FilterModeDate.PeriodMd &&
            <div className="wrap-input-date version2">
              <div className="form-control-wrap w43">
                <MonthDayPicker
                  classFilter="mb-1 mt-2"
                  monthDay={monthdayFrom}
                  onChangeMonthDay={(val) => setMonthdayFrom(val)}
                  placeHolder="--"
                />
              </div>
              <span className="approximately mr-5 ml-5 color-999">{translate('dynamic-control.approximately')}</span>
              <div className="form-control-wrap w43">
                <MonthDayPicker
                  classFilter="mb-1 mt-2"
                  monthDay={monthdayTo}
                  onChangeMonthDay={(val) => setMonthdayTo(val)}
                  placeHolder="--"
                />
              </div>
            </div>
          }
          {searchModeDate === FilterModeDate.DayBeforeAfter && <>
            <div className="wrap-input-date version2">
              <span className="date-from">{translate(prefix + 'label.dateFrom')}</span>
              <div className="form-control-wrap mr-2 ml-3">
                <input type="text" className="input-normal input-common2" placeholder="0"
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
                <input type="text" className="input-normal input-common2" placeholder="0"
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
                <input type="text" className="input-normal input-common2" placeholder="0"
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
          {searchModeDate === FilterModeDate.MonthBeforeAfter && <>
            <div className="wrap-input-date version2">
              <span className="date-from">{translate(prefix + 'label.dateFrom')}</span>
              <div className="form-control-wrap mr-2 ml-3">
                <input type="text" className="input-normal input-common2" placeholder="0"
                  value={numberMonthBeforeAfterFrom}
                  onChange= {(e) => onChangeRangeFilter(e, true)}
                  onKeyUp={(e) => onChangeRangeFilter(e, true)}
                  onKeyDown={(e) => onChangeRangeFilter(e, true)}
                />
                <span className="currency">{translate(prefix + 'label.monthBeforeAfterFrom')}</span>
              </div>
              <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
              <div className="form-control-wrap ml-3">
                <input type="text" className="input-normal input-common2 version2" placeholder="0"
                  value={numberMonthBeforeAfterTo}
                  onChange= {(e) => onChangeRangeFilter(e, false)}
                  onKeyUp={(e) => onChangeRangeFilter(e, false)}
                  onKeyDown={(e) => onChangeRangeFilter(e, false)}
                />
                <span className="currency">{translate(prefix + 'label.monthBeforeAfterTo')}</span>
              </div>
            </div>
          </>}
          {searchModeDate === FilterModeDate.YearBeforeAfter && <>
            <div className="wrap-input-date version2">
              <span className="date-from">{translate(prefix + 'label.dateFrom')}</span>
              <div className="form-control-wrap mr-2 ml-3">
                <input type="text" className="input-normal input-common2" placeholder="0"
                  value={numberYearBeforeAfterFrom}
                  onChange= {(e) => onChangeRangeFilter(e, true)}
                  onKeyUp={(e) => onChangeRangeFilter(e, true)}
                  onKeyDown={(e) => onChangeRangeFilter(e, true)}
                />
                <span className="currency">{translate(prefix + 'label.multilYearBefore')}</span>
              </div>
              <span className="approximately color-999">{translate('dynamic-control.approximately')}</span>
              <div className="form-control-wrap ml-3">
                <input type="text" className="input-normal input-common2 version2" placeholder="0"
                  value={numberYearBeforeAfterTo}
                  onChange= {(e) => onChangeRangeFilter(e, false)}
                  onKeyUp={(e) => onChangeRangeFilter(e, false)}
                  onKeyDown={(e) => onChangeRangeFilter(e, false)}
                />
                <span className="currency">{translate(prefix + 'label.multilYearAfter')}</span>
              </div>
            </div>
          </>}
        </div>
      </>
    );
  }

  return (
    <>{renderComponent()}</>
  );
});

export default FieldSearchDate
