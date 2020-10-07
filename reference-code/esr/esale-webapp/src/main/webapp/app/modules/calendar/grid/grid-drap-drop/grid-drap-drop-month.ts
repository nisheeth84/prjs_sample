import moment from 'moment';
import _ from 'lodash';
import { DataOfResource, DataOfSchedule, CalenderViewMonthCommon } from '../common';
import { DragSourceMonitor, XYCoord } from 'react-dnd';
import { ItemTypeSchedule } from '../../constants';

export type GridDrapDropType = {
  date: moment.Moment;
  height: number;
  width: number;

  x: number;
  y: number;

  pageX: number;
  pageY: number;

  refTd: HTMLElement;
  refDivDate: HTMLElement;

  index: number;
  itemDrag?: DataOfSchedule | DataOfResource;
};

export type ItemDragType = {
  itemDrag?: DataOfSchedule | DataOfResource;
  height: number;
  width: number;

  /**
   * clientX, clientY
   */
  x: number;
  y: number;

  rowIndex: number;
  startIndex: number;
  endIndex: number;
};

type ScrollInfoType = {
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
  scrollHeight: number;
};

const ELEMENT_NODE = 1;
/**
 * Manage drag and drop in month
 */
export class DrapDropInMonth {
  // root ref
  private static _tblRoot: GridDrapDropType = null;
  private static _thInfo: any;
  // array td of table
  private static _aryTdRef: GridDrapDropType[] = [];
  private static _objTdRef = {};

  // td when onclick to start drag
  private static _clickOnTd: GridDrapDropType = null;
  private static _moveOnTd: GridDrapDropType = null;

  private static _clickXy: XYCoord = null;
  // private static _moveXy: XYCoord = null;

  // index of view
  private static _startViewIndex = -1;
  private static _endViewIndex = -1;

  // when click schedule to start drag
  // private static _startClickIndex = -1;
  // private static _endClickIndex = -1;

  // index of item
  // private static _startItemViewIndex = -1;
  // private static _endItemViewIndex = -1;

  private static _isDragging = false;

  // first of view
  private static _startDateInit: moment.Moment = null;
  private static _endDateInit: moment.Moment = null;
  private static _tblRefInit = null;
  private static _initialized = false;

  // item data
  private static _aryItemDrag: ItemDragType[];
  private static _itemOnClick: DataOfSchedule | DataOfResource;

  private static resetData = () => {
    DrapDropInMonth._aryItemDrag = [];
    DrapDropInMonth._aryTdRef = [];
    DrapDropInMonth._objTdRef = {};
    // DrapDropInMonth._clickOnTd = null;
    DrapDropInMonth._startViewIndex = -1;
    DrapDropInMonth._endViewIndex = -1;
    DrapDropInMonth._isDragging = false;
  };

  public static setStartDateMonth = (date: moment.Moment) => {
    DrapDropInMonth._startDateInit = date;
  };

  public static setTblRefMonth = (tblRefInit: any) => {
    DrapDropInMonth._tblRefInit = tblRefInit;
  };

  public static reinitialized = () => {
    DrapDropInMonth._initialized = false;
    DrapDropInMonth.initMonth();
  };

  public static isDragging = () => {
    return DrapDropInMonth._isDragging;
  };

  public static getStartViewDate = (): moment.Moment => {
    const td = DrapDropInMonth._aryTdRef.find(e => e.index === DrapDropInMonth._startViewIndex);
    return (td && td.date) || null;
  };

  public static getEndViewDate = (): moment.Moment => {
    const td = DrapDropInMonth._aryTdRef.find(e => e.index === DrapDropInMonth._endViewIndex);
    return (td && td.date) || null;
  };

  public static subtract(a: XYCoord, b: XYCoord): XYCoord {
    return {
      x: a.x - b.x,
      y: a.y - b.y
    };
  }

  public static add(a: XYCoord, b: XYCoord): XYCoord {
    return {
      x: a.x + b.x,
      y: a.y + b.y
    };
  }

  /**
   * Convert date to YYYY-MM-DD format
   */
  public static dateToIndex = (s: moment.Moment) => {
    return s.format('YYYY-MM-DD');
  };

