import React from 'react'
import { ConnectDragSource, DragSource, DragSourceMonitor, DragSourceConnector } from 'react-dnd'

interface ISourceBoxRaw {
    connectDragSource?: ConnectDragSource,
    children: any,
    styleChild?: any
    obj: any
}

const SourceBoxRaw = (props: ISourceBoxRaw) => {
    return props.connectDragSource(
        <div className="w100">
            {props.children}
        </div>
    )
}

const SourceBox = DragSource(
    (props: ISourceBoxRaw) => 'item',
    {
        canDrag: (props: ISourceBoxRaw) => true,
        beginDrag: (props: ISourceBoxRaw) => props.obj,
    },
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }),
)(SourceBoxRaw)

export default SourceBox;