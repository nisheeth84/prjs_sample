import moment from 'moment';
import _ from 'lodash';
import { DataOfResource, DataOfSchedule, CalenderViewMonthCommon } from '../common';
import { DragSourceMonitor, XYCoord } from 'react-dnd';
import { DrapDropInMonth } from './grid-drap-drop-month';
import { isNumber } from 'util';

export type GridDrapDropInHourType = {
  indexArray: number;
  indexDate: number; // index of Date
  hour: number;
  minute: number; // (hour * 60 + minute)
  date: moment.Moment;
  height: number;
  width: number;
  x: number;
  y: number;
  refTd: HTMLElement;
  itemDrag?: DataOfSchedule | DataOfResource;
};

type ScrollInfoType = {
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
  scrollHeight: number;
};
type Direction =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft';

// const ELEMENT_NODE = 1;
const TOTAL_MINUTE_OF_DATE = 24 * 60;
const FIFTEEN_MINUTES = 15;

/**
 * Manage drag and drop in month
 */
export class DrapDropInHour {
  // root ref
  private static _tblRoot: GridDrapDropInHourType = null;
  // array td of table
  private static _aryTdRef: GridDrapDropInHourType[] = [];
  private static _objTdDateRef = {};
  private static _objTdIndexRef = {};

  // td when onclick to start drag
  private static _clickOnTdIndex: GridDrapDropInHourType = null;
  private static _clickXy: XYCoord = null;

  // when click schedule to start drag
  private static _startItemClickIndex: GridDrapDropInHourType = null;
  private static _endItemClickIndex: GridDrapDropInHourType = null;
  private static _offsetStartEndOfItem = 0;

  // index of item
  private static _startItemViewIndex: GridDrapDropInHourType = null;
  private static _endItemViewIndex: GridDrapDropInHourType = null;

  private static _isDragging = false;

  // first of view
  private static _startDateInit: moment.Moment = null;
  private static _tblRefInit = null;
  private static _initialized = false;
  private static _numTd = 7;

  // item data
  private static _itemDrag: DataOfSchedule | DataOfResource = null;

  private static resetData = () => {
    DrapDropInHour._aryTdRef = [];
    DrapDropInHour._objTdDateRef = {};
    DrapDropInHour._clickOnTdIndex = null;
    DrapDropInHour._startItemClickIndex = null;
    DrapDropInHour._endItemClickIndex = null;
    DrapDropInHour._isDragging = false;
  };

  public static setStartDateMonth = (date: moment.Moment) => {
    DrapDropInHour._startDateInit = date;
  };

  public static setNumTd = (numTd: number) => {
    DrapDropInHour._numTd = numTd;
  };

  public static setTblRefMonth = (tblRefInit: any) => {
    DrapDropInHour._tblRefInit = tblRefInit;
  };

  public static reinitialized = () => {
    DrapDropInHour._initialized = false;
    DrapDropInHour.initWeek();
  };

  public static isDragging = () => {
    return DrapDropInHour._isDragging;
  };

  /**
   * Convert date to YYYY-MM-DD-HH-mm format
   */
  private static dateToIndex = (s: moment.Moment) => {
    const m = parseInt('' + s.minute() / 15, 10);
    return s.format('YYYY-MM-DD-HH') + '-' + m * 15;
  };

  /**
   * Get scroll info of root div
   * @returns ScrollInfoType
   */
  public static getRootScrollInfo = (): ScrollInfoType => {
    const ref: HTMLElement = DrapDropInHour._tblRefInit && DrapDropInHour._tblRefInit.current;
    return {
      scrollLeft: ref.scrollLeft,
      scrollTop: ref.scrollTop,
      scrollWidth: ref.scrollWidth,
      scrollHeight: ref.scrollHeight
    };
  };

  /**
   * Get XY info of root div
   * @returns DOMRect
   */
  public static getRootXY = (): DOMRect => {
    const ref: HTMLElement = DrapDropInHour._tblRefInit && DrapDropInHour._tblRefInit.current;
    return DrapDropInMonth.getNodeClientOffset(ref);
  };