  /**
   * Find td in month by XYCoord
   */
  public static findTdByXy = (pageXY: XYCoord, aryRef: GridDrapDropType[]): GridDrapDropType => {
    // if outOff
    const minX = aryRef[0].pageX,
      minY = aryRef[0].pageY;
    const maxX = aryRef[aryRef.length - 1].pageX + aryRef[aryRef.length - 1].width,
      maxY = aryRef[aryRef.length - 1].pageY + aryRef[aryRef.length - 1].height;

    const xOutOffLeft = pageXY.x < minX;
    const xOutOffRight = pageXY.x > maxX;
    const yOutOffTop = pageXY.y < minY;
    const yOutOffBottom = pageXY.y > maxY;

    if (xOutOffLeft && yOutOffTop) return aryRef[0];
    if (xOutOffLeft && yOutOffBottom) return aryRef[aryRef.length - 7];
    if (xOutOffRight && yOutOffTop) return aryRef[6];
    if (xOutOffRight && yOutOffBottom) return aryRef[aryRef.length - 1];

    let startI = 0,
      endI = aryRef.length;
    if (yOutOffTop) endI = 1;
    if (yOutOffBottom) startI = aryRef.length - 7;
    for (let i = startI; i < endI; i += 7) {
      let startJ = i,
        endJ = i + 7;
      if (xOutOffLeft) endJ = i + 1;
      if (xOutOffRight) startJ = i + 6;

      for (let j = startJ; j < endJ; j++) {
        const index = j;
        const dropRef: GridDrapDropType = aryRef[index];
        if (
          dropRef &&
          pageXY &&
          (xOutOffLeft || xOutOffRight || dropRef.pageX <= pageXY.x) &&
          (xOutOffLeft || xOutOffRight || pageXY.x <= dropRef.pageX + dropRef.width) &&
          (yOutOffTop || yOutOffBottom || dropRef.pageY <= pageXY.y) &&
          (yOutOffTop || yOutOffBottom || pageXY.y <= dropRef.pageY + dropRef.height)
        ) {
          return dropRef;
        }
      }
    }

    return null;
  };

  /**
   * Find td in month by Date
   */
  public static findTdByDate = (date: moment.Moment): GridDrapDropType => {
    const index = DrapDropInMonth.dateToIndex(date);
    return DrapDropInMonth._objTdRef[index];
  };

  /**
   * Get scroll info of root div
   * @returns ScrollInfoType
   */
  public static getRootScrollInfo = (): ScrollInfoType => {
    const ref: HTMLElement = DrapDropInMonth._tblRefInit && DrapDropInMonth._tblRefInit.current;
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
    const ref: HTMLElement = DrapDropInMonth._tblRefInit && DrapDropInMonth._tblRefInit.current;
    return DrapDropInMonth.getNodeClientOffset(ref);
  };

  /**
   * Convert clientX, ClientY to pageX, PageY
   * @param pos
   * @returns {x: pos.x + scrollInfo.scrollLeft, y: pos.y + scrollInfo.scrollTop}
   */
  public static convertClient2PageXY(pos: XYCoord): XYCoord {
    const rootClientXY = DrapDropInMonth.getRootXY();
    const scrollInfo: ScrollInfoType = DrapDropInMonth.getRootScrollInfo();
    return {
      x: pos.x + scrollInfo.scrollLeft - rootClientXY.x,
      y: pos.y + scrollInfo.scrollTop - rootClientXY.y
    };
  }

  /**
   * Get Bounding Client Rect
   * @param node
   */
  public static getNodeClientOffset(node: HTMLElement): DOMRect {
    const el = node.nodeType === ELEMENT_NODE ? node : node.parentElement;

    if (!el) {
      return null;
    }

    // const { height, width, x, y } = el.getBoundingClientRect();
    return el.getBoundingClientRect();
  }

