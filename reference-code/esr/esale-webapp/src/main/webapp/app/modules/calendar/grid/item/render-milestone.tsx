
import React, { useRef, useState, useEffect } from 'react'
import { DataOfSchedule } from '../common'
import { LocalNavigation, ItemTypeSchedule } from '../../constants';
import { ItemCalendar, TaskMilestone, ColorType } from './item-calendar'
import useDoubleClick from 'use-double-click'
import DetailMilestoneModal from '../../../tasks/milestone/detail/detail-milestone-modal'
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';
import { showModalSubDetail, hideModalSubDetail, setItemId} from '../../modal/calendar-modal.reducer'
import { XYCoord } from 'react-dnd';


interface IRenderMilestone extends StateProps, DispatchProps {
    modeView: boolean,
    dataOfSchedule?: DataOfSchedule,
    localNavigation?: LocalNavigation,
    className?: string,
    prefixKey: string,

    top?: string,
    left?: string,
    width?: string,
    height?: string,

    showArrow?: boolean
}

const RenderMilestone = (props: IRenderMilestone) => {
    let className = props.className || 'calendar-schedule border-solid ';

    if (props.dataOfSchedule.milestoneStatus === TaskMilestone.completed) {
        className += ' milestone-completed '
    } else if (props.dataOfSchedule.milestoneStatus === TaskMilestone.overdue) {
        className += ' milestone-overdue '
    } else {
        className += ' milestone-nomal '
    }

    const background = ItemCalendar.getLinearGradient(ItemCalendar.getAllColorOfEmployees(props.dataOfSchedule, props.localNavigation))
    const renderMilestoneIcon = (schedule: DataOfSchedule) => {
        const MilestoneNormalIcon = "../../content/images/common/calendar/ic-calendar-flag1.svg";
        const MilestoneCompletedIcon = "../../content/images/common/calendar/ic-calendar-flag4.svg";
        const MilestoneDeleteIcon = "../../content/images/common/calendar/ic-calendar-flag2.svg";
        let src = MilestoneNormalIcon;
        if (schedule.milestoneStatus === TaskMilestone.completed) {
            src = MilestoneCompletedIcon;
        }
        if (schedule.milestoneStatus === TaskMilestone.overdue) {
            src = MilestoneDeleteIcon;
        }

        return (
            <img className="images-left" src={src}></img>
        )
    }

    const renderMilestoneTitle = (schedule: DataOfSchedule) => {
        if (ItemCalendar.isViewDetailMilestone(schedule)) {
            const styleTitle = { color: null, zIndex: 2 };
            styleTitle.color = ItemCalendar.getColor(ColorType.Black, schedule, props.localNavigation);
            return (
                <label className={`title text-ellipsis ` + `${schedule.milestoneStatus === TaskMilestone.overdue && "text-red "}`} style={styleTitle} title={schedule.itemName}>{schedule.itemName}</label>
            )
        }
    }


    const renderMilestone = (schedule: DataOfSchedule) => {
        const styleSchedule = {
            top: props.top || null,
            left: props.left || null,
            width: props.width || (ItemCalendar.getWidthOfObject(schedule) + '%'),
            height: props.height,
            zIndex: 1
        };
        const styleContent = {
            background
        };

        const buttonRef = useRef();
        const [showDetail, setShowDetail] = useState(false);

        // const showMileStoneDetail = () => {
        //     setShowDetail(true)
        // }

        const onDoubleClick = () => {
            // props.hideModalSubDetail()
            // showMileStoneDetail()
            props.setItemId(props.dataOfSchedule.itemId, ItemTypeSchedule.Milestone)
        }
        const isViewDetail: boolean = ItemCalendar.isViewDetailMilestone(props.dataOfSchedule);
        
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
                    <div className={'content-schedule'} style={styleContent}>
                        {renderMilestoneIcon(schedule)}&nbsp;
                        {renderMilestoneTitle(schedule)}
                    </div>
                </div>
                {showDetail && <DetailMilestoneModal milesActionType={MILES_ACTION_TYPES.UPDATE} toggleCloseModalMilesDetail={setShowDetail} milestoneId={props.dataOfSchedule.itemId} />}
            </>
        )
    }

    return (
        renderMilestone(props.dataOfSchedule)
    )
}


const mapDispatchToProps = {
    showModalSubDetail,
    hideModalSubDetail,
    setItemId
};

const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
    idDraggingScheduleInMonth: dataCalendarGrid.idDraggingScheduleInMonth
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RenderMilestone);
