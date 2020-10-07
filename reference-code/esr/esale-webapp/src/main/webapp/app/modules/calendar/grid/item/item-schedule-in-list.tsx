import React, { useEffect, CSSProperties, useState } from 'react'
import { connect } from 'react-redux'
import { DataOfSchedule, CalenderViewMonthCommon } from '../common'
import { LocalNavigation, ItemTypeSchedule, OPACITY_DRAGGING, HIGHT_OF_SCHEDULE_IN_LIST_VIEW, PADDING_OF_SCHEDULE_IN_LIST_VIEW } from '../../constants';
import RenderSchedule from '../item/render-schedule'
import RenderTask from '../item/render-task'
import RenderMilestone from '../item/render-milestone'
import { Rnd } from "react-rnd";
import moment from 'moment';
import { ItemCalendar } from './item-calendar';
import {
    validateSchedule,
    validateTask,
    validateMileStone,
    updateSchedule,
    updateTask,
    updateMileStone,
} from '../../popups/create-edit-schedule.reducer'
import CalendarUpdateConfirm from '../../modal/calendar-update'
import { IRootState } from 'app/shared/reducers';
import { DrapDropInList } from '../grid-drap-drop/grid-drap-drop-in-list';
import {  handleDragging } from '../../grid/calendar-grid.reducer'

type IItemScheduleInListProp = StateProps & DispatchProps & {
    modeView: boolean,
    dataOfSchedule: DataOfSchedule,
    localNavigation: LocalNavigation; // information view left (view color)
    heightOfTd?: number,
    heightOfSchedule?: number,
    sortIndex?: number
}