  /**
   * Data initialization
   */
  public static initMonth = () => {
    DrapDropInMonth.resetData();
    const startDate: moment.Moment = DrapDropInMonth._startDateInit;
    if (!startDate) return;
    // console.log('initMonth', startDate.format('YYYY/MM/DD'));
    const ref: HTMLElement = DrapDropInMonth._tblRefInit && DrapDropInMonth._tblRefInit.current;

    // find all td
    const tds = (ref && ref.getElementsByTagName('td')) || [];
    // const ths = (ref && ref.getElementsByTagName('th')) || [];
    DrapDropInMonth._initialized = tds !== null && tds.length > 0;
    const tblBounding = DrapDropInMonth.getNodeClientOffset(ref);

    DrapDropInMonth._tblRoot = {
      height: tblBounding.height,
      width: tblBounding.width,
      x: tblBounding.x,
      y: tblBounding.y,

      pageX: tblBounding.x,
      pageY: tblBounding.y,

      refTd: ref,
      refDivDate: ref,

      index: 0,
      date: startDate.clone()
    };

    const modeViewMonth = tds.length % 7 === 0;
    DrapDropInMonth._thInfo = DrapDropInMonth.getNodeClientOffset(ref);

    let startIndexTd = 0;
    for (let i = 0; i < tds.length; i++) {
      if (!modeViewMonth && i === 0) continue;
      const xy = DrapDropInMonth.getNodeClientOffset(tds[i]);
      const pageXy = DrapDropInMonth.convertClient2PageXY(xy);
      const divDate = tds[i].getElementsByClassName('date') || null;
      // const xyDivDate = divDate && divDate.length ? DrapDropInMonth.getNodeClientOffset(divDate[0]) : null;
      // const viewPageXY = xyDivDate ? DrapDropInMonth.convertClient2PageXY({ x: xyDivDate.x, y: xyDivDate.y + xyDivDate.height }) : { height: 0, width: 0, x: 0, y: 0 };
      // console.log("xyDivDate", xy, xyDivDate)
      startIndexTd = DrapDropInMonth._aryTdRef.length;
      const td = {
        // height: xy.height, width: xy.width, x: xyTbl.x + xy.x, y: xyTbl.y + xy.y,
        height: xy.height,
        width: xy.width,
        x: xy.x,
        y: xy.y,

        pageX: pageXy.x,
        pageY: pageXy.y,

        refTd: tds[i],
        refDivDate: divDate && divDate[0],

        index: startIndexTd,
        date: startDate.clone().add(startIndexTd, 'day')
      };
      if (startIndexTd % 7 === 0) {
        DrapDropInMonth._aryItemDrag.push({
          itemDrag: null,
          height: xy.height,
          width: xy.width + 2,
          x: xy.x,
          y: xy.y,

          rowIndex: startIndexTd,
          startIndex: startIndexTd,
          endIndex: startIndexTd + 7 - 1
        });
      }

      DrapDropInMonth._aryTdRef.push(td);
      DrapDropInMonth._objTdRef[DrapDropInMonth.dateToIndex(td.date)] = td;
    }

    if (DrapDropInMonth._aryTdRef.length > 0) {
      DrapDropInMonth._endDateInit = DrapDropInMonth._aryTdRef[
        DrapDropInMonth._aryTdRef.length - 1
      ].date.clone();
    }
  };

  private static setShowItemDrag = (startDate: moment.Moment, endDate: moment.Moment) => {
    const startMaxDate = CalenderViewMonthCommon.getMaxDay(
      startDate,
      DrapDropInMonth._startDateInit
    );
    const endMinDate = CalenderViewMonthCommon.getMinDay(endDate, DrapDropInMonth._endDateInit);
    const startKeyDate = DrapDropInMonth.dateToIndex(startMaxDate);
    const endKeyDate = DrapDropInMonth.dateToIndex(endMinDate);
    const startIndex = DrapDropInMonth._objTdRef[startKeyDate].index;
    const endIndex = DrapDropInMonth._objTdRef[endKeyDate].index;

    // const rootClientXY = DrapDropInMonth.getRootXY();
    // const rootX = DrapDropInMonth._aryTdRef[0].x;
    // const rootY = DrapDropInMonth._thInfo.y;

    for (let i = 0; i < DrapDropInMonth._aryItemDrag.length; i++) {
      const itemDrag = DrapDropInMonth._aryItemDrag[i];
      if (startIndex <= itemDrag.rowIndex + 6 && itemDrag.rowIndex <= endIndex) {
        itemDrag.itemDrag.isShow = true;

        const sIndex = Math.max(startIndex, itemDrag.rowIndex);
        const eIndex = Math.min(endIndex, itemDrag.rowIndex + 6);
        itemDrag.startIndex = sIndex;
        itemDrag.endIndex = eIndex;

        const tdStartObj = DrapDropInMonth._aryTdRef[sIndex];

        let tdPageXY: XYCoord = null;
        let margin = 1;
        if (DrapDropInMonth._aryTdRef[sIndex].refDivDate) {
          const tdClientXY = DrapDropInMonth.getNodeClientOffset(
            DrapDropInMonth._aryTdRef[sIndex].refDivDate
          );
          tdPageXY = DrapDropInMonth.convertClient2PageXY({
            x: tdClientXY.x,
            y: tdClientXY.y + tdClientXY.height
          });
        } else {
          const tdClientXY = DrapDropInMonth.getNodeClientOffset(
            DrapDropInMonth._aryTdRef[sIndex].refTd
          );
          tdPageXY = DrapDropInMonth.convertClient2PageXY({ x: tdClientXY.x, y: tdClientXY.y });
          margin = 0;
        }

        const startDateView = tdStartObj.date
          .clone()
          .hour(itemDrag.itemDrag.startDateMoment.hour())
          .minute(itemDrag.itemDrag.startDateMoment.minute());

        const endDateView = DrapDropInMonth._aryTdRef[eIndex].date
          .clone()
          .hour(itemDrag.itemDrag.finishDateMoment.hour())
          .minute(itemDrag.itemDrag.finishDateMoment.minute());

        itemDrag.itemDrag.startDateMoment = startDateView;
        itemDrag.itemDrag.finishDateMoment = endDateView;

        itemDrag.x = tdPageXY.x;
        itemDrag.y = tdPageXY.y + margin;

        itemDrag.width = 0;
        for (let z = sIndex; z <= eIndex; z++) {
          itemDrag.width += DrapDropInMonth._aryTdRef[z].width;
        }
        itemDrag.width -= 1;
      } else {
        itemDrag.itemDrag.isShow = false;
      }
    }

    if (DrapDropInMonth._aryItemDrag[0].itemDrag.isShow) {
      // check isStartPrevious
      DrapDropInMonth._aryItemDrag[0].itemDrag.isStartPrevious =
        CalenderViewMonthCommon.compareDateByDay(startDate, DrapDropInMonth._startDateInit) < 0;
    }

    const length = DrapDropInMonth._aryItemDrag.length - 1;
    if (DrapDropInMonth._aryItemDrag[length].itemDrag.isShow) {
      // check isEndNext
      DrapDropInMonth._aryItemDrag[length].itemDrag.isEndNext =
        CalenderViewMonthCommon.compareDateByDay(endDate, DrapDropInMonth._endDateInit) > 0;
    }
  };

