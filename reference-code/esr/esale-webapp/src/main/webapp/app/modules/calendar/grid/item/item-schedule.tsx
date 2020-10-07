import React, { useEffect, useState, CSSProperties } from 'react'

import { connect } from 'react-redux'
import { DataOfSchedule, CalenderViewMonthCommon } from '../common'
import { LocalNavigation, ItemTypeSchedule, OPACITY_DRAGGING, HIGHT_OF_SCHEDULE } from '../../constants'
import RenderSchedule from './render-schedule'
import RenderTask from './render-task'
import RenderMilestone from './render-milestone'
import { Rnd } from "react-rnd";
import { DrapDropInMonth } from '../grid-drap-drop/grid-drap-drop-month';
import { ItemCalendar } from './item-calendar'
import moment from 'moment'
import { IRootState } from 'app/shared/reducers'
import { handleReloadData, handleDragging, handleUpdateItemDragging } from '../../grid/calendar-grid.reducer'
import {
  validateSchedule,
  validateTask,
  validateMileStone,
  updateSchedule,
  updateTask,
  updateMileStone,
} from '../../popups/create-edit-schedule.reducer'
import CalendarUpdateConfirm from '../../modal/calendar-update'

interface IItemScheduleProp extends StateProps, DispatchProps {
  modeView: boolean,
  dataOfSchedule: DataOfSchedule,
  key: string,
  localNavigation: LocalNavigation,
  disableDragging?: boolean,
  optionAll: boolean,

  formatNormalStart?: string,
  formatNormalEnd?: string,

  formatFullDayStart?: string,
  formatFullDayEnd?: string,

  formatOverDayStart?: string,
  formatOverDayEnd?: string,

  top?: string,
  left?: string,
  width?: string,
  height?: string,

  widthOfTd?: number,
  heightOfDivDate?: number
}