const ItemScheduleInList = (props: IItemScheduleInListProp) => {
    const [showPopupConfirm, setShowPopupConfirm] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [draggingDate, setDraggingDate] = useState(null)

    const getMoveDate = (moveToDate: moment.Moment) => {
        if (!moveToDate) return null;

        const diffDate = CalenderViewMonthCommon.getDaysDiff(moveToDate, props.dataOfSchedule.startDateSortMoment);
        let newStartDate: moment.Moment = null, newEndDate: moment.Moment = null;
        if (diffDate !== 0) {
            if (diffDate > 0) {
                newStartDate = props.dataOfSchedule.startDateMoment.clone().add(diffDate, 'day');
                newEndDate = props.dataOfSchedule.finishDateMoment.clone().add(diffDate, 'day');
            } else {
                newStartDate = props.dataOfSchedule.startDateMoment.clone().subtract(Math.abs(diffDate), 'day');
                newEndDate = props.dataOfSchedule.finishDateMoment.clone().subtract(Math.abs(diffDate), 'day');
            }

            return [newStartDate, newEndDate]
        }

        return null;
    }

    const renderSchedule = (schedule: DataOfSchedule, index: number) => {
        if (schedule.itemType === ItemTypeSchedule.Milestone) {
            return (
                <>
                    <RenderMilestone
                        prefixKey={index + '_' + 'item-milestone-view-more'}
                        key={index + '_' + schedule.uniqueId}
                        dataOfSchedule={schedule}
                        localNavigation={props.localNavigation}
                        className={'calendar-schedule calendar-schedule-in-list-view-more'}
                        modeView={props.modeView}
                    />
                </>
            );
        }
        if (schedule.itemType === ItemTypeSchedule.Task) {
            return (
                <>
                    <RenderTask
                        prefixKey={index + '_' + 'item-task-view-more'}
                        key={index + '_' + schedule.uniqueId}
                        dataOfSchedule={schedule}
                        localNavigation={props.localNavigation}
                        className={'calendar-schedule calendar-schedule-in-list-view-more'}
                        modeView={props.modeView}
                    />
                </>
            );
        }

        let formatOverDayStart = 'YYYY/MM/DD HH:mm';
        let formatOverDayEnd = 'YYYY/MM/DD HH:mm';
        if (!draggingDate) {
            if (schedule.isOverDay && CalenderViewMonthCommon.compareDateByDay(schedule.startDateSortMoment, schedule.startDateMoment) === 0) {
                formatOverDayStart = 'HH:mm';
            }
            if (schedule.isOverDay && CalenderViewMonthCommon.compareDateByDay(schedule.startDateSortMoment, schedule.finishDateMoment) === 0) {
                formatOverDayEnd = 'HH:mm';
            }
        }
        const [newStartDateDragging, newEndDateDragging] = getMoveDate(draggingDate) || [null, null];

        return (
            <>
                <RenderSchedule
                    prefixKey={index + '_' + 'item-schedule-view-more'}
                    key={index + '_' + schedule.uniqueId}
                    dataOfSchedule={schedule}
                    localNavigation={props.localNavigation}
                    className={'calendar-schedule calendar-schedule-in-list-view-more'}
                    formatNormalStart={'HH:mm'}
                    formatNormalEnd={'HH:mm'}
                    formatOverDayStart={formatOverDayStart}
                    formatOverDayEnd={formatOverDayEnd}
                    startDateDragging={newStartDateDragging}
                    endDateDragging={newEndDateDragging}
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
                        <CalendarUpdateConfirm callbackOnOk={onOkUpdateMileStone} callbackOnCancel={() => setShowPopupConfirm(false)} />}
                </>
            );
        }
        if (schedule.itemType === ItemTypeSchedule.Task) {
            return (
                <>
                    {showPopupConfirm && schedule.isRepeat &&
                        <CalendarUpdateConfirm callbackOnOk={onOkUpdateTask} callbackOnCancel={() => setShowPopupConfirm(false)} />}
                </>
            );
        }

        // let formatOverDayStart = 'YYYY/MM/DD HH:mm';
        // let formatOverDayEnd = 'YYYY/MM/DD HH:mm';
        // if (!draggingDate) {
        //     if (schedule.isOverDay && CalenderViewMonthCommon.compareDateByDay(schedule.startDateSortMoment, schedule.startDateMoment) === 0) {
        //         // formatOverDayStart = 'HH:mm';
        //     }
        //     if (schedule.isOverDay && CalenderViewMonthCommon.compareDateByDay(schedule.startDateSortMoment, schedule.finishDateMoment) === 0) {
        //         // formatOverDayEnd = 'HH:mm';
        //     }
        // }
        // const [newStartDateDragging, newEndDateDragging] = getMoveDate(draggingDate) || [null, null];

        return (
            <>
                {showPopupConfirm && schedule.isRepeat &&
                    <CalendarUpdateConfirm callbackOnOk={onOkUpdateSchedule} callbackOnCancel={() => setShowPopupConfirm(false)} />}
            </>
        );
    }

    let isViewDetail: boolean;
    if (props.dataOfSchedule.itemType === ItemTypeSchedule.Schedule) {
        isViewDetail = ItemCalendar.isViewDetailSchedule(props.dataOfSchedule)
    }
    if (props.dataOfSchedule.itemType === ItemTypeSchedule.Milestone) {
        // itemType = ItemTypeDrag.MilestoneFullDay;
        isViewDetail = ItemCalendar.isViewDetailMilestone(props.dataOfSchedule)
    }
    if (props.dataOfSchedule.itemType === ItemTypeSchedule.Task) {
        // itemType = ItemTypeDrag.TaskFullDay;
        isViewDetail = ItemCalendar.isViewDetailTask(props.dataOfSchedule)
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
    const [isMoving, setIsMoving] = useState(false)

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
        const schedule: DataOfSchedule = props.dataOfSchedule;
        const [newStartDate, newEndDate] = getMoveDate(moveToDate) || [null, null];
        if (newStartDate && newEndDate) {
            // console.log('updateData Date', newStartDate.format('YYYY/MM/DD H:m:0'), newEndDate.format('YYYY/MM/DD H:m:0'));

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

        setIsDragging(true);
        props.handleDragging(props.dataOfSchedule.uniqueId)
    }

    /**
     * Callback called on dragging
     * @param e 
     * @param data 
     */
    const onDrag = (e, data) => {
        e.preventDefault();
        setIsMoving(true)
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
        cursor: props.dataOfSchedule.isShow && isViewDetail ? "pointer" : null,
        zIndex: zIndexRnd,
        opacity: 1
    };

    return (
        <>
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
                {
                    renderSchedule(props.dataOfSchedule, 0)
                }
            </Rnd>

            {isDragging && (
                /* layer when dragging */
                <div style={{ ...styleSchedule, opacity }}>
                    {
                        renderSchedule(props.dataOfSchedule, 0)
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
    validateSuccess: dataCreateEditSchedule.validateSchedule
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
)(ItemScheduleInList);