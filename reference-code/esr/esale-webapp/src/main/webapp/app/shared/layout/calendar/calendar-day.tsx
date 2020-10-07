import React, { useState, useEffect, useRef } from 'react';
import dateFns from "date-fns";
import _ from 'lodash';
import ReactResizeDetector from 'react-resize-detector';
import { Storage, translate } from 'react-jhipster';
import { DateUtils, DayModifiers } from 'react-day-picker';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';
import Locale from 'moment'
import { EventItemDivison } from './constants';

export interface ICalendarDayProps {
  events: any;
  date?: Date;
  editable?: boolean;
  styleDay?: {};
}

const CalendarDay = (props: ICalendarDayProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [heightTable, setHeightTable] = useState(0);
  const [widthHeaderDay, setWidthHeaderDay] = useState(0);
  const [heightHeaderDay, setHeightHeaderDay] = useState(0);
  const [widthContentHour, setWidthContentHour] = useState(0);
  const tableRef = useRef(null)

  const [listDataHour, setListDataHour] = useState([]);
  const [listDataDay, setListDataDay] = useState([]);

  const compareHHmm = (date1: Date, date2: Date) => {
    if (date1.getHours() !== date2.getHours()) {
      return date1.getHours() - date2.getHours();
    }
    if (date1.getMinutes() !== date2.getMinutes()) {
      return date1.getMinutes() - date2.getMinutes();
    }
    return 0;
  }

  const sortItemEvent = (itemListInDay: any[], defaultDate: Date) => {
    const result = [];
    if (!itemListInDay) {
      return result;
    }
    const tmp = _.cloneDeep(itemListInDay);
    for(let i = 0; i < tmp.length; i++) {
      if (tmp[i].startDate) {
        const parsed = dateFnsParse(tmp[i].startDate);
        if (DayPicker.DateUtils.isDate(parsed)) {
          tmp[i].startDate = parsed;
        } else {
          tmp[i].startDate = defaultDate;
        }
      } else {
        tmp[i].startDate = defaultDate;
      }
      if (tmp[i].finishDate) {
        const parsed = dateFnsParse(tmp[i].finishDate);
        if (DayPicker.DateUtils.isDate(parsed)) {
          tmp[i].finishDate = parsed;
        } else {
          tmp[i].finishDate = defaultDate;
        }
      } else {
        tmp[i].finishDate = defaultDate;
      }
    }
    const listMilestone = tmp.filter( e => e.itemType === EventItemDivison.Milestone);
    const listTask = tmp.filter( e => e.itemType === EventItemDivison.Task);
    const listSchedule = tmp.filter( e => e.itemType === EventItemDivison.Schedule);

    result.push(..._.orderBy(listMilestone, ['isFullDay', 'isOverDay', 'startDate'], [false, false, true]));
    result.push(..._.orderBy(listTask, ['isFullDay', 'isOverDay', 'startDate'], [false, false, true]));
    result.push(..._.orderBy(listSchedule, ['isFullDay', 'isOverDay', 'startDate'], [false, false, true]));
    return result;
  }

  const initDataDayly = () => {
    let date = null
    if (props.events.dateByDay) {
      const parsed = dateFnsParse(props.events.dateByDay);
      if (DayPicker.DateUtils.isDate(parsed)) {
        date = parsed;
      }
    }
    if (!date) {
      date = new Date();
    }
    if (date !== selectedDate) {
      setSelectedDate(date);
    }

    if (props.events.itemListInDay && props.events.itemListInDay.length > 0) {
      const itemListInDay = sortItemEvent(props.events.itemListInDay, date);
      const tmpDay = itemListInDay.filter( e => e.isFullDay || e.isOverDay);
      const tmpHour = itemListInDay.filter( e => !e.isFullDay && !e.isOverDay);
      setListDataDay(tmpDay);
      setListDataHour(tmpHour);
    }
  }

  useEffect(() => {
    initDataDayly();
  }, [props.events]);

  useEffect(() => {
    if (tableRef && tableRef.current && tableRef.current !== undefined && heightHeaderDay > 0) {
      setHeightTable(tableRef.current.getBoundingClientRect().height);
    }
  }, [heightHeaderDay])

  const onResizeDayGrid = (width: number, height: number) => {
    if (height > 0 || height !== heightHeaderDay) {
      setHeightHeaderDay(height);
    }
    if (width > 0 || width !== widthHeaderDay) {
      setWidthHeaderDay(width);
    }
  }

  const onResizeHourGrid = (width: number, height: number) => {
    if (width > 0 || width !== widthContentHour) {
      setWidthContentHour(width);
    }
  }

  const renderEventByDay = (event: any, idx: number, maxItem: number) => {
    if (idx >= maxItem) {
      return <></>
    }
    if (!event.isOverDay) {
      return (<div className="event event--overday">{event.itemName}</div>);
    } else {
      return (<div className="event event--normal">{event.itemName}</div>);
    }
  }

  const contentCellDay = (maxItemNumberInDays: number) => {
    return(
    <>
      {listDataDay && listDataDay.length > 0 &&
        listDataDay.map((e, idx) => {
          return renderEventByDay(e, idx, maxItemNumberInDays)
        })
      }
      {props.events['hideItemNumber'] &&
        <div><a><i className="icon-prev fas fa-angle-right"></i><label>More+</label></a></div>
      }
    </>
    )
  }

  const renderAreaDay = () => {
    if (!selectedDate || listDataDay.length < 1) {
      return (
      <>
        <div style={{height: '30px', zIndex : 20}}></div>
        <div className="day-day" style={{height: '30px', zIndex: 20}}></div>
      </>
      );
    }

    let maxItemNumberInDays = 0;
    const curItemHide = props.events['hideItemNumber'] ? props.events['hideItemNumber'] : 0;
    maxItemNumberInDays = listDataDay.length;
    if (props.events['isOverItemNumberInDay']) {
      maxItemNumberInDays = listDataDay.length - curItemHide + (curItemHide > 0 ? 1 : 0);
    }
    const minRowHeight = 30 + 22 * maxItemNumberInDays;
    const days = [];
    days.push(
      <div style={{height: `${minRowHeight}px`, zIndex : 20}}></div>
    )
    days.push(
      <div className="day-day" style={{height: `${minRowHeight}px`, zIndex: 20}}>{contentCellDay(maxItemNumberInDays)}</div>
    );
    return <>{days}</>;
  }

  const contentCellHour = (hourIndex: number) => {
    if (listDataHour.length < 1) {
      return <></>;
    }
    const startHours = [];
    const endHours = [];
    const dataHours = [];
    let numberBefore = 0;
    let numberAfter = 0;
    for(let i = 0; i < listDataHour.length; i++) {
      const start = dateFnsParse(listDataHour[i].startDate);
      const end = dateFnsParse(listDataHour[i].finishDate);
      if (!DayPicker.DateUtils.isDate(start) || !DayPicker.DateUtils.isDate(end)) {
        continue;
      }
      if (start.getHours() === hourIndex) {
        startHours.push(start);
        endHours.push(end);
        dataHours.push(listDataHour[i]);
      }
    }
    if (startHours.length < 1 || endHours.length < 1) {
      return <></>;
    }
    const minStart = _.minBy(startHours);
    const maxEnd = _.maxBy(endHours);
    for(let i = 0; i < listDataHour.length; i++) {
      const start = dateFnsParse(listDataHour[i].startDate);
      const end = dateFnsParse(listDataHour[i].finishDate);
      if (!DayPicker.DateUtils.isDate(start) || !DayPicker.DateUtils.isDate(end)) {
        continue;
      }
      if (start.getHours() < hourIndex && compareHHmm(end, minStart) > 0) {
        numberBefore = numberBefore + 1;
      }
      if (start.getHours() > hourIndex && compareHHmm(start, maxEnd) < 0) {
        numberAfter = numberAfter + 1;
      }
    }
    const hours = [];
    const count = numberAfter + numberBefore + startHours.length;
    for(let i = 0; i < startHours.length; i++) {
      const width = `${(1 / count) * 100}%`;
      const height = `${(Math.abs(endHours[i] - startHours[i]) / 36e5) * 100}%`;
      const left = `${((numberBefore + i) / count) * 100}%`;
      const top = `${(startHours[i].getMinutes() / 60) * 100}%`;
      hours.push(
        <div className="event event--normal" style={{width, height, left, top, position: "absolute"}}>
          {`${dataHours[i].itemName}: ${dateFnsFormat(dataHours[i].startDate, "HH:mm")} - ${dateFnsFormat(dataHours[i].finishDate, "HH:mm")}`}
        </div>
      );
    }
    return <>{hours}</>;
  }

  const renderAreaHour = () => {
    const days = [];
    let zIndex = 170;
    for (let i = 0; i < 24; i++) {
      days.push(
        <div className='day-day-hour' key={24 + i}>
          {i > 0 && <span className='day-hour-title'>{`${i}:00`}</span>}
          {i < 23 && <div className='day-hour-first'></div>}
        </div>
      );
      days.push(
          <div className='day-day-hour' key={i} style={{zIndex}}>{contentCellHour(i)}</div>
      );
      zIndex = zIndex - 1
    }
    return <>{days}</>;
  }

  const renderLineToday = (leftHourFirst: number) => {
    if (listDataHour.length < 1 || !selectedDate) {
      return <></>;
    }
    const currentDate = new Date();
    const isToDay = currentDate.getFullYear() === selectedDate.getFullYear()
                      && currentDate.getMonth() === selectedDate.getMonth()
                      && currentDate.getDate() === selectedDate.getDate();
    if (!isToDay) {
      return <></>;
    }
    const left = `${leftHourFirst}px`;
    const top = `${30 * (currentDate.getHours() + (currentDate.getMinutes() / 60) - 24) - 4}px`;
    return (
      <div style={{width: `${widthContentHour - leftHourFirst - 2}px`, top, left}} className="line-today">
        <span className="dot" />
        <span className="line" />
      </div>
    )
  }

  const styleHeader = {zIndex: 70, };
  const styleContent = {zIndex: 69, height: `${heightTable - heightHeaderDay}px`}
  const styleCalendarDayDay = {}
  const styleCalendarDayHour = {}
  const firstWidth = 50;
  if (widthContentHour > 0) {
    let percent1 = 96;
    if (widthHeaderDay > 0) {
      percent1 = ((widthContentHour - firstWidth) / widthHeaderDay) * 100;
    }
    const percent2 = ((widthContentHour - firstWidth) / widthContentHour) * 100;
    styleCalendarDayDay['grid-template-columns'] = `${firstWidth}px ${percent1}%`
    styleCalendarDayHour['grid-template-columns'] = `${firstWidth}px ${percent2}%`
  }

  return (
    <table ref={tableRef} className="calendarDay" style={props.styleDay}>
      <thead>
        <tr>
          <th style={{padding: '0px'}}>
            <div className="calendar-day-container" style={styleHeader}>
              <ReactResizeDetector handleWidth handleHeight onResize={onResizeDayGrid} >
              <div className="calendar-day" style={styleCalendarDayDay}>
                <span></span>
                <span></span>
                {renderAreaDay()}
              </div>
              </ReactResizeDetector>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{padding: '0px'}}>
            <div className="calendar-day-container" style={styleContent}>
              <ReactResizeDetector handleWidth onResize={onResizeHourGrid}>
              <div className="calendar-day" style={styleCalendarDayHour}>
                <span></span>
                {renderAreaHour()}
              </div>
              </ReactResizeDetector>
              {renderLineToday(firstWidth)}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default CalendarDay;