  /**
   * Convert clientX, ClientY to pageX, PageY
   * @param pos
   * @returns {x: pos.x + scrollInfo.scrollLeft, y: pos.y + scrollInfo.scrollTop}
   */
  public static convertClient2PageXY(pos: XYCoord): XYCoord {
    const rootClientXY = DrapDropInHour.getRootXY();
    const scrollInfo: ScrollInfoType = DrapDropInHour.getRootScrollInfo();
    return {
      x: pos.x + scrollInfo.scrollLeft - rootClientXY.x,
      y: pos.y + scrollInfo.scrollTop - rootClientXY.y
    };
  }

  /**
   * Convert to minute start index 0 of week
   * @param a: object GridDrapDropInHourType or IndexDate
   */
  private static convertPointToMinuteFromFirstWeek = (
    a: number | GridDrapDropInHourType,
    hour?: number,
    minute?: number
  ): number => {
    if (isNumber(a)) {
      return a * TOTAL_MINUTE_OF_DATE + hour * 60 + minute;
    }
    return a.indexDate * TOTAL_MINUTE_OF_DATE + a.hour * 60 + a.minute;
    // return a.indexDate * TOTAL_MINUTE_OF_DATE + a.minute;
  };

  private static convertMinuteToPointFromFirstWeek = (m: number) => {
    const indexDate = parseInt('' + m / TOTAL_MINUTE_OF_DATE, 10);
    const hour = parseInt('' + (m - indexDate * TOTAL_MINUTE_OF_DATE) / 60, 10);
    const minute = m - indexDate * TOTAL_MINUTE_OF_DATE - hour * 60;
    const indexMinute = parseInt('' + minute / 15, 10) * 15;
    const dropRef: GridDrapDropInHourType =
      DrapDropInHour._objTdIndexRef[indexDate][hour][indexMinute];
    if (!dropRef) return null;
    // console.log('convertMinuteToPointFromFirstWeek hour', hour, 'minute', minute)
    return { ...dropRef, minute };
  };

  /**
   * Find td in week by Date
   */
  public static findTdByDate = (date: moment.Moment): GridDrapDropInHourType => {
    const index = DrapDropInHour.dateToIndex(date);
    if (!DrapDropInHour._objTdDateRef[index]) return null;
    return { ...DrapDropInHour._objTdDateRef[index], minute: date.minute() };
  };

