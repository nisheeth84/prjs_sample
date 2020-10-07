
import React, { useEffect } from 'react';
import { DragSourceMonitor, ConnectDragSource, ConnectDragPreview } from 'react-dnd';
import { DragSource, DragSourceConnector } from 'react-dnd';
import { FIELD_ITEM_TYPE_DND } from '../constants';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { getIconSrc } from 'app/config/icon-loader';
import _ from 'lodash';

export interface IPopupFieldCardProps {
  fieldInfo: any;
  fieldBelong: number;
  text: string;
  isChecked: boolean;
  isDnDWithBelong?: boolean;
  onSelectField: (field, isChecked: boolean) => void;
  onDragDropField: (srcField, targetField) => void;
  // Collected Props
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
  connectDragPreview: ConnectDragPreview;
  iconSrc?: string;
  numberFieldCheck?: number,
}

const PopupFieldCard: React.FC<IPopupFieldCardProps> = props => {

  const onFieldSelected = (field, event) => {
    props.onSelectField(field, event.target.checked);
  };

  useEffect(() => {
    props.connectDragPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const baseUrl = window.location.origin.toString();
  const opacity = props.isDragging ? 0 : 1;
  return props.connectDragSource(
    <label className="icon-check" id={props.fieldInfo.fieldId} style={{ opacity }}>
      <input className="hidden" type="checkbox" checked={props.isChecked} onChange={event => onFieldSelected(props.fieldInfo, event)} />
      <i></i>
      <span>
        <img src={props.iconSrc ? baseUrl + props.iconSrc : baseUrl + getIconSrc(props.fieldBelong)} alt="" title="" />
        {props.text}
      </span>
    </label>
  );
};

const isSameFieldBelong = (field, fieldBelong: number) => {
  if (_.get(field, 'fieldBelong') === fieldBelong || _.get(field, 'fieldRelation.fieldBelong') === fieldBelong) {
    return true
  }
  return false;
}

export default DragSource(
  FIELD_ITEM_TYPE_DND.ADD_CARD,
  {
    beginDrag: (props: IPopupFieldCardProps) => ({ type: FIELD_ITEM_TYPE_DND.ADD_CARD, fieldInfo: props.fieldInfo, ...props }),
    endDrag(props: IPopupFieldCardProps, monitor: DragSourceMonitor) {
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        let fBelong = props.fieldBelong;
        if (_.get(props, 'fieldInfo.relationFieldId') > 0) {
          fBelong = _.get(props, 'fieldInfo.fieldRelation.fieldBelong');
        }
        if (props.isDnDWithBelong && !isSameFieldBelong(dropResult.fieldInfo, fBelong)) {
          return;
        }
        props.onDragDropField(item.fieldInfo, dropResult.fieldInfo);
      }
    }
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  })
)(PopupFieldCard);
