import React from 'react'
import { ConnectDropTarget, DropTargetMonitor } from 'react-dnd'
import { DropTarget } from 'react-dnd'

export interface ITargetBoxProps {
  onDrop?: (item: any) => void
  lastDroppedColor?: string

  isOver: boolean
  canDrop: boolean
  draggingColor: string
  children: any
  connectDropTarget: ConnectDropTarget
}
const TargetBoxRaw = (props: ITargetBoxProps) => {
  const opacity = props.isOver ? 0.3 : 1
  return props.connectDropTarget(
    <div style={{opacity}} className="target-box-raw" >
        {props.children}
    </div>,
  )
}

const TargetBox = DropTarget(
  ['item'],
  {
    drop(props: ITargetBoxProps, monitor: DropTargetMonitor) {
      props.onDrop(monitor.getItem())
    },
    
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    draggingColor: monitor.getItemType() as string,
  }),
)(TargetBoxRaw)

export default TargetBox