  /**
   * Find td in month by XYCoord
   */
  public static findTdByXy = (pos: XYCoord): GridDrapDropInHourType => {
    const numberSubTd = 4;
    // if outOff
    const minX = DrapDropInHour._aryTdRef[0].x,
      minY = DrapDropInHour._aryTdRef[0].y;
    const maxX =
        DrapDropInHour._aryTdRef[DrapDropInHour._aryTdRef.length - 1].x +
        DrapDropInHour._aryTdRef[DrapDropInHour._aryTdRef.length - 1].width,
      maxY =
        DrapDropInHour._aryTdRef[DrapDropInHour._aryTdRef.length - 1].y +
        DrapDropInHour._aryTdRef[DrapDropInHour._aryTdRef.length - 1].height;

    const xOutOffLeft = pos.x < minX;
    const xOutOffRight = pos.x > maxX;
    const yOutOffTop = pos.y < minY;
    const yOutOffBottom = pos.y > maxY;
    // console.log("findTdByXy Min(", minX, minY, '), Max(', maxX, maxY, '), pos(', pos.x, pos.y, ')' )

    const convertMinute = (dropRef: GridDrapDropInHourType, posCheck: XYCoord) => {
      const offsetHeight = Math.abs(posCheck.y - dropRef.y - 1);
      const minute = parseInt('' + (15 * offsetHeight) / dropRef.height, 10);

      return { ...dropRef, minute: dropRef.minute + minute };
    };

    let selectRef: GridDrapDropInHourType = null;
    if (xOutOffLeft && yOutOffTop) {
      selectRef = DrapDropInHour._aryTdRef[0];
      return convertMinute(selectRef, { x: selectRef.x, y: selectRef.y });
      // selectRef = DrapDropInHour._aryTdRef[0];
    }
    if (xOutOffLeft && yOutOffBottom) {
      selectRef =
        DrapDropInHour._aryTdRef[
          DrapDropInHour._aryTdRef.length - (DrapDropInHour._numTd - 1) * numberSubTd - 1
        ];
      return convertMinute(selectRef, { x: selectRef.x, y: selectRef.y + selectRef.height });
    }
    if (xOutOffRight && yOutOffTop) {
      selectRef = DrapDropInHour._aryTdRef[(DrapDropInHour._numTd - 1) * numberSubTd];
      return convertMinute(selectRef, { x: selectRef.x, y: selectRef.y });
    }
    if (xOutOffRight && yOutOffBottom) {
      selectRef = DrapDropInHour._aryTdRef[DrapDropInHour._aryTdRef.length - 1];
      return convertMinute(selectRef, { x: selectRef.x, y: selectRef.y + selectRef.height });
    }
    // console.log("findTdByXy xOutOffLeft(", xOutOffLeft, '), xOutOffRight(', xOutOffRight, '), yOutOffTop(', yOutOffTop, '), yOutOffBottom(', yOutOffBottom, ')')

    let startRow = 0,
      endRow = 23;
    if (yOutOffTop) endRow = 0; // check first row
    if (yOutOffBottom) startRow = 23; // check last row
    for (let i = startRow; i <= endRow; i += 1) {
      let startCol = 0,
        endCol = DrapDropInHour._numTd - 1;
      if (xOutOffLeft) endCol = 0; // check first col
      if (xOutOffRight) startCol = DrapDropInHour._numTd - 1; // check last col

      for (let j = startCol; j <= endCol; j++) {
        let startSub = 0,
          endSub = numberSubTd - 1;
        if (yOutOffTop) endSub = 0; // check first row
        if (yOutOffBottom) startSub = numberSubTd - 1; // check last row
        for (let sub = startSub; sub <= endSub; sub++) {
          const index = i * DrapDropInHour._numTd * numberSubTd + j * numberSubTd + sub;
          const dropRef: GridDrapDropInHourType = DrapDropInHour._aryTdRef[index];
          if (
            dropRef &&
            pos &&
            (xOutOffLeft || xOutOffRight || dropRef.x <= pos.x) &&
            (xOutOffLeft || xOutOffRight || pos.x <= dropRef.x + dropRef.width) &&
            (yOutOffTop || yOutOffBottom || dropRef.y <= pos.y) &&
            (yOutOffTop || yOutOffBottom || pos.y <= dropRef.y + dropRef.height)
          ) {
            // const offsetHeight = Math.abs(pos.y - dropRef.y - 1);
            // const minute = parseInt('' + (15 * offsetHeight) / dropRef.height, 10);

            return convertMinute(dropRef, {
              ...pos,
              y: yOutOffTop ? dropRef.y : yOutOffBottom ? dropRef.y + dropRef.height : dropRef.y
            });
            // { ...dropRef, minute: dropRef.minute + minute };
          }
        }
      }
    }

    return null;
  };

  /**
   * rounding minutes
   * @param date
   */
  private static roundMinute = (date: moment.Moment) => {
    let minute = date.minute();
    const div15 = parseInt('' + minute / 15, 10);
    minute = div15 * 15 + parseInt('' + (minute - div15 * 15) / 7.5, 10) * 15;

    // if ((minute - div15) <= 7.5) {
    //   minute = div15 * 15;
    // } else {
    //   minute = div15 * 15 + 15;
    // }
    if (minute === 60) {
      if (date.hour() === 23) {
        date.minute(59);
      } else {
        date.hour(date.hour() + 1);
        date.minute(0);
      }
    } else {
      date.minute(minute);
    }
    // console.log('roundMinute minute', minute, 'hour', date.hour(), date.format('YYYY/MM/DD HH:mm:00'))
    return date;
  };

