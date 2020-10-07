import React from 'react'

import { DataOfSchedule, DataOfResource } from '../common'
import { ItemTypeDrag, LocalNavigation, HIGHT_OF_SCHEDULE } from '../../constants';
import { useDragLayer } from "react-dnd";
import RenderMilestone from '../item/render-milestone';
import RenderSchedule from '../item/render-schedule';
import RenderTask from '../item/render-task';
import { RenderResource } from '../item/render-resource';
import { DrapDropInMonth, GridDrapDropType } from '../grid-drap-drop/grid-drap-drop-month';


type IDragLayerMonthProps = {
    modeView: boolean,
    localNavigation: LocalNavigation
    indexWeek: number,
    hightOfDivDate: number,
    modeWeek?: boolean
}

/**
 * Draw preview schedule while dragging
 * @param props 
 */
const DragLayerMonth = (props: IDragLayerMonthProps) => {
    const {
        itemType,
        isDragging,
        clientOffset
    } = useDragLayer(monitor => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        isDragging: monitor.isDragging(),
        clientOffset: monitor.getClientOffset()
    }));

    if (!DrapDropInMonth.isDragging() || !isDragging || !clientOffset) {
        return null;
    }
    const bounding: GridDrapDropType = DrapDropInMonth.getBoundingPreview(props.indexWeek);
    if (!bounding) return null;
    const schedule: DataOfSchedule | DataOfResource = bounding.itemDrag;

    const renderObject = () => {
        if (itemType === ItemTypeDrag.ResourceFullDay) {
            return (
                <RenderResource
                    dataOfResource={schedule}
                    prefixKey={'item-resource'}
                    isShowStart={true}
                    isShowEnd={true}
                    formatStart={'HH:mm'}
                    formatEnd={'HH:mm'}
                    width={bounding.width + 'px'}
                    modeView={props.modeView}
                />
            )
        }
        if (itemType === ItemTypeDrag.MilestoneFullDay) {
            return (
                <RenderMilestone
                    dataOfSchedule={schedule}
                    prefixKey={'item-Milestone'}
                    localNavigation={props.localNavigation}
                    width={bounding.width + 'px'}
                    modeView={props.modeView}
                />
            );
        }
        if (itemType === ItemTypeDrag.TaskFullDay) {
            return (
                <RenderTask
                    dataOfSchedule={schedule}
                    prefixKey={'item-Task'}
                    localNavigation={props.localNavigation}
                    width={bounding.width + 'px'}
                    modeView={props.modeView}
                />
            );
        }
        return (
            <RenderSchedule
                dataOfSchedule={schedule}
                prefixKey={'item-schedule'}
                localNavigation={props.localNavigation}

                formatNormalStart={'HH:mm'}
                formatNormalEnd={'HH:mm'}

                formatFullDayStart={'HH:mm'}
                formatFullDayEnd={'HH:mm'}

                formatOverDayStart={'HH:mm'}
                formatOverDayEnd={'HH:mm'}
                width={bounding.width + 'px'}
                modeView={props.modeView}
            />
        );
    }
    return (
        <div style={{
            left: bounding.x + 'px',
            top: (bounding.y + props.hightOfDivDate) + (-HIGHT_OF_SCHEDULE/4) + 'px',
            width: bounding.width + 'px',
            height: HIGHT_OF_SCHEDULE + 'px'
        }} className="drag-layer-month-hour">
            {renderObject()}
        </div>
    );
}


export default DragLayerMonth;
