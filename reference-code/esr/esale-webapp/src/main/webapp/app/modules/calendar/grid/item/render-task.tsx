
import React, { useState, useRef, useEffect } from 'react'
import { DataOfSchedule } from '../common'
import { LocalNavigation, ItemTypeSchedule } from '../../constants';
import { ItemCalendar, TaskStatus, ColorType, ColorValue } from './item-calendar'
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { showModalSubDetail, hideModalSubDetail,setItemId } from '../../modal/calendar-modal.reducer'
import DetailTaskModal from '../../../tasks/detail/detail-task-modal';
import useDoubleClick from 'use-double-click';
import handleReloadData from '../calendar-grid.reducer'
import { XYCoord } from 'react-dnd';

interface IRenderTask extends StateProps, DispatchProps {
    modeView: boolean,
    dataOfSchedule?: DataOfSchedule,
    localNavigation?: LocalNavigation,
    className?: string,
    prefixKey: string,

    top?: string,
    left?: string,
    width?: string,
    height?: string,
    showArrow?: boolean,
}

const RenderTask = (props: IRenderTask) => {
    const [showModalTaskDetail, setShowModalTaskDetail] = useState(false);

    let className = props.className || 'calendar-schedule border-solid ';

    if ((props.showArrow === undefined || props.showArrow) && (props.dataOfSchedule.isStartPrevious)) {
        className += ' has-arrow-left ';
    }
    if ((props.showArrow === undefined || props.showArrow) && (props.dataOfSchedule.isEndNext)) {
        className += ' has-arrow-right ';
    }

    if (props.dataOfSchedule.taskStatus === TaskStatus.completed) {
        className += ' task-completed '
    } else if (props.dataOfSchedule.taskStatus === TaskStatus.overdue) {
        className += ' task-overdue '
    } else {
        className += ' task-nomal '
    }

    let bgColor = null;
    const borderColor = ItemCalendar.getColor(ColorType.Auto, props.dataOfSchedule, props.localNavigation);
    if (props.dataOfSchedule.isReportActivity) {
        bgColor = ColorValue.Grey;
        className += ' report-activity '
    } else {
        bgColor = ItemCalendar.getColor(ColorType.Auto, props.dataOfSchedule, props.localNavigation);
    }

    const renderArrowLeft = (schedule: DataOfSchedule) => {
        if ((props.showArrow === undefined || props.showArrow) && schedule.isStartPrevious) {
            const styleBorder = {
                background: bgColor,
                borderLeftColor: borderColor,
                borderBottomColor: borderColor,
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
            const styleBorder = {
                background: bgColor,
                borderRightColor: borderColor,
                borderTopColor: borderColor,
            };
            return (
                <div className={'box-conner'}>
                    <span className="arrow-right" style={styleBorder}></span>
                </div>
            )
        }
    }

    const renderTaskIcon = (schedule: DataOfSchedule) => {
        const taskNormalIcon = "/content/images/calendar/ic-calendar-tv.svg";
        const taskCompletedIcon = "/content/images/calendar/ic-calendar-tv-check.svg";
        const taskDeleteIcon = "/content/images/calendar/ic-calendar-tv-delete.svg";
        let src = taskNormalIcon;
        if (schedule.taskStatus === TaskStatus.completed) {
            src = taskCompletedIcon;
        }
        if (schedule.taskStatus === TaskStatus.overdue) {
            src = taskDeleteIcon;
        }

        return (
            <img className="images-left" src={src}></img>
        )
    }

    const renderTaskTitle = (schedule: DataOfSchedule) => {
        if (ItemCalendar.isViewDetailTask(schedule)) {
            const styleTitle = { color: null, zIndex: 2 };
            styleTitle.color = ItemCalendar.getColor(ColorType.Black, schedule, props.localNavigation);
            return (
                <label className={`title text-ellipsis ` + `${schedule.taskStatus === TaskStatus.overdue && "text-red "}`} style={styleTitle} title={schedule.itemName}>{schedule.itemName}</label>
            )
        }
    }

    /**
     * show or close modal task detail
     */
    const handleToggleModalTaskDetail = () => {
        const flag = !showModalTaskDetail;
        setShowModalTaskDetail(flag);
        props.handleReloadData(null, props.dataOfSchedule)
    }

    /**
     * check render modal task detail
     */
    const renderModalTaskDetail = (item) => {
        if (!props.modeView && showModalTaskDetail) {
            // return <></>
            return <DetailTaskModal taskId={item.itemId}
                toggleCloseModalTaskDetail={handleToggleModalTaskDetail} />
        }
    }

    const renderTask = (schedule: DataOfSchedule) => {
        const styleSchedule = {
            top: props.top || null,
            left: props.left || null,
            width: props.width || (ItemCalendar.getWidthOfObject(schedule) + '%'),
            height: props.height,
            zIndex: 1
        };
        const styleContent = {
            background: bgColor,
            borderColor
        };

        // const borderStyle = ItemCalendar.buildBorderStyle(BoderType.Solid, ColorType.Auto, schedule, props.localNavigation);
        // styleContent = { ...styleContent, ...borderStyle }
        const buttonRef = useRef();

        const onDoubleClick = () => {
            // setShowModalTaskDetail(true);
            // props.hideModalSubDetail()
            props.setItemId(props.dataOfSchedule.itemId, ItemTypeSchedule.Task)
        }
        const isViewDetail: boolean = ItemCalendar.isViewDetailTask(props.dataOfSchedule);

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

        return (
            <>
                <div className={className} style={styleSchedule} ref={buttonRef}>
                    {renderArrowLeft(schedule)}
                    <div className={'content-schedule'} style={styleContent}>
                        {renderTaskIcon(schedule)}&nbsp;
                        {renderTaskTitle(schedule)}
                    </div>
                    {renderArrowRight(schedule)}
                </div>

                {renderModalTaskDetail(schedule)}
            </>
        )
    }

    return (
        renderTask(props.dataOfSchedule)
    )
}


const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
    idDraggingScheduleInMonth: dataCalendarGrid.idDraggingScheduleInMonth
});

const mapDispatchToProps = {
    showModalSubDetail,
    hideModalSubDetail,
    handleReloadData,
    setItemId
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RenderTask);
