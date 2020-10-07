import React, { useEffect, CSSProperties, useState } from 'react'
import { DataOfResource, CalenderViewMonthCommon } from '../common'
import { LocalNavigation, OPACITY_DRAGGING } from '../../constants';
import { RenderResource } from './render-resource';
import { DrapDropInHour } from '../grid-drap-drop/grid-drap-drop-in-hour';
import { Rnd } from "react-rnd";
import { ResizeDirection } from "re-resizable";
import moment from 'moment';
import { IRootState } from 'app/shared/reducers';
import { callAppCheckDuplicatedEquipments, validateSchedule } from "app/modules/calendar/popups/create-edit-schedule.reducer";
import { connect } from 'react-redux';
import EquipmentConfirm from "./popups/equipment-confirm";
import EquipmentError from "./popups/equipment-error";
import CalendarUpdateConfirm from "app/modules/calendar/modal/calendar-update";

type IItemResourceInDayProp = StateProps & DispatchProps & {
  modeView: boolean,
  widthOfTd: number,
  heightOfTd: number,
  dataOfResource?: DataOfResource,
  localNavigation: LocalNavigation; // information view left  (view color)
  source?: any,
  drag?: any,
}

const ItemResourceInDay = (props: IItemResourceInDayProp) => {
  const [showPopupConfirm, setShowPopupConfirm] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [hideModeMonth, setHideModeMonth] = useState(false)
  const [aryDraggingDate, setAryDraggingDate] = useState([null, null])

  const sTop = ((props.heightOfTd / 60) * props.dataOfResource.startDateSortMoment.minute()) + 1;
  const sHeightIn15 = ((props.heightOfTd / 60) * 15);
  const sHeight = Math.max(((props.heightOfTd / 60) * props.dataOfResource.height), sHeightIn15) - 1 - 2;
  const sWidth = Math.floor(props.dataOfResource.width / 100 * props.widthOfTd) - 1 - 1;
  const sLeft = Math.floor(props.dataOfResource.left / 100 * props.widthOfTd) + 1;

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
        props.callAppCheckDuplicatedEquipments(props.dataOfResource, 0, [equipments]);
      }
    }
  }

  const handleCallbackOk = (flagUpdate) => {
    const equipments = {
      equipmentId: props.dataOfResource.resourceId,
      startTime: props.dataOfResource.startDate,
      endTime: props.dataOfResource.finishDate
    }
    props.callAppCheckDuplicatedEquipments(props.dataOfResource, flagUpdate, [equipments]);
    setShowPopupConfirm(false)
  }

  const opacity = isDragging ? OPACITY_DRAGGING : 0;
  const zIndexRnd = isDragging || isResizing ? 10000 : 1;
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
    // const schedule: DataOfSchedule = props.dataOfSchedule;
    if (aryNewDate) {
      const newStartDate: moment.Moment = aryNewDate[0].clone(), newEndDate: moment.Moment = aryNewDate[1].clone();
      // console.log('updateData Date', newStartDate.format('YYYY/MM/DD H:m:0'), newEndDate.format('YYYY/MM/DD H:m:0'))
      if (CalenderViewMonthCommon.compareDateByDay(newStartDate, props.dataOfResource.startDateMoment) !== 0) {
        setHideModeMonth(true);
      } else {
        setHideModeMonth(false);
      }

      props.dataOfResource.startDate = newStartDate.toDate()
      props.dataOfResource.finishDate = newEndDate.toDate();
      props.validateSchedule(props.dataOfResource.scheduleId, props.dataOfResource.uniqueId, callbackValidate, true);
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
    DrapDropInHour.beginDragWithPos(props.dataOfResource,
      {
        x: (e as MouseEvent).clientX,
        y: (e as MouseEvent).clientY,
      }
    );

    setIsDragging(true);
    setRndSize({ ...defaultSize, width: props.widthOfTd - 1})
    setRndPosition({ ...defaultPosition, x: 1 })
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
    DrapDropInHour.hover(
      {
        x: (e as MouseEvent).clientX,
        y: (e as MouseEvent).clientY,
      },
      snapX, snapY
    );
    setAryDraggingDate(DrapDropInHour.getDraggingDate())
  }

  /**
   * called on dragging stop.
   * @param e
   * @param data
   */
  const onDragStop = (e, data) => {
    e.preventDefault();
    // console.log('onDragStop', e, e.clientX, e.clientY)
    const aryNewDate: [moment.Moment, moment.Moment] = DrapDropInHour.endDrag(props.dataOfResource);
    updateData(aryNewDate);

    setIsDragging(false);
    setRndSize({ ...defaultSize })
    setRndPosition({...defaultPosition})
    // rndRef.updatePosition({...defaultPosition});
    setAryDraggingDate([null, null])
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
    DrapDropInHour.beginDragWithPos(props.dataOfResource,
      {
        x: (e as MouseEvent).clientX,
        y: (e as MouseEvent).clientY,
      }
    );
    setIsResizing(true);
    // setRndSize({ ...defaultSize, width: props.widthOfTd - 1})
    // setRndPosition({ ...defaultPosition, x: 1 })
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
    const aryNewDate: [moment.Moment, moment.Moment] = DrapDropInHour.endDrag(props.dataOfResource);
    updateData(aryNewDate);
    setIsResizing(false);
    setRndSize({ ...defaultSize })
    setRndPosition({...defaultPosition})
    // setRndSize({...defaultSize})
    setAryDraggingDate([null, null])
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
      {showPopupConfirm && props.dataOfResource.isRepeat &&
        <CalendarUpdateConfirm callbackOnOk={handleCallbackOk} callbackOnCancel={() => setShowPopupConfirm(false)} isResource={true} hideModeMonth={hideModeMonth}/>}

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
          props.dataOfResource.isShow &&
          (
            <RenderResource
              dataOfResource={props.dataOfResource}
              prefixKey={'item-resource'}
              isShowStart={true}
              isShowEnd={true}
              formatStart={'HH:mm'}
              formatEnd={'HH:mm'}
              modeInHour={true}

              width={'100%'}
              left={'0%'}
              top={'0px'}
              height={'100%'}

              startDateDragging={aryDraggingDate[0]}
              endDateDragging={aryDraggingDate[1]}
              modeView={props.modeView}
            />
          )
        }
      </Rnd>

      {isDragging && (
        <div style={{ ...styleSchedule, opacity }}>
          {
            props.dataOfResource.isShow &&
            (
              <RenderResource
                dataOfResource={props.dataOfResource}
                prefixKey={'item-resource'}
                isShowStart={true}
                isShowEnd={true}
                formatStart={'HH:mm'}
                formatEnd={'HH:mm'}
                modeInHour={true}

                width={'100%'}
                left={'0%'}
                top={'0px'}
                height={'100%'}
                modeView={props.modeView}
              />
            )
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
  validatingScheduleId: dataCreateEditSchedule.scheduleValidatingId
});

const mapDispatchToProps = {
  // handleDragging
  validateSchedule,
  callAppCheckDuplicatedEquipments
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemResourceInDay);
