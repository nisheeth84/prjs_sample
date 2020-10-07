import React, { useEffect, useState, CSSProperties } from 'react'
import { DataOfResource, CalenderViewMonthCommon } from '../common'
import { OPACITY_DRAGGING, PADDING_OF_SCHEDULE_IN_LIST_VIEW, HIGHT_OF_SCHEDULE_IN_LIST_VIEW } from '../../constants';
import { RenderResource } from '../item/render-resource'
import moment from 'moment';
import { Rnd } from "react-rnd";
import { IRootState } from 'app/shared/reducers';
import { callAppCheckDuplicatedEquipments, validateSchedule } from "app/modules/calendar/popups/create-edit-schedule.reducer";
import { connect } from 'react-redux';
import EquipmentConfirm from "./popups/equipment-confirm";
import EquipmentError from "./popups/equipment-error";
import CalendarUpdateConfirm from "app/modules/calendar/modal/calendar-update";
import { DrapDropInList } from '../grid-drap-drop/grid-drap-drop-in-list';

type IItemResourceInListProp = StateProps & DispatchProps & {
    modeView: boolean,
    dataOfResource: DataOfResource,
    heightOfTd?: number,
    heightOfSchedule?: number,
    sortIndex?: number
}

const ItemResourceInList = (props: IItemResourceInListProp) => {
    const [showPopupConfirm, setShowPopupConfirm] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [draggingDate, setDraggingDate] = useState(null)

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

    const getMoveDate = (moveToDate: moment.Moment) => {
        if (!moveToDate) return null;

        const diffDate = CalenderViewMonthCommon.getDaysDiff(moveToDate, props.dataOfResource.startDateSortMoment);
        let newStartDate: moment.Moment = null, newEndDate: moment.Moment = null;
        if (diffDate !== 0) {
            if (diffDate > 0) {
                newStartDate = props.dataOfResource.startDateMoment.clone().add(diffDate, 'day');
                newEndDate = props.dataOfResource.finishDateMoment.clone().add(diffDate, 'day');
            } else {
                newStartDate = props.dataOfResource.startDateMoment.clone().subtract(Math.abs(diffDate), 'day');
                newEndDate = props.dataOfResource.finishDateMoment.clone().subtract(Math.abs(diffDate), 'day');
            }

            return [newStartDate, newEndDate]
        }

        return null;
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

    // const sFormatStart = props.dataOfResource.isOverDay ? 'YYYY/MM/DD HH:mm' : 'HH:mm';

    const renderResource = (modeDragging: boolean) => {
        let sFormatStart = props.dataOfResource.isOverDay ? 'YYYY/MM/DD HH:mm' : 'HH:mm';
        let sFormatEnd = props.dataOfResource.isOverDay ? 'YYYY/MM/DD HH:mm' : 'HH:mm';
        if (!draggingDate) {
            if (props.dataOfResource.isOverDay && CalenderViewMonthCommon.compareDateByDay(props.dataOfResource.startDateSortMoment, props.dataOfResource.startDateMoment) === 0) {
                sFormatStart = 'HH:mm';
            }
            if (props.dataOfResource.isOverDay && CalenderViewMonthCommon.compareDateByDay(props.dataOfResource.startDateSortMoment, props.dataOfResource.finishDateMoment) === 0) {
                sFormatEnd = 'HH:mm';
            }
        }
        const [newStartDateDragging, newEndDateDragging] = getMoveDate(draggingDate) || [null, null];
        return (
            <RenderResource
                prefixKey={'_' + 'item-Resource-view-more'}
                key={'_' + props.dataOfResource.uniqueId}
                dataOfResource={props.dataOfResource}
                className={'calendar-schedule calendar-schedule-in-list-view-more'}
                isShowStart={true}
                isShowEnd={true}
                formatStart={sFormatStart}
                formatEnd={sFormatEnd}

                startDateDragging={modeDragging ? newStartDateDragging : null}
                endDateDragging={modeDragging ? newEndDateDragging : null}
                modeView={props.modeView}
            />
        )
    }



    const opacity = isDragging ? OPACITY_DRAGGING : 0;
    // const opacityRnd = isDragging ? 1 : 0;
    const zIndexRnd = isDragging ? 10000 : 1;
    const yPos = PADDING_OF_SCHEDULE_IN_LIST_VIEW + HIGHT_OF_SCHEDULE_IN_LIST_VIEW * props.sortIndex;

    const styleSchedule: CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        transform: 'translate(0px, ' + yPos + 'px)',
        width: '100%',
        height: HIGHT_OF_SCHEDULE_IN_LIST_VIEW,
        zIndex: 1
    };

    /**
     * Default position and size of schedule
     */
    const defaultPosition = {
        y: yPos,
        x: 0
    };
    const defaultSize = {
        width: '100%',
        height: HIGHT_OF_SCHEDULE_IN_LIST_VIEW
    }
    const [rndPosition, setRndPosition] = useState({ ...defaultPosition })
    const [rndSize, setRndSize] = useState({ ...defaultSize })

    useEffect(() => {
        setRndPosition({ ...defaultPosition })
        setRndSize({ ...defaultSize })
    }, [props.heightOfSchedule, props.sortIndex]);

    /**
     * Object ref to RND
     */
    let rndRef = null;

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
    const updateData = (moveToDate: moment.Moment) => {
        const [newStartDate, newEndDate] = getMoveDate(moveToDate) || [null, null];
        if (newStartDate && newEndDate) {
            // console.log('updateData Date', newStartDate.format('YYYY/MM/DD H:m:0'), newEndDate.format('YYYY/MM/DD H:m:0'));

            props.dataOfResource.startDate = newStartDate.toDate()
            props.dataOfResource.finishDate = newEndDate.toDate();
            props.validateSchedule(props.dataOfResource.scheduleId, props.dataOfResource.uniqueId, callbackValidate, true);
        }
    }

    /**
     * Callback called on dragging start.
     * @param e 
     * @param data 
     */
    const onDragStart = (e, data) => {
        e.preventDefault();

        setIsDragging(true);
    }

    /**
     * Callback called on dragging
     * @param e 
     * @param data 
     */
    const onDrag = (e, data) => {
        e.preventDefault();
        setDraggingDate(DrapDropInList.getDraggingDate({
            x: (e as MouseEvent).clientX,
            y: (e as MouseEvent).clientY,
        }));
    }

    /**
     * called on dragging stop.
     * @param e 
     * @param data 
     */
    const onDragStop = (e, data) => {
        e.preventDefault();
        // console.log('onDragStop', data)
        const moveToDate: moment.Moment = DrapDropInList.getDraggingDate({
            x: (e as MouseEvent).clientX,
            y: (e as MouseEvent).clientY,
        });
        updateData(moveToDate);
        setIsDragging(false);
        setDraggingDate(null);
    }

    const styleRnd: CSSProperties = {
        cursor: props.dataOfResource.isShow ? "pointer" : null,
        zIndex: zIndexRnd,
        opacity: 1
    };

    return (
        <>
            {showPopupConfirm && props.dataOfResource.isRepeat &&
                <CalendarUpdateConfirm callbackOnOk={handleCallbackOk} callbackOnCancel={() => setShowPopupConfirm(false)} isResource={true}  />}

            <Rnd style={styleRnd} ref={c => { rndRef = c; }}
                enableResizing={{
                    right: false,
                    left: false,
                    top: false,
                    bottom: false
                }}
                dragGrid={[1, HIGHT_OF_SCHEDULE_IN_LIST_VIEW / 2]}
                // resizeGrid={[1, sHeightIn15]}
                position={rndPosition}
                size={rndSize}
                // change REQ, not drag and drop schedule
                disableDragging={true}

                onDragStart={onDragStart}
                onDrag={onDrag}
                onDragStop={onDragStop}

                dragAxis={'y'}
                bounds={'.schedule-list-drag '}
            >
                {renderResource(true)}
            </Rnd>

            {isDragging && (
                /* layer when dragging */
                <div style={{ ...styleSchedule, opacity }}>
                    {
                        renderResource(false)
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
)(ItemResourceInList);
