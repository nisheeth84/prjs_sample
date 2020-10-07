import React, { useState, useEffect, useRef } from 'react';
import dateFns from "date-fns";
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import { Storage, translate } from 'react-jhipster';
import { DateUtils, DayModifiers } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import DayPicker from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';
import Locale from 'moment'
import { EventItemDivison } from './constants';
import { width } from '@fortawesome/free-solid-svg-icons/faSort';

export interface ICalendarListProps {
  events: any[];
  date?: Date;
  editable?: boolean;
  styleList?: {};
}

const CalendarList = (props: ICalendarListProps) => {
  const [listEventDate, setListEventDate] = useState([]);

  useEffect (() => {
    setListEventDate(props.events)
  }, [props.events])

  const lang = Storage.session.get('locale', 'ja_jp');
  Locale.locale(lang);

  const compareHHmm = (date1: Date, date2: Date) => {
    if (date1.getHours() !== date2.getHours()) {
      return date1.getHours() - date2.getHours();
    }
    if (date1.getMinutes() !== date2.getMinutes()) {
      return date1.getMinutes() - date2.getMinutes();
    }
    return 0;
  }

  const renderHeaderDate = (dataDate: any) => {
    const now = new Date();
    const date = dateFnsParse(dataDate.date);
    const isHoliday = date.getDay() === 0 || date.getDay() === 6 || dataDate.isHoliday;
    const isToday = date.getFullYear() === now.getFullYear() &&
                    date.getMonth() === now.getMonth() &&
                    date.getDate() === now.getDate();
    const dayOfWeek = Locale.weekdaysShort();

    return (
      <div>
        <div className="calendar-list-header-date">
          <span className={`calendar-list-header-date-day-${isToday ? 'today' : (isHoliday ? 'holiday' : 'normal')}`}>
            {DayPicker.DateUtils.isDate(date) ? date.getDate() : ""}
          </span>
        </div>
        <div className="calendar-list-header-info">
          <ul>
            <li>
              {dateFns.format(date, "M 月 , ")}
              <label style={{color: isHoliday ? 'red' : ''}}>{dayOfWeek[date.getDay()]}</label>
            </li>
            <li>
              {dataDate.isHoliday && <label style={{color: 'red'}}>{dataDate.holidayName}</label>}
              {dataDate.perpetualCalendar && <label>{` ${dataDate.perpetualCalendar}`}</label>}
            </li>
          </ul>
        </div>
      </div>
    )
  }

  const renderContentDate = (dataDate) => {
    const now = new Date();
    const date = dateFnsParse(dataDate.date);
    const isToday = date.getFullYear() === now.getFullYear() &&
                    date.getMonth() === now.getMonth() &&
                    date.getDate() === now.getDate();
    const days = [];
    const itemList = _.orderBy( dataDate.itemList, ['startDate'], [true]);
    let indexCurrent = -1;
    itemList.forEach( (e, idx) => {
      const start = dateFnsParse(e.startDate);
      const end = dateFnsParse(e.finishDate);
      if (compareHHmm(end, now) < 0) {
        indexCurrent = idx;
      }
      days.push(
        <div className="event event--normal">
          {`${e.itemName}: ${dateFnsFormat(start, "HH:mm")} - ${dateFnsFormat(end, "HH:mm")}`}
        </div>
      );
    });
    if (isToday) {
      const top = indexCurrent < 0 ? Math.floor(2 * now.getHours()) : null;
      const lineToday = (
        <div className="line-today" style={{top}}>
          <span className="dot" />
          <span className="line" />
        </div>);
      if (indexCurrent < 0) {
        days.push(lineToday);
      } else {
        days.splice(indexCurrent, 0, lineToday)
      }
    }
    return <>{days}</>
  }

  return (
    <div style={props.styleList} className="calendar-list">
      <table>
        <tbody>
          {listEventDate.map((e, idx) =>
          <tr key={idx}>
            <td>{renderHeaderDate(e)}</td>
            <td>{renderContentDate(e)}</td>
          </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default CalendarList;
