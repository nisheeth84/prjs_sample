import React from 'react'
import { DragSourceMonitor, ConnectDragSource, useDrag } from 'react-dnd'
import { FIELD_ITEM_TYPE_DND } from '../../constants'

export interface IDynamicFieldDropableProps {
    fieldInfo: any
    onItemClick: (item) => void
}

const DynamicFieldDropable: React.FC<IDynamicFieldDropableProps> = (props) => {

    const [, connectDragSource] = useDrag(
        {
            item: { type: FIELD_ITEM_TYPE_DND.ADD_FIELD, value: { ... props.fieldInfo } },
            collect: (monitor: DragSourceMonitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }
    );

    return connectDragSource(
        <div onClick={item => props.onItemClick(props.fieldInfo)}>
            <label className="icon-check">
                <span>{props.fieldInfo.fieldLabel}</span>
            </label>
        </div>
    )
}

export default DynamicFieldDropable;
