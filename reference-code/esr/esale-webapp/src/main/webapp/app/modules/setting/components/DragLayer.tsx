import React, { useEffect } from 'react';
import { useDragLayer } from 'react-dnd';

interface IProps {
  width?: number;
  height?:number;
  borderRadius?:number
}

export const DragLayer: React.FC<IProps> = ({ width, height, borderRadius }) => {
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  function getItemStyles() {
    console.log({initialOffset, currentOffset, height})
    if (!initialOffset || !currentOffset) {
      return {
        display: 'none'
      };
    }
    const { x, y } = currentOffset;
    console.log({ currentOffset })

    const transform = `translate(${x - 140}px, ${y}px)`;

    return {
      width,
      ...height && {height} ,
      ...borderRadius && {borderRadius} ,
      transform,
      WebkitTransform: transform,
      paddingLeft: 20,
      
      // left:x -200 ,
      // top:y
    };
  }
  function renderItem() {
    if (item.icon) {
      return <img src={item.icon} className="icon-drag" />;
    }
    if (item.text) {
      return <span>{item.text}</span>;
    }
  }
  if (!isDragging) {
    return null;
  }

  return (
    <div className="setting-layer-style">
      <div style={getItemStyles()}>{renderItem()}</div>
    </div>
  );
};
