
import React, { useRef, useEffect } from 'react'
import { translate } from 'react-jhipster';

import { connect } from 'react-redux'
import { DataOfSchedule } from '../common'
import { LocalNavigation, CalendarView } from '../../constants';
import { ItemCalendar, SignalType, ViewPermission, ColorType } from './item-calendar'
import { IRootState } from 'app/shared/reducers'
import { showModalSubDetail, showModalDetail, hideModalSubDetail } from '../../modal/calendar-modal.reducer'
import moment from 'moment'
import { XYCoord } from 'react-dnd';


interface IRenderSchedule extends StateProps, DispatchProps {
    modeView: boolean,
    dataOfSchedule: DataOfSchedule,
    localNavigation: LocalNavigation,
    prefixKey: string,
    className?: string,
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

    showArrow?: boolean,

    modeInHour?: boolean
    onDoubleClick?: (scheduleId: number) => void

    startDateDragging?: moment.Moment
    endDateDragging?: moment.Moment
}

const RenderSchedule = (props: IRenderSchedule) => {
    let className = props.className || ' calendar-schedule ';
    const plan = ItemCalendar.getPlanOfSchedule(props.dataOfSchedule, props.modeInHour);
    const styleTitle = { color: null, };
    if (plan.textColor !== ColorType.None) {
        styleTitle.color = ItemCalendar.getColor(plan.textColor, props.dataOfSchedule, props.localNavigation);
    }

    if ((props.showArrow === undefined || props.showArrow) && (props.dataOfSchedule.isStartPrevious)) {
        className += ItemCalendar.getBorderClass(plan.boderInfo.type);
        className += ' has-arrow-left ';
    }
    if ((props.showArrow === undefined || props.showArrow) && (props.dataOfSchedule.isEndNext)) {
        className += ItemCalendar.getBorderClass(plan.boderInfo.type);
        className += ' has-arrow-right ';
    }

    if (props.modeInHour) {
        className += ' calendar-schedule-time '
    }

    // let classContent = 'calendar-schedule-content';
    if (plan.isDashLine === ViewPermission.Available) {
        className += ' line-through ';
    }

    if (props.dataOfSchedule.isOverDay) {
        className += ' over-day-schedule '
    } else if (props.dataOfSchedule.isFullDay) {
        className += ' full-day-schedule '
    } else {
        className += ' normal-schedule '
    }
    if (props.dataOfSchedule.isReportActivity) {
        className += ' report-activity '
    }

    const background = ItemCalendar.getColor(plan.bgColor, props.dataOfSchedule, props.localNavigation) || '#ffffff';
    const renderArrowLeft = (schedule: DataOfSchedule) => {
        if ((props.showArrow === undefined || props.showArrow) && schedule.isStartPrevious) {
            const boderColor = ItemCalendar.getColor(plan.boderInfo.color, schedule, props.localNavigation);
            const styleBorder = {
                background,
                borderLeftColor: boderColor,
                borderBottomColor: boderColor,
            };

            return (
                <div className={'box-conner'}>
                    <span className="arrow-left" style={styleBorder}></span>
                </div>
            )
        }
    }

    const renderArrowRight = (schedule: DataOfSchedule) => {
        if ((props.showArrow === undefined || props.showArrow) && schedule.isEndNext) {
            const boderColor = ItemCalendar.getColor(plan.boderInfo.color, schedule, props.localNavigation);
            const styleBorder = {
                background,
                borderRightColor: boderColor,
                borderTopColor: boderColor,
            };
            return (
                <div className={'box-conner'}>
                    <span className="arrow-right" style={styleBorder}></span>
                </div>
            )
        }
    }

    const renderScheduleSignal = (schedule: DataOfSchedule) => {
        if (plan.signalInfo.type !== SignalType.NotShow) {
            const classSignal = ItemCalendar.getClassSignal(plan.signalInfo.type);
            const bcolor = ItemCalendar.getColor(plan.signalInfo.bgColor, schedule, props.localNavigation) || 'transparent';
            if (plan.signalInfo.type === SignalType.Circle) {
                const objStyle = {
                    color: bcolor,
                    background: bcolor,
                    borderColor: ItemCalendar.getColor(plan.signalInfo.borderColor, schedule, props.localNavigation) || 'transparent'
                }
                return (<span className={classSignal} style={objStyle}></span>)
            }
            if (plan.signalInfo.type === SignalType.X) {
                const objStyle = {
                    color: bcolor
                }
                return (<span className={classSignal} style={objStyle}></span>)
            }
            if (plan.signalInfo.type === SignalType.Triangle) {
                const objStyle = {
                    borderBottomColor: bcolor
                }
                return (<span className={classSignal} style={objStyle}></span>)
            }
        }
    }

    const renderScheduleTime = (schedule: DataOfSchedule) => {
        const renderTime = (formatStart: string, formatEnd: string) => {
            if (formatStart || formatEnd) {
                const startDate = props.startDateDragging ? props.startDateDragging : schedule.startDateMoment;
                const endDate = props.endDateDragging ? props.endDateDragging : schedule.finishDateMoment;
                return (
                    <>
                        {formatStart && startDate && startDate.format(formatStart || 'HH:mm')}
                        {formatStart && formatEnd && (<>〜</>)}
                        {formatEnd && endDate && endDate.format(formatEnd || 'HH:mm')}
                    </>
                )
            }
        }
        if (plan.isViewTime === ViewPermission.Available) {
            if (props.modeInHour) {
                return (
                    <div className={`time ${props.typeShowGrid === CalendarView.List ? "pr-4" : ''}`} style={styleTitle}>
                        {renderTime(props.formatNormalStart, props.formatNormalEnd)}
                    </div>
                )
            }
            if (schedule.isOverDay) {
                return (
                    <span className={`time ${props.typeShowGrid === CalendarView.List ? "pr-4" : ''}`} style={styleTitle}>
                        {renderTime(props.formatOverDayStart, props.formatOverDayEnd)}
                    </span>
                )
            } else if (schedule.isFullDay) {
                return (
                    <span className={`time ${props.typeShowGrid === CalendarView.List ? "pr-4" : ''}`} style={styleTitle}>
                        {renderTime(props.formatFullDayStart, props.formatFullDayEnd)}
                    </span>
                )
            }
            return (
                <span className={`time ${props.typeShowGrid === CalendarView.List ? "pr-4" : ''}`} style={styleTitle}>
                    {renderTime(props.formatNormalStart, props.formatNormalEnd)}
                </span>
            )
        }
    }

    const renderScheduleIcon = (schedule: DataOfSchedule) => {
        if (plan.isViewIcon === ViewPermission.Available && schedule.itemIcon) {
            return (
                <>
                    {schedule.itemIcon && schedule.itemIcon.includes('http') ? (<img className="images-left icon-calendar icon-calendar-person zIndex" src={schedule.itemIcon} />)
                        : <img className="icon-calendar icon-calendar-person zIndex" src={`../../../../content/images/common/calendar/${schedule.itemIcon}`} />}
                </>
            )
        }
    }

    const renderTextFullDay = (schedule: DataOfSchedule) => {
        if (schedule.isFullDay) {
            return (<label className="title" style={styleTitle}>{translate('calendars.commons.textFullDay')}&nbsp;</label>)
        }
    }

    const renderScheduleTitle = (schedule: DataOfSchedule) => {
        if (plan.isViewtitle === ViewPermission.Available) {
            const titleSchedule = ItemCalendar.getTitleOfSchedule(schedule);
            // if (props.modeInHour) {
            //     return titleSchedule;
            // }
            return (
                <label className="title text-ellipsis z-index-global-2" style={{ ...styleTitle }} title={titleSchedule}>{titleSchedule}</label>
            )
        } else {
            return (
                <label className="title text-ellipsis z-index-global-2" style={{ ...styleTitle }}></label>
            )
        }
    }

    const renderSchedule = (schedule: DataOfSchedule) => {
        const buttonRef = useRef();
        const styleSchedule = {
            top: props.top || null,
            left: props.left || null,
            width: props.width || (ItemCalendar.getWidthOfObject(schedule) + '%'),
            height: props.height,
            zIndex: 1
        };
        let styleContent = {
            background,
        };

        const borderStyle = ItemCalendar.buildBorderStyle(plan.boderInfo.type, plan.boderInfo.color, schedule, props.localNavigation);
        styleContent = { ...styleContent, ...borderStyle }

        const onDoubleClick = () => {
            props.showModalDetail(schedule.itemId);
            props.hideModalSubDetail();
        }
        const isViewDetail: boolean = ItemCalendar.isViewDetailSchedule(props.dataOfSchedule);

        // useDoubleClick({
        //     /** A callback function for single click events */
        //     onSingleClick(e) {
        //         console.log('onSingleClick isViewDetail', isViewDetail, !props.idDraggingScheduleInMonth)
        //         !props.idDraggingScheduleInMonth && isViewDetail && props.showModalSubDetail(schedule.itemId, e.clientX, schedule.itemType)
        //     },
        //     /** A callback function for double click events */
        //     onDoubleClick(e) {
        //         // !props.idDraggingScheduleInMonth && 
        //         console.log('onDoubleClick isViewDetail', isViewDetail)
        //         isViewDetail && onDoubleClick()
        //     },
        //     /** (Required) Dom node to watch for double clicks */
        //     ref: buttonRef,
        //     /**
        //      * The amount of time (in milliseconds) to wait 
        //      * before differentiating a single from a double click
        //      */
        //     latency: 250
        // });

        // const isDraggingScheduleInMonth = () => {return props.idDraggingScheduleInMonth}

        useEffect(() => {
            // let isDblClick = false;
            let intervalDblClick = null;
            let isMoving = false;
            let clickXy: XYCoord = null;

            /**
             * handle mousemove
             */
            function handleMoving(event) {
                const deltaMove = 3;
                const moveXy =
                {
                    x: (event as MouseEvent).clientX,
                    y: (event as MouseEvent).clientY,
                }
                if (clickXy && (Math.abs(clickXy.x - moveXy.x) > deltaMove || Math.abs(clickXy.y - moveXy.y) > deltaMove)) {
                    // console.log('handleMoving isViewDetail', isViewDetail)
                    isMoving = true;
                }
            }

            /**
             * if clicked on inside of element
             */
            function handleMousedown(event) {
                isMoving = false;
                clickXy =
                {
                    x: (event as MouseEvent).clientX,
                    y: (event as MouseEvent).clientY,
                }
            }

            /**
             * if clicked on inside of element
             */
            function handleDblClickInside(event) {
                const ref: HTMLElement = buttonRef && buttonRef.current;
                if (ref && (ref === event.target || ref.contains(event.target))) {
                    if (intervalDblClick) {
                        clearInterval(intervalDblClick);
                    }
                    // console.log('onDoubleClick isViewDetail', isViewDetail)
                    !isMoving && isViewDetail && !props.modeView && onDoubleClick()
                    isMoving = false;
                    clickXy = null;
                }
            }

            /**
             * if clicked on inside of element
             */
            function handleClickInside(event) {
                const ref: HTMLElement = buttonRef && buttonRef.current;
                if (ref && (ref === event.target || ref.contains(event.target))) {
                    if (intervalDblClick) {
                        clearInterval(intervalDblClick);
                    }
                    intervalDblClick = setInterval(() => {
                        // console.log('onSingleClick isViewDetail', isViewDetail, !isMoving)
                        clearInterval(intervalDblClick);
                        !isMoving && isViewDetail && !props.modeView && props.showModalSubDetail(schedule.itemId, event.clientX, schedule.itemType)
                        isMoving = false;
                        clickXy = null;
                    }, 250);
                }
            }

            // Bind the event listener
            document.addEventListener("dblclick", handleDblClickInside);
            document.addEventListener("click", handleClickInside);
            document.addEventListener("mousemove", handleMoving);
            document.addEventListener("mousedown", handleMousedown);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("dblclick", handleDblClickInside);
                document.removeEventListener("click", handleClickInside);
                document.removeEventListener("mousemove", handleMoving);
                document.removeEventListener("mousedown", handleMousedown);
            };
        }, [buttonRef]);

        if (!props.modeInHour) {
            return (
                <div className={'' + className} style={styleSchedule} ref={buttonRef}>
                    {renderArrowLeft(schedule)}
                    <div className={`content-schedule  ${(props.showArrow === undefined || props.showArrow) && schedule.isStartPrevious ? 'w-75' : null}`} style={styleContent}>
                        {renderScheduleSignal(schedule)}
                        {renderScheduleTime(schedule)}
                        {renderScheduleIcon(schedule)}
                        {renderTextFullDay(schedule)}
                        {renderScheduleTitle(schedule)}
                    </div>
                    {renderArrowRight(schedule)}
                </div>
            )
        } else {
            return (
                <>
                    <div className={'w100 ' + className} style={{ ...styleSchedule }} ref={buttonRef}>
                        <div 
                        className={'content-schedule flex-column align-items-start'} 
                        style={styleContent}
                        onMouseOver={() => sessionStorage.setItem("dragDrop", "true")}
                        onMouseLeave={() => sessionStorage.setItem("dragDrop", "false")}
                        >
                            <div className="title-content d-flex w100 h-auto">
                                {plan.isViewtitle === ViewPermission.Available}
                                {renderScheduleIcon(schedule)}
                                {plan.isViewtitle === ViewPermission.Available && renderScheduleTitle(schedule)}
                                {plan.isViewtitle !== ViewPermission.Available && renderScheduleTime(schedule)}
                            </div>
                            {plan.isViewtitle === ViewPermission.Available && renderScheduleTime(schedule)}
                        </div>
                    </div>
                </>
            )
        }

    }

    return (
        renderSchedule(props.dataOfSchedule)
    )
}

const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
    idDraggingScheduleInMonth: dataCalendarGrid.idDraggingScheduleInMonth,
    typeShowGrid: dataCalendarGrid.typeShowGrid
});

const mapDispatchToProps = {
    showModalSubDetail,
    showModalDetail,
    hideModalSubDetail,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RenderSchedule);