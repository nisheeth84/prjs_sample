import React, { useEffect } from 'react';
import { DragSourceMonitor, ConnectDragSource, DragSource, DragSourceConnector } from "react-dnd";
import { ConnectDragPreview } from "react-dnd";
import { DND_BUSINESS_CARD_LIST_TYPE } from "../constants";
import { DND_ITEM_TYPE } from "app/shared/layout/dynamic-form/constants";
import { getEmptyImage } from 'react-dnd-html5-backend';

export interface IBusinessCardViewItemProps {
  sourceBusinessCardItem: any
  keydownHandler: (event, id, idx) => void,
  widthItem: any,
  heightItem: any,
  list: any,
  onDragRow: (sourceRow, targetDepartment) => void; // callback when user drag row
  connectDragSource: ConnectDragSource;
  connectDragPreview: ConnectDragPreview;
  isDragging
}


const BusinessCardViewItem: React.FC<IBusinessCardViewItemProps> = (props) => {

  useEffect(() => {
    props.connectDragPreview(getEmptyImage(), { captureDraggingState: false });
  }, []);

  return props.connectDragSource(
    <img className="w-100 h-100" onClick={() => { props.keydownHandler(event, props.sourceBusinessCardItem.business_card_id, props.sourceBusinessCardItem.idx) }}
      src={props.sourceBusinessCardItem.business_card_image_path
        ? props.sourceBusinessCardItem.business_card_image_path
        : '../../../content/images/noimage.png'} />
  );
};

const dragSourceHOC = DragSource(
  DND_ITEM_TYPE.DYNAMIC_LIST_ROW,
  {
    beginDrag(props: IBusinessCardViewItemProps) {
      return { type: DND_BUSINESS_CARD_LIST_TYPE.CARD, sourceBusinessCardList: props.sourceBusinessCardItem };
    },
    endDrag(props: IBusinessCardViewItemProps, monitor: DragSourceMonitor) {
      const dropResult = monitor.getDropResult();
      if (!dropResult) return;
      const item = monitor.getItem();
      props.onDragRow([item.sourceBusinessCardList], dropResult.targetBusinessCardList);
    }
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview()
  })
);


export default dragSourceHOC(BusinessCardViewItem);
