import moment from 'moment';
// import _ from 'lodash';
import { CalenderViewMonthCommon } from '../common';
import { XYCoord } from 'react-dnd';
import { DrapDropInMonth } from './grid-drap-drop-month';

export type GridDrapDropInListType = {
  refTd: any;
  date: moment.Moment;
  height: number;
  width: number;
  x: number;
  y: number;
};

/**
 * Manage drag and drop in List
 */
export class DrapDropInList {
  // array td of table
  private static _aryTdRef: GridDrapDropInListType[] = [];

  /**
   * Reset data
   */
  public static reset = () => {
    DrapDropInList._aryTdRef = [];
  };

  /**
   * Find td in month by XYCoord
   */
  public static findTdByXy = (pos: XYCoord): GridDrapDropInListType => {
    for (let i = 0; i < DrapDropInList._aryTdRef.length; i++) {
      const dropRef: GridDrapDropInListType = DrapDropInList._aryTdRef[i];

      if (
        dropRef &&
        pos &&
        // dropRef.x <= pos.x &&
        // pos.x <= dropRef.x + dropRef.width &&
        dropRef.y <= pos.y &&
        pos.y <= dropRef.y + dropRef.height
      ) {
        return { ...DrapDropInList._aryTdRef[i] };
      }
    }
    const minY = DrapDropInList._aryTdRef.length > 0 ? DrapDropInList._aryTdRef[0].y : 0,
      maxY =
        DrapDropInList._aryTdRef.length > 0
          ? DrapDropInList._aryTdRef[DrapDropInList._aryTdRef.length - 1].y
          : 0;

    if (pos.y <= minY && DrapDropInList._aryTdRef.length > 0) {
      return DrapDropInList._aryTdRef[0];
    }
    if (pos.y >= maxY && DrapDropInList._aryTdRef.length > 0) {
      return DrapDropInList._aryTdRef[DrapDropInList._aryTdRef.length - 1];
    }

    return null;
  };

  /**
   * Data initialization
   */
  public static addRef = (tdRefInit: any, date: moment.Moment) => {
    const ref: HTMLElement = tdRefInit;
    if (!ref) return;
    const tblBounding = DrapDropInMonth.getNodeClientOffset(ref);
    const indexWeek = DrapDropInList._aryTdRef.findIndex(
      (td: GridDrapDropInListType) => CalenderViewMonthCommon.compareDateByDay(td.date, date) === 0
    );

    if (indexWeek > 0) {
      DrapDropInList._aryTdRef[indexWeek] = {
        refTd: tdRefInit,
        date,
        height: tblBounding.height,
        width: tblBounding.width,
        x: tblBounding.x,
        y: tblBounding.y
      };
    } else {
      const td: GridDrapDropInListType = {
        refTd: tdRefInit,
        date,
        height: tblBounding.height,
        width: tblBounding.width,
        x: tblBounding.x,
        y: tblBounding.y
      };
      DrapDropInList._aryTdRef.push(td);
    }
    DrapDropInList._aryTdRef.sort((a, b) => a.y - b.y);
  };

  /**
   * The event handler end to drag and drop
   */
  public static getDraggingDate = (pos: XYCoord): moment.Moment => {
    const tdMove = DrapDropInList.findTdByXy(pos);

    if (!tdMove) return null;

    return tdMove.date;
  };
}
