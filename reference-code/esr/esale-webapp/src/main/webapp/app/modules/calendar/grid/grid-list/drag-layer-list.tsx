import React from 'react'

import { DataOfSchedule, DataOfResource, CalenderViewMonthCommon } from '../common'
import { ItemTypeDrag, LocalNavigation } from '../../constants';
import { useDragLayer } from "react-dnd";
import RenderMilestone from '../item/render-milestone';
import RenderSchedule from '../item/render-schedule';
import RenderTask from '../item/render-task';
import { RenderResource } from '../item/render-resource';


type IDragLayerListProps = {
    modeView: boolean,
    localNavigation: LocalNavigation,
    rootRef: any
}

/**
 * Draw preview schedule while dragging
 * @param props 
 */
const DragLayerList = (props: IDragLayerListProps) => {
    const {
        item,
        itemType,
        isDragging,
        initialSourceClientOffset,
        clientOffset,
    } = useDragLayer(monitor => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        isDragging: monitor.isDragging(),
        initialSourceClientOffset: monitor.getInitialSourceClientOffset(),
        clientOffset: monitor.getClientOffset(),
    }));

    if (!isDragging || !props.rootRef) {
        return null;
    }

    const schedule: DataOfSchedule | DataOfResource = item['data'];
    if (!schedule) return null;

    const renderObject = () => {
        if (itemType === ItemTypeDrag.ResourceFullDay) {
            const sFormatStart = schedule.isOverDay ? 'YYYY/MM/DD HH:mm' : 'HH:mm';
            return (
                <RenderResource
                    prefixKey={'_' + 'item-Resource-view-more'}
                    dataOfResource={schedule}
                    className={'calendar-schedule calendar-schedule-in-list-view-more'}
                    isShowStart={true}
                    isShowEnd={true}
                    formatStart={sFormatStart}
                    formatEnd={sFormatStart}
                    modeView={props.modeView}
                />
            );
        }
        if (itemType === ItemTypeDrag.MilestoneFullDay) {
            return (
                <RenderMilestone
                    prefixKey={'item-milestone-view-more'}
                    dataOfSchedule={schedule}
                    localNavigation={props.localNavigation}
                    className={'calendar-schedule calendar-schedule-in-list-view-more'}
                    modeView={props.modeView}
                />
            );
        }
        if (itemType === ItemTypeDrag.TaskFullDay) {
            return (
                <RenderTask
                    prefixKey={'item-task-view-more'}
                    dataOfSchedule={schedule}
                    localNavigation={props.localNavigation}
                    className={'calendar-schedule calendar-schedule-in-list-view-more'}
                    modeView={props.modeView}
                />
            );
        }

        let formatOverDayStart='YYYY/MM/DD HH:mm';
        let formatOverDayEnd='YYYY/MM/DD HH:mm';
        if (schedule.isOverDay && CalenderViewMonthCommon.compareDateByDay(schedule.startDateSortMoment, schedule.startDateMoment) === 0) {
            formatOverDayStart='HH:mm';
        }
        if (schedule.isOverDay && CalenderViewMonthCommon.compareDateByDay(schedule.startDateSortMoment, schedule.finishDateMoment) === 0) {
            formatOverDayEnd='HH:mm';
        }
        return (
            <RenderSchedule
                prefixKey={'item-schedule-view-more'}
                dataOfSchedule={schedule}
                localNavigation={props.localNavigation}
                className={'calendar-schedule calendar-schedule-in-list-view-more'}
                formatNormalStart={'HH:mm'}
                formatNormalEnd={'HH:mm'}
                formatOverDayStart={formatOverDayStart}
                formatOverDayEnd={formatOverDayEnd}
                modeView={props.modeView}
            />
        );
    }
    
    const rootBounding = props.rootRef.current.getBoundingClientRect();
    let display = null;
    if (!initialSourceClientOffset || !clientOffset) {
        display = 'none'
    }

    return (
        <div style={{
            display,
            left: initialSourceClientOffset ? (initialSourceClientOffset.x - rootBounding.x) + 'px' : '0px',
            top: clientOffset? (clientOffset.y - rootBounding.y) + 'px' : '0px',
            // width: bounding.width + 'px',
            // height: bounding.height + 'px',
        }} className="drag-layer-list">
            {renderObject()}
        </div>
    );
}


export default DragLayerList;
