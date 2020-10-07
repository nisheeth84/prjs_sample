import React, { useEffect, useState, CSSProperties } from 'react'
import { connect } from 'react-redux'
import { DataOfResource, CalenderViewMonthCommon } from '../common'
import { RenderResource } from './render-resource'
// import { useDrag } from "react-dnd";
import { OPACITY_DRAGGING, HIGHT_OF_SCHEDULE } from '../../constants';
import { DrapDropInMonth } from '../grid-drap-drop/grid-drap-drop-month';
// import { getEmptyImage } from "react-dnd-html5-backend";
import { Rnd } from "react-rnd";
import moment from 'moment';
import { IRootState } from 'app/shared/reducers'
import { callAppCheckDuplicatedEquipments, validateSchedule } from "app/modules/calendar/popups/create-edit-schedule.reducer";
import CalendarUpdateConfirm from "app/modules/calendar/modal/calendar-update";
// import { translate } from "react-jhipster";
import EquipmentConfirm from "./popups/equipment-confirm";
import EquipmentError from "./popups/equipment-error";
// import { handleDragging } from '../../grid/calendar-grid.reducer'
import { handleDragging, handleUpdateItemDragging } from '../../grid/calendar-grid.reducer'
import {CalendarView} from '../../constants';

interface IItemResourceProp extends StateProps, DispatchProps {
  modeView: boolean,
  dataOfResource: DataOfResource,
  key: string,
  optionAll: boolean,
  isShowStart: boolean,
  formatStart: string,
  isShowEnd: boolean,
  formatEnd: string

  top?: string,
  left?: string,
  width?: string,
  height?: string,

  widthOfTd?: number,
  heightOfTd?: number,
  heightOfDivDate?: number,
  disableDragging?: boolean,
}