  /**
   * The event handler began to drag and drop
   */
  public static beginDragWithPos = (item: DataOfSchedule | DataOfResource, pos: XYCoord) => {
    DrapDropInMonth.initMonth();
    if (!DrapDropInMonth._aryTdRef) {
      return;
    }

    const pageXY = DrapDropInMonth.convertClient2PageXY(pos);
    const clickTd: GridDrapDropType = DrapDropInMonth.findTdByXy(pageXY, DrapDropInMonth._aryTdRef);
    // console.log('clickTd', clickTd)
    if (!clickTd) return;
    // console.log('beginDragWithPos', clickTd.date.format('YYYY/MM/DD'), clickTd);

    for (let i = 0; i < DrapDropInMonth._aryItemDrag.length; i++) {
      DrapDropInMonth._aryItemDrag[i].itemDrag = _.cloneDeep(item);
      DrapDropInMonth._aryItemDrag[i].itemDrag.isShow = false;
      DrapDropInMonth._aryItemDrag[i].itemDrag.isStartPrevious = false;
      DrapDropInMonth._aryItemDrag[i].itemDrag.isEndNext = false;
    }

    DrapDropInMonth._itemOnClick = _.cloneDeep(item);
    DrapDropInMonth._clickOnTd = clickTd;
    DrapDropInMonth._clickXy = pos;
    DrapDropInMonth._moveOnTd = { ...clickTd };
    // DrapDropInMonth._moveXy = { ...pos };
    // console.log('beginDragWithPos', pos, clickTd.date.format('YYYY/MM/DD'), clickTd)

    DrapDropInMonth._isDragging = true; // monitor.isDragging();
    // DrapDropInMonth.setShowItemDrag(item.startDateMoment, item.finishDateMoment);

    // const aryRef: GridDrapDropType[] = DrapDropInMonth._aryTdRef;
    // const startDateOfMonth = aryRef[0].date.clone();
    // const endDateOfMonth = aryRef[aryRef.length - 1].date.clone();
    // const startOfSchedule = item.startDateMoment.clone();
    // const endOfSchedule = item.finishDateMoment.clone();
    // const startViewDate = CalenderViewMonthCommon.getMaxDay(startDateOfMonth, startOfSchedule);
    // const endViewDate = CalenderViewMonthCommon.getMinDay(endDateOfMonth, endOfSchedule);

    // const tdOfStartSchedule = DrapDropInMonth.findTdByDate(startOfSchedule);
    // const tdOfEndSchedule = DrapDropInMonth.findTdByDate(endOfSchedule);

    // const tdStart = DrapDropInMonth.findTdByDate(startViewDate);
    // const tdEnd = DrapDropInMonth.findTdByDate(endViewDate);

    // // click always in viewing area
    // DrapDropInMonth._startViewIndex = tdStart.index;
    // DrapDropInMonth._endViewIndex = tdEnd.index;

    // // -1: outside the visible area
    // DrapDropInMonth._startClickIndex = tdOfStartSchedule
    //   ? tdOfStartSchedule.index
    //   : CalenderViewMonthCommon.getDaysDiff(startOfSchedule, startDateOfMonth);
    // DrapDropInMonth._endClickIndex = tdOfEndSchedule
    //   ? tdOfEndSchedule.index
    //   : aryRef[aryRef.length - 1].index + CalenderViewMonthCommon.getDaysDiff(endOfSchedule, endDateOfMonth);
    // DrapDropInMonth._startItemViewIndex = DrapDropInMonth._startClickIndex;
    // DrapDropInMonth._endItemViewIndex = DrapDropInMonth._endClickIndex;
    // DrapDropInMonth._aryItemDrag[0].isStartPrevious = !tdOfStartSchedule;
    // DrapDropInMonth._aryItemDrag[DrapDropInMonth._aryItemDrag.length - 1].isEndNext = !tdOfEndSchedule;
  };

