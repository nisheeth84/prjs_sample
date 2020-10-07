import React, { useEffect } from 'react'
import { DragSourceMonitor, ConnectDragSource, ConnectDragPreview } from 'react-dnd'
import { DragSource, DragSourceConnector } from 'react-dnd'
import { ITEM_TYPE } from '../constants';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { getIconSrc } from 'app/config/icon-loader';

export interface IFieldCardProps {
  sourceField: any
  text: string
  isChecked: boolean
  toggleChooseField: (event, field) => void
  dragField: (srcField, targetFieldId) => void
  // Collected Props
  isDragging: boolean
  connectDragSource: ConnectDragSource,
  connectDragPreview: ConnectDragPreview; // for drag & drop, user don't need pass component'
  fieldBelong?: any
}

const FieldCard: React.FC<IFieldCardProps> = ({ sourceField, text, isChecked, toggleChooseField, isDragging, connectDragSource, fieldBelong, connectDragPreview }) => {

  useEffect(() => {
    connectDragPreview(getEmptyImage(), { captureDraggingState: false });
  }, []);
  
  const onFieldSelected = (event, fieldId) => {
    toggleChooseField(fieldId, event.target.checked);
  }

  return connectDragSource(
    <p className="check-box-item">
      <label className="icon-check">
        <input type="checkbox" checked={isChecked} onChange={(event) => onFieldSelected(event, sourceField)} />
        <i></i><img src={getIconSrc(fieldBelong)} />
        {text}
      </label>
    </p>
  )
}

export default DragSource(
  ITEM_TYPE.CARD,
  {
    beginDrag: (props: IFieldCardProps) => ({ sourceField: props.sourceField }),
    endDrag(props: IFieldCardProps, monitor: DragSourceMonitor) {
      const item = monitor.getItem()
      const dropResult = monitor.getDropResult()
      if (dropResult) {
        props.dragField(item.sourceField, dropResult.target);
      }
    },
    canDrag(props: IFieldCardProps, monitor: DragSourceMonitor) {
      if (props.isChecked) {
        return false;
      }
      return true;
    }
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview()
  }),
)(FieldCard)