  /**
   * Data initialization
   */
  public static initWeek = () => {
    DrapDropInHour.resetData();
    if (!DrapDropInHour._startDateInit) return;
    const ref: HTMLElement = DrapDropInHour._tblRefInit && DrapDropInHour._tblRefInit.current;
    const startDate: moment.Moment = DrapDropInHour._startDateInit.clone();

    // find all td
    const tds = (ref && ref.getElementsByTagName('td')) || [];
    DrapDropInHour._initialized = tds !== null && tds.length > 0;
    const tblBounding = DrapDropInMonth.getNodeClientOffset(ref);
    DrapDropInHour._tblRoot = {
      indexArray: 0,
      height: tblBounding.height,
      width: tblBounding.width,
      x: tblBounding.x,
      y: tblBounding.y,
      refTd: ref,
      hour: 0,
      indexDate: 0,
      date: startDate.clone(),
      minute: 0
    };

    // startDate.subtract(1, 'hour');
    const aryDateInHour: moment.Moment[] = [];
    for (let i = 0; i < DrapDropInHour._numTd; i++) {
      aryDateInHour.push(startDate.clone().add(i, 'day'));
    }

    // startDate.subtract(1, 'hour');
    for (let i = 0, indexOfTd = -1; i < tds.length; i++) {
      // Remove the first column
      if (i % (DrapDropInHour._numTd + 1) === 0) continue;
      indexOfTd++;

      const indexDate = indexOfTd % DrapDropInHour._numTd;
      const hour = parseInt('' + indexOfTd / DrapDropInHour._numTd, 10);
      const dateOfTd = aryDateInHour[indexDate].clone(); // startDate.add(1, 'hour').clone();
      dateOfTd
        .hour(hour)
        .minute(0)
        .second(0)
        .millisecond(0);
      const xy = DrapDropInMonth.getNodeClientOffset(tds[i]);
      const pageXy = DrapDropInHour.convertClient2PageXY(xy);
      const height = xy.height / 4;

      for (let j = 0; j < 4; j++) {
        const td = {
          indexArray: DrapDropInHour._aryTdRef.length,
          height,
          width: xy.width,
          x: pageXy.x,
          y: pageXy.y + height * j,
          indexDate,
          hour,
          date: dateOfTd.clone().minute(j * 15),
          minute: j * 15,
          refTd: tds[i]
        };

        DrapDropInHour._aryTdRef.push(td);
        DrapDropInHour._objTdDateRef[DrapDropInHour.dateToIndex(td.date)] = td;
        if (!DrapDropInHour._objTdIndexRef[indexDate]) {
          DrapDropInHour._objTdIndexRef[indexDate] = {};
        }
        if (!DrapDropInHour._objTdIndexRef[indexDate][hour]) {
          DrapDropInHour._objTdIndexRef[indexDate][hour] = {};
        }
        DrapDropInHour._objTdIndexRef[indexDate][hour][td.minute] = td;
      }
    }
  };

  /**
   * The event handler began to drag and drop with XYCoord
   */
  public static beginDragWithPos = (item: DataOfSchedule | DataOfResource, pos: XYCoord) => {
    DrapDropInHour.initWeek();
    if (!DrapDropInHour._aryTdRef) {
      return;
    }
    const pageXy = DrapDropInHour.convertClient2PageXY(pos);
    const clickTd: GridDrapDropInHourType = DrapDropInHour.findTdByXy(pageXy);
    if (!clickTd) return;
    DrapDropInHour._itemDrag = _.cloneDeep(item);

    DrapDropInHour._clickOnTdIndex = clickTd;
    DrapDropInHour._clickXy = pos;
    DrapDropInHour._isDragging = true; // monitor.isDragging();

    // -1: outside the visible area
    DrapDropInHour._startItemClickIndex = DrapDropInHour.findTdByDate(item.startDateMoment);
    DrapDropInHour._endItemClickIndex = DrapDropInHour.findTdByDate(item.finishDateMoment);
    DrapDropInHour._offsetStartEndOfItem =
      CalenderViewMonthCommon.convertDateToMinute(
        DrapDropInHour._endItemClickIndex.hour,
        DrapDropInHour._endItemClickIndex.minute
      ) -
      CalenderViewMonthCommon.convertDateToMinute(
        DrapDropInHour._startItemClickIndex.hour,
        DrapDropInHour._startItemClickIndex.minute
      );

    DrapDropInHour._startItemViewIndex = { ...DrapDropInHour._startItemClickIndex };
    DrapDropInHour._endItemViewIndex = { ...DrapDropInHour._endItemClickIndex };
  };

  /**
   * The event handler began to drag and drop
   */
  public static beginDrag = (item: DataOfSchedule | DataOfResource, monitor: DragSourceMonitor) => {
    return DrapDropInHour.beginDragWithPos(item, monitor.getInitialClientOffset());
  };

