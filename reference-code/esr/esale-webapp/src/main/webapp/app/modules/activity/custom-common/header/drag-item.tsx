import React, { useState, useEffect } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { FIELD_ITEM_TYPE_DND } from 'app/shared/layout/dynamic-form/constants';

export interface IDragItem {
  className?: string;
  accept?: string[];
  item: any;
}

const DragItem: React.FC<IDragItem> = props => {
  const [style, setStyle] = useState({ cursor: 'pointer', border: '' });
  const [{ isDragging }, connectDragSource] = useDrag({
    begin: (dragSource: DragSourceMonitor) => dragSource.getItem(),
    item: { type: FIELD_ITEM_TYPE_DND.ADD_CARD, value: { ...props.item } },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const startDrag = () => {
    setStyle({ ...style, border: '1px dashed #01a0f4' });
  };

  const stopDrag = () => {
    setStyle({ ...style, border: '' });
  };

  useEffect(() => {
    if (isDragging) {
      startDrag();
    } else {
      stopDrag();
    }
  }, [isDragging]);

  return connectDragSource(
    <div
      className={props.className}
      style={style}
    >
      {props.children}
    </div>
  );
};

export default DragItem;
