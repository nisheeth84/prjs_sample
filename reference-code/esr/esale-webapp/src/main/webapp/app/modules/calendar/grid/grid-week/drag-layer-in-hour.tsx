import React from 'react'

import { DataOfSchedule, DataOfResource } from '../common'
import { ItemTypeDrag, LocalNavigation } from '../../constants';
import { useDragLayer } from "react-dnd";
import RenderMilestone from '../item/render-milestone';
import RenderSchedule from '../item/render-schedule';
import RenderTask from '../item/render-task';
import { RenderResource } from '../item/render-resource';
import { DrapDropInHour, GridDrapDropInHourType } from '../grid-drap-drop/grid-drap-drop-in-hour';


type IDragLayerInHourProps = {
    modeView: boolean,
    localNavigation: LocalNavigation
}

/**
 * Draw preview schedule while dragging
 * @param props 
 */
const DragLayerInHour = (props: IDragLayerInHourProps) => {
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

    if (!DrapDropInHour.isDragging() || !isDragging || !clientOffset) {
        return null;
    }
    const bounding: GridDrapDropInHourType = DrapDropInHour.getBoundingPreview();
    if (!bounding) return null;
    const schedule: DataOfSchedule | DataOfResource = bounding.itemDrag;
    // console.log(schedule.startDateMoment.format('YYYY/MM/DD HH:mm'))

    const renderObject = () => {
        if (itemType === ItemTypeDrag.ResourceInHour) {
            return (
                <RenderResource
                    dataOfResource={schedule}
                    prefixKey={'item-resource'}
                    isShowStart={true}
                    isShowEnd={true}
                    formatStart={'HH:mm'}
                    formatEnd={'HH:mm'}

                    width={bounding.width + 'px'}
                    height={bounding.height + 'px'}
                    modeView={props.modeView}
                />
            );
        }
        if (itemType === ItemTypeDrag.MilestoneInHour) {
            return (
                <RenderMilestone
                    dataOfSchedule={schedule}
                    prefixKey={'item-Milestone'}
                    localNavigation={props.localNavigation}

                    width={bounding.width + 'px'}
                    height={bounding.height + 'px'}
                    modeView={props.modeView}
                />
            );
        }
        if (itemType === ItemTypeDrag.TaskInHour) {
            return (
                <RenderTask
                    dataOfSchedule={schedule}
                    prefixKey={'item-Task'}
                    localNavigation={props.localNavigation}

                    width={bounding.width + 'px'}
                    height={bounding.height + 'px'}
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

                width={bounding.width + 'px'}
                height={bounding.height + 'px'}

                modeInHour={true}
                modeView={props.modeView}
            />
        );
    }
    return (
        <div style={{
            left: bounding.x + 'px',
            top: bounding.y + 'px',
            width: bounding.width + 'px',
            height: bounding.height + 'px',
        }} className="drag-layer-month-hour">
            {renderObject()}
        </div>
    );
}


export default DragLayerInHour;