  /**
   * Move item to mouse cursor position
   * @returns: true (If have changed), false (no change)
   */
  private static moveItem = (pos: XYCoord, snapX: number, snapY: number) => {
    const xyMove: XYCoord = {
      x:
        DrapDropInHour._clickXy.x + Math.round((pos.x - DrapDropInHour._clickXy.x) / snapX) * snapX,
      y: DrapDropInHour._clickXy.y + Math.round((pos.y - DrapDropInHour._clickXy.y) / snapY) * snapY
    };
    const pageXy = DrapDropInHour.convertClient2PageXY(xyMove);
    const tdMove = DrapDropInHour.findTdByXy(pageXy);
    // console.log('moveItem xyMove', xyMove);
    // console.log('moveItem tdMove', tdMove.date.format('YYYY/MM/DD HH:mm:00'));

    if (!tdMove) return false;
    const tdMoveConvert = DrapDropInHour.convertPointToMinuteFromFirstWeek(tdMove);
    const tdClickConvert = DrapDropInHour.convertPointToMinuteFromFirstWeek(
      DrapDropInHour._clickOnTdIndex
    );

    const diffMinute = tdMoveConvert - tdClickConvert;
    // if (diffMinute === 0) return false;

    const hour0LimitMinute = DrapDropInHour.convertPointToMinuteFromFirstWeek(
      tdMove.indexDate,
      0,
      0
    );
    const hour23LimitMinute = hour0LimitMinute + TOTAL_MINUTE_OF_DATE;
    let newStart =
      DrapDropInHour.convertPointToMinuteFromFirstWeek(DrapDropInHour._startItemClickIndex) +
      diffMinute;
    if (newStart < hour0LimitMinute) {
      newStart = hour0LimitMinute;
    }
    if (newStart + DrapDropInHour._offsetStartEndOfItem > hour23LimitMinute) {
      newStart = hour23LimitMinute - DrapDropInHour._offsetStartEndOfItem - 1;
    }

    DrapDropInHour._startItemViewIndex =
      DrapDropInHour.convertMinuteToPointFromFirstWeek(newStart) ||
      DrapDropInHour._startItemViewIndex;
    DrapDropInHour._endItemViewIndex =
      DrapDropInHour.convertMinuteToPointFromFirstWeek(
        newStart + DrapDropInHour._offsetStartEndOfItem
      ) || DrapDropInHour._endItemViewIndex;

    return true;
  };

  /**
   * The event handler end to drag and drop
   */
  public static getDraggingDate = (): [moment.Moment, moment.Moment] => {
    const newStart = DrapDropInHour.roundMinute(
      DrapDropInHour._startItemViewIndex.date
        .clone()
        .minute(DrapDropInHour._startItemViewIndex.minute)
    );
    const newEnd = DrapDropInHour.roundMinute(
      DrapDropInHour._endItemViewIndex.date.clone().minute(DrapDropInHour._endItemViewIndex.minute)
    );
    return [newStart, newEnd];
  };

  /**
   * The event handler end to drag and drop
   */
  public static endDrag = (
    item: DataOfSchedule | DataOfResource
  ): [moment.Moment, moment.Moment] => {
    DrapDropInHour._isDragging = false;
    // DrapDropInHour._initialized = false;
    // DrapDropInHour.resetData();
    const newStart = DrapDropInHour.roundMinute(
      DrapDropInHour._startItemViewIndex.date
        .clone()
        .minute(DrapDropInHour._startItemViewIndex.minute)
    );
    const newEnd = DrapDropInHour.roundMinute(
      DrapDropInHour._endItemViewIndex.date.clone().minute(DrapDropInHour._endItemViewIndex.minute)
    );
    if (
      CalenderViewMonthCommon.compareDateByHour(
        newStart,
        DrapDropInHour._itemDrag.startDateMoment
      ) === 0 &&
      CalenderViewMonthCommon.compareDateByHour(
        newEnd,
        DrapDropInHour._itemDrag.finishDateMoment
      ) === 0
    )
      return;
    return [newStart, newEnd];
  };

  /**
   * Event handling on hover
   */
  public static hover = (xy: XYCoord, snapX: number, snapY: number) => {
    if (
      !DrapDropInHour.isDragging() ||
      !DrapDropInHour._initialized ||
      !DrapDropInHour._clickOnTdIndex
    )
      return;
    DrapDropInHour.moveItem(xy, snapX, snapY);
  };

