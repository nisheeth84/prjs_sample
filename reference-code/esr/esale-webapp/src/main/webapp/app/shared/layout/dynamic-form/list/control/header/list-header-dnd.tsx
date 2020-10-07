import React, { useEffect } from 'react';
import {
  DragSource,
  ConnectDragSource,
  ConnectDropTarget,
  DragSourceConnector,
  DragSourceMonitor,
  DropTargetMonitor,
  DropTarget,
  ConnectDragPreview
} from 'react-dnd';
import { DND_ITEM_TYPE, ITEM_TYPE } from '../../../constants';
import { getEmptyImage } from 'react-dnd-html5-backend';
import _ from 'lodash';

export interface IListHeaderDnDProp {
  mode: any;
  fieldInfo: any; // field info in database get from api
  titleColumn?: string;
  disableEditHeader?: boolean; // can edit header? (resize or move order)
  onDragDropColumnField?: (dragField, dropField) => void; // callback when user drag n drop column
  onDnDingColumn?: (dnd: { field: any; dragging: boolean; canDrop: boolean; over: boolean }) => void;
  isDragging?: boolean; // for drag & drop, user don't need pass compoment
  canDrop?: boolean; // for drag & drop, user don't need pass compoment
  isOver?: boolean; // for drag & drop, user don't need pass compoment
  connectDragSource?: ConnectDragSource; // for drag & drop, user don't need pass compoment
  connectDropTarget?: ConnectDropTarget; // for drag & drop, user don't need pass compoment
  connectDragPreview?: ConnectDragPreview;
}

const ListHeaderDnD: React.FC<IListHeaderDnDProp> = props => {
  const { connectDragSource, connectDropTarget } = props;

  useEffect(() => {
    props.connectDragPreview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  useEffect(() => {

    if (props.onDnDingColumn) {
      const dnd = {
        field: _.isArray(props.fieldInfo) ? props.fieldInfo[0] : props.fieldInfo,
        dragging: props.isDragging,
        canDrop: props.canDrop,
        over: props.isOver
      };
      props.onDnDingColumn(dnd);
    }
  }, [props.canDrop, props.isOver, props.isDragging]);

  if (props.disableEditHeader) {
    return <div>{props.children}</div>;
  }

  return connectDragSource(connectDropTarget(<div>{props.children}</div>));
};

const dragSourceHOC = DragSource(

  DND_ITEM_TYPE.DYNAMIC_LIST_COLUMN,
  {
    beginDrag: (props: IListHeaderDnDProp) => ({ type: DND_ITEM_TYPE.DYNAMIC_LIST_COLUMN, sourceField: props.fieldInfo, titleColumn: props.titleColumn }),
    endDrag(props: IListHeaderDnDProp, monitor: DragSourceMonitor) {
      const dropResult = monitor.getDropResult();
      if (dropResult && props.onDragDropColumnField) {
        props.onDragDropColumnField(props.fieldInfo, dropResult.target);
      }
    }
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview()
  })
);

const dropTargetHOC = DropTarget(
  [DND_ITEM_TYPE.DYNAMIC_LIST_COLUMN, ITEM_TYPE.CARD],
  {
    drop: ({ fieldInfo }: IListHeaderDnDProp) => ({
      target: fieldInfo
    }),
    hover(props: IListHeaderDnDProp, monitor: DropTargetMonitor, component: any) { }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
);

export default dropTargetHOC(dragSourceHOC(ListHeaderDnD));
