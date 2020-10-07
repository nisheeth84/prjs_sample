import React, { useEffect } from 'react';
import { useDragLayer } from 'react-dnd';

function getItemStyles(initialOffset, currentOffset, tableWidth) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }
  const { x, y } = currentOffset;
  const paddingLeft = 30;

  // const transform = `translate(${100}px, ${100}px)`;
  const transform = `translate(${x - paddingLeft}px, ${y}px)`;

  return {
    width: tableWidth,
    transform,
    WebkitTransform: transform,
    paddingLeft
  };
}
export const CustomDragLayer = props => {
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));
  function renderItem() {
    return <img src={item.icon} className="icon-drag" />;
  }
  if (!isDragging) {
    return null;
  }

  return (
    <div className="setting-layer-style">
      <div   style={getItemStyles(initialOffset, currentOffset, props.tableWidth - 5)}>
        {renderItem()}
      </div>
    </div>
  );
};