  /**
   * Event handling onResize
   */
  public static onResize = (pos: XYCoord, direction: Direction, snapX: number, snapY: number) => {
    if (
      !DrapDropInHour.isDragging() ||
      !DrapDropInHour._initialized ||
      !DrapDropInHour._clickOnTdIndex
    )
      return;
    const xyMove: XYCoord = {
      x:
        DrapDropInHour._clickXy.x + Math.round((pos.x - DrapDropInHour._clickXy.x) / snapX) * snapX,
      y: DrapDropInHour._clickXy.y + Math.round((pos.y - DrapDropInHour._clickXy.y) / snapY) * snapY
    };
    const pageXy = DrapDropInHour.convertClient2PageXY(xyMove);

    const tdMove = DrapDropInHour.findTdByXy(pageXy);
    // console.log('onResize xyMove', xyMove, 'pageXy', pageXy);
    // console.log('onResize tdMove', tdMove.date.format('YYYY/MM/DD HH:mm:00'), 'tdMove.hour', tdMove.hour, 'tdMove.minute', tdMove.minute);
    if (!tdMove) return false;
    const tdMoveConvert = DrapDropInHour.convertPointToMinuteFromFirstWeek(
      DrapDropInHour._startItemViewIndex.indexDate,
      tdMove.hour,
      tdMove.minute
    );

    const hour0LimitMinute = DrapDropInHour.convertPointToMinuteFromFirstWeek(
      DrapDropInHour._startItemViewIndex.indexDate,
      0,
      0
    );
    const hour23LimitMinute = hour0LimitMinute + TOTAL_MINUTE_OF_DATE;
    let newStart = tdMoveConvert;
    if (newStart < hour0LimitMinute) {
      newStart = hour0LimitMinute;
    }
    if (newStart > hour23LimitMinute) {
      newStart = hour23LimitMinute;
    }
    // console.log('onResize newStart', newStart, 'hour23LimitMinute', hour23LimitMinute);

    if (direction === 'top') {
      const endConvert = DrapDropInHour.convertPointToMinuteFromFirstWeek(
        DrapDropInHour._endItemViewIndex
      );
      if (newStart > endConvert - FIFTEEN_MINUTES) {
        newStart = endConvert - FIFTEEN_MINUTES;
      }
      DrapDropInHour._startItemViewIndex =
        DrapDropInHour.convertMinuteToPointFromFirstWeek(newStart) ||
        DrapDropInHour._startItemViewIndex;
    } else {
      const startConvert = DrapDropInHour.convertPointToMinuteFromFirstWeek(
        DrapDropInHour._startItemViewIndex
      );
      if (newStart < startConvert + FIFTEEN_MINUTES) {
        newStart = startConvert + FIFTEEN_MINUTES;
      }
      DrapDropInHour._endItemViewIndex =
        DrapDropInHour.convertMinuteToPointFromFirstWeek(newStart) ||
        DrapDropInHour._endItemViewIndex;
    }
    return true;
  };

  /**
   * Check the date is in [DrapDropInHour._startViewIndex, DrapDropInHour._endViewIndex]
   */
  public static getBoundingPreview = (): GridDrapDropInHourType => {
    const x = DrapDropInHour._startItemViewIndex.x - DrapDropInHour._tblRoot.x;
    const w = DrapDropInHour._startItemViewIndex.width;
    const y = DrapDropInHour._startItemViewIndex.y - DrapDropInHour._tblRoot.y;

    const dropRefStart = DrapDropInHour._startItemViewIndex;
    const dropRefEnd = DrapDropInHour._endItemViewIndex;
    const heightStart =
      dropRefStart.y + Math.round((dropRefStart.height * dropRefStart.minute) / 60);
    const heightEnd = dropRefEnd.y + Math.round((dropRefEnd.height * dropRefEnd.minute) / 60);

    const h = heightEnd - heightStart;
    DrapDropInHour._itemDrag.startDateMoment = DrapDropInHour._startItemViewIndex.date;
    DrapDropInHour._itemDrag.finishDateMoment = DrapDropInHour._endItemViewIndex.date;

    return {
      ...DrapDropInHour._startItemViewIndex,
      width: w,
      height: h,
      x,
      y,
      itemDrag: DrapDropInHour._itemDrag
    };
  };
}
