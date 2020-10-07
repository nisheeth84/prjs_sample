import React from 'react';
import { useDragLayer, XYCoord } from 'react-dnd';
import _ from 'lodash';

function getItemStyles(initialOffset: XYCoord | null, currentOffset: XYCoord | null, width: number, height: number) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    // minWidth: '250px',
    transform,
    WebkitTransform: transform,
    backgroundColor: 'white',
    border: '1px solid #e5e5e5',
    borderRadius: '10px',
    boxShadow: '0px 5px 15px 0px #b0afaf',
    width: `${width}px`,
    height: `${height}px`
  };
}

export interface IColumnDragLayerProps {
  tableHeight?: number;
}

const ColumnDragLayer: React.FC<IColumnDragLayerProps> = props => {
  const { isDragging, initialOffset, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  const renderPreview = () => {
    const width = 100;
    const title = '';

    return <div style={getItemStyles(initialOffset, currentOffset, width, props.tableHeight)}>{title}</div>;
  };

  if (!isDragging) {
    return null;
  }

  return <div className="column-drag-layer">{renderPreview()}</div>;
};

export default ColumnDragLayer;
