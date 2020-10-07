import React, { useState, useEffect, useRef, HtmlHTMLAttributes } from 'react';
import _ from 'lodash';
import dateFns from "date-fns";
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

export interface ICalendarWeekProps {
  events: any[];
  date?: Date;
  editable?: boolean;
  styleWeek?: {};
}

const CalendarWeek = (props: ICalendarWeekProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [heightTable, setHeightTable] = useState(0);
  const [widthHeaderDay, setWidthHeaderDay] = useState(0);
  const [heightHeaderDay, setHeightHeaderDay] = useState(0);
  const [widthContentHour, setWidthContentHour] = useState(0);
  const tableRef = useRef(null)

  const [listDataHour, setListDataHour] = useState([]);
  const [listDataDay, setListDataDay] = useState([]);

  const compareDateYmd = (date1: Date, date2: Date) => {
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

  const adjustItemEvent = (listData: any[]) => {
    for(let i = 0; i < listData.length; i++) {
      const curItemList = _.cloneDeep(listData[i]['itemListInDay']);
      const curItemHide = listData[i]['hideItemNumber'] ? listData[i]['hideItemNumber'] : 0;
      let curItemShow = curItemList.length;
      if (listData[i]['isOverItemNumberInDay']) {
        curItemShow = curItemList.length - curItemHide;
      }
      listData[i]['maxItemNumber'] = curItemShow;
      listData[i]['hideItemNumber'] = curItemHide;

      if (i === 0 || listData[i].date.getDay() === 1 || (i > 0 && listData[i-1]['itemListInDay'].length === 0)) {
        for (let j = 0; j < listData[i]['itemListInDay'].length; j++) {
          if (listData[i]['itemListInDay'][j].isOverDay) {
            listData[i]['itemListInDay'][j].display = j < curItemShow ? 1 : -1;
          }
        }
        continue;
      }
      const prevItemList = _.cloneDeep(listData[i-1]['itemListInDay']);
      const maxLength = prevItemList.length > curItemList.length ? prevItemList.length : curItemList.length;
      const array = new Array(maxLength);
      array.fill({});
      for (let j = 0; j < prevItemList.length; j++) {
        if (j < prevItemList.length && prevItemList[j].isOverDay && curItemList.filter(e => e.itemId === prevItemList[j].itemId).length > 0) {
          array[j] = _.cloneDeep(prevItemList[j]);
          // if (j >= curItemShow) {
          //   array[j].display = -1;
          // } else {
          //   array[j].display = 1;
          // }
          // array[j].display = 1;
          continue;
        }
      }
      for (let j = 0; j < curItemList.length; j++) {
        const existIndex = array.findIndex(e => e.itemId === curItemList[j].itemId);
        if (existIndex >= 0) {
          continue;
        }
        const emptyIndex = array.findIndex( e => e.itemId === null || e.itemId === undefined);
        if (emptyIndex >= 0) {
          array[emptyIndex] = _.cloneDeep(curItemList[j]);
          // if (curItemList[j].isOverDay) {
          //   array[j].display = 1;
          // }
        }
      }
      for( let j = maxLength - 1; j >= 0; j--) {
        if (array[j]['itemId'] !== undefined) {
          break;
        }
        array.splice(j, 1);
      }
      const arrNotEmpty = array.filter( e => e.itemId);
      if (arrNotEmpty.length >= curItemShow && curItemShow > 0) {
        curItemShow = array.findIndex( e => e.itemId === arrNotEmpty[curItemShow - 1].itemId) + 1;
      }
      let count = 0;
      for( let j = 0; j < array.length; j++) {
        if (array[j]['itemId'] !== undefined) {
          count++;
        }
        if (array[j].isOverDay) {
          array[j].display = count > curItemShow ? - 1 : 1;
        }
      }
      listData[i]['maxItemNumber'] = curItemShow;
      listData[i]['itemListInDay'] = array;
    }
  }

  const initDataWeekly = () => {
    let date = null
    if (props.date) {
      date = props.date;
    } else {
      date = new Date();
    }
    if (date !== selectedDate) {
      setSelectedDate(date);
    }
    const tmpDay = []
    const tmpHour = []
    if (props.events && props.events.length > 0) {
      props.events.forEach( el => {
        const dateStr = el.dateByDay;
        if (dateStr) {
          const parsed = dateFnsParse(dateStr);
          if (DayPicker.DateUtils.isDate(parsed)) {
            const itemListInDay = sortItemEvent(el.itemListInDay, parsed);
            const itemDay = itemListInDay.filter( e => e.isFullDay || e.isOverDay);
            const itemHour = itemListInDay.filter( e => !e.isFullDay && !e.isOverDay);
            const objDay = _.cloneDeep(el);
            objDay.date = parsed;
            objDay.itemListInDay = itemDay;
            tmpDay.push(objDay);
            const objHour = _.cloneDeep(el);
            objHour.date = parsed;
            objHour.itemListInDay = itemHour;
            tmpHour.push(objHour);
          }
        }
      });
    }
    let currentDoW = dateFns.getDay(date);
    if (currentDoW === 0) {
      currentDoW = 7;
    }
    const startDate = dateFns.addDays(date, 0 - (currentDoW - 1));
    const endDate = dateFns.addDays(date, 7 - currentDoW);

    let day = startDate
    while (day <= endDate) {
      if( tmpDay.findIndex( e => compareDateYmd(e.date, day) === 0) < 0) {
        tmpDay.push({date: day, itemListInDay: [], isOverItemNumberInDay: false, hideItemNumber: 0});
      }
      if( tmpHour.findIndex( e => compareDateYmd(e.date, day) === 0) < 0) {
        tmpHour.push({date: day, itemListInDay: [], isOverItemNumberInDay: false, hideItemNumber: 0});
      }
      day = dateFns.addDays(day, 1);
    }
    if (tmpDay.length > 0) {
      tmpDay.sort((o1, o2) => {return compareDateYmd(o1.date, o2.date)});
    }
    if (tmpHour.length > 0) {
      tmpHour.sort((o1, o2) => {return compareDateYmd(o1.date, o2.date)});
    }
    adjustItemEvent(tmpDay);
    setListDataDay(tmpDay);
    setListDataHour(tmpHour);
  }

  useEffect(() => {
    initDataWeekly();
  }, [props.events, props.date]);

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

  const getCellDataByDay = (date: Date) => {
    const cellInfo = {minRowHeight: 30, data: {}}
    if (!listDataDay || listDataDay.length < 1) {
      return cellInfo;
    }
    const dayIndex = listDataDay.findIndex( e => compareDateYmd(e.date, date) === 0);
    if (dayIndex >= 0) {
      // cellInfo.data = _.cloneDeep(listDataDay[dayIndex]);
    } else {
      cellInfo.data['itemListInDay'] = [];
    }

    const curr = new Date(date);
    const first = (curr.getDay() === 0 ? 7 : curr.getDay()) - 1;//  curr.getDate() - curr.getDay() + 1;
    const last = 7 - (curr.getDay() === 0 ? 7 : curr.getDay());

    const firstday = dateFns.addDays(curr, 0 - first);
    const lastday = dateFns.addDays(curr, last);

    const fistWeekIndex = listDataDay.findIndex( e => compareDateYmd(e.date, firstday) === 0);
    const lastWeekIndex = listDataDay.findIndex( e => compareDateYmd(e.date, lastday) === 0);

    for(let i = 0; i < listDataDay[dayIndex].itemListInDay.length; i++) {
      if (!listDataDay[dayIndex].itemListInDay[i].isOverDay) {
        continue;
      }
      // let existPrev = false;
      if (dayIndex > fistWeekIndex) {
        const idx = listDataDay[dayIndex - 1].itemListInDay.findIndex( e => e.isOverDay && e.itemId === listDataDay[dayIndex].itemListInDay[i].itemId)
        if (idx >= 0 && listDataDay[dayIndex - 1].itemListInDay[idx].display >= 0 && listDataDay[dayIndex].itemListInDay[i].display > 0) {
          listDataDay[dayIndex].itemListInDay[i].display = 0;
        }
      }
      let count = dayIndex
      while(count <= lastWeekIndex ) {
        const idx = listDataDay[count].itemListInDay.findIndex( e => e.isOverDay && e.itemId === listDataDay[dayIndex].itemListInDay[i].itemId)
        if (idx < 0) {
          break;
        }
        if ( listDataDay[count].itemListInDay[idx].display < 0) {
          break;
        }
        count++;
      }
      if (count > dayIndex && listDataDay[dayIndex].itemListInDay[i].display > 0) {
        listDataDay[dayIndex].itemListInDay[i].display = count - dayIndex;
      }
    }
    cellInfo.data = _.cloneDeep(listDataDay[dayIndex]);// listDataDay[dayIndex];
    return cellInfo;
  }

  const renderHeader = () => {
    const dayOfWeek = Locale.weekdaysShort();
    return (
      <>
        <span className=""></span>
        <span className="day-week-name-normal">{dayOfWeek[1]}</span>
        <span className="day-week-name-normal">{dayOfWeek[2]}</span>
        <span className="day-week-name-normal">{dayOfWeek[3]}</span>
        <span className="day-week-name-normal">{dayOfWeek[4]}</span>
        <span className="day-week-name-normal">{dayOfWeek[5]}</span>
        <span className="day-week-name-sat">{dayOfWeek[6]}</span>
        <span className="day-week-name-sun">{dayOfWeek[0]}</span>
      </>
    );
  }

  const titleCell = (date: Date) => {
    const formattedDate = dateFns.format(date, "D");
    const dow = dateFns.getDay(date);
    let fontColor = null;
    if (dow === 0) {
      fontColor = "red";
    } else if(dow === 6) {
      fontColor = "#fa607e"
    }
    const now = new Date();
    const isToday = now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && now.getDate() === date.getDate();
    const dayStyle = !isToday ? "" : (date.getDay() === 0 ? "today-sun" : "today-normal");
    return (
      <div className="content-header-cell">
        <table className="table-cal-cell">
          <thead>
            <tr>
              <th />
              <th colSpan={2} style={{color: fontColor}}><div className={dayStyle}>{formattedDate}</div></th>
              <th style={{color: fontColor}}>すべて</th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }

  const renderEventByDay = (event: any, idx: number, maxItem: number) => {
    if (idx >= maxItem) {
      return <></>
    }
    if (!event.isOverDay) {
      if (!event.itemName || event.itemName.length === 0) {
        return <div className="event event--empty">&nbsp;</div>
      }
      return (
        <div className="event event--normal">{event.itemName}</div>
      );
    } else if (event.display === undefined || event.display < 0){
      return <div className="event event--empty">&nbsp;</div>
    } else if (event.display === 0) {
      return <div className="event event--empty">&nbsp;</div>
    } else {
      const width = `${event.display * 100 }%`
      return (
        <div className="event event--overday" style={{width}}>{event.itemName}</div>
      );
    }
  }

  const contentCellDay = (date: Date, cellInfo: any) => {
    return(
    <>
      {titleCell(date)}
      {cellInfo.data && cellInfo.data.itemListInDay &&
        cellInfo.data.itemListInDay.map( (e, idx) => {
          return renderEventByDay(e, idx, cellInfo.data.maxItemNumber)
        })
      }
      {cellInfo.data && cellInfo.data.hideItemNumber &&
        <div><a><i className="icon-prev fas fa-angle-right"></i><label>More+</label></a></div>
      }
    </>
    )
  }

  const renderLineToday = (widthCellContent: number, leftHourFirst: number) => {
    if (listDataHour.length < 1) {
      return <></>;
    }
    const currentDate = new Date();
    const todayIndex = listDataHour.findIndex( e => compareDateYmd(currentDate, e.date) === 0);
    if (todayIndex < 0) {
      return <></>;
    }
    const left = `${leftHourFirst + widthCellContent * todayIndex}px`;
    const top = `${30 * (currentDate.getHours() + (currentDate.getMinutes() / 60) - 24) - 4}px`;
    return (
      <div style={{width: `${widthCellContent - 2}px`, top, left}} className="line-today">
        <span className="dot" />
        <span className="line" />
      </div>
    )
  }

  const contentCellHour = (dayIndex: number, hourIndex: number) => {
    if (listDataHour.length <= dayIndex) {
      return <></>;
    }
    const cellInfo = listDataHour[dayIndex];
    if (!cellInfo.itemListInDay || cellInfo.itemListInDay.length < 1) {
      return <></>;
    }
    const startHours = [];
    const endHours = [];
    const dataHours = [];
    let numberBefore = 0;
    let numberAfter = 0;
    for(let i = 0; i < cellInfo.itemListInDay.length; i++) {
      const start = dateFnsParse(cellInfo.itemListInDay[i].startDate);
      const end = dateFnsParse(cellInfo.itemListInDay[i].finishDate);
      if (!DayPicker.DateUtils.isDate(start) || !DayPicker.DateUtils.isDate(end)) {
        continue;
      }
      if (start.getHours() === hourIndex) {
        startHours.push(start);
        endHours.push(end);
        dataHours.push(cellInfo.itemListInDay[i]);
      }
    }
    if (startHours.length < 1 || endHours.length < 1) {
      return <></>;
    }
    const minStart = _.minBy(startHours);
    const maxEnd = _.maxBy(endHours);
    for(let i = 0; i < cellInfo.itemListInDay.length; i++) {
      const start = dateFnsParse(cellInfo.itemListInDay[i].startDate);
      const end = dateFnsParse(cellInfo.itemListInDay[i].finishDate);
      if (!DayPicker.DateUtils.isDate(start) || !DayPicker.DateUtils.isDate(end)) {
        continue;
      }
      if (start.getHours() < hourIndex && end > minStart) {
        numberBefore = numberBefore + 1;
      }
      if (start.getHours() > hourIndex && start < maxEnd) {
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

  const renderAreaDay = () => {
    if (!selectedDate) {
      return <></>
    }

    let currentDoW = dateFns.getDay(selectedDate);
    if (currentDoW === 0) {
      currentDoW = 7;
    }
    const startDate = dateFns.addDays(selectedDate, 0 - (currentDoW - 1));
    const endDate = dateFns.addDays(selectedDate, 7 - currentDoW);

    let maxItemNumberInWeeks = 0;
    const weekData = listDataDay.filter( e => compareDateYmd(e.date, startDate) >= 0 && compareDateYmd(e.date, endDate) <=0 );
    weekData.forEach( e => {
      let maxItemNumber = 0;
      if (e.maxItemNumber) {
        maxItemNumber = e.maxItemNumber;
      } else if (e.itemListInDay) {
        maxItemNumber = e.itemListInDay.length;
      }
      if (e.hideItemNumber) {
        maxItemNumber += 1;
      }
      if (maxItemNumberInWeeks < maxItemNumber) {
        maxItemNumberInWeeks = maxItemNumber;
      }
    })
    const minRowHeight = 30 + 22 * maxItemNumberInWeeks;

    const days = [];
    let day = startDate;
    let zIndex = 20;
    days.push(
      <div style={{height: `${minRowHeight}px`, zIndex}}></div>
    )
    while (day <= endDate) {
      const inMonth = day.getMonth() === selectedDate.getMonth()
      const styleClass = inMonth ? "day-week" : "day-week day--disabled";

      days.push(
        <div className={styleClass} key={day.getTime()} style={{height: `${minRowHeight}px`, zIndex}}>{contentCellDay(day, getCellDataByDay(day))}</div>
      );
      day = dateFns.addDays(day, 1);
      zIndex = zIndex - 1;
    }
    return <>{days}</>;
  }

  const renderAreaHour = () => {
    const days = [];
    let zIndex = 170;
    for (let i = 0; i < 24; i++) {
      for(let j = 0; j < 7; j++) {
        if (j === 0) {
          days.push(
            <div className='day-hour' key={170 + i}>
            {i > 0 && <span className='day-hour-title'>{`${i}:00`}</span>}
            {i < 23 && <div className='day-hour-first'></div>}
            </div>
          );
        }
        days.push(
          <div className='day-hour' key={i * 7 + j} style={{zIndex}}>{contentCellHour(j, i)}</div>
        );
        zIndex = zIndex - 1
      }
    }
    return <>{days}</>;
  }

  const styleHeader = {zIndex: 70, };
  const styleContent = {zIndex: 69, height: `${heightTable - heightHeaderDay}px`}
  const styleCalendarWeekDay = {}
  const styleCalendarWeekHour = {}
  let widthCellContent = 0;
  let firstWidth = 50;
  if (widthContentHour > 0) {
    while((widthContentHour - firstWidth) % 7 !== 0) {
      firstWidth = firstWidth + 1;
    }
    let percent1 = 14;
    if (widthHeaderDay > 0) {
      percent1 = ((widthContentHour - firstWidth) / (7 * widthHeaderDay) * 100);
    }
    const percent2 = ((widthContentHour - firstWidth) / (7 * widthContentHour) * 100);
    widthCellContent = Math.floor((widthContentHour - firstWidth) / 7) + 1;
    styleCalendarWeekDay['grid-template-columns'] = `${firstWidth}px ${percent1}% ${percent1}% ${percent1}% ${percent1}% ${percent1}% ${percent1}% ${percent1}%`
    styleCalendarWeekHour['grid-template-columns'] = `${firstWidth}px ${percent2}% ${percent2}% ${percent2}% ${percent2}% ${percent2}% ${percent2}% ${percent2}%`
  }
  return (
    <table ref={tableRef} className="calendarWeek" style={props.styleWeek}>
      <thead>
        <tr>
          <th style={{padding: '0px'}}>
            <div className="calendar-week-container" style={styleHeader}>
              <ReactResizeDetector handleWidth handleHeight onResize={onResizeDayGrid} >
              <div className="calendar-week" style={styleCalendarWeekDay}>
                {renderHeader()}
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
            <div className="calendar-week-container" style={styleContent}>
              <ReactResizeDetector handleWidth onResize={onResizeHourGrid}>
              <div className="calendar-week" style={styleCalendarWeekHour}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                  {renderAreaHour()}
              </div>
              </ReactResizeDetector>
              {renderLineToday(widthCellContent, firstWidth)}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default CalendarWeek;