const ItemResource = (props: IItemResourceProp) => {
  const [showPopupConfirm, setShowPopupConfirm] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  // const [aryDraggingItem, setAryDraggingItem] = useState([])
  const [isRefDragging, setIsRefDragging] = useState(false)

  const sTop = props.heightOfDivDate + HIGHT_OF_SCHEDULE * props.dataOfResource.sort;
  const sWidth = props.widthOfTd * props.dataOfResource.numOverDay - 2 - 1;
  const paddingLeft = 1;
  const styleSchedule: CSSProperties = {
    position: "absolute",
    top: sTop,
    left: paddingLeft,
    width: sWidth + 'px',
    height: HIGHT_OF_SCHEDULE,
    zIndex: 1
  };
  // const renderBlankObject = () => {
  //   return (<div className="calendar-schedule calendar-schedule-blank"></div>)
  // }
  const callbackValidate = (flgResult: boolean) => {
    if (flgResult) {
      if (props.dataOfResource.isRepeat)
        setShowPopupConfirm(true)
      else {
        const equipments = {
          equipmentId: props.dataOfResource.resourceId,
          startTime: props.dataOfResource.startDate,
          endTime: props.dataOfResource.finishDate
        }
        props.callAppCheckDuplicatedEquipments(props.dataOfResource, 0, [equipments], CalendarView.Month);
      }
    }
  }

  useEffect(() => {
    if (props.idDraggingScheduleInMonth === props.dataOfResource.uniqueId) {
      setIsRefDragging(false);
    } else {
      setIsRefDragging(CalenderViewMonthCommon.checkResourceRefInMonth(
        props.dataOfResource.uniqueId,
        props.idDraggingScheduleInMonth,
        props.dataOfMonth
      ));
    }
  }, [props.idDraggingScheduleInMonth])

  // const [{ isDragging }, drag, preview] = useDrag({
  //   item: { type: ItemTypeDrag.ResourceFullDay, data: props.dataOfResource },
  //   collect: monitor => ({
  //     isDragging: monitor.isDragging()
  //   }),
  //   canDrag() {
  //     return props.dataOfResource.isShow
  //   },
  //   // isDragging(monitor) {
  //   //   return props.isDraggingSchedule === true
  //   // },
  //   end(item, monitor) {
  //     const aryNewDate: [moment.Moment, moment.Moment] = DrapDropInMonth.endDrag(props.dataOfResource, monitor);
  //     // props.handleDragging(false);
  //     if (aryNewDate && monitor.getDropResult()) {
  //       const schedule: DataOfResource = props.dataOfResource;
  //       const newStartDate: moment.Moment = aryNewDate[0].clone(), newEndDate: moment.Moment = aryNewDate[1].clone();

  //       newStartDate.hour(schedule.startDateMoment.hour()).minute(schedule.startDateMoment.minute());
  //       newEndDate.hour(schedule.startDateMoment.hour()).minute(schedule.startDateMoment.minute());
  //       props.dataOfResource.finishDate = newEndDate.toDate()
  //       props.dataOfResource.startDate = newStartDate.toDate()

  //       props.validateSchedule(schedule.scheduleId);
  //     }
  //   },
  //   begin(monitor) {
  //     DrapDropInMonth.beginDrag(props.dataOfResource, monitor);
  //     // props.handleDragging(true);
  //   }
  // });

  // useEffect(() => {
  //   preview(getEmptyImage(), { captureDraggingState: false });
  // }, []);

  // const opacity = isDragging ? OPACITY_DRAGGING : 1;

  const handleCallbackOk = (flagUpdate) => {
    const equipments = {
      equipmentId: props.dataOfResource.resourceId,
      startTime: props.dataOfResource.startDate,
      endTime: props.dataOfResource.finishDate
    }
    props.callAppCheckDuplicatedEquipments(props.dataOfResource, flagUpdate, [equipments], CalendarView.Month);
    setShowPopupConfirm(false)
  }

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
  }, [props.widthOfTd, props.heightOfTd]);

  /**
   * Object ref to RND
   */
  // let rndRef = null;

  /**
   * Reset Position and Size of schedule
   */
  // const resetDragOrResize = () => {
  //   rndRef.updateSize(defaultSize);
  //   rndRef.updatePosition(defaultPosition);
  // }

  /**
   * Update new date when stop drag or stop resize
   * @param aryNewDate 
   */
  const updateData = (aryNewDate: [moment.Moment, moment.Moment]) => {
    // props.handleDragging(false);
    if (aryNewDate) {
      const schedule: DataOfResource = props.dataOfResource;
      const newStartDate: moment.Moment = aryNewDate[0].clone(), newEndDate: moment.Moment = aryNewDate[1].clone();

      newStartDate.hour(schedule.startDateMoment.hour()).minute(schedule.startDateMoment.minute());
      newEndDate.hour(schedule.startDateMoment.hour()).minute(schedule.startDateMoment.minute());
      props.dataOfResource.finishDate = newEndDate.toDate()
      props.dataOfResource.startDate = newStartDate.toDate()

      props.validateSchedule(schedule.scheduleId, schedule.uniqueId, callbackValidate, true);
    }
  }

  /**
   * Callback called on dragging start.
   * @param e 
   * @param data 
   */
  const onDragStart = (e, data) => {
    e.preventDefault();
    DrapDropInMonth.beginDragWithPos(props.dataOfResource,
      {
        x: (e as MouseEvent).clientX,
        y: (e as MouseEvent).clientY,
      }
    );

    setIsDragging(true);
    props.handleDragging(props.dataOfResource.uniqueId)
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
    cursor: (!props.disableDragging && props.dataOfResource.isShow) || !props.modeView ? "pointer" : null,
    zIndex: 1
  };

  return (
    <>
      {showPopupConfirm && props.dataOfResource.isRepeat &&
        <CalendarUpdateConfirm callbackOnOk={handleCallbackOk} callbackOnCancel={() => setShowPopupConfirm(false)} isResource={true} 
        hideModeMonth={true}
        />}

      {!isRefDragging && props.dataOfResource.isShow && (
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
            <RenderResource
              dataOfResource={props.dataOfResource}
              prefixKey={'item-resource'}
              isShowStart={props.isShowStart}
              isShowEnd={props.isShowEnd}
              formatStart={props.formatStart}
              formatEnd={props.formatEnd}

              top={props.top}
              left={props.left}
              width={props.width || sWidth + 'px'}
              height={props.height}

              showArrow={true}
              modeView={props.modeView}
            />
          }
        </Rnd>
      )}


      {(isDragging || isRefDragging) && props.dataOfResource.isShow && (
        /* layer opacity=0.5 when dragging */
        <div style={{ ...styleSchedule, opacity }} className={'calendar-schedule-drag'}>
          {
            <RenderResource
              dataOfResource={props.dataOfResource}
              prefixKey={'item-resource'}
              isShowStart={props.isShowStart}
              isShowEnd={props.isShowEnd}
              formatStart={props.formatStart}
              formatEnd={props.formatEnd}

              top={props.top}
              left={props.left}
              width={props.width || sWidth + 'px'}
              height={props.height}

              showArrow={true}
              modeView={props.modeView}
            />
          }
        </div>
      )}

      <EquipmentConfirm dataOfResource={props.dataOfResource} isEdit={true} isDrag={true}/>
      <EquipmentError dataOfResource={props.dataOfResource} isEdit={true} isDrag={true}/>
    </>
  )
}

const mapStateToProps = ({ dataCalendarGrid, dataCreateEditSchedule }: IRootState) => ({
  // isDraggingSchedule: dataCalendarGrid.isDraggingSchedule
  validateSuccess: dataCreateEditSchedule.validateSchedule,
  validatingScheduleId: dataCreateEditSchedule.scheduleValidatingId,
  idDraggingScheduleInMonth: dataCalendarGrid.idDraggingScheduleInMonth,
  dataOfMonth: dataCalendarGrid.dataOfMonth
});

const mapDispatchToProps = {
  // handleDragging
  validateSchedule,
  callAppCheckDuplicatedEquipments,
  handleDragging,
  handleUpdateItemDragging
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemResource);