  /**
   * The event handler began to drag and drop
   */
  public static beginDrag = (item: DataOfSchedule | DataOfResource, monitor: DragSourceMonitor) => {
    return DrapDropInMonth.beginDragWithPos(item, monitor.getInitialClientOffset());
  };

  /**
   * The event handler end to drag and drop
   */
  public static getDraggingDate = (): [moment.Moment, moment.Moment] => {
    const diffDate = DrapDropInMonth._moveOnTd.index - DrapDropInMonth._clickOnTd.index;
    // if (diffDate === 0) return null;
    let startNewDate = null,
      endNewDate = null;
    if (diffDate > 0) {
      startNewDate = DrapDropInMonth._itemOnClick.startDateMoment.clone().add(diffDate, 'day');
      endNewDate = DrapDropInMonth._itemOnClick.finishDateMoment.clone().add(diffDate, 'day');
    } else if (diffDate < 0) {
      startNewDate = DrapDropInMonth._itemOnClick.startDateMoment
        .clone()
        .subtract(-diffDate, 'day');
      endNewDate = DrapDropInMonth._itemOnClick.finishDateMoment.clone().subtract(-diffDate, 'day');
    } else {
      startNewDate = DrapDropInMonth._itemOnClick.startDateMoment.clone();
      endNewDate = DrapDropInMonth._itemOnClick.finishDateMoment.clone();
    }
    return [startNewDate, endNewDate];
  };

  /**
   * The event handler end to drag and drop
   */
  public static endDrag = (
    item?: DataOfSchedule | DataOfResource,
    monitor?: DragSourceMonitor
  ): [moment.Moment, moment.Moment] => {
    DrapDropInMonth._isDragging = false;
    // DrapDropInMonth._initialized = false;
    // DrapDropInMonth.resetData();
    const diffDate = DrapDropInMonth._moveOnTd.index - DrapDropInMonth._clickOnTd.index;
    if (diffDate === 0) {
      return null;
    }
    return DrapDropInMonth.getDraggingDate();
  };

  /**
   * Event handling on hover
   */
  public static hover = (xy: XYCoord, snapX: number, snapY: number) => {
    const xyMove: XYCoord = {
      x:
        DrapDropInMonth._clickXy.x +
        Math.round((xy.x - DrapDropInMonth._clickXy.x) / snapX) * snapX,
      y:
        DrapDropInMonth._clickXy.y + Math.round((xy.y - DrapDropInMonth._clickXy.y) / snapY) * snapY
    };
    const movePageXY = DrapDropInMonth.convertClient2PageXY(xyMove);

    if (!DrapDropInMonth.isDragging() || !DrapDropInMonth._initialized) return;
    const tdMove = DrapDropInMonth.findTdByXy(movePageXY, DrapDropInMonth._aryTdRef);
    // console.log('hover', xyMove, tdMove);

    if (!tdMove) return;

    DrapDropInMonth._moveOnTd = tdMove;
    // DrapDropInMonth._moveXy = xyMove;
    // console.log('hover', tdMove.date.format('YYYY/MM/DD'), tdMove);

    // const aryRef: GridDrapDropType[] = DrapDropInMonth._aryTdRef;
    // const diffDate = tdMove.index - DrapDropInMonth._clickOnTd.index;
    // console.log('hover diffDate', diffDate)
    // DrapDropInMonth._startItemViewIndex = DrapDropInMonth._startClickIndex + diffDate;
    // DrapDropInMonth._endItemViewIndex = DrapDropInMonth._endClickIndex + diffDate;

    // const isStartPrevious = DrapDropInMonth._startItemViewIndex < 0;
    // const isEndNext = DrapDropInMonth._endItemViewIndex > aryRef[aryRef.length - 1].index;
    // if (isStartPrevious !== DrapDropInMonth._aryItemDrag[0].isStartPrevious) {
    //   // clone to refesh data view
    //   DrapDropInMonth._aryItemDrag[0] = _.cloneDeep(DrapDropInMonth._aryItemDrag[0]);
    //   DrapDropInMonth._aryItemDrag[0].isStartPrevious = isStartPrevious;
    // }

    // const maxLength = DrapDropInMonth._aryItemDrag.length;
    // if (isEndNext !== DrapDropInMonth._aryItemDrag[maxLength - 1].isEndNext) {
    //   // clone to refesh data view
    //   DrapDropInMonth._aryItemDrag[maxLength - 1] = _.cloneDeep(DrapDropInMonth._aryItemDrag[maxLength - 1]);
    //   DrapDropInMonth._aryItemDrag[maxLength - 1].isEndNext = isEndNext;
    // }

    // DrapDropInMonth._startViewIndex = Math.max(DrapDropInMonth._startItemViewIndex, 0);
    // DrapDropInMonth._endViewIndex = Math.min(DrapDropInMonth._endItemViewIndex, aryRef[aryRef.length - 1].index);
  };

  /**
   * Get the information to display on the preview screen
   */
  public static getItemPreview = (): ItemDragType[] => {
    const [startNewDate, endNewDate] = DrapDropInMonth.getDraggingDate();
    DrapDropInMonth.setShowItemDrag(startNewDate, endNewDate);
    return [...DrapDropInMonth._aryItemDrag];
  };

  /**
   * Get the information to display on the preview screen
   */
  public static getBoundingPreview = (startIndex: number): GridDrapDropType => {
    const startFind = startIndex * 7;
    const endIndex = startFind + 6;
    if (startFind <= DrapDropInMonth._endViewIndex && DrapDropInMonth._startViewIndex <= endIndex) {
      const minIndex = Math.max(startFind, DrapDropInMonth._startViewIndex);
      const maxIndex = Math.min(endIndex, DrapDropInMonth._endViewIndex);
      let width = 0;
      for (let i = minIndex; i <= maxIndex; i++) {
        width += DrapDropInMonth._aryTdRef[i].width;
      }

      const itemDrag = DrapDropInMonth._aryItemDrag[startIndex];

      const x = DrapDropInMonth._aryTdRef[minIndex].x - DrapDropInMonth._tblRoot.x;
      const y = DrapDropInMonth._aryTdRef[minIndex].y - DrapDropInMonth._tblRoot.y;

      return {
        ...DrapDropInMonth._aryTdRef[minIndex],
        width,
        x,
        y,
        itemDrag
      };
    }

    return null;
  };

  /**
   * Check object ref is Dragging
   */
  public static checkDraggingSchedule = (item: DataOfSchedule | DataOfResource): boolean => {
    if (DrapDropInMonth._isDragging === false) return false;
    const dragObject = DrapDropInMonth._aryItemDrag[0];
    const checkEmployeeId = () => {
      return (
        dragObject['employeeIds'] &&
        dragObject['employeeIds'].length > 0 &&
        item['employeeIds'] &&
        item['employeeIds'].length > 0 &&
        dragObject['employeeIds'][0] === item['employeeIds'][0]
      );
    };
    if (item['itemType'] && dragObject['itemType']) {
      if (
        item['itemType'] === ItemTypeSchedule.Schedule ||
        item['itemType'] === ItemTypeSchedule.Task
      ) {
        return (
          dragObject['itemType'] === item['itemType'] &&
          dragObject['itemId'] === item['itemId'] &&
          checkEmployeeId()
        );
      } else {
        return (
          dragObject['itemType'] === item['itemType'] && dragObject['itemId'] === item['itemId']
        );
      }
    } else {
      return dragObject['resourceId'] && item['resourceId'];
    }
  };
}
