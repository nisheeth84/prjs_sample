import React, { useState, useEffect } from 'react'
import { translate, Storage } from 'react-jhipster';
import MomentLocaleUtils from 'react-day-picker/moment';
import moment from 'moment'
import DayPicker, { DateUtils } from "react-day-picker"
import 'react-day-picker/lib/style.css';
import './custom-calendar-mini.css';
import { CalenderViewMonthCommon } from '../grid/common';

interface ICalendarControlSiteBar {
  monthShow: Date,
  onSelectedDate: (date: Date) => void
}
const renderNavHeader = (onChangeMonth: any) => {
  return (
    <div className="DayPicker-NavCustom" role="heading">
      <div className="">
        <span tabIndex={0} role="button" aria-label="Previous Month" className="DayPicker-NavButton DayPicker-NavButton--prev" onClick={() => { onChangeMonth(-1) }} />
        <span tabIndex={0} role="button" aria-label="Next Month" className="DayPicker-NavButton DayPicker-NavButton--next" onClick={() => { onChangeMonth(1) }} />
      </div>
    </div>);
}
const MiniCalendar = (props: ICalendarControlSiteBar) => {
  const [monthStateShow, setMonthStateShow] = useState(CalenderViewMonthCommon.nowDate().toDate())

  const onChangeMonth = (amount: number) => {
    setMonthStateShow(moment(monthStateShow).add(amount, "months").toDate())
  }
  const onDayClick = (day: Date) => {
    setMonthStateShow(day)
    props.onSelectedDate(day)
  }

  const lang = Storage.session.get('locale', 'ja_jp');

  // useEffect(()=> {
  //     onDayClick(props.monthShow)
  // },[props.monthShow])

  useEffect(() => {
    props.onSelectedDate(monthStateShow)
  }, [monthStateShow])

  return (
    <DayPicker
      className="DayPicker-font-custom"
      firstDayOfWeek={1}
      month={monthStateShow}
      showOutsideDays={true}
      selectedDays={monthStateShow}
      showWeekDays
      reverseMonths={true}
      captionElement={({ classNames, date, localeUtils, ...p }) => {
        const activeMonth = {
          year: moment(date).format('YYYY'),
          month: moment(date).format('M')
        };

        return (
          <div className="DayPicker-Caption-custom calendar-mini">
            {translate('calendars.miniCalendar.formatActiveMonth', activeMonth)}
          </div>)
      }}
      navbarElement={(month) => {
        return renderNavHeader(onChangeMonth)
      }}
      locale={lang}
      localeUtils={MomentLocaleUtils}
      onDayClick={(day) => onDayClick(day)}
    />
  )
}
export default MiniCalendar;