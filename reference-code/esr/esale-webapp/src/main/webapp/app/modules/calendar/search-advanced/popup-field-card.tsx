import React, { useEffect } from 'react'
import { DragSourceMonitor, ConnectDragSource, ConnectDragPreview } from 'react-dnd'
import { DragSource, DragSourceConnector } from 'react-dnd'
import { FIELD_ITEM_TYPE_DND } from 'app/shared/layout/dynamic-form/constants'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { FIELD_BELONG } from "app/modules/calendar/search-advanced/popup-fields-search.reducer";

export interface IPopupFieldCardProps {
  fieldInfo: any
  text: string
  isChecked: boolean
  onSelectField: (field, isChecked: boolean, type) => void
  onDragDropField: (srcField, targetFieldId) => void
  // Collected Props
  isDragging: boolean
  connectDragSource: ConnectDragSource,
  connectDragPreview: ConnectDragPreview,
}

const PopupFieldCard: React.FC<IPopupFieldCardProps> = (props) => {
  const baseUrl = window.location.origin.toString();

  const setIcon = () => {
    let icon;

    switch (props.fieldInfo.fieldBelong) {
      case FIELD_BELONG.TASK:
        icon = baseUrl + "/content/images/calendar/ic-calendar-tv.svg"
        break
      case FIELD_BELONG.MILESTONE:
        icon = baseUrl + "/content/images/task/ic-flag-brown.svg"
        break;
      case FIELD_BELONG.SCHEDULE:
        icon = baseUrl + "/content/images/ic-sidebar-calendar.svg"
        break
      default:
        icon = ''
        break
    }
    return icon;
  }

  const onFieldSelected = (field, event, type) => {
    props.onSelectField(field, event.target.checked, type);
  }

  useEffect(() => {
    props.connectDragPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const opacity = props.isDragging ? 0 : 1
  return props.connectDragSource(
    <label className="icon-check" id={props.fieldInfo.fieldId} style={{ opacity }}>
      {props.isChecked &&
        <input className="hidden" type="checkbox" defaultChecked={true} onChange={(event) => onFieldSelected(props.fieldInfo, event, props.fieldInfo.fieldBelong)} />}
      {!props.isChecked &&
        <input className="hidden" type="checkbox" onChange={(event) => onFieldSelected(props.fieldInfo, event, props.fieldInfo.fieldBelong)} />}
      <i></i><span><img src={setIcon()} alt="" title="" />{props.text}</span>
    </label>
  )
}

export default DragSource(
  FIELD_ITEM_TYPE_DND.ADD_CARD,
  {
    beginDrag: (props: IPopupFieldCardProps) => ({ type: FIELD_ITEM_TYPE_DND.ADD_CARD, fieldInfo: props.fieldInfo, ...props }),
    endDrag(props: IPopupFieldCardProps, monitor: DragSourceMonitor) {
      const item = monitor.getItem()
      const dropResult = monitor.getDropResult()
      if (dropResult) {
        props.onDragDropField(item.fieldInfo, dropResult.targetId);
      }
    },
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(PopupFieldCard)