const ItemSchedule = (props: IItemScheduleProp) => {
  const [showPopupConfirm, setShowPopupConfirm] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  // const [aryDraggingItem, setAryDraggingItem] = useState([])
  const [isRefDragging, setIsRefDragging] = useState(false)

  const sTop = props.heightOfDivDate + HIGHT_OF_SCHEDULE * props.dataOfSchedule.sort;
  const sWidth = props.widthOfTd * props.dataOfSchedule.numOverDay - 2 - 1;
  const paddingLeft = 1;
  const styleSchedule: CSSProperties = {
    position: "absolute",
    top: sTop,
    left: paddingLeft,
    width: sWidth + 'px',
    height: HIGHT_OF_SCHEDULE,
    zIndex: 1
  };

  const renderObject = (schedule: DataOfSchedule) => {
    if (schedule.itemType === ItemTypeSchedule.Milestone) {
      return (
        <>
          <RenderMilestone
            dataOfSchedule={schedule}
            prefixKey={'item-Milestone'}
            localNavigation={props.localNavigation}

            top={props.top}
            left={props.left}
            width={props.width || sWidth + 'px'}
            height={props.height}

            showArrow={true}
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

            top={props.top}
            left={props.left}
            width={props.width || sWidth + 'px'}
            height={props.height}

            showArrow={true}
            modeView={props.modeView}
          />
        </>
      );
    }
    if (schedule.itemType === ItemTypeSchedule.Schedule) {
      return (
        <>
          <RenderSchedule
            dataOfSchedule={schedule}
            prefixKey={'item-schedule'}
            localNavigation={props.localNavigation}

            formatNormalStart={props.formatNormalStart}
            formatNormalEnd={props.formatNormalEnd}

            formatFullDayStart={props.formatFullDayStart}
            formatFullDayEnd={props.formatFullDayEnd}

            formatOverDayStart={props.formatOverDayStart}
            formatOverDayEnd={props.formatOverDayEnd}

            top={props.top}
            left={props.left}
            width={props.width || sWidth + 'px'}
            height={props.height}

            showArrow={true}

            modeView={props.modeView}
          />
        </>
      );
    }
  }

  const renderPopupConfirm = (schedule: DataOfSchedule) => {

    const onOkUpdateSchedule = (flagUpdate) => {
      schedule.updateFlag = flagUpdate
      props.updateSchedule(schedule, true);
      // props.handleReloadData(props.typeShowGrid, schedule)
      setShowPopupConfirm(false)
    }
    const onOkUpdateTask = (flagUpdate) => {
      schedule.updateFlag = flagUpdate
      props.updateTask(schedule);
      // props.handleReloadData(props.typeShowGrid, schedule)
      setShowPopupConfirm(false)
    }
    const onOkUpdateMileStone = (flagUpdate) => {
      schedule.updateFlag = flagUpdate
      props.updateMileStone(schedule);
      // props.handleReloadData(props.typeShowGrid, schedule)
      setShowPopupConfirm(false)
    }
    if (schedule.itemType === ItemTypeSchedule.Milestone) {
      return (
        <>
          {showPopupConfirm && schedule.isRepeat &&
            <CalendarUpdateConfirm callbackOnOk={onOkUpdateMileStone} callbackOnCancel={() => setShowPopupConfirm(false)} 
              hideModeMonth={true}
            />}
        </>
      );
    }
    if (schedule.itemType === ItemTypeSchedule.Task) {
      return (
        <>
          {showPopupConfirm && schedule.isRepeat &&
            <CalendarUpdateConfirm callbackOnOk={onOkUpdateTask} callbackOnCancel={() => setShowPopupConfirm(false)} 
            hideModeMonth={true}
          />}
        </>
      );
    }
    if (schedule.itemType === ItemTypeSchedule.Schedule) {
      return (
        <>
          {showPopupConfirm && schedule.isRepeat &&
            <CalendarUpdateConfirm callbackOnOk={onOkUpdateSchedule} callbackOnCancel={() => setShowPopupConfirm(false)} 
            hideModeMonth={true}
          />}
        </>
      );
    }
  }

  // useEffect(() => {
  //   if (props.validateSuccess && !showPopupConfirm && props.dataOfSchedule.uniqueId === props.validatingScheduleId) {
  //     if (props.dataOfSchedule.isRepeat)
  //       setShowPopupConfirm(true)
  //   }
  // }, [props.validateSuccess])

  useEffect(() => {
    if (props.idDraggingScheduleInMonth === props.dataOfSchedule.uniqueId) {
      setIsRefDragging(false);
    } else {
      setIsRefDragging(CalenderViewMonthCommon.checkScheduleRefInMonth(
        props.dataOfSchedule.uniqueId,
        props.idDraggingScheduleInMonth,
        props.dataOfMonth
      ));
    }
  }, [props.idDraggingScheduleInMonth])

  let isViewDetail: boolean;
  // if (props.dataOfSchedule.itemType === ItemTypeSchedule.Schedule) {
  //   isViewDetail = ItemCalendar.isViewDetailSchedule(props.dataOfSchedule)
  // }

  // if (props.dataOfSchedule.itemType === ItemTypeSchedule.Milestone) {
  //   isViewDetail = ItemCalendar.isViewDetailMilestone(props.dataOfSchedule)
  // }
  // if (props.dataOfSchedule.itemType === ItemTypeSchedule.Task) {
  //   isViewDetail = ItemCalendar.isViewDetailTask(props.dataOfSchedule)
  // }

  const opacity = isDragging || isRefDragging ? OPACITY_DRAGGING : 0;
  const zIndexRnd = isDragging ? 100 : 1;

  /**
   * Default position and size of schedule
   */
  const defaultPosition = {
    y: sTop,
    x: paddingLeft + 1
  };
  const defaultSize = {
    width: sWidth,
    height: HIGHT_OF_SCHEDULE
  }
  const [rndPosition, setRndPosition] = useState({ ...defaultPosition })
  const [rndSize, setRndSize] = useState({ ...defaultSize })
  const [snapX, setSnapX] = useState(props.widthOfTd)
  const snapY = HIGHT_OF_SCHEDULE;

  useEffect(() => {
    setRndPosition({ ...defaultPosition })
    setRndSize({ ...defaultSize })
    setSnapX(props.widthOfTd)
  }, [props.widthOfTd]);

  /**
   * Object ref to RND
   */
  // let rndRef = null;

  /**
   * Update new date when stop drag or stop resize
   * @param aryNewDate 
   */
  const updateData = (aryNewDate: [moment.Moment, moment.Moment]) => {
    // props.handleDragging(false);
    if (aryNewDate) {
      const schedule: DataOfSchedule = props.dataOfSchedule;
      const newStartDate: moment.Moment = aryNewDate[0].clone(), newEndDate: moment.Moment = aryNewDate[1].clone();

      newStartDate.hour(schedule.startDateMoment.hour()).minute(schedule.startDateMoment.minute());
      newEndDate.hour(schedule.finishDateMoment.hour()).minute(schedule.finishDateMoment.minute());
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
    }
  }

  /**
   * Callback called on dragging start.
   * @param e 
   * @param data 
   */
  const onDragStart = (e, data) => {
    e.preventDefault();
    DrapDropInMonth.beginDragWithPos(props.dataOfSchedule,
      {
        x: (e as MouseEvent).clientX,
        y: (e as MouseEvent).clientY,
      }
    );

    setIsDragging(true);
    props.handleDragging(props.dataOfSchedule.uniqueId)
    props.handleUpdateItemDragging(DrapDropInMonth.getItemPreview() || []);

    // console.log('onDragStart', e, e.clientX, e.clientY)
  }

  /**
   * Callback called on dragging
   * @param e 
   * @param data 
   */
  const onDrag = (e, data) => {
    e.preventDefault();
    setIsMoving(true)
    DrapDropInMonth.hover(
      {
        x: (e as MouseEvent).clientX,
        y: (e as MouseEvent).clientY,
      },
      snapX, snapY
    );
    // console.log('onDrag', e, e.clientX, e.clientY)
    // const [startNewDate, endNewDate] = DrapDropInMonth.getDraggingDate();
    props.handleUpdateItemDragging(DrapDropInMonth.getItemPreview() || []);
  }

  /**
   * called on dragging stop.
   * @param e 
   * @param data 
   */
  const onDragStop = (e, data) => {
    e.preventDefault();
    // console.log('onDragStop', e, e.clientX, e.clientY)

    const aryNewDate: [moment.Moment, moment.Moment] = DrapDropInMonth.endDrag();
    updateData(aryNewDate);
    setIsDragging(false);

    setRndPosition({ ...defaultPosition })
    setRndSize({ ...defaultSize })

    props.handleUpdateItemDragging([]);

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
    cursor: !props.disableDragging  || !props.modeView ? "pointer" : null,
    zIndex: 1
  };

  return (
    <>
      {!isRefDragging && props.dataOfSchedule.isShow && (
        /* layer dragging (when dragging set opacity = 0) */
        <Rnd style={{ ...styleRnd, opacity: isDragging ? 0 : 1, zIndex: zIndexRnd }} 
          enableResizing={{
            right: false,
            left: false,
            top: false,
            bottom: false,
          }}
          dragGrid={[snapX, snapY]}
          position={rndPosition}
          size={rndSize}
          disableDragging={!!props.disableDragging || !!props.modeView}

          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragStop={onDragStop}

          bounds={'.table-calendar-schedule '}
        >
          {
            renderObject(props.dataOfSchedule)
          }
        </Rnd>
      )}

      {(isDragging || isRefDragging) && props.dataOfSchedule.isShow && (
        /* layer opacity=0.5 when dragging */
        <div style={{ ...styleSchedule, opacity }} className={'calendar-schedule-drag'}>
          {
            renderObject(props.dataOfSchedule)
          }
        </div>
      )}
      {renderPopupConfirm(props.dataOfSchedule)}
    </>
  )
}


const mapStateToProps = ({ dataCalendarGrid, dataCreateEditSchedule }: IRootState) => ({
  // isDraggingSchedule: dataCalendarGrid.isDraggingSchedule,
  typeShowGrid: dataCalendarGrid.typeShowGrid,
  // validateSuccess: dataCreateEditSchedule.validateSchedule,
  validatingScheduleId: dataCreateEditSchedule.scheduleValidatingId,
  idDraggingScheduleInMonth: dataCalendarGrid.idDraggingScheduleInMonth,
  dataOfMonth: dataCalendarGrid.dataOfMonth
});

const mapDispatchToProps = {
  // handleDragging,
  validateSchedule,
  validateTask,
  validateMileStone,
  updateSchedule,
  updateTask,
  updateMileStone,
  handleReloadData,
  handleDragging,
  handleUpdateItemDragging
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemSchedule);