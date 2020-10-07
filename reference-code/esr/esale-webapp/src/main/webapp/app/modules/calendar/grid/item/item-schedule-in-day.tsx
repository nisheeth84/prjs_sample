import React, { useEffect, CSSProperties, useState } from 'react'
import { DataOfSchedule, CalenderViewMonthCommon } from '../common'
import { LocalNavigation, ItemTypeSchedule, OPACITY_DRAGGING } from '../../constants'
import RenderMilestone from './render-milestone'
import RenderTask from '../item/render-task'
import RenderSchedule from './render-schedule'
// import { useDrag } from "react-dnd";
import { Rnd } from "react-rnd";
import { ResizeDirection } from "re-resizable";
// import { getEmptyImage } from "react-dnd-html5-backend";
import { DrapDropInHour } from '../grid-drap-drop/grid-drap-drop-in-hour'
import { ItemCalendar } from './item-calendar'
import moment from 'moment'
import { IRootState } from 'app/shared/reducers'
import {
  validateSchedule,
  validateTask,
  validateMileStone,
  updateSchedule,
  updateTask,
  updateMileStone,
} from '../../popups/create-edit-schedule.reducer'
import CalendarUpdateConfirm from '../../modal/calendar-update'
import { connect } from 'react-redux'
import { handleDragging } from '../../grid/calendar-grid.reducer'

type IItemScheduleInDayProp = DispatchProps & StateProps & {
  modeView: boolean,
  widthOfTd: number,
  heightOfTd: number,
  dataOfSchedule: DataOfSchedule,
  key: any,
  localNavigation: LocalNavigation,
  source?: any,
  drag?: any,
}

const ItemScheduleInDay = (props: IItemScheduleInDayProp) => {
  const [showPopupConfirm, setShowPopupConfirm] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [hideModeMonth, setHideModeMonth] = useState(false)
  const [aryDraggingDate, setAryDraggingDate] = useState([null, null])

  let sTop = 0; 
  // let oldStartDate = null;
  // let oldEndDate = null;
  if (moment.isMoment(props.dataOfSchedule.startDateSortMoment)) {
    sTop = ((props.heightOfTd / 60) * props.dataOfSchedule.startDateSortMoment.minute()) + 1;
    // oldStartDate = props.dataOfSchedule.startDateMoment.clone();
    // oldEndDate = props.dataOfSchedule.finishDateMoment.clone();
  }
  const sHeightIn15 = ((props.heightOfTd / 60) * 15);
  const sHeight = Math.max(((props.heightOfTd / 60) * props.dataOfSchedule.height), sHeightIn15) - 1 - 2;
  const sWidth = Math.floor(props.dataOfSchedule.width / 100 * props.widthOfTd) - 1 - 1;
  const sLeft = Math.floor(props.dataOfSchedule.left / 100 * props.widthOfTd) + 1;

  const styleSchedule: CSSProperties = {
    position: "absolute",
    top: sTop,
    left: sLeft,
    // transform: 'translate(0px, ' + sTop + 'px)',
    width: sWidth,
    maxWidth: sWidth,
    height: sHeight,
    zIndex: 10
  };

  const renderObject = (schedule: DataOfSchedule, modeView?: boolean) => {
    if (schedule.itemType === ItemTypeSchedule.Milestone) {
      return (
        <>
          <RenderMilestone
            dataOfSchedule={schedule}
            prefixKey={'item-Milestone'}
            localNavigation={props.localNavigation}

            width={'100%'}
            left={'0%'}
            top={'0px'}
            height={'100%'}
            modeView={props.modeView}
          />
        </>
      );
    }
    if (schedule.itemType === ItemTypeSchedule.Task) {
      return (
        <>
          <RenderTask
            dataOfSchedule={schedule}
            prefixKey={'item-Task'}
            localNavigation={props.localNavigation}

            width={'100%'}
            left={'0%'}
            top={'0px'}
            height={'100%'}
            modeView={props.modeView}
          />
        </>
      );
    }
    return (
      <>
        <RenderSchedule
          dataOfSchedule={schedule}
          prefixKey={'item-schedule'}
          localNavigation={props.localNavigation}

          formatNormalStart={'HH:mm'}
          formatNormalEnd={'HH:mm'}

          width={'100%'}
          left={'0%'}
          top={'0px'}
          height={'100%'}

          modeInHour={true}

          startDateDragging={modeView ? null : aryDraggingDate[0]}
          endDateDragging={modeView ? null : aryDraggingDate[1]}
          modeView={props.modeView}
        />
      </>
    );
  }

  const renderConfirmPopup = (schedule: DataOfSchedule) => {
    const onOkUpdateSchedule = (flagUpdate) => {
      schedule.updateFlag = flagUpdate
      props.updateSchedule(schedule, true);
      setShowPopupConfirm(false)
    }
    const onOkUpdateTask = (flagUpdate) => {
      schedule.updateFlag = flagUpdate
      props.updateTask(schedule);
      setShowPopupConfirm(false)
    }
    const onOkUpdateMileStone = (flagUpdate) => {
      schedule.updateFlag = flagUpdate
      props.updateMileStone(schedule);
      setShowPopupConfirm(false)
    }
    if (schedule.itemType === ItemTypeSchedule.Milestone) {
      return (
        <>
          {showPopupConfirm && schedule.isRepeat &&
            <CalendarUpdateConfirm callbackOnOk={onOkUpdateMileStone} callbackOnCancel={() => setShowPopupConfirm(false)} hideModeMonth={hideModeMonth} />}
        </>
      );
    }
    if (schedule.itemType === ItemTypeSchedule.Task) {
      return (
        <>
          {showPopupConfirm && schedule.isRepeat &&
            <CalendarUpdateConfirm callbackOnOk={onOkUpdateTask} callbackOnCancel={() => setShowPopupConfirm(false)} hideModeMonth={hideModeMonth} />}
        </>
      );
    }
    return (
      <>
        {showPopupConfirm && schedule.isRepeat &&
          <CalendarUpdateConfirm callbackOnOk={onOkUpdateSchedule} callbackOnCancel={() => setShowPopupConfirm(false)} hideModeMonth={hideModeMonth} />}
      </>
    );
  }

  // useEffect(() => {
  //   if (props.validateSuccess && !showPopupConfirm && props.dataOfSchedule.uniqueId === props.validatingScheduleId) {
  //     if (props.dataOfSchedule.isRepeat)
  //       setShowPopupConfirm(true)
  //   }
  // }, [props.validateSuccess])

  const renderBlankObject = () => {
    return (<></>)
    // if (!props.optionAll) {
    //   // return (<div className="calendar-schedule calendar-schedule-blank"></div>)
    // }
  }

  // let itemType = ItemTypeDrag.ScheduleInHour;
  // let isViewDetail: boolean;
  // if (props.dataOfSchedule.itemType === ItemTypeSchedule.Schedule) {
  //   isViewDetail = ItemCalendar.isViewDetailSchedule(props.dataOfSchedule)
  // }

  // if (props.dataOfSchedule.itemType === ItemTypeSchedule.Milestone) {
  //   // itemType = ItemTypeDrag.MilestoneInHour;
  //   isViewDetail = ItemCalendar.isViewDetailMilestone(props.dataOfSchedule)
  // }
  // if (props.dataOfSchedule.itemType === ItemTypeSchedule.Task) {
  //   // itemType = ItemTypeDrag.TaskInHour;
  //   isViewDetail = ItemCalendar.isViewDetailTask(props.dataOfSchedule)
  // }

  const opacity = isDragging ? OPACITY_DRAGGING : 0;
  const zIndexRnd = isDragging || isResizing ? 10005 : 2;
  /**
   * Default position and size of schedule
   */
  const defaultPosition = {
    y: sTop,
    x: sLeft
  };
  const defaultSize = {
    width: sWidth,
    height: sHeight
  }
  const [rndPosition, setRndPosition] = useState({ ...defaultPosition })
  const [rndSize, setRndSize] = useState({ ...defaultSize })
  const [snapX, setSnapX] = useState(props.widthOfTd)
  const [isMoving, setIsMoving] = useState(false)
  const snapY = sHeightIn15;

  useEffect(() => {
    setRndPosition({ ...defaultPosition })
    setRndSize({ ...defaultSize })
    setSnapX(props.widthOfTd)
  }, [props.widthOfTd, props.heightOfTd]);

  /**
   * Object ref to RND
   */
  let rndRef = null;

  /**
   * Reset Position and Size of schedule
   */
  const resetDragOrResize = () => {
    if (rndRef) {
      rndRef.updateSize(defaultSize);
      rndRef.updatePosition(defaultPosition);
    }
  }

  /**
   * Update new date when stop drag or stop resize
   * @param aryNewDate
   */
  const updateData = (aryNewDate: [moment.Moment, moment.Moment]) => {
    const schedule: DataOfSchedule = props.dataOfSchedule;
    // console.log('updateData updateData', aryNewDate)
    if (aryNewDate) {
      // if (
      //   CalenderViewMonthCommon.compareDateByHour(aryNewDate[0], oldStartDate) === 0 &&
      //   CalenderViewMonthCommon.compareDateByHour(aryNewDate[1], oldEndDate) === 0
      // ) {
      //   return;
      // }
      const newStartDate: moment.Moment = aryNewDate[0].clone(), newEndDate: moment.Moment = aryNewDate[1].clone();
      // console.log('updateData Date', newStartDate.format(), newEndDate.format())
      // return;
      if (CalenderViewMonthCommon.compareDateByDay(newStartDate, schedule.startDateMoment) !== 0) {
        setHideModeMonth(true);
      } else {
        setHideModeMonth(false);
      }

      schedule.startDate = newStartDate.toDate()
      schedule.finishDate = newEndDate.toDate()
      schedule['endDate'] = newEndDate.toDate()
      schedule['scheduleId'] = schedule.itemId;
      schedule['updateFlag'] = 0
      schedule['scheduleName'] = schedule.itemName

      switch (schedule.itemType) {
        case ItemTypeSchedule.Schedule: {
          if (schedule.isRepeat) {
            props.validateSchedule(schedule.itemId, schedule.uniqueId, (flgResult: boolean) => {
              setShowPopupConfirm(flgResult)
            }, true);
          } else {
            props.updateSchedule(schedule, true);
          }
          // props.validateSchedule(schedule.itemId, schedule.uniqueId);
          // if (props.validateSuccess && schedule.isRepeat) {
          //   setShowPopupConfirm(true)
          // } else if (props.validateSuccess) {
          //   props.updateSchedule(schedule);
          // }
          break;
        }
        case ItemTypeSchedule.Task: {
          props.updateTask(schedule);
          break;
        }
        case ItemTypeSchedule.Milestone: {
          props.updateMileStone(schedule);
          break
        }
        default:
          break
      }
    } else {
      resetDragOrResize();
    }
  }

  /**
   * Callback called on dragging start.
   * @param e
   * @param data
   */
  const onDragStart = (e, data) => {
    e.preventDefault();
    DrapDropInHour.beginDragWithPos(props.dataOfSchedule,
      {
        x: (e as MouseEvent).clientX,
        y: (e as MouseEvent).clientY,
      }
    );

    setIsDragging(true);
    setRndSize({ ...defaultSize, width: props.widthOfTd - 1})
    setRndPosition({ ...defaultPosition, x: 1 })
    props.handleDragging(props.dataOfSchedule.uniqueId)
    // setRndPosition({...defaultPosition, y: 0})
    // rndRef.updatePosition({...defaultPosition, y: 0});
  }

  /**
   * Callback called on dragging
   * @param e
   * @param data
   */
  const onDrag = (e, data) => {
    e.preventDefault();
    setIsMoving(true)
    DrapDropInHour.hover(
      {
        x: (e as MouseEvent).clientX,
        y: (e as MouseEvent).clientY,
      },
      snapX, snapY
    );
    // console.log('onDrag', snapX,snapX / 2, snapY, snapY / 2, data)
    setAryDraggingDate(DrapDropInHour.getDraggingDate())
  }

  /**
   * called on dragging stop.
   * @param e
   * @param data
   */
  const onDragStop = (e, data) => {
    e.preventDefault();
    const aryNewDate: [moment.Moment, moment.Moment] = DrapDropInHour.endDrag(props.dataOfSchedule);
    updateData(aryNewDate);

    setIsDragging(false);
    setRndSize({ ...defaultSize })
    setRndPosition({...defaultPosition})
    // rndRef.updatePosition({...defaultPosition});
    setAryDraggingDate([null, null])

    if (isMoving) {
      /**
       * IF is moving then delay 300 ms to handel onclick on schedule
       */
      setTimeout(() => {
        props.handleDragging(null)
      }, 300)
    } else {
      props.handleDragging(null)
    }
    setIsMoving(false)
  }

  /**
   * Calls when resizable component resize start.
   * @param e
   * @param dir
   * @param elementRef
   */
  const onResizeStart = (e, dir: ResizeDirection, elementRef: HTMLDivElement) => {
    e.preventDefault();
    // console.log('onResizeStart', e, e.clientX, e.clientY)
    DrapDropInHour.beginDragWithPos(props.dataOfSchedule,
      {
        x: (e as MouseEvent).clientX,
        y: (e as MouseEvent).clientY,
      }
    );
    setIsResizing(true);
    // setRndSize({ ...defaultSize, width: props.widthOfTd - 1})
    // setRndPosition({ ...defaultPosition, x: 1 })
    props.handleDragging(props.dataOfSchedule.uniqueId)
    // setRndSize({...defaultSize, width: '100%'})
  }

  /**
   * Calls when resizable component resizing.
   * @param e
   * @param direction
   * @param elementRef
   * @param delta
   */
  const onResize = (e: MouseEvent | TouchEvent, direction: ResizeDirection, elementRef: HTMLDivElement, delta: {
    height: number;
    width: number;
  }) => {
    e.preventDefault();
    setIsMoving(true)
    DrapDropInHour.onResize(
      {
        x: (e as MouseEvent).clientX,
        y: (e as MouseEvent).clientY,
      },
      direction, snapX, snapY
    );
    setAryDraggingDate(DrapDropInHour.getDraggingDate())
  }

  /**
   * Calls when resizable component resize stop.
   * @param e
   * @param direction
   * @param elementRef
   * @param delta
   */
  const onResizeStop = (e: MouseEvent | TouchEvent, direction: ResizeDirection, elementRef: HTMLDivElement, delta: {
    height: number;
    width: number;
  }) => {
    e.preventDefault();
    const aryNewDate: [moment.Moment, moment.Moment] = DrapDropInHour.endDrag(props.dataOfSchedule);
    updateData(aryNewDate);
    setIsResizing(false);
    setRndSize({ ...defaultSize })
    setRndPosition({...defaultPosition})
    // setRndSize({...defaultSize})
    setAryDraggingDate([null, null])

    if (isMoving) {
      /**
       * IF is moving then delay 300 ms to handel onclick on schedule
       */
      setTimeout(() => {
        props.handleDragging(null)
      }, 300)
    } else {
      props.handleDragging(null)
    }
    setIsMoving(false)
  }
  const styleRnd: CSSProperties = {
    // left: (-props.dataOfSchedule.left) + '%',
    // top: 0 + 'px',
    // transform: 'translate(0px, ' + sTop + 'px)',
    cursor: !props.modeView ? "pointer" : null,
    zIndex: 10
  };

  if (!props.widthOfTd || !props.heightOfTd) {
    return (<></>)
  }

  return (
    <>
      <Rnd style={{ ...styleRnd, zIndex: zIndexRnd }} ref={c => { rndRef = c; }}
        enableResizing={{
          right: false,
          left: false,
          top: false,
          bottom: !props.modeView
        }}
        dragGrid={[snapX, snapY]}
        resizeGrid={[snapX, snapY]}
        position={rndPosition}
        size={rndSize}
        disableDragging={!!props.modeView}

        initial={{
          x: sLeft,
          y: sTop,
          width: sWidth,
          height: sHeight
        }}

        minWidth={sWidth}
        maxWidth={props.widthOfTd}
        minHeight={sHeightIn15}
        maxHeight={props.heightOfTd * 24}

        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragStop={onDragStop}

        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeStop={onResizeStop}
        bounds={'.table-calendar-schedule-hour '}
      >
        {
          props.dataOfSchedule.isShow ?
            (
              renderObject(props.dataOfSchedule, false)
            )
            :
            (renderBlankObject())
        }
      </Rnd>
      {isDragging && (
        /* layer when dragging */
        <div style={{ ...styleSchedule, opacity }}>
          {
            props.dataOfSchedule.isShow ?
              (
                renderObject(props.dataOfSchedule, true)
              )
              :
              (renderBlankObject())
          }
        </div>
      )}
      {renderConfirmPopup(props.dataOfSchedule)}
    </>
  )
}

const mapStateToProps = ({ dataCalendarGrid, dataCreateEditSchedule }: IRootState) => ({
  // isDraggingSchedule: dataCalendarGrid.isDraggingSchedule,
  typeShowGrid: dataCalendarGrid.typeShowGrid,
  validatingScheduleId: dataCreateEditSchedule.scheduleValidatingId,
  // validateSuccess: dataCreateEditSchedule.validateSchedule
});


const mapDispatchToProps = {
  // handleDragging,
  validateSchedule,
  validateTask,
  validateMileStone,
  updateSchedule,
  updateTask,
  updateMileStone,
  handleDragging
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemScheduleInDay);
