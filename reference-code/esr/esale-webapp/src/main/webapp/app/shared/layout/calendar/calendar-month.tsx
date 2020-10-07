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

export interface ICalendarMonthProps {
  events: any[];
  date?: Date;
  editable?: boolean;
  styleMonth?: {};
}

const CalendarMonth = (props: ICalendarMonthProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dateListByDay, setDateListByDay] = useState([]);

  const [heightTable, setHeightTable] = useState(0);
  const [widthHeader, setWidthHeader] = useState(0);
  const [heightHeader, setHeightHeader] = useState(0);
  const [widthContent, setWidthContent] = useState(0);
  const tableRef = useRef(null);


  const lang = Storage.session.get('locale', 'ja_jp');
  Locale.locale(lang);

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
      if (tmp[i].endDate) {
        const parsed = dateFnsParse(tmp[i].endDate);
        if (DayPicker.DateUtils.isDate(parsed)) {
          tmp[i].endDate = parsed;
        } else {
          tmp[i].endDate = defaultDate;
        }
      } else {
        tmp[i].endDate = defaultDate;
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
      let curItemShow = listData[i]['maxItemNumber'] ? listData[i]['maxItemNumber'] : curItemList.length;
      const curItemHide = listData[i]['hideItemNumber'] ? listData[i]['hideItemNumber'] : 0;
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
          array[j] = prevItemList[j];
          // if (j >= curItemShow) {
          //   array[j].display = -1;
          // } else {
          //   array[j].display = 1;
          // }
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
          array[emptyIndex] = curItemList[j];
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

  const initDataMonthly = () => {
    let date = null
    if (props.date) {
      date = props.date;
    } else {
      date = new Date();
    }
    const tmp = []
    if (props.events && props.events.length > 0) {
      props.events.forEach( el => {
        if (el.dateListByDate) {
          el.dateListByDate.forEach(e => {
            const dateStr = e.date;
            if (dateStr) {
              const parsed = dateFnsParse(dateStr);
              if (DayPicker.DateUtils.isDate(parsed)) {
                const obj = _.cloneDeep(e);
                obj.date = parsed;
                obj.itemListInDay = sortItemEvent(e.itemListInDay, parsed);
                tmp.push(obj)
              }
            }
          });
        }
      });
    }
    const monthStart = dateFns.startOfMonth(date);
    const monthEnd = dateFns.endOfMonth(monthStart);
    let firstWeekOfDay = dateFns.getDay(monthStart);
    if (firstWeekOfDay === 0) {
      firstWeekOfDay = 7;
    }
    let lastWeekOfDay = dateFns.getDay(dateFns.addDays(monthEnd, -1));
    if (lastWeekOfDay === 0) {
      lastWeekOfDay = 7;
    }
    const prevMonthLastDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0);
    const startDate = dateFns.addDays(prevMonthLastDate, 1 - (firstWeekOfDay - 1));
    const endDate = dateFns.addDays(monthEnd, 7 - lastWeekOfDay - 1);

    let day = startDate
    while (day <= endDate) {
      if( tmp.findIndex( e => compareDateYmd(e.date, day) === 0) < 0) {
        tmp.push({date: day, itemListInDay: [], maxItemNumber: 0, hideItemNumber: 0});
      }
      day = dateFns.addDays(day, 1);
    }
    if (tmp.length > 0) {
      tmp.sort((o1, o2) => {return compareDateYmd(o1.date, o2.date)});
    }
    adjustItemEvent(tmp);
    setSelectedDate(date);
    setDateListByDay(tmp);
  }

  useEffect(() => {
    initDataMonthly();
  }, [props.events, props.date]);

  const getCellData = (date: Date) => {
    let minRowHeight = 150;
    const cellInfo = {minRowHeight: 150, data: {}}
    if (!dateListByDay || dateListByDay.length < 1) {
      return cellInfo;
    }
    const dayIndex = dateListByDay.findIndex( e => compareDateYmd(e.date, date) === 0);
    if (dayIndex >= 0) {
      cellInfo.data = _.cloneDeep(dateListByDay[dayIndex]);
    } else {
      cellInfo.data['itemListInDay'] = [];
    }

    const curr = new Date(date);
    const first = (curr.getDay() === 0 ? 7 : curr.getDay()) - 1;//  curr.getDate() - curr.getDay() + 1;
    const last = 7 - (curr.getDay() === 0 ? 7 : curr.getDay());

    const firstday = dateFns.addDays(curr, 0 - first);
    const lastday = dateFns.addDays(curr, last);
    let maxItemNumberInWeeks;
    const weekData = dateListByDay.filter( e => compareDateYmd(e.date, firstday) >= 0 && compareDateYmd(e.date, lastday) <=0 );
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
    if (maxItemNumberInWeeks > 5) {
      minRowHeight += (maxItemNumberInWeeks - 5) * 20;
    }
    cellInfo.minRowHeight = minRowHeight;

    const fistWeekIndex = dateListByDay.findIndex( e => compareDateYmd(e.date, firstday) === 0);
    const lastWeekIndex = dateListByDay.findIndex( e => compareDateYmd(e.date, lastday) === 0);

    for(let i = 0; i < dateListByDay[dayIndex].itemListInDay.length; i++) {
      if (!dateListByDay[dayIndex].itemListInDay[i].isOverDay) {
        continue;
      }
      if (dayIndex > fistWeekIndex) {
        const idx = dateListByDay[dayIndex - 1].itemListInDay.findIndex( e => e.isOverDay && e.itemId === dateListByDay[dayIndex].itemListInDay[i].itemId)
        if (idx >= 0 && dateListByDay[dayIndex - 1].itemListInDay[idx].display >= 0 && dateListByDay[dayIndex].itemListInDay[i].display > 0) {
          dateListByDay[dayIndex].itemListInDay[i].display = 0;
        }
      }
      let count = dayIndex
      while(count <= lastWeekIndex ) {
        const idx = dateListByDay[count].itemListInDay.findIndex( e => e.isOverDay && e.itemId === dateListByDay[dayIndex].itemListInDay[i].itemId)
        if (idx < 0) {
          break;
        }
        if ( dateListByDay[count].itemListInDay[idx].display < 0) {
          break;
        }
        count++;
      }
      if (count > dayIndex && dateListByDay[dayIndex].itemListInDay[i].display > 0) {
        dateListByDay[dayIndex].itemListInDay[i].display = count - dayIndex;
      }
    }
    cellInfo.data = dateListByDay[dayIndex];
    return cellInfo;
  }

  useEffect(() => {
    if (tableRef && tableRef.current && heightHeader > 0) {
      setHeightTable(tableRef.current.getBoundingClientRect().height);
    }
  }, [heightHeader])

  const onResizeHeader = (width: number, height: number) => {
    if (height > 0 || height !== heightHeader) {
      setHeightHeader(height);
    }
    if (width > 0 || width !== widthHeader) {
      setWidthHeader(width);
    }
  }

  const onResizeContent = (width: number, height: number) => {
    if (width > 0 || width !== widthContent) {
      setWidthContent(width);
    }
  }

  const renderHeader = () => {
    const dayOfWeek = Locale.weekdaysShort();
    return (
      <>
        <span className="day-month-name-normal">{dayOfWeek[1]}</span>
        <span className="day-month-name-normal">{dayOfWeek[2]}</span>
        <span className="day-month-name-normal">{dayOfWeek[3]}</span>
        <span className="day-month-name-normal">{dayOfWeek[4]}</span>
        <span className="day-month-name-normal">{dayOfWeek[5]}</span>
        <span className="day-month-name-sat">{dayOfWeek[6]}</span>
        <span className="day-month-name-sun">{dayOfWeek[0]}</span>
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

  const renderEvent = (event: any, idx: number, maxItem: number) => {
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

  const contentCell = (date: Date, cellInfo: any) => {
    return(
    <>
      {titleCell(date)}
      {cellInfo.data && cellInfo.data.itemListInDay &&
        cellInfo.data.itemListInDay.map( (e, idx) => {
          return renderEvent(e, idx, cellInfo.data.maxItemNumber)
        })
      }
      {cellInfo.data && cellInfo.data.hideItemNumber &&
        <div><a><i className="icon-prev fas fa-angle-right"></i><label>More+</label></a></div>
      }
    </>
    )
  }

  const renderCell = () => {
    const monthStart = dateFns.startOfMonth(selectedDate);
    const monthEnd = dateFns.endOfMonth(monthStart);
    let firstWeekOfDay = dateFns.getDay(monthStart);
    if (firstWeekOfDay === 0) {
      firstWeekOfDay = 7;
    }
    let lastWeekOfDay = dateFns.getDay(dateFns.addDays(monthEnd, -1));
    if (lastWeekOfDay === 0) {
      lastWeekOfDay = 7;
    }
    const prevMonthLastDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0);
    const startDate = dateFns.addDays(prevMonthLastDate, 1 - (firstWeekOfDay - 1));
    const endDate = dateFns.addDays(monthEnd, 7 - lastWeekOfDay - 1);
    const days = [];
    let day = startDate;

    let zIndex = 60;
    while (day <= endDate) {
      const inMonth = !(day < monthStart || day >= monthEnd);
      const styleClass = inMonth ? "day-month" : "day-month day-month--disabled";
      const cellInfo = getCellData(day);
      const rowHeight = `${cellInfo.minRowHeight}px`;
      days.push(
        <div className={styleClass} key={day.getTime()} style={{height: rowHeight, zIndex}}>{contentCell(day, cellInfo)}</div>
      );
      day = dateFns.addDays(day, 1);
      zIndex = zIndex - 1;
    }
    return <>{days}</>;
  }

  const styleHeader = {zIndex: 70, };
  const styleContent = {zIndex: 69, height: `${heightTable - heightHeader}px`}
  const styleCalendarMonthHeader = {}
  const styleCalendarMonthContent = {}
  if (widthContent > 0) {

    let percent1 = 14;
    if (widthHeader > 0) {
      percent1 = ((widthContent / 7) / widthHeader) * 100;
    }
    const percent2 = (1/7) * 100;
    styleCalendarMonthHeader['grid-template-columns'] = `${percent1}% ${percent1}% ${percent1}% ${percent1}% ${percent1}% ${percent1}% ${percent1}%`
    styleCalendarMonthContent['grid-template-columns'] = `${percent2}% ${percent2}% ${percent2}% ${percent2}% ${percent2}% ${percent2}% ${percent2}%`
  }

  return (
    <table ref={tableRef} className="calendarMonth" style={props.styleMonth}>
      <thead>
        <tr>
          <th style={{padding: '0px'}}>
            <div className="calendar-month-container" style={styleHeader}>
              <ReactResizeDetector handleWidth handleHeight onResize={onResizeHeader} >
              <div className="calendar-month" style={styleCalendarMonthHeader}>
                {renderHeader()}
              </div>
              </ReactResizeDetector>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{padding: '0px'}}>
            <div className="calendar-month-container" style={styleContent}>
              <ReactResizeDetector handleWidth onResize={onResizeContent}>
              <div className="calendar-month" style={styleCalendarMonthContent}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                {renderCell()}
              </div>
              </ReactResizeDetector>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default CalendarMonth;
